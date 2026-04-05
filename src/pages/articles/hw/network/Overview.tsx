import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 서버 네트워크가 다른가</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          서버 네트워크: <strong>10G/25G/100G Ethernet, RDMA, InfiniBand</strong>.<br />
          블록체인 노드 vs GPU 클러스터 요구사항 근본적 차이.<br />
          latency + throughput + CPU offload 3축.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">서버 네트워크 요구사항</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 서버 네트워크 요구사항:

// Workload별 특성:

// 1. Blockchain Node:
// - 블록 전파: ~100 KB
// - TX gossip: ~1 KB
// - peer sync: periodic bursts
// - 10G Ethernet 충분
// - low latency helpful

// 2. Database Server:
// - client queries: varied
// - replication: steady
// - backup: periodic large
// - 25G Ethernet typical

// 3. Distributed Storage (Filecoin):
// - data upload: GB-TB bursts
// - retrieval: streaming
// - deal negotiation: small
// - 25-100G Ethernet ideal

// 4. GPU Cluster (AI):
// - all-reduce training: massive
// - parameter sync: continuous
// - large model distribution
// - InfiniBand 400G essential
// - NVLink inside chassis

// 5. HPC Cluster:
// - tight coupling
// - latency critical
// - MPI collectives
// - InfiniBand standard

// Latency Requirements:
// - bulk transfer: 1-10 ms OK
// - database: <1 ms target
// - distributed DB: <100 μs
// - HPC/AI: <10 μs
// - trading: <1 μs (specialty)

// Network Topology:

// Spine-Leaf (standard):
// - Leaf switches: TOR (Top of Rack)
// - Spine switches: inter-rack
// - East-West traffic optimized
// - non-blocking (ideally)
// - 3:1 oversubscription common

// Fat Tree:
// - hierarchical
// - multiple paths
// - HPC/AI standard
// - equal cost multipath

// Dragonfly:
// - HPC optimization
// - shorter diameter
// - specialized

// Key metrics:
// - bandwidth: bits/second
// - throughput: effective payload
// - latency: RTT or one-way
// - jitter: variability
// - packet loss: errors

// Network cards (NICs):
// - Mellanox ConnectX-6/7 (NVIDIA)
// - Intel E810, X710
// - Broadcom NetXtreme
// - Chelsio T6
// - SmartNICs (DPU): BlueField, IPU

// DPU (Data Processing Unit):
// - programmable NIC
// - offloads: VPN, encryption, storage
// - ARM cores on board
// - datacenter acceleration`}
        </pre>
        <p className="leading-7">
          Network: <strong>workload-dependent (10G → 400G)</strong>.<br />
          blockchain: 10G OK, AI cluster: InfiniBand 400G 필수.<br />
          spine-leaf topology, Mellanox ConnectX primary.
        </p>
      </div>
    </section>
  );
}
