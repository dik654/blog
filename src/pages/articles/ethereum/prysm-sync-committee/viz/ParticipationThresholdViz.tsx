import SceneShell from "./SceneShell";

/**
 * 본문 대응: #light-client-verification 3절 — optimistic의 dynamic safety threshold(최근 두 period
 * 최대 참여 수의 절반)와 finalized 정상 경로의 2/3 문턱(3n ≥ 2 × 512 → n ≥ 342)을 같은 0–512 축에 둔다.
 * 최근 최대 480·360과 update 참여 200·300·400은 설명용 가정이다. 480/2 = 240, 360/2 = 180.
 */
const W = 360;
const H = 176;
const AX_L = 22;
const AX_R = 338;
const AXIS_Y = 92;
const N = 512;
const FINAL_MIN = 342;
const ax = (bits: number) => AX_L + (bits / N) * (AX_R - AX_L);

type Scene = { label: string; summary: string; recentMax: number; bits: readonly number[]; note: string };

const SCENES: readonly Scene[] = [
  {
    label: "두 문턱",
    summary: "safety 480/2 = 240 (가정) · 2/3 = 342",
    recentMax: 480,
    bits: [],
    note: "Optimistic 문턱은 최근 두 period 최대 참여의 절반이라 최대 480(가정)이면 240입니다. Finalized 정상 경로는 3n ≥ 1024, 곧 342입니다.",
  },
  {
    label: "200 bits",
    summary: "200 (가정) ≤ 240 · 3 × 200 = 600 < 1024",
    recentMax: 480,
    bits: [200],
    note: "200은 두 문턱 모두에 못 미칩니다. 유효한 update라면 우선 best candidate로 보관되지만 이 참여로 optimistic header를 전진시키지는 못합니다.",
  },
  {
    label: "300 bits",
    summary: "300 (가정) > 240 · 3 × 300 = 900 < 1024",
    recentMax: 480,
    bits: [300],
    note: "300은 240을 넘어 optimistic header를 전진시킬 수 있지만, 900 < 1024라 finalized의 2/3 참여 문턱에는 못 미칩니다.",
  },
  {
    label: "341·342",
    summary: "341 × 3 = 1023 < 1024 · 342 × 3 = 1026",
    recentMax: 480,
    bits: [341, 342],
    note: "341이면 1023으로 1024에 못 미치고 342부터 만족합니다. 사양은 비율 대신 이 정수 곱셈으로 비교합니다.",
  },
  {
    label: "400 bits",
    summary: "400 (가정) · 두 참여 문턱 통과 · finality 조건은 별도",
    recentMax: 480,
    bits: [400],
    note: "400은 두 참여 문턱을 넘습니다. 그래도 finalized header를 바꾸려면 유효한 finality branch와 더 새로운 finalized header(또는 필요한 next committee finality)가 함께 필요합니다.",
  },
  {
    label: "최대 360",
    summary: "safety 360/2 = 180 (가정) · 342는 그대로",
    recentMax: 360,
    bits: [200],
    note: "최근 최대가 360(가정)이면 문턱이 180으로 내려가 200도 넘습니다. 움직이는 것은 optimistic 문턱뿐이고 342는 committee 크기 512로 고정입니다.",
  },
];

export default function ParticipationThresholdViz() {
  return (
    <SceneShell
      eyebrow="Optimistic과 finalized의 문턱"
      title="같은 참여 수가 한 문턱은 넘고 다른 문턱은 못 넘을 수 있습니다"
      description="가로축은 켜진 position 수(0–512)입니다. 점선은 움직이는 safety threshold, 실선은 고정된 2/3 문턱입니다."
      note="최근 최대 참여 480·360과 update 참여 200·300·341·400은 설명용 가정입니다. 512와 342는 mainnet preset에서 계산한 값입니다."
      ariaLabel="0부터 512까지의 참여 수 축 위에서 dynamic safety threshold와 2/3 문턱 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const safety = scene.recentMax / 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={AX_L} x2={AX_R} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
            {[0, 128, 256, 384, 512].map((tick) => (
              <g key={tick}>
                <line x1={ax(tick)} x2={ax(tick)} y1={AXIS_Y - 3} y2={AXIS_Y + 3} stroke="#94a3b8" strokeWidth={1} />
                <text x={ax(tick)} y={AXIS_Y + 15} textAnchor="middle" fontSize={10.5} fill="#64748b">
                  {tick}
                </text>
              </g>
            ))}
            <line x1={ax(safety)} x2={ax(safety)} y1={30} y2={AXIS_Y + 22} stroke="#d97706" strokeWidth={1.25} strokeDasharray="4 3" />
            <text x={ax(safety) - 4} y={24} textAnchor="end" fontSize={12} fontWeight={700} fill="#d97706">
              safety {safety}
            </text>
            <line x1={ax(FINAL_MIN)} x2={ax(FINAL_MIN)} y1={30} y2={AXIS_Y + 22} stroke="#2563eb" strokeWidth={1.25} />
            <text x={ax(FINAL_MIN) + 4} y={24} fontSize={12} fontWeight={700} fill="#2563eb">
              2/3 · {FINAL_MIN}
            </text>
            {scene.bits.map((bits, index) => {
              const passSafety = bits > safety;
              const passFinal = bits * 3 >= 2 * N;
              const y = AXIS_Y - 22 - index * 22;
              return (
                <g key={bits}>
                  <circle cx={ax(bits)} cy={y} r={5} fill={passFinal ? "#2563eb" : passSafety ? "#d97706" : "#64748b"} />
                  <text x={ax(bits) + (bits > 300 ? -9 : 9)} y={y + 4} textAnchor={bits > 300 ? "end" : "start"} fontSize={12} fontWeight={700} className="fill-foreground">
                    {bits}
                  </text>
                </g>
              );
            })}
            {scene.bits.length > 0 && (
              <g>
                <text x={AX_L} y={AXIS_Y + 40} fontSize={12} fill="#d97706" fontWeight={700}>
                  {scene.bits.length === 1
                    ? `optimistic 문턱: ${scene.bits[0]} ${scene.bits[0] > safety ? ">" : "≤"} ${safety} → ${scene.bits[0] > safety ? "넘음" : "못 넘음"}`
                    : `optimistic 문턱: 둘 다 ${safety} 넘음`}
                </text>
                {scene.bits.map((value, index) => (
                  <text key={value} x={AX_L} y={AXIS_Y + 56 + index * 15} fontSize={12} fill="#2563eb" fontWeight={700}>
                    {`2/3 문턱: ${value} × 3 = ${value * 3} ${value * 3 >= 2 * N ? "≥ 1024 충족" : "< 1024 미충족"}`}
                  </text>
                ))}
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
