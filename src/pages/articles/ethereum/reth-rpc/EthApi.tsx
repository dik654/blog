import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { ETH_METHODS } from './EthApiData';

export default function EthApi({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = ETH_METHODS.find(m => m.id === selected);

  return (
    <section id="eth-api" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">EthApi trait 구현</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('rpc-eth-api', codeRefs['rpc-eth-api'])} />
          <span className="text-[10px] text-muted-foreground self-center">EthApiServer trait</span>
        </div>
        <p className="leading-7">
          <strong>EthApiServer</strong> trait은 eth_* JSON-RPC 메서드를 선언한다.<br />
          jsonrpsee의 <code>#[rpc(server, namespace = "eth")]</code> 매크로가 trait 정의에서 라우팅 코드를 자동 생성한다.<br />
          구현체는 이 trait을 impl하여 각 메서드의 비즈니스 로직을 작성한다.
        </p>
        <p className="leading-7">
          내부적으로 모든 상태 조회는 <strong>StateProvider</strong> trait을 통해 이루어진다.<br />
          이 추상화 덕분에 MDBX(기본 DB), 메모리 DB, Mock 등을 교체할 수 있다.<br />
          EVM 실행이 필요한 메서드(eth_call, eth_estimateGas)는 revm을 사용한다.
        </p>

        {/* ── eth_getBalance 구현 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">eth_getBalance — 단순 조회</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">eth_getBalance 흐름</p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p>1. <code>state_at_block_id(block_id)</code>로 StateProvider 결정</p>
              <p>2. <code>state.account(&amp;address)?.unwrap_or_default()</code> 계정 조회</p>
              <p>3. <code>account.balance</code> 반환(wei 단위)</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">BlockNumberOrTag</p>
              <div className="grid grid-cols-2 gap-1 text-sm text-foreground/80">
                <span><code>Latest</code> — 현재 tip</span>
                <span><code>Finalized</code></span>
                <span><code>Safe</code></span>
                <span><code>Earliest</code> — genesis</span>
                <span><code>Pending</code> — txpool 포함</span>
                <span><code>Number(u64)</code></span>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">StateProvider 선택</p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>"latest" → <code>LatestStateProvider</code>(최신 MDBX)</p>
                <p>과거 블록 → <code>HistoricalStateProvider</code>(ChangeSets 역추적)</p>
                <p>"pending" → txpool 시뮬레이션 상태</p>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>eth_getBalance</code>는 <strong>StateProvider 1회 호출</strong>로 완료.<br />
          <code>block_id</code>에 따라 다른 Provider 구현체 선택 → 통일된 인터페이스로 처리.<br />
          "latest" 빠르고, 과거 블록은 ChangeSet 역추적 (약간 느림).
        </p>

        {/* ── eth_call 구현 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">eth_call — EVM 시뮬레이션</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 my-4">
          <p className="text-xs font-bold text-foreground/70 mb-3">eth_call — EVM 시뮬레이션 흐름</p>
          <div className="space-y-1 text-sm text-foreground/80 mb-3">
            <p>1. <code>state_at_block_id(block_id)</code>로 기준 블록 상태 로드</p>
            <p>2. <code>StateOverride</code> 적용(선택적, 디버깅용)</p>
            <p>3. <code>Evm::builder()</code>로 revm 설정 — <code>StateProviderDatabase</code> + <code>block_env</code> + <code>tx_env</code></p>
            <p>4. <code>evm.transact()</code> 실행(read-only, 상태 변경 기록 안 함)</p>
            <p>5. <code>Success</code> → 출력 반환 / <code>Revert</code> → 에러 / <code>Halt</code> → 에러</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-1.5 text-foreground/60">read-only</div>
            <div className="rounded border border-border/40 p-1.5 text-foreground/60">gas 무제한(50M)</div>
            <div className="rounded border border-border/40 p-1.5 text-foreground/60">gas price 0 가능</div>
            <div className="rounded border border-border/40 p-1.5 text-foreground/60">ERC20/Uniswap 조회</div>
          </div>
        </div>
        <p className="leading-7">
          <code>eth_call</code>은 <strong>상태 변경 없이 EVM 실행</strong> — revm의 transact() 호출.<br />
          <code>StateOverride</code>로 가상의 상태 주입 가능 (디버깅/시뮬레이션).<br />
          Uniswap 쿼터, balance 조회 등 대부분의 "읽기" 스마트 컨트랙트 호출에 사용.
        </p>

        {/* ── eth_estimateGas ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">eth_estimateGas — binary search</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 my-4">
          <p className="text-xs font-bold text-foreground/70 mb-3">eth_estimateGas — binary search</p>
          <div className="space-y-1 text-sm text-foreground/80 mb-3">
            <p>범위: <code>lo</code> = <code>intrinsic_gas</code>(최소 21000) / <code>hi</code> = <code>gas_limit</code>(30M)</p>
            <p>초기: <code>hi</code>로 실행 성공 확인 → 실패 시 <code>ExecutionReverted</code></p>
            <p>탐색: <code>mid = (lo + hi) / 2</code> → 성공이면 <code>hi = mid</code>, 실패면 <code>lo = mid</code></p>
            <p>결과: 수렴 지점 <code>hi</code> × 110%(안전 마진) 반환</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm text-center">
            <div className="rounded border border-border/40 p-2">
              <p className="text-foreground/60">반복 횟수</p>
              <p className="text-xs text-foreground/40">~11회 (log2(30M/21K))</p>
            </div>
            <div className="rounded border border-border/40 p-2">
              <p className="text-foreground/60">각 반복</p>
              <p className="text-xs text-foreground/40">revm 실행 ~수 ms</p>
            </div>
            <div className="rounded border border-border/40 p-2">
              <p className="text-foreground/60">총 응답</p>
              <p className="text-xs text-foreground/40">~수십 ms</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>eth_estimateGas</code>는 <strong>binary search + revm 실행</strong>.<br />
          정확한 gas 사용량은 실행해봐야 알 수 있음 — 점진적으로 범위 좁히기.<br />
          약 11회 실행으로 정확한 gas 추정 + 10% 안전 마진 추가.
        </p>

        {/* ── eth_getLogs ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">eth_getLogs — Bloom filter 활용</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-3">eth_getLogs — Bloom filter 활용</p>
            <div className="space-y-1 text-sm text-foreground/80 mb-2">
              <p>1. 블록 범위 결정: <code>from_block</code> ~ <code>to_block</code></p>
              <p>2. 각 블록의 <code>logs_bloom</code>으로 O(1) 사전 필터링 — 매칭 없으면 <code>continue</code></p>
              <p>3. Bloom 통과 블록만 실제 receipt/log 조회 → <code>filter.matches(log)</code></p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded border border-green-500/30 bg-green-500/5 p-3 text-sm">
              <p className="text-xs font-bold text-green-500 mb-1">Bloom 필터링 효과</p>
              <p className="text-foreground/70">100만 블록 범위: Bloom 없이 1.5억 log 전수 검사 → Bloom 있으면 ~0.2%(2000 블록)만 검사 = <strong>500배 가속</strong></p>
            </div>
            <div className="rounded border border-border/40 p-3 text-sm">
              <p className="text-xs font-bold text-foreground/60 mb-1">제한</p>
              <p className="text-foreground/70">블록 범위 ~10K / 결과 ~10K logs / 초과 시 400 에러 반환(인프라 보호)</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>eth_getLogs</code>는 <strong>Bloom filter로 99% 블록 건너뜀</strong>.<br />
          블룸 통과한 ~0.2% 블록만 실제 log 검사 → 500배 가속.<br />
          블록 범위 제한(~10K)으로 인프라 보호 + 정책적 제한.
        </p>
      </div>

      {/* Method cards */}
      <h3 className="text-lg font-semibold mb-3">주요 메서드</h3>
      <div className="not-prose grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
        {ETH_METHODS.map(m => (
          <button key={m.id}
            onClick={() => setSelected(selected === m.id ? null : m.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: selected === m.id ? m.color : 'var(--color-border)',
              background: selected === m.id ? `${m.color}10` : undefined,
            }}>
            <p className="font-mono text-xs font-bold" style={{ color: m.color }}>{m.name}</p>
            <p className="text-xs text-foreground/50 mt-0.5">{m.category}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-1" style={{ color: sel.color }}>{sel.name}</p>
            <p className="text-sm text-foreground/80 mb-2">{sel.desc}</p>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-foreground/40">흐름:</span>
              <span className="font-mono text-foreground/70">{sel.flow}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>eth_call은 읽기 전용</strong> — StateProvider 위에 revm을 임시로 실행하고 결과만 반환한다.<br />
          상태를 변경하지 않으므로 별도의 락이나 트랜잭션 관리가 필요 없다.
          eth_estimateGas는 binary search로 최소 가스를 탐색하므로 revm을 여러 번 실행한다.
        </p>
      </div>
    </section>
  );
}
