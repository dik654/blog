import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import CosmosEvmLocator, { CosmosEvmMapReturn } from "../CosmosEvmLocator";
import { codeRefs } from "./codeRefs";
import { omniTree } from "./fileTrees";
import { OctaneEvidenceBoundaryViz, OctanePayloadTraceViz } from "./viz/ModernOctaneViz";

const SHA = "9864f25fa9bcb473ee34d2442012fc5fbd2683ea";
const REPO = `https://github.com/omni-network/omni/tree/${SHA}`;
const README = `https://github.com/omni-network/omni/blob/${SHA}/octane/README.md`;
const ABCI = `https://github.com/omni-network/omni/blob/${SHA}/octane/evmengine/keeper/abci.go`;
const MSG = `https://github.com/omni-network/omni/blob/${SHA}/octane/evmengine/keeper/msg_server.go`;
const EVENTS = `https://github.com/omni-network/omni/blob/${SHA}/octane/evmengine/keeper/events.go`;
const ENGINE = `https://github.com/omni-network/omni/blob/${SHA}/lib/ethclient/engineclient.go`;
const ENGINE_SPEC = "https://github.com/ethereum/execution-apis/tree/5aebdfdd45cadeb723be4bd45b4611b71c8b1c85";

export default function ModernOctaneArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <article>
        <section id="overview" className="mb-16 scroll-mt-20">
          <CosmosEvmLocator
            currentSlug="omni-octane"
            region="ABCI proposal·finalization과 Engine API payload의 상태 연결"
            question="Execution client가 P101을 VALID로 판정하면 CometBFT 높이 101과 EVM canonical head도 곧바로 확정될까요?"
          />
          <h2 className="mb-6 text-2xl font-bold">P101이 확정되기까지 세 상태가 차례로 바뀝니다</h2>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="text-lg leading-8">
              CometBFT는 높이 101의 proposal·vote·commit 순서를 결정합니다. Execution client는 H100 위에서 EVM payload P101을
              만들고 실행 가능 여부와 canonical head를 관리합니다. Halo application의 Octane module은 ABCI와 authenticated Engine API
              사이에서 두 상태를 연결합니다.
            </p>
            <p className="text-lg leading-8">
              아래 추적은 committed application <code>AppHash A100</code>과 execution head <code>H100</code>에서 시작합니다.
              Proposer가 <code>P101</code>을 만들고 proposal <code>C101</code>로 제출한 뒤, CometBFT가 <code>B101</code>을 확정하고
              각 node가 local execution head를 <code>EP101</code>로 옮기는 과정까지 같은 사례로 따라갑니다.
            </p>
          </div>
          <ContentBoundary article="omni-octane" />
          <OctanePayloadTraceViz />
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <h3>세 구성요소가 소유하는 정본은 다릅니다</h3>
            <ul>
              <li><strong>CometBFT</strong>는 어느 proposal이 높이 101의 block으로 commit됐는지 소유합니다.</li>
              <li><strong>Halo·Octane</strong>은 payload message, keeper execution head와 EVM log가 바꾸는 Cosmos state를 소유합니다.</li>
              <li><strong>Execution client</strong>는 payload build cache, EVM 실행 판정과 local canonical chain을 소유합니다.</li>
            </ul>
            <p>
              따라서 <code>payloadId</code>, <code>newPayloadV3 VALID</code>, CometBFT Commit, <code>forkchoiceUpdatedV3</code> 성공은
              같은 완료 신호가 아닙니다. 앞의 성공을 뒤의 성공으로 확대하면 node가 멈춘 지점을 구분할 수 없습니다.
            </p>
            <p>
              CometBFT ABCI++ 실행 순서가 낯설다면 <Link to="/cs/blockchain/cometbft-abci#overview">ABCI++ 한 요청 추적</Link>과
              <Link to="/cs/blockchain/cometbft-execution#overview"> BlockExecutor 저장 순서</Link>를 먼저 보면 이 글의 두 경계가 이어집니다.
            </p>
          </div>

          <div id="paper-octane-snapshot" className="scroll-mt-24">
            <CitationBlock type="code" citeKey={1} source="Omni Octane repository snapshot · 9864f25" href={REPO}>
              <p><strong>문제:</strong> CometBFT application과 EVM execution client의 실제 연결 지점을 확인해야 합니다.</p>
              <p><strong>기여:</strong> 고정한 monorepo는 Halo application, Octane evmengine module과 Engine client adapter를 함께 보여 줍니다.</p>
              <p><strong>전제:</strong> Commit, Go dependencies, genesis·fork 설정과 execution client profile을 함께 고정합니다.</p>
              <p><strong>근거 범위:</strong> Commit {SHA.slice(0, 8)}의 공개 source에 한정합니다.</p>
              <p><strong>말하지 않는 것:</strong> Moving main, 모든 Engine client 호환성, 보안 감사 완료나 고정 처리량을 보장하지 않습니다.</p>
            </CitationBlock>
          </div>
          <div id="paper-octane-readme" className="scroll-mt-24">
            <CitationBlock type="code" citeKey={2} source="Octane README · work-in-progress status" href={README}>
              <p><strong>문제:</strong> 프로젝트의 목표와 현재 구현 완료 범위를 구분해야 합니다.</p>
              <p><strong>기여:</strong> README는 ABCI 2.0·Engine API framework 목표, Halo example과 work-in-progress 상태를 명시합니다.</p>
              <p><strong>전제:</strong> 같은 commit의 코드와 tests를 함께 읽습니다.</p>
              <p><strong>근거 범위:</strong> 프로젝트가 선언한 architecture goal과 공개 상태입니다.</p>
              <p><strong>말하지 않는 것:</strong> README의 목표 문장은 client parity·production readiness·성능 결과가 아닙니다.</p>
            </CitationBlock>
          </div>
        </section>

        <section id="proposal-build" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">Payload ID는 build를 다시 찾는 표식이지 block 영수증이 아닙니다</h2>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              Height 101 proposer는 keeper의 execution head H100과 현재 block header의 AppHash A100을 읽습니다. 다음 proposer라고
              미리 판단해 둔 optimistic payload의 height가 101이면 그 ID를 재사용하고, 다르면
              <code>forkchoiceUpdatedV3</code>에 H100과 payload attributes를 보내 새 build를 시작합니다.
            </p>
            <p>
              설정된 build delay 뒤 <code>getPayloadV3(id101)</code>로 P101을 받습니다. P101과 blob commitments, 이전 height의 vote
              messages는 한 unsigned Cosmos transaction으로 encode되어 C101에 들어갑니다. 이 ID는 execution client의 local cache에
              속하므로 restart·expiry·unknown payload를 넘는 durable identifier가 아닙니다.
            </p>
          </div>
          <div className="not-prose my-6 flex flex-wrap gap-3">
            <CodeViewButton label="PrepareProposal 원문" onClick={() => sidebar.open("prepare-payload", codeRefs["prepare-payload"])} />
            <CodeViewButton label="Engine status 원문" onClick={() => sidebar.open("engine-status", codeRefs["engine-status"])} />
          </div>

          <ExplainedFormula
            question="예시 build가 10초 PrepareProposal 한도 안에 끝나는지 어떻게 계산합니까?"
            idea={<>같은 attempt에서 FCU, configured delay, payload retrieval과 transaction encoding 시간을 더합니다. 아래 네 수치는 설명용 가정이며 실제 배포의 측정값이 아닙니다.</>}
            formula={String.raw`T_{prepare}=0.15+0.40+0.20+0.05=0.80\ \mathrm{s}<10\ \mathrm{s}`}
            annotatedFormula={String.raw`\underbrace{T_{prepare}}_{\text{proposal 준비}}=\underbrace{0.15}_{\text{FCU}}+\underbrace{0.40}_{\text{build delay}}+\underbrace{0.20}_{\text{getPayload}}+\underbrace{0.05}_{\text{encode}}=\underbrace{0.80\ \mathrm{s}}_{\text{가정한 한 attempt}}<\underbrace{10\ \mathrm{s}}_{\text{고정 코드의 context 한도}}`}
            operations={[
              { expression: String.raw`0.15+0.40`, annotation: ["FCU 응답과 설정한 대기", "0.55초까지 사용"] },
              { expression: String.raw`+0.20+0.05`, annotation: ["Payload 수신과 tx encoding", "합계 0.80초"] },
              { expression: String.raw`0.80<10`, annotation: ["이 가정에서는 한도 안", "Tail retry는 따로 측정"] },
            ]}
            terms={[
              { symbol: "T_{prepare}", name: "Proposal 준비 시간", description: "한 PrepareProposal attempt에서 build 시작부터 encoded transaction 반환까지의 시간입니다." },
              { symbol: "0.15", name: "FCU 가정", description: "forkchoiceUpdatedV3 요청·응답에 사용한 설명용 시간입니다." },
              { symbol: "0.40", name: "Build delay 가정", description: "Payload를 가져오기 전 기다리는 설명용 설정값입니다." },
              { symbol: "0.20", name: "GetPayload 가정", description: "id101로 P101 envelope를 받는 설명용 시간입니다." },
              { symbol: "0.05", name: "Encode 가정", description: "Vote messages와 payload를 transaction으로 만드는 설명용 시간입니다." },
            ]}
            assumptions={[
              "네 수치는 동작을 설명하기 위한 가정이며 실제 측정값이 아닙니다.",
              "10초는 pinned abci.go의 context timeout이며 일반적인 CometBFT SLA가 아닙니다.",
              "Network retry와 unknown payload, optimistic cache miss는 별도 경로로 측정해야 합니다.",
            ]}
            interpretation="평균 0.80초만 보고 충분하다고 판단할 수는 없습니다. Retry가 context를 소진하면 source 주석처럼 빈 proposal 경로가 가능하므로 cold build·optimistic hit·unknown payload·timeout을 각각 구분해야 합니다."
          />

          <div id="paper-octane-abci" className="scroll-mt-24">
            <CitationBlock type="code" citeKey={3} source="Octane ABCI proposal bridge · 9864f25" href={ABCI}>
              <p><strong>문제:</strong> Proposal budget 안에서 execution payload를 만들고 deterministic message로 제출해야 합니다.</p>
              <p><strong>기여:</strong> PrepareProposal timeout, optimistic build, V3 build/get, blob commitments와 single transaction packaging을 구현합니다.</p>
              <p><strong>전제:</strong> 고정 dependencies, local execution head, fee recipient·withdrawal·vote providers와 build 설정을 사용합니다.</p>
              <p><strong>근거 범위:</strong> 고정한 <code>octane/evmengine/keeper/abci.go</code>의 proposal-build 경로입니다.</p>
              <p><strong>말하지 않는 것:</strong> Payload ID durability, consensus commit이나 모든 배포의 10초 latency 보장이 아닙니다.</p>
            </CitationBlock>
          </div>
        </section>

        <section id="validate-finalize" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">Candidate 검증과 canonical head 전진은 서로 다른 단계입니다</h2>
          <OctaneEvidenceBoundaryViz />
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              ProcessProposal 경로는 module authority, ordered withdrawals, no-witness rule, fee recipient, parent H100, block number,
              timestamp 범위와 Random 값을 먼저 검사합니다. 그다음 <code>newPayloadV3</code>가 INVALID를 반환하면 proposal을 거절합니다.
              SYNCING·ACCEPTED는 VALID와 같은 판정이 아니지만 initial sync가 target head를 받을 수 있도록 이 고정 구현은 후보 경로를 계속합니다.
            </p>
            <p>
              CometBFT가 C101을 B101로 commit한 뒤 Finalize mode가 같은 payload를 다시 <code>newPayloadV3</code>에 넣습니다.
              이어서 <code>forkchoiceUpdatedV3</code>가 VALID를 반환할 때까지 SYNCING·transport error를 retry하고, 성공하면 local
              head·safe·finalized를 모두 EP101로 전진시킵니다. ProcessProposal의 VALID만으로는 이 pointer 변경이 일어나지 않습니다.
            </p>
          </div>
          <div className="not-prose my-6 flex flex-wrap gap-3">
            <CodeViewButton label="Envelope 검사 원문" onClick={() => sidebar.open("verify-payload-envelope", codeRefs["verify-payload-envelope"])} />
            <CodeViewButton label="ProcessProposal 원문" onClick={() => sidebar.open("process-candidate", codeRefs["process-candidate"])} />
            <CodeViewButton label="Finalize 원문" onClick={() => sidebar.open("finalize-payload", codeRefs["finalize-payload"])} />
          </div>

          <ExplainedFormula
            question="어떤 증거가 P101을 local canonical execution head로 전진시킵니까?"
            idea={<>Candidate verdict와 consensus commit을 각각 기록하고, committed P101에 대한 Finalize FCU가 VALID일 때 local canonical pointers를 바꿉니다.</>}
            formula={String.raw`Commit(B_{101})\land FCU_3(EP_{101})=VALID\Rightarrow(head,safe,finalized)=(EP_{101},EP_{101},EP_{101})`}
            annotatedFormula={String.raw`\underbrace{Commit(B_{101})}_{\text{consensus order 확정}}\land\underbrace{FCU_3(EP_{101})=VALID}_{\text{local canonical update 성공}}\Rightarrow\underbrace{(head,safe,finalized)}_{\text{세 local pointer}}=\underbrace{(EP_{101},EP_{101},EP_{101})}_{\text{같은 payload hash}}`}
            operations={[
              { expression: String.raw`Commit(B_{101})`, annotation: ["Validator quorum의 consensus receipt", "EVM 실행 판정을 대신하지 않음"] },
              { expression: String.raw`FCU_3(EP_{101})=VALID`, annotation: ["Finalize path의 local Engine receipt", "SYNCING이면 retry"] },
              { expression: String.raw`(head,safe,finalized)`, annotation: ["고정 구현의 instant-finality 정책", "세 pointer를 EP101로 전진"] },
            ]}
            terms={[
              { symbol: "B_{101}", name: "Committed CometBFT block", description: "C101이 validator quorum의 합의 순서에 들어갔다는 block입니다." },
              { symbol: "EP_{101}", name: "Execution payload hash", description: "P101의 execution block hash이며 local Engine pointers가 가리킬 값입니다." },
              { symbol: "FCU_3", name: "ForkchoiceUpdated V3", description: "Execution client의 canonical pointers를 바꾸는 versioned Engine API call입니다." },
            ]}
            assumptions={[
              "같은 P101 bytes, height 101, parent H100과 fork configuration을 사용합니다.",
              "VALID·INVALID·SYNCING·ACCEPTED와 transport error를 서로 다른 결과로 기록합니다.",
              "세 pointer를 같은 hash에 두는 것은 이 고정 Octane 구현의 정책이며 일반 Ethereum finality 규칙이 아닙니다.",
            ]}
            interpretation="newPayloadV3 VALID만으로 consensus가 생기지 않고 B101 Commit만으로 local EVM head가 바뀌지도 않습니다. 두 상태가 어디까지 전진했는지 각각 관측해야 node stall을 합의 문제와 Engine sync 문제로 나눌 수 있습니다."
          />

          <div id="paper-octane-finalize" className="scroll-mt-24">
            <CitationBlock type="code" citeKey={4} source="Octane finalized payload handler · 9864f25" href={MSG}>
              <p><strong>문제:</strong> Committed payload를 local canonical execution head와 application state에 순서대로 반영해야 합니다.</p>
              <p><strong>기여:</strong> Finalize-only guard, payload 재검사, newPayload, FCU, event delivery와 execution-head update 순서를 구현합니다.</p>
              <p><strong>전제:</strong> 같은 payload·commit context, 도달 가능한 matching Engine client와 local store를 사용합니다.</p>
              <p><strong>근거 범위:</strong> 고정한 msg server의 finalized execution 경로입니다.</p>
              <p><strong>말하지 않는 것:</strong> Retry 종료 시간, cross-node durability나 외부 effect 완료를 보장하지 않습니다.</p>
            </CitationBlock>
          </div>
          <div id="paper-engine-api-contract" className="scroll-mt-24">
            <CitationBlock type="paper" citeKey={5} source="Ethereum execution-apis snapshot · 5aebdfdd" href={ENGINE_SPEC}>
              <p><strong>문제:</strong> Consensus와 execution client가 payload build·validation·fork choice를 typed JSON-RPC로 교환해야 합니다.</p>
              <p><strong>기여:</strong> Versioned Engine methods, payload status와 schema의 protocol 근거를 제공합니다.</p>
              <p><strong>전제:</strong> Active fork, capability와 exact method·structure version을 고정합니다.</p>
              <p><strong>근거 범위:</strong> 표시한 execution-apis snapshot의 protocol surface입니다.</p>
              <p><strong>말하지 않는 것:</strong> Octane의 ABCI packaging·retry·event 처리나 모든 client 호환성을 표준이 보장하지 않습니다.</p>
            </CitationBlock>
          </div>
        </section>

        <section id="event-release" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">Finalized log는 event마다 별도 branch에서 적용됩니다</h2>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              FCU가 성공하면 Octane은 등록된 processor의 address·topics로 EP101 logs를 가져와 log index 순으로 정렬합니다. 각 event는
              <code>CacheMultiStore</code> branch에서 실행됩니다. Processor가 성공하면 branch를 parent state에 쓰고, error나 panic이면 그
              branch를 버린 채 다음 event로 이동합니다.
            </p>
            <p>
              따라서 execution head가 EP101이라는 사실과 모든 EVM log effect가 application state에 들어갔다는 사실은 다릅니다.
              실패한 event identity와 성공한 branch 수를 별도로 남기지 않으면 부분 적용을 찾을 수 없습니다. 이 경로는 외부 chain에 message가
              도착했다는 증거도 아닙니다.
            </p>
          </div>
          <div className="not-prose my-6 flex flex-wrap gap-3">
            <CodeViewButton label="Event branch 원문" onClick={() => sidebar.open("deliver-events", codeRefs["deliver-events"])} />
            <CodeViewButton label="Engine adapter 원문" onClick={() => sidebar.open("engine-status", codeRefs["engine-status"])} />
          </div>

          <ExplainedFormula
            question="관찰한 event 5개 중 branch 4개만 state에 쓰였다면 무엇을 기록합니까?"
            idea={<>같은 block hash와 processor generation에서 관찰한 event 수, 실제로 parent state에 합친 branch 수와 실패 identity를 함께 남깁니다.</>}
            formula={String.raw`C_{event}={4\over5}=0.8,\qquad N_{failed}=5-4=1`}
            annotatedFormula={String.raw`\underbrace{C_{event}}_{\text{event 적용 비율}}={\underbrace{4}_{\text{Write된 branch}}\over\underbrace{5}_{\text{관찰한 event}}}=\underbrace{0.8}_{\text{부분 적용}},\qquad\underbrace{N_{failed}}_{\text{재조정 대상}}=5-4=\underbrace{1}_{\text{실패 event}}`}
            operations={[
              { expression: String.raw`4/5`, annotation: ["같은 block의 observed events", "성공 branch 비율 0.8"] },
              { expression: String.raw`5-4`, annotation: ["Write되지 않은 event 1개", "block·log index·processor로 식별"] },
            ]}
            terms={[
              { symbol: "C_{event}", name: "Event 적용 비율", description: "관찰한 events 중 parent state에 branch를 합친 비율입니다." },
              { symbol: "N_{failed}", name: "실패 event 수", description: "Error나 panic으로 branch를 쓰지 않은 event 수입니다." },
            ]}
            assumptions={[
              "5와 4는 partial-failure 동작을 설명하는 가정이며 측정 결과가 아닙니다.",
              "같은 execution block hash, processor registry와 log index 순서를 사용합니다.",
              "적용 비율은 semantic correctness, cross-chain delivery나 exactly-once를 뜻하지 않습니다.",
            ]}
            interpretation="0.8을 block 성공률로 바꾸어 부르면 안 됩니다. B101과 EP101은 확정됐지만 특정 event 하나의 Cosmos state effect는 빠졌다는 별도 결과입니다."
          />

          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <h3>실패한 위치에 따라 결과가 달라집니다</h3>
            <ul>
              <li>Payload ID를 찾지 못하면 새 build를 시작해야 하며 기존 ID를 commit 영수증처럼 복원할 수 없습니다.</li>
              <li>Envelope의 parent·height·withdrawals·timestamp가 다르면 Engine 실행 전에 proposal 검증이 중단됩니다.</li>
              <li><code>newPayloadV3 INVALID</code>는 candidate 거절이고, SYNCING과 network error는 liveness 경로입니다.</li>
              <li>Finalize FCU가 계속 SYNCING이면 B101은 commit됐어도 그 node의 execution head는 아직 따라오지 못했습니다.</li>
              <li>Event processor 하나가 실패하면 그 branch만 빠지고 다른 event는 적용될 수 있습니다.</li>
            </ul>
            <h3>이 글만으로 확인할 질문</h3>
            <ol>
              <li>Payload ID와 P101 block hash, B101 Commit의 차이는 무엇입니까?</li>
              <li>ProcessProposal의 VALID 뒤에도 Finalize FCU가 필요한 이유는 무엇입니까?</li>
              <li>CometBFT Commit과 local execution head 중 어느 상태가 어느 구성요소의 정본입니까?</li>
              <li>Event 하나가 panic해도 나머지 event가 적용될 수 있는 이유는 무엇입니까?</li>
              <li>Engine head 성공만 보고 application effect 전체 성공을 단정하면 어떤 실패를 놓칩니까?</li>
            </ol>
            <p>
              이 설명은 commit <code>{SHA.slice(0, 8)}</code>, 해당 dependencies와 V3 method 조합에 한정됩니다. 다른 Octane commit이나
              execution client를 판단하려면 같은 실패 경로와 status 변환을 새로 확인해야 합니다.
            </p>
          </div>

          <div id="paper-octane-events" className="scroll-mt-24">
            <CitationBlock type="code" citeKey={6} source="Octane EVM event bridge · 9864f25" href={EVENTS}>
              <p><strong>문제:</strong> Finalized EVM logs를 deterministic order로 application processors에 전달해야 합니다.</p>
              <p><strong>기여:</strong> Processor filters, log-index sorting, event verification과 per-event cache branch를 구현합니다.</p>
              <p><strong>전제:</strong> Processor registry, 같은 block hash, 도달 가능한 execution RPC와 Cosmos store semantics를 고정합니다.</p>
              <p><strong>근거 범위:</strong> 고정한 events.go와 msg_server.go의 fetch·deliver 동작입니다.</p>
              <p><strong>말하지 않는 것:</strong> All-events atomicity, cross-chain delivery나 exactly-once external effect를 보장하지 않습니다.</p>
            </CitationBlock>
          </div>
          <div id="paper-octane-engine-client" className="scroll-mt-24">
            <CitationBlock type="code" citeKey={7} source="Omni Engine client V3 adapter · 9864f25" href={ENGINE}>
              <p><strong>문제:</strong> Authenticated JSON-RPC transport와 typed payload status를 구분해야 합니다.</p>
              <p><strong>기여:</strong> V3 method names, JWT transport, HTTP timeout과 response·RPC error 변환을 구현합니다.</p>
              <p><strong>전제:</strong> Exact geth-compatible schema, endpoint, JWT secret와 고정한 client profile을 사용합니다.</p>
              <p><strong>근거 범위:</strong> 고정한 <code>lib/ethclient/engineclient.go</code> 동작입니다.</p>
              <p><strong>말하지 않는 것:</strong> Capability negotiation, 모든 versions·clients, network availability나 error 분류의 완전성을 보장하지 않습니다.</p>
            </CitationBlock>
          </div>
        </section>

        <CosmosEvmMapReturn
          currentSlug="omni-octane"
          closure="Octane은 payloadId·candidate execution verdict·CometBFT Commit·finalized FCU·event branch 적용을 서로 다른 영수증으로 연결합니다. 합의가 정한 B101과 local Engine의 EP101, Cosmos application effect는 같은 순간에 같은 구성요소가 소유하는 상태가 아닙니다."
        />
      </article>

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ omni: omniTree }}
        projectMetas={{ omni: { id: "omni", label: "Omni Octane · Go · 9864f25", badgeClass: "border-violet-500 bg-violet-500/10 text-violet-700" } }}
      />
    </>
  );
}
