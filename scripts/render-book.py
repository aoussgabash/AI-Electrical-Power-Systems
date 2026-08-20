from __future__ import annotations

from pathlib import Path
from weasyprint import HTML

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "build" / "book" / "AI-Power-Systems-Book.html"
DESTINATION = ROOT / "pdf" / "AI-Applications-in-Electrical-Power-Systems-Book.pdf"


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f"Missing generated book HTML: {SOURCE}")

    DESTINATION.parent.mkdir(parents=True, exist_ok=True)
    HTML(filename=str(SOURCE), base_url=str(ROOT)).write_pdf(str(DESTINATION))

    size = DESTINATION.stat().st_size
    if size < 50_000:
        raise RuntimeError(
            f"Generated book PDF is unexpectedly small: {DESTINATION} ({size} bytes)"
        )

    print(f"Generated {DESTINATION.relative_to(ROOT)} ({size} bytes)")


if __name__ == "__main__":
    main()
