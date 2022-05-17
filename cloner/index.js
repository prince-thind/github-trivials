require("dotenv").config();
const axios = require("axios");

const { exec } = require("child_process");

main();

async function main() {
  const cloneURLS = await getCloneURLs();
  for (const url of cloneURLS) {
    clone(url);
  }
  // clone(cloneURLS[1]); // debugging purposes
}

async function getCloneURLs() {
  try {
    const response = await fetchResponse();
    const items = Array.from(response.items);
    const res = items.map((item) => item.ssh_url);
    return res;
  } catch (err) {
    console.log("Error fetching The Response");
    return [];
  }
}

async function fetchResponse() {
  const response = await axios.get(process.env.URL, {
    headers: {
      authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
  });
  return response.data;
}

async function clone(repo) {
  const cloneCommand = `cd ./cloner/output; git clone ${repo}`;
  try {
    await executeCommand(cloneCommand);
  } catch (err) {
    console.log(`commnad line error: ${err}`);
  }
}

async function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      if (stderr) {
        console.log(`strerr: ${stderr}`);
        resolve();
      }
      console.log(`stdout: ${stdout}`);
      resolve();
    });
  });
}
