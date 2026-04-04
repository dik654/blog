export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">행렬 곱셈과 스레드 매핑</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          행렬 곱셈 <strong>C = A * B</strong>는 GPU 병렬 프로그래밍의 대표적인 예제입니다.
          <br />
          A가 M x N, B가 N x K 행렬일 때, 결과 C는 M x K 행렬이 됩니다.<br />
          C의 각 원소 C[row][col]은 A의 row번째 행과 B의 col번째 열의 내적(dot product)입니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">스레드-원소 매핑</h3>
        <p className="leading-7">
          가장 직관적인 병렬화 전략은 <strong>C의 각 원소 하나를 스레드 하나가 담당</strong>하는 것입니다.
          <br />
          출력 행렬 C가 M x K이면, 총 M * K개의 스레드가 필요합니다.
        </p>

        <div className="overflow-x-auto my-4">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">요소</th>
                <th className="border border-border px-4 py-2 text-left">매핑</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['blockDim', 'TILE_SIZE x TILE_SIZE (보통 16x16 또는 32x32)'],
                ['gridDim.x', 'ceil(K / blockDim.x) -- 출력 열 방향'],
                ['gridDim.y', 'ceil(M / blockDim.y) -- 출력 행 방향'],
                ['threadIdx', '블록 내에서 (col, row) 위치 결정'],
                ['글로벌 인덱스', 'row = blockIdx.y * blockDim.y + threadIdx.y'],
              ].map(([elem, mapping]) => (
                <tr key={elem}>
                  <td className="border border-border px-4 py-2 font-medium whitespace-nowrap">{elem}</td>
                  <td className="border border-border px-4 py-2">{mapping}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">2D 그리드 레이아웃</h3>
        <p className="leading-7">
          출력 행렬 C가 2차원이므로 <strong>2D 블록(blockDim)과 2D 그리드(gridDim)</strong>를 사용합니다.
          <br />
          각 스레드는 자신의 글로벌 (row, col) 좌표를 계산한 뒤, A의 해당 행 전체와 B의 해당 열 전체를 읽어 내적을 수행합니다.
        </p>
        <p className="leading-7">
          이 매핑은 단순하지만, 메모리 접근 패턴에서 심각한 비효율이 발생합니다.<br />
          나이브 구현에서 그 문제를 구체적으로 살펴봅니다.
        </p>
      </div>
    </section>
  );
}
