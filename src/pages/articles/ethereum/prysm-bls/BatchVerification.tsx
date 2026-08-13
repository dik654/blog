import ExplainedFormula from "@/components/ui/explained-formula";
import type { CodeRef } from "@/components/code/types";

export default function BatchVerification({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="batch-verification" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Batch verification은 여러 판정을 묶어 계산하지만 어느 입력이 틀렸는지는
        자동으로 알려주지 않는다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Aggregate는 protocol이 의도한 여러 signature를 하나의 signature로
          표현하는 기능이고, batch verification은 서로 독립된 verification
          equation을 더 적은 pairing work로 함께 검사하는 구현 최적화입니다.
          Batch 실패 뒤 모든 message를 reject할지, batch를 나눠 invalid item을
          찾을지는 latency·CPU·peer penalty 정책까지 포함한 별도 선택입니다.
        </p>
      </div>

      <ExplainedFormula
        question="독립된 N개 검증식을 한 식으로 묶을 때 왜 무작위 계수가 필요할까요?"
        idea={
          <>
            각 식에 verifier가 새로 뽑은 nonzero scalar rᵢ를 곱해 합칩니다.
            공격자가 서로의 오류를 정확히 상쇄하는 batch를 미리 만들기 어렵게
            합니다.
          </>
        }
        formula={String.raw`e\!\left(G_1,\sum_{i=1}^{N}r_i\sigma_i\right)=\prod_{i=1}^{N}e\!\left(r_iPK_i,H(m_i)\right)`}
        terms={[
          {
            symbol: "N",
            name: "Batch size",
            description:
              "이번 검증 호출에 묶인 독립 signature equation 수입니다.",
          },
          {
            symbol: "r_i",
            name: "Random coefficient",
            description:
              "각 item에 독립적으로 배정하는 nonzero challenge scalar입니다.",
          },
          {
            symbol: "PK_i,m_i,\sigma_i",
            name: "Verification tuple",
            description:
              "Public key, 정확한 signing-root bytes, signature입니다.",
          },
        ]}
        assumptions={[
          "Random coefficient는 공격자가 input을 고른 뒤 예측할 수 없게 생성합니다.",
          "각 point와 message/domain은 개별 API 전제 검사를 통과합니다.",
          "Library가 제공하는 batch 알고리즘과 failure probability 범위를 고정된 version에서 확인합니다.",
        ]}
        interpretation="Batch PASS는 포함된 모든 equation을 높은 확률로 함께 받아들일 근거입니다. Batch FAIL만으로 어느 item이 invalid인지 알 수 없으며, 고정 계수나 재사용 계수는 상쇄 공격 경계를 약하게 만들 수 있습니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Failure isolation은 queue 정책의 일부입니다</h3>
        <p>
          64개 batch가 실패했을 때 개별 64개를 모두 다시 검증하면 정상 경로의
          이득이 공격 입력에서 사라집니다. 반으로 나누는 binary isolation은
          invalid item이 적을 때 재검증 수를 줄이지만, deadline을 넘긴 stale
          attestation은 찾기 전에 폐기하는 편이 낫습니다. Queue에는 object root,
          peer, arrival/deadline, fork/domain, batch ID와 fallback 결과를
          남깁니다.
        </p>
        <h3>Release gate</h3>
        <p>
          Valid, malformed point, wrong subgroup, wrong domain, duplicate key,
          same-message, distinct-message와 rogue-key fixture를 base와
          candidate에 동일하게 넣습니다. Accept/reject parity와 no-crash·bounded
          allocation을 hard gate로 통과한 뒤 signatures/s, p50/p99, queue wait,
          CPU cycles, fallback rate와 end-to-end missed duty를 비교합니다.
          Microbenchmark만 빠르고 queue wait가 늘면 production 개선이 아닙니다.
        </p>
        <p>
          Batch size를 키우면 amortization은 좋아지지만 첫 item이 기다리는
          시간이 늘어납니다. Traffic rate가 낮거나 slot deadline이 가까우면 작은
          batch 또는 즉시 단일 검증이 더 낫습니다. 따라서 고정 “최적 batch=64”가
          아니라 queue age와 deadline을 포함한 adaptive policy를 같은
          workload에서 검증합니다.
        </p>
      </div>
    </section>
  );
}
