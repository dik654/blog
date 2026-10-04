import { CitationBlock } from "@/components/ui/citation";
import { Link } from "react-router-dom";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 공식 자료 확인: 2026-10-04. 금액 사례는 본문에 표시한 가정입니다. */
export default function ShopFitoutAndOpeningArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1. 공간을 꾸미기 전에 영업 가능한 상태를 정한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            개업 준비에서 가장 비싼 실수는 완성한 시설을 다시 뜯는 일입니다. 원하는 음식을 만들 수 있고 손님과 직원이 안전하게 움직일 수 있으며 정해진 절차를 마쳐 문을 열 수 있어야
            공사비가 매출로 이어집니다.
          </p>
          <p className="leading-7">이 글은 공간을 인수한 날부터 첫 영업일까지를 따라갑니다. 사용할 사람, 건물을 가진 사람, 공사하는 사람, 영업 가능 여부를 확인하는 기관이 언제 무엇을 결정해야 하는지 연결합니다.</p>
        </div>

        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">영업할 수 있는 상태를 목표로 두었다면 승인과 공사를 별도 단계로 나눕니다.</p>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2. 사용 동의, 공사, 개업 확인은 서로 다른 결과를 만든다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">공간을 바꿔도 되는지 정하는 단계가 먼저입니다. 그다음 시설을 만들고 작동을 확인합니다. 마지막에는 그 시설에서 해당 일을 해도 되는지 확인하고 주문을 받을 준비를 합니다. 한 단계의 승인이나 사진이 나머지 단계를 대신하지 않습니다.</p>
        </div>

        <FlowRail title="공간 인수에서 개업까지의 세 역할" steps={[{"actor": "바꿔도 되나", "movement": "공간 사용과 작업 동의를 확인합니다.", "receives": "허용된 범위"}, {"actor": "제대로 만들었나", "movement": "설치한 시설의 작동을 확인합니다.", "receives": "사용할 시설"}, {"actor": "문을 열어도 되나", "movement": "업종 요건과 준비 상태를 확인합니다.", "receives": "첫 영업"}]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
            각 단계에서 무엇을 확인할지 정했으니 공사비와 대기 기간을 넣어 봅니다.
          </p>
      </section>
      <section id="case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3. 4천만 원 견적이 4천800만 원이 되고 30일 동안 팔지 못한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">작은 음식점의 기본 공사가 4천만 원, 추가 전기·배기 작업이 800만 원이고 시설 완성과 신고 준비에 30일이 걸리는 경우를 둡니다. 이 30일을 월세 한 번의 납부 기간으로 놓고 공사 중에도 200만 원을 전액 낸다고 합시다. 공사비도 개업 전까지 모두 지급하는 약정입니다. 금액과 기간은 모두 가정이며 세금·이자·초도 재료·보험은 별도로 계산해야 합니다.</p>
          <p className="leading-7">일단 확인된 현금 필요액만 5천만 원입니다. 4천800만 원은 시설에, 200만 원은 손님이 없는 한 달에 나갑니다. 착공 전에 다음 달 운영비까지 따로 확보하지 않으면 시설은 완성했는데 직원과 재료를 준비할 돈이 부족해질 수 있습니다.</p>
          <p className="leading-7">실제로 개업이 한 달 더 늦어 같은 월세를 한 번 더 낸다면 월세만 200만 원 늘어납니다. 나머지 조건이 같을 때 확인된 필요액은 5천200만 원입니다. 지연 중 이자·보험 등도 늘면 그만큼 더 준비해야 합니다.</p>
        </div>

        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">시설 4천800만 원과 월세 200만 원의 용도를 나눴습니다. 지급 조건을 공정에 연결합니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 완료의 표시를 돈 지급 시점에 연결한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">계약할 때는 각 지급일에 무엇을 확인할지 함께 정합니다. 같은 4천800만 원을 아래처럼 나누어 지급하기로 합의했다고 놓겠습니다. 이 비율은 설명용이며 정해진 업계 표준이 아닙니다. 숨은 배관 사진, 전기와 환기 시험, 인수 문서는 서로 다른 작업의 증거입니다.</p>
        </div>
        <FlowRail
          title="(가정) 공사비 1천만 + 2천만 + 1천800만 = 4천800만 원; 월세 200만 원은 별도"
          steps={[
            { actor: "작업을 시작할 때", movement: "허용 범위와 도면·수량·총액·일정을 합의하고 점주가 1천만 원을 냅니다.", receives: "업체가 시작할 작업과 지급액의 약속" },
            { actor: "벽과 바닥을 닫기 전", movement: "약속한 배관·방수·배선 검수 결과와 기록을 받고 2천만 원을 냅니다.", receives: "가려질 작업의 확인 자료" },
            { actor: "시설을 인수할 때", movement: "계약한 기능 시험과 도면·보증서 인계를 확인하고 1천800만 원을 냅니다.", receives: "시설과 이후 보수에 필요한 자료" },
          ]}
        />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
            지급 시점마다 확인할 작업을 나눴습니다. 마감 전에 볼 설비를 살펴봅니다.
          </p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 도면보다 먼저 확인할 것은 돌아가는 설비와 빠져나갈 길이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">800만 원의 추가 작업을 벽 마감 뒤에 발견하면 완성한 부분을 뜯는 비용까지 생깁니다. 실제 장비가 요구하는 전력과 가스, 물이 들어오고 빠지는 경로, 냄새가 나가는 곳을 도면에 먼저 놓아야 합니다.</p>
          <p className="leading-7">손님 공간을 넓히려고 통로나 출입구를 줄이면 영업 안전과 시설기준을 함께 해칠 수 있습니다. 관할 부서와 소방서의 적용 요건을 설계 전에 확인하고 건물 관리자의 공사시간·자재 반입·폐기물 반출 규칙까지 공정에 넣습니다.</p>
        </div>

        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">설비와 출입 조건을 먼저 보는 이유를 이해했다면 공사 계약에서 쓰는 이름을 붙입니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. 공사 중 돈과 책임을 나누는 말</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">점포의 영업 시설을 설치하는 일을 인테리어 공사 또는 fit-out이라고 부릅니다. 꾸밈뿐 아니라 조리·전기·급배수 설비도 포함합니다.</p>
          <p className="leading-7">작업이 진행된 만큼 나누어 지급하는 돈이 기성금입니다. 4천800만 원 전체 중 어떤 작업을 확인했을 때 얼마를 지급할지 계약에 연결합니다.</p>
          <p className="leading-7">앞 그림에서 두 번째 2천만 원은 약속한 공정 확인에 연결한 지급입니다. 마지막 1천800만 원의 조건도 계약한 시공 결과와 인계 자료로 정했습니다. 관청의 영업 절차까지 시공사 책임인지와 개업이 늦어질 때 지급일이 바뀌는지는 별도로 합의해야 합니다. 사진이 마음에 들지 않는다는 이유만으로 지급 약정을 일방적으로 바꾸는 절차는 아닙니다.</p>
          <p className="leading-7">약정 성능이나 시공 상태를 갖추지 못한 부분은 하자입니다. 장비 자체 보증과 시공사의 하자 보수 책임을 구분해 연락처, 접수 방법, 기간과 보수 범위를 인수 문서에 남깁니다.</p>
        </div>

        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">시설 설치·기성금·하자를 나눴으니 30일 공정에서 각 책임자를 따라갑니다.</p>
      </section>
      <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. 공사는 사용 동의에서 영업 신고까지 이어집니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">같은 4천800만 원 공사는 임대차에서 허용한 작업 범위와 필요한 임대인 동의를 서면으로 확인하고 실측하는 데서 시작합니다. 4천만 원 기본 견적과 전기·배기 800만 원을 합의하고 자재·수량·부가세 포함 여부·제외 항목을 같은 표에서 맞춥니다. 위 계산은 세금 납부액을 생략한 자금 비교입니다. 실제 계약에서는 각 금액의 세금 기준까지 맞춰야 합니다.</p>
          <p className="leading-7">추가 작업은 착수 전에 범위·금액·일정 영향과 승인자를 기록합니다. 800만 원이 늘었다고 개업일이 반드시 밀리지는 않습니다. 이미 예정한 작업과 함께 끝낼 수 있는지, 허가·자재·선행 작업을 더 기다려야 하는지에 따라 30일 안에 끝나는지가 달라집니다.</p>
          <p className="leading-7">
            철거 전에는 건물 관리 규칙과 전기·가스 차단, 반출 경로를 정합니다. 벽과 바닥을 닫기 전에 배관·방수·배선 상태를 찍고 장비를 함께 켜 전기 부하와 배기·배수 작동을
            확인합니다. 시공사에게 받을 시험 결과와 도면, 장비 보증서도 잔금 조건에 연결합니다.
          </p>
          <p className="leading-7">30일 중 신고와 검사에 필요한 날짜를 따로 잡습니다. 음식점은 한국 식품위생법상 시설기준과 영업자 교육·종사자 건강진단 등의 적용 요건을 관할 위생부서에서 확인합니다. 소방 안전시설 완비증명과 의무보험은 다중이용업소 해당 여부 등에 따라 달라지므로 모든 작은 음식점에 똑같이 적용하지 않습니다.</p>
          <p className="leading-7">
            개업 직전에는 신고·등록 문서의 주소와 영업자, 계약서의 사용 범위가 맞는지 봅니다. 결제단말과 사업용 입금계좌를 연결해 시험 결제·취소를 하고 초도 재료의 보관과 직원 교육을
            끝냅니다. 첫날부터 주문과 정산을 연결하는 방법은 일상 운영 글에서 이어집니다.
          </p>
        </div>

        <CitationBlock source="법제처 · 음식점 화재배상책임보험 가입과 소방 안전 의무" citeKey={7} href="https://easylaw.go.kr/CSP/OnhunqueansInfoRetrieve.laf?onhunqnaAstSeq=91&onhunqueSeq=4365">2026-08-15 안내를 2026-10-04 확인. 면적·층·출입구와 업종별 대상 및 제외 조건을 확인합니다.</CitationBlock>
        <CitationBlock source="법제처 · 음식점 건강진단" citeKey={8} href="https://easylaw.go.kr/CSP/CnpClsMain.laf?ccfNo=4&cciNo=1&cnpClsNo=1&csmSeq=839&popMenu=ov">2026-09-15 기준 안내를 2026-10-04 확인. 식품위생법 제40조의 대상·시기·예외를 확인합니다.</CitationBlock>
        <CitationBlock source="법제처 · 식품위생교육" citeKey={10} href="https://easylaw.go.kr/CSP/CnpClsMain.laf?popMenu=ov&amp;csmSeq=839&amp;ccfNo=4&amp;cciNo=1&amp;cnpClsNo=2">2026-09-15 기준 안내의 제41조 교육·대리·예외를 확인했습니다. 예고된 10월 8일 변경을 10월 4일 현재 규정에 적용하지 않습니다.</CitationBlock>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">공사와 개업 준비의 순서를 잡았습니다. 사업자등록이 맡는 역할을 원문으로 한정합니다.</p>
      </section>
      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8. 영업 신고와 사업자등록을 서로 다른 문서로 준비한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">시설을 만들었으면 업종의 시설기준과 신고·허가를 확인해야 합니다. 세무서의 사업자등록은 납세자를 등록하는 절차이므로 시설을 영업에 써도 된다는 승인과 같지 않습니다.</p>
        </div>
        <SourceApplication source="국세청 · 사업자등록 신청 절차" excerpt="사업개시 전 또는 사업을 시작한 날로부터 20일 이내" application="30일 공사 중 임대차계약서와 업종 신고에 필요한 서류를 준비합니다. 등록 신청 자체는 개업 전에도 가능하므로 4천800만 원 공사 관련 증빙을 받을 사업자 정보를 정하되, 영업 시작은 업종별 요건 충족과 별도로 판단합니다." />
        <CitationBlock source="국세청 · 사업자등록 신청 절차" citeKey={1} href="https://g.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7777&mi=2444">2026-10-04 확인. 원문 문구와 위 사례 적용의 근거입니다.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">등록증과 영업 요건을 구별했으므로 다른 나라 사례도 같은 질문으로 비교할 수 있습니다.</p>
      </section>
      <section id="comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. 나라와 업종에 따라 허가의 문턱이 달라집니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">한국의 일반음식점은 식품위생법 시행규칙의 업종별 시설기준을 확인해야 합니다. 호주 NSW의 소매 임차 안내는 시설 설치 비용과 퇴거 때 원상회복하는 make good 조건을 함께 보라고 합니다. 본문의 4천800만 원을 지급했어도 나중에 남길 시설과 제거할 시설의 약속은 따로 남습니다.</p>
          <p className="leading-7">잉글랜드의 계획 허가 안내는 용도를 바꾸는 문제와 물리적 공사에 필요한 승인을 나누어 설명합니다. 같은 용도군 안의 변경이어도 공사 자체에는 별도의 계획·건축 승인이 필요할 수 있습니다. 여기에 임대차가 허용한 사용과 수선·퇴거 책임도 함께 대조해야 합니다. 행정상 허용과 임대인과의 약속은 각각 확인할 항목입니다.</p>
          <p className="leading-7">미국 Square의 식당 공사 영상에서는 공간을 인수한 날부터 임대료를 내면서 가스 공급 용량이 주방 설비에 못 미쳐 배관 증설과 개업 지연을 걱정합니다. 최종 검사를 받기 전까지 허가 누락이 발견될 수 있다는 현장 발언도 나옵니다. 한 매장의 사례지만 예비비와 무매출 기간을 왜 별도 장부로 적어야 하는지 보여줍니다.</p>
        </div>
        <SourceApplication source="NSW Retail Tenancy Guide · Shopping centre tips" excerpt="what fit-out items can stay and what must be removed" application="4천800만 원 시설 중 남길 배관과 철거할 간판을 설치 전에 적습니다. 사례의 공사비는 현재의 지출이며 퇴거 때 받을 가격이나 철거비를 포함한 최종 비용과 같지 않습니다." />
        <CitationBlock source="NSW Retail Tenancy Guide · Shopping centre tips" citeKey={2} href="https://www.smallbusiness.nsw.gov.au/about-retail-leases/retail-tenancy-guide">2026-10-04 확인. 이 절의 원문과 관할 범위를 확인합니다.</CitationBlock>
        <CitationBlock source="한국 식품위생법 시행규칙 제36조 및 별표 14" citeKey={3} href="https://www.law.go.kr/LSW/lumLsLinkPop.do?chrClsCd=010202&lspttninfSeq=115900">2026-09-01 시행본 제36조에서 별표 14를 업종별 시설기준으로 지정한 내용을 2026-10-04 확인했습니다. 개별 점포의 기준 충족이나 허가 여부를 이 조문만으로 판정하지 않습니다.</CitationBlock>
        <CitationBlock source="GOV.UK · When is permission required?" citeKey={4} href="https://www.gov.uk/guidance/when-is-permission-required">용도변경과 같은 용도군, 관련 물리적 공사를 다루는 011·012·012a 문단을 확인했습니다. 해당 공사의 개별 승인 여부를 여기서 판정하지 않습니다.</CitationBlock>
        <CitationBlock source="YouTube · Square The Build Out (Ggiata)" citeKey={5} href="https://www.youtube.com/watch?v=odwii7_bJww">게시기관의 공식 전사에서 임대료 선발생·가스 용량 부족·최종 검사 불확실성을 확인했습니다. 정확한 영상 시각은 확인하지 않았으며 특정 미국 매장의 사례로만 씁니다.</CitationBlock>
        <CitationBlock source="Square · The Build Out 전사" citeKey={6} href="https://squareup.com/us/en/the-bottom-line/videos/making-a-restaurant-with-ggiata/the-build-out">해당 영상의 공식 전사입니다. Square는 Ggiata가 제작 참여 보수를 받았다고 공개하므로 독립적인 성과 검증과 구분합니다.</CitationBlock>
        <CitationBlock source="GOV.UK · 상가 임차인의 책임" citeKey={9} href="https://www.gov.uk/renting-business-property-tenant-responsibilities">임대차에서 정할 수선·유지와 퇴거 때의 복구 책임을 확인했습니다. 현지 법정 의무와 계약상 배분을 함께 읽습니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">반환할 시설까지 공사 예산에 연결했습니다. 완성 사진만으로 판단할 수 없는 부분을 남깁니다.</p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10. 완성 사진은 준공·영업 가능·회수 가능의 증거가 아닙니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">가구가 들어왔다고 위생 신고와 소방 검사가 끝난 것은 아닙니다. 임대인이 간판이나 배기 덕트 설치를 허용하지 않으면 이미 만든 도면을 바꿔야 합니다. 계약에 없는 전기·가스 증설비는 적은 견적을 쉽게 뒤집습니다.</p>
          <p className="leading-7">설치비를 쓴 시설 중에는 퇴거 때 새 점주에게 넘길 수 있는 것도 있고 철거비가 드는 것도 있습니다. 배기 덕트를 새 점주가 원해도 임대차·적용법과 임대인의 동의, 새 점주와의 인수 합의가 맞아야 남길 수 있습니다. 반대로 임대인의 요구만으로 계약에 없던 모든 철거 의무가 자동으로 생긴다고 보지는 않습니다. 설치 전에 남길 것과 제거할 것, 비용 부담을 문서로 맞춰 둡니다.</p>
        </div>
        <p className="mt-4 leading-7"><Link className="text-sky-700 underline dark:text-sky-300" to="/economics/business/shop-daily-operations">개업 다음 날부터 주문·직원·재고·정산을 연결하는 법</Link>에서 다음 과정을 이어 읽을 수 있습니다.</p>
        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">기능 시험과 서류, 하자 인계가 갖춰져야 시설을 첫 영업의 출발점으로 삼을 수 있습니다.</p>

        <ReviewPrompts questions={["4천800만 원 공사와 무매출 30일, 월세 200만 원이면 확인된 현금 필요액은 얼마이며 어떤 돈이 아직 빠져 있을까요? (답: 3절)", "사업자등록증을 받았어도 영업 전에 별도로 확인할 시설·신고·소방 조건은 무엇일까요? (답: 7절)", "벽을 닫기 전 추가 전기 작업 800만 원이 생겼다면 금액 외에 무엇을 확인해야 개업일의 변화를 알 수 있을까요? (답: 7절)"]} />
      </section>
    </div>
  );
}
