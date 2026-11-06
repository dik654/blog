import { Arrow, Box } from "./FlowParts";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison 둘째·셋째 문단 — 사례의 10만 원이 만들어지는 두 경로와 한국의 심사·지급 분리.
 * 심평원 수가제도 안내, 2026-10-09 확인. 항목별 칸 폭은 금액을 뜻하지 않는다(본문에 항목별 금액 없음).
 */
const FFS = "#2563eb";
const DRG = "#7c3aed";
const CLAIM = "#0f766e";

const SCENES = [
  { label: "항목별 가격을 더한 10만 원", summary: "행위별수가제", note: "사례의 10만 원이 검사·처치 항목별 가격을 더한 값이면 행위별수가제입니다. 진료 행위의 사용량과 가격으로 지불하며 한국 건강보험의 근간입니다. 칸 폭은 금액이 아닙니다." },
  { label: "미리 정한 10만 원", summary: "포괄수가제", note: "같은 질병군 입원 한 건에 미리 정한 금액이면 포괄수가제입니다. 7개 질병군에 대해 2013년 7월부터 전국 모든 의료기관에 적용됐고, 요양병원·보건기관 등의 정액수가제와 함께 행위별수가제를 보완합니다." },
  { label: "'지급자 확인'이 둘로 나뉩니다", summary: "심평원 심사 → 공단 지급", note: "1절의 지급자 확인이 한국에서는 건강보험심사평가원(심평원)의 심사와 국민건강보험공단의 지급으로 나뉩니다. 심평원 안내 기준이며 2026-10-09 확인입니다." },
] as const;

export default function KoreaFeeRouteViz() {
  return (
    <SceneShell
      eyebrow="한국의 경우"
      title="사례의 10만 원은 한국에서 어떤 값일 수 있을까요"
      description="10만 원은 이 글의 가정이며 실제 진료비가 아닙니다. 같은 금액이 어떻게 정해졌는지에 따라 이름이 갈립니다."
      ariaLabel="한국의 행위별수가제와 포괄수가제, 심사와 지급의 분리"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 150" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 && (
            <g>
              <Box x={8} y={46} w={84} h={52} title="검사 가격" color={FFS} on />
              <text x={106} y={77} textAnchor="middle" fontSize={15} fontWeight={700} fill="currentColor">+</text>
              <Box x={120} y={46} w={84} h={52} title="처치 가격" color={FFS} on />
              <Arrow x1={208} y1={72} x2={246} y2={72} color={FFS} on />
              <Box x={250} y={46} w={102} h={52} title="10만 원" sub="더한 값" color={FFS} on />
            </g>
          )}
          {active === 1 && (
            <g>
              <Box x={8} y={46} w={196} h={52} title="같은 질병군 입원 한 건" sub="금액을 미리 정해 둠" color={DRG} on />
              <Arrow x1={208} y1={72} x2={246} y2={72} color={DRG} on />
              <Box x={250} y={46} w={102} h={52} title="10만 원" sub="정해 둔 값" color={DRG} on />
            </g>
          )}
          {active === 2 && (
            <g>
              <Box x={4} y={46} w={76} h={52} title="병원" sub="청구" on />
              <Arrow x1={82} y1={72} x2={110} y2={72} color={CLAIM} on />
              <Box x={112} y={46} w={106} h={52} title="심평원" sub="심사" color={CLAIM} on />
              <Arrow x1={220} y1={72} x2={248} y2={72} color={CLAIM} on />
              <Box x={250} y={46} w={106} h={52} title="공단" sub="지급" color={CLAIM} on />
            </g>
          )}
        </svg>
      )}
    />
  );
}
