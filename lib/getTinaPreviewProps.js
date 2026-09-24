import fs from "node:fs/promises";
import path from "node:path";
import client from "../tina/__generated__/client";

const PAGE_FILES = {
  home: { html: "index.html", json: "index.json" },
  about: { html: "about.html", json: "about.json" },
  platform: { html: "platform.html", json: "platform.json" },
  services: { html: "services.html", json: "services.json" },
  contact: { html: "contact.html", json: "contact.json" },
  "privacy-policy": { html: "privacy-policy.html", json: "privacy-policy.json" },
};

function toPublicUrl(url) {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(url)) return url;
  const match = url.match(/^([^?#]+)([?#].*)?$/);
  if (!match) return url;
  const [, pathname, suffix = ""] = match;
  const urls = {
    "index.html": "/",
    "about.html": "/about",
    "services.html": "/services",
    "platform.html": "/platform",
    "contact.html": "/contact",
    "privacy-policy.html": "/privacy-policy",
  };
  return urls[pathname] ? `${urls[pathname]}${suffix}` : url;
}

function extract(source, tag) {
  const match = source.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return match ? match[1] : "";
}

function extractBody(source) {
  return extract(source, "body")
    .replace(/\b(href|src)=(['"])([^'"]+)\2/gi, (whole, attribute, quote, url) => (
      `${attribute}=${quote}${toPublicUrl(url)}${quote}`
    ))
    .replace(/<script\b[\s\S]*?<\/script>/gi, "");
}

function extractStyles(source) {
  return [...source.matchAll(/<style(?:\s[^>]*)?>([\s\S]*?)<\/style>/gi)].map(
    (match) => match[1],
  );
}

export async function getTinaPreviewProps(previewPage) {
  const pageFiles = PAGE_FILES[previewPage];
  if (!pageFiles) return { notFound: true };

  const tinaResponse = await client.queries.page({ relativePath: pageFiles.json });

  if (previewPage === "home") {
    return {
      props: {
        styles: [],
        body: "",
        data: tinaResponse.data,
        query: tinaResponse.query,
        variables: tinaResponse.variables,
        isHomepage: true,
      },
    };
  }

  const source = await fs.readFile(
    path.join(process.cwd(), "legacy-pages", pageFiles.html),
    "utf8",
  );

  return {
    props: {
      styles: extractStyles(source),
      body: extractBody(source),
      data: tinaResponse.data,
      query: tinaResponse.query,
      variables: tinaResponse.variables,
      isHomepage: false,
    },
  };
}
