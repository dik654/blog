import { motion } from 'framer-motion';

const generations = [
  { gen: 'FDR', rate: '56 Gbps', use: '레거시 HPC' },
  { gen: 'EDR', rate: '100 Gbps', use: '이전 세대 GPU 클러스터' },
  { gen: 'HDR', rate: '200 Gbps', use: 'DGX A100 (8x A100)' },
  { gen: 'NDR', rate: '400 Gbps', use: 'DGX H100 (8x H100)' },
];

const useCases = [
  { use: '블록체인 노드 (Reth/Geth)', need: '10G 이더넷 충분', reason: '블록 ~100KB, TX 전파 ~1KB' },
  { use: 'ML 학습 클러스터', need: 'InfiniBand NDR', reason: '텐서 병렬: GPU 간 GB/s 단위 통신' },
  { use: '분산 ZK 증명', need: '25G+ 이더넷', reason: '증명 조각 교환, 메모리 풀 공유' },
];

export default function InfiniBand() {
  return (
    <section id="infiniband" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">InfiniBand: GPU 클러스터 연결</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          InfiniBand는 GPU 클러스터 전용 인터커넥트입니다.<br />
          NVLink(노드 내 GPU 간)과 InfiniBand(노드 간)가 함께 DGX 스케일을 구성합니다.
        </p>
        <div className="overflow-x-auto not-prose mb-6">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['세대', '대역폭', '대표 구성'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {generations.map((g) => (
                <motion.tr key={g.gen} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{g.gen}</td>
                  <td className="border border-border px-3 py-2">{g.rate}</td>
                  <td className="border border-border px-3 py-2">{g.use}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">용도별 네트워크 선택</h3>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['용도', '필요 네트워크', '이유'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {useCases.map((u) => (
                <motion.tr key={u.use} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{u.use}</td>
                  <td className="border border-border px-3 py-2">{u.need}</td>
                  <td className="border border-border px-3 py-2">{u.reason}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">InfiniBand 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// InfiniBand (IB):

// History:
// - 1999: IBTA (InfiniBand Trade Association)
// - 2000s: HPC systems
// - 2010s: Mellanox dominance
// - 2019: NVIDIA acquires Mellanox
// - 2020s: AI cluster standard

// Architecture:
// - switched fabric
// - not Ethernet-based
// - native RDMA
// - lossless by design

// Key components:
// 1. HCA (Host Channel Adapter):
//    - NIC equivalent
//    - hardware RDMA
//    - per-server
//
// 2. Switch:
//    - fabric fabric
//    - low latency (<100 ns)
//    - cut-through forwarding
//
// 3. Cables:
//    - copper (DAC) or fiber (AOC)
//    - shorter reach than Ethernet
//    - expensive but fast

// Speed evolution:
// - SDR (2003): 10 Gbps
// - DDR (2005): 20 Gbps
// - QDR (2008): 40 Gbps
// - FDR (2011): 56 Gbps
// - EDR (2014): 100 Gbps
// - HDR (2018): 200 Gbps
// - NDR (2022): 400 Gbps
// - XDR (2024): 800 Gbps

// Performance characteristics:
// - latency: 300-600 ns switch hop
// - end-to-end: <1-2 μs
// - message rate: 200M+ msg/s
// - overhead: ~3% (vs ~10% Ethernet)

// NVLink vs InfiniBand:
//
// NVLink (inside node):
// - GPU-to-GPU direct
// - 900 GB/s (H100)
// - 1.8 TB/s (B200)
// - very short distance
// - NVLink Switch for 256-GPU

// InfiniBand (between nodes):
// - node-to-node
// - 400-800 Gbps
// - longer distance (100m+)
// - scales to 1000s of nodes

// NVIDIA DGX topology:
// Single DGX H100:
// - 8× H100 + NVLink
// - 900 GB/s between GPUs
// - 4× ConnectX-7 (400G IB)
//
// DGX SuperPOD:
// - 127 DGX H100 (1016 GPUs)
// - IB fat-tree topology
// - 400 Gbps per GPU
// - 100s of IB switches

// Use cases:
// ✓ AI training (required)
// ✓ HPC simulations
// ✓ Financial trading
// ✓ Scientific computing
// ✓ Some storage systems

// Alternatives:
// - Ultra Ethernet (new, 2024)
// - RoCE v2 (mature)
// - Slingshot (HPE Cray)

// Cost:
// - NDR HCA: $2K-3K
// - 64-port switch: $50K-100K
// - cables: $300-1000 each
// - full cluster: $1M+
// - premium but required for AI

// 2024 state:
// - InfiniBand NDR standard
// - XDR rolling out (2024-2025)
// - Ethernet catching up (800G)
// - BlueField DPUs (smart NICs)
// - UEC (Ultra Ethernet Consortium)

// Software stack:
// - OFED (OpenFabrics Enterprise Distribution)
// - MOFED (Mellanox OFED)
// - UCX
// - NCCL (NVIDIA)
// - MPI implementations`}
        </pre>
        <p className="leading-7">
          InfiniBand: <strong>HPC/AI interconnect, 400-800 Gbps NDR/XDR</strong>.<br />
          latency &lt;1μs, 900 GB/s NVLink + 400G IB typical (DGX).<br />
          AI training 표준, Ultra Ethernet이 2024+ 경쟁.
        </p>
      </div>
    </section>
  );
}
