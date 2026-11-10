#!/usr/bin/env python3
# Write the drawing font into each drawing in the site look (DESIGN.md, Stage: Images). A drawing
# in the site look is an SVG of docs/capture-journey/ with the site color block (its colors come
# from build-capture-journey.mjs). Its text is in Archivo, the heading font of the site. An SVG in
# an <img> cannot load the font of the page, so the drawing holds its own copy: a subset of
# Archivo with only the characters of its text, as 2 static faces at the width 87.5: 600 (the
# titles and the numbers) and 400 (the other lines). The block goes between the drawing font
# markers, as an @font-face rule for each face with the font as a data URL (WOFF2).
# Run it when the words of a drawing change: `node build-capture-journey.mjs --check` fails when
# the font of a drawing has no glyph for a character of its text.
# The source is the file archivo-latin-wdth-normal.woff2 of the npm package
# @fontsource-variable/archivo 5.3.0, the package that the deploy workflow pins (ARCHIVO_SHA512).
# The script checks the SHA-256 of the file. Each run writes the same bytes for the same text and
# the same fontTools version.
# Needs: Python 3 and fontTools with brotli (pip install fonttools==4.68.0 brotli).
# Usage: python3 .github/scripts/subset-drawing-font.py <archivo-latin-wdth-normal.woff2>
#   Get the file:  npm pack @fontsource-variable/archivo@5.3.0, check its SHA-512 against
#   ARCHIVO_SHA512 in .github/workflows/understand-greenstand-deploy-viewers.yml (at the top of the docs repo), then
#   tar -xzf fontsource-variable-archivo-5.3.0.tgz package/files/archivo-latin-wdth-normal.woff2
import base64
import hashlib
import io
import re
import sys
from pathlib import Path

SOURCE_SHA256 = "e3a28eade21a900c7155a247757f4b2834c07bb7ef07ad7efa55cebaac1e8f5e"
ROOT = Path(__file__).resolve().parents[2]
IMAGES = ROOT / "docs" / "capture-journey"
# The marker strings: the same as COLOR_MARKERS and FONT_MARKERS of site-drawings.mjs (its
# checkSubsetScript checks them in CI). A drawing in the site look has a color BEGIN marker that
# starts with COLOR_BEGIN.
COLOR_BEGIN = "/* BEGIN site colors:"
FONT_BEGIN = "/* BEGIN drawing font: built by .github/scripts/subset-drawing-font.py from Archivo 5.3.0. Do not edit. */"
FONT_END = "/* END drawing font */"
FAMILY = "Archivo Drawing"
WIDTH = 87.5
WEIGHTS = (600, 400)
# The copyright and license lines of the font (OFL 1.1, section 2), kept in each face.
KEEP_NAMES = [0, 13, 14]
CREDIT = ("Archivo: Copyright 2020 The Archivo Project Authors (https://github.com/Omnibus-Type/Archivo), "
          "SIL Open Font License 1.1 (https://openfontlicense.org)")


def fail(errors):
    for e in errors:
        print(f"error: {e}", file=sys.stderr)
    sys.exit(1)


# A text element and its content, with the tags inside it (a <tspan>): the pattern of
# site-drawings.mjs. The XML escapes: the 5 named ones and the numeric ones.
TEXT = re.compile(r"<text\b[^>]*>(.*?)</text>", re.S)
ENTITIES = {"amp": "&", "lt": "<", "gt": ">", "quot": '"', "apos": "'"}
ESCAPE = re.compile(r"&(?:#x([0-9a-fA-F]+)|#(\d+)|(amp|lt|gt|quot|apos));", re.I)


def unescape_xml(s):
    def one(m):
        if m.group(1):
            return chr(int(m.group(1), 16))
        if m.group(2):
            return chr(int(m.group(2)))
        return ENTITIES[m.group(3).lower()]
    return ESCAPE.sub(one, s)


def text_of(svg):
    # The characters of the words of the text elements, without the tags and the control characters.
    chars = set()
    for m in TEXT.finditer(svg):
        chars.update(c for c in unescape_xml(re.sub(r"<[^>]*>", "", m.group(1))) if ord(c) >= 0x20)
    return "".join(sorted(chars))


def face(source, weight, text):
    from fontTools import subset
    from fontTools.ttLib import TTFont
    from fontTools.varLib import instancer

    font = TTFont(io.BytesIO(source), recalcTimestamp=False)
    font = instancer.instantiateVariableFont(font, {"wght": weight, "wdth": WIDTH})
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["kern", "tnum"]
    options.name_IDs = KEEP_NAMES
    options.notdef_outline = True
    options.hinting = False
    subsetter = subset.Subsetter(options)
    subsetter.populate(text=text)
    subsetter.subset(font)
    out = io.BytesIO()
    font.flavor = "woff2"
    font.save(out)
    return base64.b64encode(out.getvalue()).decode("ascii")


def block(source, text):
    rules = [f'@font-face {{ font-family: "{FAMILY}"; font-weight: {w}; src: url(data:font/woff2;base64,{face(source, w, text)}) format("woff2"); }}'
             for w in WEIGHTS]
    return "\n".join([FONT_BEGIN, "", f"/* {CREDIT} */", *rules, "", FONT_END])


def main():
    if len(sys.argv) != 2:
        print("use: python3 .github/scripts/subset-drawing-font.py <archivo-latin-wdth-normal.woff2>", file=sys.stderr)
        sys.exit(2)
    try:
        import fontTools  # noqa: F401
        import brotli  # noqa: F401
    except ImportError:
        fail(["needs fontTools with brotli: pip install fonttools==4.68.0 brotli"])
    errors = []
    try:
        source = Path(sys.argv[1]).read_bytes()
    except OSError as e:
        fail([f"cannot read {sys.argv[1]}: {e.strerror}"])
    if hashlib.sha256(source).hexdigest() != SOURCE_SHA256:
        errors.append(f"{sys.argv[1]} is not archivo-latin-wdth-normal.woff2 of @fontsource-variable/archivo 5.3.0 (its SHA-256 differs)")
    drawings = []
    for path in sorted(IMAGES.glob("*.svg")):
        svg = path.read_text(encoding="utf-8")
        if COLOR_BEGIN not in svg:
            continue
        at = path.relative_to(ROOT).as_posix()
        begins, ends = svg.count(FONT_BEGIN), svg.count(FONT_END)
        if (begins, ends) != (1, 1):
            errors.append(f"{at}: {begins} BEGIN and {ends} END markers of the drawing font; expected one of each")
        elif svg.index(FONT_END) < svg.index(FONT_BEGIN):
            errors.append(f"{at}: the END marker of the drawing font comes before its BEGIN marker")
        else:
            drawings.append((path, at, svg))
    if errors:
        fail(errors)
    for path, at, svg in drawings:
        start, stop = svg.index(FONT_BEGIN), svg.index(FONT_END) + len(FONT_END)
        text = text_of(svg)
        new = svg[:start] + block(source, text) + svg[stop:]
        if new != svg:
            path.write_text(new, encoding="utf-8")
        print(f"{'wrote' if new != svg else 'kept'} {at} ({len(text)} characters)")
    if not drawings:
        print("no drawing in the site look")


main()
