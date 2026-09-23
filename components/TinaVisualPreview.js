import Head from "next/head";
import Script from "next/script";
import { useEffect, useRef } from "react";
import { tinaField, useTina } from "tinacms/dist/react";

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

function escapeAttribute(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
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

function applySplitWords(element, value) {
  const words = String(value || "").trim().split(/\s+/).filter(Boolean);
  const spans = [...element.querySelectorAll(":scope > .gsap_split_word")];
  if (!spans.length || !words.length) return;
  while (spans.length < words.length) {
    const clone = spans[spans.length - 1].cloneNode(false);
    clone.className = `gsap_split_word gsap_split_word${spans.length + 1}`;
    element.appendChild(document.createTextNode(" "));
    element.appendChild(clone);
    spans.push(clone);
  }
  spans.forEach((span, index) => {
    if (index < words.length) {
      span.textContent = words[index];
      span.hidden = false;
    } else {
      span.hidden = true;
    }
  });
  element.setAttribute("aria-label", words.join(" "));
}

function applyTinaContent(root, page) {
  if (!root || !page) return;
  (page.content || []).forEach((item) => {
    const element = root.querySelector(`[data-cms-id="${CSS.escape(item.cmsId)}"]`);
    if (!element || typeof item.html !== "string") return;
    if (item.mode === "splitWords") applySplitWords(element, item.html);
    else element.innerHTML = safeTextHtml(item.html);
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

export default function TinaVisualPreview({ styles, body, data, query, variables }) {
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
