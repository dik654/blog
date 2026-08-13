import ExplainedFormula from "@/components/ui/explained-formula";
import EdaChecklistViz from "./viz/EdaChecklistViz";

export default function EdaPhase() {
  return (
    <section id="eda-phase" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        EDA에서는 예쁜 분포보다 한 행의 의미와 예측 시점의 정보 경계를 먼저 확인합니다
      </h2>
      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          EDA(Exploratory Data Analysis)는 데이터를 처음 살펴보며 가설과 위험을 찾는 과정입니다. 먼저 한 행이 사람 한 명인지,
          한 번의 방문인지, 한 장의 crop인지 적습니다. 같은 사람·기기·세션·원본에서 파생된 행이 train과 validation에 동시에
          들어가면 모델은 새로운 대상을 일반화하는 대신 이미 본 대상을 알아볼 수 있습니다.
        </p>
        <p>
          다음으로 예측 시점 <code>t</code>를 정하고 각 feature가 현실에서 언제 확정되는지 기록합니다. 결과가 발생한 뒤 입력된
          사후 코드, 미래 집계값, 전체 데이터로 fit한 normalization·target encoding은 계산 당시에는 편리하지만 실제 예측 때는
          존재하지 않는 정보일 수 있습니다.
        </p>
      </div>

      <ExplainedFormula
        question="한 feature가 leakage 없이 예측에 사용 가능한지 어떻게 판정할까요?"
        idea={
          <>
            각 예측 행 i에 cutoff를 붙이고, feature 생성에 사용한 모든 사건의 available time이 cutoff 이하여야 한다고 검사합니다.
            Event time이 아니라 실제 pipeline에서 값을 알게 된 시간을 써야 합니다.
          </>
        }
        formula={String.raw`x_{i,r}\ \text{is usable}\iff \max_{e\in S_{i,r}} t_{\mathrm{available}}(e)\le t_{\mathrm{cutoff}}(i)`}
        terms={[
          { symbol: "x_i,r", name: "row i의 feature r", description: "모델에 입력하려는 한 feature 값입니다." },
          { symbol: "S_i,r", name: "source events", description: "그 feature를 계산하는 데 사용된 원천 사건의 집합입니다." },
          { symbol: "t_available", name: "available time", description: "원천 값이 실제 시스템에서 조회 가능해진 시각입니다." },
          { symbol: "t_cutoff", name: "prediction cutoff", description: "행 i의 예측을 내려야 하는 시각입니다." },
        ]}
        assumptions={[
          "Feature lineage가 source event까지 추적되고 available time이 event time과 별도로 보존되어야 합니다.",
          "같은 entity의 미래 행뿐 아니라 전체 데이터로 fit한 통계와 label-derived transform도 검사 대상입니다.",
          "대회 test 생성 절차가 현실 deployment와 다르면 두 조건을 나란히 기록합니다.",
        ]}
        interpretation="검사 결과가 false라면 그 feature는 점수가 높아도 제거하거나 cutoff 이전 자료만으로 다시 계산해야 합니다."
      />

      <div className="not-prose my-8">
        <EdaChecklistViz />
      </div>

      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          결측·중복·class imbalance·시간 분포는 전체 평균 하나로 끝내지 않고 split 후보와 중요한 group별로 나눠 봅니다. Train에
          없고 test에만 있는 category·기간·장비가 있다면 모델 선택 전에 distribution shift로 기록해야 합니다. EDA의 최종
          산출물은 그래프 모음이 아니라 data dictionary, row/group key, cutoff와 available time, leakage blacklist, metric 계산
          예시, 예상 shift를 담은 위험표입니다.
        </p>
      </div>
    </section>
  );
}
