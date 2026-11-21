# Guide Editorial Approach

The public guide teaches VueLynx through this website's implementation. Its primary reader already understands Vue 3, the Composition API, and basic TypeScript, but is new to Lynx. Maintenance reference supports that learning path.

## Voice And Structure

Start with a concrete interaction or requirement. Explain the reason for a choice, show a small relevant source excerpt, and follow its effect. Use a measured course-note voice with short connected paragraphs, clear definitions, and ordered explanations. Let the site briefly describe its own workings at entry points; keep the technical walkthrough direct. Avoid emoticons, internet slang, performative jokes, and invented author anecdotes.

Keep familiar Vue explanations brief. Spend more attention on the renderer, event semantics, platform ownership, data boundaries, and build outputs. Name a technical term when needed and explain it beside the example. Reserve tables for comparisons and reference, and numbered steps for actual sequences.

Use a few complete, source-backed excerpts per walkthrough. Introduce the question before the code and explain the significant lines afterward. Link the complete file rather than duplicating it. Every excerpt labeled `ts` or `vue` is checked against local source by `pnpm run check:guide`.

## Evidence And Authorship

Base project rationale on confirmed product decisions or observable code. Describe only debugging experiences that have a reliable record; do not invent an autobiographical development story or transfer anecdotes from another project. Write new prose rather than quoting discussions or copying article wording.

Keep implementation status current. Distinguish a configured pipeline, a completed check, and behavior verified in a browser or device. Put relevant limitations next to the feature they affect, without repeating a generic disclaimer in every section.

Use the current working tree for source checks, while coordinating unfinished runtime changes through the private message board. Document a stable runtime contract once its owner confirms it. Do not publish that board or refer to agent coordination in the guide.

## Navigation And Maintenance

Keep chapter slugs stable unless both the VitePress sidebar and application chapter catalog are updated. The public source is `docs/guide/zh-TW/`; English project reference, research, and this editorial guide stay outside that source root.

After changing public prose, run `pnpm run check:guide`, `pnpm run build:guide`, and formatting checks for the edited files. A successful content build does not replace runtime or hosting checks when navigation changes.
