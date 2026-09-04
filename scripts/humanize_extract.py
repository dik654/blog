#!/usr/bin/env python3
"""humanize-korean 배치용 프로즈 추출기.

주어진 .tsx 파일들에서 순수 텍스트 <p>...</p> 문단만 뽑아(JSX 표현식 {..}나
중첩 태그가 없는 것만 — <code>·<Link>·강조 등이 섞인 문단은 안전을 위해
건너뛰고 수동 처리로 남긴다) humanize-korean 파이프라인 입력 텍스트와,
나중에 결과를 되붙일 때 쓰는 manifest(JSON)를 만든다.

사용법:
  python3 scripts/humanize_extract.py --list-file /tmp/batch1_files.txt \
      --out-dir /Users/dylan/code/im-not-ai/_workspace/2026-09-04-003 \
      --batch-name batch1

산출:
  {out-dir}/01_input.txt   — [[F{n}-P{n}]] 마커로 감싼 추출 텍스트
  {out-dir}/manifest.json  — 마커 → (파일, 원본 raw, 원본 정규화 텍스트) 매핑
"""
import argparse
import json
import re
import sys
from pathlib import Path

P_TAG_RE = re.compile(r"<p(?:\s[^>]*)?>(.*?)</p>", re.DOTALL)
MIN_CHARS = 15


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def is_extractable(raw_inner: str) -> bool:
    if "<" in raw_inner or "{" in raw_inner:
        return False
    norm = normalize(raw_inner)
    if len(norm) < MIN_CHARS:
        return False
    # 한글이 하나도 없으면(순수 영문/코드 조각) 건드리지 않는다
    if not re.search(r"[가-힣]", norm):
        return False
    return True


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--list-file", required=True, help="repo-relative .tsx 경로 목록(한 줄에 하나)")
    ap.add_argument("--out-dir", required=True)
    ap.add_argument("--repo-root", default=".")
    args = ap.parse_args()

    repo_root = Path(args.repo_root).resolve()
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    files = [line.strip() for line in Path(args.list_file).read_text().splitlines() if line.strip()]

    manifest = {"files": files, "paragraphs": []}
    input_blocks = []
    skipped = 0
    extracted = 0

    for fidx, rel_path in enumerate(files):
        full = repo_root / rel_path
        if not full.exists():
            print(f"WARN 파일 없음: {rel_path}", file=sys.stderr)
            continue
        content = full.read_text(encoding="utf-8")
        for pidx, m in enumerate(P_TAG_RE.finditer(content)):
            raw_inner = m.group(1)
            if not is_extractable(raw_inner):
                skipped += 1
                continue
            norm = normalize(raw_inner)
            marker = f"F{fidx}-P{pidx}"
            manifest["paragraphs"].append(
                {
                    "marker": marker,
                    "file": rel_path,
                    "raw_inner": raw_inner,
                    "normalized": norm,
                }
            )
            input_blocks.append(f"[[{marker}]]\n{norm}\n[[/{marker}]]")
            extracted += 1

    (out_dir / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    (out_dir / "01_input.txt").write_text("\n\n".join(input_blocks) + "\n", encoding="utf-8")

    print(f"파일 {len(files)}개 · 추출 {extracted}개 문단 · 건너뜀(코드/링크/짧음) {skipped}개")
    print(f"-> {out_dir}/01_input.txt, {out_dir}/manifest.json")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
