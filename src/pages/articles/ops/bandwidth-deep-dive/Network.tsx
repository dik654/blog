export default function Network() {
  return (
    <section id="network" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">3. 네트워크 Bandwidth — multi-GPU + 분산 학습</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          큰 모델을 여러 GPU / 여러 노드에 분산하면 통신 비용이 새 병목.
          <br />
          모델 크기 + 분산 전략에 따라 통신 시간이 compute 의 50%+ 차지 가능.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-1. 분산 전략별 통신 패턴</h3>
        <ul className="leading-7">
          <li><strong>Data Parallel (DP)</strong> — 같은 모델 N copy, 각자 다른 batch. backward 후 gradient all-reduce. 모델 크기에 비례 통신.</li>
          <li><strong>Tensor Parallel (TP)</strong> — 한 layer 의 weight 를 N GPU 에 split. forward / backward 마다 activation all-reduce. <strong>가장 무거운 통신</strong>. NVLink 필수.</li>
          <li><strong>Pipeline Parallel (PP)</strong> — 모델의 layer 를 N stage 로 split. 한 stage 의 출력만 다음 stage 로. 통신 적음, micro-batch 로 bubble 줄임.</li>
          <li><strong>FSDP (Fully Sharded Data Parallel)</strong> — DP + 모델 sharding. 각 GPU 가 모델 일부만 보유, 필요 시 fetch. 메모리 절약 + 통신 ↑.</li>
          <li><strong>Expert Parallel (MoE)</strong> — expert 별 다른 GPU. token 의 routing 에 따라 all-to-all 통신.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-2. 노드 내 vs 노드 간</h3>
        <ul className="leading-7">
          <li><strong>NVLink 4.0 (노드 내, 8 GPU)</strong> — 900 GB/s. 8 GPU all-reduce 빠름.</li>
          <li><strong>NVSwitch / NVLink Switch</strong> — 노드 내 8 GPU full mesh. 또는 256 GPU fabric.</li>
          <li><strong>InfiniBand 400 (노드 간)</strong> — 50 GB/s per link. NVLink 의 1/18.</li>
          <li><strong>RoCE v2</strong> — InfiniBand 의 ethernet 대체. 비슷한 성능, 표준 ethernet 인프라 활용.</li>
          <li><strong>운영 영향</strong> — TP 는 노드 내만 (NVLink), DP 는 노드 간 (InfiniBand). 큰 모델은 hybrid (TP intra-node + DP inter-node).</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-3. All-Reduce 통신량 계산</h3>
        <ul className="leading-7">
          <li><strong>Ring all-reduce</strong> — N GPU, P parameter 의 all-reduce 총 통신 = 2 × P × (N-1)/N bytes.</li>
          <li><strong>예시 — Llama 70B (140 GB FP16)</strong> — 8 GPU all-reduce = 2 × 140 GB × 7/8 ≈ 245 GB / step.</li>
          <li><strong>NVLink 900 GB/s</strong> — ~270 ms / step.</li>
          <li><strong>InfiniBand 400 (50 GB/s)</strong> — ~5 초 / step. 18x 느림.</li>
          <li><strong>의미</strong> — 8 H100 노드 1 개로 학습 vs 4 노드 분산의 throughput 차이가 결정적.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-4. ZeRO / FSDP 의 통신 비용</h3>
        <ul className="leading-7">
          <li><strong>ZeRO-1</strong> — optimizer state shard. 통신 = DDP 와 동일.</li>
          <li><strong>ZeRO-2</strong> — gradient 도 shard. 통신 = DDP 와 동일.</li>
          <li><strong>ZeRO-3 / FSDP</strong> — parameter 도 shard. 매 layer forward / backward 마다 all-gather. <strong>통신 1.5x ~ 3x</strong>.</li>
          <li><strong>trade-off</strong> — 메모리 ↓ (큰 모델 가능) vs 통신 ↑. NVLink 충분하면 OK, InfiniBand 만이면 throughput ↓ 클 수도.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-5. 추론 클러스터의 통신</h3>
        <ul className="leading-7">
          <li><strong>vLLM tensor parallel</strong> — 같은 노드 내 NVLink 활용. 노드 간은 권장 X.</li>
          <li><strong>Disaggregated prefill / decode</strong> — prefill 노드와 decode 노드 분리. KV cache 를 NVLink-C2C 또는 RDMA 로 전송.</li>
          <li><strong>운영 결정</strong> — 모델이 단일 노드 (8 H100 = 640 GB) 안에 들어가면 NVLink 만, 안 들어가면 multi-node 의 통신 비용 신중.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-6. RDMA — CPU 우회의 의미</h3>
        <ul className="leading-7">
          <li><strong>전통 TCP/IP</strong> — kernel 통과 + memcpy + interrupt. CPU 30% 사용 + latency 100 μs.</li>
          <li><strong>RDMA</strong> — NIC 가 메모리 직접 read/write. CPU 0% + latency 1 μs. 필수 in HPC / AI 분산.</li>
          <li><strong>RoCE v2 vs InfiniBand</strong> — 같은 RDMA, 다른 transport. RoCE 는 ethernet, IB 는 전용. 클라우드는 RoCE 가 많음.</li>
          <li><strong>NCCL</strong> — NVIDIA 의 all-reduce 라이브러리. NVLink + InfiniBand / RoCE 자동 활용.</li>
        </ul>
      </div>
    </section>
  );
}
