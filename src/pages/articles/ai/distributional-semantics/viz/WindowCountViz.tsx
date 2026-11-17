import SceneShell from "./SceneShell";

/**
 * 본문 대응: #distributional — X_wc = Σ_t Σ_δ ω(δ)·I_{t,δ}.
 * 가정 예문 한 줄에서 target 고양이 한 위치를 잡고 offset δ를 하나씩 확인합니다.
 * context 열은 본문 fixture와 같은 반려·먹이·공전 세 개입니다.
 * 반려는 δ=−1, 먹이는 δ=+2에 있으므로 ω≡1이면 +1·+1, ω=1/|δ|(가정)이면 +1·+0.5입니다.
 */
const TOKENS = ["우리", "반려", "고양이", "의", "먹이", "는"] as const;
const TARGET = 2;
const COLUMNS = new Set<string>(["반려", "먹이", "공전"]);

type Scene = {
  label: string;
  summary: string;
  note: string;
  window: readonly number[];
  showIndicator: boolean;
  weight: "none" | "uniform" | "inverse";
  split: boolean;
};

const SCENES: readonly Scene[] = [
  {
    label: "target 한 위치",
    summary: "t = 고양이 · W = {−2, −1, +1, +2}",
    note: "가정 예문 한 줄에서 target 고양이가 놓인 위치 t를 잡습니다. W는 target 주변에서 셀 위치(offset δ)의 집합이고, 여기서는 좌우 두 칸씩입니다.",
    window: [-2, -1, 1, 2],
    showIndicator: false,
    weight: "none",
    split: false,
  },
  {
    label: "indicator I",
    summary: "반려(δ=−1)·먹이(δ=+2)만 1",
    note: "각 offset의 token이 context 열(반려·먹이·공전)에 있으면 I=1, 아니면 0입니다. 우리·의는 이 글의 열에 없으므로 세지 않습니다.",
    window: [-2, -1, 1, 2],
    showIndicator: true,
    weight: "none",
    split: false,
  },
  {
    label: "균일 count ω≡1",
    summary: "반려 +1 · 먹이 +1",
    note: "거리와 상관없이 ω(δ)=1이면 I=1인 칸마다 1씩 더합니다. 이 위치 하나가 X(고양이, 반려)와 X(고양이, 먹이)를 각각 1 올립니다.",
    window: [-2, -1, 1, 2],
    showIndicator: true,
    weight: "uniform",
    split: false,
  },
  {
    label: "거리 weight ω=1/|δ|",
    summary: "반려 +1 · 먹이 +0.5 (가정)",
    note: "가까운 단어를 강조하려고 ω(δ)=1/|δ|를 가정하면 한 칸 옆 반려는 1, 두 칸 옆 먹이는 0.5만 더합니다. 같은 문장에서도 weight 정의가 cell 값을 바꿉니다.",
    window: [-2, -1, 1, 2],
    showIndicator: true,
    weight: "inverse",
    split: false,
  },
  {
    label: "window를 ±1로 좁히면",
    summary: "반려 +1 · 먹이 +0",
    note: "W={−1, +1}이면 두 칸 떨어진 먹이는 window 밖이라 이 위치에서 X(고양이, 먹이)는 늘지 않습니다. window를 바꾸면 count가 달라집니다.",
    window: [-1, 1],
    showIndicator: true,
    weight: "uniform",
    split: false,
  },
  {
    label: "방향을 나누면",
    summary: "열: 반려·왼쪽 / 먹이·오른쪽",
    note: "Directional window는 왼쪽과 오른쪽을 다른 feature로 둡니다. 같은 관측이 ‘반려·왼쪽’, ‘먹이·오른쪽’이라는 다른 열에 들어가므로 열 자체가 달라집니다.",
    window: [-2, -1, 1, 2],
    showIndicator: true,
    weight: "uniform",
    split: true,
  },
];

const BOX_W = 44;
const STEP = 50;
const LEFT = 60;
const cx = (index: number) => LEFT + BOX_W / 2 + index * STEP;
const fmt = (value: number) => (Number.isInteger(value) ? String(value) : value.toFixed(1));

function weightOf(scene: Scene, delta: number) {
  if (scene.weight === "inverse") return 1 / Math.abs(delta);
  return 1;
}

export default function WindowCountViz() {
  return (
    <SceneShell
      eyebrow="X_wc 한 위치를 직접 세기"
      title="target 주변 offset을 하나씩 보며 context 열의 cell을 올립니다"
      description="예문 한 줄과 ω=1/|δ|는 누적 규칙을 보이려는 가정입니다. 열은 본문 fixture의 반려·먹이·공전 세 개를 그대로 씁니다."
      ariaLabel="가정 예문에서 target 고양이 주변 offset을 순회하며 word-context count가 쌓이는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const inWindow = (index: number) => scene.window.includes(index - TARGET);
        const contributions = TOKENS.map((token, index) => {
          if (index === TARGET || !inWindow(index)) return null;
          const indicator = COLUMNS.has(token) ? 1 : 0;
          return { indicator, value: weightOf(scene, index - TARGET) * indicator };
        });
        const added = (token: string) => {
          const index = TOKENS.indexOf(token as (typeof TOKENS)[number]);
          return contributions[index]?.value ?? 0;
        };
        const tally = scene.split
          ? [
              { name: "X(고양이, 반려·왼쪽)", value: added("반려") },
              { name: "X(고양이, 먹이·오른쪽)", value: added("먹이") },
            ]
          : [
              { name: "X(고양이, 반려)", value: added("반려") },
              { name: "X(고양이, 먹이)", value: added("먹이") },
            ];
        const winMin = Math.min(...scene.window) + TARGET;
        const winMax = Math.max(...scene.window) + TARGET;
        return (
          <svg viewBox="0 0 360 206" className="mx-auto h-auto w-full max-w-[480px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={4} y={44} fontSize={11} fill="#64748b">token</text>
            <text x={4} y={80} fontSize={11} fill="#64748b">δ</text>
            {scene.showIndicator ? <text x={4} y={104} fontSize={11} fill="#64748b">I</text> : null}
            {scene.weight !== "none" ? <text x={4} y={128} fontSize={11} fill="#64748b">ω·I</text> : null}
            <rect
              x={LEFT + winMin * STEP - 3}
              y={22}
              width={(winMax - winMin) * STEP + BOX_W + 6}
              height={116}
              rx={8}
              fill="none"
              stroke="#2563eb"
              strokeWidth={1}
              strokeDasharray="4 3"
            />
            <text x={LEFT + winMin * STEP} y={16} fontSize={10} fill="#2563eb">window W</text>
            {TOKENS.map((token, index) => {
              const isTarget = index === TARGET;
              const delta = index - TARGET;
              const inside = inWindow(index);
              const item = contributions[index];
              const left = scene.split && inside && item?.indicator === 1 ? (delta < 0 ? "·왼쪽" : "·오른쪽") : "";
              return (
                <g key={token} opacity={isTarget || inside ? 1 : 0.4}>
                  <rect
                    x={LEFT + index * STEP}
                    y={28}
                    width={BOX_W}
                    height={24}
                    rx={6}
                    fill={isTarget ? "#2563eb" : "none"}
                    stroke={isTarget ? "#2563eb" : "#94a3b8"}
                    strokeWidth={1}
                  />
                  <text x={cx(index)} y={44} fontSize={11} textAnchor="middle" fill={isTarget ? "#ffffff" : "currentColor"} fontWeight={isTarget ? 700 : 400}>
                    {token}
                  </text>
                  <text x={cx(index)} y={80} fontSize={11} textAnchor="middle" fill={isTarget ? "#2563eb" : "currentColor"}>
                    {isTarget ? "t" : `${delta > 0 ? "+" : "−"}${Math.abs(delta)}`}
                  </text>
                  {scene.showIndicator && item ? (
                    <text x={cx(index)} y={104} fontSize={12} textAnchor="middle" fontWeight={700} fill={item.indicator ? "#16a34a" : "#94a3b8"}>
                      {item.indicator}
                    </text>
                  ) : null}
                  {scene.weight !== "none" && item ? (
                    <text x={cx(index)} y={128} fontSize={12} textAnchor="middle" fontWeight={item.value ? 700 : 400} fill={item.value ? "#2563eb" : "#94a3b8"}>
                      {fmt(item.value)}
                    </text>
                  ) : null}
                  {left ? (
                    <text x={cx(index)} y={66} fontSize={9} textAnchor="middle" fill="#d97706">{left}</text>
                  ) : null}
                  {!isTarget && !inside ? (
                    <text x={cx(index)} y={104} fontSize={10} textAnchor="middle" fill="#94a3b8">밖</text>
                  ) : null}
                </g>
              );
            })}
            {tally.map((cell, index) => {
              const x = LEFT + index * 150;
              const shown = scene.weight !== "none";
              return (
                <g key={cell.name}>
                  <rect x={x} y={154} width={140} height={44} rx={8} fill="none" stroke={shown && cell.value ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
                  <text x={x + 70} y={171} fontSize={11} textAnchor="middle" fill="currentColor">{cell.name}</text>
                  <text x={x + 70} y={189} fontSize={13} textAnchor="middle" fontWeight={700} fill={shown && cell.value ? "#2563eb" : "#94a3b8"}>
                    {shown ? `+${fmt(cell.value)}` : "아직 안 셈"}
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
