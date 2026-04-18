import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import BlockExecViz from './viz/BlockExecViz';
import { DESIGN_CHOICES } from './OverviewData';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = DESIGN_CHOICES.find(d => d.id === selected);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">블록 실행 전체 흐름</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Reth는 EVM을 처음부터 구현하지 않는다.<br />
          <strong>revm</strong>(Rust EVM) 라이브러리를 사용한다.<br />
          140개 이상의 옵코드 구현이 검증되어 있고, 하드포크 스펙 변경도 revm 팀이 관리한다.<br />
          Reth의 역할은 "revm에 올바른 입력을 넣고, 결과를 효율적으로 저장"하는 것이다.
        </p>
        <p className="leading-7">
          블록 실행의 핵심 추상화는 <code>BlockExecutionStrategy</code> 패턴이다.<br />
          이더리움 메인넷, OP Stack, Polygon 등 체인마다 블록 실행 규칙이 다르다.<br />
          trait 기반 Strategy 패턴으로 실행 로직을 교체한다.<br />
          핵심 파이프라인은 공유하고, 체인별 차이(시스템 TX, pre/post hook 등)만 오버라이드한다.
        </p>
        <p className="leading-7">
          상태 변경은 <code>BundleState</code>에 인메모리로 누적된다.<br />
          블록마다 DB에 쓰지 않고, commit_threshold(기본 10,000블록) 단위로 한 번에 기록한다.<br />
          이 아티클에서는 BlockExecutor, EvmConfig, BundleState의 내부를 코드 수준으로 추적한다.
        </p>

        {/* ── revm 통합 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">revm — Rust 네이티브 EVM</h3>
        <div className="not-prose my-4 space-y-3">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-semibold text-indigo-500 mb-2">revm 크레이트 구조</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="rounded border border-border/40 p-2 text-center">
                <p className="font-mono font-semibold">interpreter/</p>
                <p className="text-foreground/50 mt-0.5">opcode 실행 루프, 스택, 메모리</p>
              </div>
              <div className="rounded border border-border/40 p-2 text-center">
                <p className="font-mono font-semibold">primitives/</p>
                <p className="text-foreground/50 mt-0.5">Env, CfgEnv, BlockEnv, TxEnv</p>
              </div>
              <div className="rounded border border-border/40 p-2 text-center">
                <p className="font-mono font-semibold">precompile/</p>
                <p className="text-foreground/50 mt-0.5">프리컴파일 (0x01~0x0A)</p>
              </div>
              <div className="rounded border border-border/40 p-2 text-center">
                <p className="font-mono font-semibold">revm/</p>
                <p className="text-foreground/50 mt-0.5">최상위 API (Evm, Database)</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
              <p className="text-xs font-semibold text-foreground/60 mb-1.5">Reth &harr; revm 연결</p>
              <ol className="list-decimal list-inside space-y-0.5 text-xs text-foreground/60">
                <li>StateProvider &rarr; revm Database trait</li>
                <li>Header/Block &rarr; BlockEnv 변환</li>
                <li>Transaction &rarr; TxEnv 변환</li>
                <li>실행 결과 &rarr; Receipt + BundleState</li>
              </ol>
            </div>
            <div className="rounded-lg border border-emerald-400/40 bg-emerald-50/20 dark:bg-emerald-950/10 p-3">
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1.5">revm이 Geth 대비 빠른 이유</p>
              <ol className="list-decimal list-inside space-y-0.5 text-xs text-foreground/60">
                <li>Rust inline (Go는 인터페이스 경유)</li>
                <li>opcode 배열 디스패치 (Go는 map lookup)</li>
                <li>스택 [u8; 32] 고정 크기 (Go는 big.Int 힙)</li>
                <li>LLVM 레지스터 할당 최적화</li>
              </ol>
              <p className="text-xs text-foreground/40 mt-1.5">1M gas 블록: Geth ~10ms / revm ~5ms (약 2배)</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          revm은 <strong>독립 프로젝트</strong> — Reth, Foundry, Anvil, Hardhat Rust 엔진 등이 공통 사용.<br />
          옵코드 구현의 버그 수정/EIP 지원이 revm 팀에 집중 → 모든 사용자가 혜택.<br />
          Reth의 책임은 "상태 어댑터"에 한정 — EVM 로직 자체는 재구현 금지.
        </p>

        {/* ── BlockExecutor trait ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BlockExecutor & BatchExecutor trait</h3>
        <div className="not-prose my-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-semibold text-indigo-500 mb-2">BlockExecutor&lt;DB&gt;</p>
              <p className="text-xs text-foreground/50 mb-2">단일 블록 실행 (live sync)</p>
              <div className="space-y-1 text-xs text-foreground/60">
                <p><code>Input</code>: <code>&amp;BlockWithSenders</code> + StateProvider</p>
                <p><code>Output</code>: receipts, gas_used, requests</p>
                <p><code>execute_and_verify_one()</code> -- 1블록 실행 + 즉시 검증</p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">BatchExecutor&lt;DB&gt;</p>
              <p className="text-xs text-foreground/50 mb-2">누적 실행 (initial sync, ExecutionStage 사용)</p>
              <div className="space-y-1 text-xs text-foreground/60">
                <p><code>execute_and_verify_one()</code> -- 블록 하나 실행, 결과 누적</p>
                <p><code>finalize(self)</code> -- self 소비 &rarr; BundleState 반환 (한 번만 호출 가능)</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-amber-400/40 bg-amber-50/50 dark:bg-amber-950/20 p-3">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1.5">BatchExecutor가 더 빠른 이유</p>
            <div className="text-xs text-foreground/60 space-y-0.5">
              <p>- 블록 간 상태 변경 캐시 재사용</p>
              <p>- DB write 횟수 감소 (commit_threshold 단위)</p>
              <p>- reorg 시 BundleState 롤백이 인메모리 조작</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>BlockExecutor</code>와 <code>BatchExecutor</code> 분리가 핵심 — 사용 목적에 따라 최적 경로 선택.<br />
          live sync는 블록마다 DB 커밋 (크래시 복구 우선), initial sync는 배치 누적 (속도 우선).<br />
          <code>finalize(self)</code>가 self 소비 — Rust의 소유권 시스템이 "한 번만 호출" 강제.
        </p>

        {/* ── Strategy 패턴 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BlockExecutionStrategy — 체인별 실행 커스터마이징</h3>
        <div className="not-prose my-4 space-y-3">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-semibold text-indigo-500 mb-2">BlockExecutionStrategy trait</p>
            <div className="space-y-2 text-sm">
              <div className="rounded border border-border/40 p-2.5">
                <p className="font-mono text-xs font-semibold text-foreground/70">apply_pre_execution_changes(&amp;mut self, block)</p>
                <p className="text-xs text-foreground/50 mt-0.5">블록 시작 전 훅 -- EIP-4788 beacon root, OP deposit TX 등</p>
              </div>
              <div className="rounded border border-border/40 p-2.5">
                <p className="font-mono text-xs font-semibold text-foreground/70">execute_transactions(&amp;mut self, block) -&gt; (Vec&lt;Receipt&gt;, u64)</p>
                <p className="text-xs text-foreground/50 mt-0.5">TX 실행 본체 -- revm 호출</p>
              </div>
              <div className="rounded border border-border/40 p-2.5">
                <p className="font-mono text-xs font-semibold text-foreground/70">apply_post_execution_changes(&amp;mut self, block, receipts)</p>
                <p className="text-xs text-foreground/50 mt-0.5">블록 종료 후 훅 -- Shanghai withdrawals, Prague requests 등</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-semibold text-foreground/60 mb-2">구현체 (각 체인은 3개 메서드만 오버라이드)</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="rounded border border-border/40 p-2 text-center">
                <p className="font-semibold">EthExecutionStrategy</p>
                <p className="text-foreground/50">이더리움 메인넷</p>
              </div>
              <div className="rounded border border-border/40 p-2 text-center">
                <p className="font-semibold">OpExecutionStrategy</p>
                <p className="text-foreground/50">Optimism (L1 deposit TX)</p>
              </div>
              <div className="rounded border border-border/40 p-2 text-center">
                <p className="font-semibold">BaseExecutionStrategy</p>
                <p className="text-foreground/50">Base (OP + Coinbase)</p>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Strategy 패턴으로 <strong>OP Stack 통합 단순화</strong>.<br />
          OP는 메인넷과 TX 실행 로직 공유, L1 attribute deposit TX만 pre-execution 훅에서 추가.<br />
          새 L2 체인 지원 시 <code>BlockExecutionStrategy</code> 구현체 1개만 작성.
        </p>
      </div>

      <div className="not-prose mb-8"><ContextViz /></div>

      {/* Design decision cards */}
      <h3 className="text-lg font-semibold mb-3">핵심 설계 판단</h3>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {DESIGN_CHOICES.map(d => (
          <button key={d.id}
            onClick={() => setSelected(selected === d.id ? null : d.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: selected === d.id ? d.color : 'var(--color-border)',
              background: selected === d.id ? `${d.color}10` : undefined,
            }}>
            <p className="font-bold text-sm" style={{ color: d.color }}>{d.title}</p>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>{sel.title}</p>
            <p className="text-sm text-foreground/60 leading-relaxed mb-2">
              <strong>문제:</strong> {sel.problem}
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              <strong>해결:</strong> {sel.solution}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="not-prose mt-4"><BlockExecViz /></div>
    </section>
  );
}
