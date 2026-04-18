import { motion } from 'framer-motion';

export default function ELBODerivationSteps({ step }: { step: number }) {
  return (
    <g>
      {/* Step 0: 목표 정의 */}
      {step === 0 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* log p(x) 박스 */}
          <rect x={140} y={10} width={200} height={36} rx={6} fill="#6366f112" stroke="#6366f1" strokeWidth={1.2} />
          <text x={240} y={33} textAnchor="middle" fontSize={13} fontWeight={700} fill="#6366f1">목표: log p(x) 최대화</text>
          {/* 적분 표현 */}
          <rect x={80} y={60} width={320} height={32} rx={6} fill="#f59e0b10" stroke="#f59e0b" strokeWidth={0.8} />
          <text x={240} y={81} textAnchor="middle" fontSize={11} fill="#f59e0b">
            p(x) = ∫ p(x|z) · p(z) dz
          </text>
          {/* 화살표 + 문제 */}
          <line x1={240} y1={92} x2={240} y2={108} stroke="#ef4444" strokeWidth={1} markerEnd="url(#arrowRed)" />
          <rect x={130} y={108} width={220} height={30} rx={6} fill="#ef444410" stroke="#ef4444" strokeWidth={0.8} strokeDasharray="4 3" />
          <text x={240} y={127} textAnchor="middle" fontSize={10} fill="#ef4444">z 고차원 → 적분 불가능 (intractable)</text>
          <defs>
            <marker id="arrowRed" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="none" stroke="#ef4444" strokeWidth={1} />
            </marker>
          </defs>
        </motion.g>
      )}

      {/* Step 1: 변분 분포 도입 */}
      {step === 1 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <rect x={60} y={8} width={360} height={28} rx={6} fill="#8b5cf612" stroke="#8b5cf6" strokeWidth={1} />
          <text x={240} y={27} textAnchor="middle" fontSize={11} fontWeight={600} fill="#8b5cf6">
            근사 분포 q(z|x) 도입 → Jensen 부등식 적용
          </text>
          {/* 유도 과정 */}
          <text x={240} y={56} textAnchor="middle" fontSize={10} fill="var(--foreground)">
            log p(x) = log ∫ q(z|x) · [p(x|z)p(z) / q(z|x)] dz
          </text>
          <text x={240} y={76} textAnchor="middle" fontSize={10} fill="var(--foreground)">
            ≥ E_q[log p(x|z) + log p(z) − log q(z|x)]
          </text>
          <line x1={120} y1={84} x2={360} y2={84} stroke="var(--border)" strokeWidth={0.5} />
          {/* ELBO 결과 */}
          <rect x={100} y={92} width={280} height={32} rx={6} fill="#10b98112" stroke="#10b981" strokeWidth={1.2} />
          <text x={240} y={113} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
            ELBO = E_q[log p(x|z)] − KL(q‖p)
          </text>
          {/* 부등호 */}
          <text x={240} y={142} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
            log p(x) ≥ ELBO → ELBO 최대화 = log p(x) 최대화
          </text>
        </motion.g>
      )}

      {/* Step 2: 두 항 해석 */}
      {step === 2 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">
            ELBO = 재구성 항 − 정규화 항
          </text>
          {/* 재구성 항 */}
          <rect x={30} y={30} width={200} height={50} rx={8} fill="#3b82f610" stroke="#3b82f6" strokeWidth={1} />
          <rect x={30} y={30} width={200} height={5} rx={2.5} fill="#3b82f6" opacity={0.8} />
          <text x={130} y={53} textAnchor="middle" fontSize={10} fontWeight={600} fill="#3b82f6">재구성 항</text>
          <text x={130} y={68} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">E_q[log p(x|z)]</text>
          <text x={130} y={94} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">디코더 복원 품질</text>

          {/* 정규화 항 */}
          <rect x={250} y={30} width={200} height={50} rx={8} fill="#f59e0b10" stroke="#f59e0b" strokeWidth={1} />
          <rect x={250} y={30} width={200} height={5} rx={2.5} fill="#f59e0b" opacity={0.8} />
          <text x={350} y={53} textAnchor="middle" fontSize={10} fontWeight={600} fill="#f59e0b">정규화 항</text>
          <text x={350} y={68} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">KL(q(z|x) ‖ p(z))</text>
          <text x={350} y={94} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">사전분포 N(0,I) 근접</text>

          {/* 균형 화살표 */}
          <line x1={180} y1={110} x2={300} y2={110} stroke="var(--foreground)" strokeWidth={1} />
          <polygon points="230,105 250,110 230,115" fill="var(--foreground)" opacity={0.3} />
          <polygon points="250,105 230,110 250,115" fill="var(--foreground)" opacity={0.3} />
          <text x={240} y={130} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">두 항의 경쟁 → 균형이 핵심</text>
        </motion.g>
      )}

      {/* Step 3: VAE 손실 */}
      {step === 3 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">
            VAE는 −ELBO를 최소화
          </text>
          <rect x={50} y={28} width={380} height={38} rx={8} fill="#ef444412" stroke="#ef4444" strokeWidth={1.2} />
          <text x={240} y={52} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">
            Loss = 재구성 손실 + KL Divergence
          </text>
          {/* 실무 구현 */}
          <rect x={60} y={80} width={160} height={28} rx={6} fill="#6366f110" stroke="#6366f1" strokeWidth={0.8} />
          <text x={140} y={98} textAnchor="middle" fontSize={9} fill="#6366f1">q(z|x) ≈ N(μ(x), σ²(x))</text>
          <rect x={260} y={80} width={160} height={28} rx={6} fill="#10b98110" stroke="#10b981" strokeWidth={0.8} />
          <text x={340} y={98} textAnchor="middle" fontSize={9} fill="#10b981">p(z) = N(0, I)</text>
          {/* 연결선 */}
          <line x1={140} y1={66} x2={140} y2={80} stroke="#6366f1" strokeWidth={0.8} />
          <line x1={340} y1={66} x2={340} y2={80} stroke="#10b981" strokeWidth={0.8} />
          <text x={240} y={128} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            인코더 출력(μ, log σ²) + 디코더 복원 → 역전파로 동시 학습
          </text>
        </motion.g>
      )}
    </g>
  );
}
