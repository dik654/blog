import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";

const LsmFlow = () => (
  <figure data-viz="lsm-write-read-flow" className="not-prose rounded-xl border border-border bg-card p-4 sm:p-5">
    <figcaption className="mb-4 text-sm font-semibold">한 write가 searchable sorted run이 되는 경로</figcaption>
    <div className="grid gap-3 sm:grid-cols-5">
      {[["01", "WAL"], ["02", "Memtable"], ["03", "Flush"], ["04", "SSTables"], ["05", "Compaction"]].map(([step, label]) => (
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
      <h2 className="text-3xl font-bold">LSM tree: 빠른 append의 비용을 read와 compaction에서 갚는다</h2>
      <p className="text-lg leading-8">같은 key A에 7을 쓰고 잠시 뒤 9로 바꾼 다음 삭제한다고 해 봅시다. LSM tree는 기존 disk page를 그때마다 제자리 수정하지 않고 각 mutation을 sequence number가 붙은 log·memory entry로 받아 immutable sorted files로 내립니다.</p>
      <LsmFlow />
      <p>이 구조는 B+ tree의 page split, MDBX의 transaction generation, MPT의 authenticated root와 역할이 다릅니다. 빠른 foreground write만 보고 끝내면 여러 runs를 읽는 비용, 오래된 version을 합치는 compaction bytes와 backlog가 만든 write stall을 놓칩니다.</p>
    </section>

    <section id="write-path" className="space-y-5">
      <h2 className="text-2xl font-bold">WAL·memtable·SSTable은 서로 다른 실패를 막는다</h2>
      <p>seq 41 Put(A,7)은 먼저 WAL에 append되고 선택한 sync policy의 acknowledgement boundary를 통과한 뒤 mutable memtable에 반영됩니다. Memtable이 차면 immutable로 freeze되어 foreground mutation에서 분리되고, key·sequence 순으로 정렬된 SSTable로 flush됩니다. SSTable은 immutable이므로 나중 변경은 새 entry 또는 tombstone으로 추가됩니다.</p>
      <p>WAL은 crash 뒤 아직 flush되지 않은 acknowledged writes를 replay하기 위한 것이고 memtable은 빠른 ordered memory update를, SSTable은 persistent sorted run을 담당합니다. Memtable만 갱신하고 성공을 돌려준 직후 process가 죽으면 A=7이 사라집니다. 반대로 WAL write가 OS buffer에만 있고 stable media에 도달하지 않은 상태를 durable이라고 부를 수 있는지는 engine의 sync option과 filesystem contract에 달려 있습니다.</p>
    </section>

    <section id="read-path" className="space-y-5">
      <h2 className="text-2xl font-bold">Read는 newest visible sequence와 tombstone을 함께 고른다</h2>
      <p>A@41=7, A@52=9, tombstone A@60이 여러 memtable·SSTables에 나뉘어 있으면 snapshot sequence 55는 9를 보고 snapshot 61은 absent를 봐야 합니다. 조회는 memtable과 최신 runs부터 후보를 모으고 snapshot 이하에서 가장 큰 sequence를 고릅니다. Tombstone을 보았는데 더 오래된 SSTable을 계속 읽어 A=7을 반환하면 삭제한 값이 되살아납니다.</p>
      <p>Bloom filter의 valid negative는 그 file에 key가 없음을 알려 불필요한 data block read를 건너뛰게 하지만 positive는 후보일 뿐 false positive가 있으므로 index/data 확인이 필요합니다. Range scan, range tombstone, comparator와 snapshot retention은 point lookup과 다른 비용·correctness 경계입니다.</p>
    </section>

    <section id="compaction" className="space-y-5">
      <h2 className="text-2xl font-bold">Compaction은 amplification과 service-rate의 문제다</h2>
      <p>Compaction은 overlapping sorted runs를 key·sequence 순으로 merge하고 안전하게 obsolete가 된 versions·tombstones를 제거합니다. Leveled compaction은 한 level의 non-overlap을 강하게 유지해 read·space amplification을 낮추는 대신 큰 lower level과 겹친 bytes를 반복 재작성할 수 있습니다. Tiered compaction은 비슷한 크기의 runs를 늦게 합쳐 write amplification을 줄이지만 한 read가 확인할 runs와 temporary space를 늘릴 수 있습니다.</p>
      <ExplainedFormula
        question="User write보다 storage에 실제로 몇 배를 썼는지 어떻게 계산할까?"
        idea="WAL, flush와 compaction output 중 포함할 byte 범위를 먼저 선언한 뒤 동일 관측 구간의 physical written bytes를 accepted user bytes로 나눕니다."
        formula={String.raw`WA=\frac{B_{\mathrm{WAL}}+B_{\mathrm{flush}}+B_{\mathrm{compaction}}}{B_{\mathrm{user}}}`}
        annotatedFormula={String.raw`WA=\underbrace{\frac{B_{\mathrm{WAL}}+B_{\mathrm{flush}}+B_{\mathrm{compaction}}}{B_{\mathrm{user}}}}_{\text{기준량당 비율}}`}
        operations={[
          { expression: String.raw`\frac{B_{\mathrm{WAL}}+B_{\mathrm{flush}}+B_{\mathrm{compaction}}}{B_{\mathrm{user}}}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","WAL, flush와 compaction output 중","포함할 byte 범위를 먼저 선언한 뒤 동일 관측 구간의","physical written bytes를 accepted"] },
        ]}
        terms={[
          { symbol: "WA", name: "Write amplification", description: "User byte 한 개당 선언한 storage layer가 쓴 bytes 비율입니다." },
          { symbol: "B_user", name: "Accepted user bytes", description: "같은 측정 구간에서 성공한 logical writes입니다." },
          { symbol: "B_WAL", name: "WAL bytes", description: "Log record·framing을 포함한다고 명시한 실제 write bytes입니다." },
          { symbol: "B_flush", name: "Flush bytes", description: "Memtable이 SSTable로 내려가며 쓴 bytes입니다." },
          { symbol: "B_compaction", name: "Compaction output", description: "Merge 결과로 다시 쓴 bytes입니다." },
        ]}
        assumptions={["같은 시간 구간과 engine byte counters를 사용합니다.", "Compression 전후·metadata·temporary file 포함 여부를 명시합니다.", "WA만으로 read·space·latency를 판단하지 않습니다."]}
        interpretation="User 20 MB, WAL 20 MB, flush 20 MB, compaction output 60 MB이면 이 범위의 physical writes는 100 MB이고 WA=5입니다."
      />
      <ExplainedFormula
        question="Compaction이 ingest를 못 따라갈 때 stall threshold는 언제 찰까?"
        idea="Foreground arrival rate에서 background service rate를 뺀 값만큼 compaction debt가 늘어난다고 보는 작은 fluid model입니다."
        formula={String.raw`t_{\mathrm{limit}}=\frac{D_{\mathrm{limit}}-D_0}{\max(\lambda_{\mathrm{ingest}}-\mu_{\mathrm{compact}},\,0)}`}
        annotatedFormula={String.raw`t_{\mathrm{limit}}=\underbrace{\frac{D_{\mathrm{limit}}-D_0}{\max(\lambda_{\mathrm{ingest}}-\mu_{\mathrm{compact}},\,0)}}_{\text{기준량당 비율}}`}
        operations={[
          { expression: String.raw`\frac{D_{\mathrm{limit}}-D_0}{\max(\lambda_{\mathrm{ingest}}-\mu_{\mathrm{compact}},\,0)}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Foreground arrival rate에서","background service rate를 뺀 값만큼","compaction debt가 늘어난다고 보는 작은 fluid"] },
        ]}
        terms={[
          { symbol: "D", name: "Compaction debt", description: "처리해야 할 pending bytes 또는 대응되는 engine backlog입니다." },
          { symbol: "λ_ingest", name: "Ingest rate", description: "Foreground가 새 work를 만드는 MB/s입니다." },
          { symbol: "μ_compact", name: "Service rate", description: "Background compaction이 backlog를 줄이는 MB/s입니다." },
        ]}
        assumptions={["짧은 구간에서 rates와 threshold가 일정합니다.", "Flush·L0 file trigger 같은 discrete effect는 실측 telemetry로 보완합니다."]}
        interpretation="80 MB/s ingest와 60 MB/s service이면 debt가 20 MB/s 늘어 1 GB threshold를 약 50초에 채웁니다. 평균 rate가 낮아도 burst가 stop trigger를 넘을 수 있습니다."
      />
    </section>

    <section id="release" className="space-y-5">
      <h2 className="text-2xl font-bold">Snapshot correctness 뒤 workload별 증폭·stall을 비교한다</h2>
      <p>Overwrite, delete, point/range, skew, burst와 오래된 snapshot을 고정 seed로 재생합니다. WAL sync 직전·직후, memtable freeze, flush manifest publish, compaction install 지점에 process kill을 넣고 reopen 뒤 value·tombstone·snapshot result가 reference model과 같은지 먼저 확인합니다.</p>
      <p>Engine SHA, WAL/compaction/compression/cache options, dataset/key distribution, warm/cold state, filesystem과 hardware를 pin하고 WAL·flush·compaction read/write bytes, read/write/space amplification, L0 files, pending bytes, stall micros, p50/p99, recovery time를 나눠 기록합니다. Device endurance와 temporary capacity도 함께 산정하며 correctness·durability regression이면 이전 option/source profile로 rollback합니다.</p>
      <div id="paper-lsm-1996"><CitationBlock source="O’Neil et al. · The Log-Structured Merge-Tree" citeKey={1} href="https://doi.org/10.1007/s002360050048"><p><b>문제:</b> High insert-rate history data를 낮은 disk-arm cost로 색인합니다.</p><p><b>기여:</b> Memory·disk components와 rolling merge를 결합한 LSM 구조와 비용 분석을 제시했습니다.</p><p><b>전제:</b> 논문의 storage hierarchy·merge schedule·workload model을 따릅니다.</p><p><b>근거 범위:</b> LSM architecture와 amortized merge trade-off의 primary source입니다.</p><p><b>말하지 않는 것:</b> 현대 RocksDB의 모든 option·Bloom·stall behavior를 규정하지 않습니다.</p></CitationBlock></div>
      <div id="paper-rocksdb-source"><CitationBlock source="facebook/rocksdb pinned source 2dc6bc5" citeKey={2} href="https://github.com/facebook/rocksdb/tree/2dc6bc51b498c7fcae16e78a54de9058181c8b75"><p><b>문제:</b> WAL·memtable·SST·compaction·stall의 production source seam을 고정합니다.</p><p><b>기여:</b> Official RocksDB source·tests·options의 exact snapshot을 제공합니다.</p><p><b>전제:</b> Commit 2dc6bc5와 build·options·filesystem profile을 pin합니다.</p><p><b>근거 범위:</b> 선택 commit에서 확인되는 implementation behavior입니다.</p><p><b>말하지 않는 것:</b> 모든 option 조합의 성능·durability나 generic LSM theorem을 대신하지 않습니다.</p></CitationBlock></div>
    </section>
  </article>;
}
