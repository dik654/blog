import { motion } from 'framer-motion';
import { C } from './DLOverviewVizData';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/** Step 0: Classic ML pipeline */
export function ClassicMLStep() {
  return (
    <g>
      {/* Title */}
      <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.fg}>
        Classic ML Pipeline
      </text>

      {/* Raw Image */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <DataBox x={10} y={35} w={70} h={32} label="Raw Image" color={C.ml} />
      </motion.g>

      {/* Arrow 1 */}
      <motion.line x1={80} y1={51} x2={110} y2={51} stroke={C.ml} strokeWidth={1}
        markerEnd="url(#dlo-arr)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.15, duration: 0.3 }} />

      {/* Feature Engineering (manual) */}
      <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.2 }}>
        <ActionBox x={112} y={32} w={90} h={38} label="SIFT / HOG" sub="수작업 설계" color={C.ml} />
      </motion.g>

      {/* Arrow 2 */}
      <motion.line x1={202} y1={51} x2={232} y2={51} stroke={C.ml} strokeWidth={1}
        markerEnd="url(#dlo-arr)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.35, duration: 0.3 }} />

      {/* Feature Vector */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
        <DataBox x={234} y={35} w={80} h={32} label="Feature Vec" color={C.ml} />
      </motion.g>

      {/* Arrow 3 */}
      <motion.line x1={314} y1={51} x2={344} y2={51} stroke={C.ml} strokeWidth={1}
        markerEnd="url(#dlo-arr)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }} />

      {/* Classifier */}
      <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.55 }}>
        <ModuleBox x={346} y={27} w={80} h={48} label="SVM" sub="분류기" color={C.ml} />
      </motion.g>

      {/* Bottleneck callout */}
      <motion.g initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.7 }}>
        <line x1={157} y1={73} x2={157} y2={100} stroke={C.ml} strokeWidth={0.8} strokeDasharray="3 2" />
        <rect x={100} y={100} width={120} height={22} rx={4}
          fill="var(--background)" stroke={C.ml} strokeWidth={0.8} strokeDasharray="3 2" />
        <text x={160} y={115} textAnchor="middle" fontSize={9} fill={C.ml} fontWeight={600}>
          사람이 직접 설계 필요
        </text>
      </motion.g>

      {/* Key differences list */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.85 }}>
        <text x={20} y={145} fontSize={8} fill={C.muted}>SVM, Random Forest, XGBoost</text>
        <text x={240} y={145} fontSize={8} fill={C.muted}>구조화 데이터에 강함 / 해석 가능성 높음</text>
      </motion.g>

      <defs>
        <marker id="dlo-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C.ml} />
        </marker>
      </defs>
    </g>
  );
}

/** Step 1: Deep Learning end-to-end */
export function DeepLearningStep() {
  const layers = [
    { label: 'L1: 엣지', y: 35 },
    { label: 'L2: 텍스처', y: 60 },
    { label: 'L3: 부분', y: 85 },
    { label: 'L4: 물체', y: 110 },
  ];

  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.fg}>
        Deep Learning Pipeline (end-to-end)
      </text>

      {/* Raw Image */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <DataBox x={10} y={55} w={70} h={32} label="Raw Image" color={C.dl} />
      </motion.g>

      {/* Arrow to CNN */}
      <motion.line x1={80} y1={71} x2={120} y2={71} stroke={C.dl} strokeWidth={1}
        markerEnd="url(#dlo-arr2)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.15, duration: 0.3 }} />

      {/* CNN layers stack */}
      {layers.map((l, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp, delay: 0.2 + i * 0.12 }}>
          <rect x={125} y={l.y} width={130} height={20} rx={4}
            fill={`${C.dl}${(10 + i * 5).toString(16)}`} stroke={C.dl} strokeWidth={0.8} />
          <text x={190} y={l.y + 14} textAnchor="middle" fontSize={9} fill={C.dl} fontWeight={600}>
            {l.label}
          </text>
        </motion.g>
      ))}

      {/* CNN label */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
        <text x={190} y={145} textAnchor="middle" fontSize={8} fill={C.muted}>CNN (자동 학습)</text>
      </motion.g>

      {/* Arrow to classification */}
      <motion.line x1={255} y1={71} x2={300} y2={71} stroke={C.dl} strokeWidth={1}
        markerEnd="url(#dlo-arr2)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.7, duration: 0.3 }} />

      {/* Classification output */}
      <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.8 }}>
        <ModuleBox x={305} y={47} w={90} h={48} label="Classification" sub="자동 특징 학습" color={C.dl} />
      </motion.g>

      {/* Key callout */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.95 }}>
        <rect x={310} y={108} width={140} height={18} rx={4}
          fill="var(--background)" stroke={C.dl} strokeWidth={0.8} />
        <text x={380} y={120} textAnchor="middle" fontSize={8} fill={C.dl} fontWeight={600}>
          Feature가 자동 학습됨
        </text>
      </motion.g>

      <defs>
        <marker id="dlo-arr2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C.dl} />
        </marker>
      </defs>
    </g>
  );
}

/** Step 2: Depth Separation Theorems */
export function DepthSeparationStep() {
  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.fg}>
        Depth Separation Theorems
      </text>

      {/* Shallow NN box */}
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <rect x={20} y={30} width={190} height={55} rx={6}
          fill="var(--background)" stroke={C.math} strokeWidth={1} />
        <text x={115} y={48} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.math}>
          얕은 NN (2-layer)
        </text>
        <text x={115} y={64} textAnchor="middle" fontSize={9} fill={C.muted}>
          exp(d) 뉴런 필요
        </text>
        <text x={115} y={78} textAnchor="middle" fontSize={8} fill={C.muted}>
          (k-1)층: 2^k 뉴런
        </text>
      </motion.g>

      {/* Deep NN box */}
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.2 }}>
        <rect x={260} y={30} width={190} height={55} rx={6}
          fill={`${C.dl}10`} stroke={C.dl} strokeWidth={1.2} />
        <text x={355} y={48} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.dl}>
          깊은 NN (3+ layers)
        </text>
        <text x={355} y={64} textAnchor="middle" fontSize={9} fill={C.dl}>
          poly(d) 뉴런으로 충분
        </text>
        <text x={355} y={78} textAnchor="middle" fontSize={8} fill={C.dl}>
          k층: O(k) 뉴런
        </text>
      </motion.g>

      {/* VS divider */}
      <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.35 }}>
        <circle cx={235} cy={57} r={14} fill={C.math} />
        <text x={235} y={61} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ffffff">
          vs
        </text>
      </motion.g>

      {/* Intuition */}
      <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.5 }}>
        <rect x={60} y={100} width={160} height={40} rx={5}
          fill="var(--background)" stroke={C.math} strokeWidth={0.8} strokeDasharray="4 2" />
        <text x={140} y={117} textAnchor="middle" fontSize={9} fill={C.math} fontWeight={600}>
          너비 = 함수 조합 (sum)
        </text>
        <text x={140} y={131} textAnchor="middle" fontSize={8} fill={C.muted}>
          w_i * f_i(x)
        </text>
      </motion.g>

      <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.65 }}>
        <rect x={260} y={100} width={160} height={40} rx={5}
          fill={`${C.dl}10`} stroke={C.dl} strokeWidth={0.8} />
        <text x={340} y={117} textAnchor="middle" fontSize={9} fill={C.dl} fontWeight={600}>
          깊이 = 함수 합성 (comp)
        </text>
        <text x={340} y={131} textAnchor="middle" fontSize={8} fill={C.dl}>
          f(g(h(x)))
        </text>
      </motion.g>
    </g>
  );
}

/** Step 3: ImageNet accuracy progression */
export function ImageNetProgressStep() {
  const models = [
    { name: 'AlexNet', layers: 8, acc: 84.7, year: '2012' },
    { name: 'VGG', layers: 16, acc: 92.7, year: '2014' },
    { name: 'ResNet', layers: 152, acc: 96.4, year: '2015' },
    { name: 'EfficientNet', layers: 0, acc: 97.9, year: '2019' },
  ];
  const barMaxW = 200;

  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.fg}>
        ImageNet Top-5 정확도 추이
      </text>

      {models.map((m, i) => {
        const y = 36 + i * 30;
        const barW = (m.acc / 100) * barMaxW;
        const color = i === 3 ? C.perf : C.dl;

        return (
          <motion.g key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.15 }}>
            {/* Model label */}
            <text x={100} y={y + 15} textAnchor="end" fontSize={9} fontWeight={600} fill={C.fg}>
              {m.name}
            </text>
            <text x={100} y={y + 26} textAnchor="end" fontSize={7.5} fill={C.muted}>
              {m.layers > 0 ? `${m.layers}층` : 'NAS'} ({m.year})
            </text>

            {/* Bar background */}
            <rect x={110} y={y + 5} width={barMaxW} height={16} rx={3}
              fill="var(--border)" opacity={0.2} />

            {/* Bar fill */}
            <motion.rect x={110} y={y + 5} width={barW} height={16} rx={3}
              fill={color} opacity={0.7}
              initial={{ width: 0 }} animate={{ width: barW }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }} />

            {/* Accuracy label */}
            <text x={115 + barW} y={y + 17} fontSize={9} fontWeight={700} fill={color}>
              {m.acc}%
            </text>
          </motion.g>
        );
      })}

      {/* Trend arrow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.8 }}>
        <line x1={420} y1={50} x2={420} y2={140} stroke={C.dl} strokeWidth={1.2}
          markerEnd="url(#dlo-trend)" />
        <text x={440} y={100} fontSize={8} fill={C.dl} fontWeight={600}>
          깊이+설계
        </text>
      </motion.g>

      <defs>
        <marker id="dlo-trend" markerWidth="6" markerHeight="6" refX="3" refY="5" orient="auto">
          <path d="M0,0 L6,0 L3,6 Z" fill={C.dl} />
        </marker>
      </defs>
    </g>
  );
}
