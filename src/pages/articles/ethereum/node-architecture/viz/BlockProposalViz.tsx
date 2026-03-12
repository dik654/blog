import { motion } from 'framer-motion';
import StepViz from './StepViz';

const STEPS = [
  { label: 'RANDAO: BLS 서명 XOR 누적 → 조작 불가능한 제안자 선정', body: '에폭 시작 전, 각 검증자가 자신의 BLS 비밀키로 서명한 RANDAO reveal을 XOR 누적해 에폭의 난수를 결정합니다. 이 난수로 슬롯별 제안자가 사전 결정됩니다. 마지막 제안자도 한 비트 바이어스만 가능해 현실적으로 조작이 불가능합니다.' },
  { label: 'engine_forkchoiceUpdated: CL이 EL에 빌딩 시작 신호 전달', body: 'CL이 EL에 headBlockHash와 PayloadAttributes(timestamp, prevRandao, feeRecipient, withdrawals)를 전달합니다. EL은 즉시 payloadId를 반환하고 백그라운드에서 블록 빌딩을 시작합니다. 이 호출이 없으면 EL은 블록을 만들지 않습니다.' },
  { label: '트랜잭션 선택: effective_gas_price 내림차순 greedy 선택', body: 'PayloadBuilder가 Pending 서브풀에서 effective_gas_price = min(max_fee, basefee + priority_fee) 내림차순으로 gas_limit까지 greedy하게 선택합니다. EIP-4844 blob tx는 별도 blob_gas_limit(6 blobs/block) 내에서 선택됩니다.' },
  { label: 'EVM 실행 & 병렬 상태 루트 계산', body: 'REVM이 트랜잭션을 순차 실행합니다. 실행 후 SparseStateTrie가 변경된 서브트리만 rayon 워커 풀에서 병렬 해싱하여 state_root를 계산합니다. 이 병렬화가 reth의 핵심 성능 최적화입니다.' },
  { label: 'engine_getPayload: ExecutionPayload + BlobsBundle + BlockValue 수신', body: 'CL이 빌딩 완료된 페이로드를 수신합니다: ExecutionPayload(txs, state_root, receipts_root) + BlobsBundle(blobs, KZG commitments, proofs) + BlockValue(기대 수수료 ETH). BlockValue는 MEV-Boost 비교 기준이 됩니다.' },
  { label: 'BeaconBlock 조립 & BLS 서명 → gossipsub 전파', body: 'BeaconBlockBody에 실행 페이로드, 집계 어테스테이션, sync_aggregate를 포함합니다. Validator Client가 도메인 분리된 BLS 서명을 수행합니다. /beacon_block gossipsub 토픽으로 전파, Blob은 /blob_sidecar_{0..5}로 분리 전파됩니다.' },
];

const ACTOR_CLR: Record<string, string> = { CL:'#6366f1', EL:'#f97316', VC:'#ec4899' };
const PIPELINE = [
  { label: 'RANDAO',          from: 'CL',    color: '#818cf8' },
  { label: 'forkChoice\nUpdated', from: 'CL→EL', color: '#f59e0b' },
  { label: 'TxPool 선택',     from: 'EL',    color: '#0ea5e9' },
  { label: 'EVM 실행',         from: 'EL',    color: '#10b981' },
  { label: 'getPayload',      from: 'CL←EL', color: '#f59e0b' },
  { label: '서명 & 전파',      from: 'CL+VC', color: '#ec4899' },
];

export default function BlockProposalViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="flex flex-col gap-1.5 w-full max-w-sm py-1">
          <div className="flex gap-2 mb-1 justify-center flex-wrap">
            {(['CL','EL','VC'] as const).map(a => (
              <span key={a} className="text-[9px] px-2 py-0.5 rounded-full font-mono"
                style={{ background:`${ACTOR_CLR[a]}22`, color:ACTOR_CLR[a], border:`1px solid ${ACTOR_CLR[a]}44` }}>
                {a}
              </span>
            ))}
          </div>
          {PIPELINE.map((s, i) => {
            const active = i === step;
            const done = i < step;
            return (
              <div key={s.label} className="flex items-center gap-2">
                <div className="flex flex-col items-center w-5 shrink-0">
                  {i > 0 && <div className="w-px h-2" style={{ background: done||active ? s.color : 'hsl(var(--border))', opacity: done?0.6:1 }} />}
                  <motion.div className="w-3.5 h-3.5 rounded-full border-2 border-background"
                    style={{ background: active||done ? s.color : 'hsl(var(--muted))' }}
                    animate={{ scale: active?1.5:1, opacity: done?0.55:active?1:0.3 }}
                    transition={{ duration: 0.2 }} />
                </div>
                <motion.div className="flex-1 rounded-lg border px-3 py-1.5 flex items-center justify-between gap-2"
                  animate={{ borderColor: active?s.color:'hsl(var(--border))', backgroundColor: active?`${s.color}15`:'transparent', opacity: done?0.45:active?1:0.35 }}
                  transition={{ duration: 0.2 }}>
                  <span className="text-[11px] font-semibold">{s.label}</span>
                  <span className="text-[9px] font-mono shrink-0 px-1.5 py-0.5 rounded"
                    style={{ background:`${s.color}20`, color:s.color }}>
                    {s.from}
                  </span>
                </motion.div>
              </div>
            );
          })}
        </div>
      )}
    </StepViz>
  );
}
