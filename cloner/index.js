require('dotenv').config();
const { Octokit } = require("@octokit/rest");
const shell = require('shelljs')
const path = require('path')
const getUsername = require('../lib/getUsername');

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

let username = null;

main();

async function main() {
    username = await getUsername(octokit);
    const repos = await getRepos();
    // const testRepos = repos.filter(r => r.name == 'git-test');
    await cloneRepos(repos)
}

async function cloneRepos(repos) {
    const absolutePath = path.resolve("./cloner/output");
    shell.mkdir("-p", absolutePath)
    shell.cd(absolutePath)

    const repoPromises = [];
    for (const repo of repos) {
        const repoPromise = (shell.exec(`git clone ${repo.cloneUrl}`, { async: true }))
        repoPromises.push(repoPromise)
    }

    await Promise.allSettled(repoPromises);

}

async function getRepos() {
    const repos = await octokit.rest.repos.listForAuthenticatedUser();
    return repos.data.map(e => {
        const { name, private, id, ssh_url, homepage } = e;
        return { name, private, id, cloneUrl: ssh_url, homepage }
    });
}