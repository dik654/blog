import { motion } from 'framer-motion';
import StepViz from './StepViz';

const STEPS = [
  { label: 'RANDAO: BLS 서명 XOR 누적 → 조작 불가능한 제안자 선정' },
  { label: 'engine_forkchoiceUpdated: CL이 EL에 빌딩 시작 신호 전달' },
  { label: '트랜잭션 선택: effective_gas_price 내림차순 greedy 선택' },
  { label: 'EVM 실행 & 병렬 상태 루트 계산' },
  { label: 'engine_getPayload: ExecutionPayload + BlobsBundle + BlockValue 수신' },
  { label: 'BeaconBlock 조립 & BLS 서명 → gossipsub 전파' },
];

const ACTOR_CLR: Record<string, string> = { CL:'#6366f1', EL:'#f97316', VC:'#ec4899' };
const PIPELINE = [
  { label: 'RANDAO reveal',   from: 'CL',    color: '#818cf8', detail: 'epoch 290,312 · reveal = BLS(sk, epoch)' },
  { label: 'forkChoice\nUpdated', from: 'CL→EL', color: '#f59e0b', detail: 'head=0x3a8f…c1e2 · safe=0x3a8e…b7d0' },
  { label: 'TxPool 선택',     from: 'EL',    color: '#0ea5e9', detail: '154 txs · base_fee=8.2 gwei · max_gas=30M' },
  { label: 'EVM 실행',         from: 'EL',    color: '#10b981', detail: 'gas_used=12.4M (41%) · 82 contract calls' },
  { label: 'getPayload',      from: 'CL←EL', color: '#f59e0b', detail: 'block_value=0.0284 ETH · 3 blobs 첨부' },
  { label: '서명 & 전파',      from: 'CL+VC', color: '#ec4899', detail: 'slot 9,288,001 · BLS sig → gossipsub 전파' },
];

export default function BlockProposalViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="flex flex-col gap-1.5 w-full max-w-2xl py-1">
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
                  {i > 0 && <div className="w-px h-2" style={{ background: done||active ? s.color : 'var(--border)', opacity: done?0.6:1 }} />}
                  <motion.div className="w-3.5 h-3.5 rounded-full border-2 border-background"
                    style={{ background: active||done ? s.color : 'var(--muted)' }}
                    animate={{ scale: active?1.5:1, opacity: done?0.55:active?1:0.3 }}
                    transition={{ duration: 0.2 }} />
                </div>
                <motion.div className="flex-1 rounded-lg border px-3 py-1.5 flex flex-col gap-0.5"
                  animate={{ borderColor: active?s.color:'var(--border)', backgroundColor: active?`${s.color}15`:'transparent', opacity: done?0.45:active?1:0.35 }}
                  transition={{ duration: 0.2 }}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold">{s.label}</span>
                    <span className="text-[9px] font-mono shrink-0 px-1.5 py-0.5 rounded"
                      style={{ background:`${s.color}20`, color:s.color }}>
                      {s.from}
                    </span>
                  </div>
                  {active && s.detail && (
                    <span className="text-[9px] font-mono text-muted-foreground">{s.detail}</span>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      )}
    </StepViz>
  );
}
