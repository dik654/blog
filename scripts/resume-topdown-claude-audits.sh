#!/usr/bin/env bash
set -euo pipefail

ROOT="${CLAUDE_WORKSPACE_ROOT:-/home/heru/code}"
BLOG="$ROOT/blog"
QUEUE="${CLAUDE_QUEUE:-$BLOG/.codex-tmp/claude-ai-learning-closure-audit-2026-07-31}"
RUNNER="$BLOG/scripts/run-strict-claude-audit.sh"
PARALLEL="${TOPDOWN_CLAUDE_PARALLEL:-6}"
export PATH="$HOME/.cargo/bin:$HOME/.local/bin:$PATH"

exec 9>"$QUEUE/resume.lock"
if ! flock -n 9; then
  printf 'Another top-down Claude audit resume is already running.\n'
  exit 0
fi

touch "$QUEUE/progress.jsonl"

latest_strict_row() {
  local id=$1
  jq -sc --arg id "$id" '
    map(select(
      .id == $id
      and .status == "completed"
      and .strict_valid == true
      and .source_hash_stable == true
      and (.first_line == "ACCEPT" or .first_line == "REVISE")
    ))
    | sort_by(.attempt)
    | last // empty
  ' "$QUEUE/progress.jsonl"
}

receipt_is_current() {
  local id=$1
  local row=$2
  local attempt
  local receipt
  local current
  attempt=$(jq -r '.attempt' <<<"$row")
  receipt=$(cat "$QUEUE/hashes/$id.attempt-$attempt.after" 2>/dev/null || true)
  mapfile -t sources < <(jq -r --arg id "$id" '.[] | select(.id == $id) | .sources[]' "$QUEUE/manifest.json")
  current=$(cd "$ROOT" && sha256sum "${sources[@]}")
  [[ -n "$receipt" && "$receipt" == "$current" ]]
}

next_attempt() {
  local id=$1
  local last
  last=$(jq -r --arg id "$id" 'select(.id == $id and .status == "completed") | .attempt' \
    "$QUEUE/progress.jsonl" 2>/dev/null | sort -n | tail -n 1)
  printf '%s\n' "$(( ${last:-0} + 1 ))"
}

PENDING_IDS=()
while IFS= read -r id; do
  row=$(latest_strict_row "$id")
  if [[ -z "$row" ]] || ! receipt_is_current "$id" "$row"; then
    PENDING_IDS+=("$id")
  fi
done < <(jq -r '.[].id' "$QUEUE/manifest.json")

if [[ "${#PENDING_IDS[@]}" -eq 0 ]]; then
  printf 'All queued top-down Claude audits have current strict receipts.\n'
  exit 0
fi

source "$ROOT/context-manager/scripts/lib/load-secrets.sh"
load_secrets >/dev/null
TOKEN="${CM_API_TOKEN:-${API_TOKEN:-}}"
test -n "$TOKEN"

mkdir -p "$QUEUE/preflight"
preflight_stamp=$(date +%Y%m%dT%H%M%S%z)
preflight_request="$QUEUE/preflight/$preflight_stamp.request.json"
preflight_result="$QUEUE/preflight/$preflight_stamp.result.json"
preflight_http="$QUEUE/preflight/$preflight_stamp.http"
work_file=$(mktemp)
trap 'rm -f "$work_file"' EXIT

jq -nc \
  --arg task_id "blog-topdown-preflight-$preflight_stamp" \
  '{
    prompt:"Reply exactly OK.",
    worker:"claude-code:sonnet",
    difficulty_hint:"L1",
    worker_timeout_ms:60000,
    workdir:"/home/heru/code",
    harness_mode:"auto",
    task_family:"blog_topdown_audit_preflight",
    task_id:$task_id
  }' >"$preflight_request"

code=$(curl -sS --max-time 90 -o "$preflight_result" -w "%{http_code}" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data-binary "@$preflight_request" \
  http://127.0.0.1:18002/api/orchestration/delegate || true)
printf '%s\n' "$code" >"$preflight_http"

if ! jq -e --arg code "$code" '
  ($code == "200")
  and (.ok == true)
  and (.decision.worker == "claude-code:sonnet")
  and (.attempts[0].ok == true)
  and (.result == "OK")
' "$preflight_result" >/dev/null 2>&1; then
  reason=$(jq -r '.attempts[0].error // .error // .result // "Context Manager Claude preflight failed"' "$preflight_result" 2>/dev/null || true)
  printf 'Top-down Claude queue remains paused after Context Manager preflight (HTTP %s): %s\n' "$code" "$reason" >&2
  exit 75
fi

for id in "${PENDING_IDS[@]}"; do
  printf '%s\t%s\n' "$id" "$(next_attempt "$id")" >>"$work_file"
done

export CLAUDE_QUEUE="$QUEUE"
export CLAUDE_WORKSPACE_ROOT="$ROOT"
xargs -P "$PARALLEL" -n 2 bash -c '"$0" "$1" "$2"' "$RUNNER" <"$work_file"

(
  cd "$BLOG"
  npm run audit:topdown-receipts
)

status=0
for id in "${PENDING_IDS[@]}"; do
  row=$(latest_strict_row "$id")
  if [[ -z "$row" ]] || ! receipt_is_current "$id" "$row"; then
    status=1
  else
    printf '%s\n' "$row"
  fi
done

exit "$status"
