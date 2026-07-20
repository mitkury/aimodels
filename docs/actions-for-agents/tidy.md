Tidy the code or data at hand. This is the action for you.

Improve clarity and maintainability without adding unrelated behavior.

Good tidy work in AIModels includes:

- deleting dead or duplicated logic
- replacing repeated catalog facts with the existing source of truth
- simplifying inheritance, provider mapping, or package-parity code
- removing stale aliases, docs, schemas, or generated artifacts
- tightening directly related validation and tests
- preserving unrelated dirty work

Keep the change small enough to review. Run catalog validation and the checks for
every package affected by the cleanup.
