import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import ContextViz from "./viz/ContextViz";
import SMRModelViz from "./viz/SMRModelViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        상태 머신 복제는 상태가 아니라 결정된 명령의 순서를 복제한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          세 replica가 같은 계좌 서비스를 운영해도 <code>deposit 3</code>과
          <code>withdraw 1</code>을 다른 순서로 실행하면 중간 결과와 client reply가
          달라질 수 있습니다. State machine replication(SMR)은 client command에
          하나의 total order를 정하고, 같은 initial state의 deterministic state
          machine이 그 순서대로 command를 apply하게 해 fault-tolerant service를
          만듭니다.
        </p>
        <p>
          이 글은 SMR, total-order delivery, replicated log의 commit/apply,
          Paxos·Raft safety를 소유합니다. Timing·failure model은{" "}
          <Link to="/blockchain/distributed-systems">분산 시스템 기초</Link>,
          Byzantine quorum은 <Link to="/blockchain/bft-theory">BFT 이론</Link>에서
          가져옵니다.
        </p>
      </div>

      <ContentBoundary article="smr-theory" />
      <ContextViz />
      <SMRModelViz />

      <ExplainedFormula
        question="같은 command log가 왜 replica의 같은 state를 만들까?"
        idea="State transition δ가 결정적이면 동일한 시작 state에 동일한 ordered command prefix를 하나씩 적용한 결과가 귀납적으로 같습니다."
        formula={String.raw`\begin{aligned}
          (S_i,r_i)&=\delta(S_{i-1},c_i)\\
          S_m&=\delta^*(S_0,[c_1,\ldots,c_m])
        \end{aligned}`}
        terms={[
          { symbol: "S_0,S_i", name: "replica state", description: "공통 initial state와 i번째 command 적용 뒤 state입니다." },
          { symbol: "c_i", name: "ordered command", description: "Consensus가 log index i에 결정한 명령입니다." },
          { symbol: "r_i", name: "command result", description: "State transition이 만드는 client-visible 결과입니다." },
          { symbol: String.raw`\delta,\delta^*`, name: "transition", description: "한 command와 ordered sequence를 적용하는 결정적 함수입니다." },
        ]}
        assumptions={[
          "Replica는 같은 snapshot과 committed log prefix에서 시작합니다.",
          "Clock·randomness·external read처럼 달라질 입력은 command나 log evidence에 고정합니다.",
        ]}
        interpretation="같은 log만으로 충분한 것이 아니라 같은 initial state와 deterministic transition이 필요합니다. Divergent state digest가 나오면 세 조건을 각각 검사합니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Command·log·state·reply를 구분합니다</h3>
        <p>
          Client의 요청은 command이고, consensus가 정한 위치가 log index입니다.
          Entry가 replica disk에 append된 상태, quorum에 복제되어 commit된 상태,
          state machine에 apply된 상태는 서로 다릅니다. Client success는 protocol이
          정한 durability와 commit 조건 뒤에만 반환해야 하며, apply result와 request
          ID를 함께 보존해야 retry가 같은 effect를 두 번 만들지 않습니다.
        </p>
        <p>
          예를 들어 request <code>r-17: increment</code>가 commit된 직후 reply가
          손실되면 client는 retry합니다. Replica가 request ID별 committed result를
          기억하면 두 번째 increment 없이 이전 result를 반환할 수 있습니다. SMR의
          total order만으로 외부 payment API까지 exactly-once가 되지는 않으며,
          external effect에는 idempotency key·outbox·reconciliation이 필요합니다.
        </p>
      </div>

      <div id="paper-schneider-smr" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · SMR 정본</p>
        <p className="mt-2 text-sm font-semibold">Implementing Fault-Tolerant Services Using the State Machine Approach</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          문제는 replicated deterministic state machine으로 fault-tolerant service를
          구현하는 조건입니다. Replica coordination, command ordering과 output voter를
          하나의 접근으로 정리합니다. Non-deterministic application이나 external
          side effect가 자동으로 안전해진다는 결론은 아닙니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://www.cs.cornell.edu/fbs/publications/SMSurvey.pdf" target="_blank" rel="noreferrer">Schneider tutorial 원문 보기</a>
      </div>
    </section>
  );
}
