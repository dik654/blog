import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { C } from './SimCLRVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* Step 0: SimCLR 파이프라인 전체 흐름 */
export function Step0() {
  return (
    <g>
      {/* 원본 이미지 */}
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <DataBox x={10} y={55} w={55} h={30} label="Image x" color={C.img} />
      </motion.g>

      {/* Augmentation 분기 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.1 }}>
        <line x1={65} y1={65} x2={90} y2={45} stroke={C.img} strokeWidth={0.8} markerEnd="url(#scl-arr)" />
        <line x1={65} y1={75} x2={90} y2={95} stroke={C.img} strokeWidth={0.8} markerEnd="url(#scl-arr)" />
      </motion.g>

      {/* Aug views */}
      <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 0.15 }}>
        <ActionBox x={92} y={28} w={58} h={28} label="x_i" sub="aug t" color={C.pos} />
        <ActionBox x={92} y={82} w={58} h={28} label="x_j" sub="aug t'" color={C.pos} />
      </motion.g>

      {/* Encoder */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.25 }}>
        <line x1={150} y1={42} x2={175} y2={42} stroke={C.enc} strokeWidth={0.8} markerEnd="url(#scl-arr2)" />
        <line x1={150} y1={96} x2={175} y2={96} stroke={C.enc} strokeWidth={0.8} markerEnd="url(#scl-arr2)" />
        <ModuleBox x={178} y={22} w={70} h={38} label="ResNet-50" sub="인코더 f" color={C.enc} />
        <ModuleBox x={178} y={76} w={70} h={38} label="ResNet-50" sub="공유 가중치" color={C.enc} />
      </motion.g>

      {/* h vectors */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.35 }}>
        <line x1={248} y1={42} x2={273} y2={42} stroke={C.proj} strokeWidth={0.8} markerEnd="url(#scl-arr3)" />
        <line x1={248} y1={96} x2={273} y2={96} stroke={C.proj} strokeWidth={0.8} markerEnd="url(#scl-arr3)" />
        <DataBox x={275} y={28} w={50} h={26} label="h_i" sub="2048d" color={C.enc} />
        <DataBox x={275} y={84} w={50} h={26} label="h_j" sub="2048d" color={C.enc} />
      </motion.g>

      {/* Projection Head */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.45 }}>
        <line x1={325} y1={42} x2={348} y2={42} stroke={C.proj} strokeWidth={0.8} markerEnd="url(#scl-arr3)" />
        <line x1={325} y1={96} x2={348} y2={96} stroke={C.proj} strokeWidth={0.8} markerEnd="url(#scl-arr3)" />
        <ModuleBox x={350} y={22} w={60} h={38} label="MLP" sub="proj head" color={C.proj} />
        <ModuleBox x={350} y={76} w={60} h={38} label="MLP" sub="proj head" color={C.proj} />
      </motion.g>

      {/* z vectors → Loss */}
      <motion.g initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.55 }}>
        <line x1={410} y1={42} x2={428} y2={60} stroke={C.tau} strokeWidth={0.8} markerEnd="url(#scl-arr4)" />
        <line x1={410} y1={96} x2={428} y2={78} stroke={C.tau} strokeWidth={0.8} markerEnd="url(#scl-arr4)" />
        <rect x={430} y={52} width={45} height={32} rx={6} fill={`${C.tau}15`} stroke={C.tau} strokeWidth={1} />
        <text x={452} y={66} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.tau}>InfoNCE</text>
        <text x={452} y={78} textAnchor="middle" fontSize={7} fill={C.muted}>Loss</text>
      </motion.g>

      {/* 추론 시 제거 표시 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.65 }}>
        <rect x={345} y={125} width={130} height={18} rx={4} fill={`${C.neg}08`} stroke={C.neg} strokeWidth={0.6} strokeDasharray="3 2" />
        <text x={410} y={137} textAnchor="middle" fontSize={7} fill={C.neg}>↑ proj head: 추론 시 제거</text>
      </motion.g>

      <defs>
        <marker id="scl-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill={C.img} />
        </marker>
        <marker id="scl-arr2" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill={C.enc} />
        </marker>
        <marker id="scl-arr3" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill={C.proj} />
        </marker>
        <marker id="scl-arr4" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill={C.tau} />
        </marker>
      </defs>
    </g>
  );
}

/* Step 1: Positive / Negative pair 배치 시각화 */
export function Step1() {
  /* 6개 이미지를 나타내는 원 — 2개씩 augmentation */
  const images = [
    { cx: 80, cy: 55, label: 'x₁', c: '#6366f1' },
    { cx: 200, cy: 55, label: 'x₂', c: '#10b981' },
    { cx: 320, cy: 55, label: 'x₃', c: '#f59e0b' },
  ];

  return (
    <g>
      <motion.text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        배치 N=3 → 6개 augmented view
      </motion.text>

      {images.map((img, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: i * 0.1 }}>
          {/* 원본 이미지 표시 */}
          <circle cx={img.cx} cy={img.cy} r={20} fill={`${img.c}12`} stroke={img.c} strokeWidth={1.2} />
          <text x={img.cx} y={img.cy + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill={img.c}>{img.label}</text>

          {/* 두 augmentation */}
          <circle cx={img.cx - 25} cy={img.cy + 55} r={14} fill={`${img.c}18`} stroke={img.c} strokeWidth={0.8} />
          <text x={img.cx - 25} y={img.cy + 59} textAnchor="middle" fontSize={8} fill={img.c}>{img.label}'</text>
          <circle cx={img.cx + 25} cy={img.cy + 55} r={14} fill={`${img.c}18`} stroke={img.c} strokeWidth={0.8} />
          <text x={img.cx + 25} y={img.cy + 59} textAnchor="middle" fontSize={8} fill={img.c}>{img.label}''</text>

          <line x1={img.cx - 8} y1={img.cy + 18} x2={img.cx - 20} y2={img.cy + 40} stroke={img.c} strokeWidth={0.6} strokeDasharray="2 2" />
          <line x1={img.cx + 8} y1={img.cy + 18} x2={img.cx + 20} y2={img.cy + 40} stroke={img.c} strokeWidth={0.6} strokeDasharray="2 2" />
        </motion.g>
      ))}

      {/* Positive pair 표시 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
        <line x1={55} y1={110} x2={105} y2={110} stroke={C.pos} strokeWidth={1.5} />
        <text x={80} y={125} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.pos}>positive pair</text>
      </motion.g>

      {/* Negative 표시 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <line x1={105} y1={110} x2={175} y2={110} stroke={C.neg} strokeWidth={1} strokeDasharray="3 2" />
        <line x1={105} y1={110} x2={295} y2={110} stroke={C.neg} strokeWidth={0.6} strokeDasharray="3 2" opacity={0.5} />
        <text x={240} y={152} textAnchor="middle" fontSize={8} fill={C.neg}>다른 이미지의 모든 view = negative (2(N-1)개)</text>
      </motion.g>

      {/* 범례 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <rect x={370} y={50} width={95} height={50} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <line x1={378} y1={65} x2={398} y2={65} stroke={C.pos} strokeWidth={1.5} />
        <text x={405} y={68} fontSize={7} fill={C.pos}>positive (1쌍)</text>
        <line x1={378} y1={82} x2={398} y2={82} stroke={C.neg} strokeWidth={1} strokeDasharray="3 2" />
        <text x={405} y={85} fontSize={7} fill={C.neg}>negative (4개)</text>
      </motion.g>
    </g>
  );
}

/* Step 2: InfoNCE Loss 시각화 */
export function Step2() {
  return (
    <g>
      {/* 분자: positive pair similarity */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
        <rect x={60} y={20} width={360} height={40} rx={8} fill={`${C.pos}08`} stroke={C.pos} strokeWidth={1} />
        <text x={240} y={37} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.pos}>
          분자: exp( sim(z_i, z_j) / τ )
        </text>
        <text x={240} y={52} textAnchor="middle" fontSize={8} fill={C.muted}>
          positive pair의 cosine similarity → τ로 스케일
        </text>
      </motion.g>

      {/* 분모: 모든 pair */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.2 }}>
        <rect x={60} y={72} width={360} height={40} rx={8} fill={`${C.neg}08`} stroke={C.neg} strokeWidth={1} />
        <text x={240} y={89} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.neg}>
          분모: Σ_k≠i exp( sim(z_i, z_k) / τ )
        </text>
        <text x={240} y={104} textAnchor="middle" fontSize={8} fill={C.muted}>
          positive + 모든 negative의 similarity 합
        </text>
      </motion.g>

      {/* Temperature 효과 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
        <text x={240} y={135} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.tau}>τ (temperature) 효과</text>

        {/* τ = 0.5 vs 0.1 비교 바 */}
        <rect x={80} y={145} width={140} height={24} rx={6} fill={`${C.tau}10`} stroke={C.tau} strokeWidth={0.8} />
        <text x={150} y={161} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.tau}>τ = 0.5</text>

        <rect x={260} y={145} width={140} height={24} rx={6} fill={`${C.tau}20`} stroke={C.tau} strokeWidth={1.2} />
        <text x={330} y={161} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.tau}>τ = 0.1 ✓</text>

        <text x={150} y={182} textAnchor="middle" fontSize={7} fill={C.muted}>부드러운 분포</text>
        <text x={330} y={182} textAnchor="middle" fontSize={7} fill={C.tau}>날카로운 분포 → hard neg 집중</text>
      </motion.g>
    </g>
  );
}

/* Step 3: 배치 크기별 성능 비교 바 차트 */
export function Step3() {
  const bars = [
    { n: '256', neg: '510', acc: 64.6, w: 130 },
    { n: '4096', neg: '8190', acc: 74.2, w: 150 },
    { n: '8192', neg: '16382', acc: 76.5, w: 155 },
  ];

  return (
    <g>
      <motion.text x={240} y={22} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        ImageNet Linear Eval — 배치 크기별 정확도
      </motion.text>

      {bars.map((b, i) => {
        const y = 42 + i * 48;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.15 }}>
            {/* 라벨 */}
            <text x={75} y={y + 14} textAnchor="end" fontSize={9} fontWeight={600} fill={C.enc}>N={b.n}</text>
            <text x={75} y={y + 26} textAnchor="end" fontSize={7} fill={C.muted}>neg {b.neg}</text>

            {/* 바 */}
            <motion.rect x={85} y={y + 4} rx={4} height={20} fill={`${C.enc}20`} stroke={C.enc} strokeWidth={0.8}
              initial={{ width: 0 }} animate={{ width: b.w * 2 }} transition={{ ...sp, delay: 0.3 + i * 0.15 }} />

            {/* 수치 */}
            <motion.text x={90 + b.w * 2} y={y + 18} fontSize={10} fontWeight={700} fill={C.enc}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 + i * 0.15 }}>
              {b.acc}%
            </motion.text>
          </motion.g>
        );
      })}

      {/* MoCo 대안 표시 */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.7 }}>
        <rect x={100} y={188} width={280} height={22} rx={6} fill={`${C.proj}08`} stroke={C.proj} strokeWidth={0.8} strokeDasharray="4 2" />
        <text x={240} y={203} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.proj}>
          MoCo: N=256으로도 65536 negative 유지 (momentum queue)
        </text>
      </motion.g>
    </g>
  );
}
