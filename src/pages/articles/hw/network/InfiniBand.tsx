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

        <h3 className="text-xl font-semibold mt-8 mb-3">역사</h3>
        <ul className="leading-7">
          <li>1999 — IBTA (InfiniBand Trade Association) 결성</li>
          <li>2000s — HPC 시스템 보급</li>
          <li>2010s — Mellanox 지배</li>
          <li>2019 — NVIDIA 가 Mellanox 인수</li>
          <li>2020s — AI 클러스터 표준</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">아키텍처</h3>
        <p className="leading-7">
          switched fabric 구조. Ethernet 기반 아님. 네이티브 RDMA, 설계 자체가 lossless.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">핵심 구성 요소</h3>
        <ul className="leading-7">
          <li><strong>HCA (Host Channel Adapter)</strong> — NIC 등가물. 하드웨어 RDMA. 서버당 1 개.</li>
          <li><strong>Switch</strong> — fabric 스위치. low latency (&lt;100 ns), cut-through forwarding.</li>
          <li><strong>Cables</strong> — copper DAC 또는 fiber AOC. Ethernet 보다 reach 짧고 비싸지만 빠르다.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">세대별 속도</h3>
        <ul className="leading-7">
          <li>SDR (2003) — 10 Gbps</li>
          <li>DDR (2005) — 20 Gbps</li>
          <li>QDR (2008) — 40 Gbps</li>
          <li>FDR (2011) — 56 Gbps</li>
          <li>EDR (2014) — 100 Gbps</li>
          <li>HDR (2018) — 200 Gbps</li>
          <li>NDR (2022) — 400 Gbps</li>
          <li>XDR (2024) — 800 Gbps</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">성능 특성</h3>
        <ul className="leading-7">
          <li>switch hop latency — 300~600 ns</li>
          <li>end-to-end — &lt;1~2 μs</li>
          <li>message rate — 2억+ msg/s</li>
          <li>overhead — ~3% (Ethernet 의 ~10% 대비)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">NVLink vs InfiniBand</h3>
        <ul className="leading-7">
          <li><strong>NVLink (노드 내)</strong> — GPU-to-GPU 직접. 900 GB/s (H100), 1.8 TB/s (B200). 매우 짧은 거리. NVLink Switch 로 256-GPU 확장.</li>
          <li><strong>InfiniBand (노드 간)</strong> — node-to-node. 400~800 Gbps. 100m+ 거리. 1000+ 노드 확장.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">NVIDIA DGX 토폴로지</h3>
        <ul className="leading-7">
          <li><strong>Single DGX H100</strong> — 8× H100 + NVLink (GPU 간 900 GB/s) + 4× ConnectX-7 (400G IB).</li>
          <li><strong>DGX SuperPOD</strong> — 127 DGX H100 (1016 GPU). IB fat-tree, GPU 당 400 Gbps. 수백 개 IB switch.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">용도</h3>
        <ul className="leading-7">
          <li>AI 학습 (필수)</li>
          <li>HPC 시뮬레이션</li>
          <li>금융 trading</li>
          <li>과학 계산</li>
          <li>일부 스토리지 시스템</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">대안</h3>
        <ul className="leading-7">
          <li>Ultra Ethernet — 2024 신규</li>
          <li>RoCE v2 — 성숙</li>
          <li>Slingshot (HPE Cray)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">가격</h3>
        <ul className="leading-7">
          <li>NDR HCA — $2K~$3K</li>
          <li>64-포트 스위치 — $50K~$100K</li>
          <li>케이블 — 개당 $300~$1,000</li>
          <li>full cluster — $1M+</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2024 현황</h3>
        <ul className="leading-7">
          <li>InfiniBand NDR 표준</li>
          <li>XDR rolling out (2024~2025)</li>
          <li>Ethernet 800G 추격</li>
          <li>BlueField DPU (smart NIC)</li>
          <li>UEC (Ultra Ethernet Consortium)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">소프트웨어 스택</h3>
        <ul className="leading-7">
          <li>OFED (OpenFabrics Enterprise Distribution)</li>
          <li>MOFED (Mellanox OFED)</li>
          <li>UCX</li>
          <li>NCCL (NVIDIA)</li>
          <li>MPI 구현체</li>
        </ul>
        <p className="leading-7">
          InfiniBand: <strong>HPC/AI interconnect, 400-800 Gbps NDR/XDR</strong>.<br />
          latency &lt;1μs, 900 GB/s NVLink + 400G IB typical (DGX).<br />
          AI training 표준, Ultra Ethernet이 2024+ 경쟁.
        </p>
      </div>
    </section>
  );
}
