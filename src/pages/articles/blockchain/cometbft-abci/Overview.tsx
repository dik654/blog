import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import CosmosCoreLocator from "../CosmosCoreLocator";
import CometBFTAbciLifecycleViz from "./viz/CometBFTAbciLifecycleViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <CosmosCoreLocator
        currentSlug="cometbft-abci"
        region="합의와 application 상태 전이"
        question="합의가 B41을 결정한 뒤에도 application state가 아직 durable하지 않다면, 어느 호출과 저장 기록을 거쳐 높이 41이 완성될까요?"
      />
      <h2 className="mb-6 text-2xl font-bold">B41이 후보에서 durable state가 되는 한 높이를 추적합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          높이 40의 application state가 <code>S40</code>, 그 commitment가 <code>A40</code>인 node에 세 transaction이
          들어왔다고 하겠습니다. Proposer는 한 건을 빼고 두 건의 순서를 바꿔 B41을 만들고, validator들은 B41을 받아들이며,
          합의는 B41을 결정합니다. 그러나 이 세 단계 어디에서도 durable application state는 아직 h40입니다.
        </p>
        <p className="text-lg leading-8">
          이 글은 같은 B41이 <strong>후보 구성 → 후보 판정 → 합의 결정 → 결정 실행 → 결과 저장 → 영속화 → 재시작 대조</strong>를
          거치는 동안 어느 상태의 owner가 바뀌는지 따라갑니다.
        </p>
        <p>
          B41에 +2/3 precommit이 모이는 과정은 <Link to="/cs/blockchain/cometbft-consensus">합의 상태 머신</Link>, Vote와
          Header의 실제 bytes는 <Link to="/cs/blockchain/cometbft-types">CometBFT 데이터 구조</Link>에서 다룹니다. 여기서는
          결정된 block을 application state로 바꾸고 crash 뒤 어디서 재개하는지에만 집중합니다.
        </p>
      </div>
      <ContentBoundary article="cometbft-abci" />
      <CometBFTAbciLifecycleViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>같은 높이에도 여섯 상태가 동시에 존재할 수 있습니다</h3>
        <p>
          CometBFT 쪽에는 block store, FinalizeBlock response store, node State가 있고 application 쪽에는 candidate,
          ExecuteTxState, durable state가 있습니다. 정상 완료 뒤에는 모두 h41을 가리키지만 처리 중에는 서로 다른 높이를 가리키는 것이
          정상입니다. 장애를 볼 때 “node가 h41이다”라고 뭉뚱그리지 않고 각 저장 위치와 마지막 성공 호출을 따로 확인해야 합니다.
        </p>
        <h3>ACCEPT와 AppHash와 Commit은 서로 다른 영수증입니다</h3>
        <p>
          ProcessProposal의 ACCEPT는 이 proposal에 non-nil prevote를 할 수 있다는 뜻입니다. FinalizeBlock의 AppHash A41은 결정된
          B41을 실행한 결과를 식별하지만 아직 application disk에 영속화됐다는 뜻은 아닙니다. Commit이 성공해 application이 h41을
          durable하게 만들고, 그 뒤 CometBFT State까지 저장돼야 다음 height로 안전하게 진행할 수 있습니다.
        </p>
        <h3>아래 코드는 release와 content commit을 고정해 읽습니다</h3>
        <p>
          코드 패널은 <code>v0.40.0</code> annotated tag가 가리키는 content commit
          <code>0880b4d378f347ab16e54ec677ff50d803f37d62</code>의 실제 구간을 옮기거나 생략 위치를 표시해 발췌했습니다. 기존의
          학습용 축약 구현은 공식 동작의 근거로 사용하지 않습니다.
        </p>
      </div>
      <div id="paper-cometbft-abci-methods-v040" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 규격 읽기 · v0.40.0 ABCI++ methods</p>
        <p className="mt-2 text-sm font-semibold">CometBFT ABCI++ Methods</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          공식 규격은 request·response field, 호출 시점, 결정성, candidate 격리와 crash recovery 순서를 정의합니다. Application의
          business rule, database transaction, 외부 side effect의 exactly-once 처리는 이 interface가 대신 보장하지 않습니다.
        </p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
          <a className="text-primary hover:underline" href="https://github.com/cometbft/cometbft/blob/0880b4d378f347ab16e54ec677ff50d803f37d62/spec/abci/abci%2B%2B_methods.md" target="_blank" rel="noreferrer">고정 commit의 method 규격 보기</a>
          <a className="text-primary hover:underline" href="https://github.com/cometbft/cometbft/blob/0880b4d378f347ab16e54ec677ff50d803f37d62/spec/abci/abci%2B%2B_app_requirements.md" target="_blank" rel="noreferrer">application requirements 보기</a>
          <a className="text-primary hover:underline" href="https://github.com/cometbft/cometbft/blob/0880b4d378f347ab16e54ec677ff50d803f37d62/state/execution.go" target="_blank" rel="noreferrer">state/execution.go 원문 보기</a>
        </div>
      </div>
    </section>
  );
}
