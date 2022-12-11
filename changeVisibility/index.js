import dotenv from 'dotenv'
import { Octokit } from "@octokit/rest";
import getRepos from '../lib/getRepos.js';
import getUsername from '../lib/getUsername.js';
import ignoredRepos from './ignored.js'

dotenv.config();

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

main();

async function main() {
    const repos = await getRepos(octokit);
    const username = await getUsername(octokit);

    // const testRepos = repos.filter(r => r.name == 'git-test')
    const mode = process.argv[2];


    //handle normal repos
    for (const repoObj of repos) {
        const ignoredReposArray = Object.keys(ignoredRepos)
        if (ignoredReposArray.includes(repoObj.name)) continue;

        await changeVisbility(username, repoObj.name, mode)
    }


    //handle special repos
    for (const repoName in ignoredRepos) {
        await changeVisbility(username, repoName, ignoredRepos[repoName].mode)
    }
}

async function changeVisbility(owner, repo, mode) {
    await octokit.rest.repos.update({
        owner,
        repo,
        private: mode === "private" ? true : false,
    });
}


