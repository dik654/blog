import { motion } from 'framer-motion';
import { C } from './MlpTrainVizData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const slideR = (d: number) => ({ initial: { opacity: 0, x: -6 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });

/* ── arrow helper ── */
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

/* ── Step 0: 데이터 파이프라인 ── */
export function MlpTrainStep0() {
  const boxes = [
    { x: 10, label: 'MNIST', sub: '28×28 이미지', color: C.data },
    { x: 105, label: 'ToTensor', sub: '[0,255]→[0,1]', color: C.data },
    { x: 200, label: 'Normalize', sub: 'μ=0.13 σ=0.31', color: C.data },
    { x: 310, label: 'DataLoader', sub: 'batch=64, shuffle', color: C.model },
  ];
  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">transforms.Compose → DataLoader</text>

      {boxes.map((b, i) => (
        <motion.g key={i} {...slideR(i * 0.12)}>
          <rect x={b.x} y={28} width={i === 3 ? 100 : 85} height={44} rx={7}
            fill={`${b.color}12`} stroke={b.color} strokeWidth={1.2} />
          <text x={b.x + (i === 3 ? 50 : 42)} y={46} textAnchor="middle"
            fontSize={10} fontWeight={700} fill={b.color}>{b.label}</text>
          <text x={b.x + (i === 3 ? 50 : 42)} y={62} textAnchor="middle"
            fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">{b.sub}</text>
          {i < 3 && <Arr x1={b.x + (i === 3 ? 100 : 85) + 2} y1={50} x2={boxes[i + 1].x - 2} y2={50} color={C.dim} />}
        </motion.g>
      ))}

      {/* 배치 시각화 */}
      <motion.g {...fade(0.5)}>
        <rect x={10} y={86} width={400} height={46} rx={6}
          fill="var(--muted)" fillOpacity={0.2} stroke="var(--border)" strokeWidth={0.8} />
        <text x={20} y={102} fontSize={9} fontWeight={600} fill="var(--foreground)">미니배치 1개:</text>
        {Array.from({ length: 8 }).map((_, i) => (
          <g key={i}>
            <rect x={20 + i * 46} y={108} width={40} height={16} rx={3}
              fill={`${C.data}18`} stroke={C.data} strokeWidth={0.6} />
            <text x={40 + i * 46} y={119} textAnchor="middle"
              fontSize={7} fontFamily="monospace" fill={C.data}>
              {i < 7 ? `img_${i}` : '...'}
            </text>
          </g>
        ))}
        <text x={395} y={119} textAnchor="end" fontSize={8} fontWeight={600} fill={C.model}>×64</text>
      </motion.g>
    </g>
  );
}

/* ── Step 1: MLP 모델 정의 ── */
export function MlpTrainStep1() {
  const layers = [
    { x: 10, neurons: 6, label: '784', dim: 'Input', color: C.data, act: '' },
    { x: 115, neurons: 4, label: '50', dim: 'Hidden 1', color: C.model, act: 'ReLU' },
    { x: 220, neurons: 5, label: '100', dim: 'Hidden 2', color: C.model, act: 'ReLU' },
    { x: 330, neurons: 3, label: '10', dim: 'Output', color: C.loss, act: 'logits' },
  ];

  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">nn.Linear 3개 — 은닉층에 ReLU, 출력층은 raw logits</text>

      {layers.map((l, li) => {
        const nR = 5;
        const gap = 13;
        const topY = 36;
        return (
          <motion.g key={li} {...slideR(li * 0.12)}>
            {/* layer box */}
            <rect x={l.x} y={24} width={90} height={l.neurons * gap + 24} rx={7}
              fill={`${l.color}08`} stroke={l.color} strokeWidth={1} />
            <text x={l.x + 45} y={topY} textAnchor="middle"
              fontSize={9} fontWeight={700} fill={l.color}>{l.dim}</text>

            {/* neurons */}
            {Array.from({ length: l.neurons }).map((_, ni) => {
              const ny = topY + 12 + ni * gap;
              const isEllipsis = ni === l.neurons - 1 && li === 0;
              return (
                <g key={ni}>
                  <circle cx={l.x + 45} cy={ny} r={nR}
                    fill={`${l.color}22`} stroke={l.color} strokeWidth={0.8} />
                  {isEllipsis && <text x={l.x + 45} y={ny + 3} textAnchor="middle"
                    fontSize={7} fill={l.color}>...</text>}
                </g>
              );
            })}

            {/* dimension label */}
            <text x={l.x + 45} y={24 + l.neurons * gap + 20} textAnchor="middle"
              fontSize={8} fontFamily="monospace" fontWeight={600} fill={l.color}>{l.label}</text>

            {/* activation & arrow to next */}
            {li < layers.length - 1 && (
              <motion.g {...fade(0.2 + li * 0.12)}>
                <Arr x1={l.x + 93} y1={topY + 20} x2={layers[li + 1].x - 3} y2={topY + 20} color={C.dim} />
                <text x={l.x + 93 + (layers[li + 1].x - l.x - 93) / 2} y={topY + 14}
                  textAnchor="middle" fontSize={7} fontWeight={600} fill={C.train}>
                  {layers[li + 1].act}
                </text>
              </motion.g>
            )}
          </motion.g>
        );
      })}

      {/* param counts */}
      <motion.g {...fade(0.5)}>
        <text x={10} y={130} fontSize={8} fill="var(--muted-foreground)">
          파라미터: fc1(784×50+50)=39,250 + fc2(50×100+100)=5,100 + fc3(100×10+10)=1,010 = 총 45,360
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 2: 훈련 루프 ── */
export function MlpTrainStep2() {
  const steps = [
    { x: 10, label: 'zero_grad', sub: '그래디언트 초기화', color: C.dim },
    { x: 95, label: 'forward', sub: 'model(data)', color: C.model },
    { x: 180, label: 'loss 계산', sub: 'CrossEntropy', color: C.loss },
    { x: 265, label: 'backward', sub: '∂L/∂W 계산', color: C.train },
    { x: 350, label: 'step', sub: 'Adam 갱신', color: C.eval },
  ];

  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">매 배치마다 5단계 반복 × 10 에포크</text>

      {steps.map((s, i) => (
        <motion.g key={i} {...slideR(i * 0.1)}>
          <rect x={s.x} y={28} width={75} height={44} rx={7}
            fill={`${s.color}12`} stroke={s.color} strokeWidth={1.2} />
          <text x={s.x + 37} y={46} textAnchor="middle"
            fontSize={10} fontWeight={700} fill={s.color}>{s.label}</text>
          <text x={s.x + 37} y={62} textAnchor="middle"
            fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">{s.sub}</text>
          {i < steps.length - 1 && <Arr x1={s.x + 78} y1={50} x2={steps[i + 1].x - 3} y2={50} color={C.dim} />}
        </motion.g>
      ))}

      {/* loss → backward detail */}
      <motion.g {...fade(0.5)}>
        <rect x={10} y={86} width={410} height={48} rx={6}
          fill="var(--muted)" fillOpacity={0.2} stroke="var(--border)" strokeWidth={0.8} />

        <text x={20} y={100} fontSize={9} fontWeight={600} fill={C.loss}>
          CrossEntropyLoss = -log(softmax(logits)[target])
        </text>
        <text x={20} y={114} fontSize={8} fill="var(--muted-foreground)">
          output = model(data)  →  loss = criterion(output, target)  →  loss.backward()
        </text>
        <text x={20} y={127} fontSize={8} fill={C.eval}>
          Adam: W ← W - lr · m̂/(√v̂ + ε)  (lr=0.001, 적응적 학습률)
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 3: 평가 ── */
export function MlpTrainStep3() {
  const accs = [
    { epoch: 1, acc: 0.942 }, { epoch: 2, acc: 0.957 }, { epoch: 3, acc: 0.965 },
    { epoch: 5, acc: 0.972 }, { epoch: 7, acc: 0.975 }, { epoch: 10, acc: 0.978 },
  ];
  const barMaxW = 160;

  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">model.eval() + torch.no_grad() → argmax → 정확도</text>

      {/* eval pipeline */}
      {[
        { x: 10, label: 'model.eval()', sub: 'BN/Dropout off', color: C.eval },
        { x: 120, label: 'no_grad()', sub: '메모리 절약', color: C.eval },
        { x: 230, label: 'argmax', sub: 'dim=1', color: C.train },
        { x: 320, label: 'accuracy', sub: 'pred == target', color: C.model },
      ].map((s, i) => (
        <motion.g key={i} {...slideR(i * 0.1)}>
          <rect x={s.x} y={24} width={95} height={36} rx={6}
            fill={`${s.color}12`} stroke={s.color} strokeWidth={1} />
          <text x={s.x + 47} y={40} textAnchor="middle"
            fontSize={9} fontWeight={700} fill={s.color}>{s.label}</text>
          <text x={s.x + 47} y={52} textAnchor="middle"
            fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">{s.sub}</text>
          {i < 3 && <Arr x1={s.x + 98} y1={42} x2={[120, 230, 320][i] - 3} y2={42} color={C.dim} />}
        </motion.g>
      ))}

      {/* accuracy over epochs */}
      <motion.g {...fade(0.4)}>
        <text x={10} y={78} fontSize={9} fontWeight={600} fill="var(--foreground)">에포크별 정확도:</text>
        {accs.map((a, i) => {
          const y = 86 + i * 14;
          return (
            <motion.g key={i} {...fade(0.5 + i * 0.06)}>
              <text x={10} y={y + 9} fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">
                E{a.epoch.toString().padStart(2, '\u00A0')}
              </text>
              <rect x={40} y={y} width={barMaxW} height={10} rx={3}
                fill="var(--border)" fillOpacity={0.3} />
              <rect x={40} y={y} width={barMaxW * a.acc} height={10} rx={3}
                fill={C.model} fillOpacity={0.6} />
              <text x={40 + barMaxW + 6} y={y + 9} fontSize={8}
                fontFamily="monospace" fontWeight={600} fill={C.model}>
                {(a.acc * 100).toFixed(1)}%
              </text>
            </motion.g>
          );
        })}
      </motion.g>
    </g>
  );
}
