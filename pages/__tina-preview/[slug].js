import fs from "node:fs/promises";
import path from "node:path";
import Head from "next/head";
import Script from "next/script";
import { tinaField, useTina } from "tinacms/dist/react";
import { useEffect, useRef } from "react";
import client from "../../tina/__generated__/client";

const PAGE_FILES = {
  index: "index.html",
  about: "about.html",
  platform: "platform.html",
  services: "services.html",
  contact: "contact.html",
  "privacy-policy": "privacy-policy.html",
};

const PAGE_URLS = {
  "index.html": "/",
  "about.html": "/about",
  "services.html": "/services",
  "platform.html": "/platform",
  "contact.html": "/contact",
  "privacy-policy.html": "/privacy-policy",
};

function toPublicUrl(url) {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(url)) return url;
  const match = url.match(/^([^?#]+)([?#].*)?$/);
  if (!match) return url;
  const [, pathname, suffix = ""] = match;
  return PAGE_URLS[pathname] ? `${PAGE_URLS[pathname]}${suffix}` : url;
}

function adaptMarkup(markup) {
  return markup.replace(
    /\b(href|src)=(['"])([^'"]+)\2/gi,
    (whole, attribute, quote, url) => `${attribute}=${quote}${toPublicUrl(url)}${quote}`,
  );
}

function extract(source, tag) {
  const match = source.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return match ? match[1] : "";
}

function extractBody(source) {
  return adaptMarkup(extract(source, "body")).replace(
    /<script\b[\s\S]*?<\/script>/gi,
    "",
  );
}

function extractStyles(source) {
  return [...source.matchAll(/<style(?:\s[^>]*)?>([\s\S]*?)<\/style>/gi)].map(
    (match) => match[1],
  );
}

function escapeAttribute(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function addTinaFields(markup, page) {
  const fields = new Map();
  (page.content || []).forEach((item) => {
    fields.set(item.cmsId, tinaField(item, "html"));
  });
  (page.links || []).forEach((item) => {
    fields.set(`${item.cmsId}:href`, tinaField(item, "href"));
  });
  (page.images || []).forEach((item) => {
    fields.set(`${item.cmsId}:src`, tinaField(item, "src"));
    fields.set(`${item.cmsId}:alt`, tinaField(item, "alt"));
  });

  return markup.replace(
    /<([a-z][^>]*\bdata-cms-id=(['"])([^'"]+)\2[^>]*)>/gi,
    (whole, attributes, quote, cmsId) => {
      const suffix = [];
      const textField = fields.get(cmsId);
      if (textField) suffix.push(`data-tina-field="${escapeAttribute(textField)}"`);
      const hrefField = fields.get(`${cmsId}:href`);
      const srcField = fields.get(`${cmsId}:src`);
      const altField = fields.get(`${cmsId}:alt`);
      if (hrefField) suffix.push(`data-tina-field-href="${escapeAttribute(hrefField)}"`);
      if (srcField) suffix.push(`data-tina-field-src="${escapeAttribute(srcField)}"`);
      if (altField) suffix.push(`data-tina-field-alt="${escapeAttribute(altField)}"`);
      return suffix.length ? `<${attributes} ${suffix.join(" ")}>` : whole;
    },
  );
}

function safeTextHtml(value) {
  if (typeof document === "undefined") return value || "";
  const template = document.createElement("template");
  template.innerHTML = value || "";
  template.content.querySelectorAll("*").forEach((element) => {
    if (element.tagName === "BR") {
      [...element.attributes].forEach((attribute) => element.removeAttribute(attribute.name));
    } else {
      element.replaceWith(document.createTextNode(element.textContent || ""));
    }
  });
  return template.innerHTML;
}

function applyTinaContent(root, page) {
  if (!root || !page) return;
  (page.content || []).forEach((item) => {
    const element = root.querySelector(`[data-cms-id="${CSS.escape(item.cmsId)}"]`);
    if (element && typeof item.html === "string") element.innerHTML = safeTextHtml(item.html);
  });
  (page.links || []).forEach((item) => {
    const element = root.querySelector(`[data-cms-id="${CSS.escape(item.cmsId)}"]`);
    if (element && typeof item.href === "string") element.setAttribute("href", toPublicUrl(item.href));
  });
  (page.images || []).forEach((item) => {
    const element = root.querySelector(`[data-cms-id="${CSS.escape(item.cmsId)}"]`);
    if (!element) return;
    if (typeof item.src === "string") element.setAttribute("src", item.src);
    if (typeof item.alt === "string") element.setAttribute("alt", item.alt);
  });
}

export async function getServerSideProps({ params }) {
  const slug = params?.slug;
  const filename = PAGE_FILES[slug];
  if (!filename) return { notFound: true };

  const [source, tinaResponse] = await Promise.all([
    fs.readFile(path.join(process.cwd(), "legacy-pages", filename), "utf8"),
    client.queries.page({ relativePath: `${slug}.json` }),
  ]);

  return {
    props: {
      source,
      styles: extractStyles(source),
      body: extractBody(source),
      data: tinaResponse.data,
      query: tinaResponse.query,
      variables: tinaResponse.variables,
    },
  };
}

export default function TinaVisualPreview({ source, styles, body, data, query, variables }) {
  const { data: tinaData } = useTina({
    query,
    variables,
    data,
    experimental___selectFormByFormId() {
      return `public/content/pages/${variables.relativePath}`;
    },
  });
  const rootRef = useRef(null);
  const page = tinaData?.page || data.page;
  const previewBody = addTinaFields(body, page);

  useEffect(() => {
    applyTinaContent(rootRef.current, page);
  }, [page]);

  return (
    <>
      <Head>
        <title>{page.seo?.title || page.name}</title>
        {page.seo?.description ? <meta name="description" content={page.seo.description} /> : null}
        <link rel="stylesheet" href="/site.css" />
        <link rel="stylesheet" href="/2f76b9d2697264b9" />
        <link rel="icon" href="/outbreaksafe-logo.svg" type="image/svg+xml" />
        {styles.map((style, index) => (
          <style key={index} dangerouslySetInnerHTML={{ __html: style }} />
        ))}
      </Head>
      <div ref={rootRef} dangerouslySetInnerHTML={{ __html: previewBody }} />
      <Script src="/site.js" strategy="afterInteractive" />
    </>
  );
}
