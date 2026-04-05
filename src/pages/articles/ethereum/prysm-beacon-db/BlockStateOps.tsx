import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function BlockStateOps({ onCodeRef }: Props) {
  return (
    <section id="block-state-ops" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">블록 & 상태 CRUD</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── SaveBlock ── */}
        <h3 className="text-xl font-semibold mt-2 mb-3">SaveBlock</h3>
        <p className="leading-7">
          블록의 <code>HashTreeRoot()</code>를 키로, SSZ 바이트를 값으로 저장한다.<br />
          슬롯→루트 인덱스도 함께 기록해 슬롯 기반 조회를 지원한다.
        </p>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// SaveBlock 구현
func (s *Store) SaveBlock(ctx context.Context, block *SignedBeaconBlock) error {
    // 1. HashTreeRoot 계산 (캐시될 수 있음)
    root, err := block.Block.HashTreeRoot()
    if err != nil { return err }

    return s.db.Update(func(tx *bolt.Tx) error {
        // 2. SSZ 직렬화
        encoded, err := block.MarshalSSZ()
        if err != nil { return err }

        // 3. blocks bucket에 저장
        blocksBucket := tx.Bucket(blocksBucket)
        if err := blocksBucket.Put(root[:], encoded); err != nil {
            return err
        }

        // 4. 관련 인덱스 업데이트
        slotIdx := tx.Bucket(blockSlotIndicesBucket)
        if err := slotIdx.Put(
            slotEncoder(block.Block.Slot), root[:],
        ); err != nil { return err }

        parentIdx := tx.Bucket(blockParentRootIndicesBucket)
        parentRoot := block.Block.ParentRoot
        if err := parentIdx.Put(root[:], parentRoot[:]); err != nil {
            return err
        }

        return nil
    })
}

// 성능 특성:
// - 블록 크기: ~100 KB (attestation 많을수록 큼)
// - SSZ encode: ~5ms
// - bbolt write: ~10ms (fsync 포함)
// - 총: ~15ms per block (슬롯 12초 대비 여유)`}
        </pre>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('save-block', codeRefs['save-block'])} />
          <span className="text-[10px] text-muted-foreground self-center">SaveBlock()</span>
          <CodeViewButton onClick={() => onCodeRef('get-block', codeRefs['get-block'])} />
          <span className="text-[10px] text-muted-foreground self-center">Block()</span>
        </div>

        {/* ── SaveState ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">SaveState</h3>
        <p className="leading-7">
          상태는 블록보다 훨씬 크다 (수백 MB).<br />
          <strong>에폭 경계</strong>에서만 상태를 저장하고, 중간 슬롯은 StateSummary로 대체한다.
        </p>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// SaveState: state 저장 + 인덱스 + summary
func (s *Store) SaveState(
    ctx context.Context,
    st *BeaconState,
    blockRoot [32]byte,
) error {
    // 1. 저장 여부 결정 (K-slot 정책)
    if !shouldSaveState(st.Slot()) {
        // State 저장 skip, summary만
        return s.saveStateSummary(st.Slot(), blockRoot)
    }

    return s.db.Update(func(tx *bolt.Tx) error {
        // 2. SSZ 직렬화 (~250 MB!)
        encoded, err := st.MarshalSSZ()
        if err != nil { return err }

        // 3. state bucket에 저장 (대형 write TX)
        stateBucket := tx.Bucket(stateBucket)
        if err := stateBucket.Put(blockRoot[:], encoded); err != nil {
            return err
        }

        // 4. state summary 업데이트
        summaryBucket := tx.Bucket(stateSummaryBucket)
        summary := &StateSummary{Slot: st.Slot(), Root: blockRoot}
        encodedSummary, _ := summary.MarshalSSZ()
        return summaryBucket.Put(blockRoot[:], encodedSummary)
    })
}

// 큰 state 저장의 비용:
// - SSZ marshal: ~200ms (250 MB 데이터)
// - bbolt write TX: ~500ms (대형 page split)
// - fsync: ~50ms (SSD) / ~수 초 (HDD)
// - 총: ~700ms per state save (archive mode에서는 더 자주 발생)

// 최적화:
// - 비동기 저장 (백그라운드 goroutine)
// - 중요 경로(fork choice)에서는 비차단
// - 주기적 flush`}
        </pre>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('save-state', codeRefs['save-state'])} />
          <span className="text-[10px] text-muted-foreground self-center">SaveState()</span>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 에폭 경계 저장 전략</strong> — 매 슬롯 저장 대비 디스크 사용량 1/32.<br />
          중간 슬롯 상태가 필요하면 가장 가까운 에폭 경계 상태에서 Replay.<br />
          최대 31슬롯(~6.2분) 재생으로 트레이드오프.
        </p>
      </div>
    </section>
  );
}
