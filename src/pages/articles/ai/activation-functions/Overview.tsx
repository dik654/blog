import M from '@/components/ui/math';
import LinearVsNonlinearViz from './viz/LinearVsNonlinearViz';
import ActivationRequirementsViz from './viz/ActivationRequirementsViz';
import ActivationTimelineViz from './viz/ActivationTimelineViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">활성화 함수가 왜 필요한가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          신경망의 각 뉴런은 입력에 가중치를 곱하고 편향을 더하는 <strong>선형 변환</strong> 하나를 수행한다 —
          <M>{'h = w \\cdot x + b'}</M>. 선형 함수를 아무리 쌓아도 결과는 여전히 선형이라는 게 문제의 출발이다:
        </p>
        <M display>{'f(g(x)) = w_2 \\bigl(\\underbrace{w_1 x + b_1}_{\\text{1층 출력}}\\bigr) + b_2 = \\underbrace{(w_2 w_1)}_{\\text{새 가중치}} x + \\underbrace{(w_2 b_1 + b_2)}_{\\text{새 편향}}'}</M>
        <p>
          여기서 <M>{'x \\in \\mathbb{R}'}</M> 는 입력 (스칼라 또는 벡터),
          <M>{'w_1, w_2'}</M> 는 두 층의 가중치, <M>{'b_1, b_2'}</M> 는 편향.
          두 층의 합성은 새 가중치 <M>{'w_2 w_1'}</M> 와 새 편향 <M>{'w_2 b_1 + b_2'}</M> 인 단일 선형 변환으로 무너진다 —
          XOR · 이미지 경계 · 언어 문맥 같은 비선형 패턴은 학습 불가.
        </p>
        <p>
          <strong>활성화 함수</strong>(Activation Function) <M>{'\\sigma(\\cdot)'}</M> 가 선형 변환 뒤에 끼어들어 합성을 깨뜨린다:
        </p>
        <M display>{'h = \\underbrace{\\sigma}_{\\text{비선형}}\\bigl(\\underbrace{w \\cdot x + b}_{\\text{선형 변환}}\\bigr)'}</M>
        <p>
          <M>{'\\sigma : \\mathbb{R} \\to \\mathbb{R}'}</M> 는 비선형 변환 (sigmoid · tanh · ReLU 등 어느 것이든).
          이 한 함수 덕분에 신경망이 <strong>임의의 연속 함수</strong>를 근사할 수 있다 —
          Universal Approximation Theorem (Cybenko 1989, Hornik 1991): 충분히 많은 뉴런을 가진 한 층 MLP 가
          임의의 연속 함수를 임의의 정확도로 근사한다.
        </p>
      </div>
      <div className="not-prose my-8">
        <LinearVsNonlinearViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">활성화 함수 필수 요건</h3>
        <p>
          비선형성(필수) + 미분 가능(필수) + 단조성·기울기·계산효율·상한·Zero-centered(선호) 7가지 조건<br />
          Universal Approximation Theorem: 이 조건 충족 시 임의의 연속 함수 근사 가능
        </p>
      </div>
      <ActivationRequirementsViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">활성화 함수 진화 타임라인</h3>
        <p>
          Step(1943) → Sigmoid(1958) → Tanh(1986) → ReLU(2010, 혁명) → GELU(2016) → SwiGLU(2020)<br />
          80년 진화 — 각 함수가 이전의 단점을 해결
        </p>
      </div>
      <ActivationTimelineViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: <strong>비선형성</strong>이 신경망의 표현력 원천 — Universal Approximation.<br />
          요약 2: <strong>ReLU의 단순함</strong>이 딥러닝 혁명의 촉매 — 기울기 소실 해결.<br />
          요약 3: 아키텍처별로 <strong>최적 활성화가 다름</strong> — 실험적 선택 필수.
        </p>
      </div>
    </section>
  );
}
