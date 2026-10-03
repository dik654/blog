import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 공식 자료 확인: 2026-10-04. 금액 사례는 본문에 표시한 가정입니다. */
export default function ShopClosureAndRestorationArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1. 문을 닫은 뒤에도 남는 약속을 끝내는 법</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">영업을 그만두는 날과 모든 돈이 정리되는 날은 다릅니다. 마지막 손님에게 물건을 제공한 뒤에도 고객에게 돌려줄 돈, 직원에게 지급할 돈, 공간을 돌려주며 확인할 상태가 남습니다.</p>
          <p className="leading-7">가게를 닫을 때는 앞으로 제공하거나 지급할 의무가 남았는지 확인합니다. 돈이 들어올 날과 나갈 날을 맞춰야 정리 과정에서 다시 빚을 만드는 일을 줄일 수 있습니다.</p>
        </div>

        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">남은 약속을 찾는 것이 폐업의 출발점입니다. 누구와 어떤 관계를 끝낼지 나눕니다.</p>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2. 마지막 주문, 마지막 근무, 공간 반환, 신고가 따로 끝난다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">고객과 거래를 마치는 단계에서는 주문과 환불을 정리합니다. 함께 일하고 공급한 사람과는 미지급액을 맞춥니다. 공간은 약정 상태로 반환하고, 관청에는 영업과 세무상 종료를 처리합니다. 어느 하나가 끝나도 나머지 약속이 자동으로 끝나지는 않습니다.</p>
        </div>

        <FlowRail title="영업 종료에서 정산까지의 세 역할" steps={[{"actor": "어떤 약속이 남았나", "movement": "주문·근무·공급 내역을 정리합니다.", "receives": "미정산 목록"}, {"actor": "무엇을 돌려주나", "movement": "물건과 공간을 약정대로 반환합니다.", "receives": "인도 확인"}, {"actor": "얼마가 남나", "movement": "입금·지급·신고를 마무리합니다.", "receives": "확인된 잔액"}]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">종료 날짜가 서로 다르다는 구조를 보았습니다. 보증금 정산 숫자를 넣습니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3. 맡긴 3천만 원에서 400만 원과 600만 원을 정산한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">돌려받을 보증금 3천만 원, 미납 월세 400만 원, 복구 견적 600만 원인 점포를 둡니다. 두 공제액이 계약과 사실관계에 따라 유효하게 확정됐다는 조건에서 반환액은 2천만 원입니다. 금액과 정산 조건은 (가정)입니다.</p>
          <p className="leading-7">고객 환불·임금·세금·대출은 이 계산에 넣지 않았습니다. 따라서 보증금 정산서의 2천만 원이 폐업 뒤 점주에게 최종적으로 남는 순현금이라고 단정할 수 없습니다. 600만 원이 단지 견적이라면 공제 가능성과 실제 정산액부터 확인합니다.</p>
        </div>

        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">조건부 반환액 2천만 원을 계산했습니다. 견적에서 합의와 인도까지의 경로를 그립니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 점포 반환과 보증금 정산을 같은 날짜표에 놓는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">돈을 돌려받는 경로와 점포를 돌려주는 경로를 연결합니다. 철거업체의 견적, 임대인과 합의한 반환 상태, 실제 인도 확인은 각각 다른 단계의 증거입니다.</p>
        </div>
        <FlowRail
          title="(가정) 보증금 3천만 원, 미납 월세 4백만 원, 복구 견적 6백만 원"
          steps={[
            { actor: "점주", movement: "영업을 멈추고 미납금·세금·복구비를 정산합니다.", receives: "보증금 잔액과 채무 종료" },
            { actor: "임대인", movement: "점포를 인도받고 계약상 공제액을 확인합니다.", receives: "공간과 미납금 회수" },
            { actor: "시공사·관청", movement: "철거·검수와 폐업 신고를 처리합니다.", receives: "공사비·신고 완료" },
          ]}
        />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">공간과 돈의 반환을 연결했다면 정산마다 기한을 남길 이유가 보입니다.</p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 미정산 항목마다 책임자와 기한이 필요한 이유</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">마지막 카드 매출은 폐점 뒤에 입금될 수 있고, 이미 받은 쿠폰 대금은 고객에게 돌려줘야 할 수 있습니다. 계정을 너무 일찍 닫으면 입금·환불 기록을 확인하기 어려우므로 자료를 먼저 확보하고 종료 순서를 잡습니다.</p>
          <p className="leading-7">복구 견적 600만 원도 범위가 바뀌면 달라집니다. 철거할 부분과 남길 부분, 폐기물 처리와 안전 차단을 먼저 정해야 작업 뒤 같은 시설을 두고 추가 비용을 다투는 일을 줄일 수 있습니다.</p>
        </div>

        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">입금과 환불, 복구의 서로 다른 기한을 확인했으니 종료 문서의 이름을 붙입니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. 돈의 정리와 공간의 정리를 구분하는 말</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">서로 주고받을 돈과 근거를 맞추어 잔액을 확정하는 일이 정산입니다. 보증금 3천만 원과 인정된 공제액을 맞추는 장부가 그 예입니다.</p>
          <p className="leading-7">약정된 상태로 공간을 돌려놓는 일이 원상복구입니다. 무조건 빈 콘크리트 상태를 뜻하지 않으며 입주 상태와 계약, 나중의 동의가 기준이 됩니다.</p>
          <p className="leading-7">영업 종료를 관청과 세무서에 알리는 일이 폐업 신고입니다. 신고의 수리와 고객·직원·임대인에게 남은 채무의 소멸은 서로 다른 문제입니다.</p>
        </div>

        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">정산·원상복구·폐업 신고를 나눴으므로 마지막 영업부터 반환까지 따라갑니다.</p>
      </section>
      <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. 폐업 장부는 고객·직원·공급자·임대인·관청별로 닫습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">먼저 마지막 주문일과 선불권 환불 방법을 고객에게 알리고 미완료 주문을 정리합니다. 재고·장비는 소유자를 확인해 판매·반환·폐기를 결정합니다. 리스 장비는 업체에 반납 조건과 중도 종료 금액을 확인해 철거할 물건에서 제외합니다.</p>
          <p className="leading-7">직원의 마지막 근무일과 퇴직 정산을 기록합니다. 한국 근로기준법 제36조는 원칙적으로 사유 발생일부터 14일 이내 금품 청산을 요구하며 특별한 사정과 당사자 합의로 기일을 연장할 수 있습니다. 폐업이 해고예고 등 모든 고용 절차를 면제하는 것은 아니므로 해당 요건도 따로 확인합니다.</p>
          <p className="leading-7">임대차 종료 통지 기간을 확인한 뒤 임대인과 남길 시설·제거할 시설을 서면으로 맞춥니다. 철거 견적 600만 원에는 수량과 단가, 폐기물 반출·처리, 전기·가스 차단, 배관 마감과 간판 제거를 나눠 적습니다. 처리업체의 적법한 처리 범위와 반출 증빙을 확인합니다.</p>
          <p className="leading-7">공사 전후 사진과 하자 확인을 거쳐 점포를 인도합니다. 보증금 3천만 원에서 미납 400만 원과 합의된 복구 600만 원을 공제하는 근거를 정산서에 붙이면 2천만 원의 반환액을 계산할 수 있습니다. 합의되지 않은 견적은 확정 채무처럼 표시하지 않습니다.</p>
          <p className="leading-7">카드·배달의 마지막 입금과 환불이 끝나는 날짜까지 거래 기록을 보관합니다. 전기·가스·통신의 최종 검침과 해지, 보험 종료일도 사고 책임이 끊기는 시점에 맞춥니다. 개인정보는 불필요해지면 파기하되 법정 보존 자료는 분리 보관하고 접근을 제한합니다.</p>
        </div>

        <CitationBlock source="한국 근로기준법 제36조" citeKey={7} href="https://law.go.kr/LSW/lsSideInfoP.do?docCls=jo&joBrNo=00&joNo=0036&lsiSeq=283457&urlMode=lsScJoRltInfoR">2026-10-04 확인. 퇴직 시 금품 청산 기한과 당사자 합의의 예외입니다.</CitationBlock>
        <CitationBlock source="한국 개인정보 보호법 제21조" citeKey={8} href="https://law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1029335625">2026-09-11 시행 조문을 2026-10-04 확인. 불필요한 정보 파기와 법정 보존 자료의 분리 관리를 구분합니다.</CitationBlock>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">각 거래의 마지막 날짜를 찾았습니다. 신고 뒤 남는 세무 기한을 원문으로 확인합니다.</p>
      </section>
      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8. 폐업 신고 뒤에도 세금 신고 일정이 남는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">보증금 정산에서 2천만 원을 받았더라도 마지막 거래와 재고에 대한 세무 확인은 남습니다. 한국 국세청 안내는 폐업 신고와 부가가치세 신고를 나누어 설명합니다.</p>
        </div>
        <SourceApplication source="국세청 · 사업을 폐업하는 경우의 신고 안내" excerpt="폐업일이 속한 달의 다음달 25일 이내" application="사례의 3천만 원 보증금 정산과 별도로 폐업일까지의 거래와 남은 재화를 확인합니다. 2026-10-04 확인 기준 위 기한을 세무 달력에 적고, 폐업 신고만으로 부가세·소득세·원천세 등이 모두 끝났다고 처리하지 않습니다." />
        <CitationBlock source="국세청 · 사업을 폐업하는 경우의 신고 안내" citeKey={1} href="https://nts.go.kr/nts/na/ntt/selectNttInfo.do?mi=2448&nttSn=1393">2026-10-04 확인. 원문 문구와 위 사례 적용의 근거입니다.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">보증금 정산과 세금 신고가 별개임을 확인했습니다. 복구비 공제의 판례 조건을 읽습니다.</p>
      </section>
      <section id="comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. 원상복구 범위는 계약·인도 상태·관할 판례를 함께 봅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">한국 대법원 2002다52657은 실제로 복구할 의사 없이 시설을 이용해 재임대하는 사실관계에서 복구비 공제를 판단했습니다. 이전 점주가 설치한 시설을 물려받은 가게라면 시설을 받은 상태와 복구 특약도 별도로 확인해야 합니다.</p>
          <p className="leading-7">호주 NSW도 계약 때 반환할 상태를 확인하도록 안내하지만 한국 판결의 결론이 그대로 적용되는 것은 아닙니다. 복구 의무의 결론은 관할 법과 계약 내용에 근거해 확인합니다.</p>
        </div>
        <SourceApplication source="대법원 2002다52657 · 판결요지 [2]" excerpt="원상복구할 의사 없이 임차인이 설치한 시설을 그대로 이용하여 타에 다시 임대하려 하는 경우" application="600만 원 견적을 자동으로 공제하지 않고 실제 반환 합의와 시설 사용을 확인합니다. 이 판결은 특정 사실관계에서 공제를 부정했으므로 모든 복구 의무가 없어진다는 결론으로 확대할 수 없습니다." />
        <CitationBlock source="대법원 2002다52657 · 판결요지 [2]" citeKey={2} href="https://www.law.go.kr/LSW/precInfoP.do?precSeq=194367">2026-10-04 확인. 이 절의 원문과 관할 범위를 확인합니다.</CitationBlock>
        <CitationBlock source="한국 대법원 2002년 건물명도 판례" citeKey={3} href="https://www.law.go.kr/LSW/precInfoP.do?precSeq=194367">특정 사실관계에서 복구비 공제와 실제 복구 의사를 다룬 판례입니다. 일반 규칙으로 확대하지 않습니다.</CitationBlock>
        <CitationBlock source="국세청 폐업 부가가치세 안내" citeKey={4} href="https://nts.go.kr/nts/na/ntt/selectNttInfo.do?mi=2448&nttSn=1393">폐업일이 속한 달 다음 달 25일 신고와 잔존 재화 관련 안내입니다.</CitationBlock>
        <CitationBlock source="NSW Retail Tenancy Guide" citeKey={5} href="https://www.smallbusiness.nsw.gov.au/about-retail-leases/retail-tenancy-guide">호주 NSW의 임대차 종료 make good와 인도 준비 안내입니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">특정 사실관계의 판결을 확인했으니 양도로 철거를 피할 수 있는지와 남는 채무를 따집니다.</p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10. 철거보다 양도가 유리한지는 세 당사자의 동의로 결정됩니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">새 점주가 시설을 원해도 임대인이 새 임대차를 승인하지 않으면 인도가 막힐 수 있습니다. 임대인이 그대로 쓰겠다고 해도 기존 점주의 미납금과 고객 채무는 없어지지 않습니다. 각 약속을 같은 종료일에 맞추는 것이 핵심입니다.</p>
          <p className="leading-7">보증금 정산표의 금액은 이 글의 가정입니다. 실제로는 임대차 계약, 인도 당시 상태, 공사 견적, 합의서, 지역 판례와 세무 기준으로 각각 확인해야 합니다.</p>
          <p className="leading-7">재고를 다른 사업으로 옮기거나 버리는 방식, 직원 퇴직 정산, 리스 장비 반납, 고객 개인정보가 담긴 계정 폐기는 서로 다른 계약과 법의 문제입니다. 폐업 신고 수리 화면 한 장을 모든 채무가 사라졌다는 증거로 쓰지 않습니다.</p>
          <p className="leading-7">철거비 지원도 확정 전에는 돌려받을 돈에 넣지 않습니다. 중소벤처기업부의 2025년 1월 영상 03:50에는 최대 400만 원이, 같은 해 7월 영상 01:53에는 400만 원에서 600만 원으로의 변경이 표시됩니다. 두 화면과 게시기관의 자막 전사를 대조하면 숫자가 바뀐 이유는 발표 시점에 있습니다. 7월 30일 보도자료는 확대 한도의 적용을 2025년 7월 11일 이후 폐업과 연결합니다.</p>
          <p className="leading-7">2026년 1월 19일 공고는 면적 3.3㎡당 20만 원 한도, 부가세 제외, 적격 업체 시공과 지출 증빙, 중복지원 제외를 함께 둡니다. 이 공고를 적용하고 인정 면적이 33㎡라고 가정하면 면적 기준 한도는 200만 원입니다. 따라서 복구 견적 600만 원에서 영상에 나온 600만 원을 그대로 뺄 수 없습니다. 신청 시점 공고의 대상 공사·면적·폐업일과 심사 결과를 확인한 뒤, 지원금 지급일도 보증금 반환일과 따로 적습니다.</p>
        </div>

        <CitationBlock source="중소벤처기업부 · 2025 소상공인 지원사업 영상" citeKey={9} href="https://www.youtube.com/watch?v=T6KNxj3hawQ&t=230s">2025-01-23 공개 영상의 03:50 화면에서 250만 원→400만 원을 확인했습니다. 아래 게시기관 전사와 대조했으며 당시 발표의 근거로 씁니다.</CitationBlock>
        <CitationBlock source="중소벤처기업부 · 1월 영상 공식 자막" citeKey={10} href="https://www.mss.go.kr/site/smba/brdcststnVod/brdcststnVodView.do?ctgr_code=C03&searchSeq=ST_000000001222422">희망리턴패키지의 점포 철거비 설명을 읽었습니다. 게시기관의 영상 등록일은 2025-01-24입니다.</CitationBlock>
        <CitationBlock source="중소벤처기업부 · 2차 추경 요약 영상" citeKey={11} href="https://www.youtube.com/watch?v=A55z8XrEEdM&t=113s">2025-07-11 공개 영상의 01:53 화면에서 400만 원→600만 원을 확인했습니다. 영상 설명의 경영회복 장은 00:58부터 시작합니다.</CitationBlock>
        <CitationBlock source="중소벤처기업부 · 7월 영상 공식 자막" citeKey={12} href="https://www.mss.go.kr/site/smba/brdcststnVod/brdcststnVodView.do?ctgr_code=C03&searchSeq=ST_000000001231716">지원 확대 설명과 추후 세부 공고 안내를 대조했습니다. 영상 발표만으로 개별 신청의 지급액을 확정하지 않습니다.</CitationBlock>
        <CitationBlock source="중소벤처기업부 · 2025-07-30 점포철거비 확대 보도자료" citeKey={13} href="https://www.mss.go.kr/site/smba/ex/bbs/View.do?bcIdx=1060542&cbIdx=86&parentSeq=1060542">영상 뒤에 나온 서면 자료로 적용 폐업일과 변경 공고 일정을 확인했습니다.</CitationBlock>
        <CitationBlock source="소상공인시장진흥공단 · 2026-01-19 원스톱폐업지원 공고" citeKey={14} href="https://ssrf.or.kr/site/kr/html/sub04/0401.html?category=sc04&file_id=3953&mode=D&no=abaae44719e649e9f32b348bdd1d35f0">서천군지속가능지역재단이 게시한 공단 공고 PDF의 3~4쪽입니다. 33㎡ 사례는 이 날짜의 공고에만 적용한 계산이며 이후 변경 여부는 신청할 때 확인합니다.</CitationBlock>

        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">문을 닫는 날짜보다 각 의무가 끝났다는 증거를 맞추어야 폐업 후 현금도 확인됩니다.</p>

        <ReviewPrompts questions={["보증금 3천만 원에서 400만 원·600만 원을 빼 2천만 원을 확정하려면 견적 외에 어떤 증거가 필요할까요? (답: 7절)", "폐업 신고가 끝나도 세금 신고와 직원·고객정보 정리는 왜 별도 날짜에 남을까요? (답: 7절·8절)"]} />
      </section>
    </div>
  );
}
