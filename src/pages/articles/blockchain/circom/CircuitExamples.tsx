import CircuitExampleViz from './viz/CircuitExampleViz';
import CodePanel from '@/components/ui/code-panel';

const HASH_CODE = `template Poseidon(nInputs) {
    signal input inputs[nInputs];
    signal output out;

    // 라운드 상수 & S-box
    component ark[nRounds];
    component sbox[nRounds];
    component mix[nRounds];

    // Full rounds → Partial rounds → Full rounds
    for (var r = 0; r < nRounds; r++) {
        ark[r] = AddRoundKey(nInputs);
        sbox[r] = (r < RF/2 || r >= RF/2+RP)
            ? SBoxFull(nInputs)    // Full round
            : SBoxPartial();       // Partial round
        mix[r] = MixLayer(nInputs);
    }
    out <== mix[nRounds-1].out[0];
}`;

const MERKLE_CODE = `template MerkleProof(levels) {
    signal input leaf;
    signal input pathElements[levels];
    signal input pathIndices[levels];
    signal output root;

    component hashers[levels];
    for (var i = 0; i < levels; i++) {
        hashers[i] = Poseidon(2);
        // pathIndices[i]가 0이면 왼쪽, 1이면 오른쪽
        hashers[i].inputs[0] <== leaf_or_prev * (1 - pathIndices[i])
            + pathElements[i] * pathIndices[i];
        hashers[i].inputs[1] <== leaf_or_prev * pathIndices[i]
            + pathElements[i] * (1 - pathIndices[i]);
    }
    root <== hashers[levels-1].out;
}`;

export default function CircuitExamples({ title }: { title?: string }) {
  return (
    <section id="examples" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '실전 회로 예제'}</h2>
      <div className="not-prose mb-8">
        <CircuitExampleViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          실전 ZK 애플리케이션에서 자주 사용되는 Circom 회로 패턴입니다.<br />
          Tornado Cash, Semaphore 등 프로덕션 프로젝트에서 검증된 구조입니다.
        </p>
        <CodePanel
          title="Poseidon 해시 회로"
          code={HASH_CODE}
          annotations={[
            { lines: [2, 3], color: 'sky', note: '입력 배열 & 단일 출력' },
            { lines: [14, 18], color: 'emerald', note: 'Full/Partial 라운드 분기' },
          ]}
        />
        <CodePanel
          title="Merkle Proof 검증 회로"
          code={MERKLE_CODE}
          annotations={[
            { lines: [2, 4], color: 'sky', note: 'leaf + 경로 요소/인덱스' },
            { lines: [10, 14], color: 'emerald', note: '경로 인덱스로 좌우 선택' },
          ]}
        />
      </div>
    </section>
  );
}
