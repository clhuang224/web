# Documentation Framework Decision

Initial research: 2026-11-17. Current implementation review: 2026-11-21.

## Adopted Direction

The guide uses VitePress 1.6.4. Documentation is authored in `docs/guide/zh-TW/` and built into `dist/guide/`. The application embeds it at `/behind-the-scenes` and localized chapter routes. The detailed current contract belongs in [Public Guide Integration](../site-integration.md), not in the original bootstrap proposal.

The guide teaches readers who already know Vue through this project's real implementation. Selected excerpts, connected explanations, and design rationale form the main learning path. [The editorial guide](../editorial-guide.md) owns the writing approach.

## Why VitePress

VitePress offers Markdown authoring, browser Vue components, a documentation theme, local search, locale configuration, and source snippet imports. Those capabilities match a source-linked guide for a Vue audience. See the official [Markdown reference](https://vuejs.github.io/vitepress/v1/guide/markdown), [Vue authoring guide](https://vuejs.github.io/vitepress/v1/guide/using-vue), and [search reference](https://vuejs.github.io/vitepress/v1/reference/default-theme-search).

The original alternatives were plain Markdown, React/MDX-based [Rspress](https://rspress.rs/guide/start/introduction), and Astro-based [Starlight](https://starlight.astro.build/getting-started/). Plain Markdown needed manual reading navigation; the other frameworks introduced an additional authoring model without a decisive benefit for this guide. This is a project fit judgment, not a performance comparison.

The content organization also draws on [Diátaxis](https://diataxis.fr/): feature walkthroughs support learning, maintenance pages support tasks, and architecture and asset documents retain reference ownership. No additional runtime dependency is required for that editorial distinction.

## Integration Lessons

- Familiar Vue syntax does not make a Lynx component directly executable inside VitePress. Use its actual renderer for live Lynx examples.
- Application routes and documentation asset routes can be separate even when the reader stays within the website's sidebar.
- A single chapter catalog keeps the embedded entry points and VitePress sidebar aligned.
- Source imports or literal excerpt checks reduce drift in code samples; prose and rationale still require review.
- Documentation search and multilingual product navigation do not imply that the teaching material is translated into every product language.

## Remaining Work

Continue checking embedded navigation, focus and Back behavior, Chinese search results, and native webview behavior. Any interactive lesson should identify whether it demonstrates a pure rule or the actual Lynx runtime. Keep test environments and observed results explicit; the framework choice itself does not establish those outcomes.
