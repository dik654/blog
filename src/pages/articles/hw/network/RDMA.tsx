import { motion } from 'framer-motion';

const compare = [
  { attr: '레이턴시', tcp: '~50us', rdma: '~1us' },
  { attr: 'CPU 사용', tcp: '높음 (커널 스택 통과)', rdma: '최소 (NIC 직접 처리)' },
  { attr: '대역폭 효율', tcp: '~60-70%', rdma: '~95%+' },
  { attr: '필요 NIC', tcp: '일반 이더넷', rdma: 'RoCE v2 또는 IB HCA' },
  { attr: '스위치 요구', tcp: '일반 스위치', rdma: 'ECN/PFC 지원 스위치 (RoCE)' },
];

export default function RDMA() {
  return (
    <section id="rdma" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RDMA & RoCE v2</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          RDMA(Remote Direct Memory Access)는 원격 서버 메모리에 CPU 개입 없이 접근합니다.<br />
          RoCE v2는 일반 이더넷 위에서 RDMA를 구현한 프로토콜입니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['속성', '일반 TCP', 'RDMA/RoCE v2'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compare.map((c) => (
                <motion.tr key={c.attr} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{c.attr}</td>
                  <td className="border border-border px-3 py-2">{c.tcp}</td>
                  <td className="border border-border px-3 py-2">{c.rdma}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">RDMA 상세 분석</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// RDMA (Remote Direct Memory Access):

// Concept:
// - read/write remote memory directly
// - bypass OS kernel
// - bypass CPU (zero-copy)
// - HW-level address translation
// - like local memory access

// Traditional TCP/IP stack:
// app → kernel → TCP stack → NIC → wire
// ← reverse path
// - multiple data copies
// - context switches
// - CPU-intensive

// RDMA stack:
// app → verbs API → NIC DMA → wire
// - one data copy
// - zero CPU context switches
// - direct NIC-memory transfer

// RDMA operations:
// - SEND/RECV: message passing
// - WRITE: direct remote memory write
// - READ: direct remote memory read
// - Atomic: remote compare-and-swap

// 3 main implementations:

// 1. InfiniBand:
// - native RDMA protocol
// - purpose-built hardware
// - highest performance
// - proprietary (Mellanox/NVIDIA)

// 2. RoCE (RDMA over Converged Ethernet):
// - RDMA over standard Ethernet
// - v1: link-local
// - v2: routable (IP+UDP)
// - modern datacenters
// - requires lossless network

// 3. iWARP (Internet Wide Area RDMA):
// - RDMA over TCP
// - works over any IP network
// - higher latency
// - less common

// RoCE v2 requirements:
// - PFC (Priority Flow Control)
// - ECN (Explicit Congestion Notification)
// - DCQCN (DC QCN) for congestion
// - lossless fabric
// - PMT (Priority-based Matching Tables)

// Performance comparison:
//
// TCP/IP (standard):
// - latency: 50-100 μs
// - CPU usage: high
// - throughput efficiency: 60-70%
//
// RoCE v2:
// - latency: 1-3 μs
// - CPU usage: minimal
// - throughput efficiency: 95%+
//
// InfiniBand:
// - latency: <1 μs
// - CPU usage: minimal
// - throughput efficiency: 97%+

// Use cases:

// Distributed storage:
// - Ceph with RDMA
// - SPDK NVMe-oF
// - Lustre, GPFS
// - Windows S2D

// Databases:
// - Oracle RAC
// - SQL Server
// - in-memory DBs
// - fast replication

// AI Training:
// - NCCL (NVIDIA Collective)
// - all-reduce over RDMA
// - parameter server patterns
// - GPU-to-GPU direct

// Libraries:
// - libibverbs (native)
// - UCX (Unified Comm X)
// - libfabric
// - MPI implementations

// Linux kernel support:
// - RDMA subsystem
// - rdma-core userspace
// - kernel 4.14+ widespread
// - integrated since 3.x`}
        </pre>
        <p className="leading-7">
          RDMA: <strong>remote memory access, zero-copy, bypass CPU</strong>.<br />
          3 flavors: InfiniBand (native), RoCE v2 (Ethernet), iWARP (TCP).<br />
          latency 50μs → 1μs, CPU offload, 95%+ efficiency.
        </p>
      </div>
    </section>
  );
}
