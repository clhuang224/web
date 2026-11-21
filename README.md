# Lynn's

A personal home for a frontend engineer's projects, writing, drawings, and other creative interests, and an exploration of building a public website with Lynx. The site is intended to feel welcoming and expressive while making work and existing platforms easy to discover.

## Status

The first browser foundation is implemented with VueLynx: a responsive homepage, a portfolio with per-project pages, a drawings gallery with per-drawing pages, an About page shell, three-language navigation, and a doodle carousel. The `Pages` workflow deploys it to [lynns.me](https://lynns.me) on each push to `main`. About copy remains editorial work; the homepage lists selected blog posts.

## Current Experience

- A homepage with a short introduction, selected projects, and a six-second doodle carousel with previous/next and pause/resume controls. It displays and advances two drawings on desktop and one drawing at widths up to 767 pixels. Reduced-motion preferences disable automatic advancement.
- Homepage project selections: Finding the Bus, Queener, and PrePrompt.
- A portfolio listing and a page per project with its summary, tags, live-site and source links, and public GitHub details (main language, stars, last update) when available.
- A Drawings gallery of all 14 doodles and a page per drawing at `/drawing/{id}`; selecting a carousel image opens it.
- A dedicated About page prepared for copy supplied by the maintainer.
- Traditional Chinese, English, and Japanese interface and introductory content, with Traditional Chinese as the initial language.
- A link to the independently hosted [blog](https://blog.lynns.me). The homepage lists selected posts with localized titles and summaries; full articles remain Chinese.
- Links to music, translation contributions, professional profiles, and project destinations.

The application uses Lynx elements and VueLynx components, with a small browser host for URLs, storage, metadata, and platform interaction. Learning this rendering and platform model is an explicit project goal. Existing articles and projects retain their own destinations. The native Lynx bundle also runs in Lynx Explorer on Android, where external links open in an in-app web view; no dedicated native application exists.

## Documentation

| Document                                             | Responsibility                                                     |
| ---------------------------------------------------- | ------------------------------------------------------------------ |
| [Product plan](docs/plan.md)                         | Scope, decisions, rationale, design direction, and open questions  |
| [Architecture](docs/architecture.md)                 | Current repository structure and implementation boundaries         |
| [Asset catalog](docs/assets.md)                      | Asset provenance, descriptive filenames, and carousel ordering     |
| [Behind-the-scenes guide](docs/guide/zh-TW/index.md) | Traditional Chinese feature walkthroughs and maintenance exercises |
| [Guide integration](docs/site-integration.md)        | Embedded guide, documentation build, and hosting contract          |
| [Contributor guide](AGENTS.md)                       | Project conventions and documentation ownership                    |

## Design Reference

The visual direction continues the [2024 Figma design](https://www.figma.com/design/OzWLzG1nfBsVsRTJw029Y4?node-id=2-4): a white desktop sidebar, a light aqua content area, coral accents, a custom wordmark, and original hand-drawn artwork. The personal website idea dates to 2023.

## Development

Requires Node.js 22.12 or later and pnpm 11.6.0.

```bash
pnpm install
pnpm run dev
```

The development command starts UnoCSS generation, Rspeedy on port 3001, VitePress on port 3002, and the browser host on [localhost:3000](http://localhost:3000). The host proxies `/lynx` to Rspeedy and `/guide` to VitePress. To inspect the static build:

```bash
pnpm run build
pnpm run preview
```

The preview serves `dist/` at [localhost:4173](http://localhost:4173), including localized deep links, and the guide at `/guide/`. Set `PORT` to change its port.

## Checks

```bash
pnpm run check
pnpm run build
```

`check` runs ESLint, strict TypeScript checking, Vitest, and Prettier checking. Tests cover route parsing (including detail pages), bridge-state validation, GitHub response parsing, carousel progression, and content resources. They do not establish keyboard, assistive-technology, native-runtime, or hosting compatibility; those require separate verification. Git hooks run the commit-time checks and tests before pushes; the GitHub Actions workflow runs `check` and `build`.

## Build And Hosting

The build combines a Rspeedy Web bundle with an Rsbuild browser host. Its verification step checks that the host HTML, Lynx Web bundle, bridge, and original wordmark exist. See [the architecture guide](docs/architecture.md) for the runtime boundary and compatibility pins.

Production hosting must serve the complete `dist/` directory, its root-relative paths, JavaScript workers, and WASM files with appropriate MIME types. It must also support the localized page URLs. The `Pages` workflow deploys the site to GitHub Pages.
