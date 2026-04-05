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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// revm 크레이트 구조
revm/
├── crates/
│   ├── interpreter/      # opcode 실행 루프, 스택, 메모리
│   ├── primitives/       # EVM 타입 (Env, CfgEnv, BlockEnv, TxEnv)
│   ├── precompile/       # 프리컴파일 구현 (0x01~0x0A)
│   └── revm/             # 최상위 API (Evm, Database trait)

// Reth가 revm을 감싸는 방법:
// 1. Reth의 StateProvider → revm의 Database trait 구현
// 2. Reth의 Header/Block → revm의 BlockEnv 변환
// 3. Reth의 Transaction → revm의 TxEnv 변환
// 4. revm 실행 결과 → Reth의 Receipt + BundleState 변환

// revm이 Geth EVM 대비 빠른 이유:
// 1. Rust inline (Go는 인터페이스 경유)
// 2. opcode 배열 디스패치 (Go는 map lookup)
// 3. 스택 [u8; 32] 고정 크기 (Go는 big.Int 힙)
// 4. 레지스터 할당 최적화 (LLVM)

// 벤치마크 (1M gas 블록 실행):
// Geth EVM:  ~10ms
// revm:      ~5ms
// → 약 2배 속도 차이`}
        </pre>
        <p className="leading-7">
          revm은 <strong>독립 프로젝트</strong> — Reth, Foundry, Anvil, Hardhat Rust 엔진 등이 공통 사용.<br />
          옵코드 구현의 버그 수정/EIP 지원이 revm 팀에 집중 → 모든 사용자가 혜택.<br />
          Reth의 책임은 "상태 어댑터"에 한정 — EVM 로직 자체는 재구현 금지.
        </p>

        {/* ── BlockExecutor trait ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BlockExecutor & BatchExecutor trait</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 단일 블록 실행용
pub trait BlockExecutor<DB: Database> {
    type Input<'a>;   // &BlockWithSenders + StateProvider
    type Output;      // BlockExecutionOutput { receipts, gas_used, requests }
    type Error;       // BlockValidationError

    fn execute_and_verify_one(
        &mut self,
        input: Self::Input<'_>,
    ) -> Result<Self::Output, Self::Error>;
}

// 여러 블록 누적 실행용 (ExecutionStage가 사용)
pub trait BatchExecutor<DB: Database> {
    type Input<'a>;
    type Output;      // finalize() 결과 = BundleState

    fn execute_and_verify_one(
        &mut self,
        input: Self::Input<'_>,
    ) -> Result<(), BlockExecutionError>;

    /// finalize()는 self를 소비 → 한 번만 호출 가능
    /// BundleState로 모든 누적 변경 반환
    fn finalize(self) -> BundleState;
}

// 두 trait 분리 이유:
// - BlockExecutor: live sync (1블록씩 실행, 즉시 검증)
// - BatchExecutor: initial sync (수천 블록 누적, 나중에 저장)

// BatchExecutor가 더 빠른 이유:
// - 블록 간 상태 변경 캐시 재사용
// - DB write 횟수 감소 (commit_threshold 단위)
// - reorg 시 BundleState 롤백이 인메모리 조작`}
        </pre>
        <p className="leading-7">
          <code>BlockExecutor</code>와 <code>BatchExecutor</code> 분리가 핵심 — 사용 목적에 따라 최적 경로 선택.<br />
          live sync는 블록마다 DB 커밋 (크래시 복구 우선), initial sync는 배치 누적 (속도 우선).<br />
          <code>finalize(self)</code>가 self 소비 — Rust의 소유권 시스템이 "한 번만 호출" 강제.
        </p>

        {/* ── Strategy 패턴 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BlockExecutionStrategy — 체인별 실행 커스터마이징</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// trait으로 체인별 실행 로직 추상화
pub trait BlockExecutionStrategy {
    type Error;

    /// 블록 시작 전 훅 (EIP-4788 beacon root, OP deposit TX 등)
    fn apply_pre_execution_changes(
        &mut self,
        block: &BlockWithSenders,
    ) -> Result<(), Self::Error>;

    /// 트랜잭션 실행 본체 (revm 호출)
    fn execute_transactions(
        &mut self,
        block: &BlockWithSenders,
    ) -> Result<(Vec<Receipt>, u64), Self::Error>;

    /// 블록 종료 후 훅 (Shanghai withdrawals, Prague requests 등)
    fn apply_post_execution_changes(
        &mut self,
        block: &BlockWithSenders,
        receipts: &[Receipt],
    ) -> Result<Vec<Request>, Self::Error>;
}

// 구현체:
// - EthExecutionStrategy: 이더리움 메인넷
// - OpExecutionStrategy: Optimism (L1 attributes deposit TX 추가)
// - BaseExecutionStrategy: Base (OP 상속 + Coinbase 커스텀)

// 공통 파이프라인:
// 1. pre_execution_changes (훅)
// 2. execute_transactions (revm 호출)
// 3. post_execution_changes (훅)
//
// 각 체인은 3개 메서드만 오버라이드 → 경로 중복 없음`}
        </pre>
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
