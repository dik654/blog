import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { VOCAB, EXAMPLE_INDICES, EMB_EXAMPLE, STEPS, COLORS } from '../DataPrepData';

const CW = 38, CH = 20, GAP = 3;

function OneHotRow({ idx, row }: { idx: number; row: number }) {
  return (
    <g>
      <text x={150} y={130 + row * 22} fontSize={9} fill="var(--muted-foreground)">{VOCAB[idx]}:</text>
      {Array.from({ length: 11 }, (_, j) => (
        <g key={j}>
          <rect x={182 + j * 14} y={122 + row * 22} width={12} height={14} rx={1}
            fill={j === idx ? `${COLORS.accent}40` : `${COLORS.primary}08`}
            stroke={j === idx ? COLORS.accent : 'var(--border)'} strokeWidth={j === idx ? 1 : 0.3} />
          <text x={188 + j * 14} y={132 + row * 22} textAnchor="middle"
            fontSize={9} fill={j === idx ? COLORS.accent : 'var(--muted-foreground)'}>{j === idx ? '1' : '0'}</text>
        </g>
      ))}
    </g>
  );
}

export default function DataPrepViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={10} y={12} fontSize={9} fontWeight={600} fill={COLORS.primary}>단어장 (vocab_size=11)</text>
          {VOCAB.map((w, i) => {
            const col = i % 6, row = Math.floor(i / 6);
            const x = 10 + col * (CW + GAP), y = 18 + row * (CH + GAP);
            const hl = step >= 2 && EXAMPLE_INDICES.includes(i);
            return (
              <g key={i}>
                <motion.rect x={x} y={y} width={CW} height={CH} rx={3}
                  animate={{ fill: hl ? `${COLORS.accent}30` : `${COLORS.primary}10`,
                    stroke: hl ? COLORS.accent : COLORS.primary, strokeWidth: hl ? 1.5 : 0.5 }} />
                <text x={x + CW / 2} y={y + 9} textAnchor="middle" fontSize={9} fill="var(--foreground)">{w}</text>
                <text x={x + CW / 2} y={y + 17} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{i}</text>
              </g>
            );
          })}
          {step >= 1 && ['감사', '합니다'].map((t, i) => (
            <motion.g key={t} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
              <rect x={10 + i * 60} y={80} width={50} height={20} rx={3}
                fill={`${COLORS.secondary}15`} stroke={COLORS.secondary} strokeWidth={1} />
              <text x={35 + i * 60} y={93} textAnchor="middle" fontSize={9} fontWeight={500} fill={COLORS.secondary}>{t}</text>
            </motion.g>
          ))}
          {step >= 2 && [3, 4].map((idx, i) => (
            <g key={i}>
              <rect x={10 + i * 40} y={115} width={30} height={18} rx={3}
                fill={`${COLORS.accent}15`} stroke={COLORS.accent} strokeWidth={1} />
              <text x={25 + i * 40} y={127} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.accent}>{idx}</text>
            </g>
          ))}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={150} y={115} fontSize={9} fontWeight={600} fill={COLORS.primary}>원-핫 벡터 (11차원)</text>
              {[3, 4].map((idx, row) => <OneHotRow key={idx} idx={idx} row={row} />)}
            </motion.g>
          )}
          {step >= 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={10} y={175} fontSize={9} fontWeight={600} fill={COLORS.secondary}>임베딩 벡터 (d_model=6)</text>
              {['감사', '합니다'].map((t, row) => (
                <g key={row}>
                  <text x={10} y={190 + row * 16} fontSize={9} fill="var(--muted-foreground)">{t}:</text>
                  {EMB_EXAMPLE.map((v, j) => (
                    <g key={j}>
                      <rect x={45 + j * 38} y={182 + row * 16} width={35} height={13} rx={2}
                        fill={`${COLORS.secondary}10`} stroke={COLORS.secondary} strokeWidth={0.5} />
                      <text x={62 + j * 38} y={192 + row * 16} textAnchor="middle" fontSize={9} fill={COLORS.secondary}>{v.toFixed(2)}</text>
                    </g>
                  ))}
                </g>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
