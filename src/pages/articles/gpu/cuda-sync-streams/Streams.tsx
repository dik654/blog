import CodePanel from '@/components/ui/code-panel';

const streamCode = `// 스트림 생성 & 비동기 실행
cudaStream_t stream1, stream2;
cudaStreamCreate(&stream1);
cudaStreamCreate(&stream2);

// 비동기 메모리 복사 (호스트 → 디바이스)
cudaMemcpyAsync(d_A, h_A, size, cudaMemcpyHostToDevice, stream1);
cudaMemcpyAsync(d_B, h_B, size, cudaMemcpyHostToDevice, stream2);

// 각 스트림에서 커널 실행
kernel<<<grid, block, 0, stream1>>>(d_A, d_result_A);
kernel<<<grid, block, 0, stream2>>>(d_B, d_result_B);

// 비동기 메모리 복사 (디바이스 → 호스트)
cudaMemcpyAsync(h_result_A, d_result_A, size, cudaMemcpyDeviceToHost, stream1);
cudaMemcpyAsync(h_result_B, d_result_B, size, cudaMemcpyDeviceToHost, stream2);

// 정리
cudaStreamDestroy(stream1);
cudaStreamDestroy(stream2);`;

const pipelineCode = `// 파이프라인 패턴: 청크 A 복사 중 청크 B 연산
int chunkSize = N / NUM_CHUNKS;

for (int i = 0; i < NUM_CHUNKS; i++) {
    int offset = i * chunkSize;
    int stream_idx = i % 2;  // 2개 스트림 교대 사용

    // 1) 이번 청크 H→D 복사
    cudaMemcpyAsync(d_in + offset, h_in + offset,
        chunkSize * sizeof(float),
        cudaMemcpyHostToDevice, streams[stream_idx]);

    // 2) 이번 청크 커널 실행
    process<<<grid, block, 0, streams[stream_idx]>>>(
        d_in + offset, d_out + offset, chunkSize);

    // 3) 이번 청크 D→H 복사
    cudaMemcpyAsync(h_out + offset, d_out + offset,
        chunkSize * sizeof(float),
        cudaMemcpyDeviceToHost, streams[stream_idx]);
}`;

export default function Streams() {
  return (
    <section id="streams" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CUDA 스트림 & 동시 실행</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CUDA 스트림(stream)은 순서대로 실행되는 연산의 큐입니다.<br />
          서로 다른 스트림에 속한 연산은 동시에 실행될 수 있습니다.<br />
          이를 통해 메모리 전송과 커널 실행을 중첩(overlap)시킬 수 있습니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">기본 스트림 vs 사용자 스트림</h3>
        <p>
          스트림을 지정하지 않으면 기본 스트림(stream 0)을 사용합니다.<br />
          기본 스트림은 동기적으로 동작하여 모든 이전 작업이 완료된 후 실행됩니다.<br />
          사용자가 생성한 스트림은 비동기적으로 동작하며, 다른 스트림과 동시 실행이 가능합니다.
        </p>

        <CodePanel title="스트림 생성 & 비동기 실행" code={streamCode}
          annotations={[
            { lines: [2, 3], color: 'sky', note: '스트림 생성' },
            { lines: [6, 7], color: 'emerald', note: '비동기 H→D 복사 (동시 실행)' },
            { lines: [10, 11], color: 'amber', note: '서로 다른 스트림에서 커널 동시 실행' },
            { lines: [14, 15], color: 'violet', note: '비동기 D→H 복사' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">파이프라인 패턴</h3>
        <p>
          데이터를 청크로 나누고, 청크 A의 전송과 청크 B의 연산을 동시에 수행합니다.<br />
          GPU의 복사 엔진과 연산 엔진은 별도의 하드웨어이므로, 두 작업이 실제로 병렬 실행됩니다.<br />
          이 패턴으로 전체 처리 시간을 크게 단축할 수 있습니다.
        </p>

        <CodePanel title="파이프라인 패턴: 복사와 연산 중첩" code={pipelineCode}
          annotations={[
            { lines: [4, 4], color: 'sky', note: '2개 스트림 교대 사용' },
            { lines: [6, 9], color: 'emerald', note: 'H→D 비동기 복사' },
            { lines: [11, 13], color: 'amber', note: '커널 실행 (복사와 동시)' },
            { lines: [15, 18], color: 'violet', note: 'D→H 비동기 복사' },
          ]} />

        <p>
          주의: <code>cudaMemcpyAsync</code>는 호스트 메모리가 pinned memory(<code>cudaMallocHost</code>)여야
          진정한 비동기 전송이 가능합니다.<br />
          일반 <code>malloc</code> 메모리는 내부적으로 동기 복사로 폴백됩니다.
        </p>
      </div>
    </section>
  );
}
