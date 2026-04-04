import CodePanel from '@/components/ui/code-panel';

const windowKernel = `// 스칼라 윈도우 추출 커널
// 각 스레드가 하나의 (point, window) 쌍을 처리
__global__ void extract_windows(
    const uint32_t* scalars,  // [n][8] — 256-bit 스칼라 (리틀엔디안 limb)
    uint16_t* window_vals,    // [num_windows][n] — 추출된 윈도우 값
    const int n,
    const int c,              // 윈도우 비트 수 (예: 16)
    const int num_windows     // ceil(254 / c)
) {
    int point_idx  = blockIdx.x * blockDim.x + threadIdx.x;
    int window_idx = blockIdx.y;
    if (point_idx >= n || window_idx >= num_windows) return;

    // 비트 위치 계산
    int bit_start = window_idx * c;
    int limb_idx  = bit_start / 32;
    int bit_off   = bit_start % 32;

    // 윈도우 값 추출: (scalar >> bit_start) & mask
    uint32_t mask = (1u << c) - 1;
    uint32_t val  = scalars[point_idx * 8 + limb_idx] >> bit_off;

    // 윈도우가 limb 경계를 넘는 경우 상위 limb도 참조
    if (bit_off + c > 32 && limb_idx + 1 < 8) {
        val |= scalars[point_idx * 8 + limb_idx + 1] << (32 - bit_off);
    }
    val &= mask;

    window_vals[window_idx * n + point_idx] = (uint16_t)val;
}`;

const launchCode = `// 커널 런치 설정
// gridDim.x = ceil(n / 256): 점 차원
// gridDim.y = num_windows:    윈도우 차원
// blockDim.x = 256

int c = 16;
int num_windows = (254 + c - 1) / c;  // = 16

dim3 block(256);
dim3 grid((n + 255) / 256, num_windows);

extract_windows<<<grid, block>>>(
    d_scalars, d_window_vals, n, c, num_windows
);`;

export default function WindowPartition() {
  return (
    <section id="window-partition" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">윈도우 분할과 스레드 매핑</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          첫 번째 단계는 254-bit 스칼라를 c-bit 윈도우로 분해하는 것이다.<br />
          각 스레드가 하나의 (점, 윈도우) 쌍을 처리한다.
          2D 그리드를 사용해 x축은 점 인덱스, y축은 윈도우 인덱스에 대응시킨다.
        </p>
        <p>
          윈도우 추출은 비트 시프트와 마스킹으로 구현한다.
          256-bit 스칼라는 8개의 32-bit limb로 저장되므로,
          윈도우가 limb 경계를 넘는 경우 두 limb를 참조해야 한다.
        </p>
        <CodePanel title="스칼라 윈도우 추출 CUDA 커널" code={windowKernel} annotations={[
          { lines: [4, 10], color: 'sky', note: '입력: 스칼라 배열 + 출력 윈도우 배열' },
          { lines: [11, 13], color: 'emerald', note: '2D 인덱싱: 점 x 윈도우' },
          { lines: [21, 22], color: 'amber', note: '비트 시프트 + 마스킹' },
          { lines: [25, 27], color: 'violet', note: 'limb 경계 처리' },
        ]} />

        <h3 className="text-xl font-semibold mt-8 mb-3">커널 런치 구성</h3>
        <p>
          n = 2^22(약 4백만 점), c = 16일 때 그리드는 16,384 x 16 블록이다.<br />
          총 스레드 수는 약 6,700만으로, 현대 GPU의 SM 수십 개를 완전히 활용한다.
        </p>
        <CodePanel title="2D 그리드 런치" code={launchCode} annotations={[
          { lines: [2, 4], color: 'sky', note: '그리드 차원 설명' },
          { lines: [9, 10], color: 'emerald', note: 'dim3 설정' },
        ]} />
      </div>
    </section>
  );
}
