import SceneShell from "./SceneShell";

/**
 * 본문 대응: #bpo-sparse-blobpool — 15% 확률로 전체, 85% 확률로 1/8.
 * 0.15 + 0.85/8 = 0.25625, 18 × 0.25625 = 4.6125, 감소 약 74.4%. 2.7 + 1.9125 = 4.6125.
 */
const UNITS = 18;
const P_FULL = 0.15;
const SHARE = 1 / 8;

const SCENES = [
  { label: "모두 전부 받을 때", summary: "18 단위", note: "블록에 들기 전 자료를 모든 노드가 전부 받으면 넓이가 사각형 전체, 18 단위입니다. 18개 분량은 글이 가정한 수입니다." },
  { label: "15% 확률로 전체를", summary: "0.15 × 18 = 2.7", note: "제안의 단순 모델에서 15% 확률로 전체를 받습니다. 왼쪽 기둥의 넓이가 평균에 2.7 단위를 보탭니다." },
  { label: "85% 확률로 1/8을", summary: "0.85 × 18 ÷ 8 = 1.9125", note: "나머지 85%에서는 1/8만 받습니다. 폭은 넓지만 낮은 띠의 넓이가 1.9125 단위를 보탭니다." },
  { label: "넓이를 더합니다", summary: "2.7 + 1.9125 = 4.6125", note: "0.15+0.85/8=0.25625이고 18을 곱하면 평균 4.6125 단위입니다. 약 74.4% 감소이지만 확률적 payload(자료 본문) 모델의 값입니다. 사용 개수 18·10·6·6이나 target 14를 줄이는 식이 아닙니다." },
  { label: "평균은 평균일 뿐입니다", summary: "한 경우: 18 또는 2.25", note: "18개 분량을 한 덩어리로 보면 한 경우에 받는 양은 18이거나 18÷8=2.25입니다. 4.6125는 두 경우의 평균이므로 개별 노드가 매번 그 양만 받는다는 뜻이 아니고, 실제 전체 대역폭이 정확히 그만큼 줄었다는 측정 결과도 아닙니다." },
] as const;

const W = 360;
const H = 190;
const X0 = 44;
const Y0 = 12;
const RW = 300;
const RH = 140;
const fullW = RW * P_FULL;
const lowH = RH * SHARE;

export default function SparseAreaViz() {
  return (
    <SceneShell
      eyebrow="넓이로 읽는 평균"
      title="15%는 전부, 85%는 1/8: 평균 전송량은 넓이입니다"
      description="가로는 확률, 세로는 18개 분량 중 받는 비율입니다. EIP-8070은 2026-10-18 현재 Last Call 상태인 제안이며 메인넷 적용 시각은 확정돼 있지 않습니다."
      ariaLabel="전체 수신 확률 15퍼센트와 8분의 1 수신 확률 85퍼센트의 넓이를 더해 평균 4.6125 단위를 구함"
      scenes={SCENES}
      render={(active) => {
        const showAll = active === 0;
        const showFull = active === 1 || active >= 3;
        const showLow = active >= 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <rect x={X0} y={Y0} width={RW} height={RH} fill={showAll ? "#94a3b8" : "none"} stroke="#64748b" strokeWidth={1} strokeDasharray={showAll ? undefined : "4 3"} />
            {showAll && <text x={X0 + RW / 2} y={Y0 + RH / 2 + 5} textAnchor="middle" fontSize={15} fontWeight={700} fill="#ffffff">전체 수신 18 단위</text>}
            {showFull && (
              <g>
                <rect x={X0} y={Y0} width={fullW} height={RH} fill="#2563eb" />
                <text x={X0 + fullW / 2} y={Y0 + RH / 2 - 6} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">{active === 4 ? "18" : "2.7"}</text>
              </g>
            )}
            {showLow && (
              <g>
                <rect x={X0 + fullW} y={Y0 + RH - lowH} width={RW - fullW} height={lowH} fill="#16a34a" />
                <text x={X0 + fullW + (RW - fullW) / 2} y={Y0 + RH - lowH / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">{active === 4 ? "2.25" : "1.9125"}</text>
              </g>
            )}
            {active === 3 && (
              <text x={X0 + fullW + (RW - fullW) / 2} y={Y0 + (RH - lowH) / 2 + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill="#64748b">빈 넓이 약 74.4%</text>
            )}
            {active === 4 && (
              <text x={X0 + fullW + (RW - fullW) / 2} y={Y0 + (RH - lowH) / 2 + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill="#64748b">한 경우는 둘 중 한쪽</text>
            )}
            <text x={X0 - 6} y={Y0 + 10} textAnchor="end" fontSize={11} fill="#64748b">전체</text>
            <text x={X0 - 6} y={Y0 + RH - lowH + 10} textAnchor="end" fontSize={11} fill="#64748b">1/8</text>
            <text x={X0 + fullW / 2} y={Y0 + RH + 16} textAnchor="middle" fontSize={11} fill="#64748b">15%</text>
            <text x={X0 + fullW + (RW - fullW) / 2} y={Y0 + RH + 16} textAnchor="middle" fontSize={11} fill="#64748b">85%</text>
            <text x={X0 + RW / 2} y={H - 4} textAnchor="middle" fontSize={11} fill="#64748b">가로: 경우의 확률 · 세로: {UNITS} 단위 중 받는 비율</text>
          </svg>
        );
      }}
    />
  );
}
