# Contributing to FirstPatch

Thank you for helping make open-source contribution less intimidating.
FirstPatch is intentionally small and framework-free so that beginners can
understand the codebase and make focused improvements.

## Before you start

1. Read the [README](./README.md) and this guide.
2. Check open issues and pull requests for related work.
3. For a larger or behavior-changing idea, open an issue first so the scope
   can be discussed.
4. Keep changes focused. Avoid bundling unrelated redesigns or dependencies.
5. Follow the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Development setup

FirstPatch has no package manager, dependency installation, or build step.
From the repository root, run:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/index.html>. A static server is preferred
because [`index.html`](./index.html) loads [`js/app.js`](./js/app.js) as an
ES module.

## Development checklist

Before opening a pull request, complete the applicable checks:

- [ ] Read the issue or explain the change clearly in the pull request.
- [ ] Confirm all changed paths exist and all relative links still work.
- [ ] Keep the app framework-free and avoid adding dependencies without
      discussion.
- [ ] Preserve safe rendering of user input; use DOM APIs and `textContent`
      rather than interpolating untrusted content into HTML.
- [ ] Validate required fields and URLs when changing contribution forms.
- [ ] Check create, edit, delete, search, filter, empty-state, and statistics
      behavior when changing contribution logic.
- [ ] Check refresh persistence and malformed or missing `localStorage` data
      when changing storage logic.
- [ ] Check checklist progress and achievement behavior when changing related
      state.
- [ ] Test keyboard access, focus states, modal Escape behavior, and readable
      labels.
- [ ] Check a narrow mobile viewport as well as a desktop viewport.
- [ ] Run `node --check` for each changed JavaScript file.
- [ ] Run `git diff --check`.
- [ ] Update documentation when commands, paths, or behavior change.
- [ ] Describe the tests and manual scenarios actually performed.

There is no automated test runner in the repository at this time. Do not
report an automated test as passing unless you add and run it.

## Making changes

1. Fork the repository on GitHub and clone your fork.
2. Create a focused branch, for example:

   ```bash
   git switch -c improve-empty-state
   ```

3. Make the smallest clear change that addresses the issue.
4. Run the relevant development checklist items.
5. Review the diff:

   ```bash
   git diff --check
   git diff
   ```

6. Commit with a concise message that explains the change.
7. Push the branch and open a pull request against the project's default
   branch.

If your Git version does not support `git switch`, use the equivalent
`git checkout -b improve-empty-state` command.

## Pull request guidance

Please include:

- the problem being solved;
- a concise summary of the implementation;
- screenshots or a short recording for visible UI changes, when useful;
- the commands and manual scenarios you ran;
- known limitations or follow-up work.

Keep pull requests reviewable. Update the README or related documentation
when user-visible behavior or setup instructions change.

## Issues for beginners

Good first contributions include improving copy, adding a focused accessibility
fix, checking documentation links, improving an empty state, or adding a
regression test for stored data. See the issue ideas in the
[README](./README.md), and ask questions before taking work that may overlap
with another contributor.

## Questions and reporting problems

Use the repository's GitHub issue tracker for reproducible bugs, feature
requests, and documentation corrections. Include your browser, viewport,
steps to reproduce, expected behavior, actual behavior, and whether the issue
survives a page refresh. Do not include credentials, tokens, or private
personal data.
