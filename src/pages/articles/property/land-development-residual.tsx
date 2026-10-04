import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 공식 자료 확인: 2026-10-04. 금액 사례는 본문에 표시한 가정입니다. */
export default function LandDevelopmentResidualArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1. 완공 뒤 받을 돈에서 땅에 줄 돈을 거꾸로 구한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">땅을 산 뒤 건물을 지어 팔려면 완공 전까지 여러 사람이 먼저 돈과 시간을 내야 합니다. 나중에 팔 가격이 높아 보인다는 이유만으로 지금 땅에 같은 금액을 지불할 수는 없습니다.</p>
          <p className="leading-7">
            개발사업을 검토할 때는 최종 판매대금에서 공사비와 회수할 때까지 필요한 돈을 먼저 뺍니다. 그 계산이 가능해도 원하는 규모를 지을 수 있는지와 실패했을 때 남는 빚을 따로
            확인해야 합니다.
          </p>
        </div>

        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
            판매대금에서 어떤 돈을 빼야 할지 살펴봤습니다. 이제 개발 과정의 역할을 나눕니다.
          </p>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2. 지을 권리, 만드는 비용, 팔아서 회수하는 순서다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">먼저 어떤 건물을 어느 규모로 지을 수 있는지 확인합니다. 그 조건에 맞춰 돈을 구하고 공사를 진행합니다. 완성한 공간을 팔거나 임대해 비용을 회수합니다. 팔 가격과 회수 날짜가 불확실한데 앞의 지출은 먼저 확정되는 구조입니다.</p>
        </div>

        <FlowRail title="개발 계획에서 회수까지의 세 역할" steps={[{"actor": "무엇을 지을 수 있나", "movement": "현지의 허용 조건을 확인합니다.", "receives": "계획 가능한 규모"}, {"actor": "무엇을 먼저 쓰나", "movement": "돈을 마련해 시설을 만듭니다.", "receives": "완공한 공간"}, {"actor": "언제 회수하나", "movement": "매각하거나 빌려줘 돈을 받습니다.", "receives": "회수액과 시점"}]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">허가부터 회수까지의 순서에 작은 개발 사례를 넣습니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3. 100억 원에서 70억 원과 15억 원을 뺀다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">완공한 상태의 매각액 100억 원, 토지를 제외한 공사·금융·판매 등 개발비 70억 원, 개발업자가 요구하는 이익 15억 원을 둡니다. 같은 기준일의 가격·비용 수준을 사용하고 월별 지급 시점의 할인은 생략한 단순 사업 예산입니다. 금액과 사업은 모두 (가정)이며 계산 결과를 오늘의 토지 시장가격으로 쓰지는 않습니다.</p>
          <p className="leading-7">100억 원에서 70억 원과 15억 원을 빼면 토지와 그 취득에 쓸 수 있는 잔여는 15억 원입니다. 공사 등을 합친 비용이 80억 원이 되면 잔여는 5억 원으로 줄어듭니다. 원래 15억 원을 토지 매도자에게 모두 줄 수 있다는 뜻은 아닙니다.</p>
          <p className="leading-7">취득에 드는 세금·법률·중개 비용 합계가 별도로 2억 원이라고 가정하면 매도자에게 배정할 예산은 15억 − 2억 = 13억 원입니다. 2억 원은 특정 국가의 세율을 적용한 값이 아닙니다. 요구 이익 15억 원도 확정 수입이나 외부에 지급할 청구서가 아니라 개발업자가 남기려는 목표입니다.</p>
        </div>

        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">15억 원은 가정 뒤에 남은 금액입니다. 돈이 먼저 나가는 순서를 그립니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 나중의 수입과 먼저 확정할 비용을 연결한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">매각대금의 화살표는 공사 뒤에 도착합니다. 토지대금과 공사비의 지급일을 따로 놓으면 한 시점의 뺄셈으로는 부족한 중간 자금이 보입니다.</p>
        </div>
        <FlowRail
          title="(가정) 토지·취득 15억 원과 개발비 70억 원을 지출하고 100억 원을 회수한다"
          steps={[
            { actor: "취득할 때", movement: "개발업자 → 토지 매도자 13억 원, 취득 관련 상대방 2억 원을 배정합니다.", receives: "조건이 충족되면 개발업자가 토지를 취득합니다. 합계 15억 원입니다." },
            { actor: "설계·허가·공사·판매 과정", movement: "개발업자 → 시공사·금융기관 등: 나머지 70억 원을 계약과 지급일에 따라 나눠 냅니다.", receives: "개발업자가 완공한 공간과 필요한 서비스를 받습니다. 지급일은 하나가 아닙니다." },
            { actor: "매각대금을 받을 때", movement: "완공 부동산 매수자 → 개발업자: 100억 원을 지급합니다.", receives: "지출 합계 85억 원을 뺀 15억 원이 남습니다. 모든 가정이 맞았을 때의 결과입니다." },
          ]}
        />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
            입금과 지출 날짜가 다르다는 점을 확인했습니다. 허가 조건과 공사 지연이 비용을 어떻게 바꾸는지 봅니다.
          </p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 허가와 시간은 숫자 밖의 조건이 아니라 숫자를 바꾼다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">계획한 면적을 지을 수 없으면 100억 원 매각 가정부터 달라집니다. 도로와 전기·수도 연결 비용이 빠져 있으면 70억 원도 과소 계산입니다. 도면과 허가 조건이 숫자의 근거가 되어야 합니다.</p>
          <p className="leading-7">완공이 늦으면 같은 100억 원을 받아도 이자와 관리비가 더 들어갑니다. 공사비 지급을 버티지 못하면 팔기 전에 사업이 멈출 수 있으므로 매각 총액과 월별 자금 계획을 함께 만들어야 합니다.</p>
        </div>

        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
            허가 조건과 일정에 따라 숫자가 달라지는 이유를 살펴봤습니다. 이제 이 계산에 쓰는 용어를 정리합니다.
          </p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. 완공 가치에서 땅값을 구하는 계산의 이름</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">RICS 지침은 평가일에 이미 개발이 끝났다고 가정한 부동산의 시장가치를 총개발가치, GDV라고 설명합니다. 이 글에서는 그 자리에 100억 원을 넣었습니다. 미래 시장가격이 반드시 100억 원이 된다거나 세후 순이익이 100억 원이라는 뜻은 아닙니다.</p>
          <p className="leading-7">완공 가치에서 개발비와 필요한 이익을 빼 남은 값을 구하는 방법이 잔여법입니다. 15억 원은 입력 가정의 결과이지 토지의 확정 거래가격이 아닙니다.</p>
          <p className="leading-7">
            국토계획법상 일정 개발행위를 할 수 있는지 판단하는 허가가 개발행위허가입니다. 토지 소유권과 구분해야 하며 건축허가 등과는 의제·협의 절차로 연결될 수 있습니다.
          </p>
        </div>

        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
            용어를 구분했으니 같은 100억 원 계획을 실행 순서에 따라 계산해 봅니다.
          </p>
      </section>
      <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. 소유권·허가·인프라·시간을 각각 확인합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">처음에는 100억 원에 팔 수 있는 용도와 면적을 계획 도면으로 확인합니다. 소유권과 실제 경계, 도로 접근, 오염과 기존 점유자의 권리를 조사해 땅을 실제로 쓸 수 있는지 봅니다. 지역 계획과 기반시설 연결 조건을 확인한 뒤 비용 70억 원의 항목을 채웁니다.</p>
          <p className="leading-7">설계·인허가와 공사, 기반시설, 세금·금융·판매, 예비비를 지급 시점에 놓습니다. 여기서 70억 원은 공사비 하나가 아니라 토지를 제외한 비용의 합계입니다. 토지와 취득에 남은 15억 원을 계산한 뒤에는 허가·자금조달·토질 조사 결과에 따른 계약 진행 조건과 불성립 시 계약금 처리를 정합니다.</p>
          <p className="leading-7">같은 계획에서 매각액만 90억 원으로 낮추면 90 − 70 − 15 = 5억 원이 토지·취득 예산으로 남습니다. 비용만 80억 원으로 올려도 100 − 80 − 15 = 5억 원입니다. 두 일이 함께 생기면 90 − 80 − 15 = −5억 원입니다. 이 값은 토지의 실제 거래가격이 음수라는 뜻이 아니라 이 조건에서 양의 토지대금을 내면서 목표 이익까지 남길 예산이 없다는 뜻입니다.</p>
          <p className="leading-7">이번에는 회수가 6개월 늦어지는 경우를 봅니다. 그동안 대출 잔액 50억 원이 유지되고 연 8%의 단리만 추가된다면 이자는 50억 × 0.08 × 6/12 = 2억 원입니다. 수수료·추가 관리비·복리는 제외한 (가정)입니다. 비용 합계가 72억 원이 되므로 목표 이익 15억 원을 유지할 토지·취득 예산은 13억 원으로 줄어듭니다.</p>
          <p className="leading-7">
            이미 토지와 취득에 15억 원을 썼다면 과거 지급액은 저절로 줄지 않습니다. 같은 지연에서 실제 남는 돈은 100 − 72 − 15 = 13억 원으로 계산합니다. 앞 계산에서는
            이익 15억 원을 고정해 토지 예산을 구했습니다. 이번에는 토지 지출 15억 원을 고정해 이익을 구했습니다.
          </p>
          <p className="leading-7">월별 현금을 할인해 평가할 때는 누구에게 돌아가는 돈인지도 맞춥니다. RICS 부록 B1.2.8~9는 차입금과 이자를 제외한 사업 현금을 사업의 목표 수익률로 평가하는 방식과, 차입·상환·이자를 반영한 자기자본 현금을 그 위험에 맞춰 평가하는 방식을 구분합니다. 이 글의 금융비 포함 70억 원과 정액 목표 이익 15억 원에 임의의 할인율을 덧붙여 완성된 평가로 처리하지 않습니다.</p>
        </div>

        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">15억 원을 지출하기 전에 확인할 조건이 정해졌습니다. 잔여법 원문으로 계산을 검증합니다.</p>
      </section>
      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8. RICS 원문의 빼기 순서에 같은 숫자를 넣는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">잔여법은 예상한 완공 가치에서 비용과 요구이익을 빼 토지 취득에 쓸 수 있는 돈을 계산합니다. RICS 2019 지침의 6.1.1절, 인쇄 24쪽에 실린 원문을 그대로 읽습니다.</p>
        </div>
        <SourceApplication source="RICS Valuation of development property · 6.1.1, p.24" excerpt="gross development value (GDV) - total development costs (including profit) = residual land value" application="100−(70+15)=15억 원입니다. 인용한 식은 비용에 이익을 포함하므로 70억 원과 15억 원을 각각 한 번 뺍니다. 반면 이 지침의 용어집은 total development cost를 토지와 이익 제외로 정의합니다. 표 제목만 보지 말고 해당 식의 포함 범위를 확인합니다." />
        <div className="prose prose-neutral mt-5 max-w-none dark:prose-invert">
          <p className="leading-7">이 뺄셈만으로 시점 조정까지 끝난 것은 아닙니다. 지침 부록 B3은 기본 잔여모형의 완공 시점 잔여를 평가일로 환산하고 취득 부대비용을 빼는 과정을 설명합니다. 할인 현금흐름 방식은 시점별 현금의 현재가치에서 출발합니다. 위 15억 원과 매도자 예산 13억 원은 계산 순서를 보여 주는 단순 예산으로 읽어야 합니다.</p>
        </div>
        <CitationBlock source="RICS Valuation of development property · 2019" citeKey={1} href="https://www.rics.org/content/dam/ricsglobal/documents/to-be-sorted/valuation-of-development-property---first-edition.pdf">실제 PDF의 용어집, 6.1~6.3절, 7.1절, 부록 B1.2.8~9와 B3을 확인했습니다. 인쇄 24쪽의 식도 화면으로 대조했습니다.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">개발비에 이익을 한 번 포함하는 원문 계산을 확인했습니다. 현지 허가가 입력을 바꾸는지 봅니다.</p>
      </section>
      <section id="comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. 나라별 계획권은 다르지만 먼저 허가와 현금의 순서를 봅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">한국 국토계획법의 개발행위허가와 건축법의 건축허가는 검토하는 법적 근거가 다릅니다. 다만 일정 요건에서는 건축허가 과정의 의제와 협의로 함께 처리될 수 있으므로 무조건 두 번 순차 신청한다고 이해하면 안 됩니다. 지을 수 있는 면적과 기반시설 조건은 지역 계획과 조례에서 확인합니다.</p>
          <p className="leading-7">
            잉글랜드의 GOV.UK 안내에서도 계획 허가와 건축 규정 승인을 따로 확인하도록 설명합니다. 한쪽 절차만으로 다른 쪽이 끝나는 것은 아니며 두 가지가 모두 필요할 수 있습니다.
            한국의 인허가 의제 절차를 그대로 옮겨 읽지 않고 그 지역 담당기관에 같은 계획의 용도·규모와 공사 조건을 확인합니다.
          </p>
          <p className="leading-7">
            RICS 2019 지침의 잔여법은 계산의 구조를 확인하는 근거로 사용합니다. 2026년 개별 감정평가에 필요한 최신 전문기준 전체를 대신하지 않으며 거래 비교와 현금 지급시점을
            함께 검토해야 합니다.
          </p>
        </div>
        <SourceApplication source="한국 국토계획법 제56조 제1항 제2호" excerpt="토지의 형질 변경" application="100억 원 매각을 기대하며 15억 원을 토지와 취득에 배정해도 땅을 깎고 메우는 행위의 허가 여부를 먼저 확인합니다. 허가 조건 때문에 도로·배수 비용이 10억 원 더 필요하면 다른 가정이 같을 때 잔여는 5억 원으로 줄어듭니다." />
        <CitationBlock source="한국 국토계획법 제56~58조" citeKey={2} href="https://www.law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1016204783">2026-07-01 시행 제56~58조를 읽었습니다. 형질 변경의 허가와 예외, 기반시설 등 조건, 규모·계획·환경 기준을 함께 확인합니다.</CitationBlock>
        <CitationBlock source="한국 건축법 제11조" citeKey={5} href="https://www.law.go.kr/LSW/lsSideInfoP.do?lsiSeq=273437&amp;joNo=0011&amp;joBrNo=00&amp;docCls=jo&amp;urlMode=lsScJoRltInfoR">2026-02-27 시행 제11조의 제3·5·6항을 읽었습니다. 구비서류, 개발행위허가 의제와 관계기관 사전 협의를 함께 확인합니다.</CitationBlock>
        <CitationBlock source="GOV.UK · Planning permission" citeKey={6} href="https://www.gov.uk/planning-permission-england-wales">신축·주요 변경·용도 변경과 관할 계획기관 확인을 설명하는 안내입니다. 영국 내 다른 지역의 제도는 별도 링크로 안내합니다.</CitationBlock>
        <CitationBlock source="GOV.UK · Building regulations approval" citeKey={7} href="https://www.gov.uk/building-regulations-approval">계획 허가와 건축 규정 승인이 다르며 둘 다 필요할 수 있음을 실제 본문에서 확인했습니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
            허가 조건이 토지 예산을 바꾸는 과정을 봤습니다. 마지막으로 계획을 실행하지 못하게 하는 조건을 확인합니다.
          </p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10. 개발 호재라는 말에는 확률과 비용이 빠져 있습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">도로가 새로 나면 접근성이 좋아질 수 있지만 사업비 분담이나 토지 수용, 입지 경쟁도 바뀝니다. 허가 가능성이 높아도 공사비와 금융비가 오르면 땅에 남는 몫이 줄어듭니다.</p>
          <p className="leading-7">토지 등기와 경계가 맞는지 확인합니다. 오염과 기존 임차인의 권리, 설정된 담보권도 조사해야 합니다. 이를 빼먹은 잔여 계산은 숫자가 맞아도 실행할 수 없는 계획이 됩니다.</p>
          <p className="leading-7">계약 전에 허가와 금융 조달에 실패했을 때 계약을 해제하고 어느 돈을 돌려받을지 정합니다.</p>
        </div>

        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">잔여값이 커도 토지 권리와 허가, 자금 일정이 맞아야 실행 가능한 계획이 됩니다.</p>

        <ReviewPrompts questions={["매각액 100억 원에서 비용 70억 원과 목표 이익 15억 원을 빼고, 취득 부대비용이 2억 원이라면 매도자에게 배정할 예산은 얼마인가요? (답: 3절)", "이 개발사업에서 6개월 지연으로 이자 2억 원이 늘었다면, 토지를 사기 전의 예산과 이미 취득에 15억 원을 쓴 뒤의 이익은 각각 어떻게 바뀌나요? (답: 7절)", "허가 조건의 도로·배수 비용 10억 원을 빠뜨렸다면 같은 매각액에서 토지·취득에 배정할 돈은 어떻게 바뀔까요? (답: 9절)"]} />
      </section>
    </div>
  );
}
