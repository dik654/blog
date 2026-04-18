import { motion } from 'framer-motion';

export default function ReparamDetailSteps({ step }: { step: number }) {
  return (
    <g>
      {step === 0 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill="#ef4444">문제: 확률적 노드 = 역전파 끊김</text>
          {/* 흐름: μ,σ → 샘플링(끊김) → z → loss */}
          <rect x={30} y={40} width={60} height={26} rx={4} fill="#10b98110" stroke="#10b981" strokeWidth={0.8} />
          <text x={60} y={57} textAnchor="middle" fontSize={9} fill="#10b981">μ, σ</text>
          <line x1={90} y1={53} x2={140} y2={53} stroke="var(--foreground)" strokeWidth={0.8} />
          {/* 확률적 노드 (X 표시) */}
          <rect x={140} y={36} width={80} height={34} rx={6} fill="#ef444412" stroke="#ef4444" strokeWidth={1.2} strokeDasharray="4 3" />
          <text x={180} y={50} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">샘플링</text>
          <text x={180} y={64} textAnchor="middle" fontSize={8} fill="#ef4444">z ~ N(μ,σ²)</text>
          {/* X 표시 on arrow */}
          <line x1={220} y1={53} x2={270} y2={53} stroke="#ef4444" strokeWidth={1} />
          <text x={245} y={48} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">✗</text>
          <text x={245} y={72} textAnchor="middle" fontSize={8} fill="#ef4444">gradient 끊김</text>
          {/* z */}
          <circle cx={290} cy={53} r={12} fill="#8b5cf618" stroke="#8b5cf6" strokeWidth={1} />
          <text x={290} y={57} textAnchor="middle" fontSize={9} fontWeight={600} fill="#8b5cf6">z</text>
          <line x1={302} y1={53} x2={340} y2={53} stroke="var(--foreground)" strokeWidth={0.8} />
          <rect x={340} y={40} width={60} height={26} rx={4} fill="#f59e0b10" stroke="#f59e0b" strokeWidth={0.8} />
          <text x={370} y={57} textAnchor="middle" fontSize={9} fill="#f59e0b">Loss</text>
          {/* 역전파 화살표 (끊김) */}
          <text x={370} y={90} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">← 역전파 →</text>
          <line x1={340} y1={95} x2={220} y2={95} stroke="#ef4444" strokeWidth={0.8} strokeDasharray="3 3" />
          <text x={280} y={108} textAnchor="middle" fontSize={8} fill="#ef4444">dL/dμ = ? dL/dσ = ?</text>
          <text x={240} y={140} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">확률적 연산은 미분 불가 → 학습 불가능</text>
        </motion.g>
      )}

      {step === 1 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill="#10b981">해결: 랜덤성을 외부로 분리</text>
          {/* μ */}
          <rect x={30} y={40} width={50} height={24} rx={12} fill="#10b98118" stroke="#10b981" strokeWidth={1} />
          <text x={55} y={56} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">μ</text>
          {/* σ */}
          <rect x={30} y={75} width={50} height={24} rx={12} fill="#f59e0b18" stroke="#f59e0b" strokeWidth={1} />
          <text x={55} y={91} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">σ</text>
          {/* ε (외부 노이즈) */}
          <rect x={30} y={110} width={50} height={24} rx={12} fill="#8b5cf618" stroke="#8b5cf6" strokeWidth={1} />
          <text x={55} y={126} textAnchor="middle" fontSize={9} fontWeight={600} fill="#8b5cf6">ε</text>
          <text x={55} y={140} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">~N(0,1)</text>
          {/* 결합 */}
          <line x1={80} y1={52} x2={160} y2={70} stroke="#10b981" strokeWidth={1} />
          <line x1={80} y1={87} x2={160} y2={75} stroke="#f59e0b" strokeWidth={1} />
          <line x1={80} y1={122} x2={160} y2={80} stroke="#8b5cf6" strokeWidth={0.8} strokeDasharray="3 2" />
          {/* 결정론적 함수 */}
          <rect x={160} y={55} width={130} height={40} rx={8} fill="#10b98110" stroke="#10b981" strokeWidth={1.2} />
          <text x={225} y={72} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">z = μ + σ · ε</text>
          <text x={225} y={88} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">결정론적 함수</text>
          {/* z 출력 */}
          <line x1={290} y1={75} x2={340} y2={75} stroke="#10b981" strokeWidth={1} />
          <circle cx={360} cy={75} r={14} fill="#10b98120" stroke="#10b981" strokeWidth={1.5} />
          <text x={360} y={79} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">z</text>
          {/* 역전파 OK */}
          <line x1={360} y1={95} x2={225} y2={105} stroke="#10b981" strokeWidth={1} />
          <text x={300} y={110} textAnchor="middle" fontSize={9} fill="#10b981">gradient 흐름 ✓</text>
          <text x={240} y={148} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            E[z] = μ, Var[z] = σ² — 분포 동일하면서 미분 가능
          </text>
        </motion.g>
      )}

      {step === 2 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">Gradient 흐름 검증</text>
          {/* 3개 gradient */}
          <rect x={30} y={30} width={200} height={32} rx={6} fill="#10b98110" stroke="#10b981" strokeWidth={0.8} />
          <rect x={30} y={30} width={3.5} height={32} rx={2} fill="#10b981" />
          <text x={135} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">dL/dμ = dL/dz · 1</text>
          <text x={135} y={56} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">μ에 대한 gradient 존재</text>

          <rect x={250} y={30} width={200} height={32} rx={6} fill="#f59e0b10" stroke="#f59e0b" strokeWidth={0.8} />
          <rect x={250} y={30} width={3.5} height={32} rx={2} fill="#f59e0b" />
          <text x={355} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">dL/dσ = dL/dz · ε</text>
          <text x={355} y={56} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">σ에 대한 gradient 존재</text>

          {/* PyTorch 구현 */}
          <rect x={60} y={80} width={360} height={50} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
          <text x={240} y={96} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">PyTorch 구현</text>
          <text x={240} y={112} textAnchor="middle" fontSize={8} fill="#10b981">std = exp(0.5 * logvar)</text>
          <text x={240} y={124} textAnchor="middle" fontSize={8} fill="#8b5cf6">eps = randn_like(std)  →  z = mu + eps * std</text>
          <text x={240} y={148} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">ε은 상수 취급 → 모든 gradient 존재 → backprop 가능</text>
        </motion.g>
      )}

      {step === 3 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">다른 분포의 Reparameterization</text>
          {[
            { y: 30, color: '#10b981', name: 'Gaussian', formula: 'z = μ + σ·ε, ε~N(0,1)' },
            { y: 55, color: '#3b82f6', name: 'Uniform', formula: 'z = a + (b−a)·u, u~U(0,1)' },
            { y: 80, color: '#f59e0b', name: 'Exponential', formula: 'z = −log(u)/λ, u~U(0,1)' },
            { y: 105, color: '#8b5cf6', name: 'Gumbel-Softmax', formula: 'softmax((log π + g)/τ)' },
          ].map((d) => (
            <g key={d.name}>
              <rect x={30} y={d.y} width={100} height={20} rx={10} fill={`${d.color}15`} stroke={d.color} strokeWidth={0.8} />
              <text x={80} y={d.y + 14} textAnchor="middle" fontSize={9} fontWeight={600} fill={d.color}>{d.name}</text>
              <line x1={130} y1={d.y + 10} x2={160} y2={d.y + 10} stroke={d.color} strokeWidth={0.6} />
              <text x={310} y={d.y + 14} textAnchor="middle" fontSize={9} fill="var(--foreground)">{d.formula}</text>
            </g>
          ))}
          <rect x={60} y={132} width={360} height={22} rx={4} fill="#10b98108" stroke="#10b981" strokeWidth={0.6} />
          <text x={240} y={147} textAnchor="middle" fontSize={9} fill="#10b981">
            핵심 조건: 샘플링 = 간단한 noise + 결정론적 변환
          </text>
        </motion.g>
      )}
    </g>
  );
}
