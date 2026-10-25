import ExplainedFormula from "@/components/ui/explained-formula";
import { DeepfakeMapReturn } from "../deepfake-detection/DeepfakePathLocator";
import JointErrorViz from "./viz/JointErrorViz";

export default function JointError() {
  return (
    <section id="joint-error" data-teach-level="7" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">같은 샘플에서 함께 틀린 두 개를 찾습니다</h2>
      <JointErrorViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          설명용 시험 자료 열 개에서 RGB 분기는 S02·S06·S09를 틀렸고, 주파수 분기는
          S02·S04·S06·S10을 틀렸습니다. 오류 수만 보면 각각 3개와 4개지만, 두 분기가 함께
          틀린 샘플은 S02와 S06 두 개입니다. RGB만 틀린 것은 한 개, 주파수만 틀린 것은
          두 개입니다.
        </p>
        <p>
          공동 오류율 0.20이 각 분기의 오류율 0.30·0.40보다 작으므로 오류가 완전히
          겹치지는 않습니다. 다만 두 점수를 합쳤을 때 어느 오류가 실제로 고쳐지는지는
          fusion 규칙과 threshold를 적용한 뒤 다시 측정해야 합니다. 공동 오류가 작다는
          사실만으로 정확도 개선이나 지연 비용을 확정하지 않습니다.
        </p>
      </div>
      <ExplainedFormula
        question="두 분기가 같은 샘플에서 동시에 틀린 비율은 어떻게 계산할까요?"
        idea={<>샘플마다 각 분기의 오류를 0 또는 1로 표시하고 두 값을 곱합니다. 둘 다 틀린 샘플만 곱이 1입니다.</>}
        formula={String.raw`Q_{\rm joint}=N^{-1}\sum_{i=1}^{N}e_i^{\rm rgb}e_i^{\rm freq}=2/10=0.20`}
        annotatedFormula={String.raw`\begin{aligned}
N&=\underbrace{10}_{\text{같은 held-out 샘플 수}},\\
E_{\rm rgb}&=\underbrace{\{S02,S06,S09\}}_{3\text{개 오류}},\\
E_{\rm freq}&=\underbrace{\{S02,S04,S06,S10\}}_{4\text{개 오류}},\\
E_{\rm rgb}\cap E_{\rm freq}&=\underbrace{\{S02,S06\}}_{2\text{개 공동 오류}},\\
Q_{\rm joint}&=\underbrace{2/10}_{\text{공동 오류 수}/\text{같은 분모}}=0.20.
\end{aligned}`}
        operations={[
          { expression: String.raw`E_{\rm rgb}`, annotation: ["RGB 분기의 오류 sample ID를 기록", "S02·S06·S09 세 개"] },
          { expression: String.raw`E_{\rm rgb}\cap E_{\rm freq}`, annotation: ["두 오류 집합에서 같은 ID만 남김", "S02·S06 두 개"] },
          { expression: String.raw`2/10`, annotation: ["공동 오류 수 2를 같은 시험 샘플 10으로 나눔", "공동 오류율 0.20"] },
        ]}
        terms={[
          { symbol: "eᵢ(RGB)", name: "RGB 오류 표시", description: "RGB 분기가 샘플 i를 틀리면 1, 맞히면 0입니다." },
          { symbol: "eᵢ(freq)", name: "주파수 오류 표시", description: "같은 샘플에서 주파수 분기가 틀리면 1입니다." },
          { symbol: "Qjoint", name: "공동 오류율", description: "두 분기가 동시에 틀린 샘플의 비율입니다." },
        ]}
        assumptions={[
          "두 분기는 같은 원본 묶음과 같은 열 개 held-out 샘플을 봅니다.",
          "정답 label과 sample ID, threshold를 분기 사이에서 맞춥니다.",
          "수치는 오류 집합 계산을 보여 주기 위한 설명용 가정입니다.",
        ]}
        interpretation="RGB 오류율은 0.30, 주파수 오류율은 0.40, 공동 오류율은 0.20입니다. 서로 다른 오류가 있다는 뜻이지만 결합 모델의 성능을 대신하지는 않습니다."
      />
      <DeepfakeMapReturn current="frequency-evidence" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>같은 사례로 확인해 보세요</h3>
        <ol>
          <li>여덟 칸의 <code>+1, −1</code> 반복이 k=4에서 8이 되는 이유는 무엇인가요? (답: 2절)</li>
          <li>생성기 A의 원본 peak 0.84만으로 보편 단서라고 말할 수 없는 이유는 무엇인가요? (답: 3절)</li>
          <li>RGB 오류 3개와 주파수 오류 4개 중 공동 오류가 2개라면 공동 오류율은 얼마인가요? (답: 4절)</li>
        </ol>
      </div>
    </section>
  );
}
