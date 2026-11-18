import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture 2문단 — 베끼는 동안 오자와 주석이 생기고 번역에서 새 개념이 붙는다.
 * 사본 사이 차이는 실패이면서 변화의 증거다. 원고 하나에서 갈라지는 사본 계보의 모양은 설명용 가정이다.
 */
const W = 360;
const H = 196;
const PAGE_W = 70;
const PAGE_H = 50;

const NODES = [
  { key: "origin", x: 52, y: 70, title: "원고", from: null, appear: 0 },
  { key: "a", x: 180, y: 12, title: "사본 ㄱ", from: "origin", appear: 1 },
  { key: "b", x: 180, y: 124, title: "사본 ㄴ", from: "origin", appear: 2 },
  { key: "t", x: 308, y: 124, title: "번역본", from: "b", appear: 3 },
] as const;

type NodeKey = (typeof NODES)[number]["key"];

const SCENES = [
  { label: "원고 한 권", summary: "베끼기 전", note: "한 원고에서 출발합니다. 원고 하나가 갈라지는 아래 계보의 모양은 설명용 가정입니다." },
  { label: "베끼는 동안 오자가 생깁니다", summary: "사본 ㄱ · 오자", note: "옮겨 쓰는 동안 오자가 생깁니다. 그림에서는 한 자리가 바뀐 것으로 나타냈습니다(가정)." },
  { label: "주석이 붙습니다", summary: "사본 ㄴ · 주석", note: "베끼는 동안 본문 옆에 설명, 곧 주석이 붙기도 합니다. 그림에서는 다른 사본 ㄴ에 붙은 것으로 나타냈습니다(가정)." },
  { label: "번역에서 새 개념이 붙습니다", summary: "번역본 · 새 개념", note: "번역에서는 새 개념이 붙습니다. 그림에서는 사본 ㄴ을 다른 언어로 옮긴 번역본으로 나타냈고, ㄴ의 주석도 함께 옮겨져 차이가 쌓인 것으로 그렸습니다(가정)." },
  { label: "사본끼리 맞대 봅니다", summary: "차이 = 실패이면서 변화의 증거", note: "세 본이 원고와 조금씩 다릅니다. 사본 사이 차이는 실패이면서 변화의 증거이기도 합니다. 전승은 원문을 그대로 운반하는 복사가 아니라 무엇을 고치고 설명할지 판단하는 과정입니다." },
] as const;

const MARKS: Record<NodeKey, { text: string; color: string } | null> = {
  origin: null,
  a: { text: "오자", color: "#dc2626" },
  b: { text: "주석", color: "#0f766e" },
  t: { text: "새 개념", color: "#7c3aed" },
};

function Page({ x, y, title, mark, inherited, on, focus }: { x: number; y: number; title: string; mark: { text: string; color: string } | null; inherited: boolean; on: boolean; focus: boolean }) {
  const left = x - PAGE_W / 2;
  const narrowLines = mark?.text === "주석" || inherited;
  return (
    <g opacity={on ? 1 : 0.4}>
      <rect x={left} y={y} width={PAGE_W} height={PAGE_H} rx={4} fill="#94a3b8" fillOpacity={0.08} stroke={focus ? "#2563eb" : "#94a3b8"} strokeWidth={focus ? 1.25 : 1} />
      {[0, 1, 2].map((row) => (
        <line key={row} x1={left + 8} x2={left + PAGE_W - (narrowLines ? 26 : 8)} y1={y + 18 + row * 9} y2={y + 18 + row * 9} stroke="#94a3b8" strokeWidth={1} />
      ))}
      {mark?.text === "오자" && <rect x={left + 26} y={y + 22} width={14} height={8} fill="none" stroke={mark.color} strokeWidth={1.25} />}
      {(mark?.text === "주석" || inherited) && <line x1={left + PAGE_W - 18} x2={left + PAGE_W - 18} y1={y + 14} y2={y + 38} stroke={MARKS.b?.color} strokeWidth={1.25} />}
      {mark?.text === "새 개념" && <rect x={left + 8} y={y + 31} width={30} height={8} rx={2} fill={mark.color} fillOpacity={0.3} stroke={mark.color} strokeWidth={1} />}
      <text x={x} y={y + 11} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="currentColor">{title}</text>
      {mark && (
        <text x={x} y={y + PAGE_H + 15} textAnchor="middle" fontSize={12} fontWeight={700} fill={mark.color}>{inherited ? `주석 + ${mark.text}` : mark.text}</text>
      )}
    </g>
  );
}

export default function CopyLineageViz() {
  return (
    <SceneShell
      eyebrow="사본 계보 (가정)"
      title="베낄수록 사본은 조금씩 달라집니다"
      description="네모 하나가 한 권의 원고 또는 사본이고, 선은 무엇을 보고 베꼈는지입니다. 계보의 모양은 설명용 가정입니다."
      ariaLabel="원고 하나에서 오자가 생긴 사본, 주석이 붙은 사본, 새 개념이 붙은 번역본으로 갈라지는 계보"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-3">
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {NODES.filter((node) => node.from !== null && node.appear <= active).map((node) => {
              const parent = NODES.find((other) => other.key === node.from);
              if (!parent) return null;
              const label = node.key === "t" ? "번역" : "베낌";
              const x1 = parent.x + PAGE_W / 2;
              const y1 = parent.y + PAGE_H / 2;
              const x2 = node.x - PAGE_W / 2;
              const y2 = node.y + PAGE_H / 2;
              return (
                <g key={node.key}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth={1} />
                  <text x={(x1 + x2) / 2} y={node.key === "t" ? y2 - 6 : node.key === "a" ? (y1 + y2) / 2 - 6 : (y1 + y2) / 2 + 14} textAnchor="middle" fontSize={11} fill="#64748b">{label}</text>
                </g>
              );
            })}
            {NODES.filter((node) => node.appear <= active).map((node) => (
              <Page
                key={node.key}
                x={node.x}
                y={node.y}
                title={node.title}
                mark={MARKS[node.key]}
                inherited={node.key === "t"}
                on={active === 4 || node.appear === active || node.key === "origin"}
                focus={node.appear === active || (active === 4 && node.key !== "origin")}
              />
            ))}
          </svg>
          <ul className="grid min-w-0 grid-cols-3 gap-2 text-center text-xs leading-5 sm:text-sm">
            {[
              { name: "오자", color: "#dc2626", lit: active === 1 || active === 4 },
              { name: "주석", color: "#0f766e", lit: active === 2 || active === 4 },
              { name: "새 개념", color: "#7c3aed", lit: active === 3 || active === 4 },
            ].map((item) => (
              <li key={item.name} className={`rounded-lg border px-2 py-1.5 ${item.lit ? "" : "opacity-35"}`} style={{ borderColor: item.color }}>
                <span className="block font-bold" style={{ color: item.color }}>{item.name}</span>
                <span className="block text-muted-foreground">원고와 다름</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    />
  );
}
