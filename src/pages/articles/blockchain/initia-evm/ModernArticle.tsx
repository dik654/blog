import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { MiniEvmStateViz, MiniEvmTransactionViz } from "./viz/ModernInitiaEvmViz";

export default function ModernInitiaEvmArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3">
        <p className="text-sm font-semibold text-primary">Initia MiniEVM · Ethereum compatibility inside a Cosmos app</p>
        <h2 className="text-3xl font-bold tracking-tight">MiniEVM은 별도 Ethereum execution node를 옆에 두는 구조가 아니라, Ethereum transaction을 Cosmos SDK app의 한 실행 경로로 받아들인다</h2>
      </header>
      <p className="text-lg leading-8 text-foreground/90">Alice가 Bob에게 10을 보내는 signed Ethereum transaction을 생각해 보겠습니다. JSON-RPC는 raw bytes를 받고, MiniEVM은 이를 Cosmos SDK transaction 표현으로 운반합니다. Ante handler는 signer와 sequence를 확인한 뒤 <code>MsgCall</code> 또는 contract creation message를 실행하고, <code>x/evm</code> keeper가 EVM을 구동해 Cosmos app state의 다음 후보를 만듭니다.</p>
      <p>Ethereum 지갑과 RPC 형식을 지원한다는 말은 Ethereum mainnet의 node architecture를 그대로 복제한다는 뜻이 아닙니다. MiniEVM에는 별도 consensus client와 Engine API handoff가 없으며, block ordering·Ante·module routing·state commit은 Cosmos app lifecycle 안에서 일어납니다. 이 글은 그 경계만 소유하고, EVM opcode·gas·journal 자체는 <a className="text-primary underline underline-offset-4" href="/blockchain/evm-fundamentals">EVM fundamentals</a>에서 재사용합니다.</p>
      <MiniEvmTransactionViz />
      <ContentBoundary article="initia-evm" />
      <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm leading-6"><strong>완료 상태를 먼저 분리합니다.</strong> RPC가 hash를 반환한 것은 요청이 전달되었다는 뜻이고, EVM success는 한 execution frame의 결과이며, durable Cosmos state는 block commit 뒤에야 생깁니다.</aside>
    </section>

    <section id="tx-envelope" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · transaction envelope and sequence</p><h2 className="mt-2 text-2xl font-bold">형식은 바꾸되 sender·nonce·chain·gas·data·value의 의미는 보존한다</h2></header>
      <p>Pinned MiniEVM source의 <code>ConvertEthereumTxToCosmosTx</code>와 역변환 함수는 Ethereum transaction과 Cosmos SDK transaction 사이의 경계를 드러냅니다. Raw transaction의 signature에서 sender를 복원하고, chain ID·nonce·gas·destination·value·calldata를 SDK message와 auth 정보에 담아 Cosmos pipeline을 통과시킵니다. 변환이 성공했다는 사실만으로 mempool admission이나 execution success가 보장되지는 않습니다.</p>
      <p>
            가장 놓치기 쉬운 부분은 sequence입니다. Cosmos Ante 경로가 account sequence를 올렸는데 EVM create/call 경로까지 같은 증가를
            독립적으로 적용하면 nonce가 한 요청에 두 번 증가합니다. Pinned source는 context에 Ante의 sequence 증가 여부를 기록하고 message
            server가 이를 조정합니다. 시작 sequence가 7이면 성공 뒤 8이어야 하며 9가 되면 double increment 버그입니다.
          </p>
      <ExplainedFormula
        question="Ethereum↔Cosmos 변환과 실행 revision을 언제 release해도 되는가?"
        idea={<>한 field만 비교하지 않고 transaction의 왕복 의미, sender, sequence 증가와 candidate state root를 함께 대조합니다. 이 식은 protocol theorem이 아니라 versioned release gate입니다.</>}
        formula={String.raw`\begin{aligned}R={}&[tx_{eth}=roundtrip(tx_{sdk})]\\&\land[sender'=sender]\\&\land[seq_{after}=seq_{before}+1]\\&\land[root_{candidate}=root_{oracle}]\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}R={}&[tx_{eth}=roundtrip(tx_{sdk})]\\&\land[sender'=\underbrace{sender]}_{\text{판정 조건 결합}}\\&\land[seq_{after}=\underbrace{seq_{before}+1]}_{\text{판정 조건 결합}}\\&\land[root_{candidate}=\underbrace{root_{oracle}]}_{\text{판정 조건 결합}}\end{aligned}`}
        operations={[
          { expression: String.raw`sender]`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","한 field만 비교하지 않고 transaction의 왕복","의미, sender, sequence 증가와 candidate","state root를 함께 대조합니다."] },
          { expression: String.raw`seq_{before}+1]`, annotation: ["account sequence이(가) 식의 결과에 기여하는","방식을 계산합니다.","한 field만 비교하지 않고 transaction의 왕복","의미, sender, sequence 증가와 candidate"] },
          { expression: String.raw`root_{oracle}]`, annotation: ["candidate state root이(가) 식의 결과에","기여하는 방식을 계산합니다.","한 field만 비교하지 않고 transaction의 왕복","의미, sender, sequence 증가와 candidate"] },
        ]}
        terms={[
          { symbol: "tx_eth", name: "Ethereum transaction", description: "서명·chain ID·nonce·gas·to·value·data를 포함한 기준 입력입니다." },
          { symbol: "roundtrip", name: "왕복 변환", description: "Ethereum에서 Cosmos envelope로 갔다가 다시 복원한 결과입니다." },
          { symbol: "seq", name: "account sequence", description: "Replay를 막는 계정별 순서 번호입니다." },
          { symbol: "root", name: "candidate state root", description: "같은 pinned revision과 block context에서 계산한 실행 결과입니다." },
        ]}
        assumptions={[
          "MiniEVM v1.2.19, chain ID, signer rules와 Cosmos SDK dependencies를 함께 고정합니다.",
          "Roundtrip 비교는 encoding bytes가 아니라 canonical transaction fields의 의미를 비교합니다.",
          "Oracle과 candidate에 같은 pre-state·block context·gas configuration을 줍니다.",
          "R=true는 consensus finality나 external RPC availability를 증명하지 않습니다.",
        ]}
        interpretation="Sequence 7에서 시작한 Alice의 요청이 8로 끝나고 transaction fields와 state root도 같으면 통과합니다. 9라면 Ante와 EVM 경로가 둘 다 증가시킨 것이므로 나머지가 같아도 release하지 않습니다."
      />
      <div id="paper-minievm-tx"><CitationBlock source="initia-labs/minievm · x/evm v1.2.19" citeKey={1} type="code" href="https://github.com/initia-labs/minievm/tree/27e60c548f3e2868f6e6b3cf6456fc9289ce7950/x/evm"><p><strong>문제:</strong> Ethereum transaction 형식을 Cosmos SDK transaction lifecycle 안에서 실행하면서 sender와 sequence 의미를 보존해야 합니다.</p><p><strong>기여:</strong> 양방향 transaction 변환, Ethereum transaction 판별, MsgCreate·MsgCreate2·MsgCall과 sequence reconciliation 경로를 구현합니다.</p><p><strong>전제:</strong> Tag v1.2.19의 commit 27e60c5와 matching app·SDK dependencies, chain configuration을 고정합니다.</p><p><strong>근거 범위:</strong> 해당 snapshot의 x/evm transaction 변환과 message execution source에 한정합니다.</p><p><strong>말하지 않는 것:</strong> 모든 Ethereum transaction type·RPC method·fork behavior가 Ethereum mainnet과 동일하거나 transaction hash 반환이 commit을 보장한다는 뜻은 아닙니다.</p></CitationBlock></div>
    </section>

    <section id="state-bridge" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · StateDB, token and precompile boundary</p><h2 className="mt-2 text-2xl font-bold">EVM이 보는 StateDB를 Cosmos collections와 transient overlay 위에 구현한다</h2></header>
      <p>EVM은 <code>vm.StateDB</code> interface를 통해 account balance·nonce·code·storage·logs·refund와 snapshots를 읽고 씁니다. MiniEVM의 pinned implementation은 commit 가능한 <code>vmStore</code>와 execution 동안만 쓰는 transient memory stores를 나눕니다. Snapshot은 call frame 시작점의 journal 위치를 기억하고, REVERT나 exception이면 그 뒤의 후보 효과만 되돌립니다. 따라서 storage write가 함수 중간에 보였다는 사실은 durable Cosmos commit을 뜻하지 않습니다.</p>
      <MiniEvmStateViz />
      <p>Balance도 단순히 두 ledger에 복사해 두는 방식이 아닙니다. StateDB의 balance 변경은 fee-denom ERC-20 경로의 mint·burn을 호출하고, balance read는 ERC-20 <code>balanceOf</code>를 사용합니다. 이 bridge는 EVM account balance와 app token representation의 연결 규칙을 제공하지만 token 가격, 외부 bridge solvency 또는 다른 denomination의 자동 호환을 보장하지 않습니다.</p>
      <p>Precompile은 EVM address 호출을 Cosmos keeper capability에 연결하는 좁은 adapter입니다. ABI decoding, gas admission, caller authority와 keeper error를 모두 통과해야 하며, EVM return success와 Cosmos block commit은 별도 영수증으로 남겨야 합니다. Precompile의 일반 ABI·gas 원리는 <a className="text-primary underline underline-offset-4" href="/blockchain/evm-advanced#precompile">EVM precompile 경계</a>를 재사용합니다.</p>
      <div id="paper-minievm-state"><CitationBlock source="MiniEVM StateDB · v1.2.19 statedb.go" citeKey={2} type="code" href="https://github.com/initia-labs/minievm/blob/27e60c548f3e2868f6e6b3cf6456fc9289ce7950/x/evm/state/statedb.go"><p><strong>문제:</strong> Geth VM이 기대하는 StateDB semantics를 Cosmos-backed state와 transaction-local rollback 위에 제공해야 합니다.</p><p><strong>기여:</strong> Persistent vmStore, transient VM stores, snapshot stack, logs·refund·access list와 fee-denom ERC-20 balance bridge를 구현합니다.</p><p><strong>전제:</strong> v1.2.19의 exact StateDB source와 함께 사용되는 keeper·ERC-20 implementation, app commit semantics를 고정합니다.</p><p><strong>근거 범위:</strong> 해당 file과 pinned repository가 구현한 StateDB storage·snapshot·balance integration에 한정합니다.</p><p><strong>말하지 않는 것:</strong> Transient write가 durable commit이라는 뜻도, 모든 Cosmos module mutation이 EVM snapshot 하나로 자동 rollback된다는 뜻도 아닙니다.</p></CitationBlock></div>
    </section>

    <section id="release" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · failure, replay and release</p><h2 className="mt-2 text-2xl font-bold">같은 transaction을 실패 지점별로 재생해 sequence·state·receipt가 한 번만 바뀌는지 확인한다</h2></header>
      <p>
            Negative fixture는 signature 불일치, wrong chain ID, stale sequence, Ante 통과 뒤 EVM REVERT, token
            bridge 중 error와 block commit 전 crash를 따로 주입합니다. 재시도는 같은 transaction identity를 사용하며 이미 commit된
            sequence나 balance effect를 다시 적용해서는 안 됩니다. CheckTx·recheck를 통과한 사실과 Deliver/FinalizeBlock에서 상태가 바뀐
            사실도 분리해 기록합니다.
          </p>
      <p>Release artifact에는 MiniEVM commit, Cosmos SDK dependency, chain config, enabled precompiles와 fee denomination을 함께 pin합니다. Candidate와 oracle에서 transaction fields, sender, sequence, status, gas used, logs, token balance, app hash를 비교하고 한 항목이라도 다르면 이전 bundle로 rollback합니다. 이미 client에게 durable success를 알린 뒤에는 state를 조용히 되감지 않고 idempotent replay나 명시적 보상 절차를 사용합니다.</p>
      <div id="paper-minievm-compat"><CitationBlock source="Initia Docs · MiniEVM EVM compatibility and changes" citeKey={3} href="https://docs.initia.xyz/home/core-concepts/initia-and-rollups/rollups/vms/minievm/evm-compatibility-and-changes"><p><strong>문제:</strong> Ethereum tooling을 사용하는 개발자가 MiniEVM과 standard EVM 사이의 지원 범위와 차이를 알아야 합니다.</p><p><strong>기여:</strong> MiniEVM의 current compatibility surface와 transaction·RPC 관련 차이를 공식 문서로 정리합니다.</p><p><strong>전제:</strong> 2026-08-14에 확인한 공식 문서와 배포 chain의 exact software·configuration을 함께 확인합니다.</p><p><strong>근거 범위:</strong> 문서가 명시한 현재 compatibility와 known differences에 한정합니다.</p><p><strong>말하지 않는 것:</strong> 문서의 current 목록이 future releases에도 고정되거나 모든 wallet·tool의 완전한 동작을 보장한다는 뜻은 아닙니다.</p></CitationBlock></div>
      <h3 className="text-xl font-semibold">이 글만으로 확인할 10가지</h3>
      <p>기초 6문제는 MiniEVM의 node 경계, transaction envelope, sequence, StateDB 수명, token bridge와 precompile commit 경계를 묻습니다. 심화 4문제는 왕복 parity, crash·recheck replay, REVERT atomicity와 versioned rollback gate를 직접 설계하게 합니다.</p>
    </section>
  </article>;
}
