import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const FIELDS = [
  { label: 'slot: u64', desc: '슬롯 번호 (12초 간격)', c: '#6366f1' },
  { label: 'proposer_index: u64', desc: '제안자 검증자 인덱스', c: '#0ea5e9' },
  { label: 'parent_root: B256', desc: '이전 블록 해시 (체인 연결)', c: '#10b981' },
  { label: 'state_root: B256', desc: '비콘 상태 루트 (MPT 검증 기준)', c: '#f59e0b' },
  { label: 'body_root: B256', desc: '블록 바디 해시', c: '#8b5cf6' },
];

export default function BeaconHeaderViz() {
  return (
    <StepViz steps={FIELDS.map(f => ({ label: f.label, body: f.desc }))}>
      {(step) => (
        <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={18} textAnchor="middle" fontSize={10} fill="currentColor" fillOpacity={0.3}>
            BeaconBlockHeader (5 fields, 112 bytes SSZ)
          </text>
          <rect x={80} y={25} width={320} height={100} rx={8} fill="none" stroke="currentColor" strokeOpacity={0.1} strokeWidth={1} />
          {FIELDS.map((f, i) => {
            const y = 32 + i * 18;
            const active = step === i;
            return (
              <motion.g key={i} animate={{ x: active ? 5 : 0 }} transition={{ type: 'spring', stiffness: 300 }}>
                <rect x={85} y={y} width={310} height={16} rx={4}
                  fill={f.c + (active ? '20' : '05')} stroke={active ? f.c : 'transparent'} strokeWidth={active ? 1.5 : 0} />
                <text x={95} y={y + 12} fontSize={10} fontWeight={active ? 700 : 400} fill={f.c} fontFamily="monospace">{f.label}</text>
                {active && (
                  <motion.text x={300} y={y + 12} textAnchor="end" fontSize={9} fill={f.c} fillOpacity={0.6}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{f.desc}</motion.text>
                )}
              </motion.g>
            );
          })}
          <text x={240} y={142} textAnchor="middle" fontSize={10} fill="currentColor" fillOpacity={0.4}>
            Reth Header: 15+ 필드 (RLP) vs Helios: 5 필드 (SSZ)
          </text>
        </svg>
      )}
    </StepViz>
  );
}
