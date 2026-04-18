import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { pk: '#6366f1', vk: '#10b981', pf: '#f59e0b' };

const STEPS = [
  { label: 'ProvingKey -- 증명자 전용', body: '증명 생성에 필요한 모든 SRS 포인트를 보유. 크기 O(n), 제약 수에 비례.' },
  { label: 'VerifyingKey -- 검증자 전용', body: '페어링 검증에 필요한 최소 데이터. 크기 O(l), 공개 입력 수에 비례.' },
  { label: 'Proof -- 최종 증명 (256B)', body: 'G1 2개 + G2 1개. 회로 크기와 무관한 상수 크기.' },
];

export default function DataStructuresViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* ProvingKey main box */}
              <ModuleBox x={20} y={8} w={200} h={36} label="ProvingKey" sub="O(n) size" color={C.pk} />

              {/* Fields as DataBox pills */}
              {[
                { label: 'vk', sub: 'VerifyingKey', x: 20, y: 54 },
                { label: 'alpha_g1', sub: 'G1', x: 110, y: 54 },
                { label: 'beta_g1', sub: 'G1', x: 200, y: 54 },
                { label: 'beta_g2', sub: 'G2', x: 290, y: 54 },
                { label: 'delta_g1', sub: 'G1', x: 20, y: 94 },
                { label: 'delta_g2', sub: 'G2', x: 110, y: 94 },
              ].map((f, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.06 }}>
                  <DataBox x={f.x} y={f.y} w={80} h={30} label={f.label} sub={f.sub} color={C.pk} />
                </motion.g>
              ))}

              {/* Query vectors -- larger boxes */}
              {[
                { label: 'a_query', sub: 'Vec<G1> n', x: 20, y: 136 },
                { label: 'b_g1_query', sub: 'Vec<G1> n', x: 130, y: 136 },
                { label: 'b_g2_query', sub: 'Vec<G2> n', x: 240, y: 136 },
                { label: 'h_query', sub: 'Vec<G1> d', x: 350, y: 136 },
              ].map((f, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: 0.3 + i * 0.08 }}>
                  <rect x={f.x} y={f.y} width={100} height={30} rx={6}
                    fill={`${C.pk}10`} stroke={C.pk} strokeWidth={0.8} />
                  <text x={f.x + 50} y={f.y + 14} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.pk}>{f.label}</text>
                  <text x={f.x + 50} y={f.y + 25} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">{f.sub}</text>
                </motion.g>
              ))}

              {/* l_query */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.6 }}>
                <rect x={20} y={174} width={100} height={22} rx={6}
                  fill={`${C.pk}10`} stroke={C.pk} strokeWidth={0.8} />
                <text x={70} y={189} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.pk}>l_query</text>
                <text x={140} y={189} fontSize={8} fill="var(--muted-foreground)">Vec&lt;G1&gt; m (private)</text>
              </motion.g>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={140} y={8} w={200} h={36} label="VerifyingKey" sub="O(l) size" color={C.vk} />

              {/* Fields */}
              {[
                { label: 'alpha_g1', sub: '[a]1', x: 40, y: 58 },
                { label: 'beta_g2', sub: '[b]2', x: 160, y: 58 },
                { label: 'gamma_g2', sub: '[g]2', x: 280, y: 58 },
                { label: 'delta_g2', sub: '[d]2', x: 400, y: 58 },
              ].map((f, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.08 }}>
                  <DataBox x={f.x} y={f.y} w={80} h={30} label={f.label} sub={f.sub} color={C.vk} />
                </motion.g>
              ))}

              {/* IC vector */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.4 }}>
                <rect x={80} y={104} width={320} height={36} rx={8}
                  fill={`${C.vk}10`} stroke={C.vk} strokeWidth={1} />
                <text x={240} y={120} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.vk}>ic: Vec&lt;G1&gt;</text>
                <text x={240} y={133} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">l+1 elements (public input commitments)</text>
              </motion.g>

              {/* Size comparison */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
                <rect x={130} y={152} width={220} height={28} rx={6}
                  fill={`${C.vk}08`} stroke={C.vk} strokeWidth={0.5} strokeDasharray="4 3" />
                <text x={240} y={170} textAnchor="middle" fontSize={9} fill={C.vk}>e(a,b) precompute cache 가능</text>
              </motion.g>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={140} y={8} w={200} h={36} label="Proof" sub="constant 256B" color={C.pf} />

              {/* Three proof elements as sized boxes */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.15 }}>
                <rect x={40} y={60} width={100} height={50} rx={8}
                  fill={`${C.pf}12`} stroke={C.pf} strokeWidth={1.2} />
                <text x={90} y={82} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.pf}>A</text>
                <text x={90} y={97} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">G1Affine: 64B</text>
              </motion.g>

              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.3 }}>
                <rect x={170} y={60} width={150} height={50} rx={8}
                  fill={`${C.pf}12`} stroke={C.pf} strokeWidth={1.2} />
                <text x={245} y={82} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.pf}>B</text>
                <text x={245} y={97} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">G2Affine: 128B</text>
              </motion.g>

              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.45 }}>
                <rect x={350} y={60} width={100} height={50} rx={8}
                  fill={`${C.pf}12`} stroke={C.pf} strokeWidth={1.2} />
                <text x={400} y={82} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.pf}>C</text>
                <text x={400} y={97} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">G1Affine: 64B</text>
              </motion.g>

              {/* Size bar comparison */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
                {/* Total bar */}
                <rect x={40} y={130} width={410} height={20} rx={4} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <rect x={40} y={130} width={100} height={20} rx={0} fill={`${C.pf}18`} />
                <rect x={140} y={130} width={150} height={20} rx={0} fill={`${C.pf}28`} />
                <rect x={290} y={130} width={100} height={20} rx={0} fill={`${C.pf}18`} />
                <text x={90} y={144} textAnchor="middle" fontSize={8} fill={C.pf}>64B</text>
                <text x={215} y={144} textAnchor="middle" fontSize={8} fill={C.pf}>128B</text>
                <text x={340} y={144} textAnchor="middle" fontSize={8} fill={C.pf}>64B</text>
                <text x={420} y={144} fontSize={8} fill="var(--muted-foreground)">= 256B</text>
              </motion.g>

              <text x={245} y={172} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                BLS12-381: G1=48B, G2=96B, total=192B
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
