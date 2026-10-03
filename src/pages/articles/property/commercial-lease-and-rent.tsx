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

        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">사용 기간과 투자 회수의 연결을 잡았습니다. 시작과 매달의 지급, 끝의 정산을 나눕니다.</p>
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
          <p className="leading-7">점주가 3천만 원을 맡기고 3년 동안 월 200만 원을 내는 계약을 둡니다. 별도 관리비·세금·공사비는 아직 제외합니다. 계약 종료 때 미납이나 손상이 없다면 맡긴 3천만 원을 전액 반환한다고 약정한 사례입니다. 모두 (가정)입니다.</p>
          <p className="leading-7">36개월 동안 공간 사용의 대가로 7천200만 원이 나갑니다. 3천만 원은 그 기간 다른 곳에 쓸 수 없지만 예정대로 정산되면 돌아옵니다. 그래서 개업 때 필요한 현금 3천만 원과 3년의 사용 비용 7천200만 원을 같은 지출로 합쳐 이익을 계산하지 않습니다.</p>
        </div>

        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">7천200만 원의 사용료와 3천만 원의 반환 기대를 구분했습니다. 인도 흐름을 그립니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 사용할 권리와 반환할 돈은 반대 방향으로 움직인다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">처음에는 돈과 공간을 주고받지만 마지막에는 점포 인도와 맡긴 돈의 정산을 다시 맞춥니다. 월별 지급만 기록하면 반환과 복구 책임이 그림에서 빠집니다.</p>
        </div>
        <FlowRail
          title="(가정) 보증금 3천만 원, 월세 200만 원, 3년, 공실 2개월"
          steps={[
            { actor: "임차인", movement: "보증금 3천만 원을 맡기고 매달 200만 원을 냅니다.", receives: "3년간 약정된 사용권" },
            { actor: "임대인", movement: "점포를 제공하고 공실·수선 위험을 지닙니다.", receives: "월 임대료" },
            { actor: "다음 임차인", movement: "기존 시설 인수 여부를 선택합니다.", receives: "새 계약 또는 양도된 사용권" },
          ]}
        />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">공간 반환도 거래의 일부임을 보면 처음 상태를 기록할 이유가 생깁니다.</p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 시작 상태를 남겨야 마지막 날의 약속을 판단할 수 있다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">처음부터 있던 바닥과 점주가 나중에 설치한 바닥이 섞이면 어느 상태로 돌려줄지 다툴 수 있습니다. 계약 전 사진과 도면을 함께 확인하는 일이 마지막 공제액을 판단할 기준이 됩니다.</p>
          <p className="leading-7">3년 안에 회수할 수 없는 시설을 설치하려면 연장 가능성과 조건을 검토해야 합니다. 건물주도 월 200만 원 전부를 순수익으로 쓸 수는 없습니다. 다음 점주를 못 찾아 두 달 비면 연간 명목 월세 2천400만 원에서 400만 원이 먼저 빠집니다. 공실 두 달은 별도 비교 (가정)입니다.</p>
        </div>

        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">사진과 기간이 마지막 돈에 영향을 준다는 점을 알았으므로 계약의 이름을 붙입니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. 맡긴 돈, 사용료, 종료 상태를 가르는 말</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">종료 때 남은 채무와 맞춰 돌려받기로 맡기는 돈은 보증금입니다. 사례의 3천만 원은 건물 자체를 산 돈이 아닙니다.</p>
          <p className="leading-7">공간을 쓰는 대가가 차임이며 일상에서는 월세라고 부릅니다. 월 200만 원은 월별 사용에 대응하고, 관리비와 부가세 포함 여부는 별도로 확인합니다.</p>
          <p className="leading-7">계약이 끝날 때 약정 상태로 돌려놓는 의무를 원상복구라고 합니다. 무엇이 원래 상태인지는 계약과 최초 인도 상태, 이후 합의에 따라 판단해야 합니다.</p>
        </div>

        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">보증금·차임·원상복구를 가렸으니 계약 전부터 36개월 말까지 따라갑니다.</p>
      </section>
      <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. 공간의 사용권과 끝날 때의 의무를 한 계약에서 읽습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">계약 전에는 등기상 소유자와 계약 상대, 대리인 권한, 담보권과 체납 등 보증금 회수에 영향을 주는 자료를 확인합니다. 주소·호수·실제 사용 면적을 맞추고 업종, 공사와 간판 설치 범위를 서면으로 남깁니다.</p>
          <p className="leading-7">입주일에 보증금 3천만 원 지급과 열쇠·공간 인도를 확인합니다. 이후 36개월 동안 월세 200만 원과 관리비를 구분해 기록합니다. 공사기간 무상 사용을 약정했다면 면제되는 것이 월세인지 관리비도 포함하는지와 시작일을 적습니다.</p>
          <p className="leading-7">수선은 누수·구조체·설비·소모품별 담당을 정합니다. 고장 통지와 응답, 긴급 수리 비용을 어떤 자료로 확인할지도 남깁니다. 남은 계약기간과 갱신 통지 날짜를 달력으로 관리하고 중도 이전 시 손해와 새 임차인 조건을 확인합니다.</p>
          <p className="leading-7">3년 말에는 반환할 상태를 입주 사진과 대조하고 미납액과 합의된 복구액을 항목별로 정산합니다. 공제 사유가 없다면 3천만 원을 반환받지만, 단순히 36개월이 지났다는 사실만으로 인도·정산 절차가 끝나는 것은 아닙니다.</p>
        </div>

        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">계약과 실제 인도를 연결했습니다. 한국에서 제3자에게 효력을 갖추는 요건을 확인합니다.</p>
      </section>
      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8. 한국에서 공간을 인도받고 등록하는 이유를 원문으로 읽는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">계약서만 쓰고 사용자를 외부에 드러내지 않으면 건물 소유자가 바뀌는 상황에서 별도 문제가 생길 수 있습니다. 한국 상가건물 임대차보호법 제3조 제1항은 건물 인도와 사업자등록 신청이라는 요건을 연결합니다.</p>
        </div>
        <SourceApplication source="한국 상가건물 임대차보호법 제3조 제1항" excerpt="그 다음 날부터 제3자에 대하여 효력이 생긴다" application="3천만 원을 맡기는 점주는 실제 공간을 인도받은 사실과 등록 신청의 사업장 표시를 맞춥니다. 이 조항의 효력과 보증금을 남보다 먼저 돌려받는 요건은 별개이므로 선순위 권리·확정일자·적용 범위도 함께 확인합니다." />
        <CitationBlock source="한국 상가건물 임대차보호법 제3조 제1항" citeKey={1} href="https://law.go.kr/LSW/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=1013685403">2026-10-04 확인. 원문 문구와 위 사례 적용의 근거입니다.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">등록 요건과 반환 우선순위는 다르다는 점을 확인했습니다. 다른 관할의 계약도 대조합니다.</p>
      </section>
      <section id="comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. 갱신과 양도는 국가별로 따로 확인해야 합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">2026년 10월 기준 한국 상가건물 임대차보호법은 일정 요건에서 계약갱신요구와 권리금 회수 기회 보호를 규정합니다. 영국 잉글랜드·웨일스의 사업 임차권은 1954년 법의 갱신권과 계약 전 배제 합의 여부를 보아야 합니다. 호주 NSW는 retail lease의 양도·outgoings·make good 조항을 별도로 다룹니다.</p>
          <p className="leading-7">미국도 주·도시·계약별 차이가 커서 한국의 갱신 기간을 그대로 옮길 수 없습니다. 어느 나라든 먼저 임차권의 보호 대상, 강행규정, 갱신의 예외, 건물주 동의, 보증금 보관 규칙을 확인합니다.</p>
        </div>
        <SourceApplication source="NSW Retail Tenancy Guide · Make good" excerpt="before the lease ends, if any" application="한국의 3천만 원·월 200만 원·3년 계약을 NSW 규칙으로 처리할 수는 없습니다. 다만 종료 전 반환 의무를 계약 때 확인한다는 질문을 가져와 사진과 공사 동의, 반환 기준을 대조할 수 있습니다." />
        <CitationBlock source="NSW Retail Tenancy Guide · Make good" citeKey={2} href="https://www.smallbusiness.nsw.gov.au/about-retail-leases/retail-tenancy-guide">2026-10-04 확인. 이 절의 원문과 관할 범위를 확인합니다.</CitationBlock>
        <CitationBlock source="대한민국 상가건물 임대차보호법" citeKey={3} href="https://www.law.go.kr/LSW/lsInfoP.do?ancNo=21083&ancYd=20251111&efYd=20260512&lsiSeq=279651">2026-10-03 기준 시행 법령에서 갱신·권리금 관련 조문을 확인합니다.</CitationBlock>
        <CitationBlock source="UK Business tenancies: right to renew" citeKey={4} href="https://lawcom.gov.uk/project/business-tenancies-the-right-to-renew/">잉글랜드·웨일스 사업 임차의 갱신권과 계약 전 배제 가능성 안내입니다.</CitationBlock>
        <CitationBlock source="NSW Retail Tenancy Guide" citeKey={5} href="https://www.smallbusiness.nsw.gov.au/about-retail-leases/retail-tenancy-guide">호주 NSW의 소매 임대차 비용과 종료 의무 안내입니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">나라별 보호 범위를 구분했으니 시설과 권리금이 남기는 별도 권리를 봅니다.</p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10. 권리금과 보증금, 시설값은 서로 다른 청구권입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">장사가 잘되는 곳에서 새 점주가 기존 점주에게 돈을 준다 해도 그 돈이 임대인에게 낸 보증금은 아닙니다. 시설을 샀어도 임대인이 새 임대차를 거절할 수 있는 조건과 법적 제한을 따로 봐야 합니다.</p>
          <p className="leading-7">원상복구 조항도 무조건 벽을 전부 헐라는 뜻으로 읽을 수 없습니다. 최초 인도 상태, 이후 합의, 실제 철거 의사, 관할 법원 판례를 대조해야 합니다.</p>
        </div>

        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">계약의 시작 상태와 종료 의무를 함께 남기면 같은 공간에 대한 서로 다른 청구를 구분할 수 있습니다.</p>

        <ReviewPrompts questions={["월 200만 원을 36개월 낸 총액과 보증금 3천만 원을 왜 같은 성격의 비용으로 더하면 안 될까요? (답: 3절)", "건물주가 바뀌거나 종료 정산을 할 때 계약서 외에 인도·등록·사진 기록은 각각 무엇을 증명할까요? (답: 7절)"]} />
      </section>
    </div>
  );
}
