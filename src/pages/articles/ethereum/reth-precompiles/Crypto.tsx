import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import CryptoDetailViz from './viz/CryptoDetailViz';
import { CRYPTO_ITEMS, IMPL_COMPARISONS } from './CryptoData';
import type { CodeRef } from '@/components/code/types';

export default function Crypto({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [expanded, setExpanded] = useState<string | null>('ecRecover');

  return (
    <section id="crypto" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ecRecover, SHA256, bn128</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Frontier(제네시스)부터 존재하는 4개 프리컴파일과
          Byzantium에서 추가된 bn128 연산이 핵심이다.
          <br />
          ecRecover(0x01)는 TX 서명 검증, ERC-2612 permit 등에 사용된다.
          bn128 시리즈(0x06~0x08)는 zkSNARK 온체인 검증의 기반이다.
        </p>
        <p className="leading-7">
          모든 프리컴파일은 동일한 패턴을 따른다.<br />
          먼저 입력 크기로 필요 가스를 계산하고, <code>gas_limit</code>과 비교한다.
          <br />
          가스가 부족하면 실행 전에 OOG(Out of Gas)를 반환한다.<br />
          가스가 충분하면 네이티브 함수를 실행하고, 고정 크기 바이트 배열을 반환한다.
        </p>
      </div>

      <div className="not-prose mb-6"><CryptoDetailViz /></div>

      {/* 프리컴파일별 상세 아코디언 */}
      <h3 className="text-lg font-semibold mb-3">프리컴파일별 상세</h3>
      <div className="not-prose space-y-2 mb-6">
        {CRYPTO_ITEMS.map(c => {
          const isOpen = expanded === c.name;
          return (
            <div key={c.name} className="rounded-lg border border-border/60 overflow-hidden">
              <button onClick={() => setExpanded(isOpen ? null : c.name)}
                className="w-full text-left px-5 py-3 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-mono font-semibold text-sm" style={{ color: c.color }}>{c.name} ({c.addr})</p>
                  <p className="text-xs text-foreground/60 mt-0.5">가스: {c.gasFormula}</p>
                </div>
                <span className="text-foreground/40 text-lg transition-transform duration-200"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>&#9660;</span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="px-5 pb-4 border-t border-border/40 pt-3 space-y-1">
                      <p className="text-xs text-foreground/50">입력: {c.inputFormat}</p>
                      <p className="text-xs text-foreground/50">출력: {c.outputFormat}</p>
                      <p className="text-sm text-foreground/80 leading-relaxed mt-2">{c.detail}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Geth vs Reth 비교 테이블 */}
      <h3 className="text-lg font-semibold mb-3">Geth CGo vs Reth 순수 Rust</h3>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border border-border rounded-lg">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left p-3 font-semibold">항목</th>
              <th className="text-left p-3 font-semibold">Geth</th>
              <th className="text-left p-3 font-semibold">Reth</th>
            </tr>
          </thead>
          <tbody>
            {IMPL_COMPARISONS.map((r, i) => (
              <tr key={i} className="border-t border-border">
                <td className="p-3">{r.aspect}</td>
                <td className="p-3 text-red-400">{r.geth}</td>
                <td className="p-3 text-emerald-400">{r.reth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('precompile-dispatch', codeRefs['precompile-dispatch'])} />
        <span className="text-[10px] text-muted-foreground self-center">call() 디스패치</span>
        <CodeViewButton onClick={() => onCodeRef('bn128-add', codeRefs['bn128-add'])} />
        <span className="text-[10px] text-muted-foreground self-center">bn128_add</span>
        <CodeViewButton onClick={() => onCodeRef('bn128-pairing', codeRefs['bn128-pairing'])} />
        <span className="text-[10px] text-muted-foreground self-center">bn128_pairing</span>
      </div>
    </section>
  );
}
