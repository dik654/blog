import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ENC_TOKENS, DEC_TOKENS, CROSS_ATTN, STEPS, BODY, COLORS } from '../CrossAttentionData';

const BW = 50, BH = 22, GAP = 6;

function TokenCol({ tokens, x, y, color, label, active }: {
  tokens: string[]; x: number; y: number; color: string; label: string; active: boolean;
}) {
  return (
    <g>
      <text x={x + BW / 2} y={y} textAnchor="middle" fontSize={9} fontWeight={600} fill={color}>{label}</text>
      {tokens.map((t, i) => (
        <g key={i}>
          <motion.rect x={x} y={y + 6 + i * (BH + GAP)} width={BW} height={BH} rx={4}
            animate={{ fill: `${color}${active ? '18' : '08'}`, stroke: color, strokeWidth: active ? 1.2 : 0.5 }} />
          <text x={x + BW / 2} y={y + 20 + i * (BH + GAP)} textAnchor="middle" fontSize={9} fill={color}>{t}</text>
        </g>
      ))}
    </g>
  );
}

function QKVBox({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={x} y={y} width={30} height={40} rx={4} fill={`${color}08`} stroke={color} strokeWidth={0.8} />
      <text x={x + 15} y={y + 24} textAnchor="middle" fontSize={9} fontWeight={600} fill={color}>{label}</text>
    </motion.g>
  );
}

export default function CrossAttentionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 195" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <TokenCol tokens={ENC_TOKENS} x={30} y={14} color={COLORS.enc} label="인코더" active={step >= 0} />
          <TokenCol tokens={DEC_TOKENS} x={30} y={120} color={COLORS.dec} label="디코더" active={step >= 1} />

          {step >= 0 && (
            <>
              <QKVBox x={110} y={28} label="K" color={COLORS.enc} />
              <QKVBox x={150} y={28} label="V" color={COLORS.enc} />
            </>
          )}
          {step >= 1 && <QKVBox x={110} y={130} label="Q" color={COLORS.dec} />}

          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={310} y={20} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.cross}>
                Q × Kᵀ 어텐션 (2×3)
              </text>
              {ENC_TOKENS.map((t, i) => (
                <text key={`c${i}`} x={260 + i * 36 + 18} y={32} textAnchor="middle" fontSize={9} fill={COLORS.enc}>{t}</text>
              ))}
              {DEC_TOKENS.map((t, i) => (
                <text key={`r${i}`} x={252} y={48 + i * 28} textAnchor="end" fontSize={9} fill={COLORS.dec}>{t}</text>
              ))}
              {CROSS_ATTN.map((row, r) => row.map((v, c) => {
                const hex = Math.round(v * 220).toString(16).padStart(2, '0');
                return (
                  <g key={`${r}${c}`}>
                    <rect x={260 + c * 36} y={36 + r * 28} width={34} height={24} rx={3}
                      fill={`${COLORS.cross}${hex}`} stroke={COLORS.cross} strokeWidth={0.6} />
                    <text x={260 + c * 36 + 17} y={52 + r * 28} textAnchor="middle" fontSize={9} fontWeight={500}
                      fill={v > 0.4 ? '#fff' : 'var(--foreground)'}>{v.toFixed(2)}</text>
                  </g>
                );
              }))}
            </motion.g>
          )}

          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={380} y={110} fontSize={9} fontWeight={600} fill={COLORS.output}>× V → 출력 (2×6)</text>
              <text x={380} y={124} fontSize={9} fill="var(--muted-foreground)">디코더가 인코더 정보를 참조</text>
            </motion.g>
          )}

          <motion.text x={260} y={170} fontSize={9} fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
