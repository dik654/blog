import { motion } from 'framer-motion';
import { C } from './CeIntuitionVizData';

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

/* ── Step 0: 정보이론 해석 ── */
export function CeIntuitionStep0() {
  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">
        Cross-Entropy = 정답 분포 P를 예측 분포 Q로 인코딩할 때 평균 bits
      </text>

      {/* P: one-hot */}
      <motion.g {...slideR(0)}>
        <rect x={10} y={26} width={130} height={62} rx={7}
          fill={`${C.info}08`} stroke={C.info} strokeWidth={1.2} />
        <text x={75} y={42} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.info}>P (정답)</text>
        <text x={20} y={58} fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">[0, 0, 1, 0]</text>
        <text x={20} y={72} fontSize={8} fill={C.info}>one-hot → H(P)=0</text>
        <text x={20} y={82} fontSize={7} fill="var(--muted-foreground)">엔트로피 0 = 불확실성 없음</text>
      </motion.g>

      {/* arrow */}
      <motion.g {...fade(0.15)}>
        <Arr x1={148} y1={57} x2={178} y2={57} color={C.info} />
        <text x={163} y={50} textAnchor="middle" fontSize={7} fill={C.info}>비교</text>
      </motion.g>

      {/* Q: softmax */}
      <motion.g {...slideR(0.2)}>
        <rect x={185} y={26} width={130} height={62} rx={7}
          fill={`${C.good}08`} stroke={C.good} strokeWidth={1.2} />
        <text x={250} y={42} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.good}>Q (예측)</text>
        <text x={195} y={58} fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">[0.1, 0.2, 0.6, 0.1]</text>
        <text x={195} y={72} fontSize={8} fill={C.good}>softmax 출력</text>
        <text x={195} y={82} fontSize={7} fill="var(--muted-foreground)">확률 분포 (합=1)</text>
      </motion.g>

      {/* formula derivation */}
      <motion.g {...fade(0.35)}>
        <rect x={330} y={26} width={140} height={62} rx={7}
          fill={`${C.perfect}08`} stroke={C.perfect} strokeWidth={1} strokeDasharray="4 3" />
        <text x={400} y={42} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.perfect}>핵심 단순화</text>
        <text x={340} y={58} fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">
          H(P,Q) = -Σ P·log Q
        </text>
        <text x={340} y={72} fontSize={8} fontFamily="monospace" fill={C.perfect}>
          = -log Q(정답)
        </text>
        <text x={340} y={82} fontSize={7} fill="var(--muted-foreground)">P가 one-hot이면 정답만 남음</text>
      </motion.g>

      {/* bottom summary */}
      <motion.g {...fade(0.5)}>
        <rect x={10} y={100} width={460} height={44} rx={6}
          fill="var(--muted)" fillOpacity={0.25} stroke="var(--border)" strokeWidth={0.8} />
        <text x={20} y={116} fontSize={9} fontWeight={600} fill="var(--foreground)">
          왜 -log?
        </text>
        <text x={20} y={132} fontSize={8} fill="var(--muted-foreground)">
          Q(정답)=1 → -log(1)=0 (loss 없음) · Q(정답)→0 → -log(0)→∞ (loss 폭증) · 확률이 낮을수록 더 큰 벌점
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 1: 구체 계산 예시 ── */
export function CeIntuitionStep1() {
  const scenarios = [
    {
      label: '괜찮은 예측',
      pred: [0.1, 0.2, 0.6, 0.1],
      catProb: 0.6,
      loss: 0.51,
      color: C.good,
    },
    {
      label: '랜덤 예측',
      pred: [0.25, 0.25, 0.25, 0.25],
      catProb: 0.25,
      loss: 1.39,
      color: C.bad,
    },
    {
      label: '완벽 예측',
      pred: [0, 0, 1, 0],
      catProb: 1.0,
      loss: 0,
      color: C.perfect,
    },
  ];

  const maxLoss = 1.5;
  const barMaxW = 80;

  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">
        True = [0, 0, 1, 0] (cat) · Loss = -log(Q(cat))
      </text>

      {scenarios.map((s, i) => {
        const y = 28 + i * 42;
        const barW = (s.loss / maxLoss) * barMaxW;
        return (
          <motion.g key={i} {...slideR(i * 0.12)}>
            {/* scenario box */}
            <rect x={10} y={y} width={148} height={36} rx={6}
              fill={`${s.color}08`} stroke={s.color} strokeWidth={1} />
            <text x={20} y={y + 14} fontSize={9} fontWeight={700} fill={s.color}>{s.label}</text>
            <text x={20} y={y + 28} fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">
              [{s.pred.join(', ')}]
            </text>

            {/* arrow */}
            <Arr x1={164} y1={y + 18} x2={182} y2={y + 18} color={C.dim} />

            {/* calculation */}
            <text x={190} y={y + 14} fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">
              -log({s.catProb})
            </text>
            <text x={190} y={y + 28} fontSize={9} fontWeight={700} fill={s.color}>
              = {s.loss.toFixed(2)}
            </text>

            {/* loss bar */}
            <rect x={280} y={y + 6} width={barW} height={14} rx={3}
              fill={s.color} fillOpacity={0.35} stroke={s.color} strokeWidth={0.8} />
            {s.loss > 0 && (
              <text x={285 + barW} y={y + 17} fontSize={8} fontWeight={600} fill={s.color}>
                L={s.loss.toFixed(2)}
              </text>
            )}
            {s.loss === 0 && (
              <text x={285} y={y + 17} fontSize={8} fontWeight={600} fill={s.color}>L=0 ✓</text>
            )}
          </motion.g>
        );
      })}

      {/* bottom summary instead of overlapping side box */}
      <motion.g {...fade(0.4)}>
        <rect x={10} y={136} width={460} height={26} rx={5}
          fill={`${C.info}08`} stroke={C.info} strokeWidth={0.8} strokeDasharray="4 3" />
        <text x={240} y={148} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.info}>
          패턴: Q(정답)↑ → loss↓ (0에 수렴) · Q(정답)→0 → loss→∞ (급벌칙)
        </text>
        <text x={240} y={160} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          확률이 낮을수록 -log가 급격히 증가
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 2: Gradient 특성 — Self-regulating ── */
export function CeIntuitionStep2() {
  /* gradient magnitude |Q(c) - 1| at various Q(c) values */
  const points = [
    { q: 0.05, grad: 0.95 },
    { q: 0.2, grad: 0.8 },
    { q: 0.4, grad: 0.6 },
    { q: 0.6, grad: 0.4 },
    { q: 0.8, grad: 0.2 },
    { q: 0.95, grad: 0.05 },
  ];

  /* chart area */
  const cx = 30, cy = 30, cw = 260, ch = 80;

  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">
        ∂L/∂logit = Q(c) − 1 · 틀릴수록 gradient 강함, 맞을수록 자동 감소
      </text>

      {/* axes */}
      <motion.g {...fade(0)}>
        {/* Y axis */}
        <line x1={cx} y1={cy} x2={cx} y2={cy + ch} stroke="var(--border)" strokeWidth={1} />
        <text x={cx - 4} y={cy + 4} textAnchor="end" fontSize={7} fill="var(--muted-foreground)">1.0</text>
        <text x={cx - 4} y={cy + ch + 4} textAnchor="end" fontSize={7} fill="var(--muted-foreground)">0</text>
        <text x={cx - 8} y={cy + ch / 2} textAnchor="end" fontSize={7} fill={C.bad}
          transform={`rotate(-90,${cx - 8},${cy + ch / 2})`}>|gradient|</text>
        {/* X axis */}
        <line x1={cx} y1={cy + ch} x2={cx + cw} y2={cy + ch} stroke="var(--border)" strokeWidth={1} />
        <text x={cx + cw / 2} y={cy + ch + 14} textAnchor="middle" fontSize={8} fill={C.good}>
          Q(정답 클래스) →
        </text>
        <text x={cx} y={cy + ch + 14} fontSize={7} fill="var(--muted-foreground)">0</text>
        <text x={cx + cw} y={cy + ch + 14} fontSize={7} fill="var(--muted-foreground)">1</text>
      </motion.g>

      {/* curve via connected dots */}
      <motion.g {...fade(0.15)}>
        {/* line path */}
        <polyline
          points={points.map(p => `${cx + p.q * cw},${cy + (1 - p.grad) * ch}`).join(' ')}
          fill="none" stroke={C.bad} strokeWidth={1.5} strokeLinejoin="round"
        />
        {/* dots */}
        {points.map((p, i) => {
          const px = cx + p.q * cw;
          const py = cy + (1 - p.grad) * ch;
          const isWrong = p.q < 0.5;
          return (
            <motion.g key={i} {...fade(0.2 + i * 0.06)}>
              <circle cx={px} cy={py} r={3} fill={isWrong ? C.bad : C.good} />
              <text x={px} y={py - 6} textAnchor="middle" fontSize={7} fontWeight={600}
                fill={isWrong ? C.bad : C.good}>{p.grad.toFixed(2)}</text>
            </motion.g>
          );
        })}
      </motion.g>

      {/* annotations */}
      <motion.g {...slideR(0.5)}>
        <rect x={310} y={28} width={160} height={36} rx={6}
          fill={`${C.bad}08`} stroke={C.bad} strokeWidth={1} />
        <text x={320} y={42} fontSize={9} fontWeight={700} fill={C.bad}>틀릴 때 (Q≈0)</text>
        <text x={320} y={56} fontSize={8} fill="var(--muted-foreground)">grad ≈ -1 → 강한 업데이트</text>
      </motion.g>

      <motion.g {...slideR(0.6)}>
        <rect x={310} y={72} width={160} height={36} rx={6}
          fill={`${C.good}08`} stroke={C.good} strokeWidth={1} />
        <text x={320} y={86} fontSize={9} fontWeight={700} fill={C.good}>맞을 때 (Q≈1)</text>
        <text x={320} y={100} fontSize={8} fill="var(--muted-foreground)">grad ≈ 0 → 미세 조정</text>
      </motion.g>

      {/* bottom summary */}
      <motion.g {...fade(0.7)}>
        <rect x={10} y={128} width={460} height={20} rx={4}
          fill={`${C.info}08`} stroke={C.info} strokeWidth={0.8} />
        <text x={240} y={142} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.info}>
          Self-regulating: 별도의 learning rate 스케줄링 없이 gradient가 자동 조절됨
        </text>
      </motion.g>
    </g>
  );
}
