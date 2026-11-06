import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 공식 문서의 통상 지연: 빠른 확인 1초 미만, 게시 수분, 게시 후 Ethereum 확정 약 13분, canonical 인출 약 7일.
 * 7일 = 7×24×60 = 10,080분, 10,080 ÷ 13 ≈ 775. 위 두 줄의 간격은 시간에 비례하지 않는다.
 */
const W = 360;
const H = 200;
const SLATE = "#64748b";
const BLUE = "#2563eb";
const AMBER = "#d97706";
const NODES = [
  { x: 48, name: "빠른 확인", time: "1초 미만" },
  { x: 176, name: "Ethereum 게시", time: "수분" },
  { x: 304, name: "Ethereum 확정", time: "게시 후 약 13분" },
];
const ORDER_Y = 32;
const WD_Y = 112;

const SCENES = [
  { label: "빠른 확인", summary: "통상 1초 미만", reached: 0, note: "순서 제공자가 거래를 처리했다는 결과입니다. 아직 Ethereum에 게시되지 않았으므로 이 단계의 순서는 순서 제공자에 의존합니다." },
  { label: "Ethereum 게시", summary: "통상 수분", reached: 1, note: "묶음 자료가 Ethereum에 올라갑니다. 다만 그 자료를 담은 Ethereum 블록은 아직 확정 전입니다." },
  { label: "Ethereum 확정", summary: "게시 후 통상 약 13분", reached: 2, note: "게시한 블록이 확정되면 자료의 순서를 되돌리기 훨씬 어려워집니다. 그래도 아래 줄의 인출 메시지는 아직 집행할 수 없습니다." },
  { label: "인출 대기는 별도의 시계", summary: "약 7일 ≈ 13분의 775배", reached: 3, note: "인출 메시지를 집행하려면 이의 제기 기간이 따로 남습니다. 약 7일은 13분을 일곱 날 반복한 값이 아닙니다. 모두 통상 안내이며 장애·혼잡에 따라 달라지고 기한을 보장하지 않습니다." },
] as const;

export default function FinalityClocksViz() {
  return (
    <SceneShell
      eyebrow="두 개의 시계"
      title="거래 순서의 확정과 인출의 대기는 다른 줄에서 흐릅니다"
      description="공식 문서가 안내하는 통상 지연입니다. 위 두 줄의 간격은 시간에 비례하지 않고 시작 시각을 맞춘 것도 아닙니다. canonical은 공식 브리지 경로입니다."
      ariaLabel="빠른 확인, Ethereum 게시, Ethereum 확정과 별도로 흐르는 인출 대기"
      scenes={SCENES}
      render={(active) => {
        const { reached } = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={10} y={12} fontSize={11} fontWeight={700} fill={SLATE}>거래의 순서</text>
            <line x1={NODES[0].x} x2={NODES[2].x} y1={ORDER_Y} y2={ORDER_Y} stroke="#94a3b8" strokeWidth={1} />
            {NODES.map((node, index) => {
              const on = index <= reached;
              return (
                <g key={node.name}>
                  <circle cx={node.x} cy={ORDER_Y} r={6} fill={on ? BLUE : "#94a3b8"} opacity={on ? 1 : 0.45} />
                  <text x={node.x} y={ORDER_Y + 22} textAnchor="middle" fontSize={11} fontWeight={on ? 700 : 400} fill={on ? BLUE : SLATE}>{node.name}</text>
                  <text x={node.x} y={ORDER_Y + 37} textAnchor="middle" fontSize={10.5} fill={SLATE}>{node.time}</text>
                </g>
              );
            })}
            <text x={10} y={WD_Y - 18} fontSize={11} fontWeight={700} fill={SLATE}>canonical 인출 메시지</text>
            <g opacity={active === 3 ? 1 : 0.45}>
              <line x1={48} x2={304} y1={WD_Y} y2={WD_Y} stroke={AMBER} strokeWidth={1.25} strokeDasharray="5 3" />
              <circle cx={304} cy={WD_Y} r={6} fill={AMBER} />
              <text x={176} y={WD_Y + 18} textAnchor="middle" fontSize={11} fontWeight={700} fill={AMBER}>이의 제기 기간 약 7일</text>
              <text x={304} y={WD_Y + 18} textAnchor="middle" fontSize={11} fill={SLATE}>집행 가능</text>
            </g>
            {active === 3 && (
              <g>
                <text x={10} y={156} fontSize={11} fontWeight={700} fill={SLATE}>같은 자로 재면</text>
                <rect x={10} y={164} width={340} height={8} fill={AMBER} opacity={0.8} />
                <rect x={10} y={162} width={1.5} height={12} fill={BLUE} />
                <text x={10} y={190} fontSize={11} fontWeight={700} fill={BLUE}>13분</text>
                <text x={350} y={190} textAnchor="end" fontSize={11} fontWeight={700} fill={AMBER}>7일 = 10,080분</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
