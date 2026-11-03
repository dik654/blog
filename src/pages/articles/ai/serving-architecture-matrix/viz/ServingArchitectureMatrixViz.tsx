import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import { NODE_RAW_GB, NODE_USABLE_GB, ROWS } from "../data";

/**
 * 한 mechanism: 같은 여섯 모델 행에 다섯 질문(열)을 하나씩 던져, 열마다 순위가 바뀌는 것을 보인다.
 * 행 위치와 막대 축은 장면마다 같고, 막대 길이와 오른쪽 값만 바뀐다.
 */
const SCENES = ["가중치", "token당 읽기", "에이전트당 기록", "나누는 방식", "네트워크"] as const;

const NOTES = [
  "점선은 8장이 실제로 가진 821GB, 실선은 이 글이 가중치와 기록에 쓸 수 있다고 잡은 691GB입니다. Kimi K3 1,561GB만 넘칩니다. 막대 끝에서 실선까지 남는 칸이 기록을 둘 자리입니다.",
  "막대는 동시 64 요청이 한 step에 읽는 expert 비율입니다. 오른쪽 GB는 요청 하나가 token마다 읽는 활성 가중치(1 byte 기준)입니다. 요청이 많아지면 MoE도 거의 전부를 읽습니다.",
  "128K token 문맥 하나가 붙잡는 기록(BF16)입니다. 층마다 KV head 8개를 남기는 Llama가 가장 크고, 기록을 고정 크기 state로 바꾼 두 hybrid 모델이 가장 작습니다.",
  "막대는 TP8로 나눴을 때 같은 기록이 몇 장에 겹쳐 놓이는지입니다. KV head가 8개면 1배, 4개면 2배, latent 하나면 8배입니다. 오른쪽은 고를 만한 배치입니다.",
  "막대는 TP8에서 token 하나가 거치는 전체 동기화 횟수(층 × 2)입니다. 오른쪽은 PP로 노드를 나눌 때 경계를 넘는 token당 byte입니다. 동기화 횟수는 지연을, 경계 byte는 대역폭을 정합니다.",
] as const;

const LEFT = 116;
const BAR_W = 124;
const ROW_H = 34;
const TOP = 22;

function barFraction(scene: number, index: number) {
  const row = ROWS[index];
  if (scene === 0) return Math.min(row.weightGb, 900) / 900;
  if (scene === 1) return row.expertReadAt64 / 100;
  if (scene === 2) return row.agentGb / 70;
  if (scene === 3) return row.tp8Replication / 8;
  return row.tp8Syncs / 260;
}

function valueLabel(scene: number, index: number) {
  const row = ROWS[index];
  if (scene === 0) return `${row.weightGb.toLocaleString("en-US")} GB ${row.weightFormat}`;
  if (scene === 1) return `${row.expertReadAt64}% · ${row.activeGbFp8} GB`;
  if (scene === 2) return `${row.agentGb} GB`;
  if (scene === 3) return `×${row.tp8Replication} · ${row.layout}`;
  return `${row.tp8Syncs}회 · ${(row.ppBytes / 1024).toFixed(row.ppBytes % 1024 ? 1 : 0)} KiB`;
}

const COLORS = ["#2563eb", "#0891b2", "#7c3aed", "#9333ea", "#059669", "#d97706"] as const;

export default function ServingArchitectureMatrixViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200, { loop: false });
  const scene = scenes.active;
  const usableX = LEFT + (NODE_USABLE_GB / 900) * BAR_W;
  const rawX = LEFT + (NODE_RAW_GB / 900) * BAR_W;

  return (
    <VizFrame
      eyebrow="Architecture matrix"
      title="같은 여섯 모델도 질문을 바꾸면 순위가 바뀝니다"
      description="행은 모델, 장면은 질문입니다. 행의 위치와 막대의 시작점은 고정이고 막대 길이와 오른쪽 값만 질문에 따라 바뀝니다."
      note="값은 공개 config와 체크포인트 크기로 계산했습니다. 측정값이 아닙니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="모델 구조별 서빙 다섯 질문 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <p className="text-[11px] font-black text-primary">Scene · {String(scene + 1).padStart(2, "0")} · <span className="text-sm text-foreground">{SCENES[scene]}</span></p>
        <div className="mt-3 grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_13rem] lg:items-center lg:gap-6">
        <svg viewBox="0 0 360 232" className="w-full" role="img" aria-label={`${SCENES[scene]} 열의 여섯 모델 비교`}>
          {ROWS.map((row, index) => {
            const y = TOP + index * ROW_H;
            const fraction = barFraction(scene, index);
            const overflow = scene === 0 && row.weightGb > NODE_RAW_GB;
            return (
              <g key={row.model}>
                <text x={0} y={y + 11} fontSize={11} fontWeight={700} fill="currentColor">{row.model}</text>
                <text x={0} y={y + 24} fontSize={9.5} fill="#6b7280">{row.family}</text>
                <rect x={LEFT} y={y + 4} width={BAR_W} height={16} fill="#94a3b8" fillOpacity={0.12} />
                <rect
                  x={LEFT}
                  y={y + 4}
                  width={Math.max(2, fraction * BAR_W)}
                  height={16}
                  fill={COLORS[index]}
                  fillOpacity={overflow ? 0.35 : 0.8}
                  style={{ transition: "width 400ms ease" }}
                />
                {overflow && (
                  <text x={LEFT + BAR_W - 4} y={y + 16} fontSize={10} textAnchor="end" fontWeight={700} fill="#dc2626">넘침</text>
                )}
                <text x={LEFT + BAR_W + 6} y={y + 16} fontSize={9.5} fill="currentColor">{valueLabel(scene, index)}</text>
              </g>
            );
          })}
          <g opacity={scene === 0 ? 1 : 0} style={{ transition: "opacity 300ms" }}>
            <line x1={usableX} x2={usableX} y1={TOP} y2={TOP + ROWS.length * ROW_H - 8} stroke="#dc2626" strokeWidth={1} />
            <line x1={rawX} x2={rawX} y1={TOP} y2={TOP + ROWS.length * ROW_H - 8} stroke="#dc2626" strokeWidth={1} strokeDasharray="3 3" />
            <text x={usableX - 2} y={14} fontSize={9} textAnchor="end" fill="#dc2626">691</text>
            <text x={rawX + 2} y={14} fontSize={9} fill="#dc2626">821</text>
          </g>
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
