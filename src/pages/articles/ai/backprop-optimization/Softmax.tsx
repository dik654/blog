import M from '@/components/ui/math';
import SoftmaxScene from './viz/SoftmaxScene';
import SoftmaxExamplesScene from './viz/SoftmaxExamplesScene';
import TemperatureScene from './viz/TemperatureScene';
import SoftmaxAdvancedScene from './viz/SoftmaxAdvancedScene';

export default function Softmax() {
  return (
    <section id="softmax" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">소프트맥스: 숫자를 확률로</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        신경망 마지막 선형층이 내놓는 <M>{'h_i'}</M> 는 부호·크기 모두 자유로운 실수다.<br />
        분류 문제에서 "각 클래스에 속할 확률" 로 해석하려면 두 조건이 필요하다 — 모두 <M>{'\\geq 0'}</M>, 그리고 전체 합 = 1.<br />
        Softmax <M>{'y_i = e^{h_i} / \\sum_j e^{h_j}'}</M> 는 이 두 조건을 동시에 만족시키는 가장 자연스러운 변환.
      </p>
      <SoftmaxScene />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Softmax 수학적 정의 & 예시</h3>
        <p>
          Softmax 는 실수 벡터 <M>{'x = (x_1, \\ldots, x_K) \\in \\mathbb{R}^K'}</M> 를 받아
          같은 차원의 확률 벡터 <M>{'p \\in \\Delta^{K-1}'}</M> 로 보낸다:
        </p>
        <M display>{'p_i = \\frac{\\overbrace{e^{x_i}}^{\\text{i 번째 logit 양수화}}}{\\underbrace{\\sum_{j=1}^{K} e^{x_j}}_{Z, \\text{ 정규화 상수 (partition function)}}}'}</M>
        <p>
          여기서 <M>{'x_i \\in \\mathbb{R}'}</M> 는 i 번째 클래스의 logit (raw score, 선형층 출력);
          <M>{'K'}</M> 는 클래스 수 (GPS 예제에서는 K=3: Madrid/Paris/Berlin);
          <M>{'p_i \\in (0, 1)'}</M> 는 모델이 i 번째 클래스에 할당한 확률, <M>{'\\sum_i p_i = 1'}</M> 이 자동으로 성립.
          분모 <M>{'Z = \\sum_j e^{x_j}'}</M> 는 정규화 상수 (partition function) 로,
          통계역학 Boltzmann 분포의 그것과 정확히 같은 역할을 한다.
        </p>
        <p>
          <strong>왜 exp 인가?</strong> 두 가지가 동시에 해결된다 — <M>{'e^{x_i} > 0'}</M> 이므로 음수 logit 도 양수로 치환되고,
          지수 함수의 급격한 증가 덕분에 logit 차이가 조금만 벌어져도 확률이 가파르게 갈린다.
          예컨대 <M>{'x = (1, 2, 3)'}</M> 이면 <M>{'p \\approx (0.09, 0.24, 0.67)'}</M> — 차이 2 만으로 7배 이상 벌어진다.
        </p>
        <p>아래 Scene은 같은 logit 벡터에 대해 softmax 가 어떻게 확률을 배분하는지 눈으로 확인하는 용도.</p>
      </div>
      <SoftmaxExamplesScene />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Softmax 의 주요 성질:
        </p>
        <ul>
          <li><strong>Monotonic</strong>: <M>{'x_i > x_j \\Rightarrow p_i > p_j'}</M>. 순서를 보존한다.</li>
          <li><strong>Translation invariant</strong>: <M>{'\\mathrm{softmax}(x + c \\cdot \\mathbf{1}) = \\mathrm{softmax}(x)'}</M>. 모든 logit 에 같은 상수를 더해도 결과 불변 — 수치 안정화의 이론적 근거.</li>
          <li><strong>Scale 변화에 민감</strong>: <M>{'\\mathrm{softmax}(\\alpha x)'}</M> 는 <M>{'\\alpha'}</M> 에 따라 극적으로 달라진다. 이게 바로 temperature 의 세계.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">Temperature Scaling — 분포 조절</h3>
        <p>Temperature <M>{'T > 0'}</M> 로 logit 을 나눠 softmax 에 넣으면:</p>
        <M display>{'p_i(T) = \\frac{e^{\\overbrace{x_i / T}^{\\text{logit / 온도}}}}{\\underbrace{\\sum_j e^{x_j / T}}_{\\text{온도 적용된 정규화}}}'}</M>
        <p>
          여기서 <M>{'T'}</M> 는 스칼라 조절 파라미터;
          <M>{'T = 1'}</M> 은 기본 softmax;
          <M>{'T \\to 0^+'}</M> 이면 logit 차이가 무한히 증폭되어 가장 큰 logit 에 확률 1 이 몰린다 (argmax 수렴);
          <M>{'T \\to \\infty'}</M> 이면 모든 logit 차이가 0 에 수렴해 <M>{'p_i \\to 1/K'}</M> (균등 분포).
        </p>
        <p>
          T &lt; 1 이면 sharp (확신 강화) — exploitation 편향이 필요한 greedy 디코딩에 유리.<br />
          T &gt; 1 이면 flat (다양성 확보) — LLM 에서 창의적 샘플링, 강화학습에서 exploration 시 사용.
        </p>
        <p>아래 Scene은 T 슬라이더를 움직여 분포가 얼마나 날카로워지거나 퍼지는지 확인한다.</p>
      </div>
      <TemperatureScene />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">수치 안정 · LogSoftmax · 변형</h3>
        <p>
          <M>{'e^{x_i}'}</M> 는 logit 이 크면 쉽게 float overflow 를 일으킨다. 예컨대 <M>{'x_i = 1000'}</M> 이면 <M>{'e^{1000} \\approx 10^{434}'}</M> — double 의 한계 <M>{'\\sim 10^{308}'}</M> 을 넘는다.
        </p>
        <p>해법은 translation invariance 를 이용해 최댓값을 빼는 것:</p>
        <M display>{'p_i = \\frac{e^{\\overbrace{x_i - m}^{\\le 0 \\text{ 보장}}}}{\\underbrace{\\sum_j e^{x_j - m}}_{\\text{모든 항} \\le 1, \\text{ overflow 차단}}}, \\quad m = \\max_j x_j'}</M>
        <p>
          여기서 <M>{'m'}</M> 은 벡터 <M>{'x'}</M> 의 최댓값이므로 <M>{'x_i - m \\leq 0'}</M>, 따라서 <M>{'e^{x_i - m} \\in (0, 1]'}</M> — overflow 원천 차단.
          수학적으로는 동일한 확률을 반환하지만 floating point 상에서는 훨씬 안전하다.
        </p>
        <p>
          교차 엔트로피와 결합할 때는 <code>log_softmax</code> 를 직접 계산하는 게 더 안정적이다:
        </p>
        <M display>{'\\log p_i = \\underbrace{x_i - m}_{\\text{shifted logit}} - \\underbrace{\\log \\sum_j e^{x_j - m}}_{\\text{logsumexp (안정 계산)}}'}</M>
        <p>
          이 형태를 logsumexp trick 이라 부른다. 우변의 <M>{'\\log \\sum_j e^{x_j - m}'}</M> 는 안전하게 계산 가능하고,
          뒤에 CE 에서 <M>{'-\\log p_{\\text{true}}'}</M> 를 계산할 때 <M>{'\\log'}</M> 와 <M>{'\\exp'}</M> 가 상쇄되어 정밀도 손실이 없다.
          PyTorch 의 <code>nn.CrossEntropyLoss</code> 가 내부적으로 쓰는 것이 바로 이 조합.
        </p>
        <p>아래 Scene은 naive softmax 와 안정화된 버전의 수치 거동을 비교한다.</p>
      </div>
      <SoftmaxAdvancedScene />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Softmax의 기원과 의미</p>
          <p>
            <strong>Boltzmann Distribution</strong>: 통계역학에서 온도 <M>T</M> 의 계가 에너지 <M>E</M> 인 상태를 취할 확률은
            <M display>{'p(\\text{state}) \\propto e^{-\\overbrace{E}^{\\text{상태 에너지}} / (\\underbrace{k_B}_{\\text{볼츠만 상수}} \\cdot \\underbrace{T}_{\\text{온도}})}'}</M>
            여기서 <M>{'k_B'}</M> 는 볼츠만 상수, <M>E</M> 는 상태 에너지, <M>T</M> 는 온도.
            Softmax 는 <M>{'-x_i'}</M> 를 에너지로, <M>T</M> 를 temperature 로 보는 Boltzmann 분포와 구조가 동일 —
            딥러닝 temperature 파라미터가 물리의 온도와 같은 정성적 역할을 하는 이유.
          </p>
          <p className="mt-2">
            <strong>왜 exp 인가 — maximum entropy 원리</strong>:<br />
            기댓값 제약 <M>{'\\mathbb{E}[x] = \\mu'}</M> 하에서 엔트로피를 최대화하는 분포는 유일하게 exponential family.
            "정보를 가장 덜 가정하는" 확률 분포가 자연스럽게 <M>{'e^{x_i}'}</M> 형태를 요구한다.
          </p>
          <p className="mt-2">
            <strong>CE 와의 공명</strong>: softmax 뒤에 cross-entropy 를 붙이면 gradient 가 깔끔히
            <M>{'\\partial L / \\partial x_i = p_i - y_i'}</M> 로 떨어진다.
            이 단순성은 우연이 아니라 exp 와 log 의 상쇄에서 나오는 구조적 결과 — 이어지는 CE 섹션에서 유도.
          </p>
          <p className="mt-2">
            <strong>대안은 왜 밀렸나</strong>:<br />
            - <M>{'\\sigma(x_i) / n'}</M> (sigmoid 평균): 합 = 1 보장 안 됨<br />
            - <M>{'x_i^2 / \\sum x_j^2'}</M>: 음수/양수 구분 불가<br />
            - argmax: 미분 불가 — gradient descent 불가<br />
            Softmax 는 "확률" · "미분 가능" · "gradient 단순" 세 조건을 동시에 만족하는 거의 유일한 선택.
          </p>
        </div>

      </div>
    </section>
  );
}
