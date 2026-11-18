import SceneShell from "./SceneShell";

/**
 * 본문 대응: #fp6 — 세 계수 곱 (d+ev+fv²)(a+bv+cv²)의 아홉 항과 v³=ξ, v⁴=ξv 축약.
 * 결과 [ad+ξ(ce+bf), ae+bd+ξ·cf, af+be+cd] = 원문 [ad+ξx, y+ξcf, z].
 * 이번 입력: f=1+u, c=2+u, 나머지 0 → cf=1+3u, ξ(1+3u)=(9+u)(1+3u)=6+28u → [0, 6+28u, 0].
 */
const LEFT = ["d", "e", "f"] as const;
const RIGHT = ["a", "b", "c"] as const;
const POW: readonly string[] = ["v⁰", "v¹", "v²", "v³", "v⁴"];

const SCENES = [
  { label: "아홉 항의 차수", summary: "차수 0~4, 아홉 항", note: "왼쪽 계수 하나와 오른쪽 계수 하나를 곱할 때마다 v의 지수가 더해집니다. 같은 대각선의 칸은 같은 차수이고, 오른쪽 아래의 세 칸이 v³와 v⁴를 만듭니다." },
  { label: "v³와 v⁴를 낮춤", summary: "v³ → ×ξ → 상수 · v⁴ → ×ξ → v", note: "저장 칸은 v⁰·v¹·v² 세 개뿐입니다. v³=ξ이므로 v³ 항은 ξ를 곱해 상수 칸으로, v⁴=ξv이므로 v⁴ 항은 ξ를 곱해 v 칸으로 보냅니다. 항을 버리면 곱셈이 달라집니다." },
  { label: "이번 입력", summary: "[0, 6+28u, 0]", note: "f=1+u와 c=2+u만 0이 아니므로 v⁴ 칸의 cf=1+3u만 남습니다. ξ=9+u를 곱하면 (1+3u)(9+u)=6+28u이고 v 칸에 들어갑니다. 이 단계의 결과는 아직 v²가 아니라 (6+28u)v입니다." },
] as const;

const W = 360;
const H = 206;
const GX = 52;
const GY = 40;
const CW = 58;
const CH = 46;
const SX = 248;
const SW = 104;

function cellColor(deg: number, active: number, nonzero: boolean): { stroke: string; fill: string; op: number; dash?: string } {
  if (active === 2) return nonzero ? { stroke: "#2563eb", fill: "#2563eb", op: 0.12 } : { stroke: "#cbd5e1", fill: "#94a3b8", op: 0.05, dash: "3 3" };
  if (deg >= 3) return { stroke: "#d97706", fill: "#d97706", op: active === 1 ? 0.14 : 0.08 };
  return { stroke: "#94a3b8", fill: "#94a3b8", op: 0 };
}

const SLOT_TEXT: readonly (readonly string[])[] = [
  ["", "", ""],
  ["ad + ξ(ce+bf)", "ae+bd + ξ·cf", "af+be+cd"],
  ["0", "ξ(1+3u)=6+28u", "0"],
];

export default function Fp6FoldViz() {
  return (
    <SceneShell
      eyebrow="가운데 층의 곱"
      title="아홉 항을 세 칸에 담으려면 v³와 v⁴를 접어 넣습니다"
      description="왼쪽 값 d+ev+fv²와 오른쪽 값 a+bv+cv²의 계수끼리 곱한 아홉 칸입니다. 각 계수는 Fq2 값(두 숫자)이고, ξ=9+u는 v³를 대신하는 상수입니다."
      ariaLabel="세 계수 곱의 아홉 항이 v의 세 저장 칸으로 모이는 과정"
      scenes={SCENES}
      render={(active) => {
        const slotText = SLOT_TEXT[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={GX + (3 * CW) / 2} y={12} textAnchor="middle" fontSize={11} fill="#64748b">오른쪽 값의 계수</text>
            {RIGHT.map((r, j) => (
              <text key={r} x={GX + j * CW + CW / 2} y={GY - 8} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">
                {r}·{POW[j]}
              </text>
            ))}
            {LEFT.map((l, i) => (
              <text key={l} x={GX - 6} y={GY + i * CH + CH / 2 + 4} textAnchor="end" fontSize={11} fontWeight={700} fill="currentColor">
                {l}·{POW[i]}
              </text>
            ))}
            {LEFT.map((l, i) =>
              RIGHT.map((r, j) => {
                const deg = i + j;
                const nonzero = i === 2 && j === 2;
                const c = cellColor(deg, active, nonzero);
                const dim = active === 2 && !nonzero;
                const sub = active === 0 ? POW[deg] : active === 1 ? (deg === 3 ? "×ξ → v⁰" : deg === 4 ? "×ξ → v¹" : `→ ${POW[deg]}`) : nonzero ? "1+3u · v⁴" : "0";
                return (
                  <g key={`${l}${r}`}>
                    <rect x={GX + j * CW + 3} y={GY + i * CH + 3} width={CW - 6} height={CH - 6} rx={7} fill={c.fill} fillOpacity={c.op} stroke={c.stroke} strokeWidth={1} strokeDasharray={c.dash} />
                    <text x={GX + j * CW + CW / 2} y={GY + i * CH + 20} textAnchor="middle" fontSize={13} fontWeight={700} fill={dim ? "#94a3b8" : "currentColor"}>
                      {r}{l}
                    </text>
                    <text x={GX + j * CW + CW / 2} y={GY + i * CH + 35} textAnchor="middle" fontSize={10.5} fontWeight={600} fill={deg >= 3 && !dim ? "#b45309" : "#64748b"}>
                      {sub}
                    </text>
                  </g>
                );
              }),
            )}
            <text x={SX + SW / 2} y={GY - 8} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">저장 칸 세 개</text>
            {[0, 1, 2].map((k) => {
              const filled = slotText[k] !== "";
              const hit = active === 2 && k === 1;
              return (
                <g key={k}>
                  <rect x={SX} y={GY + k * CH + 3} width={SW} height={CH - 6} rx={7} fill={hit ? "#2563eb" : "#94a3b8"} fillOpacity={hit ? 0.12 : 0} stroke={hit ? "#2563eb" : "#94a3b8"} strokeWidth={hit ? 1.25 : 1} />
                  <text x={SX + 8} y={GY + k * CH + 17} fontSize={10} fontWeight={700} fill="#64748b">{POW[k]} 칸</text>
                  <text x={SX + SW / 2} y={GY + k * CH + 33} textAnchor="middle" fontSize={11} fontWeight={600} fill={filled ? (hit ? "#2563eb" : "currentColor") : "#94a3b8"}>
                    {filled ? slotText[k] : "아직 비어 있음"}
                  </text>
                </g>
              );
            })}
            <text x={8} y={H - 12} fontSize={10.5} fill="#64748b">
              {active === 0 ? "같은 대각선 = 같은 차수 · 주황 칸 = 저장 칸보다 높은 차수" : active === 1 ? "x=ce+bf, y=ae+bd, z=af+be+cd (원문의 x·y·z)" : "빈 점선 칸은 이번 입력에서 0인 곱입니다"}
            </text>
          </svg>
        );
      }}
    />
  );
}
