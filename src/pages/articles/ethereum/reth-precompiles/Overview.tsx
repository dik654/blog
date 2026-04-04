import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import PrecompileMapViz from './viz/PrecompileMapViz';
import { DESIGN_CHOICES, PRECOMPILE_TABLE } from './OverviewData';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = DESIGN_CHOICES.find(d => d.id === selected);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">프리컴파일 레지스트리</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          EVM 바이트코드는 범용 연산에 최적화되어 있다.<br />
          산술, 메모리 복사, 조건 분기 등은 효율적이지만,
          타원곡선 페어링(bn128)이나 KZG 검증 같은 무거운 암호 연산은 사실상 불가능하다.
          <br />
          옵코드 조합으로 구현하면 가스비가 수백만에 달한다.
        </p>
        <p className="leading-7">
          프리컴파일(precompiled contract)은 이 문제의 해결책이다.<br />
          CALL 명령의 <code>to</code> 주소가 0x01~0x0a 범위이면,
          EVM은 바이트코드를 실행하지 않고 네이티브 함수를 직접 호출한다.
          <br />
          ecRecover는 3,000 gas, bn128Pairing은 34,000*n+45,000 gas로 수백 배 저렴하다.
        </p>
        <p className="leading-7">
          revm은 <code>PrecompileSpecId</code> enum으로 하드포크별 프리컴파일 목록을 관리한다.<br />
          각 목록은 <code>OnceLock</code>으로 지연 초기화되며,
          새 하드포크는 이전 목록을 상속하고 새 항목만 추가한다.
        </p>
      </div>

      {/* 설계 판단 카드 */}
      <h3 className="text-lg font-semibold mb-3">핵심 설계 판단</h3>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {DESIGN_CHOICES.map(d => (
          <button key={d.id} onClick={() => setSelected(selected === d.id ? null : d.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{ borderColor: selected === d.id ? d.color : 'var(--color-border)', background: selected === d.id ? `${d.color}10` : undefined }}>
            <p className="font-bold text-sm" style={{ color: d.color }}>{d.title}</p>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>{sel.title}</p>
            <p className="text-sm text-foreground/60 leading-relaxed mb-2"><strong>문제:</strong> {sel.problem}</p>
            <p className="text-sm text-foreground/80 leading-relaxed"><strong>해결:</strong> {sel.solution}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 프리컴파일 전체 테이블 */}
      <h3 className="text-lg font-semibold mb-3">프리컴파일 전체 목록 (0x01~0x0a)</h3>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border border-border rounded-lg">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left p-3 font-semibold">주소</th>
              <th className="text-left p-3 font-semibold">이름</th>
              <th className="text-left p-3 font-semibold">하드포크</th>
              <th className="text-left p-3 font-semibold">가스</th>
              <th className="text-left p-3 font-semibold">용도</th>
            </tr>
          </thead>
          <tbody>
            {PRECOMPILE_TABLE.map((r, i) => (
              <tr key={i} className="border-t border-border">
                <td className="p-3 font-mono text-indigo-400">{r.addr}</td>
                <td className="p-3 font-semibold">{r.name}</td>
                <td className="p-3 text-foreground/60">{r.fork}</td>
                <td className="p-3 text-amber-400">{r.gas}</td>
                <td className="p-3 text-foreground/70">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="not-prose mt-6"><PrecompileMapViz /></div>
    </section>
  );
}
