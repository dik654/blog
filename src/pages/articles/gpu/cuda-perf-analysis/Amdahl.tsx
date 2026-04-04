import CodePanel from '@/components/ui/code-panel';

const amdahlCode = `// 암달의 법칙 (Amdahl's Law)
// Speedup = 1 / ((1 - P) + P / N)
//
// P = 병렬화 가능 비율,  N = 프로세서 수
//
// 예시 1: P = 0.95, N = 20   → Speedup = 1 / (0.05 + 0.95/20) = 10.3x
// 예시 2: P = 0.95, N = 1000 → Speedup = 1 / (0.05 + 0.00095) = 19.6x
// 예시 3: P = 0.95, N = INF  → Speedup = 1 / 0.05 = 20x (이론 상한)
//
// 핵심: 직렬 비율 5%만으로도 최대 속도 향상이 20x로 제한된다.
//       GPU 코어가 아무리 많아도 직렬 구간이 전체 성능을 지배한다.`;

const gustafsonCode = `// 구스타프슨의 법칙 (Gustafson's Law)
// Scaled Speedup = N - (1 - P) * (N - 1)
//
// 암달의 법칙과 차이: 문제 크기를 고정하지 않는다.
// 프로세서가 늘면 더 큰 문제를 풀 수 있다고 가정한다.
//
// 예시: P = 0.95, N = 1000
//   암달:     Speedup = 19.6x  (직렬 구간이 상한을 결정)
//   구스타프슨: Speedup = 1000 - 0.05 * 999 = 950x
//
// 실무 시사점:
// - 작은 문제를 빠르게? → 암달의 법칙이 지배 (직렬 최적화 필수)
// - 큰 문제를 같은 시간에? → 구스타프슨 법칙 적용 (GPU 코어 증설 유효)
// - GPU 커널: 문제 크기를 키울 수 있으면 코어 수 대비 선형에 가까운 확장 가능`;

const practicalCode = `// CUDA 실무에서의 직렬 구간 원인
//
// 1. 커널 런치 오버헤드     ~5-10 us per launch
// 2. CPU-GPU 데이터 전송     PCIe: ~12 GB/s, NVLink: ~600 GB/s
// 3. 전역 동기화              cudaDeviceSynchronize()
// 4. 리덕션의 마지막 단계     워프 1개로 수렴
// 5. 호스트 측 전처리/후처리  CPU 단일 스레드
//
// 최소화 전략:
// - 커널 퓨전 (여러 커널을 하나로 합침)
// - 비동기 전송 (cudaMemcpyAsync + 스트림)
// - Cooperative Groups로 그리드 수준 동기화
// - 파이프라이닝: 전송과 연산을 중첩 실행`;

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
        <CodePanel
          title="암달의 법칙: Speedup = 1 / ((1-P) + P/N)"
          code={amdahlCode}
          annotations={[
            { lines: [2, 2], color: 'sky', note: '핵심 공식' },
            { lines: [6, 8], color: 'emerald', note: 'N을 늘려도 상한 수렴' },
            { lines: [10, 11], color: 'amber', note: '5% 직렬 = 20x 상한' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-8 mb-3">구스타프슨의 법칙</h3>
        <p>
          현실에서는 프로세서가 늘면 더 큰 문제를 푼다.<br />
          데이터셋을 2배로 키우고, GPU 코어도 2배로 늘리면 실행 시간은 거의 동일하다.<br />
          이 관점에서는 코어 수에 비례하는 확장이 가능하다.
        </p>
        <CodePanel
          title="구스타프슨의 법칙: Scaled Speedup = N - (1-P)*(N-1)"
          code={gustafsonCode}
          annotations={[
            { lines: [2, 2], color: 'sky', note: '핵심 공식' },
            { lines: [7, 9], color: 'emerald', note: '같은 조건에서 950x vs 19.6x' },
            { lines: [11, 14], color: 'violet', note: '실무 판단 기준' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-8 mb-3">직렬 구간 최소화</h3>
        <p>CUDA에서 직렬 구간은 커널 런치 오버헤드, CPU-GPU 전송, 전역 동기화 등에서 발생한다. 이를 줄이는 것이 실질적 성능 향상의 핵심이다.</p>
        <CodePanel
          title="CUDA 직렬 구간 & 최소화 전략"
          code={practicalCode}
          annotations={[
            { lines: [3, 7], color: 'amber', note: '직렬 구간 5대 원인' },
            { lines: [9, 13], color: 'emerald', note: '최소화 전략' },
          ]}
        />
      </div>
    </section>
  );
}
