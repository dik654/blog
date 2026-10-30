import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";
import { prysmTree } from "./fileTrees";
import PrysmBlockProposalLocator, { PrysmBlockProposalMapReturn } from "./PrysmBlockProposalLocator";
import PrysmBlockProposalFlowViz from "./viz/PrysmBlockProposalFlowViz";

const Label = ({ children }: { children: ReactNode }) => (
  <span className="mr-2 inline-flex border border-primary/40 px-1.5 py-0.5 font-mono text-[9px] font-black text-primary">{children}</span>
);

const bodyInputs = [
  ["Consensus pools", "attestations · slashings · deposits · exits", "fork별 상한과 검증을 통과한 operation"],
  ["Sync data", "sync aggregate · BLS-to-execution changes", "현재 fork body field"],
  ["Execution", "local payload 또는 builder header", "parent와 proposal policy에 맞는 execution data"],
  ["Data availability", "blob commitments · blobs · proofs", "Fulu block과 함께 보낼 sidecar 입력"],
] as const;

export default function ModernArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <PrysmBlockProposalLocator />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">
            Slot 353의 제안자는 어떻게 블록 하나를 조립하고 한 번만 서명해 전파합니까?
          </h2>
        </div>
        <PrysmBlockProposalFlowViz />
        <p className="text-lg leading-8">
          <Label>A</Label>Block proposal은 validator client가 혼자 block을 만드는 작업이 아닙니다.
        </p>
        <p>
          Validator client는 <strong>duty, validator key와 서명</strong>을 소유합니다. Beacon node는 <strong>parent, operation pool, execution payload와 state transition</strong>을 소유합니다. 두 프로세스가 API를 사이에 두고 하나의 unsigned candidate를 만든 뒤 proposer가 그 identity에 서명합니다.
        </p>
        <p>
          직전 글은 이미 전파된 block을 검증해 fork-choice 후보로 넣는 수신 경로였습니다. 이 글은 반대쪽인 생성 경로만 추적합니다. Parent를 고르는 알고리즘은 <Link to="/cs/blockchain/prysm-forkchoice#overview">fork-choice 글</Link>, 완성 block을 검증하는 과정은 <Link to="/cs/blockchain/prysm-block-processing#overview">block processing 글</Link>, 서명 수학은 <Link to="/cs/blockchain/prysm-bls#overview">BLS 글</Link>이 각각 소유합니다.
        </p>
        <ContentBoundary article="prysm-block-proposal" />
      </section>

      <section id="case" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">입력</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4" aria-label="설명용 Fulu slot 353 proposal 입력">
          {[
            ["State", "Fulu · slot 353", "epoch 11의 proposal state"],
            ["Duty", "lookahead[1] = 17", "validator 17이 proposer라고 가정"],
            ["Parent", "P352", "fork choice가 선택할 설명용 parent"],
            ["Payload", "local L353", "builder bid보다 선택된다고 가정"],
          ].map(([label, value, detail]) => (
            <div key={label} className="min-w-0 bg-background p-4">
              <span className="text-[9px] font-bold text-muted-foreground">{label}</span>
              <strong className="mt-1 block break-keep text-sm">{value}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <p>
          Slot·validator·parent·payload 이름은 한 요청을 끝까지 따라가기 위한 설명용 값입니다. 실제 chain에서 가져온 block이나 성능 측정 결과가 아닙니다. 직전 slot 352 block이 처리된 뒤 Fulu state가 slot 353까지 전진했고, validator client가 validator 17의 제안 duty를 실행한다고 가정합니다.
        </p>
      </section>

      <section id="duty" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Duty</h2>
        <p>
          기존 구현을 이해할 때 가장 먼저 바로잡을 부분은 proposer 선택 시점입니다. Prysm v7.3.1의 Fulu state는 현재 epoch와 다음 epoch의 proposer를 <code>proposer_lookahead</code>에 보관합니다. Slot 353의 request가 들어왔을 때 매번 validator 전체를 다시 shuffle하지 않습니다.
        </p>
        <ExplainedFormula
          question="Slot 353의 proposer 17은 request 시점에 어디서 나옵니까?"
          idea="Fulu state의 현재 epoch 구간에서 slot의 나머지를 index로 사용해 미리 계산된 proposer lookahead를 읽습니다."
          formula={String.raw`i_{353}=L[353\bmod 32]=L[1]=17`}
          annotatedFormula={String.raw`\underbrace{i_{353}}_{\text{slot 353 proposer}}=\underbrace{L[353\bmod32]}_{\text{Fulu lookahead 조회}}=\underbrace{L[1]}_{\text{epoch 안의 두 번째 slot}}=17`}
          operations={[
            { expression: String.raw`353\div32=11\;\text{remainder}\;1`, annotation: ["slot 353은 epoch 11", "epoch 안 index는 1"] },
            { expression: String.raw`L[1]=17`, annotation: ["state가 보유한 설명용 lookahead", "validator 17이 duty owner"] },
          ]}
          terms={[
            { symbol: "L", name: "Proposer lookahead", description: "Fulu BeaconState가 현재·다음 epoch에 대해 보유한 proposer index 배열입니다." },
            { symbol: "32", name: "Slots per epoch", description: "이 설명에서 사용하는 Ethereum mainnet preset의 epoch 길이입니다." },
            { symbol: "i_{353}", name: "Proposer index", description: "Slot 353에 block을 제안할 validator index입니다." },
          ]}
          assumptions={["설명용 state의 proposer_lookahead[1] 값이 17이라고 둡니다.", "같은 Fulu state와 preset을 읽는 정상 client는 같은 lookahead 값을 봅니다."]}
          interpretation="Fulu proposal hot path의 결정은 배열 조회입니다. Lookahead 자체를 만들 때는 Electra식 16-bit random value와 effective balance를 사용하는 ComputeProposerIndex가 앞선 epoch 처리에서 실행됩니다."
        />
        <p>
          Lookahead를 만드는 내부 acceptance test는 <code>effectiveBalance × 65535 ≥ MAX_EFFECTIVE_BALANCE_ELECTRA × random16</code>입니다. 예전 Phase 0의 8-bit <code>255</code> 식을 Fulu request 경로에 그대로 적용하면 현재 구현을 잘못 설명하게 됩니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("fulu-proposer-lookahead", codeRefs["fulu-proposer-lookahead"])} />
          <span className="text-xs text-muted-foreground">Fulu lookahead 조회와 Electra식 16-bit precomputation</span>
        </div>
      </section>

      <section id="request" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">요청</h2>
        <p>
          Validator client는 먼저 epoch 11과 <code>DOMAIN_RANDAO</code>로 signing root를 만들고 validator 17의 key로 RANDAO reveal을 서명합니다. 이어 slot, reveal, graffiti와 builder 설정을 beacon node의 block production API에 보냅니다.
        </p>
        <p>
          Fulu는 Gloas 이전 fork이므로 Prysm REST client는 <code>GET /eth/v3/validator/blocks/353</code> 경로를 사용합니다.
        </p>
        <pre className="not-prose overflow-x-auto border border-border bg-muted/20 p-4 text-[12px] font-normal leading-6"><code>{`// Validator 17의 RANDAO 기여를 먼저 서명합니다.
randaoReveal = signRandao(epoch = 11, slot = 353, key = validator17)

// Beacon node에 unsigned block candidate를 요청합니다.
candidate = GET /eth/v3/validator/blocks/353
  ?randao_reveal=randaoReveal
  &graffiti=...

// 이 시점에는 proposer block signature가 아직 없습니다.
return candidate`}</code></pre>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("validator-propose-request", codeRefs["validator-propose-request"])} />
          <CodeViewButton onClick={() => sidebar.open("beacon-api-v3", codeRefs["beacon-api-v3"])} />
          <span className="text-xs text-muted-foreground">RANDAO 서명과 Fulu block production 요청</span>
        </div>
        <p>
          RANDAO reveal은 block body의 입력이고 proposer block signature와는 다른 서명입니다. Graffiti는 32-byte metadata이지만 body root에 포함되므로 나중에 proposer가 서명할 block identity에는 영향을 줍니다.
        </p>
      </section>

      <section id="parent" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Parent</h2>
        <p>
          Beacon node는 먼저 자신이 syncing 중이거나 execution-optimistic 상태인지 확인합니다. 최신 execution validity를 확정하지 못한 node는 proposer에게 서명할 candidate를 내주지 않습니다. 준비된 node만 fork choice를 갱신하고 <code>GetProposerHead</code>가 고른 parent P352와 그 state를 가져옵니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3" aria-label="Block proposal parent 선택 경계">
          {[
            ["Readiness", "syncing = false", "optimistic = false"],
            ["Fork choice", "UpdateHead", "proposer parent = P352"],
            ["State", "StateByRoot(P352)", "ProcessSlots → 353"],
          ].map(([stage, action, result]) => (
            <div key={stage} className="min-w-0 bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">{stage}</span>
              <strong className="mt-2 block break-keep text-xs">{action}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{result}</p>
            </div>
          ))}
        </div>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("beacon-parent", codeRefs["beacon-parent"])} />
          <span className="text-xs text-muted-foreground">Readiness gate, proposer head와 slot 353 state</span>
        </div>
        <p>
          Duty와 parent는 같은 값이 아닙니다. Validator 17이 slot 353의 proposer라는 사실은 유지되더라도, 늦은 block이나 vote 때문에 parent가 바뀌면 beacon node는 새 proposer head를 기준으로 candidate를 다시 조립합니다. 서명 전까지는 parent가 candidate identity의 일부일 뿐 commit된 결과가 아닙니다.
        </p>
      </section>

      <section id="assembly" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">조립</h2>
        <p>
          Prysm의 pre-Gloas <code>buildBlockFulu</code>는 consensus body 입력을 모으는 작업과 execution payload 경로를 겹쳐 진행합니다. 두 경로가 같은 state를 임의로 동시에 수정하는 것은 아닙니다. Consensus pool 결과는 block body의 각 field에 들어가고, execution 경로는 local payload와 허용된 builder bid 중 하나를 block의 execution data로 정합니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2" aria-label="Fulu block body 조립 입력">
          {bodyInputs.map(([owner, input, output]) => (
            <div key={owner} className="min-w-0 bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">{owner}</span>
              <strong className="mt-2 block break-keep text-xs">{input}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{output}</p>
            </div>
          ))}
        </div>
        <p>
          이 사례에서는 local payload L353이 선택된다고 둡니다. Builder 요청이 실패해도 local payload가 이미 준비됐다면 조립은 계속될 수 있습니다. 반대로 local payload 자체를 얻지 못하면 Prysm v7.3.1의 이 Fulu 경로는 block 조립을 실패로 끝냅니다. Builder가 언제나 자동 대체재가 되는 것은 아닙니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("fulu-assembly", codeRefs["fulu-assembly"])} />
          <span className="text-xs text-muted-foreground">Consensus field 수집과 local·builder execution data 선택</span>
        </div>
      </section>

      <section id="root" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">State Root</h2>
        <p>
          Body field가 채워져도 proposer가 바로 서명하지 않습니다. Beacon node는 candidate의 parent root로 pre-state를 다시 얻고, 앞 글에서 본 것과 같은 state transition을 candidate에 적용합니다. 완성된 post-state의 hash-tree-root를 계산해 <code>block.state_root</code>에 넣습니다.
        </p>
        <ExplainedFormula
          question="Proposal path가 block.state_root에 넣는 값은 무엇입니까?"
          idea="선택한 parent state에 조립한 candidate를 실제 fork 규칙으로 적용한 post-state 전체의 SSZ root입니다."
          formula={String.raw`B_{353}.\mathrm{state\_root}=\operatorname{HTR}(T_{Fulu}(S_{P352\rightarrow353},B_{353}^{0}))`}
          annotatedFormula={String.raw`\underbrace{B_{353}.\mathrm{state\_root}}_{\text{서명 전에 채울 commitment}}=\underbrace{\operatorname{HTR}(T_{Fulu}(S_{P352\rightarrow353},B_{353}^{0}))}_{\text{candidate transition의 post-state root}}`}
          operations={[
            { expression: String.raw`S_{P352\rightarrow353}`, annotation: ["parent P352의 state", "slot 353까지 전진한 proposal pre-state"] },
            { expression: String.raw`T_{Fulu}(S,B^0)`, annotation: ["state_root가 비어 있는 candidate를 적용", "fork별 validation과 mutation 수행"] },
            { expression: String.raw`\operatorname{HTR}(\cdot)`, annotation: ["post-state 전체를 SSZ Merkle화", "32-byte commitment를 block에 backfill"] },
          ]}
          terms={[
            { symbol: "B_{353}^{0}", name: "Unsigned candidate", description: "Parent·body는 정해졌지만 state_root와 proposer signature가 아직 완성되지 않은 block입니다." },
            { symbol: String.raw`S_{P352\rightarrow353}`, name: "Proposal pre-state", description: "Parent P352에서 slot 353까지 진행한 BeaconState입니다." },
            { symbol: "T_{Fulu}", name: "Fulu transition", description: "Candidate가 실제로 만들 post-state를 계산하는 consensus transition입니다." },
          ]}
          assumptions={["Candidate의 parent·operation·execution data가 앞 단계에서 고정됐습니다.", "같은 consensus-spec release와 preset을 사용하는 검증자는 나중에 같은 root를 다시 계산합니다."]}
          interpretation="State root를 채우는 순간 parent와 body가 하나의 검증 가능한 post-state commitment로 묶입니다. 이 값이 들어간 block root가 proposer signature의 대상이 됩니다."
        />
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("proposal-state-root", codeRefs["proposal-state-root"])} />
          <span className="text-xs text-muted-foreground">Candidate transition과 state-root backfill</span>
        </div>
      </section>

      <section id="sign-publish" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">서명과 전파</h2>
        <p>
          Validator client는 beacon node가 돌려준 block을 proposer domain으로 서명합니다. Prysm v7.3.1은 같은 proposer role과 public key의 동시 실행을 lock으로 묶고, 서명 뒤 local slashing-protection database의 <code>SlashableProposalCheck</code>를 통과한 block만 제출합니다.
        </p>
        <p>
          호출 순서를 정확히 보면 block signature는 local slashing check보다 먼저 만들어집니다. 따라서 이 check는 이미 생긴 signature를 지우는 장치가 아니라 conflicting proposal의 제출을 막는 마지막 local gate입니다. 같은 key를 여러 validator client나 외부 signer에서 동시에 운용한다면 이 한 프로세스의 lock만으로 전역 중복 서명을 막을 수 없습니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4" aria-label="Block proposal commit 경계">
          {[
            ["Sign", "block root + proposer domain", "validator 17 signature"],
            ["Protect", "key · slot · signing root", "slashable이면 제출 중단"],
            ["Submit", "signed block · sidecars", "beacon node API"],
            ["Broadcast", "local receive ∥ gossip", "block root receipt"],
          ].map(([stage, input, output]) => (
            <div key={stage} className="min-w-0 bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">{stage}</span>
              <strong className="mt-2 block break-keep text-xs">{input}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{output}</p>
            </div>
          ))}
        </div>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("validator-sign-protect", codeRefs["validator-sign-protect"])} />
          <CodeViewButton onClick={() => sidebar.open("beacon-publish", codeRefs["beacon-publish"])} />
          <span className="text-xs text-muted-foreground">서명·local slashing gate·block/sidecar 전파</span>
        </div>
        <p>
          성공 응답의 block root는 “이 signed block을 제출했다”는 identity입니다. Peers가 받았는지, fork choice가 head로 골랐는지, checkpoint가 finalized됐는지는 뒤 단계의 상태입니다. Proposal API 성공을 finality로 해석하면 안 됩니다.
        </p>
      </section>

      <section id="failure" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실패 경계</h2>
        <div className="not-prose overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead><tr className="border-b border-border"><th className="p-3">실패 위치</th><th className="p-3">Prysm의 동작</th><th className="p-3">남지 않는 결과</th></tr></thead>
            <tbody>
              {[
                ["Beacon node syncing·optimistic", "unsigned candidate 요청을 거절", "proposer block signature"],
                ["Local execution payload 없음", "Fulu build를 오류로 종료", "state root가 채워진 candidate"],
                ["Attestation·BLS change transition 오류", "문제 operation을 비우고 제한된 횟수만 root 계산 재시도", "오류 operation이 든 signed block"],
                ["Local slashing check 실패", "signed block 제출을 중단", "gossip·local receive"],
                ["Broadcast·sidecar 오류", "proposal API를 오류로 반환", "head·채택·finality 보장"],
              ].map(([where, behavior, absent]) => (
                <tr key={where} className="border-b border-border/70"><td className="p-3 font-mono text-xs text-primary">{where}</td><td className="p-3">{behavior}</td><td className="p-3 text-muted-foreground">{absent}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          이 표는 Prysm v7.3.1의 한 proposal 호출이 어디서 멈추는지 설명합니다. 다중 beacon node failover, 원격 signer의 전역 slashing protection, 재시도 정책과 운영 deadline은 별도 실무 판단입니다. 이 개념 글에서는 실제 구현이 소유하는 실패까지만 다룹니다.
        </p>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">근거</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2">
          <a
            href="https://github.com/ethereum/consensus-specs/tree/aa16bb4c156184e9548a997d53efaf2a228a6304/specs"
            target="_blank"
            rel="noreferrer"
            className="min-w-0 bg-background p-4 hover:bg-muted/30"
          >
            <span className="font-mono text-[10px] font-black text-primary">O · Protocol</span>
            <strong className="mt-2 block break-keep text-sm leading-6">Ethereum consensus-specs v1.7.0-beta.4 · aa16bb4c</strong>
            <p className="mt-3 break-keep text-xs leading-5 text-muted-foreground">Fulu proposer lookahead, Electra proposer sampling, validator proposal과 fork별 body·state transition 규칙을 확인했습니다.</p>
            <p className="mt-2 break-keep text-xs leading-5"><strong>범위:</strong> Protocol state와 validator behavior의 정본이며 Prysm 내부 구현 순서는 규정하지 않습니다.</p>
          </a>
          <a
            href="https://github.com/OffchainLabs/prysm/tree/96d418cd964b083e37519a9df274030a1beac7db"
            target="_blank"
            rel="noreferrer"
            className="min-w-0 bg-background p-4 hover:bg-muted/30"
          >
            <span className="font-mono text-[10px] font-black text-primary">O · Implementation</span>
            <strong className="mt-2 block break-keep text-sm leading-6">OffchainLabs Prysm v7.3.1 · 96d418cd</strong>
            <p className="mt-3 break-keep text-xs leading-5 text-muted-foreground">Lookahead 조회, RANDAO와 block 서명, v3 request, proposer head, 조립, state-root, slashing check와 publish 구현을 확인했습니다.</p>
            <p className="mt-2 break-keep text-xs leading-5"><strong>범위:</strong> 이 release의 구현 snapshot이며 moving main, Gloas v4나 다른 client의 순서로 일반화하지 않습니다.</p>
          </a>
        </div>
      </section>

      <section id="self-check" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">확인 질문</h2>
        <ol className="space-y-4 pl-5 text-sm leading-7">
          <li>Fulu slot 353의 proposer를 request 시점에 8-bit 식으로 다시 뽑지 않는 이유는 무엇입니까? <strong>(답: Fulu state가 현재·다음 epoch의 proposer lookahead를 이미 가지고 있어 slot index로 조회하기 때문입니다.)</strong></li>
          <li>Validator client와 beacon node가 각각 소유하는 상태는 무엇입니까? <strong>(답: Validator client는 duty·key·서명·local slashing 기록을, beacon node는 parent·pool·payload·state transition과 전파를 소유합니다.)</strong></li>
          <li>Builder bid 오류가 언제 block proposal 전체 실패가 아닐 수 있습니까? <strong>(답: Local payload가 준비되어 있고 policy가 이를 선택할 수 있으면 Fulu candidate 조립을 계속할 수 있기 때문입니다.)</strong></li>
          <li>Proposal API가 block root를 반환해도 head나 finality가 아닌 이유는 무엇입니까? <strong>(답: 응답은 signed block 제출 identity이고, peer 수신·검증·fork-choice·checkpoint finalization은 뒤 단계이기 때문입니다.)</strong></li>
        </ol>
      </section>

      <PrysmBlockProposalMapReturn />

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ prysm: prysmTree }}
        projectMetas={{
          prysm: {
            id: "prysm",
            label: "Prysm v7.3.1 · Go",
            badgeClass: "bg-violet-500/10 border-violet-500 text-violet-700",
          },
        }}
      />
    </article>
  );
}
