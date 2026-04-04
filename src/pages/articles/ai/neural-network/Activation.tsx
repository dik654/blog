import ActivationFnViz from './viz/ActivationFnViz';

export default function Activation() {
  return (
    <section id="activation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">활성화 함수</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        활성화 함수 없이 층을 쌓으면 하나의 선형 변환과 동일.<br />
        비선형 함수를 끼워야 층마다 새로운 표현을 학습 가능.
      </p>
      <ActivationFnViz />
    </section>
  );
}
