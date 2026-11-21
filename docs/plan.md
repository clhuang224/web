# Development Plan

## Overview

Lynn's is a personal home on the web: a place to introduce Lynn, share selected writing and creative work, and connect visitors to projects and other platforms. Its primary character is personal and expressive, with platform discovery and professional portfolio use supporting that purpose. The implementation is also an exploration of Lynx: learning its rendering, interaction, and platform model is a project goal in its own right.

The site idea dates to 2023, and the original visual design dates to 2024. The first release will carry that design forward while improving readability, responsive behavior, and multilingual content.

The first application foundation is implemented: VueLynx pages, a browser host, three-language resources and URLs, a responsive doodle carousel, and local build/check commands. The site deploys to GitHub Pages at `lynns.me`. Original About copy and broader browser/accessibility verification remain unfinished. Selected article resources and the Traditional Chinese guide content exist. Concrete module and build details are documented in [the architecture guide](architecture.md).

## Goals

- Present a frontend engineer with energy, creativity, and approachable warmth.
- Preserve the identity of the original design and the author's drawings.
- Make selected articles, projects, and platform profiles easy to discover.
- Support Traditional Chinese, English, and Japanese for the website's interface and introductory content.
- Keep the first release frontend-only and accessible in a browser.
- Explore Lynx through the actual personal website, documenting concrete integration findings and platform tradeoffs.

## First-Release Scope

| Area           | Planned behavior                                                                                                                                                             |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home           | Personal introduction, a paired-doodle carousel with automatic and manual playback, selected articles, and Finding the Bus, Queener, and PrePrompt as the featured projects. |
| Portfolio      | A dedicated listing with per-project pages, summaries, live-site and source links, and optional public GitHub details.                                                       |
| About          | A standalone page with original content supplied by the maintainer for the personal website.                                                                                 |
| Blog           | An external link to the existing blog; selected article cards link to their original posts.                                                                                  |
| Platform links | Access to SoundCloud, Crowdin, LinkedIn, and GitHub profiles.                                                                                                                |
| Drawings       | A gallery and per-drawing pages for the supplied original artwork.                                                                                                           |
| Public guide   | Source-linked Traditional Chinese VueLynx learning material, embedded at `/behind-the-scenes` behind a secondary entry at the bottom of the sidebar.                         |
| Languages      | Traditional Chinese, English, and Japanese for navigation, interface text, About content, and project and article metadata.                                                  |

The first release does not include migrating the blog, translating full articles, a content-management backend, accounts, or a database. Project and drawing detail pages are implemented. General site search, filtering, and additional collections remain outside the committed scope; documentation search is a separate planned capability.

## Decisions

| Topic                 | Direction and reason                                                                                                                                                                                                                      |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rendering platform    | Use Lynx as the exploratory direction for the personal website itself. Its different rendering and interaction model provides a new learning focus.                                                                                       |
| Framework binding     | Use VueLynx to retain familiar Vue authoring while exploring the Lynx runtime. The foundation uses the compatible VueLynx/Rspeedy/Rsbuild release line described in the architecture guide.                                               |
| Application boundary  | Start with a frontend-only site. The existing Hexo blog and individual projects retain their own hosting and content.                                                                                                                     |
| Writing selection     | Show curated articles rather than a latest-post feed, so the homepage reflects deliberate selections without implying automatic updates.                                                                                                  |
| Portfolio             | Provide a listing within this site so visitors can browse projects from one place. The homepage features Finding the Bus, Queener, and PrePrompt; the portfolio can include additional entries.                                           |
| Carousel playback     | Combine automatic advancement with manual previous/next and pause/resume controls. Display and advance two images on desktop and one image on mobile, preserving readable artwork at each screen size.                                    |
| Initial language      | Start in Traditional Chinese without a saved choice. Respect the language encoded in page URLs; only bare `/` restores a remembered deliberate language selection.                                                                        |
| About                 | Use original copy supplied by the maintainer for this site. Its scope and personal detail remain an editorial decision for the author.                                                                                                    |
| Visual identity       | Preserve the original sidebar composition, pale aqua and coral accents, outlined logo, and hand-drawn character. Adjust their application where readability or responsive layouts require it.                                             |
| Icons                 | Use Remix Icon for interface icons alongside the supplied brand artwork.                                                                                                                                                                  |
| Public learning guide | Explain the website through its real features, decisions, platform boundaries, and verification limits. Start in Traditional Chinese and expose it through a secondary sidebar entry; do not imply translated chapters that do not exist. |
| Article languages     | Localize titles and summaries on this site, while keeping linked article bodies in Chinese. Make the destination language clear before opening an article.                                                                                |

The decisions guide the first release. Implemented functionality and remaining work are distinguished below and in the architecture guide.

## Design Direction

The original design is the visual reference: [Figma design](https://www.figma.com/design/OzWLzG1nfBsVsRTJw029Y4?node-id=2-4).

The interface follows the components in that file: a centered sidebar with the wordmark, icon links, text navigation, a language dropdown, and the copyright line; section titles in white lettering with a coral outline over a soft bar; white cards with a light shadow and purple/red tag pills; coral pill buttons; and a coral frame around the carousel. jf open huninn, a rounded typeface whose Latin glyphs are Varela Round, covers all three languages. One deliberate deviation: coral buttons use dark text instead of white, because white on the coral fill is too low in contrast to read reliably.

Keep the expressive artwork and recognizable color relationships. Text, navigation, buttons, tags, and focus states need distinct visual roles; decorative pastel colors should not carry essential text when they are difficult to read. Exact color adjustments require checking the source values and the resulting interface rather than inferring contrast from screenshots.

The desktop layout should retain the left navigation and a main content area. The mobile layout should reorganize navigation and content for a narrow screen. Both layouts need room for longer English and Japanese text.

### Doodle Carousel

The main visual is a responsive carousel: **desktop displays two doodles and advances by two; mobile displays one doodle and advances by one**. Automatic advancement and manual previous/next controls use the same step size for the active layout.

- The supplied collection contains 14 drawings, originally used as Facebook covers during 2016–2023.
- Each source image is 851 × 315 pixels. Individual drawing dates are not established.
- The first pair is the potato-group drawing followed by the big-eyes drawing.
- Fourteen drawings allow seven desktop pairs or fourteen mobile slides. The order after the opening desktop pair remains to be decided; export order is provisional.
- Asset descriptions and file references belong in [the asset catalog](./assets.md).

The implemented carousel advances every six seconds and supports previous/next and pause/resume. It wraps through the collection, displays one complete image at widths up to 767 pixels, and displays two above that width. Manual advancement restarts the timer. Reduced-motion preferences stop automatic advancement. The timing and breakpoint are implementation defaults that can be refined through layout and interaction checks.

Visible controls and reduced-motion handling exist. Keyboard and assistive-technology behavior require browser verification against the Web runtime; runtime accessibility labels alone do not establish equivalent native browser controls.

### Content Presentation

The homepage and portfolio currently feature Finding the Bus, Queener, and PrePrompt, with translated summaries and live-site/source destinations. Additional portfolio entries remain editorial work. The homepage lists four selected posts from the blog, each with a localized title and summary, its publication date, tags, and a link to the original post. Revisit the selection as new posts are published.

Article cards should support a title, concise summary, link, and clear indication that the full article is in Chinese. Project cards should explain what a project does before offering the available destinations, such as a live site or source repository.

Each project has its own page under the portfolio, and each doodle has its own page under Drawings, so individual works can be linked and shared directly. Project pages add public GitHub details (main language, stars, last update). The site stays frontend-only, so this uses the unauthenticated public API without embedded tokens; if rate limits become a problem, the data can be generated at build time instead.

The portfolio and About pages should share the homepage's visual language while serving their own content. The maintainer owns the About outline and original copy. Page structure can be prepared independently, but personal text must come from the author; translation and layout should preserve the supplied meaning.

## Languages and Content Maintenance

The website resources support `zh-TW`, `en`, and `ja`. This applies to the interface and introductory metadata, not to full articles hosted on the blog.

Traditional Chinese pages use `/`, `/portfolio`, and `/about`; English and Japanese use `/en/` and `/ja/` prefixes. A page URL determines its language. Only bare `/` restores a remembered language; without that preference it starts in Traditional Chinese. Switching language retains the page and stores the deliberate choice when browser storage is available. The browser host owns persistence, URL history, and metadata.

Current content organization and remaining maintenance policy:

- Article selections, project metadata, platform links, and drawing descriptions live separately from page layout in `src/content/`.
- Prepare translations during content editing, with AI assistance where useful, and review them before publication.
- Store the published translations with the content rather than requiring a translation service when a visitor opens the site.
- Preserve original project names where appropriate and make the language of linked content explicit.

Published translations are local TypeScript resources with complete locale keys. The editorial review and translation workflow still needs to be established for the maintainer's About copy and article selections.

## Tooling and Architecture Direction

### Exploration Scope

Lynx is the preferred direction for the main website. Exploration is part of the product's purpose, so the implementation can accept additional learning and integration work. A complete native app distribution is not required for the first browser-accessible release.

[VueLynx](https://vue.lynxjs.org/guide/introduction) is the selected framework binding. The application uses Lynx elements and event handling, with a small browser-host bridge for platform capabilities. The build also produces native Lynx output, which runs in Lynx Explorer on Android. Offering it to visitors through Lynx Explorer is planned alongside deployment; a dedicated native application is not.

### Build And Styling

The foundation uses VueLynx 0.5.1, Rspeedy 0.13.5, and Rsbuild 1.7.3. VueLynx's Rsbuild 1 peer range and transitive compiler/runtime compatibility determine this release line. Web Core and CSS extraction overrides are recorded in `pnpm-workspace.yaml`; upgrades require considering the build and runtime together.

pnpm, strict TypeScript, ESLint, Prettier, and Vitest are configured. Husky hooks check commit subjects, run lint, typecheck, and formatting before commits, and run tests before pushes. A GitHub Actions workflow runs the full check and build. Engineering conventions are adapted to Lynx rather than assuming a Vue DOM template or its Vite plugins can supply this application.

UnoCSS runs as a build-time CLI and watch process. Semantic CSS variables and component styles live separately from generated utilities. The original brand SVGs and drawings are preserved; eleven Remix Icon SVGs are exported locally for interface controls and platform links.

The browser host provides loading/error fallbacks and updates HTML language and page metadata from the URL. It does not prerender the Lynx page content. Search indexing and social share previews remain hosting/rendering work; client-side metadata updates alone do not establish those outcomes.

### Implemented Foundation And Remaining Validation

The foundation uses the actual artwork and site structure:

1. The build combines Web/Lynx outputs with a static browser host and checks essential artifact paths. A local preview serves that output independently of development servers.
2. Home, Portfolio, and an About shell share the original wordmark, colors, drawings, and local interface icons.
3. The host manages three-language URLs, browser history, storage, and responsive/reduced-motion state; Vue Router uses memory history within the application.
4. The host provides loading, timeout/error, and not-found messaging with a direct blog fallback.
5. Pure tests cover navigation, bridge-state validation, carousel progression, and content/catalog consistency.

Browser rendering and interaction checks remain separate from those tests. Continue checking navigation, language persistence, keyboard access, automatic playback, reduced-motion behavior, and runtime failures. The development-server composition and any native host require their own verification; static output and browser preview do not validate them automatically.

### Repository And Content Boundaries

The repository now contains the application alongside its original assets, documentation, and Git history. Inspect any future starter output separately and merge selectively. The actual development and build commands are listed in the README and contributor guide.

Keep article selections, projects, platform destinations, and translated editorial content independent of the renderer where practical. Add shared packages only when another real consumer needs them.

External profile subdomains described in the domain plan are intended entry points. Their live availability and destinations must be checked before publishing links. Historical domain configuration does not establish current hosting state. Stable redirects from paths such as `/blog` remain optional and depend on the selected host.

Implemented structure and data flow belong in [the architecture document](architecture.md). Product decisions and their reasons belong here; [the asset catalog](assets.md) owns source-art details.

## Open Questions

- Which additional projects should appear in the full portfolio?
- Should the blog move into this site later, or remain an independent destination?
- Should the export order after the opening carousel pair change, and do the six-second interval and 767-pixel breakpoint need adjustment after browser review?
- Which color values and typography adjustments preserve the original identity with sufficient readability?
- What editorial translation and review workflow should accompany new About and article content?
- What remaining Web accessibility and browser compatibility gaps require host adaptations?
- Which static hosting and Web host arrangement should serve the main domain, and what HTML and metadata can it provide?
- Are stable redirect paths within the main domain needed in addition to direct external links?

## Next Steps

1. Complete browser checks for desktop/mobile layouts, navigation, language changes, carousel behavior, and keyboard access; address verified runtime gaps.
2. Integrate the maintainer's About copy when supplied, review selected article metadata, and establish the editorial translation workflow.
3. Confirm additional portfolio entries and verify external destinations before publication.
4. Decide whether project pages need screenshots or longer write-ups beyond the summary and GitHub details.
5. Choose and validate production hosting, including headers, deep links, runtime assets, and metadata/share-preview behavior.
6. Consider native application integration only as a separate validated target; producing a bundle alone does not establish support.

## Public Guide

The [Traditional Chinese guide](guide/zh-TW/index.md) is authored as sixteen linked pages for visitors and Vue developers. It covers current implementation, maintenance exercises, and native exploration, with source links and explicit verification boundaries. Developer reference remains in the architecture and asset documents.

VitePress builds the guide independently into `dist/guide/`, and the sidebar links to it as described in the [integration contract](site-integration.md).
