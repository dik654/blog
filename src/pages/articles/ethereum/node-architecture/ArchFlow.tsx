import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { flows } from './archFlows';
import { modules } from './archData';
import { stepVisuals } from './archStepVisuals';
import { codeRefs } from './archCodeRefs';
import type { CodeRef } from './archCodeRefs';
import ArchFlowStepTrack from './ArchFlowStepTrack';

const badge = (id: string) => {
  const l = modules[id]?.layer;
  return l === 'cl'   ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
    : l === 'el'      ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300'
    :                   'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300';
};

export default function ArchFlow({
  moduleId, onStepModules, onCodeRef,
}: {
  moduleId: string; onStepModules: (ids: string[]) => void; onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  const flow = flows[moduleId];
  const [step, setStep] = useState(0);

  useEffect(() => { setStep(0); if (flow) onStepModules(flow.steps[0]?.modules ?? []); }, [moduleId]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (flow) onStepModules(flow.steps[step]?.modules ?? []); }, [step]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!flow) return null;

  const total = flow.steps.length;
  const go = (n: number) => setStep(s => Math.max(0, Math.min(total - 1, s + n)));

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1">
        <p className="text-[11px] font-semibold text-foreground/60 shrink-0 mr-1">{flow.title}</p>
        <ArchFlowStepTrack moduleId={moduleId} steps={flow.steps} step={step} setStep={setStep} />
      </div>
      <div className="min-h-[130px]">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.13 }} className="space-y-2">
            {(() => { const V = stepVisuals[`${moduleId}-${step}`]; return V ? (
              <><V /><p className="text-[11px] text-foreground/75 leading-relaxed">{flow.steps[step].desc}</p></>
            ) : (<p className="text-xs text-foreground leading-relaxed">{flow.steps[step].desc}</p>); })()}
            {onCodeRef && codeRefs[`${moduleId}-${step}`] && (
              <button onClick={() => onCodeRef(`${moduleId}-${step}`, codeRefs[`${moduleId}-${step}`])}
                className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border border-amber-300 bg-amber-50/60 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/40 transition-colors cursor-pointer">
                {'{ }'} 코드 보기
              </button>
            )}
            <div className="flex flex-wrap gap-1.5 items-center">
              {flow.steps[step].modules.map((id, i, arr) => (
                <span key={id} className="flex items-center gap-1">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${badge(id)}`}>{modules[id]?.label ?? id}</span>
                  {i < arr.length - 1 && <span className="text-foreground/75 text-xs">→</span>}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => go(-1)} disabled={step === 0}
          className="flex-1 py-1 text-xs rounded-md border border-border hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors">← 이전</button>
        <span className="text-[10px] text-foreground/75 shrink-0 tabular-nums w-10 text-center">{step + 1} / {total}</span>
        <button onClick={() => go(1)} disabled={step === total - 1}
          className="flex-1 py-1 text-xs rounded-md border border-border hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors">다음 →</button>
      </div>
    </div>
  );
}
