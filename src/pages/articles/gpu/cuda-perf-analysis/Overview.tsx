import CodePanel from '@/components/ui/code-panel';

const metricsCode = `// GPU 성능의 3대 지표
//
// 1. Throughput (처리량)
//    - 단위: GFLOPS (Giga Floating-point Operations Per Second)
//    - A100: 19.5 TFLOPS (FP32), 312 TFLOPS (FP16 Tensor)
//    - 실측 GFLOPS = 총 부동소수점 연산 수 / 실행 시간(초)
//
// 2. Bandwidth (대역폭)
//    - 단위: GB/s
//    - A100 HBM2e: 2039 GB/s (이론), 실측 80~90% 달성 가능
//    - 실측 GB/s = (읽기 + 쓰기) 바이트 수 / 실행 시간(초)
//
// 3. Latency (지연)
//    - 글로벌 메모리: ~400 사이클
//    - 공유 메모리: ~20 사이클
//    - 레지스터: 0 사이클 (파이프라인 지연만 존재)`;

const rooflineCode = `// Roofline 모델: 커널이 compute-bound인지 memory-bound인지 판별
//
// Arithmetic Intensity (AI) = FLOPS / Bytes transferred
//
// 판별 기준:
//   AI < (Peak GFLOPS / Peak GB/s) → Memory-bound
//   AI > (Peak GFLOPS / Peak GB/s) → Compute-bound
//
// 예시 (A100 FP32):
//   Ridge point = 19,500 GFLOPS / 2,039 GB/s = 9.56 FLOPS/Byte
//
//   벡터 덧셈: AI = 1 FLOP / 12 Bytes = 0.08  → Memory-bound
//   행렬 곱셈: AI = 2N / 8 Bytes ≈ N/4        → N>38이면 Compute-bound
//   Convolution: AI ≈ 2*K*K / 4 = K^2/2       → 필터 크기에 따라 결정`;

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">병렬 처리 성능 지표</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          GPU 커널의 성능을 평가하려면 세 가지 지표를 측정해야 한다.
          <strong>처리량(Throughput)</strong>, <strong>대역폭(Bandwidth)</strong>, <strong>지연(Latency)</strong>이다.<br />
          이 중 어느 것이 병목인지에 따라 최적화 방향이 완전히 달라진다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">3대 성능 지표</h3>
        <p>
          처리량은 초당 부동소수점 연산 횟수(GFLOPS)로 계산한다.<br />
          대역폭은 초당 메모리 전송량(GB/s)이다.<br />
          지연은 하나의 연산이 완료되기까지 걸리는 사이클 수를 의미한다.<br />
          GPU는 수천 개의 스레드를 동시에 실행하여 지연을 숨긴다(latency hiding).
        </p>
        <CodePanel
          title="GPU 성능 3대 지표"
          code={metricsCode}
          annotations={[
            { lines: [3, 6], color: 'sky', note: 'Throughput: GFLOPS 단위' },
            { lines: [8, 11], color: 'emerald', note: 'Bandwidth: GB/s 단위' },
            { lines: [13, 16], color: 'amber', note: 'Latency: 메모리 계층별 사이클' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-8 mb-3">Roofline 모델</h3>
        <p>
          커널이 <strong>Compute-bound</strong>인지 <strong>Memory-bound</strong>인지 판별하는 도구가 Roofline 모델이다.<br />
          핵심 개념은 <strong>Arithmetic Intensity(AI)</strong>로, 전송된 바이트당 수행한 부동소수점 연산 수를 뜻한다.
        </p>
        <p>
          AI가 Ridge Point(정점)보다 낮으면 메모리 대역폭이 병목이다.<br />
          이 경우 coalescing 최적화, 캐시 활용, 데이터 재사용을 늘려야 한다.<br />
          AI가 Ridge Point보다 높으면 연산 유닛이 병목이므로, 명령어 수준 최적화나 Tensor Core 활용이 필요하다.
        </p>
        <CodePanel
          title="Roofline 모델 & Arithmetic Intensity"
          code={rooflineCode}
          annotations={[
            { lines: [3, 3], color: 'sky', note: 'AI = FLOPS / Bytes' },
            { lines: [5, 7], color: 'emerald', note: '판별 기준' },
            { lines: [9, 14], color: 'amber', note: 'A100 실제 예시' },
          ]}
        />
      </div>
    </section>
  );
}
