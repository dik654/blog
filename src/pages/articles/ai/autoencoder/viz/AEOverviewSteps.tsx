import { motion } from 'framer-motion';
import { C } from './AEOverviewVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* Step 0: 수학적 정의 — 인코더/디코더 매핑 다이어그램 */
export function Step0() {
  return (
    <g>
      {/* X space */}
      <motion.circle cx={80} cy={78} r={35} fill={`${C.enc}12`} stroke={C.enc}
        strokeWidth={1.2} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={sp} />
      <text x={80} y={72} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.enc}>X</text>
      <text x={80} y={86} textAnchor="middle" fontSize={8} fill={C.muted}>n차원</text>

      {/* f arrow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.15 }}>
        <line x1={115} y1={65} x2={185} y2={52} stroke={C.enc} strokeWidth={1.2} markerEnd="url(#aeov-arr)" />
        <text x={150} y={50} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.enc}>f(x; θ_enc)</text>
      </motion.g>

      {/* Z space */}
      <motion.ellipse cx={240} cy={45} rx={42} ry={25} fill={`${C.lat}15`} stroke={C.lat}
        strokeWidth={1.2} strokeDasharray="4 2"
        initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ ...sp, delay: 0.2 }} />
      <text x={240} y={42} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.lat}>Z</text>
      <text x={240} y={55} textAnchor="middle" fontSize={8} fill={C.muted}>k차원 (k{'<<'}n)</text>

      {/* g arrow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        <line x1={282} y1={52} x2={345} y2={65} stroke={C.dec} strokeWidth={1.2} markerEnd="url(#aeov-arr2)" />
        <text x={320} y={50} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.dec}>g(z; θ_dec)</text>
      </motion.g>

      {/* X̂ space */}
      <motion.circle cx={390} cy={78} r={35} fill={`${C.dec}12`} stroke={C.dec}
        strokeWidth={1.2} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ ...sp, delay: 0.35 }} />
      <text x={390} y={72} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.dec}>X&#x0302;</text>
      <text x={390} y={86} textAnchor="middle" fontSize={8} fill={C.muted}>n차원</text>

      {/* Loss below */}
      <motion.g initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.45 }}>
        <rect x={140} y={110} width={200} height={28} rx={6} fill={`${C.lat}10`} stroke={C.lat} strokeWidth={1} />
        <text x={240} y={128} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.lat}>
          minimize E[||x - g(f(x))||²]
        </text>
      </motion.g>

      <defs>
        <marker id="aeov-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C.enc} />
        </marker>
        <marker id="aeov-arr2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C.dec} />
        </marker>
      </defs>
    </g>
  );
}

/* Step 1: MNIST 레이어 구조 */
export function Step1() {
  const layers = [
    { w: 50, label: '784', sub: '입력', c: C.enc },
    { w: 38, label: '128', sub: '', c: C.enc },
    { w: 30, label: '64', sub: '', c: C.enc },
    { w: 18, label: '10', sub: '병목', c: C.lat },
    { w: 30, label: '64', sub: '', c: C.dec },
    { w: 38, label: '128', sub: '', c: C.dec },
    { w: 50, label: '784', sub: '출력', c: C.dec },
  ];
  const gap = 58;
  const startX = 30;

  return (
    <g>
      {layers.map((l, i) => {
        const x = startX + i * gap;
        const h = l.w * 1.8;
        const y = 78 - h / 2;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: i * 0.06 }}>
            <rect x={x} y={y} width={30} height={h} rx={4}
              fill={`${l.c}18`} stroke={l.c} strokeWidth={1} />
            <text x={x + 15} y={78 + 3} textAnchor="middle" fontSize={8} fontWeight={600} fill={l.c}>
              {l.label}
            </text>
            {l.sub && (
              <text x={x + 15} y={y + h + 12} textAnchor="middle" fontSize={7} fill={C.muted}>{l.sub}</text>
            )}
            {i < layers.length - 1 && (
              <line x1={x + 30} y1={78} x2={x + gap} y2={78}
                stroke={C.muted} strokeWidth={0.6} strokeDasharray="2 2" />
            )}
          </motion.g>
        );
      })}
      <motion.text x={240} y={145} textAnchor="middle" fontSize={9} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        ≈ 200K 파라미터 · 라벨 불필요
      </motion.text>
    </g>
  );
}

/* Step 2: 모델 비교 — 4개 모델 특징 시각화 */
export function Step2() {
  const models = [
    { x: 60, label: 'PCA', desc: '선형 축소', c: C.pca, shape: 'line' as const },
    { x: 175, label: 'AE', desc: '비선형 축소+복원', c: C.enc, shape: 'curve' as const },
    { x: 290, label: 'VAE', desc: '확률분포+생성', c: C.vae, shape: 'dist' as const },
    { x: 405, label: 'GAN', desc: '적대적 생성', c: C.gan, shape: 'vs' as const },
  ];

  return (
    <g>
      {models.map((m, i) => (
        <motion.g key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ ...sp, delay: i * 0.1 }}>
          <rect x={m.x - 40} y={25} width={80} height={90} rx={8}
            fill={`${m.c}08`} stroke={m.c} strokeWidth={1} />
          <text x={m.x} y={42} textAnchor="middle" fontSize={10} fontWeight={700} fill={m.c}>
            {m.label}
          </text>
          {/* Shape diagrams */}
          {m.shape === 'line' && (
            <line x1={m.x - 22} y1={85} x2={m.x + 22} y2={55} stroke={m.c} strokeWidth={1.5} />
          )}
          {m.shape === 'curve' && (
            <path d={`M${m.x - 22},85 Q${m.x},50 ${m.x + 22},85`} fill="none" stroke={m.c} strokeWidth={1.5} />
          )}
          {m.shape === 'dist' && (
            <path d={`M${m.x - 22},85 Q${m.x - 11},55 ${m.x},65 Q${m.x + 11},55 ${m.x + 22},85`}
              fill={`${m.c}20`} stroke={m.c} strokeWidth={1.5} />
          )}
          {m.shape === 'vs' && (<>
            <circle cx={m.x - 10} cy={68} r={8} fill={`${m.c}20`} stroke={m.c} strokeWidth={1} />
            <circle cx={m.x + 10} cy={68} r={8} fill={`${C.dec}20`} stroke={C.dec} strokeWidth={1} />
            <text x={m.x} y={72} textAnchor="middle" fontSize={7} fontWeight={600} fill={m.c}>vs</text>
          </>)}
          <text x={m.x} y={130} textAnchor="middle" fontSize={8} fill={C.muted}>{m.desc}</text>
        </motion.g>
      ))}
    </g>
  );
}

/* Step 3: Diffusion 관계도 */
export function Step3() {
  return (
    <g>
      {/* AE base */}
      <motion.rect x={30} y={55} width={100} height={45} rx={6}
        fill={`${C.enc}12`} stroke={C.enc} strokeWidth={1.2}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp} />
      <text x={80} y={72} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.enc}>Autoencoder</text>
      <text x={80} y={85} textAnchor="middle" fontSize={8} fill={C.muted}>기초 구조</text>

      {/* Arrow AE → VAE */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.15 }}>
        <line x1={130} y1={78} x2={170} y2={78} stroke={C.muted} strokeWidth={1} markerEnd="url(#aeov-diff)" />
      </motion.g>

      {/* VAE */}
      <motion.rect x={175} y={55} width={100} height={45} rx={6}
        fill={`${C.vae}12`} stroke={C.vae} strokeWidth={1.2}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }} />
      <text x={225} y={72} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.vae}>VAE</text>
      <text x={225} y={85} textAnchor="middle" fontSize={8} fill={C.muted}>+ KL 제약</text>

      {/* Arrow VAE → Diffusion */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        <line x1={275} y1={78} x2={310} y2={78} stroke={C.muted} strokeWidth={1} markerEnd="url(#aeov-diff)" />
      </motion.g>

      {/* Denoising AE */}
      <motion.rect x={175} y={10} width={100} height={35} rx={6}
        fill={`${C.dec}12`} stroke={C.dec} strokeWidth={1}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.25 }} />
      <text x={225} y={32} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.dec}>Denoising AE</text>
      <motion.line x1={225} y1={45} x2={365} y2={55} stroke={C.muted} strokeWidth={0.8} strokeDasharray="3 2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }} />

      {/* Diffusion */}
      <motion.rect x={315} y={45} width={135} height={55} rx={8}
        fill={`${C.diff}12`} stroke={C.diff} strokeWidth={1.5}
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 0.35 }} />
      <text x={382} y={67} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.diff}>Diffusion</text>
      <text x={382} y={82} textAnchor="middle" fontSize={8} fill={C.muted}>VAE + Denoising 결합</text>

      {/* Label */}
      <motion.text x={240} y={140} textAnchor="middle" fontSize={9} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        Stable Diffusion = Latent Diffusion Model (Rombach 2022)
      </motion.text>

      <defs>
        <marker id="aeov-diff" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C.muted} />
        </marker>
      </defs>
    </g>
  );
}
