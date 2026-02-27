import { createOctokitInstance } from "../utils/octokit.js";

export const getRepoData = async (req, res, next) => {
  try {
    // Logic to fetch repo metadata, languages, and package.json will go here
    res.json({ success: true, message: "Get repo data endpoint" });
  } catch (error) {
    next(error);
  }
};
