import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 프랜차이즈는 브랜드를 빌려 주는 계약이면서 비용을 나누는 시스템이다 — 숫자와 제도 예시는 2026-10-03 확인 기준. */
export default function FranchiseIncentivesArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">본부의 매출 증가와 점주의 이익 증가는 같은 문장이 아닙니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">월매출 3천만 원의 5%를 본부에 내면 로열티는 150만 원입니다. 점주는 원재료 1천만 원, 월세 300만 원과 임금·공과금을 더 내야 합니다. 본부가 점포를 하나 더 열어 로열티를 늘려도 같은 지역의 기존 점포 매출이 나뉠 수 있습니다.</p>
          <p className="leading-7">가맹은 브랜드와 운영 방법을 얻는 대신 상품·인테리어·가격·영업 구역의 선택권 일부를 계약으로 제한받는 교환입니다. 건물주는 별도의 임대료를 받으므로 세 사람의 장부가 다릅니다.</p>
        </div>
        <FlowRail
          title="(가정) 월매출 3천만 원, 로열티 5%, 원재료 1천만 원, 월세 300만 원"
          steps={[
            { actor: "고객", movement: "점포에서 3천만 원을 결제합니다.", receives: "상품과 브랜드 경험" },
            { actor: "가맹점주", movement: "재료·임금·월세와 로열티를 냅니다.", receives: "운영 후 잔여현금" },
            { actor: "가맹본부", movement: "상표·매뉴얼·공급망을 제공합니다.", receives: "로열티 150만 원과 계약상 공급 수입" },
          ]}
        />
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">월매출 3천만 원에서 누가 먼저 돈을 떼는지 그렸다면 점주와 본부의 장부가 갈립니다. 계약 조항별 수입을 계산합니다.</p>
      </section>
      <section id="mechanism" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">초기 가맹비보다 계약 전체의 현금흐름을 봅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">초기 가맹비, 교육비, 공사와 지정 장비, 필수 품목 공급 가격, 로열티, 광고·배달 비용, 갱신·양도·종료 비용을 시간순으로 적습니다. 매출 연동 로열티는 점주가 적자여도 발생할 수 있습니다.</p>
          <p className="leading-7">본부는 품질을 일정하게 유지할 유인이 있지만 필수 공급품에 마진을 붙이면 점주의 원가가 올라갑니다. 점주는 지역 고객을 잘 알고 있지만 서비스 품질을 낮추면 브랜드 전체가 손해를 볼 수 있습니다. 계약은 이 이해관계를 조정하려는 장치입니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">로열티 150만 원이 점주의 순이익과 무관할 수 있다는 점이 보입니다. 각 나라의 공시에서 이 조건을 어떻게 확인하는지 살핍니다.</p>
      </section>
      <section id="comparison" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">공시 제도는 나라가 달라도 수익률 보증은 아닙니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">미국 FTC Franchise Rule은 계약·지급 전에 Franchise Disclosure Document를 제공하도록 하고 23개 항목을 요구합니다. 한국 공정거래위원회 정보공개서는 점포 수·평균 매출 등 비교 자료를 담지만 평균 매출은 점주 순이익이 아닙니다. 유럽연합은 프랜차이즈 계약의 수직적 제한을 경쟁법의 틀에서 살핍니다.</p>
          <p className="leading-7">비교할 때는 같은 업종과 연식의 점포 수, 폐점·양도, 본부와 점주의 매출 구분, 공급품 가격, 영업 구역, 갱신 조건을 확인합니다. 각국 공시·규제의 범위는 다르므로 현지 원문을 봐야 합니다.</p>
        </div>
        <SourceApplication source="US FTC · Consumer Guide to Buying a Franchise, Royalties" excerpt="you must pay royalties for the right to use the franchisor’s name, even if you are losing money" application="월매출 3천만 원의 5%인 150만 원은 가맹본부에 지급하는 금액입니다. 원재료 1천만 원과 월세 300만 원 등 나머지 비용 뒤 점주가 적자여도 로열티 계약은 따로 작동할 수 있습니다." />
        <CitationBlock source="US FTC Franchise Rule" citeKey={1} href="https://www.ftc.gov/legal-library/browse/rules/franchise-rule">미국 가맹사업 공시 규칙의 원문입니다.</CitationBlock>
        <CitationBlock source="US FTC Consumer Guide to Buying a Franchise" citeKey={2} href="https://www.ftc.gov/business-guidance/resources/consumers-guide-buying-franchise">미국의 FDD 14일 사전 제공과 항목별 검토를 설명합니다.</CitationBlock>
        <CitationBlock source="한국 공정위 가맹 정보공개서 비교" citeKey={3} href="https://franchise.ftc.go.kr/firHope/comparePopup.do">한국의 점포 수·평균 매출·비용 비교 항목을 확인합니다.</CitationBlock>
        <CitationBlock source="EU Vertical Guidelines 2022" citeKey={4} href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=intcom%3AC%282022%294238">유럽연합 수직 계약·가맹 제한의 경쟁법 해석 자료입니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">공시와 실제 점포 손익의 차이를 알았다면 새 점포 수만으로 성공을 판단하기 어렵습니다. 평균 뒤에 숨은 점포별 차이를 봅니다.</p>
      </section>
      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">평균 매출이 높아도 점주 한 사람의 삶은 다를 수 있습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">평균에는 오래된 우량점과 신생점이 섞입니다. 자기 노동을 임금으로 계산하지 않거나 가족 노동을 공짜로 쓰면 순이익이 과장됩니다. 폐점한 점포가 표본에 없는지와 추정 방법도 확인해야 합니다.</p>
          <p className="leading-7">브랜드 인지도가 손님을 모아도 임대료가 비싸거나 근처에 새 가맹점이 열리면 점주 몫은 줄어듭니다. 매출 예상은 계약 책임과 별개의 가정으로 읽어야 합니다.</p>
        </div>
        <ReviewPrompts questions={[
          "점포 매출이 커져도 가맹점주와 본부가 같은 비율로 좋아질까요? 돈을 받는 조항을 먼저 찾아보세요. (답: 2절)",
          "가맹점 수 증가가 기존 점포의 수익성을 보장하지 않는 이유는 무엇일까요? (답: 4절)",
        ]} />
      </section>
    </div>
  );
}
