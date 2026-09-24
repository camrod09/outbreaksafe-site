# Homepage Blocks Migration

## Renderer change

The previous public homepage renderer was:

```
pages/[[...slug]].js -> legacy-pages/index.html
```

The homepage now has an explicit Pages Router route:

```
pages/index.js -> public/content/pages/index.json -> components/Homepage.js -> components/blocks/Blocks.js
```

`components/Homepage.js` is the single shared renderer used by both the public
homepage and the Tina homepage preview. It renders the page's block list through
`Blocks`; Tina's live `useTina` data therefore uses the same component tree for
edits, additions, deletions, reordering, and media changes. The legacy optional
catch-all is now the required catch-all `pages/[...slug].js`, so it continues to
serve the same non-homepage routes without conflicting with `pages/index.js`.

All non-homepage routes remain handled by `pages/[...slug].js` and their legacy
HTML sources.

## Rollback

`legacy-pages/index.html` is retained as the verified reference and rollback
source. To roll back this migration, either revert the migration commit or remove
`pages/index.js` and restore `pages/[...slug].js` to the optional catch-all name
`pages/[[...slug]].js`; it will then resume handling `/` from
`legacy-pages/index.html`. Revert the shared-preview changes in the same operation
if the legacy homepage preview is also required.

## Migration commit

This migration is committed with message `Make Tina Blocks the canonical homepage`.
The legacy homepage source remains in `legacy-pages/index.html` after the migration.
