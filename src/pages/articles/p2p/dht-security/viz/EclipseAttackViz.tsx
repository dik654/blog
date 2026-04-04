import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const ATK = '#ef4444', DEF = '#6366f1', OK = '#10b981';
const STEPS = [
  'Eclipse 공격: 대상 노드의 모든 버킷을 공격자 노드로 채움',
  '방어: 버킷 다양성 (같은 /24에서 최대 2개) + liveness 검증',
  'go-ethereum 다중 방어: IP 쿼터 + seed 노드 + 주기적 revalidation',
];

export default function EclipseAttackViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Target node (center) */}
          <rect x={220} y={80} width={80} height={50} rx={8}
            fill="var(--card)" stroke="var(--foreground)" strokeWidth={1.5} />
          <text x={260} y={110} textAnchor="middle"
            fontSize={11} fontWeight="600" fill="var(--foreground)">
            대상 노드
          </text>

          {/* Attacker ring (step 0) */}
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
            const cx = 260 + Math.cos(angle) * 90;
            const cy = 105 + Math.sin(angle) * 80;
            const blocked = step >= 1;
            return (
              <motion.g key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: step >= 0 ? 1 : 0 }}
                transition={{ delay: i * 0.06 }}>
                <circle cx={cx} cy={cy} r={16}
                  fill={blocked ? `${ATK}10` : `${ATK}25`}
                  stroke={ATK} strokeWidth={1}
                  strokeDasharray={blocked ? '3 2' : 'none'} opacity={blocked ? 0.4 : 1} />
                <text x={cx} y={cy + 3} textAnchor="middle"
                  fontSize={10} fill={ATK} opacity={blocked ? 0.4 : 1}>
                  A{i + 1}
                </text>
                <line x1={cx + Math.cos(angle + Math.PI) * 16}
                  y1={cy + Math.sin(angle + Math.PI) * 16}
                  x2={260 + Math.cos(angle) * 40}
                  y2={105 + Math.sin(angle) * 25}
                  stroke={blocked ? `${ATK}25` : `${ATK}60`}
                  strokeWidth={1} strokeDasharray={blocked ? '2 2' : 'none'} />
              </motion.g>
            );
          })}

          {/* Defense labels (step 1) */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={375} y={30} width={130} height={60} rx={6}
                fill={`${DEF}12`} stroke={DEF} strokeWidth={1} />
              <text x={440} y={50} textAnchor="middle"
                fontSize={10} fontWeight="600" fill={DEF}>
                버킷 다양성
              </text>
              <text x={440} y={65} textAnchor="middle"
                fontSize={10} fill="var(--muted-foreground)">
                /24당 최대 2개
              </text>
              <text x={440} y={78} textAnchor="middle"
                fontSize={10} fill="var(--muted-foreground)">
                + PING liveness 검증
              </text>
            </motion.g>
          )}

          {/* Multi-layer defense (step 2) */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              {[
                { y: 130, label: 'IP 쿼터', sub: '/24 서브넷 제한' },
                { y: 155, label: 'Seed 노드', sub: 'DB + 부트노드 이중화' },
                { y: 180, label: 'Revalidation', sub: 'fast 3s + slow 9s' },
              ].map((d, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                  <rect x={370} y={d.y} width={140} height={22} rx={4}
                    fill={`${OK}12`} stroke={OK} strokeWidth={1} />
                  <text x={390} y={d.y + 15} fontSize={10} fontWeight="600"
                    fill={OK}>{d.label}</text>
                  <text x={505} y={d.y + 15} textAnchor="end" fontSize={10}
                    fill="var(--muted-foreground)">{d.sub}</text>
                </motion.g>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
