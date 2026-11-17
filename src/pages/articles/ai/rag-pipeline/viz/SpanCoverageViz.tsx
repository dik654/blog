import SceneShell from "./SceneShell";

/**
 * 본문 대응: #chunking의 span coverage 식 — 정답 근거 100자 중 prompt에 남은 80자 → 0.8.
 * 막대 위치는 설명용 가정: 정답 근거 0~100, chunk a −40~50, chunk b 30~80.
 * a가 덮는 정답 50자 + b가 덮는 정답 50자 = 100(겹친 20자 이중 계산), 합집합 0~80 = 80.
 */
const ANSWER = [0, 100] as const;
const CHUNK_A = [-40, 50] as const;
const CHUNK_B = [30, 80] as const;
const OVERLAP = [Math.max(CHUNK_A[0], CHUNK_B[0]), Math.min(CHUNK_A[1], CHUNK_B[1])] as const;
const UNION_IN_ANSWER = [ANSWER[0], Math.max(CHUNK_A[1], CHUNK_B[1])] as const;
const A_IN = Math.min(CHUNK_A[1], ANSWER[1]) - Math.max(CHUNK_A[0], ANSWER[0]);
const B_IN = Math.min(CHUNK_B[1], ANSWER[1]) - Math.max(CHUNK_B[0], ANSWER[0]);
const UNION_LEN = UNION_IN_ANSWER[1] - UNION_IN_ANSWER[0];
const ANSWER_LEN = ANSWER[1] - ANSWER[0];

const W = 360;
const H = 196;
const X0 = 56;
const X1 = 344;
const MIN = -45;
const MAX = 110;
const sx = (pos: number) => X0 + ((pos - MIN) / (MAX - MIN)) * (X1 - X0);

const ROW_ANSWER = 34;
const ROW_A = 74;
const ROW_B = 104;
const ROW_RESULT = 150;
const BAR_H = 16;

const SCENES = [
  { label: "정답 근거 100자", summary: `|A_q| = ${ANSWER_LEN}`, note: "정답 근거 span은 질문의 답을 뒷받침하는 원문 문자 구간입니다. 사람이 표시한 이 구간이 100자라고 둡니다. 막대의 위치는 설명용입니다(가정)." },
  { label: "prompt에 남은 chunk 두 개", summary: `a·b가 ${OVERLAP[1] - OVERLAP[0]}자 겹침`, note: "검색과 parent 복원을 거쳐 최종 prompt에 chunk a와 b가 남았습니다. 두 chunk는 정답 근거 안에서 20자가 겹칩니다(가정)." },
  { label: "그냥 더하면", summary: `${A_IN} + ${B_IN} = ${A_IN + B_IN} → 1.0 (틀림)`, note: "a가 덮는 정답 근거 50자와 b가 덮는 50자를 그대로 더하면 겹친 20자를 두 번 세어 100자가 됩니다. 실제로는 정답 근거의 마지막 20자가 prompt에 없습니다." },
  { label: "합집합으로 세면", summary: `${UNION_LEN} / ${ANSWER_LEN} = ${UNION_LEN / ANSWER_LEN}`, note: "두 구간을 먼저 합치면 0~80, 80자입니다. 정답 근거 100자로 나누면 0.8로 본문의 예와 같습니다. 이 값을 chunk 길이·overlap·parent 복원 방식별로 비교합니다." },
] as const;

function Bar({ range, y, fill, opacity = 1, dashed = false }: { range: readonly [number, number]; y: number; fill: string; opacity?: number; dashed?: boolean }) {
  return (
    <rect
      x={sx(range[0])}
      y={y}
      width={sx(range[1]) - sx(range[0])}
      height={BAR_H}
      rx={3}
      fill={dashed ? "none" : fill}
      fillOpacity={opacity}
      stroke={fill}
      strokeWidth={1}
      strokeDasharray={dashed ? "3 3" : undefined}
    />
  );
}

export default function SpanCoverageViz() {
  return (
    <SceneShell
      eyebrow="Span coverage"
      title="겹친 chunk를 더하면 빠진 근거가 가려집니다"
      description="가로축은 원문의 문자 위치입니다. 파란 막대가 정답 근거 span, 회색 막대가 최종 prompt에 남은 chunk입니다. 수치는 본문의 100자·80자 예를 쓰고 위치는 설명용입니다(가정)."
      ariaLabel="정답 근거 100자와 겹치는 chunk 두 개로 span coverage를 계산하는 네 단계"
      scenes={SCENES}
      render={(active) => {
        const showChunks = active >= 1;
        const showOverlap = active >= 1;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {[0, 30, 50, 80, 100].map((tick) => (
              <g key={tick}>
                <line x1={sx(tick)} x2={sx(tick)} y1={22} y2={ROW_RESULT + BAR_H + 4} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="2 3" />
                <text x={sx(tick)} y={H - 6} textAnchor="middle" fontSize={10} fill="#64748b">{tick}</text>
              </g>
            ))}
            <text x={6} y={ROW_ANSWER + 12} fontSize={10} fontWeight={700} fill="#2563eb">정답 근거</text>
            <Bar range={ANSWER} y={ROW_ANSWER} fill="#2563eb" opacity={0.18} />
            <text x={sx(50)} y={ROW_ANSWER - 6} textAnchor="middle" fontSize={10} fill="#2563eb">100자</text>

            <text x={6} y={ROW_A + 12} fontSize={10} fontWeight={700} fill={showChunks ? "#475569" : "#cbd5e1"}>chunk a</text>
            <text x={6} y={ROW_B + 12} fontSize={10} fontWeight={700} fill={showChunks ? "#475569" : "#cbd5e1"}>chunk b</text>
            <Bar range={CHUNK_A} y={ROW_A} fill={showChunks ? "#64748b" : "#e2e8f0"} opacity={showChunks ? 0.35 : 0.4} dashed={!showChunks} />
            <Bar range={CHUNK_B} y={ROW_B} fill={showChunks ? "#64748b" : "#e2e8f0"} opacity={showChunks ? 0.35 : 0.4} dashed={!showChunks} />
            {showOverlap && (
              <>
                <rect x={sx(OVERLAP[0])} y={ROW_A} width={sx(OVERLAP[1]) - sx(OVERLAP[0])} height={BAR_H} fill="#d97706" fillOpacity={0.55} />
                <rect x={sx(OVERLAP[0])} y={ROW_B} width={sx(OVERLAP[1]) - sx(OVERLAP[0])} height={BAR_H} fill="#d97706" fillOpacity={0.55} />
                <text x={sx((OVERLAP[0] + OVERLAP[1]) / 2)} y={ROW_B + BAR_H + 12} textAnchor="middle" fontSize={9} fill="#b45309">겹침 20</text>
              </>
            )}

            <text x={6} y={ROW_RESULT + 12} fontSize={10} fontWeight={700} fill={active >= 2 ? "#64748b" : "#cbd5e1"}>{active === 3 ? "합집합" : "단순 합"}</text>
            {active === 2 && (
              <>
                <rect x={sx(0)} y={ROW_RESULT} width={sx(A_IN) - sx(0)} height={BAR_H} fill="#64748b" fillOpacity={0.45} stroke="#64748b" strokeWidth={1} />
                <rect x={sx(A_IN)} y={ROW_RESULT} width={sx(A_IN + B_IN) - sx(A_IN)} height={BAR_H} fill="#94a3b8" fillOpacity={0.45} stroke="#64748b" strokeWidth={1} />
                <text x={sx(A_IN / 2)} y={ROW_RESULT + 12} textAnchor="middle" fontSize={10} fill="#64748b">a 50</text>
                <text x={sx(A_IN + B_IN / 2)} y={ROW_RESULT + 12} textAnchor="middle" fontSize={10} fill="#64748b">b 50</text>
              </>
            )}
            {active === 3 && (
              <>
                <Bar range={UNION_IN_ANSWER} y={ROW_RESULT} fill="#16a34a" opacity={0.3} />
                <Bar range={[UNION_IN_ANSWER[1], ANSWER[1]]} y={ROW_RESULT} fill="#dc2626" dashed />
                <text x={sx(40)} y={ROW_RESULT + 12} textAnchor="middle" fontSize={10} fontWeight={700} fill="#15803d">80자</text>
                <text x={sx(90)} y={ROW_RESULT + 12} textAnchor="middle" fontSize={9} fill="#b91c1c">빠짐 20</text>
              </>
            )}
            {active < 2 && <rect x={sx(0)} y={ROW_RESULT} width={sx(100) - sx(0)} height={BAR_H} rx={3} fill="none" stroke="#e2e8f0" strokeWidth={1} strokeDasharray="3 3" />}
          </svg>
        );
      }}
    />
  );
}
