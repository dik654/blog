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
        <div className="not-prose my-4 rounded-lg border border-border/60 bg-muted/30 p-4">
          <p className="text-xs font-semibold text-indigo-500 mb-3">sealed_block_with_senders() -- 4개 테이블에서 블록 조립</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold">1</span>
              <span className="text-foreground/70"><code>Headers</code> 테이블에서 헤더 로드 (HeadersStage 결과)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold">2</span>
              <span className="text-foreground/70"><code>BlockBodyIndices</code>에서 TX 범위 조회 &rarr; <code>{'{'} first_tx_num, tx_count {'}'}</code></span>
            </div>
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold">3</span>
              <span className="text-foreground/70"><code>Transactions</code> 테이블에서 TX 목록 순차 스캔 (BodiesStage 결과)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold">4</span>
              <span className="text-foreground/70"><code>TxSenders</code> 테이블에서 sender 주소 스캔 (SendersStage 결과)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">5</span>
              <span className="text-foreground/70">조립 완료 &rarr; <code>SealedBlockWithSenders {'{'} block, senders {'}'}</code></span>
            </div>
          </div>
          <p className="text-xs text-foreground/50 mt-3">4개 테이블이 같은 TxNumber 공간에서 정렬 &rarr; MDBX mmap 페이지 캐시에서 거의 무료로 순차 스캔</p>
        </div>
        <p className="leading-7">
          세 Stage가 <strong>같은 TxNumber 인덱스 공간</strong>을 공유하므로 조립이 단순 순차 스캔이다.<br />
          각 Stage는 독립적으로 DB 쓰기를 완료했고, ExecutionStage는 읽기 전용으로 조합만 한다.<br />
          이 분리 덕분에 각 Stage가 자신의 테이블 쓰기를 최적화할 수 있었고, 조합 비용은 mmap이 흡수한다.
        </p>

        {/* ── BundleState ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BundleState — 인메모리 상태 누적기</h3>
        <div className="not-prose my-4 space-y-3">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-semibold text-indigo-500 mb-2">BundleState 구조체</p>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1.5 py-0.5 rounded">state</code>
                <span className="text-foreground/70"><code>HashMap&lt;Address, BundleAccount&gt;</code> — 계정별 누적 변경 (pre/post 쌍)</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1.5 py-0.5 rounded">contracts</code>
                <span className="text-foreground/70"><code>HashMap&lt;B256, Bytecode&gt;</code> — code_hash &rarr; bytecode (CREATE2 중복 방지)</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1.5 py-0.5 rounded">receipts</code>
                <span className="text-foreground/70"><code>Vec&lt;Receipt&gt;</code> — 블록 실행 로그</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1.5 py-0.5 rounded">first_block</code>
                <span className="text-foreground/70"><code>u64</code> — unwind 시 되감기 기준점</span>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">BundleAccount</p>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1.5 py-0.5 rounded">original_info</code>
                <span className="text-foreground/70"><code>Option&lt;AccountInfo&gt;</code> — 실행 전 상태 (None = 새 계정)</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1.5 py-0.5 rounded">info</code>
                <span className="text-foreground/70"><code>Option&lt;AccountInfo&gt;</code> — 실행 후 상태</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1.5 py-0.5 rounded">storage</code>
                <span className="text-foreground/70"><code>HashMap&lt;U256, StorageSlot&gt;</code> — 슬롯 변경 (pre/post 값)</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1.5 py-0.5 rounded">status</code>
                <span className="text-foreground/70"><code>AccountStatus</code> — LoadedNotExisting / Loaded / Changed / Destroyed</span>
              </div>
            </div>
          </div>
        </div>
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
        <div className="not-prose my-4 rounded-lg border border-border/60 bg-muted/30 p-4">
          <p className="text-xs font-semibold text-indigo-500 mb-3">revm 배치 실행기 — executor.execute_and_verify_one()</p>
          <div className="space-y-2 text-sm text-foreground/70">
            <p><code>batch_executor(StateProviderLatest::new(provider))</code>로 실행기 생성 -- StateProviderLatest가 최신 DB 상태를 revm 초기 상태로 노출</p>
            <p className="font-semibold text-foreground/80">execute_and_verify_one() 내부 흐름:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>블록 환경 설정 (coinbase, timestamp, base_fee, gas_limit)</li>
              <li>각 TX 실행: intrinsic gas 차감 &rarr; EVM opcode 실행 &rarr; 가스 환불 계산 &rarr; coinbase에 가스비 지급</li>
              <li>블록 보상 (PoS 이후 0, withdrawals로 대체)</li>
              <li>영수증(Receipt) 생성</li>
              <li>상태 변경을 <code>BundleState</code>에 누적</li>
            </ol>
          </div>
          <div className="mt-3 pt-2 border-t border-border/30 text-xs text-foreground/50">
            <code>commit_threshold</code>마다 <code>executor.finalize().write_to_storage(provider)</code>로 중간 저장
          </div>
        </div>
        <p className="leading-7">
          revm은 <strong>Rust 네이티브 EVM</strong>이다. go-ethereum의 EVM을 Rust로 클린룸 재구현했다.<br />
          Geth EVM 대비 ~2배 빠른 것으로 알려져 있고, <code>no_std</code>를 지원해 WASM 환경에서도 동작.<br />
          ExecutionStage는 revm의 "접착제" 역할 — 블록을 만들어서 revm에 넣고, 결과를 BundleState에 저장한다.
        </p>

        {/* ── write_to_storage ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">write_to_storage() — DB 기록 내역</h3>
        <div className="not-prose my-4 rounded-lg border border-border/60 bg-muted/30 p-4">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-3">write_to_storage() — 6개 테이블 동시 기록</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="rounded border border-border/40 p-2.5">
              <p className="text-xs font-semibold text-foreground/60 mb-1">1. PlainAccountState</p>
              <p className="text-xs text-foreground/50"><code>Address &rarr; AccountInfo</code> (최신 계정 상태, selfdestruct 시 삭제)</p>
            </div>
            <div className="rounded border border-border/40 p-2.5">
              <p className="text-xs font-semibold text-foreground/60 mb-1">2. PlainStorageState</p>
              <p className="text-xs text-foreground/50"><code>(Address, U256) &rarr; U256</code> (스토리지 슬롯 값)</p>
            </div>
            <div className="rounded border border-border/40 p-2.5">
              <p className="text-xs font-semibold text-foreground/60 mb-1">3. AccountChangeSets</p>
              <p className="text-xs text-foreground/50"><code>BlockNumber &rarr; Vec&lt;(Address, 이전 상태)&gt;</code> (unwind용)</p>
            </div>
            <div className="rounded border border-border/40 p-2.5">
              <p className="text-xs font-semibold text-foreground/60 mb-1">4. StorageChangeSets</p>
              <p className="text-xs text-foreground/50"><code>(BlockNumber, Address) &rarr; Vec&lt;(U256, 이전 값)&gt;</code></p>
            </div>
            <div className="rounded border border-border/40 p-2.5">
              <p className="text-xs font-semibold text-foreground/60 mb-1">5. Bytecodes</p>
              <p className="text-xs text-foreground/50"><code>B256(code_hash) &rarr; Bytecode</code></p>
            </div>
            <div className="rounded border border-border/40 p-2.5">
              <p className="text-xs font-semibold text-foreground/60 mb-1">6. Receipts</p>
              <p className="text-xs text-foreground/50"><code>TxNumber &rarr; Receipt</code></p>
            </div>
          </div>
        </div>
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
