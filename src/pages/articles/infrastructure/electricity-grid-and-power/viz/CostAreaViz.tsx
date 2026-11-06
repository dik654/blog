import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 80 × 5만 = 400만, 20 × 10만 = 200만, 합계 600만.
 * 제약이 없으면 100 × 5만 = 500만. 차이 100만 = 20 × (10 − 5)만.
 * 마지막 장면의 다른 비용은 글이 금액을 주지 않으므로 칸 크기에 뜻이 없다.
 */
const X0 = 50;
const XS = 2.7;
const BASE = 190;
const YS = 14;
const FAR_END = X0 + 80 * XS;
const ALL_END = X0 + 100 * XS;
const y5 = BASE - 5 * YS;
const y10 = BASE - 10 * YS;

const OTHERS = ["망 유지", "운영", "고장 대비", "저장"];

const SCENES = [
  { label: "먼 곳에서 80", summary: "80 × 5만 = 400만 원", note: "가로가 MWh, 세로가 MWh당 단가입니다(가정). 두 값을 곱한 면적이 지급액입니다." },
  { label: "가까운 곳에서 20", summary: "400만 + 200만 = 600만 원", note: "공장 근처 대체 공급은 양이 적어도 단가가 10만 원이라 칸이 높습니다. 두 면적의 합이 이 한 시간의 에너지 조달비입니다." },
  { label: "길의 제약이 없었다면", summary: "600만 − 500만 = 100만 원", note: "100MWh를 모두 먼 곳에서 샀다면 점선 아래 500만 원입니다. 빨간 칸 100만 원이 추가 조달비입니다. 이것만으로 송전선 건설비를 회수할 수 있는지는 아직 모르며, 길이 한도에 막히는 연간 혼잡 시간과 공사비를 더 알아야 합니다." },
  { label: "600만 원은 청구서의 일부", summary: "다른 비용의 크기는 미정", note: "최종 전력 시스템 비용에는 망 유지, 운영, 고장 대비와 저장 비용도 들어갑니다. 점선 칸의 크기는 금액과 관계가 없습니다. 실제 도매시장의 단가 결정과 혼잡 비용 배분은 계약에 따라 달라집니다." },
];

export default function CostAreaViz() {
  return (
    <SceneShell
      eyebrow="에너지 조달비"
      title="양 × 단가의 면적으로 보는 600만 원과 100만 원"
      description="한 시간의 사례이며 단가는 가정입니다. 어느 나라의 실제 요금표도 아닙니다."
      ariaLabel="먼 발전 80과 가까운 발전 20의 조달비 면적과 제약이 없을 때의 차이"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 232" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active < 3 ? (
            <g>
              {[5, 10].map((tick) => (
                <text key={tick} x={X0 - 6} y={BASE - tick * YS + 4} textAnchor="end" fontSize={11} fill="#64748b">{tick}</text>
              ))}
              <text x={X0 - 6} y={BASE + 4} textAnchor="end" fontSize={11} fill="#64748b">0</text>
              <text x={8} y={22} fontSize={11} fill="#64748b">MWh당 단가(만 원)</text>
              <rect x={X0} y={y5} width={80 * XS} height={5 * YS} fill="#2563eb" fillOpacity={0.25} stroke="#2563eb" strokeWidth={1} />
              <text x={(X0 + FAR_END) / 2} y={y5 + 30} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">먼 곳 80 MWh × 5만 원</text>
              <text x={(X0 + FAR_END) / 2} y={y5 + 48} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2563eb">400만 원</text>
              {active >= 1 && (
                <>
                  <rect x={FAR_END} y={y10} width={20 * XS} height={10 * YS} fill="#d97706" fillOpacity={0.22} stroke="#d97706" strokeWidth={1} />
                  {active === 1 && <text x={ALL_END} y={y10 - 22} textAnchor="end" fontSize={12} fontWeight={700} fill="#b45309">근처 20 MWh × 10만 원</text>}
                  {active === 1 && <text x={ALL_END} y={y10 - 6} textAnchor="end" fontSize={13} fontWeight={700} fill="#b45309">200만 원</text>}
                </>
              )}
              {active === 2 && (
                <>
                  <rect x={FAR_END} y={y10} width={20 * XS} height={5 * YS} fill="#dc2626" fillOpacity={0.2} stroke="#dc2626" strokeWidth={1.25} />
                  <text x={(FAR_END + ALL_END) / 2} y={y10 + 40} textAnchor="middle" fontSize={12} fontWeight={700} fill="#dc2626">100만</text>
                  <text x={(FAR_END + ALL_END) / 2} y={y5 + 40} textAnchor="middle" fontSize={12} fontWeight={700} fill="#b45309">100만</text>
                  <line x1={X0} x2={ALL_END} y1={y5} y2={y5} stroke="#475569" strokeWidth={1.25} strokeDasharray="5 4" />
                  <text x={ALL_END} y={y10 - 22} textAnchor="end" fontSize={12} fontWeight={700} fill="#dc2626">20 MWh × (10 − 5)만 원</text>
                  <text x={X0} y={y5 - 8} fontSize={11} fontWeight={700} fill="currentColor">제약이 없으면 100 × 5만 = 500만</text>
                </>
              )}
              <line x1={X0} x2={ALL_END} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
              {[0, 80, 100].map((tick) => (
                <text key={tick} x={X0 + tick * XS} y={BASE + 16} textAnchor="middle" fontSize={11} fill="#64748b">{tick}</text>
              ))}
              <text x={(X0 + ALL_END) / 2} y={BASE + 32} textAnchor="middle" fontSize={11} fill="#64748b">MWh</text>
            </g>
          ) : (
            <g>
              <rect x={8} y={50} width={344} height={124} rx={8} fill="none" stroke="#64748b" strokeWidth={1} strokeDasharray="5 4" />
              <text x={180} y={40} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">최종 전력 시스템 비용 (전체 금액은 정하지 않음)</text>
              <rect x={18} y={72} width={76} height={84} rx={6} fill="#2563eb" fillOpacity={0.22} stroke="#2563eb" strokeWidth={1} />
              <text x={56} y={106} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">에너지 조달비</text>
              <text x={56} y={126} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2563eb">600만 원</text>
              {OTHERS.map((name, index) => (
                <g key={name}>
                  <rect x={102 + index * 61} y={72} width={55} height={84} rx={6} fill="none" stroke="#64748b" strokeWidth={1} strokeDasharray="4 3" />
                  <text x={129.5 + index * 61} y={110} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">{name}</text>
                  <text x={129.5 + index * 61} y={128} textAnchor="middle" fontSize={11} fill="#64748b">미정</text>
                </g>
              ))}
            </g>
          )}
        </svg>
      )}
    />
  );
}
