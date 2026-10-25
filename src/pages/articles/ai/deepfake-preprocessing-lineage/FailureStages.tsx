import FailureTraceViz from "./viz/FailureTraceViz";

export default function FailureStages() {
  return (
    <section id="detection-track" data-teach-level="3" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">얼굴 위치와 같은 인물인지를 따로 판정합니다</h2>
      <FailureTraceViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Face detector는 한 frame에 얼굴처럼 보이는 box가 있는지 답합니다. Identity tracker는
          그 box가 앞뒤 frame의 <code>person-C</code>와 같은 인물인지 답합니다. 00:05에는 얼굴
          box가 있으므로 첫 질문은 성공이지만, track이 다른 인물로 바뀌었으므로 두 번째
          질문은 실패입니다.
        </p>
        <p>
          뒤 단계를 실행하지 않은 상태도 실패와 구분합니다. 00:02는 <code>NO_FACE</code>이므로
          track과 crop은 <code>not-run</code>입니다. 이렇게 해야 crop 실패가 많았던 것인지,
          애초에 얼굴 위치를 찾지 못한 것인지 원인을 잘못 집계하지 않습니다. 실패 상태를
          삭제하지 않는 것이 다음 절의 분모를 지키는 조건입니다.
        </p>
      </div>
    </section>
  );
}
