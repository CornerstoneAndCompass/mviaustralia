# Shared theme

This folder is the visual system for Missionary Ventures office sites. Australia uses it now. Motivate New Zealand (and any later office) should reuse it unchanged and supply its own pages.

## What is shared

- `tokens.css` holds colour, type, and spacing. Colours match the MV Brand and Style Guide (May 2026).
- `base.css` is the element reset and type defaults.
- `layouts.css` is the page skeleton: container, bands, and the split grids.
- `components.css` is the letterhead, navigation, buttons, lists, forms, news rows, footer, and the questions panel.
- `theme.css` imports the four files above. Link that one file from each page.
- `../js/theme.js` is behaviour only: menu, donation amount buttons, the questions panel, and the contact note. It reads `window.SITE` and does not contain office names, phone numbers, or currency.

## What stays with the office

- Every HTML page, including the header wordmark line ("Australia"), postal address, phone, email, charity registration, bank details, and news.
- `../js/au-site.js`, which sets `window.SITE` (phone, email, and the written answers). New Zealand should copy that file to `js/nz-site.js`, change the object, and point its pages at it.
- Photographs and the wordmark in `../img/`. The wordmark is the international mark. The office name sits beside it in HTML, not inside the image, so another office can keep the mark and change one line of text.

## Starting the New Zealand site

1. Copy `theme/` and `js/theme.js`.
2. Copy `js/au-site.js` to `js/nz-site.js` and replace the phone, email, and answers.
3. Build pages with the same class names. A masthead is `header.page-mast`. A full-width band is `section.band`, with `band-white`, `band-sand`, or `band-navy` when the ground should change. Short titles use `class="display"`. Long sentences stay in the body serif.
4. Load the styles and scripts from the page head and end of body:

```html
<link rel="stylesheet" href="theme/theme.css">
<script src="js/nz-site.js" defer></script>
<script src="js/theme.js" defer></script>
```

5. If a licensed Futura Condensed file is available, override only the token:

```css
:root { --font-display: "Futura Condensed", "Barlow Condensed", sans-serif; }
```

Load that file after `theme.css`. Do not copy component rules into the office stylesheet to change a colour.

## Type and colour

Display type is Barlow Condensed, a stand-in for Futura Condensed. Body type is Source Serif 4. Brand gray and olive are for rules and the logo, not for small text: gray on cream does not meet contrast. Body text uses navy. The red is `#ca374b`.

## Markup notes

- One `h1` per page. The home page `h1` is the opening sentence, not a slogan stacked in three coloured lines.
- Buttons are rectangular. `.btn-primary` is the single filled action. `.btn-text` is the second action.
- Do not add a glass blur, a gradient overlay, an icon-font CDN, or a pulsing chat bubble. The questions panel is a set of written answers and is optional. Leave it out of a page by omitting the `#questions` markup.
- The contact form does not post anywhere. `theme.js` tells the reader to use the office email from `window.SITE` rather than claiming a message was sent.
