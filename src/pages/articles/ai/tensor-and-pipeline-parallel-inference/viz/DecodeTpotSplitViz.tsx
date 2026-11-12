import SceneShell from "./SceneShell";

/**
 * 본문 대응: #decode-impact — 70B·80 layer decode 의 token 당 시간(TPOT).
 * TP 8: weight 5.2 ms + 통신 약 1 ms(α 몫 80 × 2 × 5 μs = 0.8 ms 포함) = 6.2 ms, 통신 16%.
 * TP 16(α 5 μs 그대로라면): 2.6 ms + 1 ms 남짓 = 3.7 ms, 통신 28%.
 * TP 16 이 node 를 넘어 α 15 μs: 통신 2.4 ms(160 × 15 μs) → 5 ms, TP 8 대비 약 20% 감소.
 */
const ROWS = [
  { name: "TP 8 · α 5 μs", weight: 5.2, comm: 1.0, commLabel: "약 1", total: "6.2 ms · 통신 16%" },
  { name: "TP 16 · α 5 μs 그대로라면", weight: 2.6, comm: 1.1, commLabel: "1 남짓", total: "3.7 ms · 통신 28%" },
  { name: "TP 16 · node 를 넘어 α 15 μs", weight: 2.6, comm: 2.4, commLabel: "2.4", total: "5 ms · TP 8 대비 20%↓" },
] as const;

const SCENES = [
  { label: "TP 8", summary: "5.2 + 약 1 = 6.2 ms", note: "통신 약 1 ms 가운데 0.8 ms 는 byte 와 무관한 고정 비용입니다. 80 layer × layer 마다 2 회 × 회마다 5 μs = 800 μs 이고, 나머지가 byte 에 비례하는 전송 시간입니다. 막대 전체가 TPOT 입니다." },
  { label: "TP 16 으로 올리면", summary: "weight 절반, 통신은 줄지 않음", note: "GPU 당 weight 가 8.75 GB 로 줄어 읽기는 2.6 ms 가 됩니다. 통신은 참여 rank 가 늘어 오히려 조금 늘어나므로 TPOT 은 41% 만 줄고 통신 비율은 28% 로 오릅니다." },
  { label: "TP 16 이 node 를 넘으면", summary: "160 × 15 μs = 2.4 ms", note: "TP 16 은 한 node 의 8 GPU 를 넘으므로 all-reduce 의 한 hop 이 NVLink 가 아니라 InfiniBand 를 지납니다. α 가 15 μs 로 오르면 통신이 2.4 ms 가 되어 weight 절감분을 먹고, TPOT 은 TP 8 대비 20% 밖에 줄지 않습니다." },
] as const;

const LEFT = 16;
const W = 300;
const MAX_MS = 6.4;
const px = (ms: number) => (ms / MAX_MS) * W;

export default function DecodeTpotSplitViz() {
  return (
    <SceneShell
      eyebrow="decode TPOT"
      title="TP 를 올리면 weight 읽기는 줄지만 layer 마다 붙는 통신은 줄지 않습니다"
      description="막대 하나가 70B·80 layer model 의 TPOT, 곧 decode 에서 token 하나를 더 내는 데 드는 시간(ms)입니다. 파란 부분은 weight 읽기, 빨간 부분은 TP all-reduce 통신입니다. 수치는 본문의 계산 예시입니다."
      ariaLabel="TP 8, TP 16, node 를 넘는 TP 16 에서 decode TPOT 의 weight 읽기와 통신 몫"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 176" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {ROWS.map((row, index) => {
            const y = 22 + index * 50;
            const shown = index <= active;
            const current = index === active;
            return (
              <g key={row.name} opacity={shown ? (current ? 1 : 0.45) : 0}>
                <text x={LEFT} y={y} fontSize={11} fontWeight={700} fill="#475569">{row.name}</text>
                <text x={LEFT + W + 28} y={y} textAnchor="end" fontSize={11} fontWeight={700} fill={current ? "#475569" : "#475569"}>{row.total}</text>
                <rect x={LEFT} y={y + 6} width={px(row.weight)} height={20} rx={2} fill="#2563eb" />
                <text x={LEFT + 6} y={y + 20} fontSize={11} fill="#ffffff">weight {row.weight}</text>
                <rect x={LEFT + px(row.weight)} y={y + 6} width={px(row.comm)} height={20} rx={2} fill="#dc2626" />
                <text x={LEFT + px(row.weight) + px(row.comm) / 2} y={y + 20} textAnchor="middle" fontSize={11} fill="#ffffff">{row.commLabel}</text>
              </g>
            );
          })}
          <line x1={LEFT} x2={LEFT + W} y1={166} y2={166} stroke="#94a3b8" strokeWidth={1} />
          {[0, 2, 4, 6].map((ms) => (
            <text key={ms} x={LEFT + px(ms)} y={175} textAnchor="middle" fontSize={10} fill="#64748b">{ms} ms</text>
          ))}
        </svg>
      )}
    />
  );
}
