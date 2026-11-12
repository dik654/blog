import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism 셋째 문단 — 행사가격 100 풋을 8에 산 별도 사례, 그리고 100에 산 주식과 풋을 함께 보유.
 * 풋 만기 손익 = max(100 − S, 0) − 8 → 90: 10 − 8 = 2
 * 주식 손익 = S − 100 → 90: −10, 120: +20
 * 합계 = max(S, 100) − 108 → 100 이하 어디서나 −8, 108에서 0, 120에서 12
 */
type LineKey = "put" | "stock" | "total";

const W = 360;
const H = 214;
const L = 44;
const R = 344;
const TOP = 16;
const BOTTOM = 180;
const X_MIN = 60;
const X_MAX = 160;
const Y_MIN = -50;
const Y_MAX = 60;

const px = (price: number) => L + ((price - X_MIN) / (X_MAX - X_MIN)) * (R - L);
const py = (value: number) => TOP + ((Y_MAX - value) / (Y_MAX - Y_MIN)) * (BOTTOM - TOP);

const LINES: Record<LineKey, { name: string; points: readonly (readonly [number, number])[]; labelY: number }> = {
  put: { name: "풋만", points: [[60, 32], [100, -8], [160, -8]], labelY: py(32) - 8 },
  stock: { name: "주식만", points: [[60, -40], [160, 60]], labelY: py(-40) + 16 },
  total: { name: "주식 + 풋", points: [[60, -8], [100, -8], [160, 52]], labelY: py(-8) + 14 },
};

interface Mark {
  price: number;
  value: number;
  text: string;
  anchor: "start" | "end";
  dy: number;
}

const SCENES: readonly { label: string; summary: string; note: string; active: LineKey; marks: readonly Mark[] }[] = [
  {
    label: "풋만 산 경우",
    summary: "주가 90: 10 − 8 = +2",
    note: "풋은 정해진 가격에 팔 권리입니다. 주가 90이면 100에 팔 수 있어 행사 가치가 10이고, 처음 낸 8을 빼 순이익 2입니다. 주가가 100 이상이면 행사할 이유가 없어 8만 잃습니다.",
    active: "put",
    marks: [{ price: 90, value: 2, text: "90 → +2", anchor: "start", dy: -8 }],
  },
  {
    label: "100에 산 주식만",
    summary: "90: −10 · 120: +20",
    note: "100에 산 주식은 만기 주가만큼 그대로 움직입니다. 90이면 −10, 120이면 +20이고 주가가 내려갈수록 손실도 계속 커집니다.",
    active: "stock",
    marks: [
      { price: 90, value: -10, text: "90 → −10", anchor: "start", dy: 16 },
      { price: 120, value: 20, text: "120 → +20", anchor: "end", dy: -8 },
    ],
  },
  {
    label: "주식과 풋을 함께",
    summary: "100 이하 어디서나 −8",
    note: "총투입은 100 + 8 = 108입니다. 주가가 100 아래로 가도 풋으로 100에 팔 수 있어 만기 자산 가치는 최소 100이고, 순손실 바닥은 −8입니다. 90에서도 −10 + 2 = −8입니다.",
    active: "total",
    marks: [{ price: 90, value: -8, text: "90 → −10 + 2 = −8", anchor: "start", dy: 16 }],
  },
  {
    label: "주가가 오르면",
    summary: "120: 20 − 8 = +12",
    note: "100보다 오르면 풋은 행사하지 않고 주식 이익에서 8을 뺍니다. 120이면 20 − 8 = 12이고 108에서 손익이 0이 됩니다. 바닥을 산 값만큼 주식만 가진 경우보다 8씩 덜 법니다.",
    active: "total",
    marks: [
      { price: 108, value: 0, text: "108 → 0", anchor: "start", dy: 28 },
      { price: 120, value: 12, text: "120 → +12", anchor: "start", dy: 16 },
    ],
  },
];

const ORDER: readonly LineKey[] = ["stock", "put", "total"];

export default function ProtectivePutViz() {
  return (
    <SceneShell
      eyebrow="주식 + 풋"
      title="풋을 함께 사면 만기 손실에 −8의 바닥이 생깁니다"
      description="가로축은 만기 주가, 세로축은 한 단위의 만기 순손익입니다. 파란 실선이 지금 보는 선이고 회색 점선은 비교용입니다. 행사가격 100·프리미엄 8의 풋과 100에 산 주식은 7절의 별도 사례(가정)입니다."
      note="거래비용·세금·이자는 뺐고, 본문대로 실제 비용과 행사 방식은 따로 더해야 합니다. 만기 전 가격은 이 그림에 없습니다."
      ariaLabel="풋만, 주식만, 주식과 풋을 함께 보유할 때의 만기 손익 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {[-40, 0, 40].map((value) => (
              <g key={value}>
                <line x1={L} x2={R} y1={py(value)} y2={py(value)} stroke={value === 0 ? "#94a3b8" : "#e2e8f0"} strokeWidth={1} />
                <text x={L - 6} y={py(value) + 4} textAnchor="end" fontSize={10} fill="#64748b">{value > 0 ? `+${value}` : value < 0 ? `−${-value}` : "0"}</text>
              </g>
            ))}
            {[60, 80, 100, 120, 140, 160].map((price) => (
              <text key={price} x={px(price)} y={BOTTOM + 16} textAnchor="middle" fontSize={10} fill="#64748b">{price}</text>
            ))}
            <text x={R} y={BOTTOM + 30} textAnchor="end" fontSize={10} fill="#64748b">만기 주가</text>
            <line x1={px(100)} x2={px(100)} y1={TOP} y2={BOTTOM} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="2 3" />
            {ORDER.map((key) => {
              const line = LINES[key];
              const on = key === scene.active;
              return (
                <g key={key}>
                  <polyline
                    points={line.points.map(([x, y]) => `${px(x)},${py(y)}`).join(" ")}
                    fill="none"
                    stroke={on ? "#2563eb" : "#94a3b8"}
                    strokeWidth={on ? 1.25 : 1}
                    strokeDasharray={on ? undefined : "4 3"}
                  />
                  <text x={L + 4} y={line.labelY} fontSize={10} fontWeight={on ? 700 : 400} fill={on ? "#2563eb" : "#64748b"}>{on && key === "total" ? `${line.name} · 바닥 −8` : line.name}</text>
                </g>
              );
            })}
            {scene.marks.map((mark) => (
              <g key={`${mark.price}-${mark.value}`}>
                <circle cx={px(mark.price)} cy={py(mark.value)} r={3.5} fill="#2563eb" />
                <text
                  x={px(mark.price) + (mark.anchor === "start" ? 6 : -6)}
                  y={py(mark.value) + mark.dy}
                  textAnchor={mark.anchor}
                  fontSize={11}
                  fontWeight={700}
                  fill="#1e3a8a"
                >
                  {mark.text}
                </text>
              </g>
            ))}
          </svg>
        );
      }}
    />
  );
}
