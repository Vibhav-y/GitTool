import { Octokit } from "@octokit/rest";

export const createOctokitInstance = (token) => {
  return new Octokit({ auth: token });
};
