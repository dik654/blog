import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './DropEmbedVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

export function InvertedDropoutStep() {
  const xVals = [0.8, 1.2, 0.5, 0.9, 1.1, 0.3, 0.7, 1.0];
  const mask =  [1,   0,   1,   1,   0,   1,   0,   1  ];
  const cw = 48, startX = 52;
  return (
    <g>
      <text x={12} y={12} fontSize={8} fontWeight={600} fill="var(--muted-foreground)">
        Inverted Dropout: p=0.5, scale=1/(1-p)=2.0
      </text>

      {/* x row */}
      <text x={12} y={30} fontSize={8} fill={CA}>x</text>
      {xVals.map((v, i) => (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ ...sp, delay: i * 0.03 }}>
          <rect x={startX + i * cw} y={20} width={40} height={18} rx={3}
            fill={`${CA}15`} stroke={CA} strokeWidth={0.6} />
          <text x={startX + i * cw + 20} y={32} textAnchor="middle"
            fontSize={8} fill={CA}>{v}</text>
        </motion.g>
      ))}

      {/* mask row */}
      <text x={12} y={55} fontSize={8} fill={CE}>mask</text>
      {mask.map((m, i) => (
        <motion.g key={`m${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ ...sp, delay: 0.15 + i * 0.03 }}>
          <rect x={startX + i * cw} y={44} width={40} height={18} rx={3}
            fill={m ? `${CE}20` : '#ff000015'}
            stroke={m ? CE : '#dd3333'} strokeWidth={0.6} />
          <text x={startX + i * cw + 20} y={56} textAnchor="middle"
            fontSize={8} fontWeight={600} fill={m ? CE : '#dd3333'}>
            {m ? '1' : '0'}
          </text>
        </motion.g>
      ))}

      {/* output row */}
      <motion.text x={240} y={76} textAnchor="middle" fontSize={8} fontWeight={600} fill={CV}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
        out = x * mask * 2.0
      </motion.text>
      <text x={12} y={93} fontSize={8} fontWeight={600} fill={CV}>out</text>
      {xVals.map((v, i) => {
        const out = (v * mask[i] * 2).toFixed(1);
        const active = mask[i] === 1;
        return (
          <motion.g key={`o${i}`} initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: 0.4 + i * 0.04 }}>
            <rect x={startX + i * cw} y={82} width={40} height={18} rx={3}
              fill={active ? `${CV}15` : '#88888810'}
              stroke={active ? CV : '#888888'} strokeWidth={0.8} />
            <text x={startX + i * cw + 20} y={94} textAnchor="middle"
              fontSize={8} fontWeight={600}
              fill={active ? CV : '#888888'}>{out}</text>
          </motion.g>
        );
      })}

      {/* notes */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.6 }}>
        <VizBox x={12} y={110} w={185} h={22}
          label="backward: gy * mask" sub="mask 재사용 (RefCell 캐시)" c={CV} delay={0.65} />
        <VizBox x={220} y={110} w={185} h={22}
          label="추론 시: x.clone()" sub="mask 없이 그대로 통과" c={CE} delay={0.7} />
      </motion.g>

      <motion.text x={12} y={152} fontSize={7} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}>
        학습 시 scale 적용 → 추론 시 별도 보정 불필요
      </motion.text>
    </g>
  );
}

export function TrainingGuardStep() {
  return (
    <g>
      {/* TRAINING flag */}
      <VizBox x={20} y={10} w={150} h={30}
        label="TRAINING: Cell<bool>" sub="thread_local (스레드 안전)" c={CA} />
      <motion.line x1={95} y1={40} x2={95} y2={52}
        stroke={CA} strokeWidth={0.8} strokeDasharray="3 2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.12 }} />

      {/* test_mode call */}
      <VizBox x={20} y={52} w={150} h={30}
        label="test_mode() 호출" sub="TRAINING = false" c={CV} delay={0.15} />
      <motion.line x1={95} y1={82} x2={95} y2={94}
        stroke={CV} strokeWidth={0.8} strokeDasharray="3 2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.28 }} />

      {/* Drop trait */}
      <VizBox x={20} y={94} w={150} h={30}
        label="Drop::drop()" sub="TRAINING = prev (자동 복원)" c={CE} delay={0.3} />

      {/* behavior branches */}
      <VizBox x={230} y={18} w={170} h={34}
        label="dropout(): TRAINING=true" sub="DropoutFn 생성 + mask 계산" c={CA} delay={0.4} />
      <VizBox x={230} y={68} w={170} h={34}
        label="dropout(): TRAINING=false" sub="x.clone() -- 연산 0" c={CV} delay={0.5} />

      {/* connecting lines */}
      <motion.line x1={170} y1={25} x2={230} y2={35}
        stroke={CA} strokeWidth={0.7}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35 }} />
      <motion.line x1={170} y1={67} x2={230} y2={85}
        stroke={CV} strokeWidth={0.7}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.45 }} />

      {/* RAII pattern note */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.6 }}>
        <rect x={230} y={114} width={170} height={26} rx={4}
          fill={`${CE}08`} stroke={CE} strokeWidth={0.5} strokeDasharray="4 2" />
        <text x={240} y={128} fontSize={7} fill={CE}>
          RAII guard: 스코프 종료 시 자동 복원
        </text>
        <text x={240} y={138} fontSize={7} fill="var(--muted-foreground)">
          panic 발생해도 Drop trait이 복원 보장
        </text>
      </motion.g>
    </g>
  );
}
