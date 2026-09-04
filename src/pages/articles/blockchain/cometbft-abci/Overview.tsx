import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import CometBFTCoreViz from "../cometbft-core-viz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">ABCI++는 합의 엔진과 application이 후보·결정·영속화를 구분하는 protocol이다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          CometBFT가 block order를 결정해도 account balance나 smart-contract state를 직접 계산하지는 않습니다.
          Application Blockchain Interface(ABCI++)는 proposer의 후보 구성, validator의 후보 검사, 결정된 block의
          deterministic execution, durable commit을 서로 다른 request·response로 연결합니다. 이 경계를 지켜야
          여러 node가 같은 ordered block에서 같은 AppHash에 도달합니다.
        </p>
        <p>
          이 글은 <strong>logical connection → Prepare/Process coherence → candidate state → FinalizeBlock → Commit/replay</strong>
          순서로 읽습니다. 합의가 block을 결정하는 과정은 <Link to="/blockchain/cometbft-consensus">consensus 글</Link>,
          AppHash가 header에 들어가는 wire 구조는 <Link to="/blockchain/cometbft-types">type 글</Link>이 소유합니다.
        </p>
      </div>
      <ContentBoundary article="cometbft-abci" />
      <CometBFTCoreViz mode="abci" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>호출 이름보다 authority를 먼저 표시합니다</h3>
        <ul>
          <li><strong>CheckTx:</strong> mempool admission signal이며 block inclusion이나 최종 실행 receipt가 아닙니다.</li>
          <li><strong>PrepareProposal:</strong> proposer가 candidate transaction list를 만들며 deterministic일 필요는 없습니다.</li>
          <li><strong>ProcessProposal:</strong> 같은 proposal에 대한 ACCEPT/REJECT가 correct node에서 deterministic해야 합니다.</li>
          <li><strong>FinalizeBlock:</strong> decided block을 authoritative하게 실행하며 state-affecting output이 deterministic해야 합니다.</li>
          <li><strong>Commit:</strong> application이 FinalizeBlock state를 durable하게 저장하는 경계입니다.</li>
        </ul>
        <p>
          Candidate execution을 성능 최적화로 미리 할 수는 있지만 committed state를 덮어쓰면 안 됩니다. 한 height에서 proposal이 여러 개
          검사되기도 하는데 그중 FinalizeBlock으로 오는 것은 하나뿐이기 때문입니다.
        </p>
      </div>
      <div id="paper-cometbft-abci-methods-v040" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 규격 읽기 · v0.40.0 ABCI++ methods</p>
        <p className="mt-2 text-sm font-semibold">CometBFT ABCI++ Methods</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
            여기서 정의하는 것은 각 request·response의 field, 호출 시점, validation과 authority입니다. 규격이 맡는 범위는 interface
            lifecycle까지고 application business rule·database transaction·external side effect의 exactly-once는 대신
            구현해 주지 않습니다.
          </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://github.com/cometbft/cometbft/blob/v0.40.0/spec/abci/abci%2B%2B_methods.md" target="_blank" rel="noreferrer">v0.40.0 method 규격 보기</a>
      </div>
    </section>
  );
}
