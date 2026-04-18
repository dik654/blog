import M from '@/components/ui/math';
import NegSamplingViz from './viz/NegSamplingViz';
import TrainingPipelineViz from './viz/TrainingPipelineViz';
import TrainingDetailViz from './viz/TrainingDetailViz';

export default function Training({ title }: { title?: string }) {
  return (
    <section id="training" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '학습 알고리즘'}</h2>
      <TrainingPipelineViz />
      <div className="not-prose mb-8"><NegSamplingViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Softmax 분모 — 어휘 V 전체를 순회해야 하므로 O(V)<br />
          V = 100만이면 매 역전파마다 100만 번 연산 — 실용적으로 불가능<br />
          Word2Vec은 두 가지 근사법으로 해결
        </p>

        <h3>① Negative Sampling (NEG)</h3>
        <p>
          "이 단어 쌍이 실제로 맥락에서 함께 등장하는가?" — 이진 분류 문제로 변환<br />
          실제 맥락 단어 1개(positive)에 대해 k개의 노이즈 단어(negative)를 랜덤 샘플링<br />
          진짜 쌍과 가짜 쌍을 구별하도록 학습
        </p>
        <M display>{'J_{\\text{NEG}} = \\underbrace{\\log \\sigma({v\'_{w_O}}^{\\!\\top} \\cdot v_{w_I})}_{\\text{positive pair (실제 맥락)}} + \\sum_{i=1}^{k} \\underbrace{\\log \\sigma(-{v\'_{w_i}}^{\\!\\top} \\cdot v_{w_I})}_{\\text{negative pair (노이즈 } k \\text{개)}}'}</M>
        <p>
          노이즈 분포: <M>{'P(w) \\propto f(w)^{3/4}'}</M> — 빈도의 3/4 거듭제곱으로 저빈도 단어도 적당히 샘플링<br />
          업데이트 대상은 <M>{'v_{w_I}'}</M>(입력)과 <M>{'v\'_{w_O}, v\'_{w_i}'}</M>(출력) — 어휘 전체가 아닌 k+1개 벡터만 갱신<br />
          k는 보통 5~20 — 작은 데이터에서는 크게, 대용량 코퍼스에서는 작게 설정
        </p>

        <h3>② Hierarchical Softmax (HS)</h3>
        <p>
          어휘를 <strong>Huffman 트리</strong>(빈도 기반 이진 트리)로 구성<br />
          고빈도 단어는 루트 가까이, 저빈도 단어는 깊은 레벨에 배치<br />
          예측 시 루트에서 해당 잎까지 이진 경로를 따라가며 시그모이드 계산
        </p>
        <M display>{'P(w \\mid w_I) = \\prod_{j=1}^{L-1} \\underbrace{\\sigma\\!\\bigl([d_j\\!=\\!1]\\; {v\'_{n_j}}^{\\!\\top} \\cdot v_{w_I}\\bigr)}_{\\text{내부 노드 } n_j \\text{에서의 이진 결정}}'}</M>
        <p>
          Huffman 트리 깊이 <M>{'\\approx \\log_2 V'}</M> — O(V)가 O(log V)로 감소<br />
          고빈도 단어는 경로가 짧아 학습 기회가 많고, 희귀 단어는 깊지만 전체 어휘보다 훨씬 빠름
        </p>

        <h3>서브샘플링 (Subsampling)</h3>
        <p>
          "은, 는, 이, 가" 같은 고빈도 단어 — 의미적 기여가 낮음<br />
          빈도에 반비례하는 확률로 훈련에서 건너뜀:
        </p>
        <M display>{'P(\\text{discard}) = 1 - \\sqrt{\\underbrace{t}_{\\text{threshold} \\approx 10^{-5}} \\;/\\; \\underbrace{f(w)}_{\\text{단어 } w \\text{의 빈도 비율}}}'}</M>
        <p>
          "the", "은/는" 같은 고빈도 단어는 <M>{'f(w) \\gg t'}</M>이므로 자주 건너뜀<br />
          희귀 단어는 <M>{'f(w) \\approx t'}</M>이므로 거의 건너뛰지 않음 — 학습 속도 향상 + 희귀어 품질 개선
        </p>

        <h3>Dynamic Context Window</h3>
        <p>
          고정 윈도우 대신 1 ~ max_window 사이에서 무작위로 크기 선택<br />
          중심 단어에서 멀수록 샘플링 빈도가 낮아짐 — 가까운 단어가 더 강하게 학습
        </p>

        <h3>구현 최적화 (C 코어)</h3>
        <div className="not-prose grid gap-3 sm:grid-cols-3 my-4">
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 p-4">
            <p className="font-semibold text-sm mb-1">시그모이드 LUT</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              exp() 호출 대신 사전 계산 테이블(1000개)을 조회 — 루프마다 초월함수 연산 제거
            </p>
          </div>
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 p-4">
            <p className="font-semibold text-sm mb-1">SIMD 메모리 정렬</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              128-byte 정렬(posix_memalign)로 벡터 내적 시 SIMD 명령어 활용 극대화
            </p>
          </div>
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 p-4">
            <p className="font-semibold text-sm mb-1">Hogwild! 병렬 SGD</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              코퍼스를 스레드 수로 분할, 락 없는 비동기 SGD — 충돌은 드물고 수렴에 영향 미미
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3 px-1">NEG 수식 유도 & Hierarchical Softmax 상세</h3>
        <TrainingDetailViz />
        <p className="prose prose-neutral dark:prose-invert max-w-none leading-7 mt-4">
          요약 1: <strong>Negative Sampling</strong>이 O(V)→O(k+1)로 수만 배 가속.<br />
          요약 2: <strong>Hierarchical Softmax</strong>는 이진 트리로 O(log V).<br />
          요약 3: <strong>Subsampling</strong>으로 고빈도 단어 제외 — 품질·속도 동시 개선.
        </p>
      </div>
    </section>
  );
}
