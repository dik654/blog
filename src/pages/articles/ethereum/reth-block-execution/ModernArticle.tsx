import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import RethBlockExecutionLocator, { RethBlockExecutionMapReturn } from "./RethBlockExecutionLocator";
import { rethBlockExecutionV281Tree } from "./fileTree";
import { RETH_BLOCK_EXECUTION_PROJECT_META, rethBlockExecutionCodeRefs } from "./modernCodeRefs";
import RethBlockExecutionFlowViz from "./viz/RethBlockExecutionFlowViz";

export default function ModernArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <RethBlockExecutionLocator current="reth-block-execution" />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">
            Reth는 부모 상태에서 블록의 거래를 어떤 순서로 실행하고, 무엇을 결과로 돌려줍니까?
          </h2>
        </div>
        <RethBlockExecutionFlowViz />
        <p className="text-lg leading-8">
          Reth는 부모 상태 위에 임시 실행 상태를 열고 활성 fork가 요구하는 사전
          변경을 먼저 적용합니다. 이어서 블록 본문의 거래를 적힌 순서대로 실행한
          뒤 사후 변경을 적용합니다. 이 과정에서 만든 영수증·요청·gas와 바뀐
          상태를 <code>BlockExecutionOutput</code>으로 돌려줍니다.
        </p>
        <p>
          여기까지는 실행 결과를 만든 단계입니다. Reth v2.8.1의
          <code>Executor::execute</code>는 output을 검증하지 않는다고 명시합니다.
          별도 검증 계층이 gas used, receipts root, logs bloom, fork별 commitment와
          state root를 header의 약속과 비교해야 블록을 받아들일 수 있습니다.
        </p>
        <p>
          이 글은 Reth v2.8.1 source commit
          <code>d763342fa185e4e90ee79dc65f6a5706168b0bcb</code>, Alloy EVM 0.39.0과
          revm-database 43.0.1을 기준으로 합니다. 화면의 두 송금과 금액은 실행
          순서를 드러내기 위한 설명용 fixture이며 네트워크 측정값이 아닙니다.
        </p>
      </section>

      <section id="input" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">입력</h2>
        <p>
          실행을 재현하려면 거래 목록만으로는 부족합니다. 어느 부모 상태에서
          시작하는지, 어떤 header와 ChainSpec이 활성 fork를 고르는지, 블록 본문에
          거래가 어떤 순서로 들어 있는지를 함께 고정해야 합니다.
        </p>
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[48rem] border-collapse text-left text-xs leading-5">
            <thead><tr className="text-muted-foreground"><th className="px-3 py-3">입력</th><th className="px-3 py-3">이 사례의 값</th><th className="px-3 py-3">결정하는 것</th></tr></thead>
            <tbody>{[
              ["부모 상태", "Alice 10 ETH · Bob 0 · Carol 0", "첫 거래가 읽을 world state"],
              ["Header", "base fee 1 gwei · beneficiary tip 0", "block 환경과 수수료 계산"],
              ["ChainSpec", "해당 시각에 활성인 fork", "system call·opcode·gas 규칙"],
              ["본문 순서", "Alice→Bob 3 ETH, Bob→Carol 2 ETH", "앞 거래 결과를 다음 거래가 읽는 순서"],
            ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <p>
          첫 송금이 먼저 실행되어야 Bob의 잔액이 3 ETH가 됩니다. 둘째 송금은 그
          결과를 읽어 Carol에게 2 ETH를 보냅니다. 두 거래를 뒤집으면 둘째 송금은
          잔액 부족으로 같은 결과를 낼 수 없습니다. 본문 순서는 계산 의미의 일부입니다.
        </p>
      </section>

      <section id="evm-config" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">EVM 환경</h2>
        <p>
          <code>EthEvmConfig</code>는 header와 ChainSpec을 읽어 block number,
          timestamp, beneficiary, base fee, chain ID와 blob parameter를
          <code>EvmEnv</code>로 만듭니다. 별도 execution context에는 parent hash,
          beacon root, ommers, withdrawals와 slot 같은 block 단위 자료를 묶습니다.
        </p>
        <p>
          환경을 먼저 고정하는 이유는 같은 bytecode와 거래도 fork가 다르면 opcode,
          gas 비용, system operation과 유효성 규칙이 달라질 수 있기 때문입니다.
          최신 fork의 기본값으로 과거 블록을 실행하면 재현이 아니라 다른 계산이 됩니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("evm-config", rethBlockExecutionCodeRefs["evm-config"])} />
          <span className="text-xs text-muted-foreground">Header·ChainSpec에서 환경과 context 구성</span>
        </div>
      </section>

      <section id="execution" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">순차 실행</h2>
        <ExplainedFormula
          question="앞 거래의 결과가 다음 거래의 입력이 되는 관계를 어떻게 나타냅니까?"
          idea="부모 상태에 사전 변경을 적용한 상태를 시작점으로 두고, 본문 순서의 거래를 하나씩 같은 활성 fork의 전이 함수에 넣습니다."
          formula={String.raw`\sigma_{i+1}=\Upsilon_f(\sigma_i,T_i,E_B)`}
          annotatedFormula={String.raw`\underbrace{\sigma_{i+1}}_{\text{다음 거래가 읽을 상태}}=\underbrace{\Upsilon_f}_{\text{활성 fork의 EVM 전이}}(\underbrace{\sigma_i}_{\text{현재 상태}},\underbrace{T_i}_{\text{본문의 i번째 거래}},\underbrace{E_B}_{\text{이 블록의 환경}})`}
          operations={[
            { expression: String.raw`\sigma_0\xrightarrow{T_0}\sigma_1`, annotation: ["Alice가 3 ETH와 수수료 0.000021 ETH를 지불", "Alice 6.999979 · Bob 3 · Carol 0"] },
            { expression: String.raw`\sigma_1\xrightarrow{T_1}\sigma_2`, annotation: ["Bob이 방금 받은 3 ETH에서 2 ETH와 수수료를 지불", "Alice 6.999979 · Bob 0.999979 · Carol 2"] },
          ]}
          terms={[
            { symbol: String.raw`\sigma_i`, name: "현재 상태", description: "i번째 거래가 읽는 account·storage·code 상태입니다." },
            { symbol: String.raw`T_i`, name: "본문의 거래", description: "블록 본문에 적힌 순서를 그대로 따르는 i번째 거래입니다." },
            { symbol: String.raw`E_B`, name: "블록 환경", description: "Header와 ChainSpec으로 만든 beneficiary·base fee·fork context입니다." },
          ]}
          assumptions={[
            "두 거래는 단순 ETH 송금이며 각각 21,000 gas를 사용합니다.",
            "Base fee는 1 gwei이고 priority tip은 0이라 각 거래의 수수료는 0.000021 ETH입니다.",
            "화면은 세 사용자 잔액만 추적하며 nonce와 fork별 system account 변화는 생략합니다.",
          ]}
          interpretation="첫 거래 뒤의 Bob 잔액 3 ETH가 둘째 거래의 입력입니다. 두 거래의 cumulative gas는 42,000이고 base fee로 소각되는 금액은 0.000042 ETH입니다. 실제 EVM 상태에는 nonce·storage·code·logs도 함께 반영됩니다."
        />
        <p>
          실제 executor도 같은 순서를 코드로 고정합니다. 사전 변경을 적용하고
          <code>transactions_recovered()</code>가 내놓는 본문 순서대로 거래를 실행한
          뒤 사후 변경을 적용합니다. 마지막에는 transition을
          <code>BundleRetention::Reverts</code>로 합쳐 되돌릴 정보를 보존합니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("execute-one", rethBlockExecutionCodeRefs["execute-one"])} />
          <span className="text-xs text-muted-foreground">Pre → 거래 본문 → Post → revert 보존</span>
        </div>
      </section>

      <section id="bundle" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">결과 묶음</h2>
        <p>
          실행 결과는 두 종류입니다. 거래별 영수증·fork별 requests·gas 사용량은
          <code>BlockExecutionResult</code>에 들어갑니다. 바뀐 account·storage·contract와
          되돌림 기록은 <code>BundleState</code>에 들어갑니다. 둘을 합친 반환값이
          <code>BlockExecutionOutput</code>입니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2">
          <div className="bg-background p-5"><strong className="text-sm">BlockExecutionResult</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">본문 순서의 receipts 2건 · requests · gas used 42,000 · blob gas</p></div>
          <div className="bg-background p-5"><strong className="text-sm">BundleState</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">Alice, Bob, Carol의 original/present 값과 storage, bytecode, reverts</p></div>
        </div>
        <p>
          여기서 <code>BundleState</code>가 있다는 말은 실행 중 database를 읽지 않는다는
          뜻이 아닙니다. revm state가 account를 bundle이나 cache에서 찾지 못하면
          backing database에서 읽습니다. Bundle은 변경분과 되돌림 증거를 모으는
          경계이지 부모 상태 전체를 복사한 snapshot이 아닙니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("execution-output", rethBlockExecutionCodeRefs["execution-output"])} />
          <span className="text-xs text-muted-foreground">Result와 BundleState의 반환 경계</span>
          <CodeViewButton onClick={() => sidebar.open("bundle-state", rethBlockExecutionCodeRefs["bundle-state"])} />
          <span className="text-xs text-muted-foreground">Original·present·revert와 DB fallback</span>
        </div>
      </section>

      <section id="validation-boundary" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">검증 경계</h2>
        <p>
          실행 함수가 결과를 돌려줬다는 사실만으로 블록이 유효해지지는 않습니다.
          Consensus 검증은 실행 결과의 <code>gas_used</code>, receipts root, logs bloom,
          Prague requests hash와 Amsterdam Block Access List hash를 header에 적힌 값과
          비교합니다. Engine 경로는 계산한 post-state root도 payload의 약속과
          대조한 뒤 canonical publish로 넘어갑니다.
        </p>
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[48rem] border-collapse text-left text-xs leading-5">
            <thead><tr className="text-muted-foreground"><th className="px-3 py-3">관찰된 결과</th><th className="px-3 py-3">의미</th><th className="px-3 py-3">블록 처리</th></tr></thead>
            <tbody>{[
              ["거래가 REVERT receipt를 냄", "EVM이 정의한 유효한 실패 결과", "gas·nonce·failed receipt를 포함해 블록은 유효할 수 있음"],
              ["거래 envelope·nonce·intrinsic gas가 consensus 규칙 위반", "실행 가능한 블록 본문이 아님", "블록 거절"],
              ["계산한 gas·receipt·request·state root가 header와 다름", "실행 결과와 블록의 약속 불일치", "블록 거절"],
            ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("post-execution-validation", rethBlockExecutionCodeRefs["post-execution-validation"])} />
          <span className="text-xs text-muted-foreground">실행 결과와 header commitment 대조</span>
        </div>
      </section>

      <section id="failure-boundaries" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실패 경계</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
          {[
            ["거래 내부 실패", "REVERT·exception", "내부 변경을 되돌리고 receipt·gas를 남김"],
            ["블록 실행 실패", "유효하지 않은 거래·provider error", "완전한 BlockExecutionOutput을 승인하지 않음"],
            ["사후 검증 실패", "root·gas·hash 불일치", "계산 결과가 있어도 블록을 거절"],
          ].map(([title, signal, effect]) => <div key={title} className="bg-background p-4"><strong className="text-sm">{title}</strong><code className="mt-2 block text-[10px] text-primary">{signal}</code><p className="mt-2 text-xs leading-5 text-muted-foreground">{effect}</p></div>)}
        </div>
        <p>
          이 글은 Reth가 한 블록의 실행 결과를 만들고 검증 경계로 넘기는 데까지
          설명합니다. Release를 바꾸거나 executor를 최적화할 때 어떤 fixture와
          장애를 재생할지는 연결된 실무 글에서 다룹니다.
        </p>
      </section>

      <section id="source" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">구현 근거</h2>
        <CitationBlock source="Reth v2.8.1 · Block execution" citeKey={1} type="code" href="https://github.com/paradigmxyz/reth/blob/d763342fa185e4e90ee79dc65f6a5706168b0bcb/crates/evm/evm/src/execute.rs">
          <p>Output 검증 없는 execute 경계와 pre·본문 순서의 transactions·post·revert merge를 확인한 고정 source입니다.</p><p><b>범위:</b> 이 함수의 반환만으로 consensus validity나 canonical commit을 증명하지 않습니다.</p>
        </CitationBlock>
        <CitationBlock source="Alloy EVM 0.39.0 · Ethereum block executor" citeKey={2} type="code" href="https://docs.rs/alloy-evm/0.39.0/alloy_evm/eth/block/struct.EthBlockExecutor.html">
          <p>Fork별 사전 system call, transaction 실행·commit과 사후 변경의 순서를 확인한 dependency snapshot입니다.</p><p><b>범위:</b> Reth의 provider·BundleState 저장 방식은 Alloy EVM 문서가 정하지 않습니다.</p>
        </CitationBlock>
        <CitationBlock source="Reth v2.8.1 · Post-execution validation" citeKey={3} type="code" href="https://github.com/paradigmxyz/reth/blob/d763342fa185e4e90ee79dc65f6a5706168b0bcb/crates/ethereum/consensus/src/validation.rs">
          <p>Gas, receipts, logs와 fork별 hash를 header commitment와 비교하는 별도 검증 경계입니다.</p><p><b>범위:</b> 대상 환경의 처리량·복구 시간이나 특정 변경의 배포 가능성을 측정하지 않습니다.</p>
        </CitationBlock>
      </section>

      <section id="self-check" className="space-y-4 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">확인 문제</h2>
        <ol className="space-y-3 pl-5 text-sm leading-7">
          <li>둘째 송금을 첫째보다 먼저 실행하면 결과가 달라지는 이유는 무엇입니까? <b>(답: 순차 실행)</b></li>
          <li><code>BundleState</code>가 있어도 backing database를 읽는 경우는 언제입니까? <b>(답: 결과 묶음)</b></li>
          <li>REVERT receipt와 header commitment 불일치는 왜 같은 실패가 아닙니까? <b>(답: 검증 경계)</b></li>
        </ol>
      </section>

      <RethBlockExecutionMapReturn current="reth-block-execution" />
      <CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={rethBlockExecutionCodeRefs} fileTrees={{ reth: rethBlockExecutionV281Tree }} projectMetas={RETH_BLOCK_EXECUTION_PROJECT_META} />
    </article>
  );
}
