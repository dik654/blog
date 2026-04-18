import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function KvSchema({ onCodeRef: _ }: Props) {
  return (
    <section id="kv-schema" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">KV 버킷 스키마</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          BoltDB는 버킷(bucket)으로 네임스페이스를 분리한다.<br />
          각 버킷은 독립된 B+Tree이며, 키는 바이트 배열이다.
        </p>

        {/* ── bbolt 트랜잭션 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">bbolt 트랜잭션 모델</h3>
        <div className="not-prose grid gap-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">Read-only TX (병렬 가능)</h4>
              <p className="text-xs text-muted-foreground mb-1"><code>db.View()</code> — 읽기 전용 트랜잭션</p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li><code>tx.Bucket([]byte("blocks"))</code> 로 버킷 접근</li>
                <li><code>bucket.Get(root[:])</code> 로 키 조회</li>
                <li><code>block.UnmarshalSSZ(data)</code> 로 역직렬화</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">Write TX (single writer)</h4>
              <p className="text-xs text-muted-foreground mb-1"><code>db.Update()</code> — 읽기-쓰기 트랜잭션</p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>blocks bucket에 <code>Put(root, encoded)</code></li>
                <li>slot-indices bucket에 인덱스 기록</li>
                <li>parent-root-indices bucket에 인덱스 기록</li>
                <li>같은 TX 내에서 원자적 업데이트</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">ACID 보장</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-muted-foreground">
              <div><span className="font-medium text-foreground">Atomicity</span> — 여러 버킷 업데이트 원자적</div>
              <div><span className="font-medium text-foreground">Consistency</span> — 커밋 실패 시 전체 롤백</div>
              <div><span className="font-medium text-foreground">Isolation</span> — read TX는 write TX와 독립 (MVCC)</div>
              <div><span className="font-medium text-foreground">Durability</span> — <code>fsync()</code> on commit</div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">MVCC 동작</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>read TX 시작 시 snapshot 고정 — write TX 커밋 후에도 기존 read TX는 이전 view 유지</li>
              <li>copy-on-write로 페이지 관리</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          bbolt의 <strong>ACID 트랜잭션</strong>이 데이터 일관성 보장.<br />
          View(read-only) + Update(read-write) 2가지 transaction 타입.<br />
          MVCC로 read와 write 병렬 진행 — lock contention 최소.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">주요 버킷</h3>
        <ul>
          <li><code>blocksBucket</code> — root → SSZ(SignedBeaconBlock)</li>
          <li><code>stateBucket</code> — root → SSZ(BeaconState)</li>
          <li><code>validatorsBucket</code> — pubkey → 검증자 인덱스</li>
          <li><code>proposerSlashingsBucket</code> — 제안자 슬래싱 증거</li>
          <li><code>attesterSlashingsBucket</code> — 증인자 슬래싱 증거</li>
          <li><code>stateSummaryBucket</code> — root → StateSummary</li>
        </ul>

        {/* ── 인덱스 버킷 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">인덱스 버킷 — 다방향 조회</h3>
        <div className="not-prose grid gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-3">보조 인덱스 버킷</h4>
            <div className="grid gap-2 text-xs">
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">1</span>
                <div><code>block-slot-indices</code> — Key: <code>slot</code> (u64 big-endian) → Val: <code>block_root</code> (32B). "slot N의 block은?" O(log N)</div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">2</span>
                <div><code>block-parent-root-indices</code> — Key: <code>root</code> (32B) → Val: <code>parent_root</code> (32B). "이 블록의 부모는?" O(log N)</div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">3</span>
                <div><code>finalized-block-roots-indices</code> — Key: <code>epoch</code> (u64) → Val: <code>block_root</code>. finalized checkpoint 관리</div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">4</span>
                <div><code>state-slot-indices</code> — Key: <code>slot</code> → Val: <code>state_root</code>. slot 기반 state 조회</div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">5</span>
                <div><code>validator-pubkeys-to-indices</code> — Key: <code>pubkey</code> (48B) → Val: <code>validator_index</code> (u64). pubkey → 인덱스 변환 (RPC)</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">쓰기 증폭</h4>
              <p className="text-xs text-muted-foreground">블록 1개 저장 → 원본 1 write + 3 index write = <strong className="text-foreground">4 writes</strong></p>
              <p className="text-xs text-muted-foreground">트랜잭션 1개로 묶어서 원자성 보장</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">B+tree 범위 스캔</h4>
              <p className="text-xs text-muted-foreground">key가 순차(slot, epoch) → <code>Cursor().Seek(startSlotKey)</code> 로 범위 쿼리 O(log N + K)</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <strong>인덱스 버킷</strong>이 다방향 조회 효율화.<br />
          원본(root → block) + 인덱스(slot → root, parent → root 등) 조합.<br />
          B+tree 범위 스캔으로 시간 범위 쿼리 O(log N + K).
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 인덱스 버킷 설계</strong> — blockSlotIndicesBucket은 슬롯→블록 루트 매핑을 저장.<br />
          슬롯 번호로 블록을 빠르게 찾는 보조 인덱스.<br />
          B+Tree 키 순서 스캔으로 범위 조회가 O(log N + K).
        </p>
      </div>
    </section>
  );
}
