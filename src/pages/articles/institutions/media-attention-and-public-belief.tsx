import { CitationBlock } from "@/components/ui/citation";
import NumericPath from "../world-systems/NumericPath";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** teach-system S→B→0…7. 공식 문서 확인 2026-10-04, 사례 수치는 가정. */
export default function MediaAttentionAndPublicBeliefArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teaching-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">S · 사람들이 보는 정보의 순서도 시장을 움직입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">같은 사실이 있어도 사람들이 어떤 화면에서 얼마나 자주 보느냐에 따라 체감이 달라질 수 있습니다. 주목을 얻은 이야기가 주문이나 투표로 이어지는지 보려면 정보가 만들어지고 배치되고 행동으로 옮겨지는 경로를 따로 살펴야 합니다.</p>
          <p className="leading-8">이 글은 제한된 화면에 무엇이 올라오는지, 그 과정에서 누가 돈을 내고 받는지 추적합니다. 많이 보였다는 사실과 믿게 됐다는 사실을 구별하는 것이 출발점입니다.</p>
        </div>
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">정보와 행동 사이의 경로를 볼 준비가 됐습니다. 큰 역할부터 나눕니다.</p>
      </section>
      <section id="black-box" data-teaching-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">B · 정보가 제작자와 배치 담당을 거쳐 독자에게 갑니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">제작자는 취재와 편집에 시간을 씁니다. 화면을 운영하는 곳은 보여 줄 순서를 정합니다. 독자는 보이는 것 중 일부를 읽고 판단합니다. 광고를 산 사람이 이 화면의 운영비를 낼 수도 있고 독자가 구독료를 낼 수도 있습니다.</p>
          <p className="leading-8">순서를 고르는 기준과 사실을 검증하는 기준은 다를 수 있습니다. 빨리 눌린 게시물이 정확하다는 보장은 없고, 오래 조사한 글이 항상 많이 보이는 것도 아닙니다.</p>
        </div>
        <NumericPath title="큰 흐름부터 읽기" steps={[{"label": "만들기", "value": "1"}, {"label": "화면에 배치", "value": "2"}, {"label": "읽고 행동하기", "value": "3"}]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">제작·배치·판단의 역할을 나눴습니다. 한 화면의 숫자를 놓습니다.</p>
      </section>
      <section id="case" data-teaching-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">0 · 100개 중 10개가 반복 보이는 화면을 가정합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">게시물 100개 가운데 선택된 10개가 이용자 화면에서 반복 노출된다고 놓습니다(가정). 광고주는 그 화면에서 광고 1천 회 노출을 1만 원에 샀다고도 놓습니다. 실제 플랫폼의 선택 방식이나 단가는 아닙니다.</p>
          <p className="leading-8">광고 1천 회 노출은 1천 명이 봤다는 뜻이 아닙니다. 같은 사람에게 여러 번 나갈 수 있습니다. 게시물 10개의 비중과 광고 노출 수 역시 서로 다른 분모입니다.</p>
        </div>
        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">100·10·1천 회의 단위를 구별했습니다. 화면의 선택 과정을 엽니다.</p>
      </section>
      <section id="picture" data-teaching-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1 · 순서가 바뀌면 보지 못한 정보도 생깁니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">이용자의 화면이 한정돼 있으면 위에 놓인 게시물을 보는 동안 아래의 글은 읽지 못할 수 있습니다. 100개 중 10개를 반복 배치한 사례는 가시성이 골고루 배분되지 않았음을 보여 줍니다.</p>
          <p className="leading-8">반대 의견이 적게 보이는 이유는 실제 작성량이 적어서일 수도, 배치 기준 때문일 수도 있습니다. 화면만 보고 전체 게시물의 분포를 역으로 확정할 수 없습니다.</p>
        </div>
        <NumericPath title="(가정) 광고 노출에서 기록된 행동까지" steps={[{"label": "광고 노출", "value": "1천 회"}, {"label": "기록된 클릭", "value": "20번"}, {"label": "기록된 구매", "value": "2건"}]} />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">보이는 표본과 전체 정보를 구별했습니다. 선택 기준에 돈이 연결되는 이유를 봅니다.</p>
      </section>
      <section id="need" data-teaching-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2 · 취재비를 회수하는 방식이 제작과 배치에 영향을 줍니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">광고 수입이 노출과 연결되면 운영자는 이용자가 더 오래 머물 유인을 갖습니다. 구독 수입이 중심이면 독자가 계속 돈을 낼 이유를 만드는 것이 중요해집니다. 어느 방식에서도 정확성과 재미, 비용 사이의 선택이 생깁니다.</p>
          <p className="leading-8">제작자가 제품을 제공받고 후기를 썼다면 독자는 그 관계를 알아야 평가할 수 있습니다. 좋은 평가가 실제 경험 때문인지 지급 관계의 영향인지 판단할 정보가 추가로 필요하기 때문입니다.</p>
        </div>
        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">수입과 선택의 연결을 보았습니다. 공식 용어를 붙입니다.</p>
      </section>
      <section id="names" data-teaching-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3 · 노출과 수입, 원인을 구별하는 이름을 붙입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">제한된 화면과 시간을 어떤 정보에 줄지 정하는 과정이 주목의 배분입니다. 콘텐츠를 골라 순서를 매기는 추천 시스템은 그 배분 수단 중 하나입니다.</p>
          <p className="leading-8">광고와 구독 등 돈을 버는 방식이 제작·배치 선택에 주는 조건을 매체의 수익 유인이라고 부릅니다. 유인이 있다고 실제로 거짓말을 했다는 결론이 자동으로 나오지는 않습니다.</p>
          <p className="leading-8">노출 때문에 생각이나 행동이 바뀌었는지를 가리는 작업은 인과 추론입니다. 원래 관심이 있던 사람이 더 눌렀는지, 본 뒤 관심을 갖게 됐는지를 구분해야 합니다.</p>
        </div>
        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">노출·돈·원인의 이름을 정했습니다. 광고 거래의 실제 변화량을 따라갑니다.</p>
      </section>
      <section id="mechanism" data-teaching-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4 · 1천 회 노출에서 20번 클릭과 2건 구매를 분리합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">광고 1천 회 노출 뒤 20번 클릭과 2건 구매가 기록됐다고 놓습니다(가정). 노출 기준 클릭 비율은 20÷1,000=2%, 클릭 기준 구매 비율은 2÷20=10%입니다. 플랫폼은 약정대로 노출을 제공해 1만 원을 받고 광고주는 상품 판매의 결과를 봅니다.</p>
          <p className="leading-8">매출을 알더라도 제품 원가와 광고비를 빼야 이익을 계산합니다. 더 나아가 2건 모두 광고가 없었으면 일어나지 않았을 구매인지 확인해야 광고의 추가 효과를 알 수 있습니다.</p>
          <p className="leading-8">시장 이야기 역시 같은 순서로 읽습니다. 게시물 증가, 노출, 믿음의 변화, 실제 주문과 자금 유입을 각각 관측해야 합니다. 주가가 오른 뒤 사람들이 글을 더 찾는 반대 방향도 가능합니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">노출과 구매의 분모, 추가 효과의 조건을 구별했습니다. 공개 의무가 무엇을 보여 주는지 봅니다.</p>
      </section>
      <section id="source" data-teaching-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5 · EU 원문은 추천의 주요 기준을 설명하게 합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">EU 디지털서비스법 제27조는 해당 온라인 플랫폼의 추천 시스템에 쓰이는 주요 기준을 이용자가 이해할 수 있게 설명하도록 규정합니다. 100개 중 10개를 고르는 기준에 관해 확인할 문서가 생기는 것입니다.</p>
          <p className="leading-8">이 규칙이 모든 게시물의 진위를 보증하거나 모든 나라의 서비스에 같은 방식으로 적용되는 것은 아닙니다. 적용 대상과 법의 예외, 서비스가 제공되는 관할을 먼저 확인합니다.</p>
        </div>
        <SourceApplication source="EU Regulation 2022/2065 · Article 27(1)" excerpt="the main parameters used in their recommender systems" application="게시물100개 중 추천10개를 고르는 주요 기준을 약관에서 확인합니다. 노출1천 회나 구매2건의 인과 효과를 법이 대신 입증해 주지는 않습니다." />
        <CitationBlock source="EU Regulation 2022/2065 · Article 27(1)" citeKey={1} href="https://eur-lex.europa.eu/eli/reg/2022/2065/oj/eng">EU DSA 추천 기준 공개 조항. 적용 대상과 관할 확인, 2026-10-04.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">공개가 알려 주는 것은 선택 기준입니다. 다른 나라에서 광고 관계를 어떻게 확인하는지 봅니다.</p>
      </section>
      <section id="comparison" data-teaching-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6 · 미국의 광고 관계 공개는 추천 기준 공개와 다른 질문입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">미국 FTC의 추천·보증 광고 안내는 소비자의 판단에 영향을 줄 수 있는 지급 관계를 명확히 알리는 문제를 다룹니다. 플랫폼의 표시 기능이 있다는 사실만으로 언제나 충분한 공개가 됐다고 보지는 않습니다.</p>
          <p className="leading-8">사례의 1만 원이 광고주가 플랫폼에 낸 돈인지, 제작자에게 따로 지급한 대가인지에 따라 확인할 관계가 다릅니다. 10개 중 한 게시물이 유료 후기라면 그 관계와 화면의 광고 거래를 분리해 읽습니다.</p>
          <p className="leading-8">EU와 미국 설명은 2026-10-04 확인 기준입니다. 한국이나 다른 나라에는 현지 광고·소비자보호 규정과 언론 소유, 공개 제도를 확인해야 합니다. 어느 나라에서도 공개 여부와 사실 검증은 별도의 작업입니다.</p>
        </div>
        <SourceApplication source="US FTC · Endorsement Guides update, June 2023" excerpt="a platform’s built-in disclosure tool might not be an adequate disclosure" application="광고1천 회의 대가1만 원과 제작자의 별도 협찬 관계를 나눕니다. 표시 버튼만 보고 모든 관계가 충분히 공개됐다고 가정하지 않습니다." />
        <CitationBlock source="US FTC · Endorsement Guides update, June 2023" citeKey={2} href="https://www.ftc.gov/news-events/news/press-releases/2023/06/federal-trade-commission-announces-updated-advertising-guides-combat-deceptive-reviews-endorsements">미국 FTC 추천·후기 광고 가이드의 공개 판단. 2026-10-04 확인.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">배치 기준과 지급 관계의 공개를 나눴습니다. 노출 효과를 판단할 비교 조건을 살핍니다.</p>
      </section>
      <section id="limits" data-teaching-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7 · 같은 관심을 가진 비교 대상이 없으면 원인을 확정하기 어렵습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">광고를 본 사람이 2건 구매했어도 원래 살 생각이 있었을 수 있습니다. 노출 전 관심과 조건이 비슷한 사람들 중 광고를 본 경우와 보지 않은 경우를 비교해야 추가 효과를 좁혀 볼 수 있습니다. 무작위 배정도 실제 행동 차이와 측정 누락을 확인해야 합니다.</p>
          <p className="leading-8">조회수 뒤에 주가가 올랐다면 기업 발표나 정책 변화가 둘 다 움직였을 수도 있습니다. 시점의 순서만으로 영상이 가격 상승의 원인이라고 단정할 수 없습니다.</p>
          <p className="leading-8">실제 검증에서는 원문과 발표일, 반대 자료, 주문과 자금의 변화를 나눠 기록합니다. 1천 회의 노출과 2건 구매를 전체 여론이나 지속적인 믿음의 변화로 확대하지 않습니다.</p>
        </div>
        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">관측한 흐름과 입증한 원인의 경계를 확인했습니다. 숫자의 분모와 비교 조건을 다시 물어봅니다.</p>
        <ReviewPrompts questions={["1천 회 노출에 20번 클릭, 2건 구매라면 클릭 비율과 클릭 후 구매 비율은 각각 얼마일까요? (답: 4절)", "영상 조회수와 주가가 함께 오르면 원인 판단에 어떤 비교가 더 필요할까요? (답: 7절)"]} />
      </section>
    </div>
  );
}
