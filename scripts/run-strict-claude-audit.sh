#!/usr/bin/env bash
set -euo pipefail

ROOT="${CLAUDE_WORKSPACE_ROOT:-/home/heru/code}"
QUEUE="${CLAUDE_QUEUE:?CLAUDE_QUEUE must point to an audit queue}"
MANIFEST="$QUEUE/manifest.json"
ID="${1:?audit id required}"
ATTEMPT="${2:-1}"
export PATH="$HOME/.cargo/bin:$HOME/.local/bin:$PATH"

mkdir -p "$QUEUE/results" "$QUEUE/requests" "$QUEUE/hashes" "$QUEUE/http"
touch "$QUEUE/progress.jsonl"
source "$ROOT/context-manager/scripts/lib/load-secrets.sh"
load_secrets >/dev/null
TOKEN="${CM_API_TOKEN:-${API_TOKEN:-}}"
test -n "$TOKEN"

scope=$(jq -r --arg id "$ID" '.[] | select(.id == $id) | .scope' "$MANIFEST")
mapfile -t sources < <(jq -r --arg id "$ID" '.[] | select(.id == $id) | .sources[]' "$MANIFEST")
test -n "$scope"
test "${#sources[@]}" -gt 0

before=$(cd "$ROOT" && sha256sum "${sources[@]}")
printf "%s\n" "$before" >"$QUEUE/hashes/$ID.attempt-$ATTEMPT.before"

prompt=$(printf "%s\n\n%s\n%s\n\n%s\n%s\n\n%s\n" \
  "READ-ONLY CURRENT-SOURCE MICRO AUDIT. The first non-empty line must be exactly ACCEPT or exactly REVISE. Nothing may precede it. Emit exactly one standalone verdict line in the entire response. Never retract, repeat, or contradict that verdict later. If the verdict is ACCEPT, do not include any P0, P1, or P2 finding heading anywhere later." \
  "SCOPE" "$scope" \
  "Read every listed file directly. Do not edit files or enter plan mode. Files:" "$(printf "%s\n" "${sources[@]}")" \
  "After the verdict, write concise Korean evidence so the result exceeds 120 characters. For REVISE, give at most four findings with exact file and line or exact source evidence, learner or provenance consequence, and the smallest correction. Compile success alone is not acceptance.")
payload=$(jq -nc \
  --arg prompt "$prompt" \
  --arg task_id "blog-topdown-$ID-attempt-$ATTEMPT-20260731" \
  '{
    prompt:$prompt,
    worker:"claude-code:sonnet",
    difficulty_hint:"L1",
    worker_timeout_ms:420000,
    workdir:"/home/heru/code",
    harness_mode:"auto",
    task_family:"blog_topdown_closure_audit",
    task_id:$task_id
  }')
printf "%s\n" "$payload" >"$QUEUE/requests/$ID.attempt-$ATTEMPT.request.json"

(
  flock -x 9
  jq -nc --arg id "$ID" --arg at "$(date -Iseconds)" --argjson attempt "$ATTEMPT" \
    '{id:$id,status:"running",attempt:$attempt,at:$at}' >>"$QUEUE/progress.jsonl"
) 9>"$QUEUE/progress.lock"

out="$QUEUE/results/$ID.attempt-$ATTEMPT.raw.json"
code=$(curl -sS --max-time 540 -o "$out.tmp" -w "%{http_code}" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data-binary "@$QUEUE/requests/$ID.attempt-$ATTEMPT.request.json" \
  http://127.0.0.1:18002/api/orchestration/delegate || true)
test -s "$out.tmp" && mv "$out.tmp" "$out" || printf "{}\n" >"$out"
printf "%s\n" "$code" >"$QUEUE/http/$ID.attempt-$ATTEMPT.http"

after=$(cd "$ROOT" && sha256sum "${sources[@]}")
printf "%s\n" "$after" >"$QUEUE/hashes/$ID.attempt-$ATTEMPT.after"
first=$(jq -r '(.result // "") | split("\n") | map(select(length > 0)) | .[0] // ""' "$out" 2>/dev/null || true)
verdict_count=$(jq -r '(.result // "") | split("\n") | map(gsub("^\\s+|\\s+$"; "")) | map(select(. == "ACCEPT" or . == "REVISE")) | length' "$out" 2>/dev/null || echo 0)
verdict_unique=$(jq -r '(.result // "") | split("\n") | map(gsub("^\\s+|\\s+$"; "")) | map(select(. == "ACCEPT" or . == "REVISE")) | unique | length' "$out" 2>/dev/null || echo 0)
semantic_contradiction=$(jq -r --arg first "$first" \
  'if $first == "ACCEPT" then ((.result // "") | split("\n") | map(gsub("^\\s+|\\s+$"; "")) | any(test("^(?:[#>*-]+\\s*)*\\*{0,2}P[012](?:[[:space:]]|\\(|:)"))) else false end' \
  "$out" 2>/dev/null || echo true)
strict=$(jq -r \
  --arg http "$code" \
  --arg first "$first" \
  --argjson verdict_count "$verdict_count" \
  --argjson verdict_unique "$verdict_unique" \
  --argjson semantic_contradiction "$semantic_contradiction" \
  '(($http == "200")
    and (.ok == true)
    and (.decision.worker == "claude-code:sonnet")
    and (.attempts[0].ok == true)
    and (((.result // "") | length) > 120)
    and (($first == "ACCEPT") or ($first == "REVISE"))
    and ($verdict_count == 1)
    and ($verdict_unique == 1)
    and ($semantic_contradiction == false))' \
  "$out" 2>/dev/null || echo false)
stable=$([ "$before" = "$after" ] && echo true || echo false)
chars=$(jq -r '(.result // "") | length' "$out" 2>/dev/null || echo 0)
worker=$(jq -r '.decision.worker // ""' "$out" 2>/dev/null || true)

(
  flock -x 9
  jq -nc \
    --arg id "$ID" \
    --arg at "$(date -Iseconds)" \
    --arg http "$code" \
    --arg first "$first" \
    --arg worker "$worker" \
    --argjson attempt "$ATTEMPT" \
    --argjson strict "$strict" \
    --argjson stable "$stable" \
    --argjson chars "$chars" \
    --argjson verdict_count "$verdict_count" \
    --argjson verdict_unique "$verdict_unique" \
    --argjson semantic_contradiction "$semantic_contradiction" \
    '{
      id:$id,
      status:"completed",
      attempt:$attempt,
      at:$at,
      http:(($http|tonumber?)//0),
      worker:$worker,
      strict_valid:$strict,
      source_hash_stable:$stable,
      first_line:$first,
      verdict_line_count:$verdict_count,
      verdict_unique_count:$verdict_unique,
      semantic_contradiction:$semantic_contradiction,
      result_characters:$chars
    }' >>"$QUEUE/progress.jsonl"
) 9>"$QUEUE/progress.lock"
