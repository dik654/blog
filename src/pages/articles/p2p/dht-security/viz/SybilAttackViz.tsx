import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const ATTACK = '#ef4444';
const DEFEND = '#6366f1';
const OK = '#10b981';

const STEPS = [
  'Sybil 공격: 공격자가 같은 IP 대역에서 수천 개 가짜 노드 생성',
  'IP 쿼터 방어: /24 서브넷당 버킷 2개, 테이블 전체 10개 제한',
  '결과: 공격자 노드 대부분 거부 — 라우팅 테이블 보호',
];

export default function SybilAttackViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Target node */}
          <rect x={220} y={75} width={80} height={50} rx={8}
            fill="var(--card)" stroke="var(--foreground)" strokeWidth={1.5} />
          <text x={260} y={105} textAnchor="middle"
            fontSize={11} fontWeight="600" fill="var(--foreground)">
            대상 노드
          </text>

          {/* Attacker nodes (left) */}
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.g key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: step >= 0 ? 1 : 0, x: step >= 0 ? 0 : -20 }}
              transition={{ delay: i * 0.08 }}>
              <rect x={30} y={20 + i * 35} width={70} height={26} rx={5}
                fill={step >= 2 ? `${ATTACK}15` : `${ATTACK}30`}
                stroke={ATTACK} strokeWidth={1}
                strokeDasharray={step >= 2 ? '4 2' : 'none'}
                opacity={step >= 2 ? 0.4 : 1} />
              <text x={65} y={37 + i * 35} textAnchor="middle"
                fontSize={10} fill={ATTACK}
                opacity={step >= 2 ? 0.4 : 1}>
                Sybil #{i + 1}
              </text>
              {/* Arrow */}
              <line x1={100} y1={33 + i * 35} x2={218} y2={100}
                stroke={step >= 2 ? `${ATTACK}30` : `${ATTACK}80`}
                strokeWidth={1} strokeDasharray={step >= 2 ? '3 3' : 'none'} />
            </motion.g>
          ))}

          {/* IP Quota shield (step 1+) */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={155} y={60} width={55} height={80} rx={6}
                fill={`${DEFEND}15`} stroke={DEFEND} strokeWidth={1.5} />
              <text x={182} y={95} textAnchor="middle"
                fontSize={10} fontWeight="600" fill={DEFEND}>
                IP 쿼터
              </text>
              <text x={182} y={108} textAnchor="middle"
                fontSize={10} fill={DEFEND}>
                /24: 2개
              </text>
              <text x={182} y={121} textAnchor="middle"
                fontSize={10} fill={DEFEND}>
                전체: 10개
              </text>
            </motion.g>
          )}

          {/* Surviving normal nodes (right) */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              {[0, 1, 2].map((i) => (
                <g key={i}>
                  <rect x={370} y={50 + i * 40} width={80} height={26} rx={5}
                    fill={`${OK}15`} stroke={OK} strokeWidth={1} />
                  <text x={410} y={67 + i * 40} textAnchor="middle"
                    fontSize={10} fill={OK}>
                    정상 피어 {i + 1}
                  </text>
                  <line x1={300} y1={100} x2={370} y2={63 + i * 40}
                    stroke={OK} strokeWidth={1} />
                </g>
              ))}
              <rect x={345} y={170} width={130} height={20} rx={4}
                fill={`${OK}15`} stroke={OK} strokeWidth={1} />
              <text x={410} y={184} textAnchor="middle"
                fontSize={10} fontWeight="600" fill={OK}>
                라우팅 테이블 보호
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
