#!/usr/bin/env python3
"""Deterministically add the initial homepage Tina Blocks from legacy page data."""
import json
from pathlib import Path

page_path = Path("public/content/pages/index.json")
page = json.loads(page_path.read_text())

content = {item["cmsId"]: item.get("html", "") for item in page["content"]}
links = {item["cmsId"]: item.get("href", "") for item in page["links"]}
images = {item["cmsId"]: item for item in page["images"]}

def text(cms_id):
    return content[cms_id].replace("<br>", " ").replace("&nbsp;", " ").replace("&amp;", "&")

def image(cms_id):
    item = images[cms_id]
    return {"image": item["src"], "imageAlt": item["alt"]}

team_ids = [
    ("index-189", "index-191", "index-192"), ("index-194", "index-196", "index-197"),
    ("index-199", "index-201", "index-202"), ("index-204", "index-206", "index-207"),
    ("index-209", "index-211", "index-212"), ("index-214", "index-216", "index-217"),
    ("index-219", "index-221", "index-222"), ("index-224", "index-226", "index-227"),
    ("index-229", "index-231", "index-232"),
]

page["blocks"] = [
    {"_template": "hero", "heading": text("index-heading-001"), "text": text("index-094"),
     "ctaLabel": text("index-165"), "ctaLink": links["index-163"], **image("index-133")},
    {"_template": "featureCards", "eyebrow": text("index-105"), "heading": text("index-105"), "cards": [
        {"heading": text("index-112"), "text": text("index-113")},
        {"heading": text("index-117"), "text": text("index-118")},
        {"heading": text("index-122"), "text": text("index-123")},
    ]},
    {"_template": "technologyGrid", "heading": text("index-151"), "items": [
        {"heading": text("index-131"), "text": text("index-132"), **image("index-133")},
        {"heading": text("index-136"), "text": text("index-137"), **image("index-156")},
        {"heading": text("index-141"), "text": text("index-142"), **image("index-161")},
    ]},
    {"_template": "richText", "heading": text("index-173"), "richBody": text("index-176")},
    {"_template": "teamGrid", "heading": text("index-185"), "members": [
        {"name": text(name), "role": text(role), **image(photo)} for photo, name, role in team_ids
    ]},
    {"_template": "cta", "eyebrow": text("index-237"),
     "ctaLabel": text("index-246"), "ctaLink": links["index-244"],
     "backgroundImage": images["index-243"]["src"], "backgroundAlt": images["index-243"]["alt"]},
]

page_path.write_text(json.dumps(page, indent=2, ensure_ascii=False) + "\n")
