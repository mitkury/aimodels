Use red/green TDD. This is the action for you.

1. Add the smallest test that demonstrates the missing or incorrect behavior.
2. Run it and confirm that it fails for the expected reason.
3. Implement the smallest clear fix.
4. Run the focused test, then the relevant package checks.
5. Refactor only after the behavior is green.

Public behavior must have equivalent coverage in JavaScript and Python. For
catalog relationship rules, prefer a validator regression test or a catalog-wide
invariant test over a test tied to incidental file order.
