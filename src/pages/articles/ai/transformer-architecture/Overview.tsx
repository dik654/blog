import { RoughNotation } from 'react-rough-notation';

export default function Overview() {
  return (
    <section id="overview">
      <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">개요</h2>
      <p className="text-muted-foreground leading-7">
        Transformer는 2017년{' '}
        <RoughNotation type="highlight" show color="#fef08a" animationDelay={300}>
          "Attention Is All You Need"
        </RoughNotation>{' '}
        논문에서 제안된 아키텍처로,
        기존 RNN/LSTM 기반 시퀀스 모델의 한계를 극복했습니다.
        병렬 처리가 가능하고, 긴 시퀀스에서도 효과적으로 의존성을 포착합니다.
      </p>
    </section>
  );
}
