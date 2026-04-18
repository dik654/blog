import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import type { StepDef } from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const STEPS: StepDef[] = [
  {
    label: '1. 기본 threshold 0.5가 최적이 아닌 이유',
    body: '불균형 데이터에서 모델의 확률 출력이 다수 클래스 쪽으로 편향\n예: 이상 비율 5% → 모델이 대부분 0.1~0.3 범위에서 예측\n0.5 기준이면 이상을 거의 탐지하지 못함\n→ threshold를 낮춰야 소수 클래스 Recall이 올라감',
  },
  {
    label: '2. PR Curve로 최적 threshold 탐색',
    body: 'PR(Precision-Recall) Curve: threshold를 0→1로 변화시키며\n각 지점의 Precision과 Recall을 그래프로 표시\nthreshold ↓ → Recall ↑, Precision ↓ (더 많이 양성 예측)\nthreshold ↑ → Recall ↓, Precision ↑ (확실한 것만 양성 예측)',
  },
  {
    label: '3. F1 최대화 threshold',
    body: 'F1 = 2 * Precision * Recall / (Precision + Recall)\nPrecision과 Recall의 조화 평균\nPR Curve 위에서 F1이 최대인 점 = 최적 threshold\nF-beta: beta > 1이면 Recall 중시, beta < 1이면 Precision 중시',
  },
  {
    label: '4. 비용 기반 threshold 결정',
    body: 'FP 비용(오탐) ≠ FN 비용(미탐)인 도메인이 대부분\n의료: FN 비용 >> FP 비용 → threshold 낮춤 (과탐 허용)\n스팸: FP 비용 >> FN 비용 → threshold 높임 (정상 보호)\nthreshold = C_FP / (C_FP + C_FN) 기반으로 결정',
  },
  {
    label: '5. 실전 threshold 튜닝 파이프라인',
    body: '1) 검증 세트에서 확률 예측 추출\n2) threshold 0.01~0.99를 0.01 단위로 스캔\n3) 각 threshold에서 F1(또는 비용 함수) 계산\n4) 최적 threshold 선택 → 테스트 세트에 적용\n주의: threshold 튜닝은 반드시 검증 세트에서 수행',
  },
];

export default function ThresholdViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 250" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: 왜 0.5가 부적절한가 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">Threshold 0.5의 문제</text>

              {/* 확률 분포 축 */}
              <line x1={40} y1={180} x2={480} y2={180} stroke="var(--border)" strokeWidth={1} />
              <text x={260} y={200} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                모델 예측 확률 P(이상)
              </text>
              {[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0].map((v) => (
                <text key={v} x={40 + v * 440} y={194} textAnchor="middle" fontSize={7}
                  fill="var(--muted-foreground)">{v}</text>
              ))}

              {/* 정상 분포 (왼쪽에 집중) */}
              {[
                { x: 60, h: 30 }, { x: 80, h: 80 }, { x: 100, h: 110 }, { x: 120, h: 90 },
                { x: 140, h: 50 }, { x: 160, h: 25 }, { x: 180, h: 10 },
              ].map((bar, i) => (
                <motion.rect key={`n-${i}`} x={bar.x} y={180 - bar.h} width={16} height={bar.h} rx={2}
                  fill="#3b82f6" fillOpacity={0.3} stroke="#3b82f6" strokeWidth={0.5}
                  initial={{ height: 0, y: 180 }} animate={{ height: bar.h, y: 180 - bar.h }}
                  transition={{ ...sp, delay: i * 0.05 }} />
              ))}
              <text x={120} y={55} textAnchor="middle" fontSize={9} fill="#3b82f6" fontWeight={600}>
                정상 (95%)
              </text>

              {/* 이상 분포 (넓게 퍼짐) */}
              {[
                { x: 120, h: 5 }, { x: 140, h: 10 }, { x: 160, h: 18 }, { x: 180, h: 25 },
                { x: 200, h: 30 }, { x: 220, h: 22 }, { x: 240, h: 15 }, { x: 260, h: 8 },
              ].map((bar, i) => (
                <motion.rect key={`a-${i}`} x={bar.x} y={180 - bar.h} width={16} height={bar.h} rx={2}
                  fill="#ef4444" fillOpacity={0.3} stroke="#ef4444" strokeWidth={0.5}
                  initial={{ height: 0, y: 180 }} animate={{ height: bar.h, y: 180 - bar.h }}
                  transition={{ ...sp, delay: 0.2 + i * 0.05 }} />
              ))}
              <text x={200} y={130} textAnchor="middle" fontSize={9} fill="#ef4444" fontWeight={600}>
                이상 (5%)
              </text>

              {/* Threshold 0.5 라인 */}
              <motion.line x1={260} y1={40} x2={260} y2={180}
                stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 3"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }} />
              <motion.text x={268} y={48} fontSize={10} fill="#f59e0b" fontWeight={700}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
                t=0.5
              </motion.text>

              {/* 경고 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
                <rect x={310} y={60} width={180} height={40} rx={6}
                  fill="#ef444410" stroke="#ef4444" strokeWidth={1} strokeDasharray="4 3" />
                <text x={400} y={78} textAnchor="middle" fontSize={9} fill="#ef4444" fontWeight={600}>
                  이상 대부분이 왼쪽에 위치
                </text>
                <text x={400} y={92} textAnchor="middle" fontSize={9} fill="#ef4444">
                  t=0.5 기준 → 거의 다 놓침
                </text>
              </motion.g>
            </motion.g>
          )}

          {/* Step 1: PR Curve */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">PR Curve</text>

              {/* 축 */}
              <line x1={80} y1={210} x2={380} y2={210} stroke="var(--border)" strokeWidth={1} />
              <line x1={80} y1={210} x2={80} y2={40} stroke="var(--border)" strokeWidth={1} />
              <text x={230} y={235} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">Recall</text>
              <text x={50} y={125} fontSize={9} fill="var(--muted-foreground)"
                transform="rotate(-90, 50, 125)">Precision</text>

              {/* 축 레이블 */}
              {[0, 0.25, 0.5, 0.75, 1.0].map((v) => (
                <g key={`ax-${v}`}>
                  <text x={80 + v * 300} y={224} textAnchor="middle" fontSize={7}
                    fill="var(--muted-foreground)">{v}</text>
                  <text x={72} y={210 - v * 170 + 3} textAnchor="end" fontSize={7}
                    fill="var(--muted-foreground)">{v}</text>
                </g>
              ))}

              {/* PR 곡선 */}
              <motion.polyline
                points="80,45 110,48 140,52 170,58 200,68 230,82 260,100 290,125 320,155 350,180 380,210"
                fill="none" stroke="#8b5cf6" strokeWidth={2.5}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }} />

              {/* 최적 포인트 */}
              <motion.circle cx={230} cy={82} r={6}
                fill="#10b981" fillOpacity={0.4} stroke="#10b981" strokeWidth={2}
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...sp, delay: 0.5 }} />
              <motion.text x={248} y={78} fontSize={9} fill="#10b981" fontWeight={600}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
                F1 최대점
              </motion.text>

              {/* 오른쪽 설명 */}
              <rect x={400} y={50} width={110} height={75} rx={6}
                fill="#8b5cf608" stroke="#8b5cf6" strokeWidth={1} />
              <text x={455} y={68} textAnchor="middle" fontSize={9} fontWeight={600} fill="#8b5cf6">
                Threshold 조정
              </text>
              <text x={455} y={86} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                t ↓ → Recall ↑
              </text>
              <text x={455} y={100} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                t ↑ → Precision ↑
              </text>
              <text x={455} y={114} textAnchor="middle" fontSize={8} fill="#10b981">
                최적점: 둘의 균형
              </text>

              {/* AUC 영역 표시 */}
              <motion.polygon
                points="80,210 80,45 110,48 140,52 170,58 200,68 230,82 260,100 290,125 320,155 350,180 380,210"
                fill="#8b5cf6" fillOpacity={0.08}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }} />
              <text x={200} y={170} fontSize={9} fill="#8b5cf6" fontWeight={600}>PR-AUC</text>
            </motion.g>
          )}

          {/* Step 2: F1 최대화 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">F1 Score와 Threshold 관계</text>

              {/* 수식 */}
              <rect x={130} y={30} width={260} height={28} rx={5}
                fill="#8b5cf610" stroke="#8b5cf6" strokeWidth={1.2} />
              <text x={260} y={48} textAnchor="middle" fontSize={11} fontFamily="monospace"
                fill="#8b5cf6" fontWeight={600}>F1 = 2PR / (P + R)</text>

              {/* F1 vs threshold 그래프 */}
              <line x1={60} y1={200} x2={460} y2={200} stroke="var(--border)" strokeWidth={1} />
              <line x1={60} y1={200} x2={60} y2={75} stroke="var(--border)" strokeWidth={1} />
              <text x={260} y={220} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Threshold
              </text>
              <text x={45} y={138} fontSize={9} fill="var(--muted-foreground)"
                transform="rotate(-90, 45, 138)">F1</text>

              {/* threshold 레이블 */}
              {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((v) => (
                <text key={v} x={60 + v * 400} y={214} textAnchor="middle" fontSize={7}
                  fill="var(--muted-foreground)">{v}</text>
              ))}

              {/* F1 곡선 (산 모양) */}
              <motion.polyline
                points="60,190 100,170 140,148 180,120 220,100 260,88 280,86 300,90 340,105 380,130 420,165 460,195"
                fill="none" stroke="#10b981" strokeWidth={2.5}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }} />

              {/* 최적점 */}
              <motion.circle cx={280} cy={86} r={7}
                fill="#ef4444" fillOpacity={0.3} stroke="#ef4444" strokeWidth={2}
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...sp, delay: 0.5 }} />
              <motion.line x1={280} y1={86} x2={280} y2={200}
                stroke="#ef4444" strokeWidth={1} strokeDasharray="4 3"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }} />
              <motion.text x={280} y={78} textAnchor="middle" fontSize={9} fill="#ef4444" fontWeight={700}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
                최적 t=0.35
              </motion.text>

              {/* 기본 0.5 표시 */}
              <motion.line x1={260} y1={88} x2={260} y2={200}
                stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 3"
                initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ ...sp, delay: 0.7 }} />
              <text x={255} y={78} textAnchor="end" fontSize={8} fill="#f59e0b">기본 t=0.5</text>

              {/* F-beta 설명 */}
              <rect x={340} y={140} width={160} height={48} rx={6}
                fill="#3b82f608" stroke="#3b82f6" strokeWidth={1} />
              <text x={420} y={156} textAnchor="middle" fontSize={9} fontWeight={600} fill="#3b82f6">
                F-beta Score
              </text>
              <text x={420} y={170} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                beta{'>'} 1: Recall 중시
              </text>
              <text x={420} y={182} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                beta{'<'}1: Precision 중시
              </text>
            </motion.g>
          )}

          {/* Step 3: 비용 기반 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">비용 기반 Threshold 결정</text>

              {/* FP vs FN 비교 */}
              <rect x={30} y={38} width={220} height={80} rx={8}
                fill="#ef444408" stroke="#ef4444" strokeWidth={1.2} />
              <text x={140} y={56} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">
                의료 진단
              </text>
              <text x={140} y={74} textAnchor="middle" fontSize={9} fill="var(--foreground)">
                FN(암 놓침): 생명 위험 = 비용 높음
              </text>
              <text x={140} y={90} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                FP(오탐): 추가 검사 = 비용 낮음
              </text>
              <text x={140} y={108} textAnchor="middle" fontSize={10} fill="#ef4444" fontWeight={600}>
                → threshold 낮춤 (0.2)
              </text>

              <rect x={270} y={38} width={220} height={80} rx={8}
                fill="#3b82f608" stroke="#3b82f6" strokeWidth={1.2} />
              <text x={380} y={56} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">
                스팸 필터
              </text>
              <text x={380} y={74} textAnchor="middle" fontSize={9} fill="var(--foreground)">
                FP(정상→스팸): 중요 메일 유실
              </text>
              <text x={380} y={90} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                FN(스팸 통과): 약간의 불편
              </text>
              <text x={380} y={108} textAnchor="middle" fontSize={10} fill="#3b82f6" fontWeight={600}>
                → threshold 높임 (0.8)
              </text>

              {/* 수식 */}
              <rect x={100} y={135} width={320} height={34} rx={6}
                fill="#8b5cf610" stroke="#8b5cf6" strokeWidth={1.2} />
              <text x={260} y={150} textAnchor="middle" fontSize={9} fill="var(--foreground)">
                비용 최적 threshold 근사:
              </text>
              <text x={260} y={164} textAnchor="middle" fontSize={11} fontFamily="monospace" fontWeight={600}
                fill="#8b5cf6">t* = C_FP / (C_FP + C_FN)</text>

              {/* 예시 */}
              <text x={260} y={192} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                예: C_FN = 100, C_FP = 10 → t* = 10/110 = 0.09 (낮은 threshold)
              </text>
              <text x={260} y={208} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                예: C_FN = 1, C_FP = 50 → t* = 50/51 = 0.98 (높은 threshold)
              </text>
            </motion.g>
          )}

          {/* Step 4: 튜닝 파이프라인 */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">Threshold 튜닝 파이프라인</text>

              {[
                { step: '1', label: '확률 예측', detail: 'model.predict_proba(X_val)', color: '#3b82f6', x: 30 },
                { step: '2', label: 't 스캔', detail: '0.01 ~ 0.99 순회', color: '#10b981', x: 145 },
                { step: '3', label: 'F1 계산', detail: '각 t에서 F1 측정', color: '#f59e0b', x: 260 },
                { step: '4', label: '최적 t 적용', detail: 'test에 적용', color: '#8b5cf6', x: 375 },
              ].map((item, i) => (
                <motion.g key={item.step} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.15 }}>
                  {/* 단계 원 */}
                  <circle cx={item.x + 55} cy={55} r={16}
                    fill={`${item.color}15`} stroke={item.color} strokeWidth={1.5} />
                  <text x={item.x + 55} y={60} textAnchor="middle" fontSize={12} fontWeight={700}
                    fill={item.color}>{item.step}</text>

                  {/* 라벨 */}
                  <text x={item.x + 55} y={85} textAnchor="middle" fontSize={10} fontWeight={600}
                    fill="var(--foreground)">{item.label}</text>
                  <text x={item.x + 55} y={100} textAnchor="middle" fontSize={8}
                    fill="var(--muted-foreground)">{item.detail}</text>

                  {/* 화살표 (마지막 제외) */}
                  {i < 3 && (
                    <line x1={item.x + 95} y1={55} x2={item.x + 110} y2={55}
                      stroke="var(--border)" strokeWidth={1} markerEnd="url(#arrow-th)" />
                  )}
                </motion.g>
              ))}

              <defs>
                <marker id="arrow-th" viewBox="0 0 6 6" refX={6} refY={3}
                  markerWidth={6} markerHeight={6} orient="auto-start-reverse">
                  <path d="M0,0 L6,3 L0,6 Z" fill="var(--border)" />
                </marker>
              </defs>

              {/* 코드 예시 */}
              <rect x={40} y={125} width={440} height={90} rx={8}
                fill="var(--muted)" fillOpacity={0.15} stroke="var(--border)" strokeWidth={0.8} />
              <text x={260} y={142} textAnchor="middle" fontSize={10} fontWeight={600}
                fill="var(--foreground)">Python 핵심 코드</text>
              <text x={55} y={160} fontSize={9} fontFamily="monospace" fill="#10b981">
                thresholds = np.arange(0.01, 1.0, 0.01)
              </text>
              <text x={55} y={175} fontSize={9} fontFamily="monospace" fill="#3b82f6">
                f1s = [f1_score(y_val, proba {'>'} t) for t in thresholds]
              </text>
              <text x={55} y={190} fontSize={9} fontFamily="monospace" fill="#8b5cf6">
                best_t = thresholds[np.argmax(f1s)]
              </text>
              <text x={55} y={205} fontSize={9} fontFamily="monospace" fill="#ef4444">
                y_pred = (model.predict_proba(X_test) {'>'} best_t)
              </text>

              {/* 주의 */}
              <rect x={100} y={222} width={320} height={22} rx={4}
                fill="#f59e0b10" stroke="#f59e0b" strokeWidth={0.8} />
              <text x={260} y={237} textAnchor="middle" fontSize={9} fill="#f59e0b" fontWeight={600}>
                threshold 튜닝은 반드시 검증 세트에서 수행 (test set 절대 X)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
