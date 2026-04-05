import ContextViz from './viz/ContextViz';
import BlobTxViz from './viz/BlobTxViz';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Blob TX 구조</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          EIP-4844는 롤업의 데이터 비용을 줄이기 위한 Blob TX를 도입한다 (Cancun 포크, 2024-03).<br />
          이 아티클에서는 reth 코드베이스의 blob 저장소, TX 검증, 가스 가격을 추적한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 mt-4 mb-4">
          <CodeViewButton onClick={() => onCodeRef('blobstore-trait', codeRefs['blobstore-trait'])} />
          <span className="text-[10px] text-muted-foreground self-center">BlobStore 트레이트 — 저장소 인터페이스</span>
        </div>

        {/* ── Blob TX 동기 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">EIP-4844 동기 — 롤업 DA 비용 절감</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// EIP-4844 이전 (2024-03 이전):
// 롤업(Optimism, Arbitrum, Base)은 calldata로 DA 제공
// - calldata 바이트당 ~16 gas (zero는 4 gas)
// - 4MB rollup batch = ~4M × 16 = 64M gas → 거의 2개 블록
// - 롤업 TX 수수료의 80%가 DA 비용
//
// 문제: 이더리움 메인넷이 롤업 확장성의 병목

// EIP-4844 (Proto-Danksharding):
// Blob = 128KB 데이터 청크
// - 블록당 최대 6 blob (768KB)
// - 별도 gas market (blob_gas)
// - 임시 저장 (약 18일, ~4096 epoch)
// - EVM에서 직접 읽기 불가 → point evaluation precompile로만 접근

// 목표:
// - 롤업 DA 비용 10~100배 감소
// - 메인넷 TPS 영향 최소화 (blob은 별도 대역폭)

// 실제 효과 (2024~2025 관측):
// - L2 TX 수수료: $0.05 → $0.005 (10배 하락)
// - Base, Arbitrum, Optimism 사용량 급증
// - L2 TPS: 수십 → 수천

// 경제적 영향:
// - 메인넷 base_fee 유지 (calldata 사용 감소)
// - blob_gas market 별도 형성
// - validator 수익 중 ~1~5%가 blob_gas fee`}
        </pre>
        <p className="leading-7">
          EIP-4844는 <strong>Proto-Danksharding</strong> — 전체 Danksharding의 예비 단계.<br />
          Blob을 임시 저장(~18일)하고 그 이후 폐기 → 상태 영구 팽창 방지.<br />
          롤업 DA 비용 10~100배 감소 → L2 생태계 폭발적 성장의 직접 원인.
        </p>

        {/* ── BlobTransaction 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Blob TX 구조 — EIP-4844 Type 3</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// EIP-4844 TX (type = 0x03)
pub struct TxEip4844 {
    pub chain_id: u64,
    pub nonce: u64,
    pub max_priority_fee_per_gas: u128,
    pub max_fee_per_gas: u128,
    pub gas_limit: u64,
    pub to: Address,                         // Call만 허용 (Create 불가)
    pub value: U256,
    pub access_list: AccessList,
    pub max_fee_per_blob_gas: u128,          // blob gas 상한
    pub blob_versioned_hashes: Vec<B256>,    // 각 blob의 VersionedHash
    pub input: Bytes,
}

// VersionedHash 형식:
// bytes[0] = 0x01 (version byte)
// bytes[1..32] = keccak256(kzg_commitment)[1..32]
//
// 예: 0x01 abc123...

// Blob 데이터 자체는 TX에 없음!
// → "blob sidecar"에 별도 전송
pub struct BlobTransactionSidecar {
    pub blobs: Vec<Blob>,              // 실제 데이터 (각 128KB)
    pub commitments: Vec<KzgCommitment>, // 각 blob의 KZG commitment
    pub proofs: Vec<KzgProof>,         // 각 blob의 증명
}

// Blob 구조:
pub struct Blob {
    pub data: [u8; 131072],  // 128KB = 4096 × 32B
}
// 4096개 BLS12-381 field elements로 인코딩

// 네트워크 전송:
// - 일반 노드에 TX 전달 시: TX + sidecar 함께
// - 블록에는 blob_versioned_hashes만 포함
// - sidecar는 별도 저장 (BlobStore)`}
        </pre>
        <p className="leading-7">
          Blob TX는 <strong>2개 부분 분리</strong> — on-chain TX (hashes만) + off-chain sidecar (blobs).<br />
          블록에 blob 본체 포함하지 않음 → consensus 부담 감소.<br />
          Sidecar는 임시 저장 후 폐기 → 영구 상태 팽창 방지.
        </p>

        {/* ── 블록 헤더 확장 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">블록 헤더 확장 — Cancun 필드</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Cancun 이후 블록 헤더 추가 필드
pub struct Header {
    // ... 기존 필드 ...

    // EIP-4844 필드:
    pub blob_gas_used: Option<u64>,       // 블록에서 사용한 blob gas
    pub excess_blob_gas: Option<u64>,     // 누적 초과분 (blob_fee 계산용)
}

// blob_gas 상수:
const GAS_PER_BLOB: u64 = 131_072;           // 1 blob = 128KB
const TARGET_BLOBS_PER_BLOCK: u64 = 3;       // 목표 blob/block
const MAX_BLOBS_PER_BLOCK: u64 = 6;          // 최대 blob/block
const TARGET_BLOB_GAS_PER_BLOCK: u64 = GAS_PER_BLOB * TARGET_BLOBS_PER_BLOCK;
const MAX_BLOB_GAS_PER_BLOCK: u64 = GAS_PER_BLOB * MAX_BLOBS_PER_BLOCK;

// 예시 블록 (3 blobs 사용):
// blob_gas_used = 3 × 131072 = 393_216
// excess_blob_gas: 이전 블록에서 누적, blob_base_fee 결정

// 검증:
// blob_gas_used <= MAX_BLOB_GAS_PER_BLOCK (786_432)
// blob_gas_used % GAS_PER_BLOB == 0 (131072의 배수)

// blob_base_fee 계산 (이전 excess 기반, 지수 함수):
fn calc_blob_base_fee(excess_blob_gas: u64) -> u128 {
    fake_exponential(
        MIN_BLOB_BASE_FEE,            // 1 wei
        excess_blob_gas,
        BLOB_BASE_FEE_UPDATE_FRACTION, // 3_338_477
    )
}`}
        </pre>
        <p className="leading-7">
          <strong>2개 새 헤더 필드</strong>로 blob 경제 모델 관리.<br />
          <code>blob_gas_used</code>: 이 블록 사용량, <code>excess_blob_gas</code>: 누적 초과.<br />
          일반 gas와 독립된 별도 market — blob 수요가 일반 TX에 영향 없음.
        </p>
      </div>
      <div className="not-prose mt-6"><BlobTxViz /></div>
    </section>
  );
}
