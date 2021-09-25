echo 'git-cloner started';
echo -e 'please wait, installing npm scripts, if you see an error here make sure you have npm installed \n\n\n';
npm install;
echo -e '\n\nnpm configuration finished';
echo -e 'cloning repos...\n\n'
node index.js $1;
echo 'git-cloner finished';
