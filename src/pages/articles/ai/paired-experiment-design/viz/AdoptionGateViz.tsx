import SceneShell from "./SceneShell";

/**
 * 본문 대응: #why-one-change, #paired-delta — 실행 전에 정한 세 조건(가정)을 이번 결과에 적용한다.
 * 평균 차이 0.0034 > 0 통과, C 집단 값은 본문에 없음, 지연 100→118ms = 18% > 10% 실패 → 채택하지 않음.
 * 마지막 장면의 사후 상한 20%는 결론이 바뀌는 모습을 보이려는 가정값이다.
 */
const BEFORE_MS = 100;
const AFTER_MS = 118;
const GROWTH = Math.round(((AFTER_MS - BEFORE_MS) / BEFORE_MS) * 100);

type Status = "wait" | "pass" | "fail" | "open";

const ROWS = [
  { name: "전체 평균 차이가 양수", value: "+0.0034" },
  { name: "C 집단이 나빠지지 않음", value: "같은 실행에 기록해 확인" },
  { name: "지연 증가 {limit}% 이하", value: `${BEFORE_MS} → ${AFTER_MS}ms = ${GROWTH}%` },
] as const;

const SCENES = [
  { label: "조건 1 · 평균", summary: "0.0034 > 0 → 통과", status: ["pass", "wait", "wait"], limit: 10, verdict: "", note: "다섯 묶음 차이의 평균 0.0034는 0보다 큽니다. 첫 조건은 통과하지만 채택은 세 조건을 모두 본 뒤에 정합니다." },
  { label: "조건 2 · C 집단", summary: "값은 본문에 없음", status: ["pass", "open", "wait"], limit: 10, verdict: "", note: "이 변경을 고른 이유가 C 집단에서 놓치는 양이었으므로 변경 전후의 C 집단 결과를 같은 실행에 기록해 확인합니다. 이 사례는 그 값을 제시하지 않아 그림에서도 통과·실패를 정하지 않았습니다." },
  { label: "조건 3 · 지연", summary: `${GROWTH}% > 10% → 실패`, status: ["pass", "open", "fail"], limit: 10, verdict: "", note: `100ms에서 118ms로 늘면 (118−100)÷100 = ${GROWTH}%입니다. 미리 정한 상한 10%(110ms)를 넘습니다.` },
  { label: "판정", summary: "채택하지 않음", status: ["pass", "open", "fail"], limit: 10, verdict: "채택하지 않음 · 값과 가설은 기록", note: "평균 개선이 있어도 지연 조건 하나가 실패했으므로 이번 기준으로는 채택하지 않습니다. 거절한 실행도 값과 가설을 남겨 다음 비교의 출발점으로 삼습니다." },
  { label: "결과를 본 뒤 상한을 올리면", summary: "상한 20%(가정) → 결론이 바뀜", status: ["pass", "open", "pass"], limit: 20, verdict: "처음 기준과 다른 결론", note: "결과를 보고 상한을 20%로 올리면(가정) 18%가 통과로 바뀝니다. 실행 전에 정한 10% 기준의 결론과 달라지므로 기준은 실행 전에 고정합니다." },
] as const;

const BADGE: Record<Status, { text: string; className: string }> = {
  wait: { text: "대기", className: "border-border text-muted-foreground" },
  pass: { text: "통과", className: "border-emerald-600 text-emerald-700 dark:text-emerald-400" },
  fail: { text: "실패", className: "border-red-600 text-red-700 dark:text-red-400" },
  open: { text: "확인 필요", className: "border-dashed border-amber-600 text-amber-700 dark:text-amber-400" },
};

const W = 360;
const H = 70;
const X0 = 12;
const X1 = W - 12;
const MAX_MS = 130;
const x = (ms: number) => X0 + (ms / MAX_MS) * (X1 - X0);

function LatencyBar({ limitPct, emphasize }: { limitPct: number; emphasize: boolean }) {
  const limitMs = BEFORE_MS * (1 + limitPct / 100);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`지연 ${AFTER_MS}ms와 상한 ${limitMs}ms`}>
      <rect x={X0} y={18} width={x(BEFORE_MS) - X0} height={12} rx={2} fill="#94a3b8" />
      <text x={X0} y={13} fontSize={10} fill="#64748b">변경 전 {BEFORE_MS}ms</text>
      <rect x={X0} y={38} width={x(AFTER_MS) - X0} height={12} rx={2} fill={emphasize ? "#dc2626" : "#2563eb"} opacity={0.85} />
      <text x={x(AFTER_MS) + 4} y={48} fontSize={10} fontWeight={700} fill={emphasize ? "#dc2626" : "#1e40af"}>{AFTER_MS}</text>
      <line x1={x(limitMs)} x2={x(limitMs)} y1={14} y2={56} stroke="#d97706" strokeWidth={1.25} strokeDasharray="4 3" />
      <text x={x(limitMs)} y={67} textAnchor="middle" fontSize={10} fontWeight={700} fill="#b45309">상한 {limitMs}ms</text>
    </svg>
  );
}

export default function AdoptionGateViz() {
  return (
    <SceneShell
      eyebrow="사전 채택 기준"
      title="세 조건을 모두 통과해야 채택합니다"
      description="5절에서 실행 전에 정한 기준(가정)을 이번 결과에 차례로 적용합니다. 아래 막대는 같은 조건에서 잰 지연입니다."
      ariaLabel="평균 차이, C 집단, 지연 증가 세 조건을 차례로 적용한 채택 판정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const statuses = scene.status as readonly Status[];
        return (
          <div className="min-w-0 space-y-4">
            <ul className="space-y-2">
              {ROWS.map((row, index) => {
                const badge = BADGE[statuses[index]];
                return (
                  <li key={row.name} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-background px-3 py-2 text-sm">
                    <span className="min-w-0">
                      <span className="block font-semibold">{index + 1}. {row.name.replace("{limit}", String(scene.limit))}{scene.limit !== 10 && index === 2 ? " (사후 변경)" : ""}</span>
                      <span className="block font-mono text-xs text-muted-foreground">{statuses[index] === "wait" ? "—" : row.value}</span>
                    </span>
                    <span className={`rounded-md border px-2 py-0.5 text-xs font-bold ${badge.className}`}>{badge.text}</span>
                  </li>
                );
              })}
            </ul>
            <LatencyBar limitPct={scene.limit} emphasize={statuses[2] === "fail"} />
            <p className={`min-h-6 text-center text-sm font-bold ${scene.verdict ? "text-foreground" : "text-transparent"}`} aria-hidden={!scene.verdict}>
              {scene.verdict || "—"}
            </p>
          </div>
        );
      }}
    />
  );
}
