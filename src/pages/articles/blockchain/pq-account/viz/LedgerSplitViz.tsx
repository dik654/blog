import PqSceneShell from "./PqSceneShell";

/**
 * 본문 대응: #picture — 3·4절의 설명용 성공 사례.
 * 송금 장부: A 1 → 0.9, B 0 → 0.1 (합 1).
 * 비용 장부: 예치금 0.020 → 0.017 + 예약 0.003 → 0.019(= 0.017 + 환급 0.002), 지급 0.001 (합 0.02).
 * 대조: 0.9 + 0.1 + 0.019 = 1.019, + 지급 0.001 = 1.02.
 */
type Segment = { label: string; value: number; color: string };

const SEND_TOTAL = 1;
const COST_TOTAL = 0.02;

const SCENES = [
  {
    label: "시작",
    summary: "1 + 0.020 = 1.02 ETH · 순번 7",
    note: "A의 송금용 잔액 1 ETH와 비용 예치금 0.02 ETH는 다른 장부입니다. 아래 막대는 위 막대보다 훨씬 작은 금액을 크게 늘려 그렸습니다.",
    send: [
      { label: "A 1", value: 1, color: "#64748b" },
    ],
    cost: [
      { label: "예치금 0.020", value: 0.02, color: "#16a34a" },
    ],
    moves: [] as string[],
  },
  {
    label: "검증·비용 예약",
    summary: "0.017 + 예약 0.003 · 순번 8(잠정)",
    note: "예치금에서 최대 비용 0.003 ETH를 미리 떼어 둡니다. 송금 장부는 아직 그대로입니다. 이 변경은 상위 거래가 되돌아가면 취소됩니다.",
    send: [
      { label: "A 1", value: 1, color: "#64748b" },
    ],
    cost: [
      { label: "0.017", value: 0.017, color: "#16a34a" },
      { label: "예약 0.003", value: 0.003, color: "#d97706" },
    ],
    moves: ["예치금 → 예약 0.003"],
  },
  {
    label: "송금·정산 완료",
    summary: "A 0.9 · B 0.1 · 예치금 0.019 · 순번 8",
    note: "0.1 ETH는 송금 장부 안에서 A에서 B로 옮겨갑니다. 예약 0.003 가운데 0.001은 비용으로 청구되고 0.002는 예치금으로 돌아옵니다. 환급은 A의 송금용 잔액으로 가지 않습니다.",
    send: [
      { label: "A 0.9", value: 0.9, color: "#64748b" },
      { label: "B 0.1", value: 0.1, color: "#2563eb" },
    ],
    cost: [
      { label: "0.017 + 환급 0.002", value: 0.019, color: "#16a34a" },
      { label: "지급 0.001 (계정 밖)", value: 0.001, color: "#dc2626" },
    ],
    moves: ["A → B 0.1", "예약 → 예치금 0.002", "예약 → 비용 지급 0.001"],
  },
  {
    label: "합계 대조",
    summary: "1.019 + 0.001 = 1.02 ETH",
    note: "남은 세 잔액(0.9 + 0.1 + 0.019)은 1.019 ETH입니다. 장부 밖으로 나간 비용 0.001 ETH를 더해야 처음 1.02 ETH와 맞습니다. 이 대조가 요청의 성공 기록과 함께 맞아야 송금과 정산을 확인한 것입니다.",
    send: [
      { label: "A 0.9", value: 0.9, color: "#64748b" },
      { label: "B 0.1", value: 0.1, color: "#2563eb" },
    ],
    cost: [
      { label: "예치금 0.019", value: 0.019, color: "#16a34a" },
      { label: "지급 0.001 (계정 밖)", value: 0.001, color: "#dc2626" },
    ],
    moves: ["0.9 + 0.1 + 0.019 = 1.019", "1.019 + 0.001 = 1.02"],
  },
] as const;

function LedgerBar({ title, scale, segments }: { title: string; scale: string; segments: readonly Segment[]; }) {
  const total = segments.reduce<number>((sum, item) => sum + item.value, 0);
  return (
    <div className="min-w-0">
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-2 text-xs">
        <span className="font-semibold text-foreground">{title}</span>
        <span className="text-muted-foreground">{scale}</span>
      </div>
      <div className="flex h-9 w-full overflow-hidden rounded-md border border-border">
        {segments.map((item) => (
          <div
            key={item.label}
            className="h-full border-r border-white/70 last:border-r-0 transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: `${(item.value / total) * 100}%`, backgroundColor: item.color }}
          />
        ))}
      </div>
      <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs">
        {segments.map((item) => (
          <span key={item.label} className="inline-flex items-center gap-1.5 font-mono">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function LedgerSplitViz() {
  return (
    <PqSceneShell
      eyebrow="두 장부의 나눔"
      title="1.02 ETH가 송금 장부와 비용 장부로 나뉘어 움직입니다"
      description="위 막대 전체는 송금 장부 1 ETH, 아래 막대 전체는 비용 예치금 장부 0.02 ETH입니다(축척이 다름). 3절의 설명용 숫자이며 실측치가 아닙니다."
      ariaLabel="송금 잔액과 비용 예치금이 시작, 예약, 완료 단계에서 나뉘는 모습과 합계 대조"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const moves: readonly string[] = scene.moves;
        return (
          <div className="min-w-0 space-y-4">
            <LedgerBar title="송금 장부 (A·B)" scale={`전체 = ${SEND_TOTAL} ETH`} segments={scene.send} />
            <LedgerBar title="비용 쪽 0.02 ETH의 행방 (A의 예치금)" scale={`전체 = ${COST_TOTAL} ETH`} segments={scene.cost} />
            <div className="min-h-[3.5rem] rounded-md border border-dashed border-border px-3 py-2 text-xs leading-5">
              {moves.length === 0 ? (
                <span className="text-muted-foreground">아직 움직인 금액 없음</span>
              ) : (
                <ul className="space-y-0.5 font-mono">
                  {moves.map((move) => (
                    <li key={move}>{move}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
