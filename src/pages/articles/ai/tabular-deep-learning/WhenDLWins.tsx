import ExplainedFormula from "@/components/ui/explained-formula";
import WhenDLWinsViz from "./viz/WhenDLWinsViz";

export default function WhenDLWins() {
  return (
    <section id="when-dl-wins" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">딥러닝 선택은 row 수 임계값이 아니라 추가로 배울 구조로 판단합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          “10만 row 이상이면 딥러닝” 같은 경계는 dataset과 validation budget이
          바뀌면 유지되지 않습니다. 중간 규모의 전형적인 표에서는 GBDT가
          irregular decision boundary와 중요하지 않은 feature에 강한 baseline인
          경우가 많고, neural model은 optimization과 preprocessing에 더 민감할
          수 있습니다.
        </p>
        <p>
          반대로 stable vocabulary의 고 cardinality category에서 embedding을
          재사용하거나, image·text·event sequence와 end-to-end로 결합하거나,
          같은 schema의 많은 unlabeled row로 pretraining할 수 있다면 neural
          representation을 시험할 이유가 생깁니다. 다만 후보가 생겼다는 뜻이지
          승리가 확정됐다는 뜻은 아닙니다.
        </p>
      </div>

      <div className="not-prose my-8"><WhenDLWinsViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>선택 순서</h3>
        <ol>
          <li>CatBoost·LightGBM과 simple MLP/ResNet으로 비용 대비 baseline을 만듭니다.</li>
          <li>Embedding·attention·pretraining이 해결할 구체적인 representation 병목을 적습니다.</li>
          <li>동일 fold·trial budget에서 여러 seed, worst group과 calibration을 비교합니다.</li>
          <li>Training cost, peak memory, latency와 train-serving preprocessing도 판정에 넣습니다.</li>
        </ol>
        <p>
          GBDT와 neural model의 error가 실제로 다를 때는 ensemble이 이득일 수
          있습니다. 그러나 평균 점수 두 개만 보고 고정 비율 blending을 적용하면
          같은 row에서 함께 틀리는 모델을 중복 운영할 수 있습니다.
        </p>
      </div>

      <ExplainedFormula
        question="두 모델의 평균 점수 외에 ensemble 가치가 있는지 무엇을 확인할까?"
        idea={<>Validation row마다 prediction error를 기록하고 두 error vector의 correlation을 봅니다. 같은 방향으로 함께 틀리면 평균을 내도 오류가 잘 상쇄되지 않고, 상관이 낮거나 음수면 서로 보완할 가능성이 있습니다.</>}
        formula={String.raw`\begin{aligned}
e_{m,i}&=y_i-\hat y_{m,i},\\
\rho_{e_A,e_B}
&=\frac{\operatorname{Cov}(e_A,e_B)}{\sigma_{e_A}\sigma_{e_B}}.
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
e_{m,i}&=\underbrace{y_i-\hat y_{m,i},}_{\text{오른쪽 항으로 결과 계산}}\\
\rho_{e_A,e_B}
&=\underbrace{\frac{\operatorname{Cov}(e_A,e_B)}{\sigma_{e_A}\sigma_{e_B}}.}_{\text{lag별 공분산}}
\end{aligned}`}
        operations={[
          { expression: String.raw`y_i-\hat y_{m,i},`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","Validation row마다"] },
          { expression: String.raw`\frac{\operatorname{Cov}(e_A,e_B)}{\sigma_{e_A}\sigma_{e_B}}.`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Validation row마다"] },
        ]}
        terms={[
          { symbol: "e_m,i", name: "out-of-fold error", description: "Model m이 해당 row를 training에 보지 않은 상태에서 만든 prediction error입니다." },
          { symbol: "Cov", name: "error covariance", description: "두 모델의 error가 같은 row에서 함께 움직이는 정도입니다." },
          { symbol: "σ_e", name: "error standard deviation", description: "각 model error의 scale을 표준화해 correlation을 −1과 1 사이로 만듭니다." },
          { symbol: "ρ", name: "error correlation", description: "1에 가까울수록 같은 방향의 error가 반복된다는 진단값입니다." },
        ]}
        assumptions={["두 error vector는 같은 untouched out-of-fold rows와 같은 target 단위에서 계산합니다.", "Regression error correlation만으로 classification ranking·calibration의 ensemble gain을 모두 판정하지 않습니다.", "Blend weight는 별도 validation에서 선택하고 최종 test는 마지막까지 보존합니다."]}
        interpretation="낮은 error correlation은 ensemble 후보를 찾는 신호이지 성능 보장이 아닙니다. 실제 blend gain과 두 배가 될 수 있는 latency·memory·monitoring 비용을 함께 측정합니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          TabPFN 같은 pretrained tabular model도 별도의 비교 후보일 뿐 모든 작은
          dataset의 자동 정답은 아닙니다. 최종 선택은 동일한 entity·time split,
          feature artifact, tuning trial 또는 wall-clock, hardware, metric으로 만든
          표에서 이루어져야 합니다. 평균과 seed 분산, worst group, calibration,
          peak memory, single-row·batch latency를 함께 남기면 구조 이름이 아니라
          재현 가능한 증거로 선택할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
