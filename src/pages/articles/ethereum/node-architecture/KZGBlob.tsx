import KZGBlobViz from './viz/KZGBlobViz';

export default function KZGBlob({ title }: { title?: string }) {
  return (
    <section id="kzg-blob" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'KZG 커밋먼트 & Blob (EIP-4844)'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Deneb 업그레이드(EIP-4844)는 <strong>blob</strong>을 도입해 L2 rollup의 데이터 기록 비용을 크게 낮췄습니다. blob은 실행에 들어가지 않고 ~18일만 보관되며, CL에서만 가용성이 검증됩니다.
        </p>
        <p>
          그런데 "이 blob이 진짜 약속된 내용인지"를 어떻게 검증할까요? 답이 <strong>KZG 커밋먼트</strong>입니다.
        </p>
        <p>
          blob 하나는 <strong>4096개의 field element</strong>(≈ 128 KB)로 이뤄진 데이터. 이를 <em>4095차 다항식의 계수</em>로 보면 blob = polynomial. 여기에 trusted setup의 "powers of τ" G1 포인트들을 스칼라 곱해 단일 G1 점으로 압축한 것이 <code>KzgCommitment</code>입니다.
        </p>
        <p>
          <code>KzgCommitment</code>는 48바이트 BLS12-381 G1 포인트, <code>KzgProof</code>도 48바이트. 특정 점 (x, y)이 그 다항식에 속하는지를 <em>pairing 하나</em>로 검증합니다: <code>e(proof, [τ]G2 − [x]G2) = e(commit − [y]G1, G2)</code>. 블록체인 DA가 다른 커밋먼트 대신 KZG를 고른 이유는 이 "증명 크기 O(1), 검증도 O(1)" 속성 때문입니다.
        </p>
        <p>
          <code>TrustedSetup</code>은 "Ethereum KZG Ceremony"로 14만 명 이상이 참여해 생성한 공개 파라미터(G1/G2 monomial + lagrange 기저). <em>한 명이라도 정직하면</em> τ가 파괴돼 setup 자체를 안전하게 쓸 수 있습니다. Lighthouse는 이 setup에서 <code>compute_blob_kzg_proof</code> / <code>verify_blob_kzg_proof_batch</code>를 구현합니다.
        </p>
        <p>
          <strong>PeerDAS</strong>는 Ethereum의 차세대 DA 계층 계획입니다. blob 전체 대신 <em>셀 단위</em>로 잘라(128 cells/blob) 각 노드가 일부만 저장 → 네트워크 전체에서는 완전한 가용성 보장. <code>compute_cells_and_kzg_proofs</code>가 4096 field element를 8192로 erasure extend한 뒤 128개 셀로 나눠 각 셀마다 KZG proof를 생성합니다.
        </p>
        <p>
          백엔드는 <strong>C-KZG</strong>(Ethereum Foundation, C FFI)와 <strong>Rust-ETH-KZG</strong>(pure Rust) 두 개 — feature flag로 선택. 성능은 C-KZG가 우위, 메모리 안전성은 Rust-ETH-KZG.
        </p>
        <p>
          같은 주제 더 깊이:{' '}
          <a href="/blog/blockchain/reth-eip4844" className="underline">Reth EIP-4844 Blob TX</a> ·{' '}
          <a href="/blog/gpu/kzg-gpu" className="underline">KZG 커밋먼트 GPU (SRS, MSM)</a> ·{' '}
          <a href="/blog/blockchain/erasure-coding" className="underline">Erasure Coding & DAS</a>
        </p>
      </div>
      <KZGBlobViz />
    </section>
  );
}
