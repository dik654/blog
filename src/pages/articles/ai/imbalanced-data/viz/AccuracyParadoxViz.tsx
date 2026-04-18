import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import type { StepDef } from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const STEPS: StepDef[] = [
  {
    label: '1. 정상 95%, 이상 5% — 현실의 데이터',
    body: '사기 탐지, 불량 검출, 희귀 질환 진단 등\n실전 데이터는 대부분 한쪽 클래스가 압도적으로 많다',
  },
  {
    label: '2. "전부 정상" 예측 → 정확도 95%',
    body: 'Accuracy Paradox — 모델이 아무것도 학습하지 않아도\n다수 클래스만 출력하면 높은 정확도가 나온다\n이 모델은 이상 탐지 능력이 0%',
  },
  {
    label: '3. 실전 피해: 놓친 5%가 전부',
    body: '딥페이크 탐지: 5%를 놓치면 가짜 영상이 유포\n구조물 균열: 놓친 이상이 붕괴로 이어짐\n→ 소수 클래스의 Recall이 핵심 지표',
  },
  {
    label: '4. 불균형 비율별 전략',
    body: '1:5 (경미) → Class Weight 조정만으로 충분\n1:20 (보통) → SMOTE + Focal Loss 조합\n1:100 (심각) → 언더샘플링 + 앙상블 + 비용 민감 학습\n1:1000+ (극심) → 이상 탐지(Anomaly Detection)로 전환',
  },
];

export default function AccuracyParadoxViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 250" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: 데이터 분포 시각화 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">현실 데이터 분포</text>

              {/* 정상 바 */}
              <motion.rect x={40} y={45} width={0} height={40} rx={4}
                fill="#3b82f6" fillOpacity={0.2} stroke="#3b82f6" strokeWidth={1.2}
                initial={{ width: 0 }} animate={{ width: 380 }} transition={{ ...sp, duration: 0.8 }} />
              <motion.text x={230} y={70} textAnchor="middle" fontSize={14} fontWeight={700}
                fill="#3b82f6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
                정상 95%
              </motion.text>

              {/* 이상 바 */}
              <motion.rect x={420} y={45} width={0} height={40} rx={4}
                fill="#ef4444" fillOpacity={0.2} stroke="#ef4444" strokeWidth={1.2}
                initial={{ width: 0 }} animate={{ width: 60 }} transition={{ ...sp, duration: 0.8, delay: 0.2 }} />
              <motion.text x={450} y={70} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="#ef4444" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
                이상 5%
              </motion.text>

              {/* 실전 사례 */}
              {[
                { label: '사기 탐지', ratio: '0.1~2%', color: '#ef4444', x: 60 },
                { label: '불량 검출', ratio: '1~5%', color: '#f59e0b', x: 200 },
                { label: '희귀 질환', ratio: '0.01%', color: '#8b5cf6', x: 340 },
              ].map((c, i) => (
                <motion.g key={c.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: 0.4 + i * 0.15 }}>
                  <rect x={c.x} y={110} width={120} height={50} rx={6}
                    fill={`${c.color}10`} stroke={c.color} strokeWidth={1} />
                  <text x={c.x + 60} y={132} textAnchor="middle" fontSize={11} fontWeight={600}
                    fill={c.color}>{c.label}</text>
                  <text x={c.x + 60} y={148} textAnchor="middle" fontSize={10}
                    fill="var(--muted-foreground)">이상 비율: {c.ratio}</text>
                </motion.g>
              ))}

              <text x={260} y={190} textAnchor="middle" fontSize={10}
                fill="var(--muted-foreground)">모두 소수 클래스가 전체의 5% 미만</text>
            </motion.g>
          )}

          {/* Step 1: Accuracy Paradox */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">Accuracy Paradox</text>

              {/* 모델 박스 */}
              <rect x={180} y={38} width={160} height={36} rx={6}
                fill="#64748b12" stroke="#64748b" strokeWidth={1.2} />
              <text x={260} y={55} textAnchor="middle" fontSize={11} fontWeight={600}
                fill="#64748b">모델: 무조건 "정상" 출력</text>
              <text x={260} y={67} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">학습 없이 다수 클래스만 예측</text>

              {/* 화살표 */}
              <line x1={260} y1={74} x2={260} y2={92} stroke="var(--border)" strokeWidth={1} />
              <polygon points="256,90 264,90 260,96" fill="var(--border)" />

              {/* 결과 */}
              <rect x={120} y={100} width={130} height={50} rx={6}
                fill="#10b98112" stroke="#10b981" strokeWidth={1.2} />
              <text x={185} y={120} textAnchor="middle" fontSize={11} fontWeight={600}
                fill="#10b981">Accuracy: 95%</text>
              <text x={185} y={138} textAnchor="middle" fontSize={9}
                fill="#10b981">950/1000 맞춤</text>

              <rect x={270} y={100} width={130} height={50} rx={6}
                fill="#ef444412" stroke="#ef4444" strokeWidth={1.2} />
              <text x={335} y={120} textAnchor="middle" fontSize={11} fontWeight={600}
                fill="#ef4444">Recall: 0%</text>
              <text x={335} y={138} textAnchor="middle" fontSize={9}
                fill="#ef4444">이상 50개 전부 놓침</text>

              {/* 경고 */}
              <rect x={130} y={170} width={260} height={30} rx={6}
                fill="#ef444410" stroke="#ef4444" strokeWidth={1} strokeDasharray="4 3" />
              <text x={260} y={190} textAnchor="middle" fontSize={11} fontWeight={600}
                fill="#ef4444">높은 정확도 ≠ 좋은 모델</text>
            </motion.g>
          )}

          {/* Step 2: 놓친 소수 클래스의 비용 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">놓친 소수 클래스의 실전 비용</text>

              {[
                { domain: '딥페이크 탐지', miss: 'FN: 가짜 영상 유포', cost: '여론 조작, 명예 훼손', color: '#ef4444', y: 45 },
                { domain: '구조물 안전', miss: 'FN: 균열 미탐지', cost: '붕괴 사고', color: '#f59e0b', y: 105 },
                { domain: '의료 진단', miss: 'FN: 암 미발견', cost: '치료 시기 놓침', color: '#8b5cf6', y: 165 },
              ].map((item, i) => (
                <motion.g key={item.domain} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.15 }}>
                  {/* 도메인 */}
                  <rect x={30} y={item.y} width={110} height={40} rx={6}
                    fill={`${item.color}12`} stroke={item.color} strokeWidth={1.2} />
                  <text x={85} y={item.y + 24} textAnchor="middle" fontSize={11} fontWeight={600}
                    fill={item.color}>{item.domain}</text>

                  {/* 화살표 */}
                  <line x1={140} y1={item.y + 20} x2={168} y2={item.y + 20}
                    stroke={item.color} strokeWidth={1} />
                  <polygon points={`166,${item.y + 17} 166,${item.y + 23} 172,${item.y + 20}`}
                    fill={item.color} />

                  {/* FN */}
                  <rect x={175} y={item.y} width={140} height={40} rx={6}
                    fill={`${item.color}08`} stroke={item.color} strokeWidth={0.8} />
                  <text x={245} y={item.y + 24} textAnchor="middle" fontSize={10}
                    fill="var(--foreground)">{item.miss}</text>

                  {/* 화살표 2 */}
                  <line x1={315} y1={item.y + 20} x2={343} y2={item.y + 20}
                    stroke={item.color} strokeWidth={1} />
                  <polygon points={`341,${item.y + 17} 341,${item.y + 23} 347,${item.y + 20}`}
                    fill={item.color} />

                  {/* 비용 */}
                  <rect x={350} y={item.y} width={140} height={40} rx={6}
                    fill={`${item.color}06`} stroke={item.color} strokeWidth={0.8} strokeDasharray="4 3" />
                  <text x={420} y={item.y + 24} textAnchor="middle" fontSize={10} fontWeight={600}
                    fill={item.color}>{item.cost}</text>
                </motion.g>
              ))}

              <text x={260} y={230} textAnchor="middle" fontSize={10}
                fill="var(--muted-foreground)">FN(False Negative) 비용이 FP보다 훨씬 큰 도메인에서 불균형이 치명적</text>
            </motion.g>
          )}

          {/* Step 3: 비율별 전략 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">불균형 비율별 대응 전략</text>

              {[
                { ratio: '1:5', severity: '경미', strategy: 'Class Weight', color: '#10b981', x: 20 },
                { ratio: '1:20', severity: '보통', strategy: 'SMOTE + Focal', color: '#3b82f6', x: 145 },
                { ratio: '1:100', severity: '심각', strategy: '앙상블 + Cost', color: '#f59e0b', x: 270 },
                { ratio: '1:1000+', severity: '극심', strategy: 'Anomaly Det.', color: '#ef4444', x: 395 },
              ].map((item, i) => (
                <motion.g key={item.ratio} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.12 }}>
                  {/* 비율 뱃지 */}
                  <rect x={item.x} y={40} width={105} height={28} rx={14}
                    fill={`${item.color}15`} stroke={item.color} strokeWidth={1.2} />
                  <text x={item.x + 52} y={58} textAnchor="middle" fontSize={12} fontWeight={700}
                    fill={item.color}>{item.ratio}</text>

                  {/* 심각도 */}
                  <text x={item.x + 52} y={86} textAnchor="middle" fontSize={10}
                    fill="var(--muted-foreground)">{item.severity}</text>

                  {/* 화살표 */}
                  <line x1={item.x + 52} y1={92} x2={item.x + 52} y2={108}
                    stroke={item.color} strokeWidth={1} strokeDasharray="2 2" />

                  {/* 전략 박스 */}
                  <rect x={item.x} y={110} width={105} height={36} rx={6}
                    fill={`${item.color}10`} stroke={item.color} strokeWidth={1} />
                  <text x={item.x + 52} y={132} textAnchor="middle" fontSize={10} fontWeight={600}
                    fill={item.color}>{item.strategy}</text>
                </motion.g>
              ))}

              {/* 그라디언트 바 */}
              <defs>
                <linearGradient id="severity-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="33%" stopColor="#3b82f6" />
                  <stop offset="66%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
              <rect x={40} y={170} width={440} height={6} rx={3} fill="url(#severity-grad)" opacity={0.4} />
              <text x={40} y={192} fontSize={9} fill="#10b981">가벼운 조정</text>
              <text x={480} y={192} textAnchor="end" fontSize={9} fill="#ef4444">패러다임 전환</text>

              <text x={260} y={220} textAnchor="middle" fontSize={10}
                fill="var(--muted-foreground)">비율이 심해질수록 단순 리샘플링 → 손실 설계 → 아키텍처 전환이 필요</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
