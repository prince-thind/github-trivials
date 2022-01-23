require("dotenv").config();

const axios = require("axios");
const fs = require("fs");

const excluded = [];
const repos = JSON.parse(fs.readFileSync("./output/repos.json"));

main();

async function main() {
  for (const { id } of repos) {
    if (excluded.some((e) => e.id == id)) {
      continue;
    }
    toggleVisibility(id)
  }
}

async function toggleVisibility(id) {
  try {
    await axios.patch(
      process.env.REPO_URL + id,
      { visibility: "private" },
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
