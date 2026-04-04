import SigmaProtocolViz from './viz/SigmaProtocolViz';
import SpecialSoundnessViz from './viz/SpecialSoundnessViz';

export default function InteractiveProof() {
  return (
    <section id="sigma-protocol" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Sigma 프로토콜</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Commit &rarr; Challenge &rarr; Response 3단계 대화형 증명의 표준 형태.
          <br />
          현대 ZKP(Groth16, PLONK, Bulletproofs)는 모두 이 3-move 구조가 뼈대.
        </p>
      </div>
      <div className="not-prose mb-8"><SigmaProtocolViz /></div>
      <h3 className="text-lg font-bold mb-4">특수 건전성 (Special Soundness)</h3>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          같은 커밋에 두 챌린지 모두 응답 가능하면 비밀 x 복원 가능 &rarr; x 모르면 불가.
        </p>
      </div>
      <div className="not-prose"><SpecialSoundnessViz /></div>
    </section>
  );
}
