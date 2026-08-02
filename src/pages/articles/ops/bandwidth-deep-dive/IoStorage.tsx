export default function IoStorage() {
  return (
    <section id="io-storage" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">4. I/O Bandwidth — Storage · PCIe · 데이터 로딩</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          GPU / 메모리 못지않게 storage / PCIe bandwidth 도 운영 결정.
          <br />
          Filecoin sealing 의 SSD bandwidth · LLM 학습의 데이터 로딩 · 검증자의 chain DB read 모두 영향.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">4-1. Storage Bandwidth 계층</h3>
        <ul className="leading-7">
          <li><strong>HDD SATA</strong> — 250 MB/s sequential, 1 ms latency, ~120 IOPS.</li>
          <li><strong>SATA SSD</strong> — 550 MB/s sequential, 0.1 ms latency, ~100k IOPS.</li>
          <li><strong>SAS SSD</strong> — 1 GB/s, ~200k IOPS. 엔터프라이즈 RAID.</li>
          <li><strong>NVMe PCIe 4.0</strong> — 7 GB/s, ~50 μs latency, ~1M IOPS.</li>
          <li><strong>NVMe PCIe 5.0</strong> — 14 GB/s, ~50 μs latency, ~2M IOPS.</li>
          <li><strong>의미</strong> — Filecoin PC1 의 SSD write 512 GiB/sector, NVMe 14 GB/s 면 ~37 초 (이상치). 실제는 IOPS 한계로 더 느림.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">4-2. Sequential vs Random I/O</h3>
        <ul className="leading-7">
          <li><strong>Sequential</strong> — 큰 연속 read/write. peak bandwidth 가능.</li>
          <li><strong>Random</strong> — 작은 random access. IOPS 한계 → 실제 BW 가 peak 의 1/10.</li>
          <li><strong>예시</strong> — Postgres 의 index scan 은 random, table scan 은 sequential. 다른 패턴.</li>
          <li><strong>이더리움 EL state DB</strong> — random 위주. NVMe IOPS (특히 4 KB random read) 가 결정.</li>
          <li><strong>Filecoin sealed sector cache PoSt</strong> — random read. NVMe 또는 SAS SSD 필수, HDD 면 마감 못 맞춤.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">4-3. PCIe — 모든 device 의 공통 bus</h3>
        <ul className="leading-7">
          <li><strong>PCIe 4.0 x16</strong> — 32 GB/s 양방향. GPU / 100G NIC 표준.</li>
          <li><strong>PCIe 5.0 x16</strong> — 64 GB/s. H100 / B200 + 400G NIC.</li>
          <li><strong>PCIe 6.0 x16</strong> — 128 GB/s. 2025+ 도입.</li>
          <li><strong>lane sharing</strong> — 데스크톱 24 lane 은 GPU + NVMe 1 + 별로 없음. 서버 128 lane 은 8 GPU full + NVMe 풀 + NIC.</li>
          <li><strong>의외 병목</strong> — 데이터셋이 NVMe 에 있고 학습이 GPU 에서 → PCIe 통과. PCIe 4.0 x4 NVMe (7 GB/s) → 데이터 로딩이 GPU compute 를 못 따라감.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">4-4. AI 학습의 데이터 로딩 병목</h3>
        <ul className="leading-7">
          <li><strong>증상</strong> — GPU utilization 50% 정도, 학습 시간 추정의 2x.</li>
          <li><strong>원인</strong> — DataLoader 가 GPU 보다 느림. CPU preprocessing + I/O 병목.</li>
          <li><strong>해결 1</strong> — torch DataLoader 의 <code>num_workers</code> 늘리기. 8~16 권장.</li>
          <li><strong>해결 2</strong> — pin_memory + non_blocking transfer. CPU → GPU 비동기.</li>
          <li><strong>해결 3</strong> — 데이터셋을 NVMe 로 (HDD/NAS X). webdataset / mosaicml 같은 streaming.</li>
          <li><strong>해결 4</strong> — pre-shuffled + binary format (parquet · webdataset · tfrecord). JSON 파싱 비용 제거.</li>
          <li><strong>해결 5</strong> — GPUDirect Storage — NVMe → GPU 직접 DMA, CPU 우회. cuDF / RAPIDS.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">4-5. 클라우드 storage 의 함정</h3>
        <ul className="leading-7">
          <li><strong>EBS gp3</strong> — 기본 125 MB/s. 더 필요하면 추가 비용 (provisioned bandwidth).</li>
          <li><strong>EBS io2 / gcp pd-extreme</strong> — 가상 NVMe IOPS 보장. 비싸지만 검증자 / DB 에 필수.</li>
          <li><strong>S3 직접 read</strong> — request 당 latency 50~100 ms. 학습 data loading 부적합 (caching layer 필수).</li>
          <li><strong>Local NVMe (instance store)</strong> — 빠름 + 무료지만 instance 종료 시 데이터 손실. sealing scratch 같은 임시용.</li>
          <li><strong>운영 결정</strong> — Filecoin SP 가 클라우드 어려운 이유 = HDD bandwidth × capacity 가 클라우드에서 비용 폭증.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">4-6. CXL — 차세대 메모리 / 디바이스 인터커넥트</h3>
        <ul className="leading-7">
          <li><strong>CXL 1.1 / 2.0 / 3.0</strong> — PCIe physical layer 위에 cache-coherent protocol.</li>
          <li><strong>CXL.mem</strong> — 외부 device 의 메모리를 CPU memory 처럼 사용. NUMA-like 추가 layer.</li>
          <li><strong>유스 케이스</strong> — 메모리 풀링 (한 노드에 1 TB DDR + 2 TB CXL). 큰 데이터셋 in-memory 처리.</li>
          <li><strong>현재</strong> — Granite Rapids · Turin 부터 본격 지원. 양산 적용은 2025+.</li>
        </ul>
      </div>
    </section>
  );
}
