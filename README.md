# OutbreakSafe website

Next.js site that serves the verified legacy page markup at the clean public
URLs, with page content managed through TinaCMS.

Run `npm run dev` to view the home page locally. The source markup lives in
`legacy-pages/`; public CSS, scripts, editor assets, and Tina JSON live in
`public/`.

## Editing content

Open `https://www.outbreaksafe.com.au/admin/`, sign in, and select **Website Pages**. Each document controls the text, links, images, and search metadata for its matching page. Saving in Tina commits the JSON content change to GitHub; the deployment then publishes it.

The original HTML remains in each page as a fallback, so the public site still renders if a content JSON request fails. The browser applies the matching file from `/content/pages/` through `cms-content.js` while preserving the existing layout and animation code.

## Updating the Tina editor

When `tina/config.ts` changes, rebuild the production editor with the TinaCloud client ID and a content token, then commit the generated `public/admin/` assets:

```powershell
$env:NEXT_PUBLIC_TINA_CLIENT_ID="<client-id>"
$env:TINA_TOKEN="<content-read-only-token>"
npm run cms:build
git add public/admin tina/config.ts public/content/pages public/cms-content.js legacy-pages
git commit -m "Update TinaCMS editor"
git push origin main
```

The content token is only needed while building and must not be committed.

## Regenerating the content map

If the HTML structure changes substantially, run `npm run content:generate`, review the resulting JSON, and run `npm run cms:audit` before committing.
