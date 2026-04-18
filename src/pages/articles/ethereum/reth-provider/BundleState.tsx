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
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
            <p className="font-semibold text-sm text-indigo-400 mb-3">BundleState 구조체</p>
            <div className="space-y-2 text-xs">
              <div><code className="text-indigo-300">state: HashMap&lt;Address, BundleAccount&gt;</code> <span className="text-foreground/60">— 변경된 계정들</span></div>
              <div><code className="text-indigo-300">contracts: HashMap&lt;B256, Bytecode&gt;</code> <span className="text-foreground/60">— 배포된 바이트코드 (code_hash 중복 제거)</span></div>
              <div><code className="text-indigo-300">reverts: Vec&lt;Vec&lt;(Address, AccountRevert)&gt;&gt;</code> <span className="text-foreground/60">— 블록별 롤백 정보</span></div>
              <div><code className="text-indigo-300">first_block: BlockNumber</code> <span className="text-foreground/60">— reverts 인덱싱 기준</span></div>
            </div>
          </div>
          <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-4">
            <p className="font-semibold text-sm text-sky-400 mb-3">BundleAccount 구조체</p>
            <div className="space-y-2 text-xs">
              <div><code className="text-sky-300">original_info: Option&lt;AccountInfo&gt;</code> <span className="text-foreground/60">— 실행 전 상태</span></div>
              <div><code className="text-sky-300">info: Option&lt;AccountInfo&gt;</code> <span className="text-foreground/60">— 실행 후 상태</span></div>
              <div><code className="text-sky-300">storage: HashMap&lt;U256, StorageSlot&gt;</code> <span className="text-foreground/60">— 변경된 슬롯 (pre/post)</span></div>
              <div><code className="text-sky-300">status: AccountStatus</code> <span className="text-foreground/60">— Loaded, Changed, Destroyed 등</span></div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {['revm 실행 결과 누적', '후속 TX 읽기 캐시', 'DB 쓰기 버퍼링', 'reorg 롤백 보관'].map((role, i) => (
              <div key={i} className="rounded-lg border border-border p-2 text-center">
                <span className="text-xs font-bold text-muted-foreground">{i+1}.</span>
                <p className="text-xs text-foreground/70">{role}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="leading-7">
          <code>BundleState</code>는 <strong>4가지 역할</strong>을 하나의 구조체로 통합.<br />
          실행 중 누적, 캐시, 쓰기 버퍼, 롤백 저장 — 모두 같은 HashMap을 공유.<br />
          역할별 분리 구조 대신 하나로 묶어 메모리 지역성 극대화.
        </p>

        {/* ── revm → BundleState 변환 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">revm EvmState → BundleState 병합</h3>
        <div className="my-4 not-prose">
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-3"><code>apply_transitions_and_create_reverts(evm_state, block_number)</code></p>
            <div className="space-y-3">
              {[
                { step: '1', title: '이전 상태 저장', detail: 'reverts용 — state.get(addr).info.clone()', color: 'text-sky-400' },
                { step: '2', title: 'BundleAccount 업데이트', detail: 'entry(address).or_insert_with() — 없으면 생성', color: 'text-emerald-400' },
                { step: '3', title: 'storage 변경 반영', detail: 'revm_account.storage → bundle_acc.storage에 insert (pre/post)', color: 'text-amber-400' },
                { step: '4', title: 'account info 갱신', detail: 'bundle_acc.info = Some(revm_account.info)', color: 'text-violet-400' },
                { step: '5', title: 'revert 정보 기록', detail: 'AccountRevert에 이전 상태/스토리지/status 저장', color: 'text-indigo-400' },
              ].map(s => (
                <div key={s.step} className="flex items-start gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-muted shrink-0 ${s.color}`}>{s.step}</span>
                  <div>
                    <p className="text-sm font-semibold">{s.title}</p>
                    <p className="text-xs text-foreground/60">{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3 pt-2 border-t border-border">블록 단위로 <code>reverts</code>에 push → reorg 시 블록별 역적용</p>
          </div>
        </div>
        <p className="leading-7">
          매 TX 실행 후 revm이 <code>EvmState</code>를 반환 → BundleState에 병합.<br />
          동일 계정의 다중 변경은 HashMap entry로 누적 — 마지막 값이 유지.<br />
          pre-state는 <code>reverts</code>에 별도 저장 → reorg 시 역적용 가능.
        </p>

        {/* ── into_plain_state ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">into_plain_state — DB 쓰기 준비</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-border p-4">
            <p className="font-semibold text-sm mb-3"><code>into_plain_state()</code> — DB 쓰기 준비</p>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-muted text-sky-400 shrink-0">1</span>
                <div>
                  <p className="text-sm font-semibold">HashMap → 정렬된 Vec</p>
                  <p className="text-xs text-foreground/60">accounts를 address 기준 정렬</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-muted text-emerald-400 shrink-0">2</span>
                <div>
                  <p className="text-sm font-semibold">storage도 이중 정렬</p>
                  <p className="text-xs text-foreground/60">address 정렬 + slot_key 정렬</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <p className="text-xs font-semibold text-emerald-400 mb-1">정렬된 삽입</p>
              <div className="space-y-0.5 text-xs text-foreground/60">
                <p><code>append()</code> 최적화 (리프 끝 추가)</p>
                <p>page split 최소, bulk loading 최적</p>
              </div>
            </div>
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
              <p className="text-xs font-semibold text-red-400 mb-1">랜덤 삽입</p>
              <div className="space-y-0.5 text-xs text-foreground/60">
                <p>매 삽입마다 B+tree 전체 재탐색</p>
                <p>page split 빈번 → 최대 수십 배 느림</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border p-3 text-center">
            <p className="text-xs text-foreground/70">HashMap iteration은 비결정적 순서 → <strong>DB 쓰기 전 반드시 정렬</strong></p>
          </div>
        </div>
        <p className="leading-7">
          <code>into_plain_state</code>가 <strong>DB 친화적 형식으로 변환</strong>.<br />
          HashMap의 비결정적 순서 → 정렬된 Vec으로 변환하여 B+tree 삽입 최적화.<br />
          이 정렬 단계 하나로 DB 쓰기 속도 수십 배 차이.
        </p>

        {/* ── 메모리 크기 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BundleState 메모리 사용량</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">블록당 평균 변경</p>
              <p className="text-xs text-foreground/70">계정: ~1,500개 / 스토리지 슬롯: ~3,000개</p>
              <p className="text-xs font-semibold text-muted-foreground mt-3 mb-1">10K 블록 누적 후 (중복 제거)</p>
              <p className="text-xs text-foreground/70">고유 계정: ~500K (중복률 ~97%)</p>
              <p className="text-xs text-foreground/70">고유 스토리지: ~2M 슬롯</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">메모리 분포</p>
              <div className="space-y-1 text-xs text-foreground/70">
                <div className="flex justify-between"><span>state HashMap (500K x 300B)</span><span>~150 MB</span></div>
                <div className="flex justify-between"><span>storage (2M x 80B)</span><span>~160 MB</span></div>
                <div className="flex justify-between"><span>contracts</span><span>수 MB</span></div>
                <div className="flex justify-between"><span>reverts (10K x 수천)</span><span>~100 MB</span></div>
                <div className="flex justify-between border-t border-border pt-1 font-semibold"><span>합계</span><span>~400 MB</span></div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">commit_threshold 조정</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="rounded bg-muted/50 p-2 text-center">
                <p className="font-semibold">5K 블록</p>
                <p className="text-foreground/60">~200 MB</p>
                <p className="text-muted-foreground">low-RAM safe</p>
              </div>
              <div className="rounded bg-indigo-500/10 p-2 text-center border border-indigo-500/20">
                <p className="font-semibold text-indigo-400">10K (기본)</p>
                <p className="text-foreground/60">~400 MB</p>
                <p className="text-muted-foreground">default</p>
              </div>
              <div className="rounded bg-muted/50 p-2 text-center">
                <p className="font-semibold">20K 블록</p>
                <p className="text-foreground/60">~800 MB</p>
                <p className="text-muted-foreground">high-RAM fast</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">블록 범위와 메모리 사용량은 대체로 선형 관계</p>
          </div>
        </div>
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
