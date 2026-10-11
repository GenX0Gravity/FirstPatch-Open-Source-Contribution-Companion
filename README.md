# FirstPatch

FirstPatch is a beginner-friendly open-source contribution companion for
people preparing to make their first pull request. It provides a small,
private dashboard for saving repositories and issues, tracking contribution
status, following a nine-step pull request preparation guide, and celebrating
progress with honest, data-driven achievements.

## The problem it solves

Starting in open source can be intimidating. New contributors often do not
know how to choose an issue, understand a repository's contribution rules, or
keep track of several possible first contributions. FirstPatch turns that
process into a simple learning workflow without requiring an account, a
backend, or access to paid APIs.

FirstPatch is an educational planning tool. It does not fork repositories,
run commands, submit pull requests, or claim that work has been completed
outside the app.

## Features

- Save repository and issue details with links, language, difficulty, and
  status.
- Edit and delete saved contribution ideas.
- Search by repository or issue title and filter by contribution status.
- Track contribution statistics and unique saved repositories.
- Follow a nine-step, beginner-friendly First Pull Request checklist.
- Persist contributions, checklist progress, achievements, and notification
  history in the browser.
- Show five achievements based on actual user-created records and checklist
  progress; starter demo rows do not unlock badges.
- Reset starter demo data with an explicit confirmation.
- Use semantic HTML, responsive layouts, keyboard-friendly modal controls,
  visible focus styles, and an ARIA live region for achievement notifications.

## Screenshots

Screenshots are not included in this repository yet. When adding screenshots,
please capture the current application from a local static server and place
the approved image files in a documented directory such as `docs/images/`.
Do not add screenshots containing personal contribution data or describe a
screen that is not present in the application.

## Technologies

- HTML5 semantic markup
- CSS3 with custom properties and responsive media queries
- Vanilla JavaScript using native ES modules
- Browser `localStorage` for client-side persistence
- No framework, backend, build tool, dependency, or paid API

## Run locally

No dependency installation or build step is required. From the repository
root, start a local static server:

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000/index.html> in a browser. Serving the project is
recommended because `js/app.js` is loaded as an ES module.

To stop the server, press `Ctrl+C` in the terminal where it is running.

## Project structure

```text
.
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── checklist.js
│   └── storage.js
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
└── README.md
```

- [`index.html`](./index.html) - Dashboard markup, contribution form,
  checklist, achievements, and navigation.
- [`css/styles.css`](./css/styles.css) - Theme variables, layout, responsive
  behavior, focus states, cards, forms, modal, and status styling.
- [`js/app.js`](./js/app.js) - UI state, rendering, validation, contribution
  actions, checklist interaction, achievements, and event handling.
- [`js/checklist.js`](./js/checklist.js) - Checklist definitions and progress
  calculations.
- [`js/storage.js`](./js/storage.js) - Versioned `localStorage` reads,
  writes, migration, and graceful storage fallbacks.
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) - Contribution workflow and
  development checklist.
- [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) - Community behavior
  expectations.

## Persistence and localStorage limitations

FirstPatch stores data under these versioned keys:

- `firstpatch.contributions` - saved contribution records
- `firstpatch.checklist` - completed checklist step IDs
- `firstpatch.achievements` - unlocked badges and notification history

Missing contribution storage initializes the starter demo rows once. A saved
empty collection remains empty. Older array-only contribution records are
migrated to the current versioned format. Malformed or unsupported records are
ignored safely rather than rendered as application data. The app remains
usable in memory when browser storage is blocked or full, but changes cannot
persist in that situation.

`localStorage` is:

- local to one browser profile and origin;
- not synchronized between devices or browsers;
- not a backup or multi-user database;
- removable by browser settings, private browsing behavior, extensions, or
  storage limits;
- readable by JavaScript running on the same origin, so do not store secrets,
  access tokens, or private credentials in FirstPatch.

Use **Reset demo data** only when you intentionally want to replace the
current local contributions, checklist progress, and achievement state. The
action requires confirmation.

## GitHub Pages deployment

1. Push the repository to GitHub.
2. Open the repository's **Settings** page.
3. Select **Pages** in the sidebar.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the branch containing the project and the `/ (root)` folder.
6. Save the configuration and wait for GitHub Pages to publish the site.

The project uses relative paths for [`css/styles.css`](./css/styles.css) and
[`js/app.js`](./js/app.js), so it is ready for a project-site path. This
repository does not currently include a GitHub Actions deployment workflow.
Do not document a live demo URL until one has actually been published.

## Accessibility and testing notes

The interface includes semantic regions and headings, explicit form labels,
keyboard focus styles, a keyboard-contained contribution modal, Escape-to-close
behavior, accessible button names, responsive layouts, and a live region for
achievement notifications. The checklist is educational and does not perform
GitHub actions.

There is currently no automated test runner in the repository. Before opening
a pull request, contributors should complete the manual checks in
[`CONTRIBUTING.md`](./CONTRIBUTING.md), including syntax checks, validation,
CRUD actions, filtering, persistence, keyboard interaction, and mobile layout
checks. Report the exact commands and scenarios you actually ran; do not claim
tests passed when they were not run.

## Roadmap

Potential future improvements, subject to maintainer review:

- Add a small automated test suite without introducing an unnecessary build
  system.
- Add optional export/import of contribution data.
- Add repository-specific checklist notes while keeping the current guide
  educational.
- Add reviewed screenshots and a published demo link.
- Improve empty-state guidance and contributor onboarding.
- Add repository templates or GitHub Pages automation if the project needs
  them.

Roadmap items are ideas, not commitments or completed features.

## Beginner-friendly issue ideas

These are intentionally small starting points for contributors:

- Improve a form validation message for a first-time user.
- Add a missing focus-state or keyboard interaction test case.
- Improve mobile spacing at one breakpoint without changing the visual style.
- Add a checklist explanation or verify an official GitHub documentation link.
- Add a small, safe empty-state improvement.
- Add a regression test for malformed `localStorage` data.
- Review the README for a path or command that has become outdated.

Before starting, search existing issues and discussions to avoid duplicate
work and confirm the desired behavior with maintainers.

## Contributing

Please read [`CONTRIBUTING.md`](./CONTRIBUTING.md) before opening an issue or
pull request. All participants are expected to follow
[`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md).

## License

No license file has been added to this repository. Until the project owner
chooses and adds a license, reuse, redistribution, and contribution rights
should not be assumed beyond the permissions provided by the hosting service.
Please ask the project owner before adding a license or describing FirstPatch
as available under a specific license.
