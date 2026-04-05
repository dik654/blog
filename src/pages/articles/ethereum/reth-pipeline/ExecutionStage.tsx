import { useState } from 'react';
import { motion } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import ExecutionDetailViz from './viz/ExecutionDetailViz';
import { EXEC_COMPARISONS } from './ExecutionStageData';
import type { CodeRef } from '@/components/code/types';

export default function ExecutionStage({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <section id="execution-stage" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ExecutionStage 추적</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          ExecutionStage는 앞선 세 Stage의 결과를 조합한다.<br />
          HeadersStage가 저장한 헤더, BodiesStage가 저장한 TX 목록, SendersStage가 복구한 sender 주소를 하나의 완성 블록(<code>SealedBlockWithSenders</code>)으로 구성한다.
        </p>

        {/* ── 블록 조립 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">블록 조립 — 세 Stage의 데이터 결합</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// provider.sealed_block_with_senders(block_number) 내부
pub fn sealed_block_with_senders(&self, n: BlockNumber) -> Result<SealedBlockWithSenders> {
    // 1. Headers 테이블에서 헤더 로드 (HeadersStage 결과)
    let header = self.header_by_number(n)?;

    // 2. BlockBodyIndices 테이블에서 TX 범위 조회 (BodiesStage 결과)
    let indices = self.block_body_indices(n)?;
    //    indices = { first_tx_num: 287_543_120, tx_count: 153 }

    // 3. Transactions 테이블에서 TX 목록 스캔 (BodiesStage 결과)
    let tx_range = indices.first_tx_num..(indices.first_tx_num + indices.tx_count);
    let transactions = self.transactions_by_tx_range(tx_range.clone())?;

    // 4. TxSenders 테이블에서 sender 주소 스캔 (SendersStage 결과)
    let senders = self.senders_by_tx_range(tx_range)?;

    // 5. 조립 완료 — SealedBlockWithSenders
    Ok(SealedBlockWithSenders {
        block: SealedBlock { header, body: BlockBody { transactions, .. } },
        senders,  // Vec<Address>, TX 개수만큼
    })
}

// 4개 테이블의 데이터가 같은 TxNumber 공간에서 정렬되어 있으므로
// MDBX는 mmap 페이지 캐시에서 거의 무료로 순차 스캔 처리`}
        </pre>
        <p className="leading-7">
          세 Stage가 <strong>같은 TxNumber 인덱스 공간</strong>을 공유하므로 조립이 단순 순차 스캔이다.<br />
          각 Stage는 독립적으로 DB 쓰기를 완료했고, ExecutionStage는 읽기 전용으로 조합만 한다.<br />
          이 분리 덕분에 각 Stage가 자신의 테이블 쓰기를 최적화할 수 있었고, 조합 비용은 mmap이 흡수한다.
        </p>

        {/* ── BundleState ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BundleState — 인메모리 상태 누적기</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub struct BundleState {
    /// 계정별 누적 변경 — (pre_state, post_state) 쌍
    /// pre: 블록 실행 전 계정 상태 (잔고/nonce/code_hash)
    /// post: 블록 실행 후 계정 상태
    pub state: HashMap<Address, BundleAccount>,

    /// 컨트랙트 바이트코드 (code_hash → bytecode)
    /// 같은 코드가 여러 번 배포되어도 1회만 저장 (CREATE2 팩토리 패턴 고려)
    pub contracts: HashMap<B256, Bytecode>,

    /// 블록 실행 로그 (receipts 생성용)
    pub receipts: Vec<Receipt>,

    /// 첫 번째 블록 번호 — unwind 시 되감기 기준점
    pub first_block: u64,
}

pub struct BundleAccount {
    /// 실행 전 계정 (없으면 새로 생성된 계정)
    pub original_info: Option<AccountInfo>,
    /// 실행 후 계정
    pub info: Option<AccountInfo>,
    /// 스토리지 슬롯 변경 (key → (pre_val, post_val))
    pub storage: HashMap<U256, StorageSlot>,
    /// 계정 상태: LoadedNotExisting / Loaded / Changed / Destroyed
    pub status: AccountStatus,
}`}
        </pre>
        <p className="leading-7">
          <code>BundleState</code>는 <strong>누적(cumulative) 모델</strong>이다.<br />
          블록 N을 실행할 때, 이전 블록들의 변경이 이미 메모리에 반영되어 있다.<br />
          계정 A가 블록 100에서 잔고 +10, 블록 200에서 +20을 받았다면, BundleState에는 최종적으로 +30만 기록된다.
        </p>
        <p className="leading-7">
          <strong>핵심 설계 판단: 배치 누적.</strong><br />
          Geth는 블록마다 <code>stateDB.Commit()</code>을 호출해 DB에 기록한다.<br />
          Reth는 <code>BundleState</code>(인메모리 해시맵)에 상태 변경을 누적하고, <code>commit_threshold</code>(기본 10,000블록)마다 한 번에 DB에 기록한다.<br />
          100,000블록 동기화 시 DB 쓰기 횟수가 약 100,000회에서 약 10회로 줄어든다.
        </p>

        {/* ── revm 통합 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">revm 배치 실행기 — executor.execute_and_verify_one()</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// revm BlockExecutor 생성
let mut executor = self.executor_provider
    .batch_executor(StateProviderLatest::new(provider));
//  ↑ StateProviderLatest: 최신 DB 상태를 revm이 "초기 상태"로 바라보게 하는 어댑터

// 블록 단위 실행
for block_number in start..=end {
    let block = provider.sealed_block_with_senders(block_number)?;

    // revm이 블록 내 TX를 순차 실행 → BundleState에 변경 누적
    executor.execute_and_verify_one((&block).into())?;
    //  ↑ 내부 흐름:
    //    1. 블록 환경 설정 (coinbase, timestamp, base_fee, gas_limit)
    //    2. 각 TX 실행:
    //       a. intrinsic gas 차감 (기본 21000 + calldata 비용)
    //       b. EVM 실행 (opcode 하나씩 fetch/decode/execute)
    //       c. 가스 환불 계산 (SSTORE 0 리셋 등)
    //       d. coinbase에 가스비 지급
    //    3. 블록 보상 (PoS 이후 0, withdrawals로 대체)
    //    4. 영수증(receipt) 생성
    //    5. 상태 변경을 BundleState에 누적

    // commit_threshold마다 중간 저장
    if block_number % self.commit_threshold == 0 {
        executor.finalize().write_to_storage(provider)?;
    }
}`}
        </pre>
        <p className="leading-7">
          revm은 <strong>Rust 네이티브 EVM</strong>이다. go-ethereum의 EVM을 Rust로 클린룸 재구현했다.<br />
          Geth EVM 대비 ~2배 빠른 것으로 알려져 있고, <code>no_std</code>를 지원해 WASM 환경에서도 동작.<br />
          ExecutionStage는 revm의 "접착제" 역할 — 블록을 만들어서 revm에 넣고, 결과를 BundleState에 저장한다.
        </p>

        {/* ── write_to_storage ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">write_to_storage() — DB 기록 내역</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BundleState::write_to_storage() 내부 (요약)
// 6개 테이블에 동시 기록

// 1. PlainAccountState: Address → AccountInfo (최신 계정 상태)
for (addr, bundle_acc) in self.state {
    if let Some(info) = &bundle_acc.info {
        db.put::<PlainAccountState>(addr, info)?;
    } else {
        db.delete::<PlainAccountState>(addr)?; // 자폭(selfdestruct)된 계정
    }
}

// 2. PlainStorageState: (Address, U256) → U256 (스토리지 슬롯)
for (addr, slots) in bundle_acc.storage {
    for (key, slot) in slots {
        db.put::<PlainStorageState>((addr, key), slot.present_value)?;
    }
}

// 3. AccountChangeSets: BlockNumber → Vec<(Address, 이전 상태)>
//    unwind 시 원상복구용 기록
db.put::<AccountChangeSets>(block_number, account_changes)?;

// 4. StorageChangeSets: (BlockNumber, Address) → Vec<(U256, 이전 값)>
db.put::<StorageChangeSets>((block_number, addr), storage_changes)?;

// 5. Bytecodes: B256(code_hash) → Bytecode
db.put::<Bytecodes>(code_hash, bytecode)?;

// 6. Receipts: TxNumber → Receipt
db.put::<Receipts>(tx_number, receipt)?;`}
        </pre>
        <p className="leading-7">
          <code>ChangeSets</code> 테이블이 Reth unwind의 핵심이다.<br />
          각 블록이 "변경 전 상태"를 기록해두므로, 블록 N까지 되감을 때 N+1~tip의 ChangeSets를 역적용하면 원상복구된다.<br />
          Geth처럼 별도의 상태 트라이 스냅샷을 유지하지 않아도 되는 이유.
        </p>
      </div>

      <div className="not-prose mb-6"><ExecutionDetailViz /></div>

      {/* Geth vs Reth comparison table */}
      <div className="not-prose mb-6">
        <button onClick={() => setShowDetail(!showDetail)}
          className="text-sm font-semibold text-amber-600 dark:text-amber-400 cursor-pointer hover:underline mb-3">
          {showDetail ? '비교표 접기' : 'Geth vs Reth 비교 보기'}
        </button>
        {showDetail && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-border/60 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30">
                  <th className="text-left px-4 py-2 font-medium">비교 항목</th>
                  <th className="text-left px-4 py-2 font-medium text-foreground/60">Geth</th>
                  <th className="text-left px-4 py-2 font-medium text-amber-600 dark:text-amber-400">Reth</th>
                </tr>
              </thead>
              <tbody>
                {EXEC_COMPARISONS.map((c, i) => (
                  <tr key={i} className="border-t border-border/30">
                    <td className="px-4 py-2 font-medium">{c.aspect}</td>
                    <td className="px-4 py-2 text-foreground/60">{c.geth}</td>
                    <td className="px-4 py-2 text-amber-600 dark:text-amber-400">{c.reth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('execution-stage', codeRefs['execution-stage'])} />
        <span className="text-[10px] text-muted-foreground self-center">ExecutionStage::execute()</span>
      </div>
    </section>
  );
}
