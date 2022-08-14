require("dotenv").config();
const fetchResponses = require("./fetchRepos.js");

const axios = require("axios");
const fs = require("fs");

main();

async function main() {
  await fetchResponses();
  const mode = getMode();

  const repos = JSON.parse(fs.readFileSync("./changeVisibility/repos.json"));
  const specialRepos = JSON.parse(
    fs.readFileSync("./changeVisibility/specialRepos.json")
  );
  const nonSpecialRepos = repos.filter((repo) => {
    const id = repo.id;
    const repoPresent = specialRepos.some(r => r.id === id);
    if (repoPresent) return false;
    return true;
  }
  );


  for (const { id } of nonSpecialRepos) {
    changeVisibility(id, mode);

  }

  for (const { id, mode } of specialRepos) {
    changeVisibility(id, mode);
  }
}

async function changeVisibility(id, mode) {
  const repoVisibilityStatus = await getRepoVisbilityStatus(id);
  const noChangeRequired = repoVisibilityStatus == mode;

  if (noChangeRequired) return;

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

function getMode() {
  const mode = process.argv[2];
  if (mode == "private" || mode == "public") {
    return mode;
  }
  return "private";
}

async function getRepoVisbilityStatus(id) {
  const response = await axios.get(process.env.REPO_URL + id, {
    headers: {
      authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
  });

  const data = response.data;
  const visibility = data.visibility;
  return visibility;
}
