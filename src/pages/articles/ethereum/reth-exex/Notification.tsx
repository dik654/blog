import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import NotificationDetailViz from './viz/NotificationDetailViz';
import type { CodeRef } from '@/components/code/types';
import { NOTIFICATION_EVENTS } from './NotificationData';

export default function Notification({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  const sel = NOTIFICATION_EVENTS.find(e => e.id === activeEvent);

  return (
    <section id="notification" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ExExNotification 스트림</h2>
      <div className="not-prose mb-8"><NotificationDetailViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('exex-notification', codeRefs['exex-notification'])} />
          <span className="text-[10px] text-muted-foreground self-center">ExExNotification</span>
          <CodeViewButton onClick={() => onCodeRef('exex-manager', codeRefs['exex-manager'])} />
          <span className="text-[10px] text-muted-foreground self-center">ExExManager</span>
          <CodeViewButton onClick={() => onCodeRef('exex-context', codeRefs['exex-context'])} />
          <span className="text-[10px] text-muted-foreground self-center">ExExContext</span>
        </div>
        <p className="leading-7">
          ExExNotification은 3종의 체인 이벤트를 정의한다.<br />
          모든 이벤트가 <code>Arc&lt;Chain&gt;</code>으로 감싸져 있어, clone 시 블록 데이터를 복사하지 않는다.<br />
          10개 ExEx가 동시에 구독해도 메모리에는 블록 데이터 1벌만 존재한다.
        </p>
        <p className="leading-7">
          ExExManager가 send_notification()을 호출하면, 등록된 모든 ExEx에 이벤트가 fan-out된다.<br />
          각 ExEx는 자신의 속도로 이벤트를 처리하고, 완료 시 FinishedHeight를 보고한다.
        </p>

        {/* ── ExExNotification enum ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">ExExNotification — 3가지 이벤트</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub enum ExExNotification {
    /// 새 블록이 canonical chain에 추가됨
    ChainCommitted {
        new: Arc<Chain>,
    },

    /// reorg 발생: old chain을 제거하고 new chain 적용
    ChainReorged {
        old: Arc<Chain>,  // 제거되는 체인
        new: Arc<Chain>,  // 새 canonical 체인
    },

    /// canonical에서 블록 제거 (unwind)
    ChainReverted {
        old: Arc<Chain>,  // 제거되는 블록들
    },
}

// Chain 구조:
pub struct Chain {
    /// 블록들 (번호 순서)
    blocks: BTreeMap<BlockNumber, SealedBlockWithSenders>,

    /// 실행 결과 (BundleState)
    state: ExecutionOutcome,

    /// chain의 첫/마지막 블록
    first: BlockNumber,
    tip: BlockNumber,
}

impl Chain {
    pub fn blocks(&self) -> impl Iterator<Item = &SealedBlockWithSenders> { ... }
    pub fn execution_outcome(&self) -> &ExecutionOutcome { ... }
    pub fn tip(&self) -> &SealedBlockWithSenders { ... }
}

// Arc<Chain>의 이점:
// - clone 비용: O(1) (참조 카운터 증가만)
// - 메모리: 여러 ExEx가 공유 → 한 벌만 존재
// - drop: 마지막 참조 사라지면 자동 해제`}
        </pre>
        <p className="leading-7">
          3가지 이벤트로 <strong>canonical chain 변화 전체 표현</strong>.<br />
          Committed/Reorged/Reverted로 모든 시나리오 커버.<br />
          <code>Arc&lt;Chain&gt;</code>으로 zero-copy 공유 — 메모리 효율 극대화.
        </p>

        {/* ── Chain 상세 접근 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Chain — 블록 + 실행 결과 통합</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// ExEx에서 Chain의 데이터 활용 예시

async fn process_chain(chain: Arc<Chain>) -> Result<()> {
    // 1. 블록 순회
    for block in chain.blocks() {
        println!("Block #{}: {} txs, gas_used={}",
            block.number, block.body.transactions.len(),
            block.header.gas_used);

        // 2. TX 순회
        for (tx, sender) in block.body.transactions.iter()
            .zip(&block.senders) {
            println!("  {} from {}", tx.hash(), sender);
        }
    }

    // 3. 실행 결과 접근
    let outcome = chain.execution_outcome();

    // 계정 변경
    for (addr, bundle_acc) in outcome.bundle.state() {
        if let Some(info) = &bundle_acc.info {
            println!("Account {} balance: {}", addr, info.balance);
        }
    }

    // 영수증 (event logs)
    for receipt in outcome.receipts.iter().flatten() {
        for log in &receipt.logs {
            // log 인덱싱, 필터링 등
        }
    }

    Ok(())
}

// 인덱서가 활용하는 정보:
// - 모든 TX 해시 + sender
// - 모든 log (주소, 토픽, 데이터)
// - 모든 계정 변경 (잔고, nonce, code)
// - 모든 storage 변경
// - gas 사용량, timestamp 등 헤더 정보`}
        </pre>
        <p className="leading-7">
          <code>Chain</code>이 <strong>블록 + 실행 결과 통합 표현</strong>.<br />
          ExEx는 이 하나의 struct에서 모든 필요한 정보 접근.<br />
          별도 DB 쿼리 없이 in-memory 데이터로 인덱싱 완료.
        </p>

        {/* ── Fan-out 메커니즘 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ExExManager — 다중 ExEx fan-out</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 등록된 모든 ExEx에 이벤트 전파
pub struct ExExManager {
    /// 등록된 ExEx 목록
    exexes: Vec<ExExHandle>,

    /// 최소 finished_height (모든 ExEx가 처리 완료한 블록)
    min_finished_height: BlockNumber,
}

pub struct ExExHandle {
    pub id: String,
    pub sender: UnboundedSender<ExExNotification>,
    pub finished_height: BlockNumber,
}

impl ExExManager {
    /// 새 이벤트를 모든 ExEx에 fan-out
    pub fn send_notification(&self, notification: ExExNotification) {
        let arc_notif = Arc::new(notification);

        for exex in &self.exexes {
            // Arc clone만 → 데이터 복사 없음
            if let Err(_) = exex.sender.send(arc_notif.clone()) {
                warn!("ExEx {} channel closed", exex.id);
            }
        }
    }

    /// 각 ExEx의 FinishedHeight 이벤트 수집
    pub fn on_exex_finished_height(
        &mut self,
        exex_id: &str,
        height: BlockNumber,
    ) {
        if let Some(exex) = self.exexes.iter_mut().find(|e| e.id == exex_id) {
            exex.finished_height = height;
        }

        // 모든 ExEx의 최소값 업데이트
        self.min_finished_height = self.exexes.iter()
            .map(|e| e.finished_height)
            .min()
            .unwrap_or(0);

        // 노드에 알림 → 이 높이 이하 prune 허용
        self.node.set_prune_height(self.min_finished_height);
    }
}

// 결과:
// - 10개 ExEx 등록 가능
// - 블록 1GB 크기여도 메모리 1GB만 (Arc 공유)
// - 가장 느린 ExEx가 전체 prune 속도 결정`}
        </pre>
        <p className="leading-7">
          ExExManager가 <strong>N:M fan-out</strong> 수행.<br />
          하나의 Arc&lt;Chain&gt;을 모든 ExEx에 clone → 메모리 1벌만 유지.<br />
          min_finished_height로 가장 느린 ExEx 추적 → prune 안전성 보장.
        </p>
      </div>

      {/* Event type cards */}
      <div className="not-prose grid grid-cols-3 gap-3 mb-4">
        {NOTIFICATION_EVENTS.map(e => (
          <button key={e.id}
            onClick={() => setActiveEvent(activeEvent === e.id ? null : e.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: activeEvent === e.id ? e.color : 'var(--color-border)',
              background: activeEvent === e.id ? `${e.color}10` : undefined,
            }}>
            <p className="font-mono text-xs font-bold" style={{ color: e.color }}>{e.name}</p>
            <p className="text-xs text-foreground/60 mt-1">{e.desc}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>{sel.name}</p>
            <div className="space-y-1 text-sm">
              <p className="text-foreground/80"><span className="text-foreground/50">페이로드:</span> {sel.payload}</p>
              <p className="text-foreground/80"><span className="text-foreground/50">처리 예시:</span> {sel.handling}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>Arc fan-out의 효율성</strong> — Arc&lt;Chain&gt;의 clone은 원자적 참조 카운트 증가(1 CPU 명령어)뿐이다.<br />
          수 MB의 블록 데이터를 복사하는 것과는 차원이 다른 성능을 제공한다.
        </p>
      </div>
    </section>
  );
}
