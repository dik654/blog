import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../../world-systems/FlowRail";
import SourceApplication from "../../world-systems/SourceApplication";
import ReviewPrompts from "../../world-systems/ReviewPrompts";
export default function ModernEthereumFutureRoadmapArticle() { return <article className="space-y-14">
<section id="overview" data-teach-level="S" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">1. 이름이 발표된 변화가 언제부터 내 거래의 규칙이 되는가</h2>
<p>Ethereum의 새 기능은 연구 글, 표준 제안, 여러 구현의 시험을 거쳐 특정 네트워크의 규칙이 됩니다. 지갑과 서비스는 그중 어느 단계까지 왔는지 알아야 거래를 만들 수 있습니다. 이름이 로드맵에 올라갔다는 사실만으로 현재 거래에 새 규칙을 적용할 수는 없습니다.</p><p>이 글의 확인일은 2026-10-04입니다. Glamsterdam은 개발·시험 단계이며 Hegotá는 다음 계획 단계입니다. 활성화 날짜가 없는 칸은 미확정으로 남기고, 같은 날짜에 읽은 원문을 비교합니다.</p>
<p data-stage-bridge="overview" className="text-sm text-muted-foreground">규칙의 내용보다 먼저 적용 여부를 판정한다는 목표를 잡았습니다. 판정에 참여하는 역할을 나눕니다.</p>
</section>
<section id="black-box" data-teach-level="B" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">2. 연구자·구현자·운영자는 서로 다른 결과물을 만든다</h2>
<FlowRail title="아이디어가 실제 규칙이 되는 과정" steps={[{actor:"제안하는 사람",movement:"문제와 바꿀 규칙을 적습니다.",receives:"검토 가능한 제안"},{actor:"구현·시험하는 사람",movement:"서로 다른 프로그램이 같은 결과를 내는지 확인합니다.",receives:"시험 결과와 릴리스"},{actor:"네트워크 운영자",movement:"정해진 조건부터 새 규칙을 실행합니다.",receives:"실제 활성화된 체인"}]} /><p>문서 편집자가 붙이는 상태와 네트워크가 실행하는 상태는 따로 확인합니다. 연구 결과가 좋아도 클라이언트 간 불일치가 남을 수 있고, 구현이 있어도 메인넷 활성화 시각이 정해지지 않을 수 있습니다.</p>
<p data-stage-bridge="black-box" className="text-sm text-muted-foreground">세 역할이 만드는 증거에 날짜가 가까운 실제 사례를 넣어 봅니다.</p>
</section>
<section id="case" data-teach-level="0" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">3. 10월 4일에 10월 6일 시험 일정을 읽었다면</h2>
<p>서비스 운영자가 2026-10-04에 Glamsterdam의 meta EIP-7773을 읽었다고 합시다. Sepolia 항목에는 epoch 353024와 timestamp 1791294816, 즉 2026-10-06 13:53:36 UTC가 있습니다. 확인일보다 이틀 뒤의 테스트넷 일정입니다. Hoodi와 Mainnet 활성화 칸은 비어 있습니다.</p><p>운영자는 이 자료로 Sepolia 전환 준비를 할 수 있습니다. 같은 기능이 메인넷에서 이미 실행된다고 판단할 수는 없습니다. 지갑에서 메인넷 거래를 보내는 고객에게 Sepolia 시험 날짜를 서비스 개시일로 안내하면 네트워크를 혼동한 것입니다.</p><CitationBlock source="EIP-7773 · Glamsterdam" citeKey={1} href="https://eips.ethereum.org/EIPS/eip-7773">2026-10-04 확인: Review 상태, Sepolia 일정과 비어 있는 Hoodi·Mainnet 활성화 항목.</CitationBlock>
<p data-stage-bridge="case" className="text-sm text-muted-foreground">같은 기능이라도 네트워크별 상태가 다릅니다. 날짜와 증거를 한 표에 놓습니다.</p>
</section>
<section id="picture" data-teach-level="1" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">4. 문서 상태와 배포 상태를 같은 행에 적는다</h2>
<div className="overflow-x-auto"><table className="w-full min-w-[560px] text-sm"><caption className="mb-3 text-left">2026-10-04 기준. 예정 날짜는 적용 완료를 뜻하지 않습니다.</caption><thead><tr><th className="p-3 text-left">대상</th><th className="p-3 text-left">원문 상태</th><th className="p-3 text-left">실행에 관한 증거</th></tr></thead><tbody>{[["Glamsterdam · EIP-7773","Review","Sepolia 10월 6일 예정, 메인넷 날짜 없음"],["ePBS 7732 · BAL 7928","Review / Glamsterdam SFI","해당 업그레이드에 넣으려는 합의"],["Hegotá · EIP-8081","Draft","활성화 표 비어 있음"],["FOCIL 7805 · Frame 8141","Hegotá SFI","예정 목록이며 적용 완료 아님"],["선택적 실행 증명 8025","Hegotá PFI","제안됐으며 SFI와 구분"]].map(r=><tr key={r[0]} className="border-t">{r.map(c=><td key={c} className="p-3 align-top">{c}</td>)}</tr>)}</tbody></table></div><p>ethereum.org의 Glamsterdam 소개에는 meta EIP가 Draft라는 문구가 남아 있지만 EIP 원문은 Review입니다. 소개 페이지의 요약과 원문의 상태가 다르면 확인일을 기록하고 원문 상태를 인용합니다.</p>
<p data-stage-bridge="picture" className="text-sm text-muted-foreground">상태표가 같은 색의 로드맵보다 많은 차이를 드러냅니다. 이 차이를 무시할 때 생기는 문제를 봅니다.</p>
</section>
<section id="need" data-teach-level="2" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">5. 시험 성공과 서비스의 지원 가능성은 다른 질문이다</h2>
<p>한 구현에서 거래가 통과해도 다른 클라이언트가 같은 결과를 내지 못하면 네트워크가 갈라질 수 있습니다. 또 블록 자료를 새 형식으로 만들었어도 지갑·탐색기·인덱서가 그 형식을 지원하지 않으면 사용자는 결과를 읽지 못합니다. 기능 출시에는 규칙의 합의와 도구 준비가 함께 필요합니다.</p><p>10월 4일 운영자는 테스트넷용 버전·설정·활성화 조건을 맞춥니다. 이전 규칙과 이후 규칙 양쪽에서 같은 거래를 시험할 자료도 준비합니다. 실패하면 로그와 재현 입력을 보존해 원인을 좁힙니다.</p>
<p data-stage-bridge="need" className="text-sm text-muted-foreground">왜 단계가 필요한지 알았으니 제안 문서에서 실제로 사용하는 이름을 붙입니다.</p>
</section>
<section id="names" data-teach-level="3" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">6. 문서의 Review와 업그레이드의 SFI를 분리한다</h2>
<p>Draft·Review·Last Call·Final은 EIP 문서의 표준화 진행 상태입니다. Proposed for Inclusion(PFI), Considered for Inclusion(CFI), Scheduled for Inclusion(SFI), Included는 특정 업그레이드가 그 기능을 어떻게 다루는지 나타냅니다. 두 축을 한 줄의 성숙도 점수로 합치지 않습니다.</p><p>SFI는 포함하려는 강한 의도와 준비 조건을 뜻하지만 시험 중 문제가 생기면 제외될 수 있습니다. Included는 해당 업그레이드의 활성화를 가리킵니다. 따라서 Review인 EIP도 SFI일 수 있고, Final인 일반 문서라도 모든 네트워크에 새 기능이 활성화된 것은 아닙니다.</p><CitationBlock source="EIP-7723 · Network upgrade inclusion stages" citeKey={2} href="https://eips.ethereum.org/EIPS/eip-7723">확인일 Last Call. 문서의 EIP 상태와 특정 업그레이드의 포함 단계가 다름을 설명합니다.</CitationBlock>
<p data-stage-bridge="names" className="text-sm text-muted-foreground">두 종류의 상태 이름을 구분했습니다. 같은 일정 확인을 실제 운영 순서로 따라갑니다.</p>
</section>
<section id="mechanism" data-teach-level="4" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">7. 제안에서 활성화 후 관측까지 한 줄로 추적한다</h2>
<p>운영자는 먼저 EIP-7773에서 Sepolia와 메인넷 행을 나눕니다. 다음으로 시험에 사용할 실행·합의 클라이언트 릴리스와 fork 설정을 고정합니다. Sepolia에서 활성화 경계 직전과 직후의 거래·블록을 기록하고, 두 클라이언트가 같은 상태와 블록을 받아들이는지 확인합니다.</p><p>10월 6일이라는 날짜가 지났다는 이유만으로 성공 판정을 내리지 않습니다. 실제 블록 시각과 fork 적용, 서비스 로그, 재조직·동기화·장애 여부를 확인해야 합니다. 메인넷 판단은 이후 메인넷 일정·릴리스·관측을 별도로 가져와 같은 순서로 수행합니다. 10월 4일에는 이 마지막 증거가 아직 없습니다.</p><p>Glamsterdam의 ePBS와 BAL은 각각 블록 제작·검증 시점과 실행 자료를 바꾸는 기능입니다. 두 거래의 실제 구조와 코드는 <Link className="underline" to="/cs/blockchain/glamsterdam-block-execution">Glamsterdam 블록 실행</Link>에서 이어집니다. 이 글의 판단 대상은 기능의 원리보다 적용 상태입니다.</p>
<p data-stage-bridge="mechanism" className="text-sm text-muted-foreground">계획과 실행을 연결할 증거가 정해졌습니다. 이제 원문 한 단어를 사례의 판단으로 바꿉니다.</p>
</section>
<section id="source" data-teach-level="5" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">8. 활성화라는 말에는 실제 네트워크 조건이 붙는다</h2>
<SourceApplication source="EIP-7723 · Included" excerpt="the EIPs have been activated as part of the network upgrade" application="10월 4일에 Sepolia의 10월 6일 일정만 읽은 운영자는 이 문장의 activated를 충족하지 못했습니다. 메인넷 행도 비어 있으므로 메인넷 Included로 기록하지 않습니다. 실제 활성화 증거를 얻은 네트워크에 한해서 상태를 바꿉니다." /><p>EIP-7773의 Scheduled 목록에 7732·7928이 있다는 사실은 그 기능을 시험·준비할 이유입니다. 메인넷 적용 완료의 근거가 되려면 메인넷 활성화 조건과 실제 적용을 추가로 확인해야 합니다. EIP-8070은 같은 문서의 별도 Networking 항목에 있어 Core 목록과도 구별합니다.</p><CitationBlock source="EIP-7773 · Scheduled EIPs and activation" citeKey={3} href="https://eips.ethereum.org/EIPS/eip-7773">목록과 활성화 표를 함께 읽어 포함 의도와 실행 여부를 연결합니다.</CitationBlock>
<p data-stage-bridge="source" className="text-sm text-muted-foreground">원문의 activated를 구체적인 확인 조건으로 바꿨습니다. 더 먼 계획에도 같은 판정을 적용합니다.</p>
</section>
<section id="comparison" data-teach-level="6" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">9. Hegotá와 연구 로드맵에도 같은 질문을 던진다</h2>
<SourceApplication source="EIP-8081 · front matter" excerpt="Draft" application="같은 10월 4일에 읽은 Hegotá의 Draft와 빈 활성화 표는 메인넷 지원을 선언할 근거가 아닙니다. FOCIL 7805·Frame 8141의 SFI와 선택적 실행 증명 8025의 PFI를 구별해 준비 범위를 나눕니다." /><p>Hegotá 소개는 2027년 2분기를 예상하고 있지만 날짜는 계획입니다. 양자 대비, 증명 기반 검증, 간결한 실행 명세는 더 긴 연구 방향과도 연결됩니다. 새로운 기능 이름을 듣는 즉시 어느 EIP·구현·시험·활성화가 있는지 같은 네 칸을 채우면 기술 전망과 현재 지원을 구분할 수 있습니다.</p><div id="pq-surfaces" className="scroll-mt-20"><p>양자 대비에서는 합의 서명, 계정 서명, 데이터 커밋먼트, 응용 증명을 나눠야 합니다. 한 서명을 바꿨다고 네 영역의 이전이 끝나는 것은 아닙니다. 구체적인 계정 이전은 <Link className="underline" to="/cs/blockchain/pq-account">양자 대비 계정</Link> 정본에서 다룹니다.</p></div><div id="proving-execution" className="scroll-mt-20"><p>8025처럼 실행 증명을 도입하려는 제안과 특정 증명 시스템·가상머신의 연구 결과도 구분합니다. 빠른 증명 실험 하나가 프로토콜의 최종 선택을 뜻하지 않습니다. 연산 구조는 <Link className="underline" to="/cs/crypto/binary-field-proving">이진체 증명</Link>으로 연결합니다.</p></div><CitationBlock source="EIP-8081 · Hegotá" citeKey={4} href="https://eips.ethereum.org/EIPS/eip-8081">Draft와 SFI·CFI·PFI 목록, 비어 있는 활성화 표를 확인했습니다.</CitationBlock><CitationBlock source="Ethereum · Hegotá roadmap" citeKey={5} href="https://ethereum.org/roadmap/hegota/">2027년 2분기는 예상 일정입니다. 확인일 이후 변경될 수 있습니다.</CitationBlock>
<p data-stage-bridge="comparison" className="text-sm text-muted-foreground">현재와 미래에 같은 판정 기준을 적용했습니다. 증거를 읽을 때 놓치기 쉬운 조건을 짚습니다.</p>
</section>
<section id="formal-simplification" data-teach-level="7" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">10. 검사할 명제가 잘못되면 증명이 있어도 목표를 놓친다</h2>
<p>명세를 작게 만들면 구현과 시험이 다룰 조건을 줄일 수 있습니다. 형식 검증은 정한 가정 아래 어떤 성질이 유지되는지를 기계적으로 확인합니다. AI나 사람이 만든 증명 후보는 검사기를 통과해야 하고, 통과한 뒤에도 명세가 실제 원하는 기능과 일치하는지는 별도로 검토합니다.</p><p>예를 들어 운영자가 “10월 6일 이후에는 모두 새 규칙”이라고 잘못 적고 이를 완벽히 검사해도 메인넷·Sepolia를 구분하지 못한 오류는 남습니다. 올바른 명제에는 네트워크, 버전, 활성화 조건이 들어갑니다. 성능 측정에는 장비·입력·설정·반복과 실제 결과도 필요합니다.</p><p>Lean Consensus 연구 로드맵의 형식 검증 목표는 Ethereum 전체가 이미 검증됐다는 증거가 아닙니다. 논문·코드의 검증 범위와 남은 가정을 읽어야 합니다. 이 글 역시 확인일의 상태 판정이며 이후의 적용 완료를 미리 보증하지 않습니다.</p><CitationBlock source="Lean Consensus R&D Progress" citeKey={6} href="https://leanroadmap.org/">형식 검증의 연구 목표와 개별 작업 범위를 확인하는 자료입니다. 완료된 전체 시스템 증명으로 확대하지 않습니다.</CitationBlock>
<p data-stage-bridge="formal-simplification" className="text-sm text-muted-foreground">네트워크·시점·증거 범위를 붙이면 로드맵을 오늘 가능한 일과 다음 준비로 나눌 수 있습니다.</p>
<ReviewPrompts questions={["10월 4일에 Sepolia의 10월 6일 일정만 읽었다면 메인넷 지원을 선언할 수 있나요? (답: 3·7절)", "Review와 SFI가 함께 적힌 EIP를 왜 모순이라고 볼 수 없나요? (답: 6절)"]} />
</section>
</article>; }
