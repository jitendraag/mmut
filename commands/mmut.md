---
description: Run mutation testing to validate unit tests
argument-hint: "[test files...] [--batch N] [--quick]"
allowed-tools: [Read, Glob, Grep, Bash, Agent, Edit, Write]
---

## Arguments

Parse the user's command arguments:
- **Positional args**: test file paths to validate (e.g., `test_auth.py test_users.py`)
- **`--batch N`**: process N tests per batch (default: 5)
- **`--quick`**: force 1 mutation per test, skip equivalent mutation analysis

If no test files are specified, auto-detect all test files in the project using these patterns:
- Python: `**/test_*.py`, `**/*_test.py`
- Node.js: `**/*.test.js`, `**/*.test.ts`, `**/*.spec.js`, `**/*.spec.ts`
- Go: `**/*_test.go`
- Rust: files containing `#[test]`
- Java: `**/src/test/**/*.java`
- Ruby: `**/spec/**/*_spec.rb`, `**/test/**/test_*.rb`

## Incremental Re-run Check

Before starting, check if `mutation-testing-report.md` exists in the project root. If it does and contains SURVIVED entries:
- Ask the user: "Found {N} survived mutations from the last run. Re-run just those to verify fixes?"
- If yes: skip baseline verification and mutation design — dispatch `mutation-runner` agents only for previously-survived mutations using the same mutation descriptions from the report
- If no: proceed with full run

## Step 0: Baseline Verification

Run the full test suite. ALL tests must pass. If any test fails, STOP and tell the user to fix failing tests first.

## Step 1: Identify Tests and Source

For each test file, read it and identify:
- Individual test functions/cases
- Source file(s) being tested (from imports, naming conventions, or references)
- Test runner command (auto-detect from project config):

| Language | Detection signals | Test command | Build step |
|----------|------------------|--------------|------------|
| Python | `*.py` tests, `pytest.ini`, `setup.cfg` | `pytest` or `python -m unittest` | None |
| Node.js | `package.json` with jest/vitest | `npx jest` or `npx vitest` | None |
| Go | `*_test.go`, `go.mod` | `go test ./...` | `go build ./...` |
| Rust | `Cargo.toml`, `#[test]` blocks | `cargo test` | `cargo build` |
| Java | `pom.xml` / `build.gradle` | `mvn test` / `gradle test` | `mvn compile` / `gradle build` |
| TypeScript | `tsconfig.json` + jest/vitest config | `npx jest` / `npx vitest` | `npx tsc --noEmit` |
| Ruby | `Gemfile` + `spec/` or `test/` dir | `bundle exec rspec` / `ruby -Itest` | None |

Process up to **batch size** tests (default 5, override with `--batch N`). Report results after each batch and ask the user if they want to continue.

## Step 2: Design Mutations

For each test, design **1-3 mutations** (or exactly **1** if `--quick` mode) in the source code that the test exercises.

**Mutation strategies (pick the most relevant):**

| Strategy | Example | When to use |
|----------|---------|-------------|
| Negate condition | `if x > 0` to `if x <= 0` | Test checks boundary/conditional behavior |
| Change return value | `return True` to `return False` | Test asserts on return value |
| Remove function call | Delete `db.save(item)` | Test verifies side effects |
| Swap operator | `+` to `-`, `*` to `/` | Test checks arithmetic |
| Change constant | `timeout=30` to `timeout=0` | Test depends on specific values |
| Remove validation | Delete input check block | Test verifies validation |
| Empty collection | `return results` to `return []` | Test checks non-empty results |
| Remove error raise | Delete `raise ValueError(...)` | Test checks error handling |
| Boundary shift | `<` to `<=`, `>=` to `>` | Test checks off-by-one boundaries |

**Choosing good mutations:**
- Must be in code the test actually exercises
- Should represent a plausible real bug
- Prefer mutations that change observable behavior
- In quick mode: skip equivalent mutation analysis

## Step 3: Dispatch Mutation Runners

For each mutation, dispatch the `mutation-runner` agent with `isolation: "worktree"`. All mutations in a batch can run in parallel since each gets its own worktree.

**Dispatch prompt for each mutation:**

```
TEST FILE: {test_file_path}
TEST FUNCTION: {test_name}
SOURCE FILE: {source_file_path}
TEST COMMAND: {command to run the specific test}

MUTATION TO APPLY:
{description of the exact mutation — what to change and where}
```

## Step 4: Report Results

After all agents complete, compile results.

**Result interpretation:**
- **KILLED**: Test failed after mutation — test is effective
- **SURVIVED**: Test passed despite mutation — test needs improvement
- **EQUIVALENT**: Mutation doesn't change observable behavior — not a test gap
- **ERROR**: Test couldn't run — ignore in scoring

**Write artifact:** Append a new `## Run {YYYY-MM-DD HH:MM}` section to `mutation-testing-report.md` in the project root (create it if it doesn't exist).

**Artifact format:**

```markdown
## Run {YYYY-MM-DD HH:MM}

**Tests validated:** {count}
**Mutations applied:** {count}
**Killed:** {count} | **Survived:** {count} | **Equivalent:** {count} | **Errors:** {count}
**Score:** {killed / (killed + survived) * 100}% (equivalent and errors excluded)

### Mutation Details

| # | Test | Source File | Line | Mutation | Result |
|---|------|-------------|------|----------|--------|

### Survived Mutations (action needed)

For each survived mutation:
- What was changed and where
- Why the test missed it
- Suggested fix (concrete assertion to add)

### Equivalent Mutations (no action needed)

For each equivalent mutation:
- What was changed
- Why it's equivalent
```

**Print summary** to the user: mutation score, list of SURVIVED mutations with suggested fixes, and a link to the full report. For each SURVIVED mutation, ask before refactoring — the user may have intentionally scoped the test narrowly.
