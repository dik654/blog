import { useState } from 'react';
import { motion } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import StateChangesViz from './viz/StateChangesViz';
import { BUNDLE_FIELDS } from './StateChangesData';
import type { CodeRef } from '@/components/code/types';

export default function StateChanges({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeField, setActiveField] = useState(0);

  return (
    <section id="state-changes" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">상태 변경 & Bundle</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>BundleState</code>는 블록 실행 결과의 컨테이너다.<br />
          revm이 TX를 실행할 때마다 변경된 계정 잔액, 스토리지 슬롯, 배포된 컨트랙트 코드를 이 구조체에 누적한다.<br />
          DB에 즉시 쓰지 않고 인메모리 HashMap에 보관하는 것이 핵심이다.
        </p>
        <p className="leading-7">
          <strong>reverts 필드가 reorg를 지원한다.</strong> 각 블록의 "이전 상태"를 기록해 둔다.<br />
          예를 들어 계정 A의 잔액이 10 ETH에서 8 ETH로 변경되면, reverts에 "계정 A: 10 ETH"를 저장한다.<br />
          reorg 발생 시 reverts를 역순으로 적용하면 원래 상태로 복원된다.
        </p>
        <p className="leading-7">
          <code>write_to_storage()</code>가 최종적으로 DB에 기록한다.<br />
          AccountChangeSet, StorageChangeSet 테이블에 변경 이력을 남기고, 최신 상태를 PlainAccountState, PlainStorageState 테이블에 덮어쓴다.<br />
          MerkleStage가 이 변경분을 읽어 상태 루트를 계산한다.
        </p>

        {/* ── BundleAccount 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BundleAccount — 계정 상태 변경 단위</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub struct BundleAccount {
    /// 블록 실행 전 계정 상태 (None이면 새로 생성된 계정)
    pub original_info: Option<AccountInfo>,

    /// 블록 실행 후 계정 상태 (None이면 selfdestruct)
    pub info: Option<AccountInfo>,

    /// 변경된 스토리지 슬롯들
    pub storage: HashMap<U256, StorageSlot>,

    /// 계정 상태 태그
    pub status: AccountStatus,
}

pub enum AccountStatus {
    LoadedNotExisting,  // DB에 없는 계정 (존재하지 않음 상태)
    Loaded,             // DB에서 로드만, 변경 없음
    Changed,            // 잔고/nonce/storage 변경
    Destroyed,          // selfdestruct로 제거
    DestroyedChanged,   // 제거 후 같은 블록에서 다시 생성
    DestroyedAgain,     // 다시 제거
}

pub struct AccountInfo {
    pub balance: U256,
    pub nonce: u64,
    pub code_hash: B256,
    pub code: Option<Bytecode>,  // optional (캐싱)
}

pub struct StorageSlot {
    pub previous_or_original_value: U256,  // pre-state
    pub present_value: U256,               // post-state
}`}
        </pre>
        <p className="leading-7">
          각 <code>BundleAccount</code>가 <strong>pre/post state 쌍</strong> 유지.<br />
          <code>AccountStatus</code>는 생명주기 전체를 표현 — selfdestruct 후 재생성(CREATE2 같은 주소) 케이스까지 고려.<br />
          <code>StorageSlot</code>도 pre/post 값을 모두 보관 → SSTORE 가스 환불 계산에 사용.
        </p>

        {/* ── write_to_storage 내부 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">write_to_storage — DB 6개 테이블 기록</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`impl BundleState {
    pub fn write_to_storage<P: StateWriter>(
        self,
        provider: &P,
    ) -> Result<(), ProviderError> {
        // 1. PlainAccountState: 최신 계정 상태
        for (addr, bundle_acc) in &self.state {
            match &bundle_acc.info {
                Some(info) => provider.put_account(*addr, info)?,
                None => provider.delete_account(*addr)?,  // selfdestruct
            }
        }

        // 2. PlainStorageState: 최신 스토리지 (DupSort)
        for (addr, bundle_acc) in &self.state {
            for (slot_key, slot) in &bundle_acc.storage {
                if slot.present_value.is_zero() {
                    provider.delete_storage(*addr, *slot_key)?;
                } else {
                    provider.put_storage(*addr, *slot_key, slot.present_value)?;
                }
            }
        }

        // 3. AccountChangeSets: 블록별 pre-state (unwind용)
        for (block_num, block_reverts) in self.reverts.into_iter().enumerate() {
            for (addr, revert) in block_reverts {
                provider.put_account_history(block_num, addr, revert.info)?;
            }
        }

        // 4. StorageChangeSets: 스토리지 pre-state
        for (block_num, addr, slot_key, pre_value) in storage_history {
            provider.put_storage_history(block_num, addr, slot_key, pre_value)?;
        }

        // 5. Bytecodes: 새로 배포된 컨트랙트 코드
        for (code_hash, bytecode) in self.contracts {
            provider.put_bytecode(code_hash, bytecode)?;
        }

        // 6. Receipts: 영수증 (execute 시 생성된 것)
        provider.put_receipts(receipts)?;

        Ok(())
    }
}`}
        </pre>
        <p className="leading-7">
          <code>write_to_storage</code>는 6개 테이블에 <strong>원자적 쓰기</strong> (MDBX 트랜잭션 1회).<br />
          PlainAccountState/PlainStorageState = 현재 상태, ChangeSets = 과거 이력.<br />
          MerkleStage가 ChangeSets를 읽어 PrefixSet 계산 → 증분 state_root 계산.
        </p>

        {/* ── reverts 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">reverts — unwind를 위한 pre-state 보존</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BundleState의 reverts 필드
pub struct BundleState {
    pub state: HashMap<Address, BundleAccount>,    // 현재 누적 상태
    pub contracts: HashMap<B256, Bytecode>,
    pub reverts: Vec<Vec<(Address, AccountRevert)>>,  // 블록별 pre-state
    pub first_block: u64,
}

pub struct AccountRevert {
    pub account: AccountInfoRevert,    // 잔고/nonce/code_hash revert
    pub storage: HashMap<U256, RevertToSlot>,  // 스토리지 revert
    pub previous_status: AccountStatus,
}

// reverts 구조:
// reverts[0] = 블록 #18,000,000 실행 전 상태 변경 목록
// reverts[1] = 블록 #18,000,001 실행 전 상태 변경 목록
// ...

// unwind 시 사용 (reorg 발생):
fn unwind_to(&mut self, target: u64) {
    let blocks_to_unwind = self.tip - target;
    for _ in 0..blocks_to_unwind {
        let last_block_reverts = self.reverts.pop().unwrap();
        for (addr, revert) in last_block_reverts {
            // pre-state를 다시 적용
            let bundle_acc = self.state.get_mut(&addr).unwrap();
            bundle_acc.info = revert.account.original_info;
            for (slot_key, revert_slot) in revert.storage {
                bundle_acc.storage.insert(slot_key, revert_slot.into_slot());
            }
        }
    }
}

// 효과: reverts 역적용으로 target 블록까지 완벽 복원
// DB AccountChangeSets/StorageChangeSets 테이블이 같은 역할`}
        </pre>
        <p className="leading-7">
          reverts는 <strong>시간 순서대로 정렬된 pre-state 기록</strong>.<br />
          reorg 시 <code>reverts.pop()</code>을 반복 호출 — 최신 블록부터 역순으로 복원.<br />
          인메모리 bundle에서 롤백이 완료되면 <code>write_to_storage</code>로 DB에 반영.
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">💡 설계 인사이트: 왜 2-state를 유지하는가</p>
          <p className="mt-2">
            BundleState는 모든 계정에 대해 <strong>pre/post 2가지 상태</strong>를 보관:<br />
            - post state: 현재 누적된 변경 (최신)<br />
            - pre state: 블록 실행 전 원본 (reverts에)
          </p>
          <p className="mt-2">
            왜 둘 다 필요한가:<br />
            1. <strong>reorg 복원</strong> — reverts를 역적용해 이전 상태로 돌아감<br />
            2. <strong>SSTORE 가스 환불</strong> — EIP-2200 기반 refund 계산은 pre/post 비교<br />
            3. <strong>ChangeSets 저장</strong> — 과거 블록의 상태 쿼리 (eth_call at block)<br />
            4. <strong>MerkleStage 증분 계산</strong> — 변경된 경로만 재해시
          </p>
          <p className="mt-2">
            메모리 비용 vs 기능 이득:<br />
            - 2배 메모리 (~100MB per 10K 블록 배치)<br />
            - 얻는 것: reorg 안전성, 가스 정확성, 증분 Merkle, 히스토리 쿼리<br />
            - 블록체인 노드의 복잡한 요구사항을 한 구조체에 통합
          </p>
        </div>
      </div>

      <div className="not-prose mb-6"><StateChangesViz /></div>

      {/* BundleState field cards */}
      <h3 className="text-lg font-semibold mb-3">BundleState 구조</h3>
      <div className="not-prose space-y-2 mb-6">
        {BUNDLE_FIELDS.map((f, i) => (
          <motion.div key={i} onClick={() => setActiveField(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === activeField ? 'border-sky-500/50 bg-sky-500/5' : 'border-border'}`}
            animate={{ opacity: i === activeField ? 1 : 0.6 }}>
            <div className="flex items-baseline gap-3">
              <span className={`font-mono font-bold text-sm ${i === activeField ? 'text-sky-500' : 'text-foreground/70'}`}>{f.field}</span>
              <span className="text-xs text-foreground/40 font-mono">{f.type_str}</span>
            </div>
            {i === activeField && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-sm text-foreground/70 leading-relaxed mt-2">{f.desc}</motion.p>
            )}
          </motion.div>
        ))}
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('block-executor', codeRefs['block-executor'])} />
        <span className="text-[10px] text-muted-foreground self-center">BundleState 구조체</span>
      </div>
    </section>
  );
}
