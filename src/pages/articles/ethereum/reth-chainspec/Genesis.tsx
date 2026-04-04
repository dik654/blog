import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GenesisViz from './viz/GenesisViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { GENESIS_STEPS } from './GenesisData';

export default function Genesis({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [step, setStep] = useState(0);
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="genesis" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Genesis 초기화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <strong>왜 컴파일 타임 임베딩인가?</strong>{' '}
          Geth는 런타임에 genesis.json 파일을 읽는다.<br />
          파일 경로 오류, 포맷 불일치 등 런타임 실패 가능성이 있다.
          <br />
          Reth는 <code>include_str!</code> 매크로로 JSON을 바이너리에 직접 포함시킨다.<br />
          배포 시 바이너리 하나만 있으면 메인넷을 실행할 수 있다.{' '}
          <CodeViewButton onClick={() => open('mainnet-spec')} />
        </p>
        <p className="leading-7">
          제네시스 초기화의 핵심은 <code>state_root</code> 계산이다.
          alloc 필드의 모든 계정으로 Merkle Patricia Trie를 구성하고 루트 해시를 도출한다.
          <br />
          이 값이 genesis header에 포함되며, 피어 연결 시 제네시스 해시로 체인 호환성을 검증한다.{' '}
          <CodeViewButton onClick={() => open('make-genesis')} />
        </p>
      </div>

      {/* Interactive genesis initialization steps */}
      <h3 className="text-lg font-semibold mb-3">초기화 단계</h3>
      <div className="not-prose space-y-2 mb-6">
        {GENESIS_STEPS.map((s, i) => (
          <motion.div key={i}
            onClick={() => setStep(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors
              ${i === step ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-border'}`}
            animate={{ opacity: i === step ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                ${i === step ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                {i + 1}
              </span>
              <span className="font-semibold text-sm">{s.title}</span>
            </div>
            <AnimatePresence>
              {i === step && (
                <motion.div initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-10">{s.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="not-prose">
        <GenesisViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
