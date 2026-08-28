#!/usr/bin/env bash
# 한 글의 route 단위 감사를 한 번에 돌린다.
#   scripts/check-article.sh ai/my-article            # 빠른 검사 (learning·graph·viz·prose·terms·order)
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
if [ ${#VIZ_PATHS[@]} -gt 0 ]; then
  run node scripts/audit-viz-style.mjs --strict "${VIZ_PATHS[@]}"
fi

run node scripts/audit-prose-readability.mjs --strict "--route=$ROUTE"
run node scripts/audit-term-density.mjs --strict "$ROUTE"
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
