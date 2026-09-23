# Tina editability audit

Audit scope: the six existing public pages, their preserved `legacy-pages/*.html`, and the matching `public/content/pages/*.json`. Stable `data-cms-id` values were compared against all three Tina arrays. Split-word child spans are intentionally not separate fields; their parent heading is one `mode: "splitWords"` field.

| Page | Editable text fields | Editable image fields | Editable link fields | Previously unmapped elements | Remaining intentionally non-editable elements | Known limitation |
| --- | ---: | ---: | ---: | --- | --- | --- |
| Homepage | 76 | 13 | 27 | None; 6 split-word child spans are grouped into one heading field | Decorative SVG/slider controls and structural wrappers | Image alt values are editable as part of each image record |
| About | 102 | 26 | 27 | None; 8 split-word child spans are grouped into two heading fields | Decorative SVG/slider controls and structural wrappers | Partner/logo images have generic source imagery but meaningful editor labels |
| Platform | 61 | 10 | 26 | None; 6 split-word child spans are grouped into two heading fields | Decorative SVG/slider controls and structural wrappers | Highlight illustrations remain image records for safe replacement |
| Services | 67 | 10 | 34 | None; 6 split-word child spans are grouped into two heading fields | Decorative SVG/slider controls and structural wrappers | Industry tab images remain image records without changing tab behavior |
| Contact | 37 | 1 | 26 | None; 2 split-word child spans are grouped into one heading field | Decorative SVG/slider controls and structural wrappers | Form controls remain functional website UI rather than CMS schema fields |
| Privacy Policy | 44 | 0 | 25 | None | Structural wrappers and decorative elements | No content images exist on this page |

## Mapping checks

- Every JSON `content`, `links`, and `images` `cmsId` exists in its matching legacy HTML.
- Every intended visible text leaf, heading, paragraph, label, button, navigation/footer text, and link target has a stable `data-cms-id`.
- Image `src` and `alt` values are represented in the matching image record and receive Tina field metadata in the preview.
- Link `href` values are represented in the matching link record and are applied by the live preview update path.
- Split-word headings remain a single human-readable Tina field; the preview updates existing word spans in place so the animation markup is preserved.
- Editor labels were improved in the JSON metadata only; visible page text and layout were not changed.

## Validation

`npm run cms:audit` passes for all six documents. Standalone Next.js builds and preview-route smoke tests pass in the local Tina development environment. Authenticated TinaCloud save/click verification requires the configured Tina/Vercel environment.
