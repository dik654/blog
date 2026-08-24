import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { ProofComparisonViz, RollupPipelineViz } from "./viz/ModernRollupViz";

function Lead({ children }: { children: React.ReactNode }) {
  return <p className="text-lg leading-8 text-foreground/90">{children}</p>;
}

function Term({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <dt className="text-sm font-semibold text-foreground">{name}</dt>
      <dd className="mt-2 text-sm leading-6 text-muted-foreground">{children}</dd>
    </div>
  );
}

export default function ModernRollupArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">Rollup을 처음부터</p>
          <h2 className="text-3xl font-bold tracking-tight">Rollup은 실행·데이터·정산을 나눠 확장한다</h2>
        </header>
        <Lead>
          Rollup은 트랜잭션 실행을 L1 밖에서 처리하되, 누구나 같은 L2 결과를 재현하거나 잘못된 결과를 거부할 수 있도록 필요한 데이터와 증거를 L1에 연결하는 시스템입니다. “트랜잭션을 묶어 올리니 싸다”는 설명만으로는 부족합니다. 실제 안전성은 <strong>어디에서 실행했는가</strong>, <strong>재현할 데이터가 어디에 있는가</strong>, <strong>잘못된 state transition을 어떤 규칙으로 거부하는가</strong>를 따로 봐야 이해할 수 있습니다.
        </Lead>
        <p>
          먼저 온라인 쇼핑몰을 떠올려 보겠습니다. L2 sequencer는 주문을 빠르게 받아 임시 순서를 정하고, batcher는 그 주문 목록을 L1 blob이나 calldata로 게시합니다. 다른 노드는 게시된 입력에서 똑같은 L2 block을 만들고 실행합니다. 마지막으로 L1 contract가 output claim이나 proof를 확인합니다. 한 회사 서버가 빠른 결과를 먼저 보여줄 수는 있지만, 그 서버가 사라졌을 때도 L1 데이터에서 L2를 다시 만들 수 있어야 rollup의 검증 경계가 유지됩니다.
        </p>
        <RollupPipelineViz />
        <dl className="grid gap-4 md:grid-cols-3">
          <Term name="Execution">L2 node가 transaction을 순서대로 적용해 state root와 receipt를 계산합니다. 빠른 응답과 계산 비용이 주된 관심사입니다.</Term>
          <Term name="Data availability">검증자가 실행 입력을 실제로 얻을 수 있는지 다룹니다. commitment만 보인다고 원본 데이터가 available한 것은 아닙니다.</Term>
          <Term name="Settlement">L1이 어떤 L2 결과를 받아들이고 bridge message나 withdrawal에 효력을 줄지 결정합니다. proof 방식이 이 경계에서 갈립니다.</Term>
        </dl>
        <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm leading-6">
          <strong>핵심 아이디어:</strong> optimistic rollup과 validity rollup은 둘 다 L2에서 실행할 수 있습니다. 차이는 “optimistic은 계산하고 ZK는 계산하지 않는다”가 아니라, L1이 잘못된 transition을 배제하는 증거가 <em>challenge 뒤 fault proof</em>인지 <em>사전에 검증하는 validity proof</em>인지입니다.
        </aside>
      </section>

      <section id="derivation" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">01 · 재현 경로</p>
          <h2 className="mt-2 text-2xl font-bold">Batch와 derivation은 같은 말이 아니다</h2>
        </header>
        <p>
          Batch는 여러 L2 transaction을 압축해 L1에 실어 나르는 운송 단위입니다. Derivation은 L1 block, batch data, deposit 같은 입력을 읽어 L2 execution payload를 만드는 결정적 절차입니다. 따라서 “batch를 찾았다”는 사실만으로 L2 block이 정해지지 않습니다. 어느 L1 origin을 쓰는지, channel frame을 어떤 순서로 조립하는지, timeout이나 누락된 batch를 어떻게 처리하는지까지 protocol version에 고정돼야 합니다.
        </p>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="min-w-[700px] w-full text-sm">
            <thead className="bg-muted/50 text-left"><tr><th className="p-3">입력</th><th className="p-3">derivation이 정하는 것</th><th className="p-3">실패 시 확인할 것</th></tr></thead>
            <tbody className="divide-y divide-border text-muted-foreground">
              <tr><td className="p-3 font-medium text-foreground">L1 block·receipt</td><td className="p-3">deposit과 protocol event의 순서</td><td className="p-3">L1 reorg 뒤 origin rewind</td></tr>
              <tr><td className="p-3 font-medium text-foreground">batch frames</td><td className="p-3">channel 재조립·decompression·batch validity</td><td className="p-3">누락·중복·timeout·fork version</td></tr>
              <tr><td className="p-3 font-medium text-foreground">system configuration</td><td className="p-3">timestamp·fee·block attributes</td><td className="p-3">activation height와 version pin</td></tr>
            </tbody>
          </table>
        </div>
        <h3 className="text-xl font-semibold">Unsafe·safe·finalized는 한 종류의 finality가 아니다</h3>
        <p>
          Sequencer에게 직접 받은 L2 head는 빠르지만 아직 L1 data로 확인하지 못했으므로 <strong>unsafe</strong>입니다. 필요한 batch가 L1 canonical chain에 포함되어 derivation으로 재현되면 <strong>safe</strong>가 됩니다. 그 L1 origin이 L1 consensus에서 finalized되면 L2도 그 기준으로 <strong>finalized</strong>라고 표시할 수 있습니다. 이 이름은 output claim의 challenge period가 끝나 bridge withdrawal이 정산되는 시점과 다릅니다. UI에서 “finalized” 하나만 보여 주면 사용자는 L1 reorg 위험과 withdrawal dispute 위험을 구분하지 못합니다.
        </p>
        <div id="paper-op-derivation">
          <CitationBlock source="OP Stack Specification · L2 Chain Derivation" citeKey={1} href="https://specs.optimism.io/protocol/derivation.html">
            <p><strong>문제:</strong> 서로 다른 node가 L1 데이터에서 동일한 L2 chain을 재현해야 합니다.</p>
            <p><strong>기여:</strong> retrieval부터 frame queue, channel, batch, payload attributes, Engine API까지 단계와 reset 규칙을 규정합니다.</p>
            <p><strong>전제와 범위:</strong> 대상 OP Stack fork와 L1 canonical view를 고정한 derivation 규칙의 근거입니다. 모든 rollup이 같은 pipeline을 쓰거나 sequencer가 항상 live하다는 주장은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="optimistic" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">02 · Optimistic 경로</p>
          <h2 className="mt-2 text-2xl font-bold">출력을 먼저 제안하고, 이견이 있을 때 한 step까지 좁힌다</h2>
        </header>
        <p>
          Optimistic rollup은 proposer가 낸 output root를 무조건 믿지 않습니다. 일정한 challenge window 안에 이견이 없으면 받아들이는 낙관적 절차를 사용합니다. Challenger는 L1에 게시된 입력과 합의된 이전 상태에서 실행을 다시 해보고, claim이 다르면 dispute를 시작합니다. 이때 challenger가 데이터를 구할 수 없다면 잘못된 실행 위치를 제시할 수 없으므로 data availability는 fault proof의 선행 조건입니다.
        </p>
        <ol className="space-y-3 pl-5 text-sm leading-6">
          <li><strong>Claim:</strong> proposer가 특정 L2 block의 state root를 주장합니다.</li>
          <li><strong>Challenge:</strong> challenger가 같은 입력을 재실행해 서로 다른 결과를 제시합니다.</li>
          <li><strong>Bisection:</strong> 긴 execution trace를 절반씩 나눠 처음 불일치하는 구간을 찾습니다.</li>
          <li><strong>One-step verification:</strong> 마지막 한 instruction 또는 작은 transition을 L1 verifier가 판정합니다.</li>
          <li><strong>Resolution:</strong> 잘못된 claim을 제거하고 bond·game outcome·withdrawal 경로를 정산합니다.</li>
        </ol>
        <ExplainedFormula
          question="N개의 실행 step에서 처음 다른 한 step을 찾는 데 몇 번의 이분 탐색이 필요한가?"
          idea={<>매 round마다 후보 구간을 절반으로 줄이므로, 2를 몇 번 곱해야 N에 도달하는지를 역으로 계산합니다. N=1,024라면 1,024→512→…→1이 되어 10 rounds입니다.</>}
          formula={String.raw`r = \lceil \log_2 N \rceil,\qquad N=1024 \Rightarrow r=10`}
          annotatedFormula={String.raw`r = \underbrace{\lceil \log_2 N \rceil,\qquad N=1024 \Rightarrow r=10}_{\text{로그 비용 변환}}`}
          operations={[
            { expression: String.raw`\lceil \log_2 N \rceil,\qquad N=1024 \Rightarrow r=10`, annotation: ["확률이나 곱셈 규모를 더할 수 있는 log 비용으로 바꿉니다.","매 round마다"] },
          ]}
          terms={[
            { symbol: "N", name: "후보 step 수", description: "Dispute가 시작될 때 남아 있는 execution step의 개수입니다." },
            { symbol: "r", name: "Bisection rounds", description: "한 step 구간에 도달하기 위한 최대 상호작용 횟수입니다." },
            { symbol: "\\lceil\\cdot\\rceil", name: "Ceiling", description: "Fractional round를 다음 정수로 올려 마지막 후보까지 포함합니다." },
          ]}
          assumptions={["매 round가 유효한 midpoint commitment로 구간을 거의 절반씩 줄입니다.", "On-chain transaction latency·timeout·bond 비용은 round 수 식과 별도로 계산합니다.", "한 step verifier와 trace commitment가 올바르게 구현됐다고 가정합니다."]}
          interpretation="Trace가 백만 step이어도 dispute interaction은 약 20번으로 줄일 수 있습니다. 다만 이는 challenge가 즉시 끝난다는 뜻이 아니며, 각 round의 L1 포함 시간과 timeout이 실제 withdrawal latency를 결정합니다."
        />
        <div id="paper-op-fault-proof">
          <CitationBlock source="OP Stack Specification · Fault Proof" citeKey={2} href="https://specs.optimism.io/fault-proof/index.html">
            <p><strong>문제:</strong> L1이 L2 전체 실행을 반복하지 않고 잘못된 output claim을 판정해야 합니다.</p>
            <p><strong>기여:</strong> agreed pre-state, disputed post-state, L1 data와 preimage oracle로 fault proof program을 재현하는 경계를 정의합니다.</p>
            <p><strong>전제와 범위:</strong> 지정된 VM·preimage·game implementation을 고정한 OP Stack fault-proof 근거이며, 모든 optimistic rollup의 game이 동일하거나 permissionless participation이 자동 보장된다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-optimistic-rollup">
          <CitationBlock source="Ethereum.org · Optimistic rollups" citeKey={3} href="https://ethereum.org/developers/docs/scaling/optimistic-rollups/">
            <p><strong>문제:</strong> L1 밖 실행을 하면서 Ethereum에서 결과를 정산하는 일반 구조를 설명합니다.</p>
            <p><strong>기여:</strong> batch data, state commitment, challenge period와 fault proof가 연결되는 operator-independent overview를 제공합니다.</p>
            <p><strong>전제와 범위:</strong> protocol 개요의 근거이며 특정 rollup의 정확한 finalization 시간·fee·proof game 안전성을 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="validity" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">03 · Validity 경로</p>
          <h2 className="mt-2 text-2xl font-bold">전체 실행 대신 “이 transition이 맞다”는 짧은 proof를 검증한다</h2>
        </header>
        <p>
          Validity rollup에서도 operator는 transaction을 실행합니다. 차이는 새 state root를 정산할 때 proving system이 “공개 입력으로 주어진 이전 root와 transaction commitment를 사용해 protocol program을 실행하면 이 새 root가 나온다”는 proof를 만들고, L1 verifier가 그 proof를 확인한다는 점입니다. 그래서 invalid transition은 challenge를 기다리지 않고 verifier 단계에서 거부할 수 있습니다.
        </p>
        <p>
          여기서 자주 섞이는 세 가지를 분리해야 합니다. <strong>Validity</strong>는 계산이 맞다는 성질이고, <strong>zero knowledge</strong>는 witness의 일부를 숨기는 성질이며, <strong>data availability</strong>는 사용자가 transaction data를 얻을 수 있다는 성질입니다. Validity proof가 있다고 privacy가 자동으로 생기지 않으며, proof만 L1에 올리고 원본 데이터를 숨기면 사용자가 자신의 상태를 재구성하지 못할 수 있습니다.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <Term name="Public inputs">이전 state root, 새 state root, batch 또는 data commitment처럼 L1 verifier가 직접 보는 값입니다.</Term>
          <Term name="Witness">transaction과 execution trace처럼 prover가 계산에 쓰는 상세 입력입니다. 어떤 값을 공개할지는 회로 설계가 정합니다.</Term>
          <Term name="Verifier contract">Proof가 지정된 program과 public inputs에 유효한지 확인합니다. 데이터 게시 정책이나 sequencer censorship은 별도 경계입니다.</Term>
        </div>
      </section>

      <section id="comparison" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">04 · 선택과 운영</p>
          <h2 className="mt-2 text-2xl font-bold">Proof 이름보다 실패 경로를 같은 축으로 비교한다</h2>
        </header>
        <ProofComparisonViz />
        <p>
          Sequencer censorship은 사용자의 transaction이 빠른 경로에 들어가지 않는 문제이며, invalid state root는 실행 정합성 문제입니다. Blob withholding은 검증 입력을 구하지 못하는 DA 문제이고, L1 reorg는 derivation origin이 바뀌는 consensus 문제입니다. 서로 다른 문제를 “proof가 해결한다”는 한 문장으로 합치면 운영 대응도 잘못됩니다. Forced inclusion, DA fallback, claim dispute, derivation reset은 각각 다른 runbook을 가져야 합니다.
        </p>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="min-w-[760px] w-full text-sm">
            <thead className="bg-muted/50 text-left"><tr><th className="p-3">사건</th><th className="p-3">깨지는 경계</th><th className="p-3">관찰·대응</th></tr></thead>
            <tbody className="divide-y divide-border text-muted-foreground">
              <tr><td className="p-3 text-foreground">Sequencer가 transaction을 빼놓음</td><td className="p-3">liveness·censorship resistance</td><td className="p-3">L1 forced path, inclusion SLA, fee·delay receipt</td></tr>
              <tr><td className="p-3 text-foreground">Batch data를 얻지 못함</td><td className="p-3">data availability</td><td className="p-3">sidecar/provider diversity, reconstruction outcome</td></tr>
              <tr><td className="p-3 text-foreground">잘못된 state root</td><td className="p-3">execution validity</td><td className="p-3">fault game 또는 validity verifier outcome</td></tr>
              <tr><td className="p-3 text-foreground">L1 origin reorg</td><td className="p-3">derivation canonical input</td><td className="p-3">safe head rewind, channel purge, deterministic replay</td></tr>
            </tbody>
          </table>
        </div>
        <h3 className="text-xl font-semibold">배포 전에 풀어야 하는 10가지 질문</h3>
        <p>
          이 글의 역검사는 기초 6개와 심화 4개로 구성합니다. 기초에서는 execution·DA·settlement 분리, deterministic derivation, unsafe/safe/finalized, optimistic fault proof, 1,024-step bisection, validity proof의 공개 입력을 설명할 수 있어야 합니다. 심화에서는 네 실패 사건의 owner mapping, 두 proof 계열의 동일 축 비교, L1 reorg fixture, pinned spec와 adversarial paired release gate를 설계해야 합니다. 답을 만들 때 외부 선수 지식을 요구하지 않도록 필요한 정의와 수치 예시는 모두 위 섹션에 배치했습니다.
        </p>
        <aside className="rounded-lg border border-border bg-card p-5 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">Release gate:</strong> 같은 L1/L2 fork version, batch fixture와 이전 state를 고정한 뒤 정상 실행뿐 아니라 누락 frame, 중복 batch, L1 reorg, sequencer halt, invalid claim/proof, challenge timeout을 양쪽 구현에 주입합니다. Derived block·receipt·root와 typed failure가 같아진 뒤에만 p95 derivation latency, proof cost, withdrawal latency를 비교하고 canary·rollback 기준을 정합니다.
        </aside>
      </section>
    </article>
  );
}
