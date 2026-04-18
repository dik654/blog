export const STEPS = [
  {
    label: '① CPU vs GPU: 왜 GPU가 빠른가',
    body: 'CPU: 4~128 코어, 각 코어에 대형 캐시 + 분기 예측 + OoO 실행. 순차 작업에 최적화.\nGPU(H100): 16,896 CUDA 코어 + 528 Tensor Core. 단순 연산을 수천 개 동시 처리.\n딥러닝의 핵심 연산: C = A × B (행렬 곱). A ∈ R^{m×k}, B ∈ R^{k×n} → m×n×k 번 곱셈-덧셈.\nH100 Tensor Core: FP16에서 989 TFLOPS. CPU(Intel Xeon) FP32: 약 2 TFLOPS. 약 500배 차이.\n실제 학습 시간 비교: ResNet-50 학습 — CPU 14일 vs 1 GPU 3시간 vs 8 GPU 30분.\n메모리 대역폭도 핵심: H100 HBM3 3.35 TB/s vs CPU DDR5 약 100 GB/s. 데이터 공급 속도가 연산 병목을 결정.',
  },
  {
    label: '② Mixed Precision: FP32 → FP16/BF16',
    body: 'FP32: 1 sign + 8 exponent + 23 mantissa = 32bit. 범위 ±3.4×10^38, 정밀도 7자리.\nFP16: 1+5+10 = 16bit. 범위 ±65,504. 정밀도 3자리. 메모리 절반, Tensor Core에서 2x 빠름.\nBF16: 1+8+7 = 16bit. FP32와 동일한 범위(8-bit exponent) + 낮은 정밀도 → overflow/underflow 거의 없음.\nMixed Precision 전략: Forward pass와 Gradient는 FP16/BF16, Master weight는 FP32로 유지.\nLoss Scaling: FP16 gradient 소실 방지. loss에 큰 수(1024~65536) 곱한 뒤 역전파 → gradient를 다시 나눔.\n효과: GPT-3 175B 학습 시 메모리 40% 절감(700GB→420GB), Tensor Core 활용으로 속도 1.5~3x 향상.',
  },
  {
    label: '③ 분산 학습: Data / Model / ZeRO',
    body: 'Data Parallel (DP): 각 GPU에 모델 전체 복제 → 배치를 N등분 → 각자 forward/backward → AllReduce로 기울기 평균.\n유효 배치 크기 = batch_per_gpu × N_gpu. 8 GPU, batch 32 → 유효 256. 학습률도 선형 스케일링 필요.\nModel Parallel — Tensor: 하나의 행렬을 GPU에 분할. A = [A₁|A₂], GPU₁이 A₁x, GPU₂가 A₂x 계산.\nModel Parallel — Pipeline: 층을 GPU에 분배. GPU₁: Layer 1-10, GPU₂: Layer 11-20. 마이크로배치로 버블 최소화.\nZeRO(Zero Redundancy Optimizer): Stage 1: optimizer state 분산(4x 절감). Stage 2: +gradient(8x). Stage 3: +weight(N배).\nGPT-3 175B 학습: ZeRO-3 + 3D parallelism(DP×TP×PP). 1024 A100 GPU, 약 34일 학습.',
  },
  {
    label: '④ Flash Attention: O(n) 메모리',
    body: '표준 Attention: S = QKᵀ ∈ R^{n×n} 전체를 HBM에 저장 → O(n²) 메모리. n=128K이면 S만 64GB.\nFlash Attention(Dao 2022): Q,K,V를 블록(B_r × B_c) 단위로 SRAM에 로드 → 타일별 softmax 계산.\nOnline Softmax: 블록별 max와 sum을 점진적으로 업데이트 — 전체 행을 보지 않고도 정확한 softmax 계산.\n메모리: O(n²) → O(n). n=8K일 때 256MB → 32KB. HBM↔SRAM 전송(IO) 횟수가 핵심 병목.\n속도: 표준 attention 대비 2~4x 빠름. 이유: HBM 읽기/쓰기 횟수를 O(n²/B_c) → O(n²/(B_r·B_c))로 감소.\nFlash Attention 2/3: 더 세밀한 타일링 + warp-level 병렬화. 현재 모든 LLM(GPT-4, Claude, LLaMA)의 표준.',
  },
  {
    label: '⑤ 추가 최적화 기법',
    body: 'Kernel Fusion: LayerNorm+Dropout+Add를 하나의 CUDA 커널로 통합 → HBM 읽기/쓰기 횟수 감소, 20~30% 속도 향상.\nGradient Checkpointing: 중간 activation을 저장하지 않고 backward 시 재계산. 메모리 O(n) → O(√n), 시간 +33%.\nZeRO-Offload: optimizer state를 CPU/NVMe로 이관. GPU 메모리 부족 시 10x 큰 모델 학습 가능. 속도 40% 감소 트레이드오프.\nPaged Attention (vLLM): KV cache를 페이지 단위(4KB)로 관리 — 메모리 단편화 해소. 처리량 2~4x 향상.\nContinuous Batching: 요청 완료 시 즉시 새 요청 삽입 → GPU 유휴 시간 최소화. 처리량 23x 향상(Orca 2022).\nSpeculative Decoding: 작은 draft 모델이 k토큰 예측 → 큰 모델이 한 번에 검증. 품질 동일, 속도 2~3x.',
  },
];

export const C = {
  cpu: '#6366f1',
  gpu: '#10b981',
  fp32: '#3b82f6',
  fp16: '#f59e0b',
  dist: '#8b5cf6',
  flash: '#ef4444',
  opt: '#0ea5e9',
  muted: 'var(--muted-foreground)',
  fg: 'var(--foreground)',
};
