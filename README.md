# OutbreakSafe website

Static website prepared for GitHub Pages, with page content managed through TinaCMS.

Open `index.html` to view the home page locally.

## Editing content

Open `https://www.outbreaksafe.com.au/admin/`, sign in, and select **Website Pages**. Each document controls the text, links, images, and search metadata for its matching page. Saving in Tina commits the JSON content change to GitHub; GitHub Pages then publishes it.

The original HTML remains in each page as a fallback, so the public site still renders if a content JSON request fails. The browser applies the matching file from `content/pages/` through `cms-content.js` while preserving the existing layout and animation code.

## Updating the Tina editor

When `tina/config.ts` changes, rebuild the production editor with the TinaCloud client ID and a content token, then commit the generated `admin/` assets:

```powershell
$env:NEXT_PUBLIC_TINA_CLIENT_ID="<client-id>"
$env:TINA_TOKEN="<content-read-only-token>"
npx.cmd tinacms build
git add admin tina/config.ts content/pages cms-content.js *.html
git commit -m "Update TinaCMS editor"
git push origin main
```

The content token is only needed while building and must not be committed.

## Regenerating the content map

If the HTML structure changes substantially, run `python scripts/generate-tina-content.py`, review the resulting JSON, and run `npx tinacms audit` before committing.
