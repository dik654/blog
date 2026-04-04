import type { CodeRef } from '@/components/code/types';

export const codeRefsStm: Record<string, CodeRef> = {
  'apt-blockstm-exec': {
    path: 'aptos-move/block-executor/src/executor.rs',
    code: `/// Block-STM 낙관적 병렬 실행
pub fn execute_block(
    &self, transactions: Vec<Transaction>,
) -> Result<Vec<TransactionOutput>> {
    let versioned_data = MVHashMap::new();
    loop {
        let (idx, inc) = self.scheduler.next_task()?;
        let result = execute_transaction(
            &transactions[idx], &versioned_data, inc,
        );
        if !validate_read_set(&result, &versioned_data) {
            self.scheduler.add_reexecution(idx);
        }
        if self.scheduler.all_done(transactions.len()) {
            break;
        }
    }
    Ok(collect_outputs(&versioned_data))
}`,
    lang: 'rust',
    highlight: [1, 19],
    desc: 'Block-STM 코어. MVHashMap으로 다중 버전 관리, 충돌 시 재실행.',
    annotations: [
      { lines: [5, 5], color: 'sky', note: 'MVHashMap: TX별 다중 버전' },
      { lines: [8, 10], color: 'emerald', note: '낙관적 실행' },
      { lines: [11, 13], color: 'amber', note: '충돌 → 재실행' },
    ],
  },
  'apt-mvhashmap': {
    path: 'aptos-move/mvhashmap/src/lib.rs',
    code: `/// Multi-Version 데이터 구조
pub struct MVHashMap<K, V> {
    data: DashMap<K, BTreeMap<TxnIndex, Entry<V>>>,
}
impl<K: Hash + Eq, V: Clone> MVHashMap<K, V> {
    pub fn read(&self, key: &K, txn_idx: TxnIndex)
        -> ReadResult<V>
    {
        let versions = self.data.get(key)?;
        versions.range(..txn_idx)
            .next_back()
            .map(|(_, e)| e.value.clone())
    }
}`,
    lang: 'rust',
    highlight: [1, 14],
    desc: 'MVHashMap: 키당 TX별 버전 관리. 낙관적 실행 핵심.',
    annotations: [
      { lines: [2, 3], color: 'sky', note: 'DashMap + BTreeMap 이중 구조' },
      { lines: [6, 12], color: 'emerald', note: '자신보다 낮은 인덱스의 최신 값' },
    ],
  },
};
