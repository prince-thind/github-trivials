export default async function getRepos(octokit) {
    const repos = await octokit.rest.repos.listForAuthenticatedUser({
        affiliation: 'organization_member,owner', per_page: 100
    });
    return repos.data.map(e => {
        const { name, private: isPrivate, id, ssh_url, homepage, owner } = e;
        return { name, isPrivate, id, cloneUrl: ssh_url, homepage, ownerName:owner.login }
    });
}