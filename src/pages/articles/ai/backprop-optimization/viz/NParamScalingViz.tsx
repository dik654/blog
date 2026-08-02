import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.45 };

const STEPS = [
  { label: '파라미터 N 개인 신경망 — Forward mode 는 편미분 하나당 순전파 1 회가 필요하다.' },
  { label: 'Forward mode: N 번의 순전파로 N 개의 gradient 를 각각 획득한다. 비용 = N × forward.' },
  { label: 'Reverse mode: 순전파 1 회로 중간값을 저장하고, 역전파 1 회로 N 개 gradient 를 동시에 획득한다.' },
  { label: 'GPT-4 수준 (파라미터 수 ~10¹¹) 이라면 Forward mode 는 수천억 번의 순전파가 필요 — Reverse mode 는 단 2 pass. 이 비대칭이 딥러닝의 전제다.' },
];

// 비교 행 정의
const ROWS = [
  { lbl: '소규모 (N=6)',   fwd: 6,     rev: 2,     note: '예제 모델 — 손으로 계산 가능' },
  { lbl: '중형  (N=10⁶)',  fwd: 1e6,   rev: 2,     note: 'ResNet-50 수준' },
  { lbl: 'GPT-4 (N=10¹¹)', fwd: 1e11,  rev: 2,     note: '수천억 번 vs 2 번' },
];

function fmtCount(n: number): string {
  if (n >= 1e11) return '~10¹¹ 회';
  if (n >= 1e6)  return '~10⁶ 회';
  return `${n} 회`;
}

export default function NParamScalingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const showFwd  = step >= 2;
        const showRev  = step >= 3;
        const showNote = step >= 4;

        // 막대 최대 너비 (px 기준 viewBox 내)
        const BAR_MAX = 180;

        return (
          <svg viewBox="0 0 480 260" className="w-full h-auto">
            {/* 제목 */}
            <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
              fill="var(--foreground)">
              파라미터 수 N 에 따른 pass 횟수 비교
            </text>

            {/* 범례 */}
            <rect x={30}  y={30} width={12} height={8} rx={1} fill="#3b82f6" />
            <text x={46}  y={38} fontSize={9} fill="#3b82f6">Forward mode (N 회)</text>
            <rect x={180} y={30} width={12} height={8} rx={1} fill="#f59e0b" />
            <text x={196} y={38} fontSize={9} fill="#f59e0b">Reverse mode (2 회)</text>

            {/* 행 */}
            {ROWS.map((row, i) => {
              const y = 60 + i * 50;
              // 정규화: 소규모=6 → 아주 작은 막대, GPT-4 → 최대
              // log scale 로 시각화
              const logMax = Math.log10(1e11);
              const logFwd = Math.log10(row.fwd);
              const fwdW   = (logFwd / logMax) * BAR_MAX;
              const revW   = (Math.log10(2) / logMax) * BAR_MAX;

              return (
                <g key={row.lbl}>
                  {/* 행 레이블 */}
                  <text x={8} y={y + 11} fontSize={9} fontWeight={700}
                    fill="var(--foreground)">
                    {row.lbl}
                  </text>

                  {/* Forward 막대 */}
                  <rect x={130} y={y} width={BAR_MAX} height={10} rx={2}
                    fill="var(--muted)" opacity={0.25} />
                  {showFwd && (
                    <motion.rect
                      x={130} y={y} height={10} rx={2} fill="#3b82f6"
                      initial={{ width: 0 }}
                      animate={{ width: fwdW }}
                      transition={{ ...sp, delay: i * 0.06 }}
                    />
                  )}
                  {showFwd && (
                    <motion.text
                      x={130 + fwdW + 4} y={y + 9}
                      fontSize={9} fontWeight={700} fill="#3b82f6"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ ...sp, delay: 0.15 + i * 0.06 }}>
                      {fmtCount(row.fwd)}
                    </motion.text>
                  )}

                  {/* Reverse 막대 */}
                  <rect x={130} y={y + 14} width={BAR_MAX} height={10} rx={2}
                    fill="var(--muted)" opacity={0.25} />
                  {showRev && (
                    <motion.rect
                      x={130} y={y + 14} height={10} rx={2} fill="#f59e0b"
                      initial={{ width: 0 }}
                      animate={{ width: revW }}
                      transition={{ ...sp, delay: i * 0.06 }}
                    />
                  )}
                  {showRev && (
                    <motion.text
                      x={130 + revW + 4} y={y + 23}
                      fontSize={9} fontWeight={700} fill="#f59e0b"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ ...sp, delay: 0.15 + i * 0.06 }}>
                      2 회
                    </motion.text>
                  )}

                  {/* 노트 */}
                  {showNote && (
                    <motion.text x={8} y={y + 38} fontSize={9}
                      fill="var(--muted-foreground)"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ ...sp, delay: 0.2 }}>
                      {row.note}
                    </motion.text>
                  )}
                </g>
              );
            })}

            {/* 하단 결론 배너 */}
            {showNote && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.3 }}>
                <rect x={20} y={215} width={440} height={36} rx={5}
                  fill="#ef444410" stroke="#ef4444" strokeWidth={0.8} />
                <text x={240} y={229} textAnchor="middle" fontSize={9} fontWeight={700}
                  fill="#ef4444">
                  Forward: O(N x forward) — Reverse: O(forward) — N 배 차이
                </text>
                <text x={240} y={243} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">
                  scalar loss + 대규모 파라미터 구조라면 Reverse mode 가 항상 우위
                </text>
              </motion.g>
            )}

            {/* x 축 log scale 안내 */}
            <text x={130} y={206} fontSize={9} fill="var(--muted-foreground)">
              막대 길이: log scale (선형 비교 불가 규모)
            </text>
          </svg>
        );
      }}
    </StepViz>
  );
}
