import ExplainedFormula from "@/components/ui/explained-formula";
import RewardCompressionViz from "./viz/RewardCompressionViz";

export default function RewardModel() {
  return (
    <section id="reward-model" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Reward model은 상대 선호를 scalar score로 압축한다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Labeler에게 “이 답은 73점”이라고 묻기보다 같은 prompt에 대한 A와 B 중 어느 쪽이 나은지 묻는 편이 판단 기준을 맞추기 쉽다. Reward model은 이
          pairwise preference를 response 하나당 scalar score로 압축한다. 이후 현재 policy가 새로 생성한 응답에도 같은 scorer를 적용한다.
        </p>
        <p className="leading-7">
          이 scorer를 사람 선호를 직접 예측한다는 뜻에서 preference model이라고도 부른다. 별도 구성 요소는 아니고 reward model과 같은 model을 가리키는
          다른 이름이다.
        </p>
      </div>

      <RewardCompressionViz />

      <ExplainedFormula
        question="Pairwise preference를 reward model의 probability와 loss로 어떻게 바꿀까?"
        idea={<>Bradley–Terry model은 두 응답의 절대 score가 아니라 score 차이가 선택 odds를 정한다고 가정합니다. Chosen의 score가 커질수록 sigmoid probability가 1에 가까워지도록 negative log-likelihood를 최소화합니다.</>}
        formula={String.raw`\begin{aligned}\Delta r&=r_\phi(x,y_+)-r_\phi(x,y_-)\\P(y_+\succ y_-)&=\sigma(\Delta r)\\\ell_{RM}&=-\log\sigma(\Delta r)\\\mathcal L_{RM}&=\mathbb E_{\mathcal D}[\ell_{RM}]\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
\Delta r
 &=\underbrace{r_\phi(x,y_+)}_{\text{chosen 점수}}
  -\underbrace{r_\phi(x,y_-)}_{\text{rejected 점수}}\\
p_+
 &=\underbrace{\sigma(\Delta r)}_{\text{점수 차이를 선택 확률로}}\\
\ell_{RM}
 &=\underbrace{-\log p_+}_{\text{chosen 확률이 낮을수록 큰 벌점}}\\
\mathcal L_{RM}
 &=\underbrace{\mathbb E_{\mathcal D}[\ell_{RM}]}_{\text{수집한 모든 pair에서 평균}}
\end{aligned}`}
        operations={[
          { expression: String.raw`r_\phi(x,y_+)-r_\phi(x,y_-)`, annotation: ["절대 점수 원점을 없애고", "두 response의 상대 순서만 남김"] },
          { expression: String.raw`\sigma(\Delta r)`, annotation: ["무한 범위 score gap을", "0~1 pairwise probability로 변환"] },
          { expression: String.raw`-\log p_+`, annotation: ["chosen probability가 0에 가까운", "틀린 ranking을 크게 벌점"] },
          { expression: String.raw`\mathbb E_{\mathcal D}`, annotation: ["한 pair가 아니라", "dataset의 평균 ordering을 학습"] },
        ]}
        terms={[
          { symbol: "x", name: "prompt", description: "두 response가 공유하는 조건입니다." },
          { symbol: "y_+,y_-", name: "chosen·rejected", description: "Labeler가 더 낫다고 고른 응답과 비교 대상입니다." },
          { symbol: "r_\\phi(x,y)", name: "scalar reward", description: "Parameter φ를 가진 model이 response 전체에 부여한 score입니다." },
          { symbol: String.raw`\sigma`, name: "logistic sigmoid", description: "Score 차이를 0과 1 사이의 pairwise probability로 바꿉니다." },
        ]}
        assumptions={["Preference가 score 차이로 설명된다는 Bradley–Terry 가정을 사용합니다.", "같은 prompt 안에서 더한 상수는 score 차이에서 사라지므로 reward의 절대 원점은 식별되지 않습니다."]}
        interpretation="Loss가 낮아졌다는 것은 수집한 pair ordering을 더 잘 설명한다는 뜻입니다. 도움됨·사실성·안전성이 각각 보존되거나 dataset 밖의 응답까지 정확히 평가한다는 보장은 아닙니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Scalar reward가 숨기는 것</h3>
        <p>
          도움됨, 사실성, style과 safety를 한 숫자로 합치면 서로 다른 failure mode가 같은 score에 묻힐 수 있다. Response 순서, 길이와
          formatting처럼 정답과 우연히 함께 나타난 feature도 reward shortcut이 된다. 그래서 response 순서를 무작위화하고 annotator 간
          agreement를 확인한다. category별 held-out set에서는 reward accuracy를 따로 본다.
        </p>
        <p>
          Reward hacking은 optimization이 실제 품질보다 reward model의 빈틈을 더 빠르게 찾는 현상이다. Training pair에서 accuracy가
          높더라도 policy가 distribution 밖의 response를 생성하기 시작하면 scorer가 extrapolation을 잘한다는 보장이 없다. 현재 policy
          sample을 사람이 다시 살피고 reward margin과 independent quality metric이 함께 오르는지 확인해야 한다.
        </p>
      </div>
    </section>
  );
}
