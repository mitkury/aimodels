# How to review changes

Start from the actual diff. Review correctness before style, and report only
high-confidence findings that can affect catalog accuracy, package behavior, or
release safety.

For catalog changes, check:

1. Model IDs and aliases come from direct creator or provider documentation.
2. Product features, modes, voices, and API model IDs are not confused.
3. Intrinsic metadata stays in model files; availability and ID translation stay
   in provider files.
4. Aliases are unique and resolve to the intended canonical model.
5. `extends` is used only for closely related models from the same creator.
6. Capabilities describe dedicated API behavior, not what prompting might
   sometimes produce.
7. Release dates and uncertain limits are omitted rather than guessed.

For code or schema changes, check:

1. JavaScript and Python expose equivalent behavior.
2. Generated schemas match their Zod sources.
3. Relationship validation rejects bad data instead of silently repairing it.
4. Package builds contain the catalog and do not depend on repository-only paths.
5. Tests cover the invariant or public behavior, not incidental implementation
   details.

Group findings by severity: must fix, should fix, and consider. For each finding,
state the file and line, the concrete problem, why it matters, and the smallest
correct fix. End with a clear verdict: safe to commit or needs changes.
