import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";
import { prysmTree } from "./fileTrees";
import PrysmSlotProcessingLocator, { PrysmSlotProcessingMapReturn } from "./PrysmSlotProcessingLocator";
import PrysmSlotProcessingFlowViz from "./viz/PrysmSlotProcessingFlowViz";

const Label = ({ children }: { children: ReactNode }) => (
  <span className="mr-2 inline-flex border border-primary/40 px-1.5 py-0.5 font-mono text-[9px] font-black text-primary">{children}</span>
);

export default function ModernArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <PrysmSlotProcessingLocator />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">
            Slot 30의 State는 Block이 없는 Slot 31·32를 지나 어떻게 Block 33 직전 State가 됩니까?
          </h2>
        </div>
        <PrysmSlotProcessingFlowViz />
        <p className="text-lg leading-8">
          <Label>A</Label>Slot은 block 번호가 아니라 consensus state가 따라가는 protocol clock입니다. Block이 오지 않은 slot도 recent root와 epoch 경계의 입력을 바꾸므로, Prysm은 target slot으로 숫자만 건너뛰지 않습니다. 현재 state에서 한 slot씩 <code>ProcessSlot → ProcessEpoch 조건 확인 → SetSlot → UpgradeState</code> 순서를 반복합니다.
        </p>
        <p>
          이 글은 slot 30에서 만들어진 state가 block 33을 받았다고 가정합니다. Slot 31과 32에는 block이 없습니다. 그래도 slot 30·31·32의 per-slot transition 세 번을 실행하고, slot 31에서 다음 slot 32가 epoch 시작인지 확인해 epoch transition을 한 번 실행한 뒤에야 state.slot이 33이 됩니다.
        </p>
        <p>
          <Link to="/cs/blockchain/prysm-beacon-state#state-root">BeaconState 글</Link>은 값에서 state root를 만드는 경계를 소유합니다. 이 글은 그 state를 시간 순서대로 전진시키는 책임만 다룹니다. Target에 도달한 뒤 block 33의 operations를 적용하는 과정은 <Link to="/cs/blockchain/prysm-block-processing#overview">block processing 글</Link>에서 이어집니다.
        </p>
        <ContentBoundary article="prysm-slot-processing" />
      </section>

      <section id="case" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">입력</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4" aria-label="Slot 30에서 33까지 전진하는 사례의 입력">
          {[
            ["현재 state", "state.slot = 30", "block 30을 적용한 뒤의 state"],
            ["Target", "block.slot = 33", "block operations 적용 전 도달할 slot"],
            ["빈 slot", "31 · 32", "block은 없지만 transition은 실행"],
            ["Preset", "E = 32 · H = 8,192", "epoch 길이와 recent-root window"],
          ].map(([label, value, detail]) => (
            <div key={label} className="min-w-0 bg-background p-4">
              <span className="text-[9px] font-bold text-muted-foreground">{label}</span>
              <strong className="mt-1 block break-keep text-sm">{value}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <p>
          30·33과 root 기호는 순서를 추적하기 위한 설명용 입력입니다. 핵심 invariant는 <strong>각 current slot의 root 기록이 먼저이고, epoch 처리는 다음 slot이 epoch 시작일 때 slot 증가보다 먼저이며, fork upgrade는 증가한 slot을 기준으로 실행된다</strong>는 점입니다.
        </p>
      </section>

      <section id="ordered-replay" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">ProcessSlots</h2>
        <p>
          Prysm v7.3.1의 <code>ProcessSlotsCore</code>는 아래 순서를 target에 도달할 때까지 반복합니다. <code>ProcessEpoch</code>는 매번 호출되지만 내부의 <code>CanProcessEpoch</code>가 경계가 아닌 slot에서는 아무 일도 하지 않습니다.
        </p>
        <pre className="not-prose overflow-x-auto border border-border bg-muted/20 p-4 text-[12px] font-normal leading-6"><code>{`for state.slot < target {
  // 현재 slot의 state root와 latest block root를 history에 기록합니다.
  state = ProcessSlot(state)

  // 다음 slot이 epoch 시작이면 지난 epoch의 fork별 처리를 실행합니다.
  state = ProcessEpoch(state)

  // Protocol clock을 한 칸 전진시킵니다.
  state.slot = state.slot + 1

  // 새 slot에서 활성화되는 fork schema가 있으면 state를 변환합니다.
  state = UpgradeState(state)
}`}</code></pre>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("process-slots-core", codeRefs["process-slots-core"])} />
          <span className="text-xs text-muted-foreground">Prysm v7.3.1의 실제 loop와 fork upgrade 순서</span>
        </div>
        <p>
          이 사례에서 첫 반복은 slot 30의 roots를 기록하고 31로 전진합니다. 두 번째 반복은 slot 31의 roots를 기록한 뒤, 다음 slot 32가 epoch 1의 시작이므로 epoch transition을 실행하고 32로 전진합니다. 세 번째 반복은 slot 32의 roots를 기록하고 33으로 전진합니다. 이제야 block 33을 적용할 pre-state가 됩니다.
        </p>
        <p>
          Strict <code>ProcessSlots</code>는 current와 같거나 더 작은 target을 오류로 거부합니다. 반면 <code>ProcessSlotsIfPossible</code>과 <code>ProcessSlotsIfNeeded</code> 같은 wrapper는 호출 목적에 따라 unchanged state를 돌려줄 수 있습니다. “Prysm이 과거 slot을 처리한다”가 아니라 <strong>어느 API 경계를 호출했는지</strong>까지 함께 봐야 합니다.
        </p>
      </section>

      <section id="process-slot" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">ProcessSlot</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-[1fr_auto_1fr_auto_1fr]" aria-label="현재 state root에서 historical roots까지의 순서">
          <div className="min-w-0 bg-background p-4"><span className="text-[9px] font-bold text-muted-foreground">STATE</span><strong className="mt-1 block text-xs">HashTreeRoot</strong><p className="mt-2 text-[10px] leading-4 text-muted-foreground">현재 slot state의 root 계산</p></div>
          <div className="flex items-center justify-center bg-background px-2 text-muted-foreground" aria-hidden>→</div>
          <div className="min-w-0 bg-background p-4"><span className="text-[9px] font-bold text-muted-foreground">HEADER</span><strong className="mt-1 block text-xs">Zero일 때만 backfill</strong><p className="mt-2 text-[10px] leading-4 text-muted-foreground">순환 의존성을 다음 slot에서 마무리</p></div>
          <div className="flex items-center justify-center bg-background px-2 text-muted-foreground" aria-hidden>→</div>
          <div className="min-w-0 bg-background p-4"><span className="text-[9px] font-bold text-muted-foreground">HISTORY</span><strong className="mt-1 block text-xs">State root · Block root</strong><p className="mt-2 text-[10px] leading-4 text-muted-foreground">같은 ring index에 기록</p></div>
        </div>
        <p>
          먼저 현재 state의 root를 계산해 <code>state_roots[index]</code>에 씁니다. Latest block header의 <code>state_root</code>가 zero라면 방금 계산한 root로 채운 뒤 header root를 계산합니다. 완성된 header root를 <code>block_roots[index]</code>에 기록하므로, backfill과 header hash의 순서를 바꾸면 다른 block root가 됩니다.
        </p>
        <ExplainedFormula
          question="현재 slot의 state root와 block root는 historical vector의 어느 칸에 기록합니까?"
          idea="최근 H개 slot의 root를 고정 길이 vector에 보관하므로 current slot s를 H로 나눈 나머지가 index입니다."
          formula={String.raw`i=s\bmod H`}
          annotatedFormula={String.raw`\underbrace{i}_{\text{기록할 칸}}=\underbrace{s}_{\text{현재 slot}}\bmod\underbrace{H}_{\text{history 길이}}`}
          operations={[
            { expression: String.raw`30\bmod8192=30`, annotation: ["slot 30의 state·block root를 index 30에 기록", "slot 8,222가 오면 같은 index를 덮음"] },
          ]}
          terms={[
            { symbol: "s", name: "Current slot", description: "지금 ProcessSlot이 처리하는 state.slot입니다." },
            { symbol: "H", name: "Historical-root window", description: "Preset의 SLOTS_PER_HISTORICAL_ROOT입니다." },
            { symbol: "i", name: "Ring index", description: "state_roots와 block_roots에 함께 쓰는 위치입니다." },
          ]}
          assumptions={["Mainnet preset의 H=8,192를 예로 사용합니다.", "Index는 0부터 시작합니다.", "같은 index가 같은 slot generation을 뜻하지 않습니다."]}
          interpretation="Slot 30은 index 30에 기록됩니다. H slot 뒤에는 같은 칸이 덮이므로 ring vector는 최근 조회 창이지 영구 archive가 아닙니다."
        />
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("process-slot", codeRefs["process-slot"])} />
          <span className="text-xs text-muted-foreground">State root, zero-header backfill, block root의 실제 순서</span>
        </div>
        <p>
          Gloas가 활성화된 state에서는 같은 함수가 다음 slot의 execution-payload availability도 false로 초기화합니다. 이는 v7.3.1의 fork별 추가 동작입니다. 모든 network가 현재 이 branch를 실행한다고 일반화하면 안 됩니다.
        </p>
      </section>

      <section id="boundary" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Epoch와 Fork</h2>
        <p>
          Slot 31에서 <code>(31 + 1) mod 32 = 0</code>이므로, slot 32로 올리기 전에 epoch processing이 실행됩니다. 이 순서는 “새 epoch의 첫 state를 만들기 전에 직전 epoch의 누적 정보를 정산한다”는 뜻입니다. 어떤 balances·participation·checkpoint가 바뀌는지는 <Link to="/cs/blockchain/prysm-epoch-processing#overview">epoch processing 글</Link>이 소유합니다.
        </p>
        <p>
          Epoch 처리가 끝나면 <code>SetSlot(32)</code>를 실행하고, 그다음 <code>UpgradeState</code>가 slot 32에서 활성화되는 fork를 확인합니다. Fork activation이 있으면 old schema에 field를 덧붙이는 것이 아니라 fork별 upgrade 함수가 새 BeaconState schema를 만듭니다. 이 경계는 <Link to="/cs/blockchain/prysm-beacon-state#state-fork">BeaconState의 fork schema</Link>로 돌아갑니다.
        </p>
      </section>

      <section id="cost" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Step 수</h2>
        <ExplainedFormula
          question="Current slot c에서 target t까지 몇 번의 per-slot step과 epoch transition을 실행합니까?"
          idea="각 current slot을 한 번씩 처리하므로 per-slot step은 차이와 같습니다. Epoch transition은 열린 구간 (c, t] 안에 있는 epoch 시작점의 개수입니다."
          formula={String.raw`N_s=t-c,\qquad N_e=\left\lfloor\frac{t}{E}\right\rfloor-\left\lfloor\frac{c}{E}\right\rfloor`}
          annotatedFormula={String.raw`\underbrace{N_s}_{\text{per-slot 횟수}}=\underbrace{t-c}_{\text{건너가는 clock 칸}},\qquad \underbrace{N_e}_{\text{epoch 처리 횟수}}=\underbrace{\left\lfloor\frac{t}{E}\right\rfloor-\left\lfloor\frac{c}{E}\right\rfloor}_{(c,t]\text{ 안 epoch 시작점}}`}
          operations={[
            { expression: String.raw`33-30=3`, annotation: ["slot 30·31·32에서 ProcessSlot 실행", "slot 33은 block 적용 전 target"] },
            { expression: String.raw`\lfloor33/32\rfloor-\lfloor30/32\rfloor=1`, annotation: ["구간 (30,33]의 epoch 시작점은 32 하나", "slot 31 처리 뒤 epoch transition 실행"] },
          ]}
          terms={[
            { symbol: "c", name: "Current slot", description: "입력 state의 시작 slot입니다." },
            { symbol: "t", name: "Target slot", description: "Block processing 전에 도달할 slot입니다." },
            { symbol: "E", name: "Slots per epoch", description: "Network preset의 epoch 길이입니다." },
            { symbol: "N_s,N_e", name: "Step counts", description: "Per-slot과 epoch-boundary 처리 횟수입니다." },
          ]}
          assumptions={["t>c입니다.", "Slot을 순서대로 빠짐없이 적용합니다.", "Fork별 함수 비용과 cache 효과는 횟수 식에 포함하지 않습니다."]}
          interpretation="c=30, t=33, E=32이면 per-slot step은 3번이고 epoch transition은 1번입니다. 이 횟수만으로 실행 시간을 알 수는 없습니다."
        />
      </section>

      <section id="skip-slot-cache" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">SkipSlotCache</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3" aria-label="SkipSlotCache의 입력, 동작, 경계">
          {[
            ["Key", "hash(start slot || latest header root)", "같은 slot의 다른 fork를 구분"],
            ["Value", "BeaconState copy · LRU 8", "호출자가 cache 원본을 직접 바꾸지 않음"],
            ["Lifetime", "프로세스 메모리", "재시작 뒤 남는 protocol 장부가 아님"],
          ].map(([label, value, detail]) => (
            <div key={label} className="min-w-0 bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">{label}</span>
              <strong className="mt-1 block break-keep text-xs">{value}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <p>
          Prysm은 긴 empty-slot 구간을 같은 시작점에서 여러 번 계산할 때 중간 state를 재사용합니다. Cache key는 시작 state의 slot과 latest block header root를 섞어 만듭니다. 같은 slot이라도 fork가 다르면 latest header root가 달라지므로 cache entry가 섞이지 않아야 합니다.
        </p>
        <p>
          같은 key 계산이 진행 중이면 다른 caller는 완료를 기다립니다. Context가 취소되면 target 성공을 기록하는 대신, 이미 전진한 가장 높은 state를 in-memory cache에 복사해 둘 수 있습니다. 프로세스가 종료되면 사라지므로 이를 “재시작 가능한 receipt”나 durable progress로 부르면 안 됩니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("skip-slot-cache", codeRefs["skip-slot-cache"])} />
          <CodeViewButton onClick={() => sidebar.open("skip-slot-cache-test", codeRefs["skip-slot-cache-test"])} />
          <span className="text-xs text-muted-foreground">Cache identity와 서로 다른 fork를 섞지 않는 source test</span>
        </div>
      </section>

      <section id="failure-boundary" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실패 경계</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4">
          {[
            ["Target", "current ≥ target", "Strict ProcessSlots는 오류"],
            ["Root", "HashTreeRoot 실패", "해당 step에서 중단"],
            ["Epoch·Fork", "transition 오류", "slot 33 도달로 취급하지 않음"],
            ["Cache", "miss·취소·재시작", "정본 순서를 다시 계산할 수 있어야 함"],
          ].map(([guard, state, result]) => (
            <div key={guard} className="min-w-0 bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">{guard}</span>
              <strong className="mt-1 block break-keep text-xs">{state}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{result}</p>
            </div>
          ))}
        </div>
        <p>
          Cache hit은 protocol correctness의 근거가 아닙니다. Prysm source test는 cache를 사용한 transition과 원본 transition의 state가 같아야 하며, 같은 slot에서 갈라진 두 fork를 동시에 처리해도 각 expected root가 유지돼야 한다고 검사합니다. 실패하면 cache entry를 성공한 target state처럼 반환해서는 안 됩니다.
        </p>
        <p>
          어느 release를 배포할지, empty-slot gap이 얼마나 길 때 cache를 켤지, parity와 latency를 어떤 workload에서 측정할지는 운영 환경의 판단입니다. 이 개념 글은 그 결정에 필요한 protocol 순서와 cache 경계까지만 확정합니다.
        </p>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">근거</h2>
        <CitationBlock citeKey={1} source="Ethereum consensus-specs v1.7.0-beta.4 @ aa16bb4c" href="https://github.com/ethereum/consensus-specs/tree/aa16bb4c156184e9548a997d53efaf2a228a6304">
          <p><Label>O</Label><code>process_slots</code>, <code>process_slot</code>, epoch-boundary 순서와 Gloas의 next payload availability 초기화를 확인했습니다.</p>
          <p><strong>범위:</strong> Protocol 순서의 정본입니다. Prysm의 SkipSlotCache 자료구조와 성능을 규정하지 않습니다.</p>
        </CitationBlock>
        <CitationBlock citeKey={2} type="code" source="OffchainLabs Prysm v7.3.1 @ 96d418cd" href="https://github.com/OffchainLabs/prysm/blob/96d418cd964b083e37519a9df274030a1beac7db/beacon-chain/core/transition/transition.go">
          <p><Label>O</Label><code>ProcessSlot</code>, <code>ProcessSlots</code>, <code>ProcessSlotsCore</code>, fork별 <code>ProcessEpoch</code>와 <code>UpgradeState</code>의 실제 호출 경계를 확인했습니다.</p>
          <p><strong>범위:</strong> 이 release의 구현 snapshot입니다. 다른 Prysm release의 함수 배치와 동작을 자동으로 증명하지 않습니다.</p>
        </CitationBlock>
        <CitationBlock citeKey={3} type="code" source="Prysm v7.3.1 SkipSlotCache source·tests @ 96d418cd" href="https://github.com/OffchainLabs/prysm/blob/96d418cd964b083e37519a9df274030a1beac7db/beacon-chain/core/transition/skip_slot_cache_test.go">
          <p><Label>O</Label>Cache가 process-local LRU라는 점, state copy를 반환하는 점, cached transition parity와 같은 slot의 서로 다른 fork를 섞지 않는 test를 확인했습니다.</p>
          <p><strong>범위:</strong> Repository test가 명시한 invariant입니다. Production hit rate·지연·장애율은 측정하지 않았습니다.</p>
        </CitationBlock>
        <p><Label>A</Label>Slot 30→33 사례는 위 순서를 한 화면에서 세기 위한 설명용 입력입니다. 실제 mainnet state bytes나 root를 재현한 측정 결과가 아닙니다.</p>
      </section>

      <section id="self-check" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">확인 질문</h2>
        <ol className="space-y-3 pl-5 text-sm leading-6">
          <li>Slot 31과 32에 block이 없어도 ProcessSlot을 실행하는 이유는 무엇입니까? <strong>(답: Recent state·block root와 epoch·fork 경계는 block 유무와 별개로 protocol clock에 따라 바뀌기 때문입니다.)</strong></li>
          <li>Slot 31의 epoch transition은 왜 SetSlot(32)보다 먼저 실행합니까? <strong>(답: 다음 slot 32가 새 epoch의 시작이므로, 직전 epoch의 state를 slot 31에서 정산한 뒤 clock을 32로 올리기 때문입니다.)</strong></li>
          <li>Latest header state root를 backfill한 뒤에 header root를 계산해야 하는 이유는 무엇입니까? <strong>(답: Zero placeholder를 실제 previous state root로 채운 완성 header가 block root의 입력이기 때문입니다.)</strong></li>
          <li>SkipSlotCache를 재시작 가능한 장부라고 부를 수 없는 이유는 무엇입니까? <strong>(답: 프로세스 메모리의 작은 LRU이며 종료 뒤 남지 않고 protocol state의 정본도 아니기 때문입니다.)</strong></li>
        </ol>
      </section>

      <PrysmSlotProcessingMapReturn />

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
