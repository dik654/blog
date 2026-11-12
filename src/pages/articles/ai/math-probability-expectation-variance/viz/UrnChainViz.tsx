import SceneShell from "./SceneShell";

/**
 * 본문 대응: #chain-rule(9절) — 빨강 2·파랑 1에서 되돌려 놓지 않고 두 번 뽑기(가정).
 * 첫 빨강 2/3 → 남은 빨강 1·파랑 1 → 다음 빨강 1/2 → (2/3)(1/2)=1/3.
 * 조건을 지우고 (2/3)²=4/9로 쓰면 앞 추출이 바꾼 구성을 놓친다.
 */
const SCENES = [
  { label: "처음 주머니", summary: "첫 빨강 = 2/3", balls: ["R", "R", "B"], removed: false, bar: 2 / 3, note: "빨강 2개와 파랑 1개 중 하나를 뽑습니다. 아래 막대 전체가 확률 1이고, 첫 공이 빨강일 몫 2/3을 칠했습니다." },
  { label: "빨강 하나를 뺀 뒤", summary: "다음 빨강 = 1/2", balls: ["R", "B"], removed: true, bar: 2 / 3, note: "첫 공을 되돌려 놓지 않았으므로 주머니에는 빨강 1개와 파랑 1개만 남습니다. 이제 다음 빨강의 비율은 2/3이 아니라 1/2입니다." },
  { label: "두 비율을 곱하면", summary: "(2/3) × (1/2) = 1/3", balls: ["R", "B"], removed: true, bar: 1 / 3, note: "첫 빨강의 몫 2/3 안에서 다시 절반을 고르면 막대의 1/3이 남습니다. 두 번째 비율에 첫 추출이라는 조건을 남겨 둔 곱입니다." },
  { label: "조건을 지우면", summary: "(2/3)² = 4/9 ≠ 1/3", balls: ["R", "R", "B"], removed: false, bar: 4 / 9, note: "두 번째 비율 자리에 처음 주머니의 2/3을 그대로 쓰면 4/9가 됩니다. 첫 추출이 주머니 구성을 바꿨다는 사실을 놓친 값입니다." },
] as const;

const RED = "#dc2626";
const BLUE = "#2563eb";
const INK = "#475569";
const LINE = "#94a3b8";
const BAR_X = 30;
const BAR_W = 300;
const BAR_Y = 150;

export default function UrnChainViz() {
  return (
    <SceneShell
      eyebrow="연쇄법칙 · 되돌려 놓지 않는 추출"
      title="첫 추출이 주머니를 바꾸면 두 번째 비율도 바뀝니다"
      description="주머니에 빨강 2개와 파랑 1개를 넣고 되돌려 놓지 않고 두 번 뽑는 본문의 가정 사례입니다. 아래 막대는 길이 전체가 확률 1입니다."
      ariaLabel="빨강 두 개와 파랑 한 개에서 두 번 빨강을 뽑을 확률"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const width = scene.bar * BAR_W;
        return (
          <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <rect x={110} y={20} width={140} height={86} rx={10} fill="none" stroke={LINE} strokeWidth={1} />
            <text x={180} y={14} textAnchor="middle" fontSize={12} fill={INK}>주머니</text>
            {scene.balls.map((ball, index) => {
              const cx = 180 + (index - (scene.balls.length - 1) / 2) * 40;
              return (
                <g key={`${ball}-${index}`}>
                  <circle cx={cx} cy={63} r={15} fill={ball === "R" ? RED : BLUE} fillOpacity={0.2} stroke={ball === "R" ? RED : BLUE} strokeWidth={1} />
                  <text x={cx} y={67} textAnchor="middle" fontSize={12} fontWeight={700} fill={ball === "R" ? RED : BLUE}>{ball === "R" ? "빨" : "파"}</text>
                </g>
              );
            })}
            {scene.removed && (
              <g>
                <circle cx={292} cy={63} r={15} fill="none" stroke={RED} strokeWidth={1} strokeDasharray="3 3" />
                <text x={292} y={67} textAnchor="middle" fontSize={12} fontWeight={700} fill={RED}>빨</text>
                <text x={292} y={96} textAnchor="middle" fontSize={10} fill={INK}>꺼낸 공</text>
              </g>
            )}
            <rect x={BAR_X} y={BAR_Y} width={BAR_W} height={18} fill="none" stroke={LINE} strokeWidth={1} />
            {active >= 1 && active <= 2 && (
              <rect x={BAR_X} y={BAR_Y} width={(2 / 3) * BAR_W} height={18} fill={RED} fillOpacity={0.08} stroke={RED} strokeWidth={1} strokeDasharray="3 3" />
            )}
            <rect x={BAR_X} y={BAR_Y} width={width} height={18} fill={RED} fillOpacity={0.3} />
            {active === 3 && (
              <g>
                <line x1={BAR_X + BAR_W / 3} x2={BAR_X + BAR_W / 3} y1={BAR_Y - 6} y2={BAR_Y + 24} stroke={INK} strokeWidth={1.25} />
                <text x={BAR_X + BAR_W / 3} y={BAR_Y + 38} textAnchor="middle" fontSize={12} fill={INK}>실제 1/3</text>
              </g>
            )}
            {active === 1 && (
              <line x1={BAR_X + BAR_W / 3} x2={BAR_X + BAR_W / 3} y1={BAR_Y} y2={BAR_Y + 18} stroke={RED} strokeWidth={1} strokeDasharray="2 2" />
            )}
            <text x={BAR_X + width} y={BAR_Y - 8} textAnchor="middle" fontSize={12} fontWeight={700} fill={RED}>
              {active === 0 ? "2/3" : active === 1 ? "2/3 안을 반으로" : active === 2 ? "1/3" : "4/9"}
            </text>
            <text x={BAR_X} y={BAR_Y + 38} fontSize={12} fill={INK}>0</text>
            <text x={BAR_X + BAR_W} y={BAR_Y + 38} textAnchor="end" fontSize={12} fill={INK}>1</text>
          </svg>
        );
      }}
    />
  );
}
