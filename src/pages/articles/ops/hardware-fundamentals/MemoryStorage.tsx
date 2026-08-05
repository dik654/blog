import MemoryHierarchyViz from './viz/MemoryHierarchyViz';

export default function MemoryStorage() {
  return (
    <section id="memory-storage" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">3. 메모리 · 스토리지 — DDR5 · HBM · HBF · NVMe · HDD</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          AI / 블록체인 / Storage Provider 의 메모리 결정은 <strong>계층 (latency/bandwidth/cost) 의 적합한 위치 선택</strong> 이다.
          <br />
          GPU 의 HBM 이 부족하면 학습 OOM, 시스템 메모리가 부족하면 sealing 실패, NVMe 가 부족하면 검증자 inclusion delay, HDD 가 부족하면 SP 의 capacity 한계.
        </p>
      </div>
      <MemoryHierarchyViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-10">
        <h3 className="text-xl font-semibold mt-8 mb-3">3-1. HBM (High Bandwidth Memory) — GPU 옆에 stack</h3>
        <ul className="leading-7">
          <li><strong>구조</strong> — 8~12 stack 의 DRAM die 를 GPU die 옆에 TSV (Through-Silicon Via) 로 연결. 1024-bit 인터페이스 (DDR 의 64-bit 대비 16x).</li>
          <li><strong>HBM3 (H100, MI300X)</strong> — 819 GB/s × stack. 5~8 stack = 4~6 TB/s.</li>
          <li><strong>HBM3e (H200, B200)</strong> — 1.2 TB/s × stack. 더 빠름 + 더 큰 capacity (24 GB / stack).</li>
          <li><strong>HBM4 (예정)</strong> — 2026~ 도입 예상. 더 큰 capacity + 더 높은 bandwidth.</li>
          <li><strong>제조사</strong> — SK Hynix (점유율 ↑), Samsung, Micron. SK Hynix 가 NVIDIA 의 주 공급. 한국 반도체 수출의 큰 비중.</li>
          <li><strong>가격</strong> — GPU 가격의 큰 비중. H100 80 GB 의 BOM 중 HBM 만 ~$2000.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-2. HBF (High Bandwidth Flash) — 실험적</h3>
        <ul className="leading-7">
          <li><strong>아이디어</strong> — HBM 인터페이스를 NAND flash 에 적용. capacity TB 급, 가격 ↓.</li>
          <li><strong>위치</strong> — HBM 보다 느림 (수백 GB/s vs TB/s), DRAM 보다 빠름 (PCIe NVMe 보다 훨씬 빠름).</li>
          <li><strong>용도 후보</strong> — LLM weight cache (큰 모델의 cold weight 보관), KV cache 의 cold tier.</li>
          <li><strong>제조</strong> — 미디어 보도 단계. Samsung · SK Hynix 가 검토 중. 2026~2027 양산 예상.</li>
          <li><strong>위험</strong> — write endurance (NAND 본질). cache 같은 read-heavy 워크로드 적합, write 무거우면 단명.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-3. DDR5 시스템 메모리</h3>
        <ul className="leading-7">
          <li><strong>속도 진화</strong> — DDR5-4800 (Sapphire Rapids) → 5600 (Emerald) → 6400 (Granite/Turin).</li>
          <li><strong>채널</strong> — Genoa/Granite 12 채널. 노드당 24 DIMM (6 × 2 socket).</li>
          <li><strong>RDIMM vs MRDIMM</strong> — MRDIMM 이 두 rank 동시 활성, bandwidth 1.4x. Granite Rapids 부터 지원.</li>
          <li><strong>CXL (Compute Express Link)</strong> — DDR 외 메모리 풀링 / 확장. CXL 2.0/3.0. 대형 노드의 NUMA 우회용.</li>
          <li><strong>ECC</strong> — 서버는 필수. 컨슈머 메모리 (non-ECC) 는 silent corruption 위험.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-4. NVMe SSD — 엔터프라이즈 vs 컨슈머</h3>
        <ul className="leading-7">
          <li><strong>인터페이스</strong> — PCIe 4.0 (7 GB/s) → 5.0 (14 GB/s). 곧 6.0 (28 GB/s).</li>
          <li><strong>폼 팩터</strong> — U.2 (2.5&quot; 핫스왑) · E1.S (EDSFF, hyperscale 표준) · M.2 (소비자).</li>
          <li><strong>TBW (Total Bytes Written)</strong> — 쓰기 endurance. 컨슈머 1~3 PB. 엔터프라이즈 14~50 PB. Filecoin sealing 이나 검증자 DB 같은 write heavy 워크로드는 엔터프라이즈 필수.</li>
          <li><strong>PLP (Power Loss Protection)</strong> — 정전 시 in-flight write commit. 컨슈머 SSD 에 없음 → DB corrupt 위험. 엔터프라이즈에 의무.</li>
          <li><strong>벤더</strong> — Samsung PM9A3 / PM1733 (밸런스), Intel/Solidigm D7-P5510 (TBW + PLP), SK Hynix PE8010, Micron 7450.</li>
          <li><strong>QLC vs TLC</strong> — QLC 는 cell 당 4 bit (가격 ↓ capacity ↑) 지만 write endurance ↓. read-heavy 만. Filecoin sealed sector 보관처럼 write 적은 곳 OK.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-5. HDD — 여전히 cold 보관의 왕</h3>
        <ul className="leading-7">
          <li><strong>CMR (Conventional Magnetic Recording)</strong> — 표준. write 안정.</li>
          <li><strong>SMR (Shingled Magnetic Recording)</strong> — 트랙 겹침으로 capacity ↑, 단 random write 성능 ↓. archive 전용.</li>
          <li><strong>HAMR (Heat-Assisted Magnetic Recording)</strong> — Seagate 의 차세대. 30+ TB. 2024 양산.</li>
          <li><strong>벤더</strong> — Seagate (HAMR 선도), Western Digital (HelioSeal), Toshiba (저비용).</li>
          <li><strong>적합</strong> — Filecoin sealed sector, 백업, 콜드 archive. 검증자 DB · sealing scratch 에는 절대 부적합 (latency).</li>
          <li><strong>RAID 패턴</strong> — RAIDZ2 (parity 2) 가 표준. 18 TB 단일 디스크의 unrecoverable error rate 고려하면 RAID5 는 rebuild 위험.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-6. 운영 결정 — 워크로드별 메모리 stack</h3>
        <ul className="leading-7">
          <li><strong>LLM 학습 호스트</strong> — HBM3e (H200/B200) 8 장 + DDR5 1.5 TB (host RAM) + NVMe 8 TB (체크포인트).</li>
          <li><strong>LLM 추론 노드</strong> — HBM3 (H100/MI300X) + DDR5 512 GB (KV cache spillover) + NVMe 4 TB (모델 weight).</li>
          <li><strong>이더리움 EL 노드</strong> — DDR5 64 GB + NVMe 4 TB (Reth/Geth state).</li>
          <li><strong>Filecoin sealing 워커</strong> — DDR5 256 GB + NVMe 4 TB (PC1 scratch).</li>
          <li><strong>Filecoin SP 영구 보관</strong> — HDD 18 TB × 수십 (RAIDZ2) + warm SSD cache.</li>
        </ul>
      </div>
    </section>
  );
}
