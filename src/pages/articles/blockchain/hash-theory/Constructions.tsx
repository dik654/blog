import MerkleDamgardViz from './viz/MerkleDamgardViz';
import CompressionFnViz from './viz/CompressionFnViz';
import SpongeViz from './viz/SpongeViz';
import AbsorbViz from './viz/AbsorbViz';
import PermutationViz from './viz/PermutationViz';
import SqueezeViz from './viz/SqueezeViz';

export default function Constructions() {
  return (
    <section id="constructions" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Merkle-Damgard & Sponge</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          내부 압축 함수를 반복 적용하여 임의 길이 &rarr; 고정 길이.
          반복 방식이 두 갈래.
        </p>
      </div>

      <h3 className="text-xl font-semibold mb-3">Merkle-Damgard 구성</h3>
      <div className="not-prose mb-6"><MerkleDamgardViz /></div>
      <h4 className="text-lg font-semibold mt-6 mb-3">압축함수 f 내부</h4>
      <div className="not-prose mb-8"><CompressionFnViz /></div>

      <h3 className="text-xl font-semibold mb-3">Sponge 구성 (Keccak/SHA-3)</h3>
      <div className="not-prose mb-6"><SpongeViz /></div>
      <h4 className="text-lg font-semibold mt-6 mb-3">흡수 (Absorb)</h4>
      <div className="not-prose mb-8"><AbsorbViz /></div>
      <h4 className="text-lg font-semibold mt-6 mb-3">순열 (Keccak-f)</h4>
      <div className="not-prose mb-8"><PermutationViz /></div>
      <h4 className="text-lg font-semibold mt-6 mb-3">압출 (Squeeze)</h4>
      <div className="not-prose"><SqueezeViz /></div>
    </section>
  );
}
