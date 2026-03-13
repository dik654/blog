import { motion } from 'framer-motion';
import StepViz from '../../../../../components/ui/step-viz';

/* PagedAttention KV 캐시 블록 관리 시각화 */

const C = { alloc: '#6366f1', free: '#94a3b8', cow: '#f59e0b', shared: '#10b981' };

const STEPS = [
  { label: '전통적 시스템: 최대 길이만큼 사전 할당',
    body: '요청마다 max_seq_len 크기의 연속 메모리를 할당합니다. 실제 사용량보다 훨씬 큰 메모리를 점유하여 내부/외부 단편화가 20-38% 발생합니다.' },
  { label: 'PagedAttention: 고정 크기 블록으로 동적 할당',
    body: 'OS의 가상 메모리처럼 Block Table을 통해 논리 블록→물리 블록을 매핑합니다. 비연속 물리 블록을 사용하므로 외부 단편화가 없습니다.' },
  { label: 'Decode: 토큰 생성 시 블록 동적 추가',
    body: '새 토큰이 생성되면 현재 블록에 추가하고, 블록이 가득 차면 새 물리 블록을 할당합니다. 마지막 블록에서만 미사용 슬롯이 발생합니다 (평균 B/2).' },
  { label: 'Copy-on-Write: Beam Search에서 메모리 공유',
    body: '동일 프롬프트를 공유하는 시퀀스들은 같은 물리 블록을 참조합니다. 분기 시에만 새 블록을 복사(CoW)하여 메모리를 절약합니다.' },
  { label: '결과: 메모리 낭비 20-38% → 4% 미만',
    body: 'PagedAttention으로 동일 GPU에서 2-4x 더 많은 요청을 동시 처리할 수 있습니다. HuggingFace 대비 최대 24x 처리량 향상.' },
];

const BLOCK_W = 36;
const BLOCK_H = 24;
const GAP = 4;

function Block({ x, y, label, color, dim = false }: {
  x: number; y: number; label: string; color: string; dim?: boolean;
}) {
  return (
    <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: dim ? 0.3 : 1, scale: 1 }}
      transition={{ duration: 0.3 }}>
      <rect x={x} y={y} width={BLOCK_W} height={BLOCK_H} rx={4}
        fill={`${color}22`} stroke={color} strokeWidth={1.5} />
      <text x={x + BLOCK_W / 2} y={y + BLOCK_H / 2 + 3} textAnchor="middle"
        fontSize={7} fontWeight="600" fill={color}>{label}</text>
    </motion.g>
  );
}

function Label({ x, y, text }: { x: number; y: number; text: string }) {
  return <text x={x} y={y} fontSize={8} fill="hsl(var(--muted-foreground))">{text}</text>;
}

export default function PagedAttentionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 360 200" className="w-full max-w-[420px]" style={{ height: 'auto' }}>

          {/* Step 0: Traditional allocation */}
          {step === 0 && (
            <g>
              <Label x={10} y={20} text="GPU 메모리 (전통적 할당)" />
              {/* Req 1: large block mostly empty */}
              <rect x={10} y={30} width={200} height={30} rx={4} fill={`${C.alloc}22`}
                stroke={C.alloc} strokeWidth={1.5} />
              <rect x={10} y={30} width={80} height={30} rx={4} fill={`${C.alloc}44`} />
              <Label x={15} y={50} text="Req1: 사용 40%" />
              <Label x={95} y={50} text="← 낭비 60% →" />

              {/* Req 2 */}
              <rect x={10} y={70} width={200} height={30} rx={4} fill={`${C.alloc}22`}
                stroke={C.alloc} strokeWidth={1.5} />
              <rect x={10} y={70} width={120} height={30} rx={4} fill={`${C.alloc}44`} />
              <Label x={15} y={90} text="Req2: 사용 60%" />

              {/* Free space too fragmented */}
              <rect x={220} y={30} width={120} height={70} rx={4} fill="none"
                stroke={C.free} strokeWidth={1} strokeDasharray="4 3" />
              <Label x={240} y={70} text="외부 단편화" />

              {/* Waste indicator */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <rect x={10} y={120} width={100} height={22} rx={4}
                  fill="#ef444422" stroke="#ef4444" strokeWidth={1} />
                <text x={60} y={135} textAnchor="middle" fontSize={9} fontWeight="700" fill="#ef4444">
                  20-38% 낭비
                </text>
              </motion.g>
            </g>
          )}

          {/* Step 1: PagedAttention blocks */}
          {step === 1 && (
            <g>
              <Label x={10} y={16} text="Logical Blocks" />
              <Label x={200} y={16} text="Physical Blocks (GPU)" />
              {/* Logical */}
              {[0, 1, 2].map(i => (
                <Block key={`l${i}`} x={10 + i * (BLOCK_W + GAP)} y={24} label={`L${i}`} color={C.alloc} />
              ))}
              {/* Block Table arrow */}
              <motion.line x1={130} y1={36} x2={190} y2={36} stroke={C.alloc}
                strokeWidth={1.5} strokeDasharray="4 3"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
              <text x={155} y={30} fontSize={7} fill="hsl(var(--muted-foreground))">Block Table</text>
              {/* Physical (non-contiguous) */}
              <Block x={200} y={24} label="P7" color={C.alloc} />
              <Block x={260} y={60} label="P3" color={C.alloc} />
              <Block x={310} y={24} label="P12" color={C.alloc} />
              {/* Free blocks */}
              <Block x={200} y={60} label="free" color={C.free} dim />
              <Block x={240} y={24} label="free" color={C.free} dim />
              <Block x={310} y={60} label="free" color={C.free} dim />
              {/* Label */}
              <Label x={200} y={100} text="비연속 할당 → 외부 단편화 없음" />
            </g>
          )}

          {/* Step 2: Dynamic growth */}
          {step === 2 && (
            <g>
              <Label x={10} y={16} text="Decode: 토큰 생성 중" />
              {[0, 1, 2].map(i => (
                <Block key={i} x={10 + i * (BLOCK_W + GAP)} y={24} label={`B${i}`} color={C.alloc} />
              ))}
              {/* New block being allocated */}
              <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}>
                <Block x={10 + 3 * (BLOCK_W + GAP)} y={24} label="B3" color={C.shared} />
                <text x={10 + 3 * (BLOCK_W + GAP) + 18} y={60}
                  textAnchor="middle" fontSize={7} fill={C.shared}>new!</text>
              </motion.g>
              {/* Utilization bar */}
              <rect x={10} y={80} width={160} height={12} rx={3} fill={`${C.free}22`} />
              <motion.rect x={10} y={80} width={0} height={12} rx={3} fill={`${C.alloc}66`}
                animate={{ width: 154 }} transition={{ duration: 0.6 }} />
              <Label x={10} y={108} text="마지막 블록에서만 미사용 슬롯 발생 (~4%)" />
            </g>
          )}

          {/* Step 3: Copy-on-Write */}
          {step === 3 && (
            <g>
              <Label x={10} y={16} text="Copy-on-Write (Beam Search)" />
              {/* Shared prefix */}
              <Block x={10} y={30} label="B0" color={C.shared} />
              <Block x={50} y={30} label="B1" color={C.shared} />
              <text x={45} y={26} fontSize={7} fill={C.shared}>공유 접두사</text>

              {/* Seq A branch */}
              <motion.line x1={86} y1={42} x2={110} y2={70} stroke={C.alloc}
                strokeWidth={1.5} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <Block x={110} y={60} label="A2" color={C.alloc} />
              <text x={145} y={66} fontSize={7} fill={C.alloc}>Seq A</text>

              {/* Seq B branch */}
              <motion.line x1={86} y1={42} x2={110} y2={110} stroke={C.cow}
                strokeWidth={1.5} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 0.2 }} />
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <Block x={110} y={100} label="B2'" color={C.cow} />
                <text x={145} y={106} fontSize={7} fill={C.cow}>Seq B (CoW)</text>
              </motion.g>

              <Label x={10} y={140} text="B0, B1은 공유 → 분기 시에만 복사" />
            </g>
          )}

          {/* Step 4: Results */}
          {step === 4 && (
            <g>
              <Label x={10} y={20} text="메모리 효율 비교" />
              {/* Old bar */}
              <rect x={10} y={35} width={100} height={18} rx={3} fill="#ef444422" stroke="#ef4444" strokeWidth={1} />
              <text x={60} y={48} textAnchor="middle" fontSize={8} fill="#ef4444">기존: 20-38% 낭비</text>
              {/* New bar */}
              <motion.rect x={10} y={60} width={0} height={18} rx={3} fill={`${C.shared}22`} stroke={C.shared} strokeWidth={1}
                animate={{ width: 16 }} transition={{ duration: 0.5 }} />
              <motion.text x={30} y={73} fontSize={8} fill={C.shared}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                vLLM: ~4%
              </motion.text>

              {/* Throughput comparison */}
              <Label x={10} y={105} text="처리량 향상" />
              <rect x={10} y={112} width={40} height={16} rx={3} fill={`${C.free}33`} />
              <text x={30} y={124} textAnchor="middle" fontSize={7} fill={C.free}>HF 1x</text>
              <motion.rect x={55} y={112} width={0} height={16} rx={3} fill={`${C.alloc}44`}
                animate={{ width: 240 }} transition={{ duration: 0.8 }} />
              <motion.text x={175} y={124} textAnchor="middle" fontSize={8} fontWeight="700" fill={C.alloc}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                vLLM: 최대 24x
              </motion.text>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
