import SceneShell from "./SceneShell";

/**
 * 본문 대응: #release-gate — w3-filecoin 흐름.
 * Storefront가 piece를 받고 → Aggregator가 작은 piece들을 큰 aggregate로 묶고 →
 * Dealer가 storage provider와 deal을 추진하고 → Deal Tracker가 chain 상태를 조회한다.
 * filecoin/offer 뒤로 비동기로 이어지므로 offer receipt를 deal 완료·영구 보관으로 읽지 않는다.
 * 그림용 가정: 묶이는 piece 4개.
 */
const STAGES = [
  { name: "Storefront", job: "piece 받음", target: "" },
  { name: "Aggregator", job: "piece 묶음", target: "" },
  { name: "Dealer", job: "deal 추진", target: "storage provider" },
  { name: "Deal Tracker", job: "상태 조회", target: "chain" },
] as const;

const SCENES = [
  {
    label: "offer: Storefront가 piece를 받습니다",
    summary: "filecoin/offer → receipt",
    note: "piece가 filecoin/offer로 Storefront에 넘어가고 offer receipt가 돌아옵니다. 뒤 단계는 아직일 수 있습니다.",
  },
  {
    label: "Aggregator가 작은 piece를 묶습니다",
    summary: "piece 여러 개 → aggregate 1개",
    note: "Aggregator는 작은 piece들을 큰 aggregate 하나로 묶습니다. 그림의 piece 4개는 가정입니다.",
  },
  {
    label: "Dealer가 deal을 추진합니다",
    summary: "aggregate → storage provider",
    note: "Dealer가 aggregate로 storage provider와 deal을 추진합니다. 추진과 chain 포함은 다른 사실입니다.",
  },
  {
    label: "Deal Tracker가 chain을 조회합니다",
    summary: "chain 상태 → deal 진행 상황",
    note: "Deal Tracker는 chain 상태를 조회해 deal이 어디까지 갔는지 확인합니다. 이 단계도 offer 뒤에 비동기로 일어납니다.",
  },
  {
    label: "offer receipt가 말하는 범위",
    summary: "offer 받음 ≠ deal 완료",
    note: "offer receipt는 첫 칸만 확인합니다. deal 완료나 영구 보관으로 읽지 않고, 단계별 실패도 따로 기록합니다.",
  },
] as const;

const W = 360;
const H = 218;
const ACCENT = "#2563eb";
const DENY = "#dc2626";
const MUTED = "#64748b";
const LINE = "#94a3b8";
const BOX_W = 80;
const GAP = 8;
const boxX = (index: number) => 8 + index * (BOX_W + GAP);
const PIECES = [0, 1, 2, 3] as const;

export default function FilecoinPipelineViz() {
  return (
    <SceneShell
      eyebrow="filecoin/offer 이후 · 비동기 단계"
      title="offer 영수증 뒤로 묶기·deal·추적이 따로 이어집니다"
      description="왼쪽에서 오른쪽으로 네 역할이 차례로 일합니다. 칸 아래는 각 역할이 상대하는 곳, 맨 아래 띠는 offer receipt 하나가 확인해 주는 범위입니다."
      ariaLabel="Storefront, Aggregator, Dealer, Deal Tracker로 이어지는 Filecoin 비동기 단계와 offer receipt의 범위"
      scenes={SCENES}
      render={(active) => {
        const current = Math.min(active, 3);
        const summaryScene = active === 4;
        return (
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="mx-auto h-auto w-full max-w-[460px]"
            role="img"
            aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}
          >
            {STAGES.map((stage, index) => {
              const x = boxX(index);
              const reached = summaryScene || index <= current;
              const now = !summaryScene && index === current;
              return (
                <g key={stage.name} opacity={reached ? 1 : 0.35}>
                  <rect x={x} y={8} width={BOX_W} height={46} rx={6} fill={now ? ACCENT : "none"} fillOpacity={now ? 0.08 : 0} stroke={now ? ACCENT : LINE} strokeWidth={now ? 1.25 : 1} />
                  <text x={x + BOX_W / 2} y={27} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">{stage.name}</text>
                  <text x={x + BOX_W / 2} y={44} textAnchor="middle" fontSize={10} fill={MUTED}>{stage.job}</text>
                  {index < STAGES.length - 1 && (
                    <path d={`M${x + BOX_W + 1} 31 h${GAP - 3} l-3 -3 m3 3 l-3 3`} fill="none" stroke={LINE} strokeWidth={1} />
                  )}
                  {stage.target && (
                    <>
                      <line x1={x + BOX_W / 2} y1={54} x2={x + BOX_W / 2} y2={66} stroke={LINE} strokeWidth={1} strokeDasharray="3 2" />
                      <rect x={x + 4} y={66} width={BOX_W - 8} height={30} rx={4} fill="none" stroke={LINE} strokeWidth={1} strokeDasharray="4 3" />
                      {stage.target.split(" ").map((word, line, words) => (
                        <text key={word} x={x + BOX_W / 2} y={(words.length === 1 ? 85 : 78) + line * 12} textAnchor="middle" fontSize={10} fill={MUTED}>{word}</text>
                      ))}
                    </>
                  )}
                </g>
              );
            })}

            {/* 가운데: 지금 장면에서 움직이는 것 */}
            <g>
              {active === 0 && (
                <>
                  <rect x={30} y={104} width={36} height={22} rx={3} fill={ACCENT} fillOpacity={0.18} stroke={ACCENT} strokeWidth={1} />
                  <text x={48} y={119} textAnchor="middle" fontSize={10} fill="currentColor">piece</text>
                  <text x={110} y={119} fontSize={10} fill={MUTED}>→ Storefront가 받고 offer receipt 발급</text>
                </>
              )}
              {active === 1 && (
                <>
                  {PIECES.map((piece) => (
                    <rect key={piece} x={20 + piece * 30} y={104} width={24} height={22} rx={3} fill={ACCENT} fillOpacity={0.18} stroke={ACCENT} strokeWidth={1} />
                  ))}
                  <text x={152} y={119} fontSize={12} fill={MUTED}>→</text>
                  <rect x={172} y={100} width={120} height={30} rx={4} fill={ACCENT} fillOpacity={0.12} stroke={ACCENT} strokeWidth={1.25} />
                  {/* piece 4개 → 칸 4개(120/4 = 30): 칸 사이 경계선은 3개 */}
                  {PIECES.slice(1).map((piece) => (
                    <line key={piece} x1={172 + piece * 30} y1={100} x2={172 + piece * 30} y2={130} stroke={ACCENT} strokeWidth={1} strokeOpacity={0.4} />
                  ))}
                  <text x={232} y={146} textAnchor="middle" fontSize={10} fill={MUTED}>aggregate 1개 (piece 4개, 가정)</text>
                </>
              )}
              {active === 2 && (
                <>
                  <rect x={60} y={100} width={96} height={28} rx={4} fill={ACCENT} fillOpacity={0.12} stroke={ACCENT} strokeWidth={1.25} />
                  <text x={108} y={118} textAnchor="middle" fontSize={10} fill="currentColor">aggregate</text>
                  <text x={168} y={118} fontSize={10} fill={MUTED}>→ storage provider와 deal 추진</text>
                </>
              )}
              {active === 3 && (
                <>
                  <rect x={60} y={100} width={96} height={28} rx={4} fill="none" stroke={ACCENT} strokeWidth={1.25} />
                  <text x={108} y={118} textAnchor="middle" fontSize={10} fill="currentColor">chain 상태</text>
                  <text x={168} y={118} fontSize={10} fill={MUTED}>→ deal이 어디까지 갔는지 조회</text>
                </>
              )}
              {active === 4 && (
                <text x={180} y={119} textAnchor="middle" fontSize={11} fill="currentColor">뒤 세 단계는 offer 뒤에 비동기로 이어집니다</text>
              )}
            </g>

            {/* 맨 아래: offer receipt가 확인하는 범위 */}
            <text x={8} y={170} fontSize={10} fill={MUTED}>offer receipt가 확인하는 범위</text>
            {STAGES.map((stage, index) => {
              const covered = index === 0;
              return (
                <g key={stage.name}>
                  <rect x={boxX(index)} y={178} width={BOX_W} height={30} rx={4} fill={covered ? ACCENT : "none"} fillOpacity={covered ? 0.14 : 0} stroke={covered ? ACCENT : summaryScene ? DENY : LINE} strokeWidth={covered || summaryScene ? 1.25 : 1} strokeDasharray={covered ? undefined : "4 3"} />
                  <text x={boxX(index) + BOX_W / 2} y={197} textAnchor="middle" fontSize={10} fontWeight={covered ? 700 : 400} fill={covered ? "currentColor" : summaryScene ? DENY : MUTED}>
                    {covered ? "offer 받음" : "보장 안 함"}
                  </text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
