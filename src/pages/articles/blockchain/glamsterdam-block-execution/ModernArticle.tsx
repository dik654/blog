import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../../world-systems/FlowRail";
import SourceApplication from "../../world-systems/SourceApplication";
import ReviewPrompts from "../../world-systems/ReviewPrompts";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./codeRefs";
export default function GlamsterdamBlockExecutionArticle() { const sidebar=useCodeSidebar(); return <><article className="space-y-14">
<section id="overview" data-teach-level="S" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">1. 같은 블록을 더 잘 전달하고 실행하려면 무엇을 바꿔야 하는가</h2>
<p>
            블록 하나를 받아들이려면 누가 제안했는지 확인하고 거래 자료를 받고 실제 실행 결과가 맞는지 검사해야 합니다. 이 일을 모두 같은 순간에 몰아넣으면 자료를 전파하고 거래를
            실행할 시간이 부족해집니다. 거래가 접근할 상태를 미리 알 수 있으면 저장소 읽기와 실행 준비도 나눌 수 있습니다.
          </p><p>Glamsterdam의 ePBS와 블록 접근 목록은 이 두 문제를 다룹니다. 2026-10-04 기준 관련 EIP는 Review이고 업그레이드의 메인넷 활성화 날짜는 비어 있습니다. 이 글의 동작은 제안과 고정한 개발 명세의 설명이며 현재 메인넷의 활성 기능이라고 전제하지 않습니다.</p><CitationBlock source="EIP-7773 · Glamsterdam" citeKey={1} href="https://eips.ethereum.org/EIPS/eip-7773">7732·7928의 예정 목록과 활성화 상태. 메인넷 적용 여부는 별도로 확인합니다.</CitationBlock>
<p data-stage-bridge="overview" className="text-sm text-muted-foreground">전달과 실행의 시간을 나누는 목표를 잡았습니다. 각 일을 맡는 역할을 먼저 그립니다.</p>
</section>
<section id="black-box" data-teach-level="B" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">2. 내용을 만드는 사람, 고르는 사람, 검사하는 사람</h2>
<FlowRail title="두 거래가 들어간 블록의 전달과 검증" steps={[{actor:"내용 제작",movement:"거래를 골라 실행 자료와 약속을 만듭니다.",receives:"거래 내용·입찰"},{actor:"제안 선택",movement:"규칙에 맞는 약속을 블록에 넣습니다.",receives:"합의가 다룰 블록"},{actor:"도착 확인",movement:"약속한 자료가 제때 보였는지 확인합니다.",receives:"가용성에 관한 표"},{actor:"실행 검증",movement:"두 거래의 결과와 접근 기록을 대조합니다.",receives:"유효한 상태 전이"}]} /><p>자료가 제때 도착했다는 확인과 내용의 실행이 맞다는 판정은 별개입니다. 역할을 나눠도 최종적으로 필요한 검사는 사라지지 않습니다. 잘못된 목록을 빠르게 받는 것은 올바른 상태를 얻은 것과 다릅니다.</p>
<p data-stage-bridge="black-box" className="text-sm text-muted-foreground">역할은 유지한 채 두 거래가 같은 숫자를 바꾸는 상황을 넣습니다.</p>
</section>
<section id="case" data-teach-level="0" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">3. 100에서 10을 빼고 5를 더하면 마지막 값은 95다</h2>
<p>한 계약의 저장 칸 X가 100이라고 합시다. 첫 거래 T1은 X에서 10을 빼 90을 저장합니다. 두 번째 거래 T2는 X에 5를 더해 95를 저장합니다. 이 사례는 저장 값의 의존성을 보여 주는 가정이며 수수료·계정 nonce·다른 상태는 생략했습니다.</p><p>두 거래의 실행 뒤 값을 기록하면 X에 대해 (거래 1, 90), (거래 2, 95)가 남습니다. T2가 처음 값 100에 5를 더해 105를 최종값으로 제출하면 앞 거래를 반영하지 않은 오류입니다. 두 거래가 같은 칸을 쓰더라도 중간값 90을 알면 준비와 검증을 나눌 여지가 생깁니다.</p>
<p data-stage-bridge="case" className="text-sm text-muted-foreground">중간값을 포함한 기록을 시간 순서로 놓아 봅니다.</p>
</section>
<section id="picture" data-teach-level="1" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">4. 최종 95만이 아니라 첫 거래 뒤 90도 전달한다</h2>
<div className="grid gap-4 md:grid-cols-3">{[["블록 직전","X=100","검증이 시작하는 상태"],["거래 1 뒤","X=90","100−10을 실행한 결과"],["거래 2 뒤","X=95","앞 결과 90에 5를 더함"]].map(([name,value,desc])=><div key={name} className="rounded-xl border p-5"><h3 className="font-semibold">{name}</h3><p className="my-3 text-2xl font-bold tabular-nums">{value}</p><p className="text-sm">{desc}</p></div>)}</div><p>그림은 저장 칸 하나만 보여 줍니다. 실제 블록 접근 기록에는 주소, 저장 칸, 잔액·nonce·코드 변화와 읽기만 한 항목도 포함됩니다. 실제 접근이 없는데 목록에 이름만 올린 항목도 검증 대상입니다.</p>
<p data-stage-bridge="picture" className="text-sm text-muted-foreground">어떤 정보를 더 주려는지 보였습니다. 이 정보 없이 생기는 지연을 살펴봅니다.</p>
</section>
<section id="need" data-teach-level="2" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">5. 다음 거래가 읽을 위치를 모르면 준비를 뒤늦게 시작한다</h2>
<p>거래를 하나씩 실행하다가 필요한 저장 칸을 처음 발견하면 그때 디스크 읽기를 기다립니다. 접근할 위치와 거래별 결과가 먼저 오면 데이터를 미리 읽고 여러 검증 작업을 준비할 수 있습니다. 그러나 목록을 보낸 사람이 거짓 90을 넣었는지 확인하는 일은 여전히 필요합니다.</p><p>
            또 블록을 제안하는 검증자가 무거운 거래 내용까지 모두 받아 즉시 실행해야 하면 합의 투표 전 시간이 짧아집니다. 거래 내용을 만들고 공개하는 책임을 분리하면 시간 배분을 바꿀
            수 있지만 자료를 숨기거나 늦게 보내는 경우까지 규칙으로 다뤄야 합니다.
          </p>
<p data-stage-bridge="need" className="text-sm text-muted-foreground">접근 정보와 시간 배분이라는 두 문제가 생겼습니다. 각각의 제안 이름을 붙입니다.</p>
</section>
<section id="names" data-teach-level="3" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">6. BAL은 실행 자료이고 ePBS는 제작·제안의 규칙이다</h2>
<p>블록 접근 목록(Block-Level Access List, BAL)은 실제로 읽거나 바꾼 상태와 거래 뒤 값을 담습니다. EIP-7928의 블록 접근 인덱스는 사전 시스템 처리가 0, 거래가 1부터 n, 사후 처리가 n+1입니다. 두 거래 사례에서는 T1=1·T2=2·사후=3입니다.</p><p>ePBS(EIP-7732)는 블록 내용을 만드는 builder와 합의 블록을 제안하는 proposer의 관계를 프로토콜 안에서 다룹니다. bid는 특정 내용과 지급 조건에 관한 서명한 약속이고 payload는 거래를 포함한 실제 실행 자료입니다. PTC는 정해진 시점에 약속한 자료가 보였는지 확인하는 위원회입니다.</p><p>
            ePBS가 BAL의 정확성을 대신 확인하지 않고 BAL이 제작자 지급을 집행하지도 않습니다. 두 기능을 같은 블록에 적용할 때도 각각의 역할과 증거를 따라가야 합니다.
          </p>
<p data-stage-bridge="names" className="text-sm text-muted-foreground">이름을 두 문제에 연결했습니다. 이제 100→90→95가 들어간 블록의 전달과 검사를 추적합니다.</p>
</section>
<section id="mechanism" data-teach-level="4" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">7. 서명한 약속, 실제 내용, 접근 목록을 차례로 검사한다</h2>
<p>
            제작자는 T1·T2의 순서를 정하고 X의 90·95를 포함한 접근 목록과 실행 결과를 만듭니다. 그 실행 블록의 hash와 slot, 부모 블록, 지급 조건을 bid에
            넣습니다. 제안자는 적절한 bid를 합의 블록에 담고 제작자는 이에 대응하는 실제 payload를 공개합니다.
          </p><p>
            PTC는 자료가 제때 보였는지와 관련 가용성을 확인합니다. 그것만으로 X=95의 계산을 모두 검사했다고 읽지 않습니다. 실행 검증은 거래 순서·이전 상태·가스와 실제 접근을
            확인하고 계산해 만든 목록을 블록이 약속한 hash와 대조합니다. 90 대신 89를 주장하거나 필요한 X를 누락했다면 받아들일 수 없습니다.
          </p><p>개발 명세의 bid 처리에서는 제작자 활성 상태·서명·지급 여력·slot·부모를 검사합니다. 예를 들어 지급 조건이 0.01 ETH라면 10,000,000 Gwei로 표현합니다. 이 숫자는 설명용이며 실제 입찰 시세가 아닙니다. 지급 처리와 실제 내용 공개가 따로 움직이므로 자료 미공개·지연에 관한 합의 규칙도 필요합니다.</p><CitationBlock source="EIP-7732 · ePBS" citeKey={2} href="https://eips.ethereum.org/EIPS/eip-7732">제안·제작 분리와 자료 도착 확인, 실행 검증의 시간 분리를 설명합니다. Review 상태의 제안입니다.</CitationBlock>
<p data-stage-bridge="mechanism" className="text-sm text-muted-foreground">실제 계산과 지급 조건을 다른 검사로 추적했습니다. 공개 명세가 두 검사를 어떻게 표현하는지 봅니다.</p>
</section>
<section id="source" data-teach-level="5" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">8. 개발 명세는 bid와 payload를 서로 다른 구조로 둔다</h2>
<SourceApplication source="consensus-specs · process_execution_payload_bid" excerpt="assert can_builder_cover_bid(state, builder_index, amount)" application="설명용 0.01 ETH의 bid를 받으면 amount 10,000,000 Gwei를 감당할 수 있는지 검사합니다. 이 줄은 X가 100→90→95로 올바르게 바뀌었는지를 계산하는 줄이 아닙니다. 상태 실행은 별도 경로에 남습니다." /><p>
            consensus-specs commit 889a389f9f95d2aba52aedf233217f370772dd3d의 Gloas 명세를 보존했습니다.
            ExecutionPayloadBid에는 block_hash·slot·value 등 약속의 필드가 있고 ExecutionPayloadEnvelope에는 실제 payload가
            있습니다. 같은 파일의 process_execution_payload_bid가 약속을 검사하고 보류 중 지급을 기록합니다.
          </p><div className="flex flex-wrap gap-3"><CodeViewButton label="Bid와 Envelope 원본 구조" onClick={()=>sidebar.open("containers",codeRefs.containers)} /><CodeViewButton label="제작자·서명·지급 여력 검사" onClick={()=>sidebar.open("bid",codeRefs.bid)} /></div><p>이 snapshot은 구현자용 진행 중 명세입니다. 최신 EIP 설명과도 세부 구조가 다를 수 있으므로 서로 다른 버전의 필드를 섞어 하나의 배포 사양처럼 쓰지 않습니다. 메인넷 배포 코드나 성능 측정값으로 제시하지 않습니다.</p><CitationBlock source="Ethereum consensus-specs · pinned 889a389" citeKey={3} href="https://github.com/ethereum/consensus-specs/blob/889a389f9f95d2aba52aedf233217f370772dd3d/specs/gloas/beacon-chain.md">Gloas의 실제 자료 구조와 bid 처리 원문입니다. 개발 명세의 commit과 라이선스를 보존했습니다.</CitationBlock>
<p data-stage-bridge="source" className="text-sm text-muted-foreground">약속을 검사하는 실물을 확인했습니다. 같은 두 거래의 실행 자료 검사와 비교합니다.</p>
</section>
<section id="comparison" data-teach-level="6" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">9. 접근 목록을 받더라도 실제 실행과 맞는지 확인한다</h2>
<SourceApplication source="execution-specs · Amsterdam fork.py" excerpt={'raise InvalidBlock("Invalid block access list hash")'} application="X의 90·95로 실행해 만든 접근 목록의 hash가 제출된 블록의 hash와 다르면 이 경로로 거절합니다. 목록에 95라고 적혀 있다는 이유만으로 실제 T1·T2를 검증한 것으로 취급하지 않습니다." /><p>execution-specs commit a87891f7e69eab1f903233c61c5514d8c94bd5d1은 블록 본문을 적용해 목록을 만들고 hash를 대조합니다. EIP-7928은 자료를 이용한 병렬 읽기·거래 검증·상태 갱신의 가능성을 설명합니다. 참조 명세의 순차적 표현 자체를 실제 클라이언트 병렬 처리 성능으로 읽지 않습니다.</p><div className="flex flex-wrap gap-3"><CodeViewButton label="실행 결과와 BAL hash 대조" onClick={()=>sidebar.open("validate",codeRefs.validate)} /><CodeViewButton label="거래별 상태 변화 자료 구조" onClick={()=>sidebar.open("bal",codeRefs.bal)} /></div><p>T2가 X 대신 별도 칸 Y=50에 5를 더한다면 저장 칸 기준 결과는 X=90·Y=55입니다. 반면 원래 사례는 X=90을 T2의 입력으로 사용합니다. 전자는 독립 작업을 찾기 쉽고 후자는 중간값·검증 의존성을 관리해야 합니다. 실제 병렬성에는 공통 수수료 수령 계정 등 생략한 상태도 영향을 줍니다.</p><CitationBlock source="Ethereum execution-specs · pinned a87891f" citeKey={4} href="https://github.com/ethereum/execution-specs/blob/a87891f7e69eab1f903233c61c5514d8c94bd5d1/src/ethereum/forks/amsterdam/fork.py">계산한 목록의 hash와 블록 header를 대조하는 참조 구현입니다.</CitationBlock><CitationBlock source="EIP-7928 · Block-Level Access Lists" citeKey={5} href="https://eips.ethereum.org/EIPS/eip-7928">실제 접근·변화의 기록, 인덱스와 검증 조건을 설명합니다. 제안의 성능 가능성과 실측은 구분합니다.</CitationBlock>
<p data-stage-bridge="comparison" className="text-sm text-muted-foreground">지급 약속과 실행 자료를 서로 다른 원본으로 확인했습니다. 마지막으로 개선 효과의 조건을 제한합니다.</p>
</section>
<section id="limits" data-teach-level="7" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">10. 병렬 실행 가능성과 실제 처리량 개선은 같지 않다</h2>
<p>
            목록이 커지면 전송·저장·검증 비용이 늘고 거짓 읽기 항목은 쓸모없는 준비 작업을 유발할 수 있습니다. 공유 상태가 많거나 디스크·네트워크가 병목이면 실행 작업을 나눠도 전체
            지연은 기대만큼 줄지 않을 수 있습니다. 따라서 “두 거래를 나누니 두 배 빠르다”는 결론은 이 사례에서 나오지 않습니다.
          </p><p>제작자가 자료를 숨기거나 지연시키는 선택, 위원회 구성과 네트워크 지연도 ePBS의 결과에 영향을 줍니다. 약속에 서명했다는 사실만으로 제때 자료를 받았거나 실행이 유효하다고 판정하지 않습니다. 각 실패에 적용되는 fork 선택·지급 규칙은 고정한 명세 버전 전체로 확인해야 합니다.</p><p>성능 수치를 주장하려면 같은 장비·클라이언트·블록 입력에서 준비·전송·실행·검증 시간을 나눠 측정해야 합니다. 활성화 상태는 <Link className="underline" to="/cs/blockchain/ethereum-future-roadmap">Ethereum 로드맵 읽기</Link>, 게시 데이터와 공급 설정은 <Link className="underline" to="/cs/blockchain/robinhood-chain-blob-demand">블롭 수요 회계</Link>에서 이어집니다.</p>
<p data-stage-bridge="limits" className="text-sm text-muted-foreground">100→90→95의 정확성과 0.01 ETH 약속의 집행을 각각 확인해야 전달 속도와 실행 안전성을 함께 설명할 수 있습니다.</p>
<ReviewPrompts questions={["T2가 X의 처음 값 100을 읽고 105를 제출하면 어떤 의존성을 놓친 것인가요? (답: 3·9절)", "PTC가 자료 도착을 확인했다면 X=95의 실행도 검증된 것인가요? (답: 7·9절)"]} />
</section>
</article><CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={{}} projectMetas={{"consensus-specs": {"id": "consensus-specs", "label": "합의 명세 · 889a389", "badgeClass": "border-sky-500 text-sky-700"}, "execution-specs": {"id": "execution-specs", "label": "실행 명세 · a87891f", "badgeClass": "border-emerald-500 text-emerald-700"}}} /></>; }
