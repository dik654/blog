import SceneShell from "./SceneShell";

/**
 * 본문 대응: #small-case 둘째 문단, #source-availability — 기준 시각 2026-04-16 10:00 UTC(가정).
 * 값 X: 09:00 측정, 10:05 도착 → 10:00 예측에 못 씀. 값 Y: 09:55 도착 → 후보 입력.
 * 축: 08:50~10:15, 1분 = 300/85 px.
 */
const X0 = 30;
const X1 = 330;
const START = 8 * 60 + 50;
const END = 10 * 60 + 15;
const AXIS_Y = 112;
const px = (minutes: number) => X0 + ((minutes - START) / (END - START)) * (X1 - X0);
const CUT = px(10 * 60);

const BLUE = "#2563eb";
const RED = "#dc2626";
const GRAY = "#64748b";
const GREEN = "#16a34a";

const TICKS = [
  { m: 9 * 60, label: "09:00" },
  { m: 9 * 60 + 30, label: "09:30" },
  { m: 10 * 60, label: "10:00" },
] as const;

const SCENES = [
  { label: "기준 시각", summary: "10:00 UTC에 예측", note: "예측을 내는 기준 시각은 4월 16일 10:00입니다(가정). 이 순간까지 시스템에 도착한 정보만 입력이 될 수 있습니다." },
  { label: "값 X의 측정", summary: "09:00 측정", note: "값 X는 09:00에 측정됐습니다. 측정 시각만 보면 기준 시각보다 한 시간 앞서므로 쓸 수 있는 값처럼 보입니다." },
  { label: "도착 시각으로 거르기", summary: "X 10:05 도착 → 제외 · Y 09:55 → 후보", note: "X는 10:05에 도착해 10:00 예측 시점에는 조회할 수 없습니다. 09:55에 도착한 Y는 다른 사용 조건도 통과했다면 후보 입력이 됩니다." },
  { label: "나중에 완성된 표", summary: "표에는 X·Y 둘 다 · 당시 후보는 Y만", note: "나중에 완성된 표에는 두 값이 모두 있습니다. 그래도 10:00 예측의 입력은 그때 도착해 있던 값으로 다시 만들어야 합니다. 그래서 측정 시각과 도착 시각을 함께 남깁니다." },
] as const;

function Axis() {
  return (
    <g>
      <rect x={X0} y={44} width={CUT - X0} height={AXIS_Y - 44} fill={BLUE} fillOpacity={0.06} />
      <rect x={CUT} y={44} width={X1 - CUT} height={AXIS_Y - 44} fill={RED} fillOpacity={0.06} />
      <line x1={X0} x2={X1} y1={AXIS_Y} y2={AXIS_Y} stroke={GRAY} strokeWidth={1} />
      {TICKS.map((tick) => (
        <g key={tick.label}>
          <line x1={px(tick.m)} x2={px(tick.m)} y1={AXIS_Y} y2={AXIS_Y + 5} stroke={GRAY} strokeWidth={1} />
          <text x={px(tick.m)} y={AXIS_Y + 18} textAnchor="middle" fontSize={10} fill={GRAY}>{tick.label}</text>
        </g>
      ))}
      <line x1={CUT} x2={CUT} y1={30} y2={AXIS_Y + 5} stroke={BLUE} strokeWidth={1.25} />
      <text x={CUT} y={24} textAnchor="middle" fontSize={11} fontWeight={700} fill={BLUE}>기준 시각</text>
      <text x={X0 + 6} y={58} fontSize={10} fill={BLUE}>여기까지 도착 → 입력 가능</text>
      <text x={X1 - 4} y={58} textAnchor="end" fontSize={10} fill={RED}>늦게 도착</text>
      <text x={X0} y={AXIS_Y + 34} fontSize={10} fill={GRAY}>2026-04-16 (UTC) · 가정</text>
    </g>
  );
}

function Mark({ minutes, y, label, color, shape, side }: { minutes: number; y: number; label: string; color: string; shape: "diamond" | "dot" | "cross"; side: "left" | "right" }) {
  const x = px(minutes);
  return (
    <g>
      <line x1={x} x2={x} y1={y + 6} y2={AXIS_Y} stroke={color} strokeWidth={1} strokeDasharray="2 2" />
      {shape === "diamond" && <path d={`M${x} ${y - 6} L${x + 6} ${y} L${x} ${y + 6} L${x - 6} ${y} Z`} fill={color} />}
      {shape === "dot" && <circle cx={x} cy={y} r={5} fill={color} />}
      {shape === "cross" && <path d={`M${x - 5} ${y - 5} L${x + 5} ${y + 5} M${x + 5} ${y - 5} L${x - 5} ${y + 5}`} stroke={color} strokeWidth={1.25} />}
      <text x={x + (side === "left" ? -9 : 9)} y={y + 4} textAnchor={side === "left" ? "end" : "start"} fontSize={10} fontWeight={700} fill={color}>{label}</text>
    </g>
  );
}

function SnapshotTables() {
  const rows = [
    { title: "나중에 완성된 표", x: "있음", y: "있음", xColor: GRAY },
    { title: "10:00 당시 입력", x: "없음 (10:05 도착)", y: "후보 (09:55 도착)", xColor: RED },
  ] as const;
  return (
    <g>
      {rows.map((row, index) => {
        const left = 20 + index * 166;
        return (
          <g key={row.title}>
            <rect x={left} y={44} width={154} height={96} rx={6} fill="none" stroke={index === 1 ? BLUE : GRAY} strokeWidth={index === 1 ? 1.25 : 1} />
            <text x={left + 10} y={64} fontSize={11} fontWeight={700} fill={index === 1 ? BLUE : GRAY}>{row.title}</text>
            <line x1={left + 10} x2={left + 144} y1={74} y2={74} stroke={GRAY} strokeWidth={1} strokeOpacity={0.4} />
            <text x={left + 10} y={96} fontSize={11} fill={GRAY}>값 X</text>
            <text x={left + 46} y={96} fontSize={11} fontWeight={700} fill={row.xColor}>{row.x}</text>
            <text x={left + 10} y={122} fontSize={11} fill={GRAY}>값 Y</text>
            <text x={left + 46} y={122} fontSize={11} fontWeight={700} fill={GREEN}>{row.y}</text>
          </g>
        );
      })}
      <text x={20} y={170} fontSize={10} fill={GRAY}>같은 방문 행인데 언제 읽느냐에 따라 입력이 다릅니다</text>
    </g>
  );
}

export default function InputArrivalViz() {
  return (
    <SceneShell
      eyebrow="측정 시각과 도착 시각"
      title="09:00에 잰 값이 10:00 예측에 못 들어가는 이유"
      description="가로축은 4월 16일 08:50~10:15입니다. 마름모는 측정, 점은 기준 시각 전 도착, ✕는 기준 시각 뒤 도착을 뜻합니다. 계산용 사례이며 실제 의료 결과가 아닙니다(가정)."
      ariaLabel="기준 시각 10시 전후로 두 입력 값의 측정과 도착 시각 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 190" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active < 3 && <Axis />}
          {active >= 1 && active < 3 && <Mark minutes={9 * 60} y={84} label="X 측정" color={GRAY} shape="diamond" side="right" />}
          {active === 2 && (
            <>
              <Mark minutes={10 * 60 + 5} y={96} label="X 도착" color={RED} shape="cross" side="right" />
              <text x={20} y={166} fontSize={10} fontWeight={700} fill={RED}>X: 09:00 측정 · 10:05 도착 → 이 예측에서 제외</text>
              <Mark minutes={9 * 60 + 55} y={72} label="Y 도착" color={GREEN} shape="dot" side="left" />
              <text x={20} y={182} fontSize={10} fontWeight={700} fill={GREEN}>Y: 09:55 도착 → 다른 조건도 통과하면 후보</text>
            </>
          )}
          {active === 3 && <SnapshotTables />}
        </svg>
      )}
    />
  );
}
