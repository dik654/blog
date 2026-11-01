import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import CosmosEvmLocator, { CosmosEvmMapReturn } from "../CosmosEvmLocator";
import { codeRefs } from "./codeRefs";
import { evmosSources } from "./fileTrees";
import {
  EvmosFailureViz,
  EvmosIbcBoundaryViz,
  EvmosTransactionViz,
} from "./viz/ModernEvmosViz";

const EVMOS_SHA = "eca13ef2521a9ef13c32e80b1b147230bdb155b5";
const RPC_SOURCE = `https://github.com/evmos/evmos/blob/${EVMOS_SHA}/rpc/backend/call_tx.go`;
const ANTE_ROUTE = `https://github.com/evmos/evmos/blob/${EVMOS_SHA}/app/ante/ante.go`;
const MONO_ANTE = `https://github.com/evmos/evmos/blob/${EVMOS_SHA}/app/ante/evm/mono.go`;
const NONCE_SOURCE = `https://github.com/evmos/evmos/blob/${EVMOS_SHA}/app/ante/evm/10_increment_sequence.go`;
const TRANSITION_SOURCE = `https://github.com/evmos/evmos/blob/${EVMOS_SHA}/x/evm/keeper/state_transition.go`;
const STATEDB_SOURCE = `https://github.com/evmos/evmos/blob/${EVMOS_SHA}/x/evm/statedb/statedb.go`;
const IBC_SOURCE = `https://github.com/evmos/evmos/blob/${EVMOS_SHA}/x/erc20/ibc_middleware.go`;

export default function ModernEvmosArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <article>
        <section id="overview" className="mb-16 scroll-mt-20">
          <CosmosEvmLocator
            currentSlug="evmos"
            region="Ethereum transaction을 Cosmos ante·StateDB·block Commit에 연결하는 경로"
            question="eth_sendRawTransaction이 hash를 돌려준 순간, Alice의 fee·nonce·balance는 어디까지 확정됐을까요?"
          />

          <EvmosTransactionViz />
          <ContentBoundary article="evmos" />

          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="text-lg leading-8">
              정답은 아직 committed state가 하나도 바뀌지 않았다는 것입니다. Evmos v20의 RPC는 raw Ethereum transaction을
              <code>MsgEthereumTx</code>가 든 Cosmos transaction으로 바꾸고 sync broadcast한 뒤 원래 Ethereum hash를 반환합니다.
            </p>
            <p className="text-lg leading-8">
              그 뒤 validator가 transaction을 block에 넣습니다. Ethereum 전용 ante와 EVM을 실행하고, 성공한 branch가 application
              Commit까지 도달해야 잔액과 sequence가 durable state로 바뀝니다.
            </p>
            <p>
              위 그림은 T7 하나만 추적합니다. Alice의 시작 잔액은 1,000,000 base unit, sequence는 7이고 Bob에게 10을 보냅니다.
              Gas limit은 30,000, base fee는 20, priority fee cap은 3, max fee는 30입니다. 모두 코드 경계를 설명하기 위한
              가정이며 실제 계정, 가격, 처리량 측정값이 아닙니다.
            </p>
            <p>
              이 글은 historical Evmos <code>v20.0.0</code>, commit <code>{EVMOS_SHA.slice(0, 8)}</code>을 고정합니다. 최신
              <code>cosmos/evm</code>이나 다른 Ethermint 계열 chain에 같은 구현을 그대로 일반화하지 않습니다. 부모 글에서 본
              <Link to="/cs/blockchain/cosmos-sdk#runtx-pipeline"> Cosmos ante·message 분리</Link>를 Ethereum transaction 한 건에
              적용해 보는 글입니다.
            </p>
          </div>

          <div className="not-prose my-6 flex flex-wrap gap-3">
            <CodeViewButton label="RPC 변환·broadcast 원문" onClick={() => sidebar.open("rpc-broadcast", codeRefs["rpc-broadcast"])} />
          </div>

          <div id="paper-evmos-rpc-v20" className="scroll-mt-24">
            <CitationBlock type="code" citeKey={1} source="Evmos v20.0.0 · RPC transaction ingress" href={RPC_SOURCE}>
              <p><strong>문제:</strong> Ethereum JSON-RPC 요청을 Cosmos application transaction 경로에 넣어야 합니다.</p>
              <p><strong>기여:</strong> Raw transaction을 decode해 <code>MsgEthereumTx</code>와 SDK transaction으로 만들고 sync broadcast한 뒤 Ethereum hash를 반환합니다.</p>
              <p><strong>전제:</strong> Tag v20.0.0, commit {EVMOS_SHA.slice(0, 8)}의 EVM denom과 TxConfig를 사용합니다.</p>
              <p><strong>근거 범위:</strong> RPC 접수·표현 변환·broadcast mode에 한정됩니다.</p>
              <p><strong>말하지 않는 것:</strong> Hash 반환이 mempool 잔류, block inclusion, EVM 성공이나 application Commit을 보장하지 않습니다.</p>
            </CitationBlock>
          </div>
        </section>

        <section id="ante-state" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">Ante는 EVM을 실행하기 전에 최대 비용과 nonce를 먼저 기록합니다</h2>

          <ExplainedFormula
            question="T7이 먼저 내고, 실행 뒤 실제로 부담하는 gas 비용은 얼마입니까?"
            idea={<>Effective gas price는 signed max fee와 base fee+tip 중 작은 값입니다. Ante는 gas limit 전체의 비용을 먼저 걷고, EVM 실행 뒤 쓰지 않은 gas를 같은 단가로 돌려줍니다.</>}
            formula={String.raw`p=\min(30,20+3)=23,\quad F_{upfront}=30000\times23=690000,\quad F_{net}=21000\times23=483000`}
            annotatedFormula={String.raw`\underbrace{p}_{\text{gas당 유효 가격}}=\min(\underbrace{30}_{\text{max fee}},\underbrace{20+3}_{\text{base+tip}})=23,\quad\underbrace{F_{upfront}}_{\text{Ante 선차감}}=30000\times23=690000,\quad\underbrace{F_{net}}_{\text{최종 비용}}=21000\times23=483000`}
            operations={[
              { expression: String.raw`\min(30,20+3)=23`, annotation: ["Alice가 서명한 gas당 상한 30", "현재 base fee 20과 tip cap 3", "더 작은 값 23을 선택"] },
              { expression: String.raw`30000\times23=690000`, annotation: ["Ante에서 gas limit 전체를 확보", "fee collector로 먼저 이동", "실행 실패 때도 gas 예산을 보장"] },
              { expression: String.raw`(30000-21000)\times23=207000`, annotation: ["단순 value transfer gasUsed 21,000", "남은 9,000 gas 비용 반환", "690,000−207,000=483,000"] },
            ]}
            terms={[
              { symbol: "p", name: "effective gas price", description: "T7의 max fee와 현재 block의 base fee·tip cap에서 계산한 gas당 가격입니다." },
              { symbol: "F_{upfront}", name: "ante 선차감", description: "실행 전에 gas limit 전체를 처리할 수 있도록 먼저 확보한 금액입니다." },
              { symbol: "F_{net}", name: "최종 gas 비용", description: "Evmos의 minimum gas rule과 EVM 사용량을 반영한 gasUsed에 유효 가격을 곱한 값입니다." },
            ]}
            assumptions={[
              "EIP-1559 dynamic-fee transaction이며 base fee 20, tip cap 3, max fee 30입니다.",
              "Data와 access list가 없는 단순 value transfer라 intrinsic gas와 실제 gasUsed를 21,000으로 둡니다.",
              "Evmos v20 mainnet MinGasMultiplier 0.5가 만드는 최소 gasUsed 15,000보다 실제 21,000이 큽니다.",
              "모든 수치는 설명용 integer base unit이며 실제 network fee나 benchmark가 아닙니다.",
            ]}
            interpretation="Alice는 ante에서 690,000을 먼저 내고 sequence가 7에서 8로 증가합니다. 성공한 단순 송금은 207,000을 돌려받아 gas 483,000과 value 10을 부담하므로 최종 잔액은 516,990입니다."
          />

          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              첫 extension option이 <code>ExtensionOptionsEthereumTx</code>이면 Evmos는 일반 Cosmos ante 대신 mono EVM ante를
              고릅니다.
            </p>
            <p>
              이 경로는 block height의 fork 규칙으로 sender를 복구합니다. 이어서 replay protection·잔액·value transfer 가능성·intrinsic
              gas를 검사하고, Alice가 낼 수 있는지는 <code>value + gasLimit × effectiveGasPrice</code>로 판단합니다.
            </p>
            <p>
              그다음 최대 gas 비용을 fee collector로 옮기고 <code>IncrementNonce</code>가 transaction nonce 7과 account sequence
              7이 같은지 확인합니다. 같으면 sequence를 8로 올립니다. 따라서 “EVM이 성공해야 nonce를 쓴다”가 아니라, 유효한
              transaction이 ante를 통과해 실행을 시도하면 nonce가 소비된다는 쪽이 정확합니다.
            </p>
          </div>

          <div className="not-prose my-6 flex flex-wrap gap-3">
            <CodeViewButton label="Ante 경로 선택 원문" onClick={() => sidebar.open("ante-route", codeRefs["ante-route"])} />
            <CodeViewButton label="Fee·nonce 원문" onClick={() => sidebar.open("ante-fee-nonce", codeRefs["ante-fee-nonce"])} />
          </div>

          <div id="paper-evmos-ante-v20" className="scroll-mt-24">
            <CitationBlock type="code" citeKey={2} source="Evmos v20.0.0 · Ethereum mono ante" href={MONO_ANTE}>
              <p><strong>문제:</strong> Ethereum 서명·nonce·fee 규칙을 Cosmos account와 block execution에 연결해야 합니다.</p>
              <p><strong>기여:</strong> <a href={ANTE_ROUTE}>Ante router</a>가 transaction 종류를 나누고 mono decorator가 sender recovery, 잔액, fee, transfer, gas를 검사하며 <a href={NONCE_SOURCE}>IncrementNonce</a>가 sequence를 갱신합니다.</p>
              <p><strong>전제:</strong> Evmos v20 fork configuration, fee market state와 account keeper가 같은 block context를 사용합니다.</p>
              <p><strong>근거 범위:</strong> Ethereum transaction이 message handler에 들어가기 전의 admission state입니다.</p>
              <p><strong>말하지 않는 것:</strong> Ante success가 EVM success, block inclusion이나 durable Commit을 뜻하지 않습니다.</p>
            </CitationBlock>
          </div>
        </section>

        <section id="evm-cache" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">StateDB Commit은 block Commit이 아니라 임시 branch 안의 기록입니다</h2>

          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              <code>ApplyTransaction</code>은 먼저 <code>ctx.CacheContext()</code>로 <code>tmpCtx</code>를 만듭니다. EVM의
              StateDB도 account·code·storage·log·refund 변경을 journal에 쌓고 nested call이 실패하면 snapshot까지 되감습니다.
              <code>StateDB.Commit()</code>은 살아남은 dirty state를 <code>tmpCtx</code>의 keeper에 쓸 뿐, root database version을
              확정하지 않습니다.
            </p>
            <p>
              EVM response가 성공이면 바깥 <code>commit()</code>이 <code>tmpCtx</code>를 parent transaction context에 합칩니다.
              <code>REVERT</code>면 <code>res.Failed()</code>가 true이므로 value·storage·log branch를 합치지 않습니다.
            </p>
            <p>
              그러나 VM error는 Go error로 바뀌지 않고 response의 <code>VmError</code>에 담깁니다. 그래서 ante의 sequence 증가와 사용한
              gas 비용은 남고, EVM state만 되돌리는 Ethereum receipt semantics를 만들 수 있습니다.
            </p>
          </div>

          <div className="not-prose my-6 flex flex-wrap gap-3">
            <CodeViewButton label="ApplyTransaction 원문" onClick={() => sidebar.open("apply-transaction", codeRefs["apply-transaction"])} />
            <CodeViewButton label="StateDB journal 원문" onClick={() => sidebar.open("statedb-commit", codeRefs["statedb-commit"])} />
          </div>

          <div id="paper-evmos-statedb-v20" className="scroll-mt-24">
            <CitationBlock type="code" citeKey={3} source="Evmos v20.0.0 · x/evm Keeper and StateDB" href={TRANSITION_SOURCE}>
              <p><strong>문제:</strong> EVM snapshot·REVERT·gas와 Cosmos cache state가 같은 transaction 결과를 만들어야 합니다.</p>
              <p><strong>기여:</strong> <a href={TRANSITION_SOURCE}>ApplyTransaction</a>은 EVM 전용 CacheContext를 성공 때만 합치고, <a href={STATEDB_SOURCE}>StateDB</a>는 journal snapshot과 keeper write를 구현합니다.</p>
              <p><strong>전제:</strong> Tag v20.0.0의 Evmos Cosmos SDK fork v0.50.9, go-ethereum EVM과 chain configuration을 함께 고정합니다.</p>
              <p><strong>근거 범위:</strong> 한 <code>MsgEthereumTx</code>의 EVM state·gas·response 처리입니다.</p>
              <p><strong>말하지 않는 것:</strong> <code>StateDB.Commit()</code>이나 <code>tmpCtx commit()</code>이 CometBFT block finality 또는 root store Commit이라는 뜻은 아닙니다.</p>
            </CitationBlock>
          </div>
        </section>

        <section id="failure-boundaries" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">REVERT와 ante 거절은 같은 실패가 아닙니다</h2>
          <EvmosFailureViz />

          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              잘못된 서명이나 nonce는 ante에서 거절되므로 fee·sequence·EVM state가 바뀌지 않습니다. 반면 contract가
              <code>REVERT</code>하면 이미 유효한 transaction의 실행을 시도한 것입니다. EVM value·storage·log는 버리지만 sequence는
              8이 되고 실제 사용한 gas 비용은 Alice가 부담합니다.
            </p>
            <p>
              클라이언트는 HTTP 성공 여부가 아니라 committed receipt의
              <code>status</code>와 <code>gasUsed</code>를 읽어야 합니다.
            </p>
            <p>
              내부 StateDB commit이나 hook에서 Go error가 나면 message error로 전파되므로 또 다른 branch 규칙이 적용됩니다.
              마지막으로 hash를 받았지만 block에 포함되지 않은 transaction은 committed query에서 sequence와 balance를 바꾸지 않습니다.
              네 경우를 구분해야 재시도 중복, nonce gap, 잘못된 환불 표시를 피할 수 있습니다.
            </p>

            <h3>완료를 판정할 때 같은 height에서 볼 값</h3>
            <ol>
              <li>Ethereum transaction hash가 가리키는 committed block height와 receipt status</li>
              <li>Receipt의 gasUsed와 Evmos EVM event의 Ethereum·Cosmos transaction hash</li>
              <li>Alice account sequence 8과 fee를 반영한 committed balance</li>
              <li>성공한 경우 Bob balance 10, REVERT한 경우 Bob과 contract storage의 원상태</li>
            </ol>
          </div>
        </section>

        <section id="ibc-boundary" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">IBC 전송은 같은 transaction의 후반부가 아니라 별도 packet 생명주기입니다</h2>
          <EvmosIbcBoundaryViz />

          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              Evmos는 bank coin과 ERC-20 representation을 연결하고 ICS-20 transfer callback에서 변환할 수 있습니다. 하지만 T7의
              local block receipt와 remote chain의 credit는 같은 영수증이 아닙니다. Source chain send, relayer proof, destination
              <code>OnRecvPacket</code>, acknowledgement 또는 timeout을 각각 확인해야 합니다.
            </p>
            <p>
              v20 middleware는 먼저 underlying ICS-20 <code>OnRecvPacket</code>을 실행합니다. Error acknowledgement이면 그대로
              반환하고, 성공 acknowledgement일 때만 ERC-20 keeper conversion을 이어갑니다.
            </p>
            <p>
              발신 측 error acknowledgement와 timeout은 ICS-20 refund가 끝난 뒤 representation을 복원합니다. 따라서 symbol과 amount가
              같아 보여도 bank balance, EVM contract
              storage와 packet receipt 중 어느 상태가 정본인지 구분해야 합니다.
            </p>
          </div>

          <div className="not-prose my-6 flex flex-wrap gap-3">
            <CodeViewButton label="IBC callback 원문" onClick={() => sidebar.open("ibc-callback", codeRefs["ibc-callback"])} />
          </div>

          <div id="paper-evmos-erc20-ibc-v20" className="scroll-mt-24">
            <CitationBlock type="code" citeKey={4} source="Evmos v20.0.0 · ERC-20 IBC middleware" href={IBC_SOURCE}>
              <p><strong>문제:</strong> ICS-20 packet 성공·환불과 Cosmos coin/ERC-20 representation conversion을 같은 callback 결과로 맞춰야 합니다.</p>
              <p><strong>기여:</strong> Receive, acknowledgement, timeout에서 underlying IBC application을 먼저 호출하고 성공 조건에 따라 ERC-20 keeper를 연결합니다.</p>
              <p><strong>전제:</strong> Evmos v20 token pair, compatible IBC-Go v8 stack과 channel proof·timeout semantics를 사용합니다.</p>
              <p><strong>근거 범위:</strong> ERC-20 middleware callback 순서와 실패 경계입니다.</p>
              <p><strong>말하지 않는 것:</strong> Local send receipt가 remote credit finality이거나 같은 symbol의 token이 같은 asset이라는 뜻은 아닙니다.</p>
            </CitationBlock>
          </div>

          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <h3>이 글을 읽고 답할 수 있어야 하는 질문</h3>
            <ol>
              <li>RPC가 T7 hash를 반환해도 Alice의 committed sequence가 아직 7일 수 있는 이유는 무엇입니까?</li>
              <li>Contract REVERT 뒤 Bob의 value는 되돌아가는데 Alice의 nonce와 gas 비용은 남는 이유는 무엇입니까?</li>
              <li><code>StateDB.Commit</code>, <code>tmpCtx commit()</code>, application Commit은 각각 어느 parent state에 쓰는 동작입니까?</li>
              <li>IBC send transaction 성공만으로 destination ERC-20 balance를 완료로 표시하면 안 되는 이유는 무엇입니까?</li>
            </ol>
          </div>
        </section>

        <CosmosEvmMapReturn
          currentSlug="evmos"
          closure="Evmos v20은 Ethereum transaction을 Cosmos transaction으로 감싼 뒤 전용 ante에서 fee와 sequence를 먼저 반영하고, EVM state는 중첩 cache에서 성공한 branch만 합칩니다. 최종 정본은 block Commit이며, IBC transfer는 그 뒤에 자동으로 이어지는 단계가 아니라 별도 packet·acknowledgement 생명주기입니다."
        />
      </article>

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ evmos: evmosSources }}
        projectMetas={{
          evmos: {
            id: "evmos",
            label: "Evmos v20.0.0 · eca13ef2 · Cosmos SDK fork v0.50.9",
            badgeClass: "border-violet-500 bg-violet-500/10 text-violet-700",
          },
        }}
      />
    </>
  );
}
