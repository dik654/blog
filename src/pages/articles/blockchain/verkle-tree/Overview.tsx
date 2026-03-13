import { motion } from 'framer-motion';
import StepViz from '../../../../components/ui/step-viz';

const C = { blue: '#60a5fa', orange: '#f97316', green: '#22c55e', purple: '#a78bfa' };

const STEPS = [
  { label: 'Merkle Tree: 넓은 분기와 큰 증명 크기', body: '256-ary Merkle 트리에서 하나의 값을 증명하려면 각 레벨에서 255개의 형제 해시가 필요합니다. 증명 크기가 수 KB에 달하여 네트워크 부담이 큽니다.' },
  { label: 'Verkle Tree: 벡터 커밋먼트로 증명 압축', body: '각 내부 노드가 벡터 커밋먼트(IPA 또는 KZG)를 사용합니다. 형제 노드를 모두 포함할 필요 없이, 커밋먼트의 opening proof만으로 검증이 가능합니다.' },
  { label: '증명 크기 비교: ~150B vs 수 KB', body: 'Verkle 트리는 256-ary 기준으로 증명 크기를 약 150바이트 수준으로 줄입니다. Merkle 트리 대비 약 10~30배 이상의 효율 개선을 달성합니다.' },
];

function MerkleNode({ x, y, label, color, highlight, size = 12 }: {
  x: number; y: number; label: string; color: string; highlight: boolean; size?: number;
}) {
  return (
    <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
      <rect x={x - size} y={y - size} width={size * 2} height={size * 2} rx={3}
        fill={highlight ? `${color}33` : `${color}15`}
        stroke={color} strokeWidth={highlight ? 2.5 : 1.2} />
      <text x={x} y={y + 3} textAnchor="middle" fontSize={7} fontWeight={600} fill={color}>
        {label}
      </text>
    </motion.g>
  );
}

function Edge({ x1, y1, x2, y2, color, dashed }: {
  x1: number; y1: number; x2: number; y2: number; color: string; dashed?: boolean;
}) {
  return (
    <motion.line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1} strokeDasharray={dashed ? '3 2' : 'none'}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ duration: 0.3 }} />
  );
}

function VerkleViz() {
  return (
    <StepViz steps={STEPS}>
      {(step: number) => (
        <svg viewBox="0 0 460 200" className="w-full max-w-[560px]" role="img">
          {step === 0 && (
            <>
              {/* Wide Merkle tree */}
              <MerkleNode x={230} y={25} label="root" color={C.blue} highlight />
              {[70, 150, 230, 310, 390].map((x, i) => (
                <g key={i}>
                  <Edge x1={230} y1={37} x2={x} y2={63} color={C.blue} />
                  <MerkleNode x={x} y={75} label={`H${i}`} color={C.blue} highlight={false} />
                </g>
              ))}
              {/* Show siblings needed for proof */}
              {[70, 150, 310, 390].map((x, i) => (
                <motion.rect key={i} x={x - 14} y={61} width={28} height={28} rx={3}
                  fill="transparent" stroke={C.orange} strokeWidth={2} strokeDasharray="3 2"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />
              ))}
              <motion.text x={230} y={115} textAnchor="middle" fontSize={9} fill={C.orange}
                fontWeight={600} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                증명에 255개 형제 해시 필요 (k=256일 때)
              </motion.text>
              {/* Proof size indicator */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <rect x={130} y={135} width={200} height={30} rx={6}
                  fill={`${C.orange}15`} stroke={C.orange} strokeWidth={1.5} />
                <text x={230} y={155} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.orange}>
                  증명 크기: ~8 KB (256-ary)
                </text>
              </motion.g>
            </>
          )}

          {step === 1 && (
            <>
              {/* Verkle tree with vector commitments */}
              <MerkleNode x={230} y={25} label="VC" color={C.purple} highlight />
              <motion.text x={230} y={50} textAnchor="middle" fontSize={7} fill={C.purple}>
                vector commit
              </motion.text>
              {[100, 180, 260, 340].map((x, i) => (
                <g key={i}>
                  <Edge x1={230} y1={37} x2={x} y2={73} color={C.purple} />
                  <MerkleNode x={x} y={85} label="VC" color={C.purple} highlight={i === 1} />
                </g>
              ))}
              {/* Highlight: only opening proof needed */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <Edge x1={180} y1={97} x2={150} y2={133} color={C.green} />
                <Edge x1={180} y1={97} x2={210} y2={133} color={C.green} dashed />
                <MerkleNode x={150} y={145} label="val" color={C.green} highlight />
                <MerkleNode x={210} y={145} label="..." color={C.blue} highlight={false} />
              </motion.g>
              <motion.text x={330} y={140} textAnchor="middle" fontSize={8} fill={C.green}
                fontWeight={600} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                opening proof만으로 검증
              </motion.text>
              <motion.text x={330} y={155} textAnchor="middle" fontSize={7} fill="hsl(var(--muted-foreground))"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                형제 해시 불필요!
              </motion.text>
            </>
          )}

          {step === 2 && (
            <>
              {/* Side by side comparison */}
              {/* Merkle side */}
              <motion.text x={120} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.orange}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                Merkle Tree
              </motion.text>
              <motion.rect x={40} y={35} width={160} height={70} rx={8}
                fill={`${C.orange}10`} stroke={C.orange} strokeWidth={1.5}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
              <motion.text x={120} y={60} textAnchor="middle" fontSize={9} fill={C.orange}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                255 x 32B per level
              </motion.text>
              <motion.text x={120} y={78} textAnchor="middle" fontSize={12} fontWeight={800} fill={C.orange}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                ~8 KB
              </motion.text>
              <motion.text x={120} y={93} textAnchor="middle" fontSize={7} fill="hsl(var(--muted-foreground))"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                (256-ary, depth 1)
              </motion.text>

              {/* Verkle side */}
              <motion.text x={340} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.green}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                Verkle Tree
              </motion.text>
              <motion.rect x={260} y={35} width={160} height={70} rx={8}
                fill={`${C.green}10`} stroke={C.green} strokeWidth={1.5}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
              <motion.text x={340} y={60} textAnchor="middle" fontSize={9} fill={C.green}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                1 opening proof per level
              </motion.text>
              <motion.text x={340} y={78} textAnchor="middle" fontSize={12} fontWeight={800} fill={C.green}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                ~150 B
              </motion.text>
              <motion.text x={340} y={93} textAnchor="middle" fontSize={7} fill="hsl(var(--muted-foreground))"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                (256-ary, depth 1)
              </motion.text>

              {/* Arrow */}
              <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}>
                <text x={230} y={70} textAnchor="middle" fontSize={20} fill={C.purple}>
                  →
                </text>
                <text x={230} y={140} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.purple}>
                  ~50x 감소
                </text>
              </motion.g>

              {/* Bar chart */}
              <motion.rect x={100} y={120} width={140} height={16} rx={3}
                fill={`${C.orange}40`} stroke={C.orange} strokeWidth={1}
                initial={{ width: 0 }} animate={{ width: 140 }} transition={{ duration: 0.5 }} />
              <motion.rect x={100} y={145} width={3} height={16} rx={3}
                fill={`${C.green}60`} stroke={C.green} strokeWidth={1}
                initial={{ width: 0 }} animate={{ width: 3 }} transition={{ duration: 0.5, delay: 0.3 }} />
              <text x={250} y={133} fontSize={7} fill={C.orange}>8,160 bytes</text>
              <text x={112} y={158} fontSize={7} fill={C.green}>~150 bytes</text>
            </>
          )}
        </svg>
      )}
    </StepViz>
  );
}

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Verkle Tree 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Verkle Tree</strong>는 "Vector commitment"와 "Merkle tree"의 합성어로,
          2018년 John Kuszmaul이 제안한 자료구조입니다. 기존 Merkle 트리의 가장 큰 약점인
          증명 크기(proof size) 문제를 벡터 커밋먼트를 통해 해결합니다.
        </p>
        <p>
          Merkle 트리에서 k-ary(k개의 자식) 구조를 사용하면 트리 깊이는 줄어들지만,
          각 레벨에서 (k-1)개의 형제 해시를 증명에 포함해야 합니다. 따라서 증명 크기는
          O(k * log_k(n))으로, 분기 수가 클수록 오히려 증명이 커지는 딜레마가 발생합니다.
        </p>
        <p>
          Verkle 트리는 이 문제를 근본적으로 해결합니다. 각 내부 노드에서 해시 대신
          벡터 커밋먼트를 사용하여, 형제 노드를 포함하지 않고도 특정 자식의 포함을
          증명할 수 있습니다. 이로써 증명 크기가 O(log_k(n))으로 줄어들며, 분기 수를
          크게 늘려도 증명 크기가 거의 증가하지 않습니다.
        </p>

        <VerkleViz />

        <p>
          Verkle 트리는 특히 Ethereum의 상태 트리(state trie) 개선안으로 주목받고 있습니다.
          현재 Ethereum은 Modified Merkle Patricia Trie를 사용하지만, stateless client를
          실현하기 위해 Verkle 트리로의 전환이 논의되고 있습니다.
        </p>
      </div>
    </section>
  );
}
