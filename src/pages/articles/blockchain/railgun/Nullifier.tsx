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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Nullifier 3가지 필수 속성

// 1. Deterministic (결정론적)
// 같은 note → 같은 nullifier (항상)
// 다른 세션에서도 재현 가능
nullifier = Poseidon(spendingKey, leafIndex)

// 2. Pseudorandom (의사 랜덤)
// nullifier에서 spendingKey 추출 불가
// nullifier에서 leafIndex 추출 불가
// → Privacy 보존

// 3. Unique per note (note별 유일)
// 서로 다른 note → 서로 다른 nullifier (거의 확실)
// leafIndex가 다르면 → 결과 다름
// collision 확률 ~2^-248 (무시 가능)

// 공격 시도 vs 방어

// 공격 1: Brute force
// 공격자가 nullifier 주어지고 spendingKey 찾기
// → 2^256 search space, 무한대 시간

// 공격 2: Replay attack
// 공격자가 이전 tx의 nullifier 재사용
// → Contract가 nullifiers map 확인
// → 이미 true면 revert (reuse 불가)

// 공격 3: Front-running
// 공격자가 mempool에서 proof 탈취
// → 같은 nullifier 다른 tx로 submit
// → 하지만 proof binding ensures sender
// → Other addr로 submit 시 verify 실패`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Storage 최적화</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Solidity mapping
// mapping(bytes32 => bool) public nullifiers;

// 문제
// - 매 tx마다 새 slot 할당
// - 영구 storage (삭제 불가)
// - Note 수 증가 → storage cost 증가

// 최적화 기법
// 1) Bitmap storage
//    - 256 nullifiers → 1 storage slot
//    - SSTORE cost 절감

// 2) Rollup offloading
//    - nullifier set을 L2 rollup에 저장
//    - L1에는 merkle root만
//    - 대규모 사용 시 필수

// 3) Checkpoint pruning
//    - 일정 시점 이후 old nullifier는 별도 tree
//    - Contract upgrade로 관리

// RAILGUN v2 (2023)
// - Nullifier tree (별도 sparse Merkle tree)
// - Gas cost 일정
// - Batch verification 가능`}</pre>

      </div>
    </section>
  );
}
