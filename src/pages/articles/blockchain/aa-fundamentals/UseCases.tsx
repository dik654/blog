import ExplainedFormula from "@/components/ui/explained-formula";
import UseCaseViz from "./viz/UseCaseViz";

export default function UseCases() {
  return (
    <section id="use-cases" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">좋은 AA 기능은 실행 가능한 최소 권한 policy와 복구 절차로 정의합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Passkey, session key, batch와 gas sponsorship은 편의 기능 목록이 아닙니다. 각 기능은 signer·target·function selector·value·validity window·nonce domain·budget처럼
          검증 가능한 조건으로 내려가야 합니다. Alice 사례의 session key는 “30분 동안 Router의 <code>swap</code>만, 누적 100 USDC까지”로 제한하며,
          <code>approve</code>나 wallet upgrade·ETH transfer는 거절해야 합니다.
        </p>
      </div>
      <UseCaseViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Passkey는 signer 교체이지 authorization 설계 전체가 아닙니다</h3>
        <p>
          WebAuthn credential은 P-256 signature, relying-party와 origin 정보를 제공합니다. Smart account는 challenge가 정확한 UserOperation domain에 결속됐는지,
          authenticator flags와 public-key rotation을 어떻게 처리할지 정해야 합니다. Biometric UI가 있었다는 사실만으로 transaction intent가 맞았다고 결론내리지 않습니다.
        </p>

        <h3>Batch는 atomicity와 least privilege를 따로 검사합니다</h3>
        <p>
          <code>approve</code>와 <code>swap</code>을 묶어 두 call이 함께 성공하거나 함께 revert하도록 만들 수 있습니다. 하지만 악성 target을 함께 넣었거나 무제한 allowance를 승인했다면 atomic batch도 안전하지 않습니다.
          Call별 target·selector·value allowlist와 전체 batch budget을 모두 검증하고, 실패한 call index와 revert data를 receipt에 남깁니다.
        </p>

        <h3>Recovery는 threshold만이 아니라 delay·cancel·rotation을 포함합니다</h3>
        <p>
          3명 중 2명 guardian이 새 owner를 제안하더라도 즉시 바꾸지 않고 timelock 동안 기존 owner의 cancel과 emergency freeze를 허용할 수 있습니다. Guardian 교체 자체도 같은 quorum을 요구하고,
          compromised guardian과 lost owner가 동시에 생기는 반례를 훈련해야 합니다. Recovery 성공 뒤에는 session key·module·paymaster allowance를 rotate하거나 revoke합니다.
        </p>
      </div>

      <ExplainedFormula
        question="3명 guardian 중 2명 threshold에서 몇 개의 guardian 조합이 recovery를 승인할 수 있을까요?"
        idea="순서와 무관하게 threshold만큼 고르는 조합 수를 셉니다. 조합 수가 많다는 것은 availability가 높다는 뜻이지만, guardian 독립성이 없으면 실제 안전성은 그만큼 늘지 않습니다."
        formula={String.raw`N_{paths}=\binom{n}{t}=\frac{n!}{t!(n-t)!}`}
        terms={[
          { symbol: "n", name: "Guardians", description: "등록한 서로 구분되는 guardian 수입니다." },
          { symbol: "t", name: "Threshold", description: "Recovery proposal에 필요한 동의 수입니다." },
          { symbol: "N_{paths}", name: "Approval paths", description: "순서를 무시한 최소 승인 조합 수입니다." },
        ]}
        assumptions={[
          "각 guardian이 서로 독립적인 운영·key·failure domain을 가진다는 보장은 별도입니다.",
          "조합 계산은 timelock·veto·social engineering·guardian rotation을 포함하지 않습니다.",
          "n=3,t=2 사례에서 2개 미만의 서명은 항상 거절한다고 가정합니다.",
        ]}
        interpretation="3명 중 2명이면 AB, AC, BC의 3가지 경로가 있습니다. 세 guardian가 같은 cloud account에 묶였다면 수학상 3경로여도 실제 common-mode failure는 하나일 수 있습니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Release gate는 happy path보다 실패 경계를 먼저 비교합니다</h3>
        <p>
          Candidate wallet을 내보내기 전에 wrong chain·replayed nonce·expired session·disallowed selector·paymaster budget exhaustion·bundler timeout-after-submit·guardian conflict·delegate upgrade를
          base와 candidate에 같은 fixture로 재생합니다. Authorization·admission·execution·settlement outcome이 같아야 latency와 gas를 비교하며,
          canary에서는 EntryPoint/delegate/module version과 rollback bundle을 함께 고정합니다.
        </p>
      </div>
    </section>
  );
}
