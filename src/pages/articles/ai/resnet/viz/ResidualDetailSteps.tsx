import { motion } from 'framer-motion';
import { C } from './ResidualDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

/* ---- Step 0: 두 경로 기울기 상세 ---- */
export function TwoPathGradient() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">Skip 추가: y = F(x) + x = 0.5128 + 0.5 = 1.0128</text>

      {/* Two paths */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp }}>
        {/* Main path */}
        <rect x={10} y={28} width={220} height={52} rx={6}
          fill={C.main} fillOpacity={0.06} stroke={C.main} strokeWidth={0.8} />
        <text x={20} y={44} fontSize={9} fontWeight={700} fill={C.main}>
          메인 경로 (F 통과)
        </text>
        <text x={20} y={58} fontSize={8} fill="var(--muted-foreground)">
          dF/dh2 x dh2/dh1 x dh1/dw1
        </text>
        <text x={20} y={72} fontSize={9} fontWeight={600} fill={C.main}>
          = 0.02498 x 0.02498 x 0.1249 = 7.79e-5
        </text>
      </motion.g>

      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.2 }}>
        {/* Skip path */}
        <rect x={250} y={28} width={220} height={52} rx={6}
          fill={C.skip} fillOpacity={0.06} stroke={C.skip} strokeWidth={1.2} />
        <text x={260} y={44} fontSize={9} fontWeight={700} fill={C.skip}>
          Skip 경로 (identity)
        </text>
        <text x={260} y={58} fontSize={8} fill="var(--muted-foreground)">
          dy/dx = 1 → 기울기 직접 전달
        </text>
        <text x={260} y={72} fontSize={9} fontWeight={600} fill={C.skip}>
          기울기 손실 없이 뒤→앞 전파
        </text>
      </motion.g>

      {/* General formula */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.4 }}>
        <rect x={10} y={90} width={460} height={30} rx={7}
          fill={C.compare} fillOpacity={0.06} stroke={C.compare} strokeWidth={1} />
        <text x={240} y={106} textAnchor="middle" fontSize={10} fontWeight={700}
          fill={C.compare}>{'dL/dx_l = dL/dx_{l+1} x (1 + dF/dx_l)'}</text>
        <text x={240} y={118} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">
          곱에 항상 1이 포함 → 지수적 감쇠 방지
        </text>
      </motion.g>

      {/* L layers */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}>
        <rect x={10} y={128} width={460} height={26} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={145} textAnchor="middle" fontSize={9}
          fill="var(--foreground)">
          L층 전체: dL/dx_0 = dL/dx_L x 곱_l(1 + dF_l/dx_l) — 각 층에서 +1 보장
        </text>
      </motion.g>
    </g>
  );
}

/* ---- Step 1: 학습 안정성 비교 ---- */
export function StabilityCompare() {
  const plain = [
    { layers: '10', status: '수렴', ok: true },
    { layers: '20', status: '느린 수렴', ok: true },
    { layers: '34', status: '학습 실패', ok: false },
    { layers: '50+', status: '완전 실패', ok: false },
  ];
  const resnet = [
    { layers: '18', status: '빠른 수렴', ok: true },
    { layers: '34', status: '빠른 수렴', ok: true },
    { layers: '101', status: '수렴', ok: true },
    { layers: '152', status: '최고 성능', ok: true },
  ];

  return (
    <g>
      {/* Plain */}
      <text x={110} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
        fill={C.main}>Plain Network</text>
      {plain.map((p, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp, delay: i * 0.08 }}>
          <rect x={10} y={20 + i * 24} width={200} height={20} rx={5}
            fill={p.ok ? '#10b98108' : '#ef444408'}
            stroke={p.ok ? C.skip : C.main} strokeWidth={0.6} />
          <text x={20} y={34 + i * 24} fontSize={9} fontWeight={600}
            fill="var(--foreground)">{p.layers}층</text>
          <text x={80} y={34 + i * 24} fontSize={9}
            fill={p.ok ? C.skip : C.main}>{p.status}</text>
          <text x={190} y={34 + i * 24} fontSize={10}
            fill={p.ok ? C.skip : C.main}>{p.ok ? '○' : '×'}</text>
        </motion.g>
      ))}

      {/* ResNet */}
      <text x={370} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
        fill={C.skip}>ResNet</text>
      {resnet.map((r, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp, delay: 0.15 + i * 0.08 }}>
          <rect x={270} y={20 + i * 24} width={200} height={20} rx={5}
            fill={C.skip} fillOpacity={0.06}
            stroke={C.skip} strokeWidth={i === 3 ? 1.2 : 0.6} />
          <text x={280} y={34 + i * 24} fontSize={9} fontWeight={600}
            fill="var(--foreground)">{r.layers}층</text>
          <text x={340} y={34 + i * 24} fontSize={9}
            fill={C.skip}>{r.status}</text>
          <text x={450} y={34 + i * 24} fontSize={10}
            fill={C.skip}>○</text>
        </motion.g>
      ))}

      {/* Ensemble interpretation */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.5 }}>
        <rect x={10} y={122} width={460} height={32} rx={7}
          fill={C.accent} fillOpacity={0.06} stroke={C.accent} strokeWidth={0.8} />
        <text x={20} y={138} fontSize={9} fontWeight={700}
          fill={C.accent}>"Ensemble of Shallow Networks" (Veit 2016)</text>
        <text x={20} y={150} fontSize={8} fill="var(--muted-foreground)">
          n개 residual block → 2^n 경로. ResNet-152 (50 blocks): 2^50 = 10^15 경로의 암묵적 앙상블
        </text>
      </motion.g>
    </g>
  );
}
