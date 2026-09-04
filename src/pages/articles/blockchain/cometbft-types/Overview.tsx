import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import CometBFTCoreViz from "../cometbft-core-viz";
export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">CometBFT type은 메모리 구조체가 아니라 합의 증거의 wire 계약이다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          서로 다른 validator가 같은 block을 결정했다고 말하려면 “block bytes가 비슷하다”로는 부족합니다. 무엇을 hash했고 어느
          chain·height·round·phase에 누가 서명했는지, 그리고 그 서명 power가 어떤 validator snapshot에서 threshold를 넘었는지까지 재현할 수
          있어야 같은 block이라고 말할 수 있습니다. CometBFT의 Block·Vote·Commit·ValidatorSet은 바로 이 검증 문장을 bytes로 보존하는
          protocol type입니다.
        </p>
        <p>
          이 글은 <strong>header commitment → canonical vote → voting-power commit → evidence</strong> 순서로
          객체를 읽습니다. Consensus가 이 증거를 언제 만드는지는 <Link to="/blockchain/cometbft-consensus">합의 엔진</Link>,
          application state가 AppHash가 되는 과정은 <Link to="/blockchain/cometbft-abci">ABCI++</Link>, quorum
          intersection의 일반 증명은 <Link to="/blockchain/bft-theory">BFT 이론</Link>이 소유합니다.
        </p>
      </div>
      <ContentBoundary article="cometbft-types" />
      <CometBFTCoreViz mode="types" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>먼저 runtime state와 wire evidence를 구분합니다</h3>
        <p>
          <code>RoundState</code>나 proposer priority처럼 node가 다음 동작을 고르는 runtime state와, Block·Vote처럼
          peer에게 보내고 disk에 남기는 wire object는 같은 것이 아닙니다. 또한 Protobuf schema가 있다는 사실만으로
          signature가 안전해지는 것도 아닙니다. 서명에는 별도의 canonical representation과 chain domain이 필요하고,
          검증자는 선택한 release의 schema·validation rule·sign-byte rule을 한 snapshot으로 맞춰야 합니다.
        </p>
        <p>
          여기서 hash는 임의 길이 bytes를 짧은 digest로 바꾸는 함수입니다. collision resistance는 서로 다른 두 입력이 같은 digest를 갖는 경우를
          현실적으로 찾기 어렵다는 전제입니다. Digital signature는 private key 보유자가 특정 bytes에 서명했음을 public key로 확인해 줄 뿐입니다. 그
          내용이 참이라거나 signer가 정직하다는 뜻은 아닙니다. Validator는 이런 vote를 내는 참여 node이며 voting power는 각 validator 표의
          weight입니다.
        </p>
        <h3>이 글의 release 기준</h3>
        <p>
          아래 field와 lifecycle은 <code>v0.40.0</code> tag의 공식 specification과 source를 기준으로 설명합니다.
          Production 분석에서는 binary semver와 git SHA를 다시 기록해야 하며, moving <code>main</code>의 field나
          아직 배포하지 않은 feature를 현재 chain의 동작으로 일반화하지 않습니다.
        </p>
      </div>
      <div id="paper-cometbft-data-structures-v040" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 규격 읽기 · v0.40.0 data structures</p>
        <p className="mt-2 text-sm font-semibold">CometBFT Data Structures</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          여기서 걸리는 지점은 block·vote·commit·validator·evidence의 field와 validation rule을 같은 release에서 고정하는 일입니다.
          규격이 정의하는 범위는 wire object와 검증 관계까지이고 application business validity나 모든 chain의 validator 정책은 그 바깥입니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://github.com/cometbft/cometbft/blob/v0.40.0/spec/core/data_structures.md" target="_blank" rel="noreferrer">v0.40.0 규격 보기</a>
      </div>
    </section>
  );
}
