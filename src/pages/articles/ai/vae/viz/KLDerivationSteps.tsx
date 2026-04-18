import { motion } from 'framer-motion';

export default function KLDerivationSteps({ step }: { step: number }) {
  return (
    <g>
      {step === 0 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">KL Divergence 정의</text>
          <rect x={60} y={28} width={360} height={28} rx={6} fill="#6366f110" stroke="#6366f1" strokeWidth={1} />
          <text x={240} y={47} textAnchor="middle" fontSize={10} fontWeight={600} fill="#6366f1">
            KL(q‖p) = ∫ q(x) · log[q(x)/p(x)] dx
          </text>
          {/* 두 가우시안 */}
          <rect x={40} y={68} width={180} height={36} rx={6} fill="#10b98110" stroke="#10b981" strokeWidth={0.8} />
          <text x={130} y={82} textAnchor="middle" fontSize={9} fill="#10b981">q = N(μ₁, σ₁²)</text>
          <text x={130} y={96} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">인코더 출력 분포</text>
          <rect x={260} y={68} width={180} height={36} rx={6} fill="#f59e0b10" stroke="#f59e0b" strokeWidth={0.8} />
          <text x={350} y={82} textAnchor="middle" fontSize={9} fill="#f59e0b">p = N(μ₂, σ₂²)</text>
          <text x={350} y={96} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">사전 분포 (target)</text>
          {/* 결과 공식 */}
          <rect x={40} y={116} width={400} height={28} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
          <text x={240} y={134} textAnchor="middle" fontSize={9} fill="var(--foreground)">
            KL = log(σ₂/σ₁) + (σ₁² + (μ₁−μ₂)²)/(2σ₂²) − 0.5
          </text>
        </motion.g>
      )}

      {step === 1 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">VAE 특수 경우: p = N(0, I)</text>
          {/* 대입 */}
          <rect x={80} y={28} width={140} height={22} rx={4} fill="#f59e0b10" stroke="#f59e0b" strokeWidth={0.6} />
          <text x={150} y={43} textAnchor="middle" fontSize={9} fill="#f59e0b">μ₂ = 0, σ₂ = 1 대입</text>
          <line x1={220} y1={39} x2={260} y2={39} stroke="var(--foreground)" strokeWidth={0.8} />
          {/* 결과 */}
          <rect x={260} y={28} width={180} height={22} rx={4} fill="#10b98110" stroke="#10b981" strokeWidth={0.8} />
          <text x={350} y={43} textAnchor="middle" fontSize={9} fill="#10b981">해석적 폐형해</text>
          {/* 공식 단계 */}
          <rect x={50} y={60} width={380} height={50} rx={8} fill="#6366f108" stroke="#6366f1" strokeWidth={1} />
          <text x={240} y={78} textAnchor="middle" fontSize={10} fill="#6366f1">
            KL = −log σ + σ²/2 + μ²/2 − 0.5
          </text>
          <text x={240} y={98} textAnchor="middle" fontSize={11} fontWeight={700} fill="#6366f1">
            = −0.5 · (1 + log σ² − σ² − μ²)
          </text>
          {/* PyTorch */}
          <rect x={50} y={120} width={380} height={26} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
          <text x={240} y={137} textAnchor="middle" fontSize={9} fill="var(--foreground)">
            kl = -0.5 * torch.sum(1 + logvar - mu.pow(2) - logvar.exp())
          </text>
        </motion.g>
      )}

      {step === 2 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">각 항의 역할</text>
          {[
            { y: 30, color: '#6366f1', term: '−1', role: '상수 (정규화)', detail: '기준점' },
            { y: 56, color: '#10b981', term: '−log σ²', role: '분산 축소 억제', detail: 'σ 작아지면 페널티 ↑' },
            { y: 82, color: '#f59e0b', term: '+σ²', role: '분산 확대 페널티', detail: 'σ 커지면 페널티 ↑' },
            { y: 108, color: '#ef4444', term: '+μ²', role: '평균 이동 페널티', detail: 'μ≠0이면 페널티 ↑' },
          ].map((d) => (
            <g key={d.term}>
              <rect x={30} y={d.y} width={70} height={22} rx={4} fill={`${d.color}15`} stroke={d.color} strokeWidth={0.8} />
              <text x={65} y={d.y + 15} textAnchor="middle" fontSize={9} fontWeight={600} fill={d.color}>{d.term}</text>
              <rect x={110} y={d.y} width={140} height={22} rx={4} fill={`${d.color}08`} stroke={d.color} strokeWidth={0.4} />
              <text x={180} y={d.y + 15} textAnchor="middle" fontSize={9} fill="var(--foreground)">{d.role}</text>
              <text x={350} y={d.y + 15} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{d.detail}</text>
            </g>
          ))}
          {/* 최적점 */}
          <rect x={100} y={136} width={280} height={20} rx={4} fill="#10b98110" stroke="#10b981" strokeWidth={0.6} />
          <text x={240} y={150} textAnchor="middle" fontSize={9} fill="#10b981">최적: μ=0, σ²=1 → KL=0 (prior와 일치)</text>
        </motion.g>
      )}

      {step === 3 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">β-VAE: Loss 균형 조정</text>
          {/* 공식 */}
          <rect x={100} y={26} width={280} height={28} rx={6} fill="#8b5cf610" stroke="#8b5cf6" strokeWidth={1} />
          <text x={240} y={44} textAnchor="middle" fontSize={11} fontWeight={700} fill="#8b5cf6">L = L_recon + β · L_KL</text>
          {/* β 스케일 */}
          <line x1={60} y1={80} x2={420} y2={80} stroke="var(--border)" strokeWidth={1} />
          {[
            { x: 80, beta: '0', label: '일반 AE', color: '#6366f1' },
            { x: 180, beta: '1', label: '표준 VAE', color: '#10b981' },
            { x: 300, beta: '4~10', label: 'Disentangle', color: '#f59e0b' },
            { x: 400, beta: '>10', label: '과도 정규화', color: '#ef4444' },
          ].map((d) => (
            <g key={d.beta}>
              <circle cx={d.x} cy={80} r={4} fill={d.color} />
              <text x={d.x} y={74} textAnchor="middle" fontSize={8} fontWeight={600} fill={d.color}>β={d.beta}</text>
              <text x={d.x} y={96} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{d.label}</text>
            </g>
          ))}
          {/* 효과 설명 */}
          <rect x={40} y={108} width={190} height={36} rx={6} fill="#10b98108" stroke="#10b981" strokeWidth={0.6} />
          <text x={135} y={122} textAnchor="middle" fontSize={8} fill="#10b981">β {'<'} 1: 재구성 우선</text>
          <text x={135} y={136} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">선명하지만 구조 없음</text>
          <rect x={250} y={108} width={190} height={36} rx={6} fill="#f59e0b08" stroke="#f59e0b" strokeWidth={0.6} />
          <text x={345} y={122} textAnchor="middle" fontSize={8} fill="#f59e0b">β {'>'} 1: disentanglement</text>
          <text x={345} y={136} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">독립 요인 분리</text>
        </motion.g>
      )}
    </g>
  );
}
