import { motion } from 'framer-motion';
import StepViz from '../../../../components/ui/step-viz';

const C = { blue: '#60a5fa', orange: '#f97316', green: '#22c55e', purple: '#a78bfa' };

const STEPS = [
  { label: '빈 비트 배열 초기화', body: 'Bloom Filter는 m개의 비트로 구성된 배열로 시작합니다. 모든 비트는 0으로 초기화됩니다.' },
  { label: '첫 번째 원소 삽입 — k개 해시 함수가 비트를 마킹', body: '원소 "apple"을 삽입하면 k개의 해시 함수가 각각 비트 위치를 계산하고 해당 비트를 1로 설정합니다.' },
  { label: '두 번째 원소 삽입 — 비트 중첩 발생', body: '원소 "banana"를 삽입합니다. 일부 비트는 이전 원소와 겹칠 수 있으며, 이것이 false positive의 원인입니다.' },
  { label: '조회 — 긍정 매칭 vs 확정적 부정', body: '"apple" 조회 시 모든 비트가 1이면 "아마도 존재". "cherry" 조회 시 하나라도 0이면 "확실히 없음".' },
];

function BitArray({ bits, highlights, highlightColor }: { bits: number[]; highlights?: Set<number>; highlightColor?: string }) {
  const w = 28;
  const gap = 3;
  const total = bits.length;
  const svgW = total * (w + gap) - gap;

  return (
    <g>
      {bits.map((bit, i) => {
        const x = i * (w + gap);
        const isHighlighted = highlights?.has(i);
        const fill = bit === 1
          ? (isHighlighted ? highlightColor ?? C.blue : `${C.blue}88`)
          : (isHighlighted ? `${highlightColor ?? C.blue}33` : 'hsl(var(--muted))');
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <rect x={x} y={0} width={w} height={w} rx={4}
              fill={fill}
              stroke={isHighlighted ? (highlightColor ?? C.blue) : 'hsl(var(--border))'}
              strokeWidth={isHighlighted ? 2 : 1} />
            <text x={x + w / 2} y={w / 2 + 1} textAnchor="middle" dominantBaseline="middle"
              fontSize={11} fontWeight={600}
              fill={bit === 1 ? '#fff' : 'hsl(var(--muted-foreground))'}>
              {bit}
            </text>
          </motion.g>
        );
      })}
    </g>
  );
}

function BloomFilterViz() {
  const empty = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const after1 = [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];
  const after2 = [0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0];
  const h1 = new Set([1, 4, 8]);
  const h2 = new Set([3, 7, 8]);
  const queryPos = new Set([1, 4, 8]);
  const queryNeg = new Set([2, 5, 10]);

  return (
    <StepViz steps={STEPS}>
      {(step: number) => (
        <svg viewBox="0 0 380 150" className="w-full max-w-[520px]" role="img">
          {step === 0 && (
            <g transform="translate(4, 20)">
              <BitArray bits={empty} />
              <text x={186} y={55} textAnchor="middle" fontSize={10} fill="hsl(var(--muted-foreground))">
                m = 12 bits, 모두 0
              </text>
            </g>
          )}
          {step === 1 && (
            <g transform="translate(4, 10)">
              <BitArray bits={after1} highlights={h1} highlightColor={C.blue} />
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <text x={186} y={50} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.blue}>
                  "apple" → h₁=1, h₂=4, h₃=8
                </text>
                {[1, 4, 8].map((idx, i) => (
                  <motion.line key={idx} x1={186} y1={58} x2={idx * 31 + 14} y2={-2}
                    stroke={C.blue} strokeWidth={1.5} strokeDasharray="3 2"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ delay: 0.4 + i * 0.15, duration: 0.3 }} />
                ))}
              </motion.g>
            </g>
          )}
          {step === 2 && (
            <g transform="translate(4, 10)">
              <BitArray bits={after2} highlights={h2} highlightColor={C.orange} />
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <text x={186} y={50} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.orange}>
                  "banana" → h₁=3, h₂=7, h₃=8 (비트 8 중첩)
                </text>
                {[3, 7, 8].map((idx, i) => (
                  <motion.line key={idx} x1={186} y1={58} x2={idx * 31 + 14} y2={-2}
                    stroke={C.orange} strokeWidth={1.5} strokeDasharray="3 2"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ delay: 0.3 + i * 0.15, duration: 0.3 }} />
                ))}
              </motion.g>
            </g>
          )}
          {step === 3 && (
            <g transform="translate(4, 5)">
              <BitArray bits={after2} />
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <text x={100} y={55} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.green}>
                  "apple" → bits 1,4,8 모두 1
                </text>
                <text x={100} y={70} textAnchor="middle" fontSize={9} fill={C.green}>
                  → "아마도 존재"
                </text>
                <text x={290} y={55} textAnchor="middle" fontSize={10} fontWeight={600} fill="#ef4444">
                  "cherry" → bit 2 = 0
                </text>
                <text x={290} y={70} textAnchor="middle" fontSize={9} fill="#ef4444">
                  → "확실히 없음"
                </text>
              </motion.g>
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
      <h2 className="text-2xl font-bold mb-6">Bloom Filter 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Bloom Filter는 <strong>Burton Howard Bloom</strong>이 1970년에 제안한{' '}
          <strong>공간 효율적인 확률적 자료구조</strong>입니다. 집합에 특정 원소가 포함되어 있는지를
          테스트하는 멤버십 쿼리에 사용되며, 매우 작은 메모리로 동작하는 대신{' '}
          <strong>false positive</strong>(있다고 했는데 실은 없음)가 일정 확률로 발생할 수 있습니다.
          반면 <strong>false negative</strong>(없다고 했는데 실은 있음)는 절대 발생하지 않습니다.
        </p>

        <p>
          이러한 특성 덕분에 Bloom Filter는 블록체인 생태계에서 널리 활용됩니다.
          Bitcoin의 SPV(Simplified Payment Verification) 노드는 BIP-37을 통해 관련 트랜잭션만
          필터링하여 수신하며, Ethereum은 블록과 트랜잭션 Receipt에 2048-bit logsBloom 필드를
          포함하여 로그 이벤트를 빠르게 필터링합니다.
        </p>

        <BloomFilterViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">핵심 특성</h3>
        <div className="grid gap-3 sm:grid-cols-2 not-prose">
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2" style={{ color: C.green }}>False Negative 불가능</h4>
            <p className="text-sm text-muted-foreground">
              삽입된 원소에 대해 "없다"고 판정하는 경우는 절대 없습니다.
              모든 해시 위치의 비트가 반드시 1로 설정되어 있기 때문입니다.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2" style={{ color: C.orange }}>False Positive 가능</h4>
            <p className="text-sm text-muted-foreground">
              삽입하지 않은 원소도 "있다"고 판정될 수 있습니다.
              다른 원소들이 설정한 비트가 우연히 모두 겹치는 경우입니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
