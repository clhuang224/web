# Architecture

## Current State

The site is a frontend-only VueLynx application with a browser host. Home, Portfolio with per-project pages, Drawings with per-drawing pages, and the About page shell exist in Traditional Chinese, English, and Japanese. There is no backend, CMS, deployment configuration, or validated native application integration.

## Repository Structure

```text
src/
  domain/       Shared types and pure navigation, carousel, and repository rules
  content/      Localized interface copy, projects, doodles, route catalog, articles
  platform/     VueLynx adapter for the SiteHost native-module bridge
  app/          Shared site context and memory router
  components/   Carousel, cards, section titles, buttons, tags, platform links
  pages/        Home, Portfolio, Project, Drawings, Drawing, and About pages
  host/         Browser entry, HTML, fallback UI, and bridge module
  styles/       Semantic styles and generated UnoCSS utilities
public/images/  Preserved source artwork and generated interface icons
scripts/        Development, static preview, icon export, build verification
docs/           Product decisions, this guide, and the asset catalog
```

## Reading The Code

1. Start with `src/domain/site.ts` for the vocabulary shared across boundaries, then the pure navigation and carousel functions beside it.
2. Read `src/content/` for editorial resources and translations. Destinations are shared across languages; layout does not own project summaries.
3. Follow `src/platform/host.ts` into `src/host/index.ts` to understand which side owns browser capabilities.
4. Read `src/app/router.ts`, `src/app/context.ts`, and `src/App.vue` for page selection and shared state.
5. Read the pages and components for Lynx elements, `tap` events, and presentation. These are VueLynx components, not Vue DOM templates.

## Runtime Boundary

```text
Browser URL, history, storage, media queries, metadata
                         |
              src/host/index.ts
                 <lynx-view>
                         |
          NativeModules.SiteHost / host-state
                         |
             src/platform/host.ts
                         |
           context -> memory router -> pages
```

The browser host creates `<lynx-view>` and loads `/lynx/main.web.bundle`. It owns `window`, `document`, browser history, language storage, viewport/reduced-motion queries, and external windows. The Lynx application accesses those capabilities through `useHost()`, rather than importing browser globals into components.

`src/host/site-host.mjs` exposes `getState`, `navigate`, `getRepository`, and `openExternal` as `NativeModules.SiteHost`. The host validates commands and the application validates received state. Initial `getState` establishes readiness; subsequent browser changes arrive as `host-state` events. The host displays a loading message and a usable blog link before readiness, and an error fallback on runtime failure or a 20-second loading timeout.

Vue Router uses memory history inside the Lynx application. It renders the selected page; the browser host remains the owner of public URLs and Back/Forward behavior. The shared route is a page (`home`, `portfolio`, `project`, `drawings`, `drawing`, or `about`) plus an ID for the two detail pages. `src/content/catalog.ts` lists the valid project and drawing IDs; the host rejects navigation to IDs outside it.

Vue Router is pinned to the 4.x line. Version 5 compares rendered elements with `getRootNode()` after each route change, which Lynx elements do not implement, so it raised runtime errors.

## Languages And URLs

| Page      | Traditional Chinese | English and Japanese |
| --------- | ------------------- | -------------------- |
| Home      | `/`                 | `/en/`, `/ja/`       |
| Portfolio | `/portfolio`        | `/en/portfolio`      |
| Project   | `/portfolio/{id}`   | `/en/portfolio/{id}` |
| Drawings  | `/drawings`         | `/en/drawings`       |
| Drawing   | `/drawing/{id}`     | `/en/drawing/{id}`   |
| About     | `/about`            | `/en/about`          |

Japanese uses the same paths with the `/ja` prefix. Project IDs are slugs such as `queener`; drawing IDs are the two-digit catalog numbers `01`–`14`.

An explicit page URL determines its language. Only entry at bare `/` may restore a previously selected language from `lynns.locale`; absent that preference, it starts in Traditional Chinese. Language switching retains the current page, including detail pages. Storage failures leave explicit URLs usable.

The host updates document language, title, description, and Open Graph title/description after reading the URL. This is client-side metadata, not prerendered page content or a guarantee about crawlers and share-preview services. Unknown paths and unknown IDs display a host-level not-found message. The preview server matches route patterns, so it returns a 404 for unknown page names but not for an unknown ID inside a valid pattern.

## Content And Carousel

Interface copy lives in `src/content/copy.ts`; project summaries and drawing descriptions have all three locale keys. The blog owns article bodies and original URLs. `selectedArticles` is currently empty, and the homepage shows a blog call to action without placeholder posts. The About page contains artwork and platform links while awaiting the maintainer's original copy.

Project pages show the localized summary, tags, and links to the live site and source. When a project's source is a GitHub repository listed in `src/content/projects.ts`, the browser host requests the public repository endpoint without credentials and sends the main language, star count, and last push date to the page. Responses are validated in `src/domain/repository.ts`; failures and rate limits leave the facts hidden. The host only requests repositories that appear in the portfolio.

The Drawings page lists all 14 drawings. Each drawing page shows the full image, its localized description, and previous/next navigation that wraps around the collection. Selecting a carousel image opens that drawing's page.

The carousel uses the 14 cataloged drawings in manifest order. At widths above 767 pixels it displays and advances two drawings; at narrower widths it displays and advances one. It wraps at the collection boundaries, realigns the visible index when the layout changes, and normally advances every six seconds. Manual advancement restarts the interval. Pause/resume controls are present; reduced-motion preferences stop automatic advancement.

## Build And Compatibility

| Layer              | Current selection                                         |
| ------------------ | --------------------------------------------------------- |
| Vue authoring      | Vue 3.5 and VueLynx 0.5.1                                 |
| Lynx build         | Rspeedy 0.13.5 with `pluginVueLynx`                       |
| Browser-host build | Rsbuild 1.7.3                                             |
| Web runtime        | `@lynx-js/web-core` 0.26.8 and `@lynx-js/lynx-core` 0.1.4 |
| Routing            | Vue Router 4.6 with memory history                        |
| Styles             | Build-time UnoCSS CLI and semantic CSS variables          |

VueLynx 0.5.1 declares an Rsbuild 1 peer range, so the build uses the compatible Rspeedy/Rsbuild release line. `pnpm-workspace.yaml` also overrides Web Core to 0.26.8 and the CSS extraction plugin to 0.7.0 to keep transitive runtime and compiler packages aligned. Change these selections together and repeat build and browser checks.

UnoCSS runs as a CLI before the build and watches during development. It has no runtime styling service or assumed Vite integration. `src/styles/site.css` owns semantic colors and component styles; `src/styles/uno.css` is generated. VueLynx's CSS variable and inheritance support is enabled in `lynx.config.ts`. The host page loads Varela Round from Google Fonts; Chinese and Japanese text falls back to Noto Sans or the system font. Section titles draw their coral outline with layered `text-shadow`, because the Lynx renderer is not relied on for text stroke.

The build first creates Lynx outputs under `dist/lynx`, then the host HTML, JavaScript, runtime chunks, and copied public assets under `dist/`. The host build preserves the first output. `scripts/verify-build.mjs` checks essential output paths. The native Lynx output is produced but has not been exercised in a native application.

## Hosting And Verification Boundaries

The included preview serves the build with root-relative asset URLs, localized deep-route fallback, WASM MIME handling, and cross-origin isolation headers. A production host must provide the same capabilities; deployment remains unconfigured. Browser runtime loading, error fallbacks, keyboard access, external-window behavior, and the development-server composition need browser checks in addition to the pure tests.

ESLint, strict `vue-tsc`, Vitest, Prettier, and static-output verification are configured. The tests cover navigation and detail routes, host-state validation, repository response parsing, carousel grouping, and content/catalog consistency. They do not render the Lynx interface in a browser.

## Existing Content Boundaries

The independently hosted blog owns article bodies and article URLs. External project sites and platforms own their own experiences. The personal website will introduce and link to them; it does not currently proxy, import, or translate their full content.

The asset catalog owns the mapping from original exports to the current filenames. Original file contents were preserved during organization.

Remaining product choices and editorial work belong in the [product plan](plan.md). Source-art provenance, icon licensing, and filename mapping belong in [the asset catalog](assets.md).
