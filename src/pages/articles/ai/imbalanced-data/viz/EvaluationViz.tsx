import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import type { StepDef } from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const STEPS: StepDef[] = [
  {
    label: '1. Accuracy의 한계 — Confusion Matrix',
    body: 'TP(True Positive): 이상을 이상으로 맞춤\nFP(False Positive): 정상을 이상으로 오탐\nFN(False Negative): 이상을 정상으로 놓침 ← 가장 치명적\nTN(True Negative): 정상을 정상으로 맞춤\nAccuracy = (TP+TN)/(TP+FP+FN+TN) → TN이 지배',
  },
  {
    label: '2. Precision, Recall, F1-Score',
    body: 'Precision = TP / (TP + FP): 양성 예측 중 실제 양성 비율\nRecall = TP / (TP + FN): 실제 양성 중 탐지 비율\nF1 = 2 * P * R / (P + R): 둘의 조화 평균\n불균형에서는 Accuracy 대신 이 3지표가 핵심',
  },
  {
    label: '3. PR-AUC vs ROC-AUC',
    body: 'ROC-AUC: FPR(x) vs TPR(y) — TN이 많으면 FPR이 항상 낮음\n→ 불균형에서 ROC-AUC가 과도하게 낙관적\nPR-AUC: Recall(x) vs Precision(y) — TN을 사용하지 않음\n→ 소수 클래스 성능을 정확히 반영\n불균형 데이터에서는 PR-AUC가 더 유용한 지표',
  },
  {
    label: '4. Cohen\'s Kappa',
    body: 'Kappa = (p_o - p_e) / (1 - p_e)\np_o: 관측 일치율 (실제 accuracy)\np_e: 우연 일치율 (랜덤 예측의 기대 accuracy)\n해석: 0.0=우연 수준, 0.6+=상당한 일치, 0.8+=거의 완벽\n불균형에서 높은 accuracy를 "우연 수준"으로 보정',
  },
  {
    label: '5. MCC (Matthews Correlation Coefficient)',
    body: 'MCC = (TP*TN - FP*FN) / sqrt((TP+FP)(TP+FN)(TN+FP)(TN+FN))\n범위: -1(완전 반대) ~ 0(랜덤) ~ +1(완벽)\n4가지 값(TP,FP,FN,TN)을 모두 사용하는 유일한 단일 지표\n불균형에서도 편향 없이 모델 성능을 측정\n"전부 정상" 예측 → MCC = 0 (랜덤 수준)',
  },
  {
    label: '6. 평가 지표 선택 가이드',
    body: '경미한 불균형: F1-Score로 충분\n보통 불균형: PR-AUC + F1\n심각한 불균형: MCC + PR-AUC + Recall@K\n비용 비대칭: 비용 가중 F-beta\n모든 경우: Accuracy 단독 사용 금지',
  },
];

export default function EvaluationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 250" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: Confusion Matrix */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">Confusion Matrix (950 정상 + 50 이상)</text>

              {/* 행/열 헤더 */}
              <text x={260} y={42} textAnchor="middle" fontSize={10} fontWeight={600}
                fill="var(--muted-foreground)">예측</text>
              <text x={220} y={58} textAnchor="middle" fontSize={9} fill="#3b82f6">정상</text>
              <text x={320} y={58} textAnchor="middle" fontSize={9} fill="#ef4444">이상</text>
              <text x={140} y={100} textAnchor="middle" fontSize={9} fill="#3b82f6"
                transform="rotate(-90, 140, 100)">정상</text>
              <text x={140} y={165} textAnchor="middle" fontSize={9} fill="#ef4444"
                transform="rotate(-90, 140, 165)">이상</text>
              <text x={130} y={135} fontSize={10} fontWeight={600} fill="var(--muted-foreground)"
                transform="rotate(-90, 130, 135)">실제</text>

              {/* 4칸 매트릭스 */}
              <motion.rect x={170} y={65} width={100} height={55} rx={6}
                fill="#10b981" fillOpacity={0.12} stroke="#10b981" strokeWidth={1.5}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.1 }} />
              <text x={220} y={88} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">TN</text>
              <text x={220} y={108} textAnchor="middle" fontSize={14} fontWeight={700} fill="#10b981">940</text>

              <motion.rect x={270} y={65} width={100} height={55} rx={6}
                fill="#f59e0b" fillOpacity={0.12} stroke="#f59e0b" strokeWidth={1}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }} />
              <text x={320} y={88} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">FP</text>
              <text x={320} y={108} textAnchor="middle" fontSize={14} fontWeight={700} fill="#f59e0b">10</text>

              <motion.rect x={170} y={125} width={100} height={55} rx={6}
                fill="#ef4444" fillOpacity={0.12} stroke="#ef4444" strokeWidth={1.5}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }} />
              <text x={220} y={148} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444">FN</text>
              <text x={220} y={168} textAnchor="middle" fontSize={14} fontWeight={700} fill="#ef4444">20</text>

              <motion.rect x={270} y={125} width={100} height={55} rx={6}
                fill="#10b981" fillOpacity={0.12} stroke="#10b981" strokeWidth={1}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }} />
              <text x={320} y={148} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">TP</text>
              <text x={320} y={168} textAnchor="middle" fontSize={14} fontWeight={700} fill="#10b981">30</text>

              {/* 계산 */}
              <rect x={390} y={75} width={120} height={30} rx={4} fill="#64748b10" />
              <text x={450} y={94} textAnchor="middle" fontSize={9} fill="var(--foreground)">
                Acc = 970/1000
              </text>
              <text x={450} y={110} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
                = 97%
              </text>
              <rect x={390} y={130} width={120} height={30} rx={4} fill="#ef444410" />
              <text x={450} y={149} textAnchor="middle" fontSize={9} fill="var(--foreground)">
                Recall = 30/50
              </text>
              <text x={450} y={165} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">
                = 60%
              </text>

              <text x={260} y={210} textAnchor="middle" fontSize={10} fill="#ef4444" fontWeight={600}>
                Accuracy 97%지만 이상의 40%를 놓침!
              </text>
            </motion.g>
          )}

          {/* Step 1: Precision, Recall, F1 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">Precision, Recall, F1-Score</text>

              {[
                {
                  name: 'Precision', formula: 'TP / (TP + FP)', meaning: '양성 예측 중 진짜',
                  calc: '30 / (30+10) = 0.75', color: '#3b82f6', y: 40,
                },
                {
                  name: 'Recall', formula: 'TP / (TP + FN)', meaning: '실제 양성 중 탐지',
                  calc: '30 / (30+20) = 0.60', color: '#ef4444', y: 100,
                },
                {
                  name: 'F1-Score', formula: '2PR / (P+R)', meaning: 'P와 R의 조화 평균',
                  calc: '2*0.75*0.60 / 1.35 = 0.67', color: '#8b5cf6', y: 160,
                },
              ].map((m, i) => (
                <motion.g key={m.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.15 }}>
                  {/* 이름 */}
                  <rect x={25} y={m.y} width={100} height={40} rx={6}
                    fill={`${m.color}12`} stroke={m.color} strokeWidth={1.2} />
                  <text x={75} y={m.y + 18} textAnchor="middle" fontSize={11} fontWeight={700}
                    fill={m.color}>{m.name}</text>
                  <text x={75} y={m.y + 33} textAnchor="middle" fontSize={8}
                    fill="var(--muted-foreground)">{m.meaning}</text>

                  {/* 수식 */}
                  <rect x={145} y={m.y} width={150} height={40} rx={6}
                    fill={`${m.color}08`} stroke={m.color} strokeWidth={0.8} />
                  <text x={220} y={m.y + 25} textAnchor="middle" fontSize={10} fontFamily="monospace"
                    fill={m.color} fontWeight={600}>{m.formula}</text>

                  {/* 계산 */}
                  <rect x={315} y={m.y} width={185} height={40} rx={6}
                    fill="var(--muted)" fillOpacity={0.1} stroke="var(--border)" strokeWidth={0.5} />
                  <text x={407} y={m.y + 25} textAnchor="middle" fontSize={9} fontFamily="monospace"
                    fill="var(--foreground)">{m.calc}</text>
                </motion.g>
              ))}

              <rect x={80} y={215} width={360} height={24} rx={5}
                fill="#f59e0b10" stroke="#f59e0b" strokeWidth={1} />
              <text x={260} y={231} textAnchor="middle" fontSize={10} fill="#f59e0b" fontWeight={600}>
                불균형에서는 Accuracy(97%) 대신 F1(0.67)이 실질적 성능
              </text>
            </motion.g>
          )}

          {/* Step 2: PR-AUC vs ROC-AUC */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">PR-AUC vs ROC-AUC</text>

              {/* ROC 곡선 */}
              <g>
                <text x={130} y={40} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill="#3b82f6">ROC Curve</text>
                <line x1={40} y1={200} x2={230} y2={200} stroke="var(--border)" strokeWidth={0.8} />
                <line x1={40} y1={200} x2={40} y2={50} stroke="var(--border)" strokeWidth={0.8} />
                <text x={135} y={218} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">FPR</text>
                <text x={25} y={125} fontSize={8} fill="var(--muted-foreground)"
                  transform="rotate(-90, 25, 125)">TPR</text>

                {/* 대각선 */}
                <line x1={40} y1={200} x2={230} y2={50} stroke="var(--border)" strokeWidth={0.5}
                  strokeDasharray="3 3" />

                {/* ROC 곡선 (높은 AUC) */}
                <motion.polyline
                  points="40,200 50,120 70,85 100,65 140,57 180,54 230,50"
                  fill="none" stroke="#3b82f6" strokeWidth={2}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }} />

                <motion.polygon
                  points="40,200 50,120 70,85 100,65 140,57 180,54 230,50 230,200"
                  fill="#3b82f6" fillOpacity={0.08}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }} />

                <text x={150} y={145} fontSize={10} fontWeight={700} fill="#3b82f6">AUC=0.96</text>
                <text x={150} y={160} fontSize={8} fill="#3b82f6">과도하게 낙관적</text>
              </g>

              {/* PR 곡선 */}
              <g>
                <text x={395} y={40} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill="#8b5cf6">PR Curve</text>
                <line x1={290} y1={200} x2={490} y2={200} stroke="var(--border)" strokeWidth={0.8} />
                <line x1={290} y1={200} x2={290} y2={50} stroke="var(--border)" strokeWidth={0.8} />
                <text x={390} y={218} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">Recall</text>
                <text x={275} y={125} fontSize={8} fill="var(--muted-foreground)"
                  transform="rotate(-90, 275, 125)">Precision</text>

                {/* PR 곡선 (훨씬 낮은 AUC) */}
                <motion.polyline
                  points="290,55 310,58 340,65 370,80 400,105 430,140 460,170 490,200"
                  fill="none" stroke="#8b5cf6" strokeWidth={2}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }} />

                <motion.polygon
                  points="290,200 290,55 310,58 340,65 370,80 400,105 430,140 460,170 490,200"
                  fill="#8b5cf6" fillOpacity={0.08}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }} />

                <text x={400} y={145} fontSize={10} fontWeight={700} fill="#8b5cf6">AUC=0.68</text>
                <text x={400} y={160} fontSize={8} fill="#8b5cf6">현실적 성능 반영</text>
              </g>

              {/* 결론 */}
              <rect x={120} y={225} width={280} height={20} rx={4}
                fill="#ef444410" stroke="#ef4444" strokeWidth={0.8} />
              <text x={260} y={239} textAnchor="middle" fontSize={9} fill="#ef4444" fontWeight={600}>
                불균형 데이터 → ROC-AUC 0.96이 실제 성능 0.68을 숨김
              </text>
            </motion.g>
          )}

          {/* Step 3: Cohen's Kappa */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">Cohen's Kappa</text>

              {/* 수식 */}
              <rect x={130} y={32} width={260} height={30} rx={5}
                fill="#10b98110" stroke="#10b981" strokeWidth={1.2} />
              <text x={260} y={52} textAnchor="middle" fontSize={11} fontFamily="monospace"
                fill="#10b981" fontWeight={600}>Kappa = (p_o - p_e) / (1 - p_e)</text>

              {/* 변수 설명 */}
              <rect x={40} y={75} width={200} height={36} rx={5}
                fill="#3b82f608" stroke="#3b82f6" strokeWidth={0.8} />
              <text x={140} y={90} textAnchor="middle" fontSize={9} fill="#3b82f6" fontWeight={600}>
                p_o = 관측 일치율 = Accuracy
              </text>
              <text x={140} y={104} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                (940+30)/1000 = 0.97
              </text>

              <rect x={280} y={75} width={200} height={36} rx={5}
                fill="#f59e0b08" stroke="#f59e0b" strokeWidth={0.8} />
              <text x={380} y={90} textAnchor="middle" fontSize={9} fill="#f59e0b" fontWeight={600}>
                p_e = 우연 일치율
              </text>
              <text x={380} y={104} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                0.95*0.96 + 0.05*0.04 = 0.914
              </text>

              {/* 계산 */}
              <rect x={120} y={125} width={280} height={32} rx={5}
                fill="#8b5cf610" stroke="#8b5cf6" strokeWidth={1.2} />
              <text x={260} y={140} textAnchor="middle" fontSize={10} fill="var(--foreground)">
                Kappa = (0.97 - 0.914) / (1 - 0.914)
              </text>
              <text x={260} y={153} textAnchor="middle" fontSize={11} fontWeight={700} fill="#8b5cf6">
                = 0.65 (상당한 일치)
              </text>

              {/* 해석 스케일 */}
              <text x={260} y={178} textAnchor="middle" fontSize={10} fontWeight={600}
                fill="var(--foreground)">Kappa 해석 기준</text>

              <defs>
                <linearGradient id="kappa-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="30%" stopColor="#f59e0b" />
                  <stop offset="60%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <rect x={60} y={188} width={400} height={10} rx={5} fill="url(#kappa-grad)" opacity={0.4} />

              {[
                { val: '0.0', label: '우연', x: 60 },
                { val: '0.4', label: '보통', x: 220 },
                { val: '0.6', label: '상당', x: 300 },
                { val: '0.8', label: '완벽', x: 380 },
                { val: '1.0', label: '', x: 460 },
              ].map((k) => (
                <g key={k.val}>
                  <line x1={k.x} y1={186} x2={k.x} y2={200} stroke="var(--border)" strokeWidth={0.8} />
                  <text x={k.x} y={214} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{k.val}</text>
                  {k.label && <text x={k.x} y={226} textAnchor="middle" fontSize={8}
                    fill="var(--muted-foreground)">{k.label}</text>}
                </g>
              ))}

              {/* 현재 위치 마커 */}
              <motion.circle cx={320} cy={193} r={5} fill="#8b5cf6" stroke="#8b5cf6" strokeWidth={1}
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...sp, delay: 0.5 }} />
              <motion.text x={320} y={180} textAnchor="middle" fontSize={8} fill="#8b5cf6" fontWeight={600}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
                0.65
              </motion.text>
            </motion.g>
          )}

          {/* Step 4: MCC */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">MCC (Matthews Correlation Coefficient)</text>

              {/* 수식 */}
              <rect x={40} y={32} width={440} height={28} rx={5}
                fill="#8b5cf610" stroke="#8b5cf6" strokeWidth={1.2} />
              <text x={260} y={50} textAnchor="middle" fontSize={9} fontFamily="monospace"
                fill="#8b5cf6" fontWeight={600}>
                MCC = (TP*TN - FP*FN) / sqrt((TP+FP)(TP+FN)(TN+FP)(TN+FN))
              </text>

              {/* 범위 시각화 */}
              <defs>
                <linearGradient id="mcc-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="50%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
              <rect x={60} y={75} width={400} height={12} rx={6} fill="url(#mcc-grad)" opacity={0.35} />

              {[
                { val: '-1', label: '완전 반대', x: 60, color: '#ef4444' },
                { val: '0', label: '랜덤', x: 260, color: '#94a3b8' },
                { val: '+1', label: '완벽', x: 460, color: '#10b981' },
              ].map((m) => (
                <g key={m.val}>
                  <line x1={m.x} y1={73} x2={m.x} y2={90} stroke={m.color} strokeWidth={1} />
                  <text x={m.x} y={102} textAnchor="middle" fontSize={9} fontWeight={600} fill={m.color}>
                    {m.val}
                  </text>
                  <text x={m.x} y={115} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                    {m.label}
                  </text>
                </g>
              ))}

              {/* 비교 시나리오 */}
              {[
                { scenario: '"전부 정상" 예측', acc: '95%', mcc: '0.00', accColor: '#10b981', mccColor: '#94a3b8', y: 130 },
                { scenario: '약간 학습된 모델', acc: '97%', mcc: '0.65', accColor: '#10b981', mccColor: '#3b82f6', y: 165 },
                { scenario: '잘 학습된 모델', acc: '98%', mcc: '0.85', accColor: '#10b981', mccColor: '#10b981', y: 200 },
              ].map((s, i) => (
                <motion.g key={s.scenario} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.12 }}>
                  <rect x={30} y={s.y} width={160} height={26} rx={4}
                    fill="var(--muted)" fillOpacity={0.1} stroke="var(--border)" strokeWidth={0.5} />
                  <text x={110} y={s.y + 17} textAnchor="middle" fontSize={9}
                    fill="var(--foreground)">{s.scenario}</text>

                  <rect x={200} y={s.y} width={100} height={26} rx={4} fill={`${s.accColor}10`} />
                  <text x={250} y={s.y + 17} textAnchor="middle" fontSize={10} fontWeight={600}
                    fill={s.accColor}>Acc: {s.acc}</text>

                  <rect x={310} y={s.y} width={100} height={26} rx={4} fill={`${s.mccColor}10`} />
                  <text x={360} y={s.y + 17} textAnchor="middle" fontSize={10} fontWeight={600}
                    fill={s.mccColor}>MCC: {s.mcc}</text>

                  {i === 0 && (
                    <text x={470} y={s.y + 17} fontSize={9} fill="#ef4444" fontWeight={600}>
                      MCC가 진실
                    </text>
                  )}
                </motion.g>
              ))}
            </motion.g>
          )}

          {/* Step 5: 선택 가이드 */}
          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">평가 지표 선택 가이드</text>

              {[
                { ratio: '1:5', metrics: 'F1-Score', detail: '가장 기본적인 불균형 지표', color: '#10b981', y: 38 },
                { ratio: '1:20', metrics: 'PR-AUC + F1', detail: 'ROC-AUC는 보조로만 사용', color: '#3b82f6', y: 80 },
                { ratio: '1:100+', metrics: 'MCC + PR-AUC', detail: '가장 편향 없는 조합', color: '#f59e0b', y: 122 },
                { ratio: '비대칭 비용', metrics: 'F-beta + 비용함수', detail: 'beta로 P/R 가중치 조절', color: '#ef4444', y: 164 },
              ].map((item, i) => (
                <motion.g key={item.ratio} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.12 }}>
                  <rect x={25} y={item.y} width={85} height={30} rx={15}
                    fill={`${item.color}15`} stroke={item.color} strokeWidth={1.2} />
                  <text x={67} y={item.y + 19} textAnchor="middle" fontSize={9} fontWeight={700}
                    fill={item.color}>{item.ratio}</text>

                  <line x1={110} y1={item.y + 15} x2={135} y2={item.y + 15}
                    stroke={item.color} strokeWidth={1} />
                  <polygon points={`133,${item.y + 12} 133,${item.y + 18} 139,${item.y + 15}`}
                    fill={item.color} />

                  <rect x={142} y={item.y} width={140} height={30} rx={6}
                    fill={`${item.color}10`} stroke={item.color} strokeWidth={1} />
                  <text x={212} y={item.y + 19} textAnchor="middle" fontSize={10} fontWeight={600}
                    fill={item.color}>{item.metrics}</text>

                  <text x={300} y={item.y + 19} fontSize={9} fill="var(--muted-foreground)">
                    {item.detail}
                  </text>
                </motion.g>
              ))}

              {/* 경고 */}
              <rect x={60} y={208} width={400} height={28} rx={6}
                fill="#ef444410" stroke="#ef4444" strokeWidth={1} strokeDasharray="4 3" />
              <text x={260} y={226} textAnchor="middle" fontSize={11} fill="#ef4444" fontWeight={700}>
                Accuracy 단독 사용 금지 — 반드시 보조 지표 병행
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
