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
          <p className="leading-7">개발 판단은 최종 판매대금에서 공사와 기다림에 필요한 돈을 빼는 데서 시작합니다. 그 계산이 가능해도 원하는 규모를 지을 수 있는지와 실패했을 때 남는 빚을 따로 확인해야 합니다.</p>
        </div>

        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">나중의 판매대금에서 먼저 쓸 돈을 빼는 방향을 잡았습니다. 사업의 역할을 나눕니다.</p>
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
          <p className="leading-7">완공 후 매각액 100억 원, 토지를 제외한 공사·금융·판매 등 개발비 70억 원, 개발업자가 요구하는 이익 15억 원을 둡니다. 같은 기준일의 단순 계산이며 금액과 사업은 모두 (가정)입니다. 토지 취득 부대비용도 땅에 배정할 금액 안에서 추가 검토해야 합니다.</p>
          <p className="leading-7">100억 원에서 70억 원과 15억 원을 빼면 토지와 그 취득에 쓸 수 있는 잔여는 15억 원입니다. 공사 등을 합친 비용이 80억 원이 되면 잔여는 5억 원으로 줄어듭니다. 원래 15억 원을 토지 매도자에게 모두 줄 수 있다는 뜻은 아닙니다.</p>
        </div>

        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">15억 원은 가정 뒤에 남은 금액입니다. 돈이 먼저 나가는 순서를 그립니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 나중의 수입과 먼저 확정할 비용을 연결한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">매각대금의 화살표는 공사 뒤에 도착합니다. 토지대금과 공사비의 지급일을 따로 놓으면 한 시점의 뺄셈으로는 부족한 중간 자금이 보입니다.</p>
        </div>
        <FlowRail
          title="(가정) 완공 매각 100억 원, 공사·금융·판매 70억 원, 요구 이익 15억 원"
          steps={[
            { actor: "토지 소유자", movement: "땅을 매각하거나 개발권을 계약합니다.", receives: "토지대금" },
            { actor: "개발업자", movement: "허가·자금·공사를 조정하고 실패 위험을 집니다.", receives: "성공하면 잔여 이익" },
            { actor: "행정기관·시공사", movement: "허가 기준과 공사 계약을 집행합니다.", receives: "공공 기준 충족·공사대금" },
          ]}
        />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">입금과 지출 날짜가 달라지는 모습을 봤다면 허가와 지연 비용을 따질 수 있습니다.</p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 허가와 시간은 숫자 밖의 조건이 아니라 숫자를 바꾼다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">계획한 면적을 지을 수 없으면 100억 원 매각 가정부터 달라집니다. 도로와 전기·수도 연결 비용이 빠져 있으면 70억 원도 과소 계산입니다. 도면과 허가 조건이 숫자의 근거가 되어야 합니다.</p>
          <p className="leading-7">완공이 늦으면 같은 100억 원을 받아도 이자와 관리비가 더 들어갑니다. 공사비 지급을 버티지 못하면 팔기 전에 사업이 멈출 수 있으므로 매각 총액과 월별 자금 계획을 함께 만들어야 합니다.</p>
        </div>

        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">허가와 시간이 입력 숫자를 바꾸는 이유를 알았으므로 평가 용어를 붙입니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. 완공 가치에서 땅값을 구하는 계산의 이름</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">완공한 부동산을 처분할 것으로 예상하는 총액을 총개발가치, GDV라고 합니다. 이 글의 100억 원이며, 세후 순이익과는 다릅니다.</p>
          <p className="leading-7">완공 가치에서 개발비와 필요한 이익을 빼 남은 값을 구하는 방법이 잔여법입니다. 15억 원은 입력 가정의 결과이지 토지의 확정 거래가격이 아닙니다.</p>
          <p className="leading-7">국토계획법상 일정 개발행위를 할 수 있는지 판단하는 허가가 개발행위허가입니다. 토지 소유권과 구분해야 하며, 건축허가 등과는 의제·협의 절차로 연결될 수 있습니다.</p>
        </div>

        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">총개발가치와 잔여법을 구분했으니 같은 100억 원 계획을 실행 순서로 따라갑니다.</p>
      </section>
      <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. 소유권·허가·인프라·시간을 각각 확인합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">처음에는 100억 원에 팔 수 있는 용도와 면적을 계획 도면으로 확인합니다. 소유권과 실제 경계, 도로 접근, 오염과 기존 점유자의 권리를 조사해 땅을 실제로 쓸 수 있는지 봅니다. 지역 계획과 기반시설 연결 조건을 확인한 뒤 비용 70억 원의 항목을 채웁니다.</p>
          <p className="leading-7">설계·인허가와 공사, 기반시설, 세금·금융·판매, 예비비를 지급 시점에 놓습니다. 이미 금융비를 70억 원에 포함했다면 할인 현금흐름에서 자금비용을 같은 방식으로 다시 빼지 않도록 평가 기준을 일관되게 정합니다.</p>
          <p className="leading-7">토지와 취득에 남은 15억 원을 계산한 뒤 계약 조건을 정합니다. 허가·자금조달·토질 조사 결과에 따라 거래를 진행할지와 불성립 시 계약금을 어떻게 처리할지 명시합니다. 공사비 80억 원 또는 매각액 90억 원으로 바꾼 경우 각각 잔여가 5억 원이 되는지도 확인합니다.</p>
        </div>

        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">15억 원을 지출하기 전에 확인할 조건이 정해졌습니다. 잔여법 원문으로 계산을 검증합니다.</p>
      </section>
      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8. RICS 원문의 빼기 순서에 같은 숫자를 넣는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">잔여법은 예상한 완공 가치에서 비용과 요구이익을 빼 토지 취득에 쓸 수 있는 돈을 계산합니다. RICS 2019 지침의 6.1.1절, 인쇄 24쪽에 실린 원문을 그대로 읽습니다.</p>
        </div>
        <SourceApplication source="RICS Valuation of development property · 6.1.1, p.24" excerpt="gross development value (GDV) - total development costs (including profit) = residual land value" application="100−(70+15)=15억 원입니다. 원문의 total development costs에는 개발업자 이익도 들어가므로 이 글처럼 70억 원과 15억 원을 따로 표시했을 때 둘을 모두 한 번씩 뺍니다. 이익을 두 번 차감하지 않습니다." />
        <CitationBlock source="RICS Valuation of development property · 6.1.1, p.24" citeKey={1} href="https://www.rics.org/content/dam/ricsglobal/documents/to-be-sorted/valuation-of-development-property---first-edition.pdf">2026-10-04 확인. 원문 문구와 위 사례 적용의 근거입니다.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">개발비에 이익을 한 번 포함하는 원문 계산을 확인했습니다. 현지 허가가 입력을 바꾸는지 봅니다.</p>
      </section>
      <section id="comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. 나라별 계획권은 다르지만 먼저 허가와 현금의 순서를 봅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">한국 국토계획법의 개발행위허가와 건축법의 건축허가는 검토하는 법적 근거가 다릅니다. 다만 일정 요건에서는 건축허가 과정의 의제와 협의로 함께 처리될 수 있으므로 무조건 두 번 순차 신청한다고 이해하면 안 됩니다. 지을 수 있는 면적과 기반시설 조건은 지역 계획과 조례에서 확인합니다.</p>
          <p className="leading-7">영국, 호주와 미국에서도 현지 계획 허가와 전기·수도 같은 서비스 연결 비용을 분리해야 합니다. 같은 땅 넓이가 같은 분양 면적을 보장하지는 않습니다.</p>
          <p className="leading-7">RICS 2019 지침의 잔여법은 계산의 구조를 확인하는 근거로 사용합니다. 2026년 개별 감정평가에 필요한 최신 전문기준 전체를 대신하지 않으며, 거래 비교와 현금 지급시점을 함께 검토해야 합니다.</p>
        </div>
        <SourceApplication source="한국 국토계획법 제56조 제1항 제2호" excerpt="토지의 형질 변경" application="100억 원 매각을 기대하며 15억 원을 토지와 취득에 배정해도 땅을 깎고 메우는 행위의 허가 여부를 먼저 확인합니다. 허가 조건 때문에 도로·배수 비용이 10억 원 더 필요하면 다른 가정이 같을 때 잔여는 5억 원으로 줄어듭니다." />
        <CitationBlock source="한국 국토계획법 제56조 제1항 제2호" citeKey={2} href="https://www.law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1016204783">2026-10-04 확인. 이 절의 원문과 관할 범위를 확인합니다.</CitationBlock>
        <CitationBlock source="RICS Valuation of development property" citeKey={3} href="https://www.rics.org/content/dam/ricsglobal/documents/to-be-sorted/valuation-of-development-property---first-edition.pdf">잔여법과 개발 부동산의 현금흐름·민감도를 설명하는 전문 기준입니다.</CitationBlock>
        <CitationBlock source="한국 국토의 계획 및 이용에 관한 법률" citeKey={4} href="https://www.law.go.kr/LSW/lsInfoP.do?efYd=20260701&lsiSeq=284013">2026-10-03 기준 개발행위허가·건폐율·용적률 조문의 출발점입니다.</CitationBlock>
        <CitationBlock source="한국 건축법 제11조" citeKey={5} href="https://law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1032199815">건축허가의 법적 출발점입니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">허가 조건이 땅에 남는 금액을 바꾸는 경로를 알았습니다. 계산 밖에 남는 실패 조건을 확인합니다.</p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10. 개발 호재라는 말에는 확률과 비용이 빠져 있습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">도로가 새로 나면 접근성이 좋아질 수 있지만 사업비 분담이나 토지 수용, 입지 경쟁도 바뀝니다. 허가 가능성이 높아도 공사비와 금융비가 오르면 땅에 남는 몫이 줄어듭니다.</p>
          <p className="leading-7">토지 등기와 경계가 맞는지 확인합니다. 오염과 기존 임차인의 권리, 설정된 담보권도 조사해야 합니다. 이를 빼먹은 잔여 계산은 숫자가 맞아도 실행할 수 없는 계획이 됩니다.</p>
          <p className="leading-7">계약 전에 허가와 금융 조달에 실패했을 때 계약을 해제하고 어느 돈을 돌려받을지 정합니다.</p>
        </div>

        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">잔여값이 커도 토지 권리와 허가, 자금 일정이 맞아야 실행 가능한 계획이 됩니다.</p>

        <ReviewPrompts questions={["총개발비 70억 원에 요구 이익 15억 원을 더해 뺄 때, 100억 원에서 토지와 취득에 남는 금액은 얼마일까요? (답: 8절)", "허가 조건의 도로·배수 비용 10억 원을 빠뜨렸다면 같은 매각액에서 토지에 배정할 돈은 어떻게 바뀔까요? (답: 9절)"]} />
      </section>
    </div>
  );
}
