import SceneShell from "./SceneShell";

/**
 * 본문 대응: #why-complete, #target — 기준 시각 c = 04-16 10:00 UTC, horizon h = 24시간(가정).
 * 목표 구간 (c, c+h]: 시작 제외, 끝 포함. 04-17 08:00까지만 보면 2시간 남아 미확정,
 * 04-17 09:00 사건은 구간 안 → y = 1. 위 축 = 전체 24시간, 아래 축 = 04-17 07:00~10:30 확대.
 */
const TX0 = 40;
const TX1 = 320;
const TOP_Y = 56;
const tx = (hours: number) => TX0 + (hours / 24) * (TX1 - TX0);

const ZX0 = 40;
const ZX1 = 320;
const ZOOM_Y = 132;
const Z_START = 7;
const Z_END = 10.5;
const zx = (clock: number) => ZX0 + ((clock - Z_START) / (Z_END - Z_START)) * (ZX1 - ZX0);

const BLUE = "#2563eb";
const RED = "#dc2626";
const GRAY = "#64748b";
const GREEN = "#16a34a";
const AMBER = "#d97706";

const SCENES = [
  { label: "목표 구간", summary: "(04-16 10:00, 04-17 10:00]", note: "기준 시각 뒤 24시간을 봅니다. 둥근 괄호 (는 그 시각을 빼고 대괄호 ]는 그 시각을 넣는다는 표기입니다. 빈 원은 제외, 채운 원은 포함입니다. 이 끝점 규칙은 7절에서 고른 가정입니다." },
  { label: "08:00까지 관찰", summary: "2시간 남음 → 미확정", note: "다음 날 08:00까지만 봤다면 목표 구간은 아직 2시간 남았습니다. 사건을 못 봤다고 곧바로 0(음성)을 붙이면 09:00에 생길 사건을 놓칩니다." },
  { label: "09:00 사건", summary: "구간 안 → y = 1", note: "다음 날 09:00 사건은 구간 안에 있으므로 정답은 1입니다. 그 정답을 학습에 쓸 수 있게 되는 시각은 보고 도착에 달려 있어 따로 확인합니다." },
  { label: "끝점에 걸린 사건", summary: "시작 10:00 제외 · 끝 10:00 포함", note: "정확히 04-16 10:00의 사건은 시작점의 사건이라 이 미래 정답에 넣지 않습니다. 정확히 04-17 10:00의 사건은 넣습니다." },
] as const;

const OBSERVED_UNTIL = [null, 8, 9, null] as const;
const STATUS = [
  { text: "정답 y는 이 구간 안 사건 유무로 정함", color: GRAY },
  { text: "정답: 미확정 (0으로 쓰지 않음)", color: AMBER },
  { text: "정답: y = 1", color: GREEN },
  { text: "시작점 사건 ✕ · 09:00 사건 ✓ · 끝점 사건 ✓", color: BLUE },
] as const;

function Endpoint({ x, y, closed }: { x: number; y: number; closed: boolean }) {
  return <circle cx={x} cy={y} r={4.5} fill={closed ? BLUE : "#ffffff"} stroke={BLUE} strokeWidth={1.25} />;
}

function Event({ x, y, color, label, above }: { x: number; y: number; color: string; label: string; above: boolean }) {
  return (
    <g>
      <path d={`M${x} ${y - 7} L${x + 6} ${y} L${x} ${y + 7} L${x - 6} ${y} Z`} fill={color} />
      <text x={x} y={above ? y - 12 : y + 20} textAnchor="middle" fontSize={10} fontWeight={700} fill={color}>{label}</text>
    </g>
  );
}

export default function TargetWindowViz() {
  return (
    <SceneShell
      eyebrow="정답 구간"
      title="어느 사건이 24시간 정답에 들어가는가"
      description="위 축은 4월 16일 10:00부터 24시간 전체(UTC), 아래 축은 그중 4월 17일 07:00~10:30을 확대한 것입니다. 마름모가 사건입니다. 계산용 사례입니다(가정)."
      ariaLabel="기준 시각 뒤 24시간 목표 구간과 관찰 진행, 끝점 규칙"
      scenes={SCENES}
      render={(active) => {
        const until = (OBSERVED_UNTIL as readonly (number | null)[])[active];
        const status = STATUS[active];
        return (
          <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {/* 위 축: 24시간 전체 */}
            <line x1={TX0 - 20} x2={TX1 + 20} y1={TOP_Y} y2={TOP_Y} stroke={GRAY} strokeWidth={1} />
            <rect x={TX0} y={TOP_Y - 6} width={TX1 - TX0} height={12} fill={BLUE} fillOpacity={0.1} />
            {until !== null && <rect x={TX0} y={TOP_Y - 6} width={tx(24 - (10 - until)) - TX0} height={12} fill={BLUE} fillOpacity={0.3} />}
            <Endpoint x={TX0} y={TOP_Y} closed={false} />
            <Endpoint x={TX1} y={TOP_Y} closed />
            <text x={TX0 - 8} y={TOP_Y + 20} fontSize={10} fill={GRAY}>04-16 10:00 제외</text>
            <text x={TX1 + 8} y={TOP_Y + 20} textAnchor="end" fontSize={10} fill={GRAY}>04-17 10:00 포함</text>
            {active === 3 && <Event x={TX0} y={TOP_Y - 18} color={RED} label="" above />}
            {active === 3 && <text x={TX0 + 10} y={TOP_Y - 14} fontSize={10} fontWeight={700} fill={RED}>정확히 시작 → 제외</text>}

            {/* 확대 구간 표시: 04-17 07:00~10:30 */}
            <path d={`M${tx(21)} ${TOP_Y - 12} V${TOP_Y - 18} H${tx(Z_END + 14)} V${TOP_Y - 12}`} fill="none" stroke={GRAY} strokeWidth={1} />
            <text x={tx(Z_END + 14)} y={TOP_Y - 24} textAnchor="end" fontSize={10} fill={GRAY}>아래 축으로 확대</text>

            {/* 아래 축: 04-17 07:00~10:30 */}
            <line x1={ZX0} x2={ZX1} y1={ZOOM_Y} y2={ZOOM_Y} stroke={GRAY} strokeWidth={1} />
            <rect x={ZX0} y={ZOOM_Y - 6} width={zx(10) - ZX0} height={12} fill={BLUE} fillOpacity={0.1} />
            {until !== null && <rect x={ZX0} y={ZOOM_Y - 6} width={zx(until) - ZX0} height={12} fill={BLUE} fillOpacity={0.3} />}
            {until === 8 && (
              <>
                <rect x={zx(8)} y={ZOOM_Y - 6} width={zx(10) - zx(8)} height={12} fill="none" stroke={AMBER} strokeWidth={1.25} strokeDasharray="3 2" />
                <text x={(zx(8) + zx(10)) / 2} y={ZOOM_Y - 12} textAnchor="middle" fontSize={10} fontWeight={700} fill={AMBER}>아직 못 본 2시간</text>
              </>
            )}
            {until !== null && <line x1={zx(until)} x2={zx(until)} y1={ZOOM_Y - 22} y2={ZOOM_Y + 8} stroke={BLUE} strokeWidth={1.25} />}
            {until !== null && <text x={zx(until) - 4} y={ZOOM_Y - 26} textAnchor="end" fontSize={10} fill={BLUE}>여기까지 관찰</text>}
            <Endpoint x={zx(10)} y={ZOOM_Y} closed />
            {[8, 9, 10].map((clock) => (
              <text key={clock} x={zx(clock)} y={ZOOM_Y + 34} textAnchor="middle" fontSize={10} fill={GRAY}>{`0${clock}:00`.slice(-5)}</text>
            ))}
            <text x={ZX0} y={ZOOM_Y + 34} fontSize={10} fill={GRAY}>04-17</text>
            <line x1={ZX0} x2={ZX1} y1={ZOOM_Y - 40} y2={ZOOM_Y - 40} stroke={GRAY} strokeWidth={1} strokeOpacity={0.3} />
            {active >= 2 && <Event x={zx(9)} y={ZOOM_Y} color={GREEN} label="" above={false} />}
            {active === 3 && <Event x={zx(10)} y={ZOOM_Y - 16} color={GREEN} label="정확히 끝 → 포함" above />}

            <text x={20} y={192} fontSize={11} fontWeight={700} fill={status.color}>{status.text}</text>
          </svg>
        );
      }}
    />
  );
}
