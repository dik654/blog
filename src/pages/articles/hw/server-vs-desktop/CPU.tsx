import { motion } from 'framer-motion';

const rows = [
  { attr: '소켓', server: 'LGA 4677 (Xeon) / SP5 (EPYC)', desktop: 'LGA 1700 / AM5' },
  { attr: 'PCIe 레인', server: '80 (Xeon) / 128 (EPYC)', desktop: '20~24' },
  { attr: 'ECC 지원', server: '필수 (RDIMM)', desktop: '일부 (Ryzen PRO)' },
  { attr: 'TDP', server: '250~350W', desktop: '65~170W' },
  { attr: '코어 수', server: '최대 96코어 (EPYC)', desktop: '최대 24코어' },
];

export default function CPU() {
  return (
    <section id="cpu" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CPU: Xeon/EPYC vs Core/Ryzen</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          서버 CPU의 핵심 차이는 PCIe 레인 수와 ECC 메모리 지원입니다.<br />
          EPYC은 단일 소켓에 128 PCIe 레인을 제공해 다중 GPU 구성에 유리합니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['속성', '서버 (Xeon/EPYC)', '데스크톱 (Core/Ryzen)'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <motion.tr key={r.attr} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{r.attr}</td>
                  <td className="border border-border px-3 py-2">{r.server}</td>
                  <td className="border border-border px-3 py-2">{r.desktop}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Server vs Desktop CPU 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Intel Xeon 6 Series (2024):
// - Granite Rapids (performance cores)
// - Sierra Forest (efficiency cores)
// - socket: LGA 4710 / LGA 7529
// - up to 128 P-cores or 288 E-cores
// - up to 6 TB DDR5
// - 96 PCIe 5.0 lanes
// - max TDP: 500W

// AMD EPYC 9005 Series (Turin, 2024):
// - Zen 5 architecture
// - socket: SP5 (LGA 6096)
// - up to 192 cores
// - up to 6 TB DDR5
// - 128 PCIe 5.0 lanes
// - max TDP: 500W
// - CCX architecture

// Intel Core i9-14900K (desktop):
// - socket: LGA 1700
// - 24 cores (8P + 16E)
// - 2 memory channels
// - 20 PCIe lanes
// - 253W max
// - consumer focus

// AMD Ryzen 9 9950X (desktop):
// - socket: AM5
// - 16 cores Zen 5
// - 2 memory channels
// - 24 PCIe 5.0 lanes
// - 170W max
// - single CCX (monolithic)

// PCIe Lane Count 차이:
//
// Why lanes matter:
// - each GPU: 16 lanes (x16)
// - each NVMe: 4 lanes
// - network card: 8-16 lanes
// - lanes = direct paths to CPU
//
// Desktop limitations:
// - 20-24 lanes total
// - 1-2 GPUs at full speed
// - some NVMe share with chipset
// - bottleneck for multi-GPU
//
// Server advantage:
// - 96-128 lanes per socket
// - dual socket: 256 lanes
// - 8-16 GPUs at full x16
// - multiple NVMe arrays
// - network cards
// - no compromise

// Memory Channels:
// Desktop: 2 channels
// - max ~90 GB/s bandwidth
// - 2-4 DIMM slots
// - 128 GB capacity max
//
// Server: 8-12 channels
// - 400+ GB/s bandwidth
// - 16-32 DIMM slots
// - 6 TB capacity max
// - multi-node NUMA

// Workload fit:
//
// Desktop CPU suitable for:
// - Gaming (high clock, low cores)
// - Software development
// - Content creation (small)
// - Single-GPU AI training
//
// Server CPU required for:
// - Multi-GPU workstations
// - Filecoin sealing (PC1 CPU-bound)
// - Database servers
// - Virtualization hosts
// - HPC workloads

// Practical example (Filecoin SP):
// - PC1 uses all CPU cores sequentially
// - 64-core EPYC ideal
// - ~3-5 hours per sector
// - parallel sectors: need many cores
// - server CPU nearly mandatory`}
        </pre>
        <p className="leading-7">
          Server CPU: <strong>128 PCIe lanes, 8-12 memory channels, 192 cores</strong>.<br />
          Desktop: 20-24 lanes, 2 channels, 16-24 cores.<br />
          Filecoin PC1 = CPU-bound → EPYC 64-core+ 필수.
        </p>
      </div>
    </section>
  );
}
