import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { STEPS, STEP_REFS, STEP_LABELS, STORES } from './StoreCommitVizData';

export default function StoreCommitViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 340 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <defs>
              <marker id="sc-arr" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
                <path d="M0,0 L5,2 L0,4" fill="var(--muted-foreground)" opacity={0.5} />
              </marker>
            </defs>
            {/* rootmulti.Store label */}
            <rect x={60} y={8} width={220} height={24} rx={4}
              fill="#ec489912" stroke="#ec4899" strokeWidth={step === 0 ? 1.5 : 0.8} />
            <text x={170} y={24} textAnchor="middle" fontSize={10} fontWeight={700}
              fill="#ec4899">rootmulti.Store</text>

            {/* Sub-stores */}
            {STORES.map((s, i) => {
              const x = 20 + i * 80;
              const active = step === 0 || step === 1 || step === 2;
              return (
                <motion.g key={s.label}
                  animate={{ opacity: active ? 1 : 0.2 }}
                  transition={{ duration: 0.3 }}
                  style={{ cursor: onOpenCode ? 'pointer' : 'default' }}
                  onClick={() => onOpenCode?.('rootmulti-struct')}>
                  <line x1={x + 30} y1={32} x2={x + 30} y2={48} stroke="var(--border)"
                    strokeWidth={1} markerEnd="url(#sc-arr)" />
                  <rect x={x} y={50} width={60} height={50} rx={4}
                    fill={`${s.color}10`} stroke={s.color} strokeWidth={active ? 1.5 : 0.8} />
                  <text x={x + 30} y={66} textAnchor="middle" fontSize={8}
                    fontWeight={600} fill={s.color}>{s.label}</text>
                  <text x={x + 30} y={80} textAnchor="middle" fontSize={8}
                    fill="var(--muted-foreground)">IAVL</text>
                  {/* Hash indicator on commit */}
                  {step >= 2 && (
                    <motion.text x={x + 30} y={94} textAnchor="middle" fontSize={8}
                      fill={s.color} fontWeight={600}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      H{i + 1}
                    </motion.text>
                  )}
                </motion.g>
              );
            })}

            {/* Merkle merge → app_hash */}
            {step >= 3 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {STORES.map((_, i) => (
                  <line key={i} x1={20 + i * 80 + 30} y1={100} x2={170} y2={130}
                    stroke="var(--border)" strokeWidth={1} opacity={0.5} />
                ))}
                <rect x={110} y={130} width={120} height={30} rx={5}
                  fill="#ec489918" stroke="#ec4899" strokeWidth={1.5} />
                <text x={170} y={142} textAnchor="middle" fontSize={8}
                  fontWeight={700} fill="#ec4899">app_hash</text>
                <text x={170} y={154} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">= Merkle(H1, H2, H3, H4)</text>
              </motion.g>
            )}

            {/* Version label */}
            {step >= 2 && (
              <motion.text x={170} y={180} textAnchor="middle" fontSize={8}
                fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}>
                version = previousHeight + 1 — 블록 높이와 스토어 버전 1:1 대응
              </motion.text>
            )}
          </svg>
          {onOpenCode && (
            <div className="flex items-center gap-2 mt-2 justify-end">
              <CodeViewButton onClick={() => onOpenCode(STEP_REFS[step])} />
              <span className="text-[10px] text-muted-foreground">{STEP_LABELS[step]}</span>
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}
