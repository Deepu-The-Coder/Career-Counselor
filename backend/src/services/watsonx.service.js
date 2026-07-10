const axios = require('axios');

// ============================================================
// AGENT_INSTRUCTIONS — IBM Llama Career Counselor Agent Config
// ============================================================
const AGENT_INSTRUCTIONS = {
  personality: {
    tone: 'Friendly, Motivational, Professional',
    style: 'Beginner-friendly, Supportive, Encouraging',
    language: 'Simple, clear, and easy to understand for rural youth',
  },
  careerGuidanceStyle: {
    approach: 'Practical, goal-oriented, step-by-step guidance',
    focus: 'Rural youth empowerment and accessibility',
    priorities: ['Affordable resources', 'Government schemes', 'Local opportunities', 'Skill development'],
  },
  careerDomains: [
    'Government Jobs (SSC, UPSC, State PSC, Railway, Defence, Police)',
    'IT Careers (Software Development, Data Science, Cybersecurity, Cloud Computing)',
    'Private Sector Jobs (Manufacturing, Retail, Banking, Insurance)',
    'Agriculture & AgriTech (Organic Farming, Smart Agriculture, Agri-business)',
    'Entrepreneurship (Small Business, Self-Employment, Startup Ideas)',
    'Vocational Courses (ITI, Polytechnic, Trade Skills)',
    'Skill Development (PMKVY, Skill India, Digital Literacy)',
    'Freelancing (Graphic Design, Content Writing, Web Development)',
    'Higher Education (Engineering, Medical, Commerce, Arts)',
    'Scholarships (Central & State Government Scholarships, NGO Scholarships)',
  ],
  safetyRules: [
    'Never guarantee job placements or college admissions',
    'Clearly indicate when information needs verification from official sources',
    'Recommend only ethical, legal, and legitimate opportunities',
    'Avoid fabricating or exaggerating salary/benefit claims',
    'Always suggest checking official government websites for scheme details',
    'Encourage users to seek local guidance when needed',
  ],
  localization: {
    country: 'India',
    focus: 'Rural and semi-urban youth aged 14-30',
    priorities: [
      'Indian government schemes (PMKVY, Skill India, NSP, Startup India)',
      'Free and affordable learning resources (SWAYAM, NPTEL, Diksha)',
      'Regional language support suggestions',
      'State-specific opportunities',
      'Local skill centers and ITI institutes',
    ],
  },
};

class WatsonxService {
  constructor() {
    this.apiKey = process.env.IBM_CLOUD_API_KEY;
    this.watsonxUrl = process.env.IBM_WATSONX_URL || 'https://au-syd.ml.cloud.ibm.com';
    this.projectId = process.env.IBM_WATSONX_PROJECT_ID;
    this.modelId = process.env.IBM_LLAMA_MODEL_ID || 'meta-llama/llama-3-3-70b-instruct';
    this.iamTokenUrl = 'https://iam.cloud.ibm.com/identity/token';
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }
    try {
      const response = await axios.post(
        this.iamTokenUrl,
        `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${this.apiKey}`,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' } }
      );
      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;
      return this.accessToken;
    } catch (error) {
      throw new Error(`IBM IAM token error: ${error.message}`);
    }
  }

  buildSystemPrompt(context = 'general', userProfile = null) {
    const domains = AGENT_INSTRUCTIONS.careerDomains.join(', ');
    const safety = AGENT_INSTRUCTIONS.safetyRules.join('; ');

    let profileContext = '';
    if (userProfile) {
      profileContext = `
User Profile:
- Name: ${userProfile.name || 'Student'}
- Education: ${userProfile.education?.level || 'Not specified'} ${userProfile.education?.stream ? `(${userProfile.education.stream})` : ''}
- Location: ${userProfile.location?.district ? `${userProfile.location.district}, ` : ''}${userProfile.location?.state || 'India'}
- Interests: ${userProfile.interests?.join(', ') || 'Not specified'}
- Skills: ${userProfile.skills?.join(', ') || 'Not specified'}
- Career Goals: ${userProfile.careerGoals || 'Exploring options'}
- Preferred Fields: ${userProfile.preferredCareerFields?.join(', ') || 'Open to suggestions'}
`;
    }

    const contextPrompts = {
      general: 'Provide personalized career guidance and answer questions about careers, skills, and opportunities.',
      assessment: 'Analyze the user\'s assessment responses and provide detailed career recommendations with scores.',
      roadmap: 'Generate a detailed step-by-step career roadmap with timelines and milestones.',
      schemes: 'Provide information about Indian government schemes, scholarships, and skill development programs.',
      resume: 'Help with resume building, review, and interview preparation guidance.',
      resources: 'Recommend relevant learning resources, courses, and certifications.',
    };

    return `You are CareerSaathi — an expert AI Career Counselor powered by IBM Llama, dedicated to empowering rural youth in India with personalized, practical career guidance.

Personality: ${AGENT_INSTRUCTIONS.personality.tone}
Communication Style: ${AGENT_INSTRUCTIONS.personality.language}

Your Expertise Covers: ${domains}

${profileContext}

Current Task: ${contextPrompts[context] || contextPrompts.general}

Key Guidelines:
- Use simple, encouraging language suitable for rural youth aged 14-30
- Prioritize Indian government schemes, free resources (SWAYAM, NPTEL, Diksha, YouTube), and affordable options
- Suggest PMKVY, Skill India, and other skill development programs when relevant
- Include specific steps, timelines, and actionable advice
- Mention eligibility criteria and application processes for schemes
- Always validate information needs official verification
- Format responses clearly with bullet points, numbered steps, and sections where helpful

Safety Rules: ${safety}

Respond in a warm, encouraging tone that builds confidence and provides clear direction.`;
  }

  isUnsupportedModelError(error) {
    const errorData = error?.response?.data;
    const errorText = JSON.stringify(errorData || {});
    return error?.response?.status === 404 || /model_not_supported|not found|unsupported|deprecated/i.test(errorText);
  }

  formatWatsonxError(error) {
    if (error?.response) {
      return new Error(`Watsonx API error (${error.response.status}): ${JSON.stringify(error.response.data)}`);
    }
    return new Error(`Watsonx service error: ${error.message}`);
  }

  async generateText(prompt, systemPrompt, options = {}) {
    try {
      const token = await this.getAccessToken();
      const url = `${this.watsonxUrl}/ml/v1/text/generation?version=2024-10-17`;
      const payload = {
        model_id: this.modelId,
        input: `<|system|>\n${systemPrompt}\n<|user|>\n${prompt}\n<|assistant|>\n`,
        parameters: {
          decoding_method: 'greedy',
          max_new_tokens: options.maxTokens || 1024,
          min_new_tokens: 50,
          stop_sequences: ['<|user|>', '<|system|>'],
          repetition_penalty: 1.1,
          temperature: options.temperature || 0.7,
        },
        project_id: this.projectId,
      };

      console.log("==================================");
      console.log("Trying Watsonx Model:", this.modelId);
      console.log(JSON.stringify(payload, null, 2));

      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 60000,
      });

      const generated = response.data?.results?.[0]?.generated_text || '';
      return generated.trim();
    } catch (error) {
      console.log("\n================ IBM ERROR ================");
      console.log("Model:", this.modelId);
      console.log("Status:", error.response?.status);

      if (error.response?.data) {
        console.log(JSON.stringify(error.response.data, null, 2));
      } else {
        console.log(error.message);
      }

      console.log("===========================================\n");

      throw this.formatWatsonxError(error);
    }
  }

  async generateChat(messages, userProfile = null, context = 'general') {
    const systemPrompt = this.buildSystemPrompt(context, userProfile);

    // Build conversation history
    let conversationHistory = '';
    if (messages.length > 1) {
      const historyMessages = messages.slice(0, -1).slice(-6); // last 6 messages for context
      conversationHistory = historyMessages
        .map(m => `${m.role === 'user' ? 'User' : 'CareerSaathi'}: ${m.content}`)
        .join('\n');
    }

    const lastMessage = messages[messages.length - 1].content;
    const prompt = conversationHistory
      ? `Conversation History:\n${conversationHistory}\n\nCurrent Question: ${lastMessage}`
      : lastMessage;

    return this.generateText(prompt, systemPrompt, { maxTokens: 1200 });
  }

  async generateAssessmentAnalysis(responses, userProfile = null) {
    const systemPrompt = this.buildSystemPrompt('assessment', userProfile);
    const responseSummary = responses
      .map(r => `Q: ${r.question}\nA: ${r.answer}`)
      .join('\n\n');

    const prompt = `Based on the following career assessment responses, provide a comprehensive analysis:

${responseSummary}

Please provide:
1. Top 3 career matches with match percentage (0-100%)
2. Key strengths identified
3. Areas for improvement
4. Personality type (e.g., Analytical, Creative, Social, Practical)
5. Recommended work style
6. Top 3 actionable improvement steps
7. Most suitable career domains

Format as structured analysis with clear sections.`;

    return this.generateText(prompt, systemPrompt, { maxTokens: 1500 });
  }

  async generateRoadmap(careerPath, userProfile = null) {
    const systemPrompt = this.buildSystemPrompt('roadmap', userProfile);

    const prompt = `Create a detailed career roadmap for: ${careerPath}

Include:
1. Step-by-step milestones (minimum 6 steps)
2. Duration for each milestone
3. Required skills and certifications
4. Free/affordable learning resources for each step (SWAYAM, NPTEL, YouTube, etc.)
5. Government schemes that can help (PMKVY, Scholarship programs, etc.)
6. Realistic timeline considering rural Indian youth context
7. Entry-level job expectations and salary range

Make it practical, achievable, and encouraging for a rural youth starting from scratch.`;

    return this.generateText(prompt, systemPrompt, { maxTokens: 2000 });
  }

  async generateResumeReview(resumeText, targetRole = '') {
    const systemPrompt = this.buildSystemPrompt('resume');

    const prompt = `Review this resume${targetRole ? ` for the role of ${targetRole}` : ''} and provide:
1. Overall ATS score (0-100)
2. Key strengths in the resume
3. Missing sections or information
4. Specific improvements needed
5. Keywords to add for better ATS compatibility
6. Top 5 interview questions likely to be asked
7. Actionable suggestions for each section

Resume Content:
${resumeText}`;

    return this.generateText(prompt, systemPrompt, { maxTokens: 1500 });
  }
}

module.exports = new WatsonxService();
module.exports.AGENT_INSTRUCTIONS = AGENT_INSTRUCTIONS;

