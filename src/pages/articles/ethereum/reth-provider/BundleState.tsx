import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BundleStateViz from './viz/BundleStateViz';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { BUNDLE_FIELDS, BUNDLE_ACCOUNT_FIELDS } from './BundleStateData';

export default function BundleState({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeField, setActiveField] = useState(0);

  return (
    <section id="bundle-state" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BundleState & revm 캐시</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          revm이 블록을 실행하면 계정 잔액 변경, 스토리지 업데이트, 컨트랙트 배포 등의 상태 변경이 발생한다.<br />
          이 변경사항은 즉시 DB에 기록되지 않는다.<br />
          <code>BundleState</code>라는 메모리 캐시에 모아두었다가, ExecutionStage가 배치 단위로 DB에 커밋한다.
        </p>
        <p className="leading-7">
          <strong>왜 즉시 커밋하지 않는가?</strong>{' '}
          블록 하나에 수백 개의 트랜잭션이 있고, 각 트랜잭션이 여러 계정을 변경한다.<br />
          매 변경마다 디스크에 쓰면 I/O 병목이 발생한다.<br />
          메모리에 모아두면 후속 트랜잭션이 같은 계정을 읽을 때 디스크 없이 캐시에서 응답할 수 있다.
        </p>

        {/* ── BundleState 전체 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BundleState 전체 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub struct BundleState {
    /// 변경된 계정들: Address → BundleAccount
    pub state: HashMap<Address, BundleAccount>,

    /// 새로 배포된 컨트랙트 바이트코드
    /// code_hash로 중복 제거 (같은 코드 여러 번 배포 시)
    pub contracts: HashMap<B256, Bytecode>,

    /// 블록별 되돌리기 정보 (reorg 시 역순 적용)
    /// reverts[0] = 첫 블록 실행 전 상태
    /// reverts[N] = (first_block + N) 실행 전 상태
    pub reverts: Vec<Vec<(Address, AccountRevert)>>,

    /// 첫 번째 블록 번호 (reverts 인덱싱 기준)
    pub first_block: BlockNumber,
}

pub struct BundleAccount {
    /// 블록 실행 전 계정 상태
    pub original_info: Option<AccountInfo>,
    /// 블록 실행 후 계정 상태
    pub info: Option<AccountInfo>,
    /// 변경된 스토리지 슬롯: slot_key → (pre_value, post_value)
    pub storage: HashMap<U256, StorageSlot>,
    /// 계정 상태 태그 (Loaded, Changed, Destroyed 등)
    pub status: AccountStatus,
}

// BundleState의 역할:
// 1. revm 실행 결과 누적 (execute 후)
// 2. 같은 배치 내 후속 TX의 상태 조회 (읽기 캐시)
// 3. DB 쓰기 버퍼링 (commit_threshold까지 대기)
// 4. reorg 롤백 정보 보관 (reverts)`}
        </pre>
        <p className="leading-7">
          <code>BundleState</code>는 <strong>4가지 역할</strong>을 하나의 구조체로 통합.<br />
          실행 중 누적, 캐시, 쓰기 버퍼, 롤백 저장 — 모두 같은 HashMap을 공유.<br />
          역할별 분리 구조 대신 하나로 묶어 메모리 지역성 극대화.
        </p>

        {/* ── revm → BundleState 변환 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">revm EvmState → BundleState 병합</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// revm이 1개 TX 실행 후 반환하는 상태
// EvmState = HashMap<Address, Account> (revm 타입)

// BundleState에 병합 로직
impl BundleState {
    pub fn apply_transitions_and_create_reverts(
        &mut self,
        evm_state: EvmState,
        block_number: BlockNumber,
    ) {
        let mut block_reverts = Vec::new();

        for (address, revm_account) in evm_state {
            // 1. 이전 상태 저장 (reverts용)
            let previous = self.state.get(&address)
                .and_then(|a| a.info.clone());

            // 2. BundleAccount 업데이트
            let bundle_acc = self.state
                .entry(address)
                .or_insert_with(|| BundleAccount::new(address));

            // 3. storage 변경 반영
            for (slot_key, slot_value) in revm_account.storage {
                bundle_acc.storage.insert(slot_key, StorageSlot {
                    previous_or_original_value: slot_value.previous_value,
                    present_value: slot_value.present_value,
                });
            }

            // 4. account info 업데이트
            bundle_acc.info = Some(revm_account.info);

            // 5. revert 정보 기록
            block_reverts.push((address, AccountRevert {
                account: AccountInfoRevert::from(previous),
                storage: collect_storage_reverts(&revm_account.storage),
                previous_status: bundle_acc.status,
            }));
        }

        // 블록 단위로 reverts 추가
        self.reverts.push(block_reverts);
    }
}`}
        </pre>
        <p className="leading-7">
          매 TX 실행 후 revm이 <code>EvmState</code>를 반환 → BundleState에 병합.<br />
          동일 계정의 다중 변경은 HashMap entry로 누적 — 마지막 값이 유지.<br />
          pre-state는 <code>reverts</code>에 별도 저장 → reorg 시 역적용 가능.
        </p>

        {/* ── into_plain_state ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">into_plain_state — DB 쓰기 준비</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`impl BundleState {
    /// BundleState → 정렬된 Vec (DB 쓰기용)
    pub fn into_plain_state(self) -> PlainState {
        // 1. HashMap → 정렬된 Vec 변환
        let mut accounts: Vec<_> = self.state.into_iter().collect();
        accounts.sort_by_key(|(addr, _)| *addr);

        // 2. storage도 address 정렬 + slot_key 정렬
        let mut storages = Vec::new();
        for (addr, bundle_acc) in &accounts {
            let mut slots: Vec<_> = bundle_acc.storage.iter().collect();
            slots.sort_by_key(|(k, _)| *k);
            storages.push((*addr, slots));
        }

        PlainState { accounts, storages, contracts: self.contracts }
    }
}

// 왜 정렬이 중요한가?
//
// MDBX는 B+tree 기반 — 정렬된 순서로 삽입 시:
// - append() 최적화 가능 (B+tree 리프 끝에만 추가)
// - page split 최소 (순차 삽입)
// - bulk loading 최적 경로 활성화
//
// 랜덤 순서 삽입 시:
// - 매 삽입마다 B+tree 전체 재탐색
// - page split 빈번
// - 최대 수십 배 느림
//
// HashMap iteration은 비결정적 순서 → DB 쓰기 전 반드시 정렬`}
        </pre>
        <p className="leading-7">
          <code>into_plain_state</code>가 <strong>DB 친화적 형식으로 변환</strong>.<br />
          HashMap의 비결정적 순서 → 정렬된 Vec으로 변환하여 B+tree 삽입 최적화.<br />
          이 정렬 단계 하나로 DB 쓰기 속도 수십 배 차이.
        </p>

        {/* ── 메모리 크기 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BundleState 메모리 사용량</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BundleState 크기 추정 (메인넷 10K 블록 배치)
//
// 블록당 평균 변경:
// - 계정: ~1,500개
// - 스토리지 슬롯: ~3,000개
//
// 10K 블록 누적 후 (중복 제거 후):
// - 고유 계정: ~500K개 (중복률 ~97%)
// - 고유 스토리지: ~2M 슬롯
//
// 메모리 계산:
// BundleAccount:
//   - original_info: 112 bytes
//   - info: 112 bytes
//   - storage HashMap overhead + entries
//
// 대략 추정:
// - state HashMap: 500K × 300 bytes ≈ 150 MB
// - storage: 2M × 80 bytes ≈ 160 MB
// - contracts: 수 MB
// - reverts: 10K × 수천 entries ≈ 100 MB
// - 합계: ~400 MB per 10K 블록 배치
//
// commit_threshold 조정 시:
// - threshold=5K: ~200 MB (safer for low-RAM)
// - threshold=10K: ~400 MB (default)
// - threshold=20K: ~800 MB (faster for high-RAM)
//
// 블록 범위와 메모리 사용량은 대체로 선형 관계`}
        </pre>
        <p className="leading-7">
          BundleState가 <strong>commit_threshold 블록까지 메모리에 상주</strong>.<br />
          10K 블록 기본값에서 ~400MB 사용 — 현대 노드 하드웨어 관점 안전 범위.<br />
          threshold를 늘리면 DB 쓰기 감소(속도 ↑)하지만 메모리 사용 증가 (RAM 요구 ↑).
        </p>
      </div>

      {/* BundleState 핵심 필드 */}
      <h3 className="text-lg font-semibold mb-3">BundleState 핵심 3개 필드</h3>
      <div className="space-y-2 mb-8">
        {BUNDLE_FIELDS.map((f, i) => (
          <motion.div key={i} onClick={() => setActiveField(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === activeField ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === activeField ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: i === activeField ? f.color : 'var(--muted)', color: i === activeField ? '#fff' : 'var(--muted-foreground)' }}>
                {i + 1}
              </span>
              <code className="font-mono font-semibold text-sm" style={{ color: f.color }}>{f.name}</code>
            </div>
            <AnimatePresence>
              {i === activeField && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-xs text-muted-foreground mt-1 ml-10 font-mono">{f.type}</p>
                  <p className="text-sm text-foreground/70 mt-1 ml-10">{f.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* BundleAccount 필드 */}
      <h3 className="text-lg font-semibold mb-3">BundleAccount 내부</h3>
      <div className="grid grid-cols-2 gap-2 mb-8">
        {BUNDLE_ACCOUNT_FIELDS.map((f) => (
          <div key={f.name} className="rounded-lg border border-border p-3">
            <code className="text-sm font-mono font-semibold text-indigo-400">{f.name}</code>
            <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          DB 커밋 시 <code>from_revm()</code>이 revm 내부 타입을 Reth 타입으로 변환하고,
          <code>into_plain_state()</code>가 HashMap을 정렬된 Vec으로 바꾼다.
          <br />
          DB는 정렬된 키 순서로 기록해야 B+tree 삽입 성능이 최적화되기 때문이다.
        </p>
      </div>

      <div className="not-prose">
        <BundleStateViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
