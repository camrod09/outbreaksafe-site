import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  // Uncomment to allow cross-origin requests from non-localhost origins
  // during local development (e.g. GitHub Codespaces, Gitpod, Docker).
  // Use 'private' to allow all private-network IPs (WSL2, Docker, etc.)
  // server: {
  //   allowedOrigins: ['https://your-codespace.github.dev'],
  // },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/r/content-modelling-collections/
  schema: {
    collections: [
      {
        name: "page",
        label: "Website Pages",
        path: "public/content/pages",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
          router: ({ document }) => {
            const filename = document?._sys?.filename || document?._sys?.basename || "index";
            const normalizedFilename = filename.replace(/\.json$/, "");
            const previewPage = {
              index: "home",
              about: "about",
              platform: "platform",
              services: "services",
              contact: "contact",
              "privacy-policy": "privacy-policy",
            }[normalizedFilename] || "home";
            return `/tina-preview/${previewPage}`;
          },
        },
        fields: [
          {
            type: "string",
            name: "name",
            label: "Page",
            isTitle: true,
            required: true,
          },
          {
            type: "object",
            name: "seo",
            label: "Search and sharing",
            fields: [
              { type: "string", name: "title", label: "Browser and search title" },
              { type: "string", name: "description", label: "Search description", ui: { component: "textarea" } },
            ],
          },
          {
            type: "object",
            name: "content",
            label: "Page text",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.label || "Text" }) },
            fields: [
              { type: "string", name: "label", label: "Field name", ui: { component: "hidden" } },
              { type: "string", name: "cmsId", label: "Element ID", ui: { component: "hidden" } },
              { type: "string", name: "mode", label: "Rendering mode", ui: { component: "hidden" } },
              { type: "string", name: "html", label: "Text", ui: { component: "textarea" } },
            ],
          },
          {
            type: "object",
            name: "links",
            label: "Buttons and links",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.label || "Link" }) },
            fields: [
              { type: "string", name: "label", label: "Field name", ui: { component: "hidden" } },
              { type: "string", name: "cmsId", label: "Element ID", ui: { component: "hidden" } },
              { type: "string", name: "href", label: "Destination" },
            ],
          },
          {
            type: "object",
            name: "images",
            label: "Images",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.label || "Image" }) },
            fields: [
              { type: "string", name: "label", label: "Field name", ui: { component: "hidden" } },
              { type: "string", name: "cmsId", label: "Element ID", ui: { component: "hidden" } },
              { type: "image", name: "src", label: "Image" },
              { type: "string", name: "alt", label: "Alternative text" },
            ],
          },
        ],
      },
    ],
  },
});
