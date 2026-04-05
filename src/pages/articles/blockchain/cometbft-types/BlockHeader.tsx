import BlockStructViz from './viz/BlockStructViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function BlockHeader({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="block-header" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Block & Header 구조체</h2>
      <div className="not-prose mb-8">
        <BlockStructViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── Block 구조 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">Block 구조 — 4개 섹션</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// cometbft/types/block.go
type Block struct {
    mtx cmtsync.Mutex

    Header     \`json:"header"\`       // 메타데이터 14 필드
    Data       \`json:"data"\`          // transactions
    Evidence   \`json:"evidence"\`      // 비잔틴 증거
    LastCommit \`json:"last_commit"\`   // 이전 높이 투표 집계
}

// Header 14 필드:
type Header struct {
    // Version
    Version version.Consensus  // block.version, app.version

    // Chain identity
    ChainID string
    Height  int64               // 블록 높이
    Time    time.Time           // 블록 타임스탬프

    // Previous block info
    LastBlockID BlockID         // 이전 블록 ID

    // Merkle roots of various data
    LastCommitHash     []byte   // 이전 LastCommit의 hash
    DataHash           []byte   // transactions의 Merkle root
    ValidatorsHash     []byte   // 현재 validators hash
    NextValidatorsHash []byte   // 다음 블록 validators hash
    ConsensusHash      []byte   // ConsensusParams hash
    AppHash            []byte   // ABCI app의 state root
    LastResultsHash    []byte   // 이전 블록 TX results hash
    EvidenceHash       []byte   // Evidence merkle root

    // Proposer info
    ProposerAddress Address     // 이 블록의 proposer
}

// 필드 순서가 중요:
// Header.Hash() 계산 시 순서대로 merkle tree 구성
// 순서 변경 → 다른 hash → consensus split`}
        </pre>
        <p className="leading-7">
          Block은 <strong>4개 섹션</strong> (Header/Data/Evidence/LastCommit).<br />
          Header는 14 필드 — 메타데이터 + 각종 merkle root.<br />
          필드 순서가 hash 결정 → 변경 시 consensus split.
        </p>

        {/* ── Hash 계산 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Header.Hash() — 14 필드 merkle 트리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`func (h *Header) Hash() cmtbytes.HexBytes {
    if h == nil || len(h.ValidatorsHash) == 0 {
        return nil
    }

    // 14 필드를 protobuf encode 후 merkle tree 구성
    fields := [][]byte{
        hbs(versionToBytes(h.Version)),
        hbs([]byte(h.ChainID)),
        hbs(cdcEncode(h.Height)),
        hbs(cdcEncode(h.Time)),
        hbs(h.LastBlockID.Hash[:]),
        hbs(h.LastCommitHash),
        hbs(h.DataHash),
        hbs(h.ValidatorsHash),
        hbs(h.NextValidatorsHash),
        hbs(h.ConsensusHash),
        hbs(h.AppHash),
        hbs(h.LastResultsHash),
        hbs(h.EvidenceHash),
        hbs(h.ProposerAddress),
    }

    // Tendermint merkle tree (binary)
    return merkle.HashFromByteSlices(fields)
}

// 왜 merkle tree?
// - 단순 concat + hash: 14 필드 전체 재해시 필요
// - merkle tree: 변경된 필드의 path만 재해시 O(log n)
// - 특정 필드 존재 증명 (light client 검증)
// - 부분 정보만 공유 가능 (privacy)

// 사용 예:
// - AppHash 증명: ABCI state root가 이 block에 포함됨을 증명
// - 특정 TX 포함 증명: DataHash merkle proof로 증명
// - ValidatorsHash 증명: current validators 검증`}
        </pre>
        <p className="leading-7">
          <code>Header.Hash()</code>는 <strong>14 필드 merkle tree</strong>.<br />
          특정 필드 증명 O(log n) 가능 → light client 지원.<br />
          AppHash, DataHash, ValidatorsHash 등 모든 merkle root가 여기 포함.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} Header.Hash()가 Merkle 트리인 이유</strong> — 14개 필드를 단순 concat 후 SHA256하면 어떤 필드가 변경됐는지 증명 불가.<br />
          Merkle 트리를 쓰면 변경된 필드만 O(log n) 증명이 가능하다.
        </p>
      </div>
    </section>
  );
}
