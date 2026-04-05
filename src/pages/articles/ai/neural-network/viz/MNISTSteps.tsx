import { motion } from 'framer-motion';
import { C, DIGIT_7, PROBS } from './MNISTVizData';

const CELL = 12;
const OX = 20;
const OY = 20;

export function MNISTStep0() {
  return (
    <g>
      <text x={OX} y={OY - 4} fontSize={9} fill="var(--muted-foreground)">28×28 이미지 (8×8 축약)</text>
      {DIGIT_7.map((row, r) =>
        row.map((v, c) => (
          <motion.rect key={`${r}-${c}`} x={OX + c * CELL} y={OY + r * CELL}
            width={CELL - 1} height={CELL - 1} rx={2}
            fill={v ? C.pixel : `${C.dim}22`} stroke={v ? C.pixel : `${C.dim}44`} strokeWidth={0.5}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: (r * 8 + c) * 0.008 }} />
        ))
      )}
      {/* Flatten arrow + sample values */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <line x1={OX + 8 * CELL + 8} y1={OY + 48} x2={OX + 8 * CELL + 28} y2={OY + 48}
          stroke={C.pixel} strokeWidth={1.2} />
        <polygon points={`${OX + 8 * CELL + 28},${OY + 48} ${OX + 8 * CELL + 22},${OY + 45} ${OX + 8 * CELL + 22},${OY + 51}`}
          fill={C.pixel} />
        <text x={OX + 8 * CELL + 34} y={OY + 32} fontSize={8} fill={C.pixel} fontWeight="600">784차원 벡터</text>
        <text x={OX + 8 * CELL + 34} y={OY + 44} fontSize={8} fill={C.dim}>[0, 0, .., 0.78,</text>
        <text x={OX + 8 * CELL + 34} y={OY + 56} fontSize={8} fill={C.dim}> 0.94, .., 0, 0]</text>
        <text x={OX + 8 * CELL + 34} y={OY + 70} fontSize={8} fill="var(--muted-foreground)">
          픽셀값 ÷ 255 정규화
        </text>
      </motion.g>
    </g>
  );
}

export function MNISTStep1() {
  const layerY = 16;
  const nodeR = 5;
  const gapX = 60;
  /* Show actual neurons with sample values flowing */
  const layers = [
    { label: '784', count: 6, color: C.pixel, x: 30, vals: ['0.00', '0.78', '0.94', '0.31', '0.00', '...'] },
    { label: '50', count: 5, color: C.hidden, x: 30 + gapX, vals: ['0.62', '0.18', '0.91', '0.44', '...'] },
    { label: '100', count: 5, color: C.hidden, x: 30 + gapX * 2, vals: ['0.83', '0.27', '0.55', '0.71', '...'] },
  ];

  return (
    <g>
      <text x={20} y={layerY - 1} fontSize={9} fill="var(--muted-foreground)">은닉층을 통과하며 값이 변환</text>
      {layers.map((layer, li) => {
        const baseY = layerY + 10;
        return (
          <motion.g key={li} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: li * 0.15 }}>
            {/* Layer label */}
            <text x={layer.x + 12} y={baseY + 2} textAnchor="middle" fontSize={9}
              fontWeight="600" fill={layer.color}>{layer.label}</text>
            {/* Nodes with values */}
            {layer.vals.map((v, vi) => {
              const ny = baseY + 14 + vi * (nodeR * 2 + 5);
              return (
                <g key={vi}>
                  <circle cx={layer.x + 12} cy={ny} r={nodeR}
                    fill={`${layer.color}22`} stroke={layer.color} strokeWidth={1} />
                  <text x={layer.x + 22} y={ny + 3} fontSize={7} fill={layer.color}>{v}</text>
                </g>
              );
            })}
            {/* Arrows to next layer */}
            {li < layers.length - 1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + li * 0.15 }}>
                <line x1={layer.x + 40} y1={baseY + 40} x2={layer.x + gapX - 8} y2={baseY + 40}
                  stroke={C.dim} strokeWidth={1} />
                <polygon points={`${layer.x + gapX - 8},${baseY + 40} ${layer.x + gapX - 14},${baseY + 37} ${layer.x + gapX - 14},${baseY + 43}`}
                  fill={C.dim} />
                <text x={layer.x + gapX / 2 + 14} y={baseY + 34} textAnchor="middle"
                  fontSize={7} fill={C.dim}>σ(Wx+b)</text>
              </motion.g>
            )}
          </motion.g>
        );
      })}
      {/* Feature extraction note */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={198} y={layerY + 14} width={78} height={40} rx={5}
          fill={`${C.hidden}08`} stroke={C.hidden} strokeWidth={0.8} strokeDasharray="4 3" />
        <text x={206} y={layerY + 30} fontSize={8} fill={C.hidden} fontWeight="600">특징 추출</text>
        <text x={206} y={layerY + 44} fontSize={7} fill="var(--muted-foreground)">획 방향, 곡선 패턴</text>
      </motion.g>
    </g>
  );
}

export function MNISTStep2() {
  const barW = 16;
  const maxH = 80;
  return (
    <g>
      <text x={20} y={16} fontSize={9} fill="var(--muted-foreground)">각 숫자의 예측 확률</text>
      {PROBS.map((p, i) => {
        const x = 20 + i * (barW + 6);
        const h = Math.max(2, p.prob * maxH);
        const isTop = p.digit === 7;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}>
            <rect x={x} y={30 + maxH - h} width={barW} height={h} rx={2}
              fill={isTop ? C.highlight : `${C.dim}44`} />
            <text x={x + barW / 2} y={30 + maxH + 12} textAnchor="middle"
              fontSize={9} fontWeight={isTop ? '700' : '400'} fill={isTop ? C.highlight : C.dim}>
              {p.digit}
            </text>
            {p.prob >= 0.01 && (
              <text x={x + barW / 2} y={30 + maxH - h - 4} textAnchor="middle"
                fontSize={8} fill={isTop ? C.highlight : C.dim}>
                {(p.prob * 100).toFixed(0)}%
              </text>
            )}
          </motion.g>
        );
      })}
      {/* Winner annotation */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        {(() => {
          const winX = 20 + 7 * (barW + 6);
          return (
            <>
              <line x1={winX + barW / 2} y1={30 + maxH - 0.93 * maxH - 12}
                x2={winX + barW / 2 + 30} y2={30 + maxH - 0.93 * maxH - 20}
                stroke={C.highlight} strokeWidth={0.8} />
              <text x={winX + barW / 2 + 33} y={30 + maxH - 0.93 * maxH - 16}
                fontSize={8} fontWeight="700" fill={C.highlight}>
                예측: 7
              </text>
            </>
          );
        })()}
      </motion.g>
    </g>
  );
}
