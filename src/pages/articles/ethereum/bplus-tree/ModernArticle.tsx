import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";

const PageFlow = () => (
  <figure data-viz="bplus-page-flow" className="not-prose rounded-xl border border-border bg-card p-4 sm:p-5">
    <figcaption className="mb-4 text-sm font-semibold">Ordered key가 page index를 통과하는 경로</figcaption>
    <div className="grid gap-3 sm:grid-cols-5">
      {[["01", "Page budget"], ["02", "Separator"], ["03", "Leaf"], ["04", "Sibling scan"], ["05", "Split / merge"]].map(([step, label]) => (
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
      <h2 className="text-3xl font-bold">B+ tree: 비교 횟수보다 먼저 page I/O를 줄이는 ordered index</h2>
      <p className="text-lg leading-8">100만 개의 정렬된 key를 한 줄 배열에 두면 이진 탐색의 비교 횟수는 작아도 서로 떨어진 disk page를 여러 번 읽을 수 있습니다. B+ tree는 한 page에 많은 separator와 child pointer를 넣어 tree를 낮게 만들고, 실제 record나 record pointer는 leaf에 모읍니다.</p>
      <PageFlow />
      <p>B+ tree는 LSM의 append·compaction write path도, MDBX의 transaction durability도, MPT의 cryptographic root도 아닙니다. 이 글이 소유하는 범위는 page-oriented ordered index의 fanout·search·split/merge invariant이며, crash atomicity는 이를 채택하는 storage engine이 별도로 정의해야 합니다.</p>
    </section>

    <section id="page-layout" className="space-y-5">
      <h2 className="text-2xl font-bold">Page byte budget이 fanout과 높이를 정한다</h2>
      <p>Internal page에는 header, slot directory, separator key, child page number가 들어가고 leaf에는 ordered key와 value 또는 record pointer, sibling link가 들어갑니다. 따라서 “key가 16 bytes니까 4 KiB에 256개”라고 나누면 header·pointer·fragmentation을 빠뜨립니다.</p>
      <ExplainedFormula
        question="Page layout에서 point lookup의 최대 page 수를 어떻게 추정할까?"
        idea="Page의 usable bytes를 routing entry bytes로 나눠 fanout을 얻고, leaf capacity로 leaf page 수를 구한 뒤 fanout의 거듭제곱으로 root까지 접습니다."
        formula={String.raw`F=\left\lfloor\frac{P-H}{K+C}\right\rfloor,\qquad L=\left\lceil\frac{N}{E}\right\rceil,\qquad \text{page reads}\approx 1+\left\lceil\log_F L\right\rceil`}
        terms={[
          { symbol: "P", name: "Page bytes", description: "한 index page의 고정 byte 크기입니다." },
          { symbol: "H", name: "Page overhead", description: "Header·slot directory·sibling metadata 등에 쓰는 bytes입니다." },
          { symbol: "K+C", name: "Routing entry bytes", description: "Separator key와 child pointer가 차지하는 크기입니다." },
          { symbol: "E", name: "Leaf capacity", description: "한 leaf page가 담는 평균 entries입니다." },
          { symbol: "N", name: "Row count", description: "색인할 전체 entries 수입니다." },
        ]}
        assumptions={["Key/value 길이·prefix compression·fill factor·slot layout이 고정되어 있습니다.", "Root도 cold page라고 세며 cache hit는 별도 측정합니다.", "이 값은 capacity bound이지 실제 latency 보장이 아닙니다."]}
        interpretation="P=4,096, H=96, K+C=24이면 F=166입니다. 보수적으로 fanout 160·leaf capacity 200을 쓰면 100만 rows는 5,000 leaves, 32 parent pages, 1 root이므로 cold point path는 3 pages입니다."
      />
      <p>최소 fanout이 m이면 depth h가 가리킬 수 있는 leaf 수가 적어도 m의 h제곱으로 늘어나므로 높이는 로그에 비례합니다. 다만 root는 최소 occupancy 예외이고, variable-length key와 낮은 fill factor는 실제 fanout을 줄입니다.</p>
    </section>

    <section id="search-range" className="space-y-5">
      <h2 className="text-2xl font-bold">Internal separator는 길을 고르고 leaf chain이 range를 잇는다</h2>
      <p>Internal separators가 [20, 40]이면 key 35는 가운데 child로 내려갑니다. 도착한 leaf에서 lower bound를 찾고 정확한 key와 duplicate policy를 확인해야 하며, separator 자체를 record라고 해석하면 안 됩니다.</p>
      <p>Range [35, 62]는 35가 있을 첫 leaf까지 root-to-leaf 탐색을 한 번 수행한 뒤 right-sibling link를 따라 62를 넘을 때까지 걷습니다. 그래서 비용은 대략 tree height와 결과가 걸친 leaf pages의 합입니다. Comparator, collation, null ordering과 endpoint의 inclusive/exclusive 규칙이 build와 lookup에서 같아야 하며, 둘이 다르면 존재하는 key가 도달 불가능하거나 range 순서가 어긋납니다.</p>
    </section>

    <section id="updates" className="space-y-5">
      <h2 className="text-2xl font-bold">Split·redistribution·merge는 세 불변식을 함께 보존한다</h2>
      <p>Leaf capacity가 4인 [10,20,30,40]에 25를 삽입하면 먼저 [10,20,25,30,40]으로 정렬한 뒤 [10,20]과 [25,30,40]으로 나누고 parent에 새 right leaf의 경계 25를 올립니다. Parent도 overflow하면 같은 작업이 위로 전파되며 root가 split될 때만 모든 leaf path가 함께 한 단계 길어집니다.</p>
      <p>삭제로 minimum occupancy 아래가 되면 sibling에서 한 entry를 재분배하고 parent separator를 고치거나, 재분배할 여유가 없으면 pages를 merge합니다. Root child가 하나만 남으면 root를 줄일 수 있습니다. 이 과정이 보존해야 하는 핵심은 global key ordering, root를 제외한 occupancy bound, 모든 leaf의 동일 depth입니다. Leaf만 나누고 parent link를 publish하지 않는 구현은 새 page의 keys를 영구히 잃는 반례입니다.</p>
    </section>

    <section id="release" className="space-y-5">
      <h2 className="text-2xl font-bold">Page graph correctness를 통과한 뒤 I/O를 비교한다</h2>
      <p>Empty/root-only tree, capacity-1·capacity·capacity+1, ascending·descending·random·duplicate inserts, redistribute·merge·root shrink를 reference ordered map과 differential 비교합니다. Crash-capable engine이라면 child page·parent separator·free list·root publish 사이 kill points도 engine transaction oracle에 포함해야 합니다.</p>
      <p>Source SHA, page format, comparator, fill factor, key/value distribution, cache state, sync policy와 hardware를 pin하고 height, allocated/live pages, point/range page reads, split/merge writes, p50/p99 latency를 기록합니다. Correctness나 format compatibility가 깨지면 이전 index generation으로 rollback하며, 더 낮은 비교 횟수를 곧 durable transaction 우위로 확대하지 않습니다.</p>
      <div id="paper-bayer-mccreight"><CitationBlock source="Bayer & McCreight · Organization and Maintenance of Large Ordered Indices" citeKey={1} href="https://doi.org/10.1007/BF00288683"><p><b>문제:</b> Large ordered index를 fixed-size pages로 낮고 balanced하게 유지합니다.</p><p><b>기여:</b> Multiway balanced page tree의 search·insert·delete와 occupancy 분석을 제시했습니다.</p><p><b>전제:</b> 논문의 ordered-key·page·update model을 따릅니다.</p><p><b>근거 범위:</b> B-tree 계열 fanout·height·page maintenance의 primary foundation입니다.</p><p><b>말하지 않는 것:</b> 현대 B+ leaf link, MVCC, WAL 구현을 자동으로 규정하지 않습니다.</p></CitationBlock></div>
      <div id="paper-postgres-nbtree"><CitationBlock source="PostgreSQL nbtree pinned source eb983d0" citeKey={2} href="https://github.com/postgres/postgres/tree/eb983d0a94f666d91058552117d029939821d648/src/backend/access/nbtree"><p><b>문제:</b> Production ordered index의 page·search·split source seam을 고정합니다.</p><p><b>기여:</b> Official PostgreSQL nbtree source의 exact snapshot을 제공합니다.</p><p><b>전제:</b> Commit eb983d0과 build·page·comparator profile을 함께 pin합니다.</p><p><b>근거 범위:</b> 선택 commit에서 확인되는 nbtree implementation claim입니다.</p><p><b>말하지 않는 것:</b> Generic B+ tree 정의나 다른 engine layout·성능을 대신하지 않습니다.</p></CitationBlock></div>
    </section>
  </article>;
}
