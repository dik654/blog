// reth/crates/storage/db/src/tables/mod.rs + historical.rs
// ChangeSet 테이블 정의 및 HistoricalStateProviderRef 역추적 로직

use reth_db::{table, DatabaseRef};
use reth_primitives::{Account, Address, BlockNumber, B256, StorageKey, StorageValue};

/// AccountChangeSets — 블록별 계정 상태 변경의 "이전 값" 저장.
/// Key: (BlockNumber, Address), Value: 변경 전 Account.
/// 역방향 적용 시 이 값으로 현재 상태를 되돌린다.
table!(
    /// 블록별 계정 변경 이력 — pruning 설정에 따라 보존 범위 결정
    (AccountChangeSets) BlockNumberAddress => AccountBeforeTx
);

/// StorageChangeSets — 블록별 스토리지 슬롯 변경의 "이전 값" 저장.
/// Key: (BlockNumber, Address, StorageKey), Value: 변경 전 StorageValue.
table!(
    /// 블록별 스토리지 변경 이력
    (StorageChangeSets) BlockNumberAddressStorageKey => StorageValue
);

/// HistoricalStateProviderRef — 과거 블록 시점의 상태를 제공.
/// 현재 상태(MDBX)에서 ChangeSet을 역방향 적용하여 복원한다.
/// archive 모드 없이 과거 상태 접근 가능 (디스크 절약).
pub struct HistoricalStateProviderRef<'a, TX> {
    tx: &'a TX,
    /// 복원 대상 블록 번호
    block_number: BlockNumber,
    /// 최신 상태 제공자 (역추적의 시작점)
    latest: LatestStateProviderRef<'a, TX>,
}

impl<TX: DbTx> StateProvider for HistoricalStateProviderRef<'_, TX> {
    fn account(&self, address: &Address) -> Result<Option<Account>> {
        // 1) 현재 상태에서 최신 값 조회
        let mut account = self.latest.account(address)?;

        // 2) AccountChangeSets에서 (block_number..latest] 범위를 역순 조회
        //    cursor.walk_range()로 B+tree 범위 스캔
        let mut cursor = self.tx.cursor_read::<tables::AccountChangeSets>()?;
        let range = (self.block_number + 1)..=self.tx.tip_number()?;

        // 3) 각 ChangeSet의 old_value로 되돌리기 (최신→과거 순서)
        for entry in cursor.walk_range(range)?.rev() {
            let (_, change) = entry?;
            if change.address == *address {
                account = change.old_value; // 변경 전 값으로 교체
            }
        }
        Ok(account)
    }

    fn storage(&self, addr: &Address, key: &StorageKey)
        -> Result<Option<StorageValue>>
    {
        // StorageChangeSets도 동일한 역추적 패턴
        let mut value = self.latest.storage(addr, key)?;
        let mut cursor = self.tx.cursor_read::<tables::StorageChangeSets>()?;
        for entry in cursor.walk_range(
            (self.block_number + 1)..=self.tx.tip_number()?
        )?.rev() {
            let (_, change) = entry?;
            if change.address == *addr && change.key == *key {
                value = change.old_value;
            }
        }
        Ok(value)
    }
}
