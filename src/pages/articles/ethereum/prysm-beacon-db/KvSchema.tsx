import type { CodeRef } from "@/components/code/types";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function KvSchema({ onCodeRef: _ }: Props) {
  return (
    <section id="kv-schema" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">KV 버킷 스키마</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Prysm의 bbolt-backed store는 bucket으로 key namespace를 나누고 byte-sorted B+tree 안에 key-value를 저장합니다. Bucket boundary는 block, state와 index가 같은 key space에서 충돌하지 않게 하며 schema migration과 access pattern을 분리하는 기준이 됩니다.
        </p>

        {/* ── bbolt 트랜잭션 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">bbolt 트랜잭션 모델</h3>
        <div className="not-prose grid gap-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">
                Read-only TX (병렬 가능)
              </h4>
              <p className="text-xs text-muted-foreground mb-1">
                <code>db.View()</code> — 읽기 전용 트랜잭션
              </p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>
                  <code>tx.Bucket([]byte("blocks"))</code> 로 버킷 접근
                </li>
                <li>
                  <code>bucket.Get(root[:])</code> 로 키 조회
                </li>
                <li>
                  <code>block.UnmarshalSSZ(data)</code> 로 역직렬화
                </li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">
                Write TX (single writer)
              </h4>
              <p className="text-xs text-muted-foreground mb-1">
                <code>db.Update()</code> — 읽기-쓰기 트랜잭션
              </p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>
                  blocks bucket에 <code>Put(root, encoded)</code>
                </li>
                <li>slot-indices bucket에 인덱스 기록</li>
                <li>parent-root-indices bucket에 인덱스 기록</li>
                <li>같은 TX 내에서 원자적 업데이트</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">ACID 보장</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-muted-foreground">
              <div>
                <span className="font-medium text-foreground">Atomicity</span> —
                여러 버킷 업데이트 원자적
              </div>
              <div>
                <span className="font-medium text-foreground">Consistency</span>{" "}
                — 커밋 실패 시 전체 롤백
              </div>
              <div>
                <span className="font-medium text-foreground">Isolation</span> —
                read TX는 write TX와 독립 (MVCC)
              </div>
              <div>
                <span className="font-medium text-foreground">Durability</span>{" "}
                — <code>fsync()</code> on commit
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">MVCC 동작</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>
                read TX 시작 시 snapshot 고정 — write TX 커밋 후에도 기존 read
                TX는 이전 view 유지
              </li>
              <li>copy-on-write로 페이지 관리</li>
            </ul>
          </div>
        </div>
        <p>
          Bbolt는 <code>View</code> read transaction과 <code>Update</code> read-write transaction을 제공하며 copy-on-write page와 single-writer model로 atomic commit을 구현합니다. 여러 reader는 snapshot을 볼 수 있지만 write transaction은 한 번에 하나이므로 long reader·writer와 page growth가 latency에 미치는 영향도 관찰해야 합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">주요 버킷</h3>
        <ul>
          <li>
            <code>blocksBucket</code> — root → SSZ(SignedBeaconBlock)
          </li>
          <li>
            <code>stateBucket</code> — root → SSZ(BeaconState)
          </li>
          <li>
            <code>validatorsBucket</code> — pubkey → 검증자 인덱스
          </li>
          <li>
            <code>proposerSlashingsBucket</code> — 제안자 슬래싱 증거
          </li>
          <li>
            <code>attesterSlashingsBucket</code> — 증인자 슬래싱 증거
          </li>
          <li>
            <code>stateSummaryBucket</code> — root → StateSummary
          </li>
        </ul>

        {/* ── 인덱스 버킷 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          인덱스 버킷 — 다방향 조회
        </h3>
        <div className="not-prose grid gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-3">보조 인덱스 버킷</h4>
            <div className="grid gap-2 text-xs">
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">
                  1
                </span>
                <div>
                  <code>block-slot-indices</code> — Key: <code>slot</code> (u64
                  big-endian) → Val: <code>block_root</code> (32B). "slot N의
                  block은?" O(log N)
                </div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">
                  2
                </span>
                <div>
                  <code>block-parent-root-indices</code> — Key:{" "}
                  <code>root</code> (32B) → Val: <code>parent_root</code> (32B).
                  "이 블록의 부모는?" O(log N)
                </div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">
                  3
                </span>
                <div>
                  <code>finalized-block-roots-indices</code> — Key:{" "}
                  <code>epoch</code> (u64) → Val: <code>block_root</code>.
                  finalized checkpoint 관리
                </div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">
                  4
                </span>
                <div>
                  <code>state-slot-indices</code> — Key: <code>slot</code> →
                  Val: <code>state_root</code>. slot 기반 state 조회
                </div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">
                  5
                </span>
                <div>
                  <code>validator-pubkeys-to-indices</code> — Key:{" "}
                  <code>pubkey</code> (48B) → Val: <code>validator_index</code>{" "}
                  (u64). pubkey → 인덱스 변환 (RPC)
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">쓰기 증폭</h4>
              <p className="text-xs text-muted-foreground">
                블록 1개 저장 → 원본 1 write + 3 index write ={" "}
                <strong className="text-foreground">4 writes</strong>
              </p>
              <p className="text-xs text-muted-foreground">
                트랜잭션 1개로 묶어서 원자성 보장
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">B+tree 범위 스캔</h4>
              <p className="text-xs text-muted-foreground">
                key가 순차(slot, epoch) →{" "}
                <code>Cursor().Seek(startSlotKey)</code> 로 범위 쿼리 O(log N +
                K)
              </p>
            </div>
          </div>
        </div>
        <p>
          Primary bucket이 root에서 serialized block으로 가는 mapping을 보관한다면 secondary index bucket은 slot·parent root 같은 query key를 block root로 연결합니다. 정렬 가능한 fixed-width slot key를 사용하면 B+tree seek 뒤 연속 cursor scan으로 범위 result <em>K</em>개를 읽을 수 있지만, exact complexity와 disk I/O는 key layout과 cache 상태에 달려 있습니다.
        </p>

        <p className="mt-4 border-l-2 border-amber-500/50 pl-3 text-sm">
          <strong>💡 인덱스 버킷 설계</strong> — blockSlotIndicesBucket은
          slot에서 block root로 가는 secondary mapping을 저장합니다. Reader는 index에서 root를 찾은 뒤 primary block bucket을 조회하므로 index와 source record가 같은 transaction에서 일관되게 갱신되어야 합니다.
        </p>
      </div>
    </section>
  );
}
