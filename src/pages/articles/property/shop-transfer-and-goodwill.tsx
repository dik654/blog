import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 공식 자료 확인: 2026-10-04. 금액 사례는 본문에 표시한 가정입니다. */
export default function ShopTransferAndGoodwillArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1. 돈을 낸 뒤 실제로 영업을 이어받을 수 있어야 한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">가게를 사는 일에는 냉장고처럼 손에 잡히는 물건과 같은 자리에서 장사할 기회가 섞여 있습니다. 물건을 다 받았어도 공간을 계속 쓰거나 고객에게 같은 서비스를 제공할 수 없다면 기대한 거래가 완성되지 않습니다.</p>
          <p className="leading-7">목표는 양도대금 한 숫자를 검증 가능한 대상으로 나누고, 인수 조건이 충족될 때 돈이 지급되게 하는 것입니다. 기존 점주에게는 가격뿐 아니라 넘긴 뒤 어떤 책임이 끝나는지도 중요합니다.</p>
        </div>

        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">대금과 실제 영업 가능성을 함께 확인하는 것이 목표입니다. 무엇을 넘길지 나눕니다.</p>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2. 물건, 장소, 미완료 약속을 각각 넘겨야 한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">기존 점주는 자기가 가진 물건과 영업 자료를 보여 줍니다. 새 점주는 상태와 수익을 확인합니다. 공간 소유자와 허가 기관은 새 사람이 영업할 수 있는지 판단합니다. 고객에게 남은 약속과 직원 관계도 거래 밖으로 저절로 사라지지 않습니다.</p>
        </div>

        <FlowRail title="인수 때 연결할 세 역할" steps={[{"actor": "무엇을 넘기나", "movement": "물건과 영업 자료를 확인합니다.", "receives": "양도 대상"}, {"actor": "계속 쓸 수 있나", "movement": "장소와 영업 조건을 확인합니다.", "receives": "인수 조건"}, {"actor": "언제 지급하나", "movement": "조건 이행과 대금을 맞춥니다.", "receives": "인수 완료"}]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">물건과 장소와 남은 약속을 구별했으니 3천300만 원을 세 대상으로 나눠 봅니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3. 3천300만 원을 시설과 재고와 미래 손님으로 나눈다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">시설 2천만 원, 판매할 재고 300만 원, 기존 손님이 계속 올 가능성에 1천만 원을 주는 거래를 둡니다. 총액은 3천300만 원이고 보증금은 이 금액에 포함하지 않습니다. 실제 거래 통계가 아닌 설명용 (가정)입니다.</p>
          <p className="leading-7">2천만 원 시설은 장비 번호와 소유자, 작동 상태를 확인합니다. 300만 원 재고는 수량과 사용기한을 셉니다. 마지막 1천만 원은 미래 기대이므로 과거 매출 자료와 새 임대료를 검토해도 확정 현금으로 바뀌지 않습니다.</p>
        </div>

        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">세 금액의 검증 대상이 달라졌습니다. 잔금 앞에 어떤 조건이 모여야 하는지 그립니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 세 사람의 약속이 잔금 지급으로 모이게 그린다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">새 점주가 돈을 내는 화살표 앞에는 물건 인도만 있어서는 부족합니다. 공간을 사용할 수 있다는 약속과 영업을 이어갈 조건까지 모여야 대금을 전부 지급할 근거가 생깁니다.</p>
        </div>
        <FlowRail
          title="(가정) 시설 2천만 원, 재고 3백만 원, 영업상 이점 1천만 원"
          steps={[
            { actor: "기존 점주", movement: "시설·재고와 영업 자료를 넘기고 대금을 받습니다.", receives: "합의된 양도대금" },
            { actor: "새 점주", movement: "실사 후 3천300만 원을 지급합니다.", receives: "시설·재고·영업 기회" },
            { actor: "임대인·관청", movement: "새 임차·양도 동의와 업종 지위 승계를 판단합니다.", receives: "새 계약 상대방·규정 준수" },
          ]}
        />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">인수 조건이 여러 당사자에게 걸린다는 점을 알았다면 증거도 나누어 모읍니다.</p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 소유와 사용과 미래 기대의 증거는 서로 다르다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">매장에 놓인 2천만 원 시설 중 일부가 빌린 장비라면 기존 점주는 그것을 자기 물건처럼 팔 수 없습니다. 장비 공급계약과 소유 문서를 맞춰야 같은 물건을 두 번 사는 일을 막습니다.</p>
          <p className="leading-7">손님 명단도 물건 목록처럼 통째로 넘기면 되는 대상이 아닙니다. 개인정보와 온라인 계정에는 별도 법률·서비스 약관이 붙습니다. 장부상 매출은 실물 인수로 보장되지 않으므로 환불·광고비와 기존 점주의 노동까지 빼서 검증합니다.</p>
        </div>

        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">물건과 미래 고객은 다른 증거가 필요합니다. 거래 문서의 이름을 붙일 차례입니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. 양도대금을 구성하는 권리의 이름</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">영업 시설과 거래처·노하우·자리의 이점에 지급하는 대가를 한국에서는 권리금이라는 틀로 다룹니다. 세 항목 합계 3천300만 원의 경제적 내용은 계약에서 따로 적어야 합니다.</p>
          <p className="leading-7">실제 물건과 채무, 매출 자료를 확인하는 과정이 실사입니다. 시설을 돌려 보고 신고 매출과 카드·배달 정산을 맞추는 작업이 여기에 해당합니다.</p>
          <p className="leading-7">공간을 사용하는 계약상 지위를 넘기는 것은 임차권 양도입니다. 가게 시설을 사는 계약과 다른 문제이며, 새 임대차를 체결하는 방식도 가능하므로 임대인과의 문서가 필요합니다.</p>
        </div>

        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">권리금·실사·임차권 양도를 구분했으므로 인수일까지 한 경로를 따라갑니다.</p>
      </section>
      <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. 자산양도·임대차·채무·영업 신고를 각각 닫습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">3천300만 원 제안을 받은 새 점주는 먼저 2천만 원 시설과 300만 원 재고를 목록으로 받습니다. 리스·담보·소유권 유보가 있는지와 수리 이력을 확인하고, 인수일 수량으로 재고대금을 조정하는 방법을 정합니다.</p>
          <p className="leading-7">1천만 원 영업상 이점은 신고 매출, 카드·배달 정산과 계좌 입금을 여러 기간에 걸쳐 맞춰 검토합니다. 기존 임대료 대신 새 임대료를 넣고, 점주와 가족의 노동을 대체할 임금을 차감합니다. 양도 전 할인행사가 만든 일시적 매출과 미사용 선불권을 별도 표시합니다.</p>
          <p className="leading-7">계약에는 임대인 동의 또는 새 임대차, 필요한 영업 지위승계·신고, 가맹본부와 장비 소유자의 승인 등을 거래에 맞춰 조건으로 둡니다. 어떤 조건이 언제까지 실패하면 계약금과 잔금을 어떻게 돌려줄지 정하고, 충족 여부가 확인되기 전에 무조건 전액 지급하지 않습니다.</p>
          <p className="leading-7">인수일에는 장비 시험과 재고 수량, 열쇠·전화·계정 접근 권한을 확인해 서명합니다. 카드와 배달 대금은 주문일과 입금일이 다르므로 인수 전 주문의 정산·환불을 누가 맡는지 정합니다. 사업 양도의 실질에 따라 고용관계와 채무의 승계가 문제 될 수 있어 직원 동의와 정산 책임을 계약서 문장만으로 임의 소멸시켜서는 안 됩니다.</p>
        </div>

        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">3천300만 원의 지급 조건을 잡았습니다. 고객정보 이전의 별도 의무를 확인합니다.</p>
      </section>
      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8. 고객정보 이전은 고객에게 알려야 하는 별도 절차다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">이 사례의 영업상 이점 1천만 원에 단골 관리 자료가 포함된다면 어떤 정보를 어떤 목적으로 넘기는지 확인합니다. 한국 개인정보 보호법 제27조는 영업양도 때 정보주체에게 알릴 사항을 규정합니다.</p>
        </div>
        <SourceApplication source="한국 개인정보 보호법 제27조 제1항" excerpt="해당 정보주체에게 알려야 한다" application="3천300만 원 양도계약에는 시설·재고 목록과 별도로 고객정보 이전 여부를 적습니다. 이전 사실, 받는 사람의 연락처, 이전을 원하지 않을 때의 조치 방법을 미리 알리고, 양수자는 원래 목적의 범위 등 법률상 조건을 지킵니다." />
        <CitationBlock source="한국 개인정보 보호법 제27조 제1항" citeKey={1} href="https://www.law.go.kr/LSW/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1029335679">2026-10-04 확인. 원문 문구와 위 사례 적용의 근거입니다.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">고객정보는 가격에 포함됐다는 이유만으로 자유롭게 넘길 수 없음을 확인했습니다. 장소의 보호 규칙도 대조합니다.</p>
      </section>
      <section id="comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. 한국의 권리금 회수 보호와 호주의 lease assignment는 제도가 다릅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">한국 상가건물 임대차보호법은 권리금의 성격과 임대인의 권리금 회수기회 방해 금지에 관한 조문을 둡니다. 새 임차인의 계약 성립은 별도로 확인해야 합니다. 호주 NSW는 retail lease assignment에 임대인의 동의와 양도인 공개 절차를 둡니다.</p>
          <p className="leading-7">미국·영국·다른 나라에서는 계약의 assignment 조항과 영업 허가 이전 방식부터 확인해야 합니다. 세금상 영업양도와 개별 자산 매매의 취급도 별도 질문입니다.</p>
        </div>
        <SourceApplication source="한국 상가건물 임대차보호법 제10조의4 제1항" excerpt="권리금을 지급받는 것을 방해하여서는 아니 된다" application="시설 2천만 원·재고 300만 원·영업상 이점 1천만 원에 합의해도 법은 임대인의 특정 방해행위와 기간·예외를 다룹니다. 합의된 양도대금만으로 새 임대차가 자동 성립하지 않으므로 장소 사용 조건을 잔금 전에 확인합니다." />
        <CitationBlock source="한국 상가건물 임대차보호법 제10조의4 제1항" citeKey={2} href="https://www.law.go.kr/LSW/lsInfoP.do?ancNo=21083&ancYd=20251111&efYd=20260512&lsiSeq=279651">2026-10-04 확인. 이 절의 원문과 관할 범위를 확인합니다.</CitationBlock>
        <CitationBlock source="한국 상가건물 임대차보호법 제10조의3·제10조의4" citeKey={3} href="https://www.law.go.kr/LSW/lsInfoP.do?ancNo=21083&ancYd=20251111&efYd=20260512&lsiSeq=279651">권리금 정의와 회수 기회 보호의 현재 조문입니다.</CitationBlock>
        <CitationBlock source="NSW Small Business Commissioner: Transferring your lease" citeKey={4} href="https://www.smallbusiness.nsw.gov.au/help/common-questions/transferring-your-lease">호주 NSW의 retail lease 양도 동의와 공개 절차를 안내합니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">권리금 보호와 새 임대차의 성립을 가렸다면 미래 손님에 매긴 값의 한계를 봅니다.</p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10. 과거 매출이 앞으로의 영업권 가치를 보장하지 않습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">기존 점주의 노동시간, 할인행사, 배달 앱 리뷰, 상권 변화가 빠지면 과거 매출은 새 점주의 매출과 다를 수 있습니다. 신규 임대료가 오르면 같은 매출에도 새 점주의 이익은 줄어듭니다.</p>
          <p className="leading-7">양도가 불가능하거나 가격이 너무 낮으면 폐업과 원상복구 비용을 비교합니다. 기존 점주에게는 최고가 제안보다 잔금 확실성과 임대차 종료 책임 해제가 중요할 수 있습니다.</p>
          <p className="leading-7">양도가 성립해도 기존 점주의 임대차 책임이 끝나는지, 보증금은 임대인에게서 누가 돌려받는지, 양수인의 신규 보증금은 언제 지급되는지 세 사람의 계약서에서 대조합니다. 명의만 바꾸고 채무 정산을 놓치지 않도록 마지막 거래일과 인수 이후의 첫 거래일을 정해 매출과 비용을 갈라 기록합니다.</p>
        </div>

        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">서로 다른 권리를 같은 인수 날짜에 맞추고 남는 책임까지 확인해야 양도가 끝납니다.</p>

        <ReviewPrompts questions={["시설 2천만 원과 재고 300만 원, 영업상 이점 1천만 원을 각각 어떤 자료로 검증할까요? (답: 7절)", "단골 명단이 포함된 가게를 넘길 때 양도계약 외에 고객에게 어떤 내용을 알려야 할까요? (답: 8절)"]} />
      </section>
    </div>
  );
}
