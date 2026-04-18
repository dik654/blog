import { motion } from 'framer-motion';
import { C } from './DLAccelVizData';
import { ModuleBox, DataBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/** Step 0: CPU vs GPU architecture */
export function CpuVsGpuStep() {
  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.fg}>
        CPU vs GPU 아키텍처
      </text>

      {/* CPU side */}
      <motion.g initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <rect x={15} y={28} width={190} height={90} rx={6}
          fill="var(--background)" stroke={C.cpu} strokeWidth={1} />
        <text x={110} y={44} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.cpu}>
          CPU (Xeon)
        </text>

        {/* Big cores */}
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x={28 + (i % 4) * 42} y={52 + Math.floor(i / 4) * 28}
            width={35} height={22} rx={3} fill={`${C.cpu}20`} stroke={C.cpu} strokeWidth={0.6} />
        ))}
        <text x={110} y={110} textAnchor="middle" fontSize={8} fill={C.muted}>
          4~128 복잡 코어 / 순차 최적화
        </text>
      </motion.g>

      {/* GPU side */}
      <motion.g initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.25 }}>
        <rect x={255} y={28} width={210} height={90} rx={6}
          fill={`${C.gpu}08`} stroke={C.gpu} strokeWidth={1.2} />
        <text x={360} y={44} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.gpu}>
          GPU (H100)
        </text>

        {/* Many small cores */}
        {Array.from({ length: 60 }).map((_, i) => (
          <rect key={i} x={265 + (i % 12) * 16} y={50 + Math.floor(i / 12) * 12}
            width={12} height={8} rx={1} fill={`${C.gpu}30`} stroke={C.gpu} strokeWidth={0.3} />
        ))}
        <text x={360} y={110} textAnchor="middle" fontSize={8} fill={C.gpu}>
          16,896 코어 / 병렬 최적화
        </text>
      </motion.g>

      {/* Performance comparison */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.55 }}>
        <text x={150} y={138} textAnchor="middle" fontSize={8} fill={C.cpu}>FP32: 1x</text>
        <text x={310} y={138} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.gpu}>
          FP32: 10-50x / FP16: 100x+ / INT8: 200x+
        </text>
      </motion.g>

      {/* Arrow between */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
        <line x1={210} y1={73} x2={250} y2={73} stroke={C.fg} strokeWidth={1}
          markerEnd="url(#accel-arr)" />
      </motion.g>

      <defs>
        <marker id="accel-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C.fg} />
        </marker>
      </defs>
    </g>
  );
}

/** Step 1: Mixed Precision Training */
export function MixedPrecisionStep() {
  const formats = [
    { label: 'FP32', bits: '32-bit', range: '~1e38', prec: '~7 digits', w: 120, color: C.fp32, x: 10 },
    { label: 'FP16', bits: '16-bit', range: '~65504', prec: '~3 digits', w: 120, color: C.fp16, x: 165 },
    { label: 'BF16', bits: '16-bit', range: '~1e38', prec: '~2 digits', w: 120, color: C.fp16, x: 320 },
  ];

  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.fg}>
        Mixed Precision Training
      </text>

      {/* Format comparison */}
      {formats.map((f, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: i * 0.15 }}>
          <rect x={f.x} y={28} width={f.w} height={55} rx={5}
            fill="var(--background)" stroke={f.color} strokeWidth={1} />
          <text x={f.x + 60} y={44} textAnchor="middle" fontSize={10} fontWeight={700} fill={f.color}>
            {f.label}
          </text>
          <text x={f.x + 60} y={58} textAnchor="middle" fontSize={8} fill={C.muted}>
            {f.bits} / {f.prec}
          </text>
          <text x={f.x + 60} y={72} textAnchor="middle" fontSize={8} fill={C.muted}>
            range: {f.range}
          </text>
        </motion.g>
      ))}

      {/* Pipeline flow */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.5 }}>
        <text x={240} y={100} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.fg}>
          학습 파이프라인
        </text>

        {[
          { label: 'Forward', sub: 'FP16', color: C.fp16, x: 20 },
          { label: 'Loss Scale', sub: 'underflow 방지', color: C.fp32, x: 130 },
          { label: 'Gradient', sub: 'FP16', color: C.fp16, x: 250 },
          { label: 'Weight', sub: 'FP32 유지', color: C.fp32, x: 365 },
        ].map((s, i) => (
          <g key={i}>
            <rect x={s.x} y={108} width={95} height={30} rx={4}
              fill={`${s.color}12`} stroke={s.color} strokeWidth={0.8} />
            <text x={s.x + 47} y={122} textAnchor="middle" fontSize={9} fontWeight={600}
              fill={s.color}>{s.label}</text>
            <text x={s.x + 47} y={134} textAnchor="middle" fontSize={7.5} fill={C.muted}>
              {s.sub}
            </text>
            {i < 3 && (
              <line x1={s.x + 97} y1={123} x2={s.x + 128} y2={123}
                stroke={C.fg} strokeWidth={0.6} markerEnd="url(#mp-arr)" />
            )}
          </g>
        ))}
      </motion.g>

      {/* Results */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.8 }}>
        <text x={240} y={152} textAnchor="middle" fontSize={8} fill={C.muted}>
          메모리 40-50% 절감 / 속도 1.5-3x / 정확도 거의 동일
        </text>
      </motion.g>

      <defs>
        <marker id="mp-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill={C.fg} />
        </marker>
      </defs>
    </g>
  );
}

/** Step 2: Distributed Training */
export function DistributedStep() {
  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.fg}>
        분산 학습 전략
      </text>

      {/* Data Parallel */}
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <rect x={10} y={30} width={140} height={60} rx={5}
          fill="var(--background)" stroke={C.dist} strokeWidth={1} />
        <rect x={10} y={30} width={140} height={5} rx={3} fill={C.dist} opacity={0.7} />
        <text x={80} y={50} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.dist}>
          Data Parallel
        </text>
        {/* GPU copies */}
        {[0, 1, 2].map(i => (
          <g key={i}>
            <rect x={22 + i * 42} y={58} width={35} height={22} rx={3}
              fill={`${C.gpu}15`} stroke={C.gpu} strokeWidth={0.6} />
            <text x={39 + i * 42} y={73} textAnchor="middle" fontSize={7} fill={C.gpu}>
              GPU{i}
            </text>
          </g>
        ))}
      </motion.g>

      {/* Model Parallel */}
      <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.2 }}>
        <rect x={170} y={30} width={140} height={60} rx={5}
          fill="var(--background)" stroke={C.gpu} strokeWidth={1} />
        <rect x={170} y={30} width={140} height={5} rx={3} fill={C.gpu} opacity={0.7} />
        <text x={240} y={50} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.gpu}>
          Model Parallel
        </text>
        {/* Split layers */}
        {['Tensor', 'Pipeline'].map((l, i) => (
          <g key={i}>
            <rect x={180 + i * 65} y={58} width={55} height={22} rx={3}
              fill={`${C.gpu}15`} stroke={C.gpu} strokeWidth={0.6} />
            <text x={207 + i * 65} y={73} textAnchor="middle" fontSize={7.5} fill={C.gpu}>
              {l}
            </text>
          </g>
        ))}
      </motion.g>

      {/* ZeRO */}
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.4 }}>
        <rect x={330} y={30} width={140} height={60} rx={5}
          fill={`${C.dist}08`} stroke={C.dist} strokeWidth={1.2} />
        <rect x={330} y={30} width={140} height={5} rx={3} fill={C.dist} opacity={0.7} />
        <text x={400} y={50} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.dist}>
          ZeRO (DeepSpeed)
        </text>
        {['Stage1', 'Stage2', 'Stage3'].map((s, i) => (
          <g key={i}>
            <rect x={340 + i * 42} y={58} width={35} height={22} rx={3}
              fill={`${C.dist}15`} stroke={C.dist} strokeWidth={0.6} />
            <text x={357 + i * 42} y={73} textAnchor="middle" fontSize={7} fill={C.dist}>
              {s}
            </text>
          </g>
        ))}
      </motion.g>

      {/* Example */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.65 }}>
        <rect x={60} y={105} width={360} height={40} rx={5}
          fill="var(--background)" stroke={C.fg} strokeWidth={0.5} strokeDasharray="4 2" />
        <text x={240} y={120} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.fg}>
          LLaMA-70B 훈련 구성
        </text>
        <text x={240} y={136} textAnchor="middle" fontSize={8} fill={C.muted}>
          512 GPU / Tensor x8 / Pipeline x4 / Data x16 / ~21일
        </text>
      </motion.g>
    </g>
  );
}

/** Step 3: Flash Attention */
export function FlashAttentionStep() {
  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.fg}>
        Flash Attention (Tri Dao, 2022)
      </text>

      {/* Standard attention */}
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <AlertBox x={15} y={28} w={200} h={55}
          label="Standard Attention" sub="O(n^2) memory" color={C.flash} />

        {/* N^2 matrix visualization */}
        <rect x={40} y={90} width={50} height={50} rx={2}
          fill={`${C.flash}15`} stroke={C.flash} strokeWidth={0.6} />
        <text x={65} y={120} textAnchor="middle" fontSize={8} fill={C.flash}>QK^T</text>
        <text x={65} y={150} textAnchor="middle" fontSize={7.5} fill={C.muted}>
          n=16K: 512MB
        </text>
      </motion.g>

      {/* Flash attention */}
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.25 }}>
        <rect x={255} y={28} width={210} height={55} rx={6}
          fill={`${C.gpu}10`} stroke={C.gpu} strokeWidth={1.2} />
        <text x={360} y={48} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.gpu}>
          Flash Attention
        </text>
        <text x={360} y={64} textAnchor="middle" fontSize={9} fill={C.gpu}>
          O(n) memory
        </text>

        {/* Tile-wise blocks */}
        {[0, 1, 2, 3].map(i => (
          <motion.rect key={i} x={275 + i * 45} y={92} width={35} height={25} rx={3}
            fill={`${C.gpu}20`} stroke={C.gpu} strokeWidth={0.6}
            initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: 0.4 + i * 0.1 }} />
        ))}
        <text x={360} y={130} textAnchor="middle" fontSize={8} fill={C.gpu}>
          타일 단위 계산
        </text>
      </motion.g>

      {/* Arrow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        <line x1={218} y1={55} x2={252} y2={55} stroke={C.fg} strokeWidth={1}
          markerEnd="url(#fa-arr)" />
      </motion.g>

      {/* Results */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.8 }}>
        <text x={240} y={152} textAnchor="middle" fontSize={8} fill={C.muted}>
          2-4x 빠른 attention / 5-20x 적은 메모리 / 모든 LLM 표준
        </text>
      </motion.g>

      <defs>
        <marker id="fa-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C.fg} />
        </marker>
      </defs>
    </g>
  );
}

/** Step 4: Other optimizations */
export function OptimizationsStep() {
  const opts = [
    { label: 'Kernel Fusion', desc: '여러 연산 하나로', color: C.opt, x: 10, y: 35 },
    { label: 'Grad Checkpoint', desc: '메모리-시간 교환', color: C.opt, x: 170, y: 35 },
    { label: 'ZeRO-Offload', desc: 'CPU/NVMe 활용', color: C.opt, x: 330, y: 35 },
    { label: 'Paged Attention', desc: 'vLLM 추론 최적화', color: C.gpu, x: 10, y: 90 },
    { label: 'Continuous Batch', desc: '동적 배치 처리', color: C.gpu, x: 170, y: 90 },
    { label: 'Speculative Dec', desc: '작은 모델이 초안', color: C.gpu, x: 330, y: 90 },
  ];

  return (
    <g>
      <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.fg}>
        추가 최적화 기법
      </text>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0 }}>
        <text x={240} y={30} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.opt}>
          학습 최적화
        </text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.35 }}>
        <text x={240} y={85} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.gpu}>
          추론 최적화
        </text>
      </motion.g>

      {opts.map((o, i) => (
        <motion.g key={i} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ ...sp, delay: 0.1 + i * 0.1 }}>
          <rect x={o.x} y={o.y} width={140} height={38} rx={5}
            fill="var(--background)" stroke={o.color} strokeWidth={0.8} />
          <rect x={o.x} y={o.y} width={3.5} height={38} rx={2} fill={o.color} />
          <text x={o.x + 75} y={o.y + 16} textAnchor="middle" fontSize={9} fontWeight={600}
            fill={C.fg}>{o.label}</text>
          <text x={o.x + 75} y={o.y + 30} textAnchor="middle" fontSize={8} fill={C.muted}>
            {o.desc}
          </text>
        </motion.g>
      ))}

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.8 }}>
        <text x={240} y={148} textAnchor="middle" fontSize={8} fill={C.muted}>
          PyTorch 2.0+: torch.compile + scaled_dot_product_attention 내장
        </text>
      </motion.g>
    </g>
  );
}
