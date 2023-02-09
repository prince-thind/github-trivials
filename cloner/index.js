import dotenv from "dotenv";
import { Octokit } from "@octokit/rest";
import shell from "shelljs";
import path from "path";
import pLimit from "p-limit";
import getRepos from "../lib/getRepos.js";
dotenv.config();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

main();

async function main() {
  const repos = await getRepos(octokit);
  // const testRepos = repos.filter(r => r.name == 'git-test');
  await cloneRepos(repos);
}

async function cloneRepos(repos) {
  const absolutePath = path.resolve("./cloner/output");
  shell.mkdir("-p", absolutePath);
  shell.cd(absolutePath);

  const limit = pLimit(5);
  const repoPromises = [];

  for (const repo of repos) {
    const repoPromiseAsyncFunction = () => cloneRepo(repo.cloneUrl);
    repoPromises.push(limit(repoPromiseAsyncFunction));
  }

  await Promise.all(repoPromises);
}

async function cloneRepo(url) {
  //todo error handling
  return new Promise((resolve) => {
    shell.exec(`git clone ${url}`, (code) => {
      resolve(code);
    });
  });
}
