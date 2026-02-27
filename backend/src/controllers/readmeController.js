import { createOctokitInstance } from "../utils/octokit.js";
import { supabase } from "../config/supabase.js";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateReadme = async (req, res, next) => {
  const { token, owner, repo, template } = req.body;
  const userId = req.user.id; // From verifyToken middleware
  const octokit = createOctokitInstance(token);

  try {
    // 1. Fetch GitHub Repo Data
    const { data } = await octokit.repos.get({ owner, repo });

    let languages = [];
    try {
      const langs = await octokit.repos.listLanguages({ owner, repo });
      languages = Object.keys(langs.data);
    } catch (e) {
      console.warn("Could not fetch languages", e.message);
    }

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
    
    const prompt = `Repository Name: ${data.name}
Description: ${data.description || "An awesome project"}
Languages used: ${languages.length > 0 ? languages.join(", ") : "Not specified"}
${data.clone_url ? `Clone URL: ${data.clone_url}` : ""}

${templateInstructions}

Please generate the Markdown README now based exclusively on the facts provided and the template guidelines. Ensure the markdown is immaculately formatted. Do not include markdown code block backticks surrounding the entire response, just output the raw markdown.`;

    // 3. Generate via OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });
    
    const aiMarkdown = completion.choices[0].message.content;
    const finalMarkdown = aiMarkdown + "\n\n---\n*Made with: [gittool.dev](https://gittool.dev)*\n";

    // 4. Insert Output directly to Database (Auto-Save)
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
    next(error);
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
  const { currentMarkdown, prompt } = req.body;
  
  if (!currentMarkdown || !prompt) {
    return res.status(400).json({ error: "Missing currentMarkdown or prompt" });
  }

  try {
    const aiPrompt = `You are an expert technical writer and developer advocate assisting a user in refining their GitHub README.md file. 

Here is the CURRENT MARKDOWN:
\`\`\`markdown
${currentMarkdown}
\`\`\`

USER REQUEST TO MODIFY THE README:
"${prompt}"

Please apply the user's modifications to the markdown. 
RETURN ONLY THE NEW FULL RAW MARKDOWN. Do not wrap it in markdown backticks. Make sure everything flows cohesively.
IMPORTANT: ALWAYS ensure the exact string "---
*Made with: [gittool.dev](https://gittool.dev)*" appears at the very end of the file. If it was removed, add it back.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a professional README editor." },
        { role: "user", content: aiPrompt }
      ],
      temperature: 0.7,
    });
    
    const refinedMarkdown = completion.choices[0].message.content;
    
    res.json({ readme: refinedMarkdown });
  } catch (error) {
    next(error);
  }
};
