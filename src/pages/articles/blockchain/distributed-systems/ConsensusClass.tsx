import ConsensusClassViz from "./viz/ConsensusClassViz";

export default function ConsensusClass() {
  return (
    <section id="consensus-class" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Partial synchrony는 safety를 timeout에 맡기지 않고 liveness 조건만 추가한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Dwork–Lynch–Stockmeyer(DLS)의 partial synchrony는 동기와 비동기의 중간 모델입니다. 한 형태에서는 실제 delay bound가 존재하지만
          protocol이 값을 모르고 다른 형태에서는 알려진 bound가 unknown GST(Global Stabilization Time) 뒤부터 성립합니다. GST 전에는
          network가 오래 불안정할 수 있으므로 protocol은 보통 safety를 항상 지키고 liveness는 GST 이후 honest leader와 충분한 통신 조건에서
          보장합니다.
        </p>
      </div>

      <ConsensusClassViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Timeout을 늘려 가는 이유</h3>
        <p>
          Actual stable delay가 300ms인데 timeout을 100ms로 두면 정직한 leader도 반복해서 교체됩니다. Round마다 100→200→400ms로 늘리면
          GST 뒤에는 timeout이 실제 bound보다 커지는 round가 오며 그때 proposal과 vote가 완료될 수 있습니다. 이 계산은 safety proof가 아니라
          progress argument의 일부입니다. Stale round의 proposal을 막는 view number와 certificate rule은 별도로 필요합니다.
        </p>

        <h3>가정 추가를 숨기지 않는 설계표</h3>
        <div className="not-prose my-5 grid gap-5 md:grid-cols-2">
          {[
            ["Partial synchrony", "GST 뒤 delay bound와 rotating leader로 deterministic progress를 얻습니다."],
            ["Randomization", "Common coin 같은 무작위성으로 adversarial scheduler의 deterministic 회피를 끊습니다."],
            ["Failure detector", "의심 oracle의 completeness·accuracy 조건을 model에 추가합니다."],
            ["Weaker problem", "Approximate agreement·eventual consistency처럼 요구 성질을 조정합니다."],
          ].map(([title, body]) => (
            <div key={title} className="border-l border-border pl-4">
              <p className="text-sm font-semibold">{title}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>

        <h3>Release gate: theorem 전제와 실측을 같은 표에 두지 않습니다</h3>
        <p>
          Model sheet에는 timing·failure·channel·membership 가정을 적고 run ledger에는 binary SHA, config, workload,
          seed, message schedule과 fault trace를 적습니다. Safety gate는 conflicting decision과 invalid state가 0건이어야
          합니다. Liveness gate는 partition을 해제하고 honest leader가 나타난 뒤 p95 recovery time과 undecided request 수를
          측정합니다. 같은 조건의 baseline과 candidate를 paired run으로 비교하고 safety violation 한 건이면 즉시 rollback합니다.
        </p>
      </div>

      <div
        id="paper-dls-partial-synchrony"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">논문 읽기 · Partial synchrony</p>
        <p className="mt-2 text-sm font-semibold">
          Consensus in the Presence of Partial Synchrony
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          문제는 완전 동기와 완전 비동기 사이에서 timing bound가 unknown이거나
          unknown time 뒤에 성립하는 system의 fault-tolerant consensus입니다.
          여러 processor·communication·fault model에서 protocol과 lower bound를
          제시합니다. “인터넷은 보통 빠르다”는 경험칙이나 특정 timeout 숫자를
          증명하는 논문은 아닙니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://research.ibm.com/publications/consensus-in-the-presence-of-partial-synchrony"
          target="_blank"
          rel="noreferrer"
        >
          DLS abstract와 원문 보기
        </a>
      </div>

      <div
        id="paper-chandra-toueg-failure-detectors"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">논문 읽기 · Failure detector</p>
        <p className="mt-2 text-sm font-semibold">
          Unreliable Failure Detectors for Reliable Distributed Systems
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          문제는 asynchronous crash system에서 process suspicion을 어떤 oracle
          property로 추상화해야 consensus를 풀 수 있는지입니다. Completeness와
          accuracy로 detector class를 정의하고 reducibility를 분석합니다. 운영
          health check가 곧 perfect detector라는 뜻이나 Byzantine detection을
          보장하는 결과는 아닙니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://www.cs.cornell.edu/home/rvr/papers/UnreliableFD.pdf"
          target="_blank"
          rel="noreferrer"
        >
          Chandra–Toueg 원문 보기
        </a>
      </div>
    </section>
  );
}
