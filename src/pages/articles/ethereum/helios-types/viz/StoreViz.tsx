import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const FIELDS = [
  { label: 'finalized_header', desc: '마지막 최종 확정 헤더', c: '#6366f1' },
  { label: 'current_sync_committee', desc: '현재 주기 512명 공개키', c: '#10b981' },
  { label: 'next_sync_committee', desc: '다음 주기 위원회 (Optional)', c: '#0ea5e9' },
  { label: 'optimistic_header', desc: '최신 낙관적 헤더 (미확정)', c: '#f59e0b' },
  { label: 'previous_max_active', desc: '이전 주기 최대 참여자 수', c: '#8b5cf6' },
  { label: 'current_max_active', desc: '현재 주기 최대 참여자 수', c: '#ec4899' },
];

export default function StoreViz() {
  return (
    <StepViz steps={FIELDS.map(f => ({ label: f.label, body: f.desc }))}>
      {(step) => (
        <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={18} textAnchor="middle" fontSize={10} fill="currentColor" fillOpacity={0.3}>
            LightClientStore (in-memory 상태)
          </text>
          <rect x={80} y={24} width={320} height={105} rx={8} fill="none" stroke="currentColor" strokeOpacity={0.1} strokeWidth={1} />
          {FIELDS.map((f, i) => {
            const y = 30 + i * 16;
            const active = step === i;
            return (
              <motion.g key={i} animate={{ x: active ? 4 : 0 }} transition={{ type: 'spring', stiffness: 300 }}>
                <rect x={85} y={y} width={310} height={14} rx={3}
                  fill={f.c + (active ? '20' : '05')} stroke={active ? f.c : 'transparent'} strokeWidth={active ? 1.5 : 0} />
                <text x={92} y={y + 11} fontSize={9} fontWeight={active ? 700 : 400} fill={f.c} fontFamily="monospace">{f.label}</text>
                {active && (
                  <motion.text x={388} y={y + 11} textAnchor="end" fontSize={9} fill={f.c} fillOpacity={0.7}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{f.desc}</motion.text>
                )}
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
