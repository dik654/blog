import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import EffectiveTipViz from './viz/EffectiveTipViz';
import { TIP_SCENARIOS, TX_POOL_CONNECTION } from './EffectiveTipData';
import type { CodeRef } from '@/components/code/types';

export default function EffectiveTip({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeScenario, setActiveScenario] = useState(0);

  return (
    <section id="effective-tip" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">effective_tip_per_gas</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>effective_tip_per_gas()</code>는 TX가 검증자에게 지불하는 실효 팁을 계산한다.<br />
          공식은 <code>min(max_priority_fee, max_fee - base_fee)</code>다.<br />
          사용자가 설정한 priority_fee가 여유분(max_fee - base_fee)보다 크면, 여유분이 실제 팁이 된다.
        </p>
        <p className="leading-7">
          <code>max_fee &lt; base_fee</code>이면 <code>None</code>을 반환한다.<br />
          현재 base fee를 감당할 수 없는 TX이므로 블록에 포함될 수 없다.<br />
          이 TX는 TX 풀의 BaseFee 서브풀에서 base fee 하락을 기다린다.
        </p>
        <p className="leading-7">
          <strong>TX 풀과의 연결:</strong> <code>CoinbaseTipOrdering</code>이 이 함수를 호출하여 TX 우선순위를 결정한다.<br />
          effective_tip이 높을수록 <code>best_transactions()</code> 이터레이터에서 먼저 나오고, PayloadBuilder가 블록에 먼저 포함한다.
        </p>

        {/* ── 구현 코드 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">effective_tip_per_gas — 구현</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 mb-4">
          <p className="font-mono font-bold text-sm mb-3">effective_tip_per_gas(<code>base_fee: Option&lt;u64&gt;</code>) &#8594; <code>Option&lt;u128&gt;</code></p>
          <div className="space-y-2 mb-3">
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#ef4444' }}>
              <p className="text-xs text-foreground/60"><code>max_fee &lt; base_fee</code> &#8594; <strong className="text-red-400">None</strong> (포함 불가 TX)</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#22c55e' }}>
              <p className="text-xs text-foreground/60"><code>fee_delta = max_fee - base_fee</code> (팁에 할당 가능한 여유분)</p>
              <p className="text-xs text-foreground/60 mt-1">실효 팁 = <code>min(max_priority_fee, fee_delta)</code></p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-md border border-border/40 bg-background/60 p-2">
              <p className="font-mono text-xs text-foreground/70">Legacy/2930</p>
              <p className="text-[11px] text-foreground/50">priority = gas_price</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-2">
              <p className="font-mono text-xs text-foreground/70">EIP-1559</p>
              <p className="text-[11px] text-foreground/50">사용자가 명시 설정</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-2">
              <p className="font-mono text-xs text-foreground/70">EIP-4844</p>
              <p className="text-[11px] text-foreground/50">동일 priority_fee 필드</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>min()</code>의 의미: 사용자가 원하는 팁이 max_fee 예산을 넘어갈 수 없음.<br />
          예: max_priority=5 gwei, max_fee=40, base_fee=35 → 여유분 5, 실효 팁 min(5,5)=5 gwei.<br />
          예: max_priority=10 gwei, max_fee=40, base_fee=35 → 여유분 5, 실효 팁 min(10,5)=5 gwei.
        </p>

        {/* ── Priority fee 경제학 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Priority Fee 경제학</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#22c55e' }}>
              <p className="text-xs font-bold text-emerald-400 mb-1">한산한 시기</p>
              <p className="text-xs text-foreground/60">priority_fee = 1 gwei도 충분 (빈자리 존재)</p>
              <p className="text-xs text-foreground/50">대부분 TX가 ~2 gwei 수준</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#ef4444' }}>
              <p className="text-xs font-bold text-red-400 mb-1">혼잡한 시기</p>
              <p className="text-xs text-foreground/60">검증자가 priority_fee 높은 TX부터 선택</p>
              <p className="text-xs text-foreground/50">일반: 10~100 gwei / MEV: 수백~수천 gwei</p>
            </div>
          </div>
          <div className="rounded-md border border-border/40 bg-background/60 p-3 mb-3">
            <p className="font-mono text-xs text-indigo-400 mb-1">CoinbaseTipOrdering</p>
            <p className="text-xs text-foreground/60"><code>PriorityValue = u128</code> (effective_tip). <code>effective_tip_per_gas(base_fee)</code> 호출 결과로 정렬</p>
            <p className="text-xs text-foreground/50 mt-1"><code>Some(tip)</code> &#8594; <code>Priority::Value(tip)</code> / <code>None</code> &#8594; <code>Priority::None</code> (포함 불가)</p>
          </div>
          <p className="text-xs text-foreground/50"><code>best_transactions()</code> 이터레이터가 priority 내림차순 방출 &#8594; PayloadBuilder가 순서대로 블록에 채움 &#8594; 검증자 수익 최대화</p>
        </div>
        <p className="leading-7">
          priority_fee = 검증자가 받는 <strong>실질 수익</strong>.<br />
          혼잡 시 사용자 경쟁 → 높은 priority_fee → 검증자 수입 증가.<br />
          한산 시 낮은 priority_fee로도 포함 가능 → 사용자에게 유리.
        </p>

        {/* ── 실전 시나리오 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">실전 시나리오 — 3가지 상황</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#22c55e' }}>
              <p className="text-xs font-bold text-emerald-400 mb-1">1. 한산 시간 (일반 사용자)</p>
              <p className="text-xs text-foreground/60">max_fee=30, priority=2, base_fee=20</p>
              <p className="text-xs text-foreground/50">delta=10, tip=<strong>min(2,10)=2</strong> &#8594; 총 22 gwei/gas</p>
              <p className="text-xs text-foreground/50">priority가 전부 팁으로 쓰임</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#ef4444' }}>
              <p className="text-xs font-bold text-red-400 mb-1">2. 혼잡 시간 (경쟁 입찰)</p>
              <p className="text-xs text-foreground/60">max_fee=150, priority=50, base_fee=100</p>
              <p className="text-xs text-foreground/50">delta=50, tip=<strong>min(50,50)=50</strong> &#8594; 총 150 gwei/gas</p>
              <p className="text-xs text-foreground/50">max_fee까지 완전히 소진</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#f59e0b' }}>
              <p className="text-xs font-bold text-amber-400 mb-1">3. base fee 급등 (여유 감소)</p>
              <p className="text-xs text-foreground/60">max_fee=50, priority=10, base_fee=48</p>
              <p className="text-xs text-foreground/50">delta=2, tip=<strong>min(10,2)=2</strong> &#8594; 총 50 gwei/gas</p>
              <p className="text-xs text-foreground/50">원하는 10 대신 2 gwei만 지급 &#8594; 포함 지연</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#6366f1' }}>
              <p className="text-xs font-bold text-indigo-400 mb-1">4. base fee 초과</p>
              <p className="text-xs text-foreground/60">max_fee=30, base_fee=40</p>
              <p className="text-xs text-foreground/50">&#8594; <code>None</code> &#8594; BaseFee 서브풀 대기</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          실제 TX 팁은 사용자 설정과 현재 시장 가격의 <strong>동적 합의</strong>.<br />
          max_fee가 여유를 두고 설정되면 혼잡 시에도 TX 포함 가능.<br />
          지갑들이 "safe/fast/rapid" 옵션으로 max_fee 추천 — 높을수록 포함 속도 ↑ 비용 ↑.
        </p>

        {/* ── MEV와의 관계 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">MEV와 effective_tip</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 mb-4">
          <p className="font-mono font-bold text-sm mb-3">MEV 봇의 TX 포함 전략</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="text-xs font-bold text-red-400 mb-1">Sandwich attack</p>
              <p className="text-xs text-foreground/60">타겟 TX를 앞뒤로 감싸는 2개 TX. 같은 블록 필수. ~1000 gwei+ priority</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="text-xs font-bold text-amber-400 mb-1">Backrunning</p>
              <p className="text-xs text-foreground/60">특정 TX 직후 실행 (청산 등). 수익 클수록 높은 priority 입찰</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="text-xs font-bold text-indigo-400 mb-1">Front-running</p>
              <p className="text-xs text-foreground/60">타겟 TX보다 빠르게 실행. priority = 타겟 tip + alpha</p>
            </div>
          </div>
          <div className="rounded-md border border-border/40 bg-background/60 p-3 mb-3">
            <p className="text-xs font-semibold text-foreground/70 mb-1">혼잡 시기 현실 수치</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-foreground/60">
              <p>일반 TX: <strong>2~5</strong> gwei</p>
              <p>DeFi 스왑: <strong>10~50</strong> gwei</p>
              <p>MEV sandwich: <strong>500~5000</strong> gwei</p>
              <p>Flash loan: 가변적</p>
            </div>
          </div>
          <div className="rounded-md border border-border/40 bg-background/60 p-3">
            <p className="text-xs font-semibold text-foreground/70 mb-1">Flashbots 이후</p>
            <p className="text-xs text-foreground/60">public mempool 경쟁 감소. MEV는 private bundle(off-chain). priority_fee 안정화</p>
            <p className="text-xs text-foreground/50 mt-1">effective_tip 역할: TX 풀 정렬 기준, 사용자의 "속도 의지", 검증자 수익 결정</p>
          </div>
        </div>
        <p className="leading-7">
          EIP-1559 이후 priority_fee가 <strong>MEV 경쟁의 주요 도구</strong>로 등장.<br />
          사용자 간 우선순위 경매가 base_fee 위에서 진행 — 혼잡 상황에서 특히 활발.<br />
          Flashbots 등 private mempool로 일부 MEV가 공개 시장에서 분리됨.
        </p>
      </div>

      <div className="not-prose mb-6"><EffectiveTipViz /></div>

      {/* 시나리오별 카드 */}
      <h3 className="text-lg font-semibold mb-3">시나리오별 effective_tip 계산</h3>
      <div className="space-y-2 mb-6">
        {TIP_SCENARIOS.map((s, i) => (
          <motion.div key={i} onClick={() => setActiveScenario(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === activeScenario ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === activeScenario ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: i === activeScenario ? s.color : 'var(--muted)', color: i === activeScenario ? '#fff' : 'var(--muted-foreground)' }}>
                {i + 1}
              </span>
              <span className="font-semibold text-sm">{s.type}</span>
              <span className="text-xs font-mono text-foreground/50 ml-auto">{s.effectiveTip}</span>
            </div>
            <AnimatePresence>
              {i === activeScenario && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <div className="mt-2 ml-10 space-y-1">
                    <p className="text-xs text-foreground/50">max_fee: {s.maxFee} / priority_fee: {s.priorityFee} / base_fee: {s.baseFee}</p>
                    <p className="text-sm text-foreground/70">{s.note}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* TX 풀 연결 */}
      <h3 className="text-lg font-semibold mb-3">TX 풀 → PayloadBuilder 연결</h3>
      <div className="not-prose space-y-3 mb-6">
        {TX_POOL_CONNECTION.map((c, i) => (
          <div key={i} className="rounded-lg border border-border/60 p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-indigo-400">{c.from}</span>
              <span className="text-foreground/40">&#8594;</span>
              <span className="font-mono text-xs text-emerald-400">{c.to}</span>
            </div>
            <p className="text-sm text-foreground/70">{c.detail}</p>
          </div>
        ))}
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('effective-tip', codeRefs['effective-tip'])} />
        <span className="text-[10px] text-muted-foreground self-center">effective_tip_per_gas()</span>
      </div>
    </section>
  );
}
