import PaxosViz from "./viz/PaxosViz";

export default function Paxos() {
  return (
    <section id="paxos" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Paxos는 이미 chosen될 수 있는 value를 새 proposal이 이어받게 한다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Acceptor는 자신이 promise한 가장 큰 proposal number와 accepted
          proposal·value를 보존합니다. Proposer가 Prepare quorum을 얻었을 때 accepted
          value가 하나라도 있으면 가장 높은 proposal의 value를 선택하고, 아무것도
          없다면 새 value를 고를 수 있습니다. 이후 Accept request가 quorum에
          기록되면 value가 chosen됩니다.
        </p>
      </div>
      <PaxosViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>왜 가장 높은 accepted value를 이어받나</h3>
        <p>
          이전 value v가 chosen됐다면 그 accept quorum과 새 Prepare quorum은 적어도
          한 acceptor를 공유합니다. 그 acceptor 또는 더 높은 proposal의 chain을 통해
          새 proposer는 v를 이어받습니다. Promise는 더 낮은 proposal이 뒤늦게
          accept되는 것을 막으므로 서로 다른 value가 같은 slot에서 chosen되지
          않습니다. 이것이 agreement proof의 핵심이고, proposer가 살아 있다는
          liveness proof는 아닙니다.
        </p>
        <p>
          Multi-Paxos는 stable leader 아래 반복 Prepare 비용을 줄여 slot마다 Accept를
          수행합니다. 실제 SMR에는 slot gap, leader recovery, durable acceptor state,
          learner delivery, membership change와 client dedupe가 더 필요합니다.
        </p>
      </div>
      <div id="paper-paxos-made-simple" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Paxos</p>
        <p className="mt-2 text-sm font-semibold">Paxos Made Simple</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">한 value를 chosen하는 acceptor rule과 state machine의 sequence of instances를 설명합니다. Stable leader·storage engine·reconfiguration·production latency를 완성된 library로 제공하는 논문은 아닙니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://www.microsoft.com/en-us/research/publication/paxos-made-simple/" target="_blank" rel="noreferrer">Microsoft Research 원문 보기</a>
      </div>
    </section>
  );
}
