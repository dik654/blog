import { motion } from 'framer-motion';
import StepViz from '../../../../components/ui/step-viz';

const C = { blue: '#60a5fa', orange: '#f97316', green: '#22c55e', purple: '#a78bfa' };

const STEPS = [
  { label: '입력 데이터 → 해시 함수 → 고정 길이 출력', body: '임의 길이의 입력 데이터가 해시 함수를 통과하면 항상 고정된 크기(예: 256-bit)의 출력값이 생성됩니다. 동일한 입력은 항상 동일한 출력을 생성합니다 (결정론적).' },
  { label: '눈사태 효과 — 1-bit 변경 → 완전히 다른 출력', body: '입력의 아주 작은 변화(1 비트)만으로도 출력 해시값이 완전히 달라집니다. 이를 눈사태 효과(Avalanche Effect)라 하며, 이 성질이 블록체인의 변조 방지를 보장합니다.' },
  { label: '충돌 저항성 — 같은 출력을 만드는 두 입력 찾기 불가능', body: '서로 다른 두 입력 x, y에 대해 H(x) = H(y)인 쌍을 찾는 것이 계산적으로 불가능합니다. 이 성질이 블록체인에서 데이터 무결성의 핵심입니다.' },
];

function HashViz() {
  return (
    <StepViz steps={STEPS}>
      {(step: number) => (
        <svg viewBox="0 0 420 140" className="w-full max-w-[540px]" role="img">
          {step === 0 && (
            <g>
              <motion.rect x={10} y={35} width={110} height={50} rx={8}
                fill={`${C.blue}15`} stroke={C.blue} strokeWidth={1.5}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }} />
              <motion.text x={65} y={55} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.blue}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                "Hello World"
              </motion.text>
              <motion.text x={65} y={72} textAnchor="middle" fontSize={8} fill="hsl(var(--muted-foreground))"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                (임의 길이 입력)
              </motion.text>

              <motion.line x1={125} y1={60} x2={175} y2={60}
                stroke={C.blue} strokeWidth={2} markerEnd="url(#arrowBlue)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }} />

              <motion.rect x={180} y={40} width={80} height={40} rx={10}
                fill={`${C.purple}25`} stroke={C.purple} strokeWidth={2}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }} />
              <motion.text x={220} y={64} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.purple}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                H(x)
              </motion.text>

              <motion.line x1={265} y1={60} x2={305} y2={60}
                stroke={C.purple} strokeWidth={2} markerEnd="url(#arrowPurple)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }} />

              <motion.rect x={310} y={30} width={100} height={60} rx={8}
                fill={`${C.green}15`} stroke={C.green} strokeWidth={1.5}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }} />
              <motion.text x={360} y={53} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.green}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                a591a6d4...
              </motion.text>
              <motion.text x={360} y={70} textAnchor="middle" fontSize={7} fill="hsl(var(--muted-foreground))"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                (256-bit 고정 출력)
              </motion.text>

              <defs>
                <marker id="arrowBlue" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <path d="M0,0 L8,3 L0,6" fill={C.blue} />
                </marker>
                <marker id="arrowPurple" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <path d="M0,0 L8,3 L0,6" fill={C.purple} />
                </marker>
              </defs>
            </g>
          )}
          {step === 1 && (
            <g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <rect x={10} y={10} width={180} height={30} rx={6}
                  fill={`${C.blue}12`} stroke={C.blue} strokeWidth={1} />
                <text x={100} y={29} textAnchor="middle" fontSize={9} fill={C.blue}>
                  Input: "Hello World"
                </text>

                <rect x={230} y={10} width={180} height={30} rx={6}
                  fill={`${C.green}12`} stroke={C.green} strokeWidth={1} />
                <text x={320} y={29} textAnchor="middle" fontSize={7} fontFamily="monospace" fill={C.green}>
                  a591a6d40bf420...
                </text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <rect x={10} y={55} width={180} height={30} rx={6}
                  fill={`${C.orange}12`} stroke={C.orange} strokeWidth={1} />
                <text x={100} y={74} textAnchor="middle" fontSize={9} fill={C.orange}>
                  Input: "Hello World!" (1글자 추가)
                </text>

                <rect x={230} y={55} width={180} height={30} rx={6}
                  fill={`${C.orange}12`} stroke={C.orange} strokeWidth={1} />
                <text x={320} y={74} textAnchor="middle" fontSize={7} fontFamily="monospace" fill={C.orange}>
                  7f83b1657ff1fc...
                </text>
              </motion.g>

              <motion.text x={210} y={115} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.orange}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                1 글자 변경 → 완전히 다른 해시값
              </motion.text>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <line x1={210} y1={40} x2={210} y2={55} stroke="hsl(var(--border))" strokeWidth={1} strokeDasharray="3 2" />
                <text x={215} y={50} fontSize={12} fill="#ef4444">
                  ≠
                </text>
              </motion.g>
            </g>
          )}
          {step === 2 && (
            <g>
              <motion.rect x={60} y={15} width={120} height={35} rx={8}
                fill={`${C.blue}15`} stroke={C.blue} strokeWidth={1.5}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} />
              <motion.text x={120} y={37} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.blue}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                x (입력 A)
              </motion.text>

              <motion.rect x={240} y={15} width={120} height={35} rx={8}
                fill={`${C.orange}15`} stroke={C.orange} strokeWidth={1.5}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.1 }} />
              <motion.text x={300} y={37} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.orange}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                y (입력 B)
              </motion.text>

              <motion.line x1={120} y1={55} x2={210} y2={85}
                stroke={C.blue} strokeWidth={1.5} strokeDasharray="4 2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }} />
              <motion.line x1={300} y1={55} x2={210} y2={85}
                stroke={C.orange} strokeWidth={1.5} strokeDasharray="4 2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }} />

              <motion.rect x={160} y={80} width={100} height={35} rx={8}
                fill={`${C.green}15`} stroke={C.green} strokeWidth={2}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }} />
              <motion.text x={210} y={102} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.green}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                H(x) ≠ H(y)
              </motion.text>

              <motion.text x={210} y={132} textAnchor="middle" fontSize={9} fill="hsl(var(--muted-foreground))"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                x ≠ y 이면 H(x) = H(y)인 쌍을 찾는 것은 계산적으로 불가능
              </motion.text>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">암호학적 해시 함수의 역할</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          암호학적 해시 함수는 블록체인 기술의 근간을 이루는 핵심 원시(primitive)입니다.
          블록 연결, 트랜잭션 검증, 주소 생성, 상태 관리 등 블록체인의 거의 모든 계층에서
          해시 함수가 사용됩니다. 해시 함수는 임의 길이의 입력을 받아{' '}
          <strong>고정 길이의 출력(digest)</strong>을 생성하는 수학적 함수입니다.
        </p>

        <HashViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">필수 속성</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 not-prose">
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2" style={{ color: C.blue }}>결정론적 (Deterministic)</h4>
            <p className="text-sm text-muted-foreground">
              동일한 입력은 항상 동일한 출력을 생성합니다.
              네트워크의 모든 노드가 독립적으로 같은 결과를 얻을 수 있습니다.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2" style={{ color: C.green }}>빠른 계산 (Fast Computation)</h4>
            <p className="text-sm text-muted-foreground">
              해시값 계산이 효율적이어야 합니다. 블록 검증 시 수천 개의 트랜잭션
              해시를 빠르게 계산해야 하기 때문입니다.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2" style={{ color: C.orange }}>충돌 저항성 (Collision Resistance)</h4>
            <p className="text-sm text-muted-foreground">
              H(x) = H(y)인 서로 다른 x, y를 찾는 것이 계산적으로 불가능합니다.
              머클 트리와 블록 해시의 안전성을 보장합니다.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2" style={{ color: C.purple }}>프리이미지 저항성 (Preimage Resistance)</h4>
            <p className="text-sm text-muted-foreground">
              해시값 h가 주어졌을 때 H(x) = h인 x를 찾는 것이 불가능합니다.
              PoW 마이닝의 안전성을 보장하는 핵심 성질입니다.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2" style={{ color: '#ef4444' }}>눈사태 효과 (Avalanche Effect)</h4>
            <p className="text-sm text-muted-foreground">
              입력의 1-bit 변경만으로 출력의 약 50%가 변경됩니다.
              블록 데이터의 미세한 변조도 즉시 감지할 수 있게 합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
