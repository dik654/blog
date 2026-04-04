import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import BaseFeeViz from './viz/BaseFeeViz';
import { DESIGN_CHOICES, FEE_COMPONENTS } from './OverviewData';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = DESIGN_CHOICES.find(d => d.id === selected);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">EIP-1559 가스 모델</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          EIP-1559 이전, 이더리움의 수수료 시장은 first-price auction이었다.<br />
          사용자가 원하는 가격을 입찰하고, 마이너가 높은 입찰을 우선 선택했다.
          <br />
          적정가를 알 수 없어 과다 입찰이 빈번했고, 가격 예측이 불가능했다.
        </p>
        <p className="leading-7">
          EIP-1559는 <strong>base fee</strong>를 도입하여 이 문제를 해결했다.<br />
          프로토콜이 블록 가스 사용률에 따라 base fee를 자동 조정한다.<br />
          사용률이 50% 타깃을 초과하면 인상, 미달이면 인하한다.
          <br />
          base fee는 소각(burn)되어 ETH 공급을 줄인다.
        </p>
        <p className="leading-7">
          사용자는 <code>max_fee_per_gas</code>(지불 의사 상한)와
          <code>max_priority_fee_per_gas</code>(팁)를 설정한다.
          base fee는 소각되고, 팁만 검증자에게 지급된다.
          <br />
          Reth는 이 계산을 <code>u128</code> 정수 산술로 구현하여 Geth 대비 GC 부담을 제거했다.
        </p>
      </div>

      {/* 수수료 구성 요소 */}
      <h3 className="text-lg font-semibold mb-3">수수료 구성 요소</h3>
      <div className="not-prose grid grid-cols-3 gap-3 mb-6">
        {FEE_COMPONENTS.map(f => (
          <div key={f.label} className="rounded-lg border border-border p-3" style={{ borderLeftWidth: 3, borderLeftColor: f.color }}>
            <p className="font-mono font-bold text-sm" style={{ color: f.color }}>{f.label}</p>
            <p className="text-xs text-foreground/60 mt-1">{f.desc}</p>
          </div>
        ))}
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

      <div className="not-prose mt-6"><BaseFeeViz /></div>
    </section>
  );
}
