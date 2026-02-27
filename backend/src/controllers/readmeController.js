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
  const octokit = createOctokitInstance(token);

  try {
    const { data } = await octokit.repos.get({ owner, repo });

    let languages = [];
    try {
      const langs = await octokit.repos.listLanguages({ owner, repo });
      languages = Object.keys(langs.data);
    } catch (e) {
      console.warn("Could not fetch languages", e.message);
    }

    const tplStyle = template || "professional";
    
    const prompt = `Create a ${tplStyle} GitHub README for a repository.
Repository Name: ${data.name}
Description: ${data.description || "An awesome project"}
Languages used: ${languages.length > 0 ? languages.join(", ") : "Not specified"}
${data.clone_url ? `Clone URL: ${data.clone_url}` : ""}

Please generate a high-quality Markdown README. Include standard sections like Overview, Technologies Used, Installation, Usage, Contributing, and License if applicable based on the style.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert GitHub README writer." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });
    
    const readmeContent = completion.choices[0].message.content;

    res.json({ readme: readmeContent });
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
