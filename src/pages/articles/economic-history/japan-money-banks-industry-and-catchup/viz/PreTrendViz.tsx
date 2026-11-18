import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 1947년 1월 우선 생산 정책 시작 뒤 석탄 생산이 늘었지만 정책 전부터 이미 늘고 있었다(오카자키).
 * 그래서 정책이 없었을 때의 길(비교 대상, 5절·9절)을 알아야 효과를 말할 수 있다.
 * 글에는 생산량 수치가 없다. 선의 높이·기울기와 두 가정 경로는 논리를 보이려는 모양일 뿐이다.
 */
const ACTUAL = "#2563eb";
const ALT_A = "#16a34a";
const ALT_B = "#d97706";
const MUTED = "#94a3b8";

const X0 = 24;
const XP = 176;
const X1 = 336;
const Y_START = 156;
const Y_POLICY = 116;
const Y_END = 52;
const SLOPE = (Y_START - Y_POLICY) / (XP - X0);
const Y_TREND = Y_POLICY - SLOPE * (X1 - XP);

const SCENES = [
  { label: "정책 뒤만 보면", summary: "시작 뒤 석탄 생산이 늘었다", note: "1947년 1월 정책을 시작한 뒤 석탄 생산이 늘었습니다. 이 구간만 보면 정책이 생산을 늘린 것처럼 읽힙니다." },
  { label: "정책 전도 함께 보면", summary: "이미 늘고 있었다", note: "오카자키는 석탄 생산이 정책 전부터 이미 늘고 있었다고 씁니다. 늘어난 양 전체를 정책의 몫으로 셀 수 없습니다." },
  { label: "정책이 없었다면?", summary: "효과 = 실제 − 없었을 때의 길", note: "하던 대로 늘었다면(가정 A) 정책의 몫은 작고, 거기서 멈췄다면(가정 B) 큽니다. 정책 뒤 기울기가 꺾여 올라간 모양도 가정이라, 추세가 원래 그만큼 가팔랐다면 몫은 0일 수도 있습니다. 실제로는 정책이 없었던 길을 볼 수 없으니, 효과를 말하려면 비교 대상과 장기 비용이 필요합니다." },
] as const;

export default function PreTrendViz() {
  return (
    <SceneShell
      eyebrow="정책 효과 읽기"
      title="정책 뒤에 늘었다는 사실만으로는 정책 덕분인지 모릅니다"
      description="가로축은 시간, 세로축은 석탄 생산입니다. 글에 생산량 수치가 없어 선의 높이와 기울기는 모양만 보인 가정입니다."
      ariaLabel="우선 생산 정책 시작 전후의 석탄 생산 추세와 정책이 없었을 때의 두 가정 경로"
      scenes={SCENES}
      render={(active) => {
        const showPre = active >= 1;
        const showAlt = active === 2;
        return (
          <svg viewBox="0 0 360 234" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={X0} x2={X1} y1={176} y2={176} stroke={MUTED} strokeWidth={1} />
            <line x1={X0} x2={X0} y1={20} y2={176} stroke={MUTED} strokeWidth={1} />
            <text x={X0 + 4} y={16} fontSize={11} fill="currentColor" opacity={0.75}>석탄 생산 (수치 없음)</text>
            <text x={X1} y={196} textAnchor="end" fontSize={11} fill="currentColor" opacity={0.75}>시간 →</text>

            <line x1={XP} x2={XP} y1={28} y2={176} stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />
            <text x={XP} y={194} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="currentColor">1947년 1월 정책 시작</text>
            <text x={(X0 + XP) / 2} y={170} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.7}>정책 전</text>
            <text x={(XP + X1) / 2} y={170} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.7}>정책 뒤</text>

            <line x1={X0} y1={Y_START} x2={XP} y2={Y_POLICY} stroke={showPre ? ACTUAL : MUTED} strokeWidth={showPre ? 1.25 : 1} strokeDasharray={showPre ? undefined : "2 4"} opacity={showPre ? 1 : 0.6} />
            {!showPre && <text x={(X0 + XP) / 2} y={124} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.6}>아직 보지 않음</text>}
            <line x1={XP} y1={Y_POLICY} x2={X1} y2={Y_END} stroke={ACTUAL} strokeWidth={1.25} />
            <circle cx={X1} cy={Y_END} r={3} fill={ACTUAL} />
            <text x={X1 - 4} y={Y_END - 8} textAnchor="end" fontSize={11.5} fontWeight={700} fill={ACTUAL}>실제</text>

            <g opacity={showAlt ? 1 : 0}>
              <line x1={XP} y1={Y_POLICY} x2={X1} y2={Y_TREND} stroke={ALT_A} strokeWidth={1.25} strokeDasharray="5 3" />
              <line x1={XP} y1={Y_POLICY} x2={X1} y2={Y_POLICY} stroke={ALT_B} strokeWidth={1.25} strokeDasharray="5 3" />
              <line x1={X1 + 8} x2={X1 + 8} y1={Y_END} y2={Y_TREND} stroke={ALT_A} strokeWidth={1} />
              <line x1={X1 + 16} x2={X1 + 16} y1={Y_END} y2={Y_POLICY} stroke={ALT_B} strokeWidth={1} />
              <line x1={X0} x2={X0 + 18} y1={222} y2={222} stroke={ALT_A} strokeWidth={1.25} strokeDasharray="5 3" />
              <text x={X0 + 23} y={226} fontSize={11} fontWeight={700} fill={ALT_A}>가정 A: 하던 대로 늘었다면</text>
              <line x1={190} x2={208} y1={222} y2={222} stroke={ALT_B} strokeWidth={1.25} strokeDasharray="5 3" />
              <text x={213} y={226} fontSize={11} fontWeight={700} fill={ALT_B}>가정 B: 거기서 멈췄다면</text>
            </g>
          </svg>
        );
      }}
    />
  );
}
