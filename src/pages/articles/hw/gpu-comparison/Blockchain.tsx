import { motion } from 'framer-motion';

const workloads = [
  { name: 'MSM (다중 스칼라 곱셈)', bottleneck: '메모리 대역폭', best: 'H100 (HBM3 3.35TB/s)', alt: '4090도 가능 (1TB/s)' },
  { name: 'NTT (수론 변환)', bottleneck: 'CUDA 코어 수', best: '5090 (21,760 코어)', alt: 'H100 (16,896 코어)' },
  { name: 'Filecoin 봉인 C2', bottleneck: 'VRAM + 연산', best: 'A100 80GB', alt: '4090 24GB (32GiB 섹터)' },
  { name: 'SHA256 해싱', bottleneck: 'TDP당 해시율', best: '4090 (450W)', alt: 'ASIC이 더 효율적' },
];

export default function Blockchain() {
  return (
    <section id="blockchain" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">블록체인 워크로드별 선택</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          블록체인 워크로드마다 병목 지점이 다릅니다.<br />
          MSM은 메모리 대역폭, NTT는 연산량, 봉인은 VRAM이 핵심 지표입니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['워크로드', '병목', '최적 GPU', '대안'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {workloads.map((w) => (
                <motion.tr key={w.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{w.name}</td>
                  <td className="border border-border px-3 py-2">{w.bottleneck}</td>
                  <td className="border border-border px-3 py-2">{w.best}</td>
                  <td className="border border-border px-3 py-2">{w.alt}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">먼저 — CUDA core 가 무엇이고 왜 NTT 에 결정적인가</h3>
        <p className="leading-7">
          GPU 의 동작 원리부터. CPU 의 코어가 1 클럭에 1 명령을 처리한다면, GPU 의 CUDA core 는 1 클럭에 1 부동소수점 연산 (FMA, multiply-add) 을 처리한다. 한 칩에 수천 ~ 수만 개가 있어 동시 병렬 실행.
        </p>
        <p className="leading-7">
          CUDA core 의 작동 모델 — SIMT (Single Instruction Multiple Thread). 32 thread 를 한 묶음 (warp) 으로 같은 명령 실행. SM (Streaming Multiprocessor) 안의 warp scheduler 가 매 사이클 dispatch.
          <br />
          예시 — H100 의 132 SM × 128 CUDA core = 16,896 코어. 한 클럭에 16,896 FP32 FMA = 33,792 FLOPs. 1.83 GHz 클럭이면 peak 60 TFLOPS FP32.
        </p>
        <p className="leading-7">
          왜 NTT/FFT 에서 CUDA core 가 결정적인가 — NTT 는 수백만 개의 작은 독립 연산 (modular multiplication, butterfly operation) 으로 쪼개진다. 각 연산이 100~200 cycle 정도 (Montgomery reduction) 짧아 데이터 access 가 거의 register / shared memory 에 머물러 메모리 bandwidth 거의 안 씀.
          <br />
          반대로 한 번에 더 많은 연산을 동시 진행하면 throughput 직선 증가. CUDA core 수 = 동시 병렬 처리 능력 = NTT throughput.
        </p>
        <p className="leading-7">
          이게 NTT 가 <strong>compute bound</strong> 인 이유. Roofline model 의 오른쪽 (operational intensity 높은 영역) — CUDA core 의 peak TFLOPS 가 한계. memory bandwidth 가 한가한 상태로 compute 가 bottleneck.
        </p>
        <p className="leading-7">
          반대로 MSM 같은 경우 — 한 elliptic curve point 가 ~100 byte 인데 매 multiplication 마다 다른 point 를 메모리에서 read. 한 연산의 메모리 access 가 연산보다 비싸서 memory bound. CUDA core 가 아무리 많아도 memory 가 못 따라옴.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">MSM (Multi-Scalar Multiplication) — bandwidth bound</h3>
        <p className="leading-7">
          MSM 은 elliptic curve 위 N 개 point 와 N 개 scalar 의 weighted sum: <code>P = Σ s_i × G_i</code>.
          Groth16 SNARK 의 prover 가 가장 큰 시간을 쓰는 연산 — Filecoin C2 proving 시간의 95%, ZK rollup proving 의 70~80%.
        </p>
        <p className="leading-7">
          왜 bandwidth bound 인가. N = 2^25 (Filecoin C2 규모) 면 point 데이터가 ~3 GB (각 point 96 byte). 매 multiplication 마다 다른 point + scalar 를 메모리에서 read. 한 multiplication 의 실 연산 (Pippenger 알고리즘 + Montgomery 곱) 은 수백 cycle 인데 메모리 read 자체가 같은 정도 cycle 걸림.
          <br />
          OI (Operational Intensity) ≈ 5~20. Roofline 의 왼쪽 (memory bound). HBM 3.35 TB/s 의 H100 이 GDDR6X 1 TB/s 의 RTX 4090 보다 ~3 배 빠름.
        </p>
        <ul className="leading-7">
          <li><strong>최적</strong> — H100 (HBM3 3.35 TB/s) 또는 H200 (HBM3e 4.8 TB/s).</li>
          <li><strong>충분</strong> — A100 (HBM2e 2 TB/s). 옛 세대지만 HBM 이라 여전히 경쟁력.</li>
          <li><strong>가능</strong> — RTX 5090 (GDDR7 1.8 TB/s). H100 의 절반 throughput.</li>
          <li><strong>예산형</strong> — RTX 4090 (GDDR6X 1 TB/s). H100 의 1/3.</li>
          <li><strong>주의</strong> — CUDA core 수만 보고 RTX 5090 (21,760 코어) 이 H100 (16,896 코어) 보다 빠를 거라 생각하면 wrong. memory bound 라 코어 수 무관, BW 가 결정.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">NTT/FFT (Number Theoretic Transform) — compute bound</h3>
        <p className="leading-7">
          NTT 는 modular field 위에서의 FFT — 다항식 곱셈을 O(N log N) 으로. ZK proof 의 polynomial commitment, KZG, FRI 의 핵심 연산.
        </p>
        <p className="leading-7">
          왜 compute bound 인가. NTT 의 inner loop 는 butterfly operation — 2 개 element 를 받아 더하기 + 곱하기 (modular). 데이터가 작아 (각 element 32 byte) 모든 작업이 register + shared memory 안. 메모리 bandwidth 거의 0 사용.
          <br />
          한 butterfly 의 실 연산 — Montgomery 곱셈 (40~60 register, ~100 cycle) + 덧셈. OI ≈ 50~200. Roofline 의 오른쪽 (compute bound). CUDA core 수가 직선 throughput.
        </p>
        <p className="leading-7">
          그러나 단순히 코어 수만 보면 안 됨. 실제로는 코어 × 클럭 × IPC 의 곱이고, 거기에 occupancy (실제 활성 warp 비율) 가 곱해진다. Montgomery 곱셈이 ~40 register 쓰면 SM 의 register file (64K) 한계로 occupancy 50% 정도. 실 throughput 은 peak 의 50%.
        </p>
        <ul className="leading-7">
          <li><strong>최적</strong> — RTX 5090 (21,760 코어 × 2.4 GHz × Blackwell 효율). 같은 가격에 H100 보다 NTT throughput 1.5~2x.</li>
          <li><strong>충분</strong> — H100 (16,896 코어 × 1.83 GHz). 압도적 가격이지만 NVLink + ECC 가 의미 있을 때만.</li>
          <li><strong>가능</strong> — RTX 4090 (16,384 코어 × 2.5 GHz). NTT 만 보면 H100 의 80% throughput, 가격은 1/12. NTT-only 워크로드면 4090 이 가성비 압승.</li>
          <li><strong>특이 — A100</strong> — 6,912 코어로 적지만 HBM2e 2 TB/s 가 NTT 의 일부 단계 (큰 N 일 때 inter-stage shuffle) 에서 도움. 그래서 큰 NTT 는 A100 도 경쟁력.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">Filecoin Sealing (C2) — VRAM 용량이 결정적</h3>
        <p className="leading-7">
          C2 는 vanilla proof 를 Groth16 SNARK 로 압축하는 단계. 32 GiB sector 의 proving key 가 ~100 GB (Filecoin sector type 별로 다름).
        </p>
        <p className="leading-7">
          왜 VRAM 이 결정적인가. Groth16 prover 는 MSM (메모리 bound) + FFT (compute bound) + 다항식 연산의 조합. 모든 단계의 중간 데이터 (witness · A/B/C 다항식 계수 · proving key) 가 VRAM 에 있어야 빠름.
          <br />
          VRAM 부족 → host RAM 으로 swap → PCIe 통신 (32 GB/s) 이 새 병목 → C2 시간 5~10x 폭증.
        </p>
        <ul className="leading-7">
          <li><strong>최적</strong> — H100 80GB / A100 80GB / MI300X 192GB. 32 GiB sector 의 모든 데이터가 VRAM 안.</li>
          <li><strong>가능</strong> — A6000 48GB. 32 GiB sector 가능, 64 GiB sector 는 swap 발생.</li>
          <li><strong>한계선</strong> — RTX 4090 24GB. 32 GiB sector 의 일부 데이터를 host RAM 에 두고 streaming. 시간 2~3x 느려지지만 가능.</li>
          <li><strong>운영 결정</strong> — 가격 / 시간 trade-off. RTX 4090 이 sector 당 60 분 vs H100 이 20 분 — 처리량이 가격 차이 (12x) 를 정당화 못 하면 4090 이 답.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">ZK-Rollup Proving — 대형 회로 + 장시간</h3>
        <p className="leading-7">
          zkSync · Scroll · Polygon zkEVM 의 prover. 회로 크기가 ~10^8~10^9 constraint, MSM N = 2^25~2^28. 한 batch proof 가 분~시간 단위.
        </p>
        <p className="leading-7">
          왜 대용량 VRAM 인가. 큰 회로 → 큰 proving key → 큰 witness. 80 GB 면 한 batch 가 한 GPU 에 들어가지만, 작은 GPU 면 분할 → 통신 overhead.
          <br />
          왜 batch 가 중요한가 — MSM 의 Pippenger 알고리즘은 N 이 클수록 효율 ↑ (bucket method). batch 작으면 fixed overhead 비율 ↑.
        </p>
        <ul className="leading-7">
          <li><strong>최적</strong> — H100 80GB (batch + NVLink) 또는 MI300X 192GB.</li>
          <li><strong>충분</strong> — A100 80GB. zkSync 의 production prover 가 다수 사용.</li>
          <li><strong>제한</strong> — 24~48 GB GPU. 작은 batch 만 가능, throughput 1/3~1/5.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">LLM Inference — 메모리 BW + VRAM 두 축</h3>
        <p className="leading-7">
          LLM 추론은 memory bound (위의 bandwidth deep-dive 참고). 한 token 마다 모든 weight read.
          <br />
          Llama 70B FP16 = 140 GB → 단일 H100 80GB 에 안 들어감 → 두 장 NVLink 또는 MI300X 192GB 단일.
          <br />
          batch 늘리면 OI ↑ → compute bound 진입 → tensor core throughput 도 활용. vLLM 의 PagedAttention 이 batch 키움.
        </p>
        <ul className="leading-7">
          <li><strong>최적 — 큰 모델 (70B+)</strong> — H100 SXM × 8 + NVLink 또는 MI300X 단일.</li>
          <li><strong>충분 — 중간 (13B~30B)</strong> — A100 80GB 또는 RTX 5090 (32GB).</li>
          <li><strong>예산형 — 작은 (7B~13B)</strong> — RTX 4090 (24GB). 단일 GPU 추론에 가성비 압승.</li>
          <li><strong>multi-GPU 큰 추론</strong> — NVLink 필수. 컨슈머 GPU 의 PCIe 만으로는 대형 모델 분산 추론 비효율.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">AI Training — NVLink + 대규모 compute</h3>
        <p className="leading-7">
          학습은 multi-GPU + 통신 모두 critical. forward + backward + gradient all-reduce 의 매 step 통신.
          <br />
          위의 bandwidth deep-dive 의 수치 — 8 GPU all-reduce Llama 70B = 245 GB. NVLink 270 ms vs InfiniBand 5 초.
          <br />
          컨슈머 GPU 의 PCIe 만으로는 multi-GPU 학습 불가능 — 통신이 compute 보다 5~30x 느림.
        </p>
        <ul className="leading-7">
          <li><strong>최적</strong> — H100 8× SXM + NVLink Switch (256 GPU fabric) 또는 GB200 NVL72.</li>
          <li><strong>충분</strong> — A100 SXM 클러스터 + NVLink 3.0. 옛 세대지만 production 다수 사용.</li>
          <li><strong>불가</strong> — 컨슈머 GPU 8 장. NVLink 부재로 multi-GPU 학습 사실상 single GPU × 8 의 합 못 냄.</li>
          <li><strong>중간</strong> — Trainium / TPU 같은 cloud lock-in 가속기. NVIDIA 대비 가격 50%.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">SHA256 Mining (역사적)</h3>
        <p className="leading-7">
          전력 효율이 절대적. ASIC 이 지배. GPU 는 전력 비용 &gt; 채굴 수익.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">비용 효율 지표</h3>
        <ul className="leading-7">
          <li><strong>달러당 compute</strong> — RTX 4090 최강, A6000 양호, A100 보통, H100 프리미엄.</li>
          <li><strong>와트당 효율</strong> — H100 최고, A100 양호, RTX 4090 보통, RTX 5090 고 TDP.</li>
          <li><strong>VRAM GB 당 단가</strong> — H100 $312, A100 80GB $125, A6000 $104, RTX 4090 $83.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">규모별 권장</h3>
        <ul className="leading-7">
          <li>Hobbyist — RTX 4090</li>
          <li>Solo miner — RTX 4090 ×2 또는 A6000</li>
          <li>소규모 SP — A6000 ×4~8</li>
          <li>대규모 SP — A100 80GB 클러스터</li>
          <li>Enterprise AI — H100 SXM + NVLink</li>
          <li>연구소 — H100 + B200 mix</li>
        </ul>
        <p className="leading-7">
          Workload-GPU matrix: <strong>MSM → HBM, NTT → cores, Sealing → VRAM</strong>.<br />
          cost-effective: RTX 4090 ($83/GB VRAM), H100 최고 efficiency.<br />
          scale-dependent selection: hobbyist → enterprise 다른 tier.
        </p>
      </div>
    </section>
  );
}
