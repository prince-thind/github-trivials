import dotenv from 'dotenv'
import { Octokit } from "@octokit/rest";
import shell from 'shelljs'
import path from 'path'
import pLimit from 'p-limit'
dotenv.config();

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

main();

async function main() {
    const repos = await getRepos();
    // const testRepos = repos.filter(r => r.name == 'git-test');
    await cloneRepos(repos)
}

async function cloneRepos(repos) {
    const absolutePath = path.resolve("./cloner/output");
    shell.mkdir("-p", absolutePath)
    shell.cd(absolutePath)

    const limit = pLimit(5)
    const repoPromises = [];

    for (const repo of repos) {
        const repoPromiseAsyncFunction = () => cloneRepo(repo.cloneUrl)
        repoPromises.push(limit(repoPromiseAsyncFunction))
    }

    await Promise.all(repoPromises);

}

async function cloneRepo(url) {
    //todo error handling
    return new Promise((resolve, reject) => {
        shell.exec(`git clone ${url}`, (code) => {
            resolve(code)
        })
    })

}

async function getRepos() {
    const repos = await octokit.rest.repos.listForAuthenticatedUser({
        affiliation: 'organization_member,owner', per_page: 100
    });
    return repos.data.map(e => {
        const { name, isPrivate, id, ssh_url, homepage } = e;
        return { name, isPrivate, id, cloneUrl: ssh_url, homepage }
    });
}