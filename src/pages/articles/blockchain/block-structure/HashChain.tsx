import { CitationBlock } from '../../../../components/ui/citation';

export default function HashChain() {
  return (
    <section id="hash-chain" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">해시 체인과 불변성</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">해시 포인터로 연결된 체인 구조</h3>
        <p>
          블록체인의 각 블록은 <strong>해시 포인터(hash pointer)</strong>를 통해 이전 블록을 참조합니다.
          일반 포인터가 데이터의 위치만 가리키는 것과 달리, 해시 포인터는 데이터의 위치와
          함께 <strong>해당 시점의 데이터 해시</strong>를 함께 저장합니다.
          따라서 참조 대상이 변경되었는지를 암호학적으로 검증할 수 있습니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`일반 포인터 vs 해시 포인터:

일반 포인터:    Block N  ──ptr──→  Block N-1
               (위치만 참조, 내용 변조 감지 불가)

해시 포인터:    Block N  ──H(Block N-1)──→  Block N-1
               (해시 불일치 시 변조 즉시 감지)

해시 포인터 = (데이터 위치, 데이터의 해시값)
검증: H(실제 데이터) == 저장된 해시값 → 무결성 확인`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">블록 변조 시 전파되는 해시 불일치</h3>
        <p>
          공격자가 블록 N의 트랜잭션을 변경하면 블록 N의 머클 루트가 바뀌고,
          따라서 블록 N의 헤더 해시도 바뀝니다. 그런데 블록 N+1의 헤더에는
          블록 N의 원래 해시가 <code>prevBlockHash</code>로 저장되어 있으므로 불일치가 발생합니다.
          이 불일치를 해소하려면 블록 N+1의 헤더도 수정해야 하고, 연쇄적으로
          이후 모든 블록을 재계산해야 합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`변조 탐지 과정:

Block 100: Tx 변경 → Merkle Root 변경 → Header Hash 변경
  ↓
Block 101: prevHash ≠ H(Block 100')  ← 불일치 감지!
  ↓
Block 101도 수정 → Block 102: prevHash ≠ H(Block 101')  ← 불일치!
  ↓
... 체인 끝까지 모든 블록 재계산 필요

PoW 체인의 경우:
  각 블록마다 유효한 nonce를 다시 찾아야 함
  → 현재 네트워크 해시레이트 × 블록 수만큼의 작업량 필요
  → 정직한 체인보다 빠르게 성장하는 것은 사실상 불가능 (>51% 필요)`}</code></pre>

        <CitationBlock source="Bitcoin: A Peer-to-Peer Electronic Cash System (Satoshi Nakamoto, 2008)" citeKey={3} type="paper" href="https://bitcoin.org/bitcoin.pdf">
          <p className="italic text-foreground/80">
            "To modify a past block, an attacker would have to redo the proof-of-work
            of the block and all blocks after it and then catch up with and surpass the
            work of the honest nodes."
          </p>
          <p className="mt-2 text-xs">
            과거 블록을 수정하려면 해당 블록과 이후 모든 블록의 작업 증명을 다시 수행해야 하며,
            정직한 노드들의 작업 속도를 따라잡아야 합니다. 블록이 쌓일수록 변조 비용이
            기하급수적으로 증가합니다.
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">체인 재구성(Chain Reorganization)</h3>
        <p>
          네트워크 지연이나 동시 채굴로 인해 일시적으로 두 개 이상의 유효한 체인이 존재할 수 있습니다.
          이를 <strong>포크(fork)</strong>라고 하며, 블록체인 프로토콜은 포크 해결 규칙을 통해
          하나의 정규 체인(canonical chain)을 선택합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`포크와 체인 재구성:

          ┌─ Block A ── Block C ── Block D    ← 더 긴 체인 (채택)
Block 99 ─┤
          └─ Block B ── Block E               ← 고아 체인 (폐기)

Bitcoin: Longest chain rule (가장 많은 누적 작업량)
Ethereum PoS: Fork choice rule (LMD-GHOST + Casper FFG)

재구성 발생 시:
1. 고아 체인의 트랜잭션은 mempool로 반환
2. 정규 체인의 트랜잭션으로 상태 재적용
3. 충돌하는 트랜잭션은 무효화`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Finality (최종성)</h3>
        <p>
          트랜잭션이 되돌릴 수 없는 상태가 되었음을 보장하는 개념입니다.
          블록체인의 합의 메커니즘에 따라 최종성의 성격이 다릅니다.
        </p>
        <ul>
          <li>
            <strong>확률적 최종성 (Probabilistic Finality)</strong> — Bitcoin과 같은 PoW 체인에서는
            블록이 쌓일수록 변조 확률이 기하급수적으로 감소합니다.
            일반적으로 6 confirmations(약 1시간)이면 충분히 안전하다고 간주합니다.
            공격자의 해시레이트가 q일 때, k개 블록 후 변조 성공 확률은 (q/p)^k에 비례합니다.
          </li>
          <li>
            <strong>경제적 최종성 (Economic Finality)</strong> — Ethereum PoS에서는
            2개 epoch(약 12.8분) 후 체크포인트가 정당화(justified)되고,
            그 다음 epoch에서 확정(finalized)됩니다.
            확정된 블록을 되돌리려면 전체 스테이킹의 1/3 이상이 슬래싱되어야 하므로,
            경제적으로 비합리적인 공격이 됩니다.
          </li>
        </ul>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`최종성 비교:

                 Bitcoin (PoW)              Ethereum (PoS)
─────────────    ──────────────────         ──────────────────
유형             확률적 (Probabilistic)      경제적 (Economic)
시간             ~60분 (6 blocks)            ~12.8분 (2 epochs)
보장 수준        해시레이트에 의존            스테이킹 총량에 의존
변조 비용        >51% 해시레이트 확보         >1/3 스테이크 슬래싱
절대적 보장      없음 (확률적 감소)           있음 (finalized 이후)`}</code></pre>
      </div>
    </section>
  );
}
