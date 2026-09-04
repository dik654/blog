import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ModernGiwaNodeViz from "./viz/ModernGiwaNodeViz";

const GIWA_DOCS = "https://docs.giwa.io/giwa-chain/en";
const GIWA_DIFFS = "https://docs.giwa.io/giwa-chain/en/network-information/diffs-ethereum-giwa";
const OP_DERIVATION = "https://specs.optimism.io/protocol/derivation.html";
const GIWA_NODE = "https://github.com/giwa-io/node/tree/8cabd0d51e7ed2c2200f9c82e26a9c5ec7301722";

export default function ModernGiwaChainArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">
            GIWA Sepolia transaction T가 block 120에 보였을 때
          </p>
          <h2 className="text-3xl font-bold tracking-tight">
            GIWA node의 핵심은 “OP Stack 사용”이 아니라 어느 L1 input을 어떤 binary와 config로 재현했는지다
          </h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          GIWA는 공식 문서상 OP Stack 기반 Ethereum Layer 2입니다. 사용자는 sequencer가 만든 빠른 block을 보지만 verifier node는 L1
          data와 rollup config를 읽어 같은 L2 payload를 derivation하고 execution client에서 다시 실행합니다. process가 떠 있고 RPC가
          응답한다는 사실만으로는 같은 chain을 검증하는 중이라고 판단할 수 없습니다.
        </p>
        <p>
          이 글은 2026-08-14에 공개된 GIWA Sepolia와 pinned node v0.6.0을 고정 예제로 사용합니다. 공식 연결 문서에는 chain ID 91342의
          testnet이 올라와 있고 Mainnet은 개발 중이라고 적혀 있습니다. 따라서 1-second block과 60,000,000 gas limit, endpoint와
          contract addresses 같은 current profile을 미래 Mainnet의 영구 약속으로 읽지 않습니다.
        </p>
        <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm leading-6">
          <strong>핵심 아이디어:</strong> <em>network identity → L1 derivation → Engine execution
          → unsafe/safe/finalized policy → canary·rollback</em>을 한 lineage로 기록합니다.
        </aside>
        <ModernGiwaNodeViz />
        <ContentBoundary article="giwa-chain" />
        <div id="paper-giwa-docs">
          <CitationBlock citeKey={1} source="GIWA Documentation · Introducing GIWA" href={GIWA_DOCS}>
            <p><strong>문제:</strong> GIWA의 public identity와 Layer 2 목표를 설명해야 합니다.</p>
            <p><strong>핵심 기여:</strong> OP Stack 기반 EVM-compatible L2와 current product characteristics를 설명합니다.</p>
            <p><strong>중요 가정:</strong> 2026-08-14 current docs와 실제 network metadata를 함께 확인합니다.</p>
            <p><strong>근거 범위:</strong> GIWA가 공개한 high-level network description입니다.</p>
            <p><strong>일반화 금지:</strong> Decentralization 정도, Mainnet availability, fixed throughput·fee·security를 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="node-envelope" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">01 · Node generation</p>
          <h2 className="mt-2 text-2xl font-bold">
            Genesis·rollup config·L1 endpoints와 op-node·op-reth를 하나의 artifact로 고정한다
          </h2>
        </header>
        <p>
          Verifier node에는 서로 다른 두 계산 책임이 있습니다. <strong>op-node</strong>는 L1
          execution RPC와 beacon data, rollup config를 이용해 batches를 해석하고 L2 payload와
          head를 정합니다. <strong>op-reth</strong>는 Engine API로 받은 payload를 EVM에서
          실행하고 state root와 receipts를 계산하며 JSON-RPC state를 제공합니다.
        </p>
        <p>
          Pinned v0.6.0 repository의 compose는 op-node v1.19.1과 op-reth v2.3.3을 빌드하고 두 service가 shared 32-byte
          JWT secret으로 Engine endpoint에 접근하게 합니다. 과거 레거시 글의 “geth/reth 중 선택”은 현재 source와 맞지 않습니다. Pinned
          README에는 Karst hardfork 이후 op-geth가 GIWA를 따라가지 못해 더 이상 지원하지 않는다고 적혀 있습니다.
        </p>
        <ExplainedFormula
          question="두 processes가 같은 GIWA network generation을 검증한다고 언제 말할까?"
          idea={<>Chain identity, rollup rules, L1 origin과 binary/config revisions를 canonical manifest에 넣어 digest를 비교합니다.</>}
          formula={"G=H(\\mathrm{chainID}\\|\\mathrm{genesis}\\|\\mathrm{rollupCfg}\\|\\mathrm{L1}\\|v_{node}\\|v_{reth})"}
          annotatedFormula={String.raw`G=\underbrace{H(\mathrm{chainID}\|\mathrm{genesis}\|\mathrm{rollupCfg}\|\mathrm{L1}\|v_{node}\|v_{reth})}_{\text{Rollup config 계산}}`}
          operations={[
            { expression: String.raw`H(\mathrm{chainID}\|\mathrm{genesis}\|\mathrm{rollupCfg}\|\mathrm{L1}\|v_{node}\|v_{reth})`, annotation: ["Rollup config이(가) 식의 결과에 기여하는 방식을","계산합니다.","Chain identity, rollup rules, L1","origin과 binary/config revisions를"] },
          ]}
          terms={[
            { symbol: "G", name: "Network-generation digest", description: "Canary·rollback에서 비교할 node identity입니다." },
            { symbol: "H", name: "Hash", description: "Canonical field encoding을 digest하는 검토된 hash입니다." },
            { symbol: "\\mathrm{chainID}", name: "Chain ID", description: "고정 예제 GIWA Sepolia의 91342입니다." },
            { symbol: "\\mathrm{genesis}", name: "Execution genesis", description: "op-reth가 시작할 L2 chain state와 parameters입니다." },
            { symbol: "\\mathrm{rollupCfg}", name: "Rollup config", description: "op-node derivation과 activation schedule을 정합니다." },
            { symbol: "\\mathrm{L1}", name: "L1 endpoints/profile", description: "Sepolia execution·beacon source와 trust settings입니다." },
            { symbol: "v_{node},v_{reth}", name: "Binary revisions", description: "op-node와 op-reth source/image versions입니다." },
          ]}
          assumptions={[
            "Fields의 순서·length·encoding과 domain tag를 canonical하게 고정합니다.",
            "Digest가 같아도 endpoint가 honest·available하거나 binaries가 bug-free라는 뜻은 아닙니다.",
          ]}
          interpretation="Genesis만 같고 rollup config나 activation schedule이 다르면 G가 달라야 합니다. Process health나 같은 chain name은 이 identity를 대신하지 못합니다."
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-lg border border-border p-4">
            <h3 className="font-semibold">Engine JWT가 하는 일</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              op-node가 private Engine endpoint를 호출할 권한을 인증합니다. Payload validity와 L1 RPC honesty, chain
              finality를 증명하는 것은 아닙니다.
            </p>
          </article>
          <article className="rounded-lg border border-border p-4">
            <h3 className="font-semibold">Sync mode의 비용</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Pinned source에서는 snap과 archive, consensus-driven sync를 구분합니다. Historical retention과 startup
              time, disk, trust assumptions를 같은 profile에서 측정합니다.
            </p>
          </article>
        </div>
        <p>
          <strong>Failure counterexample:</strong> Sepolia execution genesis와 다른 rollup config를
          섞거나 rate-limited public L1 endpoint를 production dependency로 쓰면 service가
          실행돼도 payload derivation이 멈추거나 다른 generation을 읽을 수 있습니다. JWT를
          회전하면서 op-node·op-reth 중 한쪽만 갱신해도 Engine handoff가 중단됩니다.
        </p>
        <div id="paper-giwa-node-source">
          <CitationBlock type="code" citeKey={2} source="giwa-io/node v0.6.0 · commit 8cabd0d5" href={GIWA_NODE}>
            <p><strong>문제:</strong> GIWA verifier node의 concrete services·versions·configuration을 재현해야 합니다.</p>
            <p><strong>핵심 기여:</strong> Docker Compose, op-node v1.19.1, op-reth v2.3.3, JWT, Sepolia env와 sync profiles를 제공합니다.</p>
            <p><strong>중요 가정:</strong> Commit, build toolchain/images, env files와 external L1 endpoints를 고정합니다.</p>
            <p><strong>근거 범위:</strong> Pinned v0.6.0 public node bundle의 implementation surface입니다.</p>
            <p><strong>일반화 금지:</strong> Mainnet readiness, future compatibility, endpoint availability나 fixed hardware capacity를 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="derivation-heads" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">02 · Derivation and heads</p>
          <h2 className="mt-2 text-2xl font-bold">
            Sequencer block을 L1 batches에서 다시 만들고 unsafe·safe·finalized ancestry를 따로 유지한다
          </h2>
        </header>
        <p>
          Sequencer가 transaction T를 L2 block 120에 넣으면 사용자는 먼저 unsafe head에서 결과를 볼 수 있습니다. op-node는 이후 L1
          blocks와 receipts, batch frames/channels를 rollup rules로 해석해 payloads를 재현합니다. 해당 batch가 canonical L1
          input에서 derivation되면 safe head가 전진하고 그 L1 origin이 finalized되면 finalized head가 따라갑니다. L1 reorg가 나면
          origin까지 되감아 batches를 다시 읽습니다.
        </p>
        <ExplainedFormula
          question="같은 L1 view에서 같은 safe payload를 만들려면 무엇을 고정해야 할까?"
          idea={<>Ordered canonical L1 inputs, batch bytes, system configuration과 activated derivation rules를 deterministic function의 입력으로 둡니다.</>}
          formula={"P_h=\\operatorname{Derive}_v(L1_{o:k},B_{o:k},C),\\qquad S_h=\\operatorname{Exec}_v(S_{h-1},P_h)"}
          annotatedFormula={String.raw`P_h=\underbrace{\operatorname{Derive}_v(L1_{o:k},B_{o:k},C),\qquad S_h=\operatorname{Exec}_v(S_{h-1},P_h)}_{\text{Canonical L1 inputs 계산}}`}
          operations={[
            { expression: String.raw`\operatorname{Derive}_v(L1_{o:k},B_{o:k},C),\qquad S_h=\operatorname{Exec}_v(S_{h-1},P_h)`, annotation: ["Canonical L1 inputs이(가) 식의 결과에","기여하는 방식을 계산합니다.","Ordered canonical L1 inputs, batch","bytes, system configuration과"] },
          ]}
          terms={[
            { symbol: "P_h", name: "Derived L2 payload", description: "Height h에서 op-node가 Engine에 제안할 payload입니다." },
            { symbol: "L1_{o:k}", name: "Canonical L1 inputs", description: "Origin o부터 k까지의 ordered blocks·receipts·beacon data입니다." },
            { symbol: "B_{o:k}", name: "Batch data", description: "Channels·frames에서 복원한 ordered L2 transaction inputs입니다." },
            { symbol: "C", name: "Rollup configuration", description: "Genesis, block time, addresses와 activation schedule입니다." },
            { symbol: "v", name: "Protocol revision", description: "해당 origin에서 활성화된 derivation·execution rules입니다." },
            { symbol: "S_h", name: "Executed state", description: "op-reth가 parent state와 payload를 실행해 만든 state입니다." },
          ]}
          assumptions={[
            "L1 canonical view, input ordering, config와 protocol activation이 두 implementations에서 같습니다.",
            "Data가 available하고 decoder·EVM execution이 deterministic하다고 둡니다.",
          ]}
          interpretation="같은 sequencer response만으로 safe parity가 성립하지 않습니다. L1 data에서 재현한 P_h와 executed state root가 같아야 하며 이는 sequencer liveness를 보장하지 않습니다."
        />
        <ExplainedFormula
          question="Unsafe 120·safe 118·finalized 115의 관계를 어떻게 읽을까?"
          idea={<>세 숫자를 하나의 finality 점수가 아니라 같은 canonical ancestry 위의 서로 다른 confirmation cursors로 둡니다.</>}
          formula={"H_{\\mathrm{finalized}}\\preceq H_{\\mathrm{safe}}\\preceq H_{\\mathrm{unsafe}},\\qquad(115\\preceq118\\preceq120)"}
          annotatedFormula={String.raw`\underbrace{H_{\mathrm{finalized}}\preceq H_{\mathrm{safe}}\preceq H_{\mathrm{unsafe}},\qquad(115\preceq118\preceq120)}_{\text{Finalized head 계산}}`}
          operations={[
            { expression: String.raw`H_{\mathrm{finalized}}\preceq H_{\mathrm{safe}}\preceq H_{\mathrm{unsafe}},\qquad(115\preceq118\preceq120)`, annotation: ["Finalized head이(가) 식의 결과에 기여하는 방식을","계산합니다.","세 숫자를 하나의 finality 점수가 아니라 같은","canonical ancestry 위의 서로 다른"] },
          ]}
          terms={[
            { symbol: "H_{\\mathrm{unsafe}}", name: "Unsafe head", description: "Sequencer가 만든 최신 L2 head입니다." },
            { symbol: "H_{\\mathrm{safe}}", name: "Safe head", description: "Canonical L1 batch input에서 derivation된 L2 head입니다." },
            { symbol: "H_{\\mathrm{finalized}}", name: "Finalized head", description: "Corresponding L1 origin까지 finalized된 L2 head입니다." },
            { symbol: "\\preceq", name: "Ancestor relation", description: "왼쪽 block이 오른쪽 block의 canonical ancestor임을 뜻합니다." },
          ]}
          assumptions={[
            "예제 heights는 null/reorg 없는 단순한 ancestry이며 실제 판단은 block hashes와 origins로 합니다.",
            "Safe/finalized labels는 exact OP/GIWA node semantics를 따릅니다.",
          ]}
          interpretation="높이 차이 5가 시간 5초나 withdrawal 완료를 뜻하지 않습니다. 앱은 value at risk와 외부 effect의 reversibility에 따라 어느 cursor를 요구할지 정합니다."
        />
        <p>
          <strong>증명 아이디어:</strong> Derivation pipeline의 각 stage가 같은 ordered input과
          config에서 같은 output을 내면 합성 결과 P_h도 같습니다. op-reth의 deterministic EVM
          execution까지 state root parity가 이어집니다. 반례로 L1 receipt 한 개나 channel frame
          순서를 누락하면 payload가 달라지므로 safe head를 전진시키지 않아야 합니다.
        </p>
        <div id="paper-op-derivation">
          <CitationBlock citeKey={3} source="OP Stack Specification · Derivation" href={OP_DERIVATION}>
            <p><strong>문제:</strong> L1 batch inputs에서 같은 L2 payload와 safe chain을 재현해야 합니다.</p>
            <p><strong>핵심 기여:</strong> Sequencing window, batches·channels·frames와 derivation pipeline 규칙을 정의합니다.</p>
            <p><strong>중요 가정:</strong> Exact protocol revision, chain config, canonical L1 view와 activation schedule을 고정합니다.</p>
            <p><strong>근거 범위:</strong> Generic OP Stack derivation semantics입니다.</p>
            <p><strong>일반화 금지:</strong> GIWA-specific config, sequencer availability, execution-client bug 부재나 app correctness를 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-giwa-network-diffs">
          <CitationBlock citeKey={4} source="GIWA Documentation · Differences from Ethereum" href={GIWA_DIFFS}>
            <p><strong>문제:</strong> L1 Ethereum과 GIWA L2의 transaction·head semantics를 구분해야 합니다.</p>
            <p><strong>핵심 기여:</strong> Sequencer, bridge/address alias, mempool과 unsafe·safe·finalized 상태를 설명합니다.</p>
            <p><strong>중요 가정:</strong> 표시된 GIWA network revision과 OP Stack configuration을 확인합니다.</p>
            <p><strong>근거 범위:</strong> GIWA application-facing network differences입니다.</p>
            <p><strong>일반화 금지:</strong> Withdrawal challenge 종료, censorship resistance나 application-level finality를 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="application-boundary" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">03 · Application boundary</p>
          <h2 className="mt-2 text-2xl font-bold">
            Chain confirmation과 stablecoin reserve·redemption·compliance를 같은 주장으로 묶지 않는다
          </h2>
        </header>
        <p>
          UI preview처럼 되돌릴 수 있는 read라면 unsafe 120을 써도 됩니다. 상품 출고나 다른 network 지급처럼 되돌리기 어려운 effect에는 safe 또는
          finalized policy와 reconciliation ledger가 필요합니다. 고정 transaction T의 receipt에는 L2 block hash와 L1
          origin, observed cursor, application effect ID를 기록해 reorg 뒤 중복 지급과 누락을 찾아냅니다.
        </p>
        <ExplainedFormula
          question="Transaction T의 외부 effect를 승인할 최소 조건은 무엇일까?"
          idea={<>Network generation, execution receipt, 요구한 head status와 idempotent application policy를 모두 AND로 확인합니다.</>}
          formula={"A_T=A_G\\land A_{\\mathrm{exec}}\\land A_{\\mathrm{head}\\ge p}\\land A_{\\mathrm{effect}}"}
          annotatedFormula={String.raw`A_T=\underbrace{A_G\land A_{\mathrm{exec}}\land A_{\mathrm{head}\ge p}\land A_{\mathrm{effect}}}_{\text{판정 조건 결합}}`}
          operations={[
            { expression: String.raw`A_G\land A_{\mathrm{exec}}\land A_{\mathrm{head}\ge p}\land A_{\mathrm{effect}}`, annotation: ["필요한 gate가 모두 참일 때만 전체 조건을 통과시킵니다.","Network generation, execution","receipt, 요구한 head status와","idempotent application policy를 모두"] },
          ]}
          terms={[
            { symbol: "A_T", name: "Application acceptance", description: "외부 effect를 승인해도 되면 1입니다." },
            { symbol: "A_G", name: "Generation match", description: "Expected GIWA chain/source/config digest와 같으면 1입니다." },
            { symbol: "A_{\\mathrm{exec}}", name: "Execution receipt", description: "Expected transaction status·logs·state context가 맞으면 1입니다." },
            { symbol: "A_{\\mathrm{head}\\ge p}", name: "Head policy", description: "Unsafe/safe/finalized 중 application이 요구한 cursor를 통과하면 1입니다." },
            { symbol: "A_{\\mathrm{effect}}", name: "Effect fence", description: "같은 effect ID가 아직 실행되지 않았거나 동일 결과로 reconciliation되면 1입니다." },
          ]}
          assumptions={[
            "Application policy p와 value-at-risk, rollback 가능성을 사전에 정의합니다.",
            "Block number가 아니라 hashes·ancestry·L1 origin으로 confirmation을 확인합니다.",
          ]}
          interpretation="Unsafe receipt가 valid해도 요구 policy가 safe이면 AT는 0입니다. AT가 1이어도 stablecoin reserve나 legal claim이 충분하다는 뜻은 아닙니다."
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-lg border border-border p-4">
            <h3 className="font-semibold">Chain이 제공하는 것</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              EVM execution과 ordered L2 state, L1 batch publication, 그리고 OP fault-proof/settlement surface입니다.
              정확한 범위는 active protocol과 contracts에 귀속합니다.
            </p>
          </article>
          <article className="rounded-lg border border-border p-4">
            <h3 className="font-semibold">Stablecoin이 별도로 요구하는 것</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Issuer liability, reserve composition·attestation, redemption, oracle, admin keys,
              sanctions·consumer protection입니다. <a className="text-primary hover:underline" href="/blockchain/stablecoin-overview">Stablecoin 정본</a>에서
              따로 다룹니다.
            </p>
          </article>
        </div>
        <p>
          <strong>Failure counterexample:</strong> App이 unsafe deposit T를 보고 다른 지급망에서
          즉시 출금해 준 뒤 L1 reorg 또는 sequencer branch replacement로 T가 사라지면 chain
          내부 balance는 되돌릴 수 있어도 외부 지급은 자동으로 돌아오지 않습니다. Head policy,
          effect ID와 compensating procedure가 필요한 이유입니다.
        </p>
      </section>

      <section id="release-gate" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">04 · Canary and rollback</p>
          <h2 className="mt-2 text-2xl font-bold">
            RPC health가 아니라 derivation·state·head parity와 reorg recovery를 통과한 bundle만 승격한다
          </h2>
        </header>
        <p>
          Canary manifest에는 GIWA node source SHA와 op-node/op-reth revisions와 images를 적습니다. 여기에 genesis·rollup
          config digests, L1 endpoint/trust profile, JWT generation, sync mode와 data snapshot generation도 함께
          기록합니다. 같은 L1 origin 구간에서 reference node와 derived payload hashes, receipts, state roots,
          unsafe/safe/finalized transitions를 비교합니다. 그 뒤에야 latency와 disk, RPC throughput을 측정합니다.
        </p>
        <ol className="grid gap-3 sm:grid-cols-2">
          {[
            ["Identity negatives", "Wrong chain ID·genesis/rollup mix·stale op-geth와 unexpected activation을 거부합니다."],
            ["Handoff negatives", "JWT mismatch·Engine disconnect·invalid payload·L1 endpoint inconsistency를 분리합니다."],
            ["Recovery", "L1 reorg, process crash, snapshot corruption과 rate limit 뒤 common origin에서 rederive합니다."],
            ["Rollback", "Writes를 멈추고 prior compatible bundle/config로 돌아가되 already observed external effects를 먼저 reconciliation합니다."],
          ].map(([title, description]) => (
            <li key={title} className="rounded-lg border border-border p-4">
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            </li>
          ))}
        </ol>
        <p>
          Testnet은 공식 terms상 중단·reset·rollback될 수 있으며 free RPC도 production 용도가 아닙니다. 그래서 testnet canary 성공을
          Mainnet readiness로 바꾸지 않습니다. Benchmark 역시 같은 L1 source와 head distance, sync mode, snapshot age,
          hardware, request mix에서 p50·p95·p99와 reorg catch-up, disk growth를 함께 비교해야 합니다.
        </p>
        <aside className="rounded-lg border border-border bg-muted/20 p-5 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">Article-only 10/10:</strong> GIWA generation의 다섯
          artifacts, op-node/op-reth 책임, JWT 경계, 120/118/115 head 해석, chain과 stablecoin
          안전 분리, pinned clients·sync modes, unsafe payout 반례, config-mix fixture, L1 reorg
          reconciliation과 release matrix를 이 글만으로 답할 수 있습니다.
        </aside>
      </section>
    </article>
  );
}
