export default function Innovations() {
  return (
    <section id="innovations" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">3. 아키텍처별 핵심 혁신 — 면접에 자주 나오는</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">3-1. Volta — Tensor Core 도입 (2017)</h3>
        <ul className="leading-7">
          <li><strong>NVLink 2.0</strong> — 300 GB/s. multi-GPU 학습의 첫 본격 인프라.</li>
          <li><strong>Independent Thread Scheduling</strong> — warp 안 thread 가 각자 다른 PC. divergence 영향 ↓.</li>
          <li><strong>HBM2</strong> — 첫 HBM 채택. 900 GB/s.</li>
          <li><strong>의미</strong> — AI 학습이 GPU 의 주요 워크로드가 되는 시점. ChatGPT 시대의 기반.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-2. Turing — 추론 + RT Core (2018)</h3>
        <ul className="leading-7">
          <li><strong>2 gen Tensor Core</strong> — INT8 / INT4. quantized 추론.</li>
          <li><strong>RT Core</strong> — ray tracing 가속. 게이밍 GPU 의 차세대 기능. AI 와 무관.</li>
          <li><strong>의미</strong> — DC GPU (T4) 가 추론 시장 (CPU 대체) 본격 진입.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-3. Ampere — MIG · TF32 · Sparsity (2020)</h3>
        <p className="leading-7">
          A100 은 AI 학습의 표준이 된 첫 세대. 5 년 지난 지금도 production 다수 사용. 4 가지 핵심 혁신.
        </p>

        <h4 className="text-lg font-semibold mt-6 mb-2">MIG (Multi-Instance GPU) — GPU 분할 격리</h4>
        <p className="leading-7">
          한 물리 A100 을 최대 7 개의 독립 instance 로 나누는 hardware 기능.
          <br />
          어떻게 가능한가 — NVIDIA 가 SM, 메모리, L2 cache, DMA 를 미리 정의된 슬라이스로 묶어 hardware 레벨에서 격리한다. partition 사이 통신 X. 한 partition 의 사고 / 메모리 폭증이 다른 partition 영향 X.
        </p>
        <p className="leading-7">
          왜 중요한가.
        </p>
        <ul className="leading-7">
          <li><strong>클라우드 multi-tenant</strong> — CoreWeave / Lambda / AWS 가 한 H100 80 GB 를 1g.20gb × 4 또는 7g.10gb × 1 + 1g.10gb × 6 같은 조합으로 분할해 작은 워크로드 사용자에게 임대. 사용자가 풀 GPU 안 빌려도 됨.</li>
          <li><strong>다양한 워크로드 동시</strong> — 한 노드에서 큰 학습 + 작은 추론 + dev experiment 동시. partition 격리로 서로 영향 X.</li>
          <li><strong>SLA 보장</strong> — 같은 GPU 안의 다른 사용자가 메모리 / compute 폭증해도 내 partition 영향 X. 가격 / 성능 예측 가능.</li>
        </ul>
        <p className="leading-7">
          한계 — partition 끼리 통신 불가 (격리 보장의 cost). multi-GPU 학습은 partition 으로 나누면 안 됨 — full GPU 모드로.
        </p>

        <h4 className="text-lg font-semibold mt-6 mb-2">3 세대 Tensor Core — TF32 · BF16 도입</h4>
        <p className="leading-7">
          Ampere 의 Tensor Core 는 새 정밀도 두 개를 추가했다. 둘 다 학습 / 추론의 표준이 됨.
        </p>
        <p className="leading-7">
          <strong>TF32 (Tensor Float 32)</strong> — NVIDIA 만의 19 bit 형식. exponent 8 bit (FP32 와 동일) + mantissa 10 bit. range 는 FP32 와 같은데 mantissa 만 줄임.
          <br />
          왜 의미 있는가 — 기존 FP32 학습 코드를 수정 없이 자동 가속. PyTorch 의 <code>torch.set_float32_matmul_precision('high')</code> 한 줄로 ~8x throughput. 정확도는 거의 영향 없음 (학습은 mantissa 10 bit 면 충분).
        </p>
        <p className="leading-7">
          <strong>BF16 (Brain Float 16)</strong> — Google 의 형식. exponent 8 bit (FP32 와 동일) + mantissa 7 bit. FP16 보다 range 크고 정밀도 작음.
          <br />
          왜 학습 표준이 됐는가 — FP16 의 range (±65504) 가 좁아 큰 gradient 에서 overflow 자주 발생. BF16 은 FP32 와 같은 range 라 overflow 거의 없음. 정밀도가 약간 낮은 trade-off.
          <br />
          현재 학습 표준은 BF16. PyTorch / JAX 의 default mixed precision.
        </p>

        <h4 className="text-lg font-semibold mt-6 mb-2">Structural Sparsity — 2:4 pattern</h4>
        <p className="leading-7">
          모델의 weight 50% 를 0 으로 만들면 연산도 절반 생략 가능 — 단순한 아이디어.
          <br />
          그런데 무작위 sparsity 는 hardware 가속 어렵다. Ampere 는 <strong>2:4 pattern</strong> — 4 개 weight 중 정확히 2 개가 0 — 만 hardware 가속.
        </p>
        <p className="leading-7">
          이론 throughput 2x. 그러나 실 채택 적음. 이유:
        </p>
        <ul className="leading-7">
          <li>모델을 2:4 pattern 으로 prune 하기 어려움 (정확도 손실).</li>
          <li>기존 모델 (Llama / GPT) 이 dense 라 sparsity tooling 미성숙.</li>
          <li>FP8 / FP4 quantization 이 같은 throughput 효과를 더 쉽게 제공.</li>
        </ul>

        <h4 className="text-lg font-semibold mt-6 mb-2">HBM2e — 80 GB · 2 TB/s</h4>
        <p className="leading-7">
          A100 첫 출시는 40 GB HBM2 (1.55 TB/s), 80 GB version 은 HBM2e 로 2 TB/s.
          <br />
          80 GB 가 의미 있는 이유 — Llama 7B / 13B 같은 작은 모델은 단일 GPU 에 들어감. 70B 는 두 장 NVLink 필요.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-4. Hopper — Transformer Engine · TMA · Cluster (2022)</h3>
        <p className="leading-7">
          AI 폭발기 (ChatGPT 출시 직후) 의 핵심 GPU. 이 세대의 6 가지 혁신을 모두 알아야 H100 의 가치를 답할 수 있다.
        </p>

        <h4 className="text-lg font-semibold mt-6 mb-2">Transformer Engine + FP8 — 학습 throughput 의 진짜 이유</h4>
        <p className="leading-7">
          FP8 은 8 bit 부동소수점이다. FP16 대비 메모리 절반 + throughput 두 배.
          <br />
          그러나 단순히 정밀도를 줄이면 학습이 발산한다. forward pass 의 작은 활성화 값과 backward pass 의 큰 gradient 값이 같은 형식에 안 들어간다.
          <br />
          Hopper 의 해결책은 <strong>두 FP8 형식을 동시 지원 + 자동 전환</strong>이다.
        </p>
        <ul className="leading-7">
          <li><strong>E4M3</strong> (exponent 4 bit · mantissa 3 bit) — 정밀도 우선. 작은 forward activation 적합. range ±448.</li>
          <li><strong>E5M2</strong> (exponent 5 bit · mantissa 2 bit) — 큰 range. backward gradient 적합. range ±57344.</li>
        </ul>
        <p className="leading-7">
          Transformer Engine 은 NVIDIA 의 transformer-specific 라이브러리. 매 layer 마다 자동으로 두 FP8 형식 선택 + scale factor 동적 조정.
          <br />
          PyTorch 의 <code>te.Linear · te.LayerNormLinear · te.MultiheadAttention</code> 의 drop-in 대체로 학습 코드 거의 변경 없음.
          <br />
          그 결과 같은 Llama 학습이 H100 에서 A100 의 6 배 빠른 핵심 이유 — Tensor Core 4 세대 자체보다 FP8 + Transformer Engine 의 조합이 진짜 동력.
        </p>

        <h4 className="text-lg font-semibold mt-6 mb-2">TMA (Tensor Memory Accelerator) — 비동기 메모리 이동</h4>
        <p className="leading-7">
          GPU 의 핵심 패턴은 HBM 의 큰 tensor 를 SM 의 shared memory 에 옮긴 뒤 연산하는 것.
          옛 세대는 thread 들이 직접 LD/ST 명령으로 옮겼고, 이게 thread cycle 을 잡아먹었다.
          <br />
          Hopper 의 TMA 는 별도 hardware accelerator. shared memory 안의 descriptor 만 설정하면 큰 tile (수 KB ~ 수 MB) 을 자동 copy. thread 는 메모리 transfer 와 무관하게 다른 일 가능 (async).
          <br />
          이 구조 덕에 FlashAttention 3 가 H100 에서 추가 가속 받는다 — TMA 로 HBM-shared memory 왕복을 thread compute 와 overlap. WGMMA (warp-group matrix multiply) 명령어와 결합해 같은 attention kernel 이 H100 에서 1.5-2x 빠름.
        </p>

        <h4 className="text-lg font-semibold mt-6 mb-2">Thread Block Cluster — SM 경계를 넘는 협력</h4>
        <p className="leading-7">
          옛 세대는 thread block 이 한 SM 안에 갇혔다. 다른 SM 의 thread 와는 global memory (HBM) 통해서만 통신 — 느림.
          <br />
          Hopper 의 Cluster 는 여러 SM 의 block 을 하나의 cluster 로 묶어 <strong>distributed shared memory</strong> 공유. 다른 SM 의 shared memory 에 직접 access (SM-to-SM hardware path).
          <br />
          큰 GEMM kernel (수천 thread 필요) 이 multi-SM 으로 분산되면서 데이터 공유. CUTLASS 의 새 GEMM 구현이 cluster 활용해 H100 의 peak 에 가까운 throughput.
        </p>

        <h4 className="text-lg font-semibold mt-6 mb-2">DPX Instruction — 동적 프로그래밍 가속</h4>
        <p className="leading-7">
          Dynamic Programming 의 inner loop (max/min + add 의 fused 연산) 를 single instruction 으로 처리.
          <br />
          유스 케이스 — Smith-Waterman (DNA alignment), Needleman-Wunsch (시퀀스 정렬), Floyd-Warshall (shortest path), Filecoin SDR 같은 hash chain 일부.
          <br />
          AI 외 영역 (genomics · 그래프 분석) 에서 H100 의 가치를 추가로 만드는 명령어.
        </p>

        <h4 className="text-lg font-semibold mt-6 mb-2">Confidential Computing — GPU 메모리도 TEE</h4>
        <p className="leading-7">
          Hopper 부터 GPU 메모리가 TEE (Trusted Execution Environment) 에 들어간다. CPU 측의 SEV-SNP (AMD) 또는 TDX (Intel) 와 결합하면 host OS 도 GPU 메모리 못 본다.
        </p>
        <ul className="leading-7">
          <li>Apple Private Cloud Compute 같은 사용자 데이터 보호 추론.</li>
          <li>의료 / 금융 LLM — 환자 / 거래 데이터를 cloud GPU 에 보내도 안전.</li>
          <li>모델 weight 보호 — 모델 own 한 회사가 자기 weight 를 다른 cloud provider GPU 에 두고 그 cloud 도 weight 못 보게.</li>
          <li>한국 금융권의 cloud LLM 도입 본격화에 결정적 기능.</li>
        </ul>

        <h4 className="text-lg font-semibold mt-6 mb-2">NVLink Switch / NVSwitch 4 — 256 GPU fabric</h4>
        <p className="leading-7">
          기존 NVLink 는 노드 내 8 GPU 직접 연결. NVLink Switch 는 별도 ASIC 으로 노드 간 NVLink 까지 확장.
          <br />
          DGX SuperPOD 의 표준 — H100 256 GPU 가 single NVLink fabric 으로 묶여 노드 간 통신도 NVLink 속도 (900 GB/s).
          <br />
          큰 학습 클러스터의 통신 병목 해소. tensor parallelism 을 노드 경계 넘어 가능. multi-node 학습이 사실상 single node 처럼 작동.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-5. Ada Lovelace — Hopper 의 컨슈머 자매 (2022)</h3>
        <ul className="leading-7">
          <li><strong>같은 4N 공정, 같은 4 gen Tensor Core</strong> — H100 과 같은 세대.</li>
          <li><strong>차이</strong> — HBM 없음 (GDDR6X), NVLink 없음, MIG 없음, FP64 거의 없음, AV1 인코더 (게임 streaming), DLSS 3 (생성 AI 게이밍).</li>
          <li><strong>RTX 4090 / 4080 / 6000 Ada</strong>.</li>
          <li><strong>운영 의미</strong> — 같은 Tensor Core 라 Llama 7B / 13B 추론은 4090 으로 가능. 단 NVLink 부재로 multi-GPU 불가.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-6. Blackwell — Dual-die · FP4 · NVL72 (2024)</h3>
        <ul className="leading-7">
          <li>
            <strong>Dual-die NVLink-C2C</strong>
            <br />
            한 칩의 reticle limit 도달 → 두 die 를 10 TB/s NVLink-C2C 로 묶어 단일 GPU 처럼 작동. AMD MI300X 와 같은 chiplet 흐름.
          </li>
          <li>
            <strong>5 gen Tensor Core + FP4</strong>
            <br />
            FP4 = 4 bit float. 추론 throughput H100 대비 4x (가능한 모델 한정).
            <br />
            2 gen Transformer Engine 이 FP4 자동 처리.
          </li>
          <li>
            <strong>NVLink 5.0 + GB200 NVL72</strong>
            <br />
            72 GPU + 36 Grace CPU 한 rack, 100% liquid cooled. 1.4 EFLOPS FP4. 단일 거대 GPU 처럼 사용.
            <br />
            가격 $3M+ / rack. hyperscaler 만 접근.
          </li>
          <li>
            <strong>Decompression Engine</strong>
            <br />
            데이터 로딩 시 압축 풀기 가속. 대용량 데이터셋 학습 throughput ↑.
          </li>
          <li>
            <strong>RAS (Reliability, Availability, Serviceability) 강화</strong>
            <br />
            예측적 fault detection. 큰 클러스터의 장애 사전 검출.
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-7. 면접에서 답할 패턴</h3>
        <ul className="leading-7">
          <li><strong>&quot;Ampere 와 Hopper 의 차이&quot;</strong> — Tensor Core 4 gen + FP8 + Transformer Engine + TMA + Cluster + Confidential Computing + 큰 NVLink.</li>
          <li><strong>&quot;FP8 가 왜 중요&quot;</strong> — LLM 학습 / 추론에 충분한 정밀도 + FP16 의 2x throughput + 절반 메모리. memory bound 인 LLM 에 결정적.</li>
          <li><strong>&quot;MIG 가 무엇이고 언제 쓰나&quot;</strong> — 한 GPU 분할 격리. 클라우드 multi-tenant 또는 다양한 작은 워크로드 동시 운영.</li>
          <li><strong>&quot;Sparsity 활용도&quot;</strong> — 이론 2x 지만 모델 정렬 어려움. 실 채택 적음.</li>
          <li><strong>&quot;DC vs Consumer GPU 차이&quot;</strong> — HBM · ECC · NVLink · MIG · FP64 · blower cooling · enterprise driver · DC EULA. 컨슈머는 모두 X 또는 약함.</li>
        </ul>
      </div>
    </section>
  );
}
