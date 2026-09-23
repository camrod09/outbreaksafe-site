# Homepage Tina Blocks

## Scope

Only `public/content/pages/index.json` has an optional `blocks` list. The public
catch-all continues to serve the verified legacy HTML for every route, including
`/`; no legacy content arrays, routes, animation markup, or generated Tina files
were removed or replaced.

The homepage Tina preview selects the React block renderer only when `blocks` is
present. All other preview routes, and a homepage document without `blocks`, use
the existing annotated legacy renderer.

## Initial migration mapping

`scripts/migrate-homepage-blocks.py` creates the deterministic initial list from
the existing homepage JSON fields: hero heading/CTA/image; enable feature cards;
technology cards; the existing technology image/text/CTA; mission; editable team
member cards; and the existing closing CTA. The original `content`, `links`, and
`images` records remain the fallback and source-of-record for legacy/public HTML.

## Limitations

Blocks are constrained editorial components, not a reconstruction of the
Webflow-derived page. The preview uses existing CSS class names where appropriate,
but cannot guarantee pixel- or animation-parity with the legacy page. Public pages
therefore intentionally retain the legacy renderer. Block text is rendered as
plain React text (rather than arbitrary HTML); use separate blocks for structure.

The preview-only CTA rule disables pointer events on `.button-background` under
`.tina-preview-root` so its absolute background cannot intercept Tina selection;
public CSS and CTA behavior are unchanged.
