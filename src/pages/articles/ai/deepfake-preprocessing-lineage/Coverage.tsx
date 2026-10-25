import ExplainedFormula from "@/components/ui/explained-formula";
import CoverageViz from "./viz/CoverageViz";

export default function Coverage() {
  return (
    <section id="coverage" data-teach-level="5" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">성공 수를 처음 정한 시각 수로 나눕니다</h2>
      <CoverageViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          단계가 진행될 때마다 분모를 성공한 항목 수로 바꾸면 모든 단계가 100%처럼 보입니다.
          이 사례에서는 처음 정한 열 개 시각을 끝까지 분모로 사용합니다. 얼굴 위치 coverage는
          0.80, 동일 인물 track coverage는 0.70, detector 입력 coverage는 0.60입니다.
        </p>
        <p>
          Detector의 정확도는 여섯 crop에서 계산할 수 있지만, 그 값만으로 원본 영상 전체를
          잘 읽었다고 말할 수는 없습니다. 입력 coverage와 단계별 실패 수를 함께 보아야
          평가에서 사라진 네 시각의 영향을 판단할 수 있습니다.
        </p>
      </div>
      <ExplainedFormula
        question="전처리 단계가 실제로 읽은 원본 시각의 비율을 어떻게 계산할까요?"
        idea={<>처음 선언한 평가 시각 수 T를 공통 분모로 고정하고, 단계 s를 통과한 시각만 indicator 1로 더합니다.</>}
        formula={String.raw`C_s=\frac{1}{T}\sum_{t=1}^{T}I_{s,t}`}
        annotatedFormula={String.raw`\begin{aligned}
I_{s,t}&=\underbrace{\mathbf 1[\text{시각 }t\text{가 단계 }s\text{를 통과}]}_{\text{성공 1, 실패·미실행 0}},\\
C_{\rm face}&=\underbrace{8/10}_{\text{얼굴 위치를 찾은 시각}}=0.80,\\
C_{\rm track}&=\underbrace{7/10}_{\text{person-C로 이어진 시각}}=0.70,\\
C_{\rm input}&=\underbrace{6/10}_{\text{detector에 도달한 시각}}=0.60.
\end{aligned}`}
        operations={[
          { expression: String.raw`T=10`, annotation: ["00:00부터 00:09까지 평가 시각을 먼저 선언", "뒤 단계 실패 뒤에도 분모를 10으로 유지"] },
          { expression: String.raw`\sum_t I_{s,t}`, annotation: ["각 단계의 성공 상태만 1로 합산", "NO_FACE·TRACK_SWITCH·TOO_SMALL과 not-run은 0"] },
          { expression: String.raw`C_s=N_s/T`, annotation: ["얼굴 위치 8÷10=.80", "인물 추적 7÷10=.70", "최종 입력 6÷10=.60"] },
        ]}
        terms={[
          { symbol: "T", name: "처음 정한 평가 시각 수", description: "전처리를 실행하기 전에 고정한 원본 시간축의 분모입니다." },
          { symbol: "s", name: "전처리 단계", description: "Decode·얼굴 위치·인물 추적·유효 crop 중 하나입니다." },
          { symbol: "Iₛ,ₜ", name: "단계 통과 표시", description: "시각 t가 단계 s를 통과하면 1, 아니면 0입니다." },
          { symbol: "Cₛ", name: "단계별 coverage", description: "원본 시간축 중 해당 단계가 보존한 비율입니다." },
        ]}
        assumptions={[
          "모든 후보 전처리에서 같은 원본 시각 열 개를 평가합니다.",
          "얼굴 위치·인물 추적·crop 유효성 규칙을 결과를 보기 전에 고정합니다.",
          "Coverage가 낮은 영상을 평가 목록에서 삭제하지 않습니다.",
        ]}
        interpretation="최종 입력 coverage 0.60은 detector가 원본 시각 열 개 중 여섯 개만 보았다는 뜻입니다. 이 값은 detector의 정답률과 다른 지표이며 둘을 함께 보고합니다."
      />
    </section>
  );
}
