import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import BuilderDetailViz from './viz/BuilderDetailViz';
import type { CodeRef } from '@/components/code/types';
import { BUILD_STEPS } from './BuilderApiData';

export default function BuilderApi({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const sel = BUILD_STEPS.find(s => s.step === activeStep);

  return (
    <section id="builder-api" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Builder API 연동</h2>
      <div className="not-prose mb-8"><BuilderDetailViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('mev-builder', codeRefs['mev-builder'])} />
          <span className="text-[10px] text-muted-foreground self-center">MevPayloadBuilder</span>
          <CodeViewButton onClick={() => onCodeRef('mev-build', codeRefs['mev-build'])} />
          <span className="text-[10px] text-muted-foreground self-center">build_payload 비교 로직</span>
        </div>
        <p className="leading-7">
          <strong>MevPayloadBuilder</strong>는 로컬 빌더와 외부 빌더를 래핑하는 구조체다.<br />
          inner(로컬 PayloadBuilder)와 relay_client(릴레이 통신 클라이언트) 두 필드를 가진다.
        </p>
        <p className="leading-7">
          핵심 설계 판단 — 로컬 블록을 먼저 완성한 뒤 외부 입찰과 비교한다.<br />
          이 "로컬 먼저" 패턴 덕분에, 외부 릴레이가 전부 다운되어도 노드는 정상적으로 블록을 제안할 수 있다.<br />
          네트워크 liveness를 절대 해치지 않는 안전한 설계다.
        </p>

        {/* ── rbuilder 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">rbuilder — Reth 기반 MEV 빌더</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">Builder 구조체 (rbuilder)</p>
            <p className="text-sm text-foreground/60 mb-2">Flashbots가 만든 Rust MEV 빌더. Reth를 라이브러리로 사용.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-foreground/80">
              <span><code>state_provider: Arc&lt;dyn StateProviderFactory&gt;</code></span>
              <span><code>bundles: Arc&lt;DashMap&lt;BundleId, Bundle&gt;&gt;</code></span>
              <span><code>block_assembler: BlockAssembler</code></span>
              <span><code>bid_submitter: RelaySubmitter</code></span>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">build_block 흐름</p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p>1. 모든 번들 수집 (<code>bundles.iter()</code>)</p>
              <p>2. <code>state_provider.state_at_block_hash(parent_hash)</code>로 초기 상태 로드</p>
              <p>3. <code>block_assembler.optimize(bundles, mempool_txs, gas_limit)</code> — bin packing 변종</p>
              <p>4. <code>execute_and_seal()</code> — Reth의 revm으로 실행 & 검증</p>
              <p>5. <code>bid_submitter.submit(slot, block, value)</code> — relay에 bid 제출</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-1.5 text-foreground/60">state provider</div>
            <div className="rounded border border-border/40 p-1.5 text-foreground/60">revm executor</div>
            <div className="rounded border border-border/40 p-1.5 text-foreground/60">MPT</div>
            <div className="rounded border border-border/40 p-1.5 text-foreground/60">RLP encoding</div>
            <div className="rounded border border-border/40 p-1.5 text-foreground/60">chain spec</div>
          </div>
        </div>
        <p className="leading-7">
          rbuilder가 <strong>Reth의 첫 번째 대규모 downstream 프로젝트</strong>.<br />
          Reth를 라이브러리로 사용 → 블록 실행 엔진 재구현 불필요.<br />
          MEV builder 전용 로직(bundle 수집, 조합 최적화, bid 제출)만 추가.
        </p>

        {/* ── block assembler 최적화 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Block Assembler — NP-hard 최적화</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">Block Assembler — NP-hard 최적화</p>
            <p className="text-sm text-foreground/80 mb-2">제약: <code>gas_limit</code> 30M 이하 / 번들 atomic / TX 간 state 충돌 가능 / 번들 간 수익 의존성. 완전 탐색: 2^N 불가능.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-center mb-2">
              <div className="rounded border border-border/40 p-2"><p className="text-foreground/60">Greedy</p><p className="text-xs text-foreground/40">수익/gas 비율 순</p></div>
              <div className="rounded border border-border/40 p-2"><p className="text-foreground/60">SA</p><p className="text-xs text-foreground/40">랜덤 perturbation</p></div>
              <div className="rounded border border-border/40 p-2"><p className="text-foreground/60">Beam Search</p><p className="text-xs text-foreground/40">top K 후보 유지</p></div>
              <div className="rounded border border-border/40 p-2"><p className="text-foreground/60">Parallel Sim</p><p className="text-xs text-foreground/40">병렬 시뮬레이션</p></div>
            </div>
            <p className="text-sm text-foreground/60">rbuilder: 여러 알고리즘 병렬 실행 → 최고 block_value 선택. 매 50ms 새 결과 생성(continuous building).</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">bin_packing_greedy</p>
            <p className="text-sm text-foreground/80">수익 기준 정렬 → gas 초과 skip → conflict skip → <code>simulate_in_context()</code>로 수익 확인 → profitable이면 추가.</p>
          </div>
        </div>
        <p className="leading-7">
          블록 조립은 <strong>제약 조건 하 최적화 문제</strong> — NP-hard.<br />
          완전 탐색 불가 → 근사 알고리즘 병렬 실행 후 best 결과 선택.<br />
          50ms마다 새 조합 시도 → slot 시간 내 최대 수익 탐색.
        </p>

        {/* ── Bid 제출 & 선택 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Bid 제출 & Validator 선택</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">Bid 제출 — <code>POST /relay/v1/builder/blocks</code></p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-foreground/80 mb-2">
              <span><code>slot</code>, <code>parent_hash</code>, <code>block_hash</code></span>
              <span><code>builder_pubkey</code>, <code>proposer_pubkey</code></span>
              <span><code>gas_limit</code> / <code>gas_used</code></span>
              <span><code>value</code> — bid 금액(wei)</span>
              <span><code>execution_payload</code> — full block</span>
              <span><code>signature</code> — builder 서명</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded border border-border/40 p-3 text-sm">
              <p className="text-xs font-bold text-foreground/60 mb-1">수익 분배 예시</p>
              <p className="text-foreground/70">priority_fee 수집: 0.20 ETH / bid(validator): 0.15 ETH / builder 순이익: 0.05 ETH</p>
            </div>
            <div className="rounded border border-border/40 p-3 text-sm">
              <p className="text-xs font-bold text-foreground/60 mb-1">Relay 검증</p>
              <p className="text-foreground/70">서명 확인 / <code>value &gt;= min_bid</code> / <code>gas_used &lt;= gas_limit</code> / payload 유효성</p>
            </div>
          </div>
          <p className="text-sm text-foreground/60">시간 게임: 늦을수록 더 많은 번들 수집(수익 상승) vs 너무 늦으면 self-build 선택. 균형점 ~3~4초.</p>
        </div>
        <p className="leading-7">
          Builder는 <strong>bid 금액으로 validator 유혹</strong>.<br />
          builder의 수익 = total_mev - validator_bid → 더 많이 양보하면 validator에 더 많이 선택됨.<br />
          시간 게임: 늦게 제출 = 더 많은 MEV, 하지만 timeout 위험.
        </p>
      </div>

      {/* Build steps */}
      <h3 className="text-lg font-semibold mb-3">build_payload 흐름</h3>
      <div className="not-prose grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {BUILD_STEPS.map(s => (
          <button key={s.id}
            onClick={() => setActiveStep(activeStep === s.step ? null : s.step)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: activeStep === s.step ? s.color : 'var(--color-border)',
              background: activeStep === s.step ? `${s.color}10` : undefined,
            }}>
            <p className="font-mono font-bold text-sm" style={{ color: s.color }}>Step {s.step}</p>
            <p className="text-xs text-foreground/60 mt-1">{s.title}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>Step {sel.step}: {sel.title}</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{sel.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>타이밍 게임</strong> — 빌더는 슬롯 마감 직전까지 TX를 수집하여 MEV를 최대화하려 한다.<br />
          하지만 너무 늦으면 Proposer가 로컬 블록을 사용한다.<br />
          이 긴장 관계가 빌더 간 경쟁을 만들고, 결과적으로 Proposer에게 더 높은 수수료를 제공한다.
        </p>
      </div>
    </section>
  );
}
