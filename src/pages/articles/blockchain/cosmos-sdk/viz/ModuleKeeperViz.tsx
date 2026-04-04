import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const MODS = [
  { id: 'auth', label: 'x/auth', color: '#8b5cf6', x: 30, y: 10 },
  { id: 'bank', label: 'x/bank', color: '#6366f1', x: 170, y: 10 },
  { id: 'staking', label: 'x/staking', color: '#10b981', x: 30, y: 90 },
  { id: 'gov', label: 'x/gov', color: '#f59e0b', x: 170, y: 90 },
  { id: 'slashing', label: 'x/slashing', color: '#ef4444', x: 100, y: 160 },
];

const REFS = [
  { from: 'staking', to: 'bank', label: 'BankKeeper' },
  { from: 'staking', to: 'slashing', label: 'SlashingKeeper' },
  { from: 'gov', to: 'bank', label: 'BankKeeper' },
  { from: 'gov', to: 'staking', label: 'StakingKeeper' },
];

const STEPS = [
  { label: 'Module-Keeper 아키텍처', body: '각 모듈이 Keeper를 통해 자신의 KVStore를 관리하고 다른 모듈과 통신.' },
  { label: 'Keeper 인터페이스', body: 'Get / Set / Has 등의 메서드로 상태 접근. 직접 스토어 접근 금지.' },
  { label: 'Cross-Module 통신', body: 'StakingKeeper가 BankKeeper를 DI로 주입받아 위임 보상을 전송.' },
  { label: 'Gov → 모듈 제어', body: 'Governance가 Staking/Bank Keeper를 통해 파라미터 변경을 실행.' },
];

const MW = 100, MH = 55;
const center = (m: typeof MODS[0]) => ({ cx: m.x + MW / 2, cy: m.y + MH / 2 });

export default function ModuleKeeperViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 450 230" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Keeper reference arrows */}
          {REFS.map((r, i) => {
            const from = MODS.find(m => m.id === r.from)!;
            const to = MODS.find(m => m.id === r.to)!;
            const f = center(from), t = center(to);
            const show = step === 0 || (step === 2 && r.from === 'staking') || (step === 3 && r.from === 'gov');
            return (
              <motion.g key={i} animate={{ opacity: show ? 1 : 0.1 }} transition={{ duration: 0.3 }}>
                <motion.line x1={f.cx} y1={f.cy} x2={t.cx} y2={t.cy}
                  stroke="#888" strokeWidth={1.5} strokeDasharray="5 3"
                  initial={{ pathLength: 0 }} animate={{ pathLength: show ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }} />
                <text x={(f.cx + t.cx) / 2} y={(f.cy + t.cy) / 2 - 5}
                  textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  {r.label}
                </text>
                {show && (
                  <motion.circle r={3} fill={from.color}
                    animate={{ cx: [f.cx, t.cx], cy: [f.cy, t.cy] }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.5 }} />
                )}
              </motion.g>
            );
          })}
          {/* Module boxes */}
          {MODS.map((m) => {
            const active = step === 0 || step === 1;
            return (
              <motion.g key={m.id} animate={{ opacity: active || step >= 2 ? 1 : 0.3 }}>
                <rect x={m.x} y={m.y} width={MW} height={MH} rx={6}
                  fill={`${m.color}12`} stroke={m.color} strokeWidth={1.5} />
                <text x={m.x + MW / 2} y={m.y + 20}
                  textAnchor="middle" fontSize={10} fontWeight="700" fill={m.color}>
                  {m.label}
                </text>
                {step === 1 && (
                  <motion.text x={m.x + MW / 2} y={m.y + 38}
                    textAnchor="middle" fontSize={9} fill="var(--muted-foreground)"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    Get / Set / Has
                  </motion.text>
                )}
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
