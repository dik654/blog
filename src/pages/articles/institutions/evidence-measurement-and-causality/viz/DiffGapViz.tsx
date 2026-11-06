import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #picture — A 10→8, B 10→9에서 B의 변화를 A에 옮겨 그리면 간격 1이 남는다.
 * 가로 = 설치 전후, 세로 = 가구당 하루 평균 전력 사용량(kWh). 값은 본문의 (가정) 숫자입니다.
 */
const SCENES = [
  { label: "두 줄 그리기", summary: "A 10→8 · B 10→9", note: "(가정) 각 10가구의 평균이며 A에만 장치를 달았습니다. 장치가 없던 B의 줄도 내려갑니다." },
  { label: "각자의 변화", summary: "A −2 · B −1", note: "8−10=−2, 9−10=−1입니다. A의 2를 모두 장치 덕분이라고 쓰면 B에서도 줄어든 1이 설명되지 않습니다." },
  { label: "B의 변화 옮기기", summary: "가정: A도 1 감소", note: "장치가 없었다면 A도 B만큼 줄어 9가 됐을 것이라고 둡니다. 관찰한 값이 아니라 가정으로 그은 점선이고, 출발이 같아 B의 줄과 겹칩니다." },
  { label: "간격 읽기", summary: "−2 − (−1) = −1", note: "점선 끝 9와 실제 A의 8 사이가 1입니다. 여기까지는 산술입니다. 이 1을 장치 효과로 읽을 수 있는지는 점선이 현실과 맞는지에 달렸습니다." },
] as const;

const W = 340;
const H = 250;
const X0 = 62;
const X1 = 206;
const TOP = 14;
const BOTTOM = 36;
const V_MIN = 7.5;
const V_MAX = 10.5;
const y = (value: number) => TOP + ((V_MAX - value) / (V_MAX - V_MIN)) * (H - TOP - BOTTOM);

const A_COLOR = "#2563eb";
const B_COLOR = "#64748b";
const GAP_COLOR = "#d97706";

function Drop({ x, from, to, color, label }: { x: number; from: number; to: number; color: string; label: string }) {
  return (
    <g>
      <line x1={x} x2={x} y1={y(from)} y2={y(to)} stroke={color} strokeWidth={1.25} />
      <line x1={x - 4} x2={x + 4} y1={y(from)} y2={y(from)} stroke={color} strokeWidth={1} />
      <line x1={x - 4} x2={x + 4} y1={y(to)} y2={y(to)} stroke={color} strokeWidth={1} />
      <text x={x + 7} y={(y(from) + y(to)) / 2 + 5} fontSize={14} fontWeight={700} fill={color}>{label}</text>
    </g>
  );
}

export default function DiffGapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="변화의 차이"
      title="실제 A 줄과 ‘장치가 없었다면’ 점선 사이가 1입니다"
      description="가로는 설치 전후, 세로는 가구당 하루 평균 전력 사용량(kWh)입니다. 모든 값은 설명용 (가정)이며 실제 연구 결과가 아닙니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="두 집단의 전후 변화에서 B의 변화를 한 번 더 빼는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{scene.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{scene.summary}</span>
            </div>
          ))}
        />
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-3 h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {[8, 9, 10].map((value) => (
            <g key={value}>
              <line x1={X0 - 16} x2={W - 8} y1={y(value)} y2={y(value)} stroke="#94a3b8" strokeWidth={0.5} strokeDasharray="2 3" />
              <text x={X0 - 22} y={y(value) + 5} textAnchor="end" fontSize={13} fill="#64748b">{value}</text>
            </g>
          ))}
          <text x={X0} y={H - 12} textAnchor="middle" fontSize={13} fill="#64748b">설치 전</text>
          <text x={X1} y={H - 12} textAnchor="middle" fontSize={13} fill="#64748b">설치 후</text>

          <line x1={X0} x2={X1} y1={y(10)} y2={y(9)} stroke={B_COLOR} strokeWidth={1.25} opacity={active >= 2 ? 0.45 : 1} />
          <line x1={X0} x2={X1} y1={y(10)} y2={y(8)} stroke={A_COLOR} strokeWidth={1.25} />
          <circle cx={X0} cy={y(10)} r={3} fill="#64748b" />
          <circle cx={X1} cy={y(9)} r={3} fill={B_COLOR} opacity={active >= 2 ? 0.45 : 1} />
          <circle cx={X1} cy={y(8)} r={3} fill={A_COLOR} />
          {active < 2 && <text x={X1 - 4} y={y(9) + 19} textAnchor="end" fontSize={14} fontWeight={700} fill={B_COLOR}>B 9</text>}
          <text x={X1 - 8} y={y(8) + 19} textAnchor="end" fontSize={14} fontWeight={700} fill={A_COLOR}>A 8</text>

          {active === 1 && (
            <g>
              <line x1={X1} x2={W - 8} y1={y(10)} y2={y(10)} stroke="#64748b" strokeWidth={1} />
              <Drop x={X1 + 26} from={10} to={9} color={B_COLOR} label="B −1" />
              <Drop x={X1 + 80} from={10} to={8} color={A_COLOR} label="−2" />
            </g>
          )}

          {active >= 2 && (
            <g>
              <line x1={X0} x2={X1} y1={y(10)} y2={y(9)} stroke={A_COLOR} strokeWidth={1.25} strokeDasharray="6 4" />
              <circle cx={X1} cy={y(9)} r={3.5} fill="#ffffff" stroke={A_COLOR} strokeWidth={1.25} />
              <text x={X1 + 10} y={y(9) - 26} fontSize={13} fontWeight={700} fill={A_COLOR}>장치가 없었다면 A</text>
              <text x={X1 + 10} y={y(9) - 9} fontSize={13} fontWeight={700} fill={A_COLOR}>9 (가정)</text>
            </g>
          )}

          {active === 3 && <Drop x={X1 + 26} from={9} to={8} color={GAP_COLOR} label="−1" />}
          {active === 3 && (
            <text x={X1 + 26} y={y(8) + 20} fontSize={13} fontWeight={700} fill={GAP_COLOR}>B보다 더 준 1</text>
          )}
        </svg>
        <StableSceneStack
          active={active}
          className="mt-2"
          scenes={SCENES.map((scene) => (
            <p key={scene.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {scene.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={SCENES.map((scene) => scene.label)} />
        <StaticSceneList labels={SCENES.map((scene) => scene.label)} notes={SCENES.map((scene) => scene.note)} />
      </div>
    </VizFrame>
  );
}
