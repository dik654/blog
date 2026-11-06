import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture 뒷문단과 #need — 늘어난 생산이 가구의 생활에 닿기까지 지나는 순서와 조건.
 * 위에서 아래로 차례이며, 장면마다 지금 지나는 구간과 그 조건을 표시합니다. 크기나 속도는 그리지 않았습니다.
 */
const SCENES = [
  { label: "초기", summary: "이윤과 설비 투자가 먼저", from: 0, side: ["초기에는 이쪽이", "먼저 늘 수 있음"], note: "기계가 총생산을 늘려도 초기에는 이윤과 설비 투자가 먼저 늘 수 있습니다." },
  { label: "임금으로 가는 문", summary: "소유 · 노동시장 · 조직", from: 1, side: ["새 직무의 노동 수요", "누가 기계를 소유하나", "노동시장이 팽팽한가", "조직할 수 있는가"], note: "새 직무의 노동 수요와 협상력이 바뀌어야 임금이 뒤따를 수 있습니다. 오른쪽 조건이 실제 몫을 정합니다." },
  { label: "명목에서 실질로", summary: "빵과 집세로 나눔", from: 2, side: ["빵과 집세가 더 빨리", "오르면 살 수 있는", "양은 줄 수 있음"], note: "명목임금이 올라도 식품과 주거비가 더 빨리 오르면 살 수 있는 양은 줄 수 있습니다." },
  { label: "한 사람에서 가구로", summary: "여성·아동의 노동까지", from: 3, side: ["남성 성인 한 명의", "임금만 보면 여성과", "아동의 노동을 놓침"], note: "남성 성인 한 명의 임금만 보면 여성과 아동의 노동으로 유지된 가구소득을 놓칩니다." },
] as const;

const NODES = ["늘어난 생산", "이윤·설비 투자", "임금", "살 수 있는 양", "가구의 생활"];
const W = 320;
const H = 260;
const NODE_W = 124;
const NODE_H = 34;
const GAP = 21;
const BLUE = "#2563eb";
const MUTED = "#64748b";
const IDLE = "#94a3b8";

export default function GainToLivingPathViz() {
  return (
    <SceneShell
      eyebrow="생산에서 생활까지"
      title="늘어난 생산은 네 구간을 지나야 가구의 생활에 닿습니다"
      description="생산이 늘면 왜 생활이 바로 좋아지지 않을까요? 파란 구간의 조건을 오른쪽에 적었습니다."
      note="차례와 조건만 그렸습니다. 어느 구간이 얼마나 걸렸는지는 이 그림에 없고, 9절의 자료에서 숫자로 봅니다."
      ariaLabel="늘어난 생산이 이윤과 투자, 임금, 살 수 있는 양, 가구의 생활로 이어지는 순서"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        const arrowTop = 2 + scene.from * (NODE_H + GAP) + NODE_H;
        const sideCenter = arrowTop + GAP / 2;
        const clamp = Math.min(H - scene.side.length * 17 + 4, Math.max(14, sideCenter - ((scene.side.length - 1) * 17) / 2 + 4));
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {NODES.map((name, row) => {
              const y = 2 + row * (NODE_H + GAP);
              const on = row === scene.from || row === scene.from + 1;
              return (
                <g key={name}>
                  <rect x={2} y={y} width={NODE_W} height={NODE_H} rx={8} fill="none" stroke={on ? BLUE : IDLE} strokeWidth={on ? 1.25 : 1} />
                  <text x={2 + NODE_W / 2} y={y + 22} textAnchor="middle" fontSize={13} fontWeight={700} fill={on ? BLUE : MUTED}>{name}</text>
                  {row < NODES.length - 1 && (
                    <>
                      <line x1={2 + NODE_W / 2} x2={2 + NODE_W / 2} y1={y + NODE_H} y2={y + NODE_H + GAP - 6} stroke={row === scene.from ? BLUE : IDLE} strokeWidth={row === scene.from ? 1.25 : 1} />
                      <polygon
                        points={`${2 + NODE_W / 2 - 4},${y + NODE_H + GAP - 7} ${2 + NODE_W / 2 + 4},${y + NODE_H + GAP - 7} ${2 + NODE_W / 2},${y + NODE_H + GAP}`}
                        fill={row === scene.from ? BLUE : IDLE}
                      />
                    </>
                  )}
                </g>
              );
            })}
            <path d={`M${2 + NODE_W / 2 + 6} ${sideCenter} H${NODE_W + 14}`} fill="none" stroke={BLUE} strokeWidth={1} strokeDasharray="3 3" />
            {(scene.side as readonly string[]).map((line, row) => (
              <text key={line} x={NODE_W + 20} y={clamp + row * 17} fontSize={12} fontWeight={700} fill={BLUE}>{line}</text>
            ))}
          </svg>
        );
      }}
    />
  );
}
