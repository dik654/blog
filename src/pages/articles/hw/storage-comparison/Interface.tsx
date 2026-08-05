import { motion } from 'framer-motion';

const rows = [
  { proto: 'SATA (AHCI)', queue: '1큐 x 32커맨드', bw: '~550 MB/s', conn: 'SATA 커넥터', latency: '~100us' },
  { proto: 'NVMe', queue: '64K큐 x 64K커맨드', bw: '~7 GB/s (PCIe 4.0 x4)', conn: 'M.2 / U.2 / PCIe', latency: '~10us' },
  { proto: 'SAS', queue: '듀얼 포트', bw: '~2.4 GB/s (12Gbps)', conn: 'SFF-8644', latency: '~50us' },
];

export default function Interface() {
  return (
    <section id="interface" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">인터페이스: AHCI vs NVMe 큐 구조</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          SATA의 AHCI는 HDD 시대 설계입니다. 큐 1개에 커맨드 32개만 처리합니다.<br />
          NVMe는 PCIe에 직결되어 64K 큐로 I/O 병렬성을 극대화합니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['프로토콜', '큐 구조', '최대 대역폭', '커넥터', '레이턴시'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <motion.tr key={r.proto} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{r.proto}</td>
                  <td className="border border-border px-3 py-2">{r.queue}</td>
                  <td className="border border-border px-3 py-2">{r.bw}</td>
                  <td className="border border-border px-3 py-2">{r.conn}</td>
                  <td className="border border-border px-3 py-2">{r.latency}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">AHCI 설계 (2004)</h3>
        <ul className="leading-7">
          <li>HDD 전용 설계</li>
          <li>큐 1 개 × 32 command</li>
          <li>register 기반 통신</li>
          <li>높은 CPU 오버헤드</li>
          <li>순차 접근 최적화</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">SSD 에서 AHCI 한계</h3>
        <ul className="leading-7">
          <li>병렬성 활용 불가</li>
          <li>queue depth 병목</li>
          <li>SSD 잠재력 낭비</li>
          <li>sub-optimal latency</li>
          <li>throughput 상한</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">NVMe 큐 구조</h3>
        <ul className="leading-7">
          <li><strong>Admin Queue</strong> — 1 queue pair, 관리 command, firmware update, feature 설정.</li>
          <li><strong>I/O Queue</strong> — 최대 64K queue pair, 각 64K command. per-CPU 전용 큐, lock-free 설계, PCIe 직접 통신.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">NVMe Command Path</h3>
        <ol className="leading-7 list-decimal ml-6">
          <li>Application 이 I/O 제출</li>
          <li>OS 커널이 큐에 배치</li>
          <li>doorbell register 에 쓰기</li>
          <li>SSD 컨트롤러가 command 읽기</li>
          <li>DMA 데이터 전송</li>
          <li>Completion 알림</li>
          <li>CPU interrupt</li>
        </ol>

        <h3 className="text-xl font-semibold mt-8 mb-3">Queue Depth 스케일링</h3>
        <ul className="leading-7">
          <li>AHCI QD32 max — ~90K IOPS</li>
          <li>NVMe QD32 — ~250K IOPS</li>
          <li>NVMe QD256 — ~1M IOPS</li>
          <li>NVMe QD4096 — ~1.5M IOPS</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">Latency 분해</h3>
        <ul className="leading-7">
          <li><strong>AHCI</strong> — command 처리 30 μs + CPU 오버헤드 40 μs + SSD 처리 20 μs = ~90 μs</li>
          <li><strong>NVMe</strong> — command 처리 2 μs + CPU 오버헤드 5 μs + SSD 처리 10 μs = ~17 μs</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">CPU 효율</h3>
        <p className="leading-7">
          AHCI 는 1 core 가 250K IOPS 에서 saturate. NVMe 는 1 core 로 1.5M IOPS 처리 — 6배 효율.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">병렬 확장</h3>
        <ul className="leading-7">
          <li>1 core — 1.5M IOPS</li>
          <li>4 core — 5M IOPS</li>
          <li>8 core — 10M IOPS</li>
          <li>거의 선형 확장</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">현대 NVMe 기능</h3>
        <ul className="leading-7">
          <li>ZNS (Zoned Namespaces) — 순차 전용 zone</li>
          <li>SGL (Scatter-Gather List) — 효율적 DMA</li>
          <li>Multi-stream — write hinting</li>
          <li>Directives — QoS hint</li>
          <li>CMB (Controller Memory Buffer)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">SPDK (Kernel Bypass)</h3>
        <p className="leading-7">
          user-space NVMe 드라이버. poll-mode (interrupt 없음), near-hardware 성능. 스토리지 시스템에 사용.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">NVMe-oF (over Fabrics)</h3>
        <p className="leading-7">
          NVMe 를 네트워크 위에서. RDMA (RoCE, iWARP) / TCP / FC 전송. disaggregated storage 가능.
        </p>
        <p className="leading-7">
          NVMe: <strong>64K queues × 64K commands, per-CPU lock-free</strong>.<br />
          CPU efficiency 6x, latency 5x lower.<br />
          ZNS, SGL, NVMe-oF 등 현대 기능.
        </p>
      </div>
    </section>
  );
}
