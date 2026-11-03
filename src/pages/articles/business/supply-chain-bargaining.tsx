import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 공식 자료 확인: 2026-10-04. 금액 사례는 본문에 표시한 가정입니다. */
export default function SupplyChainBargainingArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1. 만든 사람과 가격을 정하는 사람이 왜 다른가</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">제품은 여러 사람의 작업을 거쳐 손님에게 도착합니다. 그중 어느 회사가 더 많은 몫을 갖는지는 손으로 한 일이 얼마나 많은지뿐 아니라 다른 회사가 그 역할을 바꿀 수 있는지에 달려 있습니다.</p>
          <p className="leading-7">한 물건에 지불한 돈을 생산과 이동과 판매로 따라가면 기업의 힘과 국가의 교역 통계가 함께 보입니다. 같은 물건이 국경을 여러 번 넘었다고 새 가치가 그때마다 전액 생기는 것은 아닙니다.</p>
        </div>

        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">가격과 작업량이 다른 질문임을 알았다면 생산부터 판매까지 역할을 나눕니다.</p>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2. 만드는 곳, 옮기는 곳, 고객을 만나는 곳을 연결한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">만드는 곳은 요구된 물건을 제때 내놓습니다. 옮기는 곳은 국경과 거리를 지나 필요한 장소에 도착시킵니다. 판매하는 곳은 고객을 찾고 남은 물건을 팔 책임을 집니다. 어느 연결이 끊기는지에 따라 다른 회사가 지불할 의향도 달라집니다.</p>
        </div>

        <FlowRail title="생산에서 판매까지의 세 역할" steps={[{"actor": "누가 만드나", "movement": "요구된 물건을 준비합니다.", "receives": "출하 물건"}, {"actor": "어디로 옮기나", "movement": "필요한 곳까지 전달합니다.", "receives": "판매할 물건"}, {"actor": "누가 팔 수 있나", "movement": "고객을 찾아 주문과 반품을 받습니다.", "receives": "판매대금"}]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">제품을 전달하는 세 단계를 잡았으므로 국경마다 다른 가격을 넣어 봅니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3. 손님이 낸 100달러와 공장 출하 60달러를 구분한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">최종 소비가격 100달러를 제조단계 60달러, 이후 국제 물류 10달러, 판매·브랜드 단계 30달러로 나눕니다. 제조 60달러 안에는 다른 나라에서 들여온 부품 40달러와 조립국이 더한 20달러가 있습니다. 세금 등은 생략했으며 모두 (가정)입니다.</p>
          <p className="leading-7">40달러는 전부 다른 나라에서 더한 가치이고 조립국의 가치가 되돌아 들어온 부분은 없다고 놓습니다. 조립에는 이 부품 외에 별도 중간재 구매가 없으며 출하가격 60달러를 이 사례의 수출 통계 가격과 같게 둡니다. 현실의 공장 거래가격·세관 평가액·부가가치 통계가 항상 이렇게 일치하는 것은 아닙니다.</p>
          <p className="leading-7">조립국에서 나갈 때의 거래가격은 이 사례에서 60달러입니다. 최종 소비자가 낸 100달러를 조립국의 수출액으로 그대로 쓰지 않습니다. 조립국이 더한 20달러도 회사의 순이익만이 아니라 노동과 자본 등에 돌아갈 몫을 포함합니다.</p>
        </div>

        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">100달러 최종가격과 60달러 출하가격을 구별했습니다. 중간에 더해진 몫을 그립니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 국경 화살표와 새로 더한 몫을 따로 표시한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">부품 40달러가 조립국에 들어와 20달러만큼 더해져 60달러가 됩니다. 뒤의 물류와 판매 몫을 붙여야 최종 100달러가 되므로 최종가격과 중간 국경 가격은 비교 기준이 다릅니다.</p>
        </div>
        <FlowRail
          title="(가정) 최종소비 100달러, 수입부품 40달러 + 국내 조립 20달러, 물류 10달러, 유통·브랜드 30달러"
          steps={[
            { actor: "부품·조립 업체", movement: "40달러 부품에 20달러를 더해 출하합니다.", receives: "계약상 제조대금 60달러" },
            { actor: "물류·통관", movement: "국경을 넘어 운송과 통관을 수행합니다.", receives: "운송대금 10달러" },
            { actor: "브랜드·판매자", movement: "규격과 고객 접점을 정하고 재고를 팝니다.", receives: "나머지 30달러에서 마케팅·위험 비용 지급" },
          ]}
        />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">40달러 위에 20달러가 더해진 모습을 보면 누가 그 몫을 정하는지 물을 수 있습니다.</p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 대체할 수 없는 역할이 계약의 가격을 바꾼다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">조립회사가 둘이고 어느 쪽이든 같은 품질을 낸다면 주문자는 생산을 옮길 선택지가 있습니다. 반대로 특정 부품을 한 곳에서만 받을 수 있으면 그 회사가 멈추었을 때 60달러 제품을 완성하지 못합니다.</p>
          <p className="leading-7">그래서 싸게 만드는 능력 외에 인증을 다시 받는 시간, 새 설비를 맞추는 돈, 판매할 고객을 확보하는 일이 협상에 들어옵니다. 판매단계의 30달러도 광고·반품·재고 부담을 내기 전 금액이어서 크다는 이유만으로 전부 독점이익이라고 단정할 수 없습니다.</p>
        </div>

        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">대체 가능성이 조건을 바꾸는 이유를 알았다면 세 가지 이름을 붙입니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. 단계별 가치와 대체 가능성에 이름을 붙인다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">여러 나라의 생산과 판매 단계가 이어지는 구조를 글로벌 가치사슬이라고 합니다. 가치가 더해지는 일을 사슬처럼 이어 본다는 뜻입니다.</p>
          <p className="leading-7">생산한 금액에서 그 생산에 사 쓴 중간재와 서비스를 뺀 금액이 부가가치입니다. 추가 중간투입을 생략한 이 사례에서는 조립국의 60달러에서 외국 부품 40달러를 빼 국내 몫 20달러를 얻습니다. 그 20달러에는 임금과 자본 등에 돌아갈 몫이 있어 회사의 순이익과 다릅니다.</p>
          <p className="leading-7">거래 조건을 자기에게 유리하게 정할 수 있는 힘을 협상력이라고 합니다. 공장 크기 자체보다 대체 상대, 변경 비용, 규격과 고객 접근을 누가 통제하는지로 시험합니다.</p>
        </div>

        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">가치사슬과 부가가치, 협상력을 구분했으니 같은 제품의 계약을 추적합니다.</p>
      </section>
      <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. 통제 지점을 찾으면 이익이 어디에 남는지 보입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">부품업체가 40달러를 받고 조립국 업체가 20달러를 더해 60달러에 출하합니다. 10달러 이동 비용을 거쳐 판매단계가 30달러를 더하면 고객 가격은 100달러가 됩니다. 40달러 부품과 60달러 완제품이 각각 국경을 넘었다고 두 수출액 합계 100달러를 전부 새로 만든 가치라 읽지 않습니다.</p>
          <p className="leading-7">
            계약에서는 같은 물건의 규격을 누가 승인하고 불량이 났을 때 누구에게 비용을 청구하는지 추적합니다. 국제 운송 중 손상과 지연을 누가 부담하는지, 결제 통화와 지급 기한은
            무엇인지도 확인합니다. 최종 판매가격이 변하지 않아도 이 조건이 바뀌면 60·10·30달러 사이의 몫은 바뀔 수 있습니다.
          </p>
        </div>

        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">60달러와 100달러를 다른 경계에서 읽었습니다. 통계의 원문 분류와 맞춰 봅니다.</p>
      </section>
      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8. OECD 통계가 분리하려는 것은 수출액 안의 출처다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">출하가격 60달러를 수출 통계에 적는 일과 어느 나라가 얼마를 더했는지 적는 일은 다른 장부입니다. OECD의 부가가치 무역 안내는 다음을 별도 지표로 둡니다.</p>
        </div>
        <SourceApplication source="OECD TiVA · About, indicator list" excerpt="Domestic and foreign value added content of gross exports by exporting industry" application="단순 사례의 조립국 총수출 60달러를 외국 부품 40달러와 국내에서 더한 20달러로 나눕니다. 실제 통계는 부품 안에 재수입된 자국 가치 등이 섞이므로 기업 송장 하나의 뺄셈보다 넓은 산업연관 자료가 필요합니다." />
        <p className="mt-5 leading-7">여기서 조립국 수출의 국내 몫 비율은 20÷60으로 약 33.3%입니다. 최종 소비가격 100달러로 나눈 20%는 다른 분모의 숫자입니다. 물류의 10달러와 판매의 30달러도 그 회사가 사 쓴 중간 서비스 비용을 확인하기 전에는 전부 부가가치라고 부르지 않습니다.</p>
        <CitationBlock source="OECD TiVA · About, indicator list" citeKey={1} href="https://www.oecd.org/en/topics/sub-issues/trade-in-value-added.html">2026-10-04 확인. 원문 문구와 위 사례 적용의 근거입니다.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
            수출의 국내외 몫을 나눴습니다. 정책 변화가 생산과 판매에 어떻게 전해지는지 봅니다.
          </p>
      </section>
      <section id="comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. 국가의 산업정책도 같은 권한 지도를 바꿉니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">세계은행의 국제 생산망 설명을 같은 100달러 제품에 적용하면 한 나라의 비용 상승이 다른 나라의 계약에 전달되는 경로를 볼 수 있습니다. 한국·미국·중국 같은 국가나 유럽이라는 지역 이름만으로 제조·설계·규제 역할을 고정하면 같은 나라 안 기업들의 서로 다른 권한을 놓칩니다.</p>
          <p className="leading-7">관세·수출통제·보조금·표준 인증은 특정 단계의 비용과 교체 가능성을 바꿉니다. 완제품을 들여오는 판매자가 과세가격 60달러에 10% 관세를 부담하는 경우를 추가로 가정해 봅시다. 실제 국가·품목의 세율이나 평가액을 제시한 것이 아니며 다른 세금과 비용 변화는 생략합니다.</p>
          <p className="leading-7">여기서 과세가격 60달러는 운임을 뺀 금액이라고 가정합니다. WTO 관세평가협정 제8조 제2항은 수입항까지의 운송비, 적재·하역·취급비, 보험료를 과세가격에 넣을지 뺄지를 회원국이 법으로 정하게 하므로, 물류 10달러를 과세가격에 넣는 나라라면 같은 10% 관세가 70 × 0.1 = 7달러가 됩니다.</p>
          <p className="leading-7">운임을 빼는 나라라면 관세는 6달러입니다. 제조대금 60달러와 물류 10달러, 소비가격 100달러가 그대로라면 판매 단계에 남는 금액은 30달러에서 24달러가 됩니다. 60 + 10 + 6 + 24 = 100입니다. 반대로 판매 단계가 기존 30달러를 유지하고 추가 비용 전부를 고객에게 넘길 수 있다면 소비가격은 106달러가 됩니다. 어느 경로가 실제로 가능한지는 계약과 경쟁, 고객의 반응에 달립니다.</p>
          <p className="leading-7">미국 CBP 안내에서 수입 신고와 관세·세금·수수료에 최종 책임을 지는 주체는 importer of record입니다. 세관에 납부할 책임이 누구에게 있는지와 가격 조정을 거쳐 비용을 최종적으로 누가 떠안는지는 별도 질문입니다. 위의 6달러가 외국 공장에 자동 청구된다고 읽지 않습니다.</p>
        </div>
        <SourceApplication source="World Bank WDR 2020 · About" excerpt="Public policies and economic conditions in one country strongly affect trade partners through production linkages" application="같은 60달러 완제품에 가정의 관세 6달러가 붙으면 판매 단계 몫이 24달러로 줄거나 소비가격이 106달러가 되는 경로를 비교합니다. 실제 부담은 재고 소유와 가격 조정 조항, 경쟁과 대체 공급자에 달립니다. 이 두 경로는 설명용 계산이며 보고서의 추정치가 아닙니다." />
        <CitationBlock source="World Bank WDR 2020 · About" citeKey={2} href="https://www.worldbank.org/en/publication/wdr2020">2026-10-04 확인. 이 절의 원문과 관할 범위를 확인합니다.</CitationBlock>
        <CitationBlock source="World Bank · Global Value Chains" citeKey={3} href="https://www.worldbank.org/ext/en/topic/trade/global-value-chains">Context의 여러 나라 투입과 단계별 생산, Strategy의 물류·무역·투자·표준 등 정책 연결을 확인했습니다. 국가마다 한 가지 역할이 고정된다는 자료는 아닙니다.</CitationBlock>
        <CitationBlock source="US CBP · Tips for New Importers and Exporters" citeKey={4} href="https://www.cbp.gov/trade/basic-import-export/importer-exporter-tips">통관업자를 쓰더라도 importer of record의 신고 정확성과 관세·세금·수수료 책임이 남는다는 공식 본문을 확인했습니다. 사례의 10% 세율과 60달러 과세가격은 이 자료에서 가져온 실제 수치가 아닙니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
            정책 변화가 전해지는 경로를 확인했습니다. 어느 나라에 이익이 남는지는 더 따져 봐야 합니다.
          </p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10. 공급망 재편이 곧 한 국가의 승리라는 결론은 빠릅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">생산지를 옮기면 운송 거리·인건비·정치 위험이 달라지지만 새 공장의 수율과 공급자 생태계가 따라와야 합니다. 공장 숫자가 늘어도 수입 중간재 비중이 높으면 국내 부가가치 증가가 작을 수 있습니다.</p>
          <p className="leading-7">시장 지배력의 원인을 찾을 때는 특허, 병목 장비, 전환 비용, 고객 계약, 규제 승인을 따로 시험합니다. 가격 인상 한 번만으로 누가 계속 이길지 알 수 없습니다.</p>
        </div>

        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">공장 수와 수출 총액뿐 아니라 대체 가능성과 국내에 더해진 가치를 함께 보아야 합니다.</p>

        <ReviewPrompts questions={["조립국 출하 60달러 중 국내 몫이 20달러라면 수출의 국내 몫 비율은 얼마이며 최종가격 100달러를 분모로 써도 될까요? (답: 8절)", "판매 단계 30달러가 조립국이 더한 20달러보다 크다는 이유만으로 순이익이나 협상력을 확정할 수 있을까요? (답: 5절)", "완제품 수입 관세 6달러가 추가돼도 소비가격이 100달러로 유지된다면 같은 제조·물류 비용 뒤 판매 단계 몫은 얼마일까요? (답: 9절)"]} />
      </section>
    </div>
  );
}
