import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, AlertBox, DataBox } from '@/components/viz/boxes';

const C = {
  rec: '#f59e0b',
  iter: '#10b981',
  warn: '#ef4444',
  ok: '#22c55e',
};

const STEPS = [
  {
    label: 'Recursive — DNS 방식 forwarding',
    body: 'Q→A→B→C→D→C→B→A→Q 패턴. 중간 노드가 query를 릴레이하고 결과도 거꾸로 흘러간다.',
  },
  {
    label: 'Recursive 4가지 문제점',
    body: '중간 노드 장애 → chain 끊김, 결과 조작 가능, progress tracking 어려움, timeout 복잡.',
  },
  {
    label: 'Iterative — Q가 모든 hop 직접',
    body: 'Q가 A에 묻고 응답 받음 → 그 응답을 보고 B에 직접 질의 → C → D 직접. 모든 응답이 Q로.',
  },
  {
    label: 'Iterative 4가지 장점',
    body: 'Q가 전체 flow 통제, 중간 노드 장애에 강건, progress 항상 visible, 구현 단순.',
  },
];

export default function RecVsIterFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="rifarr" markerWidth="6" markerHeight="6" refX="5.5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={C.rec}>Recursive — Forwarding chain</text>

              {/* Q, A, B, C, D linear */}
              {[
                { name: 'Q', x: 50, role: 'querier' },
                { name: 'A', x: 145, role: '' },
                { name: 'B', x: 240, role: '' },
                { name: 'C', x: 335, role: '' },
                { name: 'D', x: 430, role: 'target' },
              ].map((n, i) => (
                <g key={i}>
                  <circle cx={n.x} cy={110} r={20} fill={C.rec + '20'} stroke={C.rec} strokeWidth={1.4} />
                  <text x={n.x} y={114} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.rec}>{n.name}</text>
                  {n.role && (
                    <text x={n.x} y={144} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{n.role}</text>
                  )}
                </g>
              ))}

              {/* Forward arrows above */}
              {[0, 1, 2, 3].map((i) => (
                <motion.g key={i}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 * i }}>
                  <line x1={70 + i * 95} y1={100} x2={125 + i * 95} y2={100}
                    stroke={C.rec} strokeWidth={1.4} markerEnd="url(#rifarr)" />
                  <text x={97 + i * 95} y={92} textAnchor="middle" fontSize={9}
                    fontWeight={600} fill={C.rec}>find</text>
                </motion.g>
              ))}

              {/* Backward dashed arrows below */}
              {[0, 1, 2, 3].map((i) => (
                <motion.g key={i}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 + 0.15 * i }}>
                  <line x1={415 - i * 95} y1={120} x2={360 - i * 95} y2={120}
                    stroke={C.rec} strokeWidth={1.2} strokeDasharray="4 3" markerEnd="url(#rifarr)" />
                  <text x={387 - i * 95} y={134} textAnchor="middle" fontSize={9}
                    fill={C.rec} fillOpacity={0.85}>relay</text>
                </motion.g>
              ))}

              <text x={240} y={180} textAnchor="middle" fontSize={9} fontWeight={600}
                fill="var(--muted-foreground)">8 hops 총 (4 forward + 4 backward)</text>
              <text x={240} y={200} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">중간 노드는 단순 relay — Q는 진행 상황을 알 수 없음</text>
              <text x={240} y={220} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">유사: DNS resolver, mail relay</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={C.warn}>Recursive의 4가지 결함</text>

              <AlertBox x={20} y={48} w={210} h={56}
                label="중간 노드 장애" sub="chain 끊김 → 전체 실패" color={C.warn} />
              <AlertBox x={250} y={48} w={210} h={56}
                label="결과 조작 가능" sub="중간 노드가 응답 변조" color={C.warn} />
              <AlertBox x={20} y={120} w={210} h={56}
                label="Progress 미가시" sub="Q는 어디까지 갔는지 모름" color={C.warn} />
              <AlertBox x={250} y={120} w={210} h={56}
                label="Timeout 복잡" sub="누구의 timeout인지" color={C.warn} />
              <text x={240} y={210} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">P2P 네트워크는 churn이 높아 forwarding chain이 끊기기 쉬움</text>
              <text x={240} y={228} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">→ Kademlia는 iterative 선택</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={C.iter}>Iterative — Querier가 모든 hop 직접</text>

              {/* Q in center, A/B/C/D around */}
              <circle cx={240} cy={120} r={26} fill={C.iter + '20'} stroke={C.iter} strokeWidth={1.6} />
              <text x={240} y={117} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.iter}>Q</text>
              <text x={240} y={130} textAnchor="middle" fontSize={8} fill={C.iter}>querier</text>

              {[
                { name: 'A', x: 70, y: 60 },
                { name: 'B', x: 410, y: 60 },
                { name: 'C', x: 70, y: 200 },
                { name: 'D', x: 410, y: 200 },
              ].map((n, i) => (
                <g key={i}>
                  <circle cx={n.x} cy={n.y} r={20} fill={C.iter + '15'} stroke={C.iter} strokeWidth={1.2} />
                  <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.iter}>{n.name}</text>
                </g>
              ))}

              {/* Sequential round-trips Q-A, Q-B, Q-C, Q-D */}
              {[
                { x1: 218, y1: 110, x2: 90, y2: 70, mid: { x: 145, y: 78 } },
                { x1: 262, y1: 110, x2: 390, y2: 70, mid: { x: 335, y: 78 } },
                { x1: 218, y1: 130, x2: 90, y2: 192, mid: { x: 145, y: 168 } },
                { x1: 262, y1: 130, x2: 390, y2: 192, mid: { x: 335, y: 168 } },
              ].map((p, i) => (
                <motion.g key={i}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.25 }}>
                  <line x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2}
                    stroke={C.iter} strokeWidth={1.4} markerEnd="url(#rifarr)" />
                  <line x1={p.x2 + 4} y1={p.y2 + 8} x2={p.x1 - 6} y2={p.y1 + 8}
                    stroke={C.iter} strokeWidth={1.2} strokeDasharray="4 3" markerEnd="url(#rifarr)" />
                  <text x={p.mid.x} y={p.mid.y} textAnchor="middle" fontSize={8}
                    fontWeight={600} fill={C.iter}>{`q${i + 1}`}</text>
                </motion.g>
              ))}

              <text x={240} y={232} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">Q → A → Q → B → Q → C → Q → D (각 hop 직접 round-trip)</text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={C.ok}>Iterative의 4가지 장점</text>

              <ActionBox x={20} y={48} w={210} h={56}
                label="Querier 전체 통제" sub="모든 응답 직접 검증" color={C.ok} />
              <ActionBox x={250} y={48} w={210} h={56}
                label="중간 노드 장애 강건" sub="다른 후보로 즉시 전환" color={C.ok} />
              <ActionBox x={20} y={120} w={210} h={56}
                label="Progress visible" sub="shortlist 상태 즉시" color={C.ok} />
              <ActionBox x={250} y={120} w={210} h={56}
                label="Easier to implement" sub="단일 owner 모델" color={C.ok} />
              <text x={240} y={210} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">Trade-off: 더 많은 RTT (각 hop마다 왕복)</text>
              <text x={240} y={228} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">→ 그러나 α 병렬화로 실효 시간 단축</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
