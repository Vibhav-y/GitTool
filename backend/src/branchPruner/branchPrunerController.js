import { fetchDecryptedToken } from "../users/githubTokenController.js";
import { createOctokitInstance } from "../repo/octokit.js";

/**
 * List stale branches for a repository.
 * Fetches all branches, computes age, checks merge status.
 */
export const listStaleBranches = async (req, res, next) => {
    try {
        const { owner, repo } = req.params;
        const threshold = parseInt(req.query.threshold) || 30;
        const userId = req.user.id;

        const token = await fetchDecryptedToken(userId);
        const octokit = createOctokitInstance(token);

        // Get default branch
        const { data: repoData } = await octokit.repos.get({ owner, repo });
        const defaultBranch = repoData.default_branch;

        // Fetch all branches with pagination
        let allBranches = [];
        let page = 1;
        while (true) {
            const { data } = await octokit.repos.listBranches({
                owner, repo, per_page: 100, page
            });
            allBranches = allBranches.concat(data);
            if (data.length < 100) break;
            page++;
        }

        // Filter out default branch
        const featureBranches = allBranches.filter(b => b.name !== defaultBranch);

        // Analyze each branch
        const now = new Date();
        const thresholdMs = threshold * 24 * 60 * 60 * 1000;

        const analyzed = await Promise.all(featureBranches.map(async (branch) => {
            try {
                // Get the latest commit on this branch
                const { data: commit } = await octokit.repos.getCommit({
                    owner, repo, ref: branch.commit.sha
                });

                const lastCommitDate = commit.commit.committer?.date || commit.commit.author?.date;
                const lastCommitMessage = commit.commit.message;
                const age = now - new Date(lastCommitDate);
                const isStale = age > thresholdMs;

                // Check if merged into default branch
                let merged = false;
                try {
                    const { status } = await octokit.repos.compareCommits({
                        owner, repo,
                        base: defaultBranch,
                        head: branch.name
                    });
                    // If ahead_by is 0, the branch is fully merged
                    merged = status === 'identical' || status === 'behind';
                } catch (e) {
                    // Comparison may fail for diverged branches
                    merged = false;
                }

                return {
                    name: branch.name,
                    lastCommitDate,
                    lastCommitMessage: lastCommitMessage?.split('\n')[0] || '',
                    lastCommitSha: branch.commit.sha,
                    isStale,
                    merged,
                    safe: merged && isStale, // Safe to delete if merged AND stale
                    protected: branch.protected
                };
            } catch (err) {
                return {
                    name: branch.name,
                    lastCommitDate: null,
                    lastCommitMessage: '',
                    lastCommitSha: branch.commit.sha,
                    isStale: false,
                    merged: false,
                    safe: false,
                    protected: branch.protected,
                    error: err.message
                };
            }
        }));

        // Sort: stale first, then by date
        const staleBranches = analyzed
            .filter(b => b.isStale && !b.protected)
            .sort((a, b) => new Date(a.lastCommitDate) - new Date(b.lastCommitDate));

        res.json({
            defaultBranch,
            totalBranches: allBranches.length,
            staleBranches: staleBranches.length,
            branches: staleBranches
        });
    } catch (error) {
        console.error("listStaleBranches ERROR:", error.message);
        next(error);
    }
};

/**
 * Delete selected branches (serial execution to avoid conflicts).
 */
export const pruneBranches = async (req, res, next) => {
    try {
        const { owner, repo } = req.params;
        const { branches } = req.body;
        const userId = req.user.id;

        if (!branches || !Array.isArray(branches) || branches.length === 0) {
            return res.status(400).json({ error: "No branches specified" });
        }

        const token = await fetchDecryptedToken(userId);
        const octokit = createOctokitInstance(token);

        const results = [];
        // Execute deletions serially to avoid conflicts
        for (const branchName of branches) {
            try {
                await octokit.git.deleteRef({
                    owner, repo,
                    ref: `heads/${branchName}`
                });
                results.push({ name: branchName, status: 'deleted' });
            } catch (err) {
                results.push({ name: branchName, status: 'failed', error: err.message });
            }
        }

        const deleted = results.filter(r => r.status === 'deleted').length;
        const failed = results.filter(r => r.status === 'failed').length;

        res.json({
            message: `Deleted ${deleted} branch(es), ${failed} failed`,
            results,
            deleted,
            failed
        });
    } catch (error) {
        console.error("pruneBranches ERROR:", error.message);
        next(error);
    }
};
