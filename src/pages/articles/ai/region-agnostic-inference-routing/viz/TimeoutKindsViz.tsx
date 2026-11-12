import StackedSceneShell from "./StackedSceneShell";

/**
 * 본문 대응: commit-point 절의 "긴 응답은 중간의 로드밸런서에 먼저 끊깁니다" —
 * 유휴 제한은 마지막으로 무언가 흐른 때부터 재고, 전체 요청 제한은 요청 시작부터 잰다.
 * 시간 축 길이·제한 값·토큰 간격은 모양을 보이려는 가정이며 어떤 제품의 기본값도 아니다.
 */
const X0 = 96;
const X1 = 352;
const IDLE_LIMIT = 72;
const TOTAL_LIMIT_AT = 316;
const BAND = 24;

const range = (from: number, to: number, step: number) =>
  Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => from + i * step);

/** 장면마다 연결 위로 흐르는 것: 토큰과 주석. done은 응답이 정상으로 끝난 자리 */
interface StreamCase {
  tokens: readonly number[];
  pings: readonly number[];
  cut: number | null;
  done: number;
  cause: "idle" | "total" | null;
}
const GAPPED = [104, 116, 128, 140, 260, 272, 284, 296, 308];
const CASES: readonly StreamCase[] = [
  { tokens: GAPPED, pings: [], cut: 140 + IDLE_LIMIT, done: 308, cause: "idle" },
  { tokens: GAPPED, pings: [176, 212, 248], cut: null, done: 308, cause: null },
  { tokens: range(104, 344, 12), pings: [], cut: TOTAL_LIMIT_AT, done: 344, cause: "total" },
];

const SCENES = [
  {
    label: "토큰이 멈추면 유휴 타이머가 찹니다",
    summary: "유휴 제한에 닿아 끊김",
    note: "응답 중간에 토큰이 잠시 안 나오는 구간이 생기면, 마지막 출력 뒤로 흐른 시간이 유휴 제한에 닿는 순간 중간의 로드밸런서가 연결을 끊습니다. 뒤의 토큰은 클라이언트에 닿지 못합니다.",
  },
  {
    label: "주석을 보내면 유휴 타이머가 되돌아갑니다",
    summary: "SSE 주석으로 유휴 제한 회피",
    note: "게이트웨이가 유휴 구간에 SSE 주석(':'로 시작해 클라이언트가 내용으로 읽지 않는 줄)을 주기적으로 보내면, 연결 위로 무언가 계속 흐르므로 유휴 타이머가 매번 0으로 돌아갑니다.",
  },
  {
    label: "전체 시간 제한은 토큰이 계속 나와도 찹니다",
    summary: "주석으로는 못 막음",
    note: "요청 전체 시간에 상한을 두는 종류의 제한은 요청 시작부터 잽니다. 토큰이 쉬지 않고 나와도 상한에 닿으면 끊기므로, 쓰는 로드밸런서가 어느 종류인지 먼저 확인해야 합니다.",
  },
];

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";
const INK = "#64748b";

/** 유휴 타이머: 마지막 이벤트 이후 흐른 시간. 이벤트마다 0으로 돌아가는 톱니 */
function idlePath(events: readonly number[], end: number, base: number) {
  const sorted = [...events].sort((a, b) => a - b);
  const segments = sorted.map((ev, i) => {
    const next = Math.min(i + 1 < sorted.length ? sorted[i + 1] : end, end);
    const h = Math.min((next - ev) / IDLE_LIMIT, 1) * BAND;
    return `M${ev},${base} L${next},${base - h}`;
  });
  return segments.join(" ");
}

export default function TimeoutKindsViz() {
  return (
    <StackedSceneShell
      eyebrow="유휴 제한과 전체 요청 제한"
      title="주석은 유휴 타이머만 되돌립니다"
      description="가로축은 한 응답이 흐르는 시간입니다. 유휴 타이머는 연결 위로 마지막으로 무언가 흐른 때부터, 전체 시간 타이머는 요청이 시작된 때부터 잽니다."
      note="축 길이·제한 위치·토큰 간격은 모양을 보이려는 가정입니다. 이 글은 특정 로드밸런서 제품의 기본값을 싣지 않습니다."
      ariaLabel="토큰과 주석에 따라 유휴 타이머와 전체 시간 타이머가 차는 모양"
      scenes={SCENES}
      render={(s) => {
        const c = CASES[s];
        const end = c.cut ?? c.done;
        const visibleTokens = c.tokens.filter((t) => t <= end);
        const lostTokens = c.tokens.filter((t) => t > end);
        const events = [X0, ...visibleTokens, ...c.pings];
        const idleBase = 98;
        const totalBase = 136;
        const totalEnd = Math.min(end, TOTAL_LIMIT_AT);
        return (
          <svg viewBox="0 0 360 180" className="mx-auto h-auto w-full max-w-[500px]" role="img" aria-label={`${SCENES[s].label}: ${SCENES[s].summary}`}>
            <text x={6} y={46} fontSize={10.5} fontWeight={700} fill={INK}>연결 위 출력</text>
            <line x1={X0} y1={50} x2={X1} y2={50} stroke={MUTED} strokeWidth={0.75} />
            {visibleTokens.map((t) => (
              <line key={`t${t}`} x1={t} y1={34} x2={t} y2={50} stroke={ACCENT} strokeWidth={1.25} />
            ))}
            {lostTokens.map((t) => (
              <line key={`l${t}`} x1={t} y1={34} x2={t} y2={50} stroke={MUTED} strokeWidth={1} strokeOpacity={0.4} />
            ))}
            {c.pings.map((p) => (
              <g key={`p${p}`}>
                <line x1={p} y1={40} x2={p} y2={50} stroke={OK} strokeWidth={1.25} strokeDasharray="2 2" />
              </g>
            ))}
            <line x1={X0} y1={9} x2={X0} y2={19} stroke={ACCENT} strokeWidth={1.25} />
            <text x={X0 + 5} y={18} fontSize={10} fill={ACCENT}>토큰</text>
            <line x1={X0 + 44} y1={9} x2={X0 + 44} y2={19} stroke={OK} strokeWidth={1.25} strokeDasharray="2 2" />
            <text x={X0 + 49} y={18} fontSize={10} fill={OK}>주석</text>
            {c.cut === null && (
              <text x={c.done + 4} y={46} fontSize={10} fontWeight={700} fill={OK}>완료</text>
            )}

            <text x={6} y={idleBase - 6} fontSize={10.5} fontWeight={700} fill={c.cause === "idle" ? WARN : INK}>유휴 타이머</text>
            <line x1={X0} y1={idleBase - BAND} x2={X1} y2={idleBase - BAND} stroke={WARN} strokeWidth={0.75} strokeDasharray="4 3" opacity={0.7} />
            <line x1={X0} y1={idleBase} x2={X1} y2={idleBase} stroke={MUTED} strokeWidth={0.75} />
            <text x={X1} y={idleBase - BAND - 3} textAnchor="end" fontSize={10} fill={WARN}>제한</text>
            <path d={idlePath(events, end, idleBase)} fill="none" stroke={c.cause === "idle" ? WARN : ACCENT} strokeWidth={1.25} />

            <text x={6} y={totalBase - 6} fontSize={10.5} fontWeight={700} fill={c.cause === "total" ? WARN : INK}>전체 시간</text>
            <line x1={X0} y1={totalBase - BAND} x2={X1} y2={totalBase - BAND} stroke={WARN} strokeWidth={0.75} strokeDasharray="4 3" opacity={0.7} />
            <line x1={X0} y1={totalBase} x2={X1} y2={totalBase} stroke={MUTED} strokeWidth={0.75} />
            <line
              x1={X0}
              y1={totalBase}
              x2={totalEnd}
              y2={totalBase - ((totalEnd - X0) / (TOTAL_LIMIT_AT - X0)) * BAND}
              stroke={c.cause === "total" ? WARN : ACCENT}
              strokeWidth={1.25}
            />
            <text x={X1} y={totalBase - BAND - 3} textAnchor="end" fontSize={10} fill={WARN}>제한</text>

            {c.cut !== null && (
              <>
                <line x1={c.cut} y1={26} x2={c.cut} y2={totalBase + 4} stroke={WARN} strokeWidth={1.25} />
                <text x={c.cut} y={totalBase + 18} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={WARN}>끊김</text>
              </>
            )}
            <text x={6} y={174} fontSize={10.5} fontWeight={700} fill={c.cut === null ? OK : WARN}>
              {s === 0
                ? "토큰이 없는 사이 유휴 타이머가 제한에 닿습니다"
                : s === 1
                  ? "주석마다 유휴 타이머가 0으로 돌아갑니다"
                  : "토큰이 계속 나와도 전체 시간이 제한에 닿습니다"}
            </text>
          </svg>
        );
      }}
    />
  );
}
