import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview — Model의 parameter 탐색은 하위 Layer를 등록 순서대로 재귀 순회하고,
 * 이름만 같은 다른 tensor와 두 경로가 공유하는 같은 tensor를 구분한다.
 * 가정한 모델: l1 = 글의 Linear(W 2×3, b 3), l2 = Linear(W 3×1, b 1), l3는 l1.W를 공유.
 * 고유 parameter 원소 6+3+3+1 = 13, 공유 W를 한 번 더 세면 13+6 = 19.
 */
const ROWS = [
  { order: 1, path: "l1.W", id: "p0", shape: "2×3", count: 6 },
  { order: 2, path: "l1.b", id: "p1", shape: "3", count: 3 },
  { order: 3, path: "l2.W", id: "p2", shape: "3×1", count: 3 },
  { order: 4, path: "l2.b", id: "p3", shape: "1", count: 1 },
  { order: 5, path: "l3.W", id: "p0", shape: "2×3", count: 6 },
] as const;

const UNIQUE = ROWS.slice(0, 4).reduce<number>((sum, row) => sum + row.count, 0);
const NAIVE = ROWS.reduce<number>((sum, row) => sum + row.count, 0);

const SCENES = [
  {
    label: "등록 순서대로 내려가기",
    summary: "참조 5개를 만남",
    note: "Model에서 l1, l2, l3 순서로 내려가며 각 Layer가 가진 parameter 참조를 모읍니다. 이 단계에서는 아직 같은 tensor인지 판정하지 않았습니다.",
  },
  {
    label: "이름이 같아도 다른 tensor",
    summary: "l1.W ≠ l2.W",
    note: "두 참조 모두 이름은 W지만 identity가 p0와 p2로 다릅니다. 이름으로 중복을 지우면 l2의 weight가 optimizer에서 빠집니다.",
  },
  {
    label: "공유 tensor는 한 번만",
    summary: `고유 원소 ${UNIQUE}개 · 중복 시 ${NAIVE}개`,
    note: `l3.W는 이미 만난 p0를 다시 가리킵니다. identity로 걸러 건너뛰면 고유 parameter 4개, 원소 ${UNIQUE}개를 한 번씩 update합니다. 걸러내지 않으면 p0의 원소 6개를 두 번 세어 ${NAIVE}개가 됩니다.`,
  },
  {
    label: "manifest에 남기는 것",
    summary: "ID · shape · dtype · 순서",
    note: "checkpoint에는 고유 parameter마다 stable ID, shape, dtype, 순서를 함께 적습니다. dtype f32는 그림을 위한 가정입니다.",
  },
] as const;

type Mark = "idle" | "focus" | "skip" | "keep";

function rowMark(scene: number, index: number): Mark {
  if (scene === 0) return "focus";
  if (scene === 1) return index === 0 || index === 2 ? "focus" : "idle";
  if (scene === 2) return index === 4 ? "skip" : index === 0 ? "focus" : "keep";
  return index === 4 ? "skip" : "keep";
}

function verdict(scene: number, index: number): string {
  if (scene === 0) return "참조 수집";
  if (scene === 1) return index === 0 || index === 2 ? "이름 W · 다른 ID" : "";
  if (scene === 2) return index === 4 ? "p0 재방문 → 건너뜀" : "등록";
  return index === 4 ? "manifest 제외" : `#${index + 1} · f32 (가정)`;
}

const BOX = { stroke: "#94a3b8", fill: "none" };
const ACCENT = "#2563eb";
const SKIP = "#d97706";

function Tree({ scene }: { scene: number }) {
  const sharedOn = scene >= 2;
  const nameOn = scene === 1;
  const params = [
    { x: 8, label: "W", id: "p0", hl: nameOn || sharedOn },
    { x: 76, label: "b", id: "p1", hl: false },
    { x: 144, label: "W", id: "p2", hl: nameOn },
    { x: 212, label: "b", id: "p3", hl: false },
  ];
  const layers = [
    { x: 30, label: "l1 Linear", cx: 70 },
    { x: 150, label: "l2 Linear", cx: 190 },
    { x: 270, label: "l3", cx: 305 },
  ];
  return (
    <svg viewBox="0 0 360 190" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label="Model 아래 세 Layer와 parameter 참조 관계">
      <rect x={140} y={6} width={80} height={24} rx={6} {...BOX} />
      <text x={180} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill="#475569">Model</text>
      {layers.map((layer) => (
        <g key={layer.label}>
          <line x1={180} y1={30} x2={layer.cx} y2={58} stroke="#94a3b8" strokeWidth={1} />
          <rect x={layer.x} y={58} width={layer.label === "l3" ? 70 : 80} height={24} rx={6} {...BOX} />
          <text x={layer.cx} y={74} textAnchor="middle" fontSize={11} fill="#475569">{layer.label}</text>
        </g>
      ))}
      {params.map((param, index) => {
        const parent = index < 2 ? 70 : 190;
        return (
          <g key={param.id}>
            <line x1={parent} y1={82} x2={param.x + 30} y2={112} stroke="#94a3b8" strokeWidth={1} />
            <rect x={param.x} y={112} width={60} height={30} rx={6} fill="none" stroke={param.hl ? ACCENT : "#94a3b8"} strokeWidth={param.hl ? 1.25 : 1} />
            <text x={param.x + 30} y={126} textAnchor="middle" fontSize={11} fontWeight={700} fill={param.hl ? ACCENT : "#475569"}>{param.label}</text>
            <text x={param.x + 30} y={138} textAnchor="middle" fontSize={9} fill="#64748b">{param.id}</text>
          </g>
        );
      })}
      <path d="M305 82 V172 H38 V142" fill="none" stroke={sharedOn ? SKIP : "#94a3b8"} strokeWidth={sharedOn ? 1.25 : 1} strokeDasharray="4 3" />
      <text x={300} y={166} textAnchor="end" fontSize={10} fill={sharedOn ? SKIP : "#64748b"}>l3.W → 같은 p0를 가리킴</text>
    </svg>
  );
}

const MARK_CLASS: Record<Mark, string> = {
  idle: "text-muted-foreground/60",
  focus: "text-[#2563eb] font-semibold",
  keep: "text-foreground",
  skip: "text-[#d97706] line-through decoration-1",
};

function List({ scene }: { scene: number }) {
  return (
    <div className="mt-3 min-w-0 text-xs leading-6" role="list" aria-label="순회 순서와 판정">
      <div className="grid grid-cols-[1.25rem_2.75rem_1.75rem_2.5rem_minmax(0,1fr)] gap-x-2 border-b border-border/70 pb-1 font-semibold text-muted-foreground">
        <span>#</span>
        <span>경로</span>
        <span>ID</span>
        <span>shape</span>
        <span>판정</span>
      </div>
      {ROWS.map((row, index) => {
        const mark = rowMark(scene, index);
        return (
          <div key={row.order} role="listitem" className={`grid grid-cols-[1.25rem_2.75rem_1.75rem_2.5rem_minmax(0,1fr)] gap-x-2 border-b border-border/40 font-mono ${MARK_CLASS[mark]}`}>
            <span>{row.order}</span>
            <span>{row.path}</span>
            <span>{row.id}</span>
            <span>{row.shape}</span>
            <span className="break-keep font-sans">{verdict(scene, index)}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function ParameterTraversalViz() {
  return (
    <SceneShell
      eyebrow="parameter 탐색"
      title="같은 이름과 같은 tensor는 다른 문제입니다"
      description="l1은 글의 고정 예제 Linear(W 2×3, b 3)이고, l2(W 3×1, b 1)와 l1.W를 공유하는 l3는 그림을 위해 가정한 Layer입니다."
      ariaLabel="Model의 재귀 parameter 순회에서 이름이 같은 tensor와 공유 tensor를 구분하는 네 장면"
      scenes={SCENES}
      render={(scene) => (
        <div className="min-w-0">
          <Tree scene={scene} />
          <List scene={scene} />
        </div>
      )}
    />
  );
}
