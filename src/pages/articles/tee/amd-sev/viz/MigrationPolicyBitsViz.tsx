import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox } from '@/components/viz/boxes';

const C = {
  ndb: '#8b5cf6',
  nks: '#0ea5e9',
  es: '#10b981',
  nsd: '#ef4444',
  dom: '#f59e0b',
  sev: '#6366f1',
  ver: '#888',
};

const STEPS = [
  { label: 'sev_policy 비트필드 — VM 생성 시 고정', body: 'no_debug · no_ks · es · no_send · domain · sev + API 버전' },
  { label: 'no_send = 1 → host에 영구 고정', body: '마이그레이션 자체 차단' },
  { label: 'domain = 1 → 같은 도메인 내 이주만', body: 'guest owner가 승인한 target만 허용' },
  { label: '실전 — 민감 워크로드 vs 일반 워크로드', body: '민감: no_send/domain · 일반: open migration' },
];

const BITS = [
  { label: 'no_debug', sub: '디버거 차단', color: C.ndb },
  { label: 'no_ks', sub: '키 공유 금지', color: C.nks },
  { label: 'es', sub: 'SEV-ES 필수', color: C.es },
  { label: 'no_send', sub: '마이그 금지', color: C.nsd },
  { label: 'domain', sub: '같은 도메인만', color: C.dom },
  { label: 'sev', sub: 'SEV 필수', color: C.sev },
  { label: 'api_major', sub: '8 bits', color: C.ver },
  { label: 'api_minor', sub: '8 bits', color: C.ver },
  { label: 'build', sub: '8 bits', color: C.ver },
];

export default function MigrationPolicyBitsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--muted-foreground)">
            struct sev_policy (VM 생성 시 freezing)
          </text>

          {BITS.map((b, i) => {
            const x = 20 + (i % 3) * 150;
            const y = 26 + Math.floor(i / 3) * 56;
            let highlight = step === 0;
            if (step === 1 && b.label === 'no_send') highlight = true;
            if (step === 2 && b.label === 'domain') highlight = true;
            return (
              <motion.g key={b.label}
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <motion.rect x={x} y={y} width={140} height={48} rx={6}
                  animate={{
                    fill: highlight ? `${b.color}25` : `${b.color}10`,
                    stroke: b.color,
                    strokeWidth: highlight ? 1.6 : 0.6,
                  }} />
                <text x={x + 70} y={y + 18} textAnchor="middle" fontSize={10} fontWeight={700} fill={b.color}>{b.label}</text>
                <text x={x + 70} y={y + 32} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{b.sub}</text>
              </motion.g>
            );
          })}

          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <ActionBox x={20} y={196} w={210} h={40} label="민감 워크로드" sub="no_send / domain only" color={C.nsd} />
              <ActionBox x={250} y={196} w={210} h={40} label="일반 워크로드" sub="open migration" color={C.es} />
            </motion.g>
          )}

          {step <= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={`note-${step}`}>
              <DataBox x={60} y={206} w={360} h={28}
                label={
                  step === 0 ? '클라우드가 강제 가능 — 테넌트는 launch 시 고정 정책 결정' :
                  step === 1 ? 'no_send = 1 → 이 호스트에서 절대 안 떠남' :
                  'domain = 1 → guest owner가 허용한 target host에만 이주'
                }
                color="#888" outlined />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
