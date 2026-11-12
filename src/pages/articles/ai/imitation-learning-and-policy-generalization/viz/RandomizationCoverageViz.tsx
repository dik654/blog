import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison-and-boundary ProgressiveDetail — 무작위화 범위가 실제 변화 폭보다 좁으면 gap이 남고,
 * 무작위화하지 않은 축(표면 마찰 등)은 randomization을 하지 않은 것과 같다. Release 전에는 어떤 축을
 * 무작위화했고 평가가 어느 축을 건드리는지 함께 기록한다.
 * 세 축의 위치·폭은 눈금 없는 설명용 가정이며 Tobin et al.의 실제 설정이 아니다.
 */
interface Axis {
  name: string;
  /** sim에서 뽑는 범위 [시작, 끝] (0–100, 가정). 시작=끝이면 고정값 하나. */
  sim: readonly [number, number];
  /** 실제 환경에서 값이 움직이는 폭 [시작, 끝] (0–100, 가정). */
  real: readonly [number, number];
  randomized: boolean;
  status: string;
}

const AXES: readonly Axis[] = [
  { name: "색상·질감", sim: [8, 92], real: [28, 70], randomized: true, status: "범위 안 · 덮음" },
  { name: "조명", sim: [30, 62], real: [14, 86], randomized: true, status: "범위 밖 구간 · gap 남음" },
  { name: "표면 마찰", sim: [46, 46], real: [22, 78], randomized: false, status: "고정값 하나 · 무작위화 안 한 것과 같음" },
];

interface CoverageScene {
  label: string;
  summary: string;
  focus: readonly number[];
  evalAxis: number;
  note: string;
}

const SCENES: readonly CoverageScene[] = [
  { label: "범위가 실제 변화를 덮는 축", summary: "색상·질감 · 실제 폭이 띠 안", focus: [0], evalAxis: -1, note: "파란 띠는 매 episode에 sim이 값을 뽑는 범위이고, 회색 괄호는 실제 환경에서 그 값이 움직이는 폭입니다. 괄호 전체가 띠 안에 있으면 실제 환경에서 만나는 값이 모두 학습 때 뽑던 범위 안에 들어갑니다." },
  { label: "범위가 실제 변화보다 좁은 축", summary: "조명 · 괄호 양 끝이 띠 밖", focus: [1], evalAxis: -1, note: "같은 방식으로 무작위화했어도 띠가 괄호보다 좁으면 괄호의 양 끝은 학습에서 본 적 없는 값입니다. 글의 표현대로 무작위화 범위가 실제 변화 폭보다 좁으면 gap이 남습니다." },
  { label: "무작위화하지 않은 축", summary: "표면 마찰 · 띠 대신 점 하나", focus: [2], evalAxis: -1, note: "색상·조명만 무작위화하고 표면 마찰은 그대로 두면 sim은 그 축에서 값 하나만 보여 줍니다. 그 축에서는 randomization을 하지 않은 것과 같은 결과가 나옵니다." },
  { label: "평가가 건드리는 축과 함께 기록", summary: "평가가 바꾸는 축 = 표면 마찰 (가정)", focus: [0, 1, 2], evalAxis: 2, note: "평가 상황이 표면 마찰만 바꾼다면(가정), 그 실패를 색상·조명 무작위화 범위 탓으로 진단하면 틀립니다. 조명의 gap은 조명이 바뀌는 평가에서 드러납니다. 어떤 축을 무작위화했고 어떤 축은 그대로 두었는지, 평가가 어느 축을 건드리는지를 함께 적어야 원인을 바로 짚습니다." },
];

const W = 320;
const LEFT = 84;
const RIGHT = 10;
const ROW = 40;
const TOP = 20;
const H = TOP + AXES.length * ROW + 8;
const x = (value: number) => LEFT + (value / 100) * (W - LEFT - RIGHT);

export default function RandomizationCoverageViz() {
  return (
    <SceneShell
      eyebrow="무작위화 범위와 실제 변화"
      title="축마다 sim 범위가 실제 변화 폭을 덮는지 따로 봅니다"
      description="줄 하나가 무작위화할 수 있는 환경 축 하나입니다. 파란 띠는 sim이 매 episode 값을 뽑는 범위, 회색 괄호는 실제 환경의 변화 폭입니다."
      note="세 축의 띠와 괄호 위치·폭은 눈금 없는 설명용 예시(가정)이며 Tobin et al.의 실제 무작위화 범위가 아닙니다."
      ariaLabel="환경 축별 무작위화 범위와 실제 변화 폭 비교"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        const focus = scene.focus;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[400px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <text x={LEFT} y={11} fontSize={11} fill="#64748b">값의 범위 (눈금 없음 · 가정)</text>
              {AXES.map((axis, i) => {
                const y = TOP + i * ROW + 14;
                const on = focus.includes(i);
                const isEval = scene.evalAxis === i;
                const opacity = on ? 1 : 0.3;
                return (
                  <g key={axis.name} opacity={opacity}>
                    <text x={2} y={y + 5} fontSize={13} fontWeight={700} fill={isEval ? "#d97706" : "#64748b"}>{axis.name}</text>
                    <line x1={x(0)} x2={x(100)} y1={y} y2={y} stroke="#cbd5e1" strokeWidth={1} />
                    {axis.randomized ? (
                      <rect x={x(axis.sim[0])} y={y - 7} width={x(axis.sim[1]) - x(axis.sim[0])} height={14} rx={3} fill="#2563eb" fillOpacity={0.18} stroke="#2563eb" strokeWidth={1} />
                    ) : (
                      <circle cx={x(axis.sim[0])} cy={y} r={4.5} fill="#2563eb" />
                    )}
                    <path
                      d={`M${x(axis.real[0])},${y + 10} v5 H${x(axis.real[1])} v-5`}
                      fill="none"
                      stroke={isEval ? "#d97706" : "#64748b"}
                      strokeWidth={1.25}
                    />
                  </g>
                );
              })}
            </svg>
            <ul className="mt-2 space-y-1 text-xs leading-5">
              {AXES.map((axis, i) =>
                focus.includes(i) ? (
                  <li key={axis.name} style={{ color: scene.evalAxis === i ? "#d97706" : undefined }}>
                    <strong>{axis.name}</strong> · {scene.evalAxis === i ? `평가가 바꾸는 축 · ${axis.status}` : axis.status}
                  </li>
                ) : null,
              )}
            </ul>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1"><span className="inline-block h-2.5 w-4 rounded-sm border" style={{ borderColor: "#2563eb", backgroundColor: "#2563eb2e" }} />sim 무작위화 범위</span>
              <span className="inline-flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#2563eb" }} />고정값 (무작위화 안 함)</span>
              <span className="inline-flex items-center gap-1"><span className="inline-block h-1.5 w-4 border-x border-b" style={{ borderColor: "#64748b" }} />실제 변화 폭</span>
            </div>
          </div>
        );
      }}
    />
  );
}
