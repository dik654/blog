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

        <h3 className="text-xl font-semibold mt-8 mb-3">개념</h3>
        <p className="leading-7">
          원격 메모리에 직접 read/write. OS 커널과 CPU 우회 (zero-copy). HW 레벨 주소 변환. 마치 로컬 메모리 접근처럼 동작.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">스택 비교</h3>
        <ul className="leading-7">
          <li><strong>Traditional TCP/IP</strong> — app → kernel → TCP stack → NIC → wire. 다중 데이터 복사, context switch, CPU 집약적.</li>
          <li><strong>RDMA</strong> — app → verbs API → NIC DMA → wire. 1회 복사, context switch 0, NIC ↔ memory 직접 전송.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">RDMA 연산</h3>
        <ul className="leading-7">
          <li>SEND/RECV — 메시지 전달</li>
          <li>WRITE — 원격 메모리 직접 쓰기</li>
          <li>READ — 원격 메모리 직접 읽기</li>
          <li>Atomic — 원격 compare-and-swap</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">3 가지 구현</h3>
        <ul className="leading-7">
          <li><strong>InfiniBand</strong> — 네이티브 RDMA 프로토콜. 전용 하드웨어, 최고 성능. Mellanox/NVIDIA 독점.</li>
          <li><strong>RoCE (RDMA over Converged Ethernet)</strong> — 표준 Ethernet 위에 RDMA. v1 link-local, v2 routable (IP+UDP). 현대 데이터센터, lossless 네트워크 필수.</li>
          <li><strong>iWARP</strong> — TCP 위에 RDMA. 모든 IP 네트워크 동작, latency 높고 사용 적다.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">RoCE v2 요구사항</h3>
        <ul className="leading-7">
          <li>PFC (Priority Flow Control)</li>
          <li>ECN (Explicit Congestion Notification)</li>
          <li>DCQCN — congestion 제어</li>
          <li>lossless fabric</li>
          <li>PMT (Priority-based Matching Tables)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">성능 비교</h3>
        <ul className="leading-7">
          <li><strong>TCP/IP</strong> — latency 50~100 μs, CPU 사용 높음, 효율 60~70%</li>
          <li><strong>RoCE v2</strong> — latency 1~3 μs, CPU 최소, 효율 95%+</li>
          <li><strong>InfiniBand</strong> — latency &lt;1 μs, CPU 최소, 효율 97%+</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">용도</h3>
        <ul className="leading-7">
          <li><strong>Distributed Storage</strong> — Ceph with RDMA, SPDK NVMe-oF, Lustre, GPFS, Windows S2D.</li>
          <li><strong>Databases</strong> — Oracle RAC, SQL Server, in-memory DB, 고속 replication.</li>
          <li><strong>AI Training</strong> — NCCL (NVIDIA Collective), all-reduce over RDMA, parameter server, GPU-to-GPU 직접.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">라이브러리 / 커널 지원</h3>
        <ul className="leading-7">
          <li>libibverbs (네이티브)</li>
          <li>UCX (Unified Comm X)</li>
          <li>libfabric</li>
          <li>MPI 구현체</li>
          <li>Linux kernel — RDMA 서브시스템 + rdma-core userspace, 4.14+ 광범위 지원, 3.x 부터 통합.</li>
        </ul>
        <p className="leading-7">
          RDMA: <strong>remote memory access, zero-copy, bypass CPU</strong>.<br />
          3 flavors: InfiniBand (native), RoCE v2 (Ethernet), iWARP (TCP).<br />
          latency 50μs → 1μs, CPU offload, 95%+ efficiency.
        </p>
      </div>
    </section>
  );
}
