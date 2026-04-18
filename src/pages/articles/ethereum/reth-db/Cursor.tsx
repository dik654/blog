import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CursorDetailViz from './viz/CursorDetailViz';
import CursorWalkViz from './viz/CursorWalkViz';
import CodeViewButton from '@/components/code/CodeViewButton';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { CURSOR_OPS, BTREE_VS_LSM } from './CursorData';

const CELL = 'border border-border px-4 py-2';

export default function Cursor({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  const [step, setStep] = useState(0);

  return (
    <section id="cursor" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Cursor & 트랜잭션</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          MDBX의 데이터 접근은 커서(cursor) 기반이다.<br />
          커서는 B+tree의 특정 위치를 가리키는 포인터로, seek으로 이동하고 next로 순회한다.<br />
          SQL 데이터베이스의 커서와 개념이 같다.
        </p>
        <p className="leading-7">
          Reth는 커서를 두 가지 trait으로 추상화한다.<br />
          <code>DbCursorRO</code>(읽기 전용)와 <code>DbCursorRW</code>(읽기/쓰기).<br />
          읽기 전용 커서는 MVCC 스냅샷 위에서 동작하므로 다른 트랜잭션이 쓰기 중이어도 차단되지 않는다.{' '}
          <CodeViewButton onClick={() => open('db-cursor')} />
        </p>
        <p className="leading-7">
          <strong>왜 커서인가?</strong> 블록체인 노드의 워크로드는 두 가지다.<br />
          Stage(동기화 파이프라인)는 블록 범위를 순차 처리하므로 <code>walk_range</code>를 사용한다.<br />
          RPC는 특정 키를 조회하므로 <code>seek_exact</code>를 사용한다.<br />
          커서가 두 패턴을 모두 효율적으로 지원한다.
        </p>

        {/* ── DbCursorRO trait ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">DbCursorRO trait — 읽기 전용 커서</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4 not-prose">
          <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-4">
            <p className="font-semibold text-sm text-sky-400 mb-3">DbCursorRO&lt;T: Table&gt; — 읽기 전용</p>
            <div className="space-y-2 text-xs">
              <div><code className="text-sky-300">seek_exact(key)</code> <span className="text-foreground/60">— 정확한 key 이동, 없으면 None</span></div>
              <div><code className="text-sky-300">seek(key)</code> <span className="text-foreground/60">— key 이상 첫 항목 (lower_bound)</span></div>
              <div><code className="text-sky-300">next()</code> / <code className="text-sky-300">prev()</code> <span className="text-foreground/60">— 현재 위치 전후 이동</span></div>
              <div><code className="text-sky-300">first()</code> / <code className="text-sky-300">last()</code> <span className="text-foreground/60">— 첫/마지막 항목</span></div>
              <div><code className="text-sky-300">walk_range(range)</code> <span className="text-foreground/60">— 범위 순회 Iterator 반환</span></div>
            </div>
          </div>
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-3">DbCursorRW&lt;T&gt;: DbCursorRO&lt;T&gt; — 읽기/쓰기</p>
            <div className="space-y-2 text-xs">
              <div><code className="text-amber-300">upsert(key, value)</code> <span className="text-foreground/60">— 없으면 삽입, 있으면 갱신</span></div>
              <div><code className="text-amber-300">append(key, value)</code> <span className="text-foreground/60">— 끝에 추가 (key가 최대보다 큼 확신)</span></div>
              <div><code className="text-amber-300">delete_current()</code> <span className="text-foreground/60">— 현재 위치 항목 삭제</span></div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>walk_range</code>가 Stage 파이프라인의 주력 — 블록 범위를 순차 스캔.<br />
          <code>seek_exact</code>는 RPC용 — 특정 블록/TX를 O(log n) 조회.<br />
          <code>append</code>는 <code>upsert</code>의 최적화 버전 — 정렬된 삽입에서 B+tree 리프 추가만.
        </p>

        {/* ── 사용 패턴 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">전형적 사용 패턴 — Stage 순회</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4 not-prose">
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="font-semibold text-sm text-emerald-400 mb-2">방법 1: walk_range (권장)</p>
            <div className="text-xs font-mono text-foreground/60 space-y-0.5">
              <p>let cursor = tx.cursor_read::&lt;Transactions&gt;()?;</p>
              <p>let walker = cursor.walk_range(287M..=287.5M)?;</p>
              <p>for (tx_num, tx) in walker &#123; ... &#125;</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">edge case 처리 간결, Iterator 패턴</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="font-semibold text-sm mb-2">방법 2: seek + next 루프</p>
            <div className="text-xs font-mono text-foreground/60 space-y-0.5">
              <p>cursor.seek(287_000_000u64)?;</p>
              <p>while let Some((tx_num, tx)) = cursor.next()? &#123;</p>
              <p>{'  '}if tx_num &gt; 287_500_000 &#123; break; &#125;</p>
              <p>&#125;</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">수동 범위 체크 필요</p>
          </div>
        </div>
        <div className="my-3 not-prose">
          <div className="rounded-lg border border-border p-3 text-center">
            <p className="text-xs text-foreground/70">두 방식 모두 <strong>O(log n)</strong>에 시작 위치 → 이후 <strong>O(1)</strong> per next</p>
          </div>
        </div>
        <p className="leading-7">
          커서 기반 순회의 본질: <strong>B+tree 리프 노드 포인터만 이동</strong>.<br />
          매 키마다 root에서 re-search하는 것이 아님 — 시작점만 O(log n), 이후 O(1) per item.<br />
          mmap 페이지 캐시에 리프가 올라와 있으면 순차 스캔이 거의 메모리 속도로 진행.
        </p>

        {/* ── MVCC 트랜잭션 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">트랜잭션 스코프 — MVCC 스냅샷</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4 not-prose">
          <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-4">
            <p className="font-semibold text-sm text-sky-400 mb-2">읽기 트랜잭션</p>
            <div className="text-xs font-mono text-foreground/60 space-y-0.5">
              <p>let tx_ro = db.tx()?; <span className="text-sky-400">// 스냅샷 시점 고정</span></p>
              <p>let header = tx_ro.get::&lt;Headers&gt;(block_num)?;</p>
              <p><span className="text-muted-foreground">// drop 시 자동 종료 (롤백 불필요)</span></p>
            </div>
          </div>
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">쓰기 트랜잭션</p>
            <div className="text-xs font-mono text-foreground/60 space-y-0.5">
              <p>let tx_rw = db.tx_mut()?;</p>
              <p>let cur = tx_rw.cursor_write::&lt;Headers&gt;()?;</p>
              <p>cur.upsert(block_num, header)?;</p>
              <p>tx_rw.commit()?; <span className="text-amber-400">// 명시적 commit</span></p>
            </div>
          </div>
        </div>
        <div className="my-3 not-prose">
          <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-4">
            <p className="font-semibold text-xs text-violet-400 mb-2">MVCC 동시성</p>
            <p className="text-xs text-foreground/70">두 트랜잭션이 동시 진행 — 쓰기 중에도 읽기는 "과거 스냅샷" 조회 (일관성 유지)</p>
            <p className="text-xs text-muted-foreground mt-1">격리 수준: SNAPSHOT (PostgreSQL REPEATABLE READ 강화판)</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded bg-muted/50 p-2">
                <p className="text-sky-400 font-semibold">RPC</p>
                <p className="text-foreground/60">eth_getBalance 처리 중 (읽기)</p>
              </div>
              <div className="rounded bg-muted/50 p-2">
                <p className="text-amber-400 font-semibold">Stage</p>
                <p className="text-foreground/60">블록 100개 커밋 중 (쓰기)</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">→ RPC는 커밋 전 상태, 이후 RPC는 새 상태</p>
          </div>
        </div>
        <p className="leading-7">
          MVCC 스냅샷 덕분에 RPC 응답이 <strong>일관적</strong>.<br />
          쓰기 중간에 RPC가 "반만 커밋된 상태"를 볼 수 없다 — 항상 commit 단위로 보임.<br />
          Reth가 동기화 중에도 RPC 응답이 지연되지 않는 본질적 이유.
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">💡 설계 인사이트: append() 최적화의 의미</p>
          <p className="mt-2">
            <code>upsert()</code>는 B+tree에서 키 위치를 찾아 삽입 → O(log n).<br />
            <code>append()</code>는 "key가 기존 최대값보다 크다"를 가정 → B+tree 오른쪽 끝에만 추가 → 분할 1회.<br />
            Stage 파이프라인은 항상 순차 증가 키(BlockNumber, TxNumber)로 삽입하므로 <code>append()</code>가 적용 가능.
          </p>
          <p className="mt-2">
            성능 차이:<br />
            - <code>upsert</code> 1천만 회: ~40초 (키마다 B+tree 하향 탐색)<br />
            - <code>append</code> 1천만 회: ~10초 (리프 추가만)<br />
            - 약 4배 가속 — 초기 동기화 시 크게 기여
          </p>
          <p className="mt-2">
            "이 키는 정렬 순서로 들어온다"는 도메인 지식이 API 선택에 반영된 사례.
          </p>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-3">커서 동작 원리</h3>
      <div className="not-prose mb-8"><CursorWalkViz /></div>

      <h3 className="text-lg font-semibold mb-3">커서 연산</h3>
      <div className="space-y-2 mb-8">
        {CURSOR_OPS.map((s, i) => (
          <motion.div key={i} onClick={() => setStep(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === step ? 'border-sky-500/50 bg-sky-500/5' : 'border-border'}`}
            animate={{ opacity: i === step ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === step ? 'bg-sky-500 text-white' : 'bg-muted text-muted-foreground'}`}>{i + 1}</span>
              <span className="font-semibold text-sm">{s.title}</span>
            </div>
            <AnimatePresence>
              {i === step && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-10">{s.desc}</p>
                  <p className="text-xs text-muted-foreground mt-1 ml-10">
                    사용 예: {s.useCase}
                  </p>
                  <div className="ml-10 mt-2">
                    <CodeViewButton onClick={() => open(s.codeKey)} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <h3 className="text-lg font-semibold mb-3">B+tree vs LSM-tree</h3>
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full text-sm border border-border">
          <thead><tr className="bg-muted">
            <th className={`${CELL} text-left`}>속성</th>
            <th className={`${CELL} text-left`}>B+tree (MDBX)</th>
            <th className={`${CELL} text-left`}>LSM-tree (LevelDB)</th>
          </tr></thead>
          <tbody>
            {BTREE_VS_LSM.map(r => (
              <tr key={r.attr}>
                <td className={`${CELL} font-medium`}>{r.attr}</td>
                <td className={CELL}>{r.btree}</td>
                <td className={CELL}>{r.lsm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="not-prose">
        <CursorDetailViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
