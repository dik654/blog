import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CellProofDASViz from './viz/CellProofDASViz';
import CodeViewButton from '@/components/code/CodeViewButton';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { CELL_PROOF_STEPS, VERSION_COMPARE } from './CellProofDASData';

export default function CellProofDAS({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  const open = onCodeRef ? (key: string) => onCodeRef(key, codeRefs[key]) : undefined;
  const [step, setStep] = useState(0);

  return (
    <section id="cell-proof-das" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Cell Proof와 DAS 구조</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Blob 전체를 한 번에 검증하면 라이트 노드에게 부담이 크다.<br />
          Cell proof는 blob을 128개 조각(cell)으로 분할하고, 각 cell에 독립 KZG 증명을 붙인다.<br />
          라이트 노드는 랜덤 cell 몇 개만 요청해도 전체 가용성을 확률적으로 보장할 수 있다.
        </p>
      </div>

      {/* Step cards */}
      <div className="space-y-2 mb-8">
        {CELL_PROOF_STEPS.map((s, i) => (
          <motion.div key={i} onClick={() => setStep(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === step ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-border'}`}
            animate={{ opacity: i === step ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === step ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'}`}>{i + 1}</span>
              <span className="font-semibold text-sm">{s.title}</span>
            </div>
            <AnimatePresence>
              {i === step && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-10">{s.desc}</p>
                  {s.codeKey && open && (
                    <div className="ml-10 mt-2"><CodeViewButton onClick={() => open(s.codeKey)} /></div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Version compare */}
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <h3 className="text-lg font-semibold">Version 0 vs Version 1</h3>
        <div className="grid grid-cols-2 gap-3 not-prose">
          {VERSION_COMPARE.map((v) => (
            <div key={v.version} className="rounded-lg border p-3">
              <p className="text-sm font-bold">{v.version}</p>
              <p className="text-xs text-foreground/60 mt-1">{v.desc}</p>
              <p className="text-xs text-muted-foreground mt-1">증명 수: {v.proofCount}</p>
              {open && (
                <div className="mt-2"><CodeViewButton onClick={() => open(v.codeKey)} /></div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="not-prose"><CellProofDASViz /></div>
    </section>
  );
}
