import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 공식 자료 확인: 2026-10-04. 금액 사례는 본문에 표시한 가정입니다. */
export default function FranchiseIncentivesArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1. 같은 간판 아래 세 사람의 돈은 다르게 남는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">익숙한 간판은 손님이 가게를 선택하는 시간을 줄여 줍니다. 점주는 그 이름과 운영 방법을 얻는 대신 돈을 내고 운영의 선택 일부를 약속합니다. 브랜드가 커질 때 가게 주인도 함께 좋아지는지는 이 약속을 읽어야 알 수 있습니다.</p>
          <p className="leading-7">고객이 낸 돈이 누구에게 어떤 조건으로 가는지 살펴봅니다. 문을 열 때 한 번 내는 돈부터 매달의 지급, 계약을 끝낼 때 책임까지 한 점포의 장부로 봅니다.</p>
        </div>

        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">같은 브랜드 안의 서로 다른 장부를 볼 준비가 됐습니다. 지원과 운영의 역할을 나눕니다.</p>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2. 본부의 지원, 점포의 운영, 고객의 선택을 따로 둔다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">본부는 이름과 운영 방법을 제공하고 점포마다 일정한 품질을 기대합니다. 점주는 사람과 공간을 마련해 매일 고객에게 제공합니다. 고객은 같은 간판을 보고 기대하지만 실제 서비스는 각 점포에서 경험합니다. 어느 쪽이 약속을 지키지 못해도 다른 쪽에 손실이 전해집니다.</p>
        </div>

        <FlowRail title="본부에서 고객까지의 세 역할" steps={[{"actor": "무엇을 지원하나", "movement": "본부가 이름과 방법을 제공합니다.", "receives": "운영 약속"}, {"actor": "누가 제공하나", "movement": "점포가 사람과 공간을 마련합니다.", "receives": "실제 서비스"}, {"actor": "누가 다시 오나", "movement": "고객이 경험을 평가하고 선택합니다.", "receives": "반복 구매"}]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">세 역할의 약속이 이어지는 구조에 점포 하나의 월 숫자를 넣습니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3. 월 3천만 원에서 150만 원은 먼저 본부로 간다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">한 점포의 월매출은 3천만 원이고 본부에 매출의 5%를 냅니다. 재료는 1천만 원, 월세는 300만 원입니다. 모든 값은 (가정)이며 임금·광고·공과금·세금은 아직 넣지 않았습니다.</p>
          <p className="leading-7">본부 지급액은 150만 원입니다. 세 항목을 차감하면 점포에는 1천550만 원이 남지만 여기서 다른 운영비를 더 내야 합니다. 본부는 점주의 최종 이익이 확정되기 전에도 매출을 기준으로 받을 금액이 정해질 수 있습니다.</p>
        </div>

        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">3천만 원 중 150만 원의 목적지가 정해졌습니다. 돈의 기준을 그림으로 분리합니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 손님에게 받은 돈과 본부가 받는 돈의 기준을 그린다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">점포의 월매출과 본부의 월 수입을 같은 금액으로 읽지 않습니다. 고객이 점포에 내는 3천만 원 중 계약으로 본부에 이동하는 150만 원을 별도 화살표로 표시합니다.</p>
        </div>
        <FlowRail
          title="(가정) 월매출 3천만 원, 로열티 5%, 원재료 1천만 원, 월세 300만 원"
          steps={[
            { actor: "고객", movement: "점포에서 3천만 원을 결제합니다.", receives: "상품과 브랜드 경험" },
            { actor: "가맹점주", movement: "재료·임금·월세와 로열티를 냅니다.", receives: "운영 후 잔여현금" },
            { actor: "가맹본부", movement: "상표·매뉴얼·공급망을 제공합니다.", receives: "로열티 150만 원과 계약상 공급 수입" },
          ]}
        />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">계약된 지급과 남는 이익의 차이가 보이면 품질 관리가 만드는 비용도 물을 수 있습니다.</p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 통일된 품질을 만드는 약속이 비용 부담도 만든다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">어느 지점에서나 같은 맛을 기대하게 하려면 재료와 작업 방법을 맞춰야 합니다. 그러나 본부가 지정한 재료가 비싸지면 점주는 다른 공급자로 바꾸어 원가를 낮추기 어려울 수 있습니다.</p>
          <p className="leading-7">점주의 서비스가 나쁘면 같은 간판을 가진 다른 가게의 평판도 손상됩니다. 반대로 본부가 가까이에 새 점포를 열면 기존 점주의 손님이 나뉠 수 있습니다. 품질 관리와 지역의 판매 기회를 어떤 계약으로 조정하는지가 비용보다 먼저 볼 질문입니다.</p>
        </div>

        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">공통 품질과 점포 선택의 교환을 이해했으므로 계약의 이름을 붙입니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. 반복 지급과 공급 조건의 이름</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">본부의 상표와 사업 방식을 이용할 권리를 얻는 계약을 가맹계약이라고 합니다. 프랜차이즈라는 말은 이 계약 관계와 운영 체계를 가리킵니다.</p>
          <p className="leading-7">그 권리를 계속 쓰며 내는 대가가 로열티입니다. 사례에서는 매출의 5%이지만 정액 등 다른 방식도 있으므로 자기 계약의 계산 기준을 확인합니다.</p>
          <p className="leading-7">본부 또는 지정 공급자에게서 사야 하는 물건을 필수품목이라고 부릅니다. 어떤 품목과 가격 결정 방식이 계약에 정해졌는지 보면 본부 수입이 로열티 외에도 생기는지 알 수 있습니다.</p>
        </div>

        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">가맹계약과 반복 비용을 구별했으니 한 달과 계약 전체의 돈을 연결합니다.</p>
      </section>
      <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. 초기 가맹비보다 계약 전체의 현금흐름을 봅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">고객에게서 3천만 원이 들어오면 150만 원은 본부 지급액, 1천만 원은 재료, 300만 원은 월세로 배분합니다. 잔액 1천550만 원에서 직원뿐 아니라 직접 일하는 점주의 노동 대가도 빼야 계약을 유지할 만한지 비교할 수 있습니다.</p>
          <p className="leading-7">계약 전에는 문을 열 때의 가맹·교육·장비 비용, 운영 중의 로열티와 광고분담, 갱신 때의 시설 교체, 양도 때의 승인·교육 비용을 날짜별로 놓습니다. 지정품목 가격이 바뀔 때 통지와 협의가 어떻게 되는지, 광고비 집행 내역을 어떤 문서로 보는지도 질문합니다.</p>
          <p className="leading-7">마지막에는 영업지역과 온라인·배달 주문의 배분, 계약 기간과 갱신 조건을 읽습니다. 임대차가 먼저 끝나거나 본부 계약이 해지되면 간판 제거·재고 처분·장비 리스가 각각 어떻게 남는지 확인합니다. 본부의 최근 점포 증가뿐 아니라 양도·폐점 점주에게도 실제 비용을 물어야 합니다.</p>
        </div>

        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">매달 나가는 돈의 순서를 알았다면 적자 때도 지급이 남는지 공식 안내를 확인합니다.</p>
      </section>
      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8. 본부에 내는 돈은 점주 적자와 별도로 발생할 수 있다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">3천만 원 매출의 5%라는 약속은 본부의 150만 원 수입과 점주의 생활비를 직접 연결하지 않습니다. 미국 FTC의 소비자 안내는 반복 지급 비용을 설명할 때 이 조건을 분명히 합니다.</p>
        </div>
        <SourceApplication source="US FTC · Consumer Guide, Royalties" excerpt="even if you are losing money" application="점주의 임금·광고·공과금 등 추가 비용이 1천550만 원을 넘으면 적자가 되지만, 매출 연동 약정의 150만 원은 자동으로 없어지지 않습니다. 실제 면제·유예 여부는 계약으로 확인합니다." />
        <CitationBlock source="US FTC · Consumer Guide, Royalties" citeKey={1} href="https://www.ftc.gov/business-guidance/resources/consumers-guide-buying-franchise">2026-10-04 확인. 원문 문구와 위 사례 적용의 근거입니다.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">로열티의 계산 기준을 확인했습니다. 예상 매출을 공시에서 찾는 방법을 봅니다.</p>
      </section>
      <section id="comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. 공시 제도는 나라가 달라도 수익률 보증은 아닙니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">미국 FTC Franchise Rule은 계약·지급 전에 Franchise Disclosure Document를 제공하도록 하고 23개 항목을 요구합니다. 한국 공정거래위원회 정보공개서는 점포 수·평균 매출 등 비교 자료를 담지만 평균 매출은 점주 순이익이 아닙니다. 유럽연합은 프랜차이즈 계약의 수직적 제한을 경쟁법의 틀에서 살핍니다.</p>
          <p className="leading-7">비교할 때는 같은 업종과 연식의 점포 수, 폐점·양도, 본부와 점주의 매출 구분, 공급품 가격, 영업 구역, 갱신 조건을 확인합니다. 각국 공시·규제의 범위는 다르므로 현지 원문을 봐야 합니다.</p>
        </div>
        <SourceApplication source="US FTC · FDD Item 19 안내" excerpt="Item 19 contains claims the franchisor chooses to make about sales or earnings." application="예상 월매출 3천만 원을 권유받았다면 미국에서는 그 수치가 FDD의 해당 항목에 어떻게 기재됐는지 확인합니다. 한국 정보공개서의 평균 매출과도 점포 연식·면적·제외 점포를 맞춰 비교하고, 어느 공시도 1천550만 원의 순이익을 보장한다고 읽지 않습니다." />
        <CitationBlock source="US FTC · FDD Item 19 안내" citeKey={2} href="https://www.ftc.gov/business-guidance/blog/2023/05/franchise-fundamentals-taking-deep-dive-franchise-disclosure-document">2026-10-04 확인. 이 절의 원문과 관할 범위를 확인합니다.</CitationBlock>
        <CitationBlock source="US FTC Franchise Rule" citeKey={3} href="https://www.ftc.gov/legal-library/browse/rules/franchise-rule">미국 가맹사업 공시 규칙의 원문입니다.</CitationBlock>
        <CitationBlock source="US FTC Consumer Guide to Buying a Franchise" citeKey={4} href="https://www.ftc.gov/business-guidance/resources/consumers-guide-buying-franchise">미국의 FDD 14일 사전 제공과 항목별 검토를 설명합니다.</CitationBlock>
        <CitationBlock source="한국 공정위 가맹 정보공개서 비교" citeKey={5} href="https://franchise.ftc.go.kr/firHope/comparePopup.do">한국의 점포 수·평균 매출·비용 비교 항목을 확인합니다.</CitationBlock>
        <CitationBlock source="EU Vertical Guidelines 2022" citeKey={6} href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=intcom%3AC%282022%294238">유럽연합 수직 계약·가맹 제한의 경쟁법 해석 자료입니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">공시가 담는 정보와 점주 수익의 차이를 구분했습니다. 평균이 놓치는 점포를 확인합니다.</p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10. 평균 매출이 높아도 점주 한 사람의 삶은 다를 수 있습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">평균에는 오래된 우량점과 신생점이 섞입니다. 자기 노동을 임금으로 계산하지 않거나 가족 노동을 공짜로 쓰면 순이익이 과장됩니다. 폐점한 점포가 표본에 없는지와 추정 방법도 확인해야 합니다.</p>
          <p className="leading-7">브랜드 인지도가 손님을 모아도 임대료가 비싸거나 근처에 새 가맹점이 열리면 점주 몫은 줄어듭니다. 매출 예상은 계약 책임과 별개의 가정으로 읽어야 합니다.</p>
        </div>

        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">예상 매출을 계약 책임으로 바꾸지 않고 비용과 폐점 사례까지 확인해야 판단이 완성됩니다.</p>

        <ReviewPrompts questions={["점주의 다른 비용이 1천550만 원보다 커졌다면 매출 3천만 원의 5% 지급 약속은 어떻게 작동할까요? (답: 8절)", "예상 월매출 3천만 원 자료를 받았을 때 기존점과 폐점·양도점에 각각 무엇을 확인해야 할까요? (답: 7절)"]} />
      </section>
    </div>
  );
}
