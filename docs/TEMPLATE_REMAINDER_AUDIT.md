# Template remainder audit

Scope: the six `legacy-pages/*.html` files, their matching
`public/content/pages/*.json` documents, the homepage `blocks` array, and all
image URLs referenced by those records. This is a content cleanup only; CSS,
animation classes, layout classes, and public routing were not removed.

## A — Confirmed OutbreakSafe (kept)

- OutbreakSafe hero wording: “A clearer understanding of your environment.”
- “What We ENABLE” and its Device Integration, Cloud Interpretation, and
  Advanced Materials Science sections.
- “Our Technology” with Environmental Detection, Data Intelligence, and
  Applied Integration.
- Mission copy, the OutbreakSafe team names/roles/photos, and the contact CTA.
- Existing page navigation to Home, About, Platform, Services, Contact, and
  Privacy Policy.
- Existing logo, team, technology, interface, and CTA image records. Their
  `website-files.com` URLs are preserved because the URL provenance alone does
  not prove that an image is template residue and the images are used by the
  active OutbreakSafe content/Blocks.

## B — Obvious template residue removed

- Homepage Blocks `imageText` section whose heading was
  “Our Ai- Driven logistics fuels agile global supply chains.”
- The matching homepage legacy inline image/text content was removed without
  removing the surrounding “Our Technology” heading or CTA.
- Homepage CTA heading “Moving Your Business Forward” was removed; the
  legitimate “Let’s Connect” / “Contact Us” CTA remains.
- Dummy address `123 Main St, San Francisco, CA 94105` from the legacy pages
  and JSON documents.
- `mailto:info@transit.com` placeholder links and their visible “Send Us A
  Message” entries.
- Placeholder/dead Careers and Newsroom navigation/footer links.
- Exposed Styleguide and License footer links.
- Homepage-only template links/sections were removed from both the active
  legacy source and the editable JSON model. No replacement business details
  were invented.

## C — Uncertain; retained for manual review

- Broader freight/logistics wording and Fleet-branded copy on About, Platform,
  and Services, including text containing “Fleet”, “freight forwarding”, and
  “global logistics”. These are suspicious in provenance, but the repository
  does not establish whether any were intentionally retained for an
  OutbreakSafe page. They were not deleted automatically.
- Stock/hashed `website-files.com` image URLs whose visual role cannot be
  proven from the URL alone. They remain in the existing page records unless
  they belonged to the removed homepage freight section. Homepage technology
  Block image records remain available for editing and review.
- Remaining hidden Webflow-derived wrappers, animation classes, and unused
  styling classes. They are not content by themselves and may support the
  preserved layout/animation system.
- Any historical Careers/Newsroom references in non-homepage provenance that
  are not visible after the placeholder cleanup should be reviewed before
  broader page cleanup.

## Homepage result

- Homepage Blocks before cleanup: 7.
- Homepage Blocks after cleanup: 6.
- Remaining Blocks: hero, feature cards, technology grid, mission rich text,
  team grid, and CTA.
- The legacy homepage still contains the intended OutbreakSafe hero,
  technology, mission, team, and CTA structure. The public catch-all renderer
  and all CSS/animation definitions remain unchanged.

## Mapping and validation notes

- Removed placeholder records were removed from the matching JSON arrays and
  their visible legacy elements, preserving `data-cms-id` parity for active
  legacy content. Homepage technology images used by Blocks remain as
  Blocks-managed fields even where their old legacy subsection was removed.
- The existing Tina `content`, `links`, and `images` fallback model remains in
  place. Blocks continue to use list fields for add/delete/reorder operations.
- No credentials, DNS, Vercel settings, schemas outside the homepage Blocks
  extension, or public route definitions were changed.
