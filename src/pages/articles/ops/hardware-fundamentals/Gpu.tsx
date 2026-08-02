import GpuTierViz from './viz/GpuTierViz';
import NpuVsGpuViz from './viz/NpuVsGpuViz';

export default function Gpu() {
  return (
    <section id="gpu" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">2. GPU 계층 — DC vs Pro vs Consumer + NPU 의 위치</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          GPU 결정은 <strong>메모리 (HBM 용량) · 대역폭 · 워크로드 종류 · NVLink 필요 여부</strong> 의 4 축으로 갈린다.
          <br />
          학습 클러스터면 H100/H200/B200 SXM 모듈, 추론 비용효율이 우선이면 MI300X 또는 RTX 5090, Filecoin C2 같은 일회성 SNARK 면 RTX 4090 으로 충분.
        </p>
      </div>
      <GpuTierViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-10">
        <h3 className="text-xl font-semibold mt-8 mb-3">2-1. NVIDIA vs AMD GPU — 본질 차이</h3>
        <h4 className="text-lg font-semibold mt-6 mb-2">아키텍처 세대</h4>
        <p className="leading-7">
          NVIDIA — Hopper (H100/H200, 2022~), Blackwell (B100/B200/GB200, 2024~). AMD — CDNA3 (MI300X, 2023) → CDNA4 (MI325X · MI355X, 2024~).
          <br />
          NVIDIA 는 GPU 회사로 시작해 graphics + AI ecosystem 동시 보유. AMD 는 GPU 시장에 늦게 진입했지만 Xilinx (FPGA) · Pensando (DPU) 인수로 데이터센터 portfolio 확장.
        </p>

        <h4 className="text-lg font-semibold mt-6 mb-2">메모리 capacity — MI300X 의 결정적 우위</h4>
        <p className="leading-7">
          H100 = 80 GB HBM3, H200 = 141 GB HBM3e, B200 = 192 GB HBM3e (dual-die).
          <br />
          MI300X = 192 GB HBM3 (단일 die 기준 가장 큰 capacity, 2023 출시 시점에 H100 의 2.4 배).
        </p>
        <p className="leading-7">
          왜 중요한가 — Llama 70B (FP16 = 140 GB) 가 단일 MI300X 에 들어간다. H100 80GB 는 두 장 NVLink 필수.
          <br />
          단일 GPU 에 들어가면 NVLink 통신 비용 0 + 추론 코드 단순. 그래서 Meta · Microsoft 가 추론 클러스터에 MI300X 본격 채택.
          <br />
          Llama 405B 같은 큰 모델은 여전히 multi-GPU 필요하지만, 70B 영역의 비용 효율은 MI300X 가 우위.
        </p>

        <h4 className="text-lg font-semibold mt-6 mb-2">인터커넥트 — NVIDIA 의 ecosystem 우위</h4>
        <p className="leading-7">
          NVIDIA NVLink 4 (H100) = 900 GB/s GPU-to-GPU. NVSwitch 가 노드 내 8 GPU full mesh 연결. NVLink Switch 시스템은 256 GPU single fabric.
          <br />
          AMD Infinity Fabric — 노드 내 5.3 TB/s aggregate. xGMI (cross-die) + Infinity Fabric Link. spec 상 NVIDIA 와 비슷한 수준이지만 ecosystem (NVSwitch 같은 표준 fabric component) 미성숙.
          <br />
          큰 학습 클러스터 (256+ GPU) 에서 NVIDIA 의 NVLink Switch 가 사실상 유일한 옵션. AMD 는 따라잡고 있는 단계.
        </p>

        <h4 className="text-lg font-semibold mt-6 mb-2">소프트웨어 — CUDA 의 lock-in</h4>
        <p className="leading-7">
          CUDA 는 NVIDIA 가 2007 부터 17 년간 구축한 ecosystem. PyTorch · vLLM · TensorRT · Triton · FlashAttention · xformers · 거의 모든 ML / HPC 라이브러리가 CUDA first.
          <br />
          AMD 의 ROCm 은 CUDA 호환을 목표로 진화. PyTorch 지원은 거의 동등 (2024 기준). 하지만 일부 핵심 라이브러리 (FlashAttention 의 ROCm 포팅 늦음, xformers 부분 지원, custom CUDA kernel 의 자동 변환 어려움) 가 약점.
          <br />
          현실 — 새 모델 / 알고리즘이 NVIDIA GPU 에서 먼저 검증되고, AMD 는 6~12 개월 후. production 환경의 stability 차이.
        </p>

        <h4 className="text-lg font-semibold mt-6 mb-2">가격 / 가용성</h4>
        <p className="leading-7">
          H100 SXM = $25K~$40K. AI 폭증으로 NVIDIA 가 사실상 가격 결정. 공급 제한 (TSMC capacity).
          <br />
          MI300X = $15K~$20K. 공급 여유. NVIDIA 대비 ~50% 가격.
          <br />
          그래서 hyperscaler (Meta · Microsoft · Oracle) 가 추론 클러스터에 MI300X 본격 채택 — 학습은 여전히 H100/H200, 추론은 MI300X 의 hybrid 패턴.
        </p>

        <h4 className="text-lg font-semibold mt-6 mb-2">FP8 / FP4 — 정밀도 진화</h4>
        <p className="leading-7">
          H100 의 FP8 (Hopper 4 gen Tensor Core) = FP16 대비 4 배 throughput. LLM 추론 표준.
          <br />
          B200 의 FP4 (Blackwell 5 gen) = FP8 의 또 2 배. inference throughput H100 대비 4x. 학습은 여전히 FP8 / BF16.
          <br />
          AMD MI300X = FP8 지원 (CDNA3). MI355X (CDNA4) 는 FP4. NVIDIA 와 같은 정밀도 트렌드 추적.
          <br />
          정밀도 진화의 본질 — LLM 은 memory bound 이라 메모리 절반 = throughput 두 배. compute 는 어차피 idle. 정밀도가 충분한 한계까지 줄여 가는 것이 throughput 의 가장 빠른 길.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-2. Consumer (RTX) 의 위치</h3>
        <ul className="leading-7">
          <li><strong>RTX 4090</strong> — 24 GB GDDR6X. 7B~13B 모델 추론, Filecoin PC2/C2, ML 실험. 가성비 ↑.</li>
          <li><strong>RTX 5090</strong> — 32 GB GDDR7, 1.79 TB/s bandwidth. 4090 대비 ~2x throughput. 소비자 최강.</li>
          <li><strong>한계</strong> — NVLink 없음 (PCIe 만). 멀티 GPU 시 통신 병목. 대형 모델 학습 부적합. ECC 없음 (긴 작업 weight 손실 위험).</li>
          <li><strong>워크로드 적합</strong> — 단일 GPU 추론, prototyping, gaming, Filecoin SNARK. 학습은 Pro/DC 권장.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-3. NPU — TPU · Trainium · Gaudi · LPU</h3>
        <p className="leading-7">
          NPU (Neural Processing Unit) 는 AI 워크로드에 특화된 가속기.
          <br />
          GPU 와 달리 graphics 기능 없고, 행렬 곱 / convolution 에 더 효율적인 systolic array 같은 구조.
        </p>
      </div>
      <NpuVsGpuViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-10">
        <h3 className="text-xl font-semibold mt-8 mb-3">2-4. 가속기 종류별 운영 결정</h3>

        <h4 className="text-lg font-semibold mt-6 mb-2">Google TPU (v5p · v6 Trillium)</h4>
        <p className="leading-7">
          Google 이 2015 부터 자체 개발. systolic array 기반의 행렬 곱 전용 칩 + 큰 on-chip SRAM. NVIDIA Tensor Core 의 사상의 원조.
          <br />
          GCP 전용 — 외부 판매 X. Google 사내 (검색 · YouTube · Bard) + GCP 고객만 사용.
          <br />
          v5p (2023) 는 4096 칩 pod 까지 확장. Gemini 학습이 TPU pod 에서. v6 Trillium (2024) 은 v5e 의 4.7 배 throughput.
          <br />
          소프트웨어 — XLA 컴파일러. JAX 가 first-class. PyTorch 도 PyTorch/XLA 로 지원.
          <br />
          가격 — H100 대비 ~30~50% 저렴. 단 GCP 락인. 학습 후 추론은 TPU 또는 GPU 둘 다 가능.
        </p>

        <h4 className="text-lg font-semibold mt-6 mb-2">AWS Trainium 2 / Inferentia 2</h4>
        <p className="leading-7">
          AWS 가 자체 설계 (Annapurna Labs 인수). Trainium = 학습, Inferentia = 추론.
          <br />
          Trainium 2 (2024) = 한 칩 1.3 PFLOPs (FP8). 16 칩 instance · 64 칩 UltraServer · 100K+ 칩 UltraCluster.
          <br />
          소프트웨어 — Neuron SDK. PyTorch 표준 코드를 Neuron compiler 로 변환. Anthropic Claude 가 Trainium 으로 학습 (Project Rainier 100K+ chip cluster).
          <br />
          가격 — H100 대비 ~50%. AWS 락인. Bedrock / SageMaker 와 통합.
        </p>

        <h4 className="text-lg font-semibold mt-6 mb-2">Intel Gaudi 3</h4>
        <p className="leading-7">
          Intel 의 Habana Labs 인수 (2019) 후 데이터센터 AI 가속기.
          <br />
          Gaudi 3 (2024) = 1835 TFLOPs (FP8). 128 GB HBM2e. ROCe over Ethernet (InfiniBand 대신 표준 ethernet).
          <br />
          소프트웨어 — SynapseAI (Habana 자체 SDK). PyTorch 지원이지만 ecosystem 좁음.
          <br />
          가격 — H100 의 ~50~70%. 그러나 ecosystem 약점으로 채택 제한적. Intel 의 미래 — Gaudi → Falcon Shores 통합 (GPU + AI).
        </p>

        <h4 className="text-lg font-semibold mt-6 mb-2">Groq LPU (Language Processing Unit)</h4>
        <p className="leading-7">
          LLM 추론 ultra-low latency 에 특화. 일반 GPU 와 완전히 다른 아키텍처 — deterministic dataflow + 모든 weight 가 on-chip SRAM (HBM 사용 X).
          <br />
          token/s 가 H100 의 10x+. Llama 70B 가 ~600 token/s (H100 의 60 token/s 대비 10x). 사용자 체감 latency 결정적.
          <br />
          한계 — 학습 불가 (추론 only). on-chip SRAM only 라 큰 모델은 여러 칩 분산. 칩 자체가 비싸 (~$20K) ROI 는 latency-critical 워크로드만.
          <br />
          유스 케이스 — chat 의 즉시 응답 (실시간 SaaS), 음성 AI, 게임 NPC. groq.com cloud 또는 자가 호스팅.
        </p>

        <h4 className="text-lg font-semibold mt-6 mb-2">Cerebras WSE (Wafer-Scale Engine)</h4>
        <p className="leading-7">
          단일 wafer (300mm) 전체가 한 칩 — 4 trillion 트랜지스터, 850K AI cores, 44 GB on-chip SRAM, 21 PB/s memory bandwidth.
          <br />
          왜 wafer-scale 인가 — 큰 모델 학습 시 model parallel + tensor parallel 의 통신이 병목. 모든 weight 가 한 칩 안에 있으면 통신 비용 0.
          <br />
          GPT-3 175B 학습이 단일 CS-3 시스템 (4 wafer) 에 들어감. NVIDIA H100 256 GPU 클러스터 대신 4 wafer.
          <br />
          가격 — 시스템 ~$3M. lock-in 강함 (Cerebras SDK 만). 특수 워크로드 (큰 모델 학습 + 과학 시뮬) 에 한정.
        </p>

        <h4 className="text-lg font-semibold mt-6 mb-2">한국 — Rebellions · FuriosaAI</h4>
        <p className="leading-7">
          Rebellions ATOM (2023) — 추론 특화. Llama 7B 추론 비용 H100 의 50%. SK Telecom · 삼성 SDS 도입.
          <br />
          FuriosaAI WARBOY (2022) → RNGD (2024) — 추론 특화. KT · 삼성 도입. 한국 정부 K-AI 정책의 backed.
          <br />
          공통점 — 추론 특화 (학습 X). 한국 sovereign AI 의 핵심 부품. 가격 / 가성비 우위지만 ecosystem 은 한국 특화.
          <br />
          중요성 — 한국 AI 인프라 자립의 핵심. NVIDIA 의 export control 위험 분산.
        </p>

        <h4 className="text-lg font-semibold mt-6 mb-2">SambaNova · Tenstorrent</h4>
        <p className="leading-7">
          SambaNova SN40L — DataFlow 아키텍처. 큰 모델 추론 + fine-tuning. 정부 / enterprise 주요 고객.
          <br />
          Tenstorrent Wormhole / Blackhole — RISC-V 기반 AI 칩. open hardware. Jim Keller (전 AMD/Intel/Tesla 칩 디자이너) 의 회사. 흥미로운 wildcard.
        </p>

        <ul className="leading-7">
          <li><strong>운영 결정 요약</strong> — 학습은 H100/H200/B200 또는 TPU/Trainium (cloud lock-in 수용 시), 대규모 추론은 MI300X (가격 우위) 또는 LPU (latency 우위), 한국 sovereign 은 Rebellions/FuriosaAI.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-5. 운영 시 함정</h3>
        <ul className="leading-7">
          <li><strong>HBM 부족 시 swap 폭주</strong> — H100 80 GB 에 70B 모델 (FP16 = 140 GB) 안 들어감. 두 카드 NVLink 또는 FP8/Q4 양자화. 모르면 학습 시간 5x.</li>
          <li><strong>NCCL 통신 병목</strong> — 다중 GPU 학습 시 all-reduce 가 NVLink/InfiniBand 대역폭에 묶임. 컨슈머 GPU 의 PCIe 만으론 분산 학습 비효율.</li>
          <li><strong>드라이버 버전 호환</strong> — CUDA / ROCm / Driver 버전 매칭 실수가 OOM 또는 silent corrupt. 컨테이너 (NGC · ROCm) 권장.</li>
          <li><strong>전력 + 공조 미스매치</strong> — H100 700W × 8 = 5.6 kW/노드. rack PDU 와 cooling 용량 미리 계산.</li>
          <li><strong>ECC OFF / non-ECC 메모리</strong> — 긴 학습 (수일) 에 single bit error → loss spike 또는 weight corrupt. ECC 필수.</li>
        </ul>
      </div>
    </section>
  );
}
