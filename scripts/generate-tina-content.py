#!/usr/bin/env python3
"""Add stable CMS hooks to static HTML and create Tina-managed page JSON.

The transformation is deliberately additive: original content stays in each HTML
file as a no-JavaScript fallback, and cms-content.js replaces it from JSON.
"""

from __future__ import annotations

import html
import json
import re
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
LEGACY_PAGES = ROOT / "legacy-pages"
PAGES = ["index.html", "about.html", "services.html", "platform.html", "contact.html", "privacy-policy.html"]
EDITABLE_TEXT_TAGS = {"h1", "h2", "h3", "h4", "h5", "h6", "p", "a", "button", "label", "li", "div", "span", "strong"}
SKIP_ANCESTORS = {"script", "style", "svg", "noscript", "template"}
VOID_TAGS = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}


def absolute_offset(source: str, line: int, column: int) -> int:
    starts = [0]
    starts.extend(match.end() for match in re.finditer(r"\n", source))
    return starts[line - 1] + column


def add_attribute(start_tag: str, cms_id: str) -> str:
    if "data-cms-id=" in start_tag:
        return start_tag
    end = "/>" if start_tag.rstrip().endswith("/>") else ">"
    pos = start_tag.rfind(end)
    return f'{start_tag[:pos]} data-cms-id="{cms_id}"{start_tag[pos:]}'


class PageParser(HTMLParser):
    def __init__(self, source: str, slug: str):
        super().__init__(convert_charrefs=False)
        self.source = source
        self.slug = slug
        self.stack: list[dict] = []
        self.elements: list[dict] = []
        self.serial = 0

    def handle_starttag(self, tag: str, attrs):
        raw = self.get_starttag_text()
        start = absolute_offset(self.source, *self.getpos())
        cms_id = None
        attrs_dict = dict(attrs)
        if attrs_dict.get("data-cms-id"):
            cms_id = attrs_dict["data-cms-id"]
        editable = tag in EDITABLE_TEXT_TAGS or tag in {"img", "meta"}
        if editable and not any(item["tag"] in SKIP_ANCESTORS for item in self.stack):
            if tag == "meta" and attrs_dict.get("name") != "description":
                editable = False
            if editable:
                self.serial += 1
                cms_id = cms_id or f"{self.slug}-{self.serial:03d}"
        item = {
            "tag": tag,
            "attrs": attrs_dict,
            "cms_id": cms_id,
            "start": start,
            "start_end": start + len(raw),
            "raw_start": raw,
            "content_start": start + len(raw),
            "children": [],
            "direct_text": [],
        }
        if self.stack:
            self.stack[-1]["children"].append(tag)
        self.stack.append(item)
        if tag in VOID_TAGS:
            self._finish(tag, start + len(raw))

    def handle_startendtag(self, tag: str, attrs):
        self.handle_starttag(tag, attrs)
        self._finish(tag, absolute_offset(self.source, *self.getpos()) + len(self.get_starttag_text()))

    def handle_endtag(self, tag: str):
        self._finish(tag, absolute_offset(self.source, *self.getpos()))

    def _finish(self, tag: str, content_end: int):
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index]["tag"] == tag:
                item = self.stack.pop(index)
                item["content_end"] = content_end
                self.elements.append(item)
                return

    def handle_data(self, data: str):
        if self.stack:
            self.stack[-1]["direct_text"].append(data)


def clean_label(value: str, fallback: str) -> str:
    value = " ".join(html.unescape(value).split())
    if not value:
        return fallback
    return value if len(value) <= 70 else value[:67].rstrip() + "…"


def group_split_headings(source: str, slug: str, content: list[dict]):
    """Expose animated word-by-word headings as one friendly Tina field."""
    pattern = re.compile(
        r"<(?P<tag>h[1-6])(?P<attrs>[^>]*)>(?P<inner>(?:\s*<span\b[^>]*gsap_split_word[^>]*>.*?</span>\s*)+)</(?P=tag)>",
        flags=re.I | re.S,
    )
    grouped_ids: set[str] = set()
    groups: list[dict] = []
    serial = 0

    def replace(match: re.Match):
        nonlocal serial
        serial += 1
        attrs = match.group("attrs")
        inner = match.group("inner")
        child_ids = re.findall(r'data-cms-id="([^"]+)"', inner)
        words = [html.unescape(re.sub(r"<[^>]+>", "", value)).strip() for value in re.findall(r"<span\b[^>]*>(.*?)</span>", inner, flags=re.I | re.S)]
        words = [word for word in words if word]
        if not words:
            return match.group(0)
        grouped_ids.update(child_ids)
        cms_id_match = re.search(r'data-cms-id="([^"]+)"', attrs)
        cms_id = cms_id_match.group(1) if cms_id_match else f"{slug}-heading-{serial:03d}"
        if not cms_id_match:
            attrs += f' data-cms-id="{cms_id}"'
        phrase = " ".join(words)
        groups.append({"label": clean_label(phrase, "Animated heading"), "cmsId": cms_id, "mode": "splitWords", "html": phrase})
        return f'<{match.group("tag")}{attrs}>{inner}</{match.group("tag")}>'

    source = pattern.sub(replace, source)
    content[:] = [item for item in content if item["cmsId"] not in grouped_ids]
    content.extend(groups)
    return source


def migrate_page(path: Path):
    source = path.read_text(encoding="utf-8")
    slug = path.stem
    parser = PageParser(source, slug)
    parser.feed(source)

    insertions: dict[tuple[int, int], tuple[str, str]] = {}
    content = []
    links = []
    images = []
    seo_description = ""

    title_match = re.search(r"<title>(.*?)</title>", source, flags=re.I | re.S)
    page_title = html.unescape(title_match.group(1).strip()) if title_match else slug.title()

    for item in sorted(parser.elements, key=lambda entry: entry["start"]):
        cms_id = item["cms_id"]
        if not cms_id:
            continue
        tag = item["tag"]
        attrs = item["attrs"]

        if tag == "meta" and attrs.get("name") == "description":
            seo_description = attrs.get("content", "")
            continue

        if tag == "img":
            src = attrs.get("src", "")
            if src and not src.startswith("data:"):
                insertions[(item["start"], item["start_end"])] = (item["raw_start"], cms_id)
                images.append({
                    "label": clean_label(attrs.get("alt", ""), f"Image {len(images) + 1}"),
                    "cmsId": cms_id,
                    "src": src,
                    "alt": attrs.get("alt", ""),
                })
            continue

        if tag == "a" and attrs.get("href"):
            insertions[(item["start"], item["start_end"])] = (item["raw_start"], cms_id)
            inner = source[item["content_start"]:item.get("content_end", item["content_start"])]
            label = clean_label(re.sub(r"<[^>]+>", " ", inner), f"Link {len(links) + 1}")
            links.append({"label": label, "cmsId": cms_id, "href": attrs["href"]})

        allowed_children = all(child == "br" for child in item["children"])
        if tag in EDITABLE_TEXT_TAGS and allowed_children:
            inner = source[item["content_start"]:item.get("content_end", item["content_start"])]
            plain = re.sub(r"<br\s*/?>", " ", inner, flags=re.I)
            if html.unescape(re.sub(r"<[^>]+>", "", plain)).strip():
                insertions[(item["start"], item["start_end"])] = (item["raw_start"], cms_id)
                content.append({
                    "label": clean_label(re.sub(r"<[^>]+>", " ", inner), f"Text {len(content) + 1}"),
                    "cmsId": cms_id,
                    "html": inner.strip(),
                })

    for (start, end), (raw, cms_id) in sorted(insertions.items(), reverse=True):
        source = source[:start] + add_attribute(raw, cms_id) + source[end:]

    source = group_split_headings(source, slug, content)

    if "cms-content.js" not in source:
        source = source.replace('<script src="site.js"></script>', '<script src="cms-content.js"></script>\n<script src="site.js"></script>')

    path.write_text(source, encoding="utf-8")
    output = ROOT / "public" / "content" / "pages" / f"{slug}.json"
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps({
        "name": page_title,
        "seo": {"title": page_title, "description": seo_description},
        "content": content,
        "links": links,
        "images": images,
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return len(content), len(links), len(images)


def main():
    for filename in PAGES:
        counts = migrate_page(LEGACY_PAGES / filename)
        print(f"{filename}: {counts[0]} text fields, {counts[1]} links, {counts[2]} images")


if __name__ == "__main__":
    main()
