import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { id: 'app', label: 'App 초기화', color: '#6366f1', x: 120, y: 0 },
  { id: 'bank', label: 'BankKeeper', color: '#0ea5e9', x: 10, y: 55 },
  { id: 'staking', label: 'StakingKeeper', color: '#10b981', x: 230, y: 55 },
  { id: 'auth', label: 'AccountKeeper', color: '#f59e0b', x: 10, y: 115 },
  { id: 'store', label: 'KVStore', color: '#8b5cf6', x: 230, y: 115 },
  { id: 'iface', label: '인터페이스', color: '#ef4444', x: 120, y: 115 },
];
const W = 100, H = 34;
const cx = (n: typeof NODES[0]) => n.x + W / 2;
const cy = (n: typeof NODES[0]) => n.y + H / 2;

const STEPS = [
  { label: 'Keeper 초기화', body: 'App 초기화 시 각 모듈의 Keeper를 생성하고 의존성을 주입합니다.' },
  { label: '인터페이스 의존성', body: 'Keeper 간 의존성은 인터페이스로 정의되어 느슨한 결합을 유지합니다.' },
  { label: 'KVStore 접근', body: '각 Keeper는 자체 KVStore에만 접근하여 모듈 간 상태 격리를 보장합니다.' },
  { label: '전체 구조', body: '컴파일 타임에 의존성이 결정되는 정적 의존성 주입 패턴입니다.' },
];

const EDGES: [string, string, string][] = [
  ['app', 'bank', 'NewKeeper()'], ['app', 'staking', 'NewKeeper()'],
  ['bank', 'auth', '의존'], ['staking', 'bank', '의존'],
  ['bank', 'store', 'storeKey'], ['staking', 'store', 'storeKey'],
  ['iface', 'bank', '느슨한 결합'],
];

const vis = (step: number): Set<string> => {
  if (step === 0) return new Set(['app', 'bank', 'staking', 'auth']);
  if (step === 1) return new Set(['bank', 'staking', 'auth', 'iface']);
  if (step === 2) return new Set(['bank', 'staking', 'store']);
  return new Set(NODES.map(n => n.id));
};

export default function KeeperPatternViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const v = vis(step);
        return (
          <svg viewBox="0 0 480 165" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {EDGES.map(([fi, ti, lbl], ei) => {
              const f = NODES.find(n => n.id === fi)!, t = NODES.find(n => n.id === ti)!;
              const show = v.has(fi) && v.has(ti);
              return (
                <motion.g key={ei} animate={{ opacity: show ? 0.9 : 0.05 }}>
                  <line x1={cx(f)} y1={cy(f)} x2={cx(t)} y2={cy(t)}
                    stroke="#888" strokeWidth={1} strokeDasharray="4 3" />
                  <rect x={(cx(f) + cx(t)) / 2 + 2 - 22} y={(cy(f) + cy(t)) / 2 - 11} width={44} height={11} rx={2} fill="var(--card)" />
                  <text x={(cx(f) + cx(t)) / 2 + 2} y={(cy(f) + cy(t)) / 2 - 4}
                    textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{lbl}</text>
                </motion.g>
              );
            })}
            {NODES.map((n) => (
              <motion.g key={n.id} animate={{ opacity: v.has(n.id) ? 1 : 0.1 }}>
                <motion.rect x={n.x} y={n.y} width={W} height={H} rx={6}
                  animate={{ fill: `${n.color}18`, stroke: n.color, strokeWidth: v.has(n.id) ? 1.8 : 0.7 }} />
                <text x={cx(n)} y={cy(n) + 4} textAnchor="middle"
                  fontSize={9} fontWeight={600} fill={n.color}>{n.label}</text>
              </motion.g>
            ))}
        </svg>
        );
      }}
    </StepViz>
  );
}
