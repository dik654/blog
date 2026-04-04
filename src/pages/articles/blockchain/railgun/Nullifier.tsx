import type { CodeRef } from '@/components/code/types';
import NullifierViz from './viz/NullifierViz';

export default function Nullifier({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="nullifier" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Nullifier — 이중 사용 방지</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Note를 소비할 때 <strong>nullifier</strong>를 공개한다.
          <br />
          <code>nullifier = poseidon(spendingKey, leafIndex)</code>. 같은 Note는 항상 같은 nullifier를 생성한다.
        </p>
        <p className="leading-7">
          컨트랙트는 <code>nullifiers</code> 매핑으로 사용 여부를 기록한다.
          <br />
          이미 true인 nullifier가 다시 오면 <code>require</code>에서 리버트한다.
          이중 사용(double spending)을 방지한다.
        </p>
        <p className="leading-7">
          핵심: nullifier에서 원래 Note를 역추적할 수 없다.
          <br />
          Poseidon의 단방향성 때문이다. 어떤 commitment가 소비됐는지 외부에서 알 수 없다.
        </p>
      </div>
      <div className="not-prose"><NullifierViz /></div>
    </section>
  );
}
