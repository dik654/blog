import GPUParallelViz from './viz/GPUParallelViz';

export default function Acceleration() {
  return (
    <section id="acceleration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">딥러닝 고속화</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        핵심 연산 = 행렬 곱셈 → GPU(코어 수천~수만)가 최적 하드웨어.<br />
        2012 AlexNet 이후 GPU 학습 시대 개막. 현재 H100 + 혼합 정밀도 + 분산 학습.
      </p>
      <GPUParallelViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">GPU 왜 빠른가</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// CPU vs GPU 아키텍처 차이

// CPU (x86-64)
// - 코어: 4~128개
// - 복잡한 제어 로직 (out-of-order, branch prediction)
// - 큰 cache (수십 MB)
// - 최적화: sequential workload
// - 예: Intel Xeon 8180 = 28 cores

// GPU (NVIDIA H100)
// - SM (Streaming Multiprocessor): 132개
// - 각 SM에 128 CUDA cores = 16,896 total
// - 간단한 제어 로직
// - 작은 per-core cache
// - 최적화: parallel workload
// - Matrix acceleration (Tensor Cores)

// 딥러닝에 왜 GPU?
// 1) Matrix multiplication: 대규모 병렬 계산
// 2) Backprop: independent per-sample operations
// 3) Simple operations (add, multiply, ReLU): 단순 반복

// CPU 대비 성능
// - 32-bit float matmul: 10-50x 빠름
// - 16-bit (FP16): 100x+ 빠름 (Tensor Core)
// - 8-bit (INT8): 200x+ 빠름 (inference)

// 대안 하드웨어
// TPU (Google): Matrix ops 전용 ASIC
// NPU (Apple, Samsung): 모바일 특화
// FPGA: programmable, 추론 특화
// Custom ASIC: Cerebras, Groq`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Mixed Precision Training</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 단정도(FP32) vs 반정도(FP16/BF16)

// FP32: 4 bytes
// - Standard floating point
// - Range: ~1e-38 to ~1e38
// - Precision: ~7 decimal digits

// FP16: 2 bytes
// - IEEE 754 half precision
// - Range: ~6e-5 to ~65504
// - Precision: ~3 decimal digits
// - 절반 메모리, 2-4x 속도

// BF16: 2 bytes (brain float)
// - FP32와 같은 range (8-bit exponent)
// - 낮은 precision (7-bit mantissa)
// - Gradient overflow 적음
// - A100/H100/TPU 기본

// Mixed precision 원리
// 1) Forward: FP16 (2x 빠름)
// 2) Loss scaling: prevent underflow
// 3) Gradient: FP16
// 4) Master weights: FP32 (numerical stability)

// PyTorch 사용
from torch.cuda.amp import autocast, GradScaler

model = MyModel().cuda()
optimizer = torch.optim.Adam(model.parameters())
scaler = GradScaler()

for x, y in dataloader:
    x, y = x.cuda(), y.cuda()

    with autocast():
        output = model(x)
        loss = criterion(output, y)

    scaler.scale(loss).backward()
    scaler.step(optimizer)
    scaler.update()

// 효과
// - Memory: 40-50% 절감
// - Speed: 1.5-3x 빠름
// - Accuracy: 거의 동일 (올바른 loss scaling 시)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">분산 학습 (Distributed Training)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 여러 GPU/machine으로 확장

// 1. Data Parallelism
// - 모델 복제, 데이터 분산
// - 각 GPU에 mini-batch 할당
// - Gradient 평균 (AllReduce)
// - PyTorch DDP

# Data parallel training
import torch.distributed as dist
from torch.nn.parallel import DistributedDataParallel as DDP

dist.init_process_group("nccl")
model = DDP(model, device_ids=[local_rank])

// 장점: 단순, 대부분 모델에 적용
// 단점: 모델 크기 ≤ GPU 메모리

// 2. Model Parallelism
// - 모델을 여러 GPU로 split
// - Layer별 or tensor별 분산
// - GPU 간 통신 overhead

// Tensor Parallelism (Megatron)
// - Linear layer의 weight matrix split
// - AllReduce로 output 동기화

// Pipeline Parallelism (GPipe, PipeDream)
// - Layer를 stage로 split
// - Pipeline bubble 문제

// 3. ZeRO (Zero Redundancy Optimizer)
// - Optimizer state, gradient, weight 분산
// - Stage 1: optimizer state
// - Stage 2: gradient
// - Stage 3: parameter
// - DeepSpeed 구현
// - 큰 모델 훈련 표준

// 4. FSDP (Fully Sharded Data Parallel)
// - PyTorch native ZeRO-3
// - Automatic sharding

// 대규모 훈련 예 (LLaMA-70B)
// - 512 GPUs (A100 80GB)
// - Tensor parallel × 8
// - Pipeline parallel × 4
// - Data parallel × 16
// - ~21 days training`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Flash Attention & 최적화</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Flash Attention (Tri Dao, 2022)
// Attention 계산 memory-efficient하게

// 기존 attention
// attention(Q, K, V) = softmax(QK^T/√d) · V
// Memory: O(n²) for n-length sequence
// - n=2048 → 8MB (FP16, single head)
// - n=16384 → 512MB (bottleneck)

// Flash Attention 트릭
// 1) Tile-wise computation (blocks of Q, K, V)
// 2) Online softmax (running max/sum)
// 3) Memory: O(n) instead of O(n²)
// 4) HBM I/O 최소화

// 결과
// - 2-4x faster attention
// - 5-20x less memory
// - GPT-3 훈련에 사용
// - 현재 모든 LLM 표준

// PyTorch 2.0+ 내장
torch.nn.functional.scaled_dot_product_attention(Q, K, V)

// 기타 최적화
// - Kernel fusion: 여러 연산 하나로
// - Gradient checkpointing: memory-time tradeoff
// - ZeRO-Offload: CPU/NVMe offload
// - Paged Attention (vLLM inference)
// - Continuous batching
// - Speculative decoding`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">GPU 하드웨어 트렌드</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">GPU</th>
                <th className="border border-border px-3 py-2 text-left">년도</th>
                <th className="border border-border px-3 py-2 text-left">Memory</th>
                <th className="border border-border px-3 py-2 text-left">TF32 TFLOPs</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">GTX 580</td>
                <td className="border border-border px-3 py-2">2010</td>
                <td className="border border-border px-3 py-2">1.5GB</td>
                <td className="border border-border px-3 py-2">~1 TFLOPs</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">V100</td>
                <td className="border border-border px-3 py-2">2017</td>
                <td className="border border-border px-3 py-2">16-32GB</td>
                <td className="border border-border px-3 py-2">15 TFLOPs</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">A100</td>
                <td className="border border-border px-3 py-2">2020</td>
                <td className="border border-border px-3 py-2">40/80GB</td>
                <td className="border border-border px-3 py-2">156 TFLOPs</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">H100</td>
                <td className="border border-border px-3 py-2">2022</td>
                <td className="border border-border px-3 py-2">80GB</td>
                <td className="border border-border px-3 py-2">989 TFLOPs</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">B100/B200</td>
                <td className="border border-border px-3 py-2">2024</td>
                <td className="border border-border px-3 py-2">192GB</td>
                <td className="border border-border px-3 py-2">~5000 TFLOPs</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 하드웨어가 알고리즘을 주도</p>
          <p>
            <strong>"하드웨어 복권(hardware lottery)"</strong>:<br />
            - 현재 잘 되는 알고리즘 = 현재 HW에 맞는 알고리즘<br />
            - Transformer는 GPU에 최적화된 아키텍처<br />
            - RNN은 병렬화 어려워 밀려남
          </p>
          <p className="mt-2">
            <strong>Scaling Laws 주도 요인</strong>:<br />
            - Compute: GPU 성능 2년마다 2x<br />
            - Data: 인터넷 데이터 증가<br />
            - Parameters: 메모리 증가로 가능<br />
            - 3요소의 균형이 중요
          </p>
          <p className="mt-2">
            <strong>미래 전망</strong>:<br />
            - 전력 효율성 중요 (Data center power wall)<br />
            - 특화 ASIC 증가 (inference 전용)<br />
            - Quantum, Neuromorphic 연구<br />
            - On-device inference (mobile, edge)
          </p>
        </div>

      </div>
    </section>
  );
}
