import SealingPipelineViz from './viz/SealingPipelineViz';

export default function SealingPipeline() {
  return (
    <section id="sealing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">1. 봉인 파이프라인 — PC1·PC2·C1·C2 의 자원 사용 패턴</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Filecoin 의 sealing 은 한 sector (32 GiB 또는 64 GiB) 를 영구 보관 가능한 형태로 변환하는 5 단계 (AddPiece + PC1 + PC2 + C1 + C2) 다.
          <br />
          핵심은 각 단계가 <strong>완전히 다른 자원을 점유한다</strong>는 것 — CPU heavy, GPU heavy, SSD heavy, RAM heavy 가 시간차로 발생한다.
          <br />
          이 차이를 알고 풀을 설계하면 같은 하드웨어로 throughput 이 3~5 배 차이 난다.
        </p>
      </div>
      <SealingPipelineViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-10">
        <h3 className="text-xl font-semibold mt-8 mb-3">1-1. PC1 — SDR (Stacked Depth Robust) 그래프 빌드</h3>
        <p className="leading-7">
          PC1 은 32 GiB 데이터를 <strong>11 layer 의 SDR labeling</strong> 으로 변환한다.
          <br />
          각 노드의 라벨이 직전 layer 의 인접 노드 + DRG (Depth Robust Graph) 의 expander 노드들의 hash 라, 본질적으로 거대한 메모리 덮어쓰기 + hash 연산 시퀀스다.
        </p>
        <ul className="leading-7">
          <li><strong>자원</strong> — CPU 단일 코어 (병렬화 어려움), 3~5 시간 (CPU 종류 의존), SSD ~512 GiB write 누적, RAM 128 GiB+ 권장 (cache 화면).</li>
          <li><strong>병목</strong> — SSD IOPS. NVMe 가 아니면 SATA SSD 는 PC1 시간이 2 배 이상 늘어남.</li>
          <li><strong>최적화</strong> — 워커 한 노드에 CPU 64 코어 + NVMe 3.84 TB+ + RAM 256 GB 가 표준. 동시 PC1 슬롯은 CPU 코어 수가 아닌 SSD bandwidth 로 결정.</li>
          <li><strong>실수 패턴</strong> — &quot;코어 많으면 동시 PC1 슬롯도 많이&quot; 가정. 실제로는 SSD bandwidth 가 한계라 슬롯 늘리면 모든 슬롯이 같이 느려짐.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">1-2. PC2 — Merkle Tree 빌드</h3>
        <p className="leading-7">
          PC2 는 PC1 의 11 layer 결과를 Merkle Tree 로 묶어 sealed sector 의 root commitment (CommR) 을 만든다.
        </p>
        <ul className="leading-7">
          <li><strong>자원</strong> — GPU heavy (CUDA · OpenCL), 10~30 분, SSD read 위주, RAM 32 GB.</li>
          <li><strong>병목</strong> — GPU 큐. PC1 워커 3~5 대당 GPU 1 개가 적정 비율 (수치는 PC1 시간 / PC2 시간으로 결정).</li>
          <li><strong>GPU 선택</strong> — RTX 4090 / A100 / H100. VRAM 24 GB+ 권장. 컨슈머 GPU 도 충분한 영역이라 비용 효율 좋음.</li>
          <li><strong>네트워크</strong> — PC1 워커 → GPU 워커 데이터 전송 (~수 GB) — 10 GbE 이상 권장. 1 GbE 면 전송이 PC2 자체보다 더 걸림.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">1-3. C1 — Vanilla Proof 추출</h3>
        <p className="leading-7">
          C1 은 PC2 결과로부터 <strong>vanilla proof (Merkle path 모음)</strong> 을 추출한다. 다음 단계 (C2) 의 입력.
        </p>
        <ul className="leading-7">
          <li><strong>자원</strong> — CPU 단일, 수 분, SSD read, RAM 8 GB. 가장 가벼운 단계.</li>
          <li><strong>운영 의미</strong> — 짧으니 별도 큐 만들 필요 없음. C1 끝나면 즉시 C2 큐로.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">1-4. C2 — Groth16 SNARK 생성 (가장 큰 GPU 비용)</h3>
        <p className="leading-7">
          C2 는 vanilla proof 를 <strong>Groth16 SNARK</strong> (~192 byte) 로 압축한다.
          <br />
          Groth16 의 prover 는 큰 multi-scalar multiplication (MSM) + FFT 의 모음으로, GPU 에서 가장 효율적.
        </p>
        <ul className="leading-7">
          <li><strong>자원</strong> — GPU heavy + RAM 256 GB+, 1~2 시간, SSD scratch ~64 GB.</li>
          <li><strong>병목</strong> — GPU 메모리. 32 GiB sector C2 는 ~80 GB 의 인메모리 데이터 (witness · A/B/C 다항식 계수). 스왑하면 시간 폭증.</li>
          <li><strong>구현체</strong> — bellman / bellperson (Filecoin 공식, Rust + CUDA), supraseal (Supranational, 더 빠름).</li>
          <li><strong>GPU 선택</strong> — A100 80 GB 또는 H100 권장 (메모리 핵심). 4090 (24 GB) 은 swap 으로 가능하지만 시간 ~3 배.</li>
          <li><strong>운영 패턴</strong> — &quot;C2 GPU 풀&quot; 을 별도 노드로 분리. PC2 GPU 와 같이 두면 자원 경쟁.</li>
          <li><strong>최적화 흐름</strong> — Filecoin 의 트랜드는 supraseal 도입으로 C2 시간 단축 (1 시간 → 30 분). PoSt 도 같은 GPU 인프라 공유.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">1-5. 풀 설계 — 5~8 시간 한 sector 의 throughput 극대화</h3>
        <p className="leading-7">
          한 sector 봉인이 5~8 시간이라는 절대 시간을 줄일 수는 없다 (CPU/GPU 본질). 대신 <strong>여러 sector 를 시간차로 진행</strong>해 throughput 을 늘린다.
        </p>
        <ul className="leading-7">
          <li><strong>워커 분리</strong> — PC1 워커 (CPU/SSD heavy) · PC2/C2 워커 (GPU heavy) 별 노드. 각각 자기 자원 100% 활용.</li>
          <li><strong>적정 비율</strong> — PC1 노드 4 대당 GPU 노드 1 (PC1 5 시간, PC2+C2 ~1.5 시간 → 3~4 비율). 측정 후 조정.</li>
          <li><strong>스케줄링</strong> — Lotus 의 sealing scheduler 가 자동. 다만 풀 unbalance 면 PC1 큐 적체 또는 GPU 유휴 발생.</li>
          <li><strong>측정</strong> — Lotus의 <code>sectors stats</code>, <code>sealing jobs</code>. 평균 sealing 시간 모니터링.</li>
          <li><strong>regional</strong> — sealing 워커는 데이터 원본과 가까이 (낮은 네트워크 비용). 영구 보관은 데이터 전송 후 분산 가능.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">1-6. CC sector vs Deal sector — 전략 차이</h3>
        <ul className="leading-7">
          <li><strong>CC (Committed Capacity) sector</strong> — 무작위 데이터로 sealing. 고객 딜 없이 storage power 확보용. 기본은 CC, 딜 들어오면 snap deal 로 전환.</li>
          <li><strong>Deal sector</strong> — 고객 데이터로 sealing. piece (실 데이터) 가 sector 안에 들어감. retrieval 가능.</li>
          <li><strong>Snap Deal (SDR upgrade)</strong> — CC sector 를 deal sector 로 빠르게 변환 (재 sealing 안 함). 큰 SP 의 표준.</li>
          <li><strong>운영 결정</strong> — 영업 / 마케팅과 sealing 풀이 매치되어야 — 큰 deal 들어왔을 때 즉시 변환할 CC pool 이 미리 있어야.</li>
        </ul>
      </div>
    </section>
  );
}
