import type { CodeRef } from "@/components/code/types";

interface Props {
  title: string;
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function ForkChoice({ title, onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="fork-choice" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">{title}</h2>

      <div
        id="best-update"
        className="prose prose-neutral max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>Best update는 “가장 최신” 하나로 고르지 않습니다</h3>
        <p>
          여러 유효 update를 비교할 때 specification과 Helios 0.11.1은 먼저
          supermajority 여부를 구분하고, 둘 다 그 아래라면 참여 position이 더
          많은 후보를 선호합니다. 이어 relevant next committee, finality,
          sync-committee-period 안에서의 finality, 참여 수와 attested/signature
          slot 같은 tie-break를 순서대로 적용합니다. 따라서 slot 108이라는
          이유만으로 next committee와 finality proof가 있는 slot 107 후보를
          무조건 밀어내지 않습니다.
        </p>
      </div>

      <div
        id="reorg-handling"
        className="prose prose-neutral max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>Optimistic reorg와 finalized safety를 구분합니다</h3>
        <p>
          더 높은 slot의 유효 update가 기존 optimistic branch와 다른 root를
          가리키면 Helios의 빠른 조회 기준도 새 root로 이동합니다. 이때 이전
          optimistic block hash에 묶인 account proof와 local-call cache는 새
          head 결과로 재사용하면 안 됩니다. Finalized header는 더 높은 finalized
          slot과 supermajority evidence가 있을 때만 전진하며, “영구적”이라는
          표현도 consensus safety·weak-subjectivity 전제 아래에서 사용해야
          합니다.
        </p>
        <p>
          오랫동안 충분한 참여를 얻지 못했을 때의 force update는 liveness를 위한
          별도 escape hatch입니다. Helios source도 quorum 미만 header를 받아들일
          수 있다고 경고하므로 normal validation과 같은 안전성으로 소개하지
          않습니다.
        </p>
        <h3>Implementation snapshot과 release gate를 분리합니다</h3>
        <p>
          실제 0.11.1 동작은 위 source snapshot에 귀속합니다. 변경을 배포할 때는
          wrong fork domain, 0·341·342·350/512 participation, period 직전과
          직후, invalid finality/committee branch, competing update,
          force-update timeout과 restart를 base/candidate에 넣습니다.
          Optimistic/finalized root, committee, best update와 error parity를
          확인한 뒤 polling latency와 CPU를 비교하고, 실패하면 이전 binary·store
          snapshot으로 rollback합니다.
        </p>
      </div>
    </section>
  );
}
