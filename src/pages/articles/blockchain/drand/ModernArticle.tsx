import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import DrandRoundViz from "./DrandRoundViz";

const DRAND_CRYPTO = "https://docs.drand.love/docs/cryptography/";
const DRAND_SOURCE =
  "https://github.com/drand/drand/tree/e8dd607147c676086312b21c22d923dd6a07209a";
const CLIENT_VERIFY =
  "https://github.com/drand/drand-client/blob/0370e7dd5c0f09685ffea290a81af2451e97700e/lib/beacon-verification.ts";

export default function ModernArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">
            다섯 노드 중 셋이 모여 미래 round 42를 만들기
          </p>
          <h2 className="text-3xl font-bold tracking-tight">
            drand는 아무도 혼자 고를 수 없고 누구나 검증할 수 있는 공개 난수를
            만듭니다
          </h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          온라인 추첨 서버 한 대가 난수를 만들면 운영자가 결과를 미리 보거나
          유리한 값이 나올 때까지 다시 뽑을 수 있습니다. drand는 비밀키를 여러
          노드에 나누고, 정해진 수 이상의 노드가 같은 round에 서명해야만 결과가
          나오게 합니다.
        </p>
        <p className="text-lg leading-8 text-foreground/90">
          설명용 네트워크에는 노드가 5개 있고 문턱은 3입니다. Round 42에서
          partial signature 두 개만 모이면 결과는 없습니다. 세 번째가 오면
          누구나 하나의 BLS signature를 복원하고 collective public key로 확인할
          수 있습니다. 최종 공개 난수는 그 signature를 hash한 값입니다.
        </p>
        <p>
          하지만 서명이 유효하다는 사실만으로 추첨이 공정해지지는 않습니다.
          애플리케이션은 결과를 보기 전에 사용할 미래 round를 고정하고, chain
          identity와 검증 영수증을 남겨야 합니다. 이 글은 설정→round
          서명→복원→클라이언트 검증→애플리케이션 사용까지 한 요청을 따라갑니다.
        </p>
        <DrandRoundViz />
        <ContentBoundary article="drand" />
      </section>

      <section id="threshold-round" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            01 · 하나의 키를 아무도 갖지 않기
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Shares 세 개가 모이면 어떻게 signature 하나가 될까요?
          </h2>
        </header>
        <p>
          설정 단계의 DKG는 collective public key 하나와 노드별 private key
          share를 만듭니다. 전체 private key를 한곳에서 만든 뒤 나누는 방식이
          아니므로 한 노드가 탈취돼도 혼자 beacon을 만들 수 없습니다.
        </p>
        <p>
          각 round에서 노드는 scheme이 정한 같은 message에 partial signature를
          냅니다. Unchained scheme은 round로부터 message를 만들고, chained
          scheme은 이전 signature도 포함합니다. Chain·scheme·round가 다른
          shares를 한 묶음으로 섞으면 안 됩니다.
        </p>
        <ExplainedFormula
          question="t개의 partial signatures가 어떻게 하나의 signature가 될까요?"
          idea={
            <>
              같은 message에 대한 shares를 signer indices의 Lagrange
              coefficients로 group에서 보간합니다.
            </>
          }
          formula={String.raw`\sigma=\prod_{i\in S}\sigma_i^{\lambda_i},\qquad |S|\ge t`}
          annotatedFormula={String.raw`\underbrace{\sigma}_{\text{복원된 group 서명}}=\underbrace{\prod_{i\in S}\sigma_i^{\lambda_i}}_{\text{share를 signer index로 보간}},\qquad \underbrace{|S|\ge t}_{\text{문턱 이상의 서로 다른 share}}`}
          operations={[
            {
              expression: String.raw`\prod_{i\in S}\sigma_i^{\lambda_i}`,
              annotation: [
                "같은 chain·scheme·round message인지 확인",
                "각 signer index로 Lagrange coefficient 계산",
                "group 연산으로 partial signatures 결합",
              ],
            },
            {
              expression: String.raw`|S|\ge t`,
              annotation: [
                "n=5, t=3이면 서로 다른 shares 세 개 필요",
                "1·3·5는 문턱을 채움",
                "round 41·42 shares를 섞으면 거절",
              ],
            },
          ]}
          terms={[
            {
              symbol: "σ_i",
              name: "Partial signature",
              description:
                "Node i가 자신의 DKG private-key share로 같은 round message에 만든 서명입니다.",
            },
            {
              symbol: "λ_i",
              name: "Lagrange coefficient",
              description:
                "Signer index들을 이용해 secret polynomial의 0 지점 값을 group에서 복원하는 계수입니다.",
            },
            {
              symbol: "S",
              name: "Signer set",
              description:
                "이번 복원에 실제로 사용한 서로 다른 유효 signer indices입니다.",
            },
            {
              symbol: "t",
              name: "Threshold",
              description: "Full signature 복원에 필요한 최소 shares 수입니다.",
            },
          ]}
          assumptions={[
            "모든 shares는 같은 chain, scheme과 round message에 속합니다.",
            "Signer index가 중복되지 않고 각 partial signature를 먼저 검증합니다.",
            "BLS curve·hash-to-curve·subgroup·domain profile을 chain info와 일치시킵니다.",
          ]}
          interpretation="Shares 1·3·5는 t=3을 만족해 σ42를 복원할 수 있습니다. Shares 1·3만 있으면 올바른 결과는 ‘아직 없음’입니다."
        />
        <div id="paper-drand-crypto">
          <CitationBlock
            source="drand · Cryptography specification"
            citeKey={1}
            href={DRAND_CRYPTO}
          >
            <p>
              <strong>문제:</strong> 한 운영자가 미래 난수를 예측하거나 원하는
              값으로 편향하지 못하게 해야 합니다.
            </p>
            <p>
              <strong>기여:</strong> DKG, threshold BLS, chained·unchained
              messages와 signature hash로 이어지는 protocol을 설명합니다.
            </p>
            <p>
              <strong>전제:</strong> 선택한 network의 threshold, scheme,
              collective public key와 hash profile을 고정합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Beacon 생성의 암호학적 경계입니다.
            </p>
            <p>
              <strong>말하지 않는 것:</strong> Relay availability,
              애플리케이션의 round 선택 공정성이나 무중단 제공을 보장하지
              않습니다.
            </p>
          </CitationBlock>
        </div>
      </section>

      <section id="verification" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            02 · 받은 bytes를 믿지 않기
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Relay가 준 randomness를 왜 클라이언트가 다시 계산해야 할까요?
          </h2>
        </header>
        <p>
          Relay는 전달자일 뿐 신뢰 기준이 아닙니다. 클라이언트는 미리 신뢰한
          chain hash와 collective public key를 고정합니다. Chain info의 scheme,
          genesis time과 period도 함께 고정해야 round와 message 형식을 정확히
          재구성할 수 있습니다.
        </p>
        <p>
          응답을 받으면 expected round와 received round를 먼저 비교합니다. 이어
          scheme에 맞는 message와 BLS signature를 검증합니다. 마지막으로
          <code>SHA-256(signature)</code>를 직접 계산해 응답의 randomness와
          같은지 확인합니다. V2 relay가 randomness field를 생략하더라도 이 값은
          signature에서 결정적으로 만들 수 있습니다.
        </p>
        <p>
          Chained와 unchained는 message가 다르고, signature가 G1인지 G2인지도
          scheme에 따라 다를 수 있습니다. “BLS니까 같은 검증 함수”라고 처리하면
          안 됩니다. 현재 공식 JavaScript client도 scheme을 판별한 뒤 서로 다른
          message·curve 경로를 사용합니다.
        </p>
        <div id="paper-drand-client">
          <CitationBlock
            source="drand-client beacon verification · commit 0370e7d"
            citeKey={2}
            type="code"
            href={CLIENT_VERIFY}
          >
            <p>
              <strong>문제:</strong> HTTP relay가 돌려준 beacon을 선택 network의
              statement와 비교해야 합니다.
            </p>
            <p>
              <strong>기여:</strong> Expected round, derived randomness,
              chained·unchained message와 여러 BLS scheme의 검증 분기를
              구현합니다.
            </p>
            <p>
              <strong>전제:</strong> Commit 0370e7d의 client와 신뢰한 chain
              hash·public key를 사용합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Beacon bytes의 클라이언트 검증
              경계입니다.
            </p>
            <p>
              <strong>말하지 않는 것:</strong> Relay가 항상 응답하거나 앱이
              round를 공정하게 골랐다는 뜻은 아닙니다.
            </p>
          </CitationBlock>
        </div>
      </section>

      <section id="release" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            03 · 공정하게 소비하기
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            유효한 beacon을 사용해도 추첨이 불공정할 수 있는 때는 언제일까요?
          </h2>
        </header>
        <p>
          운영자가 결과를 본 뒤 round 42와 43 중 마음에 드는 값을 고르면 두
          beacon이 모두 유효해도 추첨은 불공정합니다. 참가 마감 시각 전에 “이
          chain의 round 42를 쓴다”는 규칙을 commit하고, 예상 시각과 허용 지연을
          함께 정해야 합니다.
        </p>
        <p>
          검증 후에는 <code>app-tag ∥ chain-hash ∥ round ∥ signature</code>를
          다시 hash해 용도별 난수를 만듭니다. 추첨, 게임과 위원회 선출이 같은
          beacon을 쓰더라도 tag가 다르면 서로 다른 결과가 됩니다. 영수증에는
          선택 규칙, chain info digest, round, signature, 검증 결과와 소비
          시각을 남깁니다.
        </p>
        <p>
          장애 때는 다른 relay에서 같은 round를 받아 검증할 수 있습니다. 하지만
          미래 round가 아직 없거나 오래된 round만 있을 때 임의 로컬 난수나
          미검증 bytes로 조용히 대체하지 않습니다. 애플리케이션 정책에 따라
          대기하거나 명시적으로 실패해야 합니다.
        </p>
        <div id="paper-drand-source">
          <CitationBlock
            source="drand v2.1.8 · commit e8dd607"
            citeKey={3}
            type="code"
            href={DRAND_SOURCE}
          >
            <p>
              <strong>문제:</strong> DKG·beacon rounds·public API를 실제
              daemon과 protocol types로 연결해야 합니다.
            </p>
            <p>
              <strong>기여:</strong> Official Go source, protobuf와 tests의
              v2.1.8 snapshot을 제공합니다.
            </p>
            <p>
              <strong>전제:</strong> Commit e8dd607과 선택 network의 group·chain
              configuration을 고정합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Daemon과 public beacon API의 구현
              경계입니다.
            </p>
            <p>
              <strong>말하지 않는 것:</strong> 현재 League of Entropy uptime,
              consumer fairness나 고정 latency를 보장하지 않습니다.
            </p>
          </CitationBlock>
        </div>
      </section>
    </article>
  );
}
