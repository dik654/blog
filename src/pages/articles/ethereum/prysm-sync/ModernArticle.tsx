import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";
import { prysmTree } from "./fileTrees";
import PrysmSyncLocator, { PrysmSyncMapReturn } from "./PrysmSyncLocator";
import PrysmSyncFlowViz from "./viz/PrysmSyncFlowViz";

const fixture = [
  ["Checkpoint origin", "slot 96", "state · block pair"],
  ["Local head", "slot 100", "blockchain service가 가진 현재 값"],
  ["Finalized target", "slot 128", "peer status에서 얻은 1단계 목표"],
  ["Current slot", "slot 140", "local clock의 2단계 목표"],
] as const;

export default function ModernArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <PrysmSyncLocator />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">
            뒤 range가 먼저 와도 앞 구간부터 처리하는 이유
          </h2>
          <p className="mt-3 max-w-3xl break-keep text-base leading-7 text-muted-foreground">
            Local HeadSlot은 100이고 network는 slot 140까지 전진했습니다. 이때 뒤쪽 range가 먼저 도착해도 왜 앞 구간부터 처리하며, initial sync가 끝날 때까지 gossip block을 무시할까요?
          </p>
        </div>
        <p>
          새 node가 checkpoint origin에서 시작해 몇 block을 처리한 뒤 <code>HeadSlot=100</code>이 됐다고 하겠습니다. Connected peer의 finalized 상태는 slot 128까지, local clock은 slot 140까지 전진했습니다. 설명에서는 queue의 한 batch를 4 slot로 줄여 101–104, 105–108, 109–112, 113–116 네 range를 봅니다.
        </p>
        <PrysmSyncFlowViz />
        <p className="text-lg leading-8">
          핵심은 <strong>network I/O 순서와 chain state 변경 순서를 분리하는 것</strong>입니다. Queue는 네 range를 미리 요청할 수 있지만 앞 state machine이 처리 가능한 상태를 벗어나기 전에는 뒤 response를 consumer에게 보내지 않습니다. Consumer가 block을 실제로 검증하고 저장해 <code>HeadSlot</code>을 바꿉니다.
        </p>
        <p>
          직전 <Link to="/cs/blockchain/prysm-finality#overview">최종성 글</Link>은 어떤 checkpoint를 되돌리기 어려운 anchor로 보는지 설명했습니다. 이 글은 그 anchor에서 current slot까지 자료를 가져오고 처리 권한을 live gossip 경로로 넘기는 과정을 맡습니다. 운영 환경의 peer 수·timeout·batch 크기 선정과 release 판단은 별도 실무 글의 책임입니다.
        </p>
        <ContentBoundary article="prysm-sync" />
      </section>

      <section id="case" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">입력</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4" aria-label="설명용 동기화 입력">
          {fixture.map(([label, value, detail]) => (
            <div key={label} className="min-w-0 bg-background p-4">
              <span className="text-[9px] font-bold text-muted-foreground">{label}</span>
              <strong className="mt-1 block break-keep text-sm">{value}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <p>
          Slot 값과 4-slot batch는 순서를 눈으로 확인하기 위한 설명용 값이며 mainnet에서 측정한 처리량이 아닙니다. Prysm v7.3.1은 실제로 설정한 block batch limit을 network 상한에 맞춰 사용하고, queue를 열 때 현재 head에서 최대 32 slot 뒤로 돌아가 이미 처리한 구간도 다시 확인할 수 있습니다. 아래에서는 그 복구 구간이 지나간 뒤의 다음 미처리 range만 확대합니다.
        </p>
      </section>

      <section id="checkpoint-sync" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Anchor</h2>
        <p>
          Checkpoint sync를 쓰면 Prysm의 <code>APIInitializer</code>가 remote beacon API에서 <code>finalized</code> state bytes를 받습니다. 이어서 그 state의 <code>latest_block_header.slot</code>에 해당하는 block bytes를 받습니다.
        </p>
        <p>
          그다음 state의 fork를 감지해 두 object를 decode합니다. Block body root가 state header의 body root와 같은지 확인한 뒤 block root와 state root를 계산합니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3" aria-label="Checkpoint origin의 세 책임">
          {[
            ["Remote API", "state bytes · block bytes", "다운로드 source"],
            ["Checkpoint initializer", "decode · body-root pairing", "내부 일관성 확인"],
            ["Database", "SaveOrigin", "처음 처리할 block·state 저장"],
          ].map(([owner, state, role]) => (
            <div key={owner} className="min-w-0 bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">{owner}</span>
              <strong className="mt-2 block break-keep text-xs">{state}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{role}</p>
            </div>
          ))}
        </div>
        <p>
          두 파일이 서로 맞는다는 사실과 그 checkpoint를 신뢰해도 된다는 사실은 다릅니다. 한 endpoint가 만든 self-consistent 대체 history도 내부 짝 검사는 통과할 수 있습니다. Network·epoch·checkpoint root와 확인 시각을 별도 신뢰 경로에서 확인하는 weak-subjectivity 경계는 <Link to="/cs/blockchain/prysm-finality#weak-subjectivity">최종성 글</Link>이 소유합니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="Checkpoint origin" onClick={() => sidebar.open("checkpoint-origin", codeRefs["checkpoint-origin"])} />
          <span className="text-xs text-muted-foreground">v7.3.1의 실제 download·pairing·SaveOrigin 경로입니다.</span>
        </div>
      </section>

      <section id="phases" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">두 구간</h2>
        <p>
          <code>roundRobinSync</code>는 한 번에 slot 140을 목표로 삼지 않습니다. 먼저 connected peer 상태에서 얻은 finalized epoch의 시작 slot까지 <code>modeStopOnFinalizedEpoch</code> queue로 따라갑니다. 이 사례에서는 head 100에서 finalized target 128까지입니다. 그 뒤 local current slot 140까지 <code>modeNonConstrained</code> queue를 다시 엽니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-[1fr_auto_1fr] sm:items-stretch" aria-label="Prysm initial sync의 두 단계">
          <div className="min-w-0 bg-background p-4">
            <span className="font-mono text-[9px] font-black text-primary">PHASE 1</span>
            <strong className="mt-2 block text-sm">100 → 128</strong>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">Finalized target까지 batch receiver로 처리합니다.</p>
          </div>
          <div className="hidden items-center bg-background px-3 text-primary sm:flex" aria-hidden>→</div>
          <div className="min-w-0 bg-background p-4">
            <span className="font-mono text-[9px] font-black text-primary">PHASE 2</span>
            <strong className="mt-2 block text-sm">128 → 140</strong>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">Non-finalized head까지 linear block을 처리합니다.</p>
          </div>
        </div>
        <p>
          두 단계 모두 peer 응답을 곧바로 정본으로 믿지 않습니다. 첫 단계는 <code>ReceiveBlockBatch</code>, 둘째 단계는 이미 처리한 prefix를 제거하고 linear parent 관계를 확인한 뒤 block별 <code>ReceiveBlock</code>로 넘깁니다. Queue mode는 목표 범위와 peer 선택 조건을 바꾸지만 consensus validation의 owner를 대신하지 않습니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="두 단계 Sync" onClick={() => sidebar.open("two-phase-sync", codeRefs["two-phase-sync"])} />
          <span className="text-xs text-muted-foreground">Finalized phase가 끝난 뒤 non-finalized phase가 시작됩니다.</span>
        </div>
      </section>

      <section id="initial-sync" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Range</h2>
        <p>
          <code>BeaconBlocksByRange</code> 요청은 start, count, step으로 slot 위치를 만듭니다. Empty slot에는 block이 없으므로 response object 수가 count와 같을 필요는 없습니다. Response가 요청 범위 안에 있다는 것만으로 parent가 이어지거나 선택한 branch가 올바르다는 사실도 확정되지 않습니다.
        </p>
        <ExplainedFormula
          question="Start 101, count 4, step 1인 range가 요청하는 slot은 무엇입니까?"
          idea="Start에서 step을 i번 더한 count개의 위치를 요청합니다. Empty slot은 response에서 빠질 수 있습니다."
          formula={String.raw`s_i=s_{start}+i\Delta s,\qquad 0\le i<c`}
          annotatedFormula={String.raw`s_i=\underbrace{s_{start}+i\Delta s}_{\text{i번째 요청 slot}},\qquad \underbrace{0\le i<c}_{\text{count개 위치}}`}
          operations={[
            { expression: String.raw`101+0\times1=101`, annotation: ["첫 요청 위치"] },
            { expression: String.raw`101+3\times1=104`, annotation: ["마지막 요청 위치", "i는 count−1까지"] },
            { expression: String.raw`\{101,102,103,104\}`, annotation: ["요청 위치 네 개", "102가 empty면 block response는 세 개일 수 있음"] },
          ]}
          terms={[
            { symbol: "s_{start}", name: "시작 슬롯", description: "Range의 첫 slot입니다." },
            { symbol: String.raw`\Delta s`, name: "Step", description: "연속 동기화에서는 1로 요청합니다." },
            { symbol: "c", name: "Count", description: "요청하는 slot 위치의 수입니다." },
          ]}
          assumptions={[
            "Request는 고정한 networking spec의 count·step 상한을 통과했습니다.",
            "Empty slot에는 placeholder block이 오지 않아도 됩니다.",
            "Slot 범위 검사는 parent·signature·state transition 검증을 대신하지 않습니다.",
          ]}
          interpretation="101–104 네 위치를 요청해도 102가 empty라면 101·103·104 세 block이 올 수 있습니다. 103 block의 parent와 transition을 확인해야 102가 비어 있던 시간을 안전하게 건너뜁니다."
        />

        <h3 className="break-keep text-xl font-bold">Lookahead</h3>
        <p>
          Prysm의 <code>blocksQueue</code>는 기본 코드에서 네 개의 lookahead state machine을 둡니다. 각 machine은 <code>new → scheduled → dataParsed → sent</code> 또는 <code>skipped</code>로 움직입니다. Fetcher가 109–112를 먼저 받아도 해당 machine은 response를 보관할 뿐입니다.
        </p>
        <pre className="not-prose overflow-x-auto border border-border bg-muted/20 p-4 text-[12px] font-normal leading-6"><code>{`// 네 range는 network I/O를 위해 미리 요청할 수 있습니다.
schedule(101..104)
schedule(105..108)
schedule(109..112)  // 이 response가 먼저 도착할 수 있습니다.
schedule(113..116)

// 뒤 range가 준비돼도 앞 machine이 아직 대기 중이면 보내지 않습니다.
if machine.is_first():
    send_to_consumer()
else if any_previous_machine_is(new, scheduled, dataParsed):
    wait()
else:
    send_to_consumer()

// Consumer가 받은 순서대로 blockchain receiver에 처리를 요청합니다.
receive_block_or_batch()`}</code></pre>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="Queue 상태" onClick={() => sidebar.open("queue-state-machine", codeRefs["queue-state-machine"])} />
          <CodeViewButton label="Ordered send" onClick={() => sidebar.open("ordered-range-send", codeRefs["ordered-range-send"])} />
          <span className="text-xs text-muted-foreground">Pseudocode와 실제 state machine handler를 나눠 봅니다.</span>
        </div>
      </section>

      <section id="owner" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Owner</h2>
        <p>
          Queue의 <code>stateSent</code>는 block이 consensus chain에 commit됐다는 영수증이 아닙니다. <code>fetchedData</code> channel로 ordered batch를 consumer에게 보냈다는 queue 상태입니다. 그 다음 <code>processFetchedData</code>가 blockchain service의 receiver를 호출합니다.
        </p>
        <div className="not-prose overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead><tr className="border-b border-border"><th className="p-3">상태</th><th className="p-3">유일한 writer</th><th className="p-3">의미</th></tr></thead>
            <tbody>
              {[
                ["Range FSM", "blocksQueue", "요청·응답·앞 range 대기·consumer 전달"],
                ["Peer request 결과", "blocksFetcher", "어느 peer가 어떤 block·sidecar를 반환했는지"],
                ["Block·post-state·HeadSlot", "blockchain receiver", "Consensus validation·state transition·저장 결과"],
                ["Initial sync 완료", "initial-sync Service", "synced atomic bool과 completion channel"],
                ["Live gossip decision", "regular sync validator", "Syncing 중 Ignore, 완료 뒤 정상 검증"],
              ].map(([state, owner, meaning]) => (
                <tr key={state} className="border-b border-border/70"><td className="p-3 font-mono text-xs text-primary">{state}</td><td className="p-3 font-bold">{owner}</td><td className="p-3 text-muted-foreground">{meaning}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          따라서 “가장 높은 response slot”이나 “queue가 sent로 바꾼 range”를 별도 durable sync cursor라고 부르면 owner가 달라집니다. Prysm queue는 다음 window를 치울 때 <code>Chain.HeadSlot()</code>을 다시 읽습니다. 실제 진척의 기준은 receiver가 전진시킨 chain head입니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="Receiver 호출" onClick={() => sidebar.open("receiver-owner", codeRefs["receiver-owner"])} />
          <span className="text-xs text-muted-foreground">Queue 전달과 chain mutation을 서로 다른 함수로 확인합니다.</span>
        </div>
      </section>

      <section id="regular-sync" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">전환</h2>
        <p>
          Regular sync service는 gossip topic을 구독할 수 있지만, beacon block validator는 <code>initialSync.Syncing()</code>이 true이면 remote block을 <code>ValidationIgnore</code>로 끝냅니다. 주석도 “완전히 sync되기 전에는 block을 처리하지 않되 propagation은 가능하다”고 경계를 밝힙니다.
        </p>
        <p>
          Initial sync의 두 phase가 끝나 <code>HeadSlot</code>이 current slot에 도달하면 <code>markSynced</code>가 atomic bool을 true로 바꿉니다. 동시에 completion channel을 닫습니다. 그 뒤 도착한 gossip block은 signature·parent·fork-choice 등 regular validation으로 들어갑니다.
        </p>
        <p>
          기존 글은 range와 gossip이 같은 block을 동시에 처리해 결과를 공유한다고 설명했습니다. 그러나 고정한 source에는 initial sync 완료 전 remote block을 막는 gate가 있으므로 그 설명을 제거했습니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-[1fr_auto_1fr] sm:items-stretch" aria-label="Initial sync와 live gossip의 처리 권한 전환">
          <div className="min-w-0 bg-background p-4">
            <span className="font-mono text-[9px] font-black text-primary">Syncing() = true</span>
            <strong className="mt-2 block text-sm">Range consumer가 chain을 따라잡음</strong>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">Gossip block은 ValidationIgnore입니다.</p>
          </div>
          <div className="hidden items-center bg-background px-3 text-primary sm:flex" aria-hidden>→</div>
          <div className="min-w-0 bg-background p-4">
            <span className="font-mono text-[9px] font-black text-primary">Synced() = true</span>
            <strong className="mt-2 block text-sm">Live validator가 block을 검증</strong>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">InitialSyncComplete channel도 닫힙니다.</p>
          </div>
        </div>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="완료 신호" onClick={() => sidebar.open("initial-sync-handoff", codeRefs["initial-sync-handoff"])} />
          <CodeViewButton label="Gossip gate" onClick={() => sidebar.open("gossip-sync-gate", codeRefs["gossip-sync-gate"])} />
          <span className="text-xs text-muted-foreground">한쪽이 끝난 뒤 다른 처리 경로가 열립니다.</span>
        </div>
      </section>

      <section id="failure" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실패 경계</h2>
        <div className="not-prose overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead><tr className="border-b border-border"><th className="p-3">상황</th><th className="p-3">시스템 동작</th><th className="p-3">전진하지 않는 상태</th></tr></thead>
            <tbody>
              {[
                ["뒤 range 먼저 도착", "dataParsed에 보관하고 앞 machine을 기다림", "fetchedData 순서 · HeadSlot"],
                ["Invalid fetched data", "응답 peer를 downscore하고 machine을 new로 되돌림", "해당 range · 뒤 range"],
                ["Block 0개", "machine을 skipped로 옮기고 다른 window·fork를 탐색", "해당 range를 처리했다는 주장"],
                ["Missing parent", "Receiver가 오류를 반환하고 현재 head를 유지", "후속 state transition"],
                ["Current slot 전진", "목표에 닿을 때 peer target을 다시 읽어 queue를 계속함", "조기 synced 선언"],
                ["Initial sync 진행 중", "Gossip block을 Ignore", "Live block의 chain mutation"],
              ].map(([situation, behavior, absent]) => (
                <tr key={situation} className="border-b border-border/70"><td className="p-3 font-mono text-xs text-primary">{situation}</td><td className="p-3">{behavior}</td><td className="p-3 text-muted-foreground">{absent}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Empty response 하나가 곧 peer 거짓말이라는 뜻은 아닙니다. Empty slot이 이어질 수 있기 때문입니다. 반대로 typed validation이 <code>ErrInvalidFetchedData</code>를 반환하면 peer fault evidence로 사용합니다. “자료 없음”, “invalid”, “parent 없음”, “local cancellation”을 같은 retry로 뭉치지 않는 이유입니다.
        </p>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">근거</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2">
          <a
            id="paper-ethereum-sync-network-spec"
            href="https://github.com/ethereum/consensus-specs/blob/aa16bb4c156184e9548a997d53efaf2a228a6304/specs/phase0/p2p-interface.md"
            target="_blank"
            rel="noreferrer"
            className="min-w-0 bg-background p-4 hover:bg-muted/30"
          >
            <span className="font-mono text-[10px] font-black text-primary">O · Protocol</span>
            <strong className="mt-2 block break-keep text-sm leading-6">Ethereum consensus-specs v1.7.0-beta.4 · aa16bb4c</strong>
            <p className="mt-3 break-keep text-xs leading-5 text-muted-foreground">Status와 BeaconBlocksByRange request·response의 wire semantics를 확인했습니다.</p>
            <p className="mt-2 break-keep text-xs leading-5"><strong>범위:</strong> Prysm queue의 lookahead 수, state machine과 receiver 호출 방식은 규정하지 않습니다.</p>
          </a>
          <a
            id="paper-prysm-sync-source"
            href="https://github.com/OffchainLabs/prysm/tree/96d418cd964b083e37519a9df274030a1beac7db/beacon-chain/sync/initial-sync"
            target="_blank"
            rel="noreferrer"
            className="min-w-0 bg-background p-4 hover:bg-muted/30"
          >
            <span className="font-mono text-[10px] font-black text-primary">O · Implementation</span>
            <strong className="mt-2 block break-keep text-sm leading-6">OffchainLabs Prysm v7.3.1 · 96d418cd</strong>
            <p className="mt-3 break-keep text-xs leading-5 text-muted-foreground">Checkpoint initializer, two-phase sync, queue FSM, ordered send, receiver와 synced gate를 확인했습니다.</p>
            <p className="mt-2 break-keep text-xs leading-5"><strong>범위:</strong> 이 release의 Fulu/Gloas-aware 구현이며 다른 client나 release의 내부 구조로 일반화하지 않습니다.</p>
          </a>
          <a
            id="paper-ethereum-sync-anchor-spec"
            href="https://github.com/ethereum/consensus-specs/blob/aa16bb4c156184e9548a997d53efaf2a228a6304/specs/phase0/weak-subjectivity.md"
            target="_blank"
            rel="noreferrer"
            className="min-w-0 bg-background p-4 hover:bg-muted/30"
          >
            <span className="font-mono text-[10px] font-black text-primary">O · Bootstrap boundary</span>
            <strong className="mt-2 block break-keep text-sm leading-6">Weak Subjectivity Guide · aa16bb4c</strong>
            <p className="mt-3 break-keep text-xs leading-5 text-muted-foreground">오래 offline인 node가 recent checkpoint를 신뢰 anchor로 확인하는 범위를 고정했습니다.</p>
            <p className="mt-2 break-keep text-xs leading-5"><strong>범위:</strong> 임의 endpoint의 self-consistent state·block pair를 자동으로 신뢰하게 만들지 않습니다.</p>
          </a>
          <a
            href="https://github.com/OffchainLabs/prysm/blob/96d418cd964b083e37519a9df274030a1beac7db/beacon-chain/sync/validate_beacon_blocks.go#L43-L57"
            target="_blank"
            rel="noreferrer"
            className="min-w-0 bg-background p-4 hover:bg-muted/30"
          >
            <span className="font-mono text-[10px] font-black text-primary">O · Handoff gate</span>
            <strong className="mt-2 block break-keep text-sm leading-6">Prysm live block validator · 96d418cd</strong>
            <p className="mt-3 break-keep text-xs leading-5 text-muted-foreground">Initial sync 중 remote gossip block을 Ignore하는 실제 경계를 확인했습니다.</p>
            <p className="mt-2 break-keep text-xs leading-5"><strong>범위:</strong> Ignore는 block validity 판정이나 peer 처벌이 아닙니다.</p>
          </a>
        </div>
      </section>

      <section id="self-check" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">확인 질문</h2>
        <ol className="space-y-4 pl-5 text-sm leading-7">
          <li>109–112 response가 101–104보다 먼저 와도 처리되지 않는 이유는 무엇입니까? <strong>(답: 뒤 state machine은 dataParsed에 머물고, 앞 machine이 new·scheduled·dataParsed 상태를 벗어나야 ordered consumer로 보낼 수 있기 때문입니다.)</strong></li>
          <li>Queue의 <code>stateSent</code>가 chain commit을 뜻하지 않는 이유는 무엇입니까? <strong>(답: Sent는 fetchedData channel로 전달했다는 queue 상태이고, block 검증·transition·저장·HeadSlot 변경은 blockchain receiver가 소유하기 때문입니다.)</strong></li>
          <li>Checkpoint state와 block의 body root가 맞아도 별도 trust anchor가 필요한 이유는 무엇입니까? <strong>(답: 한 provider가 self-consistent 대체 history를 줄 수 있으므로 내부 짝 확인만으로 network의 recent finalized history를 입증할 수 없기 때문입니다.)</strong></li>
          <li>Initial sync 중 gossip block을 Ignore하는 것이 왜 중요한가요? <strong>(답: Range consumer가 과거 state를 순서대로 전진시키는 동안 live validator가 같은 chain state에 별도 writer로 들어오지 않게 하기 때문입니다.)</strong></li>
        </ol>
      </section>

      <PrysmSyncMapReturn />

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
            label: "Prysm · Go",
            badgeClass: "bg-violet-500/10 border-violet-500 text-violet-700",
          },
        }}
      />
    </article>
  );
}
