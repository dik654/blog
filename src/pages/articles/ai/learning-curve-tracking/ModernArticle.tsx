import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { ProgressCoordinateViz } from "../experiment-tracking/viz/ModernExperimentViz";

export default function LearningCurveTrackingArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Learning curve는 metric 숫자의 목록이 아니라 학습 진행 좌표 위의
          관측입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>Metric observation</strong>은 “loss 0.42” 하나가 아닙니다.
            어떤 optimizer update 뒤에, 몇 sample·token을 처리했고, 시작 후 몇
            초가 지났을 때, 어떤 evaluation fixture로 얻은 값인지까지 묶은
            기록입니다.
          </p>
          <p>
            관측의 네 좌표를 분리하는 것이 출발점입니다. 두 run을 같은 자원 지점에 정렬한 뒤 validation artifact와 reducer가 같은지 확인합니다.
          </p>
        </div>
        <TermBreakdown
          title="Curve를 이루는 네 좌표"
          items={[
            {
              term: "Metric value",
              description:
                "정의된 reducer가 evaluation fixture에 적용되어 만든 관측값입니다.",
              example:
                "validation loss 0.42, macro F1 0.71처럼 이름·단위·방향을 함께 기록합니다.",
              boundary:
                "같은 이름이라도 class weighting이나 averaging이 다르면 같은 metric이 아닙니다.",
            },
            {
              term: "Optimizer update",
              description:
                "Gradient accumulation이 끝나 실제 parameter가 한 번 갱신된 횟수입니다.",
              example:
                "microbatch 8개를 누적해도 optimizer.step() 한 번이면 update는 1 증가합니다.",
              boundary:
                "logging call이나 dataloader iteration 수와 같다고 가정하지 않습니다.",
            },
            {
              term: "Processed units",
              description:
                "그 시점까지 학습에 소비한 sample·token·frame 같은 기준량입니다.",
              example:
                "서로 다른 batch size run을 10억 token 지점에서 비교합니다.",
              boundary:
                "sample과 token을 섞지 않고 unit·counting policy를 고정합니다.",
            },
            {
              term: "Wall time",
              description: "동일한 시작 경계에서 지난 실제 시간입니다.",
              example:
                "checkpoint 복구·evaluation 시간을 포함하는지 별도 flag로 남깁니다.",
              boundary:
                "Hardware와 data pipeline이 다르면 model quality와 system speed를 분리해 해석합니다.",
            },
          ]}
        />
        <ProgressCoordinateViz />
        <ContentBoundary article="learning-curve-tracking" />
      </section>

      <section id="progress-coordinate" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          불분명한 step 대신 update·처리량·시간을 한 observation에 저장합니다
        </h2>
        <ExplainedFormula
          question="서로 다른 logger와 batch 설정에서도 한 metric 관측의 위치를 잃지 않으려면 무엇을 기록하나요?"
          idea={
            <p>
              관측값에 진행 좌표 세 개와 metric definition ID를 결합합니다.
              update는 학습 사건, processed units는 자원량, elapsed time은
              system 속도를 나타냅니다.
            </p>
          }
          formula={String.raw`\begin{aligned}p_k&=(u_k,n_k,t_k)\\r_k&=(p_k,m_k)\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}p_k&=\underbrace{n_k/n_{\rm budget}}_{\text{처리량을 budget 비율로 환산}}\\c_k&=\underbrace{(u_k,n_k,t_k)}_{\text{진행 좌표를 한 묶음으로}}\\r_k&=\underbrace{c_k\oplus(m_k,d_m)}_{\text{값과 정의를 함께 보존}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`n_k/n_{\rm budget}`,
              annotation: [
                "처리량을 전체 budget으로 나눠",
                "서로 다른 규모를 0~1 진행률로 비교",
              ],
            },
            {
              expression: String.raw`(u_k,n_k,t_k)`,
              annotation: [
                "update·처리량·시간을 함께 묶어",
                "step이라는 모호한 단일 축을 제거",
              ],
            },
            {
              expression: String.raw`(m_k,d_m)`,
              annotation: [
                "값에 metric definition을 붙여",
                "동명이지만 reducer가 다른 관측을 구분",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`u_k`,
              name: "Optimizer update",
              description:
                "k번째 관측까지 완료된 실제 parameter update 수입니다.",
            },
            {
              symbol: String.raw`n_k`,
              name: "Processed units",
              description: "처리한 sample·token·frame의 누적량입니다.",
            },
            {
              symbol: String.raw`t_k`,
              name: "Elapsed time",
              description: "고정된 시작 경계부터 지난 wall-clock 시간입니다.",
            },
            {
              symbol: String.raw`m_k,d_m`,
              name: "Metric · definition",
              description:
                "관측값과 dataset slice·reducer·direction을 고정한 정의 ID입니다.",
            },
          ]}
          assumptions={[
            "모든 관측은 단조 증가하는 update·processed-unit 좌표를 가집니다.",
            "Budget과 processed units는 같은 단위를 사용합니다.",
            "Resume 뒤에도 누적 좌표가 되감기지 않습니다.",
          ]}
          interpretation="batch size가 달라 update 수가 네 배 차이여도 같은 processed-token 위치의 관측을 찾을 수 있습니다. 위 식의 나눗셈은 서로 다른 총 budget을 같은 진행률 축에 놓기 위한 연산입니다."
        />
      </section>

      <section id="comparison-boundary" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          두 curve는 먼저 같은 자원 지점으로 정렬한 뒤 차이를 계산합니다
        </h2>
        <ExplainedFormula
          question="Run A와 B의 logging 간격이 다를 때 어느 두 관측을 비교해야 하나요?"
          idea={
            <p>
              비교하려는 token budget에 가장 가까운 관측을 각 run에서 독립적으로 찾고 선택된 두 metric의 차이를 계산합니다.
            </p>
          }
          formula={String.raw`k_j(n^*)=\arg\min_k|n_{j,k}-n^*|,\quad \Delta=m_{A,k_A}-m_{B,k_B}`}
          annotatedFormula={String.raw`\begin{aligned}e_{j,k}&=\underbrace{|n_{j,k}-n^*|}_{\text{관측 위치와 목표 budget의 거리}}\\k_j&=\underbrace{\arg\min_k e_{j,k}}_{\text{각 run에서 가장 가까운 관측을 선택}}\\\Delta&=\underbrace{m_{A,k_A}-m_{B,k_B}}_{\text{같은 자원 지점의 quality 차이 계산}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`|n_{j,k}-n^*|`,
              annotation: [
                "관측 처리량에서 목표량을 빼고 절댓값을 취해",
                "앞뒤 어느 쪽이든 가까운 정도를 거리로 변환",
              ],
            },
            {
              expression: String.raw`\arg\min_k`,
              annotation: [
                "거리 후보 중 최솟값의 index를 골라",
                "logging 주기가 다른 run을 같은 budget에 정렬",
              ],
            },
            {
              expression: String.raw`m_{A,k_A}-m_{B,k_B}`,
              annotation: [
                "정렬된 두 관측을 빼서",
                "자원량이 아닌 model 차이에 가까운 비교량 생성",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`n^*`,
              name: "Target budget",
              description: "비교하려는 공통 processed-unit 위치입니다.",
            },
            {
              symbol: String.raw`k_j`,
              name: "Aligned observation",
              description:
                "run j에서 target budget에 가장 가까운 관측 index입니다.",
            },
            {
              symbol: String.raw`\Delta`,
              name: "Aligned difference",
              description: "같은 자원 지점으로 정렬한 metric 차이입니다.",
            },
          ]}
          assumptions={[
            "두 run이 target budget 주변까지 실제로 학습되었습니다.",
            "관측 간격이 너무 크면 interpolation 또는 tolerance failure로 처리합니다.",
            "Evaluation dataset·checkpoint timing·metric reducer가 동일합니다.",
          ]}
          interpretation="같은 update 번호를 무조건 비교하면 batch가 큰 run이 더 많은 token을 본 효과가 섞입니다. 먼저 처리량 거리를 최소화하는 이유가 그 교란을 제거하기 위해서입니다."
        />
      </section>

      <section id="logging-receipt" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">
          Curve point마다 evaluation receipt를 연결합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            각 point에는 checkpoint digest와 evaluation dataset·slice를 붙인 다음 metric implementation
            version·reducer·batch policy와 hardware receipt까지 연결합니다. UI에 그려진 선은 이 관측들을 읽는 한 가지 view일 뿐이며 원본 관측을
            대신하지 않습니다.
          </p>
        </div>
        <div id="standard-wandb-tracking" className="scroll-mt-24">
          <CitationBlock
            source="Weights & Biases: Log data with experiments"
            citeKey={1}
            href="https://docs.wandb.ai/guides/track/log/"
          >
            <strong>문제:</strong> Run의 metric·media·custom step을 일관되게
            기록해야 함. <strong>기여:</strong> Logging history와 step metric을
            관리하는 공식 interface. <strong>전제:</strong> 현재 W&amp;B
            SDK·service 동작은 version별로 달라질 수 있음.{" "}
            <strong>근거 범위:</strong> 공식 logging semantics.{" "}
            <strong>과장 금지:</strong> 도구가 metric 정의나 공정한 비교를 자동
            보장한다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
