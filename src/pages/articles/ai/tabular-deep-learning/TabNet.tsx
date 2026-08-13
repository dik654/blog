import ExplainedFormula from "@/components/ui/explained-formula";
import TabNetViz from "./viz/TabNetViz";

export default function TabNet() {
  return (
    <section id="tabnet" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">TabNet은 같은 row를 여러 번 보며 step마다 사용할 feature를 고릅니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          대출 심사 row에서 첫 step은 소득과 부채를, 두 번째 step은 연체 이력과
          직업을 집중해서 볼 수 있습니다. 다른 고객에게는 서로 다른 mask가
          만들어지므로, TabNet의 선택은 dataset 전체에 고정된 feature subset이
          아니라 <em>instance-wise</em> selection입니다. 선택된 값은 feature
          transformer를 거쳐 일부는 현재 decision에, 일부는 다음 mask 계산에
          사용됩니다.
        </p>
        <p>
          Attentive transformer의 score에는 이전 step의 사용 이력을 담은 prior가
          곱해지고, sparsemax가 이를 합이 1인 mask로 바꿉니다. Softmax와 달리
          일부 좌표를 정확히 0으로 만들 수 있어 현재 step의 계산 경로가 희소해집니다.
        </p>
      </div>

      <ExplainedFormula
        question="TabNet은 이미 본 feature와 아직 보지 않은 feature를 다음 step의 mask에 어떻게 반영할까?"
        idea={<>직전 step의 context a⁽ˢ⁻¹⁾에서 feature score를 만들고 prior P⁽ˢ⁻¹⁾를 곱한 뒤 sparsemax로 mask를 만듭니다. Mask는 row별 feature 값에 element-wise로 곱해져 현재 step이 읽을 입력을 정합니다.</>}
        formula={String.raw`M^{(s)}=\operatorname{sparsemax}\!\left(P^{(s-1)}\odot h_s(a^{(s-1)})\right),\qquad x^{(s)}=M^{(s)}\odot x`}
        terms={[
          { symbol: "s", name: "decision step", description: "같은 row를 선택하고 처리하는 반복 순서입니다." },
          { symbol: "h_s(a^(s−1))", name: "attentive score", description: "이전 step의 처리 결과에서 현재 feature별 선택 score를 만드는 학습 함수입니다." },
          { symbol: "P^(s−1)", name: "prior scale", description: "앞선 step에서 feature가 사용된 정도를 현재 score에 반영하는 row별 장부입니다." },
          { symbol: "M^(s)", name: "sparse mask", description: "Feature 방향으로 합이 1이며 일부 값은 정확히 0이 될 수 있는 선택 weight입니다." },
          { symbol: "⊙", name: "element-wise product", description: "같은 위치의 feature와 mask weight만 서로 곱합니다." },
        ]}
        assumptions={["Input column 순서와 preprocessing artifact가 고정돼 있습니다.", "Sparsemax mask는 학습된 model과 현재 row에 조건부입니다.", "논문의 prior는 P⁽⁰⁾=1에서 시작하고 relaxation γ가 feature 재사용 정도를 조절합니다."]}
        interpretation="Mask가 0이면 그 feature는 현재 step 입력에서 제거됩니다. 그러나 뒤의 nonlinear block과 correlated feature가 있으므로 mask 숫자를 곧바로 원인 효과로 읽을 수는 없습니다."
      />

      <ExplainedFormula
        question="Relaxation parameter γ는 이미 선택한 feature의 재사용 가능성을 어떻게 바꿀까?"
        idea={<>각 step 뒤에 prior를 (γ−현재 mask)만큼 갱신합니다. γ=1이면 크게 선택한 feature의 다음 prior가 강하게 줄고, γ가 더 크면 여러 step에서 같은 feature를 다시 사용할 여지가 생깁니다.</>}
        formula={String.raw`P^{(s)}=P^{(s-1)}\odot\left(\gamma-M^{(s)}\right),\qquad P^{(0)}=\mathbf 1`}
        terms={[
          { symbol: "γ", name: "relaxation parameter", description: "Feature를 여러 decision step에서 다시 선택할 수 있는 정도를 조절합니다." },
          { symbol: "P^(0)=1", name: "initial prior", description: "첫 step에서는 모든 사용 가능한 feature를 동일한 시작 prior에 둡니다." },
          { symbol: "γ−M^(s)", name: "reuse factor", description: "이번 step에서 크게 선택한 feature의 다음 prior를 상대적으로 낮춥니다." },
        ]}
        assumptions={["γ는 1 이상인 relaxation parameter로 사용합니다.", "Unavailable 또는 masked input은 initial prior에서 별도로 제외할 수 있습니다.", "Step 수와 γ는 서로 영향을 주므로 독립적인 성능 손잡이로 해석하지 않습니다."]}
        interpretation="Prior는 영구적인 feature importance가 아니라 다음 선택을 다양화하는 내부 상태입니다. γ를 키운다고 일반화 성능이 단조롭게 좋아지는 것은 아닙니다."
      />

      <div className="not-prose my-8"><TabNetViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>사전학습과 해석성은 별개의 claim입니다</h3>
        <p>
          원 논문은 일부 column을 가리고 나머지 column으로 복원하는
          self-supervised pretraining도 제안합니다. Unlabeled row가 많고 pretrain과
          downstream population의 schema·분포가 맞을 때 representation을 먼저
          배울 수 있지만, label 없는 data가 많다는 사실만으로 이득이 보장되지는
          않습니다.
        </p>
        <p>
          Mask는 모델이 실제로 사용한 계산 경로의 관찰값이지만 causal effect가
          아닙니다. Feature 하나를 바꿀 때 현실적으로 함께 변해야 하는 column이
          있을 수 있고, correlated proxy가 역할을 대신할 수도 있습니다. 따라서
          mask visualization은 ablation·permutation·domain review를 시작하는
          진단 자료로 사용합니다.
        </p>

        <div id="paper-tabnet" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
          <p className="text-xs font-bold text-primary">논문 읽기 · Sequential attention과 masked pretraining</p>
          <p className="mt-2 text-sm font-semibold">TabNet: Attentive Interpretable Tabular Learning</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Arik과 Pfister는 row별 sparse feature selection을 여러 decision step에 결합하고 masked-column reconstruction을 제안했습니다. 논문 속 정확도와 사전학습 이득은 사용한 dataset·split·hyperparameter 조건의 결과이며, mask가 causal explanation이거나 TabNet이 모든 tabular task의 정답이라는 주장은 아닙니다.</p>
          <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/1908.07442" target="_blank" rel="noreferrer">원 논문의 architecture·mask·실험 범위 보기</a>
        </div>
      </div>
    </section>
  );
}
