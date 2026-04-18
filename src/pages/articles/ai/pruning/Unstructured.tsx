import UnstructuredViz from './viz/UnstructuredViz';

export default function Unstructured() {
  return (
    <section id="unstructured" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Magnitude Pruning & Lottery Ticket</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Magnitude Pruning</strong> — 가장 오래되고 직관적인 프루닝 방법<br />
          가중치의 절대값 |w|가 임계값(threshold)보다 작으면 0으로 설정<br />
          직관: 작은 가중치 = 출력에 미치는 영향도 작다
        </p>
        <p>
          구현은 단순 — <code>mask = (|W| {'>'} threshold)</code>, <code>W = W * mask</code><br />
          threshold 설정 방법: 전체 가중치의 하위 k% 지점 (예: k=50이면 절반 제거)
        </p>
      </div>
      <div className="not-prose my-8">
        <UnstructuredViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">희소 행렬과 저장 포맷</h3>
        <p>
          프루닝 후 행렬은 대부분 0 — 전체를 저장하면 공간 낭비<br />
          <strong>CSR</strong>(Compressed Sparse Row): 0이 아닌 값 + 열 인덱스 + 행 포인터만 저장<br />
          90% 희소 행렬 → CSR로 약 5배 메모리 절감<br />
          문제: 불규칙 메모리 접근 패턴 → GPU 캐시 효율 저하
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Lottery Ticket Hypothesis</h3>
        <p>
          Frankle & Carlin (ICLR 2019, Best Paper): Dense 네트워크 학습 → 프루닝 → 남은 가중치를 초기값으로 리셋 → 재학습<br />
          놀라운 결과: 이 Sparse 서브네트워크만으로 원래 정확도에 도달<br />
          "어디를 연결하느냐"(topology)가 "초기 가중치 값"보다 중요하다는 의미
        </p>
        <p>
          실용적 한계 — 당첨 티켓을 찾으려면 먼저 Dense 네트워크를 학습해야 함<br />
          이후 연구: 학습 초반(early-bird ticket)이나 학습 없이(pruning at initialization) 찾는 방법 등장
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">하드웨어 가속의 현실</h3>
        <p>
          GPU는 Dense 행렬곱(cuBLAS)에 최적화 — 불규칙 0 패턴은 캐시 미스 유발<br />
          Unstructured 90% 희소 → 이론 10배 FLOP 감소, 실측 1.2~1.5배 속도 향상<br />
          해결: <strong>N:M 희소성</strong> — 매 M개 가중치 중 N개만 유지<br />
          NVIDIA A100의 2:4 (50%) Sparse Tensor Core: 하드웨어 수준 가속, 약 2배 throughput
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Unstructured Pruning의 딜레마</p>
          <p>
            이론적 압축률은 높지만 실제 속도 이득은 미미<br />
            연구 목적으로는 가치 있으나, 배포 목적이라면 Structured 프루닝이 실용적<br />
            예외: N:M 희소성은 Unstructured의 유연성 + 하드웨어 가속을 동시 달성
          </p>
        </div>
      </div>
    </section>
  );
}
