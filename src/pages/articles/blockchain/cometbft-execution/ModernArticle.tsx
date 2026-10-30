import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import CosmosCoreLocator, { CosmosCoreMapReturn } from "../CosmosCoreLocator";
import BlockExecutorTraceViz from "./viz/BlockExecutorTraceViz";
import { codeRefs } from "./codeRefs";
import { cometbftExecutionTree } from "./fileTrees";

const sourceCommit = "0880b4d378f347ab16e54ec677ff50d803f37d62";

export default function ModernCometBFTExecutionArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <article>
        <section id="overview" className="mb-16 scroll-mt-20">
          <CosmosCoreLocator
            currentSlug="cometbft-execution"
            region="결정된 block의 검증·실행·영속화"
            question="합의가 B41을 결정한 뒤, 왜 아직 처리가 끝난 것이 아니며 어느 저장 순서를 거쳐 h41을 완성할까요?"
          />
          <h2 className="mb-6 text-2xl font-bold">결정된 B41을 세 저장 위치에 같은 높이로 남기는 과정을 추적합니다</h2>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="text-lg leading-8">
              높이 40의 CometBFT State를 <code>C40</code>, application의 durable state를 <code>X40</code>, 두 상태가 공유하는
              commitment를 <code>A40</code>이라고 하겠습니다. 합의는 Alice가 Bob에게 10을 보내는 transaction이 포함된
              <code>B41</code>을 결정하고 block store에 기록했습니다. 그러나 application은 아직 <code>X40</code>입니다.
            </p>
            <p className="text-lg leading-8">
              <code>BlockExecutor.ApplyBlock</code>은 B41이 C40의 정확한 다음 block인지 검사하고, application에서 결과
              <code>R41</code>과 <code>A41</code>을 계산합니다. 이어 R41, application state, CometBFT State를 복구 가능한 순서로
              저장합니다. 이 세 저장은 하나의 database transaction이 아닙니다.
            </p>
            <p>
              B41이 결정되기 전의 호출 권한은 <Link to="/cs/blockchain/cometbft-abci#overview">ABCI++ 글</Link>에서
              다뤘습니다. 여기서는 결정된 B41을 받은 뒤의 검증과 저장, 재시작에만 집중합니다.
            </p>
          </div>
          <ContentBoundary article="cometbft-execution" />
          <BlockExecutorTraceViz />
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <h3>네 저장 위치는 서로 다른 사실을 남깁니다</h3>
            <p>
              BlockStore의 B41은 합의가 순서를 결정했다는 증거입니다. StateStore의 R41은 FinalizeBlock이 계산한 transaction 결과와
              update, A41을 복구하기 위한 증거입니다.
            </p>
            <p>
              Application의 committed height 41은 실제 business state가 durable하다는 증거입니다. CometBFT State C41은 다음
              height의 validator·parameter·history commitment를 계산할 입력입니다.
            </p>
            <p>
              장애 로그에 “height 41 처리 완료”만 남기면 어느 영수증을 말하는지 알 수 없습니다. Block height, saved Finalize response,
              node State height, application committed height와 AppHash를 따로 기록해야 합니다.
            </p>
            <h3>코드는 release 이름뿐 아니라 content commit까지 고정했습니다</h3>
            <p>
              아래 패널은 <code>v0.40.0</code> annotated tag가 가리키는 content commit <code>{sourceCommit}</code>의
              <code>state/validation.go</code>, <code>state/execution.go</code>, <code>consensus/replay.go</code>를 기준으로 합니다.
              기존 글에 있던 교육용 재작성 코드는 공식 구현 근거에서 제외했습니다.
            </p>
          </div>
        </section>

        <section id="validate-block" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">B41이 C40 바로 다음에 붙는 block인지 먼저 확인합니다</h2>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              <code>ApplyBlock</code>은 B41이 이미 같은 hash와 예상 height로 검증된 cache에 없으면 <code>validateBlock</code>을
              호출합니다. 첫 단계인 <code>Block.ValidateBasic</code>은 block 내부 형식과 hash 관계를 검사합니다. 그다음 현재 C40의
              version, chain ID, 다음 height, LastBlockID와 Header commitment를 대조합니다.
            </p>
            <p>
              B41 Header의 AppHash는 B41 실행 결과 A41이 아니라 <strong>실행 전 commitment A40</strong>이어야 합니다. A41은 다음
              B42 Header에 들어갑니다. 같은 방식으로 ValidatorsHash와 ConsensusHash, LastResultsHash도 C40이 기억하는 이전 결과와
              맞아야 합니다.
            </p>
          </div>
          <ExplainedFormula
            question="B41이 C40 위에서 실행할 수 있는 유일한 다음 block인지 어떤 연결을 확인합니까?"
            idea={<>Height, 직전 block identity와 실행 전 application commitment가 동시에 이어져야 합니다. 하나라도 다르면 다른 history나 다른 state 위에 B41을 적용하려는 것입니다.</>}
            formula={String.raw`\begin{aligned}h_B&=h_C+1\\B_{41}.\mathrm{LastBlockID}&=C_{40}.\mathrm{LastBlockID}\\B_{41}.\mathrm{AppHash}&=C_{40}.\mathrm{AppHash}=A_{40}\end{aligned}`}
            annotatedFormula={String.raw`\begin{aligned}h_B&=\underbrace{h_C+1}_{\text{바로 다음 높이}}\\B_{41}.\mathrm{LastBlockID}&=\underbrace{C_{40}.\mathrm{LastBlockID}}_{\text{같은 직전 block}}\\B_{41}.\mathrm{AppHash}&=\underbrace{C_{40}.\mathrm{AppHash}=A_{40}}_{\text{실행 전 app commitment}}\end{aligned}`}
            operations={[
              { expression: String.raw`h_C+1`, annotation: ["C40 뒤에는 B41만 허용", "첫 block은 InitialHeight 규칙", "B42를 바로 적용하면 거절"] },
              { expression: String.raw`C_{40}.\mathrm{LastBlockID}`, annotation: ["직전 block hash와 part-set", "같은 history인지 확인", "다른 branch 실행을 차단"] },
              { expression: String.raw`A_{40}`, annotation: ["B41 실행 전 commitment", "A41과 비교하지 않음", "A41은 B42 Header에 연결"] },
            ]}
            terms={[
              { symbol: "h_B", name: "Block height", description: "검증하는 B41의 Header height입니다." },
              { symbol: "h_C", name: "State height", description: "C40의 LastBlockHeight입니다." },
              { symbol: "LastBlockID", name: "History link", description: "직전 block hash와 part-set header를 묶은 identity입니다." },
              { symbol: "A40", name: "Previous AppHash", description: "B41을 실행하기 전 application state의 commitment입니다." },
            ]}
            assumptions={[
              "첫 block은 LastBlockHeight+1 대신 configured InitialHeight를 사용합니다.",
              "Version·chain ID·validator·parameter·results commitment도 함께 일치해야 합니다.",
              "LastCommit은 B40의 BlockID와 height 40을 state.LastValidators로 검증합니다.",
              "구조 검증은 T지급의 business 성공을 보장하지 않습니다.",
            ]}
            interpretation="C40 위에 B41을 실행하려면 B41이 같은 history와 같은 이전 application state를 가리켜야 합니다. 이 조건이 맞아도 transaction은 FinalizeBlock에서 실패 result를 낼 수 있습니다."
          />
          <div className="not-prose my-6 flex flex-wrap gap-3">
            <CodeViewButton label="validateBlock 원문" onClick={() => sidebar.open("validate-block", codeRefs["validate-block"])} />
          </div>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <h3>LastCommit, time과 evidence는 서로 다른 실패를 찾습니다</h3>
            <p>
              InitialHeight가 아니라면 Header의 LastCommit은 B40에 대한 commit이어야 합니다. <code>state.LastValidators.VerifyCommit</code>이
              chain ID, B40 BlockID, height 40과 signature voting power를 검사합니다. ProposerAddress는 올바른 길이이며 현재 validator
              set에 포함되어야 합니다.
            </p>
            <p>
              Block time은 이전 시간보다 커야 하고 LastCommit의 voting-power weighted median time과 같아야 합니다. Evidence bytes는
              consensus parameter 한도를 넘을 수 없습니다.
            </p>
            <p>
              Evidence 내용의 historical validity는 proposal validation 경로의 <code>EvidencePool.CheckEvidence</code>가 맡습니다.
              이미 검증한 같은 block은 <code>lastValidatedBlock</code> cache로 중복 검사를 줄입니다.
            </p>
            <p>
              검증이 실패하면 application의 FinalizeBlock을 호출하지 않습니다. 이 경계는 잘못된 block이 business state에 닿지 않게 하는
              fail-closed gate입니다.
            </p>
          </div>
          <div id="paper-cometbft-validation-v040" className="scroll-mt-24">
            <CitationBlock source="CometBFT v0.40.0 · state/validation.go" citeKey={1} type="code" href={`https://github.com/cometbft/cometbft/blob/${sourceCommit}/state/validation.go`}>
              <p><strong>문제:</strong> B41이 현재 C40의 정확한 다음 transition인지 실행 전에 확인합니다.</p>
              <p><strong>기여:</strong> 구조·height·history·commitment·LastCommit·time·evidence size를 서로 다른 조건으로 검사합니다.</p>
              <p><strong>전제:</strong> C40과 historical validator·consensus parameter 정보가 정확히 로드되어 있습니다.</p>
              <p><strong>근거 범위:</strong> CometBFT block과 chain State의 구조적·암호학적 연결입니다.</p>
              <p><strong>말하지 않는 것:</strong> T지급의 business 성공, application Commit 또는 외부 효과를 보장하지 않습니다.</p>
            </CitationBlock>
          </div>
        </section>

        <section id="execute-block" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">Finalize 결과를 먼저 저장하고 다음 State 후보를 계산합니다</h2>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              검증을 통과한 B41은 <code>RequestFinalizeBlock</code>으로 application에 전달됩니다. 입력에는 block identity와
              height·time, B40의 decided commit, misbehavior와 ordered transaction bytes가 들어갑니다.
            </p>
            <p>
              Application은 transaction별 result, validator·parameter update, event와 A41을 반환합니다.
            </p>
            <p>
              B41에 transaction이 두 건이면 <code>TxResults</code>도 두 건이어야 합니다. 수가 다르면 BlockExecutor는 R41을 저장하거나
              Commit하지 않고 오류를 반환합니다. 개별 transaction result가 실패 code여도 response의 위치와 개수가 맞다면 block 자체의
              state transition은 계속될 수 있습니다.
            </p>
          </div>
          <div className="not-prose my-6 flex flex-wrap gap-3">
            <CodeViewButton label="ApplyBlock 원문" onClick={() => sidebar.open("apply-block", codeRefs["apply-block"])} />
            <CodeViewButton label="updateState 원문" onClick={() => sidebar.open("update-state", codeRefs["update-state"])} />
          </div>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <h3>R41은 application Commit보다 먼저 저장됩니다</h3>
            <p>
              <code>SaveFinalizeBlockResponse(41, R41)</code>이 먼저 성공해야 validator update 검증과 <code>updateState</code>로 넘어갑니다.
              이 receipt가 있으므로 application이 이미 h41까지 commit한 뒤 node가 죽어도 FinalizeBlock을 실제 application에 중복 적용하지
              않고 C41을 다시 만들 수 있습니다.
            </p>
            <h3>updateState가 만든 C41*의 AppHash는 아직 비어 있습니다</h3>
            <p>
              <code>updateState</code>는 LastBlockHeight·ID·time, 세 validator snapshot, consensus parameter와 LastResultsHash를
              계산합니다. Height 41의 validator update는 h43부터 적용될 시점을 기록하고, parameter update는 h42부터 적용될 값을 준비합니다.
            </p>
            <p>
              반환된 C41*의 AppHash는 <code>nil</code>입니다. Application Commit이 성공한 뒤 R41.AppHash로 채웁니다.
            </p>
          </div>
          <ExplainedFormula
            question="B41 실행 결과와 최종 CometBFT State는 어떤 순서로 만들어집니까?"
            idea={<>Application이 R41과 X41 후보를 계산하고, BlockExecutor가 C41*를 만든 뒤 application Commit 성공을 확인해야 A41을 넣은 C41을 저장할 수 있습니다.</>}
            formula={String.raw`\begin{aligned}R_{41},X_{41}^{*}&=F(X_{40},B_{41})\\C_{41}^{*}&=U(C_{40},B_{41},R_{41}),\quad C_{41}^{*}.\mathrm{AppHash}=\varnothing\\\mathrm{Commit}(X_{41}^{*})&\Rightarrow X_{41}\;\mathrm{durable}\\C_{41}&=C_{41}^{*}[\mathrm{AppHash}\leftarrow R_{41}.\mathrm{AppHash}]\end{aligned}`}
            annotatedFormula={String.raw`\begin{aligned}R_{41},X_{41}^{*}&=\underbrace{F(X_{40},B_{41})}_{\text{FinalizeBlock 계산}}\\C_{41}^{*}&=\underbrace{U(C_{40},B_{41},R_{41})}_{\text{CometBFT next State}},\quad \mathrm{AppHash}=\varnothing\\\mathrm{Commit}(X_{41}^{*})&\Rightarrow\underbrace{X_{41}\;\mathrm{durable}}_{\text{application 영속화}}\\C_{41}&=\underbrace{C_{41}^{*}[\mathrm{AppHash}\leftarrow A_{41}]}_{\text{StateStore 저장}}\end{aligned}`}
            operations={[
              { expression: String.raw`F(X_{40},B_{41})`, annotation: ["결정된 transaction 순서 실행", "R41과 A41 계산", "아직 disk commit 아님"] },
              { expression: String.raw`U(C_{40},B_{41},R_{41})`, annotation: ["validator·parameter 갱신", "LastResultsHash 계산", "AppHash는 nil 유지"] },
              { expression: String.raw`\mathrm{Commit}(X_{41}^{*})`, annotation: ["application이 먼저 durable", "반환 전 영속화 계약", "성공 뒤 C41 저장 가능"] },
            ]}
            terms={[
              { symbol: "R41", name: "Finalize response", description: "TxResults, validator·parameter updates, events와 A41을 담은 저장 가능한 결과입니다." },
              { symbol: "X41*", name: "Application candidate", description: "FinalizeBlock으로 계산했지만 Commit 전인 application state입니다." },
              { symbol: "C41*", name: "Node State candidate", description: "Header와 R41을 반영했지만 AppHash가 아직 비어 있는 CometBFT State입니다." },
              { symbol: "C41", name: "Saved node State", description: "Commit 성공 뒤 A41을 넣어 StateStore에 저장한 다음 height 입력입니다." },
            ]}
            assumptions={[
              "FinalizeBlock은 같은 X40과 B41에서 같은 R41을 반환합니다.",
              "Application은 Commit 반환 전에 X41을 durable하게 저장합니다.",
              "R41 저장과 application Commit, C41 저장은 하나의 atomic transaction이 아닙니다.",
              "외부 payment·webhook은 이 식 밖의 별도 idempotency receipt가 필요합니다.",
            ]}
            interpretation="R41 계산 성공은 완료가 아닙니다. R41을 먼저 저장하고 application Commit이 성공한 뒤에야 A41을 포함한 C41을 저장합니다."
          />
        </section>

        <section id="save-state" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">Commit 뒤 crash가 나면 남은 높이 조합으로 재실행 대상을 고릅니다</h2>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              <code>Commit</code>은 mempool을 잠그고 pending ABCI 요청을 flush한 뒤 application Commit을 호출합니다. 성공하면
              <code>asyncUpdateMempool</code>을 goroutine으로 시작하고 바로 돌아옵니다. Mempool Update가 끝날 때까지 잠금은 유지되지만,
              ApplyBlock은 그 사이 evidence pool과 C41 저장을 진행할 수 있습니다.
            </p>
          </div>
          <div className="not-prose my-6 flex flex-wrap gap-3">
            <CodeViewButton label="Commit 순서 원문" onClick={() => sidebar.open("commit-order", codeRefs["commit-order"])} />
            <CodeViewButton label="Replay 분기 원문" onClick={() => sidebar.open("replay-decision", codeRefs["replay-decision"])} />
          </div>
          <div className="not-prose my-8 overflow-hidden border border-border">
            <div className="grid grid-cols-[4rem_4rem_4rem_minmax(0,1fr)] gap-px bg-border text-[10px] leading-5 sm:grid-cols-[7rem_7rem_7rem_minmax(0,1fr)] sm:text-sm">
              <strong className="bg-muted p-2.5 sm:p-3">BlockStore</strong>
              <strong className="bg-muted p-2.5 sm:p-3">StateStore</strong>
              <strong className="bg-muted p-2.5 sm:p-3">Application</strong>
              <strong className="bg-muted p-2.5 sm:p-3">재시작 동작</strong>
              <span className="bg-background p-2.5 sm:p-3">h41</span>
              <span className="bg-background p-2.5 sm:p-3">h40</span>
              <span className="bg-background p-2.5 sm:p-3">h40</span>
              <span className="bg-background p-2.5 sm:p-3">B41을 실제 application에 replay해 R41·Commit·C41 저장을 다시 수행합니다.</span>
              <span className="bg-background p-2.5 sm:p-3">h41</span>
              <span className="bg-background p-2.5 sm:p-3">h40</span>
              <span className="bg-background p-2.5 sm:p-3">h41</span>
              <span className="bg-background p-2.5 sm:p-3">저장된 R41을 반환하는 mock application으로 C41만 재구성합니다.</span>
              <span className="bg-background p-2.5 sm:p-3">h41</span>
              <span className="bg-background p-2.5 sm:p-3">h41</span>
              <span className="bg-background p-2.5 sm:p-3">h41</span>
              <span className="bg-background p-2.5 sm:p-3">AppHash를 대조한 뒤 다음 height로 진행합니다.</span>
              <span className="bg-background p-2.5 sm:p-3">h40</span>
              <span className="bg-background p-2.5 sm:p-3">h40</span>
              <span className="bg-background p-2.5 sm:p-3">h41</span>
              <span className="bg-background p-2.5 font-semibold text-destructive sm:p-3">Application이 BlockStore보다 앞선 불가능 조합으로 보고 중단합니다.</span>
            </div>
          </div>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <h3>Timeout은 미실행 증거가 아닙니다</h3>
            <p>
              FinalizeBlock이나 Commit 응답을 받지 못해도 remote application에서 요청이 끝났을 수 있습니다. 호출자의 timeout만 보고 B41을
              다시 적용하면 transaction과 외부 side effect가 중복될 수 있습니다. 재시작은 마지막 응답이 아니라 durable block·response·State와
              application <code>Info</code>의 height·AppHash를 기준으로 판단합니다.
            </p>
            <h3>EventBus는 durable 완료 영수증이 아닙니다</h3>
            <p>
              v0.40.0 원문은 Commit과 State Save 사이에서 crash하면 replay 중 event가 다시 발행되지 않는다고 명시합니다. 반대로 다른 crash
              구간에서는 event가 중복될 수 있습니다. Consumer는 event 한 번 수신을 정산 완료로 간주하지 말고 block height·tx index 같은 고유
              key로 체인 상태를 다시 조회하고 idempotent하게 처리해야 합니다.
            </p>
            <h3>이 글의 실패 동작을 한 문장씩 구분합니다</h3>
            <ul>
              <li>Header commitment나 LastCommit이 틀리면 application 실행 전에 B41을 거절합니다.</li>
              <li>Transaction 수와 result 수가 다르면 R41을 저장하거나 Commit하지 않습니다.</li>
              <li>Application Commit이 실패하면 C41을 저장하지 않습니다.</li>
              <li>Application h41인데 StateStore h40이면 R41의 mock application으로 C41만 복원합니다.</li>
              <li>Application이나 StateStore가 BlockStore보다 앞서면 자동 진행하지 않고 invariant failure로 중단합니다.</li>
            </ul>
          </div>
          <div id="paper-cometbft-execution-v040" className="scroll-mt-24">
            <CitationBlock source="CometBFT v0.40.0 · state/execution.go · consensus/replay.go" citeKey={2} type="code" href={`https://github.com/cometbft/cometbft/blob/${sourceCommit}/state/execution.go`}>
              <p><strong>문제:</strong> 합의된 B41을 application과 여러 CometBFT store에 복구 가능한 순서로 반영합니다.</p>
              <p><strong>기여:</strong> ApplyBlock ordering, result-before-Commit 저장, mempool lock·async Update와 height 조합별 real·mock replay를 구현합니다.</p>
              <p><strong>전제:</strong> Application의 Commit durability 계약, local block·response 보유와 같은 chain configuration을 전제로 합니다.</p>
              <p><strong>근거 범위:</strong> v0.40.0 node/application state transition과 local restart입니다.</p>
              <p><strong>말하지 않는 것:</strong> 외부 payment·webhook의 exactly-once, 손상된 database 자동 수리나 임의 rollback을 보장하지 않습니다.</p>
            </CitationBlock>
          </div>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <h3>이 글만으로 확인할 질문</h3>
            <ol>
              <li>B41 Header의 AppHash가 A41이 아니라 A40인 이유를 설명할 수 있습니까?</li>
              <li>R41 저장이 application Commit보다 먼저인 이유를 crash 위치와 연결할 수 있습니까?</li>
              <li>C41*의 AppHash가 비어 있는 이유와 최종으로 채우는 시점을 찾을 수 있습니까?</li>
              <li>BlockStore h41, StateStore h40, application h40과 h41에서 replay 대상이 왜 달라지는지 설명할 수 있습니까?</li>
              <li>EventBus subscriber가 durable receipt와 idempotency key를 별도로 가져야 하는 이유를 설명할 수 있습니까?</li>
            </ol>
          </div>
        </section>

        <CosmosCoreMapReturn
          currentSlug="cometbft-execution"
          closure="BlockExecutor는 합의된 B41을 곧바로 완료 처리하지 않습니다. C40과의 연속성을 검사하고 R41을 먼저 저장한 뒤 application X41을 Commit하며, 마지막으로 A41을 넣은 C41을 저장합니다. 재시작은 BlockStore·StateStore·application height 조합으로 실제 application replay와 saved-response replay를 구분합니다."
        />
      </article>

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ cometbft: cometbftExecutionTree }}
        projectMetas={{
          cometbft: {
            id: "cometbft",
            label: "CometBFT · Go",
            badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700",
          },
        }}
      />
    </>
  );
}
