import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, COLORS } from './WeightDecayData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* 가중치 바 차트 */
function WeightBars({ weights, color, ox, oy, label }: {
  weights: number[]; color: string; ox: number; oy: number; label: string;
}) {
  const maxW = Math.max(...weights.map(Math.abs));
  const barH = 12, gap = 4;
  return (
    <g>
      <text x={ox} y={oy - 6} fontSize={8} fontWeight={600} fill={color}>{label}</text>
      {weights.map((w, i) => {
        const bw = (Math.abs(w) / maxW) * 80;
        const y = oy + i * (barH + gap);
        return (
          <g key={i}>
            <rect x={ox} y={y} width={bw} height={barH} rx={2}
              fill={color} fillOpacity={0.3} stroke={color} strokeWidth={0.6} />
            <text x={ox + bw + 4} y={y + barH - 2} fontSize={7}
              fill="var(--muted-foreground)">{w.toFixed(2)}</text>
            <text x={ox - 4} y={y + barH - 2} textAnchor="end" fontSize={7}
              fill="var(--muted-foreground)">w{i + 1}</text>
          </g>
        );
      })}
    </g>
  );
}

export default function WeightDecayViz() {
  const noReg = [2.5, -1.8, 3.1, -0.4, 2.9];
  const withReg = [0.8, -0.6, 1.0, -0.3, 0.9];

  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step <= 1 && (
            <g>
              <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
                fill="var(--foreground)">
                {step === 0 ? 'L2 정규화 효과' : 'Weight Decay 효과'}
              </text>

              {/* Before */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <WeightBars weights={noReg} color="#888" ox={40} oy={35} label="정규화 전" />
              </motion.g>

              {/* 화살표 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
                <line x1={195} y1={80} x2={225} y2={80} stroke="var(--muted-foreground)" strokeWidth={0.8} markerEnd="url(#arrowWD)" />
                <text x={210} y={70} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
                  {step === 0 ? '+λw' : '-lr·λ·w'}
                </text>
              </motion.g>

              {/* After */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
                <WeightBars weights={withReg} color={step === 0 ? COLORS.l2 : COLORS.wd}
                  ox={240} oy={35} label="정규화 후" />
              </motion.g>

              {/* 수식 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
                <rect x={40} y={145} width={400} height={40} rx={6}
                  fill={step === 0 ? `${COLORS.l2}10` : `${COLORS.wd}10`}
                  stroke={step === 0 ? COLORS.l2 : COLORS.wd} strokeWidth={0.6} />
                <text x={240} y={164} textAnchor="middle" fontSize={9} fontFamily="monospace"
                  fill={step === 0 ? COLORS.l2 : COLORS.wd} fontWeight={600}>
                  {step === 0
                    ? 'L_total = L_data + (λ/2)·Σwᵢ²'
                    : 'w ← w − lr·∇L − lr·λ·w'}
                </text>
                <text x={240} y={178} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">
                  {step === 0
                    ? 'gradient에 λw 추가 → 가중치가 클수록 더 강한 패널티'
                    : '가중치를 직접 (1 − lr·λ) 비율로 줄임'}
                </text>
              </motion.g>

              <defs>
                <marker id="arrowWD" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill="var(--muted-foreground)" />
                </marker>
              </defs>
            </g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
                fill="var(--foreground)">Adam + L2 vs AdamW (Decoupled)</text>

              {/* Adam + L2 */}
              <rect x={20} y={28} width={200} height={155} rx={8}
                fill={`${COLORS.l2}08`} stroke={COLORS.l2} strokeWidth={1} />
              <text x={120} y={46} textAnchor="middle" fontSize={9} fontWeight={700} fill={COLORS.l2}>
                Adam + L2
              </text>
              {[
                { y: 58, t: '① gradient에 λw 추가' },
                { y: 74, t: '② Adam이 m, v 계산' },
                { y: 90, t: '③ 적응 학습률로 나눔' },
                { y: 106, t: '④ λw 효과도 함께 축소됨' },
              ].map((r, i) => (
                <text key={i} x={30} y={r.y} fontSize={8} fill="var(--foreground)">{r.t}</text>
              ))}
              <rect x={30} y={116} width={180} height={20} rx={4}
                fill={`${COLORS.warn}15`} stroke={COLORS.warn} strokeWidth={0.6} />
              <text x={120} y={130} textAnchor="middle" fontSize={8}
                fill={COLORS.warn} fontWeight={600}>⚠ 정규화 효과가 왜곡됨</text>

              <text x={120} y={155} textAnchor="middle" fontSize={8} fontFamily="monospace"
                fill="var(--muted-foreground)">w ← w − lr·(∇L + λw) / √v</text>
              <text x={120} y={170} textAnchor="middle" fontSize={7}
                fill="var(--muted-foreground)">√v가 λw도 나눠버림</text>

              {/* AdamW */}
              <rect x={260} y={28} width={200} height={155} rx={8}
                fill={`${COLORS.adamw}08`} stroke={COLORS.adamw} strokeWidth={1} />
              <text x={360} y={46} textAnchor="middle" fontSize={9} fontWeight={700} fill={COLORS.adamw}>
                AdamW (Decoupled)
              </text>
              {[
                { y: 58, t: '① gradient만으로 m, v 계산' },
                { y: 74, t: '② 적응 학습률 적용' },
                { y: 90, t: '③ weight decay 별도 적용' },
                { y: 106, t: '④ 정규화 효과 온전히 보존' },
              ].map((r, i) => (
                <text key={i} x={270} y={r.y} fontSize={8} fill="var(--foreground)">{r.t}</text>
              ))}
              <rect x={270} y={116} width={180} height={20} rx={4}
                fill={`${COLORS.adamw}15`} stroke={COLORS.adamw} strokeWidth={0.6} />
              <text x={360} y={130} textAnchor="middle" fontSize={8}
                fill={COLORS.adamw} fontWeight={600}>✓ 의도대로 동작</text>

              <text x={360} y={155} textAnchor="middle" fontSize={8} fontFamily="monospace"
                fill="var(--muted-foreground)">w ← w − lr·∇L/√v − lr·λ·w</text>
              <text x={360} y={170} textAnchor="middle" fontSize={7}
                fill="var(--muted-foreground)">decay가 gradient 밖에서 독립 적용</text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
                fill="var(--foreground)">Weight Decay λ 범위와 효과</text>

              {/* 스펙트럼 바 */}
              <defs>
                <linearGradient id="lambdaGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={COLORS.warn} />
                  <stop offset="35%" stopColor={COLORS.wd} />
                  <stop offset="65%" stopColor={COLORS.wd} />
                  <stop offset="100%" stopColor={COLORS.warn} />
                </linearGradient>
              </defs>
              <rect x={40} y={32} width={400} height={16} rx={8} fill="url(#lambdaGrad)" opacity={0.3} />
              <rect x={40} y={32} width={400} height={16} rx={8}
                fill="none" stroke="var(--border)" strokeWidth={0.5} />

              {/* 마커 */}
              {[
                { x: 60, label: '0', desc: '효과 없음' },
                { x: 160, label: '1e-4', desc: '약한 정규화' },
                { x: 280, label: '1e-3', desc: '일반적 선택' },
                { x: 360, label: '1e-2', desc: '강한 정규화' },
                { x: 420, label: '1e-1', desc: '과도 → underfitting' },
              ].map((m, i) => (
                <g key={i}>
                  <line x1={m.x} y1={48} x2={m.x} y2={55} stroke="var(--muted-foreground)" strokeWidth={0.5} />
                  <text x={m.x} y={64} textAnchor="middle" fontSize={8} fontWeight={600}
                    fill="var(--foreground)">{m.label}</text>
                  <text x={m.x} y={76} textAnchor="middle" fontSize={7}
                    fill="var(--muted-foreground)">{m.desc}</text>
                </g>
              ))}

              {/* 최적 범위 */}
              <motion.rect x={160} y={30} width={200} height={20} rx={10}
                fill="none" stroke={COLORS.wd} strokeWidth={1.5} strokeDasharray="4 2"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }} />
              <text x={260} y={26} textAnchor="middle" fontSize={8} fontWeight={700}
                fill={COLORS.wd}>최적 범위</text>

              {/* 효과 다이어그램 */}
              {[
                { ox: 40, label: 'λ 너무 작음', color: '#888', items: ['큰 가중치 허용', '복잡한 결정경계', '오버피팅 위험'] },
                { ox: 180, label: 'λ 적절', color: COLORS.wd, items: ['가중치 적당히 억제', '부드러운 결정경계', '일반화 성능 최적'] },
                { ox: 320, label: 'λ 너무 큼', color: COLORS.warn, items: ['가중치 ≈ 0', '거의 직선 경계', '언더피팅 위험'] },
              ].map((g, gi) => (
                <g key={gi}>
                  <rect x={g.ox} y={90} width={130} height={90} rx={6}
                    fill={`${g.color}08`} stroke={g.color} strokeWidth={0.8} />
                  <text x={g.ox + 65} y={106} textAnchor="middle" fontSize={9} fontWeight={700}
                    fill={g.color}>{g.label}</text>
                  {g.items.map((item, ii) => (
                    <text key={ii} x={g.ox + 10} y={122 + ii * 14} fontSize={8}
                      fill="var(--muted-foreground)">• {item}</text>
                  ))}
                </g>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
