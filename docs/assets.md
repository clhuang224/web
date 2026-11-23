# Asset Catalog

## Provenance And Preservation

The fourteen raster illustrations are original doodles by the maintainer, previously used as Facebook covers during 2016–2023. Each supplied image is 851 × 315 pixels. Dates and original Chinese writing are supplied for IDs 01 and 13; the remaining individual dates and official artwork titles are unassigned.

Dated filenames use `YYYYMMddHHmmss` with unavailable components filled with zeroes; the two supplied times have minute precision, so their seconds are `00`. Undated files are named by ID, such as `doodle-02.png`. The project does not title or describe the doodles; only the maintainer's Markdown writing is published with them. These filename tokens do not assert a timezone or precision beyond the supplied date. Two-digit IDs preserve export order independently of filenames and do not assert chronological order. They remain the drawing IDs in page URLs such as `/drawing/04`, so renumbering a drawing changes its public URL. The original image bytes, dimensions, colors, and SVG contents have been preserved.

## Doodles

| ID  | File                                                              | Original export              |
| --- | ----------------------------------------------------------------- | ---------------------------- |
| 01  | [20210730230700.png](../public/images/doodles/20210730230700.png) | `Property 1=Default (1).png` |
| 02  | [doodle-02.png](../public/images/doodles/doodle-02.png)           | `Property 1=Variant2.png`    |
| 03  | [doodle-03.png](../public/images/doodles/doodle-03.png)           | `Property 1=Variant3.png`    |
| 04  | [doodle-04.png](../public/images/doodles/doodle-04.png)           | `Property 1=Variant4.png`    |
| 05  | [doodle-05.png](../public/images/doodles/doodle-05.png)           | `Property 1=Variant5.png`    |
| 06  | [doodle-06.png](../public/images/doodles/doodle-06.png)           | `Property 1=Variant6.png`    |
| 07  | [doodle-07.png](../public/images/doodles/doodle-07.png)           | `Property 1=Variant7.png`    |
| 08  | [doodle-08.png](../public/images/doodles/doodle-08.png)           | `Property 1=Variant8.png`    |
| 09  | [doodle-09.png](../public/images/doodles/doodle-09.png)           | `Property 1=Variant9.png`    |
| 10  | [doodle-10.png](../public/images/doodles/doodle-10.png)           | `Property 1=Variant10.png`   |
| 11  | [doodle-11.png](../public/images/doodles/doodle-11.png)           | `Property 1=Variant11.png`   |
| 12  | [doodle-12.png](../public/images/doodles/doodle-12.png)           | `Property 1=Variant12.png`   |
| 13  | [20210213134400.png](../public/images/doodles/20210213134400.png) | `Property 1=Variant13.png`   |
| 14  | [doodle-14.png](../public/images/doodles/doodle-14.png)           | `Property 1=Variant14.png`   |

Each doodle also has a derived 24-pixel-wide PNG placeholder, generated into `src/content/generated/doodle-placeholders.ts` by `pnpm run generate:placeholders`. Regenerate it whenever a doodle is added, renamed, or replaced.

Their confirmed displayed dates are `2021/07/30 23:07` and `2021/02/13 13:44`, respectively. Their story text remains Chinese in every locale.

Edit original writing in `src/content/doodles/<ID>.md`. The optional quoted `date` frontmatter produces the timestamp filename token; no date means the ID filename remains in use. `pnpm run generate:content` parses these sources into `src/content/generated/doodle-stories.ts` for Lynx rendering. Generated modules live in `src/content/generated/` and are never edited by hand. Development watches the Markdown files, and the production build regenerates their data before compiling the application.

## Brand And UI Assets

| File                                                               | Purpose                               | Original export           |
| ------------------------------------------------------------------ | ------------------------------------- | ------------------------- |
| [lynns-wordmark.svg](../public/images/brand/lynns-wordmark.svg)    | Custom wordmark; SVG viewBox 124 × 65 | `Property 1=Default.svg`  |
| [lynns-monogram.svg](../public/images/brand/lynns-monogram.svg)    | Custom monogram; SVG viewBox 54 × 54  | `Property 1=Icon (1).svg` |
| [loading-indicator.svg](../public/images/ui/loading-indicator.svg) | Loading graphic; SVG viewBox 42 × 42  | `Loading.svg`             |

## Carousel Organization

The homepage carousel displays and advances two doodles on desktop, giving seven pairs. At widths up to 767 pixels it displays and advances one doodle, giving fourteen slides. The original desktop design presents 01 and 02 together as the opening pair.

The current runtime manifest in `src/content/doodles.ts` follows catalog order: 01–02, 03–04, 05–06, 07–08, 09–10, 11–12, and 13–14 on desktop. The order after the opening pair can still change editorially without changing stable catalog identifiers.

Mobile uses the same artwork ordering with one complete drawing at a time. Presentation preserves source proportions; it does not crop or modify the original image files. All fourteen images have localized descriptions in the runtime manifest.

## Interface Icons

Twelve locally generated SVGs in `public/images/icons/` come from the Remix Icon collection distributed by `@iconify-json/ri`. The installed collection metadata identifies Remix Design as the author and Apache-2.0 as the license: [collection source and license](https://github.com/cyberalien/RemixIcon/blob/master/License). The package metadata also declares Apache-2.0; this does not change ownership or licensing of the original personal artwork.

`scripts/generate-icons.mjs` exports `github-line`, `soundcloud-line`, `translate-2`, `linkedin-box-line`, `arrow-left-line`, `arrow-right-line`, `arrow-down-s-line`, `arrow-up-s-line`, `arrow-right-up-line`, `pause-line`, `play-line`, and `close-line` as 24 × 24 SVGs with the interface ink color. Regenerate them with `node scripts/generate-icons.mjs` after intentionally changing the source selection or export styling. They are interface assets, not replacements for the custom wordmark or monogram.

## Font

`src/assets/fonts/jf-openhuninn-2.1.ttf` is jf open huninn 2.1. Native bundles use it as is; Web pages load a WOFF2 subset derived from it at build time. The source file was downloaded unmodified from the [justfont release](https://github.com/justfont/open-huninn-font/releases/tag/v2.1). It is licensed under the SIL Open Font License 1.1; `src/assets/fonts/OFL.txt` is the upstream license text, which also credits Kosugi Maru and Varela Round.

## Presentation And Content

- Use the original wordmark and monogram as brand artwork; use Remix Icon for interface symbols.
- Label doodles by their localized drawing name and ID for assistive technology; do not write titles or descriptions the maintainer has not supplied.
- Keep original source files intact; any future derivatives should have distinct filenames.
- Check actual display widths before requesting higher-resolution exports.
- Collect actual project screenshots or representative project images after selecting the portfolio entries. The personal doodles are not software UI previews.

For page behavior and visual decisions, see the [product plan](plan.md).
