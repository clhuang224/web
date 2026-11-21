# Guide Editorial Approach

The public guide teaches VueLynx through this website's implementation. Its primary reader has frontend experience and is new to Lynx; familiarity with Vue or TypeScript does not mean every API or type construct can be left unexplained. Maintenance reference supports that learning path.

## Voice And Structure

Start with a concrete interaction or requirement. Explain the reason for a choice, show a small relevant source excerpt, and follow its effect. Use natural, clear technical teaching prose with short connected paragraphs, definitions, and ordered explanations. Prefer familiar wording over stiff formal phrasing. Let the site briefly describe its own workings at entry points; keep the technical walkthrough direct. Avoid emoticons, internet slang, performative jokes, and invented author anecdotes.

Add a brief Vue or TypeScript refresher where a concept is used, including ref access, computed state, injection, generics, and narrowing. Define new platform terms at their first meaningful appearance, then use them consistently with links to the glossary. Reserve tables for comparisons and reference, and numbered steps for actual sequences.

Use a few complete, source-backed excerpts per walkthrough. Introduce the question before the code and explain the significant lines afterward. Link the complete file rather than duplicating it. Every excerpt labeled `ts` or `vue` is checked against local source by `pnpm run check:guide`.

## Scope And Comparisons

For an important design choice, explain the implemented approach and compare one closely related alternative. State what the alternative would improve, its cost, and whether the project uses it. Avoid turning each chapter into a survey of unrelated libraries.

Explain toolchain roles and their cooperation before inspecting important settings. Keep native teaching grounded in the same feature on Web and Android. For confirmed compatibility problems, retain the symptom, cause, and implemented fix; do not reconstruct unrecorded debugging steps.

Put unimplemented extensions in the dedicated experiments chapter. Give each experiment a research question, a current baseline, a reproducible validation plan, and a way to record results. Main chapters can link to it after a brief comparison, without presenting research plans as current behavior.

## Evidence And Authorship

The opening identifies the guide as development teaching material for this website and credits assistance from Codex GPT-6.1 Sol. Keep that disclosure concise and visible before the reading paths.

Base project rationale on confirmed product decisions or observable code. Describe only debugging experiences that have a reliable record; do not invent an autobiographical development story or transfer anecdotes from another project. Write new prose rather than quoting discussions or copying article wording.

Keep implementation status current. Distinguish a configured pipeline, a completed check, and behavior verified in a browser or device. Put relevant limitations next to the feature they affect, without repeating a generic disclaimer in every section.

Use the current working tree for source checks, while coordinating unfinished runtime changes through the private message board. Document a stable runtime contract once its owner confirms it. Do not publish that board or refer to agent coordination in the guide.

## Navigation And Maintenance

Keep chapter slugs stable unless both the VitePress sidebar and application chapter catalog are updated. The public source is `docs/guide/zh-TW/`; English project reference, research, and this editorial guide stay outside that source root.

After changing public prose, run `pnpm run check:guide`, `pnpm run build:guide`, and formatting checks for the edited files. A successful content build does not replace runtime or hosting checks when navigation changes.
