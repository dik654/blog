import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import type { StepDef } from '@/components/ui/step-viz';

const steps: StepDef[] = [
  {
    label: 'Confusion Matrix — 분류 지표의 기초',
    body: '모든 분류 지표는 TP, FP, FN, TN 네 칸에서 출발.\nTrue Positive: 양성을 양성으로 맞춤. False Positive: 음성을 양성으로 잘못 분류.\nFalse Negative: 양성을 음성으로 놓침. True Negative: 음성을 음성으로 맞춤.',
  },
  {
    label: 'AUC-ROC — threshold 무관 랭킹 능력',
    body: 'AUC = Area Under ROC Curve. ROC: FPR(x축) vs TPR(y축).\nthreshold를 0→1로 이동하면서 만드는 곡선 아래 면적.\nAUC=0.5 랜덤, AUC=1.0 완벽 분리. "양성 점수 > 음성 점수"인 확률과 같다.',
  },
  {
    label: 'F1 Score — Precision과 Recall의 조화평균',
    body: 'Precision = TP/(TP+FP): 양성 예측 중 실제 양성 비율.\nRecall = TP/(TP+FN): 실제 양성 중 포착한 비율.\nF1 = 2*P*R/(P+R) — 둘 중 하나라도 낮으면 F1이 급락.\nthreshold 튜닝이 핵심.',
  },
  {
    label: 'LogLoss — 확률 보정 품질',
    body: 'LogLoss = -(1/n) * sum( yi*log(pi) + (1-yi)*log(1-pi) ).\n잘못된 확신에 폭발적 패널티. "0.99로 예측했는데 틀림" → 큰 손실.\n모델이 내뱉는 확률 자체의 정확성(calibration)을 측정.',
  },
  {
    label: 'MCC — 불균형 데이터에서 가장 robust한 단일 지표',
    body: 'MCC = (TP*TN - FP*FN) / sqrt((TP+FP)(TP+FN)(TN+FP)(TN+FN)).\n-1(완전 역상관) ~ 0(랜덤) ~ 1(완벽).\n4개 칸을 모두 사용 → 불균형에서도 기만적 높은 점수 방지.',
  },
];

function StepContent({ step }: { step: number }) {
  if (step === 0) {
    // Confusion Matrix
    const cells = [
      { r: 0, c: 0, label: 'TP', val: 85, color: '#10b981', desc: '양성→양성' },
      { r: 0, c: 1, label: 'FP', val: 15, color: '#ef4444', desc: '음성→양성' },
      { r: 1, c: 0, label: 'FN', val: 10, color: '#f59e0b', desc: '양성→음성' },
      { r: 1, c: 1, label: 'TN', val: 890, color: '#3b82f6', desc: '음성→음성' },
    ];
    const cellW = 100;
    const cellH = 72;
    const rowGap = 12;
    const gridX = 195;
    const gridY = 68;
    const metrics = [
      { x: 58, name: 'Acc', val: '97.5%', desc: '정확도', formula: '(TP+TN)/전체', color: '#10b981' },
      { x: 148, name: 'P', val: '85%', desc: '정밀도', formula: 'TP/(TP+FP)', color: '#3b82f6' },
      { x: 238, name: 'R', val: '89.5%', desc: '재현율', formula: 'TP/(TP+FN)', color: '#f59e0b' },
      { x: 332, name: 'F1', val: '87.2%', desc: '조화평균', formula: '2·P·R/(P+R)', color: '#8b5cf6' },
      { x: 422, name: 'MCC', val: '0.88', desc: '상관계수', formula: 'Matthews', color: '#ef4444' },
    ];
    return (
      <svg viewBox="0 0 480 320" className="w-full max-w-2xl">
        <text x={240} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
          Confusion Matrix — 4칸이 모든 분류 지표의 원천
        </text>
        {/* axis labels */}
        <text x={290} y={40} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">예측</text>
        <text x={245} y={58} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">양성</text>
        <text x={355} y={58} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">음성</text>
        <text x={152} y={150} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)" transform="rotate(-90, 152, 150)">실제</text>
        <text x={180} y={108} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">양성</text>
        <text x={180} y={192} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">음성</text>
        {cells.map((cell, i) => {
          const x = gridX + cell.c * (cellW + 10);
          const y = gridY + cell.r * (cellH + rowGap);
          return (
            <motion.g key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.12 }}>
              <rect x={x} y={y} width={cellW} height={cellH} rx={8}
                fill={cell.color} fillOpacity={0.12} stroke={cell.color} strokeWidth={1.5} />
              <text x={x + cellW / 2} y={y + 22} textAnchor="middle" fontSize={14} fontWeight={700} fill={cell.color}>
                {cell.label}
              </text>
              <text x={x + cellW / 2} y={y + 42} textAnchor="middle" fontSize={11} fill="var(--foreground)">
                {cell.val}
              </text>
              <text x={x + cellW / 2} y={y + 58} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                {cell.desc}
              </text>
            </motion.g>
          );
        })}
        {/* derived metrics with descriptions */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <rect x={20} y={236} width={440} height={72} rx={8}
            fill="var(--muted)" fillOpacity={0.15} stroke="var(--border)" strokeWidth={0.5} />
          <text x={240} y={252} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">
            4칸에서 파생되는 5대 분류 지표
          </text>
          {metrics.map((m, i) => (
            <g key={i}>
              <text x={m.x} y={272} textAnchor="middle" fontSize={10} fontWeight={700} fill={m.color}>
                {m.name}={m.val}
              </text>
              <text x={m.x} y={286} textAnchor="middle" fontSize={8} fill="var(--foreground)">
                {m.desc}
              </text>
              <text x={m.x} y={299} textAnchor="middle" fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">
                {m.formula}
              </text>
            </g>
          ))}
        </motion.g>
      </svg>
    );
  }
  if (step === 1) {
    // AUC-ROC curve
    const rocPoints = [
      { fpr: 0, tpr: 0 },
      { fpr: 0.02, tpr: 0.3 },
      { fpr: 0.05, tpr: 0.55 },
      { fpr: 0.1, tpr: 0.72 },
      { fpr: 0.2, tpr: 0.85 },
      { fpr: 0.4, tpr: 0.93 },
      { fpr: 0.6, tpr: 0.97 },
      { fpr: 0.8, tpr: 0.99 },
      { fpr: 1.0, tpr: 1.0 },
    ];
    const sx = (v: number) => 60 + v * 240;
    const sy = (v: number) => 190 - v * 150;
    const pathD = rocPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${sx(p.fpr)} ${sy(p.tpr)}`).join(' ');
    const fillD = pathD + ` L ${sx(1)} ${sy(0)} L ${sx(0)} ${sy(0)} Z`;
    return (
      <svg viewBox="0 0 480 220" className="w-full max-w-2xl">
        <text x={240} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
          AUC-ROC: threshold 전체를 아우르는 단일 숫자
        </text>
        {/* axes */}
        <line x1={60} y1={190} x2={310} y2={190} stroke="var(--border)" strokeWidth={1} />
        <line x1={60} y1={40} x2={60} y2={190} stroke="var(--border)" strokeWidth={1} />
        <text x={185} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">FPR (False Positive Rate)</text>
        <text x={30} y={115} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)" transform="rotate(-90, 30, 115)">TPR</text>
        {/* diagonal (random) */}
        <line x1={sx(0)} y1={sy(0)} x2={sx(1)} y2={sy(1)}
          stroke="var(--border)" strokeWidth={1} strokeDasharray="4 3" />
        <text x={sx(0.6)} y={sy(0.52)} fontSize={8} fill="var(--muted-foreground)">랜덤 (AUC=0.5)</text>
        {/* ROC curve fill */}
        <motion.path d={fillD} fill="#3b82f6" fillOpacity={0.1}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
        {/* ROC curve line */}
        <motion.path d={pathD} fill="none" stroke="#3b82f6" strokeWidth={2.5}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
        {/* AUC label */}
        <motion.text x={sx(0.35)} y={sy(0.35)} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="#3b82f6" fillOpacity={0.6}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          AUC=0.92
        </motion.text>
        {/* Right side: interpretation */}
        <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <rect x={330} y={40} width={140} height={160} rx={8}
            fill="var(--muted)" fillOpacity={0.1} stroke="var(--border)" strokeWidth={0.5} />
          <text x={400} y={60} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">AUC 해석</text>
          <line x1={340} y1={66} x2={460} y2={66} stroke="var(--border)" strokeWidth={0.5} />
          {[
            { val: '1.0', desc: '완벽 분리', color: '#10b981' },
            { val: '0.9+', desc: '매우 우수', color: '#3b82f6' },
            { val: '0.8', desc: '양호', color: '#f59e0b' },
            { val: '0.7', desc: '보통', color: '#f59e0b' },
            { val: '0.5', desc: '랜덤 추측', color: '#ef4444' },
          ].map((item, i) => (
            <g key={i}>
              <text x={360} y={86 + i * 24} textAnchor="middle" fontSize={10} fontWeight={600} fill={item.color}>{item.val}</text>
              <text x={420} y={86 + i * 24} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{item.desc}</text>
            </g>
          ))}
        </motion.g>
      </svg>
    );
  }
  if (step === 2) {
    // F1: Precision-Recall tradeoff
    const thresholds = [
      { t: 0.3, p: 0.60, r: 0.95, f1: 0.737 },
      { t: 0.4, p: 0.72, r: 0.88, f1: 0.792 },
      { t: 0.5, p: 0.85, r: 0.75, f1: 0.797 },
      { t: 0.6, p: 0.92, r: 0.60, f1: 0.726 },
      { t: 0.7, p: 0.97, r: 0.40, f1: 0.566 },
    ];
    // Layout: Thr 25 | Precision bar 55..135 | P% label 155..180 | Recall bar 225..305 | R% label 325..350 | F1 400
    const pBarMax = 80;
    const pBarX = 55;
    const rBarMax = 80;
    const rBarX = 225;
    return (
      <svg viewBox="0 0 480 360" className="w-full max-w-2xl">
        <text x={240} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
          F1: threshold에 따라 Precision-Recall 균형 변화
        </text>
        <text x={240} y={32} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          F1 = 2 · Precision · Recall / (Precision + Recall)
        </text>

        {/* headers */}
        <text x={25} y={54} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Thr</text>
        <text x={95} y={54} textAnchor="middle" fontSize={9} fontWeight={600} fill="#3b82f6">Precision</text>
        <text x={265} y={54} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">Recall</text>
        <text x={400} y={54} textAnchor="middle" fontSize={9} fontWeight={600} fill="#8b5cf6">F1</text>
        <line x1={12} y1={60} x2={468} y2={60} stroke="var(--border)" strokeWidth={0.5} />

        {thresholds.map((row, i) => {
          const y = 78 + i * 26;
          const isBest = row.t === 0.5;
          return (
            <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}>
              {isBest && <rect x={12} y={y - 11} width={456} height={22} rx={4}
                fill="#8b5cf6" fillOpacity={0.06} stroke="#8b5cf6" strokeWidth={1} />}
              <text x={25} y={y + 3} textAnchor="middle" fontSize={10} fontWeight={600}
                fill={isBest ? '#8b5cf6' : 'var(--foreground)'}>{row.t}</text>
              {/* Precision bar */}
              <rect x={pBarX} y={y - 6} width={row.p * pBarMax} height={12} rx={3}
                fill="#3b82f6" fillOpacity={0.25} stroke="#3b82f6" strokeWidth={0.5} />
              <text x={185} y={y + 3} textAnchor="end" fontSize={8} fontWeight={600} fill="#3b82f6">
                {(row.p * 100).toFixed(0)}%
              </text>
              {/* Recall bar */}
              <rect x={rBarX} y={y - 6} width={row.r * rBarMax} height={12} rx={3}
                fill="#10b981" fillOpacity={0.25} stroke="#10b981" strokeWidth={0.5} />
              <text x={355} y={y + 3} textAnchor="end" fontSize={8} fontWeight={600} fill="#10b981">
                {(row.r * 100).toFixed(0)}%
              </text>
              {/* F1 */}
              <text x={400} y={y + 3} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={isBest ? '#8b5cf6' : 'var(--muted-foreground)'}>{row.f1.toFixed(3)}</text>
            </motion.g>
          );
        })}

        {/* Conclusion line */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <text x={240} y={224} textAnchor="middle" fontSize={9} fontWeight={600} fill="#8b5cf6">
            threshold=0.5에서 F1 최대 (0.797) — Precision과 Recall이 가장 균형
          </text>
        </motion.g>

        {/* Precision / Recall 정의 카드 */}
        <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <rect x={12} y={238} width={222} height={58} rx={6}
            fill="#3b82f6" fillOpacity={0.05} stroke="#3b82f6" strokeWidth={0.8} />
          <text x={123} y={254} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">
            Precision (정밀도)
          </text>
          <text x={123} y={270} textAnchor="middle" fontSize={8} fontFamily="monospace" fill="var(--foreground)">
            TP / (TP + FP)
          </text>
          <text x={123} y={283} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
            "양성이라 말한 것 중 진짜 양성 비율"
          </text>
          <text x={123} y={293} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
            FP(오탐)가 싫을 때 — 스팸 필터
          </text>
          <rect x={246} y={238} width={222} height={58} rx={6}
            fill="#10b981" fillOpacity={0.05} stroke="#10b981" strokeWidth={0.8} />
          <text x={357} y={254} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">
            Recall (재현율)
          </text>
          <text x={357} y={270} textAnchor="middle" fontSize={8} fontFamily="monospace" fill="var(--foreground)">
            TP / (TP + FN)
          </text>
          <text x={357} y={283} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
            "실제 양성 중 모델이 잡아낸 비율"
          </text>
          <text x={357} y={293} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
            FN(놓침)이 싫을 때 — 암 진단·딥페이크
          </text>
        </motion.g>

        {/* 조화평균이 왜 곱하고 나누는지 설명 */}
        <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <rect x={12} y={304} width={456} height={48} rx={6}
            fill="#8b5cf6" fillOpacity={0.05} stroke="#8b5cf6" strokeWidth={0.8} />
          <text x={240} y={320} textAnchor="middle" fontSize={9} fontWeight={700} fill="#8b5cf6">
            왜 곱하고 나누는가? — 조화평균(Harmonic Mean)
          </text>
          <text x={240} y={333} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
            산술평균은 "한쪽이 1, 반대가 0"이어도 0.5 → 좋아 보임
          </text>
          <text x={240} y={345} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
            조화평균은 둘 중 하나라도 0에 가까우면 급락 → 양쪽 다 높아야만 F1이 높아짐
          </text>
        </motion.g>
      </svg>
    );
  }
  if (step === 3) {
    // LogLoss: penalty for wrong confidence
    const examples = [
      { true_label: 1, pred: 0.95, loss: 0.051, good: true },
      { true_label: 1, pred: 0.7, loss: 0.357, good: true },
      { true_label: 1, pred: 0.3, loss: 1.204, good: false },
      { true_label: 1, pred: 0.05, loss: 2.996, good: false },
    ];
    const maxLoss = 3.0;
    return (
      <svg viewBox="0 0 480 300" className="w-full max-w-2xl">
        <text x={240} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
          LogLoss: 잘못된 확신에 폭발적 패널티
        </text>
        <text x={240} y={32} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          LogLoss = −(1/n) · Σ( yᵢ·log(pᵢ) + (1−yᵢ)·log(1−pᵢ) )
        </text>
        {/* scenario: true label = 1 */}
        <text x={240} y={50} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          실제 라벨 = 1 (양성)일 때 예측 확률에 따른 손실
        </text>
        {examples.map((ex, i) => {
          const y = 66 + i * 34;
          const barW = (ex.loss / maxLoss) * 240;
          return (
            <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12 }}>
              <text x={45} y={y + 14} textAnchor="middle" fontSize={10} fontWeight={600}
                fill={ex.good ? '#10b981' : '#ef4444'}>p={ex.pred}</text>
              {/* loss bar */}
              <rect x={80} y={y + 2} width={barW} height={20} rx={4}
                fill={ex.good ? '#10b981' : '#ef4444'} fillOpacity={0.2}
                stroke={ex.good ? '#10b981' : '#ef4444'} strokeWidth={0.8} />
              <text x={84 + barW} y={y + 16} fontSize={9} fontWeight={600}
                fill={ex.good ? '#10b981' : '#ef4444'}>
                loss={ex.loss.toFixed(3)}
              </text>
              {/* confidence indicator */}
              {!ex.good && (
                <text x={460} y={y + 16} textAnchor="end" fontSize={8} fill="#ef4444">
                  {ex.pred < 0.1 ? '극심한 패널티' : '큰 패널티'}
                </text>
              )}
            </motion.g>
          );
        })}
        {/* Conclusion — placed below all bars with safe gap */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <rect x={20} y={218} width={440} height={48} rx={6}
            fill="#ef4444" fillOpacity={0.06} stroke="#ef4444" strokeWidth={0.8} />
          <text x={240} y={236} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ef4444">
            p=0.05 vs p=0.95 — loss 차이가 약 58배
          </text>
          <text x={240} y={250} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
            "확신을 갖고 틀리면" 손실이 지수적으로 커짐
          </text>
          <text x={240} y={262} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
            → 모델이 확률을 정직하게 보정(calibration)하도록 강제
          </text>
        </motion.g>
      </svg>
    );
  }
  // step 4: MCC
  return (
    <svg viewBox="0 0 480 440" className="w-full max-w-2xl">
      <text x={240} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
        MCC: 불균형 데이터에서 기만적 정확도 방지
      </text>
      <text x={240} y={32} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
        MCC = (TP·TN − FP·FN) / √( (TP+FP)(TP+FN)(TN+FP)(TN+FN) )
      </text>
      {/* Scenario: 99% negative, model predicts all negative */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <rect x={20} y={44} width={210} height={100} rx={8}
          fill="#ef4444" fillOpacity={0.06} stroke="#ef4444" strokeWidth={1.2} />
        <text x={125} y={62} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444">
          나쁜 모델: "전부 음성"
        </text>
        <text x={125} y={80} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          1000개 중 990개 음성, 10개 양성
        </text>
        <text x={125} y={96} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          TP=0, FP=0, FN=10, TN=990
        </text>
        <text x={80} y={116} fontSize={10} fontWeight={600} fill="#f59e0b">Accuracy=99%</text>
        <text x={80} y={132} fontSize={10} fontWeight={600} fill="#10b981">MCC=0.00</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <rect x={250} y={44} width={210} height={100} rx={8}
          fill="#10b981" fillOpacity={0.06} stroke="#10b981" strokeWidth={1.2} />
        <text x={355} y={62} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
          좋은 모델: 실제 분류
        </text>
        <text x={355} y={80} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          같은 데이터
        </text>
        <text x={355} y={96} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          TP=8, FP=5, FN=2, TN=985
        </text>
        <text x={310} y={116} fontSize={10} fontWeight={600} fill="#f59e0b">Accuracy=99.3%</text>
        <text x={310} y={132} fontSize={10} fontWeight={600} fill="#10b981">MCC=0.77</text>
      </motion.g>
      {/* Comparison arrow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <line x1={233} y1={94} x2={247} y2={94} stroke="var(--border)" strokeWidth={1.5}
          markerEnd="url(#arrowMcc)" />
        <defs>
          <marker id="arrowMcc" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
            <path d="M0,0 L6,3 L0,6" fill="var(--border)" />
          </marker>
        </defs>
      </motion.g>
      {/* Conclusion */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={20} y={156} width={440} height={52} rx={8}
          fill="#8b5cf6" fillOpacity={0.06} stroke="#8b5cf6" strokeWidth={1} />
        <text x={240} y={174} textAnchor="middle" fontSize={10} fontWeight={600} fill="#8b5cf6">
          Accuracy: 99% vs 99.3% — 차이 미미, 나쁜 모델도 "정확"해 보임
        </text>
        <text x={240} y={192} textAnchor="middle" fontSize={10} fontWeight={600} fill="#8b5cf6">
          MCC: 0.00 vs 0.77 — 실제 분류 능력의 극적인 차이를 명확하게 포착
        </text>
      </motion.g>

      {/* Formula breakdown — numerator */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <text x={240} y={228} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
          수식을 3부분으로 분해해서 이해
        </text>
        <rect x={20} y={236} width={440} height={58} rx={6}
          fill="#10b981" fillOpacity={0.05} stroke="#10b981" strokeWidth={0.8} />
        <text x={40} y={253} fontSize={9} fontWeight={700} fill="#10b981">① 분자: TP·TN − FP·FN</text>
        <text x={40} y={268} fontSize={8} fill="var(--foreground)">
          <tspan fontWeight={600} fill="#10b981">TP·TN</tspan> = "잘 맞춘 양성 × 잘 맞춘 음성" → 제대로 분류한 양
        </text>
        <text x={40} y={282} fontSize={8} fill="var(--foreground)">
          <tspan fontWeight={600} fill="#ef4444">FP·FN</tspan> = "잘못된 양성 × 놓친 양성" → 제대로 못한 양 · 빼서 "순 성과" 측정
        </text>
      </motion.g>

      {/* Formula breakdown — denominator */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <rect x={20} y={300} width={440} height={62} rx={6}
          fill="#3b82f6" fillOpacity={0.05} stroke="#3b82f6" strokeWidth={0.8} />
        <text x={40} y={317} fontSize={9} fontWeight={700} fill="#3b82f6">
          ② 분모: √( (TP+FP)(TP+FN)(TN+FP)(TN+FN) )
        </text>
        <text x={40} y={331} fontSize={8} fill="var(--foreground)">
          네 합은 각각 "예측 양성 수 · 실제 양성 수 · 예측 음성 수 · 실제 음성 수"
        </text>
        <text x={40} y={345} fontSize={8} fill="var(--foreground)">
          네 개를 곱한 뒤 √ — 기하평균 형태의 정규화 값
        </text>
        <text x={40} y={358} fontSize={7.5} fill="var(--muted-foreground)">
          → 분자를 이 값으로 나누면 −1 ~ +1로 스케일 고정 (불균형과 무관)
        </text>
      </motion.g>

      {/* Why it works on imbalanced */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <rect x={20} y={368} width={440} height={44} rx={6}
          fill="#8b5cf6" fillOpacity={0.05} stroke="#8b5cf6" strokeWidth={0.8} />
        <text x={40} y={384} fontSize={9} fontWeight={700} fill="#8b5cf6">③ 왜 불균형에 강한가</text>
        <text x={40} y={398} fontSize={8} fill="var(--foreground)">
          네 칸(TP/FP/FN/TN) 전부를 사용 — "전부 음성" 같은 편법은 분자가 0이 되어 MCC=0
        </text>
        <text x={40} y={409} fontSize={7.5} fill="var(--muted-foreground)">
          Accuracy는 TN만 많아도 높아지지만, MCC는 TP도 있어야 양수가 됨
        </text>
      </motion.g>
    </svg>
  );
}

export default function ClassificationMetricsViz() {
  return (
    <StepViz steps={steps}>
      {(step) => <StepContent step={step} />}
    </StepViz>
  );
}
