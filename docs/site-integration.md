# Public Guide Integration

Status: implemented except deployment. VitePress 1.6.4 builds the guide from `docs/.vitepress/config.mts`, the sidebar has the entry below, and the preview server resolves guide pages. The architecture guide describes the implemented behavior.

## Reader Experience

Expose a permanent route from the personal website into a guide about the website's own implementation. The guide should let a casual visitor understand the work and let a Vue developer follow real features into source code. It is editorial teaching content, not an agent log, generated API dump, or replacement for the blog and About page.

The public entry is [the Traditional Chinese guide](guide/zh-TW/index.md). It contains separate paths for a project overview, a code walkthrough, and content maintenance. The initial guide has sixteen pages, including the entry, reading map, glossary, and source map.

## Sidebar Entry And Navigation

Use these labels for the main site's navigation item:

| Site locale | Label             | Destination language notice  |
| ----------- | ----------------- | ---------------------------- |
| zh-TW       | 幕後              | 繁體中文教學                 |
| en          | Behind the scenes | Guide in Traditional Chinese |
| ja          | 舞台裏            | 繁体字中国語のガイド         |

Keep Home, Blog, Portfolio, Drawings, and About in their current order; place this secondary entry after About. Use a Remix Icon if an icon is needed. Do not add this guide to the existing application `Page` union merely to launch another document.

Reserve `/guide/` for the documentation site. On the Web, navigate to its HTML document in the same browsing context. The existing memory router and `navigate()` only recognize application pages, so they must not intercept this transition. The current `openExternal()` opens a new browser window and is not automatically equivalent to the desired same-context behavior.

In the native shell, open the guide's configured absolute HTTPS URL through the in-app browser. Reuse platform behavior rather than embedding a documentation renderer into Lynx. A host origin must be configured before this URL is considered usable; local paths alone are insufficient there.

Provide an always-discoverable return link to the main website in the guide's header and mobile navigation. Preserve browser Back behavior. A language switch in the main site must not invent English or Japanese guide routes that do not exist.

## Documentation Build

The framework recommendation remains VitePress. Inspect the stable package metadata and dependency graph before installing it, then isolate its browser Vue/Vite configuration from the application's VueLynx/Rspeedy configuration. Keep TypeScript strict and retain the application's existing compatibility pins.

The intended source root is `docs/guide/zh-TW/`, with configuration under `docs/.vitepress/`, `base: '/guide/'`, and a dedicated output directory. The English maintenance documents and research notes outside that source root must not become public pages automatically.

Use the default documentation theme initially, modest teal/coral accents, a mobile contents menu, and local search. Test Chinese keywords and English API names. A framework's search capability does not establish good Chinese tokenization without testing the chosen configuration.

Configure the chapter order as follows:

1. Entry: `index.md`, `reading-map.md`, `design-decisions.md`.
2. Feature walkthroughs: `vue-to-lynx.md`, `carousel.md`, `runtime-bridge.md`, `routing.md`, `content-and-i18n.md`, `github-data.md`.
3. Engineering and maintenance: `styling-and-assets.md`, `build-and-hosting.md`, `testing-and-accessibility.md`, `maintaining-content.md`, `native-exploration.md`.
4. Reference: `glossary.md`, `source-map.md`.

The guide currently uses ordinary Markdown and source links. Stable excerpts can later use VitePress source imports. Importing a `.vue` Lynx component into a VitePress page does not turn it into a working browser Vue demo; any live Lynx example needs its actual runtime. A separate browser teaching widget may reuse the pure carousel functions while stating what it demonstrates.

## Static Output And Serving

Build documentation independently and copy its output into `dist/guide/` after the application build. Do not let one build clean another's artifacts. Add a combined build only after both isolated builds pass.

The server must resolve guide files and nested directory indexes before the main application fallback. The current `scripts/preview.mjs` does not provide this contract automatically: a directory may fall back to the main `index.html`, and a missing guide route is not one of its recognized application routes. Development serving also needs an explicit guide service or proxy route.

Verify direct entry, reload, browser Back, and static assets at `/guide/` and a nested chapter. Decide between `.html` URLs and clean URLs based on the host; configure server behavior to match. Check the documentation under the final host headers, not just on a separate development port.

## Acceptance

- Every chapter exists, every internal link resolves, and source paths match the reviewed repository version.
- The main-site entry works with all three interface languages and clearly names the guide's current language.
- Desktop and mobile readers can discover the chapter list, search, and return to the main site.
- Web navigation uses the intended context; native navigation opens and closes the guide through its supported webview.
- Application, documentation, and combined builds work without altering the application's runtime compatibility pins.
- Static hosting and preview distinguish guide pages, application pages, missing pages, and missing assets.
- No message boards, private conversation files, unpublished personal biography, or build-only files appear in the public guide output.

Record actual commands and environments when these checks are performed. Authored content and an integration contract do not establish that the live sidebar or deployment is ready.
