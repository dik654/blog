import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import CometBFTCoreViz from "../cometbft-core-viz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">CometBFT consensus는 proposal을 고르는 함수가 아니라 증거를 보존하는 H/R/S 상태 머신이다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          한 height에서 proposer가 늦거나 invalid block을 보내도 node는 임의로 다음 block을 정할 수 없습니다. 같은
          height 안에서 round를 올리고 Propose·Prevote·Precommit step을 반복하되, 이전 round에서 얻은 lock evidence를
          보존해야 서로 다른 두 block의 commit을 막을 수 있습니다. CometBFT는 이 상태를
          <strong> height·round·step(H/R/S)</strong> 좌표와 signed vote set으로 관리합니다.
        </p>
        <p>
          이 글은 network callback보다 한 단계 위에서 <strong>event queue → H/R/S transition → lock → timeout →
          accountability</strong>를 추적합니다. Quorum intersection의 일반 이론은 <Link to="/blockchain/bft-theory">BFT</Link>,
          Vote·Commit의 wire 검증은 <Link to="/blockchain/cometbft-types">CometBFT type</Link>, decided block 실행은
          <Link to="/blockchain/cometbft-abci">ABCI++</Link>이 소유합니다.
        </p>
      </div>
      <ContentBoundary article="cometbft-consensus" />
      <CometBFTCoreViz mode="consensus" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>H/R/S를 먼저 읽으면 함수 이름이 바뀌어도 흐름이 남습니다</h3>
        <p>
          Height는 지금 결정할 block 위치, round는 같은 height에서 proposer와 기다림을 바꾸는 재시도 번호, step은
          현재 만들어야 할 evidence 종류입니다. Event handler를 볼 때는 “무슨 함수인가”보다 입력 event의 좌표가 현재
          state보다 과거·현재·미래 중 어디인지, 어떤 validation 뒤 어느 좌표로 이동하는지, durable WAL과 outgoing vote가
          어느 transition에 연결되는지 확인합니다.
        </p>
        <h3>Safety와 liveness의 owner가 다릅니다</h3>
        <p>
          Signed quorum과 lock rule은 conflicting commit을 막는 safety를 만들고, timeout과 proposer rotation은 network가
          다시 bounded delay에 들어온 뒤 progress할 기회를 만드는 liveness 장치입니다. Timeout이 길다는 이유만으로
          safety가 강해지거나, timeout을 짧게 줄였다는 이유만으로 처리량이 항상 좋아지지는 않습니다.
        </p>
      </div>
      <div id="paper-cometbft-consensus-v040" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 규격 읽기 · v0.40.0 consensus</p>
        <p className="mt-2 text-sm font-semibold">CometBFT Byzantine Consensus Algorithm</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">문제는 Byzantine validator와 delayed message가 있는 환경에서 proposal·prevote·precommit·round change로 한 block을 결정하는 것입니다. 규격의 proof는 validator power·authentication·partial-synchrony 전제에 제한되며 application execution이나 고정 latency를 보장하지 않습니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://github.com/cometbft/cometbft/blob/v0.40.0/spec/consensus/consensus.md" target="_blank" rel="noreferrer">v0.40.0 consensus 규격 보기</a>
      </div>
    </section>
  );
}
