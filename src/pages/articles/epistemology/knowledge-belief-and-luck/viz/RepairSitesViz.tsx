import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 세 접근 모두 고장 난 표시와 사실의 우연한 만남을 문제 삼지만
 * 신뢰성은 과정, 안전성은 가까운 경우, 덕 인식론은 사람을 본다. 같은 12시 사례 지도 위에 표시한다.
 */
const SCENES = [
  { label: "공통으로 문제 삼는 곳", summary: "표시와 사실의 우연한 만남", focus: "luck", note: "민아의 믿음과 실제 시각은 같은 숫자에 닿았지만 서로 연결되어 있지 않습니다. 세 접근 모두 이 점을 문제 삼습니다." },
  { label: "신뢰성", summary: "과정이 대체로 참을 내는가", focus: "process", note: "믿음을 만든 과정을 봅니다. 정상 시계 과정의 신뢰도가 필요한 정보입니다." },
  { label: "안전성", summary: "가까운 경우에도 맞는가", focus: "near", note: "11시 59분 같은 가까운 경우로 옮겨 봅니다. 같은 방식의 믿음이 그곳에서 쉽게 거짓이 되는지를 확인합니다." },
  { label: "덕 인식론", summary: "능력·성품 때문에 맞혔는가", focus: "person", note: "사람을 봅니다. 민아의 확인 습관과 능력이 필요한 정보입니다." },
] as const;

const W = 340;
const H = 216;
const BOX_W = 96;
const BOX_H = 56;
const ACCENT = "#2563eb";
const LUCK = "#d97706";
const FAINT = "#94a3b8";
const INK = "#64748b";

const COLS = [4, 122, 240];
const ROW1 = 8;
const ROW2 = 142;

function Box({ x, y, lines, color, strong }: { x: number; y: number; lines: readonly string[]; color: string; strong?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={BOX_W} height={BOX_H} rx={8} fill={strong ? color : "none"} fillOpacity={strong ? 0.1 : undefined} stroke={color} strokeWidth={strong ? 1.25 : 1} />
      {lines.map((line, index) => (
        <text key={line} x={x + BOX_W / 2} y={y + BOX_H / 2 + 5 + (index - (lines.length - 1) / 2) * 18} textAnchor="middle" fontSize={15} fontWeight={strong ? 700 : 600} fill={color}>{line}</text>
      ))}
    </g>
  );
}

export default function RepairSitesViz() {
  return (
    <SceneShell
      eyebrow="세 접근의 초점"
      title="같은 12시 사례에서 세 접근이 들여다보는 칸이 다릅니다"
      description="위 줄은 사람에서 믿음까지 이어진 길이고 아래 칸은 가까운 경우와 실제 시각입니다. 진하게 칠한 칸이 그 접근이 묻는 곳입니다."
      ariaLabel="멈춘 시계 사례에서 신뢰성, 안전성, 덕 인식론이 각각 묻는 위치를 표시하는 지도"
      scenes={SCENES}
      render={(active) => {
        const { focus } = SCENES[active];
        const tone = (name: string) => (focus === name ? ACCENT : INK);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Box x={COLS[0]} y={ROW1} lines={["민아", "습관·능력"]} color={tone("person")} strong={focus === "person"} />
            <Box x={COLS[1]} y={ROW1} lines={["시계를 보는", "과정"]} color={tone("process")} strong={focus === "process"} />
            <Box x={COLS[2]} y={ROW1} lines={["믿음", "“12시다”"]} color={focus === "luck" ? LUCK : INK} strong={focus === "luck"} />
            <path d={`M${COLS[1] - 1} ${ROW1 + BOX_H / 2} l-7 -4 v8 z`} fill={FAINT} />
            <line x1={COLS[0] + BOX_W} x2={COLS[1] - 7} y1={ROW1 + BOX_H / 2} y2={ROW1 + BOX_H / 2} stroke={FAINT} strokeWidth={1} />
            <path d={`M${COLS[2] - 1} ${ROW1 + BOX_H / 2} l-7 -4 v8 z`} fill={FAINT} />
            <line x1={COLS[1] + BOX_W} x2={COLS[2] - 7} y1={ROW1 + BOX_H / 2} y2={ROW1 + BOX_H / 2} stroke={FAINT} strokeWidth={1} />

            <Box x={COLS[1]} y={ROW2} lines={["가까운 경우", "11:59"]} color={tone("near")} strong={focus === "near"} />
            <line x1={COLS[1] + BOX_W / 2} x2={COLS[1] + BOX_W / 2} y1={ROW1 + BOX_H + 1} y2={ROW2 - 1} stroke={focus === "near" ? ACCENT : FAINT} strokeWidth={1} strokeDasharray="3 3" />

            <Box x={COLS[2]} y={ROW2} lines={["실제 시각", "12:00"]} color={focus === "luck" ? LUCK : INK} strong={focus === "luck"} />
            <line x1={COLS[2] + BOX_W / 2} x2={COLS[2] + BOX_W / 2} y1={ROW1 + BOX_H + 1} y2={ROW2 - 1} stroke={focus === "luck" ? LUCK : FAINT} strokeWidth={focus === "luck" ? 1.25 : 1} strokeDasharray="3 3" />
            {focus === "luck" && <text x={COLS[2] + BOX_W / 2 - 7} y={(ROW1 + BOX_H + ROW2) / 2 + 5} textAnchor="end" fontSize={15} fontWeight={700} fill={LUCK}>우연히 같음</text>}
          </svg>
        );
      }}
    />
  );
}
