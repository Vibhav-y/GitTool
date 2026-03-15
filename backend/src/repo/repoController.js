import { createOctokitInstance } from "./octokit.js";
import { fetchDecryptedToken } from "../users/githubTokenController.js";

export const getRepositories = async (req, res, next) => {
  try {
    const token = await fetchDecryptedToken(req.user.id);
    const octokit = createOctokitInstance(token);
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

export const listTags = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const token = await fetchDecryptedToken(req.user.id);
    const octokit = createOctokitInstance(token);

    const { data: tags } = await octokit.repos.listTags({
      owner, repo, per_page: 50,
    });

    const enriched = await Promise.all(tags.slice(0, 20).map(async (tag) => {
      try {
        const { data: commit } = await octokit.repos.getCommit({
          owner, repo, ref: tag.commit.sha,
        });
        return {
          name: tag.name,
          sha: tag.commit.sha.slice(0, 7),
          date: commit.commit.committer?.date || commit.commit.author?.date,
          message: commit.commit.message?.split('\n')[0] || '',
        };
      } catch {
        return {
          name: tag.name,
          sha: tag.commit.sha.slice(0, 7),
          date: null,
          message: '',
        };
      }
    }));

    res.json({ tags: enriched, total: tags.length });
  } catch (error) {
    next(error);
  }
};

export const listBranches = async (req, res, next) => {
  console.log(`[API] Fetching branches for ${req.params.owner}/${req.params.repo}`);
  try {
    const { owner, repo } = req.params;
    const token = await fetchDecryptedToken(req.user.id);
    const octokit = createOctokitInstance(token);

    const { data: branches } = await octokit.repos.listBranches({
      owner, repo, per_page: 100,
    });

    res.json({ branches });
  } catch (error) {
    next(error);
  }
};
