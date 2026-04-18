import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { tr: '#6366f1', lde: '#10b981', err: '#ef4444', fri: '#f59e0b' };

const STEPS = [
  { label: 'LDE 개요 -- 왜 확장하는가?', body: '8점만 검사하면 가짜도 통과. blowup rho=4로 32점 확장 시 오류가 증폭되어 탐지 가능.' },
  { label: 'Trace → 다항식 보간', body: '8개 trace 값을 IFFT로 유일한 degree-7 다항식 f(x)로 변환.' },
  { label: 'LDE: 32개 점으로 확장 평가', body: '동일 다항식 f(x)를 32개 점에서 평가 후 Merkle 커밋. 저차 다항식이면 모든 점이 곡선 위.' },
  { label: '가짜 trace → 오류 증폭', body: 'Schwartz-Zippel 보조정리: 가짜 다항식은 78%+ 점에서 불일치. FRI 쿼리로 탐지.' },
];

/* arrow helper */
const Arrow = ({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) => {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len, uy = dy / len;
  const ax = x2 - ux * 5, ay = y2 - uy * 5;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} />
      <polygon
        points={`${x2},${y2} ${ax - uy * 3},${ay + ux * 3} ${ax + uy * 3},${ay - ux * 3}`}
        fill={color}
      />
    </g>
  );
};

export default function LDEViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Small domain */}
              <ModuleBox x={20} y={10} w={130} h={40} label="Trace Domain T" sub="8개 점" color={C.tr} />
              {/* 8 dots */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.circle key={i} cx={35 + i * 15} cy={68} r={4}
                  fill={C.tr} stroke={C.tr} strokeWidth={0.6}
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ ...sp, delay: 0.1 + i * 0.03 }} />
              ))}
              <text x={85} y={84} textAnchor="middle" fontSize={7.5} fill={C.tr}>omega^0 ... omega^7</text>

              {/* Arrow: blowup */}
              <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.25 }}>
                <Arrow x1={160} y1={30} x2={210} y2={30} color={C.lde} />
                <text x={185} y={22} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.lde}>rho = 4</text>
              </motion.g>

              {/* Large domain */}
              <ModuleBox x={220} y={10} w={250} h={40} label="LDE Domain" sub="32개 점 (blowup 4x)" color={C.lde} />
              {/* 32 dots in two rows */}
              {Array.from({ length: 16 }).map((_, i) => (
                <motion.circle key={i} cx={232 + i * 14.5} cy={62} r={3}
                  fill={C.lde} stroke={C.lde} strokeWidth={0.5}
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ ...sp, delay: 0.3 + i * 0.02 }} />
              ))}
              {Array.from({ length: 16 }).map((_, i) => (
                <motion.circle key={i + 16} cx={232 + i * 14.5} cy={76} r={3}
                  fill={C.lde} stroke={C.lde} strokeWidth={0.5}
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ ...sp, delay: 0.3 + (i + 16) * 0.02 }} />
              ))}

              {/* Problem / Solution boxes */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.5 }}>
                <AlertBox x={20} y={100} w={200} h={38} label="8점만 검사 → 가짜도 통과" sub="검증 불충분" color={C.err} />
                <Arrow x1={220} y1={119} x2={260} y2={119} color={C.lde} />
                <DataBox x={265} y={103} w={200} h={30} label="32점 확장 → 오류 증폭" color={C.lde} />
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
                <text x={245} y={160} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  더 많은 점에서 평가할수록 가짜 다항식의 불일치가 드러남
                </text>
              </motion.g>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Trace values */}
              <text x={20} y={18} fontSize={9} fontWeight={600} fill={C.tr}>Trace 값</text>
              {[
                { x: 'omega^0', v: '1' }, { x: 'omega^1', v: '1' }, { x: 'omega^2', v: '2' }, { x: 'omega^3', v: '3' },
                { x: 'omega^4', v: '5' }, { x: 'omega^5', v: '8' }, { x: 'omega^6', v: '13' }, { x: 'omega^7', v: '21' },
              ].map((p, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: 0.05 + i * 0.04 }}>
                  <rect x={15 + i * 56} y={28} width={50} height={36} rx={5}
                    fill={`${C.tr}10`} stroke={C.tr} strokeWidth={0.5} />
                  <text x={40 + i * 56} y={43} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">{p.x}</text>
                  <text x={40 + i * 56} y={57} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.tr}>{p.v}</text>
                </motion.g>
              ))}

              {/* IFFT arrow */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
                <Arrow x1={245} y1={72} x2={245} y2={92} color={C.tr} />
                <ActionBox x={170} y={96} w={150} h={36} label="IFFT 보간" sub="8점 → degree-7 다항식" color={C.tr} />
              </motion.g>

              {/* Result polynomial */}
              <motion.g initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 0.55 }}>
                <rect x={120} y={148} width={250} height={30} rx={15}
                  fill={`${C.lde}12`} stroke={C.lde} strokeWidth={0.8} />
                <text x={245} y={167} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.lde}>
                  f(x) : 유일한 degree-7 다항식
                </text>
              </motion.g>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* f(x) source */}
              <DataBox x={20} y={12} w={110} h={30} label="f(x) deg-7" color={C.tr} />

              {/* Arrow to LDE evaluation */}
              <Arrow x1={130} y1={27} x2={165} y2={27} color={C.lde} />

              {/* LDE domain evaluation */}
              <ActionBox x={170} y={8} w={160} h={38} label="LDE 평가" sub="f(g^i) for i=0..31" color={C.lde} />

              {/* 32 evaluated points as a curve-like visualization */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.2 }}>
                <rect x={20} y={56} width={450} height={70} rx={6}
                  fill={`${C.lde}06`} stroke="var(--border)" strokeWidth={0.4} />
                <text x={30} y={70} fontSize={8} fill="var(--muted-foreground)">LDE 도메인 (32점)</text>

                {/* Polynomial curve approximation */}
                <motion.path
                  d="M 40,105 C 60,80 80,95 100,85 C 120,75 140,100 160,90 C 180,80 200,110 220,95 C 240,80 260,100 280,85 C 300,75 320,105 340,90 C 360,80 380,95 400,85 C 420,75 440,100 450,90"
                  fill="none" stroke={C.lde} strokeWidth={1.2} strokeDasharray="3 2"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                />
                {/* Points on curve */}
                {Array.from({ length: 16 }).map((_, i) => (
                  <motion.circle key={i} cx={40 + i * 27} cy={[105, 80, 95, 85, 75, 100, 90, 80, 110, 95, 80, 100, 85, 75, 105, 90][i]}
                    r={3} fill={C.lde}
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ ...sp, delay: 0.4 + i * 0.03 }} />
                ))}
              </motion.g>

              {/* Merkle commit */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.7 }}>
                <Arrow x1={245} y1={126} x2={245} y2={142} color={C.fri} />
                <ModuleBox x={170} y={146} w={150} h={38} label="Merkle Root" sub="Verifier에게 커밋" color={C.fri} />
              </motion.g>

              {/* Side note */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.8 }}>
                <text x={370} y={25} fontSize={8} fill="var(--muted-foreground)">g = primitive_root(32)</text>
              </motion.g>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Real vs Fake polynomial */}
              <ModuleBox x={20} y={8} w={130} h={38} label="정상 f(x)" sub="deg ≤ 7" color={C.lde} />
              <ModuleBox x={180} y={8} w={130} h={38} label="가짜 f'(x)" sub="deg > 7 (위반)" color={C.err} />

              {/* Visual: dots on curve vs off curve */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.15 }}>
                <rect x={20} y={55} width={200} height={70} rx={6}
                  fill={`${C.lde}06`} stroke={C.lde} strokeWidth={0.5} />
                <text x={30} y={68} fontSize={7.5} fill={C.lde}>정상: 모든 점이 곡선 위</text>
                {/* curve + dots aligned */}
                <line x1={30} y1={105} x2={210} y2={80} stroke={C.lde} strokeWidth={1} />
                {Array.from({ length: 8 }).map((_, i) => (
                  <circle key={i} cx={35 + i * 23} cy={104 - i * 3} r={3} fill={C.lde} />
                ))}
              </motion.g>

              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.25 }}>
                <rect x={250} y={55} width={220} height={70} rx={6}
                  fill={`${C.err}06`} stroke={C.err} strokeWidth={0.5} />
                <text x={260} y={68} fontSize={7.5} fill={C.err}>가짜: 78%+ 점이 곡선 이탈</text>
                {/* curve + dots misaligned */}
                <line x1={260} y1={105} x2={460} y2={80} stroke={C.err} strokeWidth={1} strokeDasharray="3 2" />
                {Array.from({ length: 8 }).map((_, i) => {
                  const onCurve = i === 1 || i === 5;
                  const baseY = 104 - i * 3;
                  const cy = onCurve ? baseY : baseY + (i % 2 === 0 ? -10 : 12);
                  return (
                    <g key={i}>
                      <circle cx={265 + i * 25} cy={cy} r={3} fill={onCurve ? C.lde : C.err} />
                      {!onCurve && (
                        <line x1={265 + i * 25} y1={cy + 3} x2={265 + i * 25} y2={baseY - 3}
                          stroke={C.err} strokeWidth={0.6} strokeDasharray="2 1" />
                      )}
                    </g>
                  );
                })}
              </motion.g>

              {/* Schwartz-Zippel result */}
              <motion.g initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 0.4 }}>
                <rect x={60} y={138} width={170} height={40} rx={6}
                  fill={`${C.err}08`} stroke={C.err} strokeWidth={0.6} />
                <text x={145} y={155} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.err}>Schwartz-Zippel</text>
                <text x={145} y={170} textAnchor="middle" fontSize={8} fill={C.err}>일치 ≤ 7/32 = 22%</text>
              </motion.g>

              <motion.g initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 0.5 }}>
                <Arrow x1={230} y1={158} x2={270} y2={158} color={C.fri} />
                <rect x={275} y={138} width={180} height={40} rx={6}
                  fill={`${C.fri}12`} stroke={C.fri} strokeWidth={0.6} />
                <text x={365} y={155} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.fri}>FRI k개 쿼리</text>
                <text x={365} y={170} textAnchor="middle" fontSize={8} fill={C.fri}>soundness ≈ (1-rho^-1)^k</text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
