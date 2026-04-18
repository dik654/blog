import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import BuildJobDetailViz from './viz/BuildJobDetailViz';
import { BUILD_PHASES, BUILD_INSIGHTS } from './BuildJobData';
import type { CodeRef } from '@/components/code/types';

export default function BuildJob({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activePhase, setActivePhase] = useState(0);
  const [faq, setFaq] = useState<number | null>(null);

  return (
    <section id="build-job" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BuildJob & TX 선택</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>build_payload()</code>는 실제로 블록을 조립하는 함수다.<br />
          TX 풀에서 <code>best_transactions_with_attributes(base_fee)</code>를 호출하여 effective_tip 기준 내림차순 이터레이터를 가져온다.<br />
          가스 한도 내에서 TX를 하나씩 실행하고 누적한다.
        </p>
        <p className="leading-7">
          TX 실행에 실패하면 <code>mark_invalid()</code>로 이터레이터에 알린다.<br />
          해당 TX와 같은 sender의 이후 nonce TX도 무효가 되므로 건너뛴다.<br />
          가스 한도를 초과하는 TX는 건너뛰되 즉시 종료하지 않는다.<br />
          남은 공간에 들어갈 수 있는 작은 TX가 있을 수 있기 때문이다.
        </p>
        <p className="leading-7">
          <strong>continuous building:</strong> PayloadBuilder는 비동기 태스크로 실행된다.<br />
          CL이 GetPayload를 호출할 때까지 TX 풀의 새 TX를 추가하여 <code>block_value</code>(수수료 합계)를 점진적으로 극대화한다.<br />
          CL은 이 값과 MEV 빌더의 블록 가치를 비교하여 더 수익 높은 블록을 선택한다.
        </p>

        {/* ── build_payload 구현 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">build_payload() — TX 선택 & 실행 루프</h3>
        <div className="not-prose space-y-2 my-4">
          <div className="rounded-lg border border-border/60 p-3 flex gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">1</span>
            <div>
              <p className="text-sm font-semibold text-foreground/90">블록 환경 설정</p>
              <p className="text-xs text-foreground/60"><code className="text-xs">build_block_env(parent, attrs)</code> → base_fee, gas_limit 결정</p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-3 flex gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">2</span>
            <div>
              <p className="text-sm font-semibold text-foreground/90">Pre-execution 훅 (EIP-4788)</p>
              <p className="text-xs text-foreground/60"><code className="text-xs">apply_beacon_root_contract_call(parent_beacon_block_root)</code></p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-3 flex gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">3</span>
            <div>
              <p className="text-sm font-semibold text-foreground/90">TX pool iterator (priority 순)</p>
              <p className="text-xs text-foreground/60"><code className="text-xs">best_transactions_with_attributes(base_fee)</code> — effective_tip 내림차순</p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0">4</span>
              <p className="text-sm font-semibold text-foreground/90">TX 순회 실행 루프</p>
            </div>
            <div className="mt-2 ml-9 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="rounded bg-muted/40 p-2">
                <p className="text-xs font-semibold text-foreground/70">Gas 초과</p>
                <p className="text-xs text-foreground/60"><code className="text-xs">mark_invalid()</code> → 다른 TX 시도</p>
              </div>
              <div className="rounded bg-muted/40 p-2">
                <p className="text-xs font-semibold text-foreground/70">실행 성공</p>
                <p className="text-xs text-foreground/60">gas/fee 누적, TX 추가</p>
              </div>
              <div className="rounded bg-muted/40 p-2">
                <p className="text-xs font-semibold text-foreground/70">실행 실패</p>
                <p className="text-xs text-foreground/60">sender 후속 TX skip</p>
              </div>
            </div>
            <p className="text-xs text-foreground/50 mt-2 ml-9">gas 90% 도달 시 조기 종료</p>
          </div>
          <div className="rounded-lg border border-border/60 p-3 flex gap-3">
            <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-xs font-bold shrink-0">5</span>
            <div>
              <p className="text-sm font-semibold text-foreground/90">Withdrawals + 블록 봉인</p>
              <p className="text-xs text-foreground/60"><code className="text-xs">apply_withdrawals()</code> → <code className="text-xs">build_header()</code> → <code className="text-xs">SealedBlock::new()</code> → <code className="text-xs">BuiltPayload</code></p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          TX 선택 루프의 핵심: <strong>priority 순회 + mark_invalid</strong>.<br />
          실행 실패 시 같은 sender의 후속 nonce TX도 건너뜀 (nonce gap 방지).<br />
          gas 90% 채우면 조기 종료 — 남은 10%는 작은 TX에 여유.
        </p>

        {/* ── block_value 계산 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">block_value — validator 수익 계산</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-indigo-400 mb-2">calculate_block_value()</p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              <code className="text-xs">effective_tip = min(max_priority_fee, max_fee - base_fee)</code><br />
              <code className="text-xs">block_value += effective_tip * gas_used</code><br />
              base_fee는 소각 — priority_fee만 validator 수익.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-2">극대화 전략 4가지</p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li>gas_limit 최대 활용 (더 많은 TX)</li>
              <li>높은 priority_fee TX 우선 (CoinbaseTipOrdering)</li>
              <li>MEV 번들 통합 (rbuilder)</li>
              <li>continuous building (매 500ms 개선)</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-amber-400 mb-2">MEV-Boost 경쟁</p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              self-build: ~0.05 ETH (일반 TX 팁)<br />
              MEV-Boost bid: ~0.15 ETH (arbitrage 번들)<br />
              → validator는 높은 쪽 선택.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-blue-400 mb-2">연간 수익 추정 (메인넷)</p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li>신규 발행: ~1 ETH/yr per 32 ETH</li>
              <li>TX priority_fee: ~0.5 ETH/yr</li>
              <li>MEV-Boost: ~1 ETH/yr</li>
              <li>합계: ~2.5 ETH/yr (~7.8% APR)</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          <code>block_value</code>가 <strong>validator 수익성의 직접 지표</strong>.<br />
          높은 priority_fee TX 많이 포함 → 더 높은 block_value.<br />
          MEV-Boost가 가장 큰 변수 — 번들 통합으로 수배 수익 증가 가능.
        </p>

        {/* ── Withdrawals 처리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Withdrawals — post-execution 단계</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-indigo-400 mb-2">apply_withdrawals() 흐름</p>
            <div className="space-y-1">
              <div className="flex gap-2 text-xs text-foreground/70">
                <span className="rounded bg-muted/40 px-2 py-1">1. 수취 주소 계정 로드</span>
                <span className="text-foreground/30">&rarr;</span>
                <span className="rounded bg-muted/40 px-2 py-1">2. Gwei → Wei 변환 후 잔고 증가</span>
                <span className="text-foreground/30">&rarr;</span>
                <span className="rounded bg-muted/40 px-2 py-1">3. state 업데이트</span>
              </div>
            </div>
            <p className="text-xs text-foreground/50 mt-2"><code className="text-xs">saturating_add</code>로 오버플로 방지</p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-2">Withdrawal 특성</p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li>CL staking validator 인출 (EOA / 컨트랙트 주소)</li>
              <li>블록당 최대 <strong>16개</strong> withdrawal</li>
              <li>TX 아닌 state transition — <strong>gas 소모 없음</strong></li>
              <li><code className="text-xs">withdrawals_root</code> → 헤더에 머클 루트 기록</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          Withdrawals는 <strong>TX 아닌 특수 state transition</strong>.<br />
          gas 소모 없이 state만 변경 — CL의 validator 잔고를 EL로 이전.<br />
          블록당 16개 withdrawals로 validator 공평 순환 처리.
        </p>
      </div>

      <div className="not-prose mb-6"><BuildJobDetailViz /></div>

      {/* 빌드 단계 카드 */}
      <h3 className="text-lg font-semibold mb-3">빌드 단계</h3>
      <div className="space-y-2 mb-6">
        {BUILD_PHASES.map((p, i) => (
          <motion.div key={i} onClick={() => setActivePhase(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === activePhase ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === activePhase ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: i === activePhase ? p.color : 'var(--muted)', color: i === activePhase ? '#fff' : 'var(--muted-foreground)' }}>
                {i + 1}
              </span>
              <div>
                <span className="font-semibold text-sm">{p.phase}</span>
                <p className="text-xs font-mono text-foreground/50">{p.action}</p>
              </div>
            </div>
            <AnimatePresence>
              {i === activePhase && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-10">{p.detail}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* 구현 인사이트 Q&A */}
      <h3 className="text-lg font-semibold mb-3">구현 인사이트</h3>
      <div className="space-y-2 mb-6">
        {BUILD_INSIGHTS.map((q, i) => (
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
        <CodeViewButton onClick={() => onCodeRef('build-payload', codeRefs['build-payload'])} />
        <span className="text-[10px] text-muted-foreground self-center">build_payload()</span>
      </div>
    </section>
  );
}
