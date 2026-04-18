import { motion } from 'framer-motion';
import { C } from './RegTechVizData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const slideR = (d: number) => ({ initial: { opacity: 0, x: -6 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });

function Arr({ x1, y1, x2, y2, color = C.dim }: { x1: number; y1: number; x2: number; y2: number; color?: string }) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len, uy = dy / len;
  const ax = x2 - ux * 5, ay = y2 - uy * 5;
  const px = -uy * 3, py = ux * 3;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} />
      <polygon points={`${x2},${y2} ${ax + px},${ay + py} ${ax - px},${ay - py}`} fill={color} />
    </g>
  );
}

/* ── Step 0: Batch Normalization 수식 ── */
export function RegTechStep0() {
  const stages = [
    { label: 'x', sub: '입력', w: 40 },
    { label: 'μ_B', sub: 'batch mean', w: 60 },
    { label: '(x-μ)/σ', sub: '정규화', w: 70 },
    { label: 'γx̂+β', sub: 'scale+shift', w: 70 },
  ];

  // positions: evenly spaced across 480
  const gap = 18;
  const totalW = stages.reduce((s, st) => s + st.w, 0) + gap * (stages.length - 1);
  let cx = (480 - totalW) / 2;
  const positions = stages.map(st => {
    const pos = cx;
    cx += st.w + gap;
    return pos;
  });

  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">BN: 4단계 파이프라인 — batch 단위 평균·분산으로 정규화</text>

      {/* pipeline boxes */}
      {stages.map((st, i) => {
        const x = positions[i];
        const boxColor = i === 0 ? C.dim : C.bn;
        return (
          <motion.g key={i} {...slideR(i * 0.1)}>
            <rect x={x} y={36} width={st.w} height={36} rx={6}
              fill={`${boxColor}12`} stroke={boxColor} strokeWidth={1.2} />
            <text x={x + st.w / 2} y={52} textAnchor="middle"
              fontSize={10} fontWeight={700} fontFamily="monospace" fill={boxColor}>{st.label}</text>
            <text x={x + st.w / 2} y={64} textAnchor="middle"
              fontSize={7} fill="var(--muted-foreground)">{st.sub}</text>
            {i < stages.length - 1 && (
              <Arr x1={x + st.w + 3} y1={54} x2={positions[i + 1] - 3} y2={54} color={C.dim} />
            )}
          </motion.g>
        );
      })}

      {/* formula detail */}
      <motion.g {...fade(0.4)}>
        <rect x={20} y={86} width={200} height={54} rx={6}
          fill={`${C.bn}08`} stroke={C.bn} strokeWidth={0.8} />
        <text x={30} y={102} fontSize={8} fontFamily="monospace" fill="var(--foreground)">
          μ_B = (1/m) Σ xᵢ
        </text>
        <text x={30} y={116} fontSize={8} fontFamily="monospace" fill="var(--foreground)">
          σ²_B = (1/m) Σ (xᵢ - μ_B)²
        </text>
        <text x={30} y={130} fontSize={8} fontFamily="monospace" fill={C.bn}>
          x̂ᵢ = (xᵢ - μ_B) / √(σ² + ε)
        </text>
      </motion.g>

      {/* benefits */}
      <motion.g {...fade(0.55)}>
        <rect x={240} y={86} width={220} height={54} rx={6}
          fill={`${C.bn}08`} stroke={C.bn} strokeWidth={0.8} strokeDasharray="4 3" />
        <text x={250} y={102} fontSize={8} fontWeight={600} fill={C.bn}>장점</text>
        <text x={250} y={116} fontSize={8} fill="var(--muted-foreground)">
          큰 LR 가능 / gradient 안정 / 정규화 효과
        </text>
        <text x={250} y={130} fontSize={8} fontWeight={600} fill={C.stop}>주의: small batch 시 불안정</text>
      </motion.g>
    </g>
  );
}

/* ── Step 1: Normalization 변형 비교 ── */
export function RegTechStep1() {
  // Each norm: which dimension is normalized
  // We show a 2D tensor grid (batch x features) and highlight which part
  const norms = [
    { name: 'BatchNorm', abbr: 'BN', dim: 'batch 축', use: 'CNN', color: C.bn,
      desc: '같은 feature의\nbatch 전체 정규화' },
    { name: 'LayerNorm', abbr: 'LN', dim: 'feature 축', use: 'Transformer', color: C.ln,
      desc: '한 sample의\nfeature 전체 정규화' },
    { name: 'GroupNorm', abbr: 'GN', dim: 'channel 그룹', use: 'small batch', color: C.aug,
      desc: '채널을 그룹으로\n묶어 정규화' },
    { name: 'RMSNorm', abbr: 'RMS', dim: 'feature (no mean)', use: 'LLaMA', color: C.mix,
      desc: '평균 제거 없이\nRMS로만 정규화' },
  ];

  const boxW = 106;
  const boxH = 95;
  const startX = 10;

  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">정규화 대상 차원에 따라 4가지 변형 — 용도별 선택</text>

      {norms.map((n, i) => {
        const x = startX + i * (boxW + 8);
        return (
          <motion.g key={i} {...slideR(i * 0.1)}>
            <rect x={x} y={24} width={boxW} height={boxH} rx={7}
              fill={`${n.color}08`} stroke={n.color} strokeWidth={1.2} />
            <text x={x + boxW / 2} y={40} textAnchor="middle"
              fontSize={10} fontWeight={700} fill={n.color}>{n.name}</text>

            {/* mini grid: 4 rows (batch) x 4 cols (features) */}
            {Array.from({ length: 4 }).map((_, r) =>
              Array.from({ length: 4 }).map((_, c) => {
                let highlight = false;
                if (i === 0) highlight = c === 0; // BN: first feature column
                if (i === 1) highlight = r === 0; // LN: first batch row
                if (i === 2) highlight = r === 0 && c < 2; // GN: first row, group
                if (i === 3) highlight = r === 0; // RMS: same as LN but no mean
                return (
                  <rect key={`${r}-${c}`}
                    x={x + 18 + c * 17} y={48 + r * 11} width={14} height={9} rx={1.5}
                    fill={highlight ? `${n.color}40` : 'var(--muted)'}
                    stroke={highlight ? n.color : 'var(--border)'} strokeWidth={0.6} />
                );
              })
            )}

            <text x={x + boxW / 2} y={102} textAnchor="middle"
              fontSize={7} fill="var(--muted-foreground)">{n.dim}</text>
            <text x={x + boxW / 2} y={113} textAnchor="middle"
              fontSize={7} fontWeight={600} fill={n.color}>{n.use}</text>
          </motion.g>
        );
      })}
    </g>
  );
}

/* ── Step 2: Early Stopping ── */
export function RegTechStep2() {
  // loss curves — compact chart on left, patience box on right
  const trainPts = [
    { e: 0, l: 95 }, { e: 1, l: 80 }, { e: 2, l: 67 }, { e: 3, l: 55 },
    { e: 4, l: 46 }, { e: 5, l: 38 }, { e: 6, l: 32 }, { e: 7, l: 28 },
    { e: 8, l: 24 }, { e: 9, l: 21 },
  ];
  const valPts = [
    { e: 0, l: 98 }, { e: 1, l: 82 }, { e: 2, l: 70 }, { e: 3, l: 59 },
    { e: 4, l: 50 }, { e: 5, l: 46 }, { e: 6, l: 48 }, { e: 7, l: 52 },
    { e: 8, l: 58 }, { e: 9, l: 66 },
  ];

  const chartX = 40;
  const chartY = 28;
  const chartW = 180;
  const chartH = 80;
  const scaleX = (e: number) => chartX + (e / 9) * chartW;
  const scaleY = (l: number) => chartY + chartH - (l / 100) * chartH;

  const trainPath = trainPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${scaleX(p.e)},${scaleY(p.l)}`).join(' ');
  const valPath = valPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${scaleX(p.e)},${scaleY(p.l)}`).join(' ');

  const stopEpoch = 5;
  const stopX = scaleX(stopEpoch);
  const stopY = scaleY(valPts[stopEpoch].l);

  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">val loss 상승 → patience 카운터 → 초과 시 훈련 중단</text>

      {/* chart background */}
      <motion.g {...fade(0)}>
        <rect x={chartX - 2} y={chartY - 2} width={chartW + 4} height={chartH + 4} rx={4}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        {/* axes */}
        <line x1={chartX} y1={chartY} x2={chartX} y2={chartY + chartH} stroke="var(--border)" strokeWidth={0.8} />
        <line x1={chartX} y1={chartY + chartH} x2={chartX + chartW} y2={chartY + chartH}
          stroke="var(--border)" strokeWidth={0.8} />
        <text x={chartX - 6} y={chartY + chartH / 2} textAnchor="end" fontSize={7}
          fill="var(--muted-foreground)" transform={`rotate(-90,${chartX - 6},${chartY + chartH / 2})`}>loss</text>
        <text x={chartX + chartW / 2} y={chartY + chartH + 12} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">epoch</text>
      </motion.g>

      {/* train curve */}
      <motion.path d={trainPath} fill="none" stroke={C.bn} strokeWidth={1.5}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />

      {/* val curve */}
      <motion.path d={valPath} fill="none" stroke={C.stop} strokeWidth={1.5} strokeDasharray="4 2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.2 }} />

      {/* legend */}
      <motion.g {...fade(0.3)}>
        <line x1={chartX + 4} y1={chartY + 6} x2={chartX + 16} y2={chartY + 6} stroke={C.bn} strokeWidth={1.5} />
        <text x={chartX + 20} y={chartY + 9} fontSize={7} fill={C.bn}>train</text>
        <line x1={chartX + 4} y1={chartY + 16} x2={chartX + 16} y2={chartY + 16} stroke={C.stop} strokeWidth={1.5} strokeDasharray="4 2" />
        <text x={chartX + 20} y={chartY + 19} fontSize={7} fill={C.stop}>val</text>
      </motion.g>

      {/* stop point */}
      <motion.g {...fade(0.6)}>
        <line x1={stopX} y1={chartY} x2={stopX} y2={chartY + chartH}
          stroke={C.ln} strokeWidth={1} strokeDasharray="3 2" />
        <circle cx={stopX} cy={stopY} r={3.5} fill={C.ln} fillOpacity={0.3} stroke={C.ln} strokeWidth={1.2} />
        <text x={stopX} y={chartY - 4} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.ln}>best</text>
      </motion.g>

      {/* patience explanation — right side, clearly separated */}
      <motion.g {...fade(0.5)}>
        <rect x={245} y={24} width={225} height={118} rx={7}
          fill={`${C.stop}06`} stroke={C.stop} strokeWidth={1} />
        <text x={357} y={40} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.stop}>EarlyStopping</text>

        <text x={257} y={56} fontSize={8} fontFamily="monospace" fill="var(--foreground)">patience = 3, min_delta = 0</text>

        <line x1={257} y1={62} x2={458} y2={62} stroke="var(--border)" strokeWidth={0.5} />

        <text x={257} y={76} fontSize={8} fill="var(--muted-foreground)">epoch 5: val=0.46</text>
        <text x={380} y={76} fontSize={8} fontWeight={600} fill={C.ln}>← best</text>

        <text x={257} y={90} fontSize={8} fill={C.stop}>epoch 6: val=0.48</text>
        <text x={380} y={90} fontSize={8} fill={C.stop}>cnt=1</text>

        <text x={257} y={104} fontSize={8} fill={C.stop}>epoch 7: val=0.52</text>
        <text x={380} y={104} fontSize={8} fill={C.stop}>cnt=2</text>

        <text x={257} y={118} fontSize={8} fontWeight={700} fill={C.stop}>epoch 8: val=0.58</text>
        <text x={380} y={118} fontSize={8} fontWeight={700} fill={C.stop}>cnt=3 → STOP!</text>

        <text x={357} y={136} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          best model 체크포인트에서 복원
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 3: Data Augmentation — 이미지 ── */
export function RegTechStep3() {
  const transforms = [
    { name: 'Original', icon: '🖼', desc: '원본 이미지' },
    { name: 'Flip', icon: '↔', desc: '좌우 반전 p=0.5' },
    { name: 'Rotate', icon: '↻', desc: '±15도 회전' },
    { name: 'Crop', icon: '⬒', desc: '랜덤 자르기' },
    { name: 'Jitter', icon: '🎨', desc: '색상 변형' },
  ];

  const boxW = 80;
  const gap = 8;
  const startX = 15;

  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">이미지 변환 파이프라인 — 원본을 다양하게 변형하여 학습 데이터 증가</text>

      {transforms.map((t, i) => {
        const x = startX + i * (boxW + gap);
        const isOrig = i === 0;
        const color = isOrig ? C.dim : C.aug;
        return (
          <motion.g key={i} {...slideR(i * 0.1)}>
            <rect x={x} y={30} width={boxW} height={68} rx={7}
              fill={`${color}08`} stroke={color} strokeWidth={isOrig ? 0.8 : 1.2} />

            {/* simulated image area */}
            <rect x={x + 10} y={38} width={boxW - 20} height={28} rx={3}
              fill={`${color}15`} stroke={color} strokeWidth={0.5} />

            {/* transformation visual inside the image area */}
            {isOrig && (
              <text x={x + boxW / 2} y={56} textAnchor="middle" fontSize={10} fill={C.dim}>A</text>
            )}
            {i === 1 && (
              <text x={x + boxW / 2} y={56} textAnchor="middle" fontSize={10} fill={C.aug}
                style={{ transform: 'scaleX(-1)', transformOrigin: `${x + boxW / 2}px 52px` }}>A</text>
            )}
            {i === 2 && (
              <g transform={`rotate(15, ${x + boxW / 2}, 52)`}>
                <text x={x + boxW / 2} y={56} textAnchor="middle" fontSize={10} fill={C.aug}>A</text>
              </g>
            )}
            {i === 3 && (
              <g>
                <rect x={x + 18} y={42} width={30} height={18} rx={2}
                  fill="none" stroke={C.aug} strokeWidth={1} strokeDasharray="2 1" />
                <text x={x + 33} y={55} textAnchor="middle" fontSize={8} fill={C.aug}>A</text>
              </g>
            )}
            {i === 4 && (
              <g>
                <circle cx={x + 30} cy={50} r={5} fill={`${C.aug}50`} />
                <circle cx={x + 45} cy={48} r={4} fill={`${C.mix}50`} />
                <circle cx={x + 38} cy={56} r={3} fill={`${C.ln}50`} />
              </g>
            )}

            <text x={x + boxW / 2} y={80} textAnchor="middle"
              fontSize={9} fontWeight={700} fill={color}>{t.name}</text>
            <text x={x + boxW / 2} y={92} textAnchor="middle"
              fontSize={7} fill="var(--muted-foreground)">{t.desc}</text>

            {/* arrow between boxes */}
            {i < transforms.length - 1 && (
              <Arr x1={x + boxW + 1} y1={64} x2={x + boxW + gap - 1} y2={64} color={C.dim} />
            )}
          </motion.g>
        );
      })}

      {/* summary */}
      <motion.g {...fade(0.6)}>
        <rect x={15} y={108} width={450} height={32} rx={5}
          fill="var(--muted)" fillOpacity={0.25} stroke="var(--border)" strokeWidth={0.6} />
        <text x={240} y={122} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          T.Compose([RandomHorizontalFlip(0.5), RandomRotation(15), ColorJitter(0.2), RandomCrop(224)])
        </text>
        <text x={240} y={134} textAnchor="middle" fontSize={7} fill={C.aug}>
          매 epoch마다 다른 변형 적용 → 실질 데이터 수배 증가
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 4: 고급 Augmentation ── */
export function RegTechStep4() {
  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">MixUp · CutMix · NLP/Audio 증강 — 도메인별 고급 기법</text>

      {/* MixUp */}
      <motion.g {...slideR(0)}>
        <rect x={10} y={26} width={148} height={65} rx={7}
          fill={`${C.mix}08`} stroke={C.mix} strokeWidth={1.2} />
        <text x={84} y={42} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.mix}>MixUp</text>

        {/* two images blending */}
        <rect x={22} y={50} width={28} height={18} rx={3}
          fill={`${C.bn}25`} stroke={C.bn} strokeWidth={0.8} />
        <text x={36} y={62} textAnchor="middle" fontSize={7} fill={C.bn}>x₁</text>

        <text x={58} y={62} fontSize={8} fill={C.mix} fontWeight={600}>+λ</text>

        <rect x={70} y={50} width={28} height={18} rx={3}
          fill={`${C.stop}25`} stroke={C.stop} strokeWidth={0.8} />
        <text x={84} y={62} textAnchor="middle" fontSize={7} fill={C.stop}>x₂</text>

        <Arr x1={104} y1={59} x2={118} y2={59} color={C.mix} />

        <rect x={121} y={50} width={28} height={18} rx={3}
          fill={`${C.mix}25`} stroke={C.mix} strokeWidth={1} />
        <text x={135} y={62} textAnchor="middle" fontSize={7} fill={C.mix}>x̃</text>

        <text x={84} y={84} textAnchor="middle" fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">
          x̃ = λx₁ + (1-λ)x₂
        </text>
      </motion.g>

      {/* CutMix */}
      <motion.g {...slideR(0.15)}>
        <rect x={170} y={26} width={148} height={72} rx={7}
          fill={`${C.aug}08`} stroke={C.aug} strokeWidth={1.2} />
        <text x={244} y={42} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.aug}>CutMix</text>

        {/* image with patch replaced */}
        <rect x={188} y={48} width={40} height={26} rx={3}
          fill={`${C.bn}15`} stroke={C.bn} strokeWidth={0.8} />
        {/* replaced patch */}
        <rect x={200} y={52} width={18} height={14} rx={1}
          fill={`${C.stop}30`} stroke={C.stop} strokeWidth={0.8} strokeDasharray="2 1" />
        <text x={209} y={62} textAnchor="middle" fontSize={7} fill={C.stop}>B</text>

        <Arr x1={236} y1={61} x2={250} y2={61} color={C.aug} />

        <rect x={256} y={48} width={40} height={26} rx={3}
          fill={`${C.aug}15`} stroke={C.aug} strokeWidth={1} />
        <text x={276} y={65} textAnchor="middle" fontSize={7} fill={C.aug}>A+B</text>

        <text x={244} y={90} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          영역 교체 → localization 강화
        </text>
      </motion.g>

      {/* NLP + Audio */}
      <motion.g {...slideR(0.3)}>
        <rect x={330} y={26} width={140} height={65} rx={7}
          fill={`${C.ln}08`} stroke={C.ln} strokeWidth={1} />
        <text x={400} y={42} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.ln}>NLP / Audio</text>

        {[
          { y: 55, text: 'Back-translation' },
          { y: 68, text: 'Random masking' },
          { y: 81, text: 'SpecAugment' },
        ].map((item, i) => (
          <motion.g key={i} {...slideR(0.35 + i * 0.06)}>
            <text x={400} y={item.y} textAnchor="middle" fontSize={8} fill="var(--foreground)">{item.text}</text>
          </motion.g>
        ))}
      </motion.g>

      {/* AutoAugment / RandAugment */}
      <motion.g {...fade(0.5)}>
        <rect x={10} y={102} width={460} height={38} rx={6}
          fill="var(--muted)" fillOpacity={0.25} stroke="var(--border)" strokeWidth={0.6} />

        {[
          { x: 30, name: 'AutoAugment', desc: '정책 자동 탐색 (RL)', color: C.mix },
          { x: 180, name: 'RandAugment', desc: '랜덤 N개 변환 적용', color: C.aug },
          { x: 340, name: 'TrivialAugment', desc: '단일 변환 랜덤 강도', color: C.ln },
        ].map((item, i) => (
          <motion.g key={i} {...slideR(0.55 + i * 0.06)}>
            <text x={item.x} y={118} fontSize={9} fontWeight={700} fill={item.color}>{item.name}</text>
            <text x={item.x} y={132} fontSize={7} fill="var(--muted-foreground)">{item.desc}</text>
          </motion.g>
        ))}
      </motion.g>
    </g>
  );
}
