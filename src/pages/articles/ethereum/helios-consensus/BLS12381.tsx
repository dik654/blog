import BLS12381Viz from './viz/BLS12381Viz';

export default function BLS12381({ title }: { title: string }) {
  return (
    <section id="bls12-381" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          BLS12-381은 페어링 기반 곡선이다. G1, G2, GT 세 그룹을 사용한다.
          <br />
          공개키는 G1, 서명은 G2, 검증은 GT에서 비교한다.
        </p>
        <p className="leading-7">
          <strong>💡 Reth vs Helios:</strong> Reth도 CL 검증에 BLS를 사용한다.
          <br />
          차이점은 Reth가 전체 검증자(수십만)를, Helios는 512명만 다룬다는 것.
        </p>
      </div>
      <div className="not-prose"><BLS12381Viz /></div>
    </section>
  );
}
