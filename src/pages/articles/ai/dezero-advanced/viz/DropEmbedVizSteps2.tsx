import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './DropEmbedVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

export function EmbeddingLookupStep() {
  const words = ['the', 'cat', 'sat'];
  const idxs = [4, 12, 8];
  const vecs = [
    [0.21, -0.15, 0.83, 0.42],
    [0.55, 0.31, -0.27, 0.18],
    [-0.44, 0.67, 0.12, 0.90],
  ];
  const rowH = 26, startY = 42;
  return (
    <g>
      <text x={15} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">
        Embedding: 정수 ID → 밀집 벡터 룩업
      </text>

      {/* embedding table W */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.1 }}>
        <rect x={130} y={22} width={80} height={110} rx={4}
          fill={`${CV}08`} stroke={CV} strokeWidth={0.8} />
        <text x={170} y={18} textAnchor="middle" fontSize={8} fontWeight={600} fill={CV}>
          W (V=100, D=4)
        </text>
        {/* row highlights for selected indices */}
        {idxs.map((idx, i) => (
          <motion.rect key={i} x={132} y={28 + i * 32} width={76} height={14} rx={2}
            fill={`${CE}20`} stroke={CE} strokeWidth={0.5}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ ...sp, delay: 0.25 + i * 0.1 }} />
        ))}
        {idxs.map((idx, i) => (
          <text key={`l${i}`} x={170} y={28 + i * 32 + 10} textAnchor="middle"
            fontSize={7} fill={CV}>row {idx}</text>
        ))}
        {/* dots for other rows */}
        <text x={170} y={120} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          ...
        </text>
      </motion.g>

      {/* word inputs */}
      {words.map((w, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp, delay: i * 0.08 }}>
          <rect x={15} y={startY + i * rowH} width={70} height={20} rx={4}
            fill={`${CA}15`} stroke={CA} strokeWidth={0.7} />
          <text x={50} y={startY + i * rowH + 13} textAnchor="middle"
            fontSize={8} fill={CA}>{`"${w}" → ${idxs[i]}`}</text>
        </motion.g>
      ))}

      {/* arrows from words to table */}
      {words.map((_, i) => (
        <motion.line key={`a${i}`}
          x1={85} y1={startY + i * rowH + 10}
          x2={130} y2={35 + i * 32}
          stroke={CA} strokeWidth={0.6} markerEnd="url(#arrowE)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.15 + i * 0.08 }} />
      ))}

      {/* output vectors */}
      {vecs.map((vec, i) => (
        <motion.g key={`v${i}`} initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp, delay: 0.35 + i * 0.1 }}>
          <rect x={255} y={startY + i * rowH - 2} width={200} height={20} rx={3}
            fill={`${CE}15`} stroke={CE} strokeWidth={0.7} />
          <text x={265} y={startY + i * rowH + 11} fontSize={7} fill={CE}>
            out[{i}] = [{vec.map(v => v >= 0 ? ` ${v.toFixed(2)}` : v.toFixed(2)).join(', ')}]
          </text>
        </motion.g>
      ))}

      {/* arrows from table to output */}
      {vecs.map((_, i) => (
        <motion.line key={`b${i}`}
          x1={210} y1={35 + i * 32}
          x2={255} y2={startY + i * rowH + 8}
          stroke={CE} strokeWidth={0.6} markerEnd="url(#arrowE)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.3 + i * 0.1 }} />
      ))}

      <motion.text x={255} y={130} fontSize={7} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        output (3, 4) -- 행 복사 O(N*D), one_hot @ W보다 효율적
      </motion.text>

      <defs>
        <marker id="arrowE" viewBox="0 0 6 6" refX={5} refY={3}
          markerWidth={4} markerHeight={4} orient="auto-start-reverse">
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--muted-foreground)" />
        </marker>
      </defs>
    </g>
  );
}

export function ScatterAddStep() {
  const gy = [
    [0.1, 0.3, -0.2, 0.5],
    [0.4, -0.1, 0.6, 0.2],
    [0.3, 0.5, 0.1, -0.3],
  ];
  const idxs = [4, 12, 8];
  const startX = 18, colW = 52, rowH = 24;
  return (
    <g>
      <text x={15} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">
        Embedding backward: scatter-add
      </text>

      {/* gy matrix (input gradient) */}
      <text x={startX} y={30} fontSize={8} fontWeight={600} fill={CA}>gy (3, 4)</text>
      {gy.map((row, r) => (
        <motion.g key={r} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ ...sp, delay: r * 0.08 }}>
          {row.map((v, c) => (
            <g key={c}>
              <rect x={startX + c * colW} y={34 + r * rowH} width={46} height={18} rx={2}
                fill={`${CA}15`} stroke={CA} strokeWidth={0.5} />
              <text x={startX + c * colW + 23} y={34 + r * rowH + 12} textAnchor="middle"
                fontSize={7} fill={CA}>{v >= 0 ? `+${v.toFixed(1)}` : v.toFixed(1)}</text>
            </g>
          ))}
        </motion.g>
      ))}

      {/* gW target (100x4 matrix) */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.3 }}>
        <rect x={260} y={20} width={195} height={98} rx={4}
          fill={`${CV}06`} stroke={CV} strokeWidth={0.8} />
        <text x={357} y={16} textAnchor="middle" fontSize={8} fontWeight={600} fill={CV}>
          gW (100, 4)
        </text>
        {/* zero rows indicators */}
        <text x={270} y={38} fontSize={7} fill="#888888">row 0-3: 0</text>
        <text x={270} y={110} fontSize={7} fill="#888888">row 13-99: 0</text>
      </motion.g>

      {/* scatter-add target rows */}
      {gy.map((row, r) => (
        <motion.g key={`s${r}`} initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp, delay: 0.4 + r * 0.12 }}>
          <text x={268} y={52 + r * 22} fontSize={7} fontWeight={600} fill={CE}>
            [{idxs[r]}]
          </text>
          {row.map((v, c) => (
            <rect key={c} x={290 + c * 40} y={42 + r * 22} width={34} height={16} rx={2}
              fill={`${CE}20`} stroke={CE} strokeWidth={0.6} />
          ))}
          {row.map((v, c) => (
            <text key={`t${c}`} x={290 + c * 40 + 17} y={42 + r * 22 + 11} textAnchor="middle"
              fontSize={7} fontWeight={600} fill={CE}>
              {v >= 0 ? `+${v.toFixed(1)}` : v.toFixed(1)}
            </text>
          ))}
        </motion.g>
      ))}

      {/* arrows from gy to gW */}
      {gy.map((_, r) => (
        <motion.line key={`ar${r}`}
          x1={startX + 4 * colW + 5} y1={43 + r * rowH}
          x2={260} y2={50 + r * 22}
          stroke={CE} strokeWidth={0.6} markerEnd="url(#arrowS)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.35 + r * 0.1 }} />
      ))}

      {/* note */}
      <motion.text x={15} y={140} fontSize={7} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        97행 = 0 유지, 3행만 갱신 -- O(N*D) 연산, 같은 idx는 기울기 합산(+=)
      </motion.text>

      <defs>
        <marker id="arrowS" viewBox="0 0 6 6" refX={5} refY={3}
          markerWidth={4} markerHeight={4} orient="auto-start-reverse">
          <path d="M0,0 L6,3 L0,6 Z" fill={CE} />
        </marker>
      </defs>
    </g>
  );
}
