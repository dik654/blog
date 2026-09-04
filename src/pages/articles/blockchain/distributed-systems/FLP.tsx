import { Link } from "react-router-dom";
import FLPViz from "./viz/FLPViz";

export default function FLP() {
  return (
    <section id="flp" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        FLP는 합의가 항상 실패한다는 정리가 아니라 종료 보장의 한계다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          FLP(Fischer–Lynch–Paterson) 정리는 완전 비동기 message-passing
          system에서 process 하나가 crash할 수 있을 때, deterministic consensus
          protocol이 모든 admissible execution에서 agreement·validity·termination을
          함께 보장할 수 없다고 말합니다. 실제 cluster가 대체로 합의한다는 관찰과
          모순되지 않습니다. 핵심은 한 번도 끝나지 않는 허용된 schedule이
          <em> 존재</em>한다는 점입니다.
        </p>
      </div>

      <FLPViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>정리의 입력 계약</h3>
        <ul>
          <li>Process는 결정적이며 binary input에서 시작합니다.</li>
          <li>Process speed와 message delay에 고정 upper bound가 없습니다.</li>
          <li>최대 한 process가 crash할 수 있고 non-faulty receiver의 메시지는 결국 전달됩니다.</li>
          <li>Agreement·validity뿐 아니라 모든 admissible run의 termination을 요구합니다.</li>
        </ul>
        <p>
          Timeout bound, synchronized clock, random coin, failure detector, Byzantine
          behavior는 이 기본 모델에 없습니다. 이 중 하나를 추가하면 다른
          theorem의 대상이 됩니다.
        </p>

        <h3>Bivalence로 읽는 증명 아이디어</h3>
        <p>
          Configuration은 모든 local state와 아직 전달되지 않은 message의
          snapshot입니다. 앞으로 0만 결정할 수 있으면 0-valent, 1만 가능하면
          1-valent, 둘 다 가능한 상태는 <strong>bivalent</strong>입니다. Validity
          때문에 bivalent initial configuration이 하나는 존재합니다.
        </p>
        <p>
          이제 어떤 event <code>e</code>가 bivalent state를 univalent하게 만들려
          한다고 합시다. Scheduler는 <code>e</code>와 독립적인 다른 process의
          event를 먼저 실행하고, 서로 commute하는 execution을 비교해 결정을
          고정하지 않는 다음 bivalent state를 구성할 수 있습니다. 이 선택을
          반복하면 non-faulty process의 message가 결국 전달되는 admissible run을
          유지하면서도 termination을 피할 수 있습니다. 이것은 평균적인 network
          behavior에 대한 확률 주장이 아니라 adversarial execution의 존재
          증명입니다.
        </p>

        <h3>실제 protocol은 무엇을 추가하는가</h3>
        <p>
          Raft·Paxos 계열은 안전성 규칙과 별도로 timeout·leader election 같은
          진행 메커니즘을 둡니다. Partial synchrony BFT는 unknown GST 이후
          message delay가 bound 안으로 돌아온다는 조건에서 liveness를 얻습니다.
          Randomized asynchronous consensus는 adversary가 다음 선택을 완전히
          예측하지 못하게 합니다. 중요한 것은 “FLP를 해결했다”가 아니라 어떤
          추가 가정에서 어떤 보장을 얻었는지 적는 것입니다.
        </p>
        <p>
          이 글 다음에는 <Link to="/blockchain/smr-theory">SMR</Link>에서 safety
          rule과 leader-based progress를 실제 log에 연결하고,{" "}
          <Link to="/blockchain/bft-theory">BFT</Link>에서 partial synchrony와
          quorum certificate를 더 엄밀하게 다룹니다.
        </p>
      </div>

      <div
        id="paper-flp-consensus"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">논문 읽기 · 불가능성의 범위</p>
        <p className="mt-2 text-sm font-semibold">
          Impossibility of Distributed Consensus with One Faulty Process
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          문제는 비동기 process가 crash 가능할 때 deterministic binary consensus의 total correctness입니다. Bivalence와
          critical event를 이용해 종료하지 않는 admissible execution이 존재함을 보입니다. Byzantine fault, probabilistic
          protocol, partial synchrony를 같은 결론으로 일반화하면 안 되며 모든 실제 실행이 멈춘다는 실험 결과도 아닙니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://groups.csail.mit.edu/tds/papers/Lynch/jacm85.pdf"
          target="_blank"
          rel="noreferrer"
        >
          FLP 원문과 proof structure 보기
        </a>
      </div>
    </section>
  );
}
