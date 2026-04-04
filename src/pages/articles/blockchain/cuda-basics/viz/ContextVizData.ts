export const C = { cuda: '#6366f1', gpu: '#f59e0b', err: '#ef4444', ok: '#10b981', hw: '#71717a' };

export const STEPS = [
  {
    label: 'CUDA 커널: __global__ void + <<<grid, block>>> 호출',
    body: 'GPU 함수(__global__)를 <<<gridDim, blockDim>>>으로 호출, 각 스레드가 threadIdx로 자기 위치 파악',
  },
  {
    label: '스레드 계층: gridDim × blockDim = 전체 스레드 수',
    body: 'tid = blockIdx.x * blockDim.x + threadIdx.x → 전역 인덱스, 각 스레드가 독립 데이터 처리',
  },
  {
    label: '커널 실행: cudaMalloc → cudaMemcpy → kernel<<<>>> → cudaMemcpy',
    body: 'Host→Device 복사 → 커널 실행 → Device→Host 복사, 전체 파이프라인 3단계',
  },
  {
    label: '블록체인 커널 예시: 서명 검증 배치 병렬화',
    body: 'tx_verify<<<n_blocks, 256>>>(sigs, pubs, msgs) → 각 스레드가 1개 서명 독립 검증',
  },
];
