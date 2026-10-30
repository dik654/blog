import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";
import { prysmTree } from "./fileTrees";
import PrysmBeaconStateLocator, { PrysmBeaconStateMapReturn } from "./PrysmBeaconStateLocator";
import PrysmBeaconStateFlowViz from "./viz/PrysmBeaconStateFlowViz";

const Label = ({ children }: { children: ReactNode }) => (
  <span className="mr-2 inline-flex border border-primary/40 px-1.5 py-0.5 font-mono text-[9px] font-black text-primary">{children}</span>
);

export default function ModernArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <PrysmBeaconStateLocator />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">
            복사한 BeaconState의 Balance 하나를 바꾸면 왜 원본은 그대로이고 새 State Root만 바뀝니까?
          </h2>
        </div>
        <PrysmBeaconStateFlowViz />
        <p className="text-lg leading-8">
          <Label>A</Label>BeaconState는 다음 consensus transition이 읽는 protocol snapshot입니다. Prysm은 같은 parent에서 여러 후보를 계산할 때 이 큰 값을 매번 통째로 복제하지 않습니다. State마다 ID를 부여하고 큰 collection과 Merkle cache를 공유 가능한 view로 만든 뒤, 특정 view가 값을 바꾸면 그 view의 값과 hash path만 분리합니다.
        </p>
        <p>
          이 글은 parent state A를 B로 복사하고 B의 validator index 5 balance를 32 ETH에서 31 ETH로 바꾸는 한 경로만 추적합니다. <strong>Copy → state ID별 값 분리 → dirty field·element 기록 → SSZ chunk 좌표 변환 → Balances field root → BeaconState root</strong>가 한 영수증으로 이어져야 합니다.
        </p>
        <p>
          <Link to="/cs/blockchain/prysm-ssz#merkleize">SSZ 글</Link>은 값에서 root를 만드는 규칙을 소유합니다. 이 글은 그 규칙을 큰 mutable state에서 안전하게 재사용하는 Prysm의 구현 경계를 다룹니다. Slot·epoch·block이 실제로 어떤 field를 바꾸는지는 다음 글부터 이어집니다.
        </p>
        <ContentBoundary article="prysm-beacon-state" />
      </section>

      <section id="case" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">원본 A와 후보 B가 같은 Balance를 읽는 상태에서 시작합니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3" aria-label="BeaconState balance 변경 사례의 입력">
          {[
            ["Parent view", "State A · root R₀", "validator 5 balance = 32 ETH"],
            ["Copied view", "State B · root R₀", "Copy 직후에는 같은 protocol value"],
            ["Mutation", "B[5] = 31 ETH", "A[5]는 32 ETH로 남아야 함"],
          ].map(([label, value, detail]) => (
            <div key={label} className="min-w-0 bg-background p-4">
              <span className="text-[9px] font-bold text-muted-foreground">{label}</span>
              <strong className="mt-1 block break-keep text-sm">{value}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <p>
          A와 B의 root 기호는 특정 mainnet state의 실제 hash를 뜻하지 않습니다. 이번 사례가 확인할 invariant는 숫자 자체가 아니라 <strong>Copy 직후에는 같은 value·root, B를 수정한 뒤에는 A의 value·root 유지, B의 value·root만 변경</strong>입니다.
        </p>
      </section>

      <section id="state-copy" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Copy는 전체 Slice를 복제하지 않고 새 State ID를 등록합니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4" aria-label="Prysm BeaconState Copy가 나누는 것과 공유하는 것">
          {[
            ["Primitive", "slot 등", "값을 바로 복사"],
            ["Large collection", "balances·validators", "multi-value container 공유"],
            ["Mutation receipt", "dirty field·index", "view마다 독립 map"],
            ["Merkle cache", "FieldTrie view", "CopyTrie로 분기 준비"],
          ].map(([kind, example, action]) => (
            <div key={kind} className="min-w-0 bg-background p-4">
              <span className="text-[9px] font-bold text-muted-foreground">{kind}</span>
              <strong className="mt-1 block break-keep text-xs">{example}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{action}</p>
            </div>
          ))}
        </div>
        <p>
          Prysm v7.3.1의 balances는 단순한 공유 slice 뒤에 전체 field를 복사하는 구조가 아닙니다. <code>MultiValueBalances</code>가 원본 값과 state ID별 변경값을 구분합니다. 따라서 “balance 하나를 쓰면 balances 전체를 복사한다”는 이전 설명은 현재 구현을 과도하게 단순화한 것이었습니다.
        </p>
        <p>
          <code>Copy()</code>는 새 ID를 만든 뒤 multi-value field에 A와 B가 어떤 값을 읽는지 등록하고, dirty map과 FieldTrie view는 B가 독립적으로 갱신할 수 있게 준비합니다. 공유는 메모리 최적화이고, protocol 관점에서 A와 B는 여전히 각각 완전한 BeaconState value입니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("state-copy", codeRefs["state-copy"])} />
          <span className="text-xs text-muted-foreground">Prysm v7.3.1의 state ID·multi-value field·FieldTrie 복사 경계</span>
        </div>
      </section>

      <section id="balance-update" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Setter는 B의 값과 Dirty 영수증을 함께 바꿉니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3" aria-label="Balance setter의 세 가지 결과">
          {[
            ["값", "B 전용 index 5 = 31 ETH", "A는 원본 32 ETH를 계속 읽음"],
            ["Field", "dirtyFields[Balances]", "어느 top-level leaf가 바뀌었는지 표시"],
            ["Element", "dirtyIndices[Balances] += 5", "field 안의 어느 값을 다시 hash할지 표시"],
          ].map(([kind, value, meaning]) => (
            <div key={kind} className="min-w-0 bg-background p-4">
              <span className="text-[9px] font-bold text-muted-foreground">{kind}</span>
              <strong className="mt-1 block break-keep text-xs">{value}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{meaning}</p>
            </div>
          ))}
        </div>
        <p>
          <code>UpdateBalancesAtIndex</code>는 먼저 multi-value container에서 B가 읽을 index 5를 갱신하고, 이어 Balances field와 element index 5를 B의 dirty receipt에 남깁니다. 범위를 벗어난 index는 값 변경 단계에서 거부됩니다.
        </p>
        <p>
          Getter가 mutable backing slice를 노출하거나 caller가 setter를 우회하면 값과 root cache가 서로 다른 state를 설명할 수 있습니다. 그래서 controlled setter는 단순한 편의 API가 아니라 value mutation과 commitment invalidation을 한 경계에 묶는 장치입니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("balance-update", codeRefs["balance-update"])} />
          <span className="text-xs text-muted-foreground">State ID별 값 분리와 dirty field·index 기록</span>
        </div>
      </section>

      <section id="dirty-path" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Element Index 5는 SSZ Chunk Index 1로 바뀝니다</h2>
        <ExplainedFormula
          question="Balance index 5를 바꾸면 어느 32-byte leaf chunk가 바뀝니까?"
          idea="Balance 하나는 uint64라서 8 bytes입니다. SSZ basic list는 32-byte chunk 하나에 uint64 네 개를 순서대로 pack합니다."
          formula={String.raw`e=\frac{32}{8}=4,\qquad c=\lfloor\frac{i}{e}\rfloor=\lfloor\frac{5}{4}\rfloor=1`}
          annotatedFormula={String.raw`\underbrace{e}_{\text{chunk당 balance 수}}=\frac{\underbrace{32}_{\text{chunk bytes}}}{\underbrace{8}_{\text{uint64 bytes}}}=4,\qquad \underbrace{c}_{\text{dirty chunk}}=\lfloor\frac{\underbrace{i}_{5}}{e}\rfloor=1`}
          operations={[
            { expression: String.raw`32/8=4`, annotation: ["SSZ chunk는 32 bytes", "balance는 uint64 8 bytes", "chunk 하나에 balance 네 개"] },
            { expression: String.raw`\lfloor5/4\rfloor=1`, annotation: ["index는 0부터 시작", "0~3은 chunk 0", "4~7은 chunk 1"] },
          ]}
          terms={[
            { symbol: "i", name: "Element index", description: "Setter가 기록한 validator balance의 위치입니다." },
            { symbol: "e", name: "Elements per chunk", description: "32-byte SSZ chunk 하나에 pack되는 uint64 개수입니다." },
            { symbol: "c", name: "Chunk index", description: "FieldTrie가 실제로 다시 만드는 leaf chunk의 위치입니다." },
          ]}
          assumptions={["Balances field는 SSZ List[uint64, limit]입니다.", "Index는 0부터 시작합니다.", "같은 chunk의 여러 dirty element는 chunk index 하나로 합칩니다."]}
          interpretation="Validator index 5는 두 번째 32-byte chunk에 들어갑니다. Index 4·5·6·7 가운데 여러 값이 함께 바뀌어도 leaf chunk는 하나만 다시 만듭니다."
        />
        <p>
          Prysm은 setter 단계에서 element index 5를 보존하고, <code>FieldTrie</code>가 field의 data type을 보고 chunk index로 바꿉니다. Element 좌표와 chunk 좌표를 일찍 섞으면 다른 leaf를 갱신할 수 있으므로 변환 책임을 한 곳에 둡니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("field-trie-recompute", codeRefs["field-trie-recompute"])} />
          <span className="text-xs text-muted-foreground">공유 trie 분기와 CompressedArray element→chunk 변환</span>
        </div>
      </section>

      <section id="state-root" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">두 Merkle Path를 차례로 올려 B의 Root만 바꿉니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-[1fr_auto_1fr_auto_1fr]" aria-label="Dirty balance에서 BeaconState root까지의 두 Merkle path">
          <div className="min-w-0 bg-background p-4"><span className="text-[9px] font-bold text-muted-foreground">CHUNK</span><strong className="mt-1 block text-xs">Balances chunk 1</strong><p className="mt-2 text-[10px] leading-4 text-muted-foreground">31 ETH를 포함한 새 packed leaf</p></div>
          <div className="flex items-center justify-center bg-background px-2 text-muted-foreground" aria-hidden>→</div>
          <div className="min-w-0 bg-background p-4"><span className="text-[9px] font-bold text-muted-foreground">FIELD PATH</span><strong className="mt-1 block text-xs">새 Balances root</strong><p className="mt-2 text-[10px] leading-4 text-muted-foreground">변경 leaf의 ancestor 갱신</p></div>
          <div className="flex items-center justify-center bg-background px-2 text-muted-foreground" aria-hidden>→</div>
          <div className="min-w-0 bg-background p-4"><span className="text-[9px] font-bold text-muted-foreground">STATE PATH</span><strong className="mt-1 block text-xs">새 state root R₁</strong><p className="mt-2 text-[10px] leading-4 text-muted-foreground">Balances field leaf의 ancestor 갱신</p></div>
        </div>
        <p>
          Balances FieldTrie가 공유 중이면 B용 trie view를 먼저 분기합니다. 새 chunk와 그 조상으로 Balances field root를 만든 다음, BeaconState container의 Balances leaf를 교체하고 top-level 조상을 다시 계산합니다. 변경되지 않은 sibling subtree는 같은 schema와 generation 안에서 재사용합니다.
        </p>
        <p>
          Prysm source test <code>TestBeaconState_AppendBalanceWithTrie</code>는 여러 balance update와 append 뒤 cached Balances root를 전체 <code>Uint64ListRoot</code> 계산 결과와 비교합니다. Progressive state test는 복사본의 slot만 바꾼 뒤 복사본 root가 달라지고 원본 root가 유지되는지도 확인합니다. 이 parity가 성능 최적화보다 먼저 지켜야 할 correctness 조건입니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("state-root", codeRefs["state-root"])} />
          <span className="text-xs text-muted-foreground">Dirty field root와 top-level BeaconState root 갱신</span>
        </div>
      </section>

      <section id="state-fork" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Fork가 바뀌면 같은 State에 Field를 덧붙이는 것이 아닙니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3" aria-label="Phase0에서 Altair로 BeaconState schema를 바꾸는 과정">
          {[
            ["1 · 보존", "기존 공통 field", "slot·roots·validators·balances·checkpoints"],
            ["2 · 변환", "기존 기록에서 파생", "pending attestation → participation bits"],
            ["3 · 계산", "새 protocol field", "current·next sync committee"],
          ].map(([step, value, detail]) => (
            <div key={step} className="min-w-0 bg-background p-4">
              <span className="text-[9px] font-bold text-muted-foreground">{step}</span>
              <strong className="mt-1 block break-keep text-xs">{value}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <p>
          Prysm의 Altair upgrade는 old state의 공통 field를 새 schema에 옮기고 participation 배열과 inactivity score를 validator 수에 맞춰 준비합니다. 여기서 끝나지 않고 과거 attestation을 participation bits로 번역하며, helper로 계산한 sync committee를 현재와 다음 field에 넣습니다.
        </p>
        <p>
          그러므로 root는 bytes만의 식별자가 아닙니다. 어떤 network·fork schema·preset으로 그 bytes를 해석했는지가 함께 고정돼야 합니다. 알 수 없는 미래 fork를 가장 최신으로 아는 schema에 억지로 decode하면 다른 object를 정상 state처럼 만들 수 있으므로 거부해야 합니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("altair-upgrade", codeRefs["altair-upgrade"])} />
          <span className="text-xs text-muted-foreground">공통 field 보존과 Altair 파생값 계산 경계</span>
        </div>
      </section>

      <section id="failure-boundary" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">값·Dirty Receipt·Cache 가운데 하나라도 어긋나면 실패해야 합니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4">
          {[
            ["Value isolation", "A와 B의 값", "B write가 A를 바꾸지 않음"],
            ["Mutation receipt", "field·element 좌표", "모든 setter가 dirty 기록"],
            ["Merkle cache", "field·state path", "같은 schema·generation만 재사용"],
            ["Protocol identity", "fork·network·root", "schema를 모르면 reject"],
          ].map(([guard, state, invariant]) => (
            <div key={guard} className="min-w-0 bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">{guard}</span>
              <strong className="mt-1 block break-keep text-xs">{state}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{invariant}</p>
            </div>
          ))}
        </div>
        <p>
          가장 위험한 실패는 프로세스가 즉시 멈추는 경우가 아니라, B의 backing value가 바뀌었는데 dirty index가 빠져 예전 cached root를 정상 값처럼 반환하는 경우입니다. Incremental path에서 오류가 나면 새 trie view를 사용해야 한다는 source contract도 지켜야 합니다. 오류를 무시하고 기존 cache를 반환해서는 안 됩니다.
        </p>
        <p>
          어느 release를 배포할지, root parity를 어떤 workload로 측정할지, mismatch 뒤 어떻게 롤백할지는 개념 자체가 아니라 운영 환경의 판단입니다. 이 글은 그 실무 결정의 입력이 되는 invariant까지만 확정합니다.
        </p>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">고정한 Spec과 Release에서 확인한 범위만 사용합니다</h2>
        <CitationBlock citeKey={1} source="Ethereum consensus-specs v1.6.1 @ 5fa6edcc" href="https://github.com/ethereum/consensus-specs/tree/5fa6edcca8ab4cf548653e6680b17b9d3e04d225">
          <p><Label>O</Label>Fork별 BeaconState container, SSZ hash-tree-root와 state transition·upgrade 규칙을 확인했습니다.</p>
          <p><strong>범위:</strong> Protocol value와 root의 정본입니다. Prysm의 multi-value slice·FieldTrie 자료구조와 성능을 규정하지 않습니다.</p>
        </CitationBlock>
        <CitationBlock citeKey={2} type="code" source="OffchainLabs Prysm v7.3.1 @ 96d418cd" href="https://github.com/OffchainLabs/prysm/tree/96d418cd964b083e37519a9df274030a1beac7db/beacon-chain/state">
          <p><Label>O</Label><code>Copy</code>, <code>UpdateBalancesAtIndex</code>, dirty field·index, FieldTrie와 <code>HashTreeRoot</code>의 실제 호출 경계를 확인했습니다.</p>
          <p><strong>범위:</strong> 이 release의 native state implementation입니다. 과거 Prysm 버전의 전체-field COW 설명이나 미래 progressive SSZ 경로를 현재 모든 fork에 일반화하지 않습니다.</p>
        </CitationBlock>
        <CitationBlock citeKey={3} type="code" source="Prysm v7.3.1 state tests @ 96d418cd" href="https://github.com/OffchainLabs/prysm/blob/96d418cd964b083e37519a9df274030a1beac7db/beacon-chain/state/state-native/state_test.go">
          <p><Label>O</Label>Balance update·append 뒤 incremental Balances root와 전체 list root가 같아야 한다는 test, copy를 수정해도 원본 root가 유지되는 progressive-state test를 확인했습니다.</p>
          <p><strong>범위:</strong> Repository test가 명시한 invariant입니다. 이 글에서는 해당 test suite의 처리 시간·메모리·production 장애율을 측정하지 않았습니다.</p>
        </CitationBlock>
        <p><Label>A</Label>32 ETH→31 ETH 사례는 실제 호출 순서를 한 번에 보기 위한 설명용 입력입니다. Mainnet state bytes와 root를 재현했다고 주장하지 않습니다.</p>
      </section>

      <section id="self-check" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">확인 질문</h2>
        <ol className="space-y-3 pl-5 text-sm leading-6">
          <li>Copy 직후 A와 B가 같은 balances container를 가리켜도 독립 state value인 이유는 무엇입니까? <strong>(답: 서로 다른 state ID가 각 index에서 읽을 값을 구분하고, mutation receipt와 trie view도 state별로 관리되기 때문입니다.)</strong></li>
          <li>Validator index 5가 chunk index 1이 되는 이유는 무엇입니까? <strong>(답: uint64 네 개가 32-byte chunk 하나에 들어가므로 floor(5/4)=1입니다.)</strong></li>
          <li>Dirty field와 dirty index를 둘 다 기록하는 이유는 무엇입니까? <strong>(답: top-level에서 어느 field leaf를 바꿀지와 그 field 안에서 어느 element·chunk path를 바꿀지를 각각 알아야 하기 때문입니다.)</strong></li>
          <li>Cached root가 빠르게 계산됐다는 사실만으로 올바르다고 할 수 없는 이유는 무엇입니까? <strong>(답: 값 격리·dirty 기록·schema generation이 맞아야 하며 full SSZ root와의 parity가 correctness 기준이기 때문입니다.)</strong></li>
          <li>Altair upgrade를 새 field에 0을 넣는 일로만 설명할 수 없는 이유는 무엇입니까? <strong>(답: 과거 attestation을 participation으로 번역하고 sync committee를 계산하는 파생 규칙이 있기 때문입니다.)</strong></li>
        </ol>
      </section>

      <PrysmBeaconStateMapReturn />

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
