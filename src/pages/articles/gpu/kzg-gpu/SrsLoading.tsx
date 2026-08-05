import SrsSizeViz from './viz/SrsSizeViz';
import SrsLoadingViz from './viz/SrsLoadingViz';

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
        <SrsSizeViz />

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
        <SrsLoadingViz />
      </div>
    </section>
  );
}
