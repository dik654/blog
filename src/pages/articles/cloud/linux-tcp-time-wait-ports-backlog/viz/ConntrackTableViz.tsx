import SceneShell from "./SceneShell";

/**
 * 본문 대응: #conntrack — 상한 262,144칸 table이 차는 과정. 600 × 120 = 72,000, 262,144 ÷ 120 ≈ 2,184.
 * 상한의 95% = 262,144 × 0.95 ≈ 249,137. 마지막 장면의 ESTABLISHED 비율은 본문에 없어 숫자를 적지 않는다.
 */
const W = 360;
const H = 104;
const LEFT = 12;
const RIGHT = 348;
const BAR_Y = 34;
const BAR_H = 28;
const MAX = 262144;
const GC_LINE = MAX * 0.95;
const tx = (value: number) => LEFT + (value / MAX) * (RIGHT - LEFT);

interface TableState {
  filled: number;
  color: string;
  label: string;
  rate: string;
  outcome: string;
  showGc: boolean;
  outcomeBad: boolean;
}

const STATES: readonly TableState[] = [
  { filled: 72000, color: "#2563eb", label: "TIME_WAIT 항목 72,000", rate: "600개/초", outcome: "여유 있음", showGc: false, outcomeBad: false },
  { filled: 262080, color: "#2563eb", label: "", rate: "약 2,184개/초", outcome: "상한에 닿음", showGc: false, outcomeBad: false },
  { filled: MAX, color: "#dc2626", label: "", rate: "약 2,184개/초 초과", outcome: "자리 못 만들면 버림", showGc: true, outcomeBad: true },
  { filled: GC_LINE, color: "#2563eb", label: "", rate: "약 2,184개/초 초과", outcome: "짧게 몰렸다 풀림", showGc: true, outcomeBad: false },
  { filled: MAX, color: "#64748b", label: "", rate: "—", outcome: "gc로 못 지움 · 벽", showGc: true, outcomeBad: true },
];

const SCENES = [
  { label: "600개/초", summary: "600 × 120 = 72,000", note: "이 장부의 TIME_WAIT 기본값은 120초라서 600개/초면 72,000개가 남습니다. 상한까지 아직 여유가 있습니다." },
  { label: "약 2,184개/초", summary: "262,144 ÷ 120 ≈ 2,184", note: "같은 계산으로 초당 약 2,184개를 넘으면 120초 동안 쌓인 항목이 상한에 닿습니다." },
  { label: "상한을 넘는 순간", summary: "table full, dropping packet", note: "먼저 같은 hash 칸의 확인되지 않은 항목을 지워 자리를 만듭니다. 못 만들면 새 연결의 packet을 버리고 dmesg에 경고를 찍습니다." },
  { label: "gc가 끝나 가는 항목을 지웁니다", summary: "상한의 95% 아래까지 (≈ 249,137)", note: "gc는 끝나 가는 항목을 지우는 정리 작업입니다. 95% 아래까지 지우므로 항목 대부분이 TIME_WAIT라면 버려짐은 짧게 몰렸다 풀립니다." },
  { label: "ESTABLISHED가 table을 채웠다면", summary: "gc가 지울 수 없음", note: "지울 수 없는 항목이 채우면 상한은 단단한 벽이 됩니다. 어느 쪽이든 애플리케이션은 오류 대신 SYN 재전송으로 늦어진 응답을 봅니다." },
] as const;

export default function ConntrackTableViz() {
  return (
    <SceneShell
      eyebrow="세 번째 장부"
      title="conntrack table은 120초 동안 쌓인 항목으로 찹니다"
      description="막대 전체가 상한 nf_conntrack_max이고 채운 부분이 항목 수입니다. 점선은 상한의 95%입니다."
      note="262,144는 64비트에서 메모리가 4GiB를 넘을 때의 기본값입니다. 마지막 장면의 채움은 그림용입니다(가정)."
      ariaLabel="conntrack table이 차고 gc가 지우거나 지우지 못하는 과정"
      scenes={SCENES}
      render={(active) => {
        const state = STATES[active];
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <rect x={LEFT} y={BAR_Y} width={RIGHT - LEFT} height={BAR_H} rx={3} fill="none" stroke="#94a3b8" strokeWidth={1} />
              <rect x={LEFT} y={BAR_Y} width={tx(state.filled) - LEFT} height={BAR_H} rx={3} fill={state.color} fillOpacity={0.85} />
              {state.label && <text x={tx(state.filled) + 6} y={BAR_Y + 19} fontSize={11} fontWeight={700} fill="currentColor">{state.label}</text>}
              {state.showGc && (
                <g>
                  <line x1={tx(GC_LINE)} x2={tx(GC_LINE)} y1={BAR_Y - 6} y2={BAR_Y + BAR_H + 6} stroke="#d97706" strokeWidth={1.25} strokeDasharray="3 2" />
                  <text x={tx(GC_LINE)} y={BAR_Y - 11} textAnchor="end" fontSize={11} fontWeight={700} fill="#d97706">95%</text>
                </g>
              )}
              <text x={LEFT} y={BAR_Y + BAR_H + 22} fontSize={11} fill="currentColor">0</text>
              <text x={RIGHT} y={BAR_Y + BAR_H + 22} textAnchor="end" fontSize={11} fontWeight={700} fill="currentColor">상한 262,144</text>
            </svg>
            <dl className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div className="min-w-0 rounded-lg border border-border px-2 py-2">
                <dt className="text-muted-foreground">새 연결</dt>
                <dd className="mt-1 font-mono font-bold">{state.rate}</dd>
              </div>
              <div className="min-w-0 rounded-lg border border-border px-2 py-2">
                <dt className="text-muted-foreground">이때 일어나는 일</dt>
                <dd className="mt-1 font-bold" style={{ color: state.outcomeBad ? "#dc2626" : undefined }}>{state.outcome}</dd>
              </div>
            </dl>
          </div>
        );
      }}
    />
  );
}
