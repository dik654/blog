export default function Performance() {
  return (
    <section id="performance" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">성능 비교 & 분석</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">글로벌 메모리 접근 비교</h3>
        <p className="leading-7">
          N x N 정사각 행렬 기준, 나이브와 타일링의 글로벌 메모리 로드 횟수를 비교합니다.<br />
          TILE_SIZE를 T라 하면, 타일링은 글로벌 로드를 <strong>T배</strong> 줄입니다.
        </p>

        <div className="overflow-x-auto my-4">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">지표</th>
                <th className="border border-border px-4 py-2 text-left">나이브</th>
                <th className="border border-border px-4 py-2 text-left">타일링 (T=16)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['C 원소당 글로벌 로드', '2N', '2N / T'],
                ['전체 글로벌 로드', '2N^3', '2N^3 / T'],
                ['N=1024 기준', '~2.1 x 10^9', '~1.3 x 10^8'],
                ['감소 비율', '1x (기준)', '16x 감소'],
                ['공유 메모리 사용', '0 bytes', 'T*T*4*2 = 2KB/블록'],
              ].map(([metric, naive, tiled]) => (
                <tr key={metric}>
                  <td className="border border-border px-4 py-2 font-medium">{metric}</td>
                  <td className="border border-border px-4 py-2">{naive}</td>
                  <td className="border border-border px-4 py-2">{tiled}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">점유율(Occupancy) 제약</h3>
        <p className="leading-7">
          타일링 커널은 블록당 공유 메모리를 사용하므로, SM(Streaming Multiprocessor)에서
          동시에 실행 가능한 블록 수가 제한됩니다.<br />
          T=16이면 블록당 2KB로 가벼우나, T=32이면 8KB로 증가합니다.
        </p>
        <p className="leading-7">
          SM의 공유 메모리 총량은 보통 48~100KB입니다.<br />
          T=32일 때 블록당 8KB이면 SM당 최대 6~12블록을 올릴 수 있습니다.<br />
          타일 크기를 늘리면 재사용률이 높아지지만, 점유율이 낮아질 수 있으므로 균형이 필요합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">부동소수점 정밀도</h3>
        <p className="leading-7">
          float(32비트)는 유효 숫자 약 7자리입니다.<br />
          N이 크면 내적 누적 과정에서 <strong>라운딩 오차</strong>가 쌓입니다.<br />
          double(64비트)은 유효 숫자 약 15자리로 정밀하지만,
          GPU 처리량이 float의 1/2 ~ 1/32 수준으로 크게 떨어집니다.
        </p>

        <div className="overflow-x-auto my-4">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">타입</th>
                <th className="border border-border px-4 py-2 text-left">유효 숫자</th>
                <th className="border border-border px-4 py-2 text-left">GPU 처리량 (상대)</th>
                <th className="border border-border px-4 py-2 text-left">메모리 사용</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['float (FP32)', '~7자리', '1x (기준)', '4 bytes'],
                ['double (FP64)', '~15자리', '1/2x (서버) ~ 1/32x (소비자)', '8 bytes'],
              ].map(([type, digits, throughput, mem]) => (
                <tr key={type}>
                  <td className="border border-border px-4 py-2 font-medium">{type}</td>
                  <td className="border border-border px-4 py-2">{digits}</td>
                  <td className="border border-border px-4 py-2">{throughput}</td>
                  <td className="border border-border px-4 py-2">{mem}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="leading-7">
          실전에서는 float 타일링 커널이 대부분의 응용에 충분합니다.<br />
          과학 계산이나 ZK 증명처럼 높은 정밀도가 필요한 경우에만 double 또는 정수 연산을 사용합니다.
        </p>
      </div>
    </section>
  );
}
