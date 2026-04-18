import ContextViz from './viz/ContextViz';
import BeaconDBSchemaViz from './viz/BeaconDBSchemaViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">DB 아키텍처</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 BoltDB 초기화, 버킷 구조, 상태 저장 전략을 코드 수준으로 추적한다.
        </p>

        {/* ── BoltDB 선택 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BoltDB — 왜 이 엔진을 선택했나</h3>
        <div className="not-prose grid gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">BoltDB (bbolt) 특징</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>B+tree, embedded, single-file / ACID transactions (MVCC)</li>
              <li>Pure Go 구현 (CGo 없음) / LMDB 영감 설계</li>
              <li>mmap 기반 read-only 접근 / single writer, multiple readers</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">대안 비교</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="rounded border p-3">
                <p className="font-medium mb-1">LevelDB <span className="text-xs text-muted-foreground">(Geth EL)</span></p>
                <p className="text-muted-foreground text-xs">+ 쓰기 성능 우수 (LSM-tree)</p>
                <p className="text-muted-foreground text-xs">- read amplification / compaction 오버헤드 / CGo 바인딩 필요</p>
              </div>
              <div className="rounded border p-3">
                <p className="font-medium mb-1">MDBX <span className="text-xs text-muted-foreground">(Reth, Erigon)</span></p>
                <p className="text-muted-foreground text-xs">+ 최고 성능</p>
                <p className="text-muted-foreground text-xs">- C 라이브러리 (CGo) / Go 생태계 미성숙</p>
              </div>
              <div className="rounded border p-3 border-blue-500/30 bg-blue-500/5">
                <p className="font-medium mb-1">BoltDB <span className="text-xs text-muted-foreground">(Prysm)</span></p>
                <p className="text-muted-foreground text-xs">+ Pure Go (빌드 단순) / B+tree 일관된 read / CL 80% read에 적합</p>
                <p className="text-muted-foreground text-xs">- 큰 DB에서 쓰기 느림 (copy-on-write 페이지)</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">CL 워크로드 특성</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>block/state 저장: 매 12초 1회 (빈번하지 않음)</li>
              <li>state 조회: 매우 빈번 (fork choice, RPC) / historical 조회: 간헐적</li>
              <li>read-heavy + write 버스트 → B+tree가 적합</li>
              <li>큰 state (~250MB) 저장 → bbolt "free page" 관리로 성능 유지</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          Prysm은 <strong>BoltDB(bbolt)</strong>를 선택 — pure Go + B+tree.<br />
          LevelDB(LSM) 대비 read-heavy 워크로드에 유리.<br />
          CL 특성(80% read)과 잘 맞음 + CGo 의존성 제거.
        </p>

        {/* ── DB 레이아웃 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">DB 파일 레이아웃</h3>
        <div className="not-prose grid gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">파일 경로</h4>
            <p className="text-sm text-muted-foreground"><code className="text-xs">~/.eth2/beaconchaindata/beaconchain.db</code> (single file)</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Meta 버킷</h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded bg-muted px-2 py-1">schemaVersion</span>
              <span className="rounded bg-muted px-2 py-1">config (ChainSpec)</span>
              <span className="rounded bg-muted px-2 py-1">genesisBlock</span>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Data 버킷</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-muted-foreground">
              <span><code>blocksBucket</code> — root → SSZ block</span>
              <span><code>stateBucket</code> — root → SSZ state</span>
              <span><code>stateSummaryBucket</code> — slot → root</span>
              <span><code>blockParentRootIndices</code> — root → parent_root</span>
              <span><code>blockSlotIndicesBucket</code> — slot → root</span>
              <span><code>finalizedBlockRootsIndex</code> — epoch → root</span>
              <span><code>validatorsBucket</code> — pubkey → index</span>
              <span><code>proposerSlashingsBucket</code></span>
              <span><code>attesterSlashingsBucket</code></span>
              <span><code>voluntaryExitsBucket</code></span>
              <span><code>blsToExecChangesBucket</code> — BLS → ETH1 주소 변경</span>
              <span><code>depositContractBucket</code> / <code>powChainDataBucket</code></span>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">크기 추정 (메인넷, 1년)</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
              <span>blocks: ~6 GB</span>
              <span>states: ~100 GB</span>
              <span>summaries: ~80 MB</span>
              <span>indices: ~500 MB</span>
              <span>slashings 등: ~100 MB</span>
              <span className="font-medium text-foreground">총 ~107 GB / Archive ~5 TB</span>
            </div>
          </div>
        </div>
        <p className="leading-7">
          BeaconDB는 <strong>단일 파일 + 10+ 버킷</strong>.<br />
          각 버킷이 독립 B+tree → 서로 다른 데이터 유형 격리.<br />
          인덱스 버킷으로 slot/epoch 기반 조회 최적화.
        </p>
      </div>
      <div className="not-prose mt-6"><BeaconDBSchemaViz /></div>
    </section>
  );
}
