import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import BlobPoolDetailViz from './viz/BlobPoolDetailViz';
import type { CodeRef } from '@/components/code/types';

export default function BlobPool({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="blob-pool" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BlobPool 관리</h2>
      <div className="not-prose mb-8"><BlobPoolDetailViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('blob-validate', codeRefs['blob-validate'])} />
          <span className="text-[10px] text-muted-foreground self-center">validate_blob_sidecar()</span>
        </div>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('tx-validate-stateless', codeRefs['tx-validate-stateless'])} />
          <span className="text-[10px] text-muted-foreground self-center">stateless 검증 — 포크, 크기, blob 개수</span>
        </div>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('tx-validate-eip4844', codeRefs['tx-validate-eip4844'])} />
          <span className="text-[10px] text-muted-foreground self-center">stateful 검증 — KZG + re-org 처리</span>
        </div>

        {/* ── stateless 검증 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">2단계 검증 — stateless vs stateful</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Stage 1: Stateless Validation (빠른 필터링)
fn validate_stateless(tx: &TxEip4844, sidecar: &BlobSidecar) -> Result<()> {
    // 1. Cancun 포크 활성 확인
    if !chain_spec.is_cancun_active_at_timestamp(current_ts) {
        return Err(Eip4844TxNotSupportedYet);
    }

    // 2. blob 개수 검증
    if sidecar.blobs.len() == 0 {
        return Err(NoBlobs);
    }
    if sidecar.blobs.len() > MAX_BLOBS_PER_TX {  // 6
        return Err(TooManyBlobs);
    }

    // 3. 각 blob 크기 검증 (128KB 고정)
    for blob in &sidecar.blobs {
        if blob.data.len() != BLOB_DATA_SIZE { // 131_072
            return Err(InvalidBlobSize);
        }
    }

    // 4. versioned_hashes 개수 = blobs 개수
    if tx.blob_versioned_hashes.len() != sidecar.blobs.len() {
        return Err(VersionedHashMismatch);
    }

    // 5. versioned_hash prefix 검증 (0x01)
    for h in &tx.blob_versioned_hashes {
        if h.0[0] != 0x01 {
            return Err(InvalidVersionedHashPrefix);
        }
    }

    // 6. commitments/proofs 개수 일치
    if sidecar.commitments.len() != sidecar.blobs.len()
        || sidecar.proofs.len() != sidecar.blobs.len() {
        return Err(CommitmentCountMismatch);
    }

    Ok(())
}

// 비용: 모두 O(1) 검증 → 마이크로초 수준`}
        </pre>
        <p className="leading-7">
          Stateless 검증은 <strong>DB 접근 없이 TX 자체만</strong> 검사.<br />
          크기/개수/포맷 검증 → O(1) 시간에 완료 → 빠른 필터링.<br />
          대부분의 잘못된 blob TX는 여기서 걸러짐.
        </p>

        {/* ── KZG 검증 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Stateful 검증 — KZG proof 확인</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Stage 2: Stateful Validation (expensive)
fn validate_stateful(
    tx: &TxEip4844,
    sidecar: &BlobSidecar,
    kzg_settings: &KzgSettings,
) -> Result<()> {
    // 1. versioned_hash == KZG commitment hash 확인
    for (i, commitment) in sidecar.commitments.iter().enumerate() {
        let expected = kzg_to_versioned_hash(commitment);
        if expected != tx.blob_versioned_hashes[i] {
            return Err(VersionedHashMismatch);
        }
    }

    // 2. KZG 증명 검증 (비싼 연산)
    // - 각 blob에 대해 pairing 검증
    // - BLS12-381 elliptic curve 연산
    // - blob 1개당 ~5ms
    for i in 0..sidecar.blobs.len() {
        let blob = &sidecar.blobs[i];
        let commitment = &sidecar.commitments[i];
        let proof = &sidecar.proofs[i];

        let valid = kzg_settings.verify_blob_kzg_proof(
            blob,
            commitment,
            proof,
        )?;
        if !valid {
            return Err(InvalidKzgProof);
        }
    }

    // 3. 기본 TX 검증 (nonce, balance, gas)
    //    이전 stage와 동일
    validate_basic_tx(tx)?;

    Ok(())
}

// 비용:
// - KZG 검증: blob당 ~5ms (BLS12-381 pairing)
// - 6 blob TX: ~30ms per TX
// - 병렬화 가능 (각 blob 독립)`}
        </pre>
        <p className="leading-7">
          Stateful 검증은 <strong>KZG 암호학 연산 포함</strong> — blob당 ~5ms.<br />
          BLS12-381 곡선의 pairing 연산 → 수학적으로 비쌈.<br />
          Stateless 먼저 수행하여 대부분 필터링 후 KZG 검증 → 효율적.
        </p>

        {/* ── Blob TX 풀 특성 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BlobPool 특성 — 일반 Pool과 차이</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BlobPool: blob TX 전용 서브풀
pub struct BlobPool {
    /// blob TX 관리
    pool: HashMap<TxHash, Arc<ValidPoolTransaction>>,

    /// sender별 현재 nonce
    sender_nonces: HashMap<Address, u64>,

    /// 전체 blob gas 추적 (메모리 제한)
    total_blob_gas: u64,

    /// 연결된 BlobStore (sidecar 저장)
    blob_store: Arc<dyn BlobStore>,
}

// 일반 Pool과의 차이:
//
// 1. 크기 제한:
//    일반 pool: max 10K TX
//    blob pool: max ~수천 (blob 크기 때문)
//
// 2. Replacement 가격 bump:
//    일반: 10% 증가
//    blob: 100% 증가 (blob 저장/전파 비용)
//
// 3. sidecar 분리:
//    일반: TX 안에 모든 데이터
//    blob: TX는 hash만, sidecar는 별도 store
//
// 4. 네트워크 전파:
//    일반: 전체 TX broadcast
//    blob: hash만 announce, 요청 시에만 sidecar 전송
//
// 5. Subpool 분류:
//    일반: Pending/BaseFee/Queued
//    blob: 별도 BlobPool (독립적으로 관리)

// validator가 블록 생성 시:
// 1. 일반 TX (txpool.best_transactions()) 수집
// 2. blob TX (blob_pool.best_transactions()) 수집
// 3. 두 목록 합쳐서 블록 구성 (blob_gas_limit 제약)`}
        </pre>
        <p className="leading-7">
          BlobPool은 <strong>일반 Pool과 독립적</strong>으로 관리.<br />
          크기 제한, replacement 규칙, 네트워크 전파 모두 다름.<br />
          blob_gas_limit 786KB 별도 관리 → 일반 TX 풀 공간 침범 없음.
        </p>
      </div>
    </section>
  );
}
