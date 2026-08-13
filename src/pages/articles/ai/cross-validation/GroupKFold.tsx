import ExplainedFormula from "@/components/ui/explained-formula";
import GroupKFoldViz from "./viz/GroupKFoldViz";

export default function GroupKFold() {
  return (
    <section id="group" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        같은 원인에서 나온 여러 행은 행 수가 많아도 하나의 독립 단위처럼 다뤄야 합니다
      </h2>
      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          한 사용자, 환자, 장비, 문서 또는 원본 영상에서 여러 행이 파생됐다면 그 행들은 서로 비슷합니다. 같은 entity가
          train과 validation에 동시에 들어가면 모델은 일반적인 target pattern 대신 entity fingerprint를 기억해 높은 점수를 낼
          수 있습니다. Group split은 한 group의 모든 행을 한쪽에만 배치해 이 지름길을 막습니다.
        </p>
        <p>
          Group key는 database ID 하나로 끝나지 않을 수 있습니다. 같은 원본에서 만든 crop·augmentation, 한 household의 여러
          사용자, 같은 병원·공장·수집 batch처럼 더 위의 공유 원인이 배포에서 새로 나타난다면 그 상위 ID로 묶어야 합니다.
        </p>
      </div>

      <ExplainedFormula
        question="Group split이 지켜야 할 최소 무결성 조건과 실제 독립 단위 수는 무엇일까요?"
        idea={
          <>
            각 fold의 train과 validation group 집합은 겹치면 안 됩니다. 행이 10만 개여도 독립 group이 20개라면 group shift에
            대한 근거 단위는 20개에 가깝고, 10만 개를 독립 표본처럼 해석하면 불확실성을 과소평가합니다.
          </>
        }
        formula={String.raw`G(D_{-k})\cap G(V_k)=\varnothing,\qquad n_{\mathrm{unit}}=\left|G(D)\right|`}
        terms={[
          { symbol: "G(S)", name: "groups in set S", description: "행 집합 S에 포함된 고유 entity·site·source group ID 집합입니다." },
          { symbol: "D_-k", name: "fold-k training rows", description: "k번째 model을 fit하는 행들입니다." },
          { symbol: "V_k", name: "fold-k validation rows", description: "k번째 model이 보지 않고 평가하는 행들입니다." },
          { symbol: "n_unit", name: "independent-unit count", description: "평가 질문에서 독립에 가깝다고 보는 group의 개수입니다." },
        ]}
        assumptions={[
          "Group ID가 실제 공유 원인을 충분히 포착해야 합니다. 잘못된 ID는 교집합이 비어도 leakage를 남깁니다.",
          "Group들이 서로 완전히 독립이라는 보장은 아니며 site·time 같은 상위 dependency가 남을 수 있습니다.",
          "Class 균형보다 group disjointness가 우선이며 불가능한 label 조합은 fold report에 그대로 드러냅니다.",
        ]}
        interpretation="환자 20명에게서 각각 5,000개 patch를 만들었다면 행은 10만 개지만 새 환자 일반화의 핵심 반복 단위는 20명입니다."
      />

      <div className="not-prose my-8">
        <GroupKFoldViz />
      </div>

      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          Group 크기와 label 분포가 불균형하면 fold 점수의 흔들림이 커질 수 있습니다. Random row split로 돌아가기보다 각 fold의
          group 수·행 수·class 비율·핵심 site coverage를 함께 공개하고, 가능한 경우 stratified group splitter를 사용합니다.
          Group 수가 너무 적다면 CV 숫자를 정밀한 추정치로 포장하지 말고 group별 결과와 leave-one-group-out 민감도를 보여줍니다.
        </p>
      </div>
    </section>
  );
}
