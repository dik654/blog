import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import CalcBaseFeeDetailViz from './viz/CalcBaseFeeDetailViz';
import { CALC_STEPS, OVERFLOW_INSIGHTS } from './CalcBaseFeeData';
import type { CodeRef } from '@/components/code/types';

export default function CalcBaseFee({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeStep, setActiveStep] = useState(0);
  const [faq, setFaq] = useState<number | null>(null);

  return (
    <section id="calc-base-fee" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">calc_next_block_base_fee</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>calc_next_block_base_fee()</code>는 이전 블록의 가스 사용량으로 다음 블록의 base fee를 결정하는 핵심 함수다.<br />
          <code>gas_target = gas_limit / elasticity_multiplier(2)</code>를 기준으로 사용량이 초과하면 인상, 미달하면 인하한다.
        </p>
        <p className="leading-7">
          최대 변동폭은 <code>BASE_FEE_CHANGE_DENOMINATOR(8)</code>로 제한된다.<br />
          블록이 완전히 차면(gas_used = gas_limit) base fee가 12.5% 상승한다.<br />
          빈 블록이면 12.5% 하락한다.<br />
          이 제한 덕분에 다음 블록의 base fee를 정확히 예측할 수 있다.
        </p>
        <p className="leading-7">
          <strong>Reth의 핵심 구현 차이:</strong> <code>u128</code>로 곱셈을 수행한다.<br />
          <code>base_fee(u64) * gas_used_delta(u64)</code>의 곱이 u64 범위를 초과할 수 있기 때문이다.<br />
          Geth의 <code>big.Int</code>와 달리 스택에서 처리되어 힙 할당과 GC 부담이 없다.
        </p>

        {/* ── 전체 공식 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">calc_next_block_base_fee — 전체 구현</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 mb-4">
          <p className="font-mono font-bold text-sm mb-3">calc_next_block_base_fee(<code>gas_used</code>, <code>gas_limit</code>, <code>base_fee</code>, <code>params</code>) &#8594; <code>u64</code></p>
          <div className="rounded-md border border-border/40 bg-background/60 p-3 mb-3">
            <p className="text-xs font-semibold text-foreground/70 mb-1">gas_target 계산</p>
            <p className="text-xs text-foreground/60"><code>gas_target = gas_limit / elasticity_multiplier</code> (메인넷: gas_limit / 2)</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#6366f1' }}>
              <p className="text-xs font-bold text-indigo-400 mb-1">gas_used == gas_target</p>
              <p className="text-xs text-foreground/60">base_fee 유지 (그대로 반환)</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#ef4444' }}>
              <p className="text-xs font-bold text-red-400 mb-1">gas_used &gt; gas_target</p>
              <p className="text-xs text-foreground/60">delta = <code>max(base_fee * (used - target) / target / 8, 1)</code></p>
              <p className="text-xs text-foreground/50 mt-1">u128 곱셈 사용 (overflow 방지). 최소 1 wei 증가 보장</p>
              <p className="text-xs text-foreground/60 mt-1">결과: <code>base_fee + delta</code></p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#22c55e' }}>
              <p className="text-xs font-bold text-emerald-400 mb-1">gas_used &lt; gas_target</p>
              <p className="text-xs text-foreground/60">delta = <code>base_fee * (target - used) / target / 8</code></p>
              <p className="text-xs text-foreground/50 mt-1">u128 곱셈 사용. 최소 보장 없음</p>
              <p className="text-xs text-foreground/60 mt-1">결과: <code>base_fee.saturating_sub(delta)</code></p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          공식의 본질: <code>delta = base_fee × (gas_used - gas_target) / gas_target / 8</code>.<br />
          (gas_used / gas_target - 1)이 편차 비율, 이를 base_fee에 곱하고 1/8로 감쇠.<br />
          완전히 찬 블록 (gas_used = 2 × target) → delta = base_fee × 1 / 8 = 12.5% 인상.
        </p>

        {/* ── 예시 시뮬레이션 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">시뮬레이션 — 3가지 시나리오</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 mb-4">
          <p className="text-xs text-foreground/50 mb-3">공통: gas_limit = 30M, gas_target = 15M, base_fee = 30 gwei</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#6366f1' }}>
              <p className="text-xs font-bold text-indigo-400 mb-1">target 일치</p>
              <p className="text-xs text-foreground/60">gas_used = 15M</p>
              <p className="text-xs text-foreground/50">&#8594; base_fee 유지: <strong className="text-foreground/80">30 gwei</strong></p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#ef4444' }}>
              <p className="text-xs font-bold text-red-400 mb-1">완전히 찬 블록</p>
              <p className="text-xs text-foreground/60">gas_used = 30M, delta = 30 * 1 / 8 = 3</p>
              <p className="text-xs text-foreground/50">&#8594; <strong className="text-foreground/80">33 gwei</strong> (+10%, 정수 절단)</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#22c55e' }}>
              <p className="text-xs font-bold text-emerald-400 mb-1">빈 블록</p>
              <p className="text-xs text-foreground/60">gas_used = 0, delta = 3</p>
              <p className="text-xs text-foreground/50">&#8594; <strong className="text-foreground/80">27 gwei</strong> (-10%)</p>
            </div>
          </div>
          <div className="rounded-md border border-border/40 bg-background/60 p-3">
            <p className="text-xs font-bold text-amber-400 mb-1">혼잡 지속 (5블록 연속 가득, 초기 30 gwei)</p>
            <div className="flex flex-wrap gap-2 text-xs text-foreground/60">
              <span>블록1: <strong>33</strong></span>
              <span>&#8594;</span>
              <span>블록2: <strong>37</strong></span>
              <span>&#8594;</span>
              <span>블록3: <strong>41</strong></span>
              <span>&#8594;</span>
              <span>블록4: <strong>46</strong></span>
              <span>&#8594;</span>
              <span>블록5: <strong>51 gwei</strong> (+70%)</span>
            </div>
            <p className="text-xs text-foreground/50 mt-1">5블록(1분) 만에 30 &#8594; 51 gwei</p>
          </div>
        </div>
        <p className="leading-7">
          정수 나눗셈 절단으로 실제 증가율이 이론치 12.5%보다 약간 작음 (~11~12%).<br />
          하지만 수 블록 누적 시 복리 효과로 가격 반응이 빨라짐.<br />
          "10블록에 2배 가격" 규칙이 근사적으로 성립 (gas 수요가 지속적으로 높을 때).
        </p>

        {/* ── 오버플로 방지 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">u128 산술 — 오버플로 방지</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 mb-4">
          <div className="rounded-md border border-border/40 bg-background/60 p-3 mb-3">
            <p className="text-xs font-bold text-red-400 mb-1">u64 오버플로 위험</p>
            <p className="text-xs text-foreground/60">base_fee(1000 gwei = 10^12) * gas_used_delta(15M) = <strong className="text-foreground/80">1.5 * 10^19</strong></p>
            <p className="text-xs text-foreground/50 mt-1">u64::MAX = 1.8 * 10^19 — 근처에 도달하여 overflow 가능</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#ef4444' }}>
              <p className="font-mono text-xs text-red-400 mb-1">u64 곱셈 (위험)</p>
              <p className="text-xs text-foreground/60"><code>base_fee * delta</code> — overflow 가능</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#22c55e' }}>
              <p className="font-mono text-xs text-emerald-400 mb-1">u128 캐스팅 (안전)</p>
              <p className="text-xs text-foreground/60"><code>(base_fee as u128) * (delta as u128)</code></p>
              <p className="text-xs text-foreground/50 mt-1">나눗셈 후 다시 <code>u64</code>로 변환</p>
            </div>
          </div>
          <div className="rounded-md border border-border/40 bg-background/60 p-3">
            <p className="text-xs font-semibold text-foreground/70 mb-1">Rust u128 vs Go big.Int</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-foreground/60">
              <p><strong className="text-foreground/70">u128</strong>: 스택 16바이트, 1~4 cycle, U256보다 빠름</p>
              <p><strong className="text-foreground/70">big.Int</strong>: 힙 할당 + GC, ~10배 느림</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          u128 캐스팅의 비용은 무시할 수준 — CPU가 64비트 곱셈 2회로 128비트 곱 계산.<br />
          Geth는 같은 목적으로 <code>big.Int.Mul</code> 사용 → 힙 할당 + GC 발생.<br />
          Reth는 16바이트 스택 변수만 사용 → 블록마다 calc_next_block_base_fee 1회 호출 비용 0.
        </p>

        {/* ── Edge cases ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Edge case — 최소 1 wei 보장</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 mb-4">
          <div className="rounded-md border border-border/40 bg-background/60 p-3 mb-3">
            <p className="text-xs font-bold text-amber-400 mb-1">max(delta, 1) 처리 이유</p>
            <p className="text-xs text-foreground/60">base_fee=8 wei, gas_target=15M, gas_used=15M+100</p>
            <p className="text-xs text-foreground/60">delta_raw = 8 * 100 / 15M / 8 = 0.0000006... &#8594; <strong className="text-red-400">0</strong> (정수 나눗셈)</p>
            <p className="text-xs text-foreground/50 mt-1">"수요 초과인데 가격 유지" — 합의 위반. <code>max(delta, 1)</code>로 최소 1 wei 증가 보장</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#ef4444' }}>
              <p className="text-xs font-bold text-red-400 mb-1">인상: 최소 1 wei 강제</p>
              <p className="text-xs text-foreground/60">단방향 non-zero 변화 &#8594; 과부하 무한 지속 방지</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#22c55e' }}>
              <p className="text-xs font-bold text-emerald-400 mb-1">인하: 0 가능 (saturating_sub)</p>
              <p className="text-xs text-foreground/60">base_fee=0이면 더 낮출 필요 없음. 비대칭 불필요</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>max(delta, 1)</code>의 의미: <strong>단조 수렴 보장</strong>.<br />
          정수 나눗셈으로 delta=0이 되어도 인상은 반드시 발생 → 시스템이 과부하에 반응.<br />
          인하는 saturating_sub로 음수 방지만 필요 (0 이하로 내려갈 일은 실질 없음).
        </p>
      </div>

      <div className="not-prose mb-6"><CalcBaseFeeDetailViz /></div>

      {/* 계산 분기별 카드 */}
      <h3 className="text-lg font-semibold mb-3">base fee 조정 분기</h3>
      <div className="space-y-2 mb-6">
        {CALC_STEPS.map((s, i) => (
          <motion.div key={i} onClick={() => setActiveStep(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === activeStep ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === activeStep ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: i === activeStep ? s.color : 'var(--muted)', color: i === activeStep ? '#fff' : 'var(--muted-foreground)' }}>
                {i + 1}
              </span>
              <div>
                <span className="font-semibold text-sm">{s.condition}</span>
                <p className="text-xs font-mono text-foreground/50">{s.formula}</p>
              </div>
            </div>
            <AnimatePresence>
              {i === activeStep && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-10">{s.detail}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* u128 관련 Q&A */}
      <h3 className="text-lg font-semibold mb-3">구현 인사이트</h3>
      <div className="space-y-2 mb-6">
        {OVERFLOW_INSIGHTS.map((q, i) => (
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
        <CodeViewButton onClick={() => onCodeRef('calc-base-fee', codeRefs['calc-base-fee'])} />
        <span className="text-[10px] text-muted-foreground self-center">calc_next_block_base_fee()</span>
      </div>
    </section>
  );
}
