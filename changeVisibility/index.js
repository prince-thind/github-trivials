import dotenv from 'dotenv'
import { Octokit } from "@octokit/rest";
import getRepos from '../lib/getRepos.js';
import config from './config.js'

dotenv.config();

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

main();

async function main() {
    const repos = await getRepos(octokit);

    // const testRepos = repos.filter(r => r.name == 'git-test')
    const mode = process.argv[2];
    const specialReposArray = Object.keys(config.specialRepos);
    const specialUsersArray = Object.keys(config.specialUsers);

    for (const repoObj of repos) {
        if (specialReposArray.includes(repoObj.name)) {
         //handle special repos priority #1
            changeVisbility(repoObj.ownerName, repoObj.name, config.specialRepos[repoObj.name].mode);
            continue
        }

        // user privileges  priority #2
        if (specialUsersArray.includes(repoObj.ownerName)) {
            changeVisbility(repoObj.ownerName, repoObj.name, config.specialUsers[repoObj.ownerName]);
            continue;
        }

        //handle normal repos priority #3
        changeVisbility(repoObj.ownerName, repoObj.name, mode)
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


