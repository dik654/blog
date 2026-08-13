import ScaleInverseViz from "./viz/ScaleInverseViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">로그는 큰 수를 줄여 쓰는 기호가 아니라 곱셈의 구조를 덧셈으로 옮기는 함수다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          확률 0.5인 사건이 세 번 연속 일어날 확률은 0.5를 세 번 곱한 0.125입니다. 사건이 길어질수록 이런 곱은 매우 작아지고 계산도 불안정해집니다. 로그를 취하면 같은 계산이 세 개의 로그를 더하는 문제로 바뀌므로, 확률 모델은 긴 sequence의 likelihood를 log-likelihood의 합으로 다룹니다.
        </p>
        <p className="leading-8">
          컴퓨터의 floating-point는 표현할 수 있는 양수의 범위와 간격이 유한하므로, 그보다 작은 양수는 가장 가까운 표현값인 0으로 반올림될 수 있습니다. 예를 들어 <code>0.5^2000=2^-2000</code>은 수학적으로 0보다 크지만 일반적인 64-bit floating-point의 최소 양수보다 작아 직접 계산하면 0이 되는 underflow가 발생하는 반면, log-likelihood는 <code>2000·ln(0.5)=-2000·ln(2)</code>라는 유한한 음수의 합으로 남아 크기와 순서 정보를 더 오래 보존합니다. 이는 여러 양수의 <em>곱</em>을 log의 합으로 바꾸는 방법이며, 여러 log 값이 나타내는 양을 다시 <em>더할</em> 때 쓰는 log-sum-exp와는 다른 문제입니다.
        </p>
        <p className="leading-8">
          이 글은 거듭제곱을 반복 곱셈으로 확인한 뒤, 로그를 그 거듭제곱의 역질문으로 정의합니다. 그다음 밑이 단위와 scale을 어떻게 바꾸는지, 0과 음수에서 무엇이 정의되지 않는지 살펴보고 cross-entropy의 surprisal로 연결합니다.
        </p>
      </div>
      <ScaleInverseViz />
    </section>
  );
}
