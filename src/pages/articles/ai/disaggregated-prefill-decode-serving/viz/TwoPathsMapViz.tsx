import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — 출력의 길과 기록의 길이 다르다.
 * 사용자 → 입구 → 앞 장치, 앞 → 뒤(기록), 뒤 → 입구 → 사용자(출력).
 */
const SCENES = [
  { label: "요청이 들어갑니다", summary: "입구 → 앞 장치", on: ["user-in", "in-front"], note: "입구는 같은 모델을 실행할 수 있는 장치 가운데 요청을 받을 곳을 고릅니다. 앞 장치는 입력을 읽고 이후 계산에 필요한 기록을 만듭니다." },
  { label: "기록의 길", summary: "앞 장치 → 뒤 장치", on: ["record"], note: "연결 담당이 그 기록을 다음 장치로 옮기고 읽어도 되는 상태인지 알립니다. 사용자는 이 길을 보지 못합니다." },
  { label: "출력의 길", summary: "뒤 장치 → 입구 → 사용자", on: ["back-in", "in-user"], note: "뒤 장치가 기록을 이어 만든 답은 기록과 다른 길로 사용자에게 갑니다. 다음 절의 사례는 뒤 장치의 출력만 보냅니다." },
  { label: "앞 장치의 첫 답", summary: "계산했어도 전달은 별개", on: ["front-in"], note: "앞 장치가 첫 답을 이미 계산했어도 입구의 프로그램이 그 답을 보내지 않으면 사용자는 아직 아무것도 받지 못합니다." },
  { label: "입력 번호만 보낸다면", summary: "번호에는 중간 결과가 없음", on: ["in-back"], note: "입력 번호만으로는 이어 쓸 수 없습니다. 뒤 장치가 입력을 다시 계산하거나, 이미 만든 기록을 전달받아야 합니다." },
] as const;

type Edge = { id: string; d: string; color: string; dashed?: boolean };

const EDGES: readonly Edge[] = [
  { id: "user-in", d: "M66 88 H94", color: "#2563eb" },
  { id: "in-front", d: "M160 84 L224 48", color: "#2563eb" },
  { id: "record", d: "M288 72 V124", color: "#d97706" },
  { id: "back-in", d: "M224 154 H128 V122", color: "#16a34a" },
  { id: "in-user", d: "M94 106 H68", color: "#16a34a" },
  { id: "front-in", d: "M224 34 H128 V70", color: "#dc2626", dashed: true },
  { id: "in-back", d: "M160 106 L224 140", color: "#7c3aed", dashed: true },
];

function arrowHead(edge: Edge) {
  const nums = edge.d.match(/-?\d+(\.\d+)?/g)!.map(Number);
  const cmds = edge.d.match(/[MLHV]/g)!;
  let x = 0;
  let y = 0;
  let px = 0;
  let py = 0;
  let index = 0;
  for (const cmd of cmds) {
    px = x;
    py = y;
    if (cmd === "H") x = nums[index++];
    else if (cmd === "V") y = nums[index++];
    else {
      x = nums[index++];
      y = nums[index++];
    }
  }
  const angle = (Math.atan2(y - py, x - px) * 180) / Math.PI;
  return { x, y, angle };
}

function Node({ x, y, w, h, name, sub }: { x: number; y: number; w: number; h: number; name: string; sub?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="#94a3b8" fillOpacity={0.1} stroke="#94a3b8" strokeWidth={1} />
      <text x={x + w / 2} y={sub ? y + 22 : y + h / 2 + 4} textAnchor="middle" fontSize={13.5} fontWeight={700} fill="currentColor">{name}</text>
      {sub && <text x={x + w / 2} y={y + 39} textAnchor="middle" fontSize={11.5} fill="#64748b">{sub}</text>}
    </g>
  );
}

export default function TwoPathsMapViz() {
  return (
    <SceneShell
      eyebrow="요청 하나의 지도"
      title="출력이 가는 길과 기록이 가는 길은 다릅니다"
      description="표준 이름은 6절에서 붙입니다. 두 장치에는 모델이 이미 있다고 가정합니다."
      ariaLabel="사용자, 입구, 앞 장치, 뒤 장치 사이의 요청, 기록, 출력 경로"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const on: readonly string[] = scene.on;
        return (
          <svg key={scene.label} viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {EDGES.map((edge) => {
              const lit = on.includes(edge.id);
              const hidden = edge.dashed && !lit;
              if (hidden) return null;
              const head = arrowHead(edge);
              const color = lit ? edge.color : "#94a3b8";
              return (
                <g key={edge.id} opacity={lit ? 1 : 0.45}>
                  <path d={edge.d} fill="none" stroke={color} strokeWidth={lit ? 1.25 : 1} strokeDasharray={edge.dashed ? "4 3" : undefined} />
                  <path d="M-6 -4 L0 0 L-6 4" fill="none" stroke={color} strokeWidth={1} transform={`translate(${head.x} ${head.y}) rotate(${head.angle})`} />
                </g>
              );
            })}
            <Node x={6} y={72} w={60} h={50} name="사용자" />
            <Node x={96} y={72} w={64} h={50} name="입구" />
            <Node x={226} y={16} w={124} h={54} name="앞 장치" sub="입력을 읽고 기록 만듦" />
            <Node x={226} y={126} w={124} h={54} name="뒤 장치" sub={active === 4 ? "중간 결과 없음" : "기록에서 답을 이어 씀"} />
            {on.includes("record") && <text x={282} y={102} textAnchor="end" fontSize={12} fontWeight={700} fill="#d97706">기록 · 연결 담당</text>}
            {on.includes("back-in") && <text x={176} y={170} textAnchor="middle" fontSize={12} fontWeight={700} fill="#16a34a">출력</text>}
            {on.includes("front-in") && (
              <>
                <text x={176} y={27} textAnchor="middle" fontSize={12} fontWeight={700} fill="#dc2626">앞 장치의 첫 답</text>
                <text x={80} y={100} textAnchor="middle" fontSize={15} fontWeight={700} fill="#dc2626">×</text>
              </>
            )}
            {on.includes("in-back") && <text x={196} y={108} fontSize={12} fontWeight={700} fill="#7c3aed">입력 번호만</text>}
          </svg>
        );
      }}
    />
  );
}
