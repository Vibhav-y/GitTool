import { createOctokitInstance } from "../utils/octokit.js";
import { fetchRepoContext, formatRepoContext } from "../utils/repoContext.js";
import { deductToken } from "./tokenController.js";
import { supabase } from "../config/supabase.js";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateReadme = async (req, res, next) => {
  const { token, owner, repo, template } = req.body;
  const userId = req.user.id;
  const octokit = createOctokitInstance(token);

  try {
    // 0. Check & deduct tokens (2 tokens for generation)
    try {
      await deductToken(userId, 2, 'generate', `Generated README for ${owner}/${repo}`);
    } catch (tokenErr) {
      return res.status(403).json({ error: tokenErr.message || 'Insufficient tokens' });
    }

    // 1. Fetch GitHub Repo Data + Rich Context
    const { data } = await octokit.repos.get({ owner, repo });

    let languages = [];
    try {
      const langs = await octokit.repos.listLanguages({ owner, repo });
      languages = Object.keys(langs.data);
    } catch (e) {
      console.warn("Could not fetch languages", e.message);
    }

    // Fetch rich repo context (file tree, commits, key files)
    const repoContext = await fetchRepoContext(octokit, owner, repo);
    const contextStr = formatRepoContext(data, repoContext);

    // 2. Map Template Context
    const tplStyle = template || "professional";
    
    let systemInstruction = "You are an expert technical writer and developer advocate.";
    let templateInstructions = "";

    switch (tplStyle) {
      case 'professional':
        systemInstruction = "You are an Enterprise Developer Advocate. You write crisp, professional documentation.";
        templateInstructions = `
# Guidelines for 'Professional' Template
1. Add a centered title and short description.
2. Add a standard clean table of contents.
3. Include sections: Features, Installation, Usage, API Reference, Contributing, and License.
4. Keep the tone formal, direct, and focused on business/enterprise use cases.
5. Use code blocks with comments.
`;
        break;
      case 'minimalist':
        systemInstruction = "You are an essentialist developer. You write brutally concise documentation.";
        templateInstructions = `
# Guidelines for 'Minimalist' Template
1. Very short title and one-liner description.
2. No table of contents.
3. Sections: Quick Start, Usage, License.
4. Cut out all fluff. Be extremely brief.
`;
        break;
      case 'creative':
        systemInstruction = "You are a creative frontend hacker. You write highly engaging, visually stunning documentation.";
        templateInstructions = `
# Guidelines for 'Creative' Template
1. Use lots of relevant emojis throughout the document.
2. Include a centered, bold, graphical styled header.
3. Add markdown badges (e.g. using shields.io style markdown for languages, status, etc.) near the top.
4. Sections: 🚀 What is this?, ✨ Features, 🛠 Installation, 🎮 How to use, 🤝 Contributing.
5. Make the tone fun, energetic, and engaging.
`;
        break;
      case 'detailed':
        systemInstruction = "You are a maintainer of a massive open source library. You write exhaustive documentation.";
        templateInstructions = `
# Guidelines for 'Highly Detailed' Template
1. Include exhaustive explanations of core concepts.
2. Detailed Prerequisites, deep-dive Installation steps across environments.
3. Complex Usage examples with multiple edge cases.
4. Deep Architecture or Repository Structure section mapping out the code.
5. Exhaustive Contributing Guide.
`;
        break;
      default:
        templateInstructions = "Create a standard high-quality Markdown README.";
    }
    
    const prompt = `Here is everything I know about this repository:

${contextStr}

Languages used: ${languages.length > 0 ? languages.join(", ") : "Not specified"}

${templateInstructions}

Using ALL the context above (file structure, recent commits, dependencies, config files), generate a comprehensive and accurate Markdown README. Base installation steps, usage examples, and tech stack descriptions on the ACTUAL files and dependencies found in the repo. Do not make up features — infer them from the code structure and commits.

Do not include markdown code block backticks surrounding the entire response, just output the raw markdown.`;

    // 3. Generate via OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-5-nano-2025-08-07",
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: prompt }
      ],
    });
    
    const aiMarkdown = completion.choices[0].message.content;
    const finalMarkdown = aiMarkdown + "\n\n---\n*Made with: [gittool.dev](https://gittool.dev)*\n";

    // 4. Insert to Database
    const { data: projectData, error } = await supabase
      .from("projects")
      .insert({
        user_id: userId,
        title: data.name,
        repo_url: data.html_url,
        template: tplStyle,
        generated_markdown: finalMarkdown
      })
      .select();

    if (error) {
       console.error("DB Insert Error:", error);
       throw error;
    }

    // 5. Return Project ID and Content
    res.json({ 
        projectId: projectData[0].id,
        readme: finalMarkdown 
    });
  } catch (error) {
    console.error("generateReadme ERROR:", error.message, error.stack);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

export const saveReadme = async (req, res, next) => {
  const { repo_name, content, user_email } = req.body;
  try {
    const { data, error } = await supabase
      .from("readmes")
      .insert([{ repo_name, content, user_email }]);

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const chatReadme = async (req, res, next) => {
  const { currentMarkdown = '', prompt, token, owner: reqOwner, repo: reqRepo } = req.body;
  const userId = req.user.id;
  
  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  // Check & deduct tokens (1 token for chat)
  try {
    await deductToken(userId, 1, 'chat', 'AI chat edit');
  } catch (tokenErr) {
    return res.status(403).json({ error: tokenErr.message || 'Insufficient tokens' });
  }

  // Try to get owner/repo from request body first, then from markdown content
  let owner = reqOwner;
  let repo = reqRepo;
  if (!owner || !repo) {
    const repoMatch = currentMarkdown.match(/github\.com\/([^/\s]+)\/([^/\s)]+)/);
    owner = repoMatch ? repoMatch[1] : 'username';
    repo = repoMatch ? repoMatch[2].replace(/[)"'\]]/g, '') : 'repo';
  }

  // Fetch repo context if we have a token
  let repoContextStr = '';
  if (token && owner !== 'username') {
    try {
      const octokit = createOctokitInstance(token);
      const { data: repoData } = await octokit.repos.get({ owner, repo });
      const repoContext = await fetchRepoContext(octokit, owner, repo);
      repoContextStr = `\n\nREPO CONTEXT (use this to give accurate answers):\n${formatRepoContext(repoData, repoContext)}`;
    } catch (e) {
      console.warn("Could not fetch repo context for chat:", e.message);
    }
  }

  try {
    const widgetRef = `
WIDGET REFERENCE — Use these EXACT formats when the user asks to add badges, socials, stats, or widgets:

SOCIAL BADGES (shields.io):
- Twitter: [![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/your_username)
- LinkedIn: [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/your_username)
- YouTube: [![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com/@your_channel)
- Discord: [![Discord](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/your_invite)
- Instagram: [![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/your_username)
- Email: [![Email](https://img.shields.io/badge/Email-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:your@email.com)
- Portfolio: [![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://your-portfolio.com)
- Buy Me A Coffee: [![Buy Me A Coffee](https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=black)](https://buymeacoffee.com/your_username)

REPO BADGES:
- Stars: ![Stars](https://img.shields.io/github/stars/${owner}/${repo}?style=for-the-badge&color=22d3ee&labelColor=0d1117)
- Forks: ![Forks](https://img.shields.io/github/forks/${owner}/${repo}?style=for-the-badge&color=818cf8&labelColor=0d1117)
- License: ![License](https://img.shields.io/github/license/${owner}/${repo}?style=for-the-badge&color=f59e0b&labelColor=0d1117)
- Last Commit: ![Last Commit](https://img.shields.io/github/last-commit/${owner}/${repo}?style=for-the-badge&color=22d3ee&labelColor=0d1117)

PROFILE STATS:
- Profile Card: <p align="center"><img src="https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=${owner}&theme=github_dark" /></p>
- Streak: <p align="center"><img src="https://streak-stats.demolab.com?user=${owner}&theme=dark&hide_border=true&background=0d1117" /></p>

CONTRIBUTORS:
- <a href="https://github.com/${owner}/${repo}/graphs/contributors"><img src="https://contrib.rocks/image?repo=${owner}/${repo}" /></a>

When adding multiple socials, wrap them in a centered block: <p align="center">...badges...</p>`;

    const aiPrompt = `You are an expert technical writer assisting a user in editing their GitHub README.md.

CURRENT MARKDOWN:
\`\`\`markdown
${currentMarkdown}
\`\`\`
${repoContextStr}

USER REQUEST: "${prompt}"
${widgetRef}

Apply the user's request. Use the repo context to give accurate, specific answers based on the actual codebase. RETURN ONLY the full raw markdown (no wrapping backticks).
IMPORTANT: Keep "---\\n*Made with: [gittool.dev](https://gittool.dev)*" at the very end.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-5-nano-2025-08-07",
      messages: [
        { role: "system", content: "You are a professional README editor with deep knowledge of GitHub markdown, shields.io badges, and readme widgets. You have full access to the repo's file structure, dependencies, and commit history. Use this context to write accurate, specific documentation. When users ask to add socials, stats, or badges, use the exact widget templates from the reference." },
        { role: "user", content: aiPrompt }
      ],
    });
    
    const refinedMarkdown = completion.choices[0].message.content;
    
    res.json({ readme: refinedMarkdown });
  } catch (error) {
    console.error("chatReadme ERROR:", error.message);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};
