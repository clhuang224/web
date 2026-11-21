# Architecture

## Current State

The site is a frontend-only VueLynx application with a browser host. Home, Portfolio with per-project pages, Drawings with per-drawing pages, and the About page shell exist in Traditional Chinese, English, and Japanese. There is no backend, CMS, deployment configuration, or dedicated native application; the native bundle has been checked only in Lynx Explorer.

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

Native Lynx shells such as Lynx Explorer have no browser host. `src/platform/runtime.ts` detects them through `SystemInfo.platform`, because `NativeModules.SiteHost` resolves to `null` rather than `undefined` there. In that standalone mode the application keeps route and locale state itself, derives the compact layout from the screen width, and requests GitHub data directly. Files from `public/` use the development asset prefix locally and the site root in production; emitted native bundle assets such as the bundled font use the Lynx build's asset prefix. The native `<image>` element does not render SVG, so `VectorImage` uses the native `<svg>` element in shells and `<image>` on the Web. GitHub source URLs are parsed with a regular expression because the native `URL` implementation lacks `hostname` and `pathname`. Lynx Explorer loads any URL it is given as a Lynx bundle, so external links open in `InAppBrowser`, a full-screen native `<webview>` with a close button.

Explorer fullscreen mode is requested with `?fullscreen=true` on the Lynx bundle URL. `safeAreaInsets()` reads positive `safeAreaTop` and `safeAreaBottom` values from the shell global props when fullscreen is enabled; the App applies these insets to the shell, top navigation, and language menu. The values are read at App setup, so dynamic device changes require separate verification.

Vue Router uses memory history inside the Lynx application. It renders the selected page; the browser host remains the owner of public URLs and Back/Forward behavior. The shared route is a page (`home`, `portfolio`, `project`, `drawings`, `drawing`, `about`, `guide`, or `chapter`) plus an ID for detail pages. `src/content/catalog.ts` lists valid project, drawing, and chapter IDs; the host rejects navigation to IDs outside it.

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

Interface copy lives in `src/content/copy.ts`; project summaries and drawing descriptions have all three locale keys. The blog owns article bodies and original URLs. `selectedArticles` holds the posts featured on the homepage; each card opens the original post and marks it as Chinese in other locales. The About page contains artwork and platform links while awaiting the maintainer's original copy.

Technology tag colors are mapped in `src/content/tags.ts`. `TagList` resolves each label through `tagColor()` and uses the fallback color for unmapped names, so color assignment remains consistent across cards.

Project pages show the localized summary, tags, and links to the live site and source. When a project's source is a GitHub repository listed in `src/content/projects.ts`, the browser host requests the public repository endpoint without credentials and sends the main language, star count, and last push date to the page. Responses are validated in `src/domain/repository.ts`; failures and rate limits leave the facts hidden. The host only requests repositories that appear in the portfolio.

The Drawings page lists all 14 drawings. Each drawing page shows the full image, its localized description, and previous/next navigation that wraps around the collection. Selecting a carousel image opens that drawing's page.

The carousel uses the 14 cataloged drawings in manifest order. At widths above 767 pixels it displays and advances two drawings; at narrower widths it displays and advances one. It wraps at the collection boundaries, realigns the visible index when the layout changes, and normally advances every six seconds. Manual advancement restarts the interval. Pause/resume controls are present; reduced-motion preferences stop automatic advancement.

Doodle images render through `DoodleImage`, which stacks the full image over a 24-pixel-wide placeholder from `src/content/doodle-placeholders.ts` and removes the placeholder once the full image reports `load`. `pnpm run generate:placeholders` regenerates that module from `public/images/doodles/` with `sharp`; the source images are not modified. The placeholders are inline data URIs, so they appear with the first render instead of waiting for a request.

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

UnoCSS runs as a CLI before the build and watches during development. It has no runtime styling service or assumed Vite integration. `src/styles/site.css` owns semantic colors and component styles; `src/styles/uno.css` is generated. VueLynx's CSS variable and inheritance support is enabled in `lynx.config.ts`. Both bundles use jf open huninn from `src/assets/fonts/`, whose Latin glyphs come from Varela Round and whose CJK glyphs are rounded to match. The browser host declares the `@font-face` in `src/host/host.css`, because a declaration inside the `<lynx-view>` shadow root does not register a font; `site.css` declares it for native renderers, where the build rewrites the URL with the asset prefix. The shell sets `line-height: 1.5`, which text inherits, because the font's ascent and descent add up to exactly one em and Lynx clips text to its line box; without the extra height, descenders such as `g` are cut off. Section titles draw their coral outline with layered `text-shadow`, because the Lynx renderer is not relied on for text stroke. Native views clip absolutely positioned children, so the language menu is an overlay at the shell level rather than a child of the sidebar.

The build first creates Lynx outputs under `dist/lynx`, then the host HTML, JavaScript, runtime chunks, and copied public assets under `dist/`. The host build preserves the first output. `scripts/verify-build.mjs` checks essential output paths. The native Lynx output loads in Lynx Explorer 4.2 on Android. Set `LYNX_DEV_HOST=127.0.0.1` when running `pnpm run dev` so the bundle's asset prefix is reachable through `adb reverse tcp:3001 tcp:3001`. Production Lynx builds use `https://lynns.me/lynx/` for emitted bundle assets, including the bundled font. The runtime asset helper resolves public images from `https://lynns.me/images/`, because those files are copied to the site root.

## Public Guide

The Traditional Chinese guide in `docs/guide/zh-TW/` is a separate VitePress 1.6.4 site configured in `docs/.vitepress/`. It builds with `base: '/guide/'` and clean URLs into `dist/guide/` after the application build, so neither build cleans the other's output. Local search splits Han text into single characters and requires every term to match. The theme uses the site's teal and coral and the bundled font. Its header and mobile menu link back to the main site outside the VitePress router.

The guide is embedded in the site as the `guide` and `chapter` pages at `/behind-the-scenes` and `/behind-the-scenes/<chapter>`, with localized prefixes. Its sidebar entry sits at the bottom of the sidebar, apart from the main navigation, and the sidebar stays visible while reading. `src/content/guide.ts` owns the chapter order and titles for both the route catalog and the VitePress sidebar. On the Web, the page renders an empty `.guide-frame` view; the browser host finds it in the `<lynx-view>` shadow root and appends a same-origin iframe of `/guide/...`. The embedded guide hides its own title and navigation and posts each route change to the host, which replaces the site URL with the matching chapter path. Chapter navigation inside the iframe joins the tab's session history, so browser Back steps through chapters before leaving the guide. Native shells render a `<webview>` of the guide with `?embedded`, which switches the guide to the same embedded presentation. In development, the browser host proxies `/guide` to VitePress on port 3002. `scripts/preview.mjs` resolves guide pages, directory indexes, and `.html` files before the application fallback, and serves the guide's 404 page for unknown guide paths. The standalone `/guide/` pages remain available.

## Hosting And Verification Boundaries

The included preview serves the build with root-relative asset URLs, localized deep-route fallback, WASM MIME handling, and cross-origin isolation headers. The Web runtime also loads without the isolation headers. The `Pages` workflow deploys to GitHub Pages at `lynns.me` on every push to `main`. It runs `pnpm run build:pages`, which builds everything and then runs `scripts/prepare-pages.mjs` to write an `index.html` for every localized route, a `404.html` copy of the host page, and the `CNAME` file. GitHub Pages redirects a route without a trailing slash to its directory, and the host accepts both forms. Browser runtime loading, error fallbacks, keyboard access, external-window behavior, and the development-server composition need browser checks in addition to the pure tests.

ESLint, strict `vue-tsc`, Vitest, Prettier, and static-output verification are configured. The tests cover navigation and detail routes, host-state validation, repository response parsing, carousel grouping, and content/catalog consistency. They do not render the Lynx interface in a browser.

## Existing Content Boundaries

The independently hosted blog owns article bodies and article URLs. External project sites and platforms own their own experiences. The personal website will introduce and link to them; it does not currently proxy, import, or translate their full content.

The asset catalog owns the mapping from original exports to the current filenames. Original file contents were preserved during organization.

Remaining product choices and editorial work belong in the [product plan](plan.md). Source-art provenance, icon licensing, and filename mapping belong in [the asset catalog](assets.md).
