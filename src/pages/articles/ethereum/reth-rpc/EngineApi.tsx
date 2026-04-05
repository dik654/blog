import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import EngineDetailViz from './viz/EngineDetailViz';
import { ENGINE_METHODS } from './EngineApiData';

export default function EngineApi({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeMethod, setActiveMethod] = useState<string | null>(null);
  const sel = ENGINE_METHODS.find(m => m.id === activeMethod);

  return (
    <section id="engine-api" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Engine API (CL 연동)</h2>
      <div className="not-prose mb-8"><EngineDetailViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('rpc-engine-api', codeRefs['rpc-engine-api'])} />
          <span className="text-[10px] text-muted-foreground self-center">EngineApi 전체</span>
        </div>
        <p className="leading-7">
          The Merge 이후, EL과 CL은 Engine API라는 JSON-RPC 인터페이스로 통신한다.<br />
          이 API가 canonical chain(정식 체인)을 결정하는 유일한 경로다.<br />
          CL이 fork choice를 결정하면 EL에 통보하고, EL은 블록을 검증하거나 빌드한다.
        </p>
        <p className="leading-7">
          Engine API는 3개의 핵심 메서드로 구성된다.<br />
          아래 카드를 클릭하면 각 메서드의 역할과 데이터 흐름을 확인할 수 있다.
        </p>

        {/* ── Engine API 타임라인 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Engine API 호출 타임라인 — 12초 슬롯</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// PoS 슬롯(12초)마다 반복되는 패턴

// 슬롯 시작 (T=0s):
// CL → EL: engine_forkchoiceUpdatedV3(state, payload_attrs)
//   state: { head, safe, finalized }
//   payload_attrs: Some(PayloadAttributes) (validator인 경우)
// → EL: payload_id 반환, 백그라운드에서 블록 생성 시작

// T=4s: validator가 블록 요청
// CL → EL: engine_getPayloadV3(payload_id)
// → EL: ExecutionPayloadV3 반환 (완성된 블록)

// T=6s: attestation 전파
// (CL 내부 작업, EL 관여 안 함)

// T=12s (다음 슬롯 시작):
// CL → EL: engine_newPayloadV3(payload, blob_hashes, beacon_root)
// → EL: 블록 실행 & 검증 → PayloadStatus 반환
// → CL: forkchoiceUpdatedV3로 head 업데이트 통보

// 시간 예산:
// - getPayload: ~500ms 이내 필요 (validator 타이밍)
// - newPayload: ~1~2s 이내 (검증 완료 필요)
// - forkchoiceUpdated: ~50ms (head 업데이트만)

// 시간 초과 시:
// - validator: 블록 제안 실패 (missed proposal)
// - full node: sync late → temporary fork

// Reth의 성능:
// - getPayload: ~300ms (PayloadBuilder 준비 완료)
// - newPayload: ~500ms (대부분)
// - 여유 충분 (SLA 100% 달성)`}
        </pre>
        <p className="leading-7">
          12초 슬롯 안에 <strong>3번의 Engine API 호출</strong>이 일어남.<br />
          getPayload가 가장 시간 예산 빡빡 (~500ms) — 블록 생성 완료 필요.<br />
          Reth의 낮은 지연이 validator 안정성에 직접 기여.
        </p>

        {/* ── newPayload 처리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">engine_newPayloadV3 — 블록 검증 흐름</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`async fn new_payload_v3(
    &self,
    payload: ExecutionPayloadV3,
    versioned_hashes: Vec<B256>,  // EIP-4844 blob commitments
    parent_beacon_block_root: B256,
) -> RpcResult<PayloadStatus> {
    // 1. Payload → SealedBlock 변환
    let block = match try_payload_to_block(payload) {
        Ok(b) => b,
        Err(_) => return Ok(PayloadStatus::Invalid { reason: "Invalid format" }),
    };

    // 2. 부모 블록 확인
    let parent = self.provider.header_by_hash(block.parent_hash)?;
    if parent.is_none() {
        // 부모 없음 → SYNCING 상태 (백그라운드 다운로드)
        self.beacon_consensus_engine.on_unknown_parent(block).await;
        return Ok(PayloadStatus::Syncing);
    }

    // 3. 블록 실행 & 검증 (BlockchainTree)
    match self.blockchain_tree.insert_block(block).await {
        Ok(BlockStatus::Valid) => {
            Ok(PayloadStatus::Valid { latest_valid_hash: Some(hash) })
        }
        Ok(BlockStatus::Accepted) => {
            // side chain으로 추가 (canonical 아님)
            Ok(PayloadStatus::Accepted)
        }
        Err(e) => {
            // 검증 실패
            Ok(PayloadStatus::Invalid {
                reason: e.to_string(),
                latest_valid_hash: parent.hash,
            })
        }
    }
}

// PayloadStatus 종류:
// - Valid: canonical chain에 추가
// - Invalid: 블록 거부
// - Syncing: 동기화 중
// - Accepted: side chain으로만 보관`}
        </pre>
        <p className="leading-7">
          <code>new_payload_v3</code>가 <strong>블록 게이트키퍼</strong>.<br />
          포맷 → 부모 확인 → 실행 검증 → 상태 반환 순서.<br />
          Invalid 반환 시 CL이 해당 블록 fork에서 배제.
        </p>

        {/* ── FCU 처리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">engine_forkchoiceUpdatedV3 — head 업데이트</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`async fn forkchoice_updated_v3(
    &self,
    state: ForkchoiceState,
    payload_attrs: Option<PayloadAttributes>,
) -> RpcResult<ForkchoiceUpdated> {
    // 1. head 블록이 존재하는지 확인
    if !self.blockchain_tree.contains(state.head_block_hash) {
        return Ok(ForkchoiceUpdated::syncing());
    }

    // 2. canonical chain 업데이트
    self.blockchain_tree.make_canonical(state.head_block_hash).await?;

    // 3. finalized/safe 표시
    if !state.finalized_block_hash.is_zero() {
        self.blockchain_tree.finalize(state.finalized_block_hash)?;
    }
    if !state.safe_block_hash.is_zero() {
        self.blockchain_tree.mark_safe(state.safe_block_hash)?;
    }

    // 4. validator인 경우 블록 생성 시작
    let payload_id = if let Some(attrs) = payload_attrs {
        Some(self.payload_builder.new_job(
            state.head_block_hash,
            attrs,
        ).await?)
    } else { None };

    Ok(ForkchoiceUpdated {
        payload_status: PayloadStatus::Valid {
            latest_valid_hash: Some(state.head_block_hash)
        },
        payload_id,
    })
}

// payload_attrs로 validator 요청 감지:
// - Some: 이 노드가 블록 제안자 → 블록 생성 시작
// - None: 일반 노드 → head 업데이트만`}
        </pre>
        <p className="leading-7">
          <code>forkchoiceUpdated</code>가 <strong>canonical chain 결정의 순간</strong>.<br />
          head/safe/finalized 3가지 지점 갱신 → BlockchainTree 상태 변경.<br />
          <code>payload_attrs</code> 유무로 validator 여부 판단 → 블록 생성 트리거.
        </p>
      </div>

      <div className="not-prose grid grid-cols-3 gap-3 mb-4">
        {ENGINE_METHODS.map(m => (
          <button key={m.id}
            onClick={() => setActiveMethod(activeMethod === m.id ? null : m.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: activeMethod === m.id ? m.color : 'var(--color-border)',
              background: activeMethod === m.id ? `${m.color}10` : undefined,
            }}>
            <p className="font-mono text-xs font-bold" style={{ color: m.color }}>{m.name}</p>
            <p className="text-xs text-foreground/50 mt-0.5">{m.direction}</p>
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
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>{sel.name}</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{sel.details}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>Engine API가 canonical chain을 결정한다</strong> — FCU의 headBlockHash가 정식 head를 지정.
          new_payload의 검증 결과가 INVALID이면 해당 블록은 포크에서 제외된다.<br />
          EL은 CL의 지시 없이 자체적으로 canonical chain을 변경하지 않는다.
        </p>
      </div>
    </section>
  );
}
