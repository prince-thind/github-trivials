require("dotenv").config();


const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { exec } = require("child_process");
const DIRNAME = process.argv[2] || "cloner-output";

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
    const jsonResponse = await response.json();
    const items = Array.from(jsonResponse.items);
    const res = items.map((item) => item.ssh_url);
    return res;
  } catch (err) {
    console.log("Error fetching The Response");
    return [];
  }
}

async function fetchResponse() {
  const response = await fetch(process.env.URL, {
    headers: {
      authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
  });
  return response;
}

async function clone(repo, dir) {
  if (dir == null) {
    dir = DIRNAME;
  }
  const cloneCommand = `mkdir -p ${dir}; cd ${dir}; git clone ${repo}`;
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
        reject({ error });
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
