import SafetyLivenessViz from "./viz/SafetyLivenessViz";

export default function SafetyLiveness() {
  return (
    <section id="safety-liveness" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        View change는 lock evidence를 버리는 재시작이 아니다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Leader가 Byzantine이거나 network가 지연되면 current view가 certificate를 만들지 못할 수
          있습니다. Replica는 timeout을 모아 더 높은 view로 이동하지만, 이전 view에서 이미 만들어진
          strongest safe certificate와 local lock을 새 leader에게 전달합니다. 새 leader가 이를 무시해
          임의 value를 제안하면 progress는 빨라 보여도 conflicting commit이 가능해집니다.
        </p>
      </div>
      <SafetyLivenessViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Protocol을 certificate state machine으로 읽습니다</h3>
        <p>
          PBFT의 pre-prepare/prepare/commit, HotStuff의 chained quorum certificate처럼 phase 이름과
          commit rule은 다를 수 있습니다. 공통 질문은 “어떤 signed set이 어떤 phase의 certificate인가”,
          “replica가 언제 lock을 갱신하는가”, “더 높은 view가 어떤 evidence를 이어받아야 하는가”입니다.
          단순히 2f+1 vote를 모았다는 사실만으로 어느 phase에서나 commit할 수는 없습니다.
        </p>
        <h3>Failure injection은 safety와 liveness oracle을 따로 둡니다</h3>
        <p>
          Byzantine leader equivocation, vote omission, delayed certificate, partition, timeout race, restart,
          stale view replay를 같은 seed와 schedule로 주입합니다. Safety hard gate는 같은 height에서
          conflicting committed digest 0건입니다. Liveness는 GST를 표시한 뒤 recovery time·view 수·message
          수로 측정하며, GST 이전 halt를 곧 실패로 판정하지 않습니다.
        </p>
      </div>
      <div id="paper-pbft" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · 실용 BFT</p>
        <p className="mt-2 text-sm font-semibold">Practical Byzantine Fault Tolerance</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          문제는 asynchronous network에서 Byzantine replica를 견디는 practical state-machine replication입니다.
          Normal-case phases, checkpoint, view change와 implementation evaluation을 제시합니다. 현대 WAN·weighted
          membership·모든 workload에서 같은 성능을 보장한다는 뜻은 아닙니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://pmg.csail.mit.edu/papers/osdi99.pdf" target="_blank" rel="noreferrer">PBFT 원문 보기</a>
      </div>
      <div id="paper-hotstuff" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Chained certificate</p>
        <p className="mt-2 text-sm font-semibold">HotStuff: BFT Consensus with Linearity and Responsiveness</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          문제는 partial synchrony BFT에서 leader replacement를 단순화하면서 communication과 responsiveness를
          개선하는 것입니다. Chained quorum certificates와 pacemaker 분리를 제시합니다. 모든 validator count·
          implementation·network에서 선형 총 bytes가 자동 달성된다는 주장은 아닙니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/1803.05069" target="_blank" rel="noreferrer">HotStuff 원문 보기</a>
      </div>
    </section>
  );
}
