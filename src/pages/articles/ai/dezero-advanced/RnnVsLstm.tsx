import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";
import RnnLstmViz from "./viz/RnnLstmViz";

export default function RnnVsLstm({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="rnn-vs-lstm" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">RNN과 LSTM의 차이는 장기 상태가 흐르는 경로에 있습니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          기본 RNN은 현재 입력과 이전 hidden state를 합친 뒤 tanh를 통과시켜 다음 상태를 만듭니다. 시간을 따라 같은 변환을 반복하므로 backpropagation through time(BPTT)에서는 Jacobian이 계속 곱해지고, 그 크기에 따라 gradient가 사라지거나 커질 수 있습니다.
        </p>
        <p>
          LSTM은 hidden state와 별도로 cell state를 두고, forget·input·output gate로 기억의 유지·기록·노출을 나눕니다. cell state의 덧셈 경로는 기본 RNN보다 gradient가 장기간 흐르기 쉬운 통로를 제공하지만, 긴 시퀀스 문제를 자동으로 모두 해결하는 것은 아니므로 초기화와 clipping, sequence length도 함께 봐야 합니다.
        </p>
      </div>
      <div className="not-prose my-8"><RnnLstmViz onOpenCode={open} /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>파라미터 수보다 상태 수명부터 정합니다</h3>
        <p>
          두 레이어 모두 상태를 다음 호출까지 보존하지만, 독립된 시퀀스 사이에서는 반드시 초기화해야 합니다. 긴 시퀀스를 구간별로 학습한다면 값은 넘기되 이전 계산 그래프와의 연결을 끊는 detach 경계도 필요합니다. 이 경계를 생략하면 의도치 않게 전체 이력을 보존해 메모리가 계속 늘어납니다.
        </p>
      </div>
    </section>
  );
}
