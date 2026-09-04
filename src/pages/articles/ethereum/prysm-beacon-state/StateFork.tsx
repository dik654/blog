import type { CodeRef } from "@/components/code/types";

export default function StateFork({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="state-fork" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Fork upgrade는 같은 struct에 field를 덧붙이는 일이 아니라 consensus
        state의 versioned 전이다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Phase0, Altair, Bellatrix, Capella, Deneb, Electra, Fulu 계열은 각각
          활성화 epoch와 BeaconState schema·transition rule을 갖습니다. Altair의
          participation·sync committee, Bellatrix의 execution payload header처럼
          새 field가 생기며 이후 fork는 nested type과 queue도 바꿉니다. 따라서
          state identity는 root만이 아니라 network/genesis, slot·epoch와 fork
          version을 함께 가져야 합니다.
        </p>
        <h3>Upgrade boundary의 실행 순서</h3>
        <ol>
          <li>
            현재 state의 slot에서 epoch를 계산하고 configured fork activation과
            비교합니다.
          </li>
          <li>
            Old schema의 모든 공통 field를 보존하고 새 field를 spec이 정한
            초기값으로 만듭니다.
          </li>
          <li>
            Fork version을 바꾸고 새 schema로 full <code>hash_tree_root</code>를
            계산합니다.
          </li>
          <li>
            Old root, fork transition, new root와 config/spec provenance를
            atomic checkpoint로 남깁니다.
          </li>
        </ol>
        <p>
          새 field를 zero value로 두면 된다는 일반 규칙은 없습니다. 어떤 값은 기존 field에서 유도하거나 committee 계산이 필요할 수 있으므로 fork별
          upgrade function과 official test vector가 정본입니다. Unknown future fork를 latest known schema로 조용히
          decode하면 field가 빠진 다른 object를 만들 수 있어 reject해야 합니다.
        </p>
        <h3>Reorg와 fork activation 경계</h3>
        <p>
          Activation epoch 주변에서 old branch와 new branch를 오갈 때 cache key가 fork를 포함하지 않으면 같은 slot 비슷한 field를 잘못
          재사용할 수 있습니다. Common ancestor가 fork 전이라면 새 branch의 slot processing과 upgrade를 다시 수행합니다. State
          root·fork digest·head는 함께 조정하되 finalized checkpoint가 허용하지 않는 과거로 되돌아가지 않습니다.
        </p>
        <h3>Version receipt와 paired release gate</h3>
        <p>
          Prysm semver/SHA, consensus-spec release/commit, network
          preset·genesis root, fork epochs/versions, SSZ generator version,
          state/cache DB schema와 feature flags를 기록합니다. Base/candidate에
          fork 전·정확한 activation slot·fork 후 fixture, skipped slots,
          malformed old/new encoding, COW branch, dirty cache, reorg와 restart를
          넣어 post-state bytes/root·reject parity를 검사합니다. 그 뒤 copy
          bytes, hash count, transition p95와 peak memory를 비교하고 rollback
          가능한 DB snapshot을 보존합니다.
        </p>
        <p>
          2026-08의 consensus-spec repository에는 stable과 unstable fork가 함께 보입니다. “master에 존재한다”는 사실은 mainnet에서
          활성화됐다는 뜻이 아닙니다. 실제 network schedule과 stable status를 기준으로 feature를 켭니다.
        </p>
      </div>
    </section>
  );
}
