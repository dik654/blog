import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";
import { prysmTree } from "./fileTrees";
import PrysmStateCacheLocator, { PrysmStateCacheMapReturn } from "./PrysmStateCacheLocator";
import PrysmStateCacheFlowViz from "./viz/PrysmStateCacheFlowViz";

const fixture = [
  ["요청", "block root 0x105…", "slot 105 block의 post-state"],
  ["중간 block", "slot 102 · root 0x102…", "parent는 0x100…"],
  ["시작 state", "slot 100 · root 0x100…", "DB에 full state가 있음"],
  ["비어 있는 slot", "101 · 103 · 104", "block 없이 slot transition만 실행"],
] as const;

export default function ModernArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <PrysmStateCacheLocator />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">없는 state를 어디서부터 다시 만드는가</h2>
          <p className="mt-3 max-w-3xl break-keep text-base leading-7 text-muted-foreground">
            요청한 block root의 post-state가 cache와 DB에 없습니다. Prysm은 어떤 state에서 시작해 어느 block을 어떤 순서로 replay하며, 반환된 state는 caller가 바꿔도 될까요?
          </p>
        </div>
        <PrysmStateCacheFlowViz />
        <p className="text-lg leading-8">
          결론부터 말하면 Prysm v7.3.1은 <strong>block root로 cache와 DB를 조회한 뒤, 같은 branch의 가장 가까운 저장 state에서 빈 slot과 저장 block을 다시 적용</strong>합니다. 일반 cache hit는 <code>Copy()</code>를 반환하지만 NoCopy 경로는 공유 object를 read-only로 빌립니다.
        </p>
        <p>
          앞 글에서 <Link to="/cs/blockchain/prysm-beacon-db#separate-transactions">full state와 block이 서로 다른 transaction에서 저장될 수 있음</Link>을 확인했습니다. 이 글은 full state가 없는 root를 다시 계산하는 경로만 맡습니다. 어떤 branch가 canonical head인지 고르는 일은 <Link to="/cs/blockchain/prysm-forkchoice#overview">fork-choice</Link>, 저장 기간과 운영 정책을 정하는 일은 별도 실무 글의 책임입니다.
        </p>
        <ContentBoundary article="prysm-state-cache" />
      </section>

      <section id="case" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">입력</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4" aria-label="Slot 100 state에서 slot 105 state를 재구성하는 설명용 입력">
          {fixture.map(([label, value, detail]) => (
            <div key={label} className="min-w-0 bg-background p-4">
              <span className="text-[9px] font-bold text-muted-foreground">{label}</span>
              <strong className="mt-1 block break-keep text-sm">{value}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <p>
          Slot과 축약 root는 한 요청을 끝까지 따라가기 위한 설명용 값입니다. <code>StateByRoot</code>의 입력은 state root가 아니라 <strong>block root</strong>입니다. 반환값은 그 block을 적용한 뒤의 BeaconState입니다. 같은 slot의 다른 branch는 다른 block root로 조회합니다.
        </p>
      </section>

      <section id="lookup" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">조회 순서</h2>
        <p>
          <code>loadStateByRoot</code>는 먼저 최대 32개 entry의 hot LRU를 확인합니다. 다음은 최대 8개 epoch-start state를 보관하는 FIFO입니다. 두 cache가 모두 miss면 DB의 full state를 확인하고, 그것도 없을 때만 summary와 replay 경로로 넘어갑니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4" aria-label="StateByRoot lookup ladder">
          {[
            ["1", "Hot LRU", "root 0x105… · miss"],
            ["2", "Epoch FIFO", "root 0x105… · miss"],
            ["3", "BeaconDB state", "root 0x105… · miss"],
            ["4", "Replay", "summary + ancestor + blocks"],
          ].map(([order, name, result]) => (
            <div key={order} className="min-w-0 bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">{order}</span>
              <strong className="mt-2 block text-sm">{name}</strong>
              <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">{result}</p>
            </div>
          ))}
        </div>
        <p>
          Cache miss는 “그 state가 유효하지 않다”는 판정이 아닙니다. 더 비싼 저장소 또는 재구성 경로를 사용하라는 조회 결과일 뿐입니다. Cache는 finality나 canonical branch도 결정하지 않습니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="Lookup ladder" onClick={() => sidebar.open("lookup-ladder", codeRefs["lookup-ladder"])} />
          <CodeViewButton label="DB or replay" onClick={() => sidebar.open("db-or-replay", codeRefs["db-or-replay"])} />
        </div>
      </section>

      <section id="copy-boundary" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">누가 state를 소유하는가</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3" aria-label="State 반환 경로별 소유권">
          {[
            ["StateByRoot", "Cache hit는 Copy", "caller가 받은 mutable state와 cache를 분리"],
            ["StateByRootNoCopy", "ReadOnly shared object", "복사 비용을 피하지만 mutation 금지"],
            ["DB · replay", "Caller-owned result", "cache에서 꺼낸 shared object가 아님"],
          ].map(([api, value, detail]) => (
            <div key={api} className="min-w-0 bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">{api}</span>
              <strong className="mt-2 block break-keep text-sm">{value}</strong>
              <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <p>
          Hot cache의 일반 <code>get</code>과 epoch-boundary cache의 일반 조회는 모두 <code>Copy()</code>를 호출합니다. 반면 NoCopy API는 같은 cached object를 <code>ReadOnlyBeaconState</code>로 반환합니다. Lock은 lookup 동안 map을 보호할 뿐, 반환 뒤 underlying state를 임의로 바꾸는 행위까지 안전하게 만들지는 않습니다.
        </p>
        <p>
          초기 동기화용 <code>StateByRootInitialSync</code>는 선형 block batch를 전제로 cached pre-state를 복사하지 않고 mutation할 수 있는 별도 예외입니다. 함수는 parent root entry를 나중에 hot cache에서 지웁니다. Source에도 block tree가 적용되는 일반 경로에서는 사용하지 말라는 경고가 있습니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="Hot cache" onClick={() => sidebar.open("hot-copy-boundary", codeRefs["hot-copy-boundary"])} />
          <CodeViewButton label="Epoch cache" onClick={() => sidebar.open("epoch-cache", codeRefs["epoch-cache"])} />
        </div>
      </section>

      <section id="summary" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Summary는 경로가 아니다</h2>
        <p>
          기존 설명처럼 StateSummary가 anchor와 replay path를 저장한다고 보면 실제 구현을 잘못 이해하게 됩니다. v7.3.1의 summary가 이 경로에 제공하는 값은 목표 block의 <code>Slot</code>과 <code>Root</code>입니다. Summary가 없으면 저장된 block을 읽어 이 두 field를 다시 만들고 DB에 저장합니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-[1fr_auto_1fr] sm:items-stretch" aria-label="StateSummary와 latestAncestor 역할 분리">
          <div className="min-w-0 bg-background p-4"><span className="text-[9px] font-bold text-muted-foreground">SUMMARY</span><strong className="mt-2 block text-sm">목표 slot 105</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">목표 block root 0x105…</p></div>
          <div className="hidden items-center bg-background px-3 text-primary sm:flex" aria-hidden>≠</div>
          <div className="min-w-0 bg-background p-4"><span className="text-[9px] font-bold text-muted-foreground">ANCESTOR SEARCH</span><strong className="mt-2 block text-sm">시작 state 100</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">Parent root와 cache·DB를 따라 별도로 찾음</p></div>
        </div>
        <p>
          따라서 “summary가 slot 100 anchor를 가리킨다”거나 “summary에 block 102·105 경로가 들어 있다”는 설명은 이 release의 구현과 맞지 않습니다. Target metadata, ancestor 탐색, ancestry query는 서로 다른 단계입니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="Summary와 ancestor" onClick={() => sidebar.open("summary-and-ancestor", codeRefs["summary-and-ancestor"])} />
        </div>
      </section>

      <section id="ancestor" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">같은 branch의 시작 state</h2>
        <p>
          <code>latestAncestor</code>는 목표 block 105를 읽고 parent root 0x102…부터 확인합니다. Hot cache, finalized-state cache, epoch-boundary cache와 DB에 state 102가 없으면 block 102를 읽어 그 parent root 0x100…으로 이동합니다. DB가 state 100을 반환하면 탐색을 멈춥니다.
        </p>
        <div className="not-prose grid grid-cols-5 gap-px bg-border p-px" aria-label="Parent root를 따라가는 ancestor 탐색">
          <div className="min-w-0 bg-background p-3 text-center"><span className="text-[8px] text-muted-foreground">TARGET</span><strong className="mt-1 block text-xs">block 105</strong></div>
          <div className="flex items-center justify-center bg-background text-primary" aria-hidden>←</div>
          <div className="min-w-0 bg-background p-3 text-center"><span className="text-[8px] text-muted-foreground">PARENT</span><strong className="mt-1 block text-xs">block 102</strong></div>
          <div className="flex items-center justify-center bg-background text-primary" aria-hidden>←</div>
          <div className="min-w-0 bg-background p-3 text-center ring-2 ring-inset ring-primary"><span className="text-[8px] text-primary">STATE HIT</span><strong className="mt-1 block text-xs">state 100</strong></div>
        </div>
        <p>
          Checkpoint sync로 과거 block coverage에 구멍이 있고 필요한 parent slot이 제공 범위 밖이면 <code>ErrNoDataForSlot</code>로 중단합니다. 무관한 branch의 같은 slot block을 대신 사용하는 fallback은 없습니다.
        </p>
      </section>

      <section id="ancestry-order" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Block 순서</h2>
        <p>
          <code>loadBlocks</code>는 시작 slot 101, 목표 slot 105, descendant root 0x105…로 <code>AncestryQuery</code>를 만듭니다. BeaconDB는 descendant에서 parent 방향으로 block 105와 102를 모은 뒤 두 배열을 <code>slices.Reverse</code>합니다. Replay가 실제로 받는 순서는 <strong>block 102 → block 105</strong>입니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2" aria-label="Ancestry 수집 순서와 replay 반환 순서">
          <div className="min-w-0 bg-background p-4"><span className="text-[9px] font-bold text-muted-foreground">DB에서 수집</span><strong className="mt-2 block text-sm">105 → 102</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">Descendant에서 parent로 이동합니다.</p></div>
          <div className="min-w-0 bg-background p-4 ring-2 ring-inset ring-primary"><span className="text-[9px] font-bold text-primary">Replay에 반환</span><strong className="mt-2 block text-sm">102 → 105</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">배열을 뒤집어 protocol 시간 순서를 만듭니다.</p></div>
        </div>
        <p>
          여기에는 확인할 만한 source 불일치가 있습니다. <code>replay.go</code>의 <code>loadBlocks</code> 주석은 “slot-descending order”라고 쓰지만, 실제 <code>blocksAncestryQuery</code>는 반환 직전에 배열을 뒤집습니다. 이 글은 주석이 아니라 호출되는 구현을 기준으로 설명합니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="Ancestry ordering" onClick={() => sidebar.open("ancestry-order", codeRefs["ancestry-order"])} />
        </div>
      </section>

      <section id="replay" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Replay</h2>
        <p>
          Replay는 block만 연달아 적용하지 않습니다. 먼저 state 100을 block 102의 slot까지 <code>ReplayProcessSlots</code>로 전진시키고 block 102를 적용합니다. 다음에는 state 102를 slot 105까지 전진시키고 block 105를 적용합니다. 빈 slot 101·103·104도 per-slot transition에 포함됩니다.
        </p>
        <ExplainedFormula
          question="이 설명용 경로에서 slot transition과 block transition은 각각 몇 번입니까?"
          idea="저장 state의 slot 100에서 첫 block 102까지 두 번, 다시 target block 105까지 세 번 slot을 전진합니다. 실제 block은 102와 105 두 개를 적용합니다."
          formula={String.raw`N_{slot}=(102-100)+(105-102)=5,\qquad N_{block}=2`}
          annotatedFormula={String.raw`N_{slot}=\underbrace{2}_{100\rightarrow102}+\underbrace{3}_{102\rightarrow105}=5,\quad N_{block}=\underbrace{1}_{B_{102}}+\underbrace{1}_{B_{105}}=2`}
          operations={[
            { expression: String.raw`102-100=2`, annotation: ["State 100에서 block 102 직전까지", "slot processing 두 번"] },
            { expression: String.raw`105-102=3`, annotation: ["Block 102 post-state에서 block 105 직전까지", "slot processing 세 번"] },
            { expression: String.raw`1+1=2`, annotation: ["저장 block 102 적용", "저장 block 105 적용"] },
          ]}
          terms={[
            { symbol: "N_{slot}", name: "Per-slot transition 수", description: "빈 slot과 block이 있는 slot을 포함해 state.slot을 목표까지 올리는 반복 횟수입니다." },
            { symbol: "N_{block}", name: "Block transition 수", description: "같은 ancestry에서 실제로 저장되어 있는 block을 적용한 횟수입니다." },
          ]}
          assumptions={[
            "State 100은 block 100을 적용한 post-state입니다.",
            "같은 branch에는 slot 102와 105에만 block이 있습니다.",
            "이 식은 작업 횟수이며 실제 지연 시간이나 I/O 성능 측정값이 아닙니다.",
          ]}
          interpretation="Anchor가 더 과거로 이동하면 per-slot과 block transition 수가 늘어날 수 있습니다. 하지만 실제 비용은 state 크기, epoch transition, DB I/O와 copy 비용도 함께 측정해야 합니다."
        />
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="Replay loop" onClick={() => sidebar.open("replay", codeRefs["replay"])} />
        </div>
      </section>

      <section id="save" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">다음 조회를 위한 저장</h2>
        <p>
          새 post-state를 <code>SaveState</code>에 넘기면 epoch 시작 slot인 경우 epoch-boundary FIFO에 copied state를 먼저 넣습니다. 그다음 DB에 <code>{`{Slot, Root}`}</code> summary를 저장하고, 성공하면 hot LRU에 state를 넣습니다. Hot cache의 <code>put</code> 자체는 <code>Copy()</code>를 호출하지 않습니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3" aria-label="SaveState의 기본 cache와 summary 갱신 순서">
          <div className="min-w-0 bg-background p-4"><span className="font-mono text-[9px] font-black text-primary">1 · 조건부</span><strong className="mt-2 block text-sm">Epoch FIFO put</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">Epoch-start state만 Copy해서 저장합니다.</p></div>
          <div className="min-w-0 bg-background p-4"><span className="font-mono text-[9px] font-black text-primary">2 · 지속</span><strong className="mt-2 block text-sm">StateSummary save</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">Slot과 block root를 DB에 씁니다.</p></div>
          <div className="min-w-0 bg-background p-4"><span className="font-mono text-[9px] font-black text-primary">3 · 메모리</span><strong className="mt-2 block text-sm">Hot LRU put</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">전달받은 state object를 그대로 넣습니다.</p></div>
        </div>
        <p>
          Source 주석은 “copied state”를 hot cache에 넣는다고 표현하지만 실제 <code>put</code>에는 Copy가 없습니다. 일반 read가 Copy를 반환하는 사실과 write-side object ownership은 별도입니다. Epoch-start에서 summary 저장이 실패하면 앞서 채운 process-local epoch cache가 남을 수 있다는 것도 이 호출 순서에서 확인되는 경계입니다. 실제 오염이나 장애 빈도는 측정하지 않았습니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="Save order" onClick={() => sidebar.open("save-boundary", codeRefs["save-boundary"])} />
        </div>
      </section>

      <section id="trust" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">검증을 반복하지 않는 이유</h2>
        <p>
          <code>executeStateTransitionStateGen</code>은 일반 block 수신 경로와 같은 validator가 아닙니다. Source는 이 함수가 DB에 이미 저장된 block과 state만 다루므로 signature 검증과 SSZ hashing 계산을 생략할 수 있다고 명시합니다. 실제로 <code>ProcessBlockForStateRoot</code>는 proposer·RANDAO·attestation signature를 검증하지 않고, 계산한 post-state root를 block의 <code>state_root</code>와 비교하지도 않습니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2" aria-label="새 block 검증과 저장 block replay의 책임 비교">
          <div className="min-w-0 bg-background p-4"><span className="text-[9px] font-bold text-muted-foreground">새로 받은 block</span><strong className="mt-2 block text-sm">검증 뒤 저장</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">Signature·state root·execution·availability 경계를 통과해야 합니다.</p></div>
          <div className="min-w-0 bg-background p-4 ring-2 ring-inset ring-primary"><span className="text-[9px] font-bold text-primary">State generation replay</span><strong className="mt-2 block text-sm">검증된 저장물 재사용</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">Slot과 block transition을 다시 실행하되 일부 검증은 반복하지 않습니다.</p></div>
        </div>
        <p>
          따라서 DB의 block에서 <code>state_root</code> field만 잘못 바뀐 경우 이 replay 함수 하나만으로 mismatch를 발견한다고 말할 수 없습니다. 이 경로를 미검증 network input에 사용하면 신뢰 경계를 깨뜨립니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="Replay trust boundary" onClick={() => sidebar.open("replay-trust", codeRefs["replay-trust"])} />
        </div>
      </section>

      <section id="failure" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실패하면 어디서 멈추는가</h2>
        <div className="not-prose overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead><tr className="border-b border-border"><th className="p-3">상황</th><th className="p-3">확인되는 동작</th><th className="p-3">확정할 수 없는 것</th></tr></thead>
            <tbody>
              {[
                ["Target summary 없음", "저장 block에서 Slot·Root를 복구해 저장 시도", "Block도 없는데 임의 경로 생성"],
                ["Parent block 없음", "Ancestor 탐색이 오류로 중단", "같은 slot의 다른 branch 사용"],
                ["Checkpoint-sync coverage 밖", "ErrNoDataForSlot 반환", "누락 구간을 자동 다운로드"],
                ["Slot 또는 block transition 실패", "replayBlocks가 nil·error 반환", "완성되지 않은 state 반환"],
                ["Context 취소", "Ancestor/replay 경로가 취소 오류로 종료", "뒤 단계까지 계속 실행"],
                ["Stored block state_root 불일치", "ProcessBlockForStateRoot는 비교하지 않음", "Replay 자체가 corruption oracle이라는 주장"],
                ["Summary save 실패", "Hot LRU put 전 반환", "Epoch-start cache도 반드시 rollback됨"],
              ].map(([situation, behavior, unknown]) => <tr key={situation} className="border-b border-border/70"><td className="p-3 font-mono text-xs text-primary">{situation}</td><td className="p-3">{behavior}</td><td className="p-3 text-muted-foreground">{unknown}</td></tr>)}
            </tbody>
          </table>
        </div>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">근거</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2">
          <a id="paper-prysm-stategen-source" href="https://github.com/OffchainLabs/prysm/tree/96d418cd964b083e37519a9df274030a1beac7db/beacon-chain/state/stategen" target="_blank" rel="noreferrer" className="min-w-0 bg-background p-4 hover:bg-muted/30">
            <span className="font-mono text-[10px] font-black text-primary">O · Implementation</span>
            <strong className="mt-2 block break-keep text-sm leading-6">OffchainLabs Prysm v7.3.1 · 96d418cd</strong>
            <p className="mt-3 break-keep text-xs leading-5 text-muted-foreground">Cache 크기·copy 경계, lookup ladder, StateSummary, latestAncestor, ancestry query, replay와 SaveState 순서를 확인했습니다.</p>
            <p className="mt-2 break-keep text-xs leading-5"><strong>범위:</strong> 이 release의 source behavior입니다. Moving develop나 다른 consensus client에 일반화하지 않습니다.</p>
          </a>
          <a id="paper-consensus-state-transition" href="https://github.com/ethereum/consensus-specs/tree/aa16bb4c156184e9548a997d53efaf2a228a6304/specs" target="_blank" rel="noreferrer" className="min-w-0 bg-background p-4 hover:bg-muted/30">
            <span className="font-mono text-[10px] font-black text-primary">O · Protocol</span>
            <strong className="mt-2 block break-keep text-sm leading-6">Ethereum consensus-specs · aa16bb4c</strong>
            <p className="mt-3 break-keep text-xs leading-5 text-muted-foreground">Per-slot, epoch-boundary와 block transition의 protocol 순서 및 일반 검증 경계를 확인했습니다.</p>
            <p className="mt-2 break-keep text-xs leading-5"><strong>범위:</strong> Protocol transition의 정본입니다. Prysm의 cache 크기, DB schema나 copy 정책은 규정하지 않습니다.</p>
          </a>
        </div>
      </section>

      <section id="self-check" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">확인 질문</h2>
        <ol className="space-y-4 pl-5 text-sm leading-7">
          <li><code>StateByRoot</code>의 root는 무엇을 식별합니까? <strong>(답: 목표 post-state와 대응하는 block root입니다. State root나 slot 하나가 아닙니다.)</strong></li>
          <li>StateSummary가 replay 시작 state를 직접 알려주지 않는 이유는 무엇입니까? <strong>(답: Summary에는 목표 Slot과 Root만 있고, 시작 state는 parent root를 따라 cache·DB를 검사해 별도로 찾기 때문입니다.)</strong></li>
          <li>DB가 descendant에서 parent 방향으로 block을 모아도 replay가 시간 순서로 실행되는 이유는 무엇입니까? <strong>(답: blocksAncestryQuery가 반환 직전에 block·root 배열을 뒤집기 때문입니다.)</strong></li>
          <li>일반 cache hit와 NoCopy hit의 차이는 무엇입니까? <strong>(답: 일반 get은 Copy를 반환하지만 NoCopy는 같은 cached object를 read-only interface로 공유합니다.)</strong></li>
          <li>State-generation replay를 새 block validator로 쓸 수 없는 이유는 무엇입니까? <strong>(답: 이미 검증·저장된 block을 전제로 signature와 최종 state-root 비교를 생략하기 때문입니다.)</strong></li>
        </ol>
      </section>

      <PrysmStateCacheMapReturn />

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
