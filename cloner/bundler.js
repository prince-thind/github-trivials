import shell from "shelljs";
import path from "path";

main();

async function main() {
  const absolutePath = path.resolve("./cloner/output");

  const repoDirs = shell
    .exec(`find ${absolutePath} -maxdepth 1 -mindepth 1 -type d`, {
      silent: true,
    })
    .stdout.trim()
    .split("\n")
    .filter((e) => e != ".")
    .map((e) => path.resolve(e));

  shell.mkdir("-p", "./cloner/bundles/");

  for (const repoDir of repoDirs) {
    // shell.cd(repoDir);
    const repoName = repoDir.split("/")[repoDir.split("/").length - 1];
    shell.exec(
      `GIT_DIR=${repoDir}/.git git bundle create ./cloner/bundles/${repoName}.bundle --all`
    );
  }
}
