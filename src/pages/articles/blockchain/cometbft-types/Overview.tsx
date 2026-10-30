import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import CosmosCoreLocator from "../CosmosCoreLocator";
import CometBFTTypesEvidenceViz from "./viz/CometBFTTypesEvidenceViz";
export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <CosmosCoreLocator
        currentSlug="cometbft-types"
        region="결정 증거의 데이터 구조"
        question="서로 다른 node는 어떤 bytes와 서명을 받아야 같은 block이 결정됐다고 다시 검증할 수 있을까요?"
      />
      <h2 className="mb-6 text-2xl font-bold">한 block의 identity와 서명과 voting power를 끝까지 추적합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          높이 41에서 A는 power 40, B는 35, C는 25를 가졌다고 하겠습니다. 제안된 block B41의 Header hash가
          HB41이고 A와 B가 같은 round의 HB41에 precommit하면 signed power는 75입니다. 이 글은 이 한 사례가
          <strong> Block → Header hash → canonical vote → Commit → Evidence</strong>로 바뀌는 과정을 따라갑니다.
        </p>
        <p>
          Consensus가 이 객체를 언제 만드는지는 <Link to="/cs/blockchain/cometbft-consensus">합의 엔진</Link>이,
          application state가 AppHash가 되는 과정은 <Link to="/cs/blockchain/cometbft-abci">ABCI++</Link>가 다룹니다.
          여기서는 합의 알고리즘 전체를 다시 설명하지 않고, 이미 받은 객체를 제삼자가 검증할 수 있게 만드는 필드와 계산만 봅니다.
        </p>
      </div>
      <ContentBoundary article="cometbft-types" />
      <CometBFTTypesEvidenceViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>그림에서 먼저 구분할 두 가지</h3>
        <p>
          Block·Vote·Commit은 peer에게 전송하고 저장한 뒤 다른 node가 다시 검증하는 객체입니다. 반면 <code>RoundState</code>나
          proposer priority는 node가 다음 동작을 고르기 위해 갱신하는 실행 상태입니다. 같은 Go package에 있어도 역할과 권위가 다릅니다.
        </p>
        <p>
          또 Vote 구조체 전체를 그대로 서명하지 않습니다. ChainID·height·round·type·BlockID를 canonical form으로 만든 뒤 그 bytes에
          서명합니다. Protobuf 필드가 존재한다는 사실과, 특정 맥락에 묶인 유효한 서명이라는 사실은 별개의 검증 단계입니다.
        </p>
        <h3>이 글의 release 기준</h3>
        <p>
          필드와 검증 함수는 <code>v0.40.0</code>의 content commit
          <code>0880b4d378f347ab16e54ec677ff50d803f37d62</code>로 고정했습니다. 아래 코드 패널은 이 commit의 실제 연속 구간을
          옮긴 것이며, 이전에 쓰던 학습용 축약 구현은 공식 근거로 사용하지 않습니다.
        </p>
      </div>
      <div id="paper-cometbft-data-structures-v040" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 규격 읽기 · v0.40.0 data structures</p>
        <p className="mt-2 text-sm font-semibold">CometBFT Data Structures</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          여기서 걸리는 지점은 block·vote·commit·validator·evidence의 field와 validation rule을 같은 release에서 고정하는 일입니다.
          규격이 정의하는 범위는 wire object와 검증 관계까지이고 application business validity나 모든 chain의 validator 정책은 그 바깥입니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://github.com/cometbft/cometbft/blob/0880b4d378f347ab16e54ec677ff50d803f37d62/spec/core/data_structures.md" target="_blank" rel="noreferrer">고정 commit의 규격 보기</a>
      </div>
    </section>
  );
}
