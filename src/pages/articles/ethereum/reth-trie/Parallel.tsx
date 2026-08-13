export default function Parallel() {
  return (
    <section id="parallel" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Storage-root 병렬화는 account-root의 입력을 먼저 확정해야 한다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          서로 다른 contract의 storage tries는 독립적으로 계산할 수 있습니다.
          Worker가 각 storage root를 반환하면 coordinator가 해당 root를 account
          value에 넣고 마지막 account trie root를 계산합니다. 같은 contract의
          여러 slot은 한 storage trie 안에서 deterministic key order와 node
          merge를 보존해야 합니다.
        </p>
        <h3>병렬 결과에는 정해진 merge 순서가 필요합니다</h3>
        <p>
          Worker 완료 순서는 매번 달라도 최종 root는 같아야 하므로 결과를
          account key로 정렬하고 duplicate ownership을 거절합니다. Worker가
          stale parent root를 읽거나 delete와 update를 서로 다른 generation에서
          계산하면 각각은 내부적으로 valid해 보여도 결합 root가 틀릴 수
          있습니다.
        </p>
        <h3>Release gate</h3>
        <p>
          Empty state, account create/delete, storage update/wipe, shared
          prefix, inline/hash 경계, reorg와 restart를 sequential full-trie
          oracle과 비교합니다. Account/storage root·node set·changeset parity를
          통과한 뒤 visited nodes, DB read bytes, hash count, wall time과 peak
          memory를 비교하며, 평균 speedup만으로 worst-case correctness를
          대신하지 않습니다.
        </p>
      </div>
    </section>
  );
}
