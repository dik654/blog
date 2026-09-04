import CodePanel from "@/components/ui/code-panel";

const eventCode = `cudaEvent_t ready, start, stop;
cudaEventCreateWithFlags(&ready, cudaEventDisableTiming);
cudaEventCreate(&start);
cudaEventCreate(&stop);

producer<<<grid, block, 0, streamA>>>(buffer);
cudaEventRecord(ready, streamA);          // producer 뒤 marker
cudaStreamWaitEvent(streamB, ready, 0);  // streamB에 dependency edge 추가
consumer<<<grid, block, 0, streamB>>>(buffer);

cudaEventRecord(start, streamB);
measured<<<grid, block, 0, streamB>>>(buffer);
cudaEventRecord(stop, streamB);
cudaEventSynchronize(stop);
float ms{};
cudaEventElapsedTime(&ms, start, stop);`;

export default function Events() {
  return (
    <section id="events" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Event는 device timeline의 marker이며 dependency와 measurement를 구분해
        사용합니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          <code>cudaEventRecord</code>는 host 시각을 즉시 저장하는 호출이 아니라
          해당 stream의 앞선 작업 뒤에 marker를 enqueue합니다. 다른 stream의{" "}
          <code>cudaStreamWaitEvent</code>는 host를 막지 않고 그 marker 뒤에만
          consumer를 배치합니다. Device 전체를 synchronize하는 대신
          producer→consumer edge 하나를 추가하므로 독립 작업은 계속 진행할 수
          있습니다.
        </p>
        <p>
          Timing event 두 개를 같은 stream 구간에 기록하면 device-side elapsed time을 얻을 수 있지만 첫 launch의 JIT·cache warm-
          up·clock variation·다른 workload contention을 자동으로 제거하지는 않습니다. Warm-up, 반복 횟수, synchronization point,
          GPU clock/power state, input size와 statistic을 기록해야 재현 가능한 measurement가 됩니다. Event timing을 끈 marker는
          dependency용으로 더 명확합니다.
        </p>
      </div>
      <CodePanel
        title="Cross-stream dependency와 timing event"
        code={eventCode}
        annotations={[
          {
            lines: [1, 4],
            color: "sky",
            note: "Dependency와 timing event 분리",
          },
          { lines: [6, 9], color: "emerald", note: "Producer→consumer edge" },
          { lines: [11, 16], color: "amber", note: "같은 stream 구간 측정" },
        ]}
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 className="mt-8 text-xl font-semibold">
          Event graph를 읽는 세 가지 질문
        </h3>
        <ol>
          <li>
            Event가 어느 device와 stream에서 record됐으며 consumer는 어느
            stream에서 기다리는가?
          </li>
          <li>
            Marker 앞 producer가 실제로 필요한 모든 write를 포함하고, wait 뒤
            consumer가 같은 buffer revision을 읽는가?
          </li>
          <li>
            Dependency가 cycle을 만들거나 재사용한 event가 예상과 다른
            generation을 가리키지 않는가?
          </li>
        </ol>
        <p>
          API success만으로 data dependency가 맞는 것은 아닙니다. Buffer ownership과 offset·generation을 trace에 남기고 race
          detector나 deterministic reference output으로 correctness를 확인해야 합니다.
        </p>
      </div>
    </section>
  );
}
