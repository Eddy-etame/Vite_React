"""Génère docs/TP_Bug_Hunt_Reponses.pdf à partir de docs/answers.md (texte brut paginé)."""
from pathlib import Path

import fitz  # PyMuPDF

ROOT = Path(__file__).resolve().parent.parent
MD_PATH = ROOT / "docs" / "answers.md"
OUT_PATH = ROOT / "docs" / "TP_Bug_Hunt_Reponses.pdf"

CHARS_PER_PAGE = 3500


def strip_frontmatter(text: str) -> str:
    if not text.startswith("---"):
        return text
    parts = text.split("---", 2)
    if len(parts) >= 3:
        return parts[2].lstrip("\n")
    return text


def main() -> None:
    raw = MD_PATH.read_text(encoding="utf-8")
    body = strip_frontmatter(raw)

    doc = fitz.open()
    page_width, page_height = fitz.paper_size("a4")
    margin = 48
    rect = fitz.Rect(margin, margin, page_width - margin, page_height - margin)

    for i in range(0, len(body), CHARS_PER_PAGE):
        chunk = body[i : i + CHARS_PER_PAGE]
        page = doc.new_page(width=page_width, height=page_height)
        page.insert_textbox(
            rect,
            chunk,
            fontsize=10,
            fontname="helv",
            align=fitz.TEXT_ALIGN_LEFT,
        )

    doc.save(OUT_PATH)
    doc.close()
    print(f"Wrote {OUT_PATH}")


if __name__ == "__main__":
    main()
