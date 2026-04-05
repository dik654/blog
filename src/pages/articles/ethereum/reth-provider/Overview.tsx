import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import ProviderLayerViz from './viz/ProviderLayerViz';
import type { CodeRef } from '@/components/code/types';
import { PROVIDER_LAYERS, GETH_PROBLEMS } from './OverviewData';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeLayer, setActiveLayer] = useState(0);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Provider 계층 구조</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          블록체인 노드의 모든 모듈은 상태에 접근한다.<br />
          EVM이 트랜잭션을 실행할 때, RPC가 잔액을 응답할 때, 동기화 엔진이 블록을 검증할 때 — 전부 상태 조회가 필요하다.
        </p>
        <p className="leading-7">
          문제는 상태가 존재하는 위치가 다양하다는 점이다.<br />
          실행 중인 블록의 상태는 메모리에, 확정된 상태는 디스크 DB에, 수백만 블록 전의 데이터는 아카이브 파일에 있다.
        </p>
        <p className="leading-7">
          <strong>Provider 추상화가 없으면?</strong>{' '}
          Geth의 <code>statedb</code>처럼 DB 구현체에 직접 결합된다.<br />
          실행 엔진이 LevelDB의 Get/Put을 직접 호출하므로, 저장소 교체나 Mock 테스트가 어렵다.
        </p>
        <p className="leading-7">
          Reth는 <code>StateProvider</code> trait으로 이 문제를 해결한다.<br />
          3개 메서드(<code>account</code>, <code>storage</code>, <code>bytecode_by_hash</code>)만 구현하면 어떤 저장소든 상태 소스로 사용할 수 있다.
        </p>

        {/* ── StateProvider trait ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">StateProvider trait — 3개 메서드 추상화</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub trait StateProvider: Send + Sync {
    /// 계정 정보 조회 (nonce, balance, code_hash)
    /// None이면 계정이 존재하지 않음
    fn account(&self, address: &Address) -> Result<Option<Account>>;

    /// 스토리지 슬롯 값 조회
    /// (address, key) 쌍으로 특정 슬롯의 현재 값 반환
    fn storage(&self, address: &Address, key: &StorageKey)
        -> Result<Option<StorageValue>>;

    /// 바이트코드 해시로 컨트랙트 코드 조회
    /// code_hash → Bytecode 매핑
    fn bytecode_by_hash(&self, hash: &B256) -> Result<Option<Bytecode>>;
}

// 구현체:
// - LatestStateProviderRef: MDBX 최신 상태
// - HistoricalStateProvider: 과거 특정 블록 상태
// - BundleStateProvider: 인메모리 BundleState
// - MockStateProvider: 테스트용

// 사용처:
// - revm의 Database trait (EVM 실행)
// - RPC eth_getBalance, eth_call, eth_getCode
// - txpool 검증 (nonce, balance 확인)
// - MerkleStage (계정 상태 로드)

// 모든 클라이언트는 동일 API 사용
// → Mock 테스트 자유로움
// → 저장소 교체 가능 (예: remote RPC를 state source로)`}
        </pre>
        <p className="leading-7">
          <code>StateProvider</code> trait이 <strong>상태 접근의 유일한 인터페이스</strong>.<br />
          revm, RPC, txpool 등 모든 상위 모듈이 이 3개 메서드만 사용.<br />
          저장소 구현은 완전히 캡슐화 → EVM 실행 로직과 DB 엔진 분리.
        </p>

        {/* ── 3계층 위임 흐름 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">조회 위임 — BundleState → MDBX → StaticFiles</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BundleStateProvider의 account() 구현
impl StateProvider for BundleStateProvider<'_> {
    fn account(&self, addr: &Address) -> Result<Option<Account>> {
        // 1. BundleState (메모리) 우선 확인
        if let Some(bundle_acc) = self.bundle.state.get(addr) {
            match bundle_acc.info {
                Some(ref info) => return Ok(Some(info.clone())),
                None => return Ok(None),  // selfdestruct된 계정
            }
        }

        // 2. MDBX (디스크) fallback
        if let Some(account) = self.db_provider.account(addr)? {
            return Ok(Some(account));
        }

        // 3. StaticFiles (고대 데이터) — 계정 상태는 아카이브 안 됨
        //    (계정 최신 상태는 항상 MDBX에)
        Ok(None)
    }
}

// 조회 순서 이유:
// - BundleState: 현재 배치의 변경 (hot, ~수 MB)
// - MDBX: 최신 확정 상태 (warm, ~100 GB)
// - StaticFiles: 과거 블록 데이터 (cold, ~300 GB)
//
// Hot → Warm → Cold 순서 → 캐시 효율 극대화

// 블록 실행 중 typical access pattern:
// 1. 99% 히트: BundleState (같은 배치 내 반복 읽기)
// 2. 0.99%: MDBX (최초 접근)
// 3. 0.01%: StaticFiles (historical query)`}
        </pre>
        <p className="leading-7">
          <strong>3계층 폴백 구조</strong> — hot/warm/cold 순서로 접근.<br />
          반복 읽기는 BundleState 캐시 히트 → 디스크 I/O 최소화.<br />
          각 계층의 구현이 <code>StateProvider</code> trait 뒤에 숨겨져 있어 상위 코드 단순화.
        </p>

        {/* ── latest vs historical ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Latest vs Historical — 2가지 상태 관점</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// LatestStateProviderRef: 현재 상태 (최신 블록)
pub struct LatestStateProviderRef<'a, TX> {
    tx: &'a TX,
    static_file: StaticFileProviderRef<'a>,
}

impl<TX: DbTx> StateProvider for LatestStateProviderRef<'_, TX> {
    fn account(&self, addr: &Address) -> Result<Option<Account>> {
        // PlainAccountState 테이블 직접 조회
        self.tx.get::<tables::PlainAccountState>(*addr)
    }
}

// HistoricalStateProviderRef: 특정 블록 시점 상태
pub struct HistoricalStateProviderRef<'a, TX> {
    tx: &'a TX,
    block_number: BlockNumber,  // 이 블록 기준 상태
    static_file: StaticFileProviderRef<'a>,
}

impl<TX: DbTx> StateProvider for HistoricalStateProviderRef<'_, TX> {
    fn account(&self, addr: &Address) -> Result<Option<Account>> {
        // 1. 현재 상태 로드
        let current = self.tx.get::<PlainAccountState>(*addr)?;

        // 2. AccountChangeSets에서 block_number 이후 변경 역적용
        let changes = self.tx.cursor_read::<AccountChangeSets>()?
            .walk_range(self.block_number..)?;

        // 3. 변경을 역순 적용하여 block_number 시점 상태 복원
        let mut account = current;
        for (_, revert) in changes.into_iter().rev() {
            if revert.address == *addr {
                account = revert.previous_info;
            }
        }
        Ok(account)
    }
}

// 사용:
// - Latest: eth_getBalance(addr) — 현재 잔고
// - Historical: eth_getBalance(addr, block=12345) — 과거 잔고`}
        </pre>
        <p className="leading-7">
          Latest와 Historical이 <strong>같은 trait의 다른 구현</strong>.<br />
          상위 코드는 구현 교체만으로 "현재" 또는 "과거" 쿼리 자유롭게 전환.<br />
          RPC의 <code>eth_call</code>이 block parameter에 따라 provider 선택 — 코드 중복 없음.
        </p>
      </div>

      {/* Geth 문제점 카드 */}
      <h3 className="text-lg font-semibold mb-3">Geth statedb의 한계</h3>
      <div className="grid gap-2 mb-8">
        {GETH_PROBLEMS.map((p, i) => (
          <div key={i} className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <p className="font-semibold text-sm text-red-400">{p.title}</p>
            <p className="text-sm text-foreground/70 mt-1">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Provider 계층 인터랙티브 카드 */}
      <h3 className="text-lg font-semibold mb-3">Reth Provider 3계층</h3>
      <div className="space-y-2 mb-8">
        {PROVIDER_LAYERS.map((l, i) => (
          <motion.div key={i} onClick={() => setActiveLayer(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === activeLayer ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === activeLayer ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold`}
                style={{ backgroundColor: i === activeLayer ? l.color : 'var(--muted)', color: i === activeLayer ? '#fff' : 'var(--muted-foreground)' }}>
                {i + 1}
              </span>
              <span className="font-semibold text-sm">{l.title}</span>
            </div>
            <AnimatePresence>
              {i === activeLayer && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-10">{l.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          조회 순서는 위에서 아래로 폴백(fallback)한다.<br />
          BundleState에 캐시가 있으면 디스크를 읽지 않는다.<br />
          MDBX에도 없으면 StaticFiles까지 내려간다.<br />
          이 계층 구조 덕분에 hot path(최근 블록 조회)는 메모리에서 즉시 응답한다.
        </p>
      </div>

      <div className="not-prose mt-6"><ProviderLayerViz /></div>
    </section>
  );
}
