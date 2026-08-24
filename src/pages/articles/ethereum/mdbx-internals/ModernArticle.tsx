import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";

const TxFlow = () => (
  <figure data-viz="mdbx-generation-flow" className="not-prose rounded-xl border border-border bg-card p-4 sm:p-5">
    <figcaption className="mb-4 text-sm font-semibold">Old reader와 new commit이 같은 file에서 공존하는 경로</figcaption>
    <div className="grid gap-3 sm:grid-cols-5">
      {[["01", "Map pages"], ["02", "Pin reader"], ["03", "Copy path"], ["04", "Publish meta"], ["05", "Reclaim later"]].map(([step, label]) => (
        <div key={step} className="min-w-0 rounded-lg border border-border bg-background p-4">
          <span className="text-xs font-semibold text-primary">{step}</span>
          <p className="mt-2 break-words text-sm font-semibold">{label}</p>
        </div>
      ))}
    </div>
  </figure>
);

export default function ModernArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-5">
      <h2 className="text-3xl font-bold">MDBX: mmap은 접근 방식이고 CoW generation이 transaction을 만든다</h2>
      <p className="text-lg leading-8">Reader R1이 key A가 든 leaf page 42를 보는 동안 writer가 A를 바꾼다고 해 봅시다. R1이 보는 bytes를 제자리에서 덮으면 snapshot이 중간에 변합니다. MDBX 계열은 기존 page graph를 남겨 두고 변경된 path를 새 pages에 쓴 뒤 새 root generation을 publish합니다.</p>
      <TxFlow />
      <p>MDBX는 내부에서 paged B+ tree를 사용하지만 generic B+ tree의 search/split 설명과 transaction·durability를 섞지 않습니다. mmap 또한 file 전체가 RAM에 resident하거나 write가 stable media에 도달했다는 뜻이 아니므로 page fault, meta publish, sync mode를 별도 경계로 봐야 합니다.</p>
    </section>

    <section id="page-map" className="space-y-5">
      <h2 className="text-2xl font-bold">Mapped address와 resident page, logical lookup은 다른 층이다</h2>
      <p>Root page 1에서 branch page 8을 거쳐 leaf page 42의 key를 찾는다면 logical B+ tree path는 세 pages입니다. mmap은 database file의 page offsets를 process virtual address에 연결하므로 별도 read-copy API를 줄일 수 있지만 cold page를 처음 만날 때 OS page fault가 storage I/O를 만들 수 있습니다.</p>
      <p>100 GB file을 map해도 실제 RSS는 접근해 resident가 된 subset과 OS 정책에 달려 있으므로 곧바로 RSS 100 GB라고 할 수도, I/O가 0이라고 할 수도 없습니다. Page size·map geometry·access locality·OS cache state·major/minor faults를 함께 기록해야 B+ height와 실제 latency를 연결할 수 있습니다.</p>
    </section>

    <section id="transaction" className="space-y-5">
      <h2 className="text-2xl font-bold">Copy-on-Write path를 만든 뒤 meta root를 publish한다</h2>
      <p>R1이 txid 100의 root 1→branch 8→leaf 42를 pin한 동안 writer 101은 수정 leaf 52, parent 18, root 2를 새로 만듭니다. Root 2와 geometry·transaction identity를 나타내는 meta state가 publish되기 전에는 old graph가 완전하고, publish된 뒤에는 new graph가 완전합니다. 그래서 R1은 계속 old root를 읽고 새 reader는 txid 101을 선택할 수 있습니다.</p>
      <p>한 시점의 writer를 직렬화한다고 해서 readers도 writer lock을 기다릴 필요는 없습니다. 대신 active readers 중 가장 오래된 generation이 아직 참조할 수 있는 retired pages를 재사용하지 않아야 합니다. Long reader가 끝나지 않으면 free pages 회수가 늦어져 file/map growth가 늘 수 있습니다.</p>
      <ExplainedFormula
        question="Retired page를 언제 안전하게 재사용할 수 있을까?"
        idea="그 page가 마지막으로 속한 generation보다 오래된 reader가 하나도 없을 때만 새 writer generation에 돌려줍니다."
        formula={String.raw`\operatorname{reclaim}(p)\ \text{only if}\ \operatorname{retiredTx}(p)<\min_{r\in R_{\mathrm{active}}}\operatorname{readerTx}(r)`}
        annotatedFormula={String.raw`\operatorname{reclaim}(p)\ \text{only if}\ \operatorname{retiredTx}(p)<\underbrace{\min_{r\in R_{\mathrm{active}}}\operatorname{readerTx}(r)}_{\text{경계 후보 선택}}`}
        operations={[
          { expression: String.raw`\min_{r\in R_{\mathrm{active}}}\operatorname{readerTx}(r)`, annotation: ["허용 후보 중 목적에 맞는 경계값을 선택합니다.","그 page가 마지막으로 속한 generation보다"] },
        ]}
        terms={[
          { symbol: "p", name: "Retired page", description: "새 root에서는 더 이상 필요하지 않지만 old reader가 볼 수 있는 page입니다." },
          { symbol: "retiredTx", name: "Retirement generation", description: "해당 page가 current graph에서 빠진 transaction boundary입니다." },
          { symbol: "R_active", name: "Active readers", description: "아직 snapshot을 닫지 않은 read transactions입니다." },
          { symbol: "readerTx", name: "Pinned generation", description: "각 reader가 시작 때 고정한 transaction ID입니다." },
        ]}
        assumptions={["Reader slot과 liveness가 pinned libmdbx API 규칙대로 관리됩니다.", "정확한 equality·free-list 세부는 선택 source version의 page-retirement semantics를 따릅니다.", "이 식은 수명 직관이며 stable-media durability를 설명하지 않습니다."]}
        interpretation="Active reader txids가 100과 103이면 oldest는 100입니다. txid 100 snapshot이 필요할 수 있는 pages는 그 reader가 끝나기 전에 재사용할 수 없고, 오래 열린 reader는 reclamation horizon을 붙잡습니다."
      />
      <p>Meta publish가 atomic visibility를 주더라도 power-loss durability는 sync flags, filesystem, device cache와 commit 반환 시점에 달려 있습니다. “commit success”, “OS에 write 제출”, “stable media 도달”을 같은 상태로 부르지 않습니다.</p>
    </section>

    <section id="dupsort" className="space-y-5">
      <h2 className="text-2xl font-bold">DUPSORT는 key 안에 두 번째 ordered domain을 만든다</h2>
      <p>key A 아래 values [2,5,9]가 있으면 next-duplicate는 같은 A에서 2→5→9로 움직이고, next-key는 다음 key B로 이동합니다. 이것은 unordered set이나 application array와 다르며 duplicate comparator와 value codec이 persisted schema의 일부입니다.</p>
      <p>Numeric 256을 little-endian bytes 00 01로 저장하고 2를 02 00으로 저장하면서 lexicographic byte comparator를 쓰면 사람이 기대한 numeric ordering과 달라질 수 있습니다. Key/value type, byte encoding, comparator, DUPSORT/DUPFIXED flags와 cursor operation을 하나의 schema receipt로 고정해야 합니다.</p>
    </section>

    <section id="release" className="space-y-5">
      <h2 className="text-2xl font-bold">Commit kill points와 reopen generation을 먼저 맞춘다</h2>
      <p>Data-page allocation/write, parent/root construction, meta publish, sync 전후에 process kill을 반복하고 reopen했을 때 last durable txid·root·logical rows가 한 generation으로 일치하는지 확인합니다. Torn meta나 mixed old/new path를 success로 열면 안 됩니다. Map-full, long reader, stale reader handling, writer contention, malformed page와 DUPSORT insert/delete/order도 포함합니다.</p>
      <p>libmdbx SHA, API/build/sync flags, page/map geometry, filesystem·mount·device cache, process model을 pin한 뒤 commit/abort/reopen parity, page faults, dirty/writeback bytes, fsync time, map growth, reader age, p50/p99, RSS를 기록합니다. Correctness·durability·schema compatibility가 깨지면 이전 source/flag/database generation으로 rollback합니다.</p>
      <div id="paper-lmdb-2011"><CitationBlock source="Chu · MDB: A Memory-Mapped Database and Backend for OpenLDAP" citeKey={1} href="https://www.openldap.org/pub/hyc/mdb-paper.pdf"><p><b>문제:</b> Embedded read-heavy DB에서 locking과 copy overhead를 줄입니다.</p><p><b>기여:</b> Memory mapping·Copy-on-Write·MVCC·single-writer design foundation을 제시했습니다.</p><p><b>전제:</b> LMDB paper의 OS·page·transaction model을 따릅니다.</p><p><b>근거 범위:</b> MDBX가 계승한 architecture를 이해하는 primary background입니다.</p><p><b>말하지 않는 것:</b> 현재 libmdbx API·meta format·durability flags와 동일하다고 주장하지 않습니다.</p></CitationBlock></div>
      <div id="paper-libmdbx-source"><CitationBlock source="Mithril-mine/libmdbx pinned source f7a3a93" citeKey={2} href="https://github.com/Mithril-mine/libmdbx/tree/f7a3a9323cacacfa9dc6137ae7a7252a67744ff0"><p><b>문제:</b> MDBX transaction·page·reader table·DUPSORT source seam을 고정합니다.</p><p><b>기여:</b> Official libmdbx source·tests·documentation의 exact snapshot을 제공합니다.</p><p><b>전제:</b> Commit f7a3a93, build flags, filesystem과 sync options를 pin합니다.</p><p><b>근거 범위:</b> 선택 commit에서 확인되는 MDBX implementation/API behavior입니다.</p><p><b>말하지 않는 것:</b> 모든 platform power-loss guarantee나 workload 성능 우위를 보장하지 않습니다.</p></CitationBlock></div>
    </section>
  </article>;
}
