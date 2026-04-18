import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { r1cs: '#6366f1', ifft: '#10b981', qap: '#f59e0b', van: '#8b5cf6', h: '#ec4899' };

/* arrow helper */
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
  { label: 'R1CS 매트릭스 구성', body: '곱셈 게이트를 A, B, C 행렬로 인코딩. 각 행이 하나의 제약을 표현.' },
  { label: 'IFFT 보간 -> QAP 다항식', body: '각 열을 단위근 도메인에서 역 FFT하여 다항식 계수로 변환.' },
  { label: 'QAP 다항식 조합', body: 'witness 벡터 w로 가중합하여 A(x), B(x), C(x) 단일 다항식 생성.' },
  { label: 'Vanishing Polynomial t(x)', body: 't(x) = x^m - 1. 모든 단위근에서 0이 되어 R1CS 만족 여부를 다항식 나눗셈으로 판별.' },
  { label: 'h(x) 몫 다항식 계산', body: 'h(x) = (A*B - C) / t(x). 코셋 FFT로 O(n log n)에 수행.' },
];

export default function R1CStoQAPViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Matrix headers */}
              <ModuleBox x={10} y={10} w={90} h={40} label="A" sub="left wire" color={C.r1cs} />
              <ModuleBox x={120} y={10} w={90} h={40} label="B" sub="right wire" color={C.r1cs} />
              <ModuleBox x={230} y={10} w={90} h={40} label="C" sub="output wire" color={C.r1cs} />

              {/* Matrix cells */}
              {[['0','1','0'],['0','1','0'],['0','0','1']].map((row, mi) => (
                <g key={mi}>
                  {row.map((v, ci) => {
                    const bx = 10 + mi * 110 + ci * 28 + 4;
                    return (
                      <g key={ci}>
                        <rect x={bx} y={60} width={24} height={20} rx={3}
                          fill={v === '1' ? `${C.r1cs}20` : 'var(--card)'}
                          stroke={v === '1' ? C.r1cs : 'var(--border)'} strokeWidth={v === '1' ? 1.2 : 0.5} />
                        <text x={bx + 12} y={74} textAnchor="middle" fontSize={10}
                          fontWeight={v === '1' ? 700 : 400} fill={v === '1' ? C.r1cs : 'var(--muted-foreground)'}>{v}</text>
                      </g>
                    );
                  })}
                </g>
              ))}
              {/* Variable labels */}
              {['1','x','y'].map((v, i) => (
                <text key={i} x={10 + i * 28 + 4 + 12} y={93} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{v}</text>
              ))}
              {/* Equation */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.3 }}>
                <rect x={340} y={20} width={140} height={50} rx={8} fill={`${C.r1cs}08`} stroke={C.r1cs} strokeWidth={0.8} strokeDasharray="4 3" />
                <text x={410} y={40} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.r1cs}>A*w . B*w = C*w</text>
                <text x={410} y={56} textAnchor="middle" fontSize={9} fill={C.r1cs}>x * x = y</text>
              </motion.g>
              {/* Arrow from C to equation box */}
              <Arrow x1={320} y1={35} x2={340} y2={42} color={C.r1cs} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Source: columns */}
              {['A[:,j]','B[:,j]','C[:,j]'].map((label, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.1 }}>
                  <DataBox x={10} y={10 + i * 44} w={70} h={32} label={label} color={C.ifft} />
                </motion.g>
              ))}
              {/* IFFT process */}
              <ActionBox x={120} y={38} w={80} h={44} label="IFFT" sub="역 FFT" color={C.ifft} />
              {/* Arrows in */}
              {[0,1,2].map(i => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 + i * 0.08 }}>
                  <Arrow x1={80} y1={26 + i * 44} x2={120} y2={60} color={C.ifft} />
                </motion.g>
              ))}
              {/* Output polynomials */}
              {['a_j(x)','b_j(x)','c_j(x)'].map((label, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.4 + i * 0.1 }}>
                  <DataBox x={240} y={10 + i * 44} w={75} h={32} label={label} color={C.ifft} />
                </motion.g>
              ))}
              {/* Arrows out */}
              {[0,1,2].map(i => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 + i * 0.08 }}>
                  <Arrow x1={200} y1={60} x2={240} y2={26 + i * 44} color={C.ifft} />
                </motion.g>
              ))}
              {/* Domain note */}
              <text x={360} y={55} fontSize={9} fill={C.ifft}>domain = unit roots</text>
              <text x={360} y={70} fontSize={8} fill="var(--muted-foreground)">각 변수 j마다 보간</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Witness */}
              <DataBox x={10} y={20} w={70} h={32} label="w" sub="witness" color={C.qap} />
              {/* Polynomial arrays */}
              {['a_j(x)','b_j(x)','c_j(x)'].map((label, i) => (
                <DataBox key={i} x={100} y={10 + i * 38} w={75} h={28} label={label} color={C.ifft} />
              ))}
              {/* Weighted sum arrows */}
              <Arrow x1={80} y1={36} x2={100} y2={24} color={C.qap} />
              <Arrow x1={80} y1={36} x2={100} y2={62} color={C.qap} />

              {/* Sum operation */}
              <ActionBox x={200} y={30} w={90} h={48} label="w 가중합" sub="SUM w_j * poly_j" color={C.qap} />
              {[0,1,2].map(i => (
                <Arrow key={i} x1={175} y1={24 + i * 38} x2={200} y2={54} color={C.qap} />
              ))}

              {/* Result polynomials */}
              {['A(x)','B(x)','C(x)'].map((label, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.3 + i * 0.1 }}>
                  <ModuleBox x={320} y={10 + i * 38} w={70} h={30} label={label} color={C.qap} />
                </motion.g>
              ))}
              {[0,1,2].map(i => (
                <Arrow key={i} x1={290} y1={54} x2={320} y2={25 + i * 38} color={C.qap} />
              ))}
              {/* Formula */}
              <text x={410} y={55} fontSize={9} fill={C.qap}>A*B - C = 0</text>
              <text x={410} y={70} fontSize={8} fill="var(--muted-foreground)">at all roots</text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Vanishing polynomial as a curve sketch */}
              <ModuleBox x={30} y={12} w={120} h={44} label="t(x)" sub="vanishing poly" color={C.van} />
              {/* Zero points on number line */}
              <line x1={30} y1={100} x2={420} y2={100} stroke="var(--border)" strokeWidth={1} />
              {['1','w','w^2','w^3','...','w^(m-1)'].map((label, i) => {
                const cx = 60 + i * 60;
                return (
                  <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ ...sp, delay: i * 0.1 }}>
                    <circle cx={cx} cy={100} r={5} fill={C.van} />
                    <text x={cx} y={118} textAnchor="middle" fontSize={8} fill={C.van}>{label}</text>
                    <text x={cx} y={88} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.van}>0</text>
                  </motion.g>
                );
              })}
              {/* Explanation */}
              <text x={200} y={145} textAnchor="middle" fontSize={9} fill={C.van}>t(x) = x^m - 1 : m개 단위근에서 모두 0</text>
              <text x={200} y={160} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">R1CS 만족 = t(x)가 A*B-C를 나눔</text>
              {/* Formula box */}
              <rect x={300} y={12} width={150} height={44} rx={8} fill={`${C.van}08`} stroke={C.van} strokeWidth={0.8} strokeDasharray="4 3" />
              <text x={375} y={32} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.van}>t(x) | A*B - C</text>
              <text x={375} y={48} textAnchor="middle" fontSize={8} fill={C.van}>divisibility check</text>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Input: A*B-C */}
              <DataBox x={10} y={20} w={90} h={32} label="A*B - C" color={C.h} />
              {/* Divide */}
              <ActionBox x={130} y={16} w={80} h={42} label="/ t(x)" sub="나눗셈" color={C.h} />
              <Arrow x1={100} y1={36} x2={130} y2={37} color={C.h} />
              {/* Output: h(x) */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.3 }}>
                <ModuleBox x={240} y={16} w={80} h={42} label="h(x)" sub="quotient" color={C.h} />
              </motion.g>
              <Arrow x1={210} y1={37} x2={240} y2={37} color={C.h} />

              {/* Coset FFT pipeline */}
              <text x={100} y={85} fontSize={9} fontWeight={600} fill={C.h}>Coset FFT pipeline</text>
              {['IFFT','coset eval','point-div','IFFT'].map((label, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: 0.2 + i * 0.12 }}>
                  <rect x={20 + i * 110} y={96} width={90} height={28} rx={6}
                    fill={`${C.h}10`} stroke={C.h} strokeWidth={0.8} />
                  <text x={65 + i * 110} y={114} textAnchor="middle" fontSize={9} fill={C.h}>{label}</text>
                  {i < 3 && <Arrow x1={110 + i * 110} y1={110} x2={130 + i * 110} y2={110} color={C.h} />}
                </motion.g>
              ))}
              <text x={245} y={145} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">O(n log n) complexity</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
