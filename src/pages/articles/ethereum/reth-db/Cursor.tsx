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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub trait DbCursorRO<T: Table> {
    /// 정확한 key로 이동 — 있으면 (k,v), 없으면 None
    fn seek_exact(&mut self, key: T::Key)
        -> Result<Option<(T::Key, T::Value)>>;

    /// key 이상의 첫 항목으로 이동 (lower_bound)
    fn seek(&mut self, key: T::Key)
        -> Result<Option<(T::Key, T::Value)>>;

    /// 현재 위치에서 다음 항목으로 이동
    fn next(&mut self) -> Result<Option<(T::Key, T::Value)>>;

    /// 현재 위치에서 이전 항목으로 이동
    fn prev(&mut self) -> Result<Option<(T::Key, T::Value)>>;

    /// 첫 번째 / 마지막 항목
    fn first(&mut self) -> Result<Option<(T::Key, T::Value)>>;
    fn last(&mut self) -> Result<Option<(T::Key, T::Value)>>;

    /// 범위 순회 — Iterator 반환
    fn walk_range(&mut self, range: impl RangeBounds<T::Key>)
        -> Result<Walker<'_, T>>;
}

pub trait DbCursorRW<T: Table>: DbCursorRO<T> {
    /// 없으면 삽입, 있으면 갱신
    fn upsert(&mut self, key: T::Key, value: T::Value) -> Result<()>;

    /// 끝에 추가 (key가 기존 최대보다 크다고 확신)
    fn append(&mut self, key: T::Key, value: T::Value) -> Result<()>;

    /// 현재 위치의 항목 삭제
    fn delete_current(&mut self) -> Result<()>;
}`}
        </pre>
        <p className="leading-7">
          <code>walk_range</code>가 Stage 파이프라인의 주력 — 블록 범위를 순차 스캔.<br />
          <code>seek_exact</code>는 RPC용 — 특정 블록/TX를 O(log n) 조회.<br />
          <code>append</code>는 <code>upsert</code>의 최적화 버전 — 정렬된 삽입에서 B+tree 리프 추가만.
        </p>

        {/* ── 사용 패턴 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">전형적 사용 패턴 — Stage 순회</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 블록 범위 스캔 (Stage 내부 패턴)
let mut cursor = tx.cursor_read::<Transactions>()?;

// 방법 1: walk_range
let walker = cursor.walk_range(287_000_000..=287_500_000)?;
for result in walker {
    let (tx_num, tx) = result?;
    process(tx_num, tx);
}

// 방법 2: 수동 seek + next 루프
cursor.seek(287_000_000u64)?;
while let Some((tx_num, tx)) = cursor.next()? {
    if tx_num > 287_500_000 { break; }
    process(tx_num, tx);
}

// 두 방식 모두 O(log n)에 시작 위치 찾기 + O(1)에 next
// walk_range가 edge case(범위 경계) 처리가 간결해서 선호`}
        </pre>
        <p className="leading-7">
          커서 기반 순회의 본질: <strong>B+tree 리프 노드 포인터만 이동</strong>.<br />
          매 키마다 root에서 re-search하는 것이 아님 — 시작점만 O(log n), 이후 O(1) per item.<br />
          mmap 페이지 캐시에 리프가 올라와 있으면 순차 스캔이 거의 메모리 속도로 진행.
        </p>

        {/* ── MVCC 트랜잭션 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">트랜잭션 스코프 — MVCC 스냅샷</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 읽기 트랜잭션 시작 → 스냅샷 시점 고정
let tx_ro = db.tx()?;  // 이 순간의 DB 상태가 "view"
let header = tx_ro.get::<Headers>(block_num)?;
// tx_ro drop 시 자동 종료 (롤백 불필요 — 읽기 전용이므로)

// 쓰기 트랜잭션
let tx_rw = db.tx_mut()?;
let mut cur = tx_rw.cursor_write::<Headers>()?;
cur.upsert(block_num, header)?;
tx_rw.commit()?;  // 명시적 commit, 실패 시 자동 롤백

// 핵심: 두 트랜잭션이 동시에 진행 가능
// - 쓰기가 진행 중이어도 읽기는 "과거 스냅샷" 조회 (일관성 유지)
// - 스냅샷 격리 수준 = SNAPSHOT (PostgreSQL의 REPEATABLE READ 강화판)

// 사용 사례:
// - RPC가 eth_getBalance 처리 중 (읽기 트랜잭션)
// - 동시에 Stage가 블록 100개 커밋 중 (쓰기 트랜잭션)
// → RPC는 커밋 전 상태를 보고, 이후 RPC는 새 상태를 봄`}
        </pre>
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
