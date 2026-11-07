import SceneShell from "./SceneShell";

/**
 * 본문 대응: #sensitivity — 물리적 다이 크기가 달라지면 웨이퍼에 놓이는 후보 수부터 달라진다.
 * 웨이퍼 반지름 78, 다이 한 변 11·22(바깥 넓이 4배, 가정). 칸 수는 이 그림에서 센 값.
 */
const R = 78;
const SMALL = 11;
const BIG = 22;

interface Die { x: number; y: number; whole: boolean }

const layout = (side: number): readonly Die[] => {
  const half = Math.ceil(R / side);
  const indices = Array.from({ length: half * 2 }, (_, i) => i - half);
  return indices.flatMap((i) =>
    indices.flatMap((j) => {
      const corners = [[i, j], [i + 1, j], [i, j + 1], [i + 1, j + 1]].map(([a, b]) => Math.hypot(a * side, b * side));
      const inside = corners.filter((d) => d <= R).length;
      const nearest = Math.hypot(
        Math.max(i * side, 0, -(i + 1) * side),
        Math.max(j * side, 0, -(j + 1) * side),
      );
      if (nearest >= R) return [];
      return [{ x: i * side, y: j * side, whole: inside === 4 }];
    }),
  );
};

const SMALL_DIES = layout(SMALL);
const BIG_DIES = layout(BIG);
const countWhole = (dies: readonly Die[]) => dies.filter((die) => die.whole).length;
const SMALL_WHOLE = countWhole(SMALL_DIES);
const BIG_WHOLE = countWhole(BIG_DIES);

const SCENES = [
  { label: "작은 다이", summary: `온전한 칸 ${SMALL_WHOLE}개`, note: `같은 원 안에 한 변 ${SMALL}짜리 칸을 깔면 온전한 칸이 ${SMALL_WHOLE}개입니다. 점선 칸은 가장자리에서 잘려 후보가 되지 못합니다. 칸 수는 이 그림에서 센 값이며 앞의 후보 1000개와 별개입니다(가정).` },
  { label: "바깥 넓이 4배 다이", summary: `온전한 칸 ${BIG_WHOLE}개`, note: `한 변을 두 배로 늘리면 바깥 넓이가 4배입니다(가정). 온전한 칸은 ${BIG_WHOLE}개로, ${SMALL_WHOLE}의 1/4인 ${(SMALL_WHOLE / 4).toFixed(1)}보다 적습니다. 가장자리 손실의 몫이 달라지기 때문입니다.` },
  { label: "두 숫자를 따로 봅니다", summary: "한 다이의 확률 ≠ 웨이퍼의 후보 수", note: "e^(−0.1) ≈ 90.48%와 e^(−0.4) ≈ 67.03%는 한 다이의 결함 회피 확률만 비교한 값입니다. 다이가 커졌다는 말만으로 임계 면적이 정확히 몇 배인지도 정해지지 않으므로 두 면적 사례를 1000개씩으로 맞세우면 안 됩니다." },
] as const;

function Wafer({ cx, dies, side, title, faded }: { cx: number; dies: readonly Die[]; side: number; title: string; faded: boolean }) {
  const cy = 94;
  return (
    <g opacity={faded ? 0.3 : 1}>
      <text x={cx} y={12} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">{title}</text>
      <clipPath id={`wafer-${cx}`}><circle cx={cx} cy={cy} r={R} /></clipPath>
      <g clipPath={`url(#wafer-${cx})`}>
      {dies.map((die) => (
        <rect
          key={`${die.x},${die.y}`}
          x={cx + die.x + 0.5}
          y={cy + die.y + 0.5}
          width={side - 1}
          height={side - 1}
          fill={die.whole ? "#2563eb" : "none"}
          fillOpacity={die.whole ? 0.6 : 1}
          stroke={die.whole ? "#2563eb" : "#94a3b8"}
          strokeWidth={0.75}
          strokeDasharray={die.whole ? undefined : "2 2"}
        />
      ))}
      </g>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#64748b" strokeWidth={1} />
    </g>
  );
}

export default function WaferCandidatesViz() {
  return (
    <SceneShell
      eyebrow="웨이퍼 한 장의 후보 수"
      title="다이가 커지면 확률 말고 후보 수도 달라집니다"
      description="원이 웨이퍼, 칸이 다이입니다. 파란 칸은 온전히 들어간 후보, 점선 칸은 가장자리에서 잘린 자리입니다. 웨이퍼와 다이의 크기는 설명용입니다(가정)."
      ariaLabel="같은 웨이퍼에 작은 다이와 큰 다이를 깔았을 때의 후보 수 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 340 178" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <Wafer cx={86} dies={SMALL_DIES} side={SMALL} title={`작은 다이 · ${SMALL_WHOLE}개`} faded={active === 1} />
          <Wafer cx={254} dies={BIG_DIES} side={BIG} title={`넓이 4배 · ${BIG_WHOLE}개`} faded={active === 0} />
        </svg>
      )}
    />
  );
}
