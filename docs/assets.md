# Asset Catalog

## Provenance And Preservation

The fourteen raster illustrations are original doodles by the maintainer, previously used as Facebook covers during 2016–2023. Each supplied image is 851 × 315 pixels. Individual creation dates and official artwork titles have not been assigned.

Filenames describe visible content for maintenance. The numeric prefixes preserve export order as stable catalog identifiers; they do not assert chronological order. The original image bytes, dimensions, colors, and SVG contents have been preserved.

## Doodles

| ID  | File                                                                                                    | Visible content                               | Original export              |
| --- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ---------------------------- |
| 01  | [doodle-01-potato-parade.png](../public/images/doodles/doodle-01-potato-parade.png)                     | Potato-shaped characters and colorful stripes | `Property 1=Default (1).png` |
| 02  | [doodle-02-wide-eyes.png](../public/images/doodles/doodle-02-wide-eyes.png)                             | A close-up of a wide-eyed face                | `Property 1=Variant2.png`    |
| 03  | [doodle-03-outline-sketch.png](../public/images/doodles/doodle-03-outline-sketch.png)                   | A black-line outline scene                    | `Property 1=Variant3.png`    |
| 04  | [doodle-04-red-and-green-lines.png](../public/images/doodles/doodle-04-red-and-green-lines.png)         | Red looping lines with green vertical lines   | `Property 1=Variant4.png`    |
| 05  | [doodle-05-rainbow-squiggles.png](../public/images/doodles/doodle-05-rainbow-squiggles.png)             | Colorful winding shapes with small faces      | `Property 1=Variant5.png`    |
| 06  | [doodle-06-steam-train.png](../public/images/doodles/doodle-06-steam-train.png)                         | A line-drawn steam train and figures          | `Property 1=Variant6.png`    |
| 07  | [doodle-07-yellow-streaks.png](../public/images/doodles/doodle-07-yellow-streaks.png)                   | A figure with yellow streaks                  | `Property 1=Variant7.png`    |
| 08  | [doodle-08-sleepy-and-wide-eyed.png](../public/images/doodles/doodle-08-sleepy-and-wide-eyed.png)       | Two faces, one sleepy and one wide-eyed       | `Property 1=Variant8.png`    |
| 09  | [doodle-09-rainbow-arc.png](../public/images/doodles/doodle-09-rainbow-arc.png)                         | A large rainbow arc and an outlined figure    | `Property 1=Variant9.png`    |
| 10  | [doodle-10-magnifying-glass-sketch.png](../public/images/doodles/doodle-10-magnifying-glass-sketch.png) | Figures and a magnifying glass                | `Property 1=Variant10.png`   |
| 11  | [doodle-11-riverside-city.png](../public/images/doodles/doodle-11-riverside-city.png)                   | A figure beside a river and city buildings    | `Property 1=Variant11.png`   |
| 12  | [doodle-12-gray-and-black-blocks.png](../public/images/doodles/doodle-12-gray-and-black-blocks.png)     | Gray and black blocks on a pale ground        | `Property 1=Variant12.png`   |
| 13  | [doodle-13-desk-and-music-note.png](../public/images/doodles/doodle-13-desk-and-music-note.png)         | A desk, a music note, and blue shapes         | `Property 1=Variant13.png`   |
| 14  | [doodle-14-reclining-figure.png](../public/images/doodles/doodle-14-reclining-figure.png)               | A reclining figure against a red background   | `Property 1=Variant14.png`   |

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

Nine locally generated SVGs in `public/images/icons/` come from the Remix Icon collection distributed by `@iconify-json/ri`. The installed collection metadata identifies Remix Design as the author and Apache-2.0 as the license: [collection source and license](https://github.com/cyberalien/RemixIcon/blob/master/License). The package metadata also declares Apache-2.0; this does not change ownership or licensing of the original personal artwork.

`scripts/generate-icons.mjs` exports `github-line`, `soundcloud-line`, `translate-2`, `linkedin-box-line`, `arrow-left-line`, `arrow-right-line`, `arrow-right-up-line`, `pause-line`, and `play-line` as 24 × 24 SVGs with the interface ink color. Regenerate them with `node scripts/generate-icons.mjs` after intentionally changing the source selection or export styling. They are interface assets, not replacements for the custom wordmark or monogram.

## Presentation And Content

- Use the original wordmark and monogram as brand artwork; use Remix Icon for interface symbols.
- Write descriptive alternative text in each supported site language when implementing image presentation. These inventory descriptions are not final localized alternative text.
- Keep original source files intact; any future derivatives should have distinct filenames.
- Check actual display widths before requesting higher-resolution exports.
- Collect actual project screenshots or representative project images after selecting the portfolio entries. The personal doodles are not software UI previews.

For page behavior and visual decisions, see the [product plan](plan.md).
