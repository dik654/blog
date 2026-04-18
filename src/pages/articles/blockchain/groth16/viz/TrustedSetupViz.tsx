import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { tau: '#6366f1', srs: '#10b981', tag: '#f59e0b', sep: '#8b5cf6', del: '#ef4444' };

const Arrow = ({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) => {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len, uy = dy / len;
  const ax = x2 - ux * 6, ay = y2 - uy * 6;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} />
      <polygon points={`${x2},${y2} ${ax - uy * 3},${ay + ux * 3} ${ax + uy * 3},${ay - ux * 3}`} fill={color} />
    </g>
  );
};

const STEPS = [
  { label: '비밀 파라미터 랜덤 샘플링', body: 'Fr 필드에서 5개 비밀값 무작위 추출. MPC 세레모니로 1-of-N 신뢰 보장.' },
  { label: 'SRS 포인트 생성', body: 'tau 거듭제곱을 EC 스칼라곱으로 커밋. d+1개의 G1/G2 포인트 생성.' },
  { label: 'alpha, beta 구조 태그 결합', body: 'A, B 다항식을 alpha*beta 구조로 묶어 개별 위조를 방지.' },
  { label: 'gamma, delta 공개/비공개 분리', body: 'public IC는 gamma로, private L은 delta로 나눠 교차 불가.' },
  { label: 'Toxic Waste 즉시 삭제', body: '비밀 스칼라 전부 덮어쓰기. 하나라도 노출 시 증명 위조 가능.' },
];

export default function TrustedSetupViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={160} y={4} w={160} h={32} label="Fr Random Sampling" color={C.tau} />
              {/* Five secret values */}
              {['tau','alpha','beta','gamma','delta'].map((name, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.1 }}>
                  <DataBox x={10 + i * 94} y={54} w={82} h={32} label={name} sub="rand(Fr)" color={C.tau} />
                </motion.g>
              ))}
              {/* dice icon - small circles */}
              {[0,1,2,3,4].map(i => (
                <motion.circle key={i} cx={51 + i * 94} cy={102} r={4}
                  fill={`${C.tau}30`} stroke={C.tau} strokeWidth={0.8}
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ ...sp, delay: 0.5 + i * 0.06 }} />
              ))}
              <text x={245} y={125} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                254-bit prime field, uniform random
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* tau source */}
              <DataBox x={10} y={30} w={60} h={30} label="tau" color={C.tau} />
              <Arrow x1={70} y1={45} x2={100} y2={45} color={C.srs} />

              {/* EC scalar mul */}
              <ActionBox x={100} y={24} w={100} h={40} label="EC scalar mul" sub="d+1 times" color={C.srs} />
              <Arrow x1={200} y1={45} x2={230} y2={45} color={C.srs} />

              {/* SRS points */}
              {[0,1,2,3].map(i => (
                <motion.g key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.2 + i * 0.1 }}>
                  <rect x={230 + i * 60} y={30} width={50} height={30} rx={6}
                    fill={`${C.srs}12`} stroke={C.srs} strokeWidth={0.8} />
                  <text x={255 + i * 60} y={49} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.srs}>
                    [t^{i}]1
                  </text>
                </motion.g>
              ))}

              {/* G2 row */}
              {[0,1,2].map(i => (
                <motion.g key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.5 + i * 0.1 }}>
                  <rect x={230 + i * 60} y={72} width={50} height={30} rx={6}
                    fill={`${C.srs}08`} stroke={C.srs} strokeWidth={0.8} strokeDasharray="3 2" />
                  <text x={255 + i * 60} y={91} textAnchor="middle" fontSize={9} fill={C.srs}>
                    [t^{i}]2
                  </text>
                </motion.g>
              ))}

              <text x={245} y={122} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                G1 = (1, 2) on BN254
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* alpha and beta inputs */}
              <DataBox x={10} y={30} w={70} h={28} label="alpha" color={C.tag} />
              <DataBox x={10} y={70} w={70} h={28} label="beta" color={C.tag} />

              <Arrow x1={80} y1={44} x2={120} y2={55} color={C.tag} />
              <Arrow x1={80} y1={84} x2={120} y2={70} color={C.tag} />

              {/* Binding action */}
              <ActionBox x={120} y={40} w={110} h={44} label="Structure Tag" sub="A*a + B*b binding" color={C.tag} />
              <Arrow x1={230} y1={62} x2={270} y2={40} color={C.tag} />
              <Arrow x1={230} y1={62} x2={270} y2={80} color={C.tag} />

              {/* Output commitments */}
              <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.3 }}>
                <ModuleBox x={270} y={20} w={100} h={32} label="[alpha]1" sub="alpha * G1" color={C.tag} />
              </motion.g>
              <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.4 }}>
                <ModuleBox x={270} y={64} w={100} h={32} label="[beta]2" sub="beta * G2" color={C.tag} />
              </motion.g>

              {/* Explanation */}
              <rect x={80} y={115} width={320} height={30} rx={6}
                fill={`${C.tag}08`} stroke={C.tag} strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={134} textAnchor="middle" fontSize={9} fill={C.tag}>
                alpha*beta 결합 없이 A, B 따로 위조 가능
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* gamma path */}
              <DataBox x={10} y={20} w={70} h={28} label="gamma" color={C.sep} />
              <Arrow x1={80} y1={34} x2={140} y2={34} color={C.sep} />
              <ModuleBox x={140} y={14} w={130} h={38} label="public IC" sub="SUM s_j * (...) / gamma" color={C.sep} />

              {/* delta path */}
              <DataBox x={10} y={80} w={70} h={28} label="delta" color={C.sep} />
              <Arrow x1={80} y1={94} x2={140} y2={94} color={C.sep} />
              <ModuleBox x={140} y={74} w={130} h={38} label="private L" sub="SUM w_j * (...) / delta" color={C.sep} />

              {/* Separation wall */}
              <motion.line x1={310} y1={10} x2={310} y2={120} stroke={C.del} strokeWidth={1.5}
                strokeDasharray="6 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={sp} />
              <text x={330} y={45} fontSize={9} fontWeight={600} fill={C.del}>
                gamma != delta
              </text>
              <text x={330} y={62} fontSize={8} fill="var(--muted-foreground)">
                cross impossible
              </text>

              {/* X mark */}
              <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ ...sp, delay: 0.4 }}>
                <line x1={360} y1={80} x2={380} y2={100} stroke={C.del} strokeWidth={2} />
                <line x1={380} y1={80} x2={360} y2={100} stroke={C.del} strokeWidth={2} />
                <text x={400} y={94} fontSize={8} fill={C.del}>교차 불가</text>
              </motion.g>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Before: toxic values */}
              {['tau','alpha','beta','gamma','delta'].map((name, i) => (
                <motion.g key={i} initial={{ opacity: 1 }} animate={{ opacity: 0.3 }}
                  transition={{ ...sp, delay: 0.3 + i * 0.1 }}>
                  <DataBox x={10 + i * 94} y={14} w={82} h={28} label={name} color={C.del} />
                </motion.g>
              ))}

              {/* Overwrite X marks */}
              {[0,1,2,3,4].map(i => (
                <motion.g key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...sp, delay: 0.6 + i * 0.08 }}>
                  <line x1={30 + i * 94} y1={18} x2={72 + i * 94} y2={38} stroke={C.del} strokeWidth={2} />
                  <line x1={72 + i * 94} y1={18} x2={30 + i * 94} y2={38} stroke={C.del} strokeWidth={2} />
                </motion.g>
              ))}

              {/* Zero fill bar */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.8 }}>
                <rect x={60} y={60} width={370} height={30} rx={6}
                  fill={`${C.del}12`} stroke={C.del} strokeWidth={1} />
                <text x={245} y={79} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.del}>
                  0x00...00 (memset zero overwrite)
                </text>
              </motion.g>

              {/* Warning */}
              <AlertBox x={120} y={108} w={250} h={40} label="Toxic Waste Destroyed" sub="1개라도 노출 시 proof 위조 가능" color={C.del} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
