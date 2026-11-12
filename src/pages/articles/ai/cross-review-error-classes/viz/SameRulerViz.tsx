import SceneShell from "./SceneShell";

/**
 * 본문 대응: #unit-mismatch — 한쪽만 가동률로 나눈 비교.
 * 숫자는 이 글의 ClaimTraceViz 초판 값: 소유 60% 가동 4.24, 임대 정가 4.60.
 * 초판: 4.60 / 4.24 ≈ 1.08 → 약 8%.
 * 같은 자: 유휴도 청구되는 임대를 같은 60%로 나누면 4.60 / 0.6 ≈ 7.67, 7.67 / 4.24 ≈ 1.81 → 약 81%.
 */
const UTIL = 0.6;
const OWN = 4.24;
const RENT_LIST = 4.6;
const RENT_USED = RENT_LIST / UTIL;
const GAP_FIRST = Math.round((RENT_LIST / OWN - 1) * 100);
const GAP_SAME = Math.round((RENT_USED / OWN - 1) * 100);

const SCENES = [
  {
    label: "가동률로 나눈다는 것",
    summary: "청구 10칸 중 6칸만 씀 (60%)",
    note: "청구되는 시간 10칸 가운데 6칸만 실제로 일했다고 둡니다(칸 수는 60%를 그리려는 가정). 10칸의 비용을 일한 6칸에만 나눠 실으면 일한 한 시간의 값은 시간당 금액을 0.6으로 나눈 만큼 커집니다.",
  },
  {
    label: "초판 · 한쪽만 나눔",
    summary: `4.24 vs 4.60 → 약 ${GAP_FIRST}%`,
    note: "소유 쪽 4.24는 이미 60% 가동률로 나눈 값입니다. 임대 쪽 4.60은 나누지 않은 정가입니다. 단위는 둘 다 시간당 금액이라 나란히 놓였고, 차이는 약 8%로 보였습니다.",
  },
  {
    label: "같은 자 · 둘 다 나눔",
    summary: `4.24 vs ${RENT_USED.toFixed(2)} → 약 ${GAP_SAME}%`,
    note: "유휴 시간도 청구되는 임대를 같은 60%로 나누면 4.60÷0.6≈7.67입니다. 7.67을 4.24와 견주면 약 81% 차이로, 이 절의 81%와 같은 값입니다. 계산은 두 번 다 맞았고 바뀐 것은 분모뿐입니다.",
  },
] as const;

const W = 360;
const OWN_C = "#2563eb";
const RENT_C = "#d97706";
const MUTED = "#94a3b8";
const INK = "#64748b";
const BAR_X = 96;
const BAR_MAX = 210;
const VAL_MAX = 8;
const bw = (v: number) => (v / VAL_MAX) * BAR_MAX;

export default function SameRulerViz() {
  return (
    <SceneShell
      eyebrow="분모를 소리 내어 읽기"
      title="같은 숫자도 무엇으로 나눴는지에 따라 차이가 8%에서 81%로 바뀝니다"
      description="가동률은 청구되는 시간 가운데 실제로 일한 시간의 비율입니다. 숫자는 이 글 뒤쪽 그림의 초판 표에 있던 값(소유 60% 가동 4.24, 임대 정가 4.60)이며, 막대는 시간당 금액입니다."
      note="한 표의 한 줄을 다시 계산한 것입니다. 임대 가운데 유휴 시간이 청구되지 않는 쪽은 이 계산에 넣지 않았습니다."
      ariaLabel="한쪽만 가동률로 나눈 비교와 둘 다 나눈 비교"
      scenes={SCENES}
      render={(active) => {
        const rentValue = active === 2 ? RENT_USED : RENT_LIST;
        return (
          <svg viewBox={`0 0 ${W} 200`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {active === 0 ? (
              <g>
                <text x={20} y={30} fontSize={12} fontWeight={700} fill={INK}>
                  청구되는 시간 10칸
                </text>
                {Array.from({ length: 10 }, (_, i) => {
                  const used = i < 6;
                  return (
                    <g key={i}>
                      <rect x={20 + i * 32} y={42} width={28} height={36} rx={3} fill={used ? OWN_C : MUTED} fillOpacity={used ? 0.85 : 0.15} stroke={used ? OWN_C : MUTED} strokeWidth={1} strokeDasharray={used ? undefined : "3 2"} />
                      <text x={34 + i * 32} y={64} textAnchor="middle" fontSize={10} fontWeight={700} fill={used ? "#ffffff" : INK}>
                        {used ? "일함" : "유휴"}
                      </text>
                    </g>
                  );
                })}
                <text x={20} y={108} fontSize={12.5} fontWeight={700} fill={OWN_C}>
                  일한 한 시간의 값 = 시간당 금액 ÷ 0.6
                </text>
                <text x={20} y={130} fontSize={11.5} fill={INK}>
                  유휴 4칸의 비용도 일한 6칸이 나눠 집니다
                </text>
                <text x={20} y={156} fontSize={11.5} fill={INK}>
                  비교할 두 값이 모두 이렇게 나눈 값인지가 문제입니다
                </text>
              </g>
            ) : (
              <g>
                {[
                  { name: "소유", sub: "÷ 60% 함", value: OWN, color: OWN_C },
                  { name: "임대", sub: active === 2 ? "÷ 60% 함" : "나누지 않음", value: rentValue, color: RENT_C },
                ].map((row, i) => {
                  const y = 30 + i * 52;
                  return (
                    <g key={row.name}>
                      <text x={20} y={y + 13} fontSize={13} fontWeight={700} fill={row.color}>
                        {row.name}
                      </text>
                      <text x={20} y={y + 27} fontSize={11} fill={INK}>
                        {row.sub}
                      </text>
                      <rect x={BAR_X} y={y} width={bw(row.value)} height={26} rx={2} fill={row.color} fillOpacity={0.85} />
                      <text x={BAR_X + bw(row.value) + 6} y={y + 17} fontSize={13} fontWeight={700} fill={row.color}>
                        {row.value.toFixed(2)}
                      </text>
                    </g>
                  );
                })}
                <line x1={BAR_X + bw(OWN)} x2={BAR_X + bw(OWN)} y1={24} y2={140} stroke={MUTED} strokeWidth={1} strokeDasharray="3 3" />
                <text x={20} y={168} fontSize={13} fontWeight={700} fill={active === 2 ? "#dc2626" : INK}>
                  차이 약 {active === 2 ? GAP_SAME : GAP_FIRST}%
                </text>
                <text x={20} y={189} fontSize={11.5} fill={INK}>
                  {active === 2 ? "같은 분모로 나누자 8%가 81%가 됐습니다" : "분모가 다른 두 값을 나란히 놓은 차이입니다"}
                </text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
