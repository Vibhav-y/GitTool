import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generate = async (req, res, next) => {
  try {
    res.json({ success: true, message: "Generate basic markdown endpoint" });
  } catch (error) {
    next(error);
  }
};

export const regenerateSection = async (req, res, next) => {
  try {
    res.json({ success: true, message: "Regenerate specific section endpoint" });
  } catch (error) {
    next(error);
  }
};

export const generateFromRepo = async (req, res, next) => {
  try {
    res.json({ success: true, message: "Generate markdown from repo context endpoint" });
  } catch (error) {
    next(error);
  }
};
