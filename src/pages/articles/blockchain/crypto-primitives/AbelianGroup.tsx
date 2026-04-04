import AlgebraStructureViz from './viz/AlgebraStructureViz';

export default function AbelianGroup() {
  return (
    <section id="abelian-group" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Abelian Group, Ring, Field</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          대수 구조의 포함 관계: 군(Group) → 아벨군(교환 법칙 추가) → 환(Ring, 두 연산) → 체(Field, 곱셈 역원).
          ZK에서 사용하는 유한체 Fp는 소수 p에 대한 Z/pZ이다.
        </p>
      </div>

      <div className="not-prose mb-8">
        <AlgebraStructureViz />
      </div>
    </section>
  );
}
