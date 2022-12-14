import dotenv from 'dotenv'
import { Octokit } from "@octokit/rest";
import getRepos from '../lib/getRepos.js';
import ignoredRepos from './ignored.js'

dotenv.config();

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

main();

async function main() {
    const repos = await getRepos(octokit);

    // const testRepos = repos.filter(r => r.name == 'git-test')
    const mode = process.argv[2];
    const ignoredReposArray = Object.keys(ignoredRepos);

    for (const repoObj of repos) {
        if (ignoredReposArray.includes(repoObj.name)) {
            //handle special repos
            changeVisbility(repoObj.ownerName, repoObj.name, ignoredRepos[repoObj.name].mode);
        }
        else {
            //handle normal repos
            changeVisbility(repoObj.ownerName, repoObj.name, mode)
        }
    }



}

async function changeVisbility(owner, repo, mode) {
    try {
        await octokit.rest.repos.update({
            owner,
            repo,
            private: mode === "private" ? true : false,
        });

    }
    catch (e) {
        console.error(e.message);
        console.log(`skipping ${owner}/${repo}\n`)
    }
}


