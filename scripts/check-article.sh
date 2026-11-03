#!/usr/bin/env bash
# 한 글의 route 단위 감사를 한 번에 돌린다.
#   scripts/check-article.sh ai/my-article            # 빠른 검사 (learning·graph·viz·prose·Korean·terms·order)
#   scripts/check-article.sh ai/my-article --full     # + formula(전역)·topology(전역)·tsc
# registration module 이 있으면 먼저 병합한다.
set -u
ROUTE="${1:?route (예: ai/my-article) 가 필요합니다}"
FULL="${2:-}"
CATEGORY="${ROUTE%%/*}"
SLUG="${ROUTE#*/}"
cd "$(dirname "$0")/.." || exit 1

status=0
run() {
  echo "### $*"
  if ! "$@"; then
    echo "!!! 실패: $*"
    status=1
  fi
  echo
}

if [ -f "src/content/registrations/$SLUG.ts" ]; then
  run node scripts/merge-registrations.mjs "src/content/registrations/$SLUG.ts"
fi

run node scripts/audit-learning-contract.mjs --strict --require-registration "$ROUTE"
run node scripts/audit-knowledge-graph.mjs --strict

VIZ_PATHS=()
[ -d "src/pages/articles/$CATEGORY/$SLUG" ] && VIZ_PATHS+=("src/pages/articles/$CATEGORY/$SLUG")
[ -f "src/pages/articles/$CATEGORY/$SLUG.tsx" ] && VIZ_PATHS+=("src/pages/articles/$CATEGORY/$SLUG.tsx")
if [ ${#VIZ_PATHS[@]} -eq 0 ]; then
  SOURCE_FILE="$(find src/pages/articles -type f -name "$SLUG.tsx" -print -quit)"
  if [ -n "$SOURCE_FILE" ] && [ -f "$SOURCE_FILE" ]; then
    VIZ_PATHS+=("$SOURCE_FILE")
    SOURCE_DIR="${SOURCE_FILE%.tsx}"
    [ -d "$SOURCE_DIR" ] && VIZ_PATHS+=("$SOURCE_DIR")
    while IFS= read -r DEPENDENCY; do
      [ -n "$DEPENDENCY" ] && VIZ_PATHS+=("$DEPENDENCY")
    done < <(node - "$SOURCE_FILE" <<'NODE'
const fs = require("node:fs");
const path = require("node:path");

const entry = path.resolve(process.argv[2]);
const seen = new Set([entry]);
const queue = [entry];
const found = [];
const extensions = [".tsx", ".ts", ".jsx", ".js"];

function resolveRelative(fromFile, specifier) {
  const base = path.resolve(path.dirname(fromFile), specifier);
  const candidates = [
    ...extensions.map((extension) => base + extension),
    ...extensions.map((extension) => path.join(base, "index" + extension)),
  ];
  return candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
}

while (queue.length > 0) {
  const file = queue.shift();
  const source = fs.readFileSync(file, "utf8");
  const imports = source.matchAll(/(?:from\s+|import\s*)["'](\.[^"']+)["']/g);
  for (const match of imports) {
    const resolved = resolveRelative(file, match[1]);
    if (!resolved || seen.has(resolved)) continue;
    seen.add(resolved);
    queue.push(resolved);
    found.push(path.relative(process.cwd(), resolved));
  }
}

process.stdout.write(found.join("\n"));
NODE
)
  fi
fi
if [ ${#VIZ_PATHS[@]} -gt 0 ]; then
  run node scripts/audit-viz-style.mjs --strict "${VIZ_PATHS[@]}"
fi

run node scripts/audit-prose-readability.mjs --strict "--route=$ROUTE"
run node scripts/audit-korean-naturalness.mjs --strict "--route=$ROUTE"
run node scripts/audit-term-density.mjs --strict "$ROUTE"
run node scripts/audit-term-pair-wrapping.mjs --strict "$ROUTE"
run node scripts/audit-article-reading-order.mjs --strict

if [ "$FULL" = "--full" ]; then
  run node scripts/audit-formula-annotations.mjs --strict --require-explicit
  run node scripts/audit-article-topology.mjs --strict
  run npx tsc -b --noEmit
fi

if [ $status -eq 0 ]; then
  echo "=== $ROUTE 검사 통과"
else
  echo "=== $ROUTE 검사 미통과 항목이 있습니다"
fi
exit $status
