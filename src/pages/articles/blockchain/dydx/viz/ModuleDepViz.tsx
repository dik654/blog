import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const GROUPS = [
  { label: 'Trading', color: '#6366f1', mods: ['clob', 'subaccounts', 'feetiers', 'perpetuals'] },
  { label: 'Core SDK', color: '#10b981', mods: ['auth', 'bank', 'staking', 'gov'] },
  { label: 'dYdX Core', color: '#f59e0b', mods: ['assets', 'prices', 'epochs', 'blocktime'] },
  { label: 'Support', color: '#ec4899', mods: ['bridge', 'rewards', 'delaymsg', 'stats'] },
];

const STEPS = [
  { label: 'Trading 모듈', body: 'CLOB, Perpetuals, Subaccounts 등 거래 핵심 로직' },
  { label: 'Core SDK 모듈', body: '표준 Cosmos SDK 모듈(auth, bank, staking, gov) 활용' },
  { label: 'dYdX Core 모듈', body: '가격 피드, 자산 관리, 에포크 등 dYdX 특화 인프라' },
  { label: 'Support 모듈', body: '브릿지, 보상, 통계 등 보조 기능 제공' },
];

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };

export default function ModuleDepViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {GROUPS.map((g, gi) => {
            const x = 10 + gi * 112;
            const active = step === gi;
            const vis = step === gi || step === 0;
            return (
              <motion.g key={gi} animate={{ opacity: vis ? 1 : 0.15 }} transition={sp}>
                <rect x={x} y={8} width={100} height={105} rx={6}
                  fill={active ? g.color + '12' : '#ffffff04'}
                  stroke={g.color} strokeWidth={active ? 1.5 : 0.6} />
                <text x={x + 50} y={24} textAnchor="middle" fontSize={11} fontWeight={600}
                  fill={g.color}>{g.label}</text>
                {g.mods.map((m, mi) => (
                  <g key={mi}>
                    <rect x={x + 8} y={32 + mi * 19} width={84} height={16} rx={3}
                      fill={active ? g.color + '18' : '#ffffff06'}
                      stroke={g.color} strokeWidth={0.5} />
                    <text x={x + 50} y={44 + mi * 19} textAnchor="middle"
                      fontSize={10} fill={g.color}>{m}</text>
                  </g>
                ))}
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
