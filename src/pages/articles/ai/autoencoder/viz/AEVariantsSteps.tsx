import { motion } from 'framer-motion';
import { C } from './AEVariantsVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* Step 0: DAE + Sparse AE side by side */
export function Step0() {
  return (
    <g>
      {/* Denoising AE */}
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <rect x={15} y={10} width={215} height={130} rx={8} fill={`${C.dae}06`} stroke={C.dae} strokeWidth={1} />
        <text x={122} y={28} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.dae}>Denoising AE</text>

        {/* Flow: x → noise → x_noisy → AE → x̂ ≈ x */}
        <rect x={30} y={45} width={40} height={28} rx={4} fill={`${C.vanilla}12`} stroke={C.vanilla} strokeWidth={0.8} />
        <text x={50} y={63} textAnchor="middle" fontSize={8} fill={C.vanilla}>x</text>

        <text x={82} y={58} textAnchor="middle" fontSize={10} fill={C.mae}>+ε</text>

        <rect x={95} y={45} width={55} height={28} rx={4} fill={`${C.mae}12`} stroke={C.mae} strokeWidth={0.8} />
        <text x={122} y={58} textAnchor="middle" fontSize={7} fill={C.mae}>x+noise</text>

        <line x1={150} y1={59} x2={162} y2={59} stroke={C.muted} strokeWidth={0.8} markerEnd="url(#aevar-a)" />

        <rect x={165} y={45} width={50} height={28} rx={4} fill={`${C.dae}15`} stroke={C.dae} strokeWidth={0.8} />
        <text x={190} y={63} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.dae}>AE</text>

        {/* Benefits */}
        <text x={40} y={95} fontSize={7} fill={C.muted}>- 단순 복사 방지</text>
        <text x={40} y={108} fontSize={7} fill={C.muted}>- Robust 표현 학습</text>
        <text x={40} y={121} fontSize={7} fill={C.muted}>- Gaussian / Masking noise</text>
      </motion.g>

      {/* Sparse AE */}
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.15 }}>
        <rect x={250} y={10} width={215} height={130} rx={8} fill={`${C.sparse}06`} stroke={C.sparse} strokeWidth={1} />
        <text x={357} y={28} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.sparse}>Sparse AE</text>

        {/* Neurons with sparse activation */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const x = 280 + (i % 4) * 30;
          const y = 48 + Math.floor(i / 4) * 25;
          const active = i === 1 || i === 5;
          return (
            <circle key={i} cx={x} cy={y} r={8} fill={active ? `${C.sparse}30` : `${C.muted}15`}
              stroke={active ? C.sparse : C.muted} strokeWidth={active ? 1.2 : 0.6} />
          );
        })}
        <text x={430} y={58} textAnchor="end" fontSize={8} fill={C.sparse}>소수만</text>
        <text x={430} y={70} textAnchor="end" fontSize={8} fill={C.sparse}>활성화</text>

        {/* Loss formula */}
        <rect x={270} y={100} width={175} height={22} rx={4} fill={`${C.sparse}10`} stroke={C.sparse} strokeWidth={0.6} />
        <text x={357} y={115} textAnchor="middle" fontSize={8} fill={C.sparse}>
          L = MSE + λ·Σ|zᵢ| (L1)
        </text>
        <text x={357} y={132} textAnchor="middle" fontSize={7} fill={C.muted}>해석 가능 · V1 뉴런 유사</text>
      </motion.g>

      <defs>
        <marker id="aevar-a" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill={C.muted} />
        </marker>
      </defs>
    </g>
  );
}

/* Step 1: CAE + VAE */
export function Step1() {
  return (
    <g>
      {/* Contractive AE */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <rect x={15} y={10} width={215} height={130} rx={8} fill={`${C.cae}06`} stroke={C.cae} strokeWidth={1} />
        <text x={122} y={28} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.cae}>Contractive AE</text>
        {/* Jacobian visualization */}
        <rect x={40} y={42} width={160} height={35} rx={5} fill={`${C.cae}10`} stroke={C.cae} strokeWidth={0.6} />
        <text x={120} y={56} textAnchor="middle" fontSize={8} fill={C.cae}>L = MSE + λ·||J_enc(x)||²_F</text>
        <text x={120} y={70} textAnchor="middle" fontSize={7} fill={C.muted}>Jacobian Frobenius norm</text>
        {/* Effect diagram: small perturbation → same z */}
        <text x={50} y={98} fontSize={7} fill={C.muted}>x ≈ x+δ</text>
        <line x1={90} y1={95} x2={120} y2={95} stroke={C.cae} strokeWidth={0.8} markerEnd="url(#aevar-a2)" />
        <text x={145} y={98} fontSize={7} fontWeight={600} fill={C.cae}>같은 z</text>
        <text x={120} y={120} textAnchor="middle" fontSize={7} fill={C.muted}>지역적 invariant 표현</text>
      </motion.g>

      {/* VAE */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.15 }}>
        <rect x={250} y={10} width={215} height={130} rx={8} fill={`${C.vae}06`} stroke={C.vae} strokeWidth={1} />
        <text x={357} y={28} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.vae}>VAE</text>
        {/* Encoder → μ, σ → sample z */}
        <rect x={270} y={42} width={45} height={22} rx={4} fill={`${C.vanilla}12`} stroke={C.vanilla} strokeWidth={0.6} />
        <text x={292} y={57} textAnchor="middle" fontSize={8} fill={C.vanilla}>Enc</text>
        <line x1={315} y1={53} x2={330} y2={45} stroke={C.muted} strokeWidth={0.6} />
        <line x1={315} y1={53} x2={330} y2={62} stroke={C.muted} strokeWidth={0.6} />
        <text x={345} y={45} fontSize={8} fontWeight={600} fill={C.vae}>μ</text>
        <text x={345} y={65} fontSize={8} fontWeight={600} fill={C.vae}>σ</text>
        <line x1={355} y1={50} x2={380} y2={55} stroke={C.muted} strokeWidth={0.6} />
        <line x1={355} y1={62} x2={380} y2={57} stroke={C.muted} strokeWidth={0.6} />
        <ellipse cx={400} cy={56} rx={18} ry={14} fill={`${C.vae}15`} stroke={C.vae}
          strokeWidth={1} strokeDasharray="3 2" />
        <text x={400} y={60} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.vae}>z~N</text>

        {/* Loss */}
        <rect x={270} y={78} width={175} height={22} rx={4} fill={`${C.vae}10`} stroke={C.vae} strokeWidth={0.6} />
        <text x={357} y={93} textAnchor="middle" fontSize={8} fill={C.vae}>
          L = Recon + β·KL(q||p)
        </text>
        <text x={357} y={115} textAnchor="middle" fontSize={7} fill={C.muted}>연속 잠재 공간 → 샘플링 생성</text>
        <text x={357} y={128} textAnchor="middle" fontSize={7} fill={C.muted}>생성 모델의 관문</text>
      </motion.g>

      <defs>
        <marker id="aevar-a2" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill={C.cae} />
        </marker>
      </defs>
    </g>
  );
}

/* Step 2: 비교표 */
export function Step2() {
  const rows = [
    { name: 'Vanilla', purpose: '압축', constraint: '없음', use: '임베딩', c: C.vanilla },
    { name: 'Denoising', purpose: 'robust', constraint: 'noise', use: '노이즈제거', c: C.dae },
    { name: 'Sparse', purpose: '해석성', constraint: 'L1/KL', use: '특징추출', c: C.sparse },
    { name: 'VAE', purpose: '생성', constraint: 'KL div', use: '생성모델', c: C.vae },
    { name: 'VQ-VAE', purpose: '이산 z', constraint: 'codebook', use: '언어모델', c: C.vqvae },
    { name: 'MAE', purpose: 'SSL', constraint: 'masking', use: '사전학습', c: C.mae },
  ];
  const startY = 12;
  const rowH = 22;
  const cols = [80, 190, 280, 370, 440];

  return (
    <g>
      {/* Header */}
      <rect x={20} y={startY} width={445} height={18} rx={3} fill={`${C.vanilla}10`} />
      {['변형', '목적', '추가 제약', '활용'].map((h, i) => (
        <text key={i} x={cols[i]} y={startY + 13} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.vanilla}>
          {h}
        </text>
      ))}

      {rows.map((r, i) => {
        const y = startY + 20 + i * rowH;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.06 }}>
            <rect x={20} y={y} width={445} height={rowH - 2} rx={3}
              fill={i % 2 === 0 ? `${r.c}06` : 'transparent'} />
            <text x={cols[0]} y={y + 14} textAnchor="middle" fontSize={8} fontWeight={600} fill={r.c}>{r.name}</text>
            <text x={cols[1]} y={y + 14} textAnchor="middle" fontSize={8} fill={C.muted}>{r.purpose}</text>
            <text x={cols[2]} y={y + 14} textAnchor="middle" fontSize={8} fill={C.muted}>{r.constraint}</text>
            <text x={cols[3]} y={y + 14} textAnchor="middle" fontSize={8} fill={r.c}>{r.use}</text>
          </motion.g>
        );
      })}
    </g>
  );
}

/* Step 3: 선택 가이드 + 조합 */
export function Step3() {
  const guides = [
    { task: '단순 차원 축소', model: 'Vanilla AE', c: C.vanilla },
    { task: '이미지 전처리', model: 'Denoising AE', c: C.dae },
    { task: '특징 시각화', model: 'Sparse AE', c: C.sparse },
    { task: '이미지 생성', model: 'VAE / VQ-VAE', c: C.vae },
    { task: '대규모 사전학습', model: 'MAE', c: C.mae },
  ];

  const combos = [
    { a: 'Sparse+Denoising', result: '로버스트 특징', c: C.dae },
    { a: 'VQ-VAE+Transformer', result: 'DALL-E', c: C.vqvae },
    { a: 'VAE+Diffusion', result: 'Stable Diffusion', c: C.vae },
  ];

  return (
    <g>
      {/* Selection guide */}
      {guides.map((g, i) => {
        const y = 12 + i * 20;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.06 }}>
            <rect x={20} y={y} width={130} height={17} rx={4} fill={`${C.muted}08`} />
            <text x={85} y={y + 12} textAnchor="middle" fontSize={7} fill={C.muted}>{g.task}</text>
            <line x1={152} y1={y + 8} x2={168} y2={y + 8} stroke={g.c} strokeWidth={1} markerEnd={`url(#aevar-g${i})`} />
            <rect x={172} y={y} width={90} height={17} rx={4} fill={`${g.c}12`} stroke={g.c} strokeWidth={0.6} />
            <text x={217} y={y + 12} textAnchor="middle" fontSize={8} fontWeight={600} fill={g.c}>{g.model}</text>
          </motion.g>
        );
      })}

      {/* Combo section */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
        <text x={370} y={22} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.vanilla}>조합 사례</text>
        {combos.map((cb, i) => {
          const y = 32 + i * 35;
          return (
            <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
              transition={{ ...sp, delay: 0.5 + i * 0.1 }}>
              <rect x={290} y={y} width={165} height={28} rx={6} fill={`${cb.c}08`} stroke={cb.c} strokeWidth={0.8} />
              <text x={372} y={y + 12} textAnchor="middle" fontSize={8} fontWeight={600} fill={cb.c}>{cb.a}</text>
              <text x={372} y={y + 23} textAnchor="middle" fontSize={7} fill={C.muted}>→ {cb.result}</text>
            </motion.g>
          );
        })}
      </motion.g>

      <defs>
        {guides.map((g, i) => (
          <marker key={i} id={`aevar-g${i}`} markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L5,2.5 L0,5 Z" fill={g.c} />
          </marker>
        ))}
      </defs>
    </g>
  );
}
