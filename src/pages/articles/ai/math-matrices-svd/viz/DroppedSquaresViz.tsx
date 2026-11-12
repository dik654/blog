import SceneShell from "./SceneShell";

/**
 * 본문 대응: #low-rank (12절) — 버린 특잇값의 제곱합이 프로베니우스 제곱 오차.
 * 이번 A: σ=3,1 → 3만 남기면 1²=1.
 * 다른 사례: σ=8,3,0.4,0.1 → 8·3 남김 0.4²+0.1²=0.17, 8·0.4 남김 3²+0.1²=9.01.
 * 스펙트럴 최적 오차 = 다음 특잇값 σ₃=0.4, 프로베니우스 √0.17≈0.41.
 */
type Scene = {
  label: string;
  summary: string;
  note: string;
  sigmas: readonly number[];
  kept: readonly boolean[];
  spectral?: boolean;
};

const SCENES: readonly Scene[] = [
  {
    label: "이번 A: 3과 1",
    summary: "3만 남기면 제곱 오차 1",
    note: "A의 두 배율은 3과 1입니다. 넓이 9인 정사각형만 남기고 넓이 1을 버리면 표의 제곱 오차는 1입니다. 앞에서 네 칸을 직접 제곱해 더한 0.5²×4=1과 같습니다.",
    sigmas: [3, 1],
    kept: [true, false],
  },
  {
    label: "네 배율 8 · 3 · 0.4 · 0.1",
    summary: "넓이 64 · 9 · 0.16 · 0.01",
    note: "다른 사례의 특잇값 8, 3, 0.4, 0.1을 한 변으로 그렸습니다. 넓이는 64, 9, 0.16, 0.01이라 뒤의 두 정사각형은 거의 보이지 않습니다.",
    sigmas: [8, 3, 0.4, 0.1],
    kept: [true, true, true, true],
  },
  {
    label: "큰 두 개를 남김",
    summary: "버린 넓이 0.16 + 0.01 = 0.17",
    note: "8과 3을 남기면 버린 것은 0.4와 0.1의 정사각형뿐입니다. 제곱 오차는 0.17입니다. rank를 2 이하로 제한한 어떤 표도 이보다 제곱 오차가 작을 수 없다는 것이 아래 Eckart–Young 식의 내용입니다.",
    sigmas: [8, 3, 0.4, 0.1],
    kept: [true, true, false, false],
  },
  {
    label: "8과 0.4를 남김",
    summary: "버린 넓이 9 + 0.01 = 9.01",
    note: "역시 두 방향을 남기지만 넓이 9인 3을 버렸습니다. 제곱 오차는 9.01로 앞 선택의 50배가 넘습니다.",
    sigmas: [8, 3, 0.4, 0.1],
    kept: [true, false, true, false],
  },
  {
    label: "스펙트럴 노름으로 재면",
    summary: "가장 큰 버린 변 0.4",
    note: "가장 크게 왜곡되는 단위 입력으로 재는 스펙트럴 노름에서는 넓이의 합이 아니라 버린 것 중 가장 긴 한 변 0.4가 오차입니다. 같은 선택의 프로베니우스 오차 √0.17≈0.41과 다른 수입니다.",
    sigmas: [8, 3, 0.4, 0.1],
    kept: [true, true, false, false],
    spectral: true,
  },
];

const SIDE = 13; // 특잇값 1당 px
const BASE = 118;

export default function DroppedSquaresViz() {
  return (
    <SceneShell
      eyebrow="버린 배율의 제곱"
      title="버린 정사각형 넓이의 합이 표의 제곱 오차입니다"
      description="정사각형 한 변이 특잇값, 넓이가 그 제곱입니다. 채운 것은 남긴 방향, 점선은 버린 방향입니다. 버린 넓이를 더한 값이 프로베니우스 노름의 제곱 오차입니다."
      ariaLabel="특잇값을 한 변으로 한 정사각형과 버린 넓이의 합"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const xs = scene.sigmas.reduce<number[]>((acc, s, i) => [...acc, i === 0 ? 8 : acc[i - 1] + scene.sigmas[i - 1] * SIDE + 22], []);
        const droppedMax = Math.max(0, ...scene.sigmas.filter((_, i) => !scene.kept[i]));
        return (
          <svg viewBox="0 0 300 150" className="mx-auto block h-auto w-full max-w-[460px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={4} y1={BASE} x2={296} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            {scene.sigmas.map((s, i) => {
              const side = Math.max(s * SIDE, 1.5);
              const keep = scene.kept[i];
              const highlight = scene.spectral && !keep && s === droppedMax;
              return (
                <g key={i}>
                  <rect
                    x={xs[i]}
                    y={BASE - side}
                    width={side}
                    height={side}
                    fill={keep ? "#bfdbfe" : "none"}
                    stroke={keep ? "#2563eb" : highlight ? "#dc2626" : "#d97706"}
                    strokeWidth={keep ? 1 : 1.25}
                    strokeDasharray={keep ? undefined : "3 2"}
                  />
                  <text x={xs[i] + Math.max(side, 4) / 2} y={BASE + 15} textAnchor="middle" fontSize={11} fontWeight={700} fill={keep ? "#2563eb" : highlight ? "#dc2626" : "#b45309"}>
                    {s}
                  </text>
                  <text x={xs[i] + Math.max(side, 4) / 2} y={BASE + 29} textAnchor="middle" fontSize={10} fill="#64748b">
                    {keep ? "남김" : "버림"}
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
