import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'sync_committee_bits: Bitvector<512>', body: '512명 위원회 중 참여자를 1비트로 표시' },
  { label: '참여율 계산: popcount(bits) / 512', body: '2/3(342명) 이상 → 유효한 업데이트' },
  { label: 'sync_committee_signature: BLS', body: '참여자들의 BLS 서명을 집계한 단일 서명' },
];

const C = { bits: '#6366f1', sig: '#10b981' };

export default function SyncAggregateViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <motion.g key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
            {step === 0 && (
              <g>
                <text x={240} y={30} textAnchor="middle" fontSize={10} fill="currentColor" fillOpacity={0.3}>Bitvector&lt;512&gt; (64 bytes)</text>
                {Array.from({ length: 32 }).map((_, i) => {
                  const x = 50 + i * 12;
                  const on = Math.random() > 0.3;
                  return (
                    <rect key={i} x={x} y={40} width={10} height={14} rx={2}
                      fill={on ? C.bits : '#6b7280'} fillOpacity={on ? 0.6 : 0.15} />
                  );
                })}
                {Array.from({ length: 32 }).map((_, i) => {
                  const x = 50 + i * 12;
                  const on = Math.random() > 0.3;
                  return (
                    <rect key={i + 32} x={x} y={58} width={10} height={14} rx={2}
                      fill={on ? C.bits : '#6b7280'} fillOpacity={on ? 0.6 : 0.15} />
                  );
                })}
                <text x={240} y={95} textAnchor="middle" fontSize={10} fill={C.bits} fillOpacity={0.5}>1=참여, 0=미참여 (512비트)</text>
              </g>
            )}
            {step === 1 && (
              <g>
                <rect x={100} y={40} width={280} height={50} rx={8} fill={C.bits + '15'} stroke={C.bits} strokeWidth={1.5} />
                <text x={240} y={60} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.bits}>popcount(bits) / 512</text>
                <text x={240} y={78} textAnchor="middle" fontSize={10} fill={C.bits} fillOpacity={0.6}>{'≥ 342 (2/3) → 정족수 충족'}</text>
              </g>
            )}
            {step === 2 && (
              <g>
                <rect x={80} y={40} width={320} height={50} rx={8} fill={C.sig + '15'} stroke={C.sig} strokeWidth={1.5} />
                <text x={240} y={58} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.sig}>BLS Aggregate Signature</text>
                <text x={240} y={76} textAnchor="middle" fontSize={10} fill={C.sig} fillOpacity={0.6}>96 bytes — G2 점 (BLS12-381)</text>
              </g>
            )}
          </motion.g>
          <text x={240} y={125} textAnchor="middle" fontSize={10} fill="currentColor" fillOpacity={0.4}>
            {['512비트 참여 비트맵', '2/3 정족수 필수', 'Reth: EL은 SyncAggregate 불필요'][step]}
          </text>
        </svg>
      )}
    </StepViz>
  );
}
