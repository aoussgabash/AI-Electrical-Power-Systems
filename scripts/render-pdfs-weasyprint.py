from __future__ import annotations

from pathlib import Path
from weasyprint import HTML

ROOT = Path(__file__).resolve().parents[1]
INPUT_DIR = ROOT / "build" / "pdf-html"
OUTPUT_DIR = ROOT / "pdf"


def render_one(source: Path, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    HTML(filename=str(source), base_url=str(ROOT)).write_pdf(str(destination))
    size = destination.stat().st_size
    if size < 10_000:
        raise RuntimeError(f"Generated PDF is unexpectedly small: {destination} ({size} bytes)")
    print(f"Generated {destination.relative_to(ROOT)} ({size} bytes)")


def main() -> None:
    if not INPUT_DIR.exists():
        raise SystemExit(f"Missing prepared HTML directory: {INPUT_DIR}")

    expected: list[Path] = []
    for kind in ("lecture", "lab"):
        for number in range(1, 21):
            stem = f"{kind}{number:02d}"
            source = INPUT_DIR / f"{stem}.html"
            destination = OUTPUT_DIR / f"{stem}.pdf"
            if not source.exists():
                raise FileNotFoundError(f"Missing prepared HTML snapshot: {source}")
            render_one(source, destination)
            expected.append(destination)

    missing = [path for path in expected if not path.exists()]
    if missing:
        raise RuntimeError(f"Missing generated PDFs: {missing}")

    print(f"Successfully generated {len(expected)} PDFs with WeasyPrint/Pango.")


if __name__ == "__main__":
    main()
