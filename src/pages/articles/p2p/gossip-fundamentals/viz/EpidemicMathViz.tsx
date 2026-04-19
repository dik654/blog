import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  {
    label: 'Push 모델: I(t+1) = I(t) + I(t)·(1 − I(t))',
    body: '감염 노드가 매 라운드 랜덤 1명에게 전달. 감염 비율이 자기-증식.\nO(log N) 라운드에 전체 감염.',
  },
  {
    label: 'Pull 모델: S(t+1) = S(t)·(1 − I(t))',
    body: '미감염 노드가 매 라운드 랜덤 1명에게 질의. 후반부 감소가 빠르다.\nO(log N) 라운드, Push 대비 대역폭 효율.',
  },
  {
    label: 'Push-Pull: O(log log N) 라운드 수렴',
    body: '두 모델 결합. Push는 빠른 초기 확산, Pull이 잔여 미감염 회수.\n네트워크 결함에 더 강건.',
  },
  {
    label: '핵심 특성: Fault Tolerance · Scalability · Simplicity',
    body: '중앙 조정 없이 로컬 정보만 사용.\nO(log N) 라운드, O(log N) contacts, network load 균등.',
  },
  {
    label: 'vs Deterministic Broadcast',
    body: 'Multicast Tree는 빠르지만 fragile, Flooding은 단순하지만 낭비.\nGossip은 두 극단의 균형점에 위치.',
  },
];

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = {
  push: '#6366f1',
  pull: '#10b981',
  pp: '#f59e0b',
  feat: '#0ea5e9',
  bad: '#ef4444',
  good: '#22c55e',
};

// 12 round samples for I(t)
const PUSH_CURVE = [0.02, 0.04, 0.07, 0.13, 0.23, 0.36, 0.55, 0.74, 0.88, 0.95, 0.98, 1.0];
const PULL_CURVE = [0.02, 0.05, 0.11, 0.20, 0.34, 0.50, 0.68, 0.83, 0.93, 0.98, 1.0, 1.0];
const PP_CURVE = [0.02, 0.07, 0.18, 0.40, 0.68, 0.88, 0.97, 1.0, 1.0, 1.0, 1.0, 1.0];

function curvePath(curve: number[], x0: number, y0: number, w: number, h: number) {
  return curve
    .map((v, i) => {
      const x = x0 + (i / (curve.length - 1)) * w;
      const y = y0 + h - v * h;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

export default function EpidemicMathViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-3xl" style={{ height: 'auto' }}>
          {step <= 2 && (
            <>
              {/* Chart frame */}
              <rect x={40} y={20} width={260} height={170} rx={6}
                fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              {/* Y axis ticks */}
              {[0, 0.5, 1].map((t, i) => (
                <g key={i}>
                  <line x1={40} y1={20 + (1 - t) * 170} x2={300} y2={20 + (1 - t) * 170}
                    stroke="var(--border)" strokeWidth={0.4} strokeDasharray="2 3" opacity={0.6} />
                  <text x={36} y={24 + (1 - t) * 170} textAnchor="end"
                    fontSize={8} fill="var(--muted-foreground)">{t.toFixed(1)}</text>
                </g>
              ))}
              {/* X label */}
              <text x={170} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                round t →
              </text>
              <text x={20} y={105} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)"
                transform="rotate(-90 20 105)">I(t)</text>

              {/* Push curve */}
              <motion.path d={curvePath(PUSH_CURVE, 40, 20, 260, 170)}
                fill="none" stroke={C.push} strokeWidth={step === 0 ? 2.2 : 1.1}
                strokeOpacity={step === 0 ? 1 : 0.35}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.7 }} />
              {/* Pull curve */}
              <motion.path d={curvePath(PULL_CURVE, 40, 20, 260, 170)}
                fill="none" stroke={C.pull} strokeWidth={step === 1 ? 2.2 : 1.1}
                strokeOpacity={step === 1 ? 1 : 0.35}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.7 }} />
              {/* Push-Pull curve */}
              <motion.path d={curvePath(PP_CURVE, 40, 20, 260, 170)}
                fill="none" stroke={C.pp} strokeWidth={step === 2 ? 2.2 : 1.1}
                strokeOpacity={step === 2 ? 1 : 0.35}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.7 }} />

              {/* Legend */}
              <g>
                <rect x={320} y={26} width={150} height={108} rx={6}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={395} y={40} textAnchor="middle" fontSize={9} fontWeight={700}
                  fill="var(--foreground)">전파 모델</text>
                {[
                  { c: C.push, name: 'Push', conv: 'O(log N)' },
                  { c: C.pull, name: 'Pull', conv: 'O(log N)' },
                  { c: C.pp, name: 'Push-Pull', conv: 'O(log log N)' },
                ].map((m, i) => {
                  const active =
                    (i === 0 && step === 0) || (i === 1 && step === 1) || (i === 2 && step === 2);
                  return (
                    <motion.g key={m.name}
                      animate={{ opacity: active ? 1 : 0.4 }} transition={sp}>
                      <line x1={328} y1={56 + i * 25} x2={350} y2={56 + i * 25}
                        stroke={m.c} strokeWidth={active ? 2.4 : 1.2} />
                      <text x={356} y={59 + i * 25} fontSize={9} fontWeight={600} fill={m.c}>
                        {m.name}
                      </text>
                      <text x={464} y={59 + i * 25} textAnchor="end" fontSize={8}
                        fill="var(--muted-foreground)">
                        {m.conv}
                      </text>
                    </motion.g>
                  );
                })}
              </g>

              {/* Round marker */}
              {step === 2 && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.9 }}
                  transition={{ delay: 0.3 }}>
                  <line x1={40 + (3 / 11) * 260} y1={20} x2={40 + (3 / 11) * 260} y2={190}
                    stroke={C.pp} strokeWidth={0.8} strokeDasharray="3 3" opacity={0.6} />
                  <text x={40 + (3 / 11) * 260} y={16} textAnchor="middle" fontSize={8}
                    fill={C.pp}>~log log N</text>
                </motion.g>
              )}

              {/* Equation banner */}
              <motion.g key={`eq-${step}`} initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }} transition={sp}>
                <rect x={40} y={208} width={420} height={24} rx={4}
                  fill={[C.push, C.pull, C.pp][step] + '12'}
                  stroke={[C.push, C.pull, C.pp][step]} strokeWidth={0.8} />
                <text x={250} y={224} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={[C.push, C.pull, C.pp][step]} fontFamily="monospace">
                  {step === 0 && 'I(t+1) = I(t) + I(t) · (1 − I(t))'}
                  {step === 1 && 'S(t+1) = S(t) · (1 − I(t))'}
                  {step === 2 && 'Push ⊕ Pull → O(log log N)'}
                </text>
              </motion.g>
            </>
          )}

          {step === 3 && (
            <>
              <text x={240} y={28} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">Gossip 핵심 특성</text>
              <ModuleBox x={30} y={50} w={130} h={64}
                label="Fault Tolerance" sub="중앙 조정 불필요" color={C.feat} />
              <ModuleBox x={175} y={50} w={130} h={64}
                label="Scalability" sub="O(log N) rounds" color={C.feat} />
              <ModuleBox x={320} y={50} w={130} h={64}
                label="Simplicity" sub="로컬 정보만" color={C.feat} />

              {/* Detail rows */}
              {[
                { x: 30, items: ['일부 실패 → 전파 계속', 'Network partition 복원'] },
                { x: 175, items: ['contacts: O(log N)/node', 'load 균등 분산'] },
                { x: 320, items: ['no global state', '구현 단순'] },
              ].map((col, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}>
                  {col.items.map((it, j) => (
                    <g key={j}>
                      <circle cx={col.x + 10} cy={134 + j * 20} r={2} fill={C.feat} />
                      <text x={col.x + 18} y={138 + j * 20} fontSize={9}
                        fill="var(--muted-foreground)">{it}</text>
                    </g>
                  ))}
                </motion.g>
              ))}

              {/* Application strip */}
              <text x={240} y={194} textAnchor="middle" fontSize={9} fontWeight={600}
                fill="var(--muted-foreground)">실제 채택 사례</text>
              {['Blockchain', 'SWIM/DHT', 'Cassandra', 'Failure Det.'].map((app, i) => (
                <DataBox key={app} x={30 + i * 110} y={205} w={100} h={24}
                  label={app} color={C.good} />
              ))}
            </>
          )}

          {step === 4 && (
            <>
              <text x={240} y={28} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">전파 전략 비교</text>

              {/* 3 strategies */}
              <ActionBox x={30} y={56} w={130} h={50}
                label="Multicast Tree" sub="fast · fragile" color={C.bad} />
              <ActionBox x={175} y={56} w={130} h={50}
                label="Flooding" sub="simple · wasteful" color={C.pp} />
              <ActionBox x={320} y={56} w={130} h={50}
                label="Gossip" sub="balanced" color={C.good} />

              {/* Speed/cost matrix */}
              <text x={50} y={138} fontSize={9} fontWeight={600}
                fill="var(--muted-foreground)">속도</text>
              <text x={50} y={172} fontSize={9} fontWeight={600}
                fill="var(--muted-foreground)">대역폭</text>
              <text x={50} y={206} fontSize={9} fontWeight={600}
                fill="var(--muted-foreground)">결함내성</text>

              {/* Bars */}
              {[
                { col: 'Tree', x: 95, c: C.bad, vals: [0.95, 0.4, 0.2] },
                { col: 'Flood', x: 215, c: C.pp, vals: [0.85, 1.0, 0.5] },
                { col: 'Gossip', x: 335, c: C.good, vals: [0.7, 0.55, 0.95] },
              ].map((s) =>
                s.vals.map((v, i) => (
                  <motion.g key={`${s.col}-${i}`} initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    style={{ transformOrigin: `${s.x}px ${130 + i * 34}px` }}
                    transition={{ delay: 0.1 + i * 0.1 }}>
                    <rect x={s.x} y={130 + i * 34} width={100} height={6} rx={3}
                      fill="var(--border)" opacity={0.3} />
                    <rect x={s.x} y={130 + i * 34} width={100 * v} height={6} rx={3}
                      fill={s.c} />
                  </motion.g>
                )),
              )}
            </>
          )}
        </svg>
      )}
    </StepViz>
  );
}
