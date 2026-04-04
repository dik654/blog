import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import MerkleDetailViz from './viz/MerkleDetailViz';
import { MERKLE_STEPS } from './MerkleStageData';

export default function MerkleStage({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [step, setStep] = useState(0);

  return (
    <section id="merkle-stage" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">MerkleStage 추적</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          MerkleStage는 파이프라인의 마지막 검증 관문이다.<br />
          ExecutionStage가 생성한 상태 변경이 올바른지, 상태 루트(state root)를 계산해 블록 헤더와 대조한다.
          <br />
          불일치하면 TX 실행 결과가 잘못된 것이므로 동기화가 중단된다.
        </p>
        <p className="leading-7">
          <strong>Geth와의 결정적 차이: 증분 계산.</strong> Geth는 매 블록마다 dirty 노드(변경된 트라이 노드)를 전부 재해싱한다.<br />
          Reth는 <code>PrefixSet</code>에 기록된 변경 경로만 재해싱한다.
          <br />
          예를 들어 100만 계정 중 1,000개만 변경되면, 1,000개 경로의 서브트리만 재계산한다.<br />
          전체 재계산 대비 10~100배 빠르다.
        </p>
        <p className="leading-7">
          <code>rayon</code>으로 계정별 <code>StorageRoot</code>(각 계정의 스토리지 트라이 루트)를 병렬 계산한다.<br />
          계정 A의 스토리지와 계정 B의 스토리지는 독립적이므로 완벽한 병렬화가 가능하다.
        </p>
      </div>

      <div className="not-prose mb-6"><MerkleDetailViz /></div>

      {/* Step-by-step interactive cards */}
      <h3 className="text-lg font-semibold mb-3">검증 3단계</h3>
      <div className="not-prose space-y-2 mb-6">
        {MERKLE_STEPS.map((s, i) => (
          <motion.div key={i} onClick={() => setStep(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === step ? 'border-pink-500/50 bg-pink-500/5' : 'border-border'}`}
            animate={{ opacity: i === step ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === step ? 'bg-pink-500 text-white' : 'bg-muted text-muted-foreground'}`}>{i + 1}</span>
              <span className="font-semibold text-sm">{s.title}</span>
            </div>
            <AnimatePresence>
              {i === step && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-10 leading-relaxed">{s.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('merkle-stage', codeRefs['merkle-stage'])} />
        <span className="text-[10px] text-muted-foreground self-center">MerkleStage::execute()</span>
      </div>
    </section>
  );
}
