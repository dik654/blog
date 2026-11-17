import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #certificate-dag — H8을 받은 primary는 parents가 직전 라운드에서 정족수 power를 이루는지 확인하고,
 * 부모가 빠졌으면 처리를 멈추고 가져온 뒤, 같은 H8에 서로 다른 유효 투표가 모이면 Cert(H8)이 DAG vertex가 된다.
 * n=4, f=1 → q=2f+1=3. H8은 round 8, 부모는 round 7 인증서.
 * 어느 세 인증서를 부모로 적었는지, B에게 어느 부모가 없었는지는 본문이 정하지 않아 (가정)으로 표시한다.
 */
const VALIDATORS = ["A", "B", "C", "D"] as const;
const PARENTS = new Set(["A", "B", "C"]);
const QUORUM = 3;

const SCENES = [
  {
    label: "직전 라운드의 인증서",
    summary: "round 7 · 인증서 4개 (가정)",
    note: "round 7에서 A·B·C·D의 헤더가 각각 인증서가 됐다고 가정합니다. 인증서 하나가 DAG의 꼭짓점(vertex) 하나입니다. 아직 round 8의 H8은 아무것도 가리키지 않습니다.",
  },
  {
    label: "H8이 부모를 적습니다",
    summary: "부모 power 3 ≥ q=3",
    note: "A는 round 7 인증서 가운데 A·B·C 세 개를 H8의 parents로 적었다고 가정합니다. n=4, f=1이면 정족수 q=2f+1=3이므로 부모 세 개가 직전 라운드 정족수 power를 이룹니다. 화살표는 H8이 가리키는 부모입니다.",
  },
  {
    label: "부모가 없으면 멈추고 가져옵니다",
    summary: "B: Cert(C, r7) 없음 (가정) → fetch",
    note: "B의 local store에 C의 round 7 인증서가 없다고 가정합니다. B는 투표를 추측하지 않고 H8 처리를 멈춘 뒤 다른 primaries에서 그 인증서를 가져와 같은 H8을 다시 처리합니다.",
  },
  {
    label: "Cert(H8)이 round 8의 vertex가 됩니다",
    summary: "A·B·C의 vote 3개 → Cert(H8)",
    note: "A·B·C의 서로 다른 유효 vote가 같은 H8에 모이면 Cert(H8)이 됩니다. 이 인증서는 H8의 parents를 그대로 담으므로, Cert(H8)에서 화살표를 따라가면 round 7의 세 인증서에 닿습니다. D의 round 7 인증서는 이 H8의 부모가 아닙니다.",
  },
] as const;

const W = 300;
const H = 216;
const R7_X = 8;
const R8_X = 196;
const NODE_W = 96;
const NODE_H = 30;
const rowY = (index: number) => 40 + index * 44;

const BLUE = "#2563eb";
const AMBER = "#d97706";
const GRAY = "#94a3b8";
const TEXT = "#64748b";

function DagPicture({ active }: { active: number }) {
  const headerY = rowY(0) + 44;
  const showEdges = active >= 1;
  const certified = active === 3;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      <text x={R7_X + NODE_W / 2} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={TEXT}>round 7</text>
      <text x={R8_X + NODE_W / 2} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={TEXT}>round 8</text>

      {showEdges &&
        VALIDATORS.filter((name) => PARENTS.has(name)).map((name) => {
          const index = VALIDATORS.indexOf(name);
          const missing = active === 2 && name === "C";
          return (
            <line
              key={name}
              x1={R8_X}
              y1={headerY + NODE_H / 2}
              x2={R7_X + NODE_W + 4}
              y2={rowY(index) + NODE_H / 2}
              stroke={missing ? AMBER : BLUE}
              strokeWidth={1.25}
              strokeDasharray={missing ? "4 3" : undefined}
              markerEnd={missing ? "url(#nw-arrow-amber)" : "url(#nw-arrow-blue)"}
            />
          );
        })}

      <defs>
        <marker id="nw-arrow-blue" viewBox="0 0 8 8" refX={7} refY={4} markerWidth={7} markerHeight={7} orient="auto">
          <path d="M0 0 L8 4 L0 8 z" fill={BLUE} />
        </marker>
        <marker id="nw-arrow-amber" viewBox="0 0 8 8" refX={7} refY={4} markerWidth={7} markerHeight={7} orient="auto">
          <path d="M0 0 L8 4 L0 8 z" fill={AMBER} />
        </marker>
      </defs>

      {VALIDATORS.map((name, index) => {
        const isParent = showEdges && PARENTS.has(name);
        const missing = active === 2 && name === "C";
        return (
          <g key={name}>
            <rect
              x={R7_X}
              y={rowY(index)}
              width={NODE_W}
              height={NODE_H}
              rx={6}
              fill="none"
              stroke={missing ? AMBER : isParent ? BLUE : GRAY}
              strokeWidth={missing || isParent ? 1.25 : 1}
              strokeDasharray={missing ? "4 3" : undefined}
            />
            <text x={R7_X + NODE_W / 2} y={rowY(index) + 19} textAnchor="middle" fontSize={11} fontWeight={700} fill={missing ? AMBER : isParent ? BLUE : TEXT}>
              Cert({name}, r7)
            </text>
          </g>
        );
      })}

      <rect
        x={R8_X}
        y={headerY}
        width={NODE_W}
        height={NODE_H}
        rx={6}
        fill="none"
        stroke={active === 0 ? GRAY : BLUE}
        strokeWidth={certified ? 1.25 : 1}
        strokeDasharray={certified ? undefined : "4 3"}
      />
      <text x={R8_X + NODE_W / 2} y={headerY + 19} textAnchor="middle" fontSize={11} fontWeight={700} fill={active === 0 ? TEXT : BLUE}>
        {certified ? "Cert(H8)" : "H8 (A, r8)"}
      </text>
      <text x={R8_X + NODE_W / 2} y={headerY + NODE_H + 16} textAnchor="middle" fontSize={10} fill={TEXT}>
        {active === 0 ? "아직 부모 없음" : active === 3 ? "vote A·B·C = 3" : `부모 ${PARENTS.size}개 · q=${QUORUM}`}
      </text>
      {active === 2 && (
        <text x={R8_X + NODE_W / 2} y={headerY + NODE_H + 32} textAnchor="middle" fontSize={10} fontWeight={700} fill={AMBER}>
          B: C 부모 가져오는 중
        </text>
      )}
      {certified && (
        <text x={R8_X + NODE_W / 2} y={headerY + NODE_H + 32} textAnchor="middle" fontSize={10} fontWeight={700} fill={BLUE}>
          DAG vertex
        </text>
      )}
    </svg>
  );
}

export default function ParentQuorumDagViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200);
  const labels = SCENES.map((scene) => scene.label);

  return (
    <VizFrame
      documentFlow
      eyebrow="부모와 정족수 · n=4, f=1"
      title="H8은 직전 라운드 인증서를 세 개 이상 가리켜야 DAG에 붙습니다"
      description="왼쪽 열이 round 7, 오른쪽 열이 round 8입니다. 상자 하나가 인증서(DAG의 꼭짓점)이고, 화살표는 헤더가 parents로 적은 직전 라운드 인증서를 가리킵니다. 어느 세 인증서를 부모로 적었는지는 그림을 위한 가정입니다."
      note="근거: 본문의 n=4, f=1, q=2f+1=3과 Synchronizer의 누락 부모 처리. 부모 선택과 B의 누락은 (가정)입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="H8의 부모 인증서 정족수 확인과 Cert(H8)이 DAG vertex가 되는 네 단계"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{scene.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{scene.summary}</span>
            </div>
          ))}
        />
        <div className="mt-4 min-w-0">
          <DagPicture active={scenes.active} />
        </div>
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((scene) => (
            <p key={scene.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {scene.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={labels} />
        <StaticSceneList labels={labels} notes={SCENES.map((scene) => scene.note)} />
      </div>
    </VizFrame>
  );
}
