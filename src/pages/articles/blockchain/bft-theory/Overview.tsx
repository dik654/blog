import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ContextViz from "./viz/ContextViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        BFT는 거짓말하는 replica가 있어도 서로 다른 두 값을 commit하지 않는 규칙이다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          Crash fault에서는 process가 멈추거나 침묵하지만, Byzantine fault에서는 같은
          phase·height에서 Alice에게 <code>vote(x)</code>, Bob에게 <code>vote(y)</code>를
          보내는 equivocation까지 허용합니다. Byzantine fault tolerant(BFT) consensus는
          이런 임의 행동이 fault bound 안에 있을 때 honest replica가 conflicting value를
          commit하지 않고, timing 조건이 회복되면 결국 다음 결정을 내리게 합니다.
        </p>
        <p>
          이 글은 equal-weight fixed membership의 partial-synchrony BFT에서 message
          authentication, quorum certificate, lock, view change를 연결합니다. Process·timing·
          failure와 safety/liveness는 <Link to="/blockchain/distributed-systems">분산 시스템 기초</Link>,
          crash-only majority는 <Link to="/blockchain/smr-theory">SMR</Link>, 공개 membership의
          resource weight는 <Link to="/blockchain/consensus-mechanisms">PoW·PoS</Link>에서 가져옵니다.
        </p>
      </div>

      <ContentBoundary article="bft-theory" />
      <ContextViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>문제의 최소 계약</h3>
        <ul>
          <li><strong>Agreement:</strong> honest replica 둘이 서로 다른 value를 commit하지 않습니다.</li>
          <li><strong>Validity:</strong> commit된 value는 protocol이 정한 valid proposal 조건을 만족합니다.</li>
          <li><strong>Integrity:</strong> 한 replica가 같은 instance에서 conflicting commit을 만들지 않습니다.</li>
          <li><strong>Termination:</strong> 정해진 fault·timing 조건에서 honest replica가 결국 결정합니다.</li>
        </ul>
        <p>
          Agreement·validity·integrity는 나쁜 certificate가 만들어지지 않게 하는 safety이고,
          termination은 progress를 말하는 liveness입니다. 실제 state-machine service에는 이
          ordered decision을 모든 replica가 결정적으로 apply하는 계약이 추가됩니다.
        </p>
      </div>

      <div id="paper-byzantine-generals" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · 문제와 인증 모델</p>
        <p className="mt-2 text-sm font-semibold">The Byzantine Generals Problem</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          문제는 traitor가 임의 message를 보낼 때 interactive consistency를 이루는 조건입니다.
          Oral-message와 unforgeable signed-message model을 구분하고 각각의 algorithm·하한을
          제시합니다. 현대 partial-synchrony quorum protocol의 3f+1을 모든 authenticated
          synchronous setting의 동일 결론으로 바꾸면 안 됩니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://lamport.azurewebsites.net/pubs/byz.pdf" target="_blank" rel="noreferrer">Lamport·Shostak·Pease 원문 보기</a>
      </div>
    </section>
  );
}
