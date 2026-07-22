# Revenue Foundations — Design Philosophy

The failure mode to escape: **it looks like a website builder.** Centered heroes,
a decorative gradient blob that clips at a section edge, pill tags, a "hero +
three cards" template, everything the same weight. That reads generic and cheap.

Revenue Foundations is a **research publication for operators**. It should feel
closer to *Stripe Press*, an academic journal front page, or a design studio's
own site than to a SaaS landing page. The credibility IS the design.

## Seven principles

1. **It's print, rendered in a browser.** Think page, not screen. A masthead, a
   measure, hairline rules, a baseline that feels typeset. Layout decisions come
   from editorial design, not from component libraries.

2. **Type carries the page — nothing else has to.** One authoritative serif
   (display + reading) against one precise grotesque (labels, data, captions).
   Large scale contrast: a real headline is *much* bigger than body, and small
   text is genuinely small and tracked. If you removed every color and image the
   page should still look expensive.

3. **Ink on paper. Green is punctuation, never atmosphere.** Near-monochrome.
   The emerald appears as a rule, a link, the mark — a few square centimeters per
   screen, not an ambient wash. If it looks like "the green website," it's wrong.

4. **No decorative object may clip.** Anything visual either (a) is full-bleed
   and continuous so it *can't* have an amateur cut-off, or (b) is a real
   contained figure with intentional margins. A gradient that dies at a section
   border is banned. Motion, if present, is a quiet ambient property of the whole
   page — fixed, behind everything — or it doesn't exist.

5. **Asymmetry and grid, not centered stacks.** Use a real editorial grid:
   wide/narrow columns, a dominant featured item, an index that looks like an
   index. Avoid the symmetrical "everything centered in a 1100px column" default.

6. **Structure encodes meaning.** Numbered papers, citation lines (Vol · No),
   hairline dividers, an author line with affiliation. Devices are there because
   they're *true* (a citation, a sequence), never as decoration.

7. **Restraint is the flex.** Fewer borders, fewer boxes, fewer effects, more
   whitespace and better type. When in doubt, delete the box and set the type
   better. No pills. No drop shadows doing the work type should do.

## Motion doctrine

Default is **no motion**. If motion earns its place it must be:
- **Full-bleed and fixed** (a property of the page, never a clipped object),
- **Neutral** (tonal, not colored — no green field),
- **Barely there** (a slow drift you notice only if you look), and
- **Free** (respect `prefers-reduced-motion`; never block reading).

A moving thing that reads as "a blob" has failed. Prefer an ambient tonal field
or nothing.

## Test case (this commit)

The **homepage** is the test case. Success criteria, checked against the live
render — not asserted:
- [ ] No clipped decorative element anywhere.
- [ ] Green covers only a few cm² per screen (rule/link/mark).
- [ ] The masthead reads as a publication front page (rules, scale, an index),
      not a centered hero with three cards.
- [ ] Type hierarchy is obvious with color removed.
- [ ] If motion exists, it is full-bleed, fixed, neutral, and unobtrusive.

If a change can't satisfy these, it doesn't ship.
