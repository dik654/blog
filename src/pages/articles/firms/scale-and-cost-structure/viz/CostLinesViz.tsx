import SceneShell from "./SceneShell";

/**
 * 본문 대응: #minimum-market·#all-methods — 세 비용선이 만나는 수량과 가장 낮은 선을 그린다.
 * A=10N, B=60+4N, C=300+N, C′=75+N (모두 본문의 가정). 네·다섯 번째 장면은 가로축 0~20개 확대.
 */
type LineId = "A" | "B" | "C" | "C′";

const LINES: Record<LineId, { setup: number; unit: number; color: string }> = {
  A: { setup: 0, unit: 10, color: "#64748b" },
  B: { setup: 60, unit: 4, color: "#2563eb" },
  C: { setup: 300, unit: 1, color: "#d97706" },
  "C′": { setup: 75, unit: 1, color: "#16a34a" },
};

interface Mark { n: number; c: number; text: string; dx: number; dy: number; anchor: "start" | "end" }
interface Band { from: number; to: number; text: string }

const SCENES: ReadonlyArray<{
  label: string;
  summary: string;
  note: string;
  xMax: number;
  yMax: number;
  lines: readonly LineId[];
  faint: readonly LineId[];
  /** 가장 낮은 선 구간 [시작 수량, 끝 수량, 방법] */
  envelope: ReadonlyArray<readonly [number, number, LineId]>;
  marks: readonly Mark[];
  bands: readonly Band[];
}> = [
  {
    label: "A와 B는 10개에서 만난다",
    summary: "60 ÷ 6 = 10",
    note: "A는 10 × 수량, B는 60 + 4 × 수량입니다. B는 처음 60을 더 쓰고 부품마다 6을 아끼므로 두 선은 10개(비용 100)에서 만납니다. 10개보다 많으면 B 선이 A 선 아래에 있습니다.",
    xMax: 100, yMax: 500, lines: ["A", "B"], faint: [], envelope: [],
    marks: [{ n: 10, c: 100, text: "10개 · 100", dx: 6, dy: 16, anchor: "start" }], bands: [],
  },
  {
    label: "B와 C는 80개에서 만난다",
    summary: "240 ÷ 3 = 80",
    note: "C는 B보다 처음 300 − 60 = 240을 더 쓰고 부품마다 3을 아낍니다. 두 선은 80개(비용 380)에서 만나고 81개부터 C가 B보다 쌉니다. C의 300은 별도 대안의 금액이라 B의 60에 더하지 않습니다.",
    xMax: 100, yMax: 500, lines: ["B", "C"], faint: ["A"], envelope: [],
    marks: [{ n: 80, c: 380, text: "80개 · 380", dx: 4, dy: 22, anchor: "start" }], bands: [],
  },
  {
    label: "세 선 중 가장 낮은 선",
    summary: "A → B → C",
    note: "진한 부분이 각 수량에서 가장 낮은 비용입니다. 10개 미만은 A, 10개 초과 80개 미만은 B, 80개 초과는 C이고 10개와 80개에서는 두 방법이 동률입니다. A 선은 50개(500)에서 그림 위로 나갑니다.",
    xMax: 100, yMax: 500, lines: [], faint: ["A", "B", "C"],
    envelope: [[0, 10, "A"], [10, 80, "B"], [80, 100, "C"]],
    marks: [
      { n: 10, c: 100, text: "10", dx: 6, dy: 16, anchor: "start" },
      { n: 80, c: 380, text: "80", dx: 4, dy: 22, anchor: "start" },
    ],
    bands: [],
  },
  {
    label: "C′를 넣고 0~20개를 확대",
    summary: "75 ÷ 9 ≈ 8.33",
    note: "(가정) C′는 준비 비용 75, 하나당 1인 별도 대안입니다. 가로축을 0~20개로 바꿨습니다. A와 C′는 약 8.33개에서 만나고, 가장 낮은 선은 A에서 B를 거치지 않고 바로 C′로 넘어갑니다. C(300)는 하나당 비용이 같고 준비 비용이 225 커서 어느 수량에서도 C′보다 비싸므로 그리지 않았습니다.",
    xMax: 20, yMax: 200, lines: [], faint: ["A", "B", "C′"],
    envelope: [[0, 75 / 9, "A"], [75 / 9, 20, "C′"]],
    marks: [
      { n: 75 / 9, c: 75 + 75 / 9, text: "A=C′ 약 8.33개", dx: 6, dy: 16, anchor: "start" },
      { n: 10, c: 100, text: "A=B 10개", dx: -6, dy: -8, anchor: "end" },
    ],
    bands: [],
  },
  {
    label: "B가 가장 낮은 수량은 없다",
    summary: "10개 이상 ∩ 5개 이하 = 없음",
    note: "B가 A보다 비싸지 않으려면 10개 이상, C′보다 비싸지 않으려면 5개 이하여야 합니다. 두 구간이 겹치지 않으므로 B 선은 한 번도 가장 아래에 오지 않습니다. 9개에서는 A 90, B 96, C′ 84이므로 C′를 고릅니다.",
    xMax: 20, yMax: 200, lines: ["A", "B", "C′"], faint: [], envelope: [],
    marks: [
      { n: 5, c: 80, text: "B=C′ 5개", dx: -6, dy: -8, anchor: "end" },
      { n: 9, c: 84, text: "9개: C′ 84", dx: 6, dy: 16, anchor: "start" },
      { n: 9, c: 96, text: "B 96", dx: 6, dy: -4, anchor: "start" },
      { n: 9, c: 90, text: "A 90", dx: -6, dy: 4, anchor: "end" },
    ],
    bands: [
      { from: 0, to: 5, text: "B ≤ C′" },
      { from: 10, to: 20, text: "B ≤ A" },
    ],
  },
];

const W = 360;
const H = 236;
const L = 44;
const R = 334;
const T = 16;
const B = 196;

function Chart({ index }: { index: number }) {
  const s = SCENES[index];
  const x = (n: number) => L + (n / s.xMax) * (R - L);
  const y = (c: number) => B - (c / s.yMax) * (B - T);
  /** 그림 위쪽(yMax)을 넘으면 그 수량에서 선을 끊습니다. */
  const segment = (id: LineId, from: number, to: number) => {
    const line = LINES[id];
    const cap = Math.min(to, (s.yMax - line.setup) / line.unit);
    return { x1: x(from), y1: y(line.setup + line.unit * from), x2: x(cap), y2: y(line.setup + line.unit * cap) };
  };
  const xTicks = Array.from({ length: 6 }, (_, k) => (s.xMax / 5) * k);
  const yTicks = Array.from({ length: 6 }, (_, k) => (s.yMax / 5) * k);
  const shown: readonly LineId[] = [...s.lines, ...s.faint];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full max-w-[30rem]" role="img" aria-label={`${s.label}: 주문 수량에 따른 전체 비용 선`}>
      {s.bands.map((band) => (
        <g key={band.text}>
          <rect x={x(band.from)} y={T} width={x(band.to) - x(band.from)} height={B - T} fill="#2563eb" fillOpacity={0.08} />
          <text x={(x(band.from) + x(band.to)) / 2} y={T + 12} textAnchor="middle" fontSize={10} fontWeight={700} fill="#2563eb">{band.text}</text>
        </g>
      ))}
      {yTicks.map((c) => (
        <g key={`y${c}`}>
          <line x1={L} x2={R} y1={y(c)} y2={y(c)} stroke="#94a3b8" strokeOpacity={0.25} strokeWidth={1} />
          <text x={L - 5} y={y(c) + 3.5} textAnchor="end" fontSize={9} fill="#64748b">{c}</text>
        </g>
      ))}
      {xTicks.map((n) => (
        <text key={`x${n}`} x={x(n)} y={B + 13} textAnchor="middle" fontSize={9} fill="#64748b">{n}</text>
      ))}
      <line x1={L} x2={R} y1={B} y2={B} stroke="#94a3b8" strokeWidth={1} />
      <text x={R} y={B + 28} textAnchor="end" fontSize={9} fill="#64748b">주문 수량(개)</text>
      <text x={4} y={T - 4} fontSize={9} fill="#64748b">전체 비용</text>
      {shown.map((id) => {
        const seg = segment(id, 0, s.xMax);
        const faint = s.faint.includes(id);
        return (
          <g key={id}>
            <line {...seg} stroke={LINES[id].color} strokeWidth={1} strokeOpacity={faint ? 0.35 : 1} />
            <text x={Math.min(seg.x2 + 4, W - 10)} y={seg.y2 + (seg.y2 < T + 8 ? 9 : 3)} fontSize={11} fontWeight={700} fill={LINES[id].color}>{id}</text>
          </g>
        );
      })}
      {s.envelope.map(([from, to, id]) => {
        const seg = segment(id, from, to);
        return <line key={`e${id}`} {...seg} stroke={LINES[id].color} strokeWidth={1.25} />;
      })}
      {s.marks.map((m) => (
        <g key={m.text}>
          <circle cx={x(m.n)} cy={y(m.c)} r={3.5} fill="#0f172a" stroke="#ffffff" strokeWidth={1} />
          <text x={x(m.n) + m.dx} y={y(m.c) + m.dy} textAnchor={m.anchor} fontSize={10} fontWeight={700} fill="#64748b">{m.text}</text>
        </g>
      ))}
    </svg>
  );
}

export default function CostLinesViz() {
  return (
    <SceneShell
      eyebrow="비용선과 동률 수량"
      title="수량이 늘 때 가장 낮은 비용선이 바뀌는 자리"
      description="가로는 주문 수량, 세로는 그 수량의 전체 비용(같은 화폐 단위의 가정)입니다. 선이 낮을수록 쌉니다. 두 선이 만나는 수량이 비용 동률 수량입니다. 정수 수량 사이를 선으로 이었습니다."
      note="(가정) 준비 비용과 하나당 비용은 본문의 설명용 숫자이며, 정한 범위 안에서 생산 여력이 충분하고 준비 비용은 아직 쓰지 않았다고 둡니다."
      ariaLabel="A, B, C, C′ 비용선의 교차와 가장 낮은 선"
      scenes={SCENES}
      render={(index) => <Chart index={index} />}
    />
  );
}
