import CodePanel from '@/components/ui/code-panel';

const multiGpuCode = `// 다중 GPU 기본 패턴
int deviceCount;
cudaGetDeviceCount(&deviceCount);

for (int i = 0; i < deviceCount; i++) {
    cudaSetDevice(i);  // i번 GPU를 활성 디바이스로 설정
    cudaMalloc(&d_data[i], partSize);
    cudaMemcpyAsync(d_data[i], h_data + i * partSize,
        partSize, cudaMemcpyHostToDevice, streams[i]);
    kernel<<<grid, block, 0, streams[i]>>>(d_data[i], partSize);
}

// P2P (Peer-to-Peer) 접근 활성화
int canAccess;
cudaDeviceCanAccessPeer(&canAccess, 0, 1);  // GPU0 → GPU1 접근 가능?
if (canAccess) {
    cudaSetDevice(0);
    cudaDeviceEnablePeerAccess(1, 0);  // GPU0이 GPU1 메모리 직접 접근
    cudaSetDevice(1);
    cudaDeviceEnablePeerAccess(0, 0);  // GPU1이 GPU0 메모리 직접 접근
}

// P2P 메모리 복사 (호스트 경유 없이 GPU 간 직접 전송)
cudaMemcpyPeerAsync(d_dst, dstDevice, d_src, srcDevice, size, stream);`;

export default function MultiGpu() {
  return (
    <section id="multi-gpu" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">다중 GPU & 이종 병렬 컴퓨팅</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          단일 GPU의 메모리와 연산력이 부족할 때, 다중 GPU로 작업을 분산합니다.
          <code>cudaSetDevice</code>로 활성 GPU를 전환하고,
          각 GPU에 독립적으로 메모리 할당과 커널 실행을 수행합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">데이터 분할 & P2P 접근</h3>
        <p>
          가장 단순한 방법은 데이터를 균등 분할하여 각 GPU에 할당하는 것입니다.<br />
          GPU 간 데이터 교환이 필요하면 P2P(Peer-to-Peer) 접근을 활성화합니다.<br />
          NVLink로 연결된 GPU는 PCIe 대비 5~10배 높은 대역폭으로 직접 통신합니다.
        </p>

        <CodePanel title="다중 GPU 데이터 분할 & P2P 접근" code={multiGpuCode}
          annotations={[
            { lines: [2, 10], color: 'sky', note: 'GPU별 데이터 분할 & 커널 실행' },
            { lines: [13, 20], color: 'emerald', note: 'P2P 접근 가능 여부 확인 & 활성화' },
            { lines: [22, 23], color: 'amber', note: 'GPU 간 직접 메모리 전송' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">이종 병렬 컴퓨팅 (CPU + GPU)</h3>
        <p>
          비동기 스트림을 사용하면 GPU 커널 실행 중 CPU가 다른 작업을 수행할 수 있습니다.<br />
          CPU는 I/O, 데이터 전처리, 결과 후처리를 담당하고,
          GPU는 병렬 연산에 집중합니다.
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">역할</th>
                <th className="border border-border px-4 py-2 text-left">CPU</th>
                <th className="border border-border px-4 py-2 text-left">GPU</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['데이터 준비', '디스크 I/O, 파싱, 전처리', '-'],
                ['핵심 연산', '순차적 로직, 분기 처리', '대규모 병렬 연산 (커널)'],
                ['통신', '네트워크, API 호출', 'P2P, NVLink 전송'],
                ['후처리', '결과 검증, 집계, 저장', '-'],
              ].map(([role, cpu, gpu]) => (
                <tr key={role}>
                  <td className="border border-border px-4 py-2 font-medium">{role}</td>
                  <td className="border border-border px-4 py-2">{cpu}</td>
                  <td className="border border-border px-4 py-2">{gpu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4">
          핵심 원칙은 CPU와 GPU 각각의 유휴 시간을 최소화하는 것입니다.<br />
          스트림과 이벤트를 조합하면 복사, 연산, 후처리가 파이프라인으로 중첩 실행됩니다.
        </p>
      </div>
    </section>
  );
}
