import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import KZGCommitmentViz from './viz/KZGCommitmentViz';
import KZGFlowViz from './viz/KZGFlowViz';
import CodeViewButton from '@/components/code/CodeViewButton';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { KZG_THEORY_STEPS, BLS_CURVE_POINTS } from './KZGCommitmentData';

export default function KZGCommitment({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  const open = onCodeRef ? (key: string) => onCodeRef(key, codeRefs[key]) : undefined;
  const [step, setStep] = useState(0);

  return (
    <section id="kzg-commitment" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">KZG 커밋먼트 이론</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          KZG(Kate-Zaverucha-Goldberg)는 다항식 커밋먼트 스킴(polynomial commitment scheme)이다.<br />
          데이터를 다항식으로 인코딩한 뒤, 그 다항식의 "지문"(커밋먼트)을 48바이트 G₁ 점으로 만든다.<br />
          원본 128KB 없이 커밋먼트(48B)와 증명(48B)만으로 데이터 무결성을 O(1)에 검증할 수 있다.
        </p>
      </div>

      {/* Interactive step cards */}
      <div className="space-y-2 mb-8">
        {KZG_THEORY_STEPS.map((s, i) => (
          <motion.div key={i} onClick={() => setStep(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === step ? 'border-sky-500/50 bg-sky-500/5' : 'border-border'}`}
            animate={{ opacity: i === step ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === step ? 'bg-sky-500 text-white' : 'bg-muted text-muted-foreground'}`}>{i + 1}</span>
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

      {/* BLS12-381 */}
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <h3 className="text-lg font-semibold">왜 BLS12-381 곡선인가?</h3>
        <ul className="space-y-1">
          {BLS_CURVE_POINTS.map((pt, i) => (
            <li key={i} className="leading-7">{pt}</li>
          ))}
        </ul>
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <h3 className="text-lg font-semibold">코드 흐름: KZG 연산 체인</h3>
        <p className="leading-7">
          go-ethereum의 <code>crypto/kzg4844</code> 패키지에서 commit, proof, verify가 어떻게 호출되는지 추적한다.
        </p>
      </div>
      <div className="not-prose mb-8"><KZGFlowViz /></div>
      <div className="not-prose"><KZGCommitmentViz /></div>
    </section>
  );
}
