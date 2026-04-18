import { motion } from 'framer-motion';
import { C } from './AELossVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* Step 0: 손실 함수 3가지 비교 다이어그램 */
export function Step0() {
  const losses = [
    { name: 'MSE', formula: '(1/n) Σ(x-x̂)²', c: C.mse, desc: 'Gaussian 가정' },
    { name: 'BCE', formula: '-Σ[x·log(x̂)+...]', c: C.bce, desc: 'sigmoid 궁합' },
    { name: 'Perceptual', formula: '||VGG(x)-VGG(x̂)||²', c: C.perc, desc: '시각 품질 우수' },
  ];

  return (
    <g>
      {losses.map((l, i) => {
        const x = 25 + i * 155;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: i * 0.1 }}>
            <rect x={x} y={15} width={140} height={100} rx={8}
              fill={`${l.c}08`} stroke={l.c} strokeWidth={1.2} />
            <text x={x + 70} y={35} textAnchor="middle" fontSize={11} fontWeight={700} fill={l.c}>
              {l.name}
            </text>
            {/* Formula box */}
            <rect x={x + 10} y={42} width={120} height={24} rx={4}
              fill={`${l.c}12`} stroke={l.c} strokeWidth={0.6} />
            <text x={x + 70} y={58} textAnchor="middle" fontSize={8} fill={l.c}>
              {l.formula}
            </text>
            <text x={x + 70} y={82} textAnchor="middle" fontSize={8} fill={C.muted}>{l.desc}</text>
            <text x={x + 70} y={105} textAnchor="middle" fontSize={7} fill={l.c}>
              {i === 0 ? '이미지, 임베딩' : i === 1 ? '픽셀값 ∈ [0,1]' : 'SR, 스타일 전환'}
            </text>
          </motion.g>
        );
      })}
      {/* Additional: MAE, SSIM */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
        <rect x={100} y={125} width={280} height={22} rx={4} fill={`${C.mae}08`} stroke={C.mae} strokeWidth={0.6} />
        <text x={240} y={140} textAnchor="middle" fontSize={8} fill={C.mae}>
          + MAE (이상치 강인) · SSIM (인간 시각 기반)
        </text>
      </motion.g>
    </g>
  );
}

/* Step 1: 선택 기준 플로우 차트 */
export function Step1() {
  const nodes = [
    { x: 240, y: 18, label: '데이터 범위?', c: C.muted },
    { x: 110, y: 55, label: '픽셀 [0,1]', c: C.bce },
    { x: 370, y: 55, label: '실수 범위', c: C.mse },
    { x: 50, y: 95, label: 'BCE', c: C.bce },
    { x: 170, y: 95, label: '품질 중요?', c: C.perc },
    { x: 310, y: 95, label: 'MSE', c: C.mse },
    { x: 430, y: 95, label: '이상치?', c: C.mae },
    { x: 110, y: 132, label: 'Perceptual', c: C.perc },
    { x: 240, y: 132, label: 'SSIM', c: C.perc },
    { x: 370, y: 132, label: 'MAE/Huber', c: C.mae },
  ];

  const edges: [number, number][] = [
    [0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6], [4, 7], [4, 8], [6, 9],
  ];

  return (
    <g>
      {edges.map(([from, to], i) => (
        <motion.line key={i}
          x1={nodes[from].x} y1={nodes[from].y + 10}
          x2={nodes[to].x} y2={nodes[to].y - 5}
          stroke={C.muted} strokeWidth={0.7}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ ...sp, delay: i * 0.04 }} />
      ))}
      {nodes.map((n, i) => (
        <motion.g key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ ...sp, delay: i * 0.05 }}>
          <rect x={n.x - 45} y={n.y - 10} width={90} height={20} rx={10}
            fill={`${n.c}12`} stroke={n.c} strokeWidth={0.8} />
          <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={8} fontWeight={600} fill={n.c}>
            {n.label}
          </text>
        </motion.g>
      ))}
    </g>
  );
}

/* Step 2: 역전파 체인룰 — 2행 흐름 */
export function Step2() {
  return (
    <g>
      {/* 제목 */}
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill={C.grad} fontWeight={700}>
        역전파: 출력 오차 → 디코더 → 인코더 순서로 전파
      </text>

      {/* 1행: 디코더 역전파 */}
      <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <rect x={10} y={24} width={460} height={42} rx={6}
          fill={`${C.dec}06`} stroke={C.dec} strokeWidth={0.8} />
        <text x={20} y={38} fontSize={8} fontWeight={700} fill={C.dec}>디코더</text>

        {[
          { label: 'dL/dx̂', desc: '출력 오차', x: 100 },
          { label: 'δ_dec', desc: 'σ\'(z₂) 곱', x: 200 },
          { label: 'dL/dW₂', desc: 'δ·zᵀ', x: 300 },
        ].map((s, i) => (
          <g key={i}>
            <rect x={s.x - 35} y={30} width={70} height={28} rx={5}
              fill={`${C.dec}12`} stroke={C.dec} strokeWidth={0.8} />
            <text x={s.x} y={42} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.dec}>{s.label}</text>
            <text x={s.x} y={54} textAnchor="middle" fontSize={7} fill={C.muted}>{s.desc}</text>
            {i < 2 && <text x={s.x + 42} y={46} fontSize={10} fill={C.grad}>→</text>}
          </g>
        ))}
        <text x={400} y={46} fontSize={8} fill={C.dec}>W₂ 업데이트</text>
      </motion.g>

      {/* 연결 화살표 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
        <text x={240} y={78} textAnchor="middle" fontSize={9} fill={C.grad}>↓ dL/dz = W₂ᵀ · δ_dec</text>
      </motion.g>

      {/* 2행: 인코더 역전파 */}
      <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.3 }}>
        <rect x={10} y={86} width={460} height={42} rx={6}
          fill={`${C.enc}06`} stroke={C.enc} strokeWidth={0.8} />
        <text x={20} y={100} fontSize={8} fontWeight={700} fill={C.enc}>인코더</text>

        {[
          { label: 'dL/dz', desc: '전파된 오차', x: 100 },
          { label: 'δ_enc', desc: 'σ\'(z₁) 곱', x: 200 },
          { label: 'dL/dW₁', desc: 'δ·xᵀ', x: 300 },
        ].map((s, i) => (
          <g key={i}>
            <rect x={s.x - 35} y={92} width={70} height={28} rx={5}
              fill={`${C.enc}12`} stroke={C.enc} strokeWidth={0.8} />
            <text x={s.x} y={104} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.enc}>{s.label}</text>
            <text x={s.x} y={116} textAnchor="middle" fontSize={7} fill={C.muted}>{s.desc}</text>
            {i < 2 && <text x={s.x + 42} y={108} fontSize={10} fill={C.grad}>→</text>}
          </g>
        ))}
        <text x={400} y={108} fontSize={8} fill={C.enc}>W₁ 업데이트</text>
      </motion.g>

      {/* 하단 요약 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <rect x={80} y={136} width={320} height={16} rx={4}
          fill={`${C.grad}08`} stroke={C.grad} strokeWidth={0.5} />
        <text x={240} y={148} textAnchor="middle" fontSize={8} fill={C.grad}>
          W₁, W₂, b₁, b₂ — 4개 파라미터 동시 업데이트
        </text>
      </motion.g>
    </g>
  );
}

/* Step 3: 파라미터 업데이트 + 실무 팁 */
export function Step3() {
  return (
    <g>
      {/* Update rule */}
      <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={sp}>
        <rect x={100} y={10} width={280} height={40} rx={8}
          fill={`${C.enc}10`} stroke={C.enc} strokeWidth={1.2} />
        <text x={240} y={28} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.enc}>
          W ← W - η · ∂L/∂W
        </text>
        <text x={240} y={42} textAnchor="middle" fontSize={8} fill={C.muted}>η = 학습률 (learning rate)</text>
      </motion.g>

      {/* Practical tips as cards */}
      {[
        { label: '초기화', val: 'Xavier / He', c: C.enc, x: 60 },
        { label: 'Optimizer', val: 'Adam (1e-3)', c: C.dec, x: 180 },
        { label: 'Stopping', val: 'val_loss 기준', c: C.perc, x: 300 },
        { label: 'Batch', val: '64 ~ 256', c: C.mae, x: 420 },
      ].map((t, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: 0.15 + i * 0.1 }}>
          <rect x={t.x - 48} y={65} width={96} height={50} rx={6}
            fill={`${t.c}08`} stroke={t.c} strokeWidth={1} />
          <text x={t.x} y={82} textAnchor="middle" fontSize={8} fontWeight={600} fill={t.c}>{t.label}</text>
          <text x={t.x} y={100} textAnchor="middle" fontSize={9} fontWeight={700} fill={t.c}>{t.val}</text>
        </motion.g>
      ))}

      {/* Sigmoid warning */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <rect x={80} y={125} width={320} height={22} rx={4}
          fill={`${C.grad}08`} stroke={C.grad} strokeWidth={0.8} strokeDasharray="4 2" />
        <text x={240} y={140} textAnchor="middle" fontSize={8} fill={C.grad}>
          sigmoid 포화 → 기울기 소실 → ReLU/GELU 권장
        </text>
      </motion.g>
    </g>
  );
}
