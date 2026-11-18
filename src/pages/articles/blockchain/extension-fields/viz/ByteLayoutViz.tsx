import SceneShell from "./SceneShell";

/**
 * 본문 대응: #wire — 같은 6+28u의 바이트 위치.
 * ark: 계수 12개 × 32바이트 = 384바이트, 작은 쪽부터. 4번 계수(v²)는 4×32=128번, 5번(uv²)은 5×32=160번에서 시작.
 * EIP-197: a·i+b를 (a,b) 순서, 각 32바이트 큰 쪽부터 → 31번 바이트 = 28, 63번 바이트 = 6.
 * 순서를 바꿔 [28,6]을 내부 계수로 읽으면 28+6u.
 */
const COEFFS: readonly string[] = ["1", "u", "v", "uv", "v²", "uv²", "w", "uw", "vw", "uvw", "v²w", "uv²w"];

const SCENES = [
  { label: "ark 내부 384바이트", summary: "128번 = 6 · 160번 = 28", note: "계수 열두 개를 논리 순서대로 32바이트씩 씁니다. 4번 계수 v²는 4×32=128번 바이트에서, 5번 계수 uv²는 160번에서 시작합니다. 작은 쪽부터 쓰는 형식이라 작은 값 6과 28이 각 묶음의 첫 바이트에 있습니다." },
  { label: "EIP-197 64바이트", summary: "31번 = 28 · 63번 = 6", note: "EIP-197은 a·i+b를 (a,b) 순서로 보내고 각 숫자를 큰 쪽부터 32바이트로 씁니다. 28이 첫 묶음의 마지막 바이트, 6이 다음 묶음의 마지막 바이트입니다. 계수 하나의 형식 예시이며 G2 점 전체가 아닙니다." },
  { label: "순서를 바꿔 읽으면", summary: "[28, 6] → 28+6u", note: "보낸 순서 그대로 [28,6]을 내부 계수 c0, c1로 읽으면 28+6u입니다. 길이와 모양은 같지만 다른 값입니다. 왕복 직렬화만으로는 양쪽이 같은 잘못된 순서를 쓰는 경우를 잡지 못합니다." },
] as const;

const W = 360;
const H = 250;
const BX = 9;
const BW = 52;
const BGAP = 6;
const BY = [24, 70] as const;
const BH = 40;
const STRIP_Y = 142;
const RX = 46;
const CW = 19;
const RH = 22;

type ByteMark = { row: number; col: number; value: string; tone: "ok" | "bad" };

const STRIPS: readonly { title: string; rowStarts: readonly number[]; marks: readonly ByteMark[] }[] = [
  { title: "v² 묶음(128~159)·uv² 묶음(160~191) 확대", rowStarts: [128, 144, 160, 176], marks: [{ row: 0, col: 0, value: "6", tone: "ok" }, { row: 2, col: 0, value: "28", tone: "ok" }] },
  { title: "EIP-197: a=28 묶음(0~31), b=6 묶음(32~63)", rowStarts: [0, 16, 32, 48], marks: [{ row: 1, col: 15, value: "28", tone: "ok" }, { row: 3, col: 15, value: "6", tone: "ok" }] },
  { title: "[28, 6]을 내부 c0, c1 자리로 읽으면", rowStarts: [128, 144, 160, 176], marks: [{ row: 0, col: 0, value: "28", tone: "bad" }, { row: 2, col: 0, value: "6", tone: "bad" }] },
];

export default function ByteLayoutViz() {
  return (
    <SceneShell
      eyebrow="바이트 순서"
      title="같은 6+28u가 형식마다 다른 바이트 자리에 놓입니다"
      description="위 칸 하나는 Fq 계수 하나(32바이트)이고, 아래 작은 칸 하나는 1바이트입니다. 점은 값이 0인 바이트입니다."
      ariaLabel="출력 6+28u의 ark 직렬화와 EIP-197 형식 바이트 위치 비교"
      scenes={SCENES}
      render={(active) => {
        const strip = STRIPS[active];
        const topDim = active === 1;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={BX} y={14} fontSize={12} fontWeight={700} fill={topDim ? "#94a3b8" : "#64748b"}>
              {topDim ? "ark 내부 384바이트 (EIP-197이 정하지 않는 형식)" : "ark 내부 384바이트 = 계수 12개 × 32바이트"}
            </text>
            {COEFFS.map((name, k) => {
              const row = k < 6 ? 0 : 1;
              const col = k % 6;
              const x = BX + col * (BW + BGAP);
              const y = BY[row];
              const hit = !topDim && (k === 4 || k === 5);
              const bad = active === 2 && hit;
              const value = k === 4 ? (active === 2 ? "28" : "6") : active === 2 ? "6" : "28";
              const stroke = topDim ? "#cbd5e1" : bad ? "#dc2626" : hit ? "#2563eb" : "#94a3b8";
              return (
                <g key={name}>
                  <rect x={x} y={y} width={BW} height={BH} rx={7} fill={stroke} fillOpacity={hit ? 0.12 : 0} stroke={stroke} strokeWidth={hit ? 1.25 : 1} strokeDasharray={topDim ? "3 3" : undefined} />
                  <text x={x + BW / 2} y={y + 17} textAnchor="middle" fontSize={13} fontWeight={700} fill={topDim ? "#94a3b8" : "currentColor"}>{name}</text>
                  <text x={x + BW / 2} y={y + 32} textAnchor="middle" fontSize={10.5} fontWeight={hit ? 700 : 400} fill={bad ? "#dc2626" : hit ? "#2563eb" : "#94a3b8"}>
                    {hit ? `값 ${value}` : `${k * 32}번~`}
                  </text>
                </g>
              );
            })}
            <text x={BX} y={STRIP_Y - 10} fontSize={12} fontWeight={700} fill="#64748b">{strip.title}</text>
            {strip.rowStarts.map((start, row) => (
              <g key={`${active}-${row}`}>
                <text x={RX - 6} y={STRIP_Y + row * RH + 14} textAnchor="end" fontSize={10.5} fill="#64748b" fontFamily="ui-monospace, monospace">{start}</text>
                {Array.from({ length: 16 }, (_, col) => {
                  const mark = strip.marks.find((m) => m.row === row && m.col === col);
                  const color = mark ? (mark.tone === "bad" ? "#dc2626" : "#2563eb") : "#cbd5e1";
                  return (
                    <g key={col}>
                      <rect x={RX + col * CW + 1} y={STRIP_Y + row * RH + 1} width={CW - 2} height={RH - 4} rx={3} fill={color} fillOpacity={mark ? 0.14 : 0} stroke={color} strokeWidth={1} />
                      {mark ? (
                        <text x={RX + col * CW + CW / 2} y={STRIP_Y + row * RH + 13} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>{mark.value}</text>
                      ) : (
                        <circle cx={RX + col * CW + CW / 2} cy={STRIP_Y + row * RH + 9} r={1.2} fill="#94a3b8" />
                      )}
                    </g>
                  );
                })}
              </g>
            ))}
            <text x={BX} y={H - 6} fontSize={12} fontWeight={700} fill={active === 2 ? "#dc2626" : "#2563eb"}>
              {active === 0 ? "c0 = 6, c1 = 28 → 6+28u" : active === 1 ? "28이 먼저, 6이 다음 · 각 묶음의 마지막 바이트" : "c0 = 28, c1 = 6 → 28+6u ≠ 6+28u"}
            </text>
          </svg>
        );
      }}
    />
  );
}
