/**
 * GPU 용어 풀이 — 사양표 옆에 두면 이해 됨.
 */
export default function Glossary() {
  return (
    <section id="glossary" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">먼저 — 사양에 나오는 용어 풀이</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          GPU 비교표를 봐도 무슨 말인지 모르면 비교가 안 된다.
          <br />
          여기서 이후 article 에 등장하는 핵심 용어를 한 번에 정리.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">메모리 종류</h3>
        <ul className="leading-7">
          <li>
            <strong>HBM (High Bandwidth Memory)</strong> — GPU die 옆에 작은 DRAM 칩 8~12 개를 <strong>3 차원으로 쌓아</strong> TSV (Through-Silicon Via, 실리콘 관통 전선) 로 연결한 메모리.
            인터페이스가 1024 bit (일반 DRAM 의 16x) 이라 같은 클럭에서도 대역폭이 압도적.
            HBM3 → HBM3e → HBM4 의 세대.
            가격이 GPU 의 BOM 의 큰 부분을 차지 (H100 80 GB 의 HBM 만 ~$2K).
            제조는 SK Hynix · Samsung · Micron 이 한다.
          </li>
          <li>
            <strong>GDDR (Graphics DDR)</strong> — 그래픽카드의 전통 메모리. 칩이 <strong>PCB 위에 따로 박혀</strong> GPU 와 트레이스로 연결.
            인터페이스 32 bit × 8 칩 = 256 bit 정도. HBM 보다 느리지만 (1~1.8 TB/s) 가격은 1/10.
            GDDR6 → GDDR6X → GDDR7. RTX 4090/5090 같은 컨슈머 GPU 가 사용.
          </li>
          <li>
            <strong>VRAM (Video RAM)</strong> — &quot;그래픽 카드의 메모리&quot; 통칭. HBM 또는 GDDR 의 총칭.
          </li>
          <li>
            <strong>대역폭 (Bandwidth, GB/s)</strong> — 1 초에 GPU die 로 옮길 수 있는 데이터 양.
            LLM 추론에선 weight 를 매 token 마다 메모리에서 읽어야 하므로 대역폭이 곧 throughput. H100 의 3.35 TB/s 는 70B 모델 (140 GB) 을 1 초에 23 회 통째로 읽을 수 있다는 뜻.
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">신뢰성 / 보호 기능</h3>
        <ul className="leading-7">
          <li>
            <strong>ECC (Error-Correcting Code)</strong> — 메모리 cell 이 cosmic ray · 전자기 노이즈로 1 비트 뒤집히는 (bit flip) 사고를 자동 정정.
            매 byte 에 parity bit 추가해서 single bit error 정정 + double bit error 검출 (SECDED).
            GB 당 연 1~2 회 발생 → 큰 메모리 (4 TB) 면 연 4~8 회.
            ECC 없으면 silent corruption (모르고 잘못된 값 사용).
            <strong>학습 weight 한 비트 깨짐 → loss spike 또는 weight 손상</strong>. 검증자 메모리 깨짐 → wrong attestation → 슬래싱.
            DC GPU 는 항상 ECC, 컨슈머 GPU 는 X.
          </li>
          <li>
            <strong>PLP (Power Loss Protection)</strong> — SSD 가 정전 시 캐시의 in-flight write 을 디스크로 commit 할 충분한 전력 (capacitor) 보유. 엔터프라이즈 NVMe 만 보유. 컨슈머 SSD 는 없어 정전 시 DB corrupt.
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">연산 / 정밀도</h3>
        <ul className="leading-7">
          <li>
            <strong>CUDA core</strong> — NVIDIA GPU 의 일반 부동소수점 연산 단위. SIMT (Single Instruction Multiple Thread) 모델. 그래픽 / 일반 GPGPU.
          </li>
          <li>
            <strong>Tensor Core</strong> — NVIDIA 가 V100 (2017) 부터 도입한 행렬 곱 전용 가속기. 한 사이클에 4×4 행렬 곱 + 누적 (FMA) 한 번. 같은 die 면적에서 CUDA core 의 ~10x throughput. AI 학습 / 추론의 핵심.
            세대 — 1st (V100) → 2nd (A100) → 3rd (H100) → 4th (B200).
          </li>
          <li>
            <strong>FP16 / FP32 / FP64 / BF16 / TF32 / FP8 / FP4</strong> — 부동소수점의 비트 수. FP32 (32 bit, 일반) → FP16 (16 bit, 절반 메모리 + 빠름 + 정밀도 ↓) → FP8 / FP4 (학습 / 추론 효율 극대화).
            BF16 = brain float 16 (Google), TF32 = tensor float 32 (NVIDIA, A100), FP8 = H100 의 Transformer Engine, FP4 = B200 의 새 표준. <strong>비트 수 절반 = 메모리 절반 + 속도 ~2x</strong>.
          </li>
          <li>
            <strong>Sparsity (Structural Sparsity)</strong> — 행렬의 절반을 0 으로 만들면 연산 절반 생략 가능. NVIDIA Ampere (A100) 부터 2:4 sparsity (4 개 중 2 개 0) 하드웨어 가속. 잘 정렬된 모델에 한해 ~2x 추가 throughput.
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">인터커넥트 (GPU 간 연결)</h3>
        <ul className="leading-7">
          <li>
            <strong>PCIe (PCI Express)</strong> — 모든 디바이스 연결 표준. PCIe 4.0 x16 = 32 GB/s (양방향), 5.0 = 64 GB/s.
            CPU 통과 필요 → multi-GPU 통신에 latency / bandwidth 병목.
          </li>
          <li>
            <strong>NVLink</strong> — NVIDIA 의 GPU-to-GPU 직접 연결. CPU / PCIe 우회.
            NVLink 3 (A100) = 600 GB/s, NVLink 4 (H100) = 900 GB/s, NVLink 5 (B200) = 1.8 TB/s.
            <strong>multi-GPU 학습 / LLM tensor parallelism 의 결정적 차이</strong>. 컨슈머 GPU 에는 없음.
          </li>
          <li>
            <strong>NVSwitch</strong> — NVLink 의 스위치. 한 노드의 8 GPU 를 모두 직접 연결 (full mesh). 더 나아가 NVLink Switch 시스템은 256 GPU 를 한 fabric 으로.
          </li>
          <li>
            <strong>InfiniBand</strong> — 노드 간 네트워크. 200 / 400 Gbps. RDMA 지원. 큰 학습 클러스터의 표준 (CPU 우회 노드 간 통신).
          </li>
          <li>
            <strong>SXM 모듈 vs PCIe 카드</strong> — SXM 은 서버 전용 socket (mezzanine 형태) 에 직결. NVLink + 더 많은 전력 (700W) 가능. PCIe 카드는 표준 슬롯, NVLink 제한.
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">소프트웨어 분할 / 가상화</h3>
        <ul className="leading-7">
          <li>
            <strong>MIG (Multi-Instance GPU)</strong> — A100 부터 도입. 한 물리 GPU 를 최대 7 개의 독립 instance 로 분할.
            메모리 / 컴퓨트 / 캐시 모두 격리. 클라우드 / 멀티 테넌트 운영자가 한 H100 을 7 명에게 임대 가능.
          </li>
          <li>
            <strong>Confidential Computing</strong> — H100 부터. GPU 메모리도 TEE (Trusted Execution Environment). CPU 측 SEV-SNP / TDX 와 결합해 host 도 GPU 메모리 못 봄. AI 추론의 사용자 데이터 보호.
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">전력 / 폼 팩터</h3>
        <ul className="leading-7">
          <li>
            <strong>TDP (Thermal Design Power)</strong> — 정상 작동 시 발생하는 열 (와트). 사실상 평균 전력 소비. H100 SXM 은 700W → 8 장 노드 = 5.6 kW.
            냉각 + 전력 인프라 결정 기준.
          </li>
          <li>
            <strong>HGX</strong> — NVIDIA 의 8-GPU baseboard 표준. SXM 모듈 8 장 + NVSwitch + power delivery 통합. Supermicro / Dell 같은 OEM 이 이 baseboard 위에 서버 디자인.
          </li>
          <li>
            <strong>DGX</strong> — NVIDIA 직접 제조 / 판매하는 완성 서버. HGX baseboard + CPU + 메모리 + 네트워크 통합. $200K+ 가격, 파트너 OEM 보다 비싸지만 설치 + 지원 통합.
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">기타 자주 등장</h3>
        <ul className="leading-7">
          <li>
            <strong>Transformer Engine</strong> — H100 부터. FP8 자동 동적 캐스팅 + scale 관리. 같은 학습 throughput 을 절반 메모리로 달성.
          </li>
          <li>
            <strong>DPX Instruction</strong> — H100 의 동적 프로그래밍 가속 명령어. genome alignment · path finding 같은 알고리즘의 inner loop. Filecoin SDR 같은 hash chain 도 일부 가속.
          </li>
          <li>
            <strong>NCCL (NVIDIA Collective Communication Library)</strong> — multi-GPU 의 all-reduce / broadcast / gather 표준. PyTorch 의 DDP / FSDP 가 내부 사용.
          </li>
          <li>
            <strong>cuBLAS / cuDNN</strong> — NVIDIA 의 BLAS / DNN 가속 라이브러리. PyTorch / TensorFlow 의 backend.
          </li>
        </ul>
      </div>
    </section>
  );
}
