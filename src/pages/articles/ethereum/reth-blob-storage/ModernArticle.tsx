import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import type { ProjectMeta } from "@/components/code/types";
import { CitationBlock } from "@/components/ui/citation-block";
import RethEip4844Locator, {
  RethEip4844MapReturn,
} from "../reth-eip4844/RethEip4844Locator";
import BlobStoreTraceViz from "./BlobStoreTraceViz";
import { codeRefs } from "./codeRefs";
import { rethBlobStorageTree } from "./fileTree";

const PROJECT_META: Record<string, ProjectMeta> = {
  reth: {
    id: "reth",
    label: "Reth v2.8.1 · Rust",
    badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
  },
};

function CodeLink({
  codeKey,
  label,
  open,
}: {
  codeKey: keyof typeof codeRefs;
  label: string;
  open: (key: string, ref: (typeof codeRefs)[string]) => void;
}) {
  return (
    <div className="not-prose flex flex-wrap items-center gap-2">
      <CodeViewButton onClick={() => open(codeKey, codeRefs[codeKey])} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export default function ModernRethBlobStorage() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="scroll-mt-20 space-y-5">
        <RethEip4844Locator current="reth-blob-storage" />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">
            Pool에 들어간 T₀의 sidecar는 어디에 남고 언제 지워집니까?
          </h2>
        </div>
        <p className="text-lg leading-8">
          앞 글의 T₀가 <code>ValidWithSidecar</code>를 거쳐 Pool에 실제로 추가됐다고
          하겠습니다. T₀의 transaction hash를 H₀, 검증된 sidecar를 S₀라고 부르겠습니다.
          Reth는 실행과 ordering에 필요한 transaction entry와 큰 sidecar S₀를 분리하고,
          H₀를 key로 S₀를 찾을 수 있게 보관합니다.
        </p>
        <BlobStoreTraceViz />
        <p>
          기존 글은 Reth BlobStore가 digest·generation·atomic write receipt를 함께 저장하고
          restart 뒤 partial write를 복구하는 것처럼 설명했습니다. Reth v2.8.1의 실제
          구현에는 그런 metadata나 복구 계약이 없습니다. Disk backend는 cache와 임시
          파일을 사용하지만 시작할 때 이전 Blob 디렉터리를 지웁니다. 따라서 이 글의
          핵심은 “영구 artifact store”가 아니라 <strong>reorg 가능 기간 동안 local Pool
          sidecar를 분리 보관하는 수명주기</strong>입니다.
        </p>
        <ContentBoundary article="reth-blob-storage" />
      </section>

      <section id="store-contract" className="scroll-mt-20 space-y-5">
        <h2 className="break-keep text-2xl font-bold">저장 계약</h2>
        <p>
          <code>BlobStore</code>의 기본 key는 transaction hash H₀이고 value는
          <code>PooledBlobSidecar</code> S₀입니다. v2.8.1의 wrapper는 sidecar와 cell
          availability를 함께 들지만, v0 sidecar 한 개를 추적하는 현재 사례에서는 전체
          availability로 시작합니다. Trait는 insert·get·get_exact·delete·cleanup을
          정의할 뿐 digest나 validator revision을 저장하지 않습니다.
        </p>
        <TermBreakdown
          title="H₀와 S₀ 사이의 실제 계약"
          items={[
            {
              term: "H₀ · transaction hash",
              description: "Pool transaction과 sidecar를 다시 연결하는 기본 storage key입니다.",
              boundary: "Block number가 key가 아니므로 같은 transaction을 canonical·reorg 경로에서 다시 찾을 수 있습니다.",
            },
            {
              term: "S₀ · pooled sidecar",
              description: "검증을 통과한 Blob·commitment·proof와 cell availability를 가진 값입니다.",
              boundary: "BlobStore insert가 KZG proof를 다시 검증하는 단계는 아닙니다.",
            },
            {
              term: "Versioned-hash index",
              description: "Engine API 조회를 위해 versioned hash를 최근 transaction hash에 연결하는 LRU index입니다.",
              boundary: "한 Blob이 여러 transaction에 나타날 수 있어 가장 최근 transaction 하나만 추적할 수 있습니다.",
            },
            {
              term: "Local lifetime",
              description: "Finalization 전 reorg 재주입에 필요한 기간 동안 sidecar를 남깁니다.",
              boundary: "Consensus data availability와 장기 archive의 보존 기간을 소유하지 않습니다.",
            },
          ]}
        />
        <CodeLink
          codeKey="store-contract"
          label="Reth v2.8.1 · BlobStore trait와 Missing·Decode·I/O 오류"
          open={sidebar.open}
        />
      </section>

      <section id="write-read" className="scroll-mt-20 space-y-5">
        <h2 className="break-keep text-2xl font-bold">쓰기와 읽기</h2>
        <p>
          Disk backend의 <code>insert_one</code>은 S₀를 RLP fields로 encode한 뒤
          versioned-hash index와 sidecar LRU cache를 먼저 갱신하고, 마지막에
          <code>blob_dir/H₀</code> 파일을 씁니다. 파일명과 내용 사이에 별도 digest 파일이나
          generation record는 없습니다. 이 순서를 “원자적 receipt”라고 부르면 실제
          실패 경계를 숨기게 됩니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px text-sm leading-6 sm:grid-cols-3">
          {[
            ["Cache hit", "H₀가 LRU에 있으면 Arc<Sidecar>를 즉시 반환합니다."],
            ["File hit", "Cache miss면 파일을 읽고 RLP decode한 뒤 LRU에 다시 넣습니다."],
            ["Miss 또는 Error", "파일 없음은 None, decode 실패와 다른 I/O 실패는 Error입니다."],
          ].map(([title, description]) => (
            <div key={title} className="bg-background p-4">
              <strong className="block text-primary">{title}</strong>
              <span className="mt-2 block text-muted-foreground">{description}</span>
            </div>
          ))}
        </div>
        <p>
          <code>contains(H₀)</code>는 cache hit 또는 파일 존재만 확인하고 파일이 decode 가능한
          sidecar인지까지 읽지 않습니다. 반면 <code>get(H₀)</code>는 파일을 decode하므로
          <code>None</code>과 <code>DecodeError</code>를 구분합니다. 여러 hash를 반드시 모두
          받아야 하는 <code>get_exact</code>는 하나라도 없으면
          <code>MissingSidecar</code>를 반환합니다.
        </p>
        <CodeLink
          codeKey="disk-path"
          label="Reth v2.8.1 · open·insert_one·get_one·read_one의 실제 순서"
          open={sidebar.open}
        />
      </section>

      <section id="retention" className="scroll-mt-20 space-y-5">
        <h2 className="break-keep text-2xl font-bold">Finality까지 보관</h2>
        <p>
          Pool maintenance loop는 canonical block마다 그 block에 포함된 Blob transaction
          hash를 <code>BlobStoreCanonTracker</code>에 기록합니다. Finality 전 reorg가
          발생하면 old canonical chain에서 빠진 transaction을 다시 Pool에 넣어야 하므로,
          해당 sidecar는 아직 local BlobStore에 남아 있어야 합니다.
        </p>
        <div className="not-prose border-y border-border py-5">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)_2rem_minmax(0,1fr)] sm:items-center">
            <div className="border border-border p-4">
              <span className="text-[9px] font-black text-primary">CANONICAL COMMIT</span>
              <strong className="mt-1 block">Block N → H₀</strong>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">Tracker에 block number와 Blob tx hash를 기록</p>
            </div>
            <span className="hidden text-center text-primary sm:block" aria-hidden>→</span>
            <div className="border border-primary p-4">
              <span className="text-[9px] font-black text-primary">UNFINALIZED</span>
              <strong className="mt-1 block">S₀ 유지</strong>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">Reorg면 old-chain T₀를 sidecar와 다시 결합</p>
            </div>
            <span className="hidden text-center text-primary sm:block" aria-hidden>→</span>
            <div className="border border-border p-4">
              <span className="text-[9px] font-black text-primary">FINALIZED ≤ N</span>
              <strong className="mt-1 block">H₀ 삭제 대상</strong>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">Disk는 queue, memory는 즉시 삭제</p>
            </div>
          </div>
        </div>
        <p>
          새로운 finalized height가 들어오면 tracker는 그 높이 이하 block의 hash를
          <code>Finalized</code> update로 내보냅니다. Disk backend의
          <code>delete_all</code>은 실제 파일을 바로 지우지 않고
          <code>txs_to_delete</code>에 넣습니다. 이어서 background blocking task가
          <code>cleanup</code>을 호출해 파일을 제거합니다.
        </p>
        <CodeLink
          codeKey="finality-cleanup"
          label="Reth v2.8.1 · Canon tracker → delete queue → cleanup"
          open={sidebar.open}
        />
      </section>

      <section id="failure-boundaries" className="scroll-mt-20 space-y-5">
        <h2 className="break-keep text-2xl font-bold">실패 경계</h2>
        <p>
          BlobStore는 Pool과 별도 상태를 소유하므로 두 상태가 항상 한 transaction처럼 같이
          바뀌지는 않습니다. 실제 구현에서 확인되는 경계를 그대로 놓고 보면 어떤 metric과
          복구 기대가 필요한지 알 수 있습니다.
        </p>
        <TermBreakdown
          title="실제 구현이 만드는 다섯 경계"
          items={[
            {
              term: "Pool 성공 · Store 실패",
              description: "Pool insertion 뒤 BlobStore insert가 실패하면 warning과 failed-insert metric을 남깁니다.",
              boundary: "이미 성공한 Pool insertion을 이 함수가 되돌리지는 않습니다.",
            },
            {
              term: "Cache와 file",
              description: "Disk write 전에 cache가 갱신되므로 write 실패 직후 같은 process에서는 cache hit가 날 수 있습니다.",
              boundary: "Cache eviction 뒤에는 file이 없어 miss가 될 수 있어 atomic durability라고 부를 수 없습니다.",
            },
            {
              term: "Corrupt file",
              description: "파일이 있지만 RLP decode가 실패하면 None이 아니라 DecodeError입니다.",
              boundary: "별도 digest·generation 검사는 없으며 decode 성공이 KZG 재검증을 뜻하지도 않습니다.",
            },
            {
              term: "Cleanup 실패",
              description: "파일 삭제 실패 수를 결과에 기록하지만 이번 queue에서 가져온 hash를 자동 재삽입하지는 않습니다.",
              boundary: "delete_failed를 관측하고 남은 파일을 운영자가 다시 확인해야 합니다.",
            },
            {
              term: "Process restart",
              description: "DiskFileBlobStore::open은 이전 blob directory를 전부 지우고 새로 만듭니다.",
              boundary: "Restart 뒤 partial write를 복구하는 WAL·receipt store가 아니라 재생성 가능한 local cache입니다.",
            },
          ]}
        />
        <CodeLink
          codeKey="pool-boundary"
          label="Reth v2.8.1 · Pool 성공과 BlobStore insert 실패가 갈리는 지점"
          open={sidebar.open}
        />
      </section>

      <section id="paper-reth-blobstore" className="scroll-mt-20 space-y-5">
        <h2 className="break-keep text-2xl font-bold">근거 범위</h2>
        <CitationBlock
          type="code"
          citeKey={1}
          source="Reth v2.8.1 · d763342fa185 · transaction-pool/blobstore"
          href="https://github.com/paradigmxyz/reth/tree/v2.8.1/crates/transaction-pool/src/blobstore"
        >
          <p><b>확인한 범위:</b> BlobStore trait, Disk·memory backend, cache→file lookup, canonical tracker와 finality cleanup입니다.</p>
          <p><b>고정 조건:</b> Reth v2.8.1 release와 해당 source commit을 기준으로 읽었습니다.</p>
          <p><b>교정한 주장:</b> 실제 source에 없는 digest·generation·atomic receipt·restart recovery를 Reth의 보장으로 쓰지 않습니다.</p>
          <p><b>확대하지 않은 범위:</b> Local execution-client Pool retention을 consensus availability, rollup data service나 영구 archive 보장으로 확대하지 않습니다.</p>
          <p><b>측정하지 않은 값:</b> 대상 filesystem의 write·read latency, cache hit rate, deletion failure rate와 restart 영향은 아직 측정하지 않았습니다.</p>
        </CitationBlock>
        <RethEip4844MapReturn current="reth-blob-storage" />
      </section>

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ reth: rethBlobStorageTree }}
        projectMetas={PROJECT_META}
      />
    </article>
  );
}
