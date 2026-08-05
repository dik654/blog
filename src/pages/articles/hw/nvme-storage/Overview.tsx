import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 폼팩터가 중요한가</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          NVMe 스토리지 <strong>3가지 폼팩터 비교</strong>.<br />
          M.2 (consumer), U.2 (server), E1.S (datacenter).<br />
          form factor = cooling + density + power + durability.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Cooling</h3>
        <ul className="leading-7">
          <li>M.2 — 작은 PCB, 열 발산 한계</li>
          <li>U.2 — 금속 chassis, 우수한 냉각</li>
          <li>E1.S — 슬림 + airflow 최적화</li>
          <li>thermal throttling 위험은 형태에 따라 다릅니다</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">전력 예산</h3>
        <ul className="leading-7">
          <li>M.2 — 5~8W</li>
          <li>U.2 — 15~25W</li>
          <li>E1.S — 20~25W (효율적)</li>
          <li>높은 전력 = 더 빠른 NAND 구동 가능</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">밀도 (per U)</h3>
        <ul className="leading-7">
          <li>M.2 — 2U 서버에 4~8 개</li>
          <li>U.2 — 2U 에 24~36 개</li>
          <li>E1.S — 1U 에 32+ 개</li>
          <li>밀도가 곧 $/TB 효율</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">내구성 (DWPD)</h3>
        <ul className="leading-7">
          <li>M.2 consumer — 0.3~1 DWPD</li>
          <li>M.2 enterprise — 1~3 DWPD</li>
          <li>U.2 enterprise — 3~10 DWPD</li>
          <li>write-heavy 워크로드는 높은 DWPD 필요</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">Hot-swap</h3>
        <ul className="leading-7">
          <li>M.2 — 불가 (서버 downtime 필요)</li>
          <li>U.2 — 가능 (전면 접근 slot)</li>
          <li>E1.S — 가능 (현대 데이터센터)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">가격</h3>
        <ul className="leading-7">
          <li>M.2 consumer — $80~$120/TB</li>
          <li>M.2 enterprise — $150~$250/TB</li>
          <li>U.2 enterprise — $200~$400/TB</li>
          <li>E1.S — $250~$500/TB (신규)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">프로토콜 스택</h3>
        <ul className="leading-7">
          <li>Physical — PCIe lane 보통 4 개</li>
          <li>Protocol — NVMe (AHCI 아님)</li>
          <li>Queue depth — 64K × 64K command</li>
          <li>IOPS — 1M+ random read</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">진화</h3>
        <ul className="leading-7">
          <li>2013 — M.2 2280 도입</li>
          <li>2014 — U.2 (SFF-8639)</li>
          <li>2019 — E1.L / E1.S 스펙 (OCP)</li>
          <li>2021 — E3.S 도입</li>
          <li>2024 — PCIe 5.0 보편화</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">성능 (PCIe 4.0 x4)</h3>
        <ul className="leading-7">
          <li>순차 read — 7 GB/s</li>
          <li>순차 write — 6.8 GB/s</li>
          <li>random read — 1.5M IOPS</li>
          <li>random write — 1.3M IOPS</li>
          <li>latency — &lt;100 μs</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">PCIe 5.0 (2024)</h3>
        <p className="leading-7">
          순차 12~14 GB/s, 2M+ IOPS. 대역폭 2배, latency 는 비슷한 수준.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Filecoin SP 고려사항</h3>
        <ul className="leading-7">
          <li>PC1 sealing — 무거운 순차 쓰기</li>
          <li>DWPD 3+ 권장</li>
          <li>U.2 가 일반적 선택</li>
          <li>드라이브당 1~2 TB</li>
        </ul>
        <p className="leading-7">
          NVMe 결정: <strong>cooling + power + density + DWPD + hot-swap</strong>.<br />
          M.2 (consumer $80/TB) → U.2 (enterprise $300/TB) → E1.S (density).<br />
          PCIe 4.0: 7GB/s, PCIe 5.0: 14GB/s.
        </p>
      </div>
    </section>
  );
}
