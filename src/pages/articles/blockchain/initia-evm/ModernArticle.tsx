import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import CosmosEvmLocator, { CosmosEvmMapReturn } from "../CosmosEvmLocator";
import { codeRefs } from "./codeRefs";
import { minievm } from "./fileTrees";
import {
  MiniEvmFailureViz,
  MiniEvmReceiptBoundaryViz,
  MiniEvmTransactionViz,
} from "./viz/ModernInitiaEvmViz";
import BranchNestingViz from "./viz/BranchNestingViz";

const SHA = "27e60c548f3e2868f6e6b3cf6456fc9289ce7950";
const REPO = `https://github.com/initia-labs/minievm/tree/${SHA}`;
const RPC_TX = `https://github.com/initia-labs/minievm/blob/${SHA}/jsonrpc/backend/tx.go`;
const TXUTILS = `https://github.com/initia-labs/minievm/blob/${SHA}/x/evm/types/txutils.go`;
const ANTE_SEQUENCE = `https://github.com/initia-labs/minievm/blob/${SHA}/app/ante/sequence.go`;
const MSG_SERVER = `https://github.com/initia-labs/minievm/blob/${SHA}/x/evm/keeper/msg_server.go`;
const CONTEXT = `https://github.com/initia-labs/minievm/blob/${SHA}/x/evm/keeper/context.go`;
const SNAPSHOT = `https://github.com/initia-labs/minievm/blob/${SHA}/x/evm/state/snapshot.go`;
const PRECOMPILE = `https://github.com/initia-labs/minievm/blob/${SHA}/x/evm/precompiles/cosmos/contract.go`;
const COSMOS_SDK_SHA = "f62d8dfbcd45c64cbe36b77970e6ed90b9f42617";
const BASEAPP = `https://github.com/initia-labs/cosmos-sdk/blob/${COSMOS_SDK_SHA}/baseapp/baseapp.go`;
const COMPATIBILITY = "https://docs.initia.xyz/home/core-concepts/initia-and-rollups/rollups/vms/minievm/evm-compatibility-and-changes";

export default function ModernInitiaEvmArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <article>
        <section id="overview" className="mb-16 scroll-mt-20">
          <CosmosEvmLocator
            currentSlug="initia-evm"
            region="Ethereum JSON-RPC와 Cosmos application state를 잇는 transaction 경로"
            question="eth_sendRawTransaction이 hash를 반환하면 Alice의 sequence와 Cosmos bank balance도 이미 확정된 걸까요?"
          />
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="text-lg leading-8">
              설명용 요청 <code>T7</code> 하나를 따라가겠습니다. Alice의 account sequence는 7이고 <code>ufoo</code> 잔액은 100,
              Bob의 잔액은 0입니다. Alice는 Ethereum transaction의 목적지를 MiniEVM Cosmos precompile로 두고
              <code>MsgSend 10ufoo</code>를 요청합니다.
            </p>
          </div>
          <MiniEvmTransactionViz />
          <ContentBoundary article="initia-evm" />

          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <h2>MiniEVM은 Ethereum 노드를 옆에 하나 더 두는 구조가 아닙니다</h2>
            <p>
              Octane처럼 CometBFT application과 별도 execution client 사이에서 Engine API payload를 주고받지 않습니다. MiniEVM은
              signed Ethereum transaction을 Cosmos SDK transaction으로 바꾸고, 같은 application process 안의 <code>x/evm</code>
              keeper가 Geth EVM과 Cosmos-backed StateDB를 실행합니다.
            </p>
            <p>
              그래서 하나의 요청 안에도 정본이 네 군데 있습니다. JSON-RPC는 raw bytes와 Ethereum hash를 다루고, Cosmos transaction
              pipeline은 signature·sequence·block commit을 관리합니다. EVM은 call frame·snapshot·logs를 관리하며, bank 같은 Cosmos
              module은 실제 <code>MsgSend</code> state를 관리합니다.
            </p>
            <p>
              앞 글의 Engine API 경계와 비교하려면 <Link to="/cs/blockchain/omni-octane#overview">Octane payload 한 건 추적</Link>을,
              Cosmos block commit 자체가 낯설다면 <Link to="/cs/blockchain/cometbft-execution#overview">CometBFT BlockExecutor 저장 순서</Link>를
              먼저 보면 두 구조의 차이가 선명해집니다.
            </p>
          </div>

          <div id="paper-minievm-snapshot" className="scroll-mt-24">
            <CitationBlock type="code" citeKey={1} source="Initia MiniEVM repository snapshot · v1.2.19" href={REPO}>
              <p><strong>문제:</strong> Ethereum 요청이 Cosmos application 안에서 실제로 어느 함수와 state boundary를 지나는지 확인해야 합니다.</p>
              <p><strong>기여:</strong> 고정 repository는 JSON-RPC backend, transaction 변환, Ante, x/evm keeper, StateDB와 Cosmos precompile을 함께 보여 줍니다.</p>
              <p><strong>전제:</strong> Tag v1.2.19, commit {SHA.slice(0, 8)}, Initia fork의 Cosmos SDK·CometBFT dependencies와 chain configuration을 함께 고정합니다.</p>
              <p><strong>근거 범위:</strong> 해당 commit의 공개 source와 tests에 한정합니다.</p>
              <p><strong>말하지 않는 것:</strong> 모든 Ethereum RPC·fork·tooling parity, production readiness나 고정 성능을 보장하지 않습니다.</p>
            </CitationBlock>
          </div>
        </section>

        <section id="tx-envelope" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">Ethereum 봉투를 Cosmos 봉투로 바꿔도 요청의 의미는 유지해야 합니다</h2>
          <MiniEvmReceiptBoundaryViz />
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              <code>SendRawTransaction</code>은 raw bytes를 Ethereum transaction으로 decode하고 EIP-155 replay protection을 검사합니다.
              이어 <code>SendTx</code>가 이를 SDK transaction으로 변환해 <code>BroadcastTxSync</code>에 전달합니다. 반환하는 값은 원래
              Ethereum transaction hash입니다. 이 값은 request identity이지 block commit 영수증이 아닙니다.
            </p>
            <p>
              변환 함수는 chain ID에 맞는 signer로 sender를 복원하고 Ethereum nonce를 SDK signature sequence에 넣습니다. 목적지가 있으면
              <code>MsgCall</code>, 없으면 <code>MsgCreate</code>를 만들며 gas·fee·value·calldata·access list를 함께 옮깁니다. T7에서는
              <code>MsgCall</code>의 목적지가 Cosmos precompile이고 input 안에 <code>MsgSend 10ufoo</code>가 들어갑니다.
            </p>
            <p>
              여기서 sequence와 message state의 rollback 범위는 같지 않습니다. 고정한 Initia Cosmos SDK의 <code>BaseApp.runTx</code>는
              성공한 Ante cache를 message 실행 전에 block working state에 씁니다.
            </p>
            <p>
              따라서 Ante를 통과한 T7이 뒤 EVM call이나 MsgSend에서 실패해도 sequence 8은 남을 수 있고, balance 후보만 버려집니다.
              이 block이 commit되어야 그 차이가 durable state가 됩니다.
            </p>
          </div>
          <div className="not-prose my-6 flex flex-wrap gap-3">
            <CodeViewButton label="RPC 접수 원문" onClick={() => sidebar.open("rpc-ingress", codeRefs["rpc-ingress"])} />
            <CodeViewButton label="Ethereum→Cosmos 변환 원문" onClick={() => sidebar.open("ethereum-envelope", codeRefs["ethereum-envelope"])} />
            <CodeViewButton label="Ante sequence 원문" onClick={() => sidebar.open("ante-sequence", codeRefs["ante-sequence"])} />
            <CodeViewButton label="Ante·message cache 경계 원문" onClick={() => sidebar.open("baseapp-ante-commit", codeRefs["baseapp-ante-commit"])} />
            <CodeViewButton label="Sequence 보정 원문" onClick={() => sidebar.open("sequence-reconcile", codeRefs["sequence-reconcile"])} />
          </div>

          <ExplainedFormula
            question="T7이 성공해 block에 commit되면 sequence와 ufoo 잔액은 어떻게 바뀝니까?"
            idea={<>아래 수치는 실제 chain 측정값이 아니라 한 요청의 상태 전이를 설명하는 fixture입니다. Fee는 별도 denomination으로 지불한다고 가정해 ufoo 송금만 계산합니다.</>}
            formula={String.raw`seq_A=7+1=8,\qquad bal_A=100-10=90,\qquad bal_B=0+10=10`}
            annotatedFormula={String.raw`\underbrace{seq_A}_{\text{Alice sequence}}=\underbrace{7}_{\text{요청 전}}+\underbrace{1}_{\text{T7 한 번}}=\underbrace{8}_{\text{commit 뒤}},\qquad\underbrace{bal_A}_{\text{Alice ufoo}}=100-10=\underbrace{90}_{\text{commit 뒤}},\qquad\underbrace{bal_B}_{\text{Bob ufoo}}=0+10=\underbrace{10}_{\text{commit 뒤}}`}
            operations={[
              { expression: String.raw`7+1=8`, annotation: ["Ante와 EVM 경로를 합쳐", "sequence는 한 번만 증가"] },
              { expression: String.raw`100-10=90`, annotation: ["Alice의 ufoo 후보 잔액", "fee denomination은 별도"] },
              { expression: String.raw`0+10=10`, annotation: ["Bob의 ufoo 후보 잔액", "같은 MsgSend의 반대편"] },
            ]}
            terms={[
              { symbol: "seq_A", name: "Alice sequence", description: "Ethereum nonce와 Cosmos account sequence를 연결하는 재실행 방지 번호입니다." },
              { symbol: "bal_A", name: "Alice ufoo balance", description: "설명용 Cosmos bank denomination ufoo의 Alice 잔액입니다." },
              { symbol: "bal_B", name: "Bob ufoo balance", description: "같은 MsgSend가 증가시키는 Bob의 잔액입니다." },
            ]}
            assumptions={[
              "7·100·0·10은 상태 전이를 설명하기 위한 가정이며 실제 배포의 계정이나 측정값이 아닙니다.",
              "T7은 signature·chain ID·gas·caller 검사를 통과하고 MsgSend 10ufoo가 성공한다고 가정합니다.",
              "Transaction fee는 ufoo와 다른 denomination에서 지불해 ufoo balance 식에 넣지 않습니다.",
              "세 값은 EVM return 시점이 아니라 같은 Cosmos block commit 뒤의 durable state입니다.",
            ]}
            interpretation="성공한 요청 하나의 durable 결과는 sequence 8, Alice 90, Bob 10입니다. 다만 sequence 8만으로 성공을 판단하면 안 됩니다. Ante를 통과한 뒤 message가 실패해도 sequence는 block commit 뒤 8이 될 수 있고, 이때 balance는 100/0으로 남습니다."
          />

          <div id="paper-minievm-tx" className="scroll-mt-24">
            <CitationBlock type="code" citeKey={2} source="MiniEVM transaction ingress and conversion · v1.2.19" href={TXUTILS}>
              <p><strong>문제:</strong> Ethereum transaction 의미를 Cosmos SDK lifecycle 안으로 옮기면서 sender·nonce·gas·value·data를 잃지 않아야 합니다.</p>
              <p><strong>기여:</strong> <a href={RPC_TX}>RPC backend</a>와 transaction utilities는 raw decode, replay protection, sender recovery, MsgCall·MsgCreate 변환과 synchronous broadcast를 구현합니다.</p>
              <p><strong>전제:</strong> Chain ID, fee denomination decimals, gas enforcement params, Ethereum transaction type과 sign mode를 함께 고정합니다.</p>
              <p><strong>근거 범위:</strong> 고정한 <code>jsonrpc/backend/tx.go</code>와 <code>x/evm/types/txutils.go</code>의 변환·broadcast 경로입니다.</p>
              <p><strong>말하지 않는 것:</strong> Hash 반환이나 <code>BroadcastTxSync</code> code 0이 EVM success·block inclusion·finality를 보장한다는 뜻은 아닙니다.</p>
            </CitationBlock>
          </div>
          <div id="paper-minievm-sequence" className="scroll-mt-24">
            <CitationBlock type="code" citeKey={3} source="MiniEVM sequence reconciliation · v1.2.19" href={ANTE_SEQUENCE}>
              <p><strong>문제:</strong> Cosmos Ante와 EVM CALL·CREATE가 서로 다른 위치에서 sequence를 올려 한 요청이 두 번 증가할 수 있습니다.</p>
              <p><strong>기여:</strong> Ante는 증가 여부를 context flag로 남기고, <a href={MSG_SERVER}>message server</a>는 CALL·CREATE 경로에 맞춰 중복 증가를 보정합니다. <a href={BASEAPP}>Initia Cosmos SDK BaseApp</a>은 Ante cache와 message cache의 commit 시점을 분리합니다.</p>
              <p><strong>전제:</strong> 같은 transaction context, account keeper와 pinned message routing을 사용합니다.</p>
              <p><strong>근거 범위:</strong> 고정한 sequence decorator, <code>handleSequenceIncremented</code>와 Cosmos SDK fork commit <code>{COSMOS_SDK_SHA.slice(0, 8)}</code>의 <code>runTx</code> 구현입니다.</p>
              <p><strong>말하지 않는 것:</strong> Sequence 8만으로 signature·EVM state·Cosmos submessage·block commit까지 성공했다는 뜻은 아닙니다.</p>
            </CitationBlock>
          </div>
        </section>

        <section id="state-bridge" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">Precompile은 Cosmos message를 queue에 예약합니다</h2>
          <MiniEvmFailureViz />
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              <code>execute_cosmos</code>는 일반 함수 호출처럼 보이지만 먼저 read-only 여부, dispatch 차단 flag, ABI decode, caller와
              Cosmos message signer, gas limit을 검사합니다. 통과하면 bank keeper를 바로 호출하지 않고 현재 StateDB snapshot에 속한
              <code>ExecuteRequest</code> queue에 MsgSend를 넣습니다.
            </p>
            <p>
              이 순서가 중요한 이유는 EVM REVERT입니다. Child call이 실패하면 snapshot과 그 안의 queue를 함께 버릴 수 있습니다. EVM frame이
              성공하면 <code>StateDB.Commit</code>이 snapshot state와 requests를 parent transaction context에 합치고, 그 뒤
              <code>dispatchMessages</code>가 각 sdk.Msg를 별도 <code>CacheContext</code>에서 실행합니다.
            </p>
            <p>
              Submessage가 성공해야 그 cache branch를 parent에 씁니다. 실패하면서 <code>allowFailure=false</code>이면 error가 바깥으로 전파되고,
              <code>allowFailure=true</code>이면 해당 submessage state는 버리되 outer EVM transaction이 계속될 수 있습니다. Callback ID가 있으면
              성공 여부를 다시 EVM contract에 전달합니다.
            </p>
          </div>
          <div className="not-prose my-6 flex flex-wrap gap-3">
            <CodeViewButton label="Precompile queue 원문" onClick={() => sidebar.open("precompile-queue", codeRefs["precompile-queue"])} />
            <CodeViewButton label="Snapshot 원문" onClick={() => sidebar.open("state-snapshot", codeRefs["state-snapshot"])} />
            <CodeViewButton label="EVMCall 원문" onClick={() => sidebar.open("evm-call", codeRefs["evm-call"])} />
            <CodeViewButton label="Cosmos dispatch 원문" onClick={() => sidebar.open("dispatch-message", codeRefs["dispatch-message"])} />
          </div>

          <ExplainedFormula
            question="언제 T7의 상태 변경을 durable 완료로 말할 수 있습니까?"
            idea={<>서로 다른 네 영수증을 하나로 뭉치지 않습니다. Broadcast, EVM frame, Cosmos submessage와 block commit이 모두 성공해야 fixture의 durable 결과를 주장합니다.</>}
            formula={String.raw`D_{T7}=I_{broadcast}\land I_{evm}\land I_{submsg}\land I_{commit}`}
            annotatedFormula={String.raw`\underbrace{D_{T7}}_{\text{durable 완료}}=\underbrace{I_{broadcast}}_{\text{접수}}\land\underbrace{I_{evm}}_{\text{EVM frame}}\land\underbrace{I_{submsg}}_{\text{MsgSend branch}}\land\underbrace{I_{commit}}_{\text{block state commit}}`}
            operations={[
              { expression: String.raw`I_{broadcast}=1`, annotation: ["RPC·CheckTx 경로 수용", "아직 실행 전"] },
              { expression: String.raw`I_{evm}=1`, annotation: ["EVM frame과 snapshot 성공", "submessage는 별도"] },
              { expression: String.raw`I_{submsg}=1`, annotation: ["MsgSend cache branch merge", "outer commit은 별도"] },
              { expression: String.raw`I_{commit}=1`, annotation: ["같은 block state에 반영", "이때 D_T7=1"] },
            ]}
            terms={[
              { symbol: "D_{T7}", name: "T7 durable completion", description: "Sequence와 ufoo balance를 committed application state로 말할 수 있는 조건입니다." },
              { symbol: "I_{broadcast}", name: "Broadcast receipt", description: "Synchronous broadcast 경로가 오류 없이 응답했는지 나타냅니다." },
              { symbol: "I_{evm}", name: "EVM receipt", description: "Call frame이 REVERT 없이 끝나고 StateDB candidate가 합쳐졌는지 나타냅니다." },
              { symbol: "I_{submsg}", name: "Cosmos submessage receipt", description: "Queued MsgSend의 CacheContext가 성공해 parent transaction에 합쳐졌는지 나타냅니다." },
              { symbol: "I_{commit}", name: "Block commit receipt", description: "Outer transaction state가 committed block에 반영됐는지 나타냅니다." },
            ]}
            assumptions={[
              "각 indicator는 같은 T7 identity와 같은 block attempt를 가리킵니다.",
              "allowFailure=false인 성공 경로를 기준으로 하며 allowFailure=true의 부분 성공은 별도 상태로 기록합니다.",
              "D_T7은 이 Cosmos chain의 committed application state를 뜻하며 외부 bridge나 다른 chain의 완료를 뜻하지 않습니다.",
            ]}
            interpretation="Broadcast와 EVM만 성공한 1∧1∧0∧0은 durable 완료가 아닙니다. 네 값이 모두 1일 때만 sequence 8과 balance 90/10을 committed 결과로 연결할 수 있습니다."
          />

          <div id="paper-minievm-state" className="scroll-mt-24">
            <CitationBlock type="code" citeKey={4} source="MiniEVM StateDB snapshot and Cosmos dispatch · v1.2.19" href={SNAPSHOT}>
              <p><strong>문제:</strong> EVM nested call의 rollback 범위와 Cosmos module message 실행을 같은 transaction 안에서 연결해야 합니다.</p>
              <p><strong>기여:</strong> Snapshot은 CacheContext와 child request queue를 만들고, <a href={PRECOMPILE}>Cosmos precompile</a>은 검증된 sdk.Msg를 queue에 넣으며, <a href={CONTEXT}>EVMCall·dispatchMessage</a>는 성공한 state만 단계적으로 parent에 합칩니다.</p>
              <p><strong>전제:</strong> Pinned StateDB, Cosmos SDK CacheContext, message router, gas meter와 allowFailure option을 함께 고정합니다.</p>
              <p><strong>근거 범위:</strong> 고정한 snapshot, EVMCall, execute_cosmos와 dispatch implementation입니다.</p>
              <p><strong>말하지 않는 것:</strong> Precompile return, EVM success나 submessage commit 하나가 block commit·external effect·exactly-once를 보장한다는 뜻은 아닙니다.</p>
            </CitationBlock>
          </div>
        </section>

        <section id="release" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">실패 지점마다 어떤 후보 state가 버려지는지 구분해야 합니다</h2>
          <BranchNestingViz />
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              ABI decode나 signer 검사가 실패하면 precompile snapshot이 되돌아가 queue가 생기지 않습니다. EVM이 REVERT해도 child queue는 parent로
              올라오지 않습니다. 반대로 EVM frame 뒤 MsgSend handler가 실패하면 submessage cache를 쓰지 않고 option에 따라 error를 바깥으로
              전파하거나 실패를 허용합니다.
            </p>
            <p>
              그러나 이 rollback은 Ante cache까지 거슬러 올라가지 않습니다. FinalizeBlock 경로에서 Ante가 성공했다면 sequence 7→8은 message
              branch보다 먼저 현재 block state에 반영됩니다.
            </p>
            <p>
              이후 transaction이 실패하고 block이 commit되면 sequence 8과 balance 100/0이 남을 수 있습니다. 그래서 sequence 증가,
              EVM status, MsgSend balance를 서로 다른 영수증으로 읽어야 합니다.
            </p>
            <p>
              그러므로 장애를 재현할 때는 hash 존재 여부만 보지 않고 같은 T7의 sequence, EVM status·logs, queued request 수, MsgSend event,
              Alice·Bob balance와 committed block height를 함께 봐야 합니다. 이 글은 어떤 제품을 배포할지 결정하지 않고, 이후 운영 글에서 사용할
              상태 소유권과 실패 경계를 확정합니다.
            </p>
            <h3>이 글의 질문에 답하기</h3>
            <ol>
              <li>Ethereum transaction hash와 committed Cosmos receipt는 무엇이 다릅니까?</li>
              <li>Sequence 7이 9가 아니라 8이 되어야 하는 이유는 무엇입니까?</li>
              <li><code>execute_cosmos</code>가 keeper를 즉시 호출하지 않는 이유는 무엇입니까?</li>
              <li>EVM REVERT와 <code>allowFailure=true</code>인 Cosmos submessage 실패는 결과가 어떻게 다릅니까?</li>
              <li>어떤 네 영수증이 있어야 Alice 90·Bob 10을 durable state라고 말할 수 있습니까?</li>
            </ol>
            <p>
              이 설명은 tag <code>v1.2.19</code>, commit <code>{SHA.slice(0, 8)}</code>와 해당 dependency 조합에 한정됩니다. 다른 release를
              판단하려면 transaction 변환, sequence flag, snapshot queue, dispatch error path와 compatibility 목록을 다시 확인해야 합니다.
            </p>
          </div>

          <div id="paper-minievm-compat" className="scroll-mt-24">
            <CitationBlock citeKey={5} source="Initia Docs · MiniEVM EVM compatibility and changes" href={COMPATIBILITY}>
              <p><strong>문제:</strong> Ethereum tooling 사용자가 MiniEVM의 지원 범위와 standard Ethereum execution의 차이를 알아야 합니다.</p>
              <p><strong>기여:</strong> 공식 문서는 현재 compatibility surface와 transaction·RPC 차이를 정리합니다.</p>
              <p><strong>전제:</strong> 문서 확인 시점과 실제 배포의 exact release·chain configuration을 함께 기록합니다.</p>
              <p><strong>근거 범위:</strong> 문서가 명시한 current compatibility와 known differences입니다.</p>
              <p><strong>말하지 않는 것:</strong> Current 목록이 future release에 고정되거나 모든 wallet·tool이 완전히 동작한다는 뜻은 아닙니다.</p>
            </CitationBlock>
          </div>
        </section>

        <CosmosEvmMapReturn
          currentSlug="initia-evm"
          closure="MiniEVM은 Ethereum transaction을 Cosmos SDK transaction으로 바꿔 같은 application 안에서 실행합니다. Hash 반환, Ante sequence, EVM snapshot, queued Cosmos submessage와 block commit은 서로 다른 영수증이며, durable state는 마지막 commit까지 확인해야 합니다."
        />
      </article>

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ minievm }}
        projectMetas={{ minievm: { id: "minievm", label: "Initia MiniEVM · Go · v1.2.19", badgeClass: "border-sky-500 bg-sky-500/10 text-sky-700" } }}
      />
    </>
  );
}
