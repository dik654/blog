import ContextViz from './viz/ContextViz';
import BeaconDBSchemaViz from './viz/BeaconDBSchemaViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">DB 아키텍처</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 BoltDB 초기화, 버킷 구조, 상태 저장 전략을 코드 수준으로 추적한다.
        </p>

        {/* ── BoltDB 선택 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BoltDB — 왜 이 엔진을 선택했나</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Prysm의 DB 선택: BoltDB (fork: bbolt)
// https://github.com/etcd-io/bbolt

// BoltDB 특징:
// - B+tree, embedded, single-file
// - ACID transactions (MVCC)
// - Go native 구현 (CGo 없음)
// - LMDB에 영감 (비슷한 설계)
// - mmap 기반 read-only 접근
// - single writer, multiple readers

// 대안 비교:
// LevelDB (Geth EL):
//   + 쓰기 성능 우수 (LSM-tree)
//   - read amplification
//   - compaction 오버헤드
//   - CGo 바인딩 필요
//
// MDBX (Reth EL, Erigon):
//   + 최고 성능
//   - C 라이브러리 (CGo)
//   - Go 생태계 미성숙
//
// BoltDB (Prysm):
//   + Pure Go (빌드 단순)
//   + B+tree 일관된 read
//   + CL 워크로드에 적합 (80% read)
//   - 큰 DB에서 쓰기 느림 (copy-on-write 페이지)

// CL 워크로드 특성:
// - block/state 저장: 매 12초 1회 (빈번하지 않음)
// - state 조회: 매우 빈번 (fork choice, RPC)
// - historical 조회: 간헐적
// → read-heavy, write 버스트
// → B+tree가 적합

// 단점 관리:
// - 한 번에 큰 state (~250MB) 저장 → 대형 write TX
// - bbolt의 "free page" 관리로 성능 유지
// - 주기적 compaction 불필요 (MDBX와 유사)`}
        </pre>
        <p className="leading-7">
          Prysm은 <strong>BoltDB(bbolt)</strong>를 선택 — pure Go + B+tree.<br />
          LevelDB(LSM) 대비 read-heavy 워크로드에 유리.<br />
          CL 특성(80% read)과 잘 맞음 + CGo 의존성 제거.
        </p>

        {/* ── DB 레이아웃 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">DB 파일 레이아웃</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// ~/.eth2/beaconchaindata/beaconchain.db (single file)
// 구조:
//
// File header (4KB)
//   └─ magic number, version
//
// Meta buckets
//   ├─ schemaVersion
//   ├─ config (ChainSpec)
//   └─ genesisBlock
//
// Data buckets (실제 데이터)
//   ├─ blocksBucket              (root → SSZ block)
//   ├─ stateBucket               (root → SSZ state)
//   ├─ stateSummaryBucket        (slot → root)
//   ├─ blockParentRootIndices    (root → parent_root)
//   ├─ blockSlotIndicesBucket    (slot → root)
//   ├─ finalizedBlockRootsIndex  (epoch → root)
//   ├─ validatorsBucket          (pubkey → index)
//   ├─ proposerSlashingsBucket
//   ├─ attesterSlashingsBucket
//   ├─ voluntaryExitsBucket
//   ├─ slashingIndexBucket
//   ├─ blsToExecChangesBucket    (BLS→ETH1 address 변경)
//   ├─ depositContractBucket
//   └─ powChainDataBucket         (Eth1 deposit 추적)

// 크기 추정 (메인넷, 1년):
// - blocks: ~6 GB
// - states: ~100 GB (default mode)
// - state summaries: ~80 MB
// - indices: ~500 MB
// - slashings, exits, etc: ~100 MB
// 총: ~107 GB

// Archive 모드: ~5 TB`}
        </pre>
        <p className="leading-7">
          BeaconDB는 <strong>단일 파일 + 10+ 버킷</strong>.<br />
          각 버킷이 독립 B+tree → 서로 다른 데이터 유형 격리.<br />
          인덱스 버킷으로 slot/epoch 기반 조회 최적화.
        </p>
      </div>
      <div className="not-prose mt-6"><BeaconDBSchemaViz /></div>
    </section>
  );
}
