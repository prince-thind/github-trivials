require('dotenv').config();
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { exec } = require('child_process');
const DIRNAME = process.argv[2];

getCloneURLs().then((cloneURLS) => {
  main(cloneURLS);
});

async function getCloneURLs() {
  const arr = await fetchResponse()
    .then((res) => res.json())
    .then((responseObject) => {
      const items = Array.from(responseObject.items);
      return items.map((item) => item.ssh_url);
    });
  return arr;
}

async function fetchResponse() {
  const response = await fetch(process.env.URL, {
    headers: {
      authorization: `token ${process.env.AUTH_TOKEN}`,
    },
  });
  return response;
}

function main(cloneURLS) {
  cloneURLS.forEach((repo) => {
    clone(repo);
  });
}

function clone(repo) {
  let dir = DIRNAME;
  if (!DIRNAME) {
    executeCommand('mkdir repos');
    dir = 'repos';
  }
  const cloneCommand = `cd ${dir}; git clone ${repo}`;
  executeCommand(cloneCommand);
}

function executeCommand(command) {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}
