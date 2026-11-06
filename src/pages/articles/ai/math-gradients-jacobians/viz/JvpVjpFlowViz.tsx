import SceneShell from "./SceneShell";

/**
 * 본문 대응: #boundaries — J=[[1,1],[3,2]].
 * JVP: v=(0.01,−0.02) → (−0.01,−0.01).
 * VJP: w=(2,−1) → (2×1−3, 2×1−2) = (−1,0).
 * 모양: m=2, n=3이면 v 길이 3 → Jv 길이 2, w 길이 2 → wᵀJ 길이 3(가정).
 */
const SCENES = [
  { label: "JVP · 입력에서 결과로", summary: "Jv = (−0.01, −0.01)", kind: "jvp", note: "입력 변화 v에서 출발합니다. 각 선의 비율을 곱해 오른쪽으로 보낸 뒤 결과마다 더합니다. 9절에서 행마다 합친 값과 같습니다." },
  { label: "VJP · 결과에서 입력으로", summary: "wᵀJ = (−1, 0)", kind: "vjp", note: "결과 쪽 비중 w=(2,−1)에서 출발합니다(가정). 같은 선의 비율을 곱해 왼쪽으로 보낸 뒤 입력마다 더합니다. 2F₁−F₂의 입력별 민감도입니다." },
  { label: "표가 정사각형이 아닐 때 (가정)", summary: "n=3, m=2", kind: "shape", note: "2행 3열이면 JVP는 길이 3을 받아 길이 2를 돌려주고, VJP는 길이 2를 받아 길이 3을 돌려줍니다. 시작하는 쪽이 다르므로 벡터 길이도 다릅니다. wᵀJ는 가로로 놓인 행벡터입니다. 숫자는 정하지 않았습니다." },
] as const;

const LX = 62;
const RX = 298;
const Y1 = 58;
const Y2 = 178;

/** 선 위 비율 p(0~1) 지점 근처에 놓는 값 표시입니다. */
function PartLabel({ text, x1, y1, x2, y2, at, dx, dy, color }: { text: string; x1: number; y1: number; x2: number; y2: number; at: number; dx: number; dy: number; color: string }) {
  return (
    <text x={x1 + (x2 - x1) * at + dx} y={y1 + (y2 - y1) * at + dy} textAnchor="middle" fontSize="12" fontWeight="700" fill={color}>
      {text}
    </text>
  );
}

function Node({ x, y, name, value, color }: { x: number; y: number; name: string; value: string; color: string }) {
  return (
    <g>
      <rect x={x - 42} y={y - 22} width="84" height="44" rx="8" fill="none" stroke={color} strokeWidth="1" />
      <text x={x} y={y - 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor">{name}</text>
      <text x={x} y={y + 13} textAnchor="middle" fontSize="12" fontWeight="700" fill={color}>{value}</text>
    </g>
  );
}

function Flow({ kind }: { kind: "jvp" | "vjp" }) {
  const forward = kind === "jvp";
  const color = forward ? "#2563eb" : "#d97706";
  const wires = [
    { a: Y1, b: Y1, rate: "1", part: forward ? "+0.01" : "2" },
    { a: Y1, b: Y2, rate: "3", part: forward ? "+0.03" : "−3" },
    { a: Y2, b: Y1, rate: "1", part: forward ? "−0.02" : "2" },
    { a: Y2, b: Y2, rate: "2", part: forward ? "−0.04" : "−2" },
  ];
  const left = forward ? ["0.01", "−0.02"] : ["합 −1", "합 0"];
  const right = forward ? ["합 −0.01", "합 −0.01"] : ["2", "−1"];
  return (
    <svg viewBox="0 0 360 236" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={forward ? "입력에서 결과로 흐르는 JVP" : "결과에서 입력으로 흐르는 VJP"}>
      {wires.map((wire) => {
        const x1 = LX + 42;
        const x2 = RX - 42;
        const at = forward ? 0.3 : 0.7;
        const flat = wire.a === wire.b;
        const dy = flat ? -6 : wire.a < wire.b ? -4 : 12;
        return (
          <g key={`${wire.a}-${wire.b}`}>
            <path d={`M${x1} ${wire.a}L${x2} ${wire.b}`} fill="none" stroke="#94a3b8" strokeWidth="1" />
            <PartLabel text={wire.part} x1={x1} y1={wire.a} x2={x2} y2={wire.b} at={at} dx={flat ? 0 : 24} dy={dy} color={color} />
          </g>
        );
      })}
      <Node x={LX} y={Y1} name="x" value={left[0]} color={color} />
      <Node x={LX} y={Y2} name="y" value={left[1]} color={color} />
      <Node x={RX} y={Y1} name="F₁ = x+y" value={right[0]} color={color} />
      <Node x={RX} y={Y2} name="F₂ = xy" value={right[1]} color={color} />
      <path d={forward ? "M130 222H230M222 216L230 222L222 228" : "M230 222H130M138 216L130 222L138 228"} fill="none" stroke={color} strokeWidth="1.25" />
    </svg>
  );
}

function Chips({ count, color, label, row = false }: { count: number; color: string; label: string; row?: boolean }) {
  return (
    <div className="min-w-0 text-center">
      <div className={row ? "mx-auto flex w-fit gap-1" : "mx-auto flex w-10 flex-col gap-1"}>
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className={`h-5 rounded-sm border ${row ? "w-5" : ""}`} style={{ borderColor: color, backgroundColor: `${color}22` }} />
        ))}
      </div>
      <span className="mt-1 block font-mono text-xs font-bold">{label}</span>
    </div>
  );
}

function ShapeRow({ title, from, to, color }: { title: string; from: { count: number; label: string }; to: { count: number; label: string; row?: boolean }; color: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <p className="text-sm font-bold">{title}</p>
      <div className="mt-2 flex items-center justify-center gap-3">
        <Chips count={from.count} color={color} label={from.label} />
        <span aria-hidden="true" className="font-mono text-base">→</span>
        <div className="grid grid-cols-3 gap-0.5" aria-label="2행 3열 표">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className="size-5 border border-[#94a3b8]" />
          ))}
        </div>
        <span aria-hidden="true" className="font-mono text-base">→</span>
        <Chips count={to.count} color={color} label={to.label} row={to.row} />
      </div>
    </div>
  );
}

export default function JvpVjpFlowViz() {
  return (
    <SceneShell
      eyebrow="곱의 방향"
      title="같은 표를 지나도 시작하는 쪽이 다릅니다"
      description="왼쪽은 입력, 오른쪽은 결과입니다. 선 하나가 표의 칸 하나이고 선의 비율은 F₁에 1·1, F₂에 3·2입니다. 선 옆의 수는 그 선으로 전달된 기여입니다."
      ariaLabel="JVP와 VJP가 같은 야코비안을 서로 반대 방향으로 지나는 과정"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        if (scene.kind === "shape") {
          return (
            <div className="grid min-w-0 gap-3 sm:grid-cols-2">
              <ShapeRow title="JVP · 입력 쪽에서 시작" from={{ count: 3, label: "v (n=3)" }} to={{ count: 2, label: "Jv (m=2)" }} color="#2563eb" />
              <ShapeRow title="VJP · 결과 쪽에서 시작" from={{ count: 2, label: "w (m=2)" }} to={{ count: 3, label: "wᵀJ (n=3)", row: true }} color="#d97706" />
            </div>
          );
        }
        return <Flow kind={scene.kind} />;
      }}
    />
  );
}
