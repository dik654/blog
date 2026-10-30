import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import CosmosCoreLocator from "../CosmosCoreLocator";
import CometBFTConsensusTraceViz from "./viz/CometBFTConsensusTraceViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <CosmosCoreLocator
        currentSlug="cometbft-consensus"
        region="합의 상태 전이"
        question="제안자가 늦어 한 round가 실패해도 node들은 어떻게 같은 다음 round로 이동해 block 하나만 결정할까요?"
      />
      <h2 className="mb-6 text-2xl font-bold">실패한 round 0부터 B41을 결정하는 round 1까지 한 번에 추적합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          높이 41에서 A·B·C의 voting power가 각각 40·35·25이고 round 0 proposer A의 제안이 늦었다고 하겠습니다.
          A와 B가 nil에 투표해 round 0을 끝내고, round 1 proposer B가 보낸 block B41에 다시 A와 B가 투표해
          75/100으로 결정합니다. 이 글은 이 한 사례가 <strong>queue → H/R/S → nil → round 변경 → lock → commit</strong>으로
          바뀌는 과정을 따라갑니다.
        </p>
        <p>
          왜 2/3가 필요한지는 <Link to="/cs/blockchain/bft-theory">BFT 이론</Link>, Vote·Commit의 실제 bytes와 서명 검증은
          <Link to="/cs/blockchain/cometbft-types">CometBFT 데이터 구조</Link>, 결정한 block을 application에 실행하는 과정은
          <Link to="/cs/blockchain/cometbft-abci">ABCI++</Link>에서 이어집니다. 여기서는 합의 node 내부에서 입력 하나가
          어느 상태를 바꾸고 어떤 증거를 남기는지에 집중합니다.
        </p>
      </div>
      <ContentBoundary article="cometbft-consensus" />
      <CometBFTConsensusTraceViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>그림에서 먼저 볼 것은 함수 이름이 아니라 네 가지 상태입니다</h3>
        <p>
          H/R/S는 지금 결정할 높이, 같은 높이의 재시도 번호, 현재 증거를 만드는 단계를 뜻합니다. VoteSet은 같은 좌표에 모인
          signed power를, LockedBlock은 다음 round에서도 함부로 버릴 수 없는 block을 보존합니다. Event handler를 읽을 때는
          입력이 현재 좌표보다 과거·현재·미래 중 어디인지, 처리 뒤 이 네 상태가 무엇으로 바뀌는지를 확인합니다.
        </p>
        <h3>Round를 바꾸는 일과 block을 결정하는 일은 같은 조건이 아닙니다</h3>
        <p>
          Timeout은 기다림을 끝내 다음 step이나 round로 갈 기회를 만들 뿐 block을 결정하지 않습니다. 특정 block에 모인
          +2/3 prevote는 lock을 만들고, 같은 block의 +2/3 precommit이 Commit을 만듭니다. 따라서 “시간이 지났다”와
          “결정 증거가 생겼다”를 같은 신호로 다루면 안 됩니다.
        </p>
        <h3>아래 코드는 release와 commit을 고정해 읽습니다</h3>
        <p>
          코드 패널은 <code>v0.40.0</code>의 content commit
          <code>0880b4d378f347ab16e54ec677ff50d803f37d62</code>에서 실제 연속 구간을 옮기거나, 긴 함수 안의 분기를 생략 표시와 함께
          발췌했습니다. 이전 학습용 축약 구현은 공식 근거로 사용하지 않습니다.
        </p>
      </div>
      <div id="paper-cometbft-consensus-v040" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 규격 읽기 · v0.40.0 consensus</p>
        <p className="mt-2 text-sm font-semibold">CometBFT Byzantine Consensus Algorithm</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
            풀어야 할 문제는 이렇습니다. Byzantine validator와 delayed message가 있는 환경에서 proposal·prevote·precommit·round
            change로 한 block을 결정하는 것입니다. 규격의 proof는 validator power·authentication·partial-synchrony 전제 안에서만
            성립하며 application execution이나 고정 latency는 보장 범위 밖입니다.
          </p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
          <a className="text-primary hover:underline" href="https://github.com/cometbft/cometbft/blob/0880b4d378f347ab16e54ec677ff50d803f37d62/spec/consensus/consensus.md" target="_blank" rel="noreferrer">고정 commit의 consensus 규격 보기</a>
          <a className="text-primary hover:underline" href="https://github.com/cometbft/cometbft/blob/0880b4d378f347ab16e54ec677ff50d803f37d62/consensus/state.go" target="_blank" rel="noreferrer">state.go 원문 보기</a>
        </div>
      </div>
    </section>
  );
}
