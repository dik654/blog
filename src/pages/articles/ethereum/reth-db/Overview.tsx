import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import DBLayerViz from './viz/DBLayerViz';
import MmapZeroCopyViz from './viz/MmapZeroCopyViz';
import MVCCSnapshotViz from './viz/MVCCSnapshotViz';
import type { CodeRef } from '@/components/code/types';
import { WHY_MDBX } from './OverviewData';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [step, setStep] = useState(0);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">DB 아키텍처</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          이더리움 EL 노드는 블록 헤더, 트랜잭션, 영수증, 계정 상태, 스토리지 등 수백 GB의 데이터를 저장하고 빠르게 조회해야 한다.<br />
          블록 실행 중에는 수천 건의 상태 읽기가 발생하고, 동시에 RPC 요청도 처리해야 한다.
        </p>
        <p className="leading-7">
          Geth는 LevelDB(LSM-tree, Log-Structured Merge-tree 기반 키-값 저장소)를 사용한다.<br />
          쓰기에 유리하지만, 읽기 시 여러 레벨을 탐색해야 하고 compaction(백그라운드 레벨 병합)이 읽기 성능을 간섭한다.<br />
          블록체인 노드는 읽기 비중이 높으므로 이 트레이드오프가 불리하다.
        </p>
        <p className="leading-7">
          Reth는 MDBX를 선택했다. B+tree 기반으로 모든 읽기가 O(log n)에 완료된다.<br />
          mmap(메모리 매핑)으로 zero-copy 읽기를 제공하고, MVCC로 읽기/쓰기가 서로 차단하지 않는다.<br />
          추가로, finalized 블록 이전의 데이터를 StaticFiles로 분리하여 MDBX 크기를 억제하고 B+tree 깊이를 낮게 유지한다.
        </p>

        {/* ── LSM-tree vs B+tree ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">LSM-tree vs B+tree — 구조적 차이</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 not-prose">
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <p className="font-semibold text-sm text-red-400 mb-2">LevelDB (LSM-tree) 읽기</p>
            <p className="text-sm text-foreground/70">Level 0 → Level 1 → ... → Level 7</p>
            <p className="text-xs text-muted-foreground mt-1">memtable → 4MB sst → 40MB sst → 400GB sst</p>
            <p className="text-xs text-muted-foreground mt-1">최악 8개 레벨 모두 확인 → 8번 disk seek</p>
            <p className="text-xs font-mono mt-2 text-red-400">O(L x log(N/L)) — L = 레벨 수</p>
          </div>
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="font-semibold text-sm text-emerald-400 mb-2">MDBX (B+tree) 읽기</p>
            <p className="text-sm text-foreground/70">Root → Branch → Branch → Leaf</p>
            <p className="text-xs text-muted-foreground mt-1">수십억 키여도 깊이 4~5 → 항상 4~5번 seek</p>
            <p className="text-xs text-muted-foreground mt-1">mmap + OS 페이지 캐시 히트 시 syscall 없이 메모리 접근</p>
            <p className="text-xs font-mono mt-2 text-emerald-400">O(log(N)) — 고정 비용</p>
          </div>
        </div>
        <p className="leading-7">
          LSM-tree는 쓰기 최적화 구조 — 모든 쓰기가 memtable에 먼저 기록되고 이후 하위 레벨로 merge.<br />
          그러나 읽기 시 여러 레벨을 뒤져야 하고, compaction이 I/O 대역폭을 소모.<br />
          B+tree는 균일한 깊이 보장 → 모든 키 접근이 예측 가능한 시간.
        </p>

        {/* ── MDBX 핵심 특성 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">MDBX 핵심 특성 4가지</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4 not-prose">
          <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-4">
            <p className="font-semibold text-sm text-sky-400 mb-2">1. mmap zero-copy 읽기</p>
            <p className="text-sm text-foreground/70">DB 파일 전체를 프로세스 주소 공간에 매핑</p>
            <p className="text-xs text-muted-foreground mt-1"><code>read()</code> syscall 없이 페이지 캐시 직접 접근</p>
            <p className="text-xs text-muted-foreground mt-1"><code>Vec&lt;u8&gt;</code> 복사 없이 <code>&amp;[u8]</code> 슬라이스 반환</p>
            <p className="text-xs font-mono mt-2 text-sky-400/70">tx.get::&lt;Headers&gt;(block_num)? // 복사 0회</p>
          </div>
          <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-4">
            <p className="font-semibold text-sm text-violet-400 mb-2">2. MVCC 스냅샷 격리</p>
            <p className="text-sm text-foreground/70">쓰기 중에도 읽기 트랜잭션이 스냅샷 시점 조회</p>
            <p className="text-xs text-muted-foreground mt-1">읽기/쓰기 서로 차단 없음 → RPC + 동기화 동시 진행</p>
            <p className="text-xs font-mono mt-2 text-violet-400/70">db.tx()? // 스냅샷, db.tx_mut()? // 쓰기</p>
          </div>
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">3. 단일 writer / 다수 readers</p>
            <p className="text-sm text-foreground/70">writer 1개로 일관성 보장</p>
            <p className="text-xs text-muted-foreground mt-1">reader 무제한으로 동시성 확보</p>
          </div>
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="font-semibold text-sm text-emerald-400 mb-2">4. Copy-on-write 페이지</p>
            <p className="text-sm text-foreground/70">수정 시 페이지 복사 후 업데이트 → 원본 유지</p>
            <p className="text-xs text-muted-foreground mt-1">커밋 전까지 rollback 가능, 크래시 안전</p>
          </div>
        </div>
        <p className="leading-7">
          MDBX의 zero-copy 읽기가 Reth 성능의 핵심.<br />
          블록 실행 중 수만 번의 상태 읽기가 <strong>복사 없이</strong> 일어난다.<br />
          Geth가 LevelDB에서 읽을 때 <code>[]byte</code> 복사가 발생하는 것과 대비.
        </p>

        {/* ── 계층 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Reth DB 레이어 — 4층 추상화</h3>
        <div className="space-y-2 my-4 not-prose">
          {[
            { layer: 'Provider Layer', crate: 'reth-provider', apis: 'HeaderProvider, StateProvider, TransactionProvider', desc: '높은 수준 도메인 API ("블록 N의 헤더", "address의 잔고")', color: 'border-indigo-500/30 bg-indigo-500/5' },
            { layer: 'Table Layer', crate: 'reth-db-api', apis: 'Tables trait, Cursor API, DupSort', desc: '타입 안전 key/value 매핑 (BlockNumber → Header)', color: 'border-sky-500/30 bg-sky-500/5' },
            { layer: 'DB Abstract Layer', crate: 'reth-db-api', apis: 'Database trait, Tx trait', desc: '트랜잭션, 추상 DB 접근', color: 'border-emerald-500/30 bg-emerald-500/5' },
            { layer: 'Storage Engine', crate: 'reth-libmdbx', apis: 'MDBX wrapper', desc: 'mmap, B+tree, MVCC 실제 구현 (libmdbx C → unsafe Rust → safe Rust)', color: 'border-amber-500/30 bg-amber-500/5' },
          ].map((l, i) => (
            <div key={i} className={`rounded-lg border p-3 ${l.color}`}>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{l.layer}</span>
                <code className="text-xs px-1.5 py-0.5 rounded bg-muted">{l.crate}</code>
              </div>
              <p className="text-xs text-foreground/70 mt-1"><code>{l.apis}</code></p>
              <p className="text-xs text-muted-foreground mt-0.5">{l.desc}</p>
              {i < 3 && <div className="text-center text-muted-foreground text-xs mt-1">↓</div>}
            </div>
          ))}
        </div>
        <p className="leading-7">
          4층 추상화의 이유: 각 층이 단일 책임.<br />
          Provider는 "도메인 API", Table은 "스키마", DB는 "트랜잭션", MDBX는 "엔진".<br />
          이 분리로 MDBX 대신 다른 엔진(redb, sled 등)을 연결하는 것도 이론적으로 가능.
        </p>

        {/* ── StaticFiles 분리 근거 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">StaticFiles 분리 — Hot/Cold 데이터 계층화</h3>
        <div className="my-4 not-prose space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { step: '1', label: '새 블록 생성', detail: 'MDBX 저장 (hot)', color: 'border-red-500/30 bg-red-500/5' },
              { step: '2', label: 'finalized', detail: 'CL 확정 → 변경 불가', color: 'border-amber-500/30 bg-amber-500/5' },
              { step: '3', label: '경과', detail: 'StaticFiles 이전 (cold)', color: 'border-emerald-500/30 bg-emerald-500/5' },
              { step: '4', label: '정리', detail: 'MDBX에서 삭제', color: 'border-muted-foreground/30 bg-muted/50' },
            ].map(s => (
              <div key={s.step} className={`rounded-lg border p-3 text-center ${s.color}`}>
                <span className="text-xs font-bold text-muted-foreground">Step {s.step}</span>
                <p className="text-sm font-semibold mt-1">{s.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.detail}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="font-semibold text-sm text-emerald-400 mb-2">StaticFiles 이전 대상</p>
              <div className="space-y-1 text-xs text-foreground/70">
                <p><code>Headers</code> — ~508B x 1800만 블록 = 약 9GB</p>
                <p><code>Transactions</code> — ~80GB</p>
                <p><code>Receipts</code> — ~50GB</p>
              </div>
            </div>
            <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-4">
              <p className="font-semibold text-sm text-sky-400 mb-2">MDBX 잔류</p>
              <div className="space-y-1 text-xs text-foreground/70">
                <p>최신 상태 (<code>PlainAccountState</code>, <code>PlainStorageState</code>)</p>
                <p>finalized 직전 버퍼 (recent blocks)</p>
                <p>Trie 노드, ChangeSets</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs font-semibold text-muted-foreground mb-1">분리 이점</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-foreground/70">
              <p>MDBX 크기 억제 → B+tree 깊이 4~5 유지</p>
              <p>cold 데이터 append-only flat file → 블록 번호 = 오프셋</p>
              <p>mmap zero-copy 읽기 (여전히)</p>
              <p>압축 적용 가능 (LZ4, Zstd)</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          StaticFiles는 Geth의 Freezer와 유사한 개념 — 오래된 데이터를 별도 파일로 분리.<br />
          차이점: Reth StaticFiles는 zstd 압축 + 블록 번호 기반 O(1) 오프셋 접근 지원.<br />
          MDBX 크기가 억제되면 B+tree 깊이가 낮게 유지되어 hot 데이터 조회가 항상 빠르다.
        </p>
      </div>

      <h3 className="text-lg font-semibold mb-3">mmap: zero-copy 읽기</h3>
      <div className="not-prose mb-8"><MmapZeroCopyViz /></div>

      <h3 className="text-lg font-semibold mb-3">MVCC: 읽기/쓰기 동시성</h3>
      <div className="not-prose mb-8"><MVCCSnapshotViz /></div>

      <h3 className="text-lg font-semibold mb-3">왜 MDBX인가?</h3>
      <div className="space-y-2 mb-8">
        {WHY_MDBX.map((s, i) => (
          <motion.div key={i} onClick={() => setStep(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === step ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === step ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === step ? 'bg-indigo-500 text-white' : 'bg-muted text-muted-foreground'}`}>{i + 1}</span>
              <span className="font-semibold text-sm">{s.title}</span>
            </div>
            <AnimatePresence>
              {i === step && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-10">{s.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="not-prose mt-6"><DBLayerViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">💡 설계 인사이트: 왜 Geth는 안 바꾸나</p>
          <p className="mt-2">
            Geth는 2015년 LevelDB 채택 이후 기본 DB 엔진을 유지.<br />
            2020년경 PebbleDB(RocksDB Go 포트) 옵션이 추가되었지만 여전히 LSM 계열.<br />
            LSM은 쓰기 최적화라 검증자(validator) 노드에 유리한 면이 있음.
          </p>
          <p className="mt-2">
            Reth가 MDBX 선택한 근거:<br />
            1. <strong>워크로드 분석</strong> — 블록체인 노드는 쓰기/읽기 비율 ~1:10 (상태 조회 압도적)<br />
            2. <strong>Erigon 선행</strong> — Erigon이 MDBX 전환으로 동기화 속도 개선 입증<br />
            3. <strong>mmap의 가치</strong> — 수백 GB 파일을 페이지 캐시로 거의 무료 읽기<br />
            4. <strong>MVCC 스냅샷</strong> — RPC와 동기화가 서로 방해 없이 동시 진행
          </p>
          <p className="mt-2">
            결론: 엔진 선택은 워크로드 특성과 짝을 맞추는 것.<br />
            노드 = 읽기 중심 → B+tree + mmap이 본질적으로 유리.
          </p>
        </div>
      </div>
    </section>
  );
}
