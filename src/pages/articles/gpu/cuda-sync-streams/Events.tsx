import CodePanel from '@/components/ui/code-panel';

const timingCode = `// CUDA 이벤트로 커널 실행 시간 측정
cudaEvent_t start, stop;
cudaEventCreate(&start);
cudaEventCreate(&stop);

cudaEventRecord(start, stream);       // 시작 시점 기록
kernel<<<grid, block, 0, stream>>>(d_data);
cudaEventRecord(stop, stream);        // 종료 시점 기록

cudaEventSynchronize(stop);           // stop 이벤트 완료 대기
float ms = 0;
cudaEventElapsedTime(&ms, start, stop);  // 경과 시간 (밀리초)
printf("Kernel time: %.3f ms\\n", ms);

cudaEventDestroy(start);
cudaEventDestroy(stop);`;

const crossStreamCode = `// 크로스-스트림 의존성: stream2가 stream1 완료를 대기
cudaStream_t stream1, stream2;
cudaStreamCreate(&stream1);
cudaStreamCreate(&stream2);
cudaEvent_t event;
cudaEventCreate(&event);

// stream1: 데이터 전처리
preprocess<<<grid, block, 0, stream1>>>(d_input, d_temp);
cudaEventRecord(event, stream1);  // stream1에 이벤트 기록

// stream2: stream1의 전처리 완료 후 실행
cudaStreamWaitEvent(stream2, event);  // event 완료까지 대기
compute<<<grid, block, 0, stream2>>>(d_temp, d_output);

// stream1: 독립적인 다른 작업 (대기 없이 즉시 실행)
logging<<<1, 1, 0, stream1>>>(d_stats);

cudaEventDestroy(event);`;

export default function Events() {
  return (
    <section id="events" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CUDA 이벤트: 타이밍 & 의존성</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CUDA 이벤트(event)는 스트림 내 특정 시점을 표시하는 마커입니다.<br />
          두 가지 핵심 용도가 있습니다.<br />
          커널 실행 시간 측정과, 스트림 간 의존성 설정입니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">커널 타이밍 측정</h3>
        <p>
          <code>cudaEventRecord</code>로 시작과 끝을 기록하고,
          <code>cudaEventElapsedTime</code>으로 경과 시간을 구합니다.<br />
          GPU 타이머를 사용하므로 CPU 타이머보다 정확합니다.<br />
          호스트-디바이스 간 지연(latency)을 포함하지 않아 순수 GPU 실행 시간을 측정할 수 있습니다.
        </p>

        <CodePanel title="이벤트 기반 커널 타이밍" code={timingCode}
          annotations={[
            { lines: [2, 4], color: 'sky', note: '이벤트 생성' },
            { lines: [6, 8], color: 'emerald', note: '시작/종료 시점 기록' },
            { lines: [10, 12], color: 'amber', note: '동기화 후 경과 시간 계산' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">크로스-스트림 의존성</h3>
        <p>
          <code>cudaStreamWaitEvent</code>를 사용하면 한 스트림이 다른 스트림의 특정 지점을 대기할 수 있습니다.
          stream1에서 이벤트를 기록하고, stream2에서 해당 이벤트를 대기합니다.
          stream1의 나머지 작업은 영향 없이 계속 실행됩니다.
        </p>

        <CodePanel title="크로스-스트림 의존성 (cudaStreamWaitEvent)" code={crossStreamCode}
          annotations={[
            { lines: [7, 8], color: 'sky', note: 'stream1에서 전처리 후 이벤트 기록' },
            { lines: [10, 12], color: 'emerald', note: 'stream2가 이벤트 대기 후 실행' },
            { lines: [14, 15], color: 'amber', note: 'stream1은 독립 작업 계속 실행' },
          ]} />

        <p>
          이 패턴은 DAG(방향 비순환 그래프) 형태의 복잡한 의존성을 표현할 때 유용합니다.<br />
          예를 들어 ZK 증명 생성에서 MSM과 NTT가 서로 다른 스트림에서 실행되되,
          최종 결합 단계에서만 동기화하는 구조를 만들 수 있습니다.
        </p>
      </div>
    </section>
  );
}
