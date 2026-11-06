import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 롤오버 100톤. 가까운 계약 30만, 다음 계약 31만5000(가정).
 * 현물 30만 유지 + 수렴(가정) → 100 × (30만 − 31만5000) = −150만 원.
 */
const SCENES = [
  { label: "만기가 다른 두 가격", summary: "30만 < 31만5000원 (가정)", note: "만기 직전의 가까운 계약과 그다음 만기 계약에는 다른 가격이 붙습니다. 이처럼 먼 만기의 선물가격이 더 높은 곡선을 콘탱고, 더 낮은 곡선을 백워데이션이라고 부릅니다." },
  { label: "갈아타기", summary: "닫기 30만 · 새로 31만5000원", note: "가까운 100톤 계약을 닫고 다음 만기 100톤을 삽니다. 이것이 롤오버입니다. 31만5000원에 새로 맺는 순간 차액 1만5000원이 곧바로 확정 손실이 되는 것은 아닙니다." },
  { label: "현물은 제자리", summary: "새 선물 31만5000 → 30만 (가정)", note: "그다음 만기까지 현물이 30만 원에 머물고 새 선물도 그 가격에 수렴한다고 가정합니다. 손실을 만드는 것은 이 가정입니다. 중간 경로는 글에 없어 점선으로만 이었습니다." },
  { label: "계약 보유 손익", summary: "100 × (−1만5000) = −150만 원", note: "현물 가격이 제자리여도 계약 보유 손익은 음수입니다. 이 경로가 수익에 미치는 영향을 롤 수익이라고 합니다. 담보 현금의 이자와 보수까지 합해야 펀드 전체 성과가 됩니다." },
] as const;

const NOW = 96;
const END = 300;
const Y_NEAR = 122;
const Y_NEXT = 50;
const GRAY = "#64748b";
const BLUE = "#2563eb";
const RED = "#dc2626";

export default function RollCurveViz() {
  return (
    <SceneShell
      eyebrow="계약 교체"
      title="현물이 제자리여도 갈아탄 계약의 값이 내려오면 손익은 음수입니다"
      description="선물형 펀드가 밀 100톤 계약을 다음 만기로 바꾸는 경우입니다. 가격은 모두 글의 가정이며 톤당 원화입니다."
      ariaLabel="가까운 계약에서 먼 계약으로 교체한 뒤 수렴할 때의 손익"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 180" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <line x1={NOW} x2={NOW} y1={24} y2={150} stroke="#94a3b8" strokeWidth={1} strokeDasharray="1 3" />
          <line x1={END} x2={END} y1={24} y2={150} stroke="#94a3b8" strokeWidth={1} strokeDasharray="1 3" />
          <text x={NOW} y={168} textAnchor="middle" fontSize={11} fill={GRAY}>가까운 만기 직전</text>
          <text x={END} y={168} textAnchor="middle" fontSize={11} fill={GRAY}>그다음 만기</text>

          <text x={NOW - 8} y={Y_NEXT + 4} textAnchor="end" fontSize={12} fontWeight={700} fill={BLUE}>31만5000</text>
          <text x={NOW - 8} y={Y_NEAR + 4} textAnchor="end" fontSize={12} fontWeight={700} fill={GRAY}>30만</text>

          <line x1={NOW} x2={END} y1={Y_NEAR} y2={Y_NEAR} stroke={GRAY} strokeWidth={1.25} />
          <text x={(NOW + END) / 2} y={Y_NEAR + 16} textAnchor="middle" fontSize={11} fill={GRAY}>현물 30만 원(가정)</text>

          {active === 0 && (
            <>
              <line x1={NOW} x2={NOW} y1={Y_NEXT} y2={Y_NEAR} stroke={BLUE} strokeWidth={1} />
              <text x={NOW + 8} y={(Y_NEXT + Y_NEAR) / 2 + 4} fontSize={11} fill={BLUE}>차이 1만5000원</text>
            </>
          )}
          {active === 1 && (
            <>
              <line x1={NOW} x2={NOW} y1={Y_NEAR - 6} y2={Y_NEXT + 8} stroke={BLUE} strokeWidth={1.25} />
              <polygon points={`${NOW},${Y_NEXT + 4} ${NOW - 4},${Y_NEXT + 11} ${NOW + 4},${Y_NEXT + 11}`} fill={BLUE} />
              <text x={NOW + 8} y={(Y_NEXT + Y_NEAR) / 2 + 4} fontSize={11} fill={BLUE}>닫고 새로 매수</text>
            </>
          )}
          {active >= 2 && <line x1={NOW} y1={Y_NEXT} x2={END} y2={Y_NEAR} stroke={BLUE} strokeWidth={1.25} strokeDasharray="4 3" />}
          {active === 2 && <text x={(NOW + END) / 2 + 12} y={(Y_NEXT + Y_NEAR) / 2 - 8} fontSize={11} fill={BLUE}>수렴(가정)</text>}
          {active === 3 && (
            <>
              <line x1={NOW} x2={END} y1={Y_NEXT} y2={Y_NEXT} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 3" />
              <line x1={END} x2={END} y1={Y_NEXT} y2={Y_NEAR - 6} stroke={RED} strokeWidth={1.25} />
              <polygon points={`${END},${Y_NEAR - 2} ${END - 4},${Y_NEAR - 9} ${END + 4},${Y_NEAR - 9}`} fill={RED} />
              <text x={END + 6} y={(Y_NEXT + Y_NEAR) / 2 - 3} fontSize={11} fontWeight={700} fill={RED}>톤당</text>
              <text x={END + 6} y={(Y_NEXT + Y_NEAR) / 2 + 11} fontSize={11} fontWeight={700} fill={RED}>−1만5000</text>
            </>
          )}

          <circle cx={NOW} cy={Y_NEAR} r={4} fill={active === 0 ? GRAY : "none"} stroke={GRAY} strokeWidth={1.25} />
          <text x={NOW + 8} y={Y_NEAR - 6} fontSize={11} fill={GRAY}>{active === 0 ? "가까운 계약" : "가까운 계약 닫음"}</text>
          <circle cx={NOW} cy={Y_NEXT} r={4} fill={BLUE} />
          <text x={NOW + 8} y={Y_NEXT - 8} fontSize={11} fill={BLUE}>{active === 0 ? "다음 계약" : "다음 계약 보유"}</text>
          {active >= 2 && <circle cx={END} cy={Y_NEAR} r={4} fill={BLUE} />}
        </svg>
      )}
    />
  );
}
