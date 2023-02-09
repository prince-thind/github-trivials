# Github Trivials

Github Trivials is a minimilastic utility to accomplish some fairly trivial tasks via the github API. Currently, the utility uses octokit npm package as a higher level wrapper to make use of the github rest api

# Prerequisites:

1. NodeJS
2. NPM

examples:

- npm run clone (clone all your repos)
- npm run change:private (to change all your repos to private)

# .env format

GITHUB_TOKEN=YOUR_TOKEN_HERE

# How to use:

The utlity is pretty self explantory, check npm scripts in the package.json for the actual tasks.

## Explicitly defining repository/user/user-organisation visibility:

you can define repo specific visibilty within the ./changeVisibilty/config.js as:

```JS
export default {
    specialRepos:
    {
        'repoName': {
            mode: 'public|private'
       }
    },
    specialUsers: {
        "user": 'private|public',
    }
}
```
