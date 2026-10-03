import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 폐업은 문을 닫는 날이 아니라 보증금과 채무를 정산하는 과정이다 — 숫자와 제도 예시는 2026-10-03 확인 기준. */
export default function ShopClosureAndRestorationArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">보증금 3천만 원을 온전히 돌려받는다고 가정하지 않습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">보증금 3천만 원에서 미납 월세 400만 원과 복구비 600만 원이 실제로 공제 가능하다면 돌려받는 돈은 2천만 원입니다. 하지만 복구 범위가 다투어지면 600만 원이 확정액인지부터 확인해야 합니다. 철거 공사를 하지 않고 시설을 새 임차인에게 넘기는 합의도 가능할 수 있습니다.</p>
          <p className="leading-7">폐업은 매장 문을 닫는 날 하나로 끝나지 않습니다. 남은 쿠폰과 주문, 임금과 퇴직금, 공급자 미지급금, 대출, 세금, 임대차와 보증금은 각각 다른 날짜에 닫힙니다.</p>
        </div>
        <FlowRail
          title="(가정) 보증금 3천만 원, 미납 월세 4백만 원, 복구 견적 6백만 원"
          steps={[
            { actor: "점주", movement: "영업을 멈추고 미납금·세금·복구비를 정산합니다.", receives: "보증금 잔액과 채무 종료" },
            { actor: "임대인", movement: "점포를 인도받고 계약상 공제액을 확인합니다.", receives: "공간과 미납금 회수" },
            { actor: "시공사·관청", movement: "철거·검수와 폐업 신고를 처리합니다.", receives: "공사비·신고 완료" },
          ]}
        />
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">보증금 3천만 원에서 두 공제액을 빼는 계산을 했습니다. 다음은 그 공제액이 실제로 정당한지 증빙합니다.</p>
      </section>
      <section id="mechanism" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">폐업 장부는 고객·직원·공급자·임대인·관청별로 닫습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">먼저 남은 주문과 선불권의 환불을 정리합니다. 재고와 리스 장비의 소유자를 확인하고 직원 임금, 퇴직금과 공급자 미지급액을 맞춥니다. 배달과 카드 결제 대금이 마지막으로 들어오는 날도 적습니다.</p>
          <p className="leading-7">임대인에게 계약 종료를 통지하고 해지 기간을 확인합니다. 점포를 넘기는 날, 열쇠를 돌려주는 날, 관리비가 끝나는 날은 같은 날이 아닐 수 있습니다. 인도 확인서와 보증금 정산서를 따로 받습니다.</p>
          <p className="leading-7">복구 공사 전에 입주 당시 사진과 도면, 나중에 받은 공사 동의를 대조합니다. 임대인과 철거할 시설, 남길 시설을 서면으로 확정합니다. 사업자 폐업 신고와 세금 신고도 서로 다른 절차로 처리합니다.</p>
          <p className="leading-7">마지막 주문일과 직원의 마지막 근무일을 정합니다. 임대차 종료일과 전기·가스·통신 해지일도 따로 적습니다. 카드 대금 입금, 선불권 환불과 업종별 폐업 신고가 언제 끝나는지 달력에서 확인합니다.</p>
          <p className="leading-7">복구 견적은 철거와 폐기물 반출을 먼저 나눠 받습니다. 전기·가스 차단과 배관 막음, 바닥·벽·천장 마감, 간판 철거도 수량과 단가를 적습니다. 작업 전후의 사진과 폐기물 처리 증빙을 남깁니다.</p>
          <p className="leading-7">임대인과 현장에서 다시 확인한 뒤 지적된 하자를 항목별로 적습니다. 보증금 정산서에는 미납 월세, 관리비, 합의된 복구비와 각 근거를 한 줄씩 기입합니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">고객·직원·임대인·관청의 종료 날짜를 나눴다면 문을 닫은 뒤 남는 의무가 보입니다. 복구 판례의 조건을 읽습니다.</p>
      </section>
      <section id="comparison" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">원상복구 범위는 계약·인도 상태·관할 판례를 함께 봅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">한국 대법원은 원상복구비 공제에 관해 실제 복구 의사와 계약의 내용에 따라 판단한 사례가 있습니다. KTV 사례는 이전 점주에게 시설 권리금을 주었다는 이유만으로 그의 임대인에 대한 복구 특약까지 자동 승계된다고 볼 수 없다고 설명합니다. 그러므로 최초 인도 상태와 새 임대차·양도 계약을 함께 읽어야 합니다. 호주 NSW 안내도 make good 조항과 점포 반환 상태를 임대차 시작 때부터 확인하게 합니다.</p>
          <p className="leading-7">한국 국세청은 폐업자의 부가가치세 신고 기한과 잔존 재화를 별도로 안내합니다. 잔존 재고가 없다는 사실이나 폐업 신고 하나만으로 모든 세금·임대차 채무가 사라지는 것은 아닙니다. KTV의 분쟁 영상은 원상복구와 권리금 회수가 실제 다툼이라는 현장 사례를 보여줍니다.</p>
        </div>
        <SourceApplication source="대법원 2002다52657 · 판결요지 [2]" excerpt="원상복구할 의사 없이 임차인이 설치한 시설을 그대로 이용하여 타에 다시 임대하려 하는 경우" application="복구 견적 600만 원을 보증금에서 뺄 수 있는지는 실제 철거 의사와 계약·인도 상태를 확인해야 합니다. 이 판례의 사실관계를 벗어난 모든 복구 청구가 무효라는 뜻은 아닙니다." />
        <CitationBlock source="한국 대법원 2002년 건물명도 판례" citeKey={1} href="https://www.law.go.kr/LSW/precInfoP.do?precSeq=194367">특정 사실관계에서 복구비 공제와 실제 복구 의사를 다룬 판례입니다. 일반 규칙으로 확대하지 않습니다.</CitationBlock>
        <CitationBlock source="국세청 폐업 부가가치세 안내" citeKey={2} href="https://nts.go.kr/nts/na/ntt/selectNttInfo.do?mi=2448&nttSn=1393">폐업일이 속한 달 다음 달 25일 신고와 잔존 재화 관련 안내입니다.</CitationBlock>
        <CitationBlock source="NSW Retail Tenancy Guide" citeKey={3} href="https://www.smallbusiness.nsw.gov.au/about-retail-leases/retail-tenancy-guide">호주 NSW의 임대차 종료 make good와 인도 준비 안내입니다.</CitationBlock>
        <CitationBlock source="YouTube · KTV 상가 임대차 분쟁 사례" citeKey={4} href="https://www.youtube.com/watch?v=39_iUHr0t6I&t=990s">영상 16분대의 전 임차인 시설·복구 특약 사례를 전사로 확인했습니다. 개별 법리는 판례와 계약으로 재확인합니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">2002년 판례의 특정 사실관계를 확인했습니다. 마지막은 철거와 양도 중 어느 길이 가능한지 세 사람의 동의를 봅니다.</p>
      </section>
      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">철거보다 양도가 유리한지는 세 당사자의 동의로 결정됩니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">새 점주가 시설을 원해도 임대인이 새 임대차를 승인하지 않으면 인도가 막힐 수 있습니다. 임대인이 그대로 쓰겠다고 해도 기존 점주의 미납금과 고객 채무는 없어지지 않습니다. 각 약속을 같은 종료일에 맞추는 것이 핵심입니다.</p>
          <p className="leading-7">보증금 정산표의 금액은 이 글의 가정입니다. 실제로는 임대차 계약, 인도 당시 상태, 공사 견적, 합의서, 지역 판례와 세무 기준으로 각각 확인해야 합니다.</p>
          <p className="leading-7">재고를 다른 사업으로 옮기거나 버리는 방식, 직원 퇴직 정산, 리스 장비 반납, 고객 개인정보가 담긴 계정 폐기는 서로 다른 계약과 법의 문제입니다. 폐업 신고 수리 화면 한 장을 모든 채무가 사라졌다는 증거로 쓰지 않습니다.</p>
        </div>
        <ReviewPrompts questions={[
          "보증금 3천만 원에서 미납금과 복구비가 공제될 때 무엇을 증빙해야 2천만 원 정산액을 확정할 수 있을까요? (답: 2절)",
          "사업자 폐업 신고가 끝나면 직원·고객·임대인에 대한 의무도 모두 끝날까요? (답: 4절)",
        ]} />
      </section>
    </div>
  );
}
