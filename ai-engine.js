// ai-engine.js - Handles AI Generation (Gemini, OpenAI, Offline fallback) and Email Delivery

const AiEngine = {
  // Main dispatch function
  async generatePitch({ resumeProfile, jobData, options, settings }) {
    const provider = settings.aiProvider || 'gemini';

    if (provider === 'gemini' && settings.geminiApiKey) {
      return await this.callGemini({ resumeProfile, jobData, options, settings });
    } else if (provider === 'openai' && settings.openaiApiKey) {
      return await this.callOpenAI({ resumeProfile, jobData, options, settings });
    } else {
      // Fallback to Smart Offline Generator if no key provided
      return this.generateOfflineTemplate({ resumeProfile, jobData, options });
    }
  },

  // Google Gemini API caller
  async callGemini({ resumeProfile, jobData, options, settings }) {
    const model = settings.geminiModel || 'gemini-1.5-flash';
    const apiKey = settings.geminiApiKey.trim();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const prompt = this.buildPrompt({ resumeProfile, jobData, options, settings });

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1500,
        responseMimeType: 'application/json'
      }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const msg = errData.error?.message || `Gemini API returned status ${res.status}`;
      throw new Error(msg);
    }

    const json = await res.json();
    const candidateText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('No response returned from Gemini API.');
    }

    return this.parseAiResponse(candidateText, jobData, resumeProfile);
  },

  // OpenAI API caller
  async callOpenAI({ resumeProfile, jobData, options, settings }) {
    const model = settings.openaiModel || 'gpt-4o-mini';
    const apiKey = settings.openaiApiKey.trim();
    const url = 'https://api.openai.com/v1/chat/completions';

    const prompt = this.buildPrompt({ resumeProfile, jobData, options, settings });

    const payload = {
      model: model,
      messages: [
        {
          role: 'system',
          content: 'You are an elite executive career coach and cold outreach specialist. Output only valid JSON with the requested schema.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const msg = errData.error?.message || `OpenAI API returned status ${res.status}`;
      throw new Error(msg);
    }

    const json = await res.json();
    const text = json.choices?.[0]?.message?.content;
    if (!text) {
      throw new Error('No content returned from OpenAI.');
    }

    return this.parseAiResponse(text, jobData, resumeProfile);
  },

  // Prompt Construction
  buildPrompt({ resumeProfile, jobData, options, settings }) {
    const goalDescriptions = {
      cold_outreach: 'A high-converting cold email pitch directly to a recruiter or hiring manager.',
      cover_letter: 'A modern, dynamic cover letter email for an official job application.',
      referral_request: 'A warm, engaging message to an existing company employee requesting an internal referral.',
      application_followup: 'A polite, value-driven follow-up on a previously submitted application.',
      value_pitch: 'A proactive pitch proposing specific solutions/ideas candidate can build for the team.'
    };

    const toneDescriptions = {
      confident: 'Confident, results-driven, highlighting metrics and measurable impact.',
      punchy: 'Extremely direct, punchy, and concise (under 120 words), modern YC founder style.',
      formal: 'Polished, professional, respectful, and articulate.',
      conversational: 'Warm, personable, enthusiastic, and conversational.'
    };

    const goalText = goalDescriptions[options.goal] || goalDescriptions.cold_outreach;
    const toneText = toneDescriptions[options.tone] || toneDescriptions.confident;

    return `You are a world-class cold email copywriter and career strategist.
Your task is to write an irresistible, personalized email from the candidate to the hiring contact based on the candidate's resume and target job description.

=== CANDIDATE PROFILE ===
Name: ${resumeProfile.fullName || 'Candidate'}
Current Role: ${resumeProfile.currentTitle || 'Professional'}
Email: ${resumeProfile.email || ''}
Phone: ${resumeProfile.phone || ''}
Portfolio/Links: ${resumeProfile.portfolio || ''} | ${resumeProfile.linkedin || ''}
Key Skills: ${resumeProfile.skills || 'Not specified'}
Experience Highlight: ${resumeProfile.experience || ''}
Full Resume:
${(resumeProfile.fullResumeText || '').slice(0, 3000)}

=== TARGET OPPORTUNITY ===
Company Name: ${jobData.companyName || 'the company'}
Target Role / Title: ${jobData.jobTitle || 'the open position'}
Recruiter / Contact Name: ${jobData.recruiterName || 'Hiring Team'}
Job Description:
${(jobData.jobDescription || '').slice(0, 3500)}

=== SPECIFIC REQUIREMENTS ===
1. Outreach Goal: ${goalText}
2. Tone: ${toneText}
3. Custom User Guidance: ${settings.customPrompt || 'None'}
4. Include top 2-3 overlapping skills/achievements from candidate resume directly tailored to the JD.
5. Provide a strong, natural Call-To-Action (e.g. "Do you have 10 minutes this Thursday or Friday for a quick chat?").
6. Provide a clean, natural sign-off with candidate name and contact links.

OUTPUT REQUIREMENT:
You MUST respond with a single valid JSON object strictly matching this schema:
{
  "subjectLine": "Short, high open-rate subject line (under 9 words)",
  "alternativeSubjects": [
    "Alternative subject line 1",
    "Alternative subject line 2"
  ],
  "emailBody": "Complete email body including greeting, body paragraphs, and sign-off. Use clean line breaks (\\n\\n). Do NOT use generic placeholders like [Your Name] — use actual candidate details provided.",
  "matchScore": 88,
  "matchingStrengths": [
    "Direct synergy point 1",
    "Direct synergy point 2",
    "Direct synergy point 3"
  ],
  "strategyTip": "1 concise strategic tip for sending this email (e.g. best time to send or follow-up note)"
}`;
  },

  // Parse and validate AI JSON response
  parseAiResponse(rawText, jobData, resumeProfile) {
    let clean = rawText.trim();
    // Strip markdown code fences if present
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    try {
      const parsed = JSON.parse(clean);
      return {
        subjectLine: parsed.subjectLine || `Application for ${jobData.jobTitle || 'Role'} - ${resumeProfile.fullName || ''}`,
        alternativeSubjects: parsed.alternativeSubjects || [],
        emailBody: parsed.emailBody || '',
        matchScore: typeof parsed.matchScore === 'number' ? parsed.matchScore : 85,
        matchingStrengths: Array.isArray(parsed.matchingStrengths) ? parsed.matchingStrengths : [],
        strategyTip: parsed.strategyTip || 'Send between 8:00 AM - 10:00 AM in the recipient’s local timezone for highest open rates.'
      };
    } catch {
      // If parsing failed, extract subject line and body manually
      return {
        subjectLine: `Quick question regarding ${jobData.jobTitle || 'Role'} at ${jobData.companyName || 'Company'}`,
        alternativeSubjects: [],
        emailBody: clean,
        matchScore: 80,
        matchingStrengths: ['Experience alignment with job requirements'],
        strategyTip: 'Directly tailored to job description.'
      };
    }
  },

  // Smart Offline Template Generator (Works 100% locally with zero API key!)
  generateOfflineTemplate({ resumeProfile, jobData, options }) {
    const candidateName = resumeProfile.fullName || 'Candidate';
    const recruiterGreeting = jobData.recruiterName ? `Hi ${jobData.recruiterName.split(' ')[0]}` : `Hi ${jobData.companyName || 'Hiring'} Team`;
    const company = jobData.companyName || 'your team';
    const role = jobData.jobTitle || 'the open position';
    const skillsList = resumeProfile.skills ? resumeProfile.skills.split(',').slice(0, 3).map(s => s.trim()).join(', ') : 'modern tech stacks and problem-solving';

    // Calculate simulated match score based on keyword intersection
    const jdWords = (jobData.jobDescription || '').toLowerCase();
    const resumeWords = ((resumeProfile.skills || '') + ' ' + (resumeProfile.fullResumeText || '')).toLowerCase();
    const commonKeywords = ['react', 'node', 'python', 'typescript', 'aws', 'sql', 'system design', 'lead', 'scale', 'api', 'frontend', 'backend', 'fullstack', 'ci/cd', 'docker', 'devops', 'product', 'growth'];
    
    const matchedKeywords = commonKeywords.filter(k => jdWords.includes(k) && resumeWords.includes(k));
    const score = Math.min(95, Math.max(68, 70 + matchedKeywords.length * 4));

    let subject = '';
    let body = '';
    const portfolioLink = resumeProfile.portfolio || resumeProfile.linkedin || '';
    const portfolioText = portfolioLink ? `\nYou can review my recent work and projects here: ${portfolioLink}` : '';

    if (options.tone === 'punchy') {
      subject = `${candidateName} <> ${company} (${role})`;
      body = `${recruiterGreeting},

I saw ${company} is looking for a ${role}. 

With over 5 years of experience delivering scalable products using ${skillsList}, I’ve previously built architectures that reduced latency by 35% and scaled to millions of active users.

Given your current growth, I’d love to contribute immediately to ${company}’s roadmap.${portfolioText}

Do you have 10 minutes this week for a brief introductory chat?

Best regards,
${candidateName}
${resumeProfile.email || ''} | ${resumeProfile.phone || ''}`;
    } else if (options.goal === 'referral_request') {
      subject = `Quick question regarding ${company} & ${role}`;
      body = `${recruiterGreeting},

Hope you’re having a productive week!

I’ve been following ${company}’s work in the industry and was thrilled to see the opening for ${role}. 

Given my background in ${skillsList} and proven track record of shipping impactful software, I believe my skill set strongly complements the team’s current initiatives.${portfolioText}

I would genuinely appreciate 5 minutes of your perspective on the engineering culture at ${company}, or if you’d be open to referring me for this role.

Thanks so much for your time and consideration!

Warm regards,
${candidateName}
${resumeProfile.email || ''}`;
    } else {
      // Confident & Results-Driven
      subject = `${role} at ${company} - ${candidateName}`;
      body = `${recruiterGreeting},

I noticed ${company} is expanding its team with a ${role}, and I wanted to reach out directly to express my strong interest.

Throughout my career as a ${resumeProfile.currentTitle || 'Software Engineer'}, I have focused on solving complex technical challenges and delivering high-impact products. Here are a few ways my experience matches what ${company} is looking for:

• Expertise in ${skillsList}, with a strong emphasis on clean code and robust architecture.
• Proven track record: ${resumeProfile.experience ? resumeProfile.experience.split('.')[0] + '.' : 'Led core technical initiatives with measurable performance gains.'}
• Passion for fast-paced collaboration and delivering user-centric features.${portfolioText}

I would welcome the opportunity to discuss how my background can help ${company} achieve its technical goals this quarter. Are you available for a brief 10-minute call this Thursday or Friday?

Thank you for your time and consideration.

Best regards,
${candidateName}
${resumeProfile.email || ''}
${resumeProfile.phone || ''}`;
    }

    return {
      subjectLine: subject,
      alternativeSubjects: [
        `Impacting ${company} as ${role} - ${candidateName}`,
        `Quick inquiry: ${role} @ ${company}`,
        `${candidateName} - Application for ${role}`
      ],
      emailBody: body,
      matchScore: score,
      matchingStrengths: matchedKeywords.length > 0
        ? matchedKeywords.map(k => `Demonstrated hands-on proficiency in ${k.toUpperCase()} matching job requirements`)
        : [
            `Core alignment with ${skillsList}`,
            'Proven track record in engineering and delivery',
            'Strong problem-solving and rapid learning velocity'
          ],
      strategyTip: 'Send on Tuesday or Wednesday morning (8:30 AM - 9:30 AM) for maximum recruiter open rates.'
    };
  },

  // Direct Email Sending Methods
  sendViaGmail({ to, subject, body }) {
    const encodedTo = encodeURIComponent(to || '');
    const encodedSubject = encodeURIComponent(subject || '');
    const encodedBody = encodeURIComponent(body || '');
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`;
    window.open(gmailUrl, '_blank');
  },

  sendViaMailto({ to, subject, body }) {
    const encodedTo = encodeURIComponent(to || '');
    const encodedSubject = encodeURIComponent(subject || '');
    const encodedBody = encodeURIComponent(body || '');
    const mailtoUrl = `mailto:${encodedTo}?subject=${encodedSubject}&body=${encodedBody}`;
    window.location.href = mailtoUrl;
  },

  async sendViaEmailJs({ to, subject, body, settings, candidateName, replyTo }) {
    const serviceId = settings.emailJsServiceId;
    const templateId = settings.emailJsTemplateId;
    const publicKey = settings.emailJsPublicKey;

    if (!serviceId || !templateId || !publicKey) {
      throw new Error('Please configure EmailJS Service ID, Template ID, and Public Key in Settings.');
    }

    const payload = {
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        to_email: to,
        subject: subject,
        message: body,
        from_name: candidateName || 'Candidate',
        reply_to: replyTo || ''
      }
    };

    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`EmailJS send failed (${res.status}): ${errText}`);
    }

    return true;
  },

  async sendViaWebhook({ to, subject, body, webhookUrl, metadata }) {
    if (!webhookUrl) {
      throw new Error('Please configure a Webhook URL in Settings.');
    }

    const payload = {
      to,
      subject,
      body,
      timestamp: new Date().toISOString(),
      metadata: metadata || {}
    };

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Webhook returned status ${res.status}`);
    }

    return true;
  }
};

if (typeof window !== 'undefined') {
  window.AiEngine = AiEngine;
}
