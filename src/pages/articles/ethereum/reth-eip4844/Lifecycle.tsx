import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import LifecycleViz from './viz/LifecycleViz';
import type { CodeRef } from '@/components/code/types';

export default function Lifecycle({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="lifecycle" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Blob 생명주기</h2>
      <div className="not-prose mb-8"><LifecycleViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('canon-tracker', codeRefs['canon-tracker'])} />
          <span className="text-[10px] text-muted-foreground self-center">BlobStoreCanonTracker — finalization 정리</span>
        </div>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('header-4844-standalone', codeRefs['header-4844-standalone'])} />
          <span className="text-[10px] text-muted-foreground self-center">validate_4844_header_standalone()</span>
        </div>

        {/* ── Blob 생명주기 단계 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">Blob 생명주기 5단계</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Stage 1: Proposal (제출)
// searcher/rollup → EL의 txpool
// - eth_sendRawTransaction으로 blob TX 제출
// - sidecar 포함
// - validation 수행 → BlobPool 추가
// - BlobStore에 sidecar 저장

// Stage 2: Propagation (전파)
// EL → 다른 EL 노드들 (devp2p)
// - NewPooledTransactionHashes로 hash만 announce
// - 요청받으면 GetPooledTransactions로 sidecar 전송
// - eth/68 protocol

// Stage 3: Inclusion (블록 포함)
// Builder → validator → 블록 헤더
// - BlobPool에서 TX 선택 (최대 6 blob/block)
// - blob_versioned_hashes를 블록 헤더에 포함
// - sidecar는 블록에 포함 안 됨

// Stage 4: Attestation (검증)
// CL validators → attestation
// - 블록 검증 시 KZG proof 확인
// - 모든 validator가 sidecar 보관 (~18일)
// - finalized 블록은 되돌릴 수 없음

// Stage 5: Expiration (만료)
// ~18일 후 (4096 epoch)
// - CL/EL 모두 sidecar 삭제
// - commitment는 블록 헤더에 영구 보관
// - 과거 blob 필요 시 별도 archive 서비스에서 복원

// 시간:
// Proposal → Inclusion: 수 초 ~ 수 분
// Inclusion → Finalization: ~12-15분 (~2 epoch)
// Finalization → Expiration: ~18일`}
        </pre>
        <p className="leading-7">
          Blob은 <strong>5단계 생명주기</strong>를 거침.<br />
          블록 헤더에는 versioned_hash만 영구 보관, 실제 데이터는 임시.<br />
          18일 후 폐기 → 이더리움 상태 팽창 방지.
        </p>

        {/* ── BlobStoreCanonTracker ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BlobStoreCanonTracker — finalized 블록 추적</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// canonical chain tracking for blob cleanup
pub struct BlobStoreCanonTracker {
    /// 블록 번호별 blob TX 목록 (BTreeMap으로 정렬)
    blob_txs_by_block: BTreeMap<BlockNumber, Vec<TxHash>>,

    /// 연결된 BlobStore
    blob_store: Arc<dyn BlobStore>,
}

impl BlobStoreCanonTracker {
    /// 새 블록 포함 시 호출 (canonical chain)
    pub fn on_new_canonical_block(&mut self, block: &Block) {
        let blob_txs: Vec<TxHash> = block.body.transactions.iter()
            .filter(|tx| tx.is_eip4844())
            .map(|tx| tx.hash())
            .collect();

        if !blob_txs.is_empty() {
            self.blob_txs_by_block.insert(block.number, blob_txs);
        }
    }

    /// finalized 블록 업데이트 시 호출
    pub fn on_finalized_block(&mut self, finalized: BlockNumber) {
        // finalized 이전 블록의 blob TX들 수집
        let to_remove: Vec<_> = self.blob_txs_by_block
            .range(..=finalized)
            .flat_map(|(_, txs)| txs.iter().copied())
            .collect();

        // BlobStore에서 삭제 요청 (지연 삭제)
        self.blob_store.delete_all(to_remove).unwrap();

        // 추적 목록에서 제거
        self.blob_txs_by_block.retain(|&num, _| num > finalized);
    }
}

// BTreeMap 사용 이유:
// - 블록 번호 정렬 보장
// - range() 쿼리로 효율적 삭제
// - first_entry() O(1) 접근
// - 반복 순회 시 정렬 순서 보장`}
        </pre>
        <p className="leading-7">
          <code>BlobStoreCanonTracker</code>가 <strong>finalized 블록 기반 정리</strong>.<br />
          블록 번호별 blob TX 매핑 유지 → finalized 이하 일괄 삭제.<br />
          BTreeMap으로 범위 쿼리 효율화 — O(log n) range + O(1) first_entry.
        </p>

        {/* ── reorg 처리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Reorg 처리 — Blob 재주입</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Reorg 발생 시 blob TX 재주입 플로우

fn on_chain_reorg(
    &mut self,
    old_chain: &Chain,  // 제거될 체인
    new_chain: &Chain,  // 새 canonical 체인
) -> Result<()> {
    // 1. old chain의 blob TX들을 pool에 재주입
    for block in old_chain.blocks() {
        for tx in &block.body.transactions {
            if tx.is_eip4844() {
                // BlobStore에 sidecar 여전히 있는지 확인
                let sidecar = self.blob_store.get(tx.hash())?;

                if let Some(sidecar) = sidecar {
                    // 있음 → pool에 재주입 (KZG 재검증 skip)
                    self.pool.insert_with_sidecar(
                        tx.clone(),
                        sidecar,
                        ValidationContext::SkipKzg,
                    )?;
                } else {
                    // 없음 → 복원 불가, 네트워크에서 재요청 필요
                    warn!("Lost blob sidecar for tx {}", tx.hash());
                }
            }
        }
    }

    // 2. new chain의 blob TX는 pool에서 제거
    for block in new_chain.blocks() {
        for tx in &block.body.transactions {
            if tx.is_eip4844() {
                self.pool.remove(&tx.hash());
            }
        }
    }

    // 3. BlobStoreCanonTracker 업데이트
    self.canon_tracker.rewind_to(old_chain.fork_point())?;
    self.canon_tracker.apply_new_chain(new_chain)?;

    Ok(())
}

// Reorg에서의 핵심 최적화:
// - BlobStore의 blob이 남아있으면 KZG 검증 skip
// - 네트워크 재요청 없이 즉시 pool 재주입
// - reorg 지연 최소화`}
        </pre>
        <p className="leading-7">
          Reorg 시 <strong>blob sidecar 재활용</strong> — BlobStore의 데이터 유지.<br />
          KZG 재검증 skip으로 reorg 처리 지연 최소.<br />
          sidecar 없는 경우에만 네트워크 재요청 (드문 케이스).
        </p>
      </div>
    </section>
  );
}
