import SceneShell from "./SceneShell";

/**
 * 본문 대응: #per-request-decision 의 "판정 지점이 새 단일 지점 아닙니까" — 두 단일 지점이 멈췄을 때의 실패 방향.
 * 시간축에는 눈금이 없습니다. 이 글은 세션 유지 시간이나 자격 증명 수명의 값을 정하지 않으므로
 * 막대 길이는 순서만 보이는 예시입니다(가정). 글이 말하는 것은 "판정 지점 쪽이 더 빨리 전부 닫힌다"는 순서뿐입니다.
 */
const W = 360;
const H = 176;
const X0 = 70;
const X1 = 350;
const STOP_X = 190;
const LANE_A = 44;
const LANE_B = 124;

/** 사설망 세션: 접속 시점부터 이어짐. 멈춘 뒤에도 끝나는 시점을 이 글이 정하지 않으므로 오른쪽 끝까지 열어 둡니다. */
const SESSIONS = [
  { start: 82, dy: -12 },
  { start: 120, dy: 0 },
  { start: 160, dy: 12 },
] as const;
/** 짧은 자격 증명: 같은 길이로 반복 갱신(가정). 멈춘 뒤에는 새 발급이 없습니다. */
const CRED_LEN = 46;
const CREDS = [
  { start: 74, dy: -12 },
  { start: 120, dy: -12 },
  { start: 166, dy: -12 },
  { start: 96, dy: 0 },
  { start: 142, dy: 0 },
  { start: 188, dy: 0 },
  { start: 118, dy: 12 },
  { start: 164, dy: 12 },
] as const;
const LAST_CRED_END = Math.max(...CREDS.filter((c) => c.start < STOP_X).map((c) => c.start + CRED_LEN));

const SCENES = [
  {
    label: "평소",
    summary: "두 구조 모두 새 접근이 들어옴",
    note: "사설망은 한 번 접속하면 세션이 이어지고, 요청별 판정 구조는 짧은 수명의 자격 증명을 계속 갱신받습니다.",
  },
  {
    label: "단일 지점이 멈춘 순간",
    summary: "양쪽 모두 새 접근 차단",
    note: "사설망 접속 장치가 멈춰도, 판정 지점이 멈춰도 새로 들어오는 사람은 없습니다. 이 점에서는 두 구조가 같은 성격의 단일 지점을 가집니다.",
  },
  {
    label: "시간이 조금 지난 뒤",
    summary: "판정 지점 쪽이 먼저 전부 닫힘",
    note: "사설망은 이미 맺은 세션이 한동안 살아 있어 안에서 계속 움직일 수 있습니다. 판정 지점 쪽은 새 판정이 없으니 남은 자격 증명이 만료되는 대로 닫힙니다. 그래서 판정 지점의 중복 구성과 감지 시간은 가용성 항목으로 관리됩니다.",
  },
] as const;

export default function FailDirectionViz() {
  return (
    <SceneShell
      eyebrow="실패 방향"
      title="같은 단일 지점이라도 멈춘 뒤 닫히는 방향이 다릅니다"
      description="위 줄은 사설망 게이트웨이에 이미 맺은 세션, 아래 줄은 요청마다 판정하는 지점이 발급한 짧은 수명의 자격 증명입니다. 빨간 구간은 지점이 멈춘 뒤에도 살아 있는 세션입니다. 시간축에는 눈금이 없고 막대 길이는 순서만 보이는 예시입니다(가정)."
      ariaLabel="사설망 게이트웨이와 판정 지점이 멈췄을 때 기존 세션과 자격 증명이 닫히는 순서 비교"
      scenes={SCENES}
      render={(active) => {
        const stopped = active >= 1;
        const later = active >= 2;
        const cutX = stopped ? STOP_X : X1;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={8} y={LANE_A - 4} fontSize={12} fontWeight={700} fill="#64748b">사설망</text>
            <text x={8} y={LANE_A + 11} fontSize={12} fontWeight={700} fill="#64748b">게이트웨이</text>
            <text x={8} y={LANE_B - 2} fontSize={12} fontWeight={700} fill="#64748b">요청별</text>
            <text x={8} y={LANE_B + 11} fontSize={12} fontWeight={700} fill="#64748b">판정 지점</text>

            {SESSIONS.map((s) => {
              const visibleEnd = later ? X1 : stopped ? STOP_X + 40 : STOP_X;
              return (
                <g key={s.start}>
                  <rect x={s.start} width={Math.min(visibleEnd, STOP_X) - s.start} y={LANE_A + s.dy - 2.5} height={5} rx={2} fill="#64748b" />
                  {stopped && (
                    <rect x={STOP_X} width={visibleEnd - STOP_X} y={LANE_A + s.dy - 2.5} height={5} rx={2} fill="#dc2626" fillOpacity={0.55} />
                  )}
                </g>
              );
            })}

            {CREDS.map((c) => {
              const issued = c.start < cutX;
              if (!issued) return null;
              const end = c.start + CRED_LEN;
              const shownEnd = later ? end : stopped ? Math.min(end, STOP_X + 18) : Math.min(end, STOP_X);
              return (
                <rect key={`${c.start}-${c.dy}`} x={c.start + 1} width={shownEnd - c.start - 2} y={LANE_B + c.dy - 2.5} height={5} rx={1} fill="#2563eb" />
              );
            })}

            {stopped && (
              <g>
                <line x1={STOP_X} x2={STOP_X} y1={14} y2={H - 26} stroke="#dc2626" strokeWidth={1.25} />
                <text x={STOP_X} y={10} textAnchor="middle" fontSize={10} fontWeight={700} fill="#dc2626">지점이 멈춤</text>
                <text x={STOP_X + 4} y={LANE_A - 20} fontSize={11} fill="#b91c1c">새 접속 ✕</text>
                <text x={STOP_X + 4} y={LANE_B - 20} fontSize={11} fill="#b91c1c">새 판정·갱신 ✕</text>
              </g>
            )}
            {later && (
              <g>
                <text x={X1} y={LANE_A + 28} textAnchor="end" fontSize={11} fontWeight={700} fill="#b91c1c">기존 세션이 한동안 유지 →</text>
                <line x1={LAST_CRED_END} x2={LAST_CRED_END} y1={LANE_B - 18} y2={LANE_B + 18} stroke="#2563eb" strokeWidth={1} strokeDasharray="3 3" />
                <text x={LAST_CRED_END + 4} y={LANE_B + 28} fontSize={11} fontWeight={700} fill="#1d4ed8">전부 닫힘</text>
              </g>
            )}

            <line x1={X0} x2={X1} y1={H - 18} y2={H - 18} stroke="#94a3b8" strokeWidth={1} />
            <text x={X1} y={H - 5} textAnchor="end" fontSize={11} fill="#64748b">시간 → (눈금 없음)</text>
          </svg>
        );
      }}
    />
  );
}
