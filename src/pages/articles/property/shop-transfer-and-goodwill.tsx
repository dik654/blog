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
          <p className="leading-7">
            이 글에서는 양도대금을 실제로 확인할 수 있는 항목으로 나누고 인수 조건이 갖춰졌을 때 대금을 지급하는 과정을 따라갑니다. 기존 점주에게는 가격뿐 아니라 넘긴 뒤 어떤 책임이
            끝나는지도 중요합니다.
          </p>
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
          <p className="leading-7">시설 2천만 원, 판매할 재고 300만 원, 기존 손님이 계속 올 가능성에 1천만 원을 주는 거래를 둡니다. 총액은 3천300만 원입니다. 보증금·세금·중개비와 인수 뒤 운영 자금은 제외합니다. 실제 거래 통계나 세법상 배분이 아닌 설명용 가격 합의 (가정)입니다.</p>
          <p className="leading-7">2천만 원 시설은 장비 번호와 소유자, 작동 상태를 확인합니다. 300만 원 재고는 수량과 사용기한을 셉니다. 마지막 1천만 원은 미래 기대이므로 과거 매출 자료와 새 임대료를 검토해도 확정 현금으로 바뀌지 않습니다.</p>
          <p className="leading-7">
            새 점주가 먼저 300만 원을 지급하고 정한 인수 조건을 확인한 날 나머지 3천만 원을 지급하기로 합의했다고 가정합니다. 재고 금액은 그날 실제 수량과 미리 합의한 단가로 다시
            계산합니다. 이 지급 비율은 업계 표준이나 법정 비율이 아닙니다.
          </p>
        </div>

        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
            금액마다 확인할 자료를 구분했습니다. 잔금을 지급하기 전에 무엇을 갖춰야 하는지 그려 봅니다.
          </p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 세 사람의 약속이 잔금 지급으로 모이게 그린다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">새 점주가 돈을 내는 화살표 앞에는 물건 인도만 있어서는 부족합니다. 공간을 사용할 수 있다는 약속과 영업을 이어갈 조건까지 모여야 대금을 전부 지급할 근거가 생깁니다.</p>
        </div>
        <FlowRail
          title="(가정) 총 3천300만 원의 지급 조건을 맞추는 순서"
          steps={[
            { actor: "처음 합의", movement: "시설·재고·남은 약속의 목록과 실패 시 반환 조건을 정한 뒤 300만 원을 지급합니다.", receives: "기존 점주가 먼저 지급하기로 한 돈을 받습니다." },
            { actor: "인수 조건 확인", movement: "시설 상태, 장소 사용 계약, 필요한 영업 절차와 책임 분담을 확인합니다.", receives: "새 점주가 실제로 무엇을 이어받는지 확인합니다." },
            { actor: "인수일 정산", movement: "재고가 약정한 300만 원이면 총액 3천300만 원에서 먼저 낸 300만 원을 뺀 3천만 원을 지급합니다.", receives: "새 점주는 합의한 대상을, 기존 점주는 남은 대금을 받습니다." },
          ]}
        />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
            인수하려면 여러 사람의 약속이 필요합니다. 약속마다 확인할 자료도 나눠 봅니다.
          </p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 소유와 사용과 미래 기대의 증거는 서로 다르다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">매장에 놓인 2천만 원 시설 중 일부가 빌린 장비라면 기존 점주는 그것을 자기 물건처럼 팔 수 없습니다. 장비 공급계약과 소유 문서를 맞춰야 같은 물건을 두 번 사는 일을 막습니다.</p>
          <p className="leading-7">
            손님 명단도 물건 목록처럼 통째로 넘기면 되는 대상이 아닙니다. 개인정보와 온라인 계정에는 별도 법률·서비스 약관이 붙습니다. 물건을 인수해도 과거 매출이 이어진다는 보장은
            없습니다. 미래 수익을 예상할 때는 환불·광고비와 기존 점주의 노동을 대신할 임금까지 반영해야 합니다.
          </p>
        </div>

        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">물건과 미래 고객은 다른 증거가 필요합니다. 거래 문서의 이름을 붙일 차례입니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. 양도대금을 구성하는 권리의 이름</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">한국 상가건물 임대차보호법 제10조의3은 영업 시설과 비품, 거래처와 노하우, 자리의 이점 등 유형·무형 가치에 지급하는 대가를 권리금으로 정의합니다. 보증금과 차임은 구분합니다. 여기서 시설·재고·미래 기대를 나눈 것은 가격을 검토하기 위한 약정입니다. 세 항목 전부의 법률·회계·세무 처리가 같다는 뜻은 아닙니다.</p>
          <p className="leading-7">실제 물건과 채무, 매출 자료를 확인하는 과정이 실사입니다. 시설을 돌려 보고 신고 매출과 카드·배달 정산을 맞추는 작업이 여기에 해당합니다.</p>
          <p className="leading-7">
            공간을 사용하는 계약상 지위를 넘기는 것은 임차권 양도입니다. 가게 시설을 사는 계약과는 별개입니다. 새 임대차를 체결하는 방식도 가능하므로 임대인과의 문서를 확인해야 합니다.
          </p>
        </div>

        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">권리금·실사·임차권 양도를 구분했으므로 인수일까지 한 경로를 따라갑니다.</p>
      </section>
      <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. 자산양도·임대차·채무·영업 신고를 각각 닫습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">3천300만 원 제안을 받은 새 점주는 먼저 2천만 원 시설과 300만 원 재고를 목록으로 받습니다. 리스·담보·소유권 유보가 있는지와 수리 이력을 확인합니다. 약정한 단가로 인수일 재고를 셌더니 250만 원이고 다른 조건은 같다면 총액은 2천만 + 250만 + 1천만 = 3천250만 원입니다. 먼저 낸 300만 원을 빼면 잔금은 2천950만 원입니다. 사용기한이 지난 물건을 제외할지와 수량 차이를 어떻게 반영할지도 미리 합의해야 합니다.</p>
          <p className="leading-7">
            1천만 원 영업상 이점은 신고 매출, 카드·배달 정산과 계좌 입금을 여러 기간에 걸쳐 맞춰 검토합니다. 기존 임대료 대신 새 임대료를 넣고 점주와 가족의 노동을 대체할 임금을
            차감합니다. 양도 전 할인행사가 만든 일시적 매출과 미사용 선불권을 별도 표시합니다.
          </p>
          <p className="leading-7">계약에는 임대인 동의 또는 새 임대차, 필요한 영업 지위승계·신고, 가맹본부와 장비 소유자의 승인 등을 거래에 맞춰 조건으로 둡니다. 어떤 자료로 완료를 판단할지, 조건이 언제까지 실패하면 먼저 낸 300만 원을 누가 언제 반환할지 정합니다. 영업의 실제 이전과 신고 수리, 잔금의 순서도 업종에 맞춰 정해야 합니다. 필요한 절차를 계약서 한 문장으로 대신하거나 이미 약정한 지급을 임의로 미루는 방식은 아닙니다.</p>
          <p className="leading-7">예를 들어 한국 음식점의 영업자 지위를 승계했다면 식품위생법 제39조의 신고 절차를 따로 확인합니다. 같은 법 제78조는 종전 영업자의 행정 제재처분 효과나 진행 중인 절차가 양수인에게 이어질 수 있는 조건과 예외를 정합니다. 장비가 잘 작동하는지에 더해 위반·처분 이력을 인수 전에 확인해야 하는 이유입니다.</p>
          <p className="leading-7">인수일에는 장비 시험과 재고 수량, 열쇠·전화·계정 접근 권한을 확인해 서명합니다. 카드와 배달 대금은 주문일과 입금일이 다르므로 인수 전 주문의 정산·환불을 누가 맡는지 정합니다. 사업 양도의 실질에 따라 고용관계와 채무의 승계가 문제 될 수 있어 직원 동의와 정산 책임을 계약서 문장만으로 임의 소멸시켜서는 안 됩니다.</p>
        </div>
        <CitationBlock source="한국 식품위생법 제39조·제78조" citeKey={5} href="https://www.law.go.kr/LSW/lsSideInfoP.do?lsiSeq=277149&amp;joNo=0039&amp;joBrNo=00&amp;docCls=jo&amp;urlMode=lsScJoRltInfoR">2026-10-04 시행 중인 조문의 영업자 지위승계·신고와 행정 제재처분 효과의 승계·예외를 확인했습니다. 음식점의 영업 이전 여부와 필요한 절차는 실제 거래 내용에 맞춰 판단합니다.</CitationBlock>

        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">3천300만 원의 지급 조건을 잡았습니다. 고객정보 이전의 별도 의무를 확인합니다.</p>
      </section>
      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8. 고객정보 이전은 고객에게 알려야 하는 별도 절차다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">이 사례의 영업상 이점 1천만 원에 단골 관리 자료가 포함된다면 어떤 정보를 어떤 목적으로 넘기는지 확인합니다. 한국 개인정보 보호법 제27조는 영업양도 때 정보주체에게 알릴 사항을 규정합니다.</p>
        </div>
        <SourceApplication source="한국 개인정보 보호법 제27조 제1항" excerpt="해당 정보주체에게 알려야 한다" application="같은 양도계약에서 시설·재고 목록과 고객정보 이전 여부를 나눠 적습니다. 기존 점주는 법이 정한 방법으로 이전 사실, 받는 사람의 이름·주소·전화번호 등 연락처, 이전을 원하지 않을 때의 조치 방법·절차를 미리 알려야 합니다." />
        <div className="prose prose-neutral mt-5 max-w-none dark:prose-invert">
          <p className="leading-7">새 점주가 정보를 받았을 때의 의무도 있습니다. 제27조 제2항은 지체 없이 알리도록 하되 기존 점주가 제1항에 따라 이미 알린 경우를 예외로 둡니다. 제3항은 이전 당시 본래 목적으로만 이용하거나 제공하도록 합니다. 가격에 고객 관계를 포함했다고 해서 명단을 다른 사업의 광고에 자유롭게 쓰게 되는 것은 아닙니다.</p>
        </div>
        <CitationBlock source="한국 개인정보 보호법 제27조 제1항" citeKey={1} href="https://www.law.go.kr/LSW/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1029335679">2026-09-11 시행 조문의 이전 전 통지 사항을 2026-10-04 확인했습니다.</CitationBlock>
        <CitationBlock source="한국 개인정보 보호법 제27조 제2항" citeKey={6} href="https://law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1029331507">양수자의 통지 의무와 양도자가 이미 알린 경우의 예외를 확인합니다.</CitationBlock>
        <CitationBlock source="한국 개인정보 보호법 제27조 제3항" citeKey={7} href="https://law.go.kr/LSW/lsLawLinkInfo.do?chrClsCd=010202&amp;lsJoLnkSeq=1006185845">이전 당시 본래 목적과 양수자의 개인정보처리자 지위를 확인합니다.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">고객정보는 가격에 포함됐다는 이유만으로 자유롭게 넘길 수 없음을 확인했습니다. 장소의 보호 규칙도 대조합니다.</p>
      </section>
      <section id="comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. 한국의 권리금 회수 보호와 호주의 lease assignment는 제도가 다릅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">한국 상가건물 임대차보호법 제10조의4는 종료 6개월 전부터 종료 때까지 일정한 방해행위를 금지합니다. 차임 연체 등의 예외와 새 임차인의 지급 능력 등에 관한 정당한 거절 사유도 함께 규정합니다. 따라서 시설과 미래 기대에 값을 합의한 것, 법의 보호를 받는 것, 새 임대차가 성립하는 것은 각각 확인할 문제입니다.</p>
          <p className="leading-7">
            호주 NSW의 소매 임대차 양도 안내는 임대인에게 서면으로 동의를 요청하고 기존 임대 조건과 양도인의 공개 문서를 새 임차인·임대인에게 제공하는 절차를 설명합니다. 양도 뒤
            기존 점주의 책임을 끝내려면 해당 법의 절차를 갖춰야 합니다. 단순히 열쇠를 주고 대금을 받은 사실과 책임의 종료는 다릅니다. 이 절차를 한국 계약에 그대로 적용하지는
            않습니다.
          </p>
          <p className="leading-7">미국·영국·다른 나라에서는 계약의 assignment 조항과 영업 허가 이전 방식부터 확인해야 합니다. 세금상 영업양도와 개별 자산 매매의 취급도 별도 질문입니다.</p>
        </div>
        <SourceApplication source="한국 상가건물 임대차보호법 제10조의4 제1항" excerpt="권리금을 지급받는 것을 방해하여서는 아니 된다" application="시설 2천만 원·재고 300만 원·영업상 이점 1천만 원에 합의해도 법은 임대인의 특정 방해행위와 기간·예외를 다룹니다. 합의된 양도대금만으로 새 임대차가 자동 성립하지 않으므로 장소 사용 조건을 잔금 전에 확인합니다." />
        <CitationBlock source="한국 상가건물 임대차보호법 제10조의3·제10조의4" citeKey={2} href="https://www.law.go.kr/LSW/lsInfoP.do?ancNo=21083&ancYd=20251111&efYd=20260512&lsiSeq=279651">2026-05-12 시행 조문에서 권리금 정의와 보호 기간·방해행위·예외를 읽었습니다. 가격 합의가 곧 새 임대차를 성립시키지는 않습니다.</CitationBlock>
        <CitationBlock source="NSW Small Business Commissioner: Transferring your lease" citeKey={4} href="https://www.smallbusiness.nsw.gov.au/help/common-questions/transferring-your-lease">호주 NSW의 retail lease 양도 동의와 공개 절차를 안내합니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
            권리금 보호와 새 임대차의 성립을 구분했습니다. 이제 미래 손님에게 기대한 돈이 얼마나 달라질 수 있는지 봅니다.
          </p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10. 과거 매출이 앞으로의 영업권 가치를 보장하지 않습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">기존 점주의 노동시간, 할인행사, 배달 앱 리뷰, 상권 변화가 빠지면 과거 매출은 새 점주의 매출과 다를 수 있습니다. 신규 임대료가 오르면 같은 매출에도 새 점주의 이익은 줄어듭니다.</p>
          <p className="leading-7">같은 가게가 재료·고용 인력·점주 노동의 대체 임금·월세 등 운영 비용을 반영한 뒤 매달 100만 원을 남길 것이라고 가정해 봅시다. 새 월세만 50만 원 오르면 남는 돈은 50만 원입니다. 미래 기대에 준 1천만 원만 나눠도 단순 회수기간은 10개월에서 20개월로 늘어납니다.</p>
          <p className="leading-7">이 금액이 매달 같다는 가정이며 세금·이자·시설값 회수와 돈의 시간가치는 제외합니다. 전체 3천300만 원의 투자 평가나 적정 권리금 계산은 아닙니다.</p>
          <p className="leading-7">양도가 불가능하거나 가격이 너무 낮으면 폐업과 원상복구 비용을 비교합니다. 기존 점주에게는 최고가 제안보다 잔금 확실성과 임대차 종료 책임 해제가 중요할 수 있습니다.</p>
          <p className="leading-7">양도가 성립해도 기존 점주의 임대차 책임이 끝나는지, 보증금은 임대인에게서 누가 돌려받는지, 양수인의 신규 보증금은 언제 지급되는지 세 사람의 계약서에서 대조합니다. 명의만 바꾸고 채무 정산을 놓치지 않도록 마지막 거래일과 인수 이후의 첫 거래일을 정해 매출과 비용을 갈라 기록합니다.</p>
        </div>

        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">서로 다른 권리를 같은 인수 날짜에 맞추고 남는 책임까지 확인해야 양도가 끝납니다.</p>

        <ReviewPrompts questions={["합의한 단가로 센 인수일 재고가 250만 원이면 총액은 얼마이며, 먼저 지급한 300만 원을 뺀 잔금은 얼마인가요? (답: 7절)", "단골 명단을 넘길 때 기존 점주와 새 점주에게 각각 어떤 통지·이용 의무가 있나요? (답: 8절)", "매달 남길 것으로 예상한 100만 원에서 새 월세가 50만 원 더 나가면, 미래 기대에 준 1천만 원의 단순 회수기간은 어떻게 바뀌나요? (답: 10절)"]} />
      </section>
    </div>
  );
}
