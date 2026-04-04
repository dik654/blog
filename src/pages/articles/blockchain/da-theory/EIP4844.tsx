import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EIP4844Viz from './viz/EIP4844Viz';
import BlobTxFlowViz from './viz/BlobTxFlowViz';
import OpcodeFlowViz from './viz/OpcodeFlowViz';
import CodeViewButton from '@/components/code/CodeViewButton';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { BLOBTX_STEPS, VALIDATE_STEPS, GAS_STEPS } from './EIP4844Data';

type StepItem = { title: string; desc: string; codeKey: string };

function StepCards({ steps, open }: { steps: StepItem[]; open?: (key: string) => void }) {
  const [step, setStep] = useState(0);
  return (
    <div className="space-y-2 mb-6">
      {steps.map((s, i) => (
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
  );
}

export default function EIP4844({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  const open = onCodeRef ? (key: string) => onCodeRef(key, codeRefs[key]) : undefined;

  return (
    <section id="eip-4844" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">EIP-4844: Blob TX &amp; Proto-Danksharding</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <h3 className="text-xl font-semibold">BlobTx 구조</h3>
        <p className="leading-7">
          <strong>왜 별도 트랜잭션 타입인가?</strong> 롤업 데이터는 EVM(이더리움 가상 머신) 실행에 불필요하다.<br />
          calldata에 넣으면 영구 저장되어 비용이 높다.<br />
          blob은 별도 공간에 담아 ~18일 후 삭제해 비용을 90% 이상 절감한다.
        </p>
      </div>
      <StepCards steps={BLOBTX_STEPS} open={open} />
      <div className="not-prose mb-8"><BlobTxFlowViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <h3 className="text-xl font-semibold">트랜잭션 풀 검증</h3>
        <p className="leading-7">
          <strong>왜 단계적 검증인가?</strong> 비용이 낮은 검사를 먼저 수행해
          잘못된 트랜잭션을 빨리 걸러낸다.<br />
          KZG 증명 검증은 가장 마지막에 수행한다.
        </p>
      </div>
      <StepCards steps={VALIDATE_STEPS} open={open} />

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <h3 className="text-xl font-semibold">Blob 가스 시장</h3>
        <p className="leading-7">
          <strong>왜 독립 수수료 시장인가?</strong> blob 수요와 일반 가스 수요는 독립적이다.<br />
          EIP-1559와 동일한 원리로 target 기준 가격을 자동 조절한다.
        </p>
      </div>
      <StepCards steps={GAS_STEPS} open={open} />

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <h3 className="text-xl font-semibold">EVM 옵코드: BLOBHASH &amp; BLOBBASEFEE</h3>
        <p className="leading-7">
          <strong>왜 전용 옵코드가 필요한가?</strong> 롤업 컨트랙트가 blob 데이터를 직접 읽을 수 없다.<br />
          대신 versioned hash와 blob 가격을 스택에서 조회한다.
        </p>
      </div>
      <div className="not-prose mb-8"><OpcodeFlowViz /></div>

      <div className="not-prose"><EIP4844Viz /></div>
    </section>
  );
}
