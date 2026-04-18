import StepViz from '@/components/ui/step-viz';
import { motion } from 'framer-motion';
import { ActionBox, DataBox } from '@/components/viz/boxes';
import { STEPS, COLORS } from './HypothesisData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function HypothesisViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 250" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="hyp-arrow" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#888" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={24} textAnchor="middle" fontSize={12} fontWeight={700}
                fill="var(--foreground)">패턴 → 가설 수립</text>

              {[
                { pattern: '주문량↑ → 지연↑ (r=0.72)', why: '로봇 처리 용량 초과?', y: 50 },
                { pattern: '혼잡도↑ → 지연↑ (r=0.62)', why: '경로 충돌로 대기 시간 증가?', y: 95 },
                { pattern: '배터리↓ → 지연↑ (r=-0.30)', why: '충전 대기로 가용 로봇 감소?', y: 140 },
                { pattern: '15분 주기 패턴 관측', why: '교대/충전 스케줄과 관련?', y: 185 },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.12 }}>
                  <DataBox x={20} y={item.y} w={200} h={30} label={item.pattern} color={COLORS.finding} />
                  <line x1={225} y1={item.y + 15} x2={268} y2={item.y + 15}
                    stroke={COLORS.hypothesis} strokeWidth={1.2} markerEnd="url(#hyp-arrow)" opacity={0.6} />
                  <text x={246} y={item.y + 10} fontSize={10} fill={COLORS.hypothesis}>왜?</text>
                  <ActionBox x={275} y={item.y} w={220} h={30} label={item.why} color={COLORS.hypothesis} />
                </motion.g>
              ))}
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={24} textAnchor="middle" fontSize={12} fontWeight={700}
                fill="var(--foreground)">가설 검증: 로봇 수 구간별 지연</text>

              {/* boxplot 시뮬레이션 */}
              {[
                { label: '1~3대', median: 35, q1: 25, q3: 48, min: 10, max: 65, x: 70 },
                { label: '4~6대', median: 18, q1: 12, q3: 28, min: 5, max: 40, x: 170 },
                { label: '7~9대', median: 10, q1: 6, q3: 15, min: 2, max: 22, x: 270 },
                { label: '10대+', median: 6, q1: 3, q3: 10, min: 1, max: 15, x: 370 },
              ].map((box, i) => {
                const scale = 2.2;
                const base = 210;
                return (
                  <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ ...sp, delay: i * 0.1 }}>
                    {/* whisker */}
                    <line x1={box.x + 25} y1={base - box.max * scale} x2={box.x + 25} y2={base - box.min * scale}
                      stroke="var(--border)" strokeWidth={0.8} />
                    {/* 상단/하단 cap */}
                    <line x1={box.x + 15} y1={base - box.max * scale} x2={box.x + 35} y2={base - box.max * scale}
                      stroke="var(--border)" strokeWidth={0.8} />
                    <line x1={box.x + 15} y1={base - box.min * scale} x2={box.x + 35} y2={base - box.min * scale}
                      stroke="var(--border)" strokeWidth={0.8} />
                    {/* box */}
                    <rect x={box.x + 5} y={base - box.q3 * scale} width={40} height={(box.q3 - box.q1) * scale}
                      rx={3} fill={i === 0 ? COLORS.hypothesis : COLORS.finding} opacity={0.3}
                      stroke={i === 0 ? COLORS.hypothesis : COLORS.finding} strokeWidth={0.8} />
                    {/* median */}
                    <line x1={box.x + 5} y1={base - box.median * scale} x2={box.x + 45} y2={base - box.median * scale}
                      stroke={i === 0 ? COLORS.hypothesis : COLORS.finding} strokeWidth={2} />
                    <text x={box.x + 25} y={base + 16} textAnchor="middle" fontSize={9}
                      fill="var(--foreground)">{box.label}</text>
                  </motion.g>
                );
              })}
              <text x={50} y={60} fontSize={8} fill="var(--muted-foreground)">지연(분)</text>
              <text x={260} y={242} textAnchor="middle" fontSize={9} fill={COLORS.hypothesis}>
                로봇 {'<'} 5대일 때 중앙값 35분 vs 10대+ 중앙값 6분 → 가설 확인
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={24} textAnchor="middle" fontSize={12} fontWeight={700}
                fill="var(--foreground)">검증된 가설 → 피처 아이디어</text>

              {[
                { hypo: '로봇 포화 → 지연', features: ['robot_under_5 (이진)', '주문량/로봇수 (비율)'], y: 48 },
                { hypo: '경로 혼잡 → 대기', features: ['혼잡도 × 대기열 (인터랙션)', '혼잡도 이동평균'], y: 110 },
                { hypo: '배터리 부족 → 가용↓', features: ['저배터리 로봇 비율', 'is_battery_missing'], y: 172 },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.15 }}>
                  <rect x={20} y={item.y} width={160} height={42} rx={8} fill="var(--card)"
                    stroke={COLORS.hypothesis} strokeWidth={0.8} />
                  <text x={100} y={item.y + 18} textAnchor="middle" fontSize={9} fontWeight={600}
                    fill={COLORS.hypothesis}>{item.hypo}</text>
                  <text x={100} y={item.y + 33} textAnchor="middle" fontSize={7.5}
                    fill="var(--muted-foreground)">검증 완료 ✓</text>

                  <line x1={185} y1={item.y + 21} x2={220} y2={item.y + 21}
                    stroke={COLORS.feature} strokeWidth={1.2} markerEnd="url(#hyp-arrow)" opacity={0.6} />

                  {item.features.map((f, j) => (
                    <DataBox key={j} x={225} y={item.y + j * 24 - 2} w={260} h={22}
                      label={f} color={COLORS.feature} />
                  ))}
                </motion.g>
              ))}
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={24} textAnchor="middle" fontSize={12} fontWeight={700}
                fill="var(--foreground)">EDA 완료 체크리스트</text>

              {[
                { item: '타겟 분포 확인 & 변환 여부 결정', done: true },
                { item: '수치형 피처별 분포 & 이상치 확인', done: true },
                { item: '범주형 피처 카디널리티 & 빈도 확인', done: true },
                { item: '상관 행렬 & 타겟 상관 상위 피처 선정', done: true },
                { item: '다중공선성(VIF) 진단', done: true },
                { item: '결측 비율 & 패턴(MCAR/MAR/MNAR) 식별', done: true },
                { item: '시간 패턴 확인 (시계열 데이터인 경우)', done: true },
                { item: '가설 최소 3개 수립 & 시각화 검증', done: true },
                { item: '파생 피처 아이디어 목록 작성', done: true },
              ].map((check, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.06 }}>
                  <rect x={80} y={40 + i * 22} width={16} height={16} rx={4}
                    fill={check.done ? COLORS.feature : 'var(--border)'} opacity={check.done ? 0.8 : 0.3} />
                  <text x={88} y={53 + i * 22} textAnchor="middle" fontSize={10}
                    fill="#fff" fontWeight={700}>{check.done ? '✓' : ''}</text>
                  <text x={104} y={53 + i * 22} fontSize={9}
                    fill="var(--foreground)">{check.item}</text>
                </motion.g>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
