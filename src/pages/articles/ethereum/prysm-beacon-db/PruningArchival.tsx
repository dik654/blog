import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function PruningArchival({ onCodeRef: _ }: Props) {
  return (
    <section id="pruning-archival" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">프루닝 & 아카이벌</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Finalized 체크포인트가 갱신되면 그 이전의 비-캐노니컬 데이터를 정리한다.<br />
          디스크 사용량을 제어하는 핵심 메커니즘이다.
        </p>

        {/* ── Pruning 흐름 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Pruning 프로세스 — finalized 이후</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Finalized checkpoint 갱신 시 pruning trigger

func (s *Service) pruneFinalized(finalized *Checkpoint) error {
    finalizedSlot := finalized.Epoch * SLOTS_PER_EPOCH

    // 1. canonical chain 확인
    canonicalChain := s.collectCanonicalChain(finalizedSlot)

    // 2. 각 버킷 순회, non-canonical 항목 삭제
    return s.db.Update(func(tx *bolt.Tx) error {
        // blocks bucket 순회
        cur := tx.Bucket(blocksBucket).Cursor()
        for k, _ := cur.First(); k != nil; k, _ = cur.Next() {
            var root [32]byte
            copy(root[:], k)

            // 블록의 slot 확인
            block, err := s.BlockByRoot(ctx, root)
            if err != nil { continue }

            if block.Slot() >= finalizedSlot {
                continue  // finalized 이후 블록은 유지
            }

            if !canonicalChain.Contains(root) {
                // non-canonical + pre-finalized → 삭제
                cur.Delete()
            }
        }

        // 관련 인덱스도 정리
        // - parent_root_indices
        // - slot_indices
        // - state (referenced by deleted blocks)

        return nil
    })
}

// Pruning 주기:
// - Finalized checkpoint 변경 시 트리거
// - 매 epoch 경계 (~6.4분) 약 1회
// - 삭제 대상 적으므로 빠름 (~수 ms)

// 주의:
// - bbolt는 공간 즉시 반환 안 함 (free page)
// - 삭제된 페이지는 재사용 대기
// - 실제 디스크 반환은 compaction 필요 (수동)`}
        </pre>
        <p className="leading-7">
          Pruning은 <strong>finalized checkpoint 갱신 시 트리거</strong>.<br />
          non-canonical + pre-finalized 블록/state 삭제.<br />
          bbolt는 공간 즉시 반환 안 함 → free page 재사용.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">프루닝 대상</h3>
        <ul>
          <li><strong>비-캐노니컬 블록</strong> — Finalized 이전, 캐노니컬 체인에 포함되지 않은 블록</li>
          <li><strong>고아 상태</strong> — 참조하는 블록이 삭제된 상태</li>
          <li><strong>만료된 어테스테이션</strong> — 이미 Finalized된 에폭의 미포함 어테스테이션</li>
        </ul>

        {/* ── Archive vs Prune ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Archive vs Prune 모드 — 운영 결정</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Archive 모드 (--archive flag)
// - 모든 데이터 영구 보관
// - Finalized pruning skip
// - 디스크: 연 ~2 TB 증가
// - RPC: 모든 과거 slot 즉시 응답

// Default 모드 (pruning 활성)
// - non-canonical 즉시 삭제
// - state 보존: 최근 ~10,000 epoch (~2달)
// - 디스크: 안정적 ~100 GB
// - RPC: 최근 상태만 즉시, 과거는 제한적

// Minimal 모드 (--minimal)
// - 최소 디스크 사용
// - 최근 1주만 보관
// - 디스크: ~30 GB
// - validator 기능만 수행

// 선택 기준:
// - Solo validator: default 또는 minimal
// - Institutional staker: default + replication
// - RPC provider: archive
// - Researcher/analyst: archive

// Pruning의 함정:
// 1. fork choice는 non-finalized 영역 필요
//    → 최소 finalized_epoch - 1 epoch 유지 필수
// 2. peer에게 과거 블록 제공 의무 (light client)
//    → min_epochs_for_block_requests (최소 보관)
// 3. reorg 대비 여유분
//    → finalized는 되돌릴 수 없지만 안전 margin

// DB compaction:
// - bbolt는 자동 compaction 없음
// - 수동 db.Compact() 필요
// - 오프라인에서 실행 권장 (~수 시간)`}
        </pre>
        <p className="leading-7">
          <strong>3가지 모드</strong>로 디스크 vs 기능 균형 조절.<br />
          Archive(~TB) → Default(~100GB) → Minimal(~30GB).<br />
          용도에 맞는 모드 선택이 운영 비용 결정.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 아카이벌 모드</strong> — --archive 플래그로 프루닝을 건너뛸 수 있음.<br />
          블록 탐색기, 분석 인프라 등 전체 히스토리가 필요한 경우 사용.<br />
          메인넷 기준 연간 수백 GB 이상이므로 충분한 스토리지가 전제.
        </p>
      </div>
    </section>
  );
}
