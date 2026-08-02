import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { Misconception } from '@/components/learning/ArticleLearning';

const representationLevels = [
  { level: '입력', image: 'pixel / token', text: '관측값을 숫자로 바꾼 상태' },
  { level: '낮은 층', image: '경계 · 방향', text: '가까운 값 사이의 단순한 패턴' },
  { level: '중간 층', image: '부분 · 질감', text: '낮은 특징의 반복과 조합' },
  { level: '높은 층', image: '대상 · 문맥', text: '과제에 유용한 복합 표현' },
];

function RepresentationLadder() {
  return (
    <figure className="not-prose my-8">
      <figcaption className="mb-3 text-sm font-semibold">층을 지날수록 표현의 수용 범위와 조합이 커진다</figcaption>
      <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-4">
        {representationLevels.map((item, index) => (
          <div key={item.level} className="min-w-0 bg-background p-4">
            <p className="font-mono text-[11px] font-semibold text-muted-foreground">LEVEL {index}</p>
            <p className="mt-3 text-sm font-bold">{item.level}</p>
            <p className="mt-2 text-base font-semibold text-foreground">{item.image}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.text}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        이 도식은 직관이다. 실제 뉴런 하나가 반드시 “경계”나 “눈” 같은 사람이 이름 붙일 수 있는 특징 하나만 담당하는 것은 아니다.
      </p>
    </figure>
  );
}

export default function Representation() {
  return (
    <section id="representation" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">왜 신경망은 층을 깊게 쌓을까?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          한 층은 입력의 여러 값을 섞어 새로운 좌표를 만든다. 다음 층은 그 좌표를 다시 조합한다. 이 반복 덕분에 모델은
          원시 입력에서 과제에 필요한 표현까지 여러 단계의 변환을 학습할 수 있다. 중요한 것은 층의 개수 자체보다
          <strong> 변환 사이에 비선형성이 존재하고, 전체 변환이 데이터의 구조와 맞는가</strong>이다.
        </p>
        <p>
          선형 변환만 세 번 이어 붙이면 결국 하나의 선형 변환으로 합쳐진다. 층을 많이 쌓아도 결정 경계의 종류는 늘지 않는다.
          활성화 함수가 각 층 사이의 단순한 합성을 끊어 주기 때문에 굽은 경계와 복잡한 함수가 가능해진다.
        </p>
      </div>

      <div className="not-prose my-5 grid gap-2 sm:grid-cols-2">
        <div className="min-w-0 rounded-md border border-border bg-muted/15 px-2 py-3">
          <Math display className="my-0 text-sm sm:text-base">{String.raw`W_3(W_2(W_1x)) = (W_3W_2W_1)x`}</Math>
        </div>
        <div className="min-w-0 rounded-md border border-border bg-muted/15 px-2 py-3">
          <Math display className="my-0 text-sm sm:text-base">{String.raw`h_{\ell}=\sigma(W_{\ell}h_{\ell-1}+b_{\ell})`}</Math>
        </div>
      </div>
      <FormulaNote
        meaning="왼쪽처럼 선형 변환만 합성하면 하나의 행렬곱으로 축약된다. 오른쪽의 σ가 층 사이에 비선형성을 넣어 이전 층의 특징을 더 다양한 방식으로 재조합하게 한다."
        symbols={[
          ['Wℓ, bℓ', 'ℓ번째 층의 가중치 행렬과 편향'],
          ['hℓ-1', '이전 층이 만든 표현'],
          ['σ', 'ReLU, sigmoid 같은 비선형 활성화 함수'],
          ['hℓ', '현재 층이 다음 층에 전달할 새로운 표현'],
        ]}
      />

      <RepresentationLadder />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>깊으면 항상 더 효율적일까?</h3>
        <p>
          아니다. 특정한 합성 구조를 가진 함수에서는 깊은 네트워크가 얕은 네트워크보다 훨씬 적은 단위로 같은 함수를
          표현할 수 있다는 이론 결과가 있다. 그러나 모든 데이터와 과제에서 깊이가 자동으로 이득이라는 뜻은 아니다.
          너무 깊으면 최적화가 어려워지고 메모리와 계산 비용도 증가한다. CNN의 지역성, Transformer의 attention처럼
          문제에 맞는 구조적 가정도 깊이만큼 중요하다.
        </p>
      </div>

      <Misconception>
        만능 근사 정리는 “얕은 신경망 하나면 실제 학습도 쉽다”는 정리가 아니다. 충분한 폭과 적절한 조건에서 함수를 근사할 수 있다는 존재 정리이며, 필요한 데이터·파라미터 수·최적화 난이도까지 보장하지 않는다.
      </Misconception>
    </section>
  );
}
