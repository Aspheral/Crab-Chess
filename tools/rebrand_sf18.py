#!/usr/bin/env python3
"""Mechanically rebrand an imported Stockfish 18 source tree as Crab Chess.

This intentionally preserves the leading GPL/copyright header of every C/C++
source file. Project/runtime identity below that header is changed to Crab.
The script must not make search/evaluation changes.
"""

from __future__ import annotations

import argparse
from pathlib import Path

CRAB_VERSION = "0.1.0"


def split_c_header(text: str) -> tuple[str, str]:
    if text.startswith("/*"):
        end = text.find("*/")
        if end != -1:
            end += 2
            return text[:end], text[end:]
    return "", text


def rebrand_cpp(path: Path) -> None:
    text = path.read_text(encoding="utf-8")
    header, body = split_c_header(text)

    # Preserve upstream legal/copyright header verbatim. Everything below it is
    # project/runtime identity and may use Crab naming.
    body = body.replace("Stockfish::", "Crab::")
    body = body.replace("namespace Stockfish", "namespace Crab")
    body = body.replace("STOCKFISH", "CRAB")
    body = body.replace("Stockfish", "Crab")
    body = body.replace("stockfish", "crab")

    if path.name == "misc.cpp":
        body = body.replace(
            'constexpr std::string_view version = "18";',
            f'constexpr std::string_view version = "{CRAB_VERSION}";',
        )
        body = body.replace('ss << "Crab " << version', 'ss << "Crab Chess " << version')
        body = body.replace(
            '"the Crab developers (see AUTHORS file)"',
            '"Crab Chess contributors"',
        )

    path.write_text(header + body, encoding="utf-8")


def rebrand_makefile(path: Path) -> None:
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines(keepends=True)

    # Stockfish's Makefile begins with the GPL/copyright notice. Keep it exact.
    # The blank line after the notice is a stable boundary in sf_18.
    boundary = 0
    blank_count = 0
    for i, line in enumerate(lines):
        if line.strip() == "":
            blank_count += 1
            if blank_count >= 2:
                boundary = i + 1
                break
        else:
            blank_count = 0

    head = "".join(lines[:boundary])
    body = "".join(lines[boundary:])
    body = body.replace("stockfish.exe", "crab.exe")
    body = body.replace("stockfish", "crab")
    body = body.replace("Stockfish", "Crab")
    path.write_text(head + body, encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("root", type=Path, help="Imported sf_18 src directory")
    args = parser.parse_args()
    root = args.root.resolve()

    if not (root / "misc.cpp").is_file() or not (root / "Makefile").is_file():
        raise SystemExit(f"{root} does not look like the Stockfish 18 src tree")

    for path in root.rglob("*"):
        if path.is_file() and path.suffix in {".cpp", ".h"}:
            rebrand_cpp(path)

    rebrand_makefile(root / "Makefile")

    # Guardrails: runtime identity must be Crab.
    misc = (root / "misc.cpp").read_text(encoding="utf-8")
    makefile = (root / "Makefile").read_text(encoding="utf-8")
    if 'ss << "Crab Chess " << version' not in misc:
        raise SystemExit("Crab runtime version branding was not applied")
    if '"Crab Chess contributors"' not in misc:
        raise SystemExit("Crab UCI author branding was not applied")
    if "EXE = crab" not in makefile:
        raise SystemExit("Crab executable branding was not applied")

    print(f"Rebranded sf_18 source tree as Crab Chess {CRAB_VERSION}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
