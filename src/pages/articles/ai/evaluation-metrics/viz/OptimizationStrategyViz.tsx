import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import type { StepDef } from '@/components/ui/step-viz';

const steps: StepDef[] = [
  {
    label: 'RMSE → MSE Loss 직접 최적화',
    body: 'RMSE = sqrt(MSE). MSE를 loss로 쓰면 gradient가 자연스러운 형태.\nsqrt는 단조 증가이므로 MSE 최소화 = RMSE 최소화.\ntorch.nn.MSELoss() → 가장 단순하고 직관적인 전략.',
  },
  {
    label: 'MAE → Huber Loss (이상치 로버스트)',
    body: 'MAE의 문제: x=0에서 미분 불가 → gradient가 불연속.\nHuber Loss: |e| < delta이면 MSE, |e| >= delta이면 MAE로 전환.\ndelta 조절로 MSE-MAE 사이 스펙트럼 탐색.\ntorch.nn.SmoothL1Loss(beta=delta).',
  },
  {
    label: 'F1 → Threshold 튜닝 전략',
    body: 'F1은 미분 불가(discrete metric) → loss로 직접 최적화 불가.\n대신: BCE loss로 확률 학습 → threshold를 후처리로 탐색.\nValidation set에서 0.01 단위로 threshold sweep → F1 최대화.\noptuna/grid search로 자동화 가능.',
  },
  {
    label: 'AUC → Pairwise Ranking Loss',
    body: 'AUC = P(score_pos > score_neg). 직접 미분 불가.\nPairwise loss: 양성-음성 쌍에서 score 차이를 최대화.\nmax(0, margin - (s_pos - s_neg)) 또는 -log(sigmoid(s_pos - s_neg)).\nLambdaRank, ListNet 등 Learning-to-Rank 프레임워크 활용.',
  },
  {
    label: '커스텀 Loss 함수: 지표와 Loss의 간극 해소',
    body: 'Surrogate loss: 미분 불가 지표를 근사하는 미분 가능 함수.\nFocal Loss: 쉬운 샘플 down-weight → 어려운 샘플에 집중.\nWeighted Loss: 클래스/샘플별 가중치 → 비즈니스 비용 반영.\n앙상블: 다양한 loss로 학습한 모델을 결합.',
  },
];

function StepContent({ step }: { step: number }) {
  if (step === 0) {
    // RMSE -> MSE direct optimization
    const boxW = 108;
    const boxH = 54;
    const boxY = 46;
    const box1X = 56;
    const box2X = 186;
    const box3X = 316;
    const midY = boxY + boxH / 2;
    return (
      <svg viewBox="0 0 480 240" className="w-full max-w-2xl">
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
          RMSE 최적화: MSE Loss를 직접 사용
        </text>
        <defs>
          <marker id="arrowOpt" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
            <path d="M0,0 L6,3 L0,6" fill="var(--border)" />
          </marker>
        </defs>
        {/* Flow: RMSE metric -> MSE Loss -> Gradient */}
        <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <rect x={box1X} y={boxY} width={boxW} height={boxH} rx={8}
            fill="#3b82f6" fillOpacity={0.08} stroke="#3b82f6" strokeWidth={1.5} />
          <text x={box1X + boxW / 2} y={boxY + 22} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">목표 지표</text>
          <text x={box1X + boxW / 2} y={boxY + 40} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--foreground)">
            RMSE = sqrt(MSE)
          </text>
        </motion.g>
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <line x1={box1X + boxW + 4} y1={midY} x2={box2X - 4} y2={midY}
            stroke="var(--border)" strokeWidth={1.5} markerEnd="url(#arrowOpt)" />
        </motion.g>
        <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <rect x={box2X} y={boxY} width={boxW} height={boxH} rx={8}
            fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={1.5} />
          <text x={box2X + boxW / 2} y={boxY + 22} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">Loss 함수</text>
          <text x={box2X + boxW / 2} y={boxY + 40} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--foreground)">
            MSE = mean(e²)
          </text>
        </motion.g>
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
          <line x1={box2X + boxW + 4} y1={midY} x2={box3X - 4} y2={midY}
            stroke="var(--border)" strokeWidth={1.5} markerEnd="url(#arrowOpt)" />
        </motion.g>
        <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <rect x={box3X} y={boxY} width={boxW} height={boxH} rx={8}
            fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeWidth={1.5} />
          <text x={box3X + boxW / 2} y={boxY + 22} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">Gradient</text>
          <text x={box3X + boxW / 2} y={boxY + 40} textAnchor="middle" fontSize={8.5} fontFamily="monospace" fill="var(--foreground)">
            dL/dy = 2(y−ŷ)/n
          </text>
        </motion.g>
        {/* Why it works */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <rect x={56} y={118} width={368} height={54} rx={8}
            fill="var(--muted)" fillOpacity={0.1} stroke="var(--border)" strokeWidth={0.5} />
          <text x={240} y={138} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">
            sqrt는 단조증가 → argmin MSE = argmin RMSE
          </text>
          <text x={240} y={156} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            gradient = 2·(예측−실제)/n → 오차에 비례하는 업데이트 → 큰 오차를 먼저 줄임
          </text>
        </motion.g>
        {/* Code hint */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <rect x={80} y={188} width={320} height={38} rx={6}
            fill="#10b981" fillOpacity={0.06} stroke="#10b981" strokeWidth={0.8} />
          <text x={240} y={205} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="#10b981">
            loss_fn = torch.nn.MSELoss()
          </text>
          <text x={240} y={219} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
            추가 트릭: log(y+1) 변환 후 MSE → RMSLE 근사 가능
          </text>
        </motion.g>
      </svg>
    );
  }
  if (step === 1) {
    // Huber Loss transition
    const delta = 1.0;
    const errors = Array.from({ length: 41 }, (_, i) => (i - 20) * 0.2);
    const mse = (e: number) => 0.5 * e * e;
    const mae = (e: number) => Math.abs(e);
    const huber = (e: number) => Math.abs(e) <= delta ? 0.5 * e * e : delta * (Math.abs(e) - 0.5 * delta);
    // Plot area: x 60..330, y 66..196 (origin at x=195)
    const originX = 195;
    const baseY = 196;
    const topY = 66;
    const sx = (e: number) => originX + e * 45;
    const sy = (v: number) => baseY - Math.min(v, 4.0) * 30;
    return (
      <svg viewBox="0 0 480 300" className="w-full max-w-2xl">
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
          Huber Loss: MSE와 MAE 사이 전환 (δ = {delta})
        </text>
        <text x={240} y={34} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          {'|e| < δ → ½·e²   |   |e| ≥ δ → δ·(|e| − ½·δ)'}
        </text>
        {/* Plot area background */}
        <rect x={60} y={topY - 10} width={270} height={baseY - topY + 20} rx={4}
          fill="var(--muted)" fillOpacity={0.05} />
        {/* axes */}
        <line x1={60} y1={baseY} x2={330} y2={baseY} stroke="var(--border)" strokeWidth={1} />
        <line x1={originX} y1={topY} x2={originX} y2={baseY} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="3 2" />
        <text x={334} y={baseY + 3} fontSize={8} fill="var(--muted-foreground)">error</text>
        <text x={originX + 4} y={topY + 2} fontSize={8} fill="var(--muted-foreground)">loss</text>
        {/* MSE curve */}
        <path d={errors.filter(e => Math.abs(e) <= 2.6).map((e, i) =>
          `${i === 0 ? 'M' : 'L'} ${sx(e)} ${sy(mse(e))}`
        ).join(' ')} fill="none" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 2" opacity={0.55} />
        {/* MAE line */}
        <path d={errors.map((e, i) =>
          `${i === 0 ? 'M' : 'L'} ${sx(e)} ${sy(mae(e))}`
        ).join(' ')} fill="none" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="4 2" opacity={0.55} />
        {/* Huber curve */}
        <motion.path d={errors.map((e, i) =>
          `${i === 0 ? 'M' : 'L'} ${sx(e)} ${sy(huber(e))}`
        ).join(' ')} fill="none" stroke="#10b981" strokeWidth={2.5}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
        {/* delta markers */}
        <line x1={sx(-delta)} y1={baseY - 6} x2={sx(-delta)} y2={baseY + 6}
          stroke="#f59e0b" strokeWidth={1.5} />
        <line x1={sx(delta)} y1={baseY - 6} x2={sx(delta)} y2={baseY + 6}
          stroke="#f59e0b" strokeWidth={1.5} />
        <text x={sx(-delta)} y={baseY + 17} textAnchor="middle" fontSize={8} fill="#f59e0b">−δ</text>
        <text x={sx(delta)} y={baseY + 17} textAnchor="middle" fontSize={8} fill="#f59e0b">+δ</text>
        {/* Legend panel — outside plot area */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <rect x={346} y={56} width={124} height={144} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
          <text x={408} y={72} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">범례</text>
          <line x1={354} y1={88} x2={376} y2={88} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 2" />
          <text x={382} y={91} fontSize={9} fontWeight={600} fill="#ef4444">MSE</text>
          <text x={354} y={102} fontSize={7} fill="var(--muted-foreground)">½·e² · 포물선</text>
          <line x1={354} y1={118} x2={376} y2={118} stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="4 2" />
          <text x={382} y={121} fontSize={9} fontWeight={600} fill="#3b82f6">MAE</text>
          <text x={354} y={132} fontSize={7} fill="var(--muted-foreground)">|e| · V자 선형</text>
          <line x1={354} y1={148} x2={376} y2={148} stroke="#10b981" strokeWidth={2.5} />
          <text x={382} y={151} fontSize={9} fontWeight={700} fill="#10b981">Huber</text>
          <text x={354} y={162} fontSize={7} fill="var(--muted-foreground)">중심 곡선+바깥 선형</text>
          <line x1={354} y1={178} x2={376} y2={178} stroke="#f59e0b" strokeWidth={1.5} />
          <text x={382} y={181} fontSize={9} fontWeight={600} fill="#f59e0b">±δ</text>
          <text x={354} y={192} fontSize={7} fill="var(--muted-foreground)">전환점(=1)</text>
        </motion.g>
        {/* Bottom explanation cards */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          <rect x={18} y={224} width={220} height={64} rx={6}
            fill="#ef4444" fillOpacity={0.05} stroke="#ef4444" strokeWidth={0.8} />
          <text x={128} y={240} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ef4444">
            |e| {'<'} δ : MSE 구간
          </text>
          <text x={128} y={256} textAnchor="middle" fontSize={8} fill="var(--foreground)">
            loss = ½·e² · 작은 오차는 부드럽게 수렴
          </text>
          <text x={128} y={270} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
            미분 = e → 0에서 연속 · 학습 안정
          </text>
          <text x={128} y={283} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
            (MAE가 0에서 미분 불가한 문제 해결)
          </text>
          <rect x={242} y={224} width={220} height={64} rx={6}
            fill="#3b82f6" fillOpacity={0.05} stroke="#3b82f6" strokeWidth={0.8} />
          <text x={352} y={240} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">
            |e| ≥ δ : MAE 구간
          </text>
          <text x={352} y={256} textAnchor="middle" fontSize={8} fill="var(--foreground)">
            loss = δ·(|e| − ½·δ) · 선형 증가
          </text>
          <text x={352} y={270} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
            이상치에 제곱 패널티 안 줌 → 로버스트
          </text>
          <text x={352} y={283} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
            (MSE가 이상치에 끌려가는 문제 해결)
          </text>
        </motion.g>
      </svg>
    );
  }
  if (step === 2) {
    // F1 threshold sweep
    const thresholds = [
      { t: 0.2, f1: 0.62 },
      { t: 0.3, f1: 0.71 },
      { t: 0.4, f1: 0.78 },
      { t: 0.45, f1: 0.81 },
      { t: 0.5, f1: 0.80 },
      { t: 0.55, f1: 0.77 },
      { t: 0.6, f1: 0.72 },
      { t: 0.7, f1: 0.61 },
      { t: 0.8, f1: 0.45 },
    ];
    const sx = (t: number) => 60 + (t - 0.15) / 0.7 * 340;
    const sy = (f: number) => 180 - (f - 0.3) / 0.6 * 130;
    const bestIdx = 3;
    const pathD = thresholds.map((p, i) => `${i === 0 ? 'M' : 'L'} ${sx(p.t)} ${sy(p.f1)}`).join(' ');
    return (
      <svg viewBox="0 0 480 220" className="w-full max-w-2xl">
        <text x={240} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
          F1 최적화: Threshold Sweep
        </text>
        <text x={240} y={32} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          BCE로 학습 → validation에서 threshold를 0.01 단위로 탐색 → F1 최대화
        </text>
        {/* axes */}
        <line x1={55} y1={180} x2={420} y2={180} stroke="var(--border)" strokeWidth={1} />
        <line x1={55} y1={40} x2={55} y2={180} stroke="var(--border)" strokeWidth={1} />
        <text x={240} y={200} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">threshold</text>
        <text x={25} y={110} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)" transform="rotate(-90, 25, 110)">F1</text>
        {/* y ticks */}
        {[0.4, 0.6, 0.8].map(v => (
          <g key={v}>
            <line x1={52} y1={sy(v)} x2={58} y2={sy(v)} stroke="var(--border)" strokeWidth={0.8} />
            <text x={46} y={sy(v) + 3} textAnchor="end" fontSize={8} fill="var(--muted-foreground)">{v}</text>
          </g>
        ))}
        {/* x ticks */}
        {[0.2, 0.4, 0.6, 0.8].map(v => (
          <g key={v}>
            <line x1={sx(v)} y1={177} x2={sx(v)} y2={183} stroke="var(--border)" strokeWidth={0.8} />
            <text x={sx(v)} y={196} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{v}</text>
          </g>
        ))}
        {/* F1 curve */}
        <motion.path d={pathD} fill="none" stroke="#8b5cf6" strokeWidth={2.5}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
        {/* Best point */}
        <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}>
          <circle cx={sx(thresholds[bestIdx].t)} cy={sy(thresholds[bestIdx].f1)} r={7}
            fill="#8b5cf6" fillOpacity={0.2} stroke="#8b5cf6" strokeWidth={2} />
          <text x={sx(thresholds[bestIdx].t) + 12} y={sy(thresholds[bestIdx].f1) - 6}
            fontSize={10} fontWeight={700} fill="#8b5cf6">
            최적: t=0.45, F1=0.81
          </text>
        </motion.g>
        {/* note */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          <rect x={330} y={45} width={130} height={38} rx={6}
            fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeWidth={0.8} />
          <text x={395} y={60} textAnchor="middle" fontSize={8} fontWeight={600} fill="#f59e0b">기본 0.5가 최적 아님!</text>
          <text x={395} y={74} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">반드시 sweep 필요</text>
        </motion.g>
      </svg>
    );
  }
  if (step === 3) {
    // Pairwise ranking loss for AUC
    return (
      <svg viewBox="0 0 480 340" className="w-full max-w-2xl">
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
          AUC 최적화: Pairwise Ranking Loss
        </text>
        <text x={240} y={34} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          {'AUC = P(s_pos > s_neg) → 양성−음성 쌍의 순서를 학습'}
        </text>
        {/* Pair examples */}
        {[
          { pos: 0.8, neg: 0.3, ok: true, loss: '0' },
          { pos: 0.6, neg: 0.4, ok: true, loss: '0' },
          { pos: 0.5, neg: 0.55, ok: false, loss: '0.55' },
        ].map((pair, i) => {
          const y = 52 + i * 48;
          return (
            <motion.g key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}>
              <rect x={18} y={y} width={444} height={40} rx={6}
                fill={pair.ok ? '#10b981' : '#ef4444'} fillOpacity={0.04}
                stroke={pair.ok ? '#10b981' : '#ef4444'} strokeWidth={0.8} />
              <text x={35} y={y + 24} fontSize={9} fill="var(--muted-foreground)">쌍 {i + 1}</text>
              {/* positive score */}
              <rect x={78} y={y + 8} width={64} height={24} rx={12}
                fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={0.8} />
              <text x={110} y={y + 24} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">
                s₊ = {pair.pos}
              </text>
              {/* comparison */}
              <text x={162} y={y + 25} textAnchor="middle" fontSize={13} fontWeight={700}
                fill={pair.ok ? '#10b981' : '#ef4444'}>
                {pair.ok ? '>' : '<'}
              </text>
              {/* negative score */}
              <rect x={180} y={y + 8} width={64} height={24} rx={12}
                fill="#ef4444" fillOpacity={0.15} stroke="#ef4444" strokeWidth={0.8} />
              <text x={212} y={y + 24} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">
                s₋ = {pair.neg}
              </text>
              {/* margin */}
              <text x={292} y={y + 24} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                margin = {(pair.pos - pair.neg).toFixed(2)}
              </text>
              {/* loss */}
              <text x={382} y={y + 20} textAnchor="middle" fontSize={9} fontWeight={700}
                fill={pair.ok ? '#10b981' : '#ef4444'}>
                loss = {pair.loss}
              </text>
              <text x={382} y={y + 32} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
                {pair.ok ? '순서 정상' : '순서 역전 → 패널티'}
              </text>
            </motion.g>
          );
        })}
        {/* Loss formula */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <rect x={20} y={200} width={440} height={22} rx={4}
            fill="#8b5cf6" fillOpacity={0.06} stroke="#8b5cf6" strokeWidth={0.8} />
          <text x={240} y={215} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="#8b5cf6">
            {'L = max(0, margin − (s₊ − s₋))   또는   −log( σ(s₊ − s₋) )'}
          </text>
        </motion.g>
        {/* Formula term explanations */}
        <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <rect x={20} y={232} width={216} height={100} rx={6}
            fill="#8b5cf6" fillOpacity={0.04} stroke="#8b5cf6" strokeWidth={0.6} />
          <text x={128} y={248} textAnchor="middle" fontSize={9} fontWeight={700} fill="#8b5cf6">
            Hinge 형태: max(0, ·)
          </text>
          <text x={30} y={264} fontSize={8} fill="var(--foreground)">
            <tspan fontWeight={700} fill="#10b981">s₊</tspan>: 양성 샘플의 모델 점수
          </text>
          <text x={30} y={278} fontSize={8} fill="var(--foreground)">
            <tspan fontWeight={700} fill="#ef4444">s₋</tspan>: 음성 샘플의 모델 점수
          </text>
          <text x={30} y={292} fontSize={8} fill="var(--foreground)">
            <tspan fontWeight={700} fill="#f59e0b">margin</tspan>: 요구 점수 차이(예 0.1)
          </text>
          <text x={30} y={306} fontSize={8} fill="var(--muted-foreground)">
            차이 ≥ margin → loss 0
          </text>
          <text x={30} y={320} fontSize={8} fill="var(--muted-foreground)">
            차이 {'<'} margin → 부족분만큼 패널티
          </text>
        </motion.g>
        <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <rect x={244} y={232} width={216} height={100} rx={6}
            fill="#8b5cf6" fillOpacity={0.04} stroke="#8b5cf6" strokeWidth={0.6} />
          <text x={352} y={248} textAnchor="middle" fontSize={9} fontWeight={700} fill="#8b5cf6">
            Logistic 형태: −log σ(·)
          </text>
          <text x={254} y={264} fontSize={8} fill="var(--foreground)">
            <tspan fontWeight={700} fill="#8b5cf6">σ(x)</tspan>: 시그모이드, (0,1) 확률
          </text>
          <text x={254} y={278} fontSize={8} fill="var(--foreground)">
            σ(s₊ − s₋): "양성이 음성보다 클 확률"
          </text>
          <text x={254} y={292} fontSize={8} fill="var(--foreground)">
            −log(·): 확률이 낮을수록 손실 ↑
          </text>
          <text x={254} y={306} fontSize={8} fill="var(--muted-foreground)">
            모든 범위에서 미분 가능(매끄러움)
          </text>
          <text x={254} y={320} fontSize={8} fill="var(--muted-foreground)">
            RankNet·LambdaRank의 기본 손실
          </text>
        </motion.g>
      </svg>
    );
  }
  // step 4: Custom loss overview
  const strategies = [
    { name: 'Focal Loss', desc: '쉬운 샘플 down-weight', formula: '-alpha*(1-p)^gamma*log(p)', use: '불균형 분류', color: '#ef4444' },
    { name: 'Weighted BCE', desc: '클래스별 비용 반영', formula: '-w*[y*log(p)+(1-y)*log(1-p)]', use: '비즈니스 비용', color: '#3b82f6' },
    { name: 'Label Smooth', desc: '과확신 방지', formula: 'CE(y_smooth, p)', use: '일반화 향상', color: '#10b981' },
    { name: 'Ensemble Loss', desc: '다중 loss 결합', formula: 'a*L1 + b*L2 + c*L3', use: '앙상블 전략', color: '#8b5cf6' },
  ];
  return (
    <svg viewBox="0 0 480 220" className="w-full max-w-2xl">
      <text x={240} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
        커스텀 Loss: 지표와 Loss의 간극 해소
      </text>
      <text x={240} y={32} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        미분 불가 지표를 근사하는 surrogate loss + 특수 전략
      </text>
      {strategies.map((s, i) => {
        const y = 44 + i * 42;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}>
            <rect x={15} y={y} width={450} height={35} rx={6}
              fill={s.color} fillOpacity={0.05} stroke={s.color} strokeWidth={1} />
            {/* name badge */}
            <rect x={20} y={y + 5} width={80} height={20} rx={10}
              fill={s.color} fillOpacity={0.15} />
            <text x={60} y={y + 19} textAnchor="middle" fontSize={9} fontWeight={700} fill={s.color}>{s.name}</text>
            {/* desc */}
            <text x={112} y={y + 15} fontSize={9} fill="var(--foreground)">{s.desc}</text>
            {/* formula */}
            <text x={260} y={y + 15} fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">{s.formula}</text>
            {/* use case */}
            <rect x={395} y={y + 5} width={65} height={20} rx={4}
              fill="var(--muted)" fillOpacity={0.3} />
            <text x={427} y={y + 19} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{s.use}</text>
          </motion.g>
        );
      })}
      {/* Bottom insight */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={30} y={215} width={420} height={4} rx={2}
          fill="var(--muted)" fillOpacity={0} />
      </motion.g>
    </svg>
  );
}

export default function OptimizationStrategyViz() {
  return (
    <StepViz steps={steps}>
      {(step) => <StepContent step={step} />}
    </StepViz>
  );
}
