import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const STEPS = [
  { label: '공통 출발점 — 같은 계산 그래프에서 순전파로 L 을 계산하고 중간값을 모두 저장해 둔다.' },
  { label: 'Forward: x₁ 에 seed 주입 → 첫 번째 순전파로 dL/dx₁ 하나만 획득. Reverse: 출력 L 에 dL/dL=1 주입하며 역방향 시작.' },
  { label: 'Forward: x₂ seed → 두 번째 순전파로 dL/dx₂. Reverse: backward 가 z 로 내려오며 dL/dz = upstream × local 계산.' },
  { label: 'Forward: x₃ seed → 세 번째 순전파로 dL/dx₃. Reverse: 같은 한 번의 backward 가 dL/dx₁·dL/dx₂·dL/dx₃ 를 동시에 완성.' },
  { label: '요약 — N 개 입력에 대한 편미분: Forward = N 회 · Reverse = 1 회. 파라미터가 많을수록 이 비대칭이 결정적이 된다.' },
];

export default function ForwardVsReverseViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const fwdDone      = step >= 1;
        const fwdActive    = [step >= 1, step >= 2, step >= 3];
        const fwdCount     = fwdActive.filter(Boolean).length;
        const revSeed      = step >= 1;   // dL/dL=1 주입
        const revStep2     = step >= 2;   // backward 가 z 에 도달
        const revStep3     = step >= 3;   // backward 가 입력까지 완전히 전파
        const summary      = step === 4;

        return (
          <svg viewBox="0 0 700 360" className="w-full h-auto" style={{ maxWidth: 880 }}>
            <defs>
              <marker id="fvr-fwd" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="#10b981" />
              </marker>
              <marker id="fvr-bwd" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="#f59e0b" />
              </marker>
              <marker id="fvr-seed" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="#3b82f6" />
              </marker>
            </defs>

            <text x={350} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
              fill="var(--foreground)">
              Forward mode vs Reverse mode — 같은 그래프, 다른 전략
            </text>

            <line x1={350} y1={35} x2={350} y2={320}
              stroke="var(--muted-foreground)" strokeOpacity={0.25}
              strokeWidth={1} strokeDasharray="3 4" />

            {/* ══════════ Panel A — Forward Mode ══════════ */}
            <text x={175} y={48} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">
              Forward mode
            </text>
            <text x={175} y={64} textAnchor="middle" fontSize={9}
              fill="var(--muted-foreground)">
              입력 방향으로 편미분 전파 · 입력 수 = 순전파 반복 횟수
            </text>

            {/* Forward panel — edges */}
            {[90, 160, 230].map((y, i) => (
              <motion.line
                key={`fa-xz-${i}`}
                x1={62} y1={y} x2={143} y2={160}
                stroke="#10b981"
                animate={{ strokeOpacity: fwdDone ? 0.85 : 0.25, strokeWidth: fwdDone ? 1.4 : 0.7 }}
                transition={sp}
                markerEnd="url(#fvr-fwd)"
              />
            ))}
            <motion.line
              x1={178} y1={160} x2={256} y2={160}
              stroke="#10b981"
              animate={{ strokeOpacity: fwdDone ? 0.9 : 0.25, strokeWidth: fwdDone ? 1.6 : 0.7 }}
              transition={sp}
              markerEnd="url(#fvr-fwd)"
            />

            {/* Forward seeds */}
            {fwdActive.map((active, i) => active && (
              <motion.g key={`seed-${i}`} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
                <line x1={8} y1={90 + i * 70} x2={30} y2={90 + i * 70}
                  stroke="#3b82f6" strokeWidth={1.6}
                  markerEnd="url(#fvr-seed)" />
                <text x={19} y={(90 + i * 70) - 8} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">
                  seed
                </text>
              </motion.g>
            ))}

            {/* Forward nodes + gradient badge */}
            {[
              { y: 90,  lbl: 'x₁' },
              { y: 160, lbl: 'x₂' },
              { y: 230, lbl: 'x₃' },
            ].map((n, i) => {
              const active = fwdActive[i];
              return (
                <g key={`fna-${i}`}>
                  <motion.circle cx={46} cy={n.y} r={17}
                    animate={{
                      fill: active ? '#3b82f622' : '#80808010',
                      stroke: active ? '#3b82f6' : '#888',
                      strokeWidth: active ? 1.8 : 1,
                    }}
                    transition={sp}
                  />
                  <text x={46} y={n.y + 3} textAnchor="middle" fontSize={11} fontWeight={700}
                    fill={active ? '#3b82f6' : 'var(--muted-foreground)'}>{n.lbl}</text>
                  {active && (
                    <motion.g key={`grad-a-${i}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.12 }}>
                      <rect x={70} y={n.y - 9} width={68} height={18} rx={2}
                        fill="#3b82f618" stroke="#3b82f6" strokeWidth={0.7} />
                      <text x={104} y={n.y + 4} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">
                        dL/d{n.lbl} ✓
                      </text>
                    </motion.g>
                  )}
                </g>
              );
            })}

            <circle cx={160} cy={160} r={18}
              fill={fwdDone ? '#0ea5e922' : '#80808010'}
              stroke={fwdDone ? '#0ea5e9' : '#888'} strokeWidth={fwdDone ? 1.5 : 1} />
            <text x={160} y={163} textAnchor="middle" fontSize={11} fontWeight={700}
              fill={fwdDone ? '#0ea5e9' : 'var(--muted-foreground)'}>z</text>

            <circle cx={278} cy={160} r={19}
              fill={fwdDone ? '#ef444422' : '#80808010'}
              stroke={fwdDone ? '#ef4444' : '#888'} strokeWidth={fwdDone ? 1.8 : 1} />
            <text x={278} y={163} textAnchor="middle" fontSize={11} fontWeight={700}
              fill={fwdDone ? '#ef4444' : 'var(--muted-foreground)'}>L</text>

            {/* Forward counter panel */}
            <rect x={25} y={265} width={300} height={48} rx={5}
              fill="var(--background)" stroke="#3b82f6" strokeWidth={1} strokeOpacity={0.4} />
            <text x={175} y={282} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">
              순전파 횟수: {fwdCount} / 3
            </text>
            <text x={175} y={298} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              {fwdCount === 0 ? '시작 전'
                : fwdCount === 3 ? '세 입력 각각 따로 seed 주입, 세 번 실행'
                : `x${fwdCount} 까지 완료 · 남은 입력은 재실행 필요`}
            </text>
            <text x={175} y={310} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              비용 ∝ 입력 수 N
            </text>

            {/* ══════════ Panel B — Reverse Mode ══════════ */}
            <text x={525} y={48} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">
              Reverse mode
            </text>
            <text x={525} y={64} textAnchor="middle" fontSize={9}
              fill="var(--muted-foreground)">
              출력 L 에서 시작 · 단일 역방향 pass 로 모든 입력 gradient
            </text>

            {/* Reverse panel — forward edges */}
            {[90, 160, 230].map((y, i) => (
              <line key={`fb-xz-${i}`}
                x1={420} y1={y} x2={498} y2={160}
                stroke="#10b981" strokeWidth={1.4} opacity={0.65}
                markerEnd="url(#fvr-fwd)" />
            ))}
            <line
              x1={540} y1={160} x2={618} y2={160}
              stroke="#10b981" strokeWidth={1.6} opacity={0.65}
              markerEnd="url(#fvr-fwd)" />

            {/* Reverse: dL/dL=1 seed */}
            {revSeed && (
              <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
                <rect x={648} y={110} width={52} height={18} rx={2}
                  fill="#f59e0b18" stroke="#f59e0b" strokeWidth={0.7} />
                <text x={674} y={123} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">
                  dL/dL=1
                </text>
                <line x1={674} y1={128} x2={654} y2={148}
                  stroke="#f59e0b" strokeWidth={1.6} strokeDasharray="3 2"
                  markerEnd="url(#fvr-bwd)" />
              </motion.g>
            )}

            {/* Reverse backward: L → z */}
            {revStep2 && (
              <motion.line
                x1={618} y1={167} x2={542} y2={167}
                stroke="#f59e0b" strokeWidth={1.6} strokeDasharray="4 3"
                markerEnd="url(#fvr-bwd)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ ...sp, duration: 0.5 }}
              />
            )}

            {/* Reverse backward: z → x_i */}
            {revStep3 && [
              { y: 90,  delay: 0.05 },
              { y: 160, delay: 0.15 },
              { y: 230, delay: 0.25 },
            ].map((n, i) => (
              <motion.line
                key={`bwd-zx-${i}`}
                x1={498} y1={n.y === 160 ? 167 : n.y}
                x2={422} y2={n.y === 160 ? 167 : n.y}
                stroke="#f59e0b" strokeWidth={1.6} strokeDasharray="4 3"
                markerEnd="url(#fvr-bwd)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ ...sp, duration: 0.5, delay: n.delay }}
              />
            ))}

            {/* Reverse nodes */}
            {[
              { y: 90,  lbl: 'x₁' },
              { y: 160, lbl: 'x₂' },
              { y: 230, lbl: 'x₃' },
            ].map((n, i) => (
              <g key={`fnb-${i}`}>
                <motion.circle cx={405} cy={n.y} r={17}
                  animate={{
                    fill: revStep3 ? '#f59e0b22' : '#3b82f610',
                    stroke: revStep3 ? '#f59e0b' : '#3b82f6',
                    strokeWidth: revStep3 ? 1.8 : 1.2,
                  }} transition={sp} />
                <text x={405} y={n.y + 3} textAnchor="middle" fontSize={11} fontWeight={700}
                  fill={revStep3 ? '#f59e0b' : '#3b82f6'}>{n.lbl}</text>
                {revStep3 && (
                  <motion.g key={`grad-b-${i}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...sp, delay: 0.15 + i * 0.07 }}>
                    <rect x={328} y={n.y - 9} width={68} height={18} rx={2}
                      fill="#f59e0b18" stroke="#f59e0b" strokeWidth={0.7} />
                    <text x={362} y={n.y + 4} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">
                      dL/d{n.lbl} ✓
                    </text>
                  </motion.g>
                )}
              </g>
            ))}

            <motion.circle cx={520} cy={160} r={18}
              animate={{
                fill: revStep2 ? '#f59e0b22' : '#0ea5e922',
                stroke: revStep2 ? '#f59e0b' : '#0ea5e9',
                strokeWidth: 1.5,
              }} transition={sp} />
            <text x={520} y={163} textAnchor="middle" fontSize={11} fontWeight={700}
              fill={revStep2 ? '#f59e0b' : '#0ea5e9'}>z</text>
            {revStep2 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <rect x={468} y={192} width={108} height={18} rx={2}
                  fill="#f59e0b18" stroke="#f59e0b" strokeWidth={0.7} />
                <text x={522} y={205} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">
                  dL/dz = upstream × local
                </text>
              </motion.g>
            )}

            <circle cx={638} cy={160} r={19}
              fill="#ef444422" stroke="#ef4444" strokeWidth={1.8} />
            <text x={638} y={163} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">L</text>

            {/* Reverse counter panel */}
            <rect x={385} y={265} width={300} height={48} rx={5}
              fill="var(--background)" stroke="#f59e0b" strokeWidth={1} strokeOpacity={0.4} />
            <text x={535} y={282} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">
              순전파 1 + 역전파 {revSeed ? 1 : 0} = {revSeed ? 2 : 1} pass
            </text>
            <text x={535} y={298} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              {revStep3 ? '한 번의 backward 가 모든 dL/dx 동시 완성'
                : revStep2 ? 'backward 가 z 로 내려오며 gradient 축적'
                : revSeed ? 'L 에 dL/dL=1 seed 주입'
                : 'forward 만 완료'}
            </text>
            <text x={535} y={310} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              비용 ∝ 출력 수 M (scalar loss → M=1)
            </text>

            {/* 요약 배너 */}
            {summary && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
                <rect x={20} y={326} width={660} height={30} rx={6}
                  fill="#ef444410" stroke="#ef4444" strokeWidth={1} />
                <text x={350} y={339} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ef4444">
                  N 개 입력 · 1 개 출력 구조에서 Forward = N 회, Reverse = 1 회 — 항상 N 배 우위
                </text>
                <text x={350} y={351} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  GPT-4 수준 (파라미터 ≈ 10¹¹, scalar loss) 에서는 10¹¹ 배 차이 — 이 비대칭이 딥러닝 성립의 전제
                </text>
              </motion.g>
            )}
          </svg>
        );
      }}
    </StepViz>
  );
}
