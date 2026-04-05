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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub fn calc_next_block_base_fee(
    gas_used: u64,
    gas_limit: u64,
    base_fee: u64,
    params: BaseFeeParams,
) -> u64 {
    // gas_target = gas_limit / 2 (elasticity=2)
    let gas_target = gas_limit / params.elasticity_multiplier;

    if gas_used == gas_target {
        return base_fee;  // 정확히 일치 → 유지
    }

    if gas_used > gas_target {
        // 초과 → 인상
        let gas_used_delta = gas_used - gas_target;
        let base_fee_delta = max(
            // u128 곱셈: base_fee × delta가 u64 범위 넘을 수 있음
            (base_fee as u128
                * gas_used_delta as u128
                / gas_target as u128
                / params.base_fee_change_denominator as u128) as u64,
            1,  // 최소 1 wei 증가 (정수 나눗셈 절단 대응)
        );
        base_fee + base_fee_delta
    } else {
        // 미달 → 인하
        let gas_used_delta = gas_target - gas_used;
        let base_fee_delta = (base_fee as u128
            * gas_used_delta as u128
            / gas_target as u128
            / params.base_fee_change_denominator as u128) as u64;
        base_fee.saturating_sub(base_fee_delta)
    }
}`}
        </pre>
        <p className="leading-7">
          공식의 본질: <code>delta = base_fee × (gas_used - gas_target) / gas_target / 8</code>.<br />
          (gas_used / gas_target - 1)이 편차 비율, 이를 base_fee에 곱하고 1/8로 감쇠.<br />
          완전히 찬 블록 (gas_used = 2 × target) → delta = base_fee × 1 / 8 = 12.5% 인상.
        </p>

        {/* ── 예시 시뮬레이션 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">시뮬레이션 — 3가지 시나리오</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 공통 파라미터:
// gas_limit = 30M, gas_target = 15M, base_fee = 30 gwei

// 시나리오 1: 정확히 target 일치
gas_used = 15_000_000
// → base_fee 유지: 30 gwei

// 시나리오 2: 완전히 찬 블록
gas_used = 30_000_000 (gas_limit까지 사용)
gas_used_delta = 30M - 15M = 15M
delta = 30 × 15_000_000 / 15_000_000 / 8
      = 30 × 1 / 8 = 3.75 → 3 (정수 나눗셈)
// → 다음 base_fee = 33 gwei (+10%, 약간 낮은 이유: 정수 절단)

// 시나리오 3: 빈 블록
gas_used = 0
gas_used_delta = 15M - 0 = 15M
delta = 30 × 15_000_000 / 15_000_000 / 8 = 3
// → 다음 base_fee = 27 gwei (-10%)

// 시나리오 4: 혼잡 지속 (5블록 연속 가득)
// 초기 base_fee = 30 gwei
// 블록 1: 30 × 1.125 = 33.75 → 33 gwei
// 블록 2: 33 × 1.125 = 37.12 → 37 gwei
// 블록 3: 37 × 1.125 = 41.62 → 41 gwei
// 블록 4: 41 × 1.125 = 46.12 → 46 gwei
// 블록 5: 46 × 1.125 = 51.75 → 51 gwei
// 5블록(1분) 만에 30 → 51 gwei (+70%)`}
        </pre>
        <p className="leading-7">
          정수 나눗셈 절단으로 실제 증가율이 이론치 12.5%보다 약간 작음 (~11~12%).<br />
          하지만 수 블록 누적 시 복리 효과로 가격 반응이 빨라짐.<br />
          "10블록에 2배 가격" 규칙이 근사적으로 성립 (gas 수요가 지속적으로 높을 때).
        </p>

        {/* ── 오버플로 방지 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">u128 산술 — 오버플로 방지</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 극단적 시나리오에서 u64 오버플로 가능성
//
// base_fee 이론적 최대값: u64::MAX ≈ 1.8 × 10^19
// 현실적으로는 수 천 gwei ≈ 10^12
//
// 하지만 이론적 분석:
// base_fee × gas_used_delta 의 크기
// = 10^12 × 15_000_000
// = 1.5 × 10^19
// → u64::MAX(≈1.8 × 10^19) 근처!

// u64 곱셈 위험:
let base_fee: u64 = 1_000_000_000_000;  // 1000 gwei
let delta: u64 = 15_000_000;
let prod = base_fee * delta;  // 🔴 overflow 가능

// u128 캐스팅으로 안전:
let prod_128 = (base_fee as u128) * (delta as u128);  // ✅ 2^128 여유
let result = (prod_128 / target as u128 / 8) as u64;  // ✅ 나눗셈 후 다시 u64

// Rust의 u128 산술 특성:
// - 스택 할당 (16바이트)
// - CPU에 따라 1~4 cycle per operation
// - ruint의 U256보다 빠름 (하드웨어 2 × u64 곱셈 지원)
// - Go의 big.Int는 힙 할당 + GC → ~10배 느림`}
        </pre>
        <p className="leading-7">
          u128 캐스팅의 비용은 무시할 수준 — CPU가 64비트 곱셈 2회로 128비트 곱 계산.<br />
          Geth는 같은 목적으로 <code>big.Int.Mul</code> 사용 → 힙 할당 + GC 발생.<br />
          Reth는 16바이트 스택 변수만 사용 → 블록마다 calc_next_block_base_fee 1회 호출 비용 0.
        </p>

        {/* ── Edge cases ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Edge case — 최소 1 wei 보장</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// max(delta, 1) 처리 이유
//
// 시나리오: base_fee가 매우 낮고 gas_used 초과량이 작음
// base_fee = 8 wei, gas_target = 15M, gas_used = 15M + 100
// gas_used_delta = 100
//
// delta_raw = 8 × 100 / 15_000_000 / 8 = 0.0000006... → 0 (정수 나눗셈)
//
// 그러면 base_fee가 변하지 않음!
// → "수요 초과인데 가격 유지"라는 합의 위반
// → max(delta, 1)로 최소 1 wei 증가 보장

// 인하 시에는 이 보호 없음 (saturating_sub)
// 이유: base_fee = 0 이면 더 이상 낮출 필요 없음
// EIP-1559: base_fee는 최소 7 wei로 제한 (2021-08 기준)
// 실제로 base_fee = 0인 상황은 하드 리셋 후 외에는 없음

// 왜 인상은 최소 1, 인하는 0 가능인가?
// - 단방향 non-zero 변화 강제 → 목표 수렴 보장
// - 인상 없는 "과부하 무한 지속" 방지
// - 인하는 수요 감소 반영에 비대칭 필요 없음`}
        </pre>
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
