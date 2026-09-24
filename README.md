# OutbreakSafe website

Next.js website with TinaCMS-managed content and reusable React page sections.

The public website is deployed through Vercel. Website content and code live in this
GitHub repository.

## The easiest way to edit the website

There are two ways to edit the site:

### 1. TinaCMS — use this for normal content changes

Open:

`https://www.outbreaksafe.com.au/admin/`

Use Tina for things such as:

- changing text
- replacing images
- editing links and buttons
- changing SEO text
- adding, removing, or reordering supported page sections

If Tina already lets you make the change you want, use Tina. It is the easiest option.

### 2. GitHub Codespaces + GitHub Copilot — use this for interface/design changes

Use Codespaces when you want to change the actual website interface, for example:

- add a new type of section
- change a layout
- move interface elements
- change spacing or sizing
- add new image treatments
- change responsive/mobile behaviour
- modify buttons, cards, menus, backgrounds, or animations
- ask AI to build a website feature for you

You do **not** need to install coding software on your computer. Codespaces opens a
cloud development computer in the browser, and GitHub Copilot can make the code
changes for you.

---

# Beginner guide: editing the website with GitHub Codespaces + Copilot

This section is written for someone who has never used GitHub before.

## Step 1 — Open the website repository

Go to the OutbreakSafe website repository on GitHub:

`camrod09/outbreaksafe-site`

Make sure you are looking at the **Code** tab.

## Step 2 — Open a Codespace

1. Click the green **Code** button.
2. Select the **Codespaces** tab.
3. Click **Create codespace on main**.
4. GitHub will open a browser-based version of VS Code.

A Codespace is simply a cloud computer containing a copy of the website.

**Important:** changing files inside the Codespace does not immediately change the
live website.

## Step 3 — Create a safe editing branch

Do not make interface experiments directly on `main`.

Open the terminal at the bottom of Codespaces and run:

```bash
git status
git switch -c website-edit
```

If `website-edit` already exists, use another simple name, for example:

```bash
git switch -c website-edit-september
```

Think of a branch as a safe copy of the website where you can make changes without
breaking the live site.

## Step 4 — Start the website preview

In the terminal run:

```bash
npm install
npm run dev
```

Codespaces should detect the development server on port `3000`.

Open the forwarded port when GitHub offers it. This gives you a private preview of
the website while you edit it.

Leave `npm run dev` running while you work.

## Step 5 — Open GitHub Copilot

In Codespaces:

1. Open the **Chat / Copilot** panel.
2. Use **Agent** mode when available.
3. Describe the website change in normal English.

You do not need to tell Copilot exactly which files to edit. Describe the result you
want and tell it to inspect the existing site before making changes.

A good general prompt is:

> Inspect the existing OutbreakSafe website before changing anything. Preserve the
> current branding, typography, responsiveness and TinaCMS editing. Make only the
> requested interface change. Reuse existing components and CSS where practical.
> Do not change DNS, Vercel settings, environment variables, credentials or Tina
> configuration unless the task specifically requires it. Run the relevant checks
> when finished and tell me exactly which files you changed.

## Examples of things you can ask Copilot

### Change a layout

> Make the Team section use three columns on desktop, two columns on tablet and one
> column on mobile. Keep the existing photos, text, styling and Tina editing.

### Add a new section

> Add a new section below Our Technology with a heading, paragraph, image and CTA
> button. Match the existing OutbreakSafe design and make every field editable in
> Tina. Do not change any other section.

### Change a background

> Replace the background treatment of the CTA section with a full-width image,
> preserving the existing overlay, typography, button and mobile layout.

### Fix something visually

> The homepage CTA is sitting behind another element and cannot be clicked. Inspect
> the actual stacking context and pointer-events, fix only the obstruction, and
> preserve the existing design.

### Make a mobile change

> On mobile only, reduce the homepage hero heading size and increase the spacing
> below the CTA. Do not change desktop or tablet.

---

# Adding a new image through Codespaces

For normal image replacement, TinaCMS is usually easier.

If an image needs to be added as part of an interface/code change:

1. In the left-hand **Explorer**, open the `public` folder.
2. Create a `media` folder if one does not already exist.
3. Drag the image from your computer into `public/media/`.
4. Give the file a simple name, for example:

```text
public/media/lab-sensor.jpg
```

5. Ask Copilot to use it:

> Use `/media/lab-sensor.jpg` as the image for the new section. Keep it responsive,
> use appropriate object-fit behaviour, add useful alt text, and make the image
> replaceable through Tina if this section is Tina-managed.

Files inside `public/` are available from the website root, so:

```text
public/media/lab-sensor.jpg
```

becomes:

```text
/media/lab-sensor.jpg
```

Do not upload passwords, API keys, tokens, private certificates, patient data, or
other secrets into the repository.

---

# How to review what Copilot changed

Before publishing anything:

1. Look at the website in the Codespaces preview.
2. Check the page on both a wide and narrow browser window.
3. Click important buttons and links.
4. Check that Tina-managed content still works if the change affects editable
   sections.
5. Ask Copilot:

> Review your own changes for regressions. Check desktop, tablet and mobile
> behaviour. Do not make unrelated changes.

You can also ask:

> Summarise exactly what you changed in plain English for a non-developer.

## Run the website checks

Before publishing, run:

```bash
npm run cms:audit
npm run build
```

Both should complete successfully.

If either command fails, paste the error into Copilot and ask it to fix the cause
without changing unrelated parts of the website.

---

# Saving your work to GitHub

When the preview looks correct, either ask Copilot to commit and push the branch,
or run:

```bash
git status
git add .
git commit -m "Describe the website change"
git push -u origin website-edit
```

Use a useful commit message, for example:

```text
Improve homepage team layout
```

or:

```text
Add laboratory applications section
```

## Do not force-push

Never use:

```bash
git push --force
```

for normal website editing.

---

# Publishing the change

After pushing the branch:

1. Open the repository on GitHub.
2. GitHub will normally offer to create a **Pull Request** for the branch.
3. Create the Pull Request.
4. Review the Vercel preview deployment if one is shown.
5. Confirm the preview looks correct.
6. Merge the Pull Request into `main`.

After the merge, Vercel deploys the updated `main` branch to the public website.

In simple terms:

```text
Codespace
   ↓
editing branch
   ↓
GitHub Pull Request
   ↓
Vercel preview
   ↓
merge to main
   ↓
live website
```

---

# If something goes wrong

Do not panic and do not start deleting files.

The safest response is to tell Copilot exactly what happened, for example:

> The page worked before this change and now the navigation is broken. Inspect the
> Git diff and identify which of your changes caused it. Revert only the broken
> part and preserve the rest of the work.

Useful commands:

```bash
git status
git diff
```

These show what has changed without deleting anything.

If you are unsure, stop before merging the Pull Request. The live site remains on
`main` until the change is merged.

---

# What a non-developer should normally avoid changing

Unless the task specifically requires it, do not manually edit:

- `.env` or environment variables
- TinaCloud tokens or client credentials
- Vercel project settings
- DNS/domain settings
- `next.config.js`
- deployment configuration
- generated Tina files
- Git history
- old rollback/reference files in `legacy-pages/`

If a change appears to require one of these, ask a developer or ask Copilot to
explain why before proceeding.

---

# Useful rule of thumb

Use **TinaCMS** when the question is:

> "I want to change what the page says or which image it uses."

Use **Codespaces + Copilot** when the question is:

> "I want to change how the website looks or behaves."

For larger changes, always use a branch and review the Vercel preview before
merging to `main`.

---

## Local development commands

Start the standard development server:

```bash
npm run dev
```

Run Tina locally around the development server:

```bash
npm run cms:dev
```

Audit Tina content:

```bash
npm run cms:audit
```

Build the complete production site:

```bash
npm run build
```

## Tina editor build notes

The production build runs:

```text
tinacms build && next build
```

The generated Tina admin bundle under `public/admin/` is intentionally ignored by
Git. Vercel generates it during the production build using the configured
environment variables.

Never commit `TINA_TOKEN`, API keys, passwords, or other credentials.

## Regenerating the legacy content map

If one of the remaining legacy pages changes substantially, the content map can be
regenerated with:

```bash
npm run content:generate
npm run cms:audit
```

Review the generated changes carefully before committing them.
