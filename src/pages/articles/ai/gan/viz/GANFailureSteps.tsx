import { motion } from 'framer-motion';

export default function GANFailureSteps({ step }: { step: number }) {
  return (
    <g>
      {step === 0 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="#ef4444">Mode Collapse</text>
          {/* 정상 vs collapse */}
          <rect x={20} y={28} width={200} height={65} rx={8} fill="#10b98108" stroke="#10b981" strokeWidth={0.8} />
          <text x={120} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">정상 출력</text>
          {[
            { color: '#ef4444' }, { color: '#f59e0b' }, { color: '#10b981' },
            { color: '#3b82f6' }, { color: '#6366f1' }, { color: '#8b5cf6' }, { color: '#ec4899' },
          ].map((d, i) => (
            <g key={i}>
              <circle cx={40 + i * 26} cy={72} r={10} fill={`${d.color}20`} stroke={d.color} strokeWidth={0.5} />
              <text x={40 + i * 26} y={75} textAnchor="middle" fontSize={8} fill={d.color}>{i}</text>
            </g>
          ))}
          <rect x={250} y={28} width={210} height={65} rx={8} fill="#ef444408" stroke="#ef4444" strokeWidth={0.8} strokeDasharray="4 3" />
          <text x={355} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">Mode Collapse</text>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <g key={i}>
              <circle cx={275 + i * 26} cy={72} r={10} fill="#ef444420" stroke="#ef4444" strokeWidth={0.5} />
              <text x={275 + i * 26} y={75} textAnchor="middle" fontSize={8} fill="#ef4444">6</text>
            </g>
          ))}
          {/* 해결책 */}
          <rect x={40} y={104} width={400} height={40} rx={6} fill="#10b98108" stroke="#10b981" strokeWidth={0.6} />
          <text x={240} y={120} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">해결</text>
          <text x={240} y={136} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
            Mini-batch Discrimination | Unrolled GAN | WGAN-GP
          </text>
        </motion.g>
      )}

      {step === 1 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">학습 불안정 문제</text>
          {/* Non-convergence */}
          <rect x={20} y={28} width={210} height={55} rx={8} fill="#f59e0b10" stroke="#f59e0b" strokeWidth={0.8} />
          <rect x={20} y={28} width={3.5} height={55} rx={2} fill="#f59e0b" />
          <text x={130} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">Non-convergence</text>
          <text x={130} y={58} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">G·D 손실 진동</text>
          <text x={130} y={72} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">Nash 균형 미도달</text>
          {/* Vanishing Gradient */}
          <rect x={250} y={28} width={210} height={55} rx={8} fill="#ef444410" stroke="#ef4444" strokeWidth={0.8} />
          <rect x={250} y={28} width={3.5} height={55} rx={2} fill="#ef4444" />
          <text x={360} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">Vanishing Gradient</text>
          <text x={360} y={58} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">D 너무 강함</text>
          <text x={360} y={72} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">log(1−D(G(z))) → −∞</text>
          {/* 해결 */}
          {[
            { x: 20, label: 'Non-saturating', sub: 'max log D(G(z))', color: '#10b981' },
            { x: 160, label: 'LSGAN', sub: 'MSE 기반', color: '#3b82f6' },
            { x: 290, label: 'TTUR', sub: '학습률 분리', color: '#8b5cf6' },
            { x: 400, label: 'Label smooth', sub: '0.9 사용', color: '#f59e0b' },
          ].map((d) => (
            <g key={d.label}>
              <rect x={d.x} y={96} width={100} height={40} rx={4} fill={`${d.color}10`} stroke={d.color} strokeWidth={0.6} />
              <text x={d.x + 50} y={112} textAnchor="middle" fontSize={8} fontWeight={600} fill={d.color}>{d.label}</text>
              <text x={d.x + 50} y={126} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{d.sub}</text>
            </g>
          ))}
        </motion.g>
      )}

      {step === 2 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="#8b5cf6">WGAN: Wasserstein Distance</text>
          {/* JSD 문제 */}
          <rect x={20} y={28} width={200} height={36} rx={6} fill="#ef444408" stroke="#ef4444" strokeWidth={0.6} strokeDasharray="4 3" />
          <text x={120} y={44} textAnchor="middle" fontSize={9} fill="#ef4444">JSD: 분포 안 겹치면</text>
          <text x={120} y={58} textAnchor="middle" fontSize={9} fill="#ef4444">정보량 = 0 (상수)</text>
          {/* 화살표 */}
          <line x1={220} y1={46} x2={260} y2={46} stroke="var(--foreground)" strokeWidth={0.8} />
          <text x={240} y={40} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">해결</text>
          {/* Wasserstein */}
          <rect x={260} y={28} width={200} height={36} rx={6} fill="#8b5cf610" stroke="#8b5cf6" strokeWidth={1} />
          <text x={360} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill="#8b5cf6">Wasserstein 거리</text>
          <text x={360} y={58} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">항상 의미 있는 거리</text>
          {/* 직관 */}
          <rect x={60} y={76} width={360} height={32} rx={6} fill="#8b5cf608" stroke="#8b5cf6" strokeWidth={0.6} />
          <text x={240} y={92} textAnchor="middle" fontSize={10} fill="#8b5cf6">
            W(p_r, p_g) = inf E[‖x−y‖]
          </text>
          <text x={240} y={104} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">한 분포를 다른 분포로 "옮기는" 최소 비용</text>
          {/* 핵심 제약 */}
          <rect x={100} y={118} width={280} height={28} rx={6} fill="#10b98108" stroke="#10b981" strokeWidth={0.6} />
          <text x={240} y={136} textAnchor="middle" fontSize={9} fill="#10b981">
            D를 1-Lipschitz로 제약 → Wasserstein distance 추정
          </text>
        </motion.g>
      )}

      {step === 3 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">WGAN-GP 구현</text>
          {/* 손실 공식 */}
          <rect x={30} y={26} width={420} height={32} rx={6} fill="#8b5cf610" stroke="#8b5cf6" strokeWidth={1} />
          <text x={240} y={47} textAnchor="middle" fontSize={9} fontWeight={600} fill="#8b5cf6">
            L_D = E[D(G(z))] − E[D(x)] + λ·E[(‖∇D(x&#770;)‖₂ − 1)²]
          </text>
          {/* 각 항 */}
          <rect x={20} y={68} width={140} height={36} rx={4} fill="#ef444408" stroke="#ef4444" strokeWidth={0.6} />
          <text x={90} y={82} textAnchor="middle" fontSize={8} fill="#ef4444">Critic loss</text>
          <text x={90} y={96} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">fake − real</text>

          <rect x={170} y={68} width={140} height={36} rx={4} fill="#10b98108" stroke="#10b981" strokeWidth={0.6} />
          <text x={240} y={82} textAnchor="middle" fontSize={8} fill="#10b981">Gradient Penalty</text>
          <text x={240} y={96} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">λ=10, ‖∇‖₂ ≈ 1</text>

          <rect x={320} y={68} width={140} height={36} rx={4} fill="#f59e0b08" stroke="#f59e0b" strokeWidth={0.6} />
          <text x={390} y={82} textAnchor="middle" fontSize={8} fill="#f59e0b">보간점</text>
          <text x={390} y={96} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">x&#770;=εx+(1−ε)G(z)</text>
          {/* 장점 */}
          <rect x={40} y={116} width={400} height={32} rx={6} fill="#10b98108" stroke="#10b981" strokeWidth={0.6} />
          <text x={240} y={130} textAnchor="middle" fontSize={9} fill="#10b981">
            안정적 학습 + Mode collapse 감소 + 손실 = 품질 지표
          </text>
          <text x={240} y={146} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">BatchNorm → LayerNorm | 계산 비용 2~3배</text>
        </motion.g>
      )}
    </g>
  );
}
