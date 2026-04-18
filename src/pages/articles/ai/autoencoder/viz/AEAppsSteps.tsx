import { motion } from 'framer-motion';
import { C } from './AEAppsVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* Step 0: 5 applications overview */
export function Step0() {
  const apps = [
    { icon: '🔇', label: '노이즈 제거', desc: 'CT/MRI 복원', c: C.denoise },
    { icon: '⚠', label: '이상 탐지', desc: '불량/보안', c: C.anomaly },
    { icon: '📦', label: '데이터 압축', desc: 'z로 저장', c: C.compress },
    { icon: '🔲', label: '결측치 보완', desc: '75% masking', c: C.impute },
    { icon: '★', label: '추천 시스템', desc: '잠재 factor', c: C.recsys },
  ];
  const startX = 15;
  const gap = 92;

  return (
    <g>
      {apps.map((a, i) => {
        const x = startX + i * gap;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: i * 0.08 }}>
            <rect x={x} y={15} width={82} height={120} rx={8}
              fill={`${a.c}06`} stroke={a.c} strokeWidth={1} />
            {/* Icon circle */}
            <circle cx={x + 41} cy={42} r={14} fill={`${a.c}15`} stroke={a.c} strokeWidth={0.8} />
            <text x={x + 41} y={47} textAnchor="middle" fontSize={12}>{a.icon}</text>
            <text x={x + 41} y={75} textAnchor="middle" fontSize={8} fontWeight={700} fill={a.c}>
              {a.label}
            </text>
            <text x={x + 41} y={90} textAnchor="middle" fontSize={7} fill={C.muted}>{a.desc}</text>
            {/* Mini flow */}
            {i === 0 && (<>
              <text x={x + 41} y={105} textAnchor="middle" fontSize={7} fill={a.c}>x+ε → AE → x</text>
            </>)}
            {i === 1 && (<>
              <text x={x + 41} y={105} textAnchor="middle" fontSize={7} fill={a.c}>오차 {'>'} θ → !</text>
            </>)}
            {i === 2 && (<>
              <text x={x + 41} y={105} textAnchor="middle" fontSize={7} fill={a.c}>x → z → x̂</text>
            </>)}
            {i === 3 && (<>
              <text x={x + 41} y={105} textAnchor="middle" fontSize={7} fill={a.c}>mask → fill</text>
            </>)}
            {i === 4 && (<>
              <text x={x + 41} y={105} textAnchor="middle" fontSize={7} fill={a.c}>user×item</text>
            </>)}
          </motion.g>
        );
      })}
    </g>
  );
}

/* Step 1: Anomaly detection pipeline */
export function Step1() {
  return (
    <g>
      {/* Training phase */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <rect x={15} y={10} width={220} height={55} rx={6} fill={`${C.denoise}06`} stroke={C.denoise} strokeWidth={1} />
        <text x={125} y={26} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.denoise}>학습 단계</text>
        <text x={125} y={42} textAnchor="middle" fontSize={8} fill={C.muted}>정상 데이터만으로 학습</text>
        <text x={125} y={55} textAnchor="middle" fontSize={7} fill={C.denoise}>AE가 "정상 패턴" 학습</text>
      </motion.g>

      {/* Inference phase */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.15 }}>
        <rect x={250} y={10} width={220} height={55} rx={6} fill={`${C.anomaly}06`} stroke={C.anomaly} strokeWidth={1} />
        <text x={360} y={26} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.anomaly}>추론 단계</text>
        <text x={360} y={42} textAnchor="middle" fontSize={8} fill={C.muted}>새 입력 → 복원 → 오차 측정</text>
        <text x={360} y={55} textAnchor="middle" fontSize={7} fill={C.anomaly}>오차 {'>'} 임계값 → 이상 신호</text>
      </motion.g>

      {/* Pipeline */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.25 }}>
        {/* Normal case */}
        <rect x={30} y={78} width={55} height={25} rx={4} fill={`${C.denoise}12`} stroke={C.denoise} strokeWidth={0.8} />
        <text x={57} y={94} textAnchor="middle" fontSize={8} fill={C.denoise}>정상</text>
        <line x1={85} y1={90} x2={110} y2={90} stroke={C.muted} strokeWidth={0.8} markerEnd="url(#aeapp-a)" />
        <rect x={112} y={78} width={40} height={25} rx={4} fill={`${C.compress}10`} stroke={C.compress} strokeWidth={0.8} />
        <text x={132} y={94} textAnchor="middle" fontSize={8} fill={C.compress}>AE</text>
        <line x1={152} y1={90} x2={177} y2={90} stroke={C.muted} strokeWidth={0.8} markerEnd="url(#aeapp-a)" />
        <rect x={180} y={78} width={55} height={25} rx={4} fill={`${C.denoise}12`} stroke={C.denoise} strokeWidth={0.8} />
        <text x={207} y={90} textAnchor="middle" fontSize={7} fill={C.denoise}>오차 낮음</text>
        <text x={207} y={100} textAnchor="middle" fontSize={7} fill={C.denoise}>→ 정상</text>
      </motion.g>

      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.35 }}>
        {/* Anomaly case */}
        <rect x={30} y={115} width={55} height={25} rx={4} fill={`${C.anomaly}12`} stroke={C.anomaly} strokeWidth={0.8} />
        <text x={57} y={131} textAnchor="middle" fontSize={8} fill={C.anomaly}>이상</text>
        <line x1={85} y1={127} x2={110} y2={127} stroke={C.muted} strokeWidth={0.8} markerEnd="url(#aeapp-a)" />
        <rect x={112} y={115} width={40} height={25} rx={4} fill={`${C.compress}10`} stroke={C.compress} strokeWidth={0.8} />
        <text x={132} y={131} textAnchor="middle" fontSize={8} fill={C.compress}>AE</text>
        <line x1={152} y1={127} x2={177} y2={127} stroke={C.muted} strokeWidth={0.8} markerEnd="url(#aeapp-a)" />
        <rect x={180} y={115} width={55} height={25} rx={4} fill={`${C.anomaly}12`} stroke={C.anomaly} strokeWidth={1.2} />
        <text x={207} y={127} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.anomaly}>오차 급증</text>
        <text x={207} y={137} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.anomaly}>→ 경고!</text>
      </motion.g>

      {/* Use cases */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <rect x={275} y={78} width={185} height={60} rx={6} fill={`${C.anomaly}06`} stroke={C.anomaly} strokeWidth={0.8} />
        <text x={367} y={93} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.anomaly}>활용 분야</text>
        {['제조 불량 검출', '네트워크 보안', '의료 진단', '부정 사용 탐지'].map((t, i) => (
          <text key={i} x={290 + (i % 2) * 95} y={108 + Math.floor(i / 2) * 14}
            fontSize={7} fill={C.muted}>· {t}</text>
        ))}
      </motion.g>

      <defs>
        <marker id="aeapp-a" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill={C.muted} />
        </marker>
      </defs>
    </g>
  );
}

/* Step 2: Modern models */
export function Step2() {
  const models = [
    {
      name: 'Stable Diffusion', sub: 'VAE (Rombach 2022)',
      flow: '512×512 → 64×64×4', detail: '8x 절감', c: C.sd,
    },
    {
      name: 'MAE', sub: 'He 2022',
      flow: '75% 마스킹 → 복원', detail: 'ViT 사전학습', c: C.mae,
    },
    {
      name: 'VQ-VAE', sub: 'van den Oord 2017',
      flow: 'Discrete codebook', detail: 'DALL-E 백본', c: C.vqvae,
    },
    {
      name: 'BERT', sub: 'MLM as DAE',
      flow: '15% 토큰 마스킹', detail: '언어 이해 혁명', c: C.bert,
    },
  ];

  return (
    <g>
      {models.map((m, i) => {
        const x = 15 + (i % 2) * 235;
        const y = 8 + Math.floor(i / 2) * 72;
        return (
          <motion.g key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ ...sp, delay: i * 0.1 }}>
            <rect x={x} y={y} width={220} height={65} rx={8}
              fill={`${m.c}06`} stroke={m.c} strokeWidth={1} />
            <text x={x + 110} y={y + 16} textAnchor="middle" fontSize={10} fontWeight={700} fill={m.c}>
              {m.name}
            </text>
            <text x={x + 110} y={y + 28} textAnchor="middle" fontSize={7} fill={C.muted}>{m.sub}</text>
            <rect x={x + 10} y={y + 34} width={200} height={22} rx={4}
              fill={`${m.c}10`} stroke={m.c} strokeWidth={0.5} />
            <text x={x + 60} y={y + 49} textAnchor="middle" fontSize={8} fill={m.c}>{m.flow}</text>
            <text x={x + 160} y={y + 49} textAnchor="middle" fontSize={8} fontWeight={600} fill={m.c}>{m.detail}</text>
          </motion.g>
        );
      })}
    </g>
  );
}

/* Step 3: Selection guide */
export function Step3() {
  const guides = [
    { need: '복원 품질만 중요', pick: 'Vanilla AE', c: C.compress },
    { need: '잠재 공간 구조', pick: 'VAE', c: C.sd },
    { need: '생성 태스크', pick: 'VAE / VQ-VAE / Diffusion', c: C.mae },
    { need: '사전학습', pick: 'MAE / BERT-style', c: C.bert },
    { need: '이상 탐지', pick: 'Denoising AE', c: C.anomaly },
  ];

  return (
    <g>
      {/* Central hub */}
      <motion.circle cx={240} cy={78} r={28} fill={`${C.compress}12`} stroke={C.compress}
        strokeWidth={1.5} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={sp} />
      <text x={240} y={75} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.compress}>목적에</text>
      <text x={240} y={87} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.compress}>맞게</text>

      {guides.map((g, i) => {
        const angle = (i / guides.length) * Math.PI * 2 - Math.PI / 2;
        const r = 62;
        const cx = 240 + Math.cos(angle) * r;
        const cy = 78 + Math.sin(angle) * r;
        const textR = r + 48;
        const tx = 240 + Math.cos(angle) * textR;
        const ty = 78 + Math.sin(angle) * textR;

        return (
          <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ ...sp, delay: 0.15 + i * 0.08 }}>
            {/* Line from center */}
            <line x1={240 + Math.cos(angle) * 30} y1={78 + Math.sin(angle) * 30}
              x2={cx} y2={cy} stroke={g.c} strokeWidth={0.8} />
            <circle cx={cx} cy={cy} r={8} fill={`${g.c}20`} stroke={g.c} strokeWidth={1} />
            {/* Label */}
            <text x={tx} y={ty - 5} textAnchor="middle" fontSize={7} fill={C.muted}>{g.need}</text>
            <text x={tx} y={ty + 6} textAnchor="middle" fontSize={8} fontWeight={600} fill={g.c}>{g.pick}</text>
          </motion.g>
        );
      })}
    </g>
  );
}
