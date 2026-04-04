import Poseidon2RoundsViz from '../components/Poseidon2RoundsViz';

export default function Hash({ title }: { title?: string }) {
  return (
    <section id="hash" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Poseidon2 & 해시 레이어'}</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Plonky3는 Merkle 트리와 Fiat-Shamir 채린저에 <strong>Poseidon2</strong>를 사용한다.
          BabyBear 위에서 최적화된 퍼뮤테이션으로, ZK-friendly 설계 덕분에
          회로 내부에서도 효율적으로 해시를 증명할 수 있다.
        </p>
      </div>

      <div className="not-prose mb-8">
        <Poseidon2RoundsViz />
      </div>
    </section>
  );
}
