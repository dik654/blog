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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// bbolt ACID 트랜잭션

// Read-only transaction (병렬 가능)
func getBlockByRoot(root [32]byte) (*Block, error) {
    var block Block
    err := db.View(func(tx *bolt.Tx) error {
        bucket := tx.Bucket([]byte("blocks"))
        data := bucket.Get(root[:])
        if data == nil { return ErrNotFound }
        return block.UnmarshalSSZ(data)
    })
    return &block, err
}

// Write transaction (single writer)
func saveBlock(root [32]byte, block *Block) error {
    return db.Update(func(tx *bolt.Tx) error {
        // 1. blocks bucket에 저장
        blocksBucket := tx.Bucket([]byte("blocks"))
        encoded, _ := block.MarshalSSZ()
        if err := blocksBucket.Put(root[:], encoded); err != nil {
            return err
        }

        // 2. indices 업데이트 (같은 TX 내에서 원자적)
        slotIdxBucket := tx.Bucket([]byte("block-slot-indices"))
        slotKey := encodeSlot(block.Slot)
        if err := slotIdxBucket.Put(slotKey, root[:]); err != nil {
            return err
        }

        parentIdxBucket := tx.Bucket([]byte("block-parent-root-indices"))
        if err := parentIdxBucket.Put(root[:], block.ParentRoot[:]); err != nil {
            return err
        }

        return nil  // commit
    })
}

// ACID 보장:
// - Atomicity: 여러 버킷 업데이트 원자적
// - Consistency: 커밋 실패 시 전체 롤백
// - Isolation: read TX는 write TX와 독립 (MVCC)
// - Durability: fsync() on commit

// MVCC:
// - read TX 시작 시 snapshot 고정
// - write TX 커밋 후에도 기존 read TX는 이전 view 유지
// - copy-on-write로 페이지 관리`}
        </pre>
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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 원본 데이터 버킷에 직접 저장되지 않는 쿼리를 위한 보조 인덱스

// 1. block-slot-indices:
//    Key: slot (u64 big-endian)
//    Val: block_root (32 bytes)
//    용도: "slot N의 block은?" → O(log N)

// 2. block-parent-root-indices:
//    Key: root (32 bytes)
//    Val: parent_root (32 bytes)
//    용도: "이 블록의 부모는?" → O(log N)

// 3. finalized-block-roots-indices:
//    Key: epoch (u64)
//    Val: block_root
//    용도: finalized checkpoint 관리

// 4. state-slot-indices:
//    Key: slot
//    Val: state_root
//    용도: slot 기반 state 조회

// 5. validator-pubkeys-to-indices:
//    Key: pubkey (48 bytes)
//    Val: validator_index (u64)
//    용도: public key → validator 인덱스 변환 (RPC)

// 쓰기 증폭:
// 블록 1개 저장 → 원본 1 write + 3 index write = 4 writes
// 트랜잭션 1개로 묶어서 원자성 보장

// B+tree 범위 스캔:
// key가 대부분 순차(slot, epoch) → 범위 쿼리 효율적
// 예: slot range query → prefix scan
cur := bucket.Cursor()
for k, v := cur.Seek(startSlotKey); k != nil && bytes.Compare(k, endSlotKey) <= 0; k, v = cur.Next() {
    // 범위 내 모든 블록 처리
}`}
        </pre>
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
