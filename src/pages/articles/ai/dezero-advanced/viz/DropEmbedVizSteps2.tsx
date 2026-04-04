import { motion } from 'framer-motion';
import { CV, CE, CA } from './DropEmbedVizData';

const d = 0.06;

function Line({ y, text, color, delay = 0, bold }: {
  y: number; text: string; color: string; delay?: number; bold?: boolean;
}) {
  return (
    <motion.text x={18} y={y} fontSize={10} fontFamily="monospace" fill={color}
      fontWeight={bold ? 700 : 400}
      initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}>
      {text}
    </motion.text>
  );
}

export function EmbeddingLookupStep() {
  return (
    <g>
      <Line y={16} text='// Embedding: 정수 ID → 밀집 벡터 룩업' color="var(--muted-foreground)" delay={0} />
      <Line y={34} text='words = ["the", "cat", "sat"]' color={CA} delay={d} />
      <Line y={49} text="idx   = [4, 12, 8]         // 단어 → 정수 인덱스" color={CA} delay={d * 2} />
      <Line y={69} text="W: (V=100, D=4)             // 임베딩 테이블" color={CV} delay={d * 3} />
      <Line y={87} text="out[0] = W[4]  = [0.21, -0.15, 0.83, 0.42]" color={CE} delay={d * 4} />
      <Line y={102} text="out[1] = W[12] = [0.55, 0.31, -0.27, 0.18]" color={CE} delay={d * 5} />
      <Line y={117} text="out[2] = W[8]  = [-0.44, 0.67, 0.12, 0.90]" color={CE} delay={d * 6} />
      <Line y={137} text="// output: (3, 4) — 행 복사 O(3*D)" color="var(--muted-foreground)" delay={d * 7} />
      <Line y={152} text="// one_hot @ W와 동일 결과, O(V*D)보다 효율적" color="var(--muted-foreground)" delay={d * 8} />
    </g>
  );
}

export function ScatterAddStep() {
  return (
    <g>
      <Line y={16} text="// Embedding backward: scatter-add" color="var(--muted-foreground)" delay={0} />
      <Line y={34} text="gy = [[0.1, 0.3, -0.2, 0.5],  // 상위 기울기 (3, 4)" color={CA} delay={d} />
      <Line y={49} text="      [0.4, -0.1, 0.6, 0.2]," color={CA} delay={d * 2} />
      <Line y={64} text="      [0.3, 0.5, 0.1, -0.3]]" color={CA} delay={d * 3} />
      <Line y={84} text="gW = zeros(100, 4)       // vocab 전체 기울기 행렬" color={CV} delay={d * 4} />
      <Line y={102} text="gW[4]  += gy[0]  → [0.1,  0.3, -0.2,  0.5]" color={CE} delay={d * 5} />
      <Line y={117} text="gW[12] += gy[1]  → [0.4, -0.1,  0.6,  0.2]" color={CE} delay={d * 6} />
      <Line y={132} text="gW[8]  += gy[2]  → [0.3,  0.5,  0.1, -0.3]" color={CE} delay={d * 7} />
      <Line y={152} text="// 97행 = 0, 3행만 갱신 — O(3*D) 연산" color="var(--muted-foreground)" delay={d * 8} />
    </g>
  );
}
