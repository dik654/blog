import ExplainedFormula from "@/components/ui/explained-formula";
import BaselineViz from "./viz/BaselineViz";

export default function Baseline() {
  return (
    <section id="baseline" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Baseline은 작은 모델이 아니라 원본 입력부터 OOF 예측과 제출까지 이어지는 첫 번째 완성품입니다
      </h2>
      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          먼저 평균·빈도·직전 값처럼 학습이 거의 필요 없는 naive predictor로 metric 방향, label mapping과 제출 row order를
          확인합니다. 그다음 작은 모델을 넣되 preprocessing, split, seed, metric, inference와 submission schema를 하나의
          명령에서 실행합니다. 복잡한 feature와 ensemble은 이 경로가 재현된 뒤 추가합니다.
        </p>
        <p>
          K-fold에서 OOF(out-of-fold) prediction은 각 train 행이 자신을 학습에 쓰지 않은 fold model에게서 받은 예측입니다.
          모든 행을 정확히 한 번 덮으면 같은 행 집합에서 후보별 오류를 짝지어 비교할 수 있습니다.
        </p>
      </div>

      <ExplainedFormula
        question="OOF prediction이 모든 train 행을 빠짐없이, 중복 없이 덮었는지 어떻게 확인할까요?"
        idea={
          <>
            Fold k의 validation index를 V_k라고 두고 각 행이 validation에 포함된 횟수를 셉니다. Standard K-fold OOF라면 모든
            행의 횟수가 정확히 1이어야 합니다.
          </>
        }
        formula={String.raw`c_i=\sum_{k=1}^{K}\mathbf{1}[i\in V_k],\qquad c_i=1\ \ \forall i\in\{1,\ldots,n\}`}
        terms={[
          { symbol: "K", name: "number of folds", description: "서로 다른 학습·검증 분할의 개수입니다." },
          { symbol: "V_k", name: "fold k validation indices", description: "k번째 모델이 학습하지 않고 평가한 행 ID 집합입니다." },
          { symbol: "c_i", name: "OOF coverage count", description: "행 i가 validation prediction을 받은 횟수입니다." },
          { symbol: "1[condition]", name: "indicator", description: "조건이 참이면 1, 거짓이면 0을 반환합니다." },
        ]}
        assumptions={[
          "표준 partition형 OOF를 가정합니다. Repeated CV라면 기대 coverage가 반복 횟수이며 prediction 집계 규칙을 따로 둡니다.",
          "행 coverage가 1이어도 같은 entity나 미래 정보가 fold를 건너면 leakage가 남으므로 group/time 경계를 별도로 확인합니다.",
          "Metric은 fold 평균만이 아니라 전체 OOF prediction에도 동일한 sample weight와 label order로 계산합니다.",
        ]}
        interpretation="c_i=0이면 예측 누락, c_i>1이면 중복입니다. 둘 다 metric과 ensemble weight를 왜곡하므로 제출 전에 실패 처리합니다."
      />

      <div className="not-prose my-8">
        <BaselineViz />
      </div>

      <div id="paper-hidden-debt" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">핵심 논문 · Hidden Technical Debt in Machine Learning Systems</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          이 논문의 핵심은 모델 코드가 전체 ML system의 작은 부분이며, data dependency·configuration·boundary erosion 같은 주변
          요소가 장기 비용을 만든다는 점입니다. 대회 baseline에도 data snapshot·split·config·artifact를 함께 묶어야 한다는 근거로
          읽되, 논문이 특정 실험 도구나 모든 대회 우승 전략을 검증했다고 확대하지 않습니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://papers.nips.cc/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html" target="_blank" rel="noreferrer">논문과 초록 보기</a>
      </div>
    </section>
  );
}
