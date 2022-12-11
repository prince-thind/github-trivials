# Github Trivials
Github Trivials is a minimilastic utility to accomplish some fairly trivial tasks via the github API.

# Prerequisites:
1. Linux Environment
2. NodeJS
3. NPM

# .env format
GITHUB_TOKEN=YOUR_TOKEN_HERE  
URL=https://api.github.com/search/repositories?q=user:USERNAME&per_page=100    
REPO_URL=https://api.github.com/repositories/  

# How to use:
check npm scripts in the package.json.

examples:
+ npm run clone (clone all your repos)
+ npm run change:private (to change all your repos to private)






