require('dotenv').config();
const { Octokit } = require("@octokit/rest");
const getUsername = require('../lib/getUsername');

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

let username = null;

main();

async function main() {
    username = await getUsername(octokit);
    const repos = await getRepos();
    console.log(repos)
}

async function getRepos() {
    const repos = await octokit.rest.repos.listForAuthenticatedUser();
    return repos.data.map(e => {
        const {name,private,id, html_url,homepage}=e;
        return {name,private,id,url:html_url,homepage}
    });
}