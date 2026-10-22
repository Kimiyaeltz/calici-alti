# Calici Alti brand guideline (v2, bolder)

Live version: the Calici Alti design system on claude.ai. This file is a copy for Claude in VS Code. `brand-tokens.json` has every value, `brand-components.css` the ready-made styles.

## Colours

| Token | Light | Dark | Use |
|---|---|---|---|
| `bg` | #ffffff | #100e0d | Page background. White like the tablecloths by day; the black of the sign in the dark theme. |
| `bg-lino` | #f3efe8 | #1b1816 | Paper panels: menu cards, form fields, the text side of a split. Never a whole page. |
| `nero` | #100e0d | #100e0d | The black of the arched sign. Full-width bands (hours, contact, footer) and the logo ground. Same in both themes. |
| `ink` | #151210 | #f4efe7 | Headlines and body text on `bg` and `bg-lino`. |
| `ink-muted` | #5f5852 | #b7aea4 | Dish descriptions, captions, secondary lines on `bg` and `bg-lino`. |
| `on-nero` | #f4efe7 | #f4efe7 | Text on `nero` bands and over dark photos. |
| `line` | #e4ddd2 | #35302c | Hairline dividers between menu items and sections. Never for controls. |
| `rosso` | #a3191f | #c42b33 | Wine red. Full-bleed hero and poster bands, giant headline type, the primary button, the red block behind one photo. Used boldly, not as a trace. |
| `bordeaux` | #4e0f14 | #4e0f14 | Deep wine. Full-bleed poster bands (like the Lolo reference), the menu page ground, the footer. Text on it is `on-nero`; giant type on it is `rosso` or `oro-on-nero`. |
| `rosso-text` | #a3191f | #f0837b | Red text and links on `bg` and `bg-lino`: prices, the accent word, hover states. |
| `on-rosso` | #ffffff | #ffffff | Text and icons on a `rosso` fill. |
| `oro` | #c29a55 | #d2ad69 | Champagne gold for the ring, its dot and hairline rules only. Decorative: on white it is 2.6:1, so never use it for text or for anything that must be read on `bg`. |
| `oro-text` | #866326 | #d9b878 | Gold text: eyebrows and small labels on `bg` and `bg-lino`. Body copy is never gold. |
| `oro-on-nero` | #d2ad69 | #d2ad69 | Gold text, rules and the ring on `nero` bands (9:1). |
| `focus` | #a3191f | #f0837b | Keyboard focus ring: 2px solid, 3px offset, on every interactive element. |

## Fonts (Google Fonts)

- Display: **Gloock** 400. Headlines and giant poster type.
- Script: **Pinyon Script** 400. One accent word per page.
- Sans: **Instrument Sans** 400, 500, 600. Everything else.

| Style | Size / line height | Use |
|---|---|---|
| `display-poster` (display) | 240px / 0.82 | Giant type that sits behind or around a plate photo, edge to edge (hero, poster bands). Uppercase. clamp(96px, 19vw, 280px). One per page. |
| `display-xl` (display) | 120px / 0.9 | Page titles, uppercase, often in `rosso`. clamp(64px, 10vw, 140px). |
| `display-l` (display) | 72px / 0.95 | Section headlines, sentence case. clamp(44px, 6vw, 80px). |
| `display-m` (display) | 40px / 1.05 | Card and event titles. |
| `script-accent` (script) | 72px / 1 | ONE script word or short phrase per page, overlapping a headline or photo edge, in `oro` on dark or `rosso-text` on white (Seppe, Little Italy). Never sentences, menus or buttons. clamp(40px, 6vw, 88px). |
| `eyebrow` (sans) | 13px / 16px | Uppercase labels above headlines and in poster corners. |
| `lede` (sans) | 21px / 31px | One or two intro sentences. Max 40 characters wide. |
| `body` (sans) | 17px / 28px | Running text. Max 60 characters wide. |
| `menu-item` (sans) | 20px / 27px | Dish names, category names, lists. |
| `small` (sans) | 15px / 22px | Dish descriptions and captions in `ink-muted`. |
| `button` (sans) | 14px / 16px | Buttons and nav, uppercase. |

## Spacing and radius

- `space-1` 4px: Icon to label.
- `space-2` 8px: Eyebrow to headline; name to description in a menu item.
- `space-3` 16px: Inside buttons (vertical), between menu items, mobile side gutter.
- `space-4` 24px: Headline to lede; between buttons; card padding.
- `space-5` 40px: Lede to buttons or content; desktop gutter between columns.
- `space-6` 64px: Section padding on mobile; desktop side gutter.
- `space-7` 104px: Section padding on desktop. Clamp it down so each section still fits one screen.
- `radius-none` 0: Photos, bands, buttons, cards. The brand is square.
- `radius-sm` 2px: Form fields and tabs only.
- `radius-round` 50%: The plate photo inside the ring, the ring's dot, and round plate cut-outs.
- `hairline` 1px: Rules, dividers and the ring stroke.
- `header-h` 72px: Fixed header height. Sections fit calc(100svh - header-h); anchors use it as scroll-margin-top.
- `measure` 64ch: Max width of running text.


Calici Alti is a restaurant in the historic centre of Lucca, at Via San Giorgio 36, behind a stone arch with a black and gold sign. It serves Tuscan cooking made to order, fish and meat, fresh pasta with truffle, and good wine. "Calici alti" means raised glasses: the brand is a toast. It should look like a bold Italian poster set on a white tablecloth: big red type, generous white space, black and gold details. Clean, never quiet to the point of plain.

## Voice

- Italian first, English as a switch. Address guests as *tu*, warm and short: "Ti aspettiamo", "Prenota il tuo tavolo".
- Say what is on the plate, in plain words: "Pasta fresca fatta in casa e tartufo grattugiato al momento."
- Use the restaurant's own lines: "Un angolo nascosto nel cuore di Lucca", "Cucina toscana tradizionale, preparata espressa", "Un ambiente unico dove fermarsi e godersi il momento".
- Do: one or two sentences per section, dish names as on the menu, prices as `18 €` (IT) and `€18` (EN).
- Don't: emoji, em dashes, superlatives, marketing words ("esperienza unica").

## Colour

- Four colours carry the brand: white `bg`, wine red `rosso`, deep wine `bordeaux`, black `nero`, with `oro` gold as the detail.
- Use red boldly: a full-bleed `rosso` hero or poster band, giant headline type in `rosso` on white, a `rosso` block behind a photo. Each page gets at least one big red moment.
- `bordeaux` is for one poster band per page at most (giant `rosso` type on `bordeaux`, like the Lolo reference) and may be the footer.
- `nero` is the sign: the header on dark pages, the hours band, the logo ground.
- `oro` is the ring, its dot, hairlines and the script accent on dark grounds. Gold text on white is `oro-text`.
- White space is part of the palette: keep about half of every page white, so the red blocks read as deliberate.
- Never the browser's default blue.

## Type

- **Gloock** (display): a bold, high-contrast editorial serif, like the Da Maria reference. `display-poster` for giant edge-to-edge words, `display-xl` for page titles (uppercase), `display-l` for section headlines (sentence case), `display-m` for cards.
- **Pinyon Script** (script): ONE accent word per page ("Ristorante", "Buon appetito", "Salute"), overlapping a headline or the edge of a photo, in `oro` on dark or `rosso-text` on white. It echoes the script in the logo. Never for sentences, menus, buttons or prices.
- **Instrument Sans** (sans): everything else. `lede`, `body`, `menu-item`, `small`, `eyebrow`, `button`.
- Menus, lists and prices are always the sans.
- Load from Google Fonts: Gloock, Pinyon Script, Instrument Sans 400, 500, 600.

## Layout

- No section is taller than one screen, but never stretch a section to fill the screen: its height comes from its content plus `space-7` padding. Never leave an empty band.
- The home page is the hero plus at most three sections and the footer.
- Mix layouts so each section feels different: a full-bleed poster band, a split with a photo on a red block, a 2 by 2 photo grid with a plate in the middle. Never three identical splits in a row.
- Let type and photos overlap: the plate sits on top of the giant word, the script word crosses the photo edge.
- Square corners (`radius-none`), no shadows. Thin `rosso` frame lines (`ca-frame`) can edge one editorial block per page, like Da Maria.
- Long content (menu, events) sits in one screen with tabs. The tabs are visible in the first screen of the menu page.

## The signature moves

1. **Plate on giant type** (Lolo, Pomodoro): a top-down plate cut-out sits centred over `display-poster` letters ("CALICI" on one line, "ALTI" on the next) on a `rosso` ground, with small `eyebrow` labels in the corners ("Via San Giorgio 36", "Lucca", "dal 2025"). This is the home hero.
2. **The ring** (`PlateRing`, La Luce): a thin `oro` ring with one dot around a round plate photo, with the address running around it. Once per page, on white or `nero`.
3. **Red block** (Zia Sonia): a photo set on an offset `rosso` block. Once per page.
4. **Quad grid** (Pomodoro): four close-up texture photos in a 2 by 2 grid with a round plate photo overlapping the centre.
5. **Running name** (Pomodoro Popolare): a slow horizontal ticker of "Calici Alti · Lucca ·" in `display-xl` over a dark photo or `bordeaux`, between two sections. At most once per site.

Use two or three of these per page, never all five. Motion: the ring draws itself once, the ticker scrolls slowly, sections fade up 16px. Respect `prefers-reduced-motion`.

## Photography

- Use the restaurant's own photos. The professional set has white tablecloths, daylight, engraved Calici Alti glasses and red roses: bright, clean, true reds.
- Top-down plates (panzanella, pesce, vitello tonnato) go on giant type, in the ring or in the quad grid centre. 45° shots go in splits and on red blocks.
- The older phone photos on beige linen are only used small, or in the quad grid as textures.
- Event photos with balloons are for the events page only.
- No stock photos, no AI-generated images.

## Iconography

Thin line icons, 1.5px stroke, in `ink` or `on-nero`: Phosphor Light or Lucide. Optional: one hand-drawn line illustration per page (a wine glass, a fork, a plate), in a single `ink` or `rosso` stroke, like the sketches in the Da Maria and Little Italy references.

## Logo

No logo file is in this system yet (the old site has only a 300 by 220 px JPG). The real mark is a gold brush circle with "Calici" in script and "ALTI" in spaced capitals, on black. Until a vector file arrives, set the name as text: "Calici" in `script-accent` and "ALTI" in the sans, uppercase, `0.3em` tracking, stacked. Never redraw the brush circle.

## Accessibility

- Every text pair holds 4.5:1 in both themes; giant poster type on `rosso` or `bordeaux` is decorative and must not carry information alone.
- Focus: 2px solid `focus` ring, 3px offset.
- Phone and WhatsApp numbers are real links in brand colours.
