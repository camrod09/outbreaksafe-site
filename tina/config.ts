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
          {
            type: "object",
            name: "blocks",
            label: "Homepage blocks",
            list: true,
            ui: {
              itemProps: (item) => ({ label: item?.heading || item?.title || item?.label || "Block" }),
            },
            templates: [
              {
                name: "hero",
                label: "Hero",
                fields: [
                  { type: "string", name: "eyebrow", label: "Eyebrow" },
                  { type: "string", name: "heading", label: "Heading", ui: { component: "textarea" } },
                  { type: "string", name: "text", label: "Supporting text", ui: { component: "textarea" } },
                  { type: "string", name: "ctaLabel", label: "Button label" },
                  { type: "string", name: "ctaLink", label: "Button link" },
                  { type: "string", name: "secondaryCtaLabel", label: "Secondary button label" },
                  { type: "string", name: "secondaryCtaLink", label: "Secondary button link" },
                  { type: "image", name: "image", label: "Image" },
                  { type: "string", name: "imageAlt", label: "Image alternative text" },
                ],
              },
              {
                name: "headingText",
                label: "Heading and text",
                fields: [
                  { type: "string", name: "eyebrow", label: "Eyebrow" },
                  { type: "string", name: "heading", label: "Heading" },
                  { type: "string", name: "text", label: "Text", ui: { component: "textarea" } },
                  { type: "string", name: "textWidth", label: "Text width", options: ["narrow", "standard", "wide"] },
                  { type: "string", name: "alignment", label: "Alignment", options: ["left", "center", "right"] },
                ],
              },
              {
                name: "richText",
                label: "Rich text",
                fields: [
                  { type: "string", name: "heading", label: "Heading" },
                  { type: "string", name: "richBody", label: "Rich text body", ui: { component: "textarea" } },
                  { type: "string", name: "maxWidth", label: "Maximum width", options: ["narrow", "standard", "wide"] },
                  { type: "string", name: "alignment", label: "Alignment", options: ["left", "center", "right"] },
                ],
              },
              {
                name: "imageText",
                label: "Image and text",
                fields: [
                  { type: "string", name: "eyebrow", label: "Eyebrow" },
                  { type: "string", name: "heading", label: "Heading" },
                  { type: "string", name: "text", label: "Text", ui: { component: "textarea" } },
                  { type: "image", name: "image", label: "Image" },
                  { type: "string", name: "imageAlt", label: "Image alternative text" },
                  { type: "string", name: "linkLabel", label: "Link label" },
                  { type: "string", name: "link", label: "Link" },
                ],
              },
              {
                name: "fullWidthImage",
                label: "Full-width image",
                fields: [
                  { type: "image", name: "image", label: "Image" },
                  { type: "string", name: "alt", label: "Alternative text" },
                  { type: "string", name: "caption", label: "Caption" },
                ],
              },
              {
                name: "featureCards",
                label: "Feature cards",
                fields: [
                  { type: "string", name: "eyebrow", label: "Eyebrow" },
                  { type: "string", name: "heading", label: "Heading" },
                  {
                    type: "object", name: "cards", label: "Cards", list: true,
                    ui: { itemProps: (item) => ({ label: item?.heading || "Feature" }) },
                    fields: [
                      { type: "string", name: "heading", label: "Heading" },
                      { type: "string", name: "text", label: "Text", ui: { component: "textarea" } },
                      { type: "image", name: "image", label: "Icon or image" },
                      { type: "string", name: "imageAlt", label: "Image alternative text" },
                      { type: "string", name: "linkLabel", label: "Link label" },
                      { type: "string", name: "link", label: "Link" },
                    ],
                  },
                ],
              },
              {
                name: "technologyGrid",
                label: "Technology grid",
                fields: [
                  { type: "string", name: "eyebrow", label: "Eyebrow" },
                  { type: "string", name: "heading", label: "Heading" },
                  {
                    type: "object", name: "items", label: "Technology items", list: true,
                    ui: { itemProps: (item) => ({ label: item?.heading || "Technology item" }) },
                    fields: [
                      { type: "string", name: "heading", label: "Heading" },
                      { type: "string", name: "text", label: "Text", ui: { component: "textarea" } },
                      { type: "image", name: "image", label: "Image" },
                      { type: "string", name: "imageAlt", label: "Image alternative text" },
                    ],
                  },
                ],
              },
              {
                name: "teamGrid",
                label: "Team grid",
                fields: [
                  { type: "string", name: "heading", label: "Heading" },
                  {
                    type: "object", name: "members", label: "Team members", list: true,
                    ui: { itemProps: (item) => ({ label: item?.name || "Team member" }) },
                    fields: [
                      { type: "string", name: "name", label: "Name" },
                      { type: "string", name: "role", label: "Role" },
                      { type: "image", name: "image", label: "Photo" },
                      { type: "string", name: "imageAlt", label: "Photo alternative text" },
                      { type: "string", name: "profileLink", label: "Profile link" },
                    ],
                  },
                ],
              },
              {
                name: "cta",
                label: "Call to action",
                fields: [
                  { type: "string", name: "eyebrow", label: "Eyebrow" },
                  { type: "string", name: "heading", label: "Heading" },
                  { type: "string", name: "ctaLabel", label: "Button label" },
                  { type: "string", name: "ctaLink", label: "Button link" },
                  { type: "string", name: "body", label: "Body", ui: { component: "textarea" } },
                  { type: "image", name: "backgroundImage", label: "Background image" },
                  { type: "string", name: "backgroundAlt", label: "Background image alternative text" },
                ],
              },
              {
                name: "spacer",
                label: "Spacer or divider",
                fields: [
                  { type: "string", name: "label", label: "Editor label" },
                  { type: "string", name: "size", label: "Space", options: ["small", "medium", "large"] },
                  { type: "boolean", name: "divider", label: "Show divider" },
                ],
              },
              {
                name: "divider",
                label: "Divider",
                fields: [
                  { type: "string", name: "label", label: "Editor label" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});
