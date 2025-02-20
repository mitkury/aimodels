# Rules for AI

## TLDR Context
It's an NPM package at https://www.npmjs.com/package/aimodels
Can run both in browsers, Node.js, and Deno
Used in other libraries like https://www.npmjs.com/package/aiwrapper and as a source of truth on https://aiwrapper.dev

## Test often
After a big change or before committing, do "npm test"

## Commit messages
Short and concise.
Add "<scope>: <description>" suffix.

## Publishing
1. Commit changes with descriptive message
2. Run "npm version patch" (or minor/major) to bump version
3. Run "npm publish" to publish to npm
4. Verify package is available at https://www.npmjs.com/package/aimodels

## Update these rules
When you change README.md or docs/rules-for-ai.md, run "npm run gen-ai-rules"