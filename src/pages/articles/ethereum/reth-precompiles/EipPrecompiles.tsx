import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import { EIP_ITEMS, REGISTRY_DESIGN } from './EipPrecompilesData';
import type { CodeRef } from '@/components/code/types';

export default function EipPrecompiles({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeEip, setActiveEip] = useState(0);
  const [faq, setFaq] = useState<number | null>(null);

  return (
    <section id="eip-precompiles" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">blake2f, KZG Point Evaluation</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Istanbul(2019)과 Cancun(2024)에서 각각 하나씩 프리컴파일이 추가되었다.
          <br />
          blake2f(0x09)는 Zcash 생태계와의 호환을 위한 것이고,
          KZG Point Evaluation(0x0a)은 EIP-4844 Blob 트랜잭션의 데이터 무결성 검증을 위한 것이다.
        </p>
        <p className="leading-7">
          두 프리컴파일 모두 revm의 <code>Precompile::Standard</code> 변형으로 등록된다.<br />
          블록 환경(timestamp 등)을 참조할 필요가 없는 순수 함수이기 때문이다.<br />
          레지스트리 관리는 <code>PrecompileSpecId</code> enum과 <code>OnceLock</code> 조합으로 이루어진다.
        </p>
      </div>

      {/* EIP별 카드 */}
      <h3 className="text-lg font-semibold mb-3">하드포크 추가 프리컴파일</h3>
      <div className="space-y-2 mb-6">
        {EIP_ITEMS.map((e, i) => (
          <motion.div key={i} onClick={() => setActiveEip(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === activeEip ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === activeEip ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded text-xs font-bold"
                style={{ backgroundColor: i === activeEip ? e.color : 'var(--muted)', color: i === activeEip ? '#fff' : 'var(--muted-foreground)' }}>
                {e.eip}
              </span>
              <span className="font-semibold text-sm">{e.name}</span>
              <span className="text-xs text-foreground/50 ml-auto">{e.fork} / {e.gas}</span>
            </div>
            <AnimatePresence>
              {i === activeEip && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-xs text-foreground/50 mt-2 ml-1">용도: {e.purpose}</p>
                  <p className="text-sm text-foreground/70 mt-1 ml-1">{e.detail}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* 레지스트리 설계 Q&A */}
      <h3 className="text-lg font-semibold mb-3">레지스트리 설계 판단</h3>
      <div className="space-y-2 mb-6">
        {REGISTRY_DESIGN.map((q, i) => (
          <motion.div key={i} onClick={() => setFaq(faq === i ? null : i)}
            className={`rounded-lg border p-3 cursor-pointer transition-colors ${faq === i ? 'border-amber-500/50 bg-amber-500/5' : 'border-border'}`}>
            <p className="text-sm font-semibold">{q.question}</p>
            <AnimatePresence>
              {faq === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2">{q.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('precompile-enum', codeRefs['precompile-enum'])} />
        <span className="text-[10px] text-muted-foreground self-center">Precompile enum</span>
        <CodeViewButton onClick={() => onCodeRef('cancun-registry', codeRefs['cancun-registry'])} />
        <span className="text-[10px] text-muted-foreground self-center">Cancun 레지스트리</span>
      </div>
    </section>
  );
}
