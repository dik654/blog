import SceneShell from "./SceneShell";

/**
 * 본문 대응: #intrinsic-dimension — 추정기는 각 점의 이웃 거리 로그 비를 평균한 뒤 역수를 취한다(논문 식 (2)).
 * 점 배치와 막대 길이는 순서를 보이는 설명용이며 값이 아닙니다. 이웃 수 3과 26·7은 본문이 인용한 표 1의 값입니다.
 */
const BLUE = "#2563eb";
const AMBER = "#d97706";
const GRAY = "#64748b";
const FAINT = "#94a3b8";
const W = 340;
const H = 190;
const CX = 100;
const CY = 94;

const OTHERS: readonly (readonly [number, number])[] = [[24, 44], [176, 30], [188, 150], [30, 160], [172, 96], [62, 26]];
const NEIGHBORS: readonly (readonly [number, number])[] = [[122, 82], [76, 128], [132, 44]];
const radius = ([x, y]: readonly [number, number]) => Math.hypot(x - CX, y - CY);
const BARS = [64, 40, 76, 52] as const;

const SCENES = [
  { label: "한 점의 이웃", summary: "가까운 이웃 3개의 거리", note: "한 점에서 가까운 차례로 이웃을 고릅니다. 고를 개수가 표의 이웃 수이고 여기서는 3입니다. JL의 출력 차원 k와 다른 설정입니다." },
  { label: "거리 비의 로그", summary: "거리끼리 나눠 log", note: "이웃 거리들의 비에 로그를 취합니다. 비는 나눈 값이라 거리의 단위가 지워집니다. 정확한 식은 논문 식 (2)입니다." },
  { label: "모든 점에서 평균", summary: "점마다 값 하나 → 평균", note: "같은 계산을 각 점에서 되풀이해 평균합니다. 이 계산은 주변 밀도가 거의 일정하다는 가정 등을 전제로 합니다." },
  { label: "역수가 추정치", summary: "이웃 3: ImageNet 26 · MNIST 7", note: "평균의 역수가 추정한 내재 차원입니다. 이웃 수를 바꾸면 편향과 변동도 달라지므로 자료와 추정법에 묶인 실험 결과입니다." },
] as const;

export default function NeighborRatioViz() {
  return (
    <SceneShell
      eyebrow="내재 차원 추정기의 순서"
      title="이웃 거리의 비에서 차원 숫자가 나오는 순서입니다"
      description="거리 → 로그 비 → 모든 점의 평균 → 역수 순서로 계산합니다."
      note="점 배치와 막대 길이는 순서를 보이는 설명용입니다. 26과 7은 Pope 등 ICLR 2021 표 1의 이웃 수 3 값입니다."
      ariaLabel="이웃 거리 비의 로그를 평균하고 역수를 취하는 순서"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active <= 1 && (
            <g>
              {OTHERS.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={3} fill={FAINT} />)}
              {NEIGHBORS.map((point, index) => (
                <g key={index}>
                  <circle cx={CX} cy={CY} r={radius(point)} fill="none" stroke={AMBER} strokeWidth={1} strokeDasharray="3 3" />
                  <line x1={CX} y1={CY} x2={point[0]} y2={point[1]} stroke={AMBER} strokeWidth={1.25} />
                  <circle cx={point[0]} cy={point[1]} r={4} fill={AMBER} />
                  <text x={point[0] + 7} y={point[1] - 5} fontSize={12} fontWeight={700} fill={AMBER}>{`이웃 ${index + 1}`}</text>
                </g>
              ))}
              <circle cx={CX} cy={CY} r={5} fill={BLUE} />
            </g>
          )}
          {active === 0 && <text x={216} y={100} fontSize={13} fontWeight={700} fill={BLUE}>파란 점이 기준</text>}
          {active === 1 && (
            <g>
              <text x={216} y={88} fontSize={13} fontWeight={700} fill={AMBER}>log(이웃 거리 비)</text>
              <text x={216} y={110} fontSize={12} fill={GRAY}>한 점의 값 하나</text>
            </g>
          )}
          {active >= 2 && (
            <g>
              <text x={20} y={22} fontSize={12} fill={GRAY}>점마다 얻은 값</text>
              {BARS.map((length, index) => (
                <g key={index}>
                  <text x={20} y={46 + index * 26} fontSize={12} fill={GRAY}>{`점 ${index + 1}`}</text>
                  <rect x={54} y={34 + index * 26} width={length} height={16} fill={BLUE} fillOpacity={0.2} stroke={BLUE} strokeWidth={1} />
                </g>
              ))}
              <line x1={54 + 58} x2={54 + 58} y1={28} y2={140} stroke={AMBER} strokeWidth={1.25} strokeDasharray="4 3" />
              <text x={54 + 58} y={158} textAnchor="middle" fontSize={13} fontWeight={700} fill={AMBER}>평균</text>
            </g>
          )}
          {active === 3 && (
            <g>
              <path d="M 150 86 H 192" fill="none" stroke={GRAY} strokeWidth={1} />
              <text x={171} y={78} textAnchor="middle" fontSize={12} fontWeight={700} fill={GRAY}>1/평균</text>
              <rect x={196} y={52} width={132} height={68} rx={4} fill="none" stroke={BLUE} strokeWidth={1.25} />
              <text x={262} y={78} textAnchor="middle" fontSize={13} fontWeight={700} fill={BLUE}>ImageNet 26</text>
              <text x={262} y={102} textAnchor="middle" fontSize={13} fontWeight={700} fill={BLUE}>MNIST 7</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
