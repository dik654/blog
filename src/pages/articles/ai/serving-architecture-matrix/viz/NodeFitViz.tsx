import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import { ROWS } from "../data";

/**
 * 한 mechanism: 8×RTX PRO 6000 노드에 128K 에이전트가 몇 개 상주하는지가
 * 배치 선택과 노드 수에 따라 어떻게 바뀌는지. 행과 축은 고정, 막대 길이와 설정 글자만 바뀐다.
 */
const SCENES = ["노드 1대, 기본 배치", "노드 1대, 배치 변경", "노드 2대"] as const;

const NOTES = [
  "가중치를 올리고 남은 자리에 BF16 기록을 그대로 쌓은 결과입니다. Kimi K2.5는 같은 기록이 8장에 겹쳐 128K 에이전트 하나가 겨우 들어갑니다.",
  "기록을 FP8로 줄이고, latent 모델은 token 축으로 나눕니다. K2.5가 1개에서 21개로 가장 크게 움직입니다. 작은 hybrid 모델은 처음부터 장마다 복제본을 둡니다.",
  "두 번째 노드를 PP 경계로 붙이면 가중치는 그대로 한 벌이고 기록 자리만 늘어 K2.5가 171개가 됩니다. 이때도 요청 하나의 속도는 빨라지지 않습니다. K3는 16장에서야 올라갑니다.",
] as const;

const LEFT = 116;
const BAR_W = 120;
const ROW_H = 32;
const TOP = 16;
const LOG_MAX = Math.log10(301);

function value(scene: number, index: number) {
  const row = ROWS[index];
  if (scene === 0) return row.agentsBase;
  if (scene === 1) return row.agentsTuned;
  return row.agentsTwoNodes;
}

function label(scene: number, index: number) {
  const row = ROWS[index];
  const v = value(scene, index);
  if (scene === 0) return row.weightGb > 691.2 ? "안 들어감" : `${v}개 · BF16 KV`;
  if (scene === 1) return row.agentsTuned === 0 ? "안 들어감" : `${v}개 · ${row.tunedLabel}`;
  return v === null ? row.twoNodeLabel : `${v}개 · ${row.twoNodeLabel}`;
}

export default function NodeFitViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5600, { loop: false });
  const scene = scenes.active;

  return (
    <VizFrame
      eyebrow="Agents per 8×RTX PRO 6000 node"
      title="빠른 네트워크로 두 번째 노드를 붙이면 늘어나는 것은 자리입니다"
      description="막대는 128K token 문맥을 붙잡은 에이전트가 동시에 몇 개 상주하는지입니다. 값의 폭이 커서 가로축은 로그 눈금입니다."
      note="계산값입니다. 장당 86.4GB를 가중치와 기록에 쓴다고 가정했고, 측정된 SLO 아래의 동시 처리 수가 아닙니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="노드에 상주하는 128K 에이전트 수"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <p className="text-[11px] font-black text-primary">Scene · {String(scene + 1).padStart(2, "0")} · <span className="text-sm text-foreground">{SCENES[scene]}</span></p>
        <div className="mt-3 grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_13rem] lg:items-center lg:gap-6">
        <svg viewBox="0 0 360 214" className="w-full" role="img" aria-label={`${SCENES[scene]}의 128K 에이전트 수`}>
          {[1, 10, 100].map((tick) => {
            const x = LEFT + (Math.log10(1 + tick) / LOG_MAX) * BAR_W;
            return (
              <g key={tick}>
                <line x1={x} x2={x} y1={TOP - 4} y2={TOP + ROWS.length * ROW_H - 8} stroke="#94a3b8" strokeWidth={0.75} strokeDasharray="2 3" />
                <text x={x} y={TOP - 6} fontSize={8.5} textAnchor="middle" fill="#6b7280">{tick}</text>
              </g>
            );
          })}
          {ROWS.map((row, index) => {
            const y = TOP + index * ROW_H;
            const v = value(scene, index) ?? 0;
            const width = v > 0 ? (Math.log10(1 + v) / LOG_MAX) * BAR_W : 0;
            return (
              <g key={row.model}>
                <text x={0} y={y + 11} fontSize={11} fontWeight={700} fill="currentColor">{row.model}</text>
                <text x={0} y={y + 23} fontSize={9.5} fill="#6b7280">{row.weightGb.toLocaleString("en-US")} GB</text>
                <rect x={LEFT} y={y + 3} width={BAR_W} height={16} fill="#94a3b8" fillOpacity={0.1} />
                <rect x={LEFT} y={y + 3} width={Math.max(width, 1)} height={16} fill="#059669" fillOpacity={0.8}
                  style={{ transition: "width 400ms ease" }} />
                <text x={LEFT + BAR_W + 6} y={y + 15} fontSize={9.5} fill="currentColor">{label(scene, index)}</text>
              </g>
            );
          })}
        </svg>
        <StableSceneStack
          active={scene}
          scenes={NOTES.map((note) => (
            <p key={note} className="border-l border-primary/50 pl-3 text-[13px] leading-6 text-muted-foreground sm:text-sm">{note}</p>
          ))}
        />
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
