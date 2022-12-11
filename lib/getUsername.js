export default async function main(octokit) {
    const username = await octokit.rest.users.getAuthenticated();
    return username.data.login;
}