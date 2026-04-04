import SBoxMDSViz from './viz/SBoxMDSViz';

export default function SBoxMDS() {
  return (
    <section id="sbox-mds" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">S-box & MDS 행렬</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          S-box: x &rarr; x^5 (BN254) 또는 x^7 (BabyBear). MDS: 최대 확산(branch number = T+1).
        </p>
      </div>
      <div className="not-prose"><SBoxMDSViz /></div>
    </section>
  );
}
