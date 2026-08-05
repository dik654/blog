import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.45 };

const STEPS = [
  { label: '파라미터가 N 개인 신경망 — 각 파라미터에 대한 편미분을 어떻게 얻느냐가 핵심이다.' },
  { label: 'Forward mode: 입력 하나당 순전파 1 회. N 개 파라미터라면 N 번 반복 — 비용이 N 에 비례한다.' },
  { label: 'Reverse mode: 순전파 1 회로 중간값을 저장하고, 역전파 1 회로 N 개 gradient 를 동시에 획득한다. 총 2 pass.' },
  { label: 'GPT-4 수준 (~10¹¹ 파라미터) 에서 Forward = 10¹¹ 회, Reverse = 2 회. 이 비대칭이 딥러닝의 전제다.' },
];

const CASES = [
  { label: '예제 모델',   n: 6,    fwdLabel: '6 회',    note: '손으로 계산 가능한 크기' },
  { label: 'ResNet-50',  n: 25e6, fwdLabel: '~25M 회', note: '실전 CV 모델 수준' },
  { label: 'GPT-4',      n: 1e11, fwdLabel: '~10¹¹ 회', note: '수천억 배 차이' },
];

export default function ForwardNPassViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const showFwd   = step >= 1;
        const showRev   = step >= 2;
        const showNote  = step >= 3;

        return (
          <svg viewBox="0 0 480 270" className="w-full h-auto">
            {/* 제목 */}
            <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700}
              fill="var(--foreground)">
              파라미터 N 개 — 순전파 횟수 비교
            </text>

            {/* 범례 */}
            <rect x={24} y={28} width={10} height={10} rx={2} fill="#3b82f6" />
            <text x={40} y={37} fontSize={9} fill="#3b82f6">Forward mode (N 회)</text>
            <rect x={180} y={28} width={10} height={10} rx={2} fill="#f59e0b" />
            <text x={196} y={37} fontSize={9} fill="#f59e0b">Reverse mode (2 회)</text>

            {/* 행별 비교 */}
            {CASES.map((c, i) => {
              const y = 58 + i * 52;
              // log10 scale 로 막대 길이 계산
              const logMax = Math.log10(1e11);
              const fwdW   = (Math.log10(Math.max(c.n, 2)) / logMax) * 210;
              const revW   = (Math.log10(2) / logMax) * 210;

              return (
                <g key={c.label}>
                  {/* 케이스 레이블 */}
                  <text x={8} y={y + 10} fontSize={9} fontWeight={700}
                    fill="var(--foreground)">{c.label}</text>

                  {/* Forward 막대 배경 */}
                  <rect x={118} y={y} width={210} height={11} rx={2}
                    fill="var(--muted)" opacity={0.25} />
                  {showFwd && (
                    <motion.rect
                      x={118} y={y} height={11} rx={2} fill="#3b82f6"
                      initial={{ width: 0 }}
                      animate={{ width: fwdW }}
                      transition={{ ...sp, delay: i * 0.07 }}
                    />
                  )}
                  {showFwd && (
                    <motion.text
                      x={118 + fwdW + 4} y={y + 9}
                      fontSize={9} fontWeight={700} fill="#3b82f6"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ ...sp, delay: 0.15 + i * 0.07 }}>
                      {c.fwdLabel}
                    </motion.text>
                  )}

                  {/* Reverse 막대 배경 */}
                  <rect x={118} y={y + 14} width={210} height={11} rx={2}
                    fill="var(--muted)" opacity={0.25} />
                  {showRev && (
                    <motion.rect
                      x={118} y={y + 14} height={11} rx={2} fill="#f59e0b"
                      initial={{ width: 0 }}
                      animate={{ width: revW }}
                      transition={{ ...sp, delay: i * 0.07 }}
                    />
                  )}
                  {showRev && (
                    <motion.text
                      x={118 + revW + 4} y={y + 23}
                      fontSize={9} fontWeight={700} fill="#f59e0b"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ ...sp, delay: 0.15 + i * 0.07 }}>
                      2 회
                    </motion.text>
                  )}

                  {/* 노트 */}
                  {showNote && (
                    <motion.text x={8} y={y + 40} fontSize={9}
                      fill="var(--muted-foreground)"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ ...sp, delay: 0.2 + i * 0.05 }}>
                      {c.note}
                    </motion.text>
                  )}
                </g>
              );
            })}

            {/* 결론 배너 */}
            {showNote && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.35 }}>
                <rect x={12} y={226} width={456} height={36} rx={5}
                  fill="#ef444410" stroke="#ef4444" strokeWidth={0.8} />
                <text x={240} y={240} textAnchor="middle" fontSize={9} fontWeight={700}
                  fill="#ef4444">
                  Forward: O(N × forward) — Reverse: O(forward) — N 배 절감
                </text>
                <text x={240} y={254} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">
                  scalar loss + 대규모 파라미터 구조 → Reverse mode 가 유일한 선택
                </text>
              </motion.g>
            )}

            <text x={118} y={218} fontSize={9} fill="var(--muted-foreground)">
              막대 길이: log scale
            </text>
          </svg>
        );
      }}
    </StepViz>
  );
}
