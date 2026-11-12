import StoryShell from "./StoryShell";

/**
 * 본문 대응: IdentityMetric.tsx #threshold-choice — "거절 루프는 임계값 미만일 때만 채택하므로 임계값이 낮을수록 엄격".
 * 점은 ThresholdViz와 같은 실측 남남 45쌍(2026-09-11). 0.28 초과 6쌍, 0.40 초과 0쌍.
 */
const PAIRS: readonly (readonly [string, readonly number[]])[] = [
  ["사진", [0.003, 0.064, 0.067, 0.08, 0.083, 0.092, 0.093, 0.115, 0.13, 0.142, 0.162, 0.182, 0.205, 0.212, 0.351]],
  ["유화", [0.013, 0.033, 0.083, 0.117, 0.138, 0.18, 0.183, 0.186, 0.191, 0.213, 0.217, 0.274, 0.286, 0.344, 0.39]],
  ["3D 렌더", [0.06, 0.073, 0.101, 0.103, 0.109, 0.138, 0.16, 0.166, 0.181, 0.21, 0.236, 0.248, 0.269, 0.286, 0.302]],
];

const ACCEPT = "#10b981";
const REJECT = "#ef4444";
const LINE = "#f59e0b";
const MUTED = "#94a3b8";
const INK = "#475569";

const W = 360;
const LEFT = 64;
const RIGHT = 344;
/** 코사인 0~0.5를 x LEFT~RIGHT에 대응 */
const X = (c: number) => LEFT + (c / 0.5) * (RIGHT - LEFT);
const ROW_Y = [62, 92, 122] as const;

const countOver = (tau: number) =>
  PAIRS.reduce<number>((sum, [, values]) => sum + values.filter((v) => v > tau).length, 0);

const SCENES = [
  {
    label: "거절 루프의 규칙",
    summary: "임계 미만 → 채택",
    tau: null,
    note: "새 얼굴을 뱅크에 넣을지 정할 때, 뱅크의 얼굴과 잰 유사도가 임계값 미만일 때만 채택합니다. 임계 이상이면 이미 있는 사람의 중복으로 보고 버립니다.",
  },
  {
    label: "임계 0.28",
    summary: `남남 45쌍 중 ${countOver(0.28)}쌍이 버림 구역`,
    tau: 0.28,
    note: "점 하나가 실측 남남 한 쌍입니다. 이 쌍의 한쪽이 뱅크에 있고 다른 쪽이 새로 들어온다고 하면(가정) 오른쪽 여섯 쌍은 다른 사람인데도 중복으로 버려집니다.",
  },
  {
    label: "임계 0.40",
    summary: `버림 구역 ${countOver(0.4)}쌍`,
    tau: 0.4,
    note: "임계를 올리면 채택 구역이 넓어집니다. 이 표본에서는 버려지는 남남 쌍이 없습니다. 그래서 거절 루프에서는 임계가 낮을수록 엄격합니다.",
  },
  {
    label: "같은 여섯 쌍, 두 가지 읽기",
    summary: "판정기의 오판 = 루프의 오거절",
    tau: 0.28,
    note: "판정기로 읽으면 0.28에서 여섯 쌍이 같은 사람으로 오판되고, 거절 루프로 읽으면 같은 여섯 쌍이 중복으로 버려집니다.",
  },
] as const;

function Drawing({ index }: { index: number }) {
  const scene = SCENES[index];
  const tau = scene.tau;
  const dual = index === 3;
  return (
    <svg viewBox={`0 0 ${W} 196`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
      {tau === null ? (
        <g>
          <rect x={LEFT} y={40} width={(RIGHT - LEFT) / 2} height={100} fill={ACCEPT} fillOpacity={0.06} stroke={ACCEPT} strokeWidth={1} strokeDasharray="3 3" />
          <rect x={LEFT + (RIGHT - LEFT) / 2} y={40} width={(RIGHT - LEFT) / 2} height={100} fill={REJECT} fillOpacity={0.06} stroke={REJECT} strokeWidth={1} strokeDasharray="3 3" />
          <text x={LEFT + (RIGHT - LEFT) / 4} y={86} textAnchor="middle" fontSize={13} fontWeight={700} fill={ACCEPT}>임계 미만</text>
          <text x={LEFT + (RIGHT - LEFT) / 4} y={102} textAnchor="middle" fontSize={12} fill={INK}>뱅크에 넣음</text>
          <text x={LEFT + ((RIGHT - LEFT) * 3) / 4} y={86} textAnchor="middle" fontSize={13} fontWeight={700} fill={REJECT}>임계 이상</text>
          <text x={LEFT + ((RIGHT - LEFT) * 3) / 4} y={102} textAnchor="middle" fontSize={12} fill={INK}>중복으로 버림</text>
          <text x={W / 2} y={26} textAnchor="middle" fontSize={12} fill={MUTED}>새 얼굴과 뱅크 얼굴의 유사도</text>
          <text x={W / 2} y={164} textAnchor="middle" fontSize={12} fill={MUTED}>경계선의 위치가 임계값입니다</text>
        </g>
      ) : (
        <g>
          <rect x={LEFT} y={40} width={X(tau) - LEFT} height={100} fill={ACCEPT} fillOpacity={0.06} />
          <rect x={X(tau)} y={40} width={RIGHT - X(tau)} height={100} fill={REJECT} fillOpacity={0.06} />
          <text x={LEFT + 4} y={34} fontSize={12} fontWeight={700} fill={ACCEPT}>{dual ? "판정기: 다른 사람 · 루프: 채택" : "채택"}</text>
          <text x={RIGHT} y={34} textAnchor="end" fontSize={12} fontWeight={700} fill={REJECT}>{dual ? "" : "버림"}</text>
          {PAIRS.map(([style, values], r) => (
            <g key={style}>
              <text x={LEFT - 6} y={ROW_Y[r] + 4} textAnchor="end" fontSize={12} fill={INK}>{style}</text>
              <line x1={LEFT} x2={RIGHT} y1={ROW_Y[r]} y2={ROW_Y[r]} stroke={MUTED} strokeWidth={0.5} />
              {values.map((v, k) => (
                <circle key={k} cx={X(v)} cy={ROW_Y[r]} r={3.5} fill={v > tau ? REJECT : ACCEPT} fillOpacity={0.75} stroke={v > tau ? REJECT : ACCEPT} strokeWidth={1} />
              ))}
            </g>
          ))}
          <line x1={X(tau)} x2={X(tau)} y1={40} y2={140} stroke={LINE} strokeWidth={1.25} />
          <text x={X(tau)} y={154} textAnchor="middle" fontSize={12} fontWeight={700} fill={LINE}>τ {tau.toFixed(2)}</text>
          {[0, 0.1, 0.2, 0.3, 0.4, 0.5].map((t) => (
            <text key={t} x={X(t)} y={170} textAnchor="middle" fontSize={11} fill={MUTED}>{t.toFixed(1)}</text>
          ))}
          <text x={W / 2} y={188} textAnchor="middle" fontSize={12} fill={dual ? REJECT : INK} fontWeight={dual ? 700 : 400}>
            {dual ? "오른쪽 6쌍: 같은 사람 판정이자 중복 버림" : `임계를 넘는 남남 쌍 ${countOver(tau)} / 45`}
          </text>
        </g>
      )}
    </svg>
  );
}

export default function RejectLoopViz() {
  return (
    <StoryShell
      eyebrow="임계값의 방향"
      title="거절 루프에서는 임계가 낮을수록 더 많이 버립니다"
      description="가로축은 두 얼굴 벡터의 코사인 유사도입니다. 점은 위 그림과 같은 실측 남남 45쌍이며, 색은 거절 루프에서 그 쌍이 채택될지 버려질지를 뜻합니다."
      note="점은 2026-09-11 한 장비·한 모델 조합의 실측값입니다. 쌍을 루프 입력으로 읽는 것은 방향을 보이려는 가정입니다."
      ariaLabel="거절 루프에서 임계값 0.28과 0.40이 채택과 버림 구역을 나누는 방식"
      scenes={SCENES}
      render={(index) => <Drawing index={index} />}
    />
  );
}
