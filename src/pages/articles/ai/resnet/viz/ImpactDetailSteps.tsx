import { motion } from 'framer-motion';
import { C } from './ImpactDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

/* ---- Step 0: 학계 영향력 ---- */
export function AcademicImpact() {
  const wins = ['Classification', 'Detection', 'Localization', 'COCO Det', 'COCO Seg'];
  const successors = [
    { name: 'DenseNet', year: '2017', color: C.perf },
    { name: 'ResNeXt', year: '2017', color: C.perf },
    { name: 'SENet', year: '2017', color: C.perf },
    { name: 'EfficientNet', year: '2019', color: C.smooth },
    { name: 'Transformer', year: '2017', color: C.award },
  ];

  return (
    <g>
      {/* Title & citation */}
      <rect x={10} y={4} width={460} height={26} rx={7}
        fill={C.award} fillOpacity={0.08} stroke={C.award} strokeWidth={1} />
      <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={700}
        fill={C.award}>He et al. CVPR 2016 — 인용 200,000+ (CV 역대 1위)</text>

      {/* ILSVRC wins */}
      <text x={20} y={48} fontSize={9} fontWeight={700} fill="var(--foreground)">
        ILSVRC 2015 1위 독식
      </text>
      {wins.map((w, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ ...sp, delay: i * 0.06 }}>
          <rect x={10 + i * 92} y={54} width={84} height={20} rx={10}
            fill={C.perf} fillOpacity={0.1} stroke={C.perf} strokeWidth={0.6} />
          <text x={52 + i * 92} y={68} textAnchor="middle" fontSize={8}
            fontWeight={600} fill={C.perf}>{w}</text>
        </motion.g>
      ))}

      {/* Key metric */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}>
        <rect x={10} y={82} width={180} height={28} rx={6}
          fill={C.perf} fillOpacity={0.06} stroke={C.perf} strokeWidth={0.8} />
        <text x={100} y={100} textAnchor="middle" fontSize={11} fontWeight={700}
          fill={C.perf}>Top-5 error: 3.57%</text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}>
        <rect x={200} y={82} width={120} height={28} rx={6}
          fill={C.plain} fillOpacity={0.06} stroke={C.plain} strokeWidth={0.6} />
        <text x={260} y={100} textAnchor="middle" fontSize={9} fill={C.plain}>
          인간: 5.1% 첫 돌파
        </text>
      </motion.g>

      {/* Successors */}
      <text x={20} y={126} fontSize={9} fontWeight={700} fill="var(--foreground)">
        후속 영향
      </text>
      {successors.map((s, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp, delay: 0.5 + i * 0.06 }}>
          <rect x={10 + i * 94} y={132} width={86} height={22} rx={6}
            fill={`${s.color}08`} stroke={s.color} strokeWidth={0.6} />
          <text x={53 + i * 94} y={146} textAnchor="middle" fontSize={8}
            fontWeight={600} fill={s.color}>{s.name}</text>
          <text x={53 + i * 94} y={152} textAnchor="middle" fontSize={7}
            fill={C.dim}>{s.year}</text>
        </motion.g>
      ))}
    </g>
  );
}

/* ---- Step 1: Loss Landscape ---- */
export function LossLandscape() {
  /* rough terrain path (plain) */
  const plainPath = 'M30,100 Q50,40 70,90 Q80,30 100,80 Q110,50 130,70 Q140,20 160,60 Q175,85 190,50 Q200,70 210,60';
  /* smooth terrain path (resnet) */
  const smoothPath = 'M280,85 Q320,40 360,60 Q400,80 440,50 Q460,45 470,50';

  const benefits = [
    '초기화 덜 민감',
    '학습률 자유',
    '배치 확장 가능',
    'Fine-tuning 수월',
  ];

  return (
    <g>
      {/* Plain landscape */}
      <text x={120} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
        fill={C.plain}>Plain Network</text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp }}>
        <rect x={10} y={20} width={220} height={95} rx={6}
          fill={C.plain} fillOpacity={0.04} stroke={C.plain} strokeWidth={0.6} />
        <motion.path d={plainPath} fill="none"
          stroke={C.plain} strokeWidth={2}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1 }} />
        {/* local minima dots */}
        {[70, 130, 190].map((x, i) => (
          <circle key={i} cx={x} cy={90 - i * 10} r={3}
            fill={C.plain} fillOpacity={0.6} />
        ))}
        <text x={120} y={108} textAnchor="middle" fontSize={8} fill={C.plain}>
          거친 지형, 여러 지역 최솟값
        </text>
      </motion.g>

      {/* ResNet landscape */}
      <text x={380} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
        fill={C.smooth}>ResNet</text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.3 }}>
        <rect x={260} y={20} width={210} height={95} rx={6}
          fill={C.smooth} fillOpacity={0.04} stroke={C.smooth} strokeWidth={0.6} />
        <motion.path d={smoothPath} fill="none"
          stroke={C.smooth} strokeWidth={2}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.3 }} />
        {/* single basin */}
        <circle cx={440} cy={50} r={4} fill={C.perf} />
        <text x={380} y={108} textAnchor="middle" fontSize={8} fill={C.smooth}>
          매끄러운 지형, 하나의 basin
        </text>
      </motion.g>

      {/* Benefits */}
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.6 }}>
        <text x={20} y={132} fontSize={9} fontWeight={700} fill="var(--foreground)">
          실무 의의
        </text>
        {benefits.map((b, i) => (
          <g key={i}>
            <rect x={10 + i * 118} y={136} width={110} height={18} rx={9}
              fill={C.smooth} fillOpacity={0.08} stroke={C.smooth} strokeWidth={0.5} />
            <text x={65 + i * 118} y={148} textAnchor="middle" fontSize={8}
              fill={C.smooth}>{b}</text>
          </g>
        ))}
      </motion.g>
    </g>
  );
}
