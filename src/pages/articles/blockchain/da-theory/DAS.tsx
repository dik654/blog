import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DASFlowViz from './viz/DASFlowViz';
import CodeViewButton from '@/components/code/CodeViewButton';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { KZG_STEPS, PEERDAS_POINTS } from './DASData';

export default function DAS({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  const open = onCodeRef ? (key: string) => onCodeRef(key, codeRefs[key]) : undefined;
  const [step, setStep] = useState(0);

  return (
    <section id="das" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Data Availability Sampling</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <h3 className="text-xl font-semibold">왜 DAS가 필요한가?</h3>
        <p className="leading-7">
          풀 노드가 모든 블록 데이터를 다운로드하면 확장이 불가능하다.<br />
          블록이 커질수록 노드 운영 비용이 올라가고, 탈중앙화가 약화된다.<br />
          DAS(Data Availability Sampling, 무작위 셀 샘플링으로 데이터 가용성을 확률적으로 검증하는 기법)는
          라이트 노드가 <strong>일부 셀만 샘플링</strong>해도 높은 확률(예: 75개 셀 → 99.99%)로
          전체 데이터의 가용성을 보장할 수 있게 한다.
        </p>

        <h3 className="text-xl font-semibold mt-8">KZG 커밋먼트 워크플로</h3>
        <p className="text-sm text-foreground/60 mb-3">
          KZG(Kate-Zaverucha-Goldberg)는 다항식 커밋먼트 스킴이다.<br />
          데이터를 다항식으로 인코딩하고, 그 다항식에 대한 짧은 증명을 만들어 검증한다.
        </p>
      </div>

      {/* Interactive KZG step cards */}
      <div className="space-y-2 mb-8">
        {KZG_STEPS.map((s, i) => (
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
                    <div className="ml-10 mt-2">
                      <CodeViewButton onClick={() => open(s.codeKey)} />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* PeerDAS section */}
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <h3 className="text-xl font-semibold">PeerDAS: Cell Proof (Osaka)</h3>
        <p className="leading-7">
          <strong>왜 128개 cell로 분할하는가?</strong> 라이트 노드가 전체 128KB blob을 받을 필요 없이,
          소수의 cell만 요청해 대역폭을 절감하기 위해서다.
        </p>
        <ul className="space-y-1">
          {PEERDAS_POINTS.map((pt, i) => (
            <li key={i} className="leading-7">{pt}</li>
          ))}
        </ul>
        <p className="leading-7">
          {open && <CodeViewButton onClick={() => open('kzg-cell-proofs')} />}
        </p>
      </div>

      <div className="not-prose"><DASFlowViz /></div>
    </section>
  );
}
