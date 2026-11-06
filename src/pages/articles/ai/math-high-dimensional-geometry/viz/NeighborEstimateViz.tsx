import SceneShell from "./SceneShell";

/**
 * 본문 대응: #intrinsic-dimension 표 1과 #latent-representation의 폭 32 비교.
 * ImageNet 26, 38, 43, 43 · MNIST 7, 11, 12, 13 · 이웃 수 3, 5, 10, 20. 32는 설계 가정입니다.
 */
const BLUE = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const GRAY = "#64748b";
const W = 340;
const H = 216;
const LEFT = 32;
const RIGHT = 74;
const TOP = 16;
const BASE = 172;
const K = ["3", "5", "10", "20"] as const;
const IMAGENET = [26, 38, 43, 43] as const;
const MNIST = [7, 11, 12, 13] as const;
const px = (index: number) => LEFT + 10 + (index / 3) * (W - LEFT - RIGHT - 20);
const py = (value: number) => BASE - (value / 50) * (BASE - TOP);
const path = (values: readonly number[]) => values.map((value, index) => `${px(index).toFixed(1)},${py(value).toFixed(1)}`).join(" ");

const SCENES = [
  { label: "ImageNet", summary: "26 → 38 → 43 → 43", note: "같은 자료에서도 추정에 쓰는 이웃 수를 바꾸면 값이 26에서 43까지 움직입니다. 이 이웃 수는 JL의 출력 차원 k와 다른 설정입니다." },
  { label: "MNIST", summary: "7 → 11 → 12 → 13", note: "MNIST는 같은 표에서 7부터 13입니다. 두 자료 모두 하나의 고정된 값이 아니라 자료와 추정법에 묶인 실험 결과입니다." },
  { label: "폭 32와 견주기", summary: "MNIST 위 · ImageNet 범위 안", note: "폭 32는 MNIST의 네 값보다 크지만 ImageNet에서는 26보다 크고 38·43·43보다 작습니다. 어느 쪽도 복원 품질의 보장은 아닙니다." },
] as const;

export default function NeighborEstimateViz() {
  return (
    <SceneShell
      eyebrow="추정치와 중간 폭"
      title="폭 32는 한 자료의 위에, 다른 자료의 범위 안에 놓입니다"
      description="가로는 추정에 쓴 이웃 수, 세로는 추정한 내재 차원입니다. 이웃 수 네 개를 같은 간격으로 놓았습니다."
      note="값은 Pope 등 ICLR 2021 표 1입니다. 폭 32는 본문의 설계 가정이며 측정 결과가 아닙니다."
      ariaLabel="이웃 수에 따른 내재 차원 추정치와 폭 32 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <line x1={LEFT} x2={W - RIGHT} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
          <line x1={LEFT} x2={LEFT} y1={TOP} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
          {[0, 10, 20, 30, 40, 50].map((tick) => (
            <text key={tick} x={LEFT - 6} y={py(tick) + 4} textAnchor="end" fontSize={12} fill={GRAY}>{tick}</text>
          ))}
          {K.map((name, index) => (
            <g key={name}>
              <line x1={px(index)} x2={px(index)} y1={BASE} y2={BASE + 4} stroke="#94a3b8" strokeWidth={1} />
              <text x={px(index)} y={BASE + 18} textAnchor="middle" fontSize={12} fill={GRAY}>{name}</text>
            </g>
          ))}
          <text x={(LEFT + W - RIGHT) / 2} y={BASE + 38} textAnchor="middle" fontSize={12} fill={GRAY}>이웃 수</text>
          {active !== 1 && (
            <g>
              <polyline points={path(IMAGENET)} fill="none" stroke={BLUE} strokeWidth={1.25} />
              {IMAGENET.map((value, index) => (
                <g key={index}>
                  <circle cx={px(index)} cy={py(value)} r={4} fill={BLUE} />
                  <text x={px(index)} y={py(value) - 8} textAnchor="middle" fontSize={12} fontWeight={700} fill={BLUE}>{value}</text>
                </g>
              ))}
              <text x={px(3) + 10} y={py(43) + 4} fontSize={12} fontWeight={700} fill={BLUE}>ImageNet</text>
            </g>
          )}
          {active !== 0 && (
            <g>
              <polyline points={path(MNIST)} fill="none" stroke={AMBER} strokeWidth={1.25} />
              {MNIST.map((value, index) => (
                <g key={index}>
                  <rect x={px(index) - 4} y={py(value) - 4} width={8} height={8} fill={AMBER} />
                  <text x={px(index)} y={py(value) - 8} textAnchor="middle" fontSize={12} fontWeight={700} fill={AMBER}>{value}</text>
                </g>
              ))}
              <text x={px(3) + 10} y={py(13) + 4} fontSize={12} fontWeight={700} fill={AMBER}>MNIST</text>
            </g>
          )}
          {active === 2 && (
            <g>
              <line x1={LEFT} x2={W - RIGHT + 4} y1={py(32)} y2={py(32)} stroke={RED} strokeWidth={1.25} strokeDasharray="4 3" />
              <text x={W - RIGHT + 8} y={py(32) + 4} fontSize={12} fontWeight={700} fill={RED}>폭 32</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
