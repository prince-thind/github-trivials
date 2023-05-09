import shell from "shelljs";
import path from "path";
import config from "./config.js";

main();

async function main() {
  const reposPath = config.clonePath;

  const repoDirs = shell
    .exec(`find ${reposPath} -maxdepth 1 -mindepth 1 -type d`, {
      silent: true,
    })
    .stdout.trim()
    .split("\n")
    .filter((e) => e != ".")
    .map((e) => path.resolve(e));

  shell.mkdir("-p", config.bundlePath);

  for (const repoDir of repoDirs) {
    // shell.cd(repoDir);
    const repoName = repoDir.split("/")[repoDir.split("/").length - 1];
    shell.exec(
      `GIT_DIR=${repoDir}/.git git bundle create ${config.bundlePath}/${repoName}.bundle --all`
    );
  }
}
