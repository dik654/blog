import ExplainedFormula from "@/components/ui/explained-formula";
import TensorContractViz from "./viz/TensorContractViz";
import HorizonStrategyViz from "./viz/HorizonStrategyViz";

export default function CellArchitecture() {
  return (
    <section id="cell-architecture" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Tensor shape와 state의 수명을 함께 설계한다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">PyTorch에서 <code>batch_first=true</code>라면 입력은 보통 <code>[B, L, F]</code>지만 hidden·cell state는 여전히 <code>[layers × directions, B, hidden]</code> 순서다. Shape가 맞는 것만으로는 부족하다. Batch 축에 서로 다른 설비나 고객이 섞였다면 한 sample의 마지막 state를 다른 sample로 넘기지 않아야 하고, stateful streaming이라면 entity와 session 경계에서 반드시 reset해야 한다.</p>
      </div>
      <TensorContractViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p><a href="https://docs.pytorch.org/docs/stable/generated/torch.nn.LSTM.html" target="_blank" rel="noreferrer">PyTorch LSTM 공식 문서</a>는 output과 마지막 <code>(h_n, c_n)</code>을 별도로 반환한다. 모든 step의 output이 필요한 sequence labeling과 마지막 state만 forecast head에 넘기는 many-to-one 구성을 구분해야 한다. Bidirectional output은 sequence의 뒤쪽까지 읽으므로 미래가 없는 online forecasting에 그대로 쓰면 leakage가 된다.</p>
      </div>
      <div id="paper-pytorch-lstm" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 문서 읽기 · Tensor와 state shape</p>
        <p className="mt-2 text-sm font-semibold">torch.nn.LSTM API contract</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          PyTorch 문서는 input·output·hidden·cell tensor의 축, <code>batch_first</code>, direction과
          projection이 shape를 어떻게 바꾸는지 정의합니다. 이는 API의 계산 계약이며 entity별
          state reset·forecast cutoff·feature availability까지 대신 정하지 않습니다. 특정 PyTorch
          version의 shape를 다른 framework나 custom kernel에 그대로 적용해서도 안 됩니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://docs.pytorch.org/docs/stable/generated/torch.nn.LSTM.html" target="_blank" rel="noreferrer">공식 API의 입력·출력·state shape 보기</a>
      </div>
      <HorizonStrategyViz />
      <ExplainedFormula
        question="마지막 LSTM state에서 H개 미래 값을 한 번에 어떻게 출력할까?"
        idea={<>Direct multi-output head는 마지막 hidden state를 H×Dᵧ개의 값으로 투영한 뒤 horizon 축으로 reshape합니다. Recursive decoder와 달리 앞선 예측을 다음 입력으로 되먹이지 않습니다.</>}
        formula={String.raw`\begin{aligned}\mathbf h_t&=\operatorname{LSTM}(X_t)\\\widehat Y_t&=\operatorname{reshape}(W_o\mathbf h_t+\mathbf b_o)\end{aligned}`}
        terms={[
          { symbol: "\\mathbf h_t", name: "forecast state", description: "Input window 마지막 step에서 읽은 요약 표현입니다." },
          { symbol: "W_o,\mathbf b_o", name: "forecast head", description: "Hidden representation을 모든 horizon·target 출력으로 바꾸는 학습 parameter입니다." },
          { symbol: "\\widehat Y_t", name: "multi-horizon forecast", description: "한 origin에서 동시에 만든 H×Dᵧ 예측입니다." },
        ]}
        assumptions={["출력 horizon H가 학습·serving 계약에 고정되어 있습니다.", "각 horizon의 loss weight와 scale을 별도로 정할 수 있습니다."]}
        interpretation="Direct 방식은 horizon을 병렬로 예측해 exposure bias를 줄이지만 임의 길이로 늘릴 수 없습니다. Recursive 방식은 유연하지만 training의 teacher-forced prefix와 inference의 model-generated prefix 차이, 그리고 오차 누적을 backtest에서 그대로 재현해야 합니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Stateful serving은 state의 소유자와 version을 함께 저장한다</h3>
        <p>
          Stateful online LSTM은 <code>entity_id</code>와 session을 key로 hidden·cell state,
          model revision, 마지막 event time을 함께 저장해야 한다. Replica migration에서는 같은
          version의 state를 한 번만 handoff하고, session 종료·긴 gap·model 교체·entity 변경에서는
          명시적으로 reset한다. Test에서는 A state를 B에 주입하거나 stale revision을 읽는 negative
          fixture, migration 중 duplicate·missing handoff를 만들어 output과 audit receipt가 예상대로
          실패하는지 확인한다.
        </p>
      </div>
    </section>
  );
}
