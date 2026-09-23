import fs from "node:fs/promises";
import path from "node:path";

const PAGE_FILES = {
  "": "index.html",
  about: "about.html",
  services: "services.html",
  platform: "platform.html",
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

const STATIC_FILES = new Set([
  "2f76b9d2697264b9",
  "cms-content.js",
  "google08af98b675546b7a.html",
  "hero.html",
  "outbreaksafe-logo.svg",
  "site.css",
  "site.js",
]);

function toPublicUrl(url) {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(url)) return url;

  const match = url.match(/^([^?#]+)([?#].*)?$/);
  if (!match) return url;

  const [, pathname, suffix = ""] = match;
  if (PAGE_URLS[pathname]) return `${PAGE_URLS[pathname]}${suffix}`;
  if (STATIC_FILES.has(pathname)) return `/${pathname}${suffix}`;
  return url;
}

function adaptLegacyMarkup(markup) {
  return markup.replace(
    /\b(href|src)=(['"])([^'"]+)\2/gi,
    (whole, attribute, quote, url) => `${attribute}=${quote}${toPublicUrl(url)}${quote}`,
  );
}

/**
 * The marketing pages are intentionally served as their verified HTML source.
 * This avoids reimplementing the large Webflow-derived layouts in React while
 * keeping the requested URLs, Tina hooks, metadata, and client scripts intact.
 */
export async function getServerSideProps({ params, res }) {
  const segments = params?.slug || [];
  const slug = segments.length === 0 ? "" : segments.length === 1 ? segments[0] : null;
  const pageFile = slug === null ? undefined : PAGE_FILES[slug];

  if (!pageFile) return { notFound: true };

  const source = await fs.readFile(
    path.join(process.cwd(), "legacy-pages", pageFile),
    "utf8",
  );

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(adaptLegacyMarkup(source));
  return { props: {} };
}

export default function LegacyPage() {
  return null;
}
