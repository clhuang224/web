# Public Guide Integration

Status: VitePress integration, embedded application routes, local preview handling, and a GitHub Pages deployment workflow are implemented. Browser and device behavior still require environment-specific verification. The current runtime contract is described in [the architecture guide](architecture.md).

## Content Ownership

The Traditional Chinese guide lives in `docs/guide/zh-TW/`. It teaches VueLynx through real website features, selected source excerpts, and design decisions. English project reference and research files remain outside the public VitePress source root.

[The editorial guide](editorial-guide.md) defines the reader level and writing approach. `src/content/guide.ts` owns chapter slugs, order, and titles; both the application and VitePress navigation use that catalog. Keep it aligned when adding or renaming chapters. The current seventeen-page guide includes a dedicated experiments section for unimplemented extensions; its baseline, questions, and validation plans remain separate from implemented behavior.

## Application Routes And Rendering

The sidebar entry follows About and uses the labels 幕後, Behind the scenes, and 舞台裏. It opens the application's `guide` page at `/behind-the-scenes`; chapter pages use `/behind-the-scenes/<chapter>`, with the usual localized prefixes. The article prose remains Traditional Chinese.

These routes belong to the application router and catalog. They differ from `/guide/`, the standalone VitePress output. The main sidebar remains present during embedded reading.

On the Web, `EmbedPage` renders an empty `.embed-frame` view. The browser host's `placeEmbed` function locates that view in the Lynx shadow root and appends a same-origin iframe loading the matching VitePress route. The embedded theme hides duplicate navigation and reports route changes with a `guide-route` message. The host checks the sender and origin before replacing the outer URL with the matching chapter path.

The shared component also embeds the independently hosted blog at `/blog` and `/blog/<blog path>`. Blog paths preserve the original date and article path rather than using selected-article IDs. The host accepts `blog-route` messages only from the current frame at `https://blog.lynns.me`; the blog targets `https://lynns.me`, so local development does not exercise that synchronization. Guide and blog messaging use separate message types and origin checks.

Native shells use a webview with the matching guide URL and the embedded presentation flag. The native wrapper and Web iframe do not provide identical history synchronization; validate chapter navigation, system Back, locale changes, and focus behavior in each environment.

The standalone `/guide/` pages retain their own reading interface and return link. Test the embedded and standalone modes separately.

## Build And Search

VitePress 1.6.4 is configured in `docs/.vitepress/` with `srcDir: 'guide/zh-TW'`, `base: '/guide/'`, clean URLs, and output to `dist/guide/`. The root package owns the documentation dependency and scripts; there is no separate documentation workspace.

- `pnpm run dev:guide` runs the guide service on port 3002.
- `pnpm run check:guide` validates guide reachability, local links, source paths, and literal source excerpts.
- `pnpm run build:guide` generates the documentation output.
- `pnpm run build` builds the application, browser host, and guide in order, then checks required output.
- `pnpm run build:pages` also prepares route pages, the main 404 page, and CNAME for GitHub Pages.

Local search tokenizes Han characters individually and requires all search terms to match. Check representative Chinese and English API queries rather than assuming the tokenizer provides word-level Chinese search.

VitePress renders browser Vue components. Lynx SFCs require their own renderer, so source display and a live Lynx demonstration remain separate concerns. A browser teaching widget can reuse a pure domain function when it clearly identifies what it demonstrates.

## Development, Preview, And Hosting

The browser host proxies `/guide` to the VitePress service during development. `scripts/preview.mjs` resolves guide files and directory indexes before the application fallback and uses the guide's 404 page for unknown guide routes.

The Pages workflow publishes the complete `dist/` directory. `scripts/prepare-pages.mjs` generates main-site route entry files from the current route catalog, including the embedded guide routes. Those copies contain the browser host, while VitePress generates actual article HTML under `dist/guide/`.

## Verification Boundaries

Content checks establish internal consistency and source excerpt matches. Guide builds establish that Markdown and Vue compilation complete. Neither alone verifies iframe messages, keyboard focus, browser Back, native webview behavior, or production asset loading.

For a rendering or navigation change, verify direct entry and reload for an embedded chapter, chapter-to-chapter navigation, Back, localized outer routes, standalone reading, missing guide assets, and an unknown chapter. Confirm that private boards and non-public maintenance documents are absent from the public output.
