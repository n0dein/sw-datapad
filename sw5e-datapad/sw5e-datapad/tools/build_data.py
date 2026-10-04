#!/usr/bin/env python3
"""Build data.js for the SW5e Datapad from the SW5e community database.

Rules text is carried over unmodified. The only changes are structural:
remote image URLs are dropped (portraits are user-supplied), and class /
archetype features are grouped under the class or archetype that grants them.
"""
import glob
import json
import os
import sys
from collections import defaultdict

SRC = os.path.expanduser(sys.argv[1] if len(sys.argv) > 1 else "~/sw5e-database/content")
OUT = os.path.join(os.path.dirname(__file__), "..", "data.js")


def load(kind):
    items = []
    for f in sorted(glob.glob(os.path.join(SRC, kind, "*.json"))):
        with open(f, encoding="utf-8") as fh:
            items.append(json.load(fh))
    return items


def strip(d, *keys):
    return {k: v for k, v in d.items() if k not in keys}


features = load("feature")
class_feats = defaultdict(list)
arch_feats = defaultdict(list)
for f in features:
    row = {"n": f["name"], "l": f.get("level"), "d": f.get("description", "")}
    if f["grantedBy"] == "class":
        class_feats[f["grantedByName"]].append(row)
    elif f["grantedBy"] == "archetype":
        arch_feats[f["grantedByName"]].append(row)

# archetype names must be unique within a class for grouping to be safe
arch_class = defaultdict(set)
for a in load("archetype"):
    arch_class[a["name"]].add(a["className"])
dups = {k: v for k, v in arch_class.items() if len(v) > 1}
if dups:
    print("WARNING: archetype name collisions", dups)

classes = []
for c in load("class"):
    c = strip(c, "imageUrls", "description")
    c["features"] = sorted(class_feats.get(c["name"], []), key=lambda r: (r["l"] or 0, r["n"]))
    classes.append(c)

archetypes = []
for a in load("archetype"):
    desc = a.get("description", "")
    intro = desc.split("\n###", 1)[0].strip()
    a = strip(a, "description")
    a["intro"] = intro
    a["features"] = sorted(arch_feats.get(a["name"], []), key=lambda r: (r["l"] or 0, r["n"]))
    archetypes.append(a)

species = [strip(s, "imageUrls") for s in load("species")]
backgrounds = load("background")
feats = load("feat")
powers = load("power")
equipment = load("equipment")
sources = {s["key"]: {"title": s["title"], "abbr": s["abbreviation"]} for s in load("source")}

data = {
    "sources": sources,
    "species": species,
    "classes": classes,
    "archetypes": archetypes,
    "backgrounds": backgrounds,
    "feats": feats,
    "powers": powers,
    "equipment": equipment,
}

with open(OUT, "w", encoding="utf-8") as fh:
    fh.write("window.SW5E=")
    json.dump(data, fh, ensure_ascii=False, separators=(",", ":"))
    fh.write(";\n")

print({k: (len(v) if hasattr(v, "__len__") else v) for k, v in data.items()})
print("data.js bytes:", os.path.getsize(OUT))
