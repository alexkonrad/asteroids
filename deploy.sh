#!/bin/bash

rm -rf public || exit 0

mkdir public
cp src/index.html public/index.html

hash babel 2>/dev/null || npm install -g babel-cli

babel src/app.js --out-file public/build.js

cd public
git init
git config user.name "Alex Konrad"
git config user.email "alexkonrad08@gmail.com"
git add -A
git commit -m "deploy to GitHub Pages"
git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1
