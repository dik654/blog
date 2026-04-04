import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

const STEPS = [
  { label: '1. 시퀀서 — L2의 블록 생성자', body: '시퀀서(Sequencer) = L2에서 트랜잭션을 수집 → 정렬 → 실행 → 블록 생성\n현재 대부분 중앙화된 단일 시퀀서 (OP: op-node, Arbitrum: sequencer)\n시퀀서가 다운되면? → L1 데이터로 L2 상태를 재구성 가능 (탈출 해치)' },
  { label: '2. 배치 — 비용 절감의 핵심', body: '배치(Batch) = 수백~수천 L2 TX를 묶어 L1에 한 번에 제출\nL1 기본 가스비(21,000 gas)를 1000개 TX가 분담 → TX당 21 gas로 감소\n압축: L2 블록 → zlib 압축 → 프레임 분할 → blob 또는 calldata로 L1 제출' },
  { label: '3. 배치 → L1 제출 과정', body: 'op-batcher가 L2 블록을 수집\n→ channelManager가 zlib 압축\n→ 프레임으로 분할 (blob 1개 = 128KB)\n→ DA 타입 동적 선택: blob 가스 < calldata면 blob 사용\n→ L1 트랜잭션으로 제출' },
  { label: '4. Fraud Proof — 일단 믿고 틀리면 증명', body: 'Optimistic Rollup의 핵심: 상태 루트를 "일단 맞다고 가정"\n7일 챌린지 기간 동안 아무도 이의 없으면 확정\n이의 제기 시 → Bisection Game으로 분쟁 범위를 반씩 좁힘\n1-of-N 보안: 정직한 검증자 1명만 있으면 안전' },
  { label: '5. Bisection Game — O(n) → O(log n)', body: 'L1에서 전체 L2 실행을 재현하면 가스 수십억 소모\n→ 대신 "어디서 결과가 갈리는지" 이진 탐색\n1단계: 10만 명령어 중 분쟁 → 5만으로 반감\n2단계: 5만 → 2.5만 → ... → 단일 명령어(MIPS)\n17단계만에 정확한 분쟁 지점 특정 (log₂(10만) ≈ 17)' },
  { label: '6. Validity Proof — 수학적 보장', body: 'ZK Rollup: SNARK/STARK 증명으로 상태 전이 정확성을 수학적 검증\n챌린지 기간 불필요 → 증명이 L1에서 통과하면 즉시 확정\n대신: 증명 생성에 GPU 수십 분~수 시간 소요\n트레이드오프: 빠른 확정 vs 높은 증명 비용' },
];

export default function CoreConceptsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: Sequencer 흐름 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {['사용자 TX', '시퀀서', 'L2 블록', 'L1 제출'].map((label, i) => {
                const x = 20 + i * 120;
                const colors = ['#6366f1', '#f59e0b', '#10b981', '#8b5cf6'];
                return (
                  <g key={label}>
                    <rect x={x} y={30} width={100} height={40} rx={6}
                      fill={`${colors[i]}15`} stroke={colors[i]} strokeWidth={1.2} />
                    <text x={x + 50} y={54} textAnchor="middle" fontSize={11} fontWeight={600} fill={colors[i]}>{label}</text>
                    {i < 3 && <text x={x + 106} y={54} fontSize={12} fill="var(--muted-foreground)">→</text>}
                  </g>
                );
              })}
              <text x={250} y={95} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                시퀀서가 다운되면? → L1 데이터로 L2 상태 재구성 가능 (탈출 해치)
              </text>
            </motion.g>
          )}

          {/* Step 1: Batch 비용 절감 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={230} y={20} textAnchor="middle" fontSize={11} fill="var(--foreground)">
                L1 기본 가스비를 TX 수로 분담
              </text>
              {/* 개별 제출 */}
              <rect x={20} y={35} width={180} height={36} rx={5} fill="#ef444410" stroke="#ef4444" strokeWidth={1} />
              <text x={110} y={50} textAnchor="middle" fontSize={10} fill="#ef4444">개별 제출: 1 TX = 21,000 gas</text>
              <text x={110} y={64} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">TX당 21,000 gas</text>
              {/* 배치 제출 */}
              <rect x={230} y={35} width={220} height={36} rx={5} fill="#10b98110" stroke="#10b981" strokeWidth={1.5} />
              <text x={340} y={50} textAnchor="middle" fontSize={10} fill="#10b981">배치: 1000 TX = 21,000 gas</text>
              <text x={340} y={64} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">TX당 21 gas (1000배 절감)</text>
              {/* 압축 과정 */}
              <text x={230} y={100} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                L2 블록 → zlib 압축 → 프레임 분할 → blob/calldata로 L1 제출
              </text>
            </motion.g>
          )}

          {/* Step 2: 배치 제출 과정 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {['L2 블록\n수집', 'zlib\n압축', '프레임\n분할', 'DA 선택\nblob/calldata', 'L1\n제출'].map((label, i) => {
                const x = 10 + i * 97;
                const colors = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
                return (
                  <g key={i}>
                    <motion.rect x={x} y={30} width={80} height={48} rx={5}
                      fill={`${colors[i]}12`} stroke={colors[i]} strokeWidth={1}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.12 }} />
                    {label.split('\n').map((l, li) => (
                      <text key={li} x={x + 40} y={50 + li * 14} textAnchor="middle"
                        fontSize={10} fontWeight={li === 0 ? 600 : 400} fill={colors[i]}>{l}</text>
                    ))}
                    {i < 4 && <text x={x + 86} y={58} fontSize={10} fill="var(--muted-foreground)">→</text>}
                  </g>
                );
              })}
              <text x={230} y={105} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                op-batcher → channelManager가 전체 과정 관리
              </text>
            </motion.g>
          )}

          {/* Step 3: Fraud Proof */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={20} y={15} width={130} height={40} rx={5} fill="#10b98112" stroke="#10b981" strokeWidth={1} />
              <text x={85} y={32} textAnchor="middle" fontSize={10} fill="#10b981" fontWeight={600}>상태 루트 제출</text>
              <text x={85} y={46} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">"일단 맞다고 가정"</text>

              <text x={165} y={38} fontSize={12} fill="var(--muted-foreground)">→</text>

              <rect x={180} y={15} width={130} height={40} rx={5} fill="#f59e0b12" stroke="#f59e0b" strokeWidth={1} />
              <text x={245} y={32} textAnchor="middle" fontSize={10} fill="#f59e0b" fontWeight={600}>7일 챌린지 기간</text>
              <text x={245} y={46} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">이의 없으면 확정</text>

              <text x={325} y={38} fontSize={12} fill="var(--muted-foreground)">→</text>

              <rect x={340} y={15} width={110} height={40} rx={5} fill="#ef444412" stroke="#ef4444" strokeWidth={1} />
              <text x={395} y={32} textAnchor="middle" fontSize={10} fill="#ef4444" fontWeight={600}>이의 제기 시</text>
              <text x={395} y={46} textAnchor="middle" fontSize={10} fill="#ef4444">Bisection Game</text>

              <text x={230} y={80} textAnchor="middle" fontSize={11} fill="#6366f1" fontWeight={600}>
                1-of-N 보안: 정직한 검증자 1명만 있으면 안전
              </text>
            </motion.g>
          )}

          {/* Step 4: Bisection Game */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={230} y={18} textAnchor="middle" fontSize={10} fill="var(--foreground)">
                10만 명령어 중 분쟁 → 이진 탐색으로 1개까지 좁힘
              </text>
              {[100000, 50000, 25000, 12500, '...', 1].map((n, i) => {
                const x = 25 + i * 72;
                const isLast = i === 5;
                const isDots = n === '...';
                return (
                  <g key={i}>
                    <motion.rect x={x} y={30} width={60} height={30} rx={4}
                      fill={isLast ? '#10b98120' : '#6366f110'}
                      stroke={isLast ? '#10b981' : '#6366f1'} strokeWidth={isLast ? 2 : 0.8}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.15 }} />
                    <text x={x + 30} y={50} textAnchor="middle" fontSize={isDots ? 14 : 10}
                      fontWeight={isLast ? 700 : 400} fill={isLast ? '#10b981' : '#6366f1'}>
                      {isDots ? '...' : typeof n === 'number' ? n.toLocaleString() : n}
                    </text>
                    {i < 5 && <text x={x + 64} y={48} fontSize={10} fill="var(--muted-foreground)">→</text>}
                  </g>
                );
              })}
              <text x={230} y={85} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                log₂(100,000) ≈ 17단계만에 단일 명령어(MIPS)까지 특정
              </text>
              <text x={230} y={105} textAnchor="middle" fontSize={10} fill="#10b981" fontWeight={600}>
                L1 가스: O(n) → O(log n) 으로 수만 배 절감
              </text>
            </motion.g>
          )}

          {/* Step 5: Validity Proof */}
          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={30} y={20} width={180} height={50} rx={6} fill="#ef444410" stroke="#ef4444" strokeWidth={1} />
              <text x={120} y={40} textAnchor="middle" fontSize={11} fill="#ef4444" fontWeight={600}>Optimistic</text>
              <text x={120} y={58} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">7일 챌린지 대기</text>

              <text x={230} y={48} fontSize={12} fill="var(--muted-foreground)">vs</text>

              <rect x={250} y={20} width={180} height={50} rx={6} fill="#10b98115" stroke="#10b981" strokeWidth={1.5} />
              <text x={340} y={40} textAnchor="middle" fontSize={11} fill="#10b981" fontWeight={600}>ZK (Validity)</text>
              <text x={340} y={58} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">증명 통과 → 즉시 확정</text>

              <text x={230} y={100} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                트레이드오프: 빠른 확정(ZK) vs 낮은 증명 비용(Optimistic)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
