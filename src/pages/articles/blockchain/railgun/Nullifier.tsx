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

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Nullifier의 암호학적 속성</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-3">3가지 필수 속성</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground/80 mb-1">1. Deterministic (결정론적)</p>
                <ul className="space-y-0.5">
                  <li>같은 note &rarr; 같은 nullifier (항상)</li>
                  <li><code>nullifier = Poseidon(spendingKey, leafIndex)</code></li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-foreground/80 mb-1">2. Pseudorandom (의사 랜덤)</p>
                <ul className="space-y-0.5">
                  <li>nullifier에서 <code>spendingKey</code> 추출 불가</li>
                  <li>nullifier에서 <code>leafIndex</code> 추출 불가</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-foreground/80 mb-1">3. Unique per note</p>
                <ul className="space-y-0.5">
                  <li>서로 다른 note &rarr; 서로 다른 nullifier</li>
                  <li>collision 확률 ~2<sup>-248</sup> (무시 가능)</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-red-500/30 p-4">
            <p className="font-semibold text-sm text-red-400 mb-3">공격 시도 vs 방어</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground/80 mb-1">Brute force</p>
                <p>nullifier로부터 <code>spendingKey</code> 역산 &rarr; 2<sup>256</sup> search space, 불가능</p>
              </div>
              <div>
                <p className="font-medium text-foreground/80 mb-1">Replay attack</p>
                <p>이전 tx의 nullifier 재사용 &rarr; <code>nullifiers</code> map에서 이미 <code>true</code>면 revert</p>
              </div>
              <div>
                <p className="font-medium text-foreground/80 mb-1">Front-running</p>
                <p>mempool에서 proof 탈취 &rarr; proof binding으로 다른 addr submit 시 verify 실패</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Storage 최적화</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-muted-foreground mb-2">기본 구조: <code>mapping(bytes32 =&gt; bool) public nullifiers</code></p>
            <p className="text-sm text-muted-foreground">문제: 매 tx마다 새 slot 할당 &rarr; 영구 storage (삭제 불가) &rarr; Note 증가에 비례해 cost 증가</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-green-500/30 p-4">
              <p className="font-semibold text-sm text-green-400 mb-2">Bitmap storage</p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li>256 nullifiers &rarr; 1 storage slot</li>
                <li>SSTORE cost 절감</li>
              </ul>
            </div>
            <div className="rounded-lg border border-blue-500/30 p-4">
              <p className="font-semibold text-sm text-blue-400 mb-2">Rollup offloading</p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li>nullifier set을 L2에 저장</li>
                <li>L1에는 merkle root만</li>
                <li>대규모 사용 시 필수</li>
              </ul>
            </div>
            <div className="rounded-lg border border-amber-500/30 p-4">
              <p className="font-semibold text-sm text-amber-400 mb-2">Checkpoint pruning</p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li>old nullifier를 별도 tree로</li>
                <li>Contract upgrade로 관리</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-violet-500/30 p-4">
            <p className="font-semibold text-sm text-violet-400 mb-2">RAILGUN v2 (2023)</p>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>별도 <strong>sparse Merkle tree</strong>로 nullifier 관리 &rarr; gas cost 일정 + batch verification 가능</li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}
