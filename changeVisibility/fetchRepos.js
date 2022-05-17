require("dotenv").config();

const axios = require("axios");
const fs = require("fs");

const mainPromise=main();

async function main() {
  const data = await getRepos();
  const repos = data.map((repo) => ({
    id: repo.id,
    name: repo.name,
  }));

  const res = JSON.stringify(repos, null, 1);
  fs.writeFileSync("repos.json", res);
}

async function getRepos() {
  const response = await fetchResponse();
  const items = Array.from(response.items);
  return items;
}

async function fetchResponse() {
  const response = await axios.get(process.env.URL, {
    headers: {
      authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
  });
  return response.data;
}

module.exports= mainPromise;