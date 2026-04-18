import { motion } from 'framer-motion';

export default function DDPMMathSteps({ step }: { step: number }) {
  return (
    <g>
      {step === 0 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">DDPM: Forward + Reverse</text>
          {/* Forward */}
          <rect x={20} y={26} width={210} height={52} rx={8} fill="#3b82f610" stroke="#3b82f6" strokeWidth={1} />
          <rect x={20} y={26} width={210} height={5} rx={2.5} fill="#3b82f6" opacity={0.85} />
          <text x={125} y={46} textAnchor="middle" fontSize={9} fontWeight={600} fill="#3b82f6">Forward (노이즈 추가)</text>
          <text x={125} y={60} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">q(x_t|x_{'{t-1}'}) = N(√(1−β_t)·x, β_t·I)</text>
          <text x={125} y={72} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">T 스텝 후: x_T ~ N(0, I)</text>
          {/* Reverse */}
          <rect x={250} y={26} width={210} height={52} rx={8} fill="#10b98110" stroke="#10b981" strokeWidth={1} />
          <rect x={250} y={26} width={210} height={5} rx={2.5} fill="#10b981" opacity={0.85} />
          <text x={355} y={46} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">Reverse (디노이징)</text>
          <text x={355} y={60} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">p_θ(x_{'{t-1}'}|x_t) = N(μ_θ, Σ_θ)</text>
          <text x={355} y={72} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">신경망이 노이즈 예측</text>
          {/* Simple Loss */}
          <rect x={80} y={92} width={320} height={32} rx={6} fill="#ef444410" stroke="#ef4444" strokeWidth={1} />
          <text x={240} y={112} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">
            L = E[‖ε − ε_θ(x_t, t)‖²]
          </text>
          <text x={240} y={145} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            단순 MSE — "추가된 노이즈를 예측"하는 것이 학습 목표
          </text>
        </motion.g>
      )}

      {step === 1 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">생성 과정 (Sampling)</text>
          {/* 단계별 denoising */}
          {[
            { x: 20, label: 'x_T', sub: 'N(0,I)', color: '#ef4444' },
            { x: 110, label: 'x_{T-1}', sub: 'denoise', color: '#f59e0b' },
            { x: 210, label: '...', sub: '', color: '#6366f1' },
            { x: 300, label: 'x_1', sub: 'denoise', color: '#3b82f6' },
            { x: 390, label: 'x_0', sub: '출력', color: '#10b981' },
          ].map((d, i) => (
            <g key={i}>
              <rect x={d.x} y={35} width={70} height={36} rx={6} fill={`${d.color}10`} stroke={d.color} strokeWidth={0.8} />
              <text x={d.x + 35} y={52} textAnchor="middle" fontSize={9} fontWeight={600} fill={d.color}>{d.label}</text>
              <text x={d.x + 35} y={66} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{d.sub}</text>
              {i < 4 && (
                <line x1={d.x + 70} y1={53} x2={[110, 210, 300, 390][i]} y2={53} stroke={d.color} strokeWidth={0.6} />
              )}
            </g>
          ))}
          {/* ε_θ 역할 */}
          <text x={240} y={90} textAnchor="middle" fontSize={9} fill="var(--foreground)">
            각 단계: ε&#770; = ε_θ(x_t, t) → 노이즈 제거
          </text>
          {/* 노이즈 스케줄 */}
          <rect x={40} y={100} width={180} height={28} rx={4} fill="#3b82f608" stroke="#3b82f6" strokeWidth={0.6} />
          <text x={130} y={118} textAnchor="middle" fontSize={8} fill="#3b82f6">Linear: β=10⁻⁴→0.02</text>
          <rect x={240} y={100} width={180} height={28} rx={4} fill="#10b98108" stroke="#10b981" strokeWidth={0.6} />
          <text x={330} y={118} textAnchor="middle" fontSize={8} fill="#10b981">Cosine: 부드러운 전환</text>
          <text x={240} y={148} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">T=1000 (표준) | DDIM: 50 step | DPM-Solver: 20 step</text>
        </motion.g>
      )}

      {step === 2 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">생성 모델 비교</text>
          {[
            { y: 28, metric: '학습 안정성', gan: '불안정', vae: '안정', diff: '매우 안정' },
            { y: 50, metric: '샘플 품질', gan: '선명', vae: '흐림', diff: '최고' },
            { y: 72, metric: '다양성', gan: 'mode collapse', vae: '높음', diff: '매우 높음' },
            { y: 94, metric: '생성 속도', gan: '1 step', vae: '1 step', diff: '50~1000' },
            { y: 116, metric: '조건부 생성', gan: '어려움', vae: '가능', diff: '매우 쉬움' },
          ].map((d) => (
            <g key={d.metric}>
              <text x={80} y={d.y + 12} textAnchor="middle" fontSize={8} fill="var(--foreground)">{d.metric}</text>
              <rect x={130} y={d.y} width={90} height={18} rx={3} fill="#f59e0b08" stroke="#f59e0b" strokeWidth={0.3} />
              <text x={175} y={d.y + 13} textAnchor="middle" fontSize={7} fill="#f59e0b">{d.gan}</text>
              <rect x={225} y={d.y} width={90} height={18} rx={3} fill="#6366f108" stroke="#6366f1" strokeWidth={0.3} />
              <text x={270} y={d.y + 13} textAnchor="middle" fontSize={7} fill="#6366f1">{d.vae}</text>
              <rect x={320} y={d.y} width={100} height={18} rx={3} fill="#10b98108" stroke="#10b981" strokeWidth={0.3} />
              <text x={370} y={d.y + 13} textAnchor="middle" fontSize={7} fill="#10b981">{d.diff}</text>
            </g>
          ))}
          <text x={175} y={26} textAnchor="middle" fontSize={8} fontWeight={600} fill="#f59e0b">GAN</text>
          <text x={270} y={26} textAnchor="middle" fontSize={8} fontWeight={600} fill="#6366f1">VAE</text>
          <text x={370} y={26} textAnchor="middle" fontSize={8} fontWeight={600} fill="#10b981">Diffusion</text>
          <text x={240} y={150} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">2022 이후 Diffusion 주류 — SD, DALL-E 3, Sora</text>
        </motion.g>
      )}
    </g>
  );
}
