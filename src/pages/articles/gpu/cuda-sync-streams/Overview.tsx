import CodePanel from '@/components/ui/code-panel';

const syncLevelsCode = `CUDA 동기화 수준:

1. Thread-level (워프 내)
   __syncwarp()           // 워프(32스레드) 내 동기화

2. Block-level (블록 내)
   __syncthreads()        // 블록 내 전체 스레드 동기화
   __syncthreads_count()  // 동기화 + 조건 만족 스레드 수 반환

3. Device-level (디바이스 전체)
   cudaDeviceSynchronize()  // 호스트가 디바이스 작업 완료 대기

4. Stream-level (스트림 단위)
   cudaStreamSynchronize(stream)  // 특정 스트림 완료 대기
   cudaStreamWaitEvent(stream, event)  // 이벤트 기반 의존성`;

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">동기화 메커니즘</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          GPU 병렬 프로그래밍에서 동기화는 정확성과 성능을 동시에 결정합니다.
          <br />
          동기화가 부족하면 데이터 경쟁(race condition)이 발생하고, 과도하면 병렬성이 저하됩니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">동기화 수준</h3>
        <p>
          CUDA는 네 가지 수준의 동기화를 제공합니다.<br />
          워프 내부, 블록 내부, 디바이스 전체, 스트림 단위입니다.<br />
          범위가 좁을수록 오버헤드가 적고, 넓을수록 비용이 큽니다.
        </p>

        <CodePanel title="CUDA 동기화 수준별 API" code={syncLevelsCode}
          annotations={[
            { lines: [3, 4], color: 'sky', note: '워프 내 동기화 (가장 경량)' },
            { lines: [6, 8], color: 'emerald', note: '블록 내 동기화 (공유 메모리 일관성)' },
            { lines: [10, 11], color: 'amber', note: '디바이스 전체 (호스트 블로킹)' },
            { lines: [13, 15], color: 'violet', note: '스트림 단위 (비동기 제어)' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">__syncthreads()가 필요한 이유</h3>
        <p>
          공유 메모리에 데이터를 쓴 뒤 다른 스레드가 읽으려면,
          모든 스레드의 쓰기가 완료되었음을 보장해야 합니다.
          <code>__syncthreads()</code>는 블록 내 모든 스레드가 해당 지점에 도달할 때까지 대기합니다.
        </p>
        <p>
          타일링 행렬 곱셈에서 공유 메모리 로드 직후 <code>__syncthreads()</code>를 호출하는 이유가 바로 이것입니다.<br />
          생략하면 아직 로드되지 않은 값을 읽어 잘못된 결과가 나옵니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">cudaDeviceSynchronize()의 비용</h3>
        <p>
          <code>cudaDeviceSynchronize()</code>는 GPU의 모든 작업이 끝날 때까지 CPU를 블로킹합니다.<br />
          디버깅에는 편리하지만, 프로덕션에서는 CPU-GPU 중첩 실행을 차단합니다.<br />
          대안으로 스트림 기반 동기화를 사용하면 필요한 작업만 선택적으로 대기할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
