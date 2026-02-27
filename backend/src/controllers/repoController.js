import { createOctokitInstance } from "../utils/octokit.js";

export const getRepositories = async (req, res, next) => {
  const { token } = req.body;
  const octokit = createOctokitInstance(token);

  try {
    const { data } = await octokit.repos.listForAuthenticatedUser({
      visibility: "all",
      sort: "updated",
      per_page: 100,
    });
    
    res.json({ repos: data });
  } catch (error) {
    next(error);
  }
};
