import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const FIELDS = [
  { label: 'attested_header', desc: '위원회가 서명한 헤더', c: '#6366f1' },
  { label: 'next_sync_committee', desc: '다음 주기 위원회 공개키 512개', c: '#0ea5e9' },
  { label: 'committee_branch', desc: 'Merkle 증명 (state_root 경로)', c: '#10b981' },
  { label: 'finalized_header', desc: '최종 확정된 헤더', c: '#f59e0b' },
  { label: 'finality_branch', desc: '최종성 Merkle 증명', c: '#8b5cf6' },
  { label: 'sync_aggregate', desc: 'BLS 서명 + 참여 비트맵', c: '#ec4899' },
  { label: 'signature_slot', desc: '서명이 생성된 슬롯 번호', c: '#14b8a6' },
];

export default function LcUpdateViz() {
  return (
    <StepViz steps={FIELDS.map(f => ({ label: f.label, body: f.desc }))}>
      {(step) => (
        <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={15} textAnchor="middle" fontSize={10} fill="currentColor" fillOpacity={0.3}>
            LightClientUpdate (7 fields)
          </text>
          <rect x={70} y={20} width={340} height={115} rx={8} fill="none" stroke="currentColor" strokeOpacity={0.1} strokeWidth={1} />
          {FIELDS.map((f, i) => {
            const y = 25 + i * 15;
            const active = step === i;
            return (
              <motion.g key={i} animate={{ x: active ? 4 : 0 }} transition={{ type: 'spring', stiffness: 300 }}>
                <rect x={75} y={y} width={330} height={13} rx={3}
                  fill={f.c + (active ? '20' : '05')} stroke={active ? f.c : 'transparent'} strokeWidth={active ? 1.5 : 0} />
                <text x={82} y={y + 10} fontSize={9} fontWeight={active ? 700 : 400} fill={f.c} fontFamily="monospace">{f.label}</text>
                {active && (
                  <motion.text x={395} y={y + 10} textAnchor="end" fontSize={9} fill={f.c} fillOpacity={0.7}
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
