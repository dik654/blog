import SlashingViz from './viz/SlashingViz';

export default function SlashingMechanics({ title }: { title?: string }) {
  return (
    <section id="slashing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '슬래싱 조건 & 패널티'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          슬래싱은 단순 처벌이 아니라 이더리움 PoS의 보안 모델 그 자체입니다.
          어떤 행위가 위반이고, 왜 Correlation Penalty가 대규모 공격을 경제적으로 불가능하게 만드는지 살펴봅니다.
        </p>
      </div>
      <SlashingViz />
    </section>
  );
}
