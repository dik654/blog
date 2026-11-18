import SceneShell from "./SceneShell";

/**
 * 본문 대응: #capacity-sliding — Gemma의 local layer 50개가 window 1,024까지만 KV를 보존했다면
 * context 65,536에서 full allocation보다 증가율이 훨씬 작아야 한다. 실측 1.36×는 절감이 보이지 않았다.
 * local layer 하나: min(context, 1,024). 50 × 1,024 = 51,200, 50 × 65,536 = 3,276,800 (64배).
 */
const W = 360;
const LEFT = 108;
const RIGHT = 344;
const CONTEXT_MAX = 65536;
const WINDOW = 1024;
const LOCAL_LAYERS = 50;
const x = (tokens: number) => LEFT + (tokens / CONTEXT_MAX) * (RIGHT - LEFT);
const fmt = (n: number) => n.toLocaleString("en-US");

const STATES = [
  { context: 1024, local: 1024, inferred: false },
  { context: 65536, local: 1024, inferred: false },
  { context: 65536, local: 65536, inferred: true },
] as const;

const SCENES = [
  {
    label: "context가 window 이하일 때",
    summary: "local = full = 1,024",
    note: "(예시 길이) context가 1,024 token이면 window 안에 전부 들어가므로 local layer와 full-attention layer가 같은 양을 보존합니다. 차이는 context가 window를 넘을 때부터 생깁니다.",
  },
  {
    label: "window가 작동했다면 · 65,536",
    summary: `local 50개 합 ${fmt(LOCAL_LAYERS * WINDOW)} vs ${fmt(LOCAL_LAYERS * CONTEXT_MAX)}`,
    note: "Sliding window는 최근 1,024 token의 KV만 남깁니다. context 65,536에서 local layer 하나는 1/64만 들고 있고, 50개를 더해도 51,200 token분이라 full allocation의 3,276,800보다 64배 작습니다. 그렇다면 context를 늘려도 local layer 몫은 더 늘지 않습니다.",
  },
  {
    label: "실측 1.36×로 본 추론",
    summary: "절감 없음 · 1.36×",
    note: "실측 concurrency는 1.36×에 머물러 이 절감이 보이지 않았습니다. 본문은 이 build나 model path가 local layer를 full attention처럼 할당했을 가능성이 크다고 추론합니다. vLLM commit, warning log, --disable-hybrid-kv-cache-manager 여부, KV cache group을 남겨야 확정됩니다.",
  },
] as const;

export default function SlidingWindowAllocViz() {
  return (
    <SceneShell
      eyebrow="Sliding window와 실제 할당"
      title="local layer가 window만큼만 남겼다면 context 65,536에서 local layer의 KV가 64배 작았어야 합니다"
      description="가로축은 한 요청의 token 위치 0~65,536입니다. 막대는 layer 하나가 KV를 보존하는 구간이고, 오른쪽 끝이 가장 최근 token입니다."
      note="Local layer 50개, window 1,024, context 65,536, concurrency 1.36×는 본문의 Gemma 관측입니다. 64배는 local layer 몫만 비교한 값이고 full-attention layer는 어느 경우든 context 전체를 보존합니다. 세 번째 장면은 본문의 추론이며 확정된 원인이 아닙니다."
      ariaLabel="Sliding window가 작동할 때와 full처럼 할당될 때 local layer의 KV 보존 구간 비교"
      scenes={SCENES}
      render={(active) => {
        const s = STATES[active];
        const localStart = s.context - s.local;
        const sumLocal = LOCAL_LAYERS * s.local;
        return (
          <div className="min-w-0 space-y-3">
            <svg viewBox={`0 0 ${W} 132`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`context ${fmt(s.context)}에서 local layer 하나가 ${fmt(s.local)} token 보존`}>
              <line x1={x(s.context)} x2={x(s.context)} y1={8} y2={88} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
              <text x={LEFT - 6} y={32} textAnchor="end" fontSize={12} fill="#64748b">full layer 1개</text>
              <rect x={LEFT} y={20} width={Math.max(2, x(s.context) - LEFT)} height={16} rx={2} fill="#64748b" />
              <text x={LEFT - 6} y={68} textAnchor="end" fontSize={12} fill="#64748b">local layer 1개</text>
              <rect x={LEFT} y={56} width={RIGHT - LEFT} height={16} rx={2} fill="none" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
              <rect
                x={x(localStart)}
                y={56}
                width={Math.max(2, x(s.context) - x(localStart))}
                height={16}
                rx={2}
                fill={s.inferred ? "#dc2626" : "#2563eb"}
              />
              <text x={x(s.context)} y={86} textAnchor={s.context === CONTEXT_MAX ? "end" : "start"} fontSize={12} fontWeight={700} fill={s.inferred ? "#dc2626" : "#2563eb"}>
                {fmt(s.local)} token 보존
              </text>
              <line x1={LEFT} x2={RIGHT} y1={100} y2={100} stroke="#94a3b8" strokeWidth={1} />
              <text x={LEFT} y={116} textAnchor="start" fontSize={12} fill="#64748b">0</text>
              <text x={RIGHT} y={116} textAnchor="end" fontSize={12} fill="#64748b">{s.context === CONTEXT_MAX ? "context 65,536" : "65,536"}</text>
              {s.context !== CONTEXT_MAX && (
                <text x={x(s.context)} y={128} textAnchor="start" fontSize={12} fill="#64748b">
                  context {fmt(s.context)}
                </text>
              )}
            </svg>
            <dl className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="rounded-md border border-border px-3 py-2">
                <dt className="text-muted-foreground">local 50개 합</dt>
                <dd className={`font-bold ${s.inferred ? "text-[#dc2626]" : "text-[#2563eb]"}`}>{fmt(sumLocal)} token분</dd>
              </div>
              <div className="rounded-md border border-border px-3 py-2">
                <dt className="text-muted-foreground">full로 잡으면</dt>
                <dd className="font-bold">{fmt(LOCAL_LAYERS * s.context)} token분</dd>
              </div>
            </dl>
          </div>
        );
      }}
    />
  );
}
