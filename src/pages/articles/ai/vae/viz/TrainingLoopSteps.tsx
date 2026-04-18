import { motion } from 'framer-motion';

export default function TrainingLoopSteps({ step }: { step: number }) {
  return (
    <g>
      {step === 0 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">VAE 학습 파이프라인</text>
          {/* 파이프라인 단계 */}
          {[
            { x: 10, label: 'x', sub: '입력', color: '#3b82f6' },
            { x: 80, label: 'Encoder', sub: 'μ, logvar', color: '#6366f1' },
            { x: 175, label: 'Reparam', sub: 'z=μ+σ·ε', color: '#8b5cf6' },
            { x: 270, label: 'Decoder', sub: 'x_recon', color: '#ec4899' },
            { x: 370, label: 'Loss', sub: 'BCE+KL', color: '#ef4444' },
          ].map((d, i) => (
            <g key={d.label}>
              <rect x={d.x} y={28} width={i === 0 ? 45 : 80} height={38} rx={6}
                fill={`${d.color}10`} stroke={d.color} strokeWidth={0.8} />
              <text x={d.x + (i === 0 ? 22 : 40)} y={46} textAnchor="middle" fontSize={9} fontWeight={600} fill={d.color}>{d.label}</text>
              <text x={d.x + (i === 0 ? 22 : 40)} y={60} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{d.sub}</text>
              {i < 4 && (
                <line x1={d.x + (i === 0 ? 55 : 80)} y1={47} x2={[80, 175, 270, 370][i]} y2={47}
                  stroke={d.color} strokeWidth={0.8} />
              )}
            </g>
          ))}
          {/* 역전파 */}
          <line x1={370} y1={72} x2={80} y2={72} stroke="#ef4444" strokeWidth={0.8} strokeDasharray="4 2" />
          <text x={225} y={68} textAnchor="middle" fontSize={7} fill="#ef4444">← backprop →</text>
          {/* 학습 루프 */}
          <rect x={60} y={86} width={360} height={56} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
          <text x={80} y={102} fontSize={8} fill="var(--muted-foreground)">for epoch in range(20):</text>
          <text x={95} y={114} fontSize={8} fill="var(--muted-foreground)">  x_recon, μ, logvar = model(x)</text>
          <text x={95} y={126} fontSize={8} fill="var(--muted-foreground)">  loss = BCE + KL → backward → step</text>
          <text x={95} y={138} fontSize={8} fill="#10b981">  Adam(lr=1e-3)</text>
        </motion.g>
      )}

      {step === 1 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill="#ef4444">KL Collapse</text>
          {/* 문제 */}
          <rect x={30} y={30} width={180} height={50} rx={8} fill="#ef444410" stroke="#ef4444" strokeWidth={0.8} strokeDasharray="4 3" />
          <text x={120} y={48} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">현상</text>
          <text x={120} y={62} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">KL → 0</text>
          <text x={120} y={74} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">모든 x → 같은 분포</text>
          {/* 원인 */}
          <rect x={30} y={90} width={180} height={28} rx={4} fill="#f59e0b08" stroke="#f59e0b" strokeWidth={0.6} />
          <text x={120} y={108} textAnchor="middle" fontSize={8} fill="#f59e0b">원인: 강한 decoder가 z 무시</text>
          {/* 해결 */}
          <rect x={240} y={30} width={210} height={90} rx={8} fill="#10b98108" stroke="#10b981" strokeWidth={0.8} />
          <text x={345} y={48} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">해결</text>
          <rect x={250} y={55} width={190} height={18} rx={4} fill="#10b98110" />
          <text x={345} y={68} textAnchor="middle" fontSize={8} fill="#10b981">KL annealing: β를 0→1 점진 증가</text>
          <rect x={250} y={77} width={190} height={18} rx={4} fill="#10b98110" />
          <text x={345} y={90} textAnchor="middle" fontSize={8} fill="#10b981">Free bits: 차원별 최소 KL 보장</text>
          <rect x={250} y={99} width={190} height={18} rx={4} fill="#10b98110" />
          <text x={345} y={112} textAnchor="middle" fontSize={8} fill="#10b981">약한 decoder: z 의존 유도</text>
          <text x={240} y={140} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">디코더 능력 ↑ → KL collapse 위험 ↑</text>
        </motion.g>
      )}

      {step === 2 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill="#f59e0b">Blurry Output 문제</text>
          {/* 원인 */}
          <rect x={30} y={30} width={180} height={40} rx={6} fill="#f59e0b10" stroke="#f59e0b" strokeWidth={0.8} />
          <text x={120} y={48} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">원인</text>
          <text x={120} y={62} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">Gaussian 평균화 경향</text>
          {/* 해결 3가지 */}
          <rect x={240} y={28} width={110} height={32} rx={6} fill="#8b5cf610" stroke="#8b5cf6" strokeWidth={0.8} />
          <text x={295} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill="#8b5cf6">VAE-GAN</text>
          <text x={295} y={54} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">판별자 추가</text>
          <rect x={360} y={28} width={100} height={32} rx={6} fill="#10b98110" stroke="#10b981" strokeWidth={0.8} />
          <text x={410} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">VQ-VAE</text>
          <text x={410} y={54} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">이산 latent</text>
          {/* 시각적 비교 */}
          <rect x={60} y={82} width={80} height={50} rx={6} fill="var(--card)" stroke="#ef4444" strokeWidth={0.8} />
          <text x={100} y={98} textAnchor="middle" fontSize={9} fill="#ef4444">VAE 출력</text>
          <text x={100} y={118} textAnchor="middle" fontSize={14} fill="#ef4444" opacity={0.4}>▓▓</text>
          <text x={100} y={128} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">흐릿</text>
          <rect x={200} y={82} width={80} height={50} rx={6} fill="var(--card)" stroke="#10b981" strokeWidth={0.8} />
          <text x={240} y={98} textAnchor="middle" fontSize={9} fill="#10b981">GAN 출력</text>
          <text x={240} y={118} textAnchor="middle" fontSize={14} fill="#10b981">██</text>
          <text x={240} y={128} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">선명</text>
          <rect x={340} y={82} width={100} height={50} rx={6} fill="var(--card)" stroke="#8b5cf6" strokeWidth={0.8} />
          <text x={390} y={98} textAnchor="middle" fontSize={9} fill="#8b5cf6">VAE-GAN</text>
          <text x={390} y={118} textAnchor="middle" fontSize={14} fill="#8b5cf6">██</text>
          <text x={390} y={128} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">선명+다양</text>
        </motion.g>
      )}

      {step === 3 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">학습 설정과 평가</text>
          {/* 하이퍼파라미터 */}
          <rect x={20} y={28} width={200} height={70} rx={8} fill="#6366f110" stroke="#6366f1" strokeWidth={0.8} />
          <rect x={20} y={28} width={200} height={5} rx={2.5} fill="#6366f1" opacity={0.85} />
          <text x={120} y={48} textAnchor="middle" fontSize={9} fontWeight={600} fill="#6366f1">하이퍼파라미터</text>
          <text x={120} y={62} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">latent: 20~128 (MNIST)</text>
          <text x={120} y={74} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">hidden: 400~2048</text>
          <text x={120} y={86} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">lr: 1e-3, batch: 128~256</text>
          {/* 평가 지표 */}
          <rect x={240} y={28} width={220} height={70} rx={8} fill="#10b98110" stroke="#10b981" strokeWidth={0.8} />
          <rect x={240} y={28} width={220} height={5} rx={2.5} fill="#10b981" opacity={0.85} />
          <text x={350} y={48} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">평가 지표</text>
          <text x={350} y={62} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">Reconstruction Loss (낮을수록)</text>
          <text x={350} y={74} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">FID Score (생성 품질)</text>
          <text x={350} y={86} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">Latent traversal (시각적)</text>
          <text x={240} y={120} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            MNIST 20 epochs → recon loss 수렴, KL 0.5~2.0 안정
          </text>
        </motion.g>
      )}
    </g>
  );
}
