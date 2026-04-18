import { motion } from 'framer-motion';
import { C } from './AppsDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

/* ---- Step 0: 실무 응용 사례 ---- */
export function ApplicationCases() {
  const domains = [
    { icon: '+', label: '의료 영상', items: ['X-ray 병변', 'MRI/CT 3D', '피부암 분류'], color: C.medical },
    { icon: '>', label: '자율주행', items: ['YOLO 탐지', '차선 인식', 'Segmentation'], color: C.auto },
    { icon: '#', label: '제조업', items: ['품질 검사', 'PCB 결함', '이상 탐지'], color: C.mfg },
    { icon: '!', label: '보안/감시', items: ['얼굴 인식', '행동 인식', '군중 밀도'], color: C.security },
    { icon: '*', label: '농업', items: ['작물 질병', '성숙도 판별', '드론 영상'], color: '#22c55e' },
    { icon: '~', label: '위성 영상', items: ['토지 분류', '재해 평가', '건물 탐지'], color: '#06b6d4' },
  ];

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">CNN 실무 응용 분야</text>

      {domains.map((d, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 10 + col * 158;
        const y = 22 + row * 68;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ ...sp, delay: i * 0.08 }}>
            <rect x={x} y={y} width={148} height={64} rx={7}
              fill={`${d.color}08`} stroke={d.color} strokeWidth={0.8} />
            <text x={x + 10} y={y + 16} fontSize={10} fontWeight={700}
              fill={d.color}>{d.label}</text>
            {d.items.map((item, j) => (
              <text key={j} x={x + 10} y={y + 30 + j * 12} fontSize={8}
                fill="var(--muted-foreground)">- {item}</text>
            ))}
          </motion.g>
        );
      })}
    </g>
  );
}

/* ---- Step 1: 전이학습 전략 ---- */
export function TransferStrategies() {
  const strategies = [
    {
      label: 'Feature Extraction',
      data: '1K~10K',
      time: '분~시간',
      desc: 'Conv 동결, FC만 학습',
      color: '#10b981',
      barW: 30,
    },
    {
      label: 'Fine-tuning',
      data: '10K~100K',
      time: '시간~일',
      desc: '일부/전체 재학습, lr=1e-4',
      color: '#3b82f6',
      barW: 100,
    },
    {
      label: 'From Scratch',
      data: '100K+',
      time: '며칠~주',
      desc: '랜덤 초기화, 전체 학습',
      color: '#8b5cf6',
      barW: 160,
    },
  ];

  const optimizations = [
    { label: '양자화', desc: 'FP32→INT8, 4배', color: C.transfer },
    { label: 'Pruning', desc: '파라미터 제거', color: C.transfer },
    { label: '증류', desc: '작은 모델로', color: C.transfer },
    { label: 'ONNX', desc: '추론 최적화', color: C.transfer },
  ];

  return (
    <g>
      <text x={170} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">전이학습 3가지 전략</text>

      {strategies.map((s, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp, delay: i * 0.12 }}>
          <rect x={10} y={22 + i * 40} width={300} height={34} rx={6}
            fill={`${s.color}08`} stroke={s.color} strokeWidth={0.8} />
          <text x={20} y={36 + i * 40} fontSize={9} fontWeight={700}
            fill={s.color}>{s.label}</text>
          <text x={140} y={36 + i * 40} fontSize={8}
            fill="var(--muted-foreground)">{s.desc}</text>
          {/* data requirement bar */}
          <motion.rect x={20} y={42 + i * 40} width={s.barW} height={6} rx={3}
            fill={s.color} fillOpacity={0.5}
            initial={{ width: 0 }} animate={{ width: s.barW }}
            transition={{ ...sp, delay: 0.2 + i * 0.12 }} />
          <text x={20 + s.barW + 4} y={48 + i * 40} fontSize={7}
            fill={s.color}>데이터: {s.data}</text>
        </motion.g>
      ))}

      {/* deployment optimization */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.5 }}>
        <text x={400} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
          fill={C.transfer}>배포 최적화</text>
        {optimizations.map((o, i) => (
          <g key={i}>
            <rect x={330} y={22 + i * 30} width={140} height={24} rx={6}
              fill={`${o.color}08`} stroke={o.color} strokeWidth={0.6} />
            <text x={340} y={37 + i * 30} fontSize={9} fontWeight={600}
              fill={o.color}>{o.label}</text>
            <text x={400} y={37 + i * 30} fontSize={8}
              fill="var(--muted-foreground)">{o.desc}</text>
          </g>
        ))}
      </motion.g>
    </g>
  );
}
