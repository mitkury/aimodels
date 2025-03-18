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
3. Verify that Git tag was created properly. If not, create it manually:
   ```
   git tag v[version]  # e.g., git tag v0.4.5
   git push origin v[version]  # e.g., git push origin v0.4.5
   ```
4. Run "npm publish" to publish to npm
5. Verify package is available at https://www.npmjs.com/package/aimodels

## Update these rules
When you change README.md or docs/rules-for-ai.md, run "npm run gen-ai-rules"