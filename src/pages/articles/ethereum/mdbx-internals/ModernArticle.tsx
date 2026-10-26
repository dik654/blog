import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import StorageEngineLocator, { StorageEngineMapReturn } from "../lsm-tree/StorageEngineLocator";
import MdbxGenerationViz from "./viz/MdbxGenerationViz";

export default function ModernArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <StorageEngineLocator current="mdbx-internals" />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">Reader가 이전 page를 보는 동안 writer는 어떻게 새 세대를 확정할까요?</h2>
        </div>
        <MdbxGenerationViz />
        <p className="text-lg leading-8">Reader R1이 key A가 든 leaf page를 읽는 동안 writer가 A를 바꾼다고 하겠습니다. 기존 page를 제자리에서 덮으면 R1의 snapshot이 읽는 중간에 달라집니다. MDBX는 R1이 보는 page graph를 남겨 두고 변경된 leaf에서 root까지 새 path를 만든 뒤, 새 root를 가리키는 transaction generation을 공개합니다.</p>
        <p>이 흐름에는 서로 다른 세 경계가 있습니다. <code>mmap</code>은 file page에 접근하는 방법이고, Copy-on-Write는 old reader와 new writer가 page graph를 공유하는 방법이며, meta publish는 이후 reader가 어떤 root를 시작점으로 고를지 바꾸는 transaction 경계입니다. 어느 하나도 그 자체로 stable media 도달을 뜻하지 않습니다.</p>
      </section>

      <section id="page-map" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Mapped address, resident page, B+ tree lookup은 서로 다른 층입니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
          {[
            ["File", "Page 번호와 offset", "meta·root·branch·leaf bytes"],
            ["OS", "Virtual mapping과 page cache", "page fault·resident·writeback"],
            ["MDBX", "B+ tree page graph", "separator·cursor·transaction generation"],
          ].map(([title, role, detail]) => (
            <div key={title} className="bg-background p-4">
              <strong className="text-sm">{title}</strong>
              <p className="mt-2 text-xs font-semibold leading-5">{role}</p>
              <p className="mt-1 text-[10px] leading-4 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <p>Root page 1에서 branch page 8을 거쳐 leaf page 42의 key를 찾는다면 logical B+ tree path는 세 pages입니다. MDBX는 database file을 process virtual address에 map하므로 별도의 library buffer cache에서 file bytes를 한 번 더 복사하지 않고 그 page를 읽을 수 있습니다. 그러나 cold page가 RAM에 없으면 첫 접근에서 OS page fault와 storage I/O가 생길 수 있습니다.</p>
        <p>100GB file을 map했다고 RSS가 곧 100GB가 되는 것도 아니고, I/O가 사라지는 것도 아닙니다. Map geometry는 접근 가능한 주소 범위를, RSS는 현재 resident인 memory를, major fault는 storage에서 가져온 page를 설명합니다. Page size·접근 locality·OS cache 상태를 함께 기록해야 logical tree height와 실제 latency를 연결할 수 있습니다.</p>
      </section>

      <section id="transaction" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Writer는 변경 path를 복사하고 새 meta가 시작점을 바꿉니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <div className="bg-background p-4">
            <span className="text-[9px] font-bold text-muted-foreground">R1 · txid 100</span>
            <p className="mt-2 font-mono text-sm font-black">root 1 → branch 8 → leaf 42</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">A=old를 읽는 기존 graph</p>
          </div>
          <div className="hidden bg-background px-3 text-center font-black text-primary sm:block">CoW</div>
          <div className="bg-background p-4">
            <span className="text-[9px] font-bold text-muted-foreground">Writer · txid 101</span>
            <p className="mt-2 font-mono text-sm font-black text-primary">root 2 → branch 18 → leaf 52</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">A=new를 담은 새 graph</p>
          </div>
        </div>
        <p>Writer 101은 leaf 52만 새로 만드는 것으로 끝나지 않습니다. Leaf를 가리키는 branch와 그 위 root도 새 page version으로 만들고, 새 transaction number와 root를 담은 일관된 meta를 공개합니다. 공개 전에는 root 1 graph가 완전하고, 공개 뒤 새 reader에게는 root 2 graph가 완전해야 합니다.</p>
        <p>Reader는 transaction 시작 때 선택한 meta와 transaction ID를 snapshot으로 고정합니다. Meta 101이 공개된 뒤에도 R1은 root 1을 계속 걷고, 그 뒤 시작한 R2는 root 2를 고릅니다. Writer는 한 시점에 하나로 직렬화되지만 이미 열린 read transaction은 새 writer가 끝나기를 기다렸다가 같은 root로 갈아타지 않습니다.</p>
      </section>

      <section id="reclaim" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">가장 오래된 reader가 retired page의 재사용 시점을 정합니다</h2>
        <ExplainedFormula
          question="Retired page를 언제 새 transaction에 다시 쓸 수 있을까요?"
          idea="그 page를 볼 수 있는 가장 오래된 active reader가 끝난 뒤에만 재사용 후보가 됩니다."
          formula={String.raw`\operatorname{reuse}(p)\ \text{only after}\ \operatorname{retiredTx}(p)<\min_{r\in R_{\mathrm{active}}}\operatorname{readerTx}(r)`}
          annotatedFormula={String.raw`\operatorname{reuse}(p)\ \text{only after}\ \underbrace{\operatorname{retiredTx}(p)}_{\text{page가 current graph에서 빠진 세대}}<\underbrace{\min_{r\in R_{\mathrm{active}}}\operatorname{readerTx}(r)}_{\text{가장 오래된 열린 snapshot}}`}
          operations={[
            { expression: String.raw`R_{\mathrm{active}}=\{100,103\}`, annotation: ["두 reader가 txid 100과 103을 고정", "oldest reader는 100", "100이 볼 수 있는 page는 유지"] },
            { expression: String.raw`\min(100,103)=100`, annotation: ["회수 horizon은 100", "새 commit 105가 있어도 바뀌지 않음", "R1 종료 뒤 horizon이 전진"] },
          ]}
          terms={[
            { symbol: "p", name: "Retired page", description: "새 root에서는 빠졌지만 old reader가 여전히 볼 수 있는 page입니다." },
            { symbol: "retiredTx", name: "Retirement generation", description: "해당 page가 current graph에서 빠진 transaction generation입니다." },
            { symbol: "R_active", name: "Active readers", description: "아직 snapshot을 닫지 않은 read transactions입니다." },
            { symbol: "readerTx", name: "Pinned generation", description: "각 reader가 시작할 때 선택한 transaction ID입니다." },
          ]}
          assumptions={["이 식은 page 수명 경계를 설명하는 모형입니다.", "Reader slot·process liveness와 정확한 GC 비교 규칙은 고정한 libmdbx release의 구현에 따릅니다.", "Page 재사용 가능 여부와 stable-media durability를 같은 의미로 쓰지 않습니다."]}
          interpretation="Active reader가 100과 103이면 가장 오래된 snapshot은 100입니다. Writer가 105까지 진행해도 txid 100이 볼 수 있는 page는 R1이 끝나기 전 재사용하지 않습니다. 오래 열린 reader는 free-page 회수를 늦춰 map과 working set을 키울 수 있습니다."
        />
        <p>이 제약은 snapshot isolation의 비용입니다. Long reader가 끝나지 않으면 writer가 retired page를 곧바로 되돌려 쓰지 못하고 새 page를 더 필요로 할 수 있습니다. “Reader와 writer가 서로 막지 않는다”는 말은 page 수명과 공간 비용까지 서로 무관하다는 뜻이 아닙니다.</p>
      </section>

      <section id="dupsort" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">DUPSORT는 한 key 아래에 두 번째 정렬 축을 만듭니다</h2>
        <figure className="not-prose border-y border-border py-4" aria-labelledby="mdbx-dupsort-caption">
          <figcaption id="mdbx-dupsort-caption" className="text-xs font-bold">Key A의 duplicate cursor와 다음 key 이동</figcaption>
          <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,0.7fr)] sm:items-center">
            <div className="border border-primary p-3">
              <span className="text-[9px] font-bold text-muted-foreground">KEY A · ordered values</span>
              <div className="mt-2 grid grid-cols-3 gap-px bg-border p-px text-center font-mono text-sm font-black">
                {[2, 5, 9].map((value) => <span key={value} className="bg-background py-2">{value}</span>)}
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground">next-duplicate: 2 → 5 → 9</p>
            </div>
            <span className="hidden font-black text-primary sm:block">next-key →</span>
            <div className="border border-border p-3 text-center">
              <span className="text-[9px] font-bold text-muted-foreground">KEY B</span>
              <strong className="mt-2 block font-mono text-sm">value 4</strong>
            </div>
          </div>
        </figure>
        <p>이 값들은 unordered set이나 application array가 아닙니다. Duplicate comparator가 순서를 정하고 cursor operation은 같은 key 안에서 다음 value로 갈지, 다음 key로 갈지를 구분합니다. Key/value type, byte encoding, table flags와 comparator가 함께 persisted schema가 됩니다.</p>
        <p>예를 들어 숫자 256을 little-endian bytes <code>00 01</code>, 숫자 2를 <code>02 00</code>으로 저장하면서 lexicographic byte comparator를 쓰면 사람이 기대한 numeric ordering과 달라질 수 있습니다. 같은 bytes라도 codec과 comparator 계약이 달라지면 point lookup과 iteration 결과가 달라집니다.</p>
      </section>

      <section id="failure" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">메커니즘의 실패는 snapshot, page 수명, 순서 경계에서 드러납니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2">
          {[
            ["Old page 제자리 수정", "R1이 읽는 txid100 snapshot의 bytes가 중간에 바뀝니다."],
            ["불완전한 새 root 공개", "새 reader가 old·new page가 섞인 path를 따라갈 수 있습니다."],
            ["Reader보다 이른 page 재사용", "같은 address가 다른 record를 가리켜 열린 snapshot이 손상됩니다."],
            ["Long reader 방치", "Retired page 회수가 멈춰 map·working set과 write 비용이 커질 수 있습니다."],
            ["Comparator·codec 불일치", "DUPSORT iteration과 point lookup이 저장 때의 순서를 재현하지 못합니다."],
            ["Commit과 내구성 혼동", "Meta가 보인다는 사실만으로 정전 뒤 같은 generation이 남는다고 단정합니다."],
          ].map(([title, body]) => <div key={title} className="bg-background p-4"><strong className="break-keep text-sm">{title}</strong><p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">{body}</p></div>)}
        </div>
        <p>이 글은 transaction generation이 보이는 원리를 설명합니다. 어떤 sync mode와 장비에서 어느 commit을 durable로 인정할지, 어느 kill point를 통과해야 release할지는 다음 실무 글에서 이 글의 네 개념 anchor를 가져와 검증합니다.</p>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">설계 계보와 선택한 release의 구현을 나눠 확인합니다</h2>
        <div id="paper-lmdb-2011"><CitationBlock source="Chu · MDB: A Memory-Mapped Database and Backend for OpenLDAP" citeKey={1} href="https://www.openldap.org/pub/hyc/mdb-paper.pdf"><p><b>확인한 범위:</b> Memory mapping, Copy-on-Write, MVCC와 single-writer 구조의 설계 계보입니다.</p><p><b>확대하지 않은 범위:</b> 현재 libmdbx의 meta 형식, API와 sync mode를 이 논문이 그대로 정의한다고 보지 않습니다.</p></CitationBlock></div>
        <div id="paper-libmdbx-source"><CitationBlock source="Mithril-mine/libmdbx v0.14.3 · f7a3a93" citeKey={2} href="https://github.com/Mithril-mine/libmdbx/tree/f7a3a9323cacacfa9dc6137ae7a7252a67744ff0"><p><b>확인한 범위:</b> 2026년 8월 9일 공개된 v0.14.3의 transaction API, sync flags, reader 정보, DUPSORT와 pinned source snapshot입니다.</p><p><b>확대하지 않은 범위:</b> 모든 OS·filesystem·storage 장치에서의 power-loss 결과나 대상 workload의 성능 우위를 보장하지 않습니다.</p></CitationBlock></div>
        <div id="paper-libmdbx-header"><CitationBlock source="libmdbx v0.14.3 · mdbx.h" citeKey={3} href="https://github.com/Mithril-mine/libmdbx/blob/f7a3a9323cacacfa9dc6137ae7a7252a67744ff0/mdbx.h"><p><b>확인한 범위:</b> Read-only와 read-write transaction, sync mode, reader lag, map-full, DUPSORT cursor의 공개 API 계약입니다.</p><p><b>확대하지 않은 범위:</b> Header의 기능 설명만으로 crash 시험, filesystem ordering과 복구 시간을 측정했다고 주장하지 않습니다.</p></CitationBlock></div>
      </section>

      <section className="not-prose border-y border-border py-5" aria-labelledby="mdbx-review-title">
        <p className="text-[10px] font-bold text-primary">그림 없이 다시 설명하기</p>
        <h2 id="mdbx-review-title" className="mt-2 text-xl font-bold">세 질문으로 한 transaction generation을 다시 추적해 보세요</h2>
        <ol className="mt-4 grid gap-px bg-border p-px text-sm leading-6 md:grid-cols-3">
          <li className="bg-background p-4"><strong className="block text-xs text-primary">01 · 읽기</strong><span className="mt-2 block">mmap이 page 접근을 바꾸는 것과 page가 RAM에 resident인 것은 어떻게 다를까요?</span></li>
          <li className="bg-background p-4"><strong className="block text-xs text-primary">02 · 공개</strong><span className="mt-2 block">R1이 tx100을 읽는 동안 writer101은 어떤 page를 만들고 무엇을 마지막 시작점으로 공개할까요?</span></li>
          <li className="bg-background p-4"><strong className="block text-xs text-primary">03 · 회수</strong><span className="mt-2 block">R1이 끝나지 않았을 때 retired page를 재사용하면 왜 snapshot이 깨질까요?</span></li>
        </ol>
      </section>

      <StorageEngineMapReturn current="mdbx-internals" />
    </article>
  );
}
