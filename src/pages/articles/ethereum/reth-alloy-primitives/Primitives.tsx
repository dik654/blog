import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PrimitivesDetailViz from './viz/PrimitivesDetailViz';
import CodeViewButton from '@/components/code/CodeViewButton';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { TYPE_CARDS, GETH_VS_ALLOY } from './PrimitivesData';

const CELL = 'border border-border px-4 py-2';
const COLOR_MAP: Record<string, string> = {
  indigo: 'border-indigo-500/50 bg-indigo-500/5',
  emerald: 'border-emerald-500/50 bg-emerald-500/5',
  amber: 'border-amber-500/50 bg-amber-500/5',
};
const BADGE_MAP: Record<string, string> = {
  indigo: 'bg-indigo-500 text-white',
  emerald: 'bg-emerald-500 text-white',
  amber: 'bg-amber-500 text-white',
};

export default function Primitives({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  const [active, setActive] = useState(0);

  return (
    <section id="primitives" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Address, B256, U256 타입</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          이더리움 EVM은 256비트 워드 머신이다.<br />
          스택의 모든 슬롯이 32바이트(U256)이고,
          주소는 그 중 하위 20바이트(Address)를 사용한다.<br />
          이 두 타입은 노드 전체에서 가장 빈번하게 생성되고 복사되는 타입이다.
        </p>
        <p className="leading-7">
          alloy-primitives는 <code>{'FixedBytes<N>'}</code>이라는
          하나의 const 제네릭 구조체(컴파일 타임에 N이 결정되는 바이트 배열 래퍼)로
          Address와 B256을 모두 표현한다.<br />
          Geth는 <code>common.Address</code>와 <code>common.Hash</code>가
          완전히 별도 타입이라 동일한 유틸리티 함수를 중복 구현해야 한다.
        </p>
      </div>

      <h3 className="text-lg font-semibold mb-3">핵심 타입 상세</h3>
      <div className="space-y-2 mb-8">
        {TYPE_CARDS.map((c, i) => (
          <motion.div key={i} onClick={() => setActive(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === active ? COLOR_MAP[c.color] : 'border-border'}`}
            animate={{ opacity: i === active ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${i === active ? BADGE_MAP[c.color] : 'bg-muted text-muted-foreground'}`}>{c.size}</span>
              <span className="font-semibold text-sm">{c.title}</span>
            </div>
            <AnimatePresence>
              {i === active && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-16">{c.desc}</p>
                  <p className="text-xs text-muted-foreground mt-1 ml-16">vs Geth: {c.versus}</p>
                  <div className="ml-16 mt-2">
                    <CodeViewButton onClick={() => open(c.codeKey)} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <h3 className="text-lg font-semibold mb-3">Geth vs alloy 비교</h3>
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full text-sm border border-border">
          <thead>
            <tr className="bg-muted">
              <th className={`${CELL} text-left`}>속성</th>
              <th className={`${CELL} text-left`}>Geth (Go)</th>
              <th className={`${CELL} text-left`}>alloy (Rust)</th>
            </tr>
          </thead>
          <tbody>
            {GETH_VS_ALLOY.map(r => (
              <tr key={r.attr}>
                <td className={`${CELL} font-medium`}>{r.attr}</td>
                <td className={CELL}>{r.geth}</td>
                <td className={CELL}>{r.alloy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="not-prose">
        <PrimitivesDetailViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
