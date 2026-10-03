import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 기후 위험은 날씨의 세기와 그곳에 놓인 사람·자산이 만나 생긴다 — 숫자와 제도 예시는 2026-10-03 확인 기준. */
export default function ClimateRiskAndExposureArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">같은 비가 와도 손실은 지역마다 다릅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">동일한 홍수에서 A지역 노출 자산 100의 10%가 손상되면 손실은 10입니다. B지역 노출 자산 300의 20%가 손상되면 60입니다. 이 단순 계산은 확률과 인명 피해를 생략하지만 왜 재난을 날씨 숫자 하나로 비교할 수 없는지 보여 줍니다.</p>
          <p className="leading-7">위험한 곳에 새 건물이 늘면 기후가 그대로여도 총손실이 커질 수 있습니다.</p>
        </div>
        <FlowRail
          title="(가정) 동일 홍수, A지역 자산 100·취약률 10%, B지역 자산 300·취약률 20%"
          steps={[
            { actor: "가구·기업", movement: "위험 지역에 생활과 설비를 둡니다.", receives: "소득과 재산, 손실 노출" },
            { actor: "정부·도시", movement: "배수·경보·건축 기준에 투자합니다.", receives: "안전과 재정 의무" },
            { actor: "보험자·대출자", movement: "손실 가능성을 가격과 계약에 반영합니다.", receives: "보험료·이자와 대형 손실 위험" },
          ]}
        />
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">같은 홍수에서 손실 10과 60이 나온 차이를 보았습니다. 위험·노출·취약성을 따로 줄여 봅니다.</p>
      </section>
      <section id="mechanism" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">위험·노출·취약성을 따로 줄이는 수단이 있습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">제방과 배수 설비는 특정 홍수의 물리적 영향을 줄이고, 위험 지역 개발 제한은 새 노출을 낮춥니다. 건축 기준과 대피 경보는 피해 비율을 줄일 수 있습니다. 보험은 약정 금전 손실을 나누지만 집과 생명을 물리적으로 보호하지는 않습니다.</p>
          <p className="leading-7">보험료가 오르거나 보장이 끊기면 대출자가 담보가치를 다시 볼 수 있습니다. 기후 위험은 부동산 가격과 지방 재정에도 이어집니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">보험과 제방이 서로 다른 것을 바꾼다는 점을 알았습니다. 국가와 지역별 대응 능력을 비교합니다.</p>
      </section>
      <section id="comparison" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">국가와 지역마다 위험 자료와 대응 능력이 다릅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">IPCC AR6는 위험을 기후 위험, 노출, 취약성의 상호작용으로 다룹니다. UNDRR은 노출을 위험 지역에 놓인 사람·자산·인프라의 상태로 정의합니다.</p>
          <p className="leading-7">해안 도시와 내륙 농업 지역, 선진국과 저소득국을 같은 피해액으로 순위 매기면 자산 규모 차이를 놓칩니다. 인구 대비·자산 대비 손실과 회복 기간도 봅니다.</p>
        </div>
        <SourceApplication source="IPCC AR6 WGII · Chapter 1, Figure 1.4" excerpt="Risk results from interactions among the determinants of risk—hazard, vulnerability, and exposure" application="동일 홍수라는 위험을 고정해도 A의 자산 100×취약률 10%=10, B의 자산 300×20%=60이 됩니다. 이 곱셈은 실제 재난의 확률과 간접 피해를 생략합니다." />
        <CitationBlock source="IPCC AR6 WGII Chapter 1" citeKey={1} href="https://www.ipcc.ch/report/ar6/wg2/downloads/report/IPCC_AR6_WGII_Chapter01.pdf">그림 1.4가 위험·노출·취약성의 상호작용을 그립니다.</CitationBlock>
        <CitationBlock source="IPCC AR6 WGII Summary for Policymakers" citeKey={2} href="https://www.ipcc.ch/report/ar6/wg2/chapter/summary-for-policymakers/">기후 위험·노출·취약성과 적응의 관계를 정리한 평가보고서입니다.</CitationBlock>
        <CitationBlock source="UNDRR Exposure Terminology" citeKey={3} href="https://www.undrr.org/terminology/exposure">재난 위험 분석에서 노출의 정의를 제공합니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">IPCC의 세 요소가 사례 수치와 맞닿았습니다. 과거 손실만으로 미래를 예측할 수 있는지는 다시 묻습니다.</p>
      </section>
      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">보험료나 과거 피해만으로 미래의 안전을 확정할 수 없습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">토지 개발, 노후 인프라, 적응 투자와 기후 조건이 바뀌면 과거 빈도가 미래 손실을 대표하지 못할 수 있습니다.</p>
          <p className="leading-7">위험 지도에는 해상도와 시나리오 범위가 있습니다. 특정 필지의 계약·설계 판단에는 현지 고도, 배수, 건축 기준과 실제 보험 약관을 확인합니다.</p>
        </div>
        <ReviewPrompts questions={[
          "같은 홍수에서 A의 손실 10과 B의 손실 60이 다른 이유를 노출과 취약성으로 나눠 볼 수 있나요? (답: 2절)",
          "과거 피해가 적던 땅에 건물이 크게 늘면 위험 판단을 어떻게 바꿔야 할까요? (답: 4절)",
        ]} />
      </section>
    </div>
  );
}
