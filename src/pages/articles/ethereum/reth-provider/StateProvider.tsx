import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StateProviderViz from './viz/StateProviderViz';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { TRAIT_METHODS, IMPLEMENTORS } from './StateProviderData';

export default function StateProvider({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeMethod, setActiveMethod] = useState(0);

  return (
    <section id="state-provider" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">StateProvider trait</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>StateProvider</code>는 상태 접근의 핵심 추상화다.<br />
          이 trait을 구현하면 어떤 저장소든 — 메모리, 디스크 DB, 테스트 Mock — 동일한 인터페이스로 상태를 제공할 수 있다.<br />
          호출자는 상태가 어디에 저장되어 있는지 알 필요가 없다.
        </p>
        <p className="leading-7">
          trait은 3개 메서드만 요구한다.<br />
          <strong>계정 조회</strong>, <strong>스토리지 조회</strong>, <strong>바이트코드 조회</strong>.<br />
          이 3개면 EVM 실행에 필요한 모든 상태 접근을 커버한다.<br />
          Geth의 <code>StateDB</code>가 수십 개 메서드를 노출하는 것과 대조적이다.
        </p>

        {/* ── trait 계층 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Provider trait 계층 — 역할별 세분화</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Reth는 역할별 trait을 별도로 정의 → 조합
pub trait HeaderProvider: Send + Sync {
    fn header_by_number(&self, n: BlockNumber) -> Result<Option<Header>>;
    fn header_by_hash(&self, h: B256) -> Result<Option<Header>>;
    // ...
}

pub trait BlockReader: Send + Sync {
    fn block(&self, id: BlockHashOrNumber) -> Result<Option<Block>>;
    // ...
}

pub trait TransactionReader: Send + Sync {
    fn transaction_by_hash(&self, h: B256) -> Result<Option<Transaction>>;
    // ...
}

pub trait StateProvider: Send + Sync {
    fn account(&self, a: &Address) -> Result<Option<Account>>;
    fn storage(&self, a: &Address, k: &StorageKey) -> Result<Option<StorageValue>>;
    fn bytecode_by_hash(&self, h: &B256) -> Result<Option<Bytecode>>;
}

// 조합 구현: StateProviderFactory
pub trait StateProviderFactory: BlockReader + HeaderProvider {
    fn latest(&self) -> Result<Box<dyn StateProvider>>;
    fn history_by_block_number(&self, block: u64) -> Result<Box<dyn StateProvider>>;
}

// Interface Segregation Principle 적용:
// - RPC는 필요한 trait만 의존 (e.g., HeaderProvider만)
// - Mock 테스트 시 최소 메서드만 구현
// - 새 기능 추가 시 관련 trait만 확장`}
        </pre>
        <p className="leading-7">
          trait을 <strong>역할별로 쪼개어</strong> 정의 — "필요한 것만 의존".<br />
          RPC의 <code>eth_getBlockByNumber</code>는 <code>HeaderProvider + BlockReader</code>만 필요 → 다른 trait 몰라도 됨.<br />
          Mock 테스트 시 최소 메서드만 구현하여 테스트 단순화.
        </p>

        {/* ── 구현체 비교 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">StateProvider 구현체 3가지</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 1. LatestStateProviderRef — MDBX 최신 상태
impl<TX: DbTx> StateProvider for LatestStateProviderRef<'_, TX> {
    fn account(&self, addr: &Address) -> Result<Option<Account>> {
        self.tx.get::<PlainAccountState>(*addr)  // O(log n) B+tree 조회
    }
}

// 2. HistoricalStateProviderRef — 특정 블록 시점 상태
impl<TX: DbTx> StateProvider for HistoricalStateProviderRef<'_, TX> {
    fn account(&self, addr: &Address) -> Result<Option<Account>> {
        // 1) 현재 상태 로드
        // 2) AccountChangeSets에서 block_number 이후 변경 역적용
        // → block_number 시점 상태 복원
        load_historical_account(self.tx, *addr, self.block_number)
    }
}

// 3. BundleStateProvider — 인메모리 BundleState
impl<P: StateProvider> StateProvider for BundleStateProvider<'_, P> {
    fn account(&self, addr: &Address) -> Result<Option<Account>> {
        // BundleState 우선 확인
        if let Some(bundle_acc) = self.bundle.state.get(addr) {
            return Ok(bundle_acc.info.clone());
        }
        // 없으면 fallback (DB 쪽 provider로 위임)
        self.db_provider.account(addr)
    }
}

// 4. MockStateProvider — 테스트용
impl StateProvider for MockStateProvider {
    fn account(&self, addr: &Address) -> Result<Option<Account>> {
        Ok(self.accounts.get(addr).cloned())  // HashMap lookup
    }
}`}
        </pre>
        <p className="leading-7">
          4가지 구현체 모두 <strong>동일한 3개 메서드</strong>만 구현.<br />
          상위 코드(revm, RPC)는 어느 구현체를 받든 동일하게 동작 → 저장소 교체 가능.<br />
          MockStateProvider로 단위 테스트 작성 시 HashMap만 채우면 끝.
        </p>

        {/* ── EVM 통합 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">revm Database trait과의 통합</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// revm의 Database trait
pub trait Database {
    type Error;
    fn basic(&mut self, address: Address) -> Result<Option<AccountInfo>>;
    fn code_by_hash(&mut self, code_hash: B256) -> Result<Bytecode>;
    fn storage(&mut self, addr: Address, index: U256) -> Result<U256>;
    fn block_hash(&mut self, number: U256) -> Result<B256>;
}

// Reth가 StateProvider → revm Database로 어댑팅
pub struct StateProviderDatabase<DB>(pub DB);

impl<DB: StateProvider> Database for StateProviderDatabase<DB> {
    type Error = ProviderError;

    fn basic(&mut self, address: Address) -> Result<Option<AccountInfo>> {
        // Reth의 account() → revm의 AccountInfo 변환
        let account = self.0.account(&address)?;
        Ok(account.map(|a| AccountInfo {
            balance: a.balance,
            nonce: a.nonce,
            code_hash: a.code_hash,
            code: None,  // lazy load on code_by_hash()
        }))
    }

    fn storage(&mut self, addr: Address, slot: U256) -> Result<U256> {
        let key = B256::from(slot);
        Ok(self.0.storage(&addr, &key)?.unwrap_or_default())
    }
}

// 결과: revm이 Reth의 모든 StateProvider 구현체와 동작
// - 초기 동기화: LatestStateProviderRef
// - Historical RPC: HistoricalStateProviderRef
// - 블록 실행 중: BundleStateProvider`}
        </pre>
        <p className="leading-7">
          <code>StateProviderDatabase</code>가 <strong>어댑터 패턴</strong> — Reth와 revm의 경계.<br />
          StateProvider의 3개 메서드를 revm의 Database trait으로 매핑.<br />
          이 어댑터 덕분에 revm은 Reth 내부를 알 필요 없고, Reth는 revm을 자유롭게 사용.
        </p>
      </div>

      {/* trait 메서드 인터랙티브 카드 */}
      <h3 className="text-lg font-semibold mb-3">핵심 3개 메서드</h3>
      <div className="space-y-2 mb-8">
        {TRAIT_METHODS.map((m, i) => (
          <motion.div key={i} onClick={() => setActiveMethod(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === activeMethod ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === activeMethod ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <code className="text-sm font-mono font-semibold text-indigo-400">{m.name}</code>
              <span className="text-xs text-muted-foreground">→ {m.returns}</span>
            </div>
            <AnimatePresence>
              {i === activeMethod && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2">{m.desc}</p>
                  <p className="text-xs text-muted-foreground mt-1">MDBX 테이블: <code>{m.table}</code></p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <strong>왜 trait인가?</strong>{' '}
          Rust의 trait은 인터페이스 역할을 한다.
          <code>LatestStateProviderRef</code>는 MDBX에서 최신 상태를 읽고,
          <code>HistoricalStateProvider</code>는 ChangeSet으로 과거 상태를 복원하지만,
          <br />
          호출하는 쪽은 둘 다 <code>&dyn StateProvider</code>로 동일하게 다룬다.
        </p>
      </div>

      {/* 구현체 목록 */}
      <div className="grid grid-cols-2 gap-2 mb-8">
        {IMPLEMENTORS.map((impl) => (
          <div key={impl.name} className="rounded-lg border border-border p-3">
            <p className="font-semibold text-sm" style={{ color: impl.color }}>{impl.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{impl.desc}</p>
          </div>
        ))}
      </div>

      <div className="not-prose">
        <StateProviderViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
