<p align="center">
  <img src="assets/mmut-logo.svg" alt="MMUT Logo - A Mammoth" width="200" />
</p>

<h1 align="center">MaLa/AI Maarke Unit Test (MMUT)</h1>

<p align="center">
  <em>Malai maarke test karo!</em> 🦣
</p>

<p align="center">
  A Claude Code skill that validates unit tests using mutation testing.<br/>
  It deliberately breaks your code in isolated worktrees and checks whether your tests actually catch the bugs.
</p>

---

## What's in a name?

**MaLa/AI** = ML/AI = **Malai** (मलाई — cream in Hindi)

Some people like their chai *malai maarke* (extra creamy). We like our unit tests *malai maarke* — rich, thick, and impossible to see through. If a mutation slips past your tests, they're too thin.

The **Mammoth** (🦣) is our mascot because MMUT sounds like mammoth, and like a mammoth, bad mutations should go extinct when your tests are strong.

## How it works

1. **Baseline** — Run your test suite. All tests must pass first.
2. **Identify** — Read each test and find the source code it exercises.
3. **Design mutations** — Pick 1-3 targeted code changes per test (negate conditions, swap operators, change return values, etc.)
4. **Dispatch** — Launch parallel subagents in isolated git worktrees, each applying one mutation and running the test.
5. **Report** — Generate a mutation score. Tests that don't catch mutations are flagged with concrete fix suggestions.

## Commands

### `/mmut` — Run mutation testing

```
/mmut                              # Auto-detect and validate all tests
/mmut test_auth.py test_users.py   # Validate specific test files
/mmut --batch 10                   # Process 10 tests per batch (default: 5)
/mmut --quick                      # 1 mutation per test, faster validation
/mmut test_auth.py --quick         # Combine file targeting with quick mode
```

### `/mmut-report` — View results

```
/mmut-report                       # Show latest mutation testing summary
```

## Supported languages

Works with any language and test framework. Auto-detects test runners for:
- **Python** (unittest, pytest)
- **Node.js** (Jest, Vitest)
- **Go** (go test)
- **Rust** (cargo test)
- **Java** (Maven, Gradle)
- **TypeScript** (Jest, Vitest)
- **Ruby** (RSpec, Minitest)

## Result categories

| Result | Meaning |
|--------|---------|
| **KILLED** | Test caught the mutation — test is effective |
| **SURVIVED** | Test missed the mutation — needs improvement |
| **EQUIVALENT** | Mutation doesn't change observable behavior — not a test gap |
| **ERROR** | Mutation broke compilation/syntax — ignored in scoring |

## Installation

Install from GitHub using the Claude Code CLI:

```bash
claude plugin add github:jitendraag/mmut
```

That's it. The plugin is ready to use immediately.

### Other plugin commands

```bash
claude plugin list      # List installed plugins
claude plugin update    # Update all plugins
claude plugin remove mmut  # Uninstall
```

## Usage

Write some unit tests. MMUT triggers automatically when tests are written, or invoke manually:

> "Validate my tests" / "Are these tests good?" / "Run mutation testing"

After fixing tests flagged as weak, MMUT supports **incremental re-runs** — it re-validates only the previously-survived mutations without re-running everything.

## Architecture

MMUT uses a `mutation-runner` agent that runs each mutation in an isolated git worktree. The main orchestrator (invoked via `/mmut` or triggered automatically) designs mutations and dispatches one `mutation-runner` agent per mutation in parallel. Each agent applies its mutation, runs the test, and reports back. Worktrees are automatically cleaned up.

## Requirements

- **Claude Code** with subagent and worktree support (Agent tool with `isolation: "worktree"`)
- A git repository (worktrees require git)
- Test runner installed for your language (pytest, jest, go test, etc.)

> **Note:** This plugin relies on Claude Code's ability to dispatch parallel subagents in isolated git worktrees. It is not compatible with platforms that lack subagent or worktree support.

## Score

```
Mutation Score = killed / (killed + survived) × 100%
```

Equivalent mutations and errors are excluded from scoring.

## License

MIT
