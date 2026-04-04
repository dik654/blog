import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const MODS = [
  { id: 'baseapp', label: 'BaseApp', color: '#8b5cf6', x: 130, y: 5 },
  { id: 'auth', label: 'x/auth', color: '#a855f7', x: 10, y: 70 },
  { id: 'bank', label: 'x/bank', color: '#6366f1', x: 110, y: 70 },
  { id: 'staking', label: 'x/staking', color: '#10b981', x: 210, y: 70 },
  { id: 'gov', label: 'x/gov', color: '#f59e0b', x: 110, y: 140 },
  { id: 'store', label: 'MultiStore', color: '#6b7280', x: 210, y: 140 },
];

const ROUTES = [
  { from: 0, to: 1, label: 'AnteHandler' },
  { from: 0, to: 2, label: 'MsgSend' },
  { from: 0, to: 3, label: 'MsgDelegate' },
  { from: 3, to: 2, label: 'Keeper DI' },
  { from: 4, to: 3, label: 'Keeper DI' },
  { from: 2, to: 5, label: 'KVStore' },
  { from: 3, to: 5, label: 'KVStore' },
];

const STEPS = [
  { label: '모듈 인터랙션 전체 구조', body: 'BaseApp이 Msg를 라우팅하고, 각 모듈이 Keeper로 상태를 관리.' },
  { label: 'BaseApp 라우팅', body: 'Protobuf Msg 타입을 확인하고 해당 모듈의 MsgServer로 전달.' },
  { label: 'Keeper 의존성 주입', body: 'StakingKeeper → BankKeeper, Gov → StakingKeeper 등 DI로 연결.' },
  { label: 'MultiStore 저장', body: '각 모듈이 독립된 IAVL KVStore에 상태를 읽고 씁니다.' },
];

const ACTIVE_ROUTES: number[][] = [[0,1,2,3,4,5,6], [0,1,2], [3,4], [5,6]];
const BW = 80, BH = 35;
const mid = (i: number) => ({ x: MODS[i].x + BW / 2, y: MODS[i].y + BH / 2 });

export default function ModuleAutoFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 450 195" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Edges */}
          {ROUTES.map((r, i) => {
            const f = mid(r.from), t = mid(r.to);
            const show = ACTIVE_ROUTES[step].includes(i);
            return (
              <motion.g key={i} animate={{ opacity: show ? 1 : 0.08 }} transition={{ duration: 0.3 }}>
                <motion.line x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                  stroke="#666" strokeWidth={1.5} strokeDasharray="5 3"
                  initial={{ pathLength: 0 }} animate={{ pathLength: show ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: i * 0.06 }} />
                <text x={(f.x + t.x) / 2 + 2} y={(f.y + t.y) / 2 - 4}
                  textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  {r.label}
                </text>
                {show && (
                  <motion.circle r={3} fill={MODS[r.from].color}
                    animate={{ cx: [f.x, t.x], cy: [f.y, t.y] }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.5 }} />
                )}
              </motion.g>
            );
          })}
          {/* Module boxes */}
          {MODS.map((m) => (
            <g key={m.id}>
              <rect x={m.x} y={m.y} width={BW} height={BH} rx={6}
                fill={`${m.color}12`} stroke={m.color} strokeWidth={1.5} />
              <text x={m.x + BW / 2} y={m.y + BH / 2 + 4}
                textAnchor="middle" fontSize={9} fontWeight="700" fill={m.color}>
                {m.label}
              </text>
            </g>
          ))}
        </svg>
      )}
    </StepViz>
  );
}
