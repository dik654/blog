import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 고정 지급은 할인만, 3개월 기준금리 지급은 예상 곡선이 금액을 정하고
 * 담보 이자(SOFR 같은 익일금리)에 맞는 곡선이 오늘값으로 바꾼다. 한쪽만 바꾸면 가격·헤지 민감도가 뒤섞인다.
 * 왼쪽 세로 줄 = 한 지급이 오늘값이 되는 순서, 오른쪽 칸 = 그 단계에 쓰는 곡선. 숫자는 그리지 않는다.
 */
const W = 360;
const H = 232;
const MAIN_X = 16;
const MAIN_W = 160;
const SIDE_X = 204;
const SIDE_W = 140;
const BOX_H = 46;
const ROW_Y = [12, 88, 164] as const;
const CURVE_Y = [50, 126] as const;

type Tone = "on" | "off" | "warn";

const SCENES = [
  {
    label: "고정 지급",
    summary: "금액이 정해짐 → 할인만",
    note: "고정 지급은 금액이 계약에 정해져 있어 예상할 것이 없습니다. 할인 곡선이 미래 금액을 오늘값으로 바꾸는 일만 합니다. 할인계수는 미래 1원을 오늘 얼마로 보는지입니다.",
    rows: ["5 · 105, 계약에 고정", "그대로 5 · 105", "할인계수 × 금액"],
    curves: [{ title: "예상 곡선", body: "쓰지 않음", tone: "off" }, { title: "할인 곡선", body: "미래 금액 → 오늘값", tone: "on" }],
    footer: "곡선 하나로 충분",
    warn: false,
  },
  {
    label: "3개월 기준금리 지급",
    summary: "예상 곡선이 금액을 정함",
    note: "변동금리 지급은 앞으로 관측될 기준금리에 달려 있어 금액을 먼저 예상해야 합니다. 3개월 기준금리 지급이라면 그 지급을 예상하는 별도 곡선을 만들고, 할인 곡선과 함께 사용합니다.",
    rows: ["3개월 금리 → 아직 모름", "예상한 지급 금액", "할인계수 × 예상 금액"],
    curves: [{ title: "예상 곡선", body: "3개월 기준금리용", tone: "on" }, { title: "할인 곡선", body: "미래 금액 → 오늘값", tone: "on" }],
    footer: "한 거래에 곡선 두 개",
    warn: false,
  },
  {
    label: "담보 이자에 맞춰 할인",
    summary: "SOFR 담보 → SOFR 같은 익일금리 곡선",
    note: "담보 현금에 SOFR 같은 익일금리가 붙는 달러 스왑은 그 담보 이자에 맞는 곡선으로 할인합니다. 두 곡선의 차이(베이시스)는 은행 신용, 기간 자금과 유동성 조건을 반영할 수 있습니다.",
    rows: ["3개월 금리 → 아직 모름", "예상한 지급 금액", "담보 곡선으로 할인"],
    curves: [{ title: "예상 곡선", body: "3개월 기준금리용", tone: "on" }, { title: "할인 곡선", body: "담보 익일금리에 맞춤", tone: "on" }],
    footer: "곡선 차이 = 베이시스",
    warn: false,
  },
  {
    label: "한쪽만 바꾸면",
    summary: "가격·헤지 민감도가 뒤섞임",
    note: "할인 곡선만 바꾸고 예상 지급은 그대로 두거나, 반대로 예상 곡선만 바꾸면 가격과 헤지 민감도가 뒤섞입니다. 그래서 두 곡선을 짝으로 함께 사용합니다.",
    rows: ["3개월 금리 → 아직 모름", "옛 곡선의 예상 금액", "새 할인 × 옛 예상"],
    curves: [{ title: "예상 곡선", body: "그대로 둠", tone: "warn" }, { title: "할인 곡선", body: "새 곡선으로 바꿈", tone: "on" }],
    footer: "반대로 해도 같은 문제",
    warn: true,
  },
] as const;

const TONE: Record<Tone, { stroke: string; fill: string; text: string; dash?: string }> = {
  on: { stroke: "#2563eb", fill: "#2563eb14", text: "#2563eb" },
  off: { stroke: "#94a3b8", fill: "none", text: "#94a3b8", dash: "4 3" },
  warn: { stroke: "#dc2626", fill: "#dc262612", text: "#dc2626", dash: "4 3" },
};

const ROW_TITLES = ["미래 지급", "지급 금액", "오늘값"] as const;

export default function TwoCurveViz() {
  return (
    <SceneShell
      eyebrow="다중곡선"
      title="한 지급이 오늘값이 되기까지 곡선 두 개가 따로 일합니다"
      description="왼쪽은 미래 지급 하나가 오늘값이 되는 순서, 오른쪽은 그 단계에서 쓰는 곡선입니다. 예상 곡선은 미래 기준금리 지급 금액을, 할인 곡선은 그 금액의 오늘값을 정합니다."
      ariaLabel="고정 지급, 3개월 기준금리 지급, 담보 이자 할인, 한쪽 곡선만 바꾼 경우에 예상 곡선과 할인 곡선이 맡는 일"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <defs>
              <marker id="tc-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <path d="M0 0L7 3.5L0 7Z" fill="#94a3b8" />
              </marker>
            </defs>
            {ROW_Y.map((y, index) => {
              const bad = scene.warn && index === 2;
              return (
                <g key={ROW_TITLES[index]}>
                  <rect x={MAIN_X} y={y} width={MAIN_W} height={BOX_H} rx={9} fill={bad ? "#dc262612" : "none"} stroke={bad ? "#dc2626" : "#64748b"} strokeWidth={1} />
                  <text x={MAIN_X + 12} y={y + 18} fontSize={11} fontWeight={700} fill={bad ? "#dc2626" : "#475569"}>{ROW_TITLES[index]}</text>
                  <text x={MAIN_X + 12} y={y + 35} fontSize={10.5} fill="currentColor">{scene.rows[index]}</text>
                </g>
              );
            })}
            {CURVE_Y.map((y, index) => {
              const curve = scene.curves[index];
              const tone = TONE[curve.tone];
              const midY = ROW_Y[index] + BOX_H + (ROW_Y[index + 1] - ROW_Y[index] - BOX_H) / 2;
              return (
                <g key={curve.title}>
                  <line x1={MAIN_X + 40} x2={MAIN_X + 40} y1={ROW_Y[index] + BOX_H} y2={ROW_Y[index + 1] - 2} stroke="#94a3b8" strokeWidth={1} markerEnd="url(#tc-arrow)" />
                  <line x1={MAIN_X + 40} x2={SIDE_X} y1={midY} y2={midY} stroke={tone.stroke} strokeWidth={1} strokeDasharray={tone.dash} />
                  <rect x={SIDE_X} y={y} width={SIDE_W} height={BOX_H} rx={9} fill={tone.fill} stroke={tone.stroke} strokeWidth={curve.tone === "off" ? 1 : 1.25} strokeDasharray={tone.dash} />
                  <text x={SIDE_X + 12} y={y + 18} fontSize={11} fontWeight={700} fill={tone.text}>{curve.title}</text>
                  <text x={SIDE_X + 12} y={y + 35} fontSize={10.5} fill={curve.tone === "off" ? "#94a3b8" : "currentColor"}>{curve.body}</text>
                </g>
              );
            })}
            <text x={SIDE_X + SIDE_W / 2} y={ROW_Y[2] + 28} textAnchor="middle" fontSize={11} fontWeight={700} fill={scene.warn ? "#dc2626" : "#475569"}>{scene.footer}</text>
          </svg>
        );
      }}
    />
  );
}
