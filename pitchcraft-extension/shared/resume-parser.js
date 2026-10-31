// Resume Parser & Intelligence Engine for PitchCraft
// Extracts contact info, key skills, and impact metrics from PDF or plain text resumes

const ResumeParser = {
  // Comprehensive skill dictionary
  SKILL_KEYWORDS: [
    "JavaScript", "TypeScript", "React", "React Native", "Next.js", "Vue", "Angular",
    "Node.js", "Express", "NestJS", "Python", "Django", "FastAPI", "Flask",
    "Java", "Spring Boot", "Go", "Golang", "Rust", "C++", "C#", ".NET",
    "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "GraphQL",
    "AWS", "GCP", "Google Cloud", "Azure", "Docker", "Kubernetes", "Terraform",
    "CI/CD", "GitHub Actions", "Tailwind CSS", "CSS3", "HTML5", "Redux", "Zustand",
    "Microservices", "REST API", "gRPC", "WebSockets", "Kafka", "RabbitMQ",
    "System Design", "Distributed Systems", "Web Performance", "SEO", "UI/UX",
    "Machine Learning", "LLM", "AI", "OpenAI", "LangChain", "PyTorch", "TensorFlow",
    "Jest", "Playwright", "Cypress", "Git", "Agile", "Scrum"
  ],

  /**
   * Reads a File object (PDF or Text/MD) and returns extracted plain text
   */
  async extractTextFromFile(file) {
    if (!file) throw new Error("No file selected");

    const name = file.name.toLowerCase();
    if (name.endsWith(".txt") || name.endsWith(".md") || name.endsWith(".json")) {
      return await file.text();
    }

    if (name.endsWith(".pdf")) {
      const buffer = await file.arrayBuffer();
      return await this.extractTextFromPdfBuffer(buffer);
    }

    // Default attempt as text
    try {
      return await file.text();
    } catch {
      throw new Error("Unsupported file format. Please upload a PDF or TXT resume.");
    }
  },

  /**
   * PDF text stream parser with FlateDecode decompression support
   */
  async extractTextFromPdfBuffer(buffer) {
    const bytes = new Uint8Array(buffer);
    let fullText = "";

    // Convert buffer to binary string for marker lookup
    let binaryStr = "";
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binaryStr += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
    }

    // Locate stream objects
    const streamRegex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;
    let match;

    while ((match = streamRegex.exec(binaryStr)) !== null) {
      const streamDataStr = match[1];
      const streamBytes = new Uint8Array(streamDataStr.length);
      for (let j = 0; j < streamDataStr.length; j++) {
        streamBytes[j] = streamDataStr.charCodeAt(j);
      }

      // Try decompression via DecompressionStream if available
      let decompressed = null;
      if (typeof DecompressionStream !== "undefined") {
        try {
          const ds = new DecompressionStream("deflate");
          const writer = ds.writable.getWriter();
          writer.write(streamBytes);
          writer.close();
          const response = new Response(ds.readable);
          decompressed = await response.text();
        } catch {
          // not deflate or already plain text
        }
      }

      const content = decompressed || streamDataStr;
      const extracted = this.extractStringsFromPdfContent(content);
      if (extracted.trim().length > 10) {
        fullText += extracted + "\n";
      }
    }

    // Fallback: If streams yielded little or no text, regex search for parenthesized text
    if (fullText.trim().length < 50) {
      fullText = this.extractStringsFromPdfContent(binaryStr);
    }

    if (!fullText.trim()) {
      throw new Error(
        "Could not extract selectable text from this PDF. It might be a scanned image. Please paste your resume text."
      );
    }

    return fullText.trim();
  },

  /**
   * Extracts text inside PDF operators like (text) Tj or [(t1) 20 (t2)] TJ
   */
  extractStringsFromPdfContent(content) {
    let result = "";
    // Matches (string) Tj or TJ array blocks
    const tjRegex = /\(([^)]+)\)\s*Tj/g;
    let m;
    while ((m = tjRegex.exec(content)) !== null) {
      result += m[1] + " ";
    }

    // Match TJ arrays: [ (string1) 20 (string2) ] TJ
    const arrayTjRegex = /\[\s*((?:\([^)]*\)|[0-9.-]|\s*)+)\s*\]\s*TJ/g;
    let arrMatch;
    while ((arrMatch = arrayTjRegex.exec(content)) !== null) {
      const inner = arrMatch[1];
      const strRegex = /\(([^)]*)\)/g;
      let s;
      while ((s = strRegex.exec(inner)) !== null) {
        result += s[1];
      }
      result += " ";
    }

    return result
      .replace(/\\r/g, "\n")
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, " ")
      .replace(/\\\(/g, "(")
      .replace(/\\\)/g, ")")
      .replace(/\s+/g, " ");
  },

  /**
   * Analyzes raw resume text and extracts structured profile data
   */
  parse(rawText) {
    if (!rawText || typeof rawText !== "string") {
      return null;
    }

    const lines = rawText
      .split(/[\r\n]+/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    // 1. Candidate Name (usually top 1-3 lines)
    let candidateName = "";
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i];
      if (
        !line.includes("@") &&
        !line.match(/^(\+?\d|phone|email|linkedin|github|resume|curriculum)/i) &&
        line.length > 2 &&
        line.length < 35 &&
        !line.includes("http")
      ) {
        candidateName = line.replace(/[^a-zA-Z\s.-]/g, "").trim();
        break;
      }
    }

    // 2. Email
    const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const candidateEmail = emailMatch ? emailMatch[0] : "";

    // 3. Phone
    const phoneMatch = rawText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    const candidatePhone = phoneMatch ? phoneMatch[0] : "";

    // 4. Links (LinkedIn & GitHub)
    const linkedinMatch = rawText.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
    const githubMatch = rawText.match(/github\.com\/[a-zA-Z0-9_-]+/i);
    const portfolioLinks = [
      linkedinMatch ? linkedinMatch[0] : null,
      githubMatch ? githubMatch[0] : null
    ]
      .filter(Boolean)
      .join(" | ");

    // 5. Detect Current / Target Role
    let role = "";
    const roleKeywords = [
      "Senior Full-Stack Engineer",
      "Full-Stack Engineer",
      "Senior Frontend Engineer",
      "Frontend Engineer",
      "Senior Backend Engineer",
      "Backend Engineer",
      "Software Engineer",
      "Engineering Lead",
      "Tech Lead",
      "DevOps Engineer",
      "Product Manager",
      "Engineering Manager"
    ];

    for (const rk of roleKeywords) {
      if (new RegExp("\\b" + rk + "\\b", "i").test(rawText)) {
        role = rk;
        break;
      }
    }

    // 6. Extracted Skills
    const lowerText = rawText.toLowerCase();
    const detectedSkills = [];
    for (const skill of this.SKILL_KEYWORDS) {
      // Escape for regex
      const escaped = skill.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
      const regex = new RegExp("(?:^|[^a-zA-Z0-9])" + escaped + "(?:[^a-zA-Z0-9]|$)", "i");
      if (regex.test(rawText)) {
        detectedSkills.push(skill);
      }
    }

    // 7. Notable Bullet Points / Highlights with Metrics
    const rawHighlights = [];
    const metricPattern = /(\d+%\s*(?:increase|reduction|improvement|reduction|latency)|reduced\s+[^.]*by\s+\d+|improved\s+[^.]*by\s+\d+|scaled\s+[^.]*to\s+[\d,]+|saved\s+\$?\d+|architected|spearheaded|led\s+a\s+team|engineered|built\s+[^.]*handling\s+[\d,]+)/i;

    for (const line of lines) {
      const isBullet = /^[•\-*–\d.]\s*/.test(line);
      const hasMetric = metricPattern.test(line) || /%\s*(?:latency|speed|performance|uptime|conversion)/i.test(line);

      if ((isBullet || hasMetric) && line.length > 30 && line.length < 240) {
        const clean = line.replace(/^[•\-*–\d.]\s*/, "").trim();
        rawHighlights.push(clean);
      }
    }

    // Keep top unique highlights
    const highlights = Array.from(new Set(rawHighlights)).slice(0, 8);

    return {
      name: candidateName || "Candidate",
      email: candidateEmail,
      phone: candidatePhone,
      role: role || "Software Engineer",
      portfolio: portfolioLinks,
      skills: detectedSkills,
      highlights: highlights,
      rawText: rawText,
      uploadedAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })
    };
  },

  /**
   * Matches the user's resume highlights to a target job title and description
   */
  findBestMatchForJob(resumeProfile, targetTitle = "", targetDesc = "") {
    if (!resumeProfile || !resumeProfile.highlights || resumeProfile.highlights.length === 0) {
      return {
        matchingSkills: [],
        highlightSentence: ""
      };
    }

    const jobContext = `${targetTitle} ${targetDesc}`.toLowerCase();

    // 1. Find matching skills
    const matchingSkills = (resumeProfile.skills || []).filter((skill) =>
      jobContext.includes(skill.toLowerCase())
    );

    // 2. Score highlights based on keyword overlap
    const scoredHighlights = resumeProfile.highlights.map((hl) => {
      let score = 0;
      const lowerHl = hl.toLowerCase();

      // Give points for matching skills mentioned in job
      for (const skill of matchingSkills) {
        if (lowerHl.includes(skill.toLowerCase())) score += 3;
      }

      // Points for high-impact metric words
      if (lowerHl.includes("%") || lowerHl.includes("latency") || lowerHl.includes("scale")) score += 2;
      if (lowerHl.includes("architected") || lowerHl.includes("spearheaded") || lowerHl.includes("led")) score += 2;

      return { text: hl, score };
    });

    scoredHighlights.sort((a, b) => b.score - a.score);

    const bestHighlight = scoredHighlights[0]
      ? scoredHighlights[0].text
      : resumeProfile.highlights[0];

    return {
      matchingSkills: matchingSkills.slice(0, 6),
      highlightSentence: bestHighlight ? bestHighlight.replace(/\.?$/, ".") : ""
    };
  }
};

if (typeof window !== "undefined") {
  window.ResumeParser = ResumeParser;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = ResumeParser;
}
