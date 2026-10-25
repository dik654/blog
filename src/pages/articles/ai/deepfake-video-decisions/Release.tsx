import ExplainedFormula from "@/components/ui/explained-formula";
import { DeepfakeMapReturn } from "../deepfake-detection/DeepfakePathLocator";
import ReleaseGateViz from "./viz/ReleaseGateViz";

export default function Release() {
  return (
    <section id="release" data-teach-level="7" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">점수 문턱을 넘더라도 증거가 부족하면 멈춥니다</h2>
      <ReleaseGateViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          상위 두 개 평균 0.79를 별도 검증 자료에서 맞춘 함수에 넣어 0.72가 되었다고
          가정하겠습니다. 점수 임계값 0.70은 넘지만, 열 개 후보 중 유효 입력은 여섯 개라
          coverage가 0.60입니다. 최소 coverage 0.70을 만족하지 못합니다.
        </p>
        <p>
          이때 0.72만 보고 조작 영상이라고 내보내면 모델이 보지 못한 네 시각을 숨기게
          됩니다. 최종 행동은 진짜나 조작이 아니라 <strong>증거 부족</strong>입니다. 운영
          시스템은 이 상태를 재처리·사람 검토·추가 영상 요청처럼 별도 경로로 보낼 수
          있지만, 그 선택은 이 개념 글의 범위를 벗어납니다.
        </p>
      </div>
      <ExplainedFormula
        question="clip-042가 점수 문턱을 넘고도 진위 판정을 내지 않는 이유는 무엇인가요?"
        idea={<>점수와 증거량을 따로 계산합니다. 점수 조건만 통과하고 coverage 조건이 실패하면 증거 부족 상태가 우선합니다.</>}
        formula={String.raw`C=6/10=0.60<0.70=C_{\min}`}
        annotatedFormula={String.raw`\begin{aligned}
C&=\underbrace{6/10}_{\text{유효 입력 수}/\text{평가 후보 수}}=0.60,\\
\widehat p&=\underbrace{0.72}_{\text{집계 뒤 보정값}}\ge\underbrace{0.70}_{\text{점수 임계값}},\\
C&=0.60<\underbrace{0.70}_{\text{최소 coverage}}=C_{\min}.
\end{aligned}`}
        operations={[
          { expression: String.raw`6/10`, annotation: ["유효 crop 6개를 후보 시각 10개로 나눔", "coverage 0.60"] },
          { expression: String.raw`0.72\ge0.70`, annotation: ["보정값이 점수 임계값을 넘음", "점수 경로는 통과"] },
          { expression: String.raw`0.60<0.70`, annotation: ["실제 coverage가 최소값보다 작음", "최종 상태는 증거 부족"] },
        ]}
        terms={[
          { symbol: "C", name: "실제 coverage", description: "평가 후보 중 모델 입력까지 도달한 비율입니다." },
          { symbol: "p̂", name: "보정값", description: "고정한 집계 뒤 검증 자료에서 다시 맞춘 값입니다." },
          { symbol: "Cmin", name: "최소 coverage", description: "진위 판정을 내보내기 위해 미리 정한 증거량 문턱입니다." },
        ]}
        assumptions={[
          "보정 함수와 두 임계값은 별도 검증 자료에서 시험 결과를 보기 전에 정합니다.",
          "실패한 네 시각을 0점으로 채우지 않고 coverage 실패로 남깁니다.",
          "본문 수치는 판정 순서를 보여 주는 설명용 가정입니다.",
        ]}
        interpretation="보정값 0.72는 점수 임계값을 넘지만 coverage 0.60이 최소값 0.70보다 작습니다. 이 영상의 최종 상태는 진위가 아니라 증거 부족입니다."
      />
      <DeepfakeMapReturn current="video-decisions" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>같은 사례로 확인해 보세요</h3>
        <ol>
          <li>여섯 점수의 전체 평균·최댓값·상위 두 개 평균은 각각 얼마인가요? (답: 2절)</li>
          <li>두 모델의 보정 계수를 강제로 같게 쓰지 않고도 공정하게 비교할 수 있는 이유는 무엇인가요? (답: 3절)</li>
          <li>보정값 0.72가 임계값 0.70을 넘었는데도 최종 상태가 증거 부족인 이유는 무엇인가요? (답: 4절)</li>
        </ol>
      </div>
    </section>
  );
}
