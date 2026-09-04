import ExplainedFormula from "@/components/ui/explained-formula";
import FaultyThresholdViz from "./viz/FaultyThresholdViz";

export default function FaultyThreshold() {
  return (
    <section id="faulty-threshold" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        3f+1과 2f+1은 honest signer가 겹치게 하는 산술이다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Equal-weight partial-synchrony BFT의 대표 설정은 전체 replica 수 <code>n=3f+1</code>,
          Byzantine fault bound <code>f</code>, quorum size <code>q=2f+1</code>입니다. 두 quorum의
          최소 교집합은 <code>2q-n=f+1</code>이고 Byzantine은 최대 f명이므로 교집합에 honest
          replica가 적어도 한 명 있습니다.
        </p>
      </div>
      <FaultyThresholdViz />
      <ExplainedFormula
        question="두 quorum이 왜 honest signer 한 명 이상을 공유할까?"
        idea="두 집합의 크기 합에서 전체 membership을 빼면 최소 교집합이 나옵니다. 이 값이 fault bound보다 커야 겹친 signer를 전부 Byzantine으로 채울 수 없습니다."
        formula={String.raw`\begin{aligned}
          n&=3f+1,\qquad q=2f+1\\
          |Q_1\cap Q_2|&\ge 2q-n=f+1>f
        \end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
          n&=\underbrace{3f+1,\qquad q=2f+1}_{\text{replicas 계산}}\\
          |Q_1\cap Q_2|&\ge 2q-n=\underbrace{f+1>f}_{\text{허용 경계 판정}}
        \end{aligned}`}
        operations={[
          { expression: String.raw`3f+1,\qquad q=2f+1`, annotation: ["replicas이(가) 식의 결과에 기여하는 방식을","계산합니다.","두 집합의 크기 합에서 전체 membership을 빼면 최소","교집합이 나옵니다."] },
          { expression: String.raw`f+1>f`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","두 집합의 크기 합에서 전체 membership을 빼면 최소","교집합이 나옵니다."] },
        ]}
        terms={[
          { symbol: "n", name: "replicas", description: "Equal-weight fixed membership의 전체 replica 수입니다." },
          { symbol: "f", name: "fault bound", description: "Protocol이 허용하는 최대 Byzantine replica 수입니다." },
          { symbol: "q", name: "quorum", description: "해당 phase certificate를 만드는 distinct valid signer 수입니다." },
          { symbol: String.raw`Q_1,Q_2`, name: "certificates", description: "서로 충돌할 수 있는 두 phase certificate의 signer set입니다." },
        ]}
        assumptions={[
          "모든 replica weight가 같고 membership과 f가 해당 instance에서 고정돼 있습니다.",
          "Honest replica는 protocol이 금지한 conflicting phase·lock vote에 서명하지 않습니다.",
        ]}
        interpretation="f=1이면 n=4, q=3이고 두 quorum은 최소 2명 겹칩니다. Fault는 한 명뿐이므로 겹친 두 signer 중 적어도 한 명은 honest합니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>산술은 protocol rule과 결합될 때 safety proof가 됩니다</h3>
        <p>
          Honest overlap이 있어도 honest replica가 phase·height를 구분하지 않거나 lock 없이 conflicting vote를 허용하면 두
          certificate가 생길 수 있습니다. Signature set은 signer uniqueness, membership, message domain,
          phase·view·height, value digest를 검증해야 합니다. Duplicate signature는 weight 한 번으로만 셉니다.
        </p>
        <h3>Weighted stake는 사람 수 대신 weight 합을 계산합니다</h3>
        <p>
          Stake-weighted protocol은 signer count가 아니라 total voting weight와 fault-weight bound를 사용합니다. 100개 key
          중 한 운영자가 40% weight를 갖는다면 key 수가 분산돼 보여도 fault concentration은 40%입니다. 서로 다른 node가 threshold를 다르게
          계산하지 않으려면 rounding·membership update·epoch boundary와 quorum certificate의 weight snapshot을 versioned
          receipt로 고정해야 합니다.
        </p>
      </div>
    </section>
  );
}
