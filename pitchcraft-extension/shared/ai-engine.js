// PitchCraft AI Generation Engine
// High-converting cold outreach generation with built-in intelligence and optional LLM API fallback

const PitchCraftAI = {
  /**
   * Generates a personalized email pitch based on parameters
   */
  async generate({
    recipientName = "",
    recipientEmail = "",
    companyName = "",
    jobPosition = "",
    jobDescription = "",
    keyHighlight = "",
    tone = "Confident",
    length = "Medium",
    senderProfile = {},
    resumeProfile = null
  }) {
    // If resume profile provided, find best matching accomplishments & skills
    let enrichedHighlight = keyHighlight;
    let resumeMatchInfo = null;

    if (resumeProfile && typeof ResumeParser !== "undefined") {
      resumeMatchInfo = ResumeParser.findBestMatchForJob(resumeProfile, jobPosition, jobDescription);
      if (resumeMatchInfo && resumeMatchInfo.highlightSentence) {
        if (!enrichedHighlight) {
          enrichedHighlight = resumeMatchInfo.highlightSentence;
        } else if (!enrichedHighlight.includes(resumeMatchInfo.highlightSentence)) {
          enrichedHighlight = `${enrichedHighlight.trim().replace(/\.?$/, ".")} Additionally, ${resumeMatchInfo.highlightSentence}`;
        }
      }
    }

    // If user provided custom API key, try remote LLM, else use smart built-in engine
    if (senderProfile.apiKey && senderProfile.aiProvider !== "builtin") {
      try {
        return await this.generateWithRemoteAPI({
          recipientName,
          recipientEmail,
          companyName,
          jobPosition,
          jobDescription,
          keyHighlight: enrichedHighlight,
          tone,
          length,
          senderProfile,
          resumeProfile
        });
      } catch (err) {
        console.warn("Remote API error, falling back to built-in generator:", err);
      }
    }

    return this.generateBuiltin({
      recipientName,
      recipientEmail,
      companyName,
      jobPosition,
      jobDescription,
      keyHighlight: enrichedHighlight,
      tone,
      length,
      senderProfile,
      resumeProfile
    });
  },

  /**
   * Built-in template and heuristic synthesis engine
   */
  generateBuiltin({
    recipientName,
    companyName,
    jobPosition,
    keyHighlight,
    tone,
    length,
    senderProfile
  }) {
    const rawFirst = (recipientName || "").trim().split(/\s+/)[0];
    const firstName = rawFirst && !["Dear", "Hiring", "Recruiter"].includes(rawFirst) ? rawFirst : "";
    const company = (companyName || "").trim() || "your team";
    const position = (jobPosition || "").trim() || "the open role";
    const myName = senderProfile.name || "Monu Shah";
    const myEmail = senderProfile.email || "monushah.dev@gmail.com";
    const myPortfolio = senderProfile.portfolio || "github.com/monushah108";
    const myBio = senderProfile.bio || "experienced software engineer specializing in scalable web systems.";

    let subject = "";
    let body = "";

    // Highlight phrasing
    const highlightSentence = keyHighlight
      ? keyHighlight.trim().replace(/\.?$/, ".")
      : "In my recent role, I helped optimize core platform performance by over 35% and scaled mission-critical features.";

    if (tone === "Confident") {
      subject = `Application: ${position} — ${myName} (${company} Roadmap)`;
      if (length === "Short") {
        body = `Hi ${firstName || "there"},\n\n` +
          `I noticed ${company}'s work on ${position} and wanted to reach out directly.\n\n` +
          `With a deep background in modern software engineering, I specialize in shipping high-velocity, reliable systems. ${highlightSentence}\n\n` +
          `Given ${company}'s high bar for craft, I am confident I can make an immediate impact on your team. Would you be open to a 10-minute chat next Tuesday or Wednesday?\n\n` +
          `Best regards,\n${myName}\n${myEmail} | ${myPortfolio}`;
      } else if (length === "Detailed") {
        body = `Hi ${firstName || "there"},\n\n` +
          `I have been following ${company}'s trajectory closely, particularly your recent engineering initiatives and technical milestones.\n\n` +
          `I am writing to express my strong candidacy for the ${position} position. With over 5 years architecting scalable full-stack applications, my background directly aligns with what you're building:\n\n` +
          `• Technical Depth: Deep production expertise in React, TypeScript, cloud architecture, and modern distributed patterns.\n` +
          `• Measurable Impact: ${highlightSentence}\n` +
          `• Craft & Velocity: Dedicated to clean maintainable abstractions, automated test coverage, and ergonomic developer experience.\n\n` +
          `I would love the opportunity to share how my background can help accelerate ${company}'s product milestones this quarter.\n\n` +
          `Would you have 15 minutes next week for a brief exploratory discussion?\n\n` +
          `Best regards,\n${myName}\n${myEmail}\n${myPortfolio}`;
      } else {
        // Medium (Default)
        body = `Hi ${firstName || "there"},\n\n` +
          `I have been following ${company}'s engineering milestones and wanted to reach out directly regarding the ${position} role.\n\n` +
          `Having built web platforms over the past 5 years using modern TypeScript and cloud architectures, I specialize in shipping low-latency, resilient interfaces. ${highlightSentence}\n\n` +
          `Given ${company}'s obsessive focus on high-quality product execution, I am confident I can make an immediate, positive impact on your roadmap.\n\n` +
          `Would you have 10 minutes next Tuesday or Wednesday for a brief introductory conversation?\n\n` +
          `Best regards,\n${myName}\n${myEmail} | ${myPortfolio}`;
      }
    } else if (tone === "Friendly") {
      subject = `Quick note from an engineer who loves ${company} (${position})`;
      if (length === "Short") {
        body = `Hey ${firstName || "there"},\n\n` +
          `Hope you're having an awesome week!\n\n` +
          `I've been a huge admirer of what ${company} is building. When I saw the opening for ${position}, I just had to reach out.\n\n` +
          `Quick bit about me: ${highlightSentence}\n\n` +
          `I'd love to say hello and learn what the team has in store. Are you free for a quick 10-min virtual coffee soon?\n\n` +
          `Cheers,\n${myName}\n${myEmail}`;
      } else if (length === "Detailed") {
        body = `Hey ${firstName || "there"},\n\n` +
          `Hope you're having a wonderful week!\n\n` +
          `I've been a long-time admirer of ${company}'s product ethos, thoughtful UX, and engineering culture. When I noticed the opening for ${position}, I was immediately energized to connect.\n\n` +
          `A little context on my journey: I love crafting snappy, joyful user experiences and robust web architectures. ${highlightSentence}\n\n` +
          `I'm always excited to exchange ideas with innovative teams. I'd love to hear what challenges your group is tackling next and see where I could lend a hand.\n\n` +
          `Could we carve out 15 minutes for a friendly coffee chat sometime next week?\n\n` +
          `Warm cheers,\n${myName}\n${myEmail} | ${myPortfolio}`;
      } else {
        // Medium
        body = `Hey ${firstName || "there"},\n\n` +
          `Hope you're having a great week!\n\n` +
          `I've been a huge fan of ${company}'s design and technical philosophy for a long time. When I saw the opening for ${position}, I wanted to reach out directly.\n\n` +
          `A quick bit about me: I'm an engineer passionate about building delightful, snappy interfaces and robust systems. ${highlightSentence}\n\n` +
          `I'd love to chat briefly and learn more about what the team is tackling next.\n\n` +
          `Are you free for a quick 10-minute virtual coffee sometime soon?\n\n` +
          `Cheers,\n${myName}\n${myEmail} | ${myPortfolio}`;
      }
    } else if (tone === "Formal") {
      subject = `Candidate Inquiry: ${position} — ${myName}`;
      if (length === "Short") {
        body = `Dear ${firstName ? firstName : "Hiring Manager"},\n\n` +
          `I am writing to express my formal interest in the ${position} position at ${company}.\n\n` +
          `With proven technical competence in software engineering, ${highlightSentence.toLowerCase()}\n\n` +
          `I have attached my credentials and would welcome the opportunity to discuss my qualifications at your convenience.\n\n` +
          `Sincerely,\n${myName}\n${myEmail}`;
      } else {
        body = `Dear ${firstName ? firstName : "Hiring Manager"},\n\n` +
          `I am writing to submit my candidacy for the ${position} opening at ${company}.\n\n` +
          `With extensive experience in systems design and frontend engineering, I have consistently delivered robust digital solutions that balance rigorous engineering standards with high business value. ${highlightSentence}\n\n` +
          `I have reviewed ${company}'s engineering objectives and believe my skill set aligns strongly with your current needs. I would welcome the opportunity to participate in a formal discussion regarding how my background can support your organization.\n\n` +
          `Thank you for your consideration.\n\n` +
          `Sincerely,\n${myName}\n${myEmail}\n${myPortfolio}`;
      }
    } else {
      // Professional (Standard default)
      subject = `${position} — Introduction & Candidacy (${myName})`;
      if (length === "Short") {
        body = `Hi ${firstName || "there"},\n\n` +
          `I am reaching out regarding the ${position} position at ${company}.\n\n` +
          `With over 5 years of software engineering experience, I specialize in building responsive, scalable applications. ${highlightSentence}\n\n` +
          `Would you be available for a brief 10-minute call this week to discuss how I might contribute to the team?\n\n` +
          `Best regards,\n${myName}\n${myEmail}`;
      } else {
        body = `Hi ${firstName || "there"},\n\n` +
          `I hope this email finds you well.\n\n` +
          `I am reaching out regarding the ${position} opening at ${company}. Having followed your product innovations, I was drawn to this role given your team's emphasis on engineering excellence and scalability.\n\n` +
          `Over the past 5 years, I have architected and deployed high-performance web applications using modern TypeScript frameworks. ${highlightSentence}\n\n` +
          `I would welcome the opportunity to connect for a 15-minute introductory call to explore how my skills align with your current requirements.\n\n` +
          `Thank you for your time and consideration.\n\n` +
          `Best regards,\n${myName}\n${myEmail} | ${myPortfolio}`;
      }
    }

    return { subject, body };
  },

  /**
   * Optional remote LLM query (OpenAI or Gemini)
   */
  async generateWithRemoteAPI({
    recipientName,
    companyName,
    jobPosition,
    jobDescription,
    keyHighlight,
    tone,
    length,
    senderProfile,
    resumeProfile
  }) {
    const resumeInfo = resumeProfile
      ? `\nVerified Highlights from Candidate's Resume:\n${(resumeProfile.highlights || []).slice(0, 5).map(h => "- " + h).join("\n")}\nCandidate Skills: ${(resumeProfile.skills || []).join(", ")}`
      : "";

    const prompt = `You are PitchCraft, an elite cold outreach and job application pitch generator.
Write a personalized, high-converting outreach email based on the following details:

Recipient: ${recipientName || "Hiring Manager"}
Company: ${companyName || "Company"}
Role: ${jobPosition || "Software Engineer"}
Job Context: ${jobDescription || "Not provided"}
Key Highlights/Accomplishments to include: ${keyHighlight || "Full-stack engineer with 5+ yrs experience"}
${resumeInfo}
Desired Tone: ${tone}
Desired Length: ${length}
Sender Info:
Name: ${senderProfile.name}
Email: ${senderProfile.email}
Bio/Summary: ${senderProfile.bio}
Portfolio: ${senderProfile.portfolio}

Respond ONLY with valid JSON in this exact structure:
{
  "subject": "Compelling subject line",
  "body": "The email body including greeting and signature"
}`;

    if (senderProfile.aiProvider === "openai") {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${senderProfile.apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" }
        })
      });
      const data = await res.json();
      return JSON.parse(data.choices[0].message.content);
    } else if (senderProfile.aiProvider === "gemini") {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${senderProfile.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        }
      );
      const data = await res.json();
      const rawText = data.candidates[0].content.parts[0].text;
      return JSON.parse(rawText);
    }

    throw new Error("Unsupported AI provider");
  }
};

if (typeof window !== "undefined") {
  window.PitchCraftAI = PitchCraftAI;
}

