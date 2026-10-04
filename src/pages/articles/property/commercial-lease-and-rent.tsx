import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 공식 자료 확인: 2026-10-04. 금액 사례는 본문에 표시한 가정입니다. */
export default function CommercialLeaseAndRentArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1. 공간을 쓰는 기간이 시설 투자와 맞아야 한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">가게는 오랫동안 쓸수록 시설에 쓴 돈을 회수할 기회가 생깁니다. 하지만 공간을 가진 사람과 장사하는 사람이 다르면 언제까지 쓰고 어떤 상태로 돌려줄지를 먼저 정해야 합니다.</p>
          <p className="leading-7">이 글은 계약 시작 때 맡긴 돈, 매달 내는 돈, 마지막 날 돌려받는 돈을 한 선으로 연결합니다. 시작 가격만 비교하면 수선과 이전, 공실과 반환의 비용을 놓치기 쉽습니다.</p>
        </div>

        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
            사용 기간이 시설 투자 회수에 영향을 준다는 점을 살펴봤습니다. 이제 처음과 매달, 마지막 날에 오가는 돈을 나눠 봅니다.
          </p>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2. 공간 인도, 매달 지급, 마지막 정산을 묶어 본다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">건물주는 사용할 공간을 제공합니다. 점주는 정해진 기간 사용의 대가를 냅니다. 마지막에는 공간의 상태와 남은 돈을 확인합니다. 건물주에게는 다음 사용자를 찾는 기간, 점주에게는 시설을 회수하거나 제거할 일이 남습니다.</p>
        </div>

        <FlowRail title="사용 시작부터 반환까지의 세 역할" steps={[{"actor": "어디를 쓰나", "movement": "공간과 시작 상태를 인도합니다.", "receives": "사용할 장소"}, {"actor": "얼마를 내나", "movement": "약정한 기간의 대가를 지급합니다.", "receives": "사용의 지속"}, {"actor": "어떻게 돌려주나", "movement": "공간 상태와 남은 돈을 정산합니다.", "receives": "반환과 잔액"}]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">공간과 돈이 두 번 교환되는 구조에 3년 계약의 숫자를 넣습니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3. 3천만 원을 맡기고 매달 200만 원씩 3년 쓴다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">점주가 시작할 때 3천만 원을 맡기고 3년 동안 월 200만 원을 내는 계약을 둡니다. 월별 금액은 같고 무상 사용 기간은 없습니다. 별도 관리비·세금·공사비는 제외합니다. 계약 종료 때 공제할 채무가 없고 공간도 약정대로 돌려주면 맡긴 3천만 원을 전액 반환하는 사례입니다. 모두 (가정)입니다.</p>
          <p className="leading-7">36개월의 사용 대가는 200만 원 × 36 = 7천200만 원입니다. 처음 맡기는 3천만 원까지 합치면 지급한 현금은 1억200만 원이고, 마지막에 3천만 원을 돌려받으면 순지급액은 7천200만 원입니다. 시작할 때 맡겨야 할 돈 3천만 원은 첫 달 사용료와 공사비까지 포함한 전체 개업 자금이 아닙니다.</p>
          <p className="leading-7">돌려받는 돈도 3년 동안 다른 곳에 쓸 수 없으며 반환받지 못할 위험이 있습니다. 따라서 3천만 원을 전부 사용 비용으로 더해서도, 아무 부담이 없는 돈으로 보아서도 안 됩니다. 여기서는 현금의 지급과 반환을 비교하며 회계상 비용의 인식 시점은 따로 계산하지 않습니다.</p>
        </div>

        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">7천200만 원의 사용료와 3천만 원의 반환 기대를 구분했습니다. 인도 흐름을 그립니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 사용할 권리와 반환할 돈은 반대 방향으로 움직인다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">처음에는 돈과 공간을 주고받지만 마지막에는 점포 인도와 맡긴 돈의 정산을 다시 맞춥니다. 월별 지급만 기록하면 반환과 복구 책임이 그림에서 빠집니다.</p>
        </div>
        <FlowRail
          title="(가정) 같은 3년 계약의 시작, 매달, 마지막 날"
          steps={[
            { actor: "시작할 때", movement: "점주 → 건물주: 3천만 원을 맡깁니다.", receives: "점주가 약정한 상태의 공간을 인도받습니다." },
            { actor: "매달", movement: "점주 → 건물주: 200만 원씩 36번, 총 7천200만 원을 냅니다.", receives: "점주가 36개월 동안 공간을 사용합니다." },
            { actor: "마지막 날", movement: "점주가 약정대로 공간을 돌려주고, 건물주 → 점주: 공제 없이 3천만 원을 반환합니다.", receives: "건물주는 공간을, 점주는 맡긴 돈을 돌려받습니다." },
          ]}
        />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">공간 반환도 거래의 일부임을 보면 처음 상태를 기록할 이유가 생깁니다.</p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 시작 상태를 남겨야 마지막 날의 약속을 판단할 수 있다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">처음부터 있던 바닥과 점주가 나중에 설치한 바닥이 섞이면 어느 상태로 돌려줄지 다툴 수 있습니다. 계약 전 사진과 도면을 함께 확인하는 일이 마지막 공제액을 판단할 기준이 됩니다.</p>
          <p className="leading-7">3년 안에 회수할 수 없는 시설을 설치하려면 연장 가능성과 조건을 검토해야 합니다. 건물주도 월 200만 원 전부를 순수익으로 쓸 수는 없습니다. 다음 점주를 못 찾아 두 달 비는 별도의 1년을 가정하면, 12개월 내내 받았을 2천400만 원에서 400만 원이 빠져 2천만 원을 받습니다. 여기에 수선·세금·이자 등을 더 빼야 합니다. 앞의 3년 계약에 공실 두 달을 넣은 계산은 아닙니다.</p>
        </div>

        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">사진과 기간이 마지막 돈에 영향을 준다는 점을 알았으므로 계약의 이름을 붙입니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. 맡긴 돈, 사용료, 종료 상태를 가르는 말</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">종료 때 남은 채무와 맞춰 돌려받기로 맡기는 돈은 보증금입니다. 사례의 3천만 원은 건물 자체를 산 돈이 아닙니다.</p>
          <p className="leading-7">공간을 쓰는 대가가 차임이며 일상에서는 월세라고 부릅니다. 월 200만 원은 월별 사용에 대응하고, 관리비와 부가세 포함 여부는 별도로 확인합니다.</p>
          <p className="leading-7">계약이 끝날 때 약정 상태로 돌려놓는 의무를 원상복구라고 합니다. 무엇이 원래 상태인지는 계약과 최초 인도 상태, 이후 합의 및 적용 법에 따라 판단해야 합니다.</p>
        </div>

        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">보증금·차임·원상복구를 가렸으니 계약 전부터 36개월 말까지 따라갑니다.</p>
      </section>
      <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. 공간의 사용권과 끝날 때의 의무를 한 계약에서 읽습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">계약 전에는 등기상 소유자와 계약 상대, 대리인 권한, 담보권과 체납 등 보증금 회수에 영향을 주는 자료를 확인합니다. 주소·호수·실제 사용 면적을 맞추고 업종, 공사와 간판 설치 범위를 서면으로 남깁니다.</p>
          <p className="leading-7">입주일에 보증금 3천만 원 지급과 열쇠·공간 인도를 확인합니다. 이후 36개월 동안 월세 200만 원과 관리비를 구분해 기록합니다. 이 사례와 달리 공사기간 무상 사용을 약정한다면 면제되는 것이 월세인지 관리비도 포함하는지와 시작일을 적어야 합니다.</p>
          <p className="leading-7">수선은 누수·구조체·설비·소모품별 담당을 정합니다. 고장 통지와 응답, 긴급 수리 비용을 어떤 자료로 확인할지도 남깁니다. 남은 계약기간과 갱신 통지 날짜를 달력으로 관리하고 중도 이전 시 손해와 새 임차인 조건을 확인합니다.</p>
          <p className="leading-7">3년 말에는 반환할 상태를 입주 사진과 대조하고 미납액과 합의된 복구액을 항목별로 정산합니다. 공제 사유가 없다면 3천만 원을 반환받지만, 단순히 36개월이 지났다는 사실만으로 인도·정산 절차가 끝나는 것은 아닙니다.</p>
        </div>

        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">계약과 실제 인도를 연결했습니다. 한국에서 제3자에게 효력을 갖추는 요건을 확인합니다.</p>
      </section>
      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8. 한국에서 공간을 인도받고 등록하는 이유를 원문으로 읽는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            계약서를 썼어도 건물 소유자가 바뀌면 새 소유자에게 임대차를 주장할 수 있는지가 문제가 됩니다. 한국 상가건물 임대차보호법 제3조 제1항은 건물 인도와 사업자등록 신청이라는
            요건을 연결합니다.
          </p>
        </div>
        <SourceApplication source="한국 상가건물 임대차보호법 제3조 제1항" excerpt="그 다음 날부터 제3자에 대하여 효력이 생긴다" application="3천만 원을 맡기는 점주는 실제 공간을 인도받은 사실과 등록 신청의 사업장 표시를 맞춥니다. 이 조항의 효력과 보증금을 남보다 먼저 돌려받는 요건은 별개이므로 선순위 권리·확정일자·적용 범위도 함께 확인합니다." />
        <div className="prose prose-neutral mt-5 max-w-none dark:prose-invert">
          <p className="leading-7">건물을 인도받고 사업자등록을 신청하면 그다음 날부터 제3자에게 임대차의 효력을 주장할 수 있습니다. 이를 대항력이라고 합니다. 제3조 제2항은 건물을 넘겨받은 사람이 임대인의 지위를 승계한다고 규정합니다. 계약서에 서명했다는 사실만으로 이 요건이 모두 갖춰지는 것은 아닙니다.</p>
          <p className="leading-7">경매·공매에서 후순위 권리자나 다른 채권자보다 먼저 받을 권리인 우선변제권은 제5조의 별도 요건을 봅니다. 위 요건에 확정일자가 더 필요하며 법의 적용 범위도 확인해야 합니다. 제2조는 보증금 규모에 따른 일반 적용 범위를 정하면서 제3조 등 일부 조항은 그 범위를 넘는 임대차에도 적용합니다. 대항력이 있다는 사실만으로 제5조의 적용이나 3천만 원 전액 회수를 보장하지는 않습니다. 전액 회수 여부는 선순위 권리와 실제 배당 재원에 달려 있습니다.</p>
        </div>
        <CitationBlock source="한국 상가건물 임대차보호법 제3조" citeKey={1} href="https://law.go.kr/LSW/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=1013685403">2026-05-12 시행 조문을 2026-10-04 확인했습니다. 인도·사업자등록 신청, 다음 날 효력, 양수인의 지위 승계를 확인합니다.</CitationBlock>
        <CitationBlock source="한국 상가건물 임대차보호법 제2조·제5조" citeKey={6} href="https://www.law.go.kr/LSW/lsSideInfoP.do?lsiSeq=279651&amp;joNo=0005&amp;joBrNo=00&amp;docCls=jo&amp;urlMode=lsScJoRltInfoR">제2조의 일반 적용 범위와 예외, 제5조 제2항의 대항 요건·확정일자·우선변제 조문을 실제 대조했습니다. 개별 점포의 적용 여부나 배당액을 판정한 것은 아닙니다.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
            등록 요건과 반환 우선순위를 구분했습니다. 다른 지역의 계약도 비교해 봅니다.
          </p>
      </section>
      <section id="comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. 갱신과 양도는 국가별로 따로 확인해야 합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">한국에서는 임차인이 언제 갱신을 요구했는지와 거절 사유를 함께 봅니다. 제10조는 종료 6개월 전부터 1개월 전까지의 요구, 처음 기간을 포함한 총 10년 한도, 차임 연체 등 예외를 규정합니다. 모든 계약이 자동으로 10년 보장된다는 뜻은 아닙니다. 제10조의4가 보호하는 것도 일정 요건에서의 권리금 회수 기회입니다. 새 점주에게 받을 금액 자체를 건물주가 보장하는 제도가 아닙니다.</p>
          <p className="leading-7">영국 잉글랜드·웨일스에서는 1954년 법의 사업 임차 갱신권이 적용되는지, 계약을 맺기 전에 정해진 절차로 갱신권을 배제했는지를 확인합니다. 한국의 10년 기준을 옮겨 쓸 수 없습니다. 2026-10-04 확인한 Law Commission 페이지에는 같은 해 9월 16일 끝난 2차 의견 수렴의 답변을 분석 중이라고 나옵니다. 그 페이지의 개정 제안은 현재 시행 규칙과 구별해서 읽어야 합니다.</p>
          <p className="leading-7">호주 NSW의 소매 임대차 안내는 종료 때 계약에서 정한 상태로 공간을 되돌리도록 설명합니다. 처음 상태의 기록과 계약 조항을 대조하고, 실제 공사 대신 돈으로 정산하는 합의가 있는지도 봅니다. NSW 안내를 한국 점포의 복구 범위를 확정하는 법으로 사용할 수는 없습니다.</p>
          <p className="leading-7">미국도 주·도시·계약별 차이가 커서 한국의 갱신 기간을 그대로 옮길 수 없습니다. 어느 나라든 먼저 임차권의 보호 대상, 강행규정, 갱신의 예외, 건물주 동의, 보증금 보관 규칙을 확인합니다.</p>
        </div>
        <SourceApplication source="NSW Small Business Commissioner · Make good" excerpt="restore the premises to the state agreed in the lease" application="같은 3년 계약의 마지막 날, 입주 사진·도면과 계약에서 약정한 반환 상태를 대조한다는 질문을 가져옵니다. 복구비를 보증금 3천만 원에서 임의로 정하는 것이 아니라 해당 관할의 법과 계약, 실제 공사 내역 및 합의에 따라 정산해야 합니다." />
        <CitationBlock source="NSW · What to do at the end of the lease" citeKey={2} href="https://www.smallbusiness.nsw.gov.au/help/common-questions/what-to-do-at-the-end-of-the-lease">2026-10-04 실제 Make good 항목의 계약 상태·최초 기록·금전 정산 합의를 읽었습니다. NSW 소매 임대차 안내입니다.</CitationBlock>
        <CitationBlock source="대한민국 상가건물 임대차보호법 제10조·제10조의4" citeKey={3} href="https://www.law.go.kr/LSW/lsInfoP.do?ancNo=21083&ancYd=20251111&efYd=20260512&lsiSeq=279651">2026-05-12 시행 법령의 조문별 원문을 2026-10-04 확인했습니다. 갱신 요구 기간·총 10년 한도·예외와 권리금 회수 기회 보호를 구분합니다.</CitationBlock>
        <CitationBlock source="UK Law Commission · Business tenancies" citeKey={4} href="https://lawcom.gov.uk/project/business-tenancies-the-right-to-renew/">1954년 법의 배경과 2026년 2차 의견 수렴 후 상태를 확인했습니다. 개정 제안이 곧 시행법이라는 근거는 아닙니다.</CitationBlock>
        <CitationBlock source="GOV.UK · Renewing and ending business leases" citeKey={5} href="https://www.gov.uk/government/publications/renewing-and-ending-business-leases-a-guide-for-tenants-and-landlords">2026-07-30 갱신된 웹 안내의 잉글랜드·웨일스 범위와 계약 전 갱신권 배제 절차 설명을 읽었습니다. 첨부 PDF 전체를 읽었다는 뜻은 아닙니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
            나라별 보호 범위를 구분했습니다. 이제 시설을 산 권리와 공간을 쓸 권리가 어떻게 다른지 봅니다.
          </p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10. 권리금과 보증금, 시설값은 서로 다른 청구권입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">장사가 잘되는 곳에서 새 점주가 기존 점주에게 돈을 준다 해도 그 돈이 임대인에게 낸 보증금은 아닙니다. 시설을 샀어도 임대인이 새 임대차를 거절할 수 있는 조건과 법적 제한을 따로 봐야 합니다.</p>
          <p className="leading-7">원상복구 조항도 무조건 벽을 전부 헐라는 뜻으로 읽을 수 없습니다. 최초 인도 상태, 이후 합의, 실제 철거 의사, 적용 법과 관련 판례를 대조해야 합니다. 새 점주에게 시설을 팔았다는 사실만으로 기존 점주의 임대차 채무나 복구 의무가 모두 사라지는 것도 아닙니다.</p>
        </div>

        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">계약의 시작 상태와 종료 의무를 함께 남기면 같은 공간에 대한 서로 다른 청구를 구분할 수 있습니다.</p>

        <ReviewPrompts questions={["시작부터 종료까지 지급한 현금은 얼마이며, 3천만 원을 전액 반환받으면 순지급액은 얼마인가요? (답: 3절)", "한국에서 건물 인도와 사업자등록 신청을 마쳤다는 사실만으로 보증금 3천만 원의 우선변제와 전액 회수까지 확정할 수 있을까요? (답: 8절)", "잉글랜드·웨일스 점포에 한국의 10년 기준을 적용하거나, Law Commission의 개정 제안을 시행법으로 읽으면 왜 잘못될까요? (답: 9절)"]} />
      </section>
    </div>
  );
}
