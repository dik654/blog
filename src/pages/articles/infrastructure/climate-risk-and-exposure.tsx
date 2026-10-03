import { CitationBlock } from "@/components/ui/citation";
import NumericPath from "../world-systems/NumericPath";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** teach-system S→B→0…7. 공식 문서 확인 2026-10-04, 사례 수치는 가정. */
export default function ClimateRiskAndExposureArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teaching-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">S · 같은 비가 왜 다른 손실을 만들까요</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">재난 뉴스를 보면 비의 양과 바람의 세기를 먼저 보게 됩니다. 하지만 같은 비에도 사람이 사는 위치와 집의 상태가 다르면 피해는 달라집니다.</p>
          <p className="leading-8">이 글은 날씨, 그곳에 놓인 자산, 손상되는 비율을 따로 놓고 손실이 보험과 대출로 이어지는 경로를 봅니다. 무엇을 줄여야 피해가 줄어드는지 구별하는 것이 목적입니다.</p>
        </div>
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">피해를 날씨 하나로 설명하지 않을 준비가 됐습니다. 손실이 지나가는 큰 흐름을 봅니다.</p>
      </section>
      <section id="black-box" data-teaching-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">B · 자연 현상이 자산에 닿고 손실이 계약으로 넘어갑니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">비가 내려 물이 차면 그곳의 집과 설비가 손상됩니다. 가구와 기업은 복구비와 일을 멈춘 비용을 부담합니다. 보장 계약이 있으면 그중 약속된 부분을 다른 지급자가 나눕니다.</p>
          <p className="leading-8">돈을 나눠 내는 약속과 물이 집에 닿지 않게 막는 시설은 서로 다른 기능입니다. 둘 중 하나만 있다고 다른 기능이 자동으로 따라오지는 않습니다.</p>
        </div>
        <NumericPath title="큰 흐름부터 읽기" steps={[{"label": "물리적 사건", "value": "1"}, {"label": "자산의 손상", "value": "2"}, {"label": "손실을 나누기", "value": "3"}]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">물리적 피해와 비용의 배분을 나눴습니다. 두 지역에 같은 사건을 놓습니다.</p>
      </section>
      <section id="case" data-teaching-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">0 · 같은 홍수에서 10과 60의 손실이 생깁니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">동일한 홍수가 난 두 지역을 가정합니다. A에는 자산가치 100이 놓여 있고 10%가 손상돼 손실은 10입니다. B에는 자산 300이 있고 20%가 손상돼 손실은 60입니다. 모두 설명용 값이며 단위는 같은 금액 단위입니다(가정).</p>
          <p className="leading-8">이 계산은 홍수가 이미 일어났다는 조건의 직접 자산 손실입니다. 한 해의 발생확률이나 인명 피해, 영업 중단은 아직 넣지 않았습니다. 60이 곧 B의 매년 예상 손실이라는 뜻은 아닙니다.</p>
        </div>
        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">같은 사건의 손실이 여섯 배가 되는 원인을 나눴습니다. 손실 계산의 안을 엽니다.</p>
      </section>
      <section id="picture" data-teaching-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1 · 그곳에 있는 양과 손상 비율을 곱합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">B의 자산이 300이고 손상 비율이 20%면 300×0.20=60입니다. 자산을 절반으로 줄이면 같은 비율에서 30, 손상 비율을 절반으로 낮춰도 같은 자산에서 30입니다(가정). 서로 다른 조치가 같은 금액의 감소를 만들 수 있습니다.</p>
        </div>
        <NumericPath title="(가정) 지역 B의 한 번의 홍수 손실" steps={[{"label": "그곳의 자산", "value": "300"}, {"label": "그 사건의 손상률", "value": "×20%"}, {"label": "직접 자산 손실", "value": "60"}]} />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">무엇을 줄였는지 구분할 수 있습니다. 각 조치가 필요한 이유를 살핍니다.</p>
      </section>
      <section id="need" data-teaching-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2 · 개발 제한·방재·보험은 바꾸는 대상이 다릅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">위험한 곳에 새 건물을 짓지 않으면 그곳에 놓이는 자산을 줄일 수 있습니다. 배수와 건물 보강은 같은 사건에서 손상될 비율을 낮출 수 있습니다. 각각의 비용과 주민이 이동할 때의 부담은 남습니다.</p>
          <p className="leading-8">보험금은 사고 뒤 복구에 쓸 돈을 나눠 주지만 사고 당시 건물이 손상되는 비율을 직접 낮추지는 않습니다. 경보와 대피는 인명 보호에 도움이 되므로 자산 손실만으로 가치를 평가할 수 없습니다.</p>
        </div>
        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">보호 수단이 어느 숫자를 바꾸는지 보았습니다. 공식 용어를 붙입니다.</p>
      </section>
      <section id="names" data-teaching-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3 · 위해·노출·취약성의 상호작용으로 위험을 읽습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">피해를 일으킬 수 있는 홍수 같은 자연 현상을 위해라고 부릅니다. 일상어의 위험과 구별하기 위해 여기서는 현상 자체에 이 말을 씁니다.</p>
          <p className="leading-8">위해가 닿는 곳에 사람과 자산이 놓인 상태는 노출입니다. 사례의 자산 100과 300은 노출을 금액으로 단순화한 값입니다.</p>
          <p className="leading-8">같은 현상에서 더 쉽게 손상되는 성질은 취약성입니다. 사례의 10%와 20%는 특정 홍수에서의 손상 비율로 취약성 차이를 표현한 가정입니다. 실제 위험은 세 숫자를 언제나 단순 곱하는 공식 하나로 정해지지 않습니다.</p>
        </div>
        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">원문의 세 요소와 사례의 단순화를 연결했습니다. 이제 손실 뒤의 지급을 따라갑니다.</p>
      </section>
      <section id="mechanism" data-teaching-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4 · B의 손실 60은 보험과 남은 부담으로 나뉩니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">B의 손실 60 중 보험이 40을 지급하고 소유자가 20을 부담한다고 놓습니다(가정). 총물리 손실은 여전히 60입니다. 지급이 복구를 도울 수 있지만 보험금이 손상 자체를 없애지는 않습니다.</p>
          <p className="leading-8">다음 해에 보험료가 오르거나 보장 한도가 줄면 소유자의 지출과 잔여 부담이 커집니다. 대출자는 담보 복구 가능성과 보험 조건을 다시 살필 수 있습니다. 이 경로가 기후 손실의 금융 전달입니다.</p>
          <p className="leading-8">방재로 손상 비율을 20%에서 10%로 줄이면 같은 자산 300의 직접 손실은 30입니다. 다만 공사비와 유지비를 내야 하므로 30 감소가 곧 그 사업의 순편익은 아닙니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">물리 손실·보험 지급·남은 부담을 분리했습니다. 공식 원문의 정의를 확인합니다.</p>
      </section>
      <section id="source" data-teaching-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5 · IPCC는 세 요소가 서로 작용한다고 설명합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">IPCC AR6 WGII의 그림 1.4는 위해, 노출, 취약성의 상호작용을 제시합니다. 사례에서 홍수를 같게 놓고도 노출과 손상 비율 때문에 10과 60이 달라졌다는 해석이 이 틀에 해당합니다.</p>
          <p className="leading-8">다만 실제 피해는 물의 깊이와 지속 시간, 설비 위치에 따라 비선형으로 달라집니다. 100×10%라는 식은 이해를 위한 조건부 회계 예시이며 IPCC가 제시한 보편 피해 함수가 아닙니다.</p>
        </div>
        <SourceApplication source="IPCC AR6 WGII · Chapter 1, Figure 1.4" excerpt="Risk results from interactions among the determinants of risk—hazard, vulnerability, and exposure" application="동일 홍수에서 A는 100×10%=10, B는 300×20%=60입니다. 특정 사건의 가정 계산이며 발생확률과 인명 손실을 생략했습니다." />
        <CitationBlock source="IPCC AR6 WGII · Chapter 1, Figure 1.4" citeKey={1} href="https://www.ipcc.ch/report/ar6/wg2/downloads/report/IPCC_AR6_WGII_Chapter01.pdf">기후 위험의 세 요소와 상호작용을 설명하는 IPCC 평가.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">원문 틀과 단순 곱셈의 경계를 확인했습니다. 지역별 측정 범위를 맞춥니다.</p>
      </section>
      <section id="comparison" data-teaching-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6 · UNDRR의 노출 정의에는 사람과 기반 시설도 있습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">UNDRR은 위험 지역에 있는 사람, 주택과 기반 시설 등을 노출에 포함합니다. 따라서 사례의 자산 300만으로 지역 B의 위험 전체를 대표할 수 없습니다. 거주 인구, 병원 접근과 생활 기반도 따로 조사합니다.</p>
          <p className="leading-8">부유한 해안 도시와 자산가격이 낮은 농촌을 피해액만으로 순위 매기면 생계 손실과 회복 능력의 차이가 가려집니다. 국가 비교에서는 같은 통화가격 외에 인구·자산 대비 손실과 복구 기간을 맞춥니다.</p>
          <p className="leading-8">지도와 건축 규칙은 현지 기관의 관할입니다. 2026-10-04 확인한 국제 정의를 특정 필지의 안전 확인서처럼 사용하지 않습니다.</p>
        </div>
        <SourceApplication source="UNDRR · Exposure terminology" excerpt="The situation of people, infrastructure, housing, production capacities and other tangible human assets located in hazard-prone areas." application="B의 자산 300은 노출의 일부입니다. 사람과 병원·도로가 어디에 있는지 더해야 같은 피해 60의 생활상 의미를 비교할 수 있습니다." />
        <CitationBlock source="UNDRR · Exposure terminology" citeKey={2} href="https://www.undrr.org/terminology/exposure">노출의 범위에 관한 국제 재난위험 정의. 2026-10-04 확인.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">노출의 범위를 자산 금액 밖으로 넓혔습니다. 과거 자료로 미래를 읽는 한계를 봅니다.</p>
      </section>
      <section id="limits" data-teaching-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7 · 과거에 안전했던 땅도 조건이 바뀌면 다시 봐야 합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">같은 지역에 건물이 늘면 날씨가 그대로여도 노출이 커집니다. 배수 시설이 낡거나 보강되면 취약성이 바뀝니다. 기후 변화까지 있으면 과거 발생 빈도가 미래를 그대로 대표하지 않을 수 있습니다.</p>
          <p className="leading-8">연간 예상 손실을 계산하려면 다양한 사건의 확률과 각 사건의 손실을 함께 알아야 합니다. 이번 사건의 손실 60만으로 연 보험료나 대출 손실률을 정할 수 없습니다.</p>
          <p className="leading-8">실제 계약에서는 현지 높이와 배수, 위험 지도의 해상도와 시나리오, 보험의 면책과 지급 한도를 확인합니다. 큰 피해가 동시에 나면 복구 인력과 자재의 부족도 회복을 늦출 수 있습니다.</p>
        </div>
        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">사건 한 번의 손실과 미래의 확률을 구분했습니다. 피해를 줄이는 다른 선택을 비교해 봅니다.</p>
        <ReviewPrompts questions={["B의 보험금이 40이면 총손실 60과 소유자 부담은 각각 얼마일까요? (답: 4절)", "이번 홍수 손실 60만으로 한 해의 예상 손실을 정할 수 있을까요? (답: 7절)"]} />
      </section>
    </div>
  );
}
