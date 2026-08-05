import AmdahlViz from './viz/AmdahlViz';
import GustafsonViz from './viz/GustafsonViz';
import SerialBottleneckViz from './viz/SerialBottleneckViz';

export default function Amdahl() {
  return (
    <section id="amdahl" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">암달의 법칙 & 구스타프슨 법칙</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          병렬 프로그램의 이론적 속도 향상 한계를 결정하는 법칙이 두 가지 있다.
          <strong>암달의 법칙</strong>은 문제 크기가 고정일 때, <strong>구스타프슨의 법칙</strong>은 문제를 확장할 때 적용된다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">암달의 법칙</h3>
        <p>
          프로그램의 95%를 병렬화해도 최대 속도 향상은 20x에 불과하다.<br />
          코어 수를 1,000개로 늘려도 19.6x, 무한대로 늘려도 20x이다.<br />
          직렬 비율 (1-P)이 전체 성능의 상한을 결정한다.
        </p>
        <div className="not-prose mb-4"><AmdahlViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">구스타프슨의 법칙</h3>
        <p>
          현실에서는 프로세서가 늘면 더 큰 문제를 푼다.<br />
          데이터셋을 2배로 키우고, GPU 코어도 2배로 늘리면 실행 시간은 거의 동일하다.<br />
          이 관점에서는 코어 수에 비례하는 확장이 가능하다.
        </p>
        <div className="not-prose mb-4"><GustafsonViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">직렬 구간 최소화</h3>
        <p>CUDA에서 직렬 구간은 커널 런치 오버헤드, CPU-GPU 전송, 전역 동기화 등에서 발생한다. 이를 줄이는 것이 실질적 성능 향상의 핵심이다.</p>
        <div className="not-prose mb-4"><SerialBottleneckViz /></div>
      </div>
    </section>
  );
}
