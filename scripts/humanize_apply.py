#!/usr/bin/env python3
"""humanize_extract.py 로 뽑은 문단을 humanize-korean final.md 결과로 되붙인다.

원본 raw_inner(문자 그대로, 개행·들여쓰기 포함)를 정확히 문자열 치환하므로
extract 이후 파일이 조금이라도 바뀌면 그 문단은 안전하게 건너뛴다(no-op).
새 텍스트는 원본 첫 줄의 들여쓰기 폭을 그대로 따르는 110자 word-wrap으로
다시 줄바꿈한다.

사용법 (먼저 --dry-run 으로 diff 만 본 뒤 실제 반영):
  python3 scripts/humanize_apply.py --manifest .../manifest.json --final .../final.md --dry-run
  python3 scripts/humanize_apply.py --manifest .../manifest.json --final .../final.md
"""
import argparse
import json
import re
import sys
import textwrap
from pathlib import Path

BLOCK_RE_TMPL = r"\[\[{m}\]\]\s*\n(.*?)\n\[\[/{m}\]\]"


def rewrap(text: str, indent: str, width: int = 110) -> str:
    wrapped = textwrap.wrap(text, width=width - len(indent))
    body = "\n".join(indent + line for line in wrapped)
    return f"\n{body}\n{indent[:-2] if len(indent) >= 2 else ''}"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--manifest", required=True)
    ap.add_argument("--final", required=True)
    ap.add_argument("--repo-root", default=".")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    manifest = json.loads(Path(args.manifest).read_text(encoding="utf-8"))
    final_text = Path(args.final).read_text(encoding="utf-8")
    repo_root = Path(args.repo_root).resolve()

    # 파일별로 (raw_inner -> new_inner) 치환 목록을 모은다
    by_file: dict[str, list[tuple[str, str]]] = {}
    applied = 0
    missing_block = 0
    unchanged = 0

    for para in manifest["paragraphs"]:
        marker = para["marker"]
        pattern = re.compile(BLOCK_RE_TMPL.format(m=re.escape(marker)), re.DOTALL)
        match = pattern.search(final_text)
        if not match:
            missing_block += 1
            print(f"WARN final.md 에 블록 없음: {marker}", file=sys.stderr)
            continue
        new_norm = match.group(1).strip()
        if new_norm == para["normalized"]:
            unchanged += 1
            continue
        # 원본 들여쓰기 폭 추정: raw_inner 의 개행 뒤 공백 수
        indent_match = re.search(r"\n(\s+)\S", para["raw_inner"])
        indent = indent_match.group(1) if indent_match else "            "
        new_inner = rewrap(new_norm, indent)
        by_file.setdefault(para["file"], []).append((para["raw_inner"], new_inner))
        applied += 1

    for rel_path, replacements in by_file.items():
        full = repo_root / rel_path
        content = full.read_text(encoding="utf-8")
        file_changed = 0
        for raw_inner, new_inner in replacements:
            if content.count(raw_inner) != 1:
                print(f"SKIP {rel_path}: 원본 조각이 정확히 1번 나오지 않음(0 또는 2+) — 수동 확인 필요", file=sys.stderr)
                continue
            content = content.replace(raw_inner, new_inner, 1)
            file_changed += 1
        if file_changed and not args.dry_run:
            full.write_text(content, encoding="utf-8")
        print(f"{'[dry-run] ' if args.dry_run else ''}{rel_path}: {file_changed}개 문단 반영")

    print(f"\n총 {applied}개 문단 변경, {unchanged}개 변경 없음, {missing_block}개 블록 누락")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
