import { Link } from "react-router-dom";
import ByzantineViz from "./viz/ByzantineViz";

export default function BFTTheory() {
  return (
    <section id="bft-theory" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Byzantine fault는 거짓말의 범위를 system model에 포함한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Crash-fault process는 멈추지만 그 전까지 protocol을 따릅니다. Byzantine process는 receiver마다 다른 값을 보내는
          equivocation, 유효하지 않은 state 제안, 선택적 침묵처럼 임의로 행동할 수 있습니다. Digital signature는 발신자와 내용의 무결성을 확인해도 서명한
          발신자가 서로 모순된 값을 보냈다는 사실 자체를 막지는 않습니다.
        </p>
      </div>

      <ByzantineViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Bound는 timing과 authentication 없이 적을 수 없습니다</h3>
        <p>
          흔히 보는 <code>n≥3f+1</code>과 <code>2f+1</code> quorum은 특정
          partially synchronous authenticated BFT protocol에서 자주 쓰이는
          구성입니다. 그러나 synchronous signed-message model, unauthenticated
          oral-message model, asynchronous randomized protocol은 서로 다른 lower
          bound와 진행 조건을 가집니다. 따라서 “Byzantine이면 항상 3f+1”로 외우지
          않고 membership, timing, authentication, safety·liveness 목표를 함께
          적어야 합니다.
        </p>
        <p>
          이 글에서는 failure model의 차이만 소유합니다. Quorum 교집합에 정직한
          voter가 남는 이유와 PBFT·Tendermint·HotStuff의 certificate rule은{" "}
          <Link to="/blockchain/bft-theory">BFT 정본</Link>에서 다룹니다.
        </p>

        <h3>Failure injection도 공격 능력에 맞춰야 합니다</h3>
        <p>
          Process kill만 주입하고 Byzantine tolerance를 검증했다고 결론 내릴 수
          없습니다. Crash suite에는 leader kill·restart·message delay를, Byzantine
          suite에는 double vote·invalid proposal·selective send·stale certificate를
          포함합니다. Oracle은 conflicting commit 0건, invalid state commit 0건,
          network 회복 뒤 progress time, evidence receipt를 별도로 기록합니다.
        </p>
      </div>

      <div
        id="paper-lamport-byzantine"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">논문 읽기 · Byzantine model</p>
        <p className="mt-2 text-sm font-semibold">The Byzantine Generals Problem</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          문제는 일부 participant가 모순된 정보를 보낼 수 있을 때 loyal participant가
          같은 결정을 내리는 interactive consistency입니다. Oral message와
          unforgeable signature 모델을 분리하고 각 조건의 algorithm과 bound를
          제시합니다. 이 결과를 partial synchrony blockchain protocol의 liveness나
          경제적 공격 비용으로 그대로 일반화하면 안 됩니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://lamport.azurewebsites.net/pubs/byz.pdf"
          target="_blank"
          rel="noreferrer"
        >
          Lamport–Shostak–Pease 원문 보기
        </a>
      </div>
    </section>
  );
}
