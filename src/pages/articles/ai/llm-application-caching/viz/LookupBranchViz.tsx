import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #cache-key-ttl-staleness의 AlgorithmBlock — 네 입력이 절차의 어느 줄에서 끝나는지.
 * 첫 그림은 semantic hit 한 경로만 보여 주므로 여기서는 TTL 만료와 저장까지 포함한 네 갈래를 나란히 둔다.
 */
type RowState = "plain" | "stop" | "off" | "run";
type Row = readonly [RowState, string];

const ROWS = ["Exact-match 조회", "Embedding·가장 가까운 후보", "유사도 ≥ τ, TTL 남음?", "실제로 실행", "두 저장소에 저장"] as const;
const OFF: Row = ["off", "실행 안 함"];
const RUN: Row = ["run", "실행"];
const MISS: Row = ["plain", "miss"];
const SEARCH: Row = ["plain", "실행"];

const SCENES = [
  { label: "같은 key · TTL 남음", summary: "Exact-match에서 반환", note: "문자열·model·옵션이 모두 같아 key가 그대로 있고 수명이 남아 첫 줄에서 저장된 응답을 돌려줍니다. Embedding도 만들지 않습니다.", rows: [["stop", "hit · 여기서 끝"], OFF, OFF, OFF, OFF] },
  { label: "다른 문자열 · 0.97 · TTL 남음", summary: "Semantic에서 반환", note: "가장 가까운 후보가 τ=0.95를 넘고 수명도 남아 저장된 응답을 돌려줍니다.", rows: [MISS, SEARCH, ["stop", "hit · 여기서 끝"], OFF, OFF] },
  { label: "다른 문자열 · 0.97 · TTL 지남", summary: "유사해도 실행", note: "유사도는 기준을 넘지만 수명이 지나 hit이 아닙니다. Threshold와 TTL을 모두 통과해야 합니다.", rows: [MISS, SEARCH, ["plain", "TTL 지남 · miss"], RUN, RUN] },
  { label: "다른 문자열 · 0.90(가정)", summary: "기준 미달로 실행", note: "후보가 τ=0.95에 못 미칩니다. 결과를 TTL과 함께 저장해 다음 같은 요청과 비슷한 요청이 hit할 수 있게 합니다.", rows: [MISS, SEARCH, ["plain", "τ 미달 · miss"], RUN, RUN] },
] as const satisfies readonly { label: string; summary: string; note: string; rows: readonly Row[] }[];

function FlowPanel({ rows }: { rows: readonly Row[] }) {
  return (
    <ol className="min-w-0 space-y-1">
      {ROWS.map((row, index) => {
        const [state, text] = rows[index];
        return (
          <li
            key={row}
            className={`flex items-center justify-between gap-2 rounded border px-3 py-1.5 text-xs leading-5 sm:text-sm ${
              state === "stop" ? "border-primary bg-primary/15 font-bold" : state === "run" ? "border-amber-600 bg-background font-semibold" : state === "off" ? "border-dashed border-border/50 text-muted-foreground/60" : "border-border bg-background"
            }`}
          >
            <span className="min-w-0">{row}</span>
            <span className="shrink-0 text-xs font-bold">{text}</span>
          </li>
        );
      })}
    </ol>
  );
}

export default function LookupBranchViz() {
  return (
    <SceneShell
      eyebrow="절차의 네 갈래"
      title="요청이 어느 줄에서 끝나는지는 입력과 수명이 정합니다"
      description="Cache key를 만든 뒤의 절차를 네 입력으로 따라갑니다. τ는 semantic hit 기준선(예: 0.95)이고 유사도 값도 예시입니다."
      ariaLabel="cache 조회 절차가 네 입력에서 어느 단계에 끝나는지 비교"
      scenes={SCENES}
      render={(active) => <StableSceneStack active={active} scenes={SCENES.map((scene) => <FlowPanel key={scene.label} rows={scene.rows} />)} />}
    />
  );
}
