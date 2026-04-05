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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// LevelDB (LSM-tree) 읽기 경로
// Level 0 → Level 1 → Level 2 → ... → Level 7
//    ↓        ↓         ↓              ↓
//  memtable  4MB sst   40MB sst      400GB sst
// 최악의 경우 8개 레벨 모두 확인 필요 → 8번의 disk seek

// MDBX (B+tree) 읽기 경로
// Root → Branch → Branch → Leaf
// 수십억 키여도 깊이 4~5 → 항상 4~5번의 seek
// mmap이면 OS 페이지 캐시 히트 시 syscall 없이 메모리 접근

// 읽기 복잡도 비교:
// LSM-tree: O(L × log(N/L))   L = 레벨 수
// B+tree:   O(log(N))           고정 비용`}
        </pre>
        <p className="leading-7">
          LSM-tree는 쓰기 최적화 구조 — 모든 쓰기가 memtable에 먼저 기록되고 이후 하위 레벨로 merge.<br />
          그러나 읽기 시 여러 레벨을 뒤져야 하고, compaction이 I/O 대역폭을 소모.<br />
          B+tree는 균일한 깊이 보장 → 모든 키 접근이 예측 가능한 시간.
        </p>

        {/* ── MDBX 핵심 특성 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">MDBX 핵심 특성 4가지</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 1. mmap 기반 zero-copy 읽기
//    DB 파일 전체를 프로세스 주소 공간에 매핑
//    → read() syscall 없음, 페이지 캐시 직접 접근
//    → Vec<u8> 복사 없이 &[u8] 슬라이스 반환
let header_bytes: &[u8] = tx.get::<Headers>(block_num)?;  // 복사 0회

// 2. MVCC (Multi-Version Concurrency Control)
//    쓰기 트랜잭션이 진행 중에도 읽기 트랜잭션이 스냅샷 시점 데이터 조회
//    → 읽기 쓰기가 서로 차단하지 않음
//    → RPC가 동기화 중에도 지연 없음
let tx_ro = db.tx()?;      // 스냅샷 시작
let tx_rw = db.tx_mut()?;  // 동시에 쓰기 가능

// 3. 단일 writer / 다수 readers
//    writer는 한 번에 하나 (일관성 보장)
//    reader는 무제한 (동시성 확보)

// 4. Copy-on-write 페이지 업데이트
//    수정 시 페이지 복사 후 업데이트 → 원본 유지
//    → 커밋 전까지 rollback 가능, 크래시 안전`}
        </pre>
        <p className="leading-7">
          MDBX의 zero-copy 읽기가 Reth 성능의 핵심.<br />
          블록 실행 중 수만 번의 상태 읽기가 <strong>복사 없이</strong> 일어난다.<br />
          Geth가 LevelDB에서 읽을 때 <code>[]byte</code> 복사가 발생하는 것과 대비.
        </p>

        {/* ── 계층 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Reth DB 레이어 — 4층 추상화</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 레이어 구조 (top → bottom)
//
// [Provider Layer]      reth-provider
//   HeaderProvider, StateProvider, TransactionProvider
//   높은 수준의 도메인 API ("블록 N의 헤더", "address의 잔고")
//         ↓
// [Table Layer]         reth-db-api
//   Tables trait, Cursor API, DupSort
//   타입 안전 key/value 매핑 (BlockNumber → Header)
//         ↓
// [DB Abstract Layer]   reth-db-api
//   Database trait, Tx trait
//   트랜잭션, 추상 DB 접근
//         ↓
// [Storage Engine]      reth-libmdbx
//   MDBX wrapper (libmdbx C → unsafe Rust → safe Rust)
//   mmap, B+tree, MVCC 실제 구현`}
        </pre>
        <p className="leading-7">
          4층 추상화의 이유: 각 층이 단일 책임.<br />
          Provider는 "도메인 API", Table은 "스키마", DB는 "트랜잭션", MDBX는 "엔진".<br />
          이 분리로 MDBX 대신 다른 엔진(redb, sled 등)을 연결하는 것도 이론적으로 가능.
        </p>

        {/* ── StaticFiles 분리 근거 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">StaticFiles 분리 — Hot/Cold 데이터 계층화</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 데이터 생명주기
// 1. 새 블록 생성 → MDBX에 저장 (hot)
// 2. finalized (CL 확정) → 변경 불가
// 3. finalized + 일정 시간 경과 → StaticFiles로 이전 (cold)
// 4. MDBX에서는 삭제됨

// 분리 이점:
// - MDBX 크기 억제 → B+tree 깊이 4~5 유지 → 조회 일정한 빠르기
// - cold 데이터는 append-only flat file → 블록 번호 = 오프셋
// - mmap으로 zero-copy 읽기 가능 (여전히)
// - 압축 적용 가능 (LZ4, Zstd)

// 분리 대상:
// - Headers (~508B × 1800만 블록 = 약 9GB)
// - Transactions (~80GB)
// - Receipts (~50GB)
//
// MDBX에 남는 것:
// - 최신 상태 (PlainAccountState, PlainStorageState)
// - finalized 직전 버퍼 (recent blocks)
// - Trie 노드, ChangeSets`}
        </pre>
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
