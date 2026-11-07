import SceneShell from "./SceneShell";

/**
 * 본문 대응: #why — 두 통과율의 분모 연결.
 * 1000 × e^(−0.1) ≈ 904.8. 904.8 × 0.98 ≈ 886.7. 틀린 곱 1000 × 0.98 = 980.
 */
const PX = 0.3;
const X0 = 8;

const SCENES = [
  { label: "첫 분모 1000", summary: "1000 × 90.48% ≈ 904.8", note: "모든 숫자는 가정입니다. 첫 판단의 분모는 후보 1000개이고 약 95.2개가 탈락할 것으로 기대합니다." },
  { label: "다음 분모 904.8", summary: "904.8 × 98% ≈ 886.7", note: "다음 비율은 앞 단계를 통과한 다이에 대한 값입니다. 조립·시험에 들어간 약 904.8개 가운데 약 18.1개가 더 탈락합니다." },
  { label: "분모를 잘못 잡으면", summary: "1000 × 98% = 980 ✕", note: "98%를 처음 1000개에 바로 곱하면 앞에서 탈락한 약 95.2개가 다시 들어옵니다. 그래서 980은 분모를 이은 출하 기대 개수 약 886.7개와 어긋납니다." },
] as const;

function Segment({ x, width, y, fill, opacity = 1, dashed = false }: { x: number; width: number; y: number; fill: string; opacity?: number; dashed?: boolean }) {
  return <rect x={x} y={y} width={width} height={24} fill={fill} fillOpacity={opacity} stroke={fill} strokeWidth={1} strokeDasharray={dashed ? "4 2" : undefined} />;
}

export default function DenominatorViz() {
  return (
    <SceneShell
      eyebrow="단계별 분모"
      title="98%는 1000개가 아니라 앞 단계 통과분에 곱합니다"
      description="막대 길이가 다이 개수입니다. 위가 결함 판단, 아래가 조립·시험이고 비율과 개수는 이 글의 설명용 가정입니다. 개수는 많은 반복의 평균인 기댓값입니다."
      ariaLabel="결함 판단과 조립 시험의 분모를 잇는 막대 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 340 146" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <text x={X0} y={16} fontSize={11} fontWeight={700} fill="currentColor">결함 판단 · 분모 1000</text>
          <Segment x={X0} width={904.8 * PX} y={22} fill="#2563eb" opacity={0.85} />
          <Segment x={X0 + 904.8 * PX} width={95.2 * PX} y={22} fill="#94a3b8" opacity={0.4} dashed />
          <text x={X0 + 6} y={38} fontSize={11} fontWeight={700} fill="#ffffff">약 904.8 통과</text>
          <text x={X0 + 1000 * PX} y={60} textAnchor="end" fontSize={11} fill="#64748b">약 95.2 탈락</text>
          {active >= 1 && (
            <g>
              <text x={X0} y={84} fontSize={11} fontWeight={700} fill="currentColor">{active === 1 ? "조립·시험 · 분모 약 904.8" : "잘못된 곱 · 분모 1000"}</text>
              {active === 1 ? (
                <g>
                  <Segment x={X0} width={886.7 * PX} y={90} fill="#16a34a" opacity={0.85} />
                  <Segment x={X0 + 886.7 * PX} width={18.1 * PX} y={90} fill="#94a3b8" opacity={0.4} dashed />
                  <text x={X0 + 6} y={106} fontSize={11} fontWeight={700} fill="#ffffff">약 886.7 출하 기대</text>
                  <text x={X0 + 904.8 * PX} y={128} textAnchor="end" fontSize={11} fill="#64748b">약 18.1 탈락</text>
                </g>
              ) : (
                <g>
                  <Segment x={X0} width={980 * PX} y={90} fill="#dc2626" opacity={0.2} dashed />
                  <text x={X0 + 6} y={106} fontSize={11} fontWeight={700} fill="#dc2626">980 ✕ 탈락분까지 다시 포함</text>
                  <line x1={X0 + 904.8 * PX} x2={X0 + 904.8 * PX} y1={66} y2={118} stroke="#dc2626" strokeWidth={1} strokeDasharray="3 3" />
                  <text x={X0 + 904.8 * PX} y={130} textAnchor="end" fontSize={11} fill="#dc2626">앞 단계 통과분은 여기까지</text>
                </g>
              )}
            </g>
          )}
        </svg>
      )}
    />
  );
}
