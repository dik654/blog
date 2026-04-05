import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import OrderingDetailViz from './viz/OrderingDetailViz';
import { ORDERING_IMPLS, ORDERING_COMPARISON } from './OrderingData';
import type { CodeRef } from '@/components/code/types';

export default function Ordering({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [expanded, setExpanded] = useState<string | null>('CoinbaseTipOrdering (기본)');

  return (
    <section id="ordering" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TransactionOrdering & 우선순위</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          TX 풀에서 어떤 TX를 먼저 블록에 포함할지 결정하는 것이 <code>TransactionOrdering</code> trait이다.<br />
          <code>priority()</code> 메서드가 각 TX에 대해 정렬 키(<code>PriorityValue</code>)를 반환한다.<br />
          높은 값이 높은 우선순위다.
        </p>
        <p className="leading-7">
          기본 구현인 <code>CoinbaseTipOrdering</code>은 <code>effective_tip_per_gas(base_fee)</code>를 호출하여 팁이 높은 TX를 우선한다.<br />
          이 값이 검증자의 블록 수익을 직접 결정하므로 합리적인 기본값이다.
        </p>
        <p className="leading-7">
          <strong>MEV 빌더 통합:</strong> trait 설계 덕분에 Flashbots의 rbuilder 같은 MEV 빌더가 자체 정렬 로직을 주입할 수 있다.<br />
          번들 수익/가스 비율, 특정 주소 우선 정렬 등 다양한 전략이 가능하다.<br />
          Geth는 core/txpool에 하드코딩되어 있어 포크(mev-geth)가 필요하다.
        </p>

        {/* ── trait 정의 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">TransactionOrdering trait</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub trait TransactionOrdering: Send + Sync + 'static {
    /// priority 값의 타입 (정렬 키)
    type PriorityValue: Ord + Clone + Send + Sync;

    /// TX에 대한 priority 계산
    fn priority(
        &self,
        tx: &Self::Transaction,
        base_fee: u64,
    ) -> Priority<Self::PriorityValue>;
}

pub enum Priority<T> {
    Value(T),  // 정렬 가능한 priority 값
    None,      // 현재 블록에 포함 불가 (base_fee 부족 등)
}

// 기본 구현: CoinbaseTipOrdering
pub struct CoinbaseTipOrdering<T>(PhantomData<T>);

impl<T: PoolTransaction> TransactionOrdering for CoinbaseTipOrdering<T> {
    type Transaction = T;
    type PriorityValue = u128;  // effective_tip

    fn priority(&self, tx: &T, base_fee: u64) -> Priority<u128> {
        match tx.effective_tip_per_gas(Some(base_fee)) {
            Some(tip) => Priority::Value(tip),
            None => Priority::None,  // fee 부족
        }
    }
}

// 사용처: PoolInner가 priority 기반 정렬 BTreeSet 유지
// - BTreeSet<(PriorityValue, TxHash)> 자동 정렬
// - best_transactions()가 역순 iterate (high → low)`}
        </pre>
        <p className="leading-7">
          <code>TransactionOrdering</code> trait이 <strong>정렬 기준 추상화</strong>.<br />
          <code>type PriorityValue</code> 연관 타입으로 정렬 키 타입 유연하게 정의.<br />
          <code>Priority::None</code>은 "이 TX는 현재 블록에 포함 불가" 표시.
        </p>

        {/* ── best_transactions iterator ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">best_transactions() — priority 내림차순 iterator</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// PayloadBuilder가 블록 생성 시 호출
pub fn best_transactions(
    &self,
) -> Box<dyn Iterator<Item = Arc<Self::Transaction>>> {
    // 1. Pending 서브풀의 정렬된 BTreeSet 순회
    let sorted = self.pending_subpool.sorted_transactions();

    // 2. 각 TX의 nonce가 순차적인지 확인
    let mut sender_nonce_tracker: HashMap<Address, u64> = HashMap::new();

    // 3. priority 순서로 iterator 반환
    let iter = sorted.into_iter().filter(move |tx| {
        let sender = tx.sender();
        let current_next = sender_nonce_tracker
            .entry(sender)
            .or_insert_with(|| self.account_nonce(&sender));

        // 같은 sender의 TX는 nonce 순서대로만 반환
        if tx.nonce() == *current_next {
            *current_next += 1;
            true
        } else {
            false  // 이 TX는 다음 라운드에
        }
    });

    Box::new(iter)
}

// PayloadBuilder 사용 예:
let mut txs_to_include = Vec::new();
let mut gas_used = 0;
let gas_limit = 30_000_000;

for tx in pool.best_transactions() {
    if gas_used + tx.gas_limit() > gas_limit { break; }

    txs_to_include.push(tx.clone());
    gas_used += tx.gas_limit();
}

// 최종: 블록에 포함될 TX 목록 (priority 순서)`}
        </pre>
        <p className="leading-7">
          <code>best_transactions()</code>는 <strong>priority 순 + nonce 순</strong> 이중 정렬.<br />
          priority 높은 TX부터 반환하되, 같은 sender는 nonce 연속성 유지.<br />
          PayloadBuilder가 gas_limit 채울 때까지 이 iterator 순회.
        </p>

        {/* ── MEV 정렬 예시 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">MEV Bundle Ordering — 커스텀 구현</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// MEV 번들 우선 정렬 구현 예시
pub struct BundleAwareOrdering {
    bundle_scores: Arc<DashMap<TxHash, u128>>,  // 번들 수익
}

impl TransactionOrdering for BundleAwareOrdering {
    type PriorityValue = BundlePriority;

    fn priority(&self, tx: &Tx, base_fee: u64) -> Priority<BundlePriority> {
        // 1. 번들 일원인지 확인
        if let Some(bundle_score) = self.bundle_scores.get(&tx.hash()) {
            return Priority::Value(BundlePriority::Bundle(*bundle_score));
        }

        // 2. 일반 TX는 effective_tip 사용
        match tx.effective_tip_per_gas(Some(base_fee)) {
            Some(tip) => Priority::Value(BundlePriority::Normal(tip)),
            None => Priority::None,
        }
    }
}

#[derive(Clone, PartialOrd, Ord)]
pub enum BundlePriority {
    Normal(u128),       // 일반 TX
    Bundle(u128),       // MEV 번들 (항상 우선)
}

// BundlePriority의 Ord 구현:
// - Bundle > Normal (번들이 항상 우선)
// - 같은 카테고리 내에서는 값 비교

// Flashbots 빌더 통합:
// 1. eth_sendBundle로 번들 수신
// 2. 번들 수익 계산 → bundle_scores에 저장
// 3. best_transactions() 호출 시 번들 TX가 먼저 반환
// 4. 블록에 번들 포함 + 일반 TX는 이후`}
        </pre>
        <p className="leading-7">
          <strong>MEV 빌더는 trait 교체만으로 통합</strong>.<br />
          번들을 우선 정렬하는 커스텀 ordering 삽입 → 나머지 파이프라인 코드 수정 없음.<br />
          Reth가 rbuilder 등 외부 빌더 프레임워크의 <strong>기반 라이브러리</strong>로 활용되는 이유.
        </p>
      </div>

      <div className="not-prose mb-6"><OrderingDetailViz /></div>

      {/* 구현체별 아코디언 */}
      <h3 className="text-lg font-semibold mb-3">정렬 구현체</h3>
      <div className="not-prose space-y-2 mb-6">
        {ORDERING_IMPLS.map(o => {
          const isOpen = expanded === o.name;
          return (
            <div key={o.name} className="rounded-lg border border-border/60 overflow-hidden">
              <button onClick={() => setExpanded(isOpen ? null : o.name)}
                className="w-full text-left px-5 py-3 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-semibold text-sm" style={{ color: o.color }}>{o.name}</p>
                  <p className="text-xs font-mono text-foreground/60 mt-0.5">{o.key}</p>
                </div>
                <span className="text-foreground/40 text-lg transition-transform duration-200"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>&#9660;</span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="px-5 pb-4 border-t border-border/40 pt-3">
                      <p className="text-sm text-foreground/80 leading-relaxed">{o.detail}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Geth vs Reth 비교 */}
      <h3 className="text-lg font-semibold mb-3">Geth vs Reth 비교</h3>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border border-border rounded-lg">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left p-3 font-semibold">항목</th>
              <th className="text-left p-3 font-semibold">Geth</th>
              <th className="text-left p-3 font-semibold">Reth</th>
            </tr>
          </thead>
          <tbody>
            {ORDERING_COMPARISON.map((r, i) => (
              <tr key={i} className="border-t border-border">
                <td className="p-3">{r.aspect}</td>
                <td className="p-3 text-red-400">{r.geth}</td>
                <td className="p-3 text-emerald-400">{r.reth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('tx-ordering', codeRefs['tx-ordering'])} />
        <span className="text-[10px] text-muted-foreground self-center">CoinbaseTipOrdering</span>
      </div>
    </section>
  );
}
