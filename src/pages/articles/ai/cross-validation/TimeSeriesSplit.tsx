import ExplainedFormula from "@/components/ui/explained-formula";
import TimeSeriesSplitViz from "./viz/TimeSeriesSplitViz";

export default function TimeSeriesSplit() {
  return (
    <section id="timeseries" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        시간 검증에서는 각 fold를 실제 과거의 한 시점으로 되돌려 놓고 그때 가능했던 학습만 재연합니다
      </h2>
      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          시간이 흐르며 분포가 바뀌거나 과거로 돌아갈 수 없는 문제에서는 random K-fold가 미래 관측을 과거 model 학습에 섞을
          수 있습니다. Walk-forward는 origin 이전으로 학습하고 그 뒤 구간을 평가합니다. Expanding window는 과거를 누적하고,
          rolling window는 최근 일정 구간만 유지하므로 실제 retraining policy와 같은 방식을 고릅니다.
        </p>
        <p>
          단순히 timestamp 순서만 맞춰도 충분하지 않습니다. Training row의 label이 validation origin 뒤에야 확정된다면 그
          시점에는 아직 학습할 수 없는 정답입니다. 각 row의 feature source와 label available time을 계산해 fold별로 다시
          생성해야 합니다.
        </p>
      </div>

      <ExplainedFormula
        question="Validation origin 직전의 얼마를 gap으로 비워야 하는지 어떻게 결정할까요?"
        idea={
          <>
            고정된 숫자를 관습적으로 쓰기보다 training label이 확정되는 시각을 계산합니다. 가장 늦게 확정되는 training label이
            validation의 첫 prediction cutoff 이전이어야 실제 walk-forward 학습이 가능합니다.
          </>
        }
        formula={String.raw`\max_{i\in D_{-k}} t_{\mathrm{label\_available}}(i)\le \min_{j\in V_k}t_{\mathrm{cutoff}}(j)`}
        terms={[
          { symbol: "t_label_available", name: "label available time", description: "Target horizon과 reporting delay를 지나 label을 학습에 쓸 수 있게 된 시각입니다." },
          { symbol: "t_cutoff", name: "prediction cutoff", description: "Validation row의 예측을 내려야 하는 시각입니다." },
          { symbol: "D_-k", name: "historical training rows", description: "k번째 origin에서 실제로 학습 가능한 과거 행입니다." },
          { symbol: "V_k", name: "future validation rows", description: "그 origin 이후 성능을 측정할 행입니다." },
        ]}
        assumptions={[
          "Label horizon·reporting delay·backfill revision을 metadata로 계산할 수 있어야 합니다.",
          "Feature window가 validation과 원천 event를 공유해 dependency가 생기거나 target windows가 겹치면 추가 purge가 필요할 수 있습니다.",
          "Gap을 크게 만들수록 leakage는 줄 수 있지만 train data와 최신성이 줄어드는 trade-off가 있습니다.",
        ]}
        interpretation="11월 예측을 시작하는데 10월 말 row의 30일 target이 11월 말에 확정된다면 그 row는 11월 origin의 training set에 넣을 수 없습니다."
      />

      <div className="not-prose my-8">
        <TimeSeriesSplitViz />
      </div>

      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          평균 score만 내지 않고 origin별 metric·train span·validation span·gap·group coverage를 함께 그립니다. 최신 origin에서
          성능이 지속적으로 떨어지면 model family보다 retraining cadence, feature staleness와 drift monitoring을 먼저 의심합니다.
          여러 entity의 시간이 섞이면 time 조건과 group 경계를 동시에 지켜야 합니다.
        </p>
      </div>
    </section>
  );
}
