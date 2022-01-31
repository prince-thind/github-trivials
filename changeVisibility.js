require("dotenv").config();
const fetchResponses = require("./fetchRepos.js");

const axios = require("axios");
const fs = require("fs");

const excluded = [];
const mode = "private";

main();

async function main() {
  await fetchResponses;
  const repos = JSON.parse(fs.readFileSync("./repos.json"));

  for (const { id } of repos) {
    if (excluded.some((e) => e.id == id)) {
      continue;
    }
    toggleVisibility(id);
  }
}

async function toggleVisibility(id) {
  try {
    await axios.patch(
      process.env.REPO_URL + id,
      { visibility: mode },
      {
        headers: {
          authorization: `token ${process.env.GITHUB_TOKEN}`,
        },
      }
    );
  } catch (err) {
    console.log(err);
  }
}
