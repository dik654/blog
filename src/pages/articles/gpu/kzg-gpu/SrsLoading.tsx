import CodePanel from '@/components/ui/code-panel';

const srsSize = `// SRS (Structured Reference String) 크기 분석
//
// SRS = [G, sG, s^2 G, ..., s^(n-1) G]  — n개의 G1 점
//
// BN254 G1 (affine): x(32B) + y(32B) = 64 bytes/point
// BLS12-381 G1 (affine): x(48B) + y(48B) = 96 bytes/point
//
// n = 2^20 (1M): BN254 = 64MB,  BLS12-381 = 96MB
// n = 2^24 (16M): BN254 = 1GB,  BLS12-381 = 1.5GB
// n = 2^26 (64M): BN254 = 4GB,  BLS12-381 = 6GB
// n = 2^28 (256M): BN254 = 16GB, BLS12-381 = 24GB
//
// GPU VRAM: RTX 4090=24GB, A100=40/80GB, H100=80GB`;

const loadingCode = `// SRS GPU 로딩 전략
//
// 1) Full Load — SRS 전체를 한 번에 GPU로 전송
//    cudaMemcpy(d_srs, h_srs, n * 64, H2D)
//    장점: 단순, MSM 호출 시 추가 전송 없음
//    조건: VRAM > SRS 크기 + 작업 메모리(버킷 등)
//
// 2) Chunked Streaming — SRS를 청크 단위로 스트리밍
//    for chunk in chunks(srs, chunk_size):
//        cudaMemcpyAsync(d_chunk, chunk, stream)
//        msm_partial(d_chunk, d_scalars_chunk, stream)
//    장점: VRAM이 작아도 대규모 MSM 가능
//    비용: PCIe 대역폭(~32GB/s)이 병목
//
// 3) Montgomery 전변환 — 로딩 시 한 번만 수행
//    to_montgomery_kernel<<<...>>>(d_srs, n)
//    이후 모든 MSM이 Montgomery 형태로 직접 연산`;

export default function SrsLoading() {
  return (
    <section id="srs-loading" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SRS 로딩과 GPU 메모리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          KZG의 SRS는 Trusted Setup에서 생성된 [G, sG, s^2 G, ...]이다.<br />
          다항식 차수가 n이면 n개의 G1 점이 필요하다.<br />
          BN254 기준 점 하나가 64바이트이므로, n이 커지면 수 GB에 달한다.
        </p>
        <p>
          GPU 가속의 첫 단계는 이 SRS를 디바이스 메모리로 올리는 것이다.<br />
          VRAM 용량에 따라 전략이 달라진다.<br />
          RTX 4090(24GB)은 n = 2^26까지 가능하지만, 버킷 테이블 등 작업 메모리를 고려하면 빠듯하다.<br />
          A100/H100(40~80GB)은 n = 2^28까지도 한 번에 올릴 수 있다.
        </p>
        <CodePanel title="SRS 크기와 GPU VRAM 비교" code={srsSize} annotations={[
          { lines: [3, 3], color: 'sky', note: 'SRS 정의' },
          { lines: [5, 6], color: 'emerald', note: '점당 크기: 64B vs 96B' },
          { lines: [8, 11], color: 'amber', note: '차수별 전체 크기' },
          { lines: [13, 13], color: 'violet', note: 'GPU VRAM 비교' },
        ]} />

        <h3 className="text-xl font-semibold mt-8 mb-3">로딩 전략</h3>
        <p>
          Full Load는 가장 단순하다. SRS를 한 번 전송한 뒤 모든 커밋에 재사용한다.<br />
          VRAM이 부족하면 Chunked Streaming으로 SRS를 분할 전송하면서 부분 MSM을 누적한다.<br />
          PCIe 4.0 x16 기준 ~32GB/s이므로 4GB SRS 전송에 약 125ms가 소요된다.
        </p>
        <p>
          로딩 직후 Montgomery 형태로 한 번 변환해두면, 이후 모든 Fp 곱셈에서 나눗셈을 피할 수 있다.<br />
          이 전변환 비용은 n = 2^26 기준 수 ms 수준으로, 반복 MSM에서 상각된다.
        </p>
        <CodePanel title="SRS 로딩 전략 3가지" code={loadingCode} annotations={[
          { lines: [3, 5], color: 'sky', note: 'Full Load: 단순 전송' },
          { lines: [7, 12], color: 'emerald', note: 'Chunked: VRAM 절약' },
          { lines: [14, 16], color: 'amber', note: 'Montgomery 전변환' },
        ]} />
      </div>
    </section>
  );
}
