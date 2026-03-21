---
description: View mutation testing report summary
allowed-tools: [Read, Glob, Grep]
---

## Your task

Look for `mutation-testing-report.md` in the project root.

**If the file does not exist:**

Print: "No mutation testing report found. Run `/mmut` to validate your tests."

**If the file exists, read it and print a concise summary:**

1. **Latest run**: date and mutation score from the most recent `## Run` section
2. **Totals**: tests validated, mutations applied
3. **Breakdown**: Killed / Survived / Equivalent / Error counts
4. **Action items**: list any SURVIVED mutations with their test name, source file, line, mutation description, and suggested fix
5. **Next step**: if there are survived mutations, suggest: "Run `/mmut` to re-validate survived mutations after fixing tests."

Keep the output concise — summarize, don't repeat the full report. The user can read `mutation-testing-report.md` directly for full details.
