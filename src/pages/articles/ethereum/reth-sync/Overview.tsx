import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import SyncStrategyViz from './viz/SyncStrategyViz';
import type { CodeRef } from '@/components/code/types';
import { SYNC_MODES, SYNC_COMPARISONS } from './OverviewData';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = SYNC_MODES.find(m => m.id === selected);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">동기화 모드 비교</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          이더리움 노드의 동기화란, 제네시스 블록부터 현재까지의 상태를 확보하는 과정이다.<br />
          2024년 기준 블록 번호가 2000만에 가까우므로, 전략 선택이 노드 운영 비용을 좌우한다.
        </p>
        <p className="leading-7">
          Reth는 세 가지 동기화 모드를 지원한다.<br />
          각 모드는 보안성과 속도의 트레이드오프가 다르다.<br />
          아래 카드를 클릭하면 각 모드의 설계 판단을 확인할 수 있다.
        </p>

        {/* ── 3가지 모드 비교 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">3가지 동기화 모드</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 1. Full Sync (파이프라인 기반)
//    - 제네시스부터 모든 블록 실행 → 전체 역사 재현
//    - 완전 신뢰 없이 진행 (매 블록 검증)
//    - 소요 시간: ~하루 (Reth 기준)
//    - 디스크: ~2.5TB (archive)
//    - 용도: 기본 노드 운영, validator, archive

// 2. Snap Sync (스냅샷 다운로드)
//    - 특정 블록의 상태 스냅샷을 피어에서 다운로드
//    - 그 이후 블록만 실행
//    - 소요 시간: ~수 시간 (Reth 기준)
//    - 디스크: 최소 ~500GB (recent state + history)
//    - 용도: 빠른 노드 부팅, RPC 서버
//    - 신뢰 가정: 피어가 올바른 스냅샷 제공

// 3. Live Sync (CL FCU 기반)
//    - 이미 동기화된 노드가 tip을 따라감
//    - CL(consensus layer)이 FCU로 새 블록 알림
//    - 블록당 ~50ms 처리 (빠름)
//    - 용도: 운영 중 노드 유지

// 전환:
// Full → Live: 제네시스부터 시작 → tip 도달 → Live 진입
// Snap → Live: 스냅샷 + 최근 블록 → tip 도달 → Live 진입`}
        </pre>
        <p className="leading-7">
          3가지 모드는 <strong>용도별 선택지</strong>.<br />
          Full은 "완전한 역사 확보", Snap은 "빠른 부팅", Live는 "tip 추적".<br />
          일반 사용자는 Snap → Live, validator는 Full → Live, archive는 Full 유지.
        </p>

        {/* ── FCU 기반 동기화 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">FCU — CL과 EL의 동기화 트리거</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// ForkChoiceUpdated (FCU) — Engine API 메시지
// CL (Lighthouse, Prysm 등)이 EL (Reth)에 전송

struct ForkchoiceUpdatedV3 {
    head_block_hash: B256,        // 현재 체인의 head
    safe_block_hash: B256,        // 다음 epoch 안전 블록
    finalized_block_hash: B256,   // 되돌릴 수 없는 블록
    payload_attributes: Option<PayloadAttributes>, // 블록 생성 요청
}

// EL 응답:
struct ForkchoiceUpdatedResponse {
    payload_status: PayloadStatus,  // VALID, INVALID, SYNCING
    payload_id: Option<PayloadId>,  // 블록 생성 ID (validator만)
}

// 3가지 상태별 EL 동작:
// - VALID: 이미 이 블록 실행 완료, head 업데이트
// - INVALID: 블록 검증 실패, CL에 거부 알림
// - SYNCING: 블록 미확보, 백그라운드로 다운로드 중

// PoS 이후 EL은 CL에 완전히 종속:
// - CL이 head를 결정 (proposer 선택, attestation)
// - EL은 CL의 지시에 따라 블록 실행 & head 업데이트
// - EL은 더 이상 자기 tip을 독립적으로 결정하지 않음

// 동기화 시작 트리거:
// CL이 FCU로 "X 블록이 head"라고 알림 → EL이 X까지 동기화 시도`}
        </pre>
        <p className="leading-7">
          <strong>PoS 전환 이후 EL은 CL의 명령을 따름</strong>.<br />
          FCU가 "이 블록이 head다"라고 알려주면 EL은 그 블록까지 동기화.<br />
          Pre-PoS 시절 EL이 자체 fork-choice로 tip을 결정하던 것과 근본적 차이.
        </p>

        {/* ── BlockchainTree ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BlockchainTree — canonical/non-canonical 체인 관리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BlockchainTree: in-memory에서 최근 블록들 관리
// canonical chain + side chains (fork 후보) 동시 유지

pub struct BlockchainTree {
    /// canonical chain의 tip
    canonical_head: B256,
    /// finalized 블록 (되돌릴 수 없음)
    finalized: BlockNumber,

    /// 최근 블록들 (canonical + 후보 fork)
    /// 최대 128 블록 유지 (reorg 가능 깊이)
    blocks: HashMap<B256, ExecutedBlock>,

    /// 부모 → 자식 매핑 (fork 추적)
    children: HashMap<B256, Vec<B256>>,
}

impl BlockchainTree {
    /// 새 블록 추가 → canonical 확장 or new fork
    pub fn insert_block(&mut self, block: Block) -> BlockStatus {
        // 1. 블록 실행 & 검증
        let executed = execute_block(block)?;

        // 2. 부모가 canonical인지 확인
        if executed.parent_hash == self.canonical_head {
            // canonical 확장
            self.canonical_head = executed.hash;
            return BlockStatus::Valid;
        }

        // 3. 아니면 fork 후보로 추가
        self.blocks.insert(executed.hash, executed);
        BlockStatus::Accepted  // side chain
    }

    /// FCU에 따라 canonical chain 재결정
    pub fn update_canonical(&mut self, new_head: B256) {
        // canonical → non-canonical 전환: unwind
        // non-canonical → canonical 전환: apply
        self.walk_canonical_path(new_head);
    }
}`}
        </pre>
        <p className="leading-7">
          <code>BlockchainTree</code>가 <strong>reorg 처리의 핵심</strong>.<br />
          여러 fork 후보를 메모리에 유지 → CL이 다른 fork를 선택하면 즉시 canonical 전환.<br />
          128 블록 (~25분) 깊이까지 reorg 지원 — PoS finality 전까지의 버퍼.
        </p>
      </div>

      <div className="not-prose grid grid-cols-3 gap-3 mb-4">
        {SYNC_MODES.map(m => (
          <button key={m.id}
            onClick={() => setSelected(selected === m.id ? null : m.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: selected === m.id ? m.color : 'var(--color-border)',
              background: selected === m.id ? `${m.color}10` : undefined,
            }}>
            <p className="font-mono font-bold text-sm" style={{ color: m.color }}>{m.label}</p>
            <p className="text-xs text-foreground/60 mt-1">{m.role}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>{sel.label}</p>
            <p className="text-sm text-foreground/80 leading-relaxed mb-2">{sel.details}</p>
            <p className="text-sm text-amber-600 dark:text-amber-400 leading-relaxed">{sel.why}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison table */}
      <div className="not-prose overflow-x-auto mb-6">
        <table className="min-w-full text-sm border border-border">
          <thead><tr className="bg-muted">
            <th className="border border-border px-4 py-2 text-left">항목</th>
            <th className="border border-border px-4 py-2 text-left">Full</th>
            <th className="border border-border px-4 py-2 text-left">Snap</th>
            <th className="border border-border px-4 py-2 text-left">Live</th>
          </tr></thead>
          <tbody>
            {SYNC_COMPARISONS.map(c => (
              <tr key={c.aspect}>
                <td className="border border-border px-4 py-2 font-medium">{c.aspect}</td>
                <td className="border border-border px-4 py-2">{c.full}</td>
                <td className="border border-border px-4 py-2">{c.snap}</td>
                <td className="border border-border px-4 py-2">{c.live}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="not-prose mt-6"><SyncStrategyViz /></div>
    </section>
  );
}
