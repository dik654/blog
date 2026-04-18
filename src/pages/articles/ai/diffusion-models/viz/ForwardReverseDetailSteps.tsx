import { motion } from 'framer-motion';

export default function ForwardReverseDetailSteps({ step }: { step: number }) {
  return (
    <g>
      {step === 0 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="#3b82f6">Forward Process 수식</text>
          {/* 단일 스텝 */}
          <rect x={30} y={24} width={420} height={26} rx={6} fill="#3b82f608" stroke="#3b82f6" strokeWidth={0.8} />
          <text x={240} y={42} textAnchor="middle" fontSize={9} fill="#3b82f6">x_t = √(1−β_t)·x_{'{t-1}'} + √β_t·ε_t</text>
          {/* 누적곱 */}
          <rect x={30} y={56} width={200} height={24} rx={4} fill="#f59e0b08" stroke="#f59e0b" strokeWidth={0.6} />
          <text x={130} y={72} textAnchor="middle" fontSize={9} fill="#f59e0b">α_t = 1−β_t, α&#772;_t = Πα_s</text>
          {/* 핵심 트릭 */}
          <rect x={250} y={56} width={200} height={24} rx={4} fill="#10b98108" stroke="#10b981" strokeWidth={0.6} />
          <text x={350} y={72} textAnchor="middle" fontSize={9} fill="#10b981">누적곱으로 직접 계산!</text>
          {/* 결과 공식 */}
          <rect x={50} y={90} width={380} height={32} rx={8} fill="#10b98112" stroke="#10b981" strokeWidth={1.2} />
          <text x={240} y={110} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
            x_t = √α&#772;_t · x_0 + √(1−α&#772;_t) · ε
          </text>
          {/* 의미 */}
          <text x={240} y={145} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            중간 스텝 불필요 — 임의 t에서 직접 샘플링 (학습 핵심)
          </text>
        </motion.g>
      )}

      {step === 1 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="#10b981">학습 알고리즘</text>
          {/* 단계 */}
          <rect x={30} y={28} width={420} height={100} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
          {[
            { y: 42, text: '1. x_0 = batch 샘플', color: '#3b82f6' },
            { y: 58, text: '2. t = randint(1, T) — 랜덤 시점', color: '#f59e0b' },
            { y: 74, text: '3. ε = randn_like(x_0) — 순수 노이즈', color: '#8b5cf6' },
            { y: 90, text: '4. x_t = √α&#772;_t·x_0 + √(1−α&#772;_t)·ε', color: '#10b981' },
            { y: 106, text: '5. loss = MSE(ε_θ(x_t, t), ε) → backward', color: '#ef4444' },
          ].map((d) => (
            <text key={d.y} x={50} y={d.y} fontSize={9} fill={d.color}>{d.text}</text>
          ))}
          {/* 핵심 */}
          <rect x={80} y={132} width={320} height={22} rx={4} fill="#ef444408" stroke="#ef4444" strokeWidth={0.6} />
          <text x={240} y={147} textAnchor="middle" fontSize={9} fill="#ef4444">
            L = E[‖ε − ε_θ(x_t, t)‖²] — 단순 MSE만으로 학습
          </text>
        </motion.g>
      )}

      {step === 2 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">샘플링 (생성)</text>
          {/* 알고리즘 */}
          <rect x={30} y={26} width={420} height={72} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
          <text x={50} y={44} fontSize={9} fill="#ef4444">x_T ~ N(0, I)</text>
          <text x={50} y={60} fontSize={9} fill="#f59e0b">for t = T, T-1, ..., 1:</text>
          <text x={70} y={76} fontSize={9} fill="#10b981">ε&#770; = ε_θ(x_t, t)</text>
          <text x={70} y={92} fontSize={9} fill="#3b82f6">x_{'{t-1}'} = denoise(x_t, ε&#770;, t) + σ_t·z</text>
          {/* 빠른 샘플링 방법들 */}
          {[
            { x: 30, name: 'DDPM', steps: '1000', color: '#ef4444' },
            { x: 140, name: 'DDIM', steps: '50', color: '#f59e0b' },
            { x: 260, name: 'DPM-Solver', steps: '20', color: '#10b981' },
            { x: 370, name: 'Consistency', steps: '1~4', color: '#8b5cf6' },
          ].map((d) => (
            <g key={d.name}>
              <rect x={d.x} y={108} width={100} height={36} rx={6} fill={`${d.color}10`} stroke={d.color} strokeWidth={0.6} />
              <text x={d.x + 50} y={124} textAnchor="middle" fontSize={9} fontWeight={600} fill={d.color}>{d.name}</text>
              <text x={d.x + 50} y={138} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{d.steps} steps</text>
            </g>
          ))}
        </motion.g>
      )}

      {step === 3 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">노이즈 스케줄</text>
          {/* Linear vs Cosine 시각화 */}
          <rect x={30} y={28} width={200} height={60} rx={8} fill="#3b82f610" stroke="#3b82f6" strokeWidth={0.8} />
          <rect x={30} y={28} width={200} height={5} rx={2.5} fill="#3b82f6" opacity={0.85} />
          <text x={130} y={48} textAnchor="middle" fontSize={9} fontWeight={600} fill="#3b82f6">Linear Schedule</text>
          <text x={130} y={62} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">β₁=0.0001 → β_T=0.02</text>
          <text x={130} y={76} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">초기 노이즈 빠름</text>
          <text x={130} y={86} textAnchor="middle" fontSize={7} fill="#3b82f6">SD 학습 기본</text>

          <rect x={250} y={28} width={200} height={60} rx={8} fill="#10b98110" stroke="#10b981" strokeWidth={0.8} />
          <rect x={250} y={28} width={200} height={5} rx={2.5} fill="#10b981" opacity={0.85} />
          <text x={350} y={48} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">Cosine Schedule</text>
          <text x={350} y={62} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">α&#772;_t = cos²(·) / cos²(0)</text>
          <text x={350} y={76} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">부드러운 전환</text>
          <text x={350} y={86} textAnchor="middle" fontSize={7} fill="#10b981">GLIDE, Imagen 사용</text>

          {/* β 곡선 시뮬레이션 */}
          <line x1={60} y1={130} x2={200} y2={130} stroke="var(--border)" strokeWidth={0.5} />
          <line x1={60} y1={100} x2={60} y2={130} stroke="var(--border)" strokeWidth={0.5} />
          <line x1={60} y1={128} x2={200} y2={105} stroke="#3b82f6" strokeWidth={1} />
          <text x={130} y={148} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">직선 증가</text>

          <line x1={280} y1={130} x2={420} y2={130} stroke="var(--border)" strokeWidth={0.5} />
          <line x1={280} y1={100} x2={280} y2={130} stroke="var(--border)" strokeWidth={0.5} />
          <path d="M280,128 Q320,126 350,118 Q380,108 420,105" fill="none" stroke="#10b981" strokeWidth={1} />
          <text x={350} y={148} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">S자 곡선</text>
        </motion.g>
      )}
    </g>
  );
}
