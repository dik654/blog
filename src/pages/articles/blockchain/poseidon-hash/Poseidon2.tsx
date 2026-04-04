import Poseidon2Viz from './viz/Poseidon2Viz';

export default function Poseidon2() {
  return (
    <section id="poseidon2" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Poseidon2 최적화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Internal round에서 dense MDS &rarr; 대각 행렬로 교체 &mdash; 곱셈 O(T2) &rarr; O(T). ~30% 향상.
        </p>
      </div>
      <div className="not-prose"><Poseidon2Viz /></div>
    </section>
  );
}
