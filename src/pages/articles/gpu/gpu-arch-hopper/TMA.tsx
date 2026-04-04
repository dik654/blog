import { CitationBlock } from '@/components/ui/citation';
import CodePanel from '@/components/ui/code-panel';

const manualCode = `// 기존 방식: 스레드가 직접 주소 계산 + 공유 메모리 로드
__global__ void manual_load(float* gmem, int H, int W) {
    __shared__ float tile[TILE_H][TILE_W];
    int row = blockIdx.y * TILE_H + threadIdx.y;
    int col = blockIdx.x * TILE_W + threadIdx.x;
    // 경계 검사 필요
    if (row < H && col < W)
        tile[threadIdx.y][threadIdx.x] = gmem[row * W + col];
    __syncthreads();
    // ... 연산
}`;

const tmaCode = `// TMA 방식: 디스크립터로 텐서 형상 정의, 하드웨어가 복사
// 1. 호스트에서 TMA 디스크립터 생성
CUtensorMap desc;
cuTensorMapEncodeTiled(&desc,
    CU_TENSOR_MAP_DATA_TYPE_FLOAT32,
    2,              // 2D 텐서
    gmem_ptr,       // 글로벌 메모리 포인터
    {W, H},         // 텐서 크기
    {W * sizeof(float), 0}, // 스트라이드
    {TILE_W, TILE_H},       // 타일 크기
    CU_TENSOR_MAP_SWIZZLE_NONE);

// 2. 커널에서 한 줄로 비동기 복사
__global__ void tma_load(const __grid_constant__ CUtensorMap desc) {
    __shared__ float tile[TILE_H][TILE_W];
    if (threadIdx.x == 0)
        cp_async_bulk_tensor_2d(&tile, &desc, bx, by);
    __syncthreads();
}`;

const tmaAnnotations = [
  { lines: [3, 10] as [number, number], color: 'sky' as const, note: '호스트: 디스크립터 생성' },
  { lines: [13, 16] as [number, number], color: 'emerald' as const, note: '커널: 1스레드가 벌크 복사 발행' },
];

export default function TMA() {
  return (
    <section id="tma" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Tensor Memory Accelerator (TMA)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          기존 CUDA에서 다차원 텐서를 공유 메모리로 로드하려면, 각 스레드가 인덱스를 계산하고 경계를 검사해야 했습니다.<br />
          스레드 수백 개가 동일한 주소 계산 로직을 반복 실행합니다. 비효율적입니다.
        </p>
        <p className="leading-7">
          Hopper의 <strong>TMA</strong>는 SM 내부에 탑재된 하드웨어 유닛입니다.<br />
          텐서 형상(shape, stride, data type)을 <strong>TMA 디스크립터</strong>에 미리 인코딩해 두면,
          <code>cp.async.bulk</code> 명령 하나로 글로벌 메모리에서 공유 메모리로 DMA 전송을 수행합니다.<br />
          스레드 하나만 발행하면 나머지는 연산에 집중할 수 있습니다.
        </p>

        <CitationBlock source="NVIDIA H100 Whitepaper -- Tensor Memory Accelerator" citeKey={3} type="paper"
          href="https://resources.nvidia.com/en-us-tensor-core">
          <p className="italic">"TMA supports up to 5-dimensional tensor addressing, handles out-of-bounds
          clamping automatically, and works asynchronously without occupying CUDA cores."</p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">기존 방식 vs TMA 방식</h3>
        <CodePanel title="기존: 스레드별 수동 로드" code={manualCode} lang="python" />
        <CodePanel title="TMA: 디스크립터 + 벌크 복사" code={tmaCode} lang="python" annotations={tmaAnnotations} />

        <h3 className="text-xl font-semibold mt-6 mb-3">TMA의 핵심 이점</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">항목</th>
                <th className="border border-border px-4 py-2 text-left">수동 로드</th>
                <th className="border border-border px-4 py-2 text-left">TMA</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['주소 계산', '모든 스레드가 개별 수행', '하드웨어가 디스크립터로 일괄 처리'],
                ['경계 검사', 'if 분기 필수', '자동 클램핑 (OOB zero-fill)'],
                ['발행 스레드', '워프 전체 참여', '1개 스레드면 충분'],
                ['최대 차원', '수동 인덱싱 한계', '5D 텐서까지 지원'],
                ['비동기 실행', 'cp.async (제한적)', 'cp.async.bulk (완전 비동기)'],
              ].map(([item, manual, tma]) => (
                <tr key={item}>
                  <td className="border border-border px-4 py-2 font-medium">{item}</td>
                  <td className="border border-border px-4 py-2">{manual}</td>
                  <td className="border border-border px-4 py-2 font-semibold">{tma}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
