import SceneShell from "./SceneShell";

/**
 * 본문 대응: #concentration — 앞의 복사된 좌표에서는 항들이 독립이 아니므로 분산을 더할 수 없다.
 * 독립: 평균 500, 표준편차 약 15.811. 복사: 첫 칸을 천 칸에 복사하므로 H는 0 또는 1000이고 표준편차 500(산술).
 * 복사한 값 0과 1의 제곱거리 1000은 본문 #problem의 √1000을 제곱한 값입니다.
 */
const BLUE = "#2563eb";
const AMBER = "#d97706";
const GRAY = "#64748b";
const W = 340;
const H = 214;
const LEFT = 20;
const RIGHT = 20;
const TOP = 48;
const BASE = 164;
const px = (value: number) => LEFT + (value / 1000) * (W - LEFT - RIGHT);
const py = (height: number) => BASE - height * (BASE - TOP);

const CURVE = (() => {
  const values = new Map<number, number>([[500, 1]]);
  let log = 0;
  for (let k = 500; k < 570; k++) {
    log += Math.log((1000 - k) / (k + 1));
    values.set(k + 1, Math.exp(log));
    values.set(999 - k, Math.exp(log));
  }
  const points: string[] = [];
  for (let k = 430; k <= 570; k += 2) points.push(`${px(k).toFixed(1)},${py(values.get(k) ?? 0).toFixed(1)}`);
  return points.join(" ");
})();

const SCENES = [
  { label: "서로 독립인 천 칸", summary: "1000 × 1/4 → 표준편차 약 15.811", note: "칸마다 따로 뽑으면 한 칸의 분산 1/4이 천 번 더해져 250입니다. 표준편차 약 15.811은 평균 500의 약 3.162%라 거의 500 근처에 모입니다." },
  { label: "한 칸을 복사한 천 칸", summary: "H는 0 또는 1000", note: "첫 칸을 뽑아 나머지에 복사하면 두 점의 값이 같을 때 H=0, 다를 때 H=1000입니다. 평균은 똑같이 500이지만 500이라는 값은 나오지 않습니다." },
  { label: "표준편차 비교", summary: "약 3.162% 대 100%", note: "복사하면 한 항이 움직일 때 천 항이 함께 움직여 분산을 더할 수 없습니다. 표준편차가 500이라 평균에 견준 폭이 100%입니다. 칸 수가 같아도 집중은 독립 가정에서 나옵니다." },
] as const;

export default function CopiedVsIndependentViz() {
  return (
    <SceneShell
      eyebrow="같은 칸 수 · 다른 관계"
      title="칸이 천 개여도 복사한 좌표에는 집중이 일어나지 않습니다"
      description="가로는 두 점의 값이 다른 칸의 수 H이고 평균은 둘 다 500입니다. 세로는 봉우리를 같은 높이로 맞췄습니다."
      note="0·1 좌표와 확률 1/2은 본문의 가정입니다. 복사한 경우의 수치는 그 가정에서 직접 계산했으며 측정값이 아닙니다."
      ariaLabel="독립 좌표와 복사 좌표의 제곱거리 분포 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active !== 1 && (
            <g>
              <polyline points={CURVE} fill="none" stroke={BLUE} strokeWidth={1.25} />
              <text x={px(500)} y={TOP + (active === 2 ? 2 : 0) - 6} textAnchor="middle" fontSize={12} fontWeight={700} fill={BLUE}>독립 ±약 15.811</text>
            </g>
          )}
          {active !== 0 && (
            <g>
              {[0, 1000].map((value) => (
                <g key={value}>
                  <rect x={px(value) - (value === 0 ? 0 : 8)} y={py(1)} width={8} height={BASE - py(1)} fill="none" stroke={AMBER} strokeWidth={1.25} />
                  <text x={px(value) + (value === 0 ? 12 : -12)} y={py(1) + 12} textAnchor={value === 0 ? "start" : "end"} fontSize={12} fontWeight={700} fill={AMBER}>확률 1/2</text>
                </g>
              ))}
            </g>
          )}
          {active === 2 && (
            <g>
              <path d={`M ${px(0)} ${TOP - 21} H ${px(1000)}`} fill="none" stroke={AMBER} strokeWidth={1} />
              <text x={W / 2} y={TOP - 26} textAnchor="middle" fontSize={12} fontWeight={700} fill={AMBER}>복사: 평균 ±500</text>
            </g>
          )}
          <line x1={LEFT} x2={W - RIGHT} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
          {[0, 500, 1000].map((tick) => (
            <g key={tick}>
              <line x1={px(tick)} x2={px(tick)} y1={BASE} y2={BASE + 5} stroke="#94a3b8" strokeWidth={1} />
              <text x={px(tick)} y={BASE + 20} textAnchor={tick === 0 ? "start" : tick === 1000 ? "end" : "middle"} fontSize={12} fill={GRAY}>{tick}</text>
            </g>
          ))}
          <text x={W / 2} y={BASE + 40} textAnchor="middle" fontSize={12} fill={GRAY}>값이 다른 칸의 수 H</text>
        </svg>
      )}
    />
  );
}
