import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #ordering — L2 하위 DAG를 먼저 출력하고 state.update로 last_committed를 올린 뒤,
 * L4를 펼칠 때 이미 처리한 인증서를 제외해 같은 인증서가 두 번 나오지 않는 흐름.
 * 부모 연결과 digest 순서(=방문 순서)는 설명용 가정. round 기준 안정 정렬은 같은 라운드의 방문 순서를 유지한다.
 * L2 묶음 4개(#1~#4) + L4 묶음 8개(#5~#12) = 12개, 각 한 번.
 */

type Phase = "collect2" | "out2" | "state" | "collect4" | "out4";

const SCENES: readonly { label: string; summary: string; phase: Phase; note: string }[] = [
  {
    label: "L2의 과거 모으기",
    summary: "닿은 인증서 4개",
    phase: "collect2",
    note: "DFS(부모 참조를 따라 깊이 우선으로 거슬러 가는 탐색)가 L2(A2)에서 출발해 부모 digest를 정렬된 집합 순서로 읽습니다. 닿는 인증서는 A2와 라운드 1의 A1·B1·C1입니다. digest 순서는 이름 순서와 무관하므로 이 예의 방문 순서는 가정입니다.",
  },
  {
    label: "round 정렬 뒤 #1~#4",
    summary: "C1 · B1 · A1 · A2",
    phase: "out2",
    note: "round 기준 안정 정렬을 적용하면 라운드 1 인증서가 앞에, A2가 뒤에 섭니다. 같은 라운드의 C1·B1·A1은 방문 순서를 그대로 유지합니다. 각 인증서에 consensus_index(전역 출력 번호)가 붙습니다.",
  },
  {
    label: "last_committed 갱신",
    summary: "A=2 · B=1 · C=1 · D 없음",
    phase: "state",
    note: "state.update가 작성자별 마지막 커밋 라운드(last_committed)를 올립니다. 방금 출력한 넷을 보면 A는 라운드 2, B와 C는 라운드 1이고, D는 아직 출력된 인증서가 없습니다.",
  },
  {
    label: "L4의 과거 모으기",
    summary: "새 인증서 8개 · 건너뜀 4개",
    phase: "collect4",
    note: "L4(A4)에서 다시 DFS를 합니다. A2와 A1·B1·C1은 작성자별 last_committed 이하 라운드라 건너뜁니다. D1은 라운드 1이지만 아직 출력되지 않았으므로 이번 묶음에 새로 들어옵니다.",
  },
  {
    label: "round 정렬 뒤 #5~#12",
    summary: "12개가 각각 한 번",
    phase: "out4",
    note: "안정 정렬로 D1이 맨 앞, A4가 맨 끝에 섭니다. 두 묶음을 이으면 인증서 12개가 #1~#12에 한 번씩 놓입니다. 이 예에서는 GC 경계 밖으로 빠지는 인증서가 없다고 가정했습니다.",
  },
];

const COLS = ["A", "B", "C", "D"] as const;
const COL_X = [62, 138, 214, 290];
const ROW_Y: Record<number, number> = { 4: 16, 3: 70, 2: 124, 1: 178 };
const NODE_W = 58;
const NODE_H = 26;

const NODES = [
  "A4", "B4", "C4", "D4",
  "A3", "B3", "C3", "D3",
  "A2", "B2", "C2", "D2",
  "A1", "B1", "C1", "D1",
] as const;

/** 아래 라운드의 부모를 가리키는 참조(가정). */
const EDGES: readonly (readonly [string, string])[] = [
  ["A4", "A3"], ["A4", "B3"], ["A4", "C3"],
  ["A3", "A2"], ["A3", "B2"], ["A3", "C2"],
  ["B3", "B2"], ["B3", "C2"], ["B3", "D2"],
  ["C3", "A2"], ["C3", "C2"], ["C3", "D2"],
  ["A2", "A1"], ["A2", "B1"], ["A2", "C1"],
  ["B2", "A1"], ["B2", "B1"], ["B2", "D1"],
  ["C2", "B1"], ["C2", "C1"], ["C2", "D1"],
  ["D2", "A1"], ["D2", "C1"], ["D2", "D1"],
];

const L2_SET = ["A2", "A1", "B1", "C1"];
const L4_SET = ["A4", "A3", "B3", "C3", "B2", "C2", "D2", "D1"];
const L2_VISIT = ["A2", "C1", "B1", "A1"];
const L2_SORTED = ["C1", "B1", "A1", "A2"];
const L4_VISIT = ["A4", "C3", "D2", "D1", "C2", "B3", "B2", "A3"];
const L4_SORTED = ["D1", "D2", "C2", "B2", "C3", "B3", "A3", "A4"];

const ACCENT = "#2563eb";
const DONE = "#16a34a";
const MUTED = "#94a3b8";
const TEXT = "#64748b";

function pos(name: string) {
  const col = COLS.indexOf(name[0] as (typeof COLS)[number]);
  const round = Number(name.slice(1));
  return { x: COL_X[col], y: ROW_Y[round] };
}

function indexOf(name: string) {
  const first = L2_SORTED.indexOf(name);
  if (first >= 0) return first + 1;
  const second = L4_SORTED.indexOf(name);
  return second >= 0 ? second + 5 : null;
}

function nodeLook(name: string, phase: Phase) {
  const inL2 = L2_SET.includes(name);
  const inL4 = L4_SET.includes(name);
  if (phase === "collect2") return inL2 ? "collect" : "idle";
  if (phase === "out2") return inL2 ? "out" : "idle";
  if (phase === "state") return inL2 ? "done" : "idle";
  if (phase === "collect4") return inL4 ? "collect" : inL2 ? "skip" : "idle";
  return inL4 ? "out" : inL2 ? "done" : "idle";
}

function edgeLook(child: string, parent: string, phase: Phase) {
  const l2Edge = child === "A2";
  const l4Edge = L4_SET.includes(child);
  if ((phase === "collect2" || phase === "out2") && l2Edge) return "on";
  if ((phase === "collect4" || phase === "out4") && l4Edge) return L2_SET.includes(parent) ? "skip" : "on";
  return "off";
}

function DagPicture({ phase }: { phase: Phase }) {
  return (
    <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label="라운드 1부터 4까지 네 작성자의 인증서와 부모 참조">
      {[4, 3, 2, 1].map((round) => (
        <text key={round} x={4} y={ROW_Y[round] + 17} fontSize={11} fontWeight={700} fill={TEXT}>
          r{round}
        </text>
      ))}
      {EDGES.map(([child, parent]) => {
        const a = pos(child);
        const b = pos(parent);
        const look = edgeLook(child, parent, phase);
        return (
          <line
            key={`${child}-${parent}`}
            x1={a.x + NODE_W / 2}
            y1={a.y + NODE_H}
            x2={b.x + NODE_W / 2}
            y2={b.y}
            stroke={look === "on" ? ACCENT : MUTED}
            strokeWidth={look === "on" ? 1.25 : 1}
            strokeDasharray={look === "skip" ? "3 3" : undefined}
            opacity={look === "off" ? 0.35 : 1}
          />
        );
      })}
      {NODES.map((name) => {
        const { x, y } = pos(name);
        const look = nodeLook(name, phase);
        const index = indexOf(name);
        const anchor = name === "A2" ? "L2 " : name === "A4" ? "L4 " : "";
        const fill = look === "collect" ? ACCENT : look === "out" ? DONE : "none";
        const stroke = look === "collect" ? ACCENT : look === "out" ? DONE : MUTED;
        const textFill = look === "collect" || look === "out" ? "#ffffff" : look === "idle" ? MUTED : TEXT;
        const showIndex = look === "out" || look === "done";
        return (
          <g key={name}>
            <rect
              x={x}
              y={y}
              width={NODE_W}
              height={NODE_H}
              rx={4}
              fill={fill}
              stroke={stroke}
              strokeWidth={1}
              strokeDasharray={look === "skip" ? "3 2" : undefined}
            />
            <text x={x + NODE_W / 2} y={y + 17} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={textFill}>
              {anchor}
              {name}
              {showIndex && index !== null ? ` #${index}` : ""}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function Chips({ title, items, tone }: { title: string; items: readonly string[]; tone: "accent" | "done" | "muted" }) {
  const color = tone === "accent" ? "border-blue-600 text-blue-700 dark:text-blue-300" : tone === "done" ? "border-green-600 text-green-700 dark:text-green-400" : "border-border text-muted-foreground";
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-start gap-2 text-xs">
      <span className="pt-1 font-semibold text-muted-foreground">{title}</span>
      <div className="flex min-w-0 flex-wrap gap-1">
        {items.map((item, index) => (
          <span key={`${item}-${index}`} className={`border px-1.5 py-0.5 font-mono font-bold ${color}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function Lists({ phase }: { phase: Phase }) {
  if (phase === "collect2") {
    return (
      <div className="space-y-2">
        <Chips title="방문 순서(가정)" items={L2_VISIT} tone="accent" />
        <Chips title="출력" items={["아직 없음"]} tone="muted" />
      </div>
    );
  }
  if (phase === "out2") {
    return (
      <div className="space-y-2">
        <Chips title="방문 순서(가정)" items={L2_VISIT} tone="muted" />
        <Chips title="정렬 뒤 출력" items={L2_SORTED.map((name, i) => `#${i + 1} ${name}`)} tone="done" />
      </div>
    );
  }
  if (phase === "state") {
    return (
      <div className="space-y-2">
        <Chips title="last_committed" items={["A = 2", "B = 1", "C = 1", "D = 없음"]} tone="accent" />
        <Chips title="출력됨" items={L2_SORTED.map((name, i) => `#${i + 1} ${name}`)} tone="muted" />
      </div>
    );
  }
  if (phase === "collect4") {
    return (
      <div className="space-y-2">
        <Chips title="방문 순서(가정)" items={L4_VISIT} tone="accent" />
        <Chips title="건너뜀" items={["A2", "A1", "B1", "C1"]} tone="muted" />
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <Chips title="L2 묶음" items={L2_SORTED.map((name, i) => `#${i + 1} ${name}`)} tone="muted" />
      <Chips title="L4 묶음" items={L4_SORTED.map((name, i) => `#${i + 5} ${name}`)} tone="done" />
    </div>
  );
}

export default function SubDagFlattenViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200);
  const labels = SCENES.map((scene) => scene.label);

  return (
    <VizFrame
      eyebrow="두 앵커의 하위 DAG를 한 줄로"
      title="L2 묶음을 먼저 내보내면 L4 묶음에서는 새 인증서만 남습니다"
      description="칸 하나가 인증서, 선은 아래 라운드의 부모를 가리키는 참조입니다(n=4, 작성자 A~D). 앵커는 L2=A2, L4=A4이고, 부모 연결과 digest 순서는 설명용 가정입니다."
      note="GC 경계와 배치 원문 회수는 그리지 않았습니다. 출력은 인증서 순서이며 거래 실행 결과가 아닙니다."
      documentFlow
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        role="group"
        aria-label="L2와 L4의 하위 DAG를 중복 없이 한 줄로 출력하는 다섯 단계"
        onKeyDown={scenes.onKeyDown}
        className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
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
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="min-w-0 space-y-4">
              <DagPicture phase={scene.phase} />
              <Lists phase={scene.phase} />
            </div>
          ))}
        />
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
