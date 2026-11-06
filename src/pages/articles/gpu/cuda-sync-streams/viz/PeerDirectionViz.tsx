import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #peer-copy — GPU0의 8을 GPU1이 쓸 때 접근 허용 방향과 데이터 이동 방향.
 * 파란 선 = 접근 허용, 주황 선 = 데이터 이동, 회색 점선 = 따로 조회·설정해야 하는 반대 방향.
 */
const SCENES = [
  { label: "접근 허용", summary: "1 → 0", note: "GPU1의 kernel이 GPU0의 메모리를 직접 읽으려면 1이 0에 접근할 수 있는지 묻고, GPU1을 선택한 상태에서 cudaDeviceEnablePeerAccess(0,0)을 호출합니다." },
  { label: "데이터 이동", summary: "접근 1 → 0 · 값 0 → 1", note: "허용 화살표는 1에서 0으로 가지만 결과 8은 0에서 1로 전달됩니다. 두 화살표의 뜻이 다릅니다." },
  { label: "반대 방향", summary: "0 → 1 접근은 별도", note: "반대 방향의 허용이 필요하면 따로 조회하고 설정합니다. GPU끼리 직접 닿는 P2P가 되는지는 실제 연결과 플랫폼에 달려 있고, 안 되면 host staging 같은 경로를 준비합니다." },
  { label: "복사로 옮기기", summary: "생산 → 복사 → 소비", note: "cudaMemcpyPeerAsync로 옮길 때도 event로 순서를 잇습니다. 복사 완료 전에는 원본을 덮어도, 목적지를 읽어도 안 됩니다." },
] as const;

const W = 340;
const H = 176;
const BOX_W = 96;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const MUTED = "#64748b";
const LINE = "#94a3b8";
const GPU0_R = 6 + BOX_W;
const GPU1_L = W - 6 - BOX_W;
const MID = (GPU0_R + GPU1_L) / 2;

function Arrow({ y, toRight, color, label, dashed = false }: { y: number; toRight: boolean; color: string; label: string; dashed?: boolean }) {
  const from = toRight ? GPU0_R + 3 : GPU1_L - 3;
  const to = toRight ? GPU1_L - 3 : GPU0_R + 3;
  const back = toRight ? to - 7 : to + 7;
  return (
    <g>
      <text x={MID} y={y - 6} textAnchor="middle" fontSize={13} fontWeight={700} fill={color}>{label}</text>
      <line x1={from} x2={to} y1={y} y2={y} stroke={color} strokeWidth={1.25} strokeDasharray={dashed ? "3 3" : undefined} />
      <polygon points={`${to},${y} ${back},${y - 4} ${back},${y + 4}`} fill={color} />
    </g>
  );
}

function Gpu({ x, name, lines }: { x: number; name: string; lines: readonly string[] }) {
  return (
    <g>
      <rect x={x} y={10} width={BOX_W} height={H - 20} rx={6} fill="none" stroke={MUTED} strokeWidth={1} />
      <text x={x + BOX_W / 2} y={32} textAnchor="middle" fontSize={15} fontWeight={700} fill={MUTED}>{name}</text>
      {lines.map((line, i) => (
        <text key={line} x={x + BOX_W / 2} y={58 + i * 22} textAnchor="middle" fontSize={13} fill={MUTED}>{line}</text>
      ))}
    </g>
  );
}

const GPU_LINES: readonly (readonly [readonly string[], readonly string[]])[] = [
  [["메모리", "8"], ["kernel", "(선택됨)"]],
  [["메모리", "8"], ["kernel", "8을 읽음"]],
  [["메모리", "8"], ["kernel", "메모리"]],
  [["생산", "record", "원본 유지"], ["wait", "복사 도착", "소비"]],
];

export default function PeerDirectionViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="화살표의 뜻"
      title="접근을 허용하는 방향과 8이 이동하는 방향은 반대일 수 있습니다"
      description="앞 절의 사례대로 GPU0이 만든 8을 GPU1이 씁니다. 파란 선은 접근 허용, 주황 선은 데이터 이동입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="GPU0과 GPU1 사이 접근 허용 방향과 데이터 이동 방향 비교"
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
          <Gpu x={6} name="GPU0" lines={GPU_LINES[active][0]} />
          <Gpu x={GPU1_L} name="GPU1" lines={GPU_LINES[active][1]} />
          {active <= 1 && <Arrow y={68} toRight={false} color={BLUE} label="허용 1→0" />}
          {active === 1 && <Arrow y={126} toRight color={AMBER} label="8: 0→1" />}
          {active === 2 && <Arrow y={68} toRight={false} color={BLUE} label="허용 1→0" />}
          {active === 2 && <Arrow y={126} toRight color={LINE} label="0→1 별도" dashed />}
          {active === 3 && <Arrow y={98} toRight color={AMBER} label="8 복사" />}
        </svg>
        <StableSceneStack
          active={active}
          className="mt-3"
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
