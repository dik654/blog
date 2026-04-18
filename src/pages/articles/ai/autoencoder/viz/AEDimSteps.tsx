import { motion } from 'framer-motion';
import { C } from './AEDimVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* Step 0: Linear AE = PCA proof diagram */
export function Step0() {
  return (
    <g>
      {/* Linear AE formula */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <rect x={20} y={15} width={200} height={65} rx={6} fill={`${C.pca}08`} stroke={C.pca} strokeWidth={1} />
        <text x={120} y={32} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.pca}>Linear AE</text>
        <text x={120} y={48} textAnchor="middle" fontSize={8} fill={C.muted}>z = W_enc · x</text>
        <text x={120} y={62} textAnchor="middle" fontSize={8} fill={C.muted}>x̂ = W_dec · z</text>
        <text x={120} y={75} textAnchor="middle" fontSize={7} fill={C.pca}>활성화 없음, bias 없음</text>
      </motion.g>

      {/* = sign */}
      <motion.text x={240} y={52} textAnchor="middle" fontSize={18} fontWeight={700} fill={C.manifold}
        initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 0.2 }}>
        =
      </motion.text>

      {/* PCA */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.25 }}>
        <rect x={265} y={15} width={200} height={65} rx={6} fill={`${C.pca}08`} stroke={C.pca} strokeWidth={1} />
        <text x={365} y={32} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.pca}>PCA</text>
        <text x={365} y={48} textAnchor="middle" fontSize={8} fill={C.muted}>W_dec = U_k (상위 주성분)</text>
        <text x={365} y={62} textAnchor="middle" fontSize={8} fill={C.muted}>W_enc = U_k^T</text>
        <text x={365} y={75} textAnchor="middle" fontSize={7} fill={C.pca}>Baldi & Hornik 1989</text>
      </motion.g>

      {/* Conclusion */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.4 }}>
        <rect x={60} y={95} width={360} height={45} rx={8} fill={`${C.manifold}08`} stroke={C.manifold} strokeWidth={1} />
        <text x={240} y={113} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.manifold}>
          minimize E[||x - W_dec · W_enc · x||²]
        </text>
        <text x={240} y={130} textAnchor="middle" fontSize={8} fill={C.muted}>
          최적해는 PCA subspace — 비선형 활성화가 표현력의 핵심 차이
        </text>
      </motion.g>
    </g>
  );
}

/* Step 1: PCA vs Nonlinear AE — Swiss Roll 비유 */
export function Step1() {
  // PCA side: straight line through points
  const pcaX = 30;
  const aeX = 260;
  const cy = 75;

  // Spiral points for swiss roll
  const spiralPts = Array.from({ length: 20 }, (_, i) => {
    const t = (i / 19) * Math.PI * 2;
    const r = 20 + t * 8;
    return { x: Math.cos(t) * r * 0.5, y: Math.sin(t) * r * 0.5 };
  });

  return (
    <g>
      {/* PCA side */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <rect x={pcaX} y={15} width={200} height={130} rx={8} fill={`${C.pca}06`} stroke={C.pca} strokeWidth={1} />
        <text x={pcaX + 100} y={32} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.pca}>PCA</text>
        {/* Points scattered */}
        {spiralPts.map((p, i) => (
          <circle key={i} cx={pcaX + 100 + p.x} cy={cy + p.y} r={2}
            fill={C.pca} fillOpacity={0.5} />
        ))}
        {/* Straight projection line */}
        <line x1={pcaX + 40} y1={cy + 20} x2={pcaX + 160} y2={cy - 20}
          stroke={C.warn} strokeWidth={2} strokeDasharray="4 2" />
        <text x={pcaX + 100} y={135} textAnchor="middle" fontSize={8} fill={C.warn}>직선 투영만 가능</text>
      </motion.g>

      {/* Arrow */}
      <motion.text x={242} y={cy} textAnchor="middle" fontSize={14} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>→</motion.text>

      {/* Nonlinear AE side */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.25 }}>
        <rect x={aeX} y={15} width={200} height={130} rx={8} fill={`${C.ae}06`} stroke={C.ae} strokeWidth={1} />
        <text x={aeX + 100} y={32} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.ae}>Nonlinear AE</text>
        {spiralPts.map((p, i) => (
          <circle key={i} cx={aeX + 100 + p.x} cy={cy + p.y} r={2}
            fill={C.ae} fillOpacity={0.5} />
        ))}
        {/* Curved path through points */}
        <path d={`M${aeX + 75},${cy + 10} Q${aeX + 90},${cy - 25} ${aeX + 110},${cy - 10} Q${aeX + 130},${cy + 15} ${aeX + 150},${cy - 5}`}
          fill="none" stroke={C.lat} strokeWidth={2} />
        <text x={aeX + 100} y={135} textAnchor="middle" fontSize={8} fill={C.lat}>곡면 매니폴드 학습</text>
      </motion.g>
    </g>
  );
}

/* Step 2: Manifold hypothesis */
export function Step2() {
  return (
    <g>
      {/* High-dim space */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <rect x={25} y={15} width={180} height={120} rx={8}
          fill={`${C.muted}08`} stroke={C.muted} strokeWidth={1} strokeDasharray="4 2" />
        <text x={115} y={32} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.muted}>784차원 공간</text>
        {/* Small manifold inside */}
        <motion.ellipse cx={115} cy={80} rx={55} ry={30} fill={`${C.manifold}15`} stroke={C.manifold}
          strokeWidth={1.2} initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ ...sp, delay: 0.2 }} />
        <text x={115} y={76} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.manifold}>데이터 매니폴드</text>
        <text x={115} y={90} textAnchor="middle" fontSize={7} fill={C.muted}>본질 차원 ≈ 10~30</text>
        {/* Scattered dots on manifold */}
        {[[-30, -8], [-15, -15], [0, -10], [15, -18], [30, -5], [-20, 5], [10, 8], [25, 2]].map(([dx, dy], i) => (
          <motion.circle key={i} cx={115 + dx} cy={80 + dy} r={2} fill={C.manifold}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 + i * 0.03 }} />
        ))}
      </motion.g>

      {/* Arrow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
        <line x1={210} y1={78} x2={255} y2={78} stroke={C.ae} strokeWidth={1.2} markerEnd="url(#aedim-a)" />
        <text x={233} y={72} textAnchor="middle" fontSize={7} fill={C.ae}>AE</text>
      </motion.g>

      {/* Latent space */}
      <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.45 }}>
        <rect x={260} y={35} width={100} height={85} rx={8}
          fill={`${C.lat}10`} stroke={C.lat} strokeWidth={1.2} />
        <text x={310} y={52} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.lat}>잠재 공간 z</text>
        {/* Points mapped neatly */}
        {[[-20, -5], [-10, -15], [0, -8], [10, -18], [20, -3], [-15, 8], [5, 12], [18, 5]].map(([dx, dy], i) => (
          <motion.circle key={i} cx={310 + dx} cy={85 + dy} r={2.5} fill={C.lat}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 + i * 0.03 }} />
        ))}
        <text x={310} y={115} textAnchor="middle" fontSize={7} fill={C.muted}>매니폴드 좌표계</text>
      </motion.g>

      {/* Property */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
        <rect x={380} y={30} width={90} height={105} rx={6} fill={`${C.manifold}06`} stroke={C.manifold} strokeWidth={0.8} />
        <text x={425} y={48} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.manifold}>핵심 성질</text>
        <text x={425} y={65} textAnchor="middle" fontSize={7} fill={C.muted}>인접 z</text>
        <text x={425} y={77} textAnchor="middle" fontSize={7} fill={C.muted}>→ 유사 데이터</text>
        <text x={425} y={95} textAnchor="middle" fontSize={7} fill={C.muted}>smoothness</text>
        <text x={425} y={110} textAnchor="middle" fontSize={7} fill={C.muted}>연속성 보장</text>
      </motion.g>

      <defs>
        <marker id="aedim-a" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill={C.ae} />
        </marker>
      </defs>
    </g>
  );
}

/* Step 3: 4가지 활용 */
export function Step3() {
  const uses = [
    { icon: '2D', label: '시각화', desc: 'z를 2D/3D로\n데이터 구조 파악', c: C.ae },
    { icon: '~', label: '생성', desc: 'z 샘플링\n→ 새 데이터', c: C.lat },
    { icon: '↔', label: '보간', desc: 'z₁ ↔ z₂\nsmooth 변형', c: C.manifold },
    { icon: '!', label: '이상 탐지', desc: '매니폴드 이탈\n→ 높은 복원 오차', c: C.warn },
  ];

  return (
    <g>
      {/* Central latent space */}
      <motion.ellipse cx={240} cy={40} rx={60} ry={20} fill={`${C.manifold}12`} stroke={C.manifold}
        strokeWidth={1.2} strokeDasharray="4 2"
        initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={sp} />
      <text x={240} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.manifold}>잠재 공간 z</text>

      {/* 4 usage cards */}
      {uses.map((u, i) => {
        const x = 35 + i * 115;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: 0.15 + i * 0.1 }}>
            {/* Connecting line from latent */}
            <line x1={240} y1={55} x2={x + 45} y2={70} stroke={C.muted} strokeWidth={0.6} strokeDasharray="2 2" />
            <rect x={x} y={72} width={90} height={72} rx={8}
              fill={`${u.c}08`} stroke={u.c} strokeWidth={1} />
            <circle cx={x + 45} cy={88} r={10} fill={`${u.c}15`} stroke={u.c} strokeWidth={0.8} />
            <text x={x + 45} y={92} textAnchor="middle" fontSize={9} fontWeight={700} fill={u.c}>{u.icon}</text>
            <text x={x + 45} y={110} textAnchor="middle" fontSize={8} fontWeight={600} fill={u.c}>{u.label}</text>
            {u.desc.split('\n').map((line, j) => (
              <text key={j} x={x + 45} y={122 + j * 11} textAnchor="middle" fontSize={7} fill={C.muted}>{line}</text>
            ))}
          </motion.g>
        );
      })}
    </g>
  );
}
