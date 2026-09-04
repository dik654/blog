import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import {
  OctaneBoundaryViz,
  OctanePayloadLifecycleViz,
} from "./viz/ModernOctaneViz";

const SHA = "9864f25fa9bcb473ee34d2442012fc5fbd2683ea";
const REPO = `https://github.com/omni-network/omni/tree/${SHA}`;
const README = `https://github.com/omni-network/omni/blob/${SHA}/octane/README.md`;
const ABCI = `https://github.com/omni-network/omni/blob/${SHA}/octane/evmengine/keeper/abci.go`;
const MSG = `https://github.com/omni-network/omni/blob/${SHA}/octane/evmengine/keeper/msg_server.go`;
const EVENTS = `https://github.com/omni-network/omni/blob/${SHA}/octane/evmengine/keeper/events.go`;
const ENGINE = `https://github.com/omni-network/omni/blob/${SHA}/lib/ethclient/engineclient.go`;
const ENGINE_SPEC = "https://github.com/ethereum/execution-apis/tree/5aebdfdd45cadeb723be4bd45b4611b71c8b1c85";

export default function ModernArticle() {
  return (
    <article className="space-y-16">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">CometBFT height 101과 EVM payload P101을 한 trace로 읽기</p>
          <h2 className="text-3xl font-bold tracking-tight">
            Octane은 EVM을 CometBFT 안에 다시 구현하지 않고 ABCI와 Engine API 사이에서 payload의 생명주기를 번역한다
          </h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          합의 엔진은 누가 어떤 proposal을 확정했는지 결정하고 execution client는 transaction을 실행해 payload가 유효한지 판단합니다. Halo
          application의 Octane module은 이 둘 사이에서 payload를 Cosmos transaction message로 포장하고 Engine API status와
          committed execution head를 조정합니다. 따라서 “CometBFT가 EVM을 실행한다”거나 “Engine API가 consensus finality를 만든다”는
          설명은 책임 경계를 뒤섞습니다.
        </p>
        <p className="leading-7 text-muted-foreground">
          이 글은 현재 moving main이 아니라 commit <code>9864f25</code> snapshot을 설명합니다. 이 snapshot은
          CometBFT 0.38.19, Cosmos SDK 0.50.14, go-ethereum 1.15.7과 V3 Engine methods를 사용합니다.
          Octane README 자체도 work in progress라고 밝히므로 “어떤 Engine client든 무수정 호환”이나 고정
          처리량을 구현 사실로 확대하지 않습니다.
        </p>
        <OctaneBoundaryViz />
        <ContentBoundary article="omni-octane" />
        <div id="paper-octane-snapshot">
          <CitationBlock type="code" citeKey={1} source="Omni Octane repository snapshot · 9864f25" href={REPO}>
            <p><strong>문제:</strong> CometBFT consensus와 EVM execution client를 모듈 경계로 연결해야 합니다.</p>
            <p><strong>핵심 기여:</strong> Pinned monorepo는 Halo application, Octane evmengine module과 authenticated Engine client의 실제 조합을 제공합니다.</p>
            <p><strong>중요 가정:</strong> Commit, go.mod dependency versions, genesis·fork configuration과 execution client를 함께 고정합니다.</p>
            <p><strong>근거 범위:</strong> commit {SHA.slice(0, 8)}의 공개 source snapshot에 한정합니다.</p>
            <p><strong>일반화 금지:</strong> Moving main, 모든 Engine client 호환, production readiness 또는 고정 finality latency를 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-octane-readme">
          <CitationBlock type="code" citeKey={2} source="Octane README · modular framework status" href={README}>
            <p><strong>문제:</strong> ABCI 2.0 consensus application과 Engine API execution client의 목표 범위를 밝혀야 합니다.</p>
            <p><strong>핵심 기여:</strong> README는 framework goal, Halo example과 work-in-progress status를 명시합니다.</p>
            <p><strong>중요 가정:</strong> 문서와 같은 commit의 실제 source·tests를 함께 읽습니다.</p>
            <p><strong>근거 범위:</strong> Project가 선언한 architecture goal과 status에 한정합니다.</p>
            <p><strong>일반화 금지:</strong> 목표 문장을 client parity·security audit 통과·성능 결과로 취급하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="proposal-build" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">PrepareProposal · candidate build</p>
          <h2 className="text-2xl font-bold">Payload ID는 block이 아니라 제한된 build attempt의 영수증이다</h2>
        </header>
        <p className="leading-7">
          Height 101 proposer는 local execution head H100과 current AppHash A100을 읽습니다. 다음 proposer라고
          미리 추정해 둔 optimistic payload가 같은 height면 재사용하고, 아니면
          <code>forkchoiceUpdatedV3</code>에 head=safe=finalized=H100과 payload attributes를 보내 build를
          시작합니다. 반환된 payload ID로 <code>getPayloadV3</code>를 호출한 뒤, vote-extension messages와
          execution payload message를 한 unsigned Cosmos transaction으로 묶습니다. Payload ID는 consensus
          commit도, 다른 node에서 재사용 가능한 block ID도 아닙니다.
        </p>
        <ExplainedFormula
          question="PrepareProposal의 10초 context 안에서 어디에 시간이 쓰이는가?"
          idea={<>Build start, configured delay, payload retrieval과 encoding을 같은 monotonic trace에 더하고 timeout과 비교합니다.</>}
          formula={String.raw`\begin{aligned}T_{build}&=T_{FCU}+d_{build}\\T_{prepare}&=T_{build}+T_{get}+T_{encode}\\T_{prepare}&<10\ \mathrm{s}\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}T_{build}&=\underbrace{T_{FCU}+d_{build}}_{\text{Configured build delay 계산}}\\T_{prepare}&=\underbrace{T_{build}+T_{get}+T_{encode}}_{\text{Proposal encoding time 계산}}\\T_{prepare}&<\underbrace{10\ \mathrm{s}}_{\text{오른쪽 항으로 결과 계산}}\end{aligned}`}
          operations={[
            { expression: String.raw`T_{FCU}+d_{build}`, annotation: ["Configured build delay이(가) 식의 결과에","기여하는 방식을 계산합니다.","Build start, configured delay,","payload retrieval과 encoding을 같은"] },
            { expression: String.raw`T_{build}+T_{get}+T_{encode}`, annotation: ["Proposal encoding time이(가) 식의 결과에","기여하는 방식을 계산합니다.","Build start, configured delay,","payload retrieval과 encoding을 같은"] },
            { expression: String.raw`10\ \mathrm{s}`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","Build start, configured delay,","payload retrieval과 encoding을 같은","monotonic trace에 더하고 timeout과"] },
          ]}
          terms={[
            { symbol: "T_{FCU}", name: "Build-start latency", description: "forkchoiceUpdatedV3 request와 typed response 시간입니다." },
            { symbol: "d_{build}", name: "Configured build delay", description: "Payload를 가져오기 전 기다리는 node configuration 값입니다." },
            { symbol: "T_{build}", name: "Build phase", description: "Build start request와 configured delay를 합한 시간입니다." },
            { symbol: "T_{get}", name: "Payload retrieval latency", description: "payload ID로 getPayloadV3 envelope를 받는 시간입니다." },
            { symbol: "T_{encode}", name: "Proposal encoding time", description: "Commitments·vote messages·payload를 한 transaction으로 encode하는 시간입니다." },
          ]}
          assumptions={[
            "10초는 pinned abci.go의 PrepareProposal context timeout이며 generic CometBFT SLA가 아닙니다.",
            "Network retry와 build delay를 monotonic clock으로 같은 attempt 안에서 측정합니다.",
            "Timeout이면 source comment처럼 empty proposal 경로가 가능하며 candidate commit을 뜻하지 않습니다.",
          ]}
          interpretation="FCU가 빨라도 build delay나 getPayload retry가 budget을 소진할 수 있습니다. 한 평균만으로 release하지 말고 cold build, optimistic hit, unknown payload와 timeout을 각각 측정합니다."
        />
        <OctanePayloadLifecycleViz />
        <div id="paper-octane-abci">
          <CitationBlock type="code" citeKey={3} source="Octane ABCI proposal bridge · 9864f25" href={ABCI}>
            <p><strong>문제:</strong> CometBFT proposer가 execution payload를 제한 시간 안에 만들고 deterministic message로 제출해야 합니다.</p>
            <p><strong>핵심 기여:</strong> PrepareProposal의 timeout, optimistic build, V3 build/get, blob commitment와 single-transaction packaging 경계를 구현합니다.</p>
            <p><strong>중요 가정:</strong> Pinned dependencies, local execution head, fee recipient, withdrawal provider와 vote provider를 고정합니다.</p>
            <p><strong>근거 범위:</strong> Pinned <code>octane/evmengine/keeper/abci.go</code>의 proposal-build path입니다.</p>
            <p><strong>일반화 금지:</strong> Payload ID를 commit·durability receipt로 보거나 10초를 모든 deployment의 latency 보장으로 확대하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="validate-finalize" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">ProcessProposal · FinalizeBlock</p>
          <h2 className="text-2xl font-bold">Candidate validity와 committed execution head는 두 번의 다른 판단이다</h2>
        </header>
        <p className="leading-7">
          Validator는 module authority, payload decoding, ordered withdrawals, fee recipient, no-witness rule,
          parent hash, block number와 timestamp range를 먼저 확인합니다. 그다음 <code>newPayloadV3</code> 결과가
          INVALID면 proposal을 거절합니다. SYNCING·ACCEPTED는 local execution client가 아직 충분히 검증하지
          못했다는 상태이지 VALID의 다른 표기가 아닙니다. Commit된 block을 finalize할 때 payload를 다시 push한
          뒤 <code>forkchoiceUpdatedV3</code>로 그 hash를 head·safe·finalized에 놓고서야 local execution head를
          갱신합니다.
        </p>
        <ExplainedFormula
          question="어떤 증거가 candidate P101을 committed execution head로 승격하는가?"
          idea={<>Payload status와 CometBFT commit을 분리하고, 둘이 맞는 height·hash에서 만날 때만 local canonical pointers를 전진시킵니다.</>}
          formula={String.raw`\begin{aligned}v&=NP_3(P_{101})\\c&=commit_{101}\\H&=hash(P_{101})\\c\land(v=VALID)&\Rightarrow FCU_3\\(h,s,f)&\leftarrow(H,H,H)\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}v&=\underbrace{NP_3(P_{101})}_{\text{Candidate payload 계산}}\\c&=\underbrace{commit_{101}}_{\text{Consensus commit 계산}}\\H&=\underbrace{hash(P_{101})}_{\text{Candidate payload 계산}}\\c\land(v=VALID)&\Rightarrow FCU_3\\(h,s,f)&\leftarrow(H,H,H)\end{aligned}`}
          operations={[
            { expression: String.raw`NP_3(P_{101})`, annotation: ["Candidate payload이(가) 식의 결과에 기여하는","방식을 계산합니다.","Payload status와 CometBFT commit을","분리하고, 둘이 맞는 height·hash에서 만날 때만"] },
            { expression: String.raw`commit_{101}`, annotation: ["Consensus commit이(가) 식의 결과에 기여하는","방식을 계산합니다.","Payload status와 CometBFT commit을","분리하고, 둘이 맞는 height·hash에서 만날 때만"] },
            { expression: String.raw`hash(P_{101})`, annotation: ["Candidate payload이(가) 식의 결과에 기여하는","방식을 계산합니다.","Payload status와 CometBFT commit을","분리하고, 둘이 맞는 height·hash에서 만날 때만"] },
          ]}
          terms={[
            { symbol: "P_{101}", name: "Candidate payload", description: "Height 101 proposal transaction 안의 decoded execution payload입니다." },
            { symbol: "v", name: "Execution verdict", description: "VALID·INVALID·SYNCING·ACCEPTED 중 execution client가 돌려준 status입니다." },
            { symbol: "NP_3", name: "newPayload V3", description: "Candidate payload를 실행 client에 검증 요청하는 versioned call입니다." },
            { symbol: "c", name: "Consensus commit", description: "CometBFT가 height 101 proposal을 확정했다는 별도 evidence입니다." },
            { symbol: "H", name: "Committed payload hash", description: "같은 payload P101의 execution block hash입니다." },
            { symbol: "FCU_3", name: "forkchoiceUpdated V3", description: "Committed hash를 local canonical pointers에 반영하는 versioned call입니다." },
            { symbol: "h,s,f", name: "Head·safe·finalized", description: "Pinned Octane policy에서 모두 H로 전진시키는 execution-client pointers입니다." },
          ]}
          assumptions={[
            "같은 height, parent hash, payload bytes와 active fork/profile을 비교합니다.",
            "표시한 implication은 안전한 release 판단을 위한 계약이며 source의 SYNCING retry/continue 세부를 VALID와 동일시하지 않습니다.",
            "CometBFT instant finality 문구는 pinned integration의 pointer policy이며 generic Ethereum finality rule이 아닙니다.",
          ]}
          interpretation="newPayload VALID만으로 consensus commit은 생기지 않고, commit만으로 EVM validity를 대체할 수도 없습니다. INVALID·SYNCING·network error를 같은 retry bucket에 넣으면 safety와 liveness 원인을 잃습니다."
        />
        <div id="paper-octane-finalize">
          <CitationBlock type="code" citeKey={4} source="Octane finalized payload handler · 9864f25" href={MSG}>
            <p><strong>문제:</strong> Consensus에 포함된 payload를 execution client의 canonical head와 application state에 일관되게 반영해야 합니다.</p>
            <p><strong>핵심 기여:</strong> Finalize-only guard, payload revalidation, newPayload status, head/safe/finalized FCU와 execution-head update 순서를 구현합니다.</p>
            <p><strong>중요 가정:</strong> Same payload/commit context, reachable authenticated client, matching V3 schema와 local store를 사용합니다.</p>
            <p><strong>근거 범위:</strong> Pinned msg server의 finalized execution path에 한정합니다.</p>
            <p><strong>일반화 금지:</strong> 모든 retry가 안전하거나 bounded하다는 주장, cross-node durability나 external effect 완료를 뜻하지 않습니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-engine-api-contract">
          <CitationBlock type="paper" citeKey={5} source="Ethereum execution-apis snapshot · 5aebdfdd" href={ENGINE_SPEC}>
            <p><strong>문제:</strong> Consensus와 execution client가 payload build·validation·fork choice를 typed JSON-RPC로 교환해야 합니다.</p>
            <p><strong>핵심 기여:</strong> Versioned Engine methods, payload status와 authenticated API schema의 표준 근거를 제공합니다.</p>
            <p><strong>중요 가정:</strong> Active fork, negotiated capability와 exact method/structure version을 함께 고정합니다.</p>
            <p><strong>근거 범위:</strong> 표시한 execution-apis repository snapshot의 protocol surface입니다.</p>
            <p><strong>일반화 금지:</strong> Octane의 ABCI packaging·retry·event processing이나 특정 client compatibility를 표준이 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="event-release" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">EVM log bridge · release evidence</p>
          <h2 className="text-2xl font-bold">Finalized payload 뒤의 log effect는 별도 transaction boundary와 실패 장부가 필요하다</h2>
        </header>
        <p className="leading-7">
          Pinned source는 registered processors별로 finalized block logs를 가져와 log index 순으로 정렬하고
          address·topics·data를 검증합니다. 각 event는 별도 cached multistore branch에서 처리되며 성공한 branch만 write됩니다.
          Processor panic이나 error는 해당 event write를 버리고 다음 event를 계속하므로 한 block의 모든 event가 원자적으로 적용된다고 말할 수
          없습니다. 이 경계는 cross-chain 성공 증명도 아닙니다.
        </p>
        <ExplainedFormula
          question="한 block의 event bridge가 완전 적용됐는지 어떻게 측정하는가?"
          idea={<>관찰한 registered events 수와 성공적으로 commit된 event branches 수를 비교하고 실패 identity를 별도 ledger에 남깁니다.</>}
          formula={String.raw`\begin{aligned}C_{event}&={N_{committed}\over N_{observed}}\\N_{failed}&=N_{observed}-N_{committed}\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}C_{event}&=\underbrace{{N_{committed}\over N_{observed}}}_{\text{Committed event branches 계산}}\\N_{failed}&=\underbrace{N_{observed}-N_{committed}}_{\text{Committed event branches 계산}}\end{aligned}`}
          operations={[
            { expression: String.raw`{N_{committed}\over N_{observed}}`, annotation: ["Committed event branches이(가) 식의","결과에 기여하는 방식을 계산합니다.","관찰한 registered events 수와 성공적으로","commit된 event branches 수를 비교하고 실패"] },
            { expression: String.raw`N_{observed}-N_{committed}`, annotation: ["Committed event branches이(가) 식의","결과에 기여하는 방식을 계산합니다.","관찰한 registered events 수와 성공적으로","commit된 event branches 수를 비교하고 실패"] },
          ]}
          terms={[
            { symbol: "N_{observed}", name: "Observed events", description: "Registered address/topic filters로 얻고 index 순으로 검증한 event 수입니다." },
            { symbol: "N_{committed}", name: "Committed event branches", description: "Processor가 성공해 cached multistore branch가 write된 event 수입니다." },
            { symbol: "N_{failed}", name: "Failed events", description: "Error 또는 recovered panic 때문에 state write가 되지 않은 event 수입니다." },
            { symbol: "C_{event}", name: "Event application coverage", description: "같은 block hash에서 관찰된 events 중 state에 적용된 비율입니다." },
          ]}
          assumptions={[
            "같은 block hash, processor generation, address/topic filters와 sorted log index를 사용합니다.",
            "분모 0은 no-event case로 별도 표시하고 100%로 꾸미지 않습니다.",
            "Coverage는 semantic correctness·destination effect·cross-chain delivery 성공률이 아닙니다.",
          ]}
          interpretation="예를 들어 5개 중 4개 branch만 commit되면 coverage는 0.8이고 failed event 1개를 block/log/processor identity로 재조정해야 합니다. Head update 성공만 기록하면 이 부분 적용을 놓칩니다."
        />
        <p className="leading-7 text-muted-foreground">
          Release candidate에는 Octane·Halo commit, CometBFT/Cosmos SDK/go-ethereum versions, execution client
          binary와 capabilities, JWT/config, genesis·fork schedule, build delay, processor registry를 묶습니다.
          Cold/optimistic build, empty first block, invalid parent/timestamp/withdrawal/blob, INVALID·SYNCING,
          unknown payload, timeout·restart, event panic·partial application을 재생하고 이전 binary/config와
          processor generation으로 되돌리는 절차까지 있어야 합니다.
        </p>
        <div id="paper-octane-events">
          <CitationBlock type="code" citeKey={6} source="Octane EVM event bridge · 9864f25" href={EVENTS}>
            <p><strong>문제:</strong> Finalized EVM logs를 deterministic order로 Cosmos application processors에 전달해야 합니다.</p>
            <p><strong>핵심 기여:</strong> Processor filters, log-index sorting, event verification과 per-event cached-store delivery 경계를 구현합니다.</p>
            <p><strong>중요 가정:</strong> Registered processor names/addresses, same block hash, reachable execution RPC와 local multistore semantics를 고정합니다.</p>
            <p><strong>근거 범위:</strong> Pinned events.go와 msg_server.go의 fetch/deliver source behavior입니다.</p>
            <p><strong>일반화 금지:</strong> Per-event branch success를 all-events atomicity, cross-chain delivery 또는 exactly-once external effect로 확대하지 않습니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-octane-engine-client">
          <CitationBlock type="code" citeKey={7} source="Omni Engine client V3 adapter · 9864f25" href={ENGINE}>
            <p><strong>문제:</strong> Authenticated JSON-RPC transport와 typed payload statuses를 application errors와 구분해야 합니다.</p>
            <p><strong>핵심 기여:</strong> V3 method names, JWT transport, HTTP timeout과 response/error conversion의 pinned 구현을 제공합니다.</p>
            <p><strong>중요 가정:</strong> Exact geth-compatible schema, endpoint, JWT secret와 30-second HTTP timeout을 사용합니다.</p>
            <p><strong>근거 범위:</strong> Pinned <code>lib/ethclient/engineclient.go</code> behavior에 한정합니다.</p>
            <p><strong>일반화 금지:</strong> Capability negotiation, 모든 Engine versions/clients, network availability 또는 error classification 완전성을 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>
    </article>
  );
}
