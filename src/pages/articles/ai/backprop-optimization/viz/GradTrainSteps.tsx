import { motion } from 'framer-motion';
import { C } from './GradTrainVizData';

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

/* ── Step 0: 훈련 루프 3단계 ── */
export function GradTrainStep0() {
  const boxes = [
    { label: 'Forward', sub: 'logits = model(x)', sub2: 'loss = criterion(logits, y)', color: C.code, x: 10 },
    { label: 'Backward', sub: 'optimizer.zero_grad()', sub2: 'loss.backward()', color: C.grad, x: 170 },
    { label: 'Update', sub: 'optimizer.step()', sub2: 'θ = θ - η·∇L', color: C.train, x: 330 },
  ];

  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">매 배치마다 3단계 반복</text>

      {boxes.map((b, i) => (
        <motion.g key={i} {...slideR(i * 0.12)}>
          {/* top bar (ModuleBox style) */}
          <rect x={b.x} y={28} width={140} height={7} rx={3} fill={b.color} />
          <rect x={b.x} y={33} width={140} height={72} rx={0} ry={0}
            fill={`${b.color}10`} stroke={b.color} strokeWidth={1} />
          <rect x={b.x} y={33} width={140} height={72} rx={0} ry={7}
            fill={`${b.color}10`} stroke={b.color} strokeWidth={1} />
          <text x={b.x + 70} y={52} textAnchor="middle"
            fontSize={11} fontWeight={700} fill={b.color}>{b.label}</text>
          <text x={b.x + 70} y={68} textAnchor="middle"
            fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">{b.sub}</text>
          <text x={b.x + 70} y={82} textAnchor="middle"
            fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">{b.sub2}</text>

          {i < boxes.length - 1 && (
            <Arr x1={b.x + 144} y1={65} x2={boxes[i + 1].x - 4} y2={65} color={C.dim} />
          )}
        </motion.g>
      ))}

      {/* loop-back arrow */}
      <motion.g {...fade(0.4)}>
        <path d="M 470 105 L 470 120 L 10 120 L 10 110"
          fill="none" stroke={C.dim} strokeWidth={1} strokeDasharray="4 3" />
        <polygon points="10,110 7,116 13,116" fill={C.dim} />
        <rect x={190} y={112} width={100} height={14} rx={3} fill="var(--background)" />
        <text x={240} y={123} textAnchor="middle" fontSize={8} fill={C.dim} fontWeight={600}>
          다음 배치 반복
        </text>
      </motion.g>

      {/* internal note */}
      <motion.g {...fade(0.5)}>
        <rect x={10} y={134} width={460} height={16} rx={4}
          fill={`${C.train}08`} stroke={C.train} strokeWidth={0.6} strokeDasharray="4 3" />
        <text x={240} y={145} textAnchor="middle" fontSize={8} fill={C.train}>
          step() 내부: param.data -= lr * param.grad (vanilla) 또는 momentum buffer 사용
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 1: Momentum 내부 동작 ── */
export function GradTrainStep1() {
  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">Momentum = gradient의 지수 이동 평균(EMA)</text>

      {/* buffer formula */}
      <motion.g {...slideR(0)}>
        <rect x={10} y={26} width={200} height={44} rx={7}
          fill={`${C.grad}10`} stroke={C.grad} strokeWidth={1.2} />
        <text x={110} y={44} textAnchor="middle"
          fontSize={10} fontWeight={700} fill={C.grad}>buffer 갱신</text>
        <text x={110} y={60} textAnchor="middle"
          fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          buf = β × buf + grad
        </text>
      </motion.g>

      <motion.g {...fade(0.1)}>
        <Arr x1={214} y1={48} x2={238} y2={48} color={C.dim} />
      </motion.g>

      {/* weight update */}
      <motion.g {...slideR(0.15)}>
        <rect x={240} y={26} width={220} height={44} rx={7}
          fill={`${C.train}10`} stroke={C.train} strokeWidth={1.2} />
        <text x={350} y={44} textAnchor="middle"
          fontSize={10} fontWeight={700} fill={C.train}>파라미터 업데이트</text>
        <text x={350} y={60} textAnchor="middle"
          fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          W = W - lr × buf
        </text>
      </motion.g>

      {/* beta effect table */}
      <motion.g {...fade(0.3)}>
        <rect x={10} y={82} width={460} height={78} rx={6}
          fill="var(--muted)" fillOpacity={0.25} stroke="var(--border)" strokeWidth={0.8} />
        <text x={20} y={98} fontSize={9} fontWeight={700} fill="var(--foreground)">β 값에 따른 효과</text>

        {/* column headers */}
        <text x={30} y={114} fontSize={8} fontWeight={600} fill={C.grad}>β 값</text>
        <text x={110} y={114} fontSize={8} fontWeight={600} fill={C.grad}>평균 범위</text>
        <text x={230} y={114} fontSize={8} fontWeight={600} fill={C.grad}>용도</text>

        {/* rows */}
        {[
          { beta: '0', range: '없음', use: 'vanilla SGD', color: C.dim },
          { beta: '0.9', range: '~10 step', use: '표준 (대부분 모델)', color: C.safe },
          { beta: '0.99', range: '~100 step', use: 'LLM 훈련 (longer memory)', color: C.code },
        ].map((r, i) => (
          <g key={i}>
            <text x={30} y={130 + i * 14} fontSize={8} fontFamily="monospace" fill={r.color} fontWeight={600}>
              {r.beta}
            </text>
            <text x={110} y={130 + i * 14} fontSize={8} fill="var(--muted-foreground)">{r.range}</text>
            <text x={230} y={130 + i * 14} fontSize={8} fill="var(--muted-foreground)">{r.use}</text>
          </g>
        ))}
      </motion.g>
    </g>
  );
}

/* ── Step 2: Gradient Clipping — Norm 방식 ── */
export function GradTrainStep2() {
  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">Global Norm Clipping — 방향 유지, 크기만 제한</text>

      {/* Step 1: compute norm */}
      <motion.g {...slideR(0)}>
        <rect x={10} y={26} width={130} height={50} rx={7}
          fill={`${C.grad}10`} stroke={C.grad} strokeWidth={1.2} />
        <text x={75} y={43} textAnchor="middle"
          fontSize={9} fontWeight={700} fill={C.grad}>L2 Norm 계산</text>
        <text x={75} y={58} textAnchor="middle"
          fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">
          ||g|| = sqrt(Σgᵢ2)
        </text>
        <text x={75} y={70} textAnchor="middle"
          fontSize={7} fill={C.dim}>전체 파라미터 합산</text>
      </motion.g>

      <motion.g {...fade(0.1)}>
        <Arr x1={144} y1={51} x2={168} y2={51} color={C.dim} />
      </motion.g>

      {/* Step 2: compare */}
      <motion.g {...slideR(0.15)}>
        <rect x={170} y={26} width={120} height={50} rx={7}
          fill={`${C.clip}10`} stroke={C.clip} strokeWidth={1.2} />
        <text x={230} y={43} textAnchor="middle"
          fontSize={9} fontWeight={700} fill={C.clip}>비교</text>
        <text x={230} y={58} textAnchor="middle"
          fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          ||g|| {'>'} max_norm?
        </text>
        <text x={230} y={70} textAnchor="middle"
          fontSize={7} fill={C.dim}>max_norm = 1.0</text>
      </motion.g>

      <motion.g {...fade(0.2)}>
        <Arr x1={294} y1={51} x2={318} y2={51} color={C.dim} />
      </motion.g>

      {/* Step 3: scale */}
      <motion.g {...slideR(0.25)}>
        <rect x={320} y={26} width={150} height={50} rx={7}
          fill={`${C.safe}10`} stroke={C.safe} strokeWidth={1.2} />
        <text x={395} y={43} textAnchor="middle"
          fontSize={9} fontWeight={700} fill={C.safe}>Scale Down</text>
        <text x={395} y={58} textAnchor="middle"
          fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">
          g = g × (max_norm / ||g||)
        </text>
        <text x={395} y={70} textAnchor="middle"
          fontSize={7} fill={C.dim}>방향 유지, 크기만 축소</text>
      </motion.g>

      {/* two methods comparison */}
      <motion.g {...fade(0.35)}>
        <rect x={10} y={88} width={225} height={58} rx={6}
          fill={`${C.clip}08`} stroke={C.clip} strokeWidth={0.8} />
        <text x={122} y={102} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.clip}>
          Norm Clipping (주류)
        </text>
        <text x={20} y={116} fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">
          clip_grad_norm_(params, 1.0)
        </text>
        <text x={20} y={130} fontSize={7} fill={C.dim}>
          전체 벡터의 L2 norm 기준 축소
        </text>
        <text x={20} y={140} fontSize={7} fill={C.safe} fontWeight={600}>
          RNN / Transformer 표준
        </text>
      </motion.g>

      <motion.g {...fade(0.4)}>
        <rect x={245} y={88} width={225} height={58} rx={6}
          fill="var(--muted)" fillOpacity={0.25} stroke="var(--border)" strokeWidth={0.8} />
        <text x={357} y={102} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">
          Value Clipping (보조)
        </text>
        <text x={255} y={116} fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">
          clip_grad_value_(params, 5.0)
        </text>
        <text x={255} y={130} fontSize={7} fill={C.dim}>
          각 원소 [-clip, +clip] 클램프
        </text>
        <text x={255} y={140} fontSize={7} fill={C.dim}>
          방향 왜곡 가능 — 덜 사용
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 3: Clipping 적용 시점 ── */
export function GradTrainStep3() {
  const steps = [
    { label: 'loss.backward()', desc: 'gradient 계산', color: C.grad, x: 10, w: 120 },
    { label: 'clip_grad_norm_', desc: '여기서 clipping!', color: C.clip, x: 155, w: 115 },
    { label: 'optimizer.step()', desc: '파라미터 갱신', color: C.train, x: 295, w: 125 },
  ];

  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">적용 순서: backward → clip → step (순서 틀리면 효과 없음)</text>

      {/* timeline */}
      <motion.g {...fade(0)}>
        <line x1={10} y1={58} x2={470} y2={58} stroke="var(--border)" strokeWidth={2} />
      </motion.g>

      {steps.map((s, i) => (
        <motion.g key={i} {...slideR(i * 0.12 + 0.1)}>
          {/* timeline dot */}
          <circle cx={s.x + s.w / 2} cy={58} r={4} fill={s.color} />

          {/* box above timeline */}
          <rect x={s.x} y={26} width={s.w} height={26} rx={5}
            fill={`${s.color}15`} stroke={s.color} strokeWidth={1.2} />
          <text x={s.x + s.w / 2} y={43} textAnchor="middle"
            fontSize={8} fontFamily="monospace" fontWeight={600} fill={s.color}>{s.label}</text>

          {/* label below */}
          <text x={s.x + s.w / 2} y={74} textAnchor="middle"
            fontSize={8} fill={i === 1 ? C.clip : 'var(--muted-foreground)'} fontWeight={i === 1 ? 700 : 400}>
            {s.desc}
          </text>

          {/* arrow between */}
          {i < steps.length - 1 && (
            <Arr x1={s.x + s.w + 4} y1={39} x2={steps[i + 1].x - 4} y2={39} color={C.dim} />
          )}
        </motion.g>
      ))}

      {/* highlight clip position */}
      <motion.g {...fade(0.4)}>
        <rect x={150} y={20} width={125} height={60} rx={7}
          fill="none" stroke={C.clip} strokeWidth={1.5} strokeDasharray="4 3" />
      </motion.g>

      {/* Transformer standards */}
      <motion.g {...fade(0.5)}>
        <rect x={10} y={90} width={460} height={56} rx={6}
          fill="var(--muted)" fillOpacity={0.25} stroke="var(--border)" strokeWidth={0.8} />
        <text x={20} y={106} fontSize={9} fontWeight={700} fill="var(--foreground)">
          Transformer 표준값: max_norm = 1.0
        </text>

        {[
          { name: 'BERT', val: '1.0', x: 30 },
          { name: 'GPT', val: '1.0', x: 130 },
          { name: 'LLaMA', val: '1.0', x: 230 },
          { name: 'T5', val: '1.0', x: 330 },
        ].map((m, i) => (
          <g key={i}>
            <rect x={m.x} y={114} width={80} height={24} rx={4}
              fill={`${C.safe}10`} stroke={C.safe} strokeWidth={0.8} />
            <text x={m.x + 40} y={126} textAnchor="middle"
              fontSize={9} fontWeight={600} fill={C.safe}>{m.name}</text>
            <text x={m.x + 40} y={135} textAnchor="middle"
              fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">max_norm={m.val}</text>
          </g>
        ))}
      </motion.g>
    </g>
  );
}
