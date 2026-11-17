import SceneShell from "./SceneShell";

/**
 * 본문 대응: #stabilization-mechanisms 알고리즘형 문단(가정 숫자).
 * 1달러어치를 다른 토큰으로 주려면 1 ÷ 가격: 10달러면 0.1개, 1달러면 1개(10배).
 * 상환을 위해 더 발행 → 그 토큰을 팖 → 가격이 더 내려감 → 다음 상환에 더 많은 개수(“커질 수 있습니다”).
 */
const SCENES = [
  { label: "보조 토큰 10달러", summary: "1달러어치 = 0.1개", price: 10, loop: false, note: "알고리즘형의 일부는 다른 토큰을 새로 발행해 1달러어치를 주는 식으로 상환 유인을 만듭니다. 그 토큰이 10달러면 1÷10=0.1개면 됩니다(가정)." },
  { label: "보조 토큰 1달러", summary: "1달러어치 = 1개 · 10배", price: 1, loop: false, note: "같은 1달러어치라도 토큰 가격이 1달러로 내려가면 1개를 새로 만들어야 합니다. 가격이 10분의 1이 되자 발행할 개수는 10배가 됐습니다." },
  { label: "발행과 매도가 맞물릴 때", summary: "더 발행 → 매도 → 더 하락", price: 1, loop: true, note: "받은 토큰을 팔면 가격이 더 내려갈 수 있고, 그러면 다음 상환에 더 많은 개수가 필요합니다. 고리가 이어지면 부담이 커질 수 있습니다(모든 설계가 이렇지는 않음)." },
] as const;

const W = 360;
const H = 168;
const BX0 = 20;
const BX1 = 340;
const NODES = [
  { label: "상환 위해 더 발행", x: 64 },
  { label: "받은 토큰 매도", x: 180 },
  { label: "토큰 가격 하락", x: 296 },
] as const;

export default function AlgoMintLoopViz() {
  return (
    <SceneShell
      eyebrow="새로 발행해 갚는 구조"
      title="갚는 토큰의 값이 내려갈수록 같은 1달러에 더 많이 발행합니다"
      description="위 막대는 1달러어치를 주려고 새로 발행할 토큰 개수입니다(눈금 0~1개). 토큰 가격 10달러와 1달러는 9절의 가정 숫자입니다."
      ariaLabel="보조 토큰 가격이 10달러에서 1달러로 내려갈 때 1달러 상환에 필요한 발행 개수와 발행·매도·하락의 고리"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const count = 1 / scene.price;
        const barEnd = BX0 + count * (BX1 - BX0);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={BX0} y={16} fontSize={11} fill="#334155">1달러어치에 필요한 발행 개수</text>
            <rect x={BX0} y={24} width={BX1 - BX0} height={20} rx={2} fill="#f1f5f9" stroke="#cbd5e1" strokeWidth={1} />
            <rect x={BX0} y={24} width={barEnd - BX0} height={20} rx={2} fill="#7c3aed" />
            <text x={barEnd > 300 ? barEnd - 6 : barEnd + 6} y={38} textAnchor={barEnd > 300 ? "end" : "start"} fontSize={11} fontWeight={700} fill={barEnd > 300 ? "#ffffff" : "#6d28d9"}>
              {count === 1 ? "1개" : "0.1개"}
            </text>
            <text x={BX0} y={60} fontSize={10} fill="#64748b">0</text>
            <text x={BX1} y={60} textAnchor="end" fontSize={10} fill="#64748b">1개</text>

            <g opacity={scene.loop ? 1 : 0.25}>
              {NODES.map((node) => (
                <g key={node.label}>
                  <rect x={node.x - 52} y={88} width={104} height={30} rx={6} fill="#ffffff" stroke={scene.loop ? "#7c3aed" : "#94a3b8"} strokeWidth={1} />
                  <text x={node.x} y={107} textAnchor="middle" fontSize={10} fontWeight={700} fill="#334155">{node.label}</text>
                </g>
              ))}
              <path d="M116 103 H126" stroke="#7c3aed" strokeWidth={1} fill="none" />
              <path d="M122 99 L127 103 L122 107" stroke="#7c3aed" strokeWidth={1} fill="none" />
              <path d="M232 103 H242" stroke="#7c3aed" strokeWidth={1} fill="none" />
              <path d="M238 99 L243 103 L238 107" stroke="#7c3aed" strokeWidth={1} fill="none" />
              <path d="M296 118 V146 H64 V122" stroke="#7c3aed" strokeWidth={1} fill="none" />
              <path d="M60 126 L64 120 L68 126" stroke="#7c3aed" strokeWidth={1} fill="none" />
              <text x={180} y={160} textAnchor="middle" fontSize={10} fill="#6d28d9">다음 상환에는 더 많은 개수 (커질 수 있음)</text>
            </g>
          </svg>
        );
      }}
    />
  );
}
