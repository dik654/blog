import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { LIVE_EVENTS, REORG_STEPS } from './LiveSyncData';

export default function LiveSync({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  const selEvent = LIVE_EVENTS.find(e => e.id === activeEvent);
  const [activeReorg, setActiveReorg] = useState<number | null>(null);

  return (
    <section id="live-sync" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Live Sync & Reorg 처리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('sync-exex', codeRefs['sync-exex'])} />
          <span className="text-[10px] text-muted-foreground self-center">ExExNotification</span>
        </div>
        <p className="leading-7">
          최신 블록에 도달하면 Pipeline에서 <strong>Live Sync</strong>로 자동 전환된다.<br />
          BlockchainTree가 새 블록을 수신하고, reorg(체인 재구성) 발생 시 공통 조상까지 되감아 새 체인으로 전환한다.
        </p>
        <p className="leading-7">
          Live Sync 이벤트는 Reth 고유의 <strong>ExEx(Execution Extensions)</strong>로 전달된다.<br />
          ExEx는 노드 프로세스 내부에서 실행되는 확장 모듈로, 인덱서, 브릿지, 분석 도구를 별도 인프라 없이 구현할 수 있다.
        </p>

        {/* ── Engine API 흐름 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Engine API — CL이 EL을 조종</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Live Sync 중 EL ← CL 통신 (Engine API v3)

// 1. engine_newPayloadV3 — 새 블록 제공
async fn new_payload_v3(
    payload: ExecutionPayloadV3,
    versioned_hashes: Vec<B256>,  // EIP-4844 blob hashes
    parent_beacon_block_root: B256, // EIP-4788
) -> PayloadStatus {
    // 블록 검증 & 실행
    let block = convert_payload_to_block(payload)?;
    match execute_block(block).await {
        Ok(_) => PayloadStatus::Valid,
        Err(_) => PayloadStatus::Invalid,
    }
}

// 2. engine_forkchoiceUpdatedV3 — head 결정
async fn forkchoice_updated_v3(
    state: ForkchoiceState,
    payload_attrs: Option<PayloadAttributes>,
) -> ForkchoiceUpdated {
    // head/safe/finalized 블록 업데이트
    blockchain_tree.update_canonical(state.head_block_hash);

    // validator인 경우 payload_attrs로 새 블록 생성
    if let Some(attrs) = payload_attrs {
        let payload_id = payload_builder.new_job(attrs)?;
        return ForkchoiceUpdated {
            payload_status: PayloadStatus::Valid,
            payload_id: Some(payload_id),
        };
    }
    ForkchoiceUpdated { .. }
}

// 3. engine_getPayloadV3 — validator가 생성한 블록 조회
async fn get_payload_v3(id: PayloadId) -> ExecutionPayloadV3 {
    payload_builder.resolve(id).await?
}`}
        </pre>
        <p className="leading-7">
          Engine API가 CL ↔ EL 통신의 <strong>유일한 인터페이스</strong>.<br />
          CL이 <code>newPayload</code>로 블록 전달 → EL이 실행 & 검증 → 응답.<br />
          CL이 <code>forkchoiceUpdated</code>로 head 지정 → EL이 canonical chain 업데이트.
        </p>

        {/* ── Live Sync 성능 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Live Sync 블록당 처리 시간</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Live Sync 블록 처리 흐름 (12초 슬롯 기준)
//
// 목표: 한 블록 실행을 1~2초 안에 완료
// (슬롯 12초 중 나머지 10초는 다음 블록 대기)

// 블록 실행 breakdown:
// ┌────────────────────┬──────────┐
// │ 단계               │ 시간     │
// ├────────────────────┼──────────┤
// │ payload 수신       │ ~10ms    │
// │ TX sender 복구     │ ~50ms    │
// │ revm 실행          │ ~200ms   │
// │ state_root 계산    │ ~50ms    │
// │ DB commit          │ ~100ms   │
// │ Engine API 응답    │ ~20ms    │
// │ ExEx 알림          │ ~10ms    │
// ├────────────────────┼──────────┤
// │ 합계               │ ~440ms   │
// └────────────────────┴──────────┘

// 여유시간 ~11.5초 동안:
// - RPC 요청 처리
// - BlockchainTree 관리
// - ExEx 처리
// - 다음 블록 대기

// 시간 예산 관점:
// - 12초 슬롯이 "블록 생성 + 전파 + 실행" 모두 포함
// - EL 실행은 전체 시간의 ~4% 미만
// - 여유가 크므로 RPC latency에 영향 없음

// 블록이 큰 경우 (DeFi 폭주):
// - revm 실행: ~1000ms
// - state_root: ~200ms
// - DB commit: ~300ms
// - 합계: ~1.5초 (여전히 충분)`}
        </pre>
        <p className="leading-7">
          Live Sync는 블록당 <strong>~500ms 내 처리</strong> — 12초 슬롯 기준 여유 충분.<br />
          혼잡 블록에서도 1.5초 이내 완료 → RPC 지연 없음.<br />
          Reth의 저지연 실행 덕분에 validator 노드도 부담 없이 운영 가능.
        </p>

        {/* ── ExEx 통합 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ExEx 이벤트 스트림</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// ExEx는 Live Sync의 모든 이벤트를 subscribe
pub enum ExExNotification {
    /// 새 블록이 canonical chain에 추가됨
    ChainCommitted {
        new: Arc<Chain>,
    },

    /// reorg 발생: old 체인 제거 + new 체인 적용
    ChainReorged {
        old: Arc<Chain>,
        new: Arc<Chain>,
    },

    /// 블록이 canonical에서 제거됨 (reorg 중간 상태)
    ChainReverted {
        old: Arc<Chain>,
    },
}

// ExEx 사용 예시:
async fn my_indexer(ctx: ExExContext) -> Result<()> {
    while let Some(notification) = ctx.notifications.next().await {
        match notification {
            ExExNotification::ChainCommitted { new } => {
                for block in new.blocks() {
                    index_block(block)?;
                }
                // 완료 시그널 → 이 높이까지 prune 허용
                ctx.events.send(ExExEvent::FinishedHeight(new.tip().number))?;
            }
            ExExNotification::ChainReorged { old, new } => {
                // old 블록들의 인덱스 제거
                for block in old.blocks() {
                    remove_index(block)?;
                }
                // new 블록들 인덱싱
                for block in new.blocks() {
                    index_block(block)?;
                }
                ctx.events.send(ExExEvent::FinishedHeight(new.tip().number))?;
            }
            _ => {}
        }
    }
    Ok(())
}

// ExEx는 노드 프로세스 내부 실행
// → 별도 DB 복제 불필요
// → Kafka/WebSocket 같은 중간 계층 불필요
// → 지연 수 ms 수준`}
        </pre>
        <p className="leading-7">
          ExEx가 <strong>실시간 블록 이벤트 스트림</strong>을 제공.<br />
          인덱서, 브릿지, MEV bot 등이 노드 내부에서 직접 구독 가능.<br />
          별도 인프라(Kafka, WebSocket) 없이 ms 수준 지연으로 이벤트 수신.
        </p>
      </div>

      {/* ExEx events */}
      <h3 className="text-lg font-semibold mb-3">ExExNotification 이벤트</h3>
      <div className="not-prose grid grid-cols-3 gap-3 mb-4">
        {LIVE_EVENTS.map(e => (
          <button key={e.id}
            onClick={() => setActiveEvent(activeEvent === e.id ? null : e.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: activeEvent === e.id ? e.color : 'var(--color-border)',
              background: activeEvent === e.id ? `${e.color}10` : undefined,
            }}>
            <p className="font-mono text-xs font-bold" style={{ color: e.color }}>{e.name}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selEvent && (
          <motion.div key={selEvent.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: selEvent.color }}>{selEvent.name}</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{selEvent.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reorg handling */}
      <h3 className="text-lg font-semibold mb-3">Reorg 처리 단계</h3>
      <div className="not-prose space-y-2 mb-4">
        {REORG_STEPS.map(s => (
          <button key={s.step}
            onClick={() => setActiveReorg(activeReorg === s.step ? null : s.step)}
            className="w-full text-left rounded-lg border p-3 transition-all duration-200 cursor-pointer"
            style={{
              borderColor: activeReorg === s.step ? '#6366f1' : 'var(--color-border)',
              background: activeReorg === s.step ? '#6366f110' : undefined,
            }}>
            <div className="flex gap-3 items-center">
              <span className="font-mono text-xs font-bold text-foreground/50 shrink-0">Step {s.step}</span>
              <span className="text-sm font-medium">{s.title}</span>
            </div>
            <AnimatePresence>
              {activeReorg === s.step && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.15 }}
                  className="text-sm text-foreground/70 mt-2 pl-12">{s.desc}</motion.p>
              )}
            </AnimatePresence>
          </button>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>ExEx = 노드 내부 확장</strong> — 별도 인프라 없이 블록 이벤트를 지연 없이 처리한다.<br />
          느린 ExEx는 프루닝을 지연시켜 디스크 사용량이 증가할 수 있으므로, FinishedHeight 시그널로 처리 완료를 알린다.
        </p>
      </div>
    </section>
  );
}
