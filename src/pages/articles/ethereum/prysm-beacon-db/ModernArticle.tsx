import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";
import { prysmTree } from "./fileTrees";
import PrysmBeaconDBLocator, { PrysmBeaconDBMapReturn } from "./PrysmBeaconDBLocator";
import PrysmBeaconDBFlowViz from "./viz/PrysmBeaconDBFlowViz";

const fixture = [
  ["Block A", "root 0x8a…31", "slot 64 · parent 0x10…aa"],
  ["Block B", "root 0x2f…b9", "slot 64 · parent 0x10…aa"],
  ["Root 조회", "한 원본", "root → encoded block"],
  ["Slot 조회", "두 후보", "64 → {A root, B root}"],
] as const;

export default function ModernArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <PrysmBeaconDBLocator />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">어디까지 한 번에 저장되는가</h2>
          <p className="mt-3 max-w-3xl break-keep text-base leading-7 text-muted-foreground">
            같은 slot 64에 경쟁하는 block 두 개가 들어왔습니다. Prysm은 두 block을 어떻게 모두 찾게 저장하며, block·index·state·finalized checkpoint 중 어디까지를 하나의 원자적 변경으로 묶을까요?
          </p>
        </div>
        <PrysmBeaconDBFlowViz />
        <p className="text-lg leading-8">
          결론부터 말하면 <strong>원자성의 범위는 BeaconDB 전체가 아니라 각 <code>db.Update</code> callback</strong>입니다. <code>SaveROBlocks</code>는 block 원본과 slot·parent index를 함께 씁니다. State와 finalized checkpoint는 각각 다른 함수와 다른 transaction에서 저장됩니다.
        </p>
        <p>
          직전 <Link to="/cs/blockchain/prysm-sync#owner">동기화 글</Link>에서 blockchain receiver가 검증과 저장을 요청하는 owner임을 확인했습니다. 이 글은 그 요청이 DB 안에서 어떤 key/value와 transaction으로 나뉘는지만 맡습니다. 어떤 branch가 head인지 결정하는 일은 <Link to="/cs/blockchain/prysm-forkchoice#overview">가지 선택</Link>의 책임이고, 운영 환경의 backup·disk·retention 정책은 별도 실무 글의 책임입니다.
        </p>
        <ContentBoundary article="prysm-beacon-db" />
      </section>

      <section id="case" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">입력</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4" aria-label="같은 slot의 경쟁 block 두 개">
          {fixture.map(([label, value, detail]) => (
            <div key={label} className="min-w-0 bg-background p-4">
              <span className="text-[9px] font-bold text-muted-foreground">{label}</span>
              <strong className="mt-1 block break-keep text-sm">{value}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <p>
          Slot 64와 두 축약 root는 저장 모양을 보기 위한 설명용 값입니다. Root <code>0x8a…31</code>과 <code>0x2f…b9</code>는 실제 mainnet block hash가 아닙니다. 중요한 점은 root가 block 원본을 식별하고, slot은 같은 시각에 제안된 후보들을 묶어 찾는 조회 기준이라는 것입니다.
        </p>
      </section>

      <section id="prepare" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">준비</h2>
        <p>
          <code>SaveROBlocks</code>는 곧바로 write transaction을 열지 않습니다. 먼저 <code>prepareBlockBatch</code>가 각 block의 root, slot·parent index 값, 저장할 blinded/full 표현과 encoded bytes를 계산합니다. 주석도 비싼 값을 transaction 밖에서 미리 계산한다고 밝힙니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch" aria-label="Block batch 준비 순서">
          <div className="min-w-0 bg-background p-4"><span className="text-[9px] font-bold text-muted-foreground">INPUT</span><strong className="mt-2 block text-sm">ROBlock A · B</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">이미 계산한 root를 포함합니다.</p></div>
          <div className="hidden items-center bg-background px-3 text-primary sm:flex" aria-hidden>→</div>
          <div className="min-w-0 bg-background p-4"><span className="text-[9px] font-bold text-muted-foreground">PREPARE</span><strong className="mt-2 block text-sm">slot · parent indices</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">조회 key와 root value를 만듭니다.</p></div>
          <div className="hidden items-center bg-background px-3 text-primary sm:flex" aria-hidden>→</div>
          <div className="min-w-0 bg-background p-4"><span className="text-[9px] font-bold text-muted-foreground">ENCODE</span><strong className="mt-2 block text-sm">block bytes</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">실패하면 transaction을 열지 않습니다.</p></div>
        </div>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="Batch 준비" onClick={() => sidebar.open("prepare-block-batch", codeRefs["prepare-block-batch"])} />
          <CodeViewButton label="Store와 buckets" onClick={() => sidebar.open("kv-store", codeRefs["kv-store"])} />
        </div>
      </section>

      <section id="block-transaction" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Block commit</h2>
        <p>
          준비가 끝나면 한 번의 <code>s.db.Update</code>가 열립니다. 각 새 root에 대해 <code>blocksBucket.Put(root, enc)</code>를 실행하고, 같은 transaction object를 <code>updateValueForIndices</code>에 넘겨 slot·parent index를 갱신합니다. Callback이 오류를 반환하면 bbolt write transaction은 commit되지 않습니다.
        </p>
        <ExplainedFormula
          question="Block 한 개가 이 transaction에서 바꾸는 logical mapping은 몇 개입니까?"
          idea="Prysm v7.3.1의 blockIndices는 slot index와 parent-root index 두 개를 만듭니다. 원본 primary record 하나를 더하면 세 mapping입니다."
          formula={String.raw`W_{\rm block}=1+2=3`}
          annotatedFormula={String.raw`W_{\rm block}=\underbrace{1}_{\text{root→block bytes}}+\underbrace{2}_{\text{slot·parent indices}}=3`}
          operations={[
            { expression: String.raw`1`, annotation: ["blocksBucket의 root→encoded block 한 건"] },
            { expression: String.raw`+2`, annotation: ["blockSlotIndicesBucket", "blockParentRootIndicesBucket"] },
            { expression: String.raw`=3`, annotation: ["한 block이 바꾸는 logical mapping", "disk page write 수와는 다름"] },
          ]}
          terms={[
            { symbol: "1", name: "Primary mapping", description: "Block root에서 encoded block으로 가는 원본 record입니다." },
            { symbol: "2", name: "Secondary mappings", description: "Slot과 parent root로 block root를 찾는 index입니다." },
            { symbol: "W_{\\rm block}", name: "Logical mappings", description: "이 source snapshot의 block 한 건이 transaction 안에서 바꾸는 key/value 관계 수입니다." },
          ]}
          assumptions={[
            "Prysm v7.3.1의 blockIndices 구현을 고정합니다.",
            "이미 같은 root가 있으면 해당 entry는 건너뜁니다.",
            "세 mapping은 bbolt page write·fsync가 정확히 세 번이라는 뜻이 아닙니다.",
          ]}
          interpretation="Block A와 B를 모두 새로 저장하면 최대 여섯 logical mapping을 갱신합니다. 다만 batch 전체는 같은 db.Update 안에 있으므로 뒤 block의 index 갱신이 실패하면 앞 block의 DB 변경도 함께 commit되지 않습니다."
        />
        <p>
          여기까지 묶이는 것은 block 원본과 두 block index입니다. Post-state와 finalized checkpoint는 이 callback에 없습니다. 따라서 “block이 저장됐으니 같은 root의 state와 checkpoint도 한 시점에 보인다”는 결론은 이 함수만으로 만들 수 없습니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="Block transaction" onClick={() => sidebar.open("save-block-batch", codeRefs["save-block-batch"])} />
        </div>
      </section>

      <section id="reads" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">조회</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2" aria-label="Root 조회와 slot 조회 비교">
          <div className="min-w-0 bg-background p-4"><span className="font-mono text-[9px] font-black text-primary">ROOT</span><strong className="mt-2 block text-sm">0x8a…31 → Block A</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">원본 identity를 알고 있을 때 primary record를 찾습니다.</p></div>
          <div className="min-w-0 bg-background p-4"><span className="font-mono text-[9px] font-black text-primary">SLOT</span><strong className="mt-2 block text-sm">64 → A root · B root</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">같은 slot의 후보 root 목록을 한 read transaction에서 가져옵니다.</p></div>
        </div>
        <p>
          <code>BlockRootsBySlot</code>의 반환형은 단일 root가 아니라 <code>[][32]byte</code>입니다. 같은 slot의 경쟁 block을 보존할 수 있는 모양입니다. 이 목록은 후보를 찾는 저장소 결과일 뿐, A와 B 중 어느 것이 canonical head인지 판정하지 않습니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="Slot으로 root 찾기" onClick={() => sidebar.open("read-block-roots-by-slot", codeRefs["read-block-roots-by-slot"])} />
        </div>
      </section>

      <section id="separate-transactions" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">별도 commit</h2>
        <p>
          State와 checkpoint는 block transaction에 따라붙는 field가 아닙니다. <code>SaveStates</code>는 state bytes를 미리 encode한 뒤 자체 <code>db.Update</code>에서 state slot index와 <code>stateBucket</code>을 갱신합니다. <code>SaveFinalizedCheckpoint</code>도 state 또는 summary 존재 여부를 확인한 뒤 자체 <code>db.Update</code>에서 checkpoint와 finalized-root index를 갱신합니다.
        </p>
        <div className="not-prose overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead><tr className="border-b border-border"><th className="p-3">함수</th><th className="p-3">같이 commit되는 상태</th><th className="p-3">포함되지 않는 상태</th></tr></thead>
            <tbody>
              {[
                ["SaveROBlocks", "block bytes · slot index · parent index", "state · checkpoint"],
                ["SaveStates", "state bytes · state slot index", "block · checkpoint"],
                ["SaveFinalizedCheckpoint", "checkpoint · finalized block roots", "새 block/state 저장"],
              ].map(([fn, together, outside]) => <tr key={fn} className="border-b border-border/70"><td className="p-3 font-mono text-xs text-primary">{fn}</td><td className="p-3">{together}</td><td className="p-3 text-muted-foreground">{outside}</td></tr>)}
            </tbody>
          </table>
        </div>
        <p>
          그러므로 상위 blockchain service가 block 저장 뒤 state 저장 전에 종료되면 두 함수 사이의 중간 상태가 생길 수 있습니다. 어떤 호출 순서로 복구하고 재실행하는지는 이 세 저장 함수의 공통 transaction이 아니라 상위 workflow와 idempotency 계약에서 확인해야 합니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="State transaction" onClick={() => sidebar.open("save-states", codeRefs["save-states"])} />
          <CodeViewButton label="Checkpoint transaction" onClick={() => sidebar.open("save-finalized-checkpoint", codeRefs["save-finalized-checkpoint"])} />
        </div>
      </section>

      <section id="cache-boundary" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Cache 경계</h2>
        <p>
          <code>SaveROBlocks</code>는 <code>db.Update</code> 호출이 돌아온 뒤 <code>updated</code>가 true인 entry를 block cache에 넣습니다. 그러나 현재 v7.3.1 코드는 <code>err</code>가 nil인지 확인하기 전에 cache loop로 들어갑니다. Batch 앞쪽 entry가 <code>updated=true</code>가 된 뒤 뒤쪽 entry에서 오류가 나면 bbolt transaction은 rollback되지만 앞쪽 entry의 flag는 남을 수 있습니다.
        </p>
        <div className="not-prose border-l-2 border-amber-500/70 bg-amber-500/5 p-4">
          <p className="text-xs font-bold text-amber-700 dark:text-amber-300">소스에서 확인한 위험 경계</p>
          <p className="mt-2 break-keep text-sm leading-6">이 경로는 “DB commit 성공 뒤에만 cache가 채워진다”는 강한 불변식을 소스만으로 증명하지 못합니다. 실제로 cache-only read가 가능한지, 해당 오류가 어떤 입력에서 발생하는지는 별도 fault-injection test가 필요합니다.</p>
        </div>
        <p>
          따라서 이 글은 old 설명의 “commit 뒤 cache publication” 문장을 사실처럼 유지하지 않습니다. Process 재시작 뒤 cache는 사라지므로 DB와 cache의 불일치를 찾을 때는 같은 요청을 재실행하고 cache hit·DB 존재 여부를 함께 관찰해야 합니다.
        </p>
      </section>

      <section id="pruning" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Prune</h2>
        <p>
          <code>DeleteHistoricalDataBeforeSlot</code>은 cutoff 이전 slot/root 쌍을 먼저 읽고, 한 write transaction에서 선택한 block·finalized-root index·state·state summary·validator hashes를 지웁니다. 이어서 block/state slot index와 process-local cache를 정리합니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3" aria-label="Historical pruning의 삭제 범위와 남은 경계">
          <div className="min-w-0 bg-background p-4"><span className="text-[9px] font-bold text-muted-foreground">선택</span><strong className="mt-2 block text-sm">slot/root pairs</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">별도 read 경로에서 batch를 정합니다.</p></div>
          <div className="min-w-0 bg-background p-4"><span className="text-[9px] font-bold text-muted-foreground">삭제</span><strong className="mt-2 block text-sm">block · state · indices</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">한 db.Update callback에서 정리합니다.</p></div>
          <div className="min-w-0 bg-background p-4 ring-2 ring-inset ring-primary"><span className="text-[9px] font-bold text-primary">별도 과제</span><strong className="mt-2 block text-sm">payload envelope</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">Payload block hash key라 이 loop로 지울 수 없습니다.</p></div>
        </div>
        <p>
          Gloas execution payload envelope는 beacon block root가 아니라 execution payload block hash로 key를 잡습니다. Source에도 secondary index나 cursor scan 같은 별도 pruning mechanism이 필요하다는 TODO가 남아 있습니다. “Historical prune이 모든 관련 object를 지운다”고 확대하면 안 됩니다.
        </p>
        <p>
          또 callback 안에서 context 취소를 만나면 현재 코드는 오류가 아닌 <code>nil</code>을 반환합니다. 이미 삭제한 entry가 있는 시점이라면 transaction이 그 부분까지 commit될 수 있고, 뒤의 slot-index/cache cleanup은 실행되지 않습니다. 이 역시 실제 장애 경로를 고정한 test가 필요한 지점입니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="Historical prune" onClick={() => sidebar.open("delete-history", codeRefs["delete-history"])} />
        </div>
      </section>

      <section id="failure" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실패 경계</h2>
        <div className="not-prose overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead><tr className="border-b border-border"><th className="p-3">상황</th><th className="p-3">확인되는 동작</th><th className="p-3">확정되지 않는 것</th></tr></thead>
            <tbody>
              {[
                ["Block encode 실패", "db.Update를 열기 전에 반환", "DB에 일부 batch가 기록됐다는 주장"],
                ["Block index 갱신 실패", "SaveROBlocks write transaction rollback", "Cache까지 반드시 비어 있다는 보장"],
                ["Block commit 뒤 state 전 실패", "Block transaction과 state transaction 사이 상태 가능", "전역 all-or-none commit"],
                ["Slot 64 조회", "한 db.View에서 root 목록 반환", "Canonical head 선택"],
                ["Prune 중 context 취소", "현재 callback은 nil 반환 경로 보유", "모든 index cleanup 완료"],
                ["Gloas payload envelope", "현재 slot/root loop에서 제외", "자동 삭제·용량 회수"],
              ].map(([situation, behavior, unknown]) => <tr key={situation} className="border-b border-border/70"><td className="p-3 font-mono text-xs text-primary">{situation}</td><td className="p-3">{behavior}</td><td className="p-3 text-muted-foreground">{unknown}</td></tr>)}
            </tbody>
          </table>
        </div>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">근거</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2">
          <a id="paper-prysm-beacon-db-source" href="https://github.com/OffchainLabs/prysm/tree/96d418cd964b083e37519a9df274030a1beac7db/beacon-chain/db/kv" target="_blank" rel="noreferrer" className="min-w-0 bg-background p-4 hover:bg-muted/30">
            <span className="font-mono text-[10px] font-black text-primary">O · Implementation</span>
            <strong className="mt-2 block break-keep text-sm leading-6">OffchainLabs Prysm v7.3.1 · 96d418cd</strong>
            <p className="mt-3 break-keep text-xs leading-5 text-muted-foreground">SaveROBlocks, BlockRootsBySlot, SaveStates, SaveFinalizedCheckpoint와 historical pruning의 실제 transaction 경계를 확인했습니다.</p>
            <p className="mt-2 break-keep text-xs leading-5"><strong>범위:</strong> 이 release의 source behavior이며 다른 client나 향후 schema에 일반화하지 않습니다.</p>
          </a>
          <a id="paper-bbolt-contract" href="https://github.com/etcd-io/bbolt/tree/v1.4.3" target="_blank" rel="noreferrer" className="min-w-0 bg-background p-4 hover:bg-muted/30">
            <span className="font-mono text-[10px] font-black text-primary">O · Storage engine</span>
            <strong className="mt-2 block break-keep text-sm leading-6">etcd-io bbolt v1.4.3</strong>
            <p className="mt-3 break-keep text-xs leading-5 text-muted-foreground">View·Update transaction과 callback error 시 rollback되는 storage-engine contract를 확인하는 기준입니다.</p>
            <p className="mt-2 break-keep text-xs leading-5"><strong>범위:</strong> Prysm의 호출 순서·cache·checkpoint·pruning correctness를 자동으로 보장하지 않습니다.</p>
          </a>
        </div>
      </section>

      <section id="self-check" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">확인 질문</h2>
        <ol className="space-y-4 pl-5 text-sm leading-7">
          <li>Slot 64 index가 A와 B 중 하나만 저장하면 안 되는 이유는 무엇입니까? <strong>(답: Slot은 canonical identity가 아니라 같은 slot의 후보를 찾는 조회 축이며, competing block 두 개가 서로 다른 root 원본을 가질 수 있기 때문입니다.)</strong></li>
          <li><code>SaveROBlocks</code>에서 한 번에 commit되는 범위는 어디까지입니까? <strong>(답: Block primary bytes와 slot·parent index입니다. State와 checkpoint는 다른 transaction입니다.)</strong></li>
          <li>현재 source만 보고 cache가 DB보다 먼저 보이지 않는다고 단정할 수 없는 이유는 무엇입니까? <strong>(답: Batch entry의 updated flag가 callback 안에서 설정되고, db.Update가 error를 반환해도 cache loop 전에 err를 검사하지 않기 때문입니다.)</strong></li>
          <li>Historical pruning이 모든 관련 data를 정리한다고 말할 수 없는 이유는 무엇입니까? <strong>(답: Gloas payload envelope는 다른 key를 사용해 현재 loop에서 제외되고, context 취소 경로의 부분 commit·index cleanup도 실험으로 확인해야 하기 때문입니다.)</strong></li>
        </ol>
      </section>

      <PrysmBeaconDBMapReturn />

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
