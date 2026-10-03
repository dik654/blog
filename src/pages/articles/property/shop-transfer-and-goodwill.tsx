import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 가게를 양도할 때 넘기는 것은 하나의 가게가 아니라 서로 다른 권리들이다 — 숫자와 제도 예시는 2026-10-03 확인 기준. */
export default function ShopTransferAndGoodwillArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3천300만 원이라는 권리금 한 숫자를 셋으로 쪼갭니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">시설 2천만 원, 재고 300만 원, 손님이 계속 올 가능성에 1천만 원을 준다고 합시다. 시설은 목록과 상태를 확인할 수 있고 재고는 수량과 유통기한을 셀 수 있습니다. 마지막 1천만 원은 미래 영업의 기대라 확인 방법이 다릅니다.</p>
          <p className="leading-7">가장 큰 빈칸은 장소입니다. 가게를 팔아도 기존 점주가 건물을 소유한 것은 아닙니다. 새 점주가 같은 자리에서 영업할 임대차 지위와 인허가가 이어지는지 별도로 확인해야 합니다.</p>
        </div>
        <FlowRail
          title="(가정) 시설 2천만 원, 재고 3백만 원, 영업상 이점 1천만 원"
          steps={[
            { actor: "기존 점주", movement: "시설·재고와 영업 자료를 넘기고 대금을 받습니다.", receives: "합의된 양도대금" },
            { actor: "새 점주", movement: "실사 후 3천300만 원을 지급합니다.", receives: "시설·재고·영업 기회" },
            { actor: "임대인·관청", movement: "새 임차·양도 동의와 업종 지위 승계를 판단합니다.", receives: "새 계약 상대방·규정 준수" },
          ]}
        />
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">3천300만 원을 시설·재고·미래 손님으로 나눴다면 무엇을 실제로 넘기는지 보입니다. 이제 계약을 닫는 순서를 따라갑니다.</p>
      </section>
      <section id="mechanism" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">자산양도·임대차·채무·영업 신고를 각각 닫습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">먼저 시설과 장비의 소유자를 확인합니다. 리스 장비라면 장비를 쓰고 있어도 점주의 물건이 아닐 수 있습니다. 재고는 수량과 유통기한을 직접 셉니다. 상표, 계정, 전화번호가 함께 넘어오는지도 확인합니다.</p>
          <p className="leading-7">매출은 세금 신고, 카드 정산과 계좌 입금을 맞춰 봅니다. 단골이 실제로 남을지는 가정으로만 둡니다. 선불쿠폰, 직원과 공급계약이 자동 승계된다고 추측하지 않습니다.</p>
          <p className="leading-7">양도계약에는 임대인의 동의 또는 새 임대차 체결, 업종 신고나 지위 승계, 물품 인도, 보증금 반환, 잔금 지급의 선후관계를 조건으로 적습니다. 실패하면 누가 얼마를 돌려주는지 정해야 돈만 건넨 뒤 점포를 못 쓰는 일을 막습니다. KTV 분쟁 영상처럼 새 임차인 후보와의 계약 초안·문자, 임대인에게 요청한 내용과 답변을 남겨야 회수 기회를 둘러싼 다툼에서 사실관계를 보일 수 있습니다.</p>
          <p className="leading-7">실사 뒤 임대인과 새 임대차 조건을 확인합니다. 그다음 업종 허가나 지위 승계 가능 여부를 확인하고, 양도대금을 시설·재고·영업상 이점으로 나눕니다. 계약금과 잔금은 이 조건들이 충족되는 순서에 맞춰 지급합니다.</p>
          <p className="leading-7">인수 당일에는 재고 수량과 장비 작동 상태를 확인합니다. 열쇠, 출입 권한, 온라인 계정과 임대인의 확인 내용을 인수 목록에 적고 양쪽이 서명합니다. 인수 전후의 카드·배달·공급 거래 정산일도 정합니다.</p>
          <p className="leading-7">좋은 달 한 번의 매출로 가격을 매기지 않습니다. 최근 여러 기간의 카드 매출, 부가세 신고, 계좌 입금, 환불과 배달 수수료를 맞춥니다. 점주 노동과 광고비를 빼고도 새 임차료를 감당할 현금이 남는지 계산합니다.</p>
          <p className="leading-7">직원 임금과 퇴직금은 누가 정산하는지 확인합니다. 미사용 쿠폰, 외상 거래와 리스 장비도 양도대금 속에 묻어 두지 않고 책임자를 적습니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">임대인 동의와 영업 지위가 잔금보다 앞서야 하는 이유를 확인했습니다. 나라별 양도 보호 범위를 문서로 대조합니다.</p>
      </section>
      <section id="comparison" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">한국의 권리금 회수 보호와 호주의 lease assignment는 제도가 다릅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">한국 상가건물 임대차보호법은 권리금의 성격과 임대인의 권리금 회수기회 방해 금지에 관한 조문을 둡니다. 이는 새 임차인이 무조건 계약을 얻는다는 뜻이 아닙니다. 호주 NSW는 retail lease assignment에 임대인의 동의와 양도인 공개 절차를 둡니다.</p>
          <p className="leading-7">미국·영국·다른 나라에서는 계약의 assignment 조항과 영업 허가 이전 방식부터 확인해야 합니다. 세금상 영업양도와 개별 자산 매매의 취급도 별도 질문입니다.</p>
        </div>
        <SourceApplication source="한국 상가건물 임대차보호법 제10조의4 제1항" excerpt="권리금을 지급받는 것을 방해하여서는 아니 된다" application="시설 2천만 원·재고 300만 원·영업상 이점 1천만 원을 협의하더라도 보호 조항은 임대인의 특정 방해 행위와 기간을 다룹니다. 양도계약이 곧 새 임대차 승인인 것은 아닙니다." />
        <CitationBlock source="한국 상가건물 임대차보호법 제10조의3·제10조의4" citeKey={1} href="https://www.law.go.kr/LSW/lsInfoP.do?ancNo=21083&ancYd=20251111&efYd=20260512&lsiSeq=279651">권리금 정의와 회수 기회 보호의 현재 조문입니다.</CitationBlock>
        <CitationBlock source="NSW Small Business Commissioner: Transferring your lease" citeKey={2} href="https://www.smallbusiness.nsw.gov.au/help/common-questions/transferring-your-lease">호주 NSW의 retail lease 양도 동의와 공개 절차를 안내합니다.</CitationBlock>
        <CitationBlock source="YouTube · KTV 권리금 분쟁 사례" citeKey={3} href="https://www.youtube.com/watch?v=39_iUHr0t6I&t=560s">영상 9분대부터 후보 임차인·임대인 협의의 증거를 남길 필요를 다룹니다. 법적 근거는 현행 법령에서 확인합니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">한국의 권리금 회수 보호는 새 임대차의 자동 성립을 뜻하지 않습니다. 마지막으로 과거 매출의 값을 다시 의심합니다.</p>
      </section>
      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">과거 매출이 앞으로의 영업권 가치를 보장하지 않습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">기존 점주의 노동시간, 할인행사, 배달 앱 리뷰, 상권 변화가 빠지면 과거 매출은 새 점주의 매출과 다를 수 있습니다. 신규 임대료가 오르면 같은 매출에도 새 점주의 이익은 줄어듭니다.</p>
          <p className="leading-7">양도가 불가능하거나 가격이 너무 낮으면 폐업과 원상복구 비용을 비교합니다. 기존 점주에게는 최고가 제안보다 잔금 확실성과 임대차 종료 책임 해제가 중요할 수 있습니다.</p>
          <p className="leading-7">양도가 성립해도 기존 점주의 임대차 책임이 끝나는지, 보증금은 임대인에게서 누가 돌려받는지, 양수인의 신규 보증금은 언제 지급되는지 세 사람의 계약서에서 대조합니다. 명의만 바꾸고 채무 정산을 놓치지 않도록 마지막 거래일과 인수 이후의 첫 거래일을 정해 매출과 비용을 갈라 기록합니다.</p>
        </div>
        <ReviewPrompts questions={[
          "시설 2천만 원·재고 300만 원·영업상 이점 1천만 원의 검증 방법은 왜 서로 다를까요? (답: 2절)",
          "새 점주가 돈을 다 냈는데 같은 장소에서 영업하지 못하는 상황을 막으려면 어떤 조건을 먼저 걸어야 할까요? (답: 4절)",
        ]} />
      </section>
    </div>
  );
}
