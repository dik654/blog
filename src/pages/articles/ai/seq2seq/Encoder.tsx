import ExplainedFormula from "@/components/ui/explained-formula";
import StateHandoffViz from "./viz/StateHandoffViz";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function Encoder({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="encoder" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Encoder는 source를 decoder가 사용할 조건 정보로 바꾼다</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          LSTM encoder는 source embedding을 순서대로 읽으며 hidden state와 cell state를
          갱신한다. Fixed-context Seq2Seq에서는 마지막 두 state를 decoder의 초기 state로
          넘기는데, 이는 “문장의 의미를 담은 벡터”라기보다 두 recurrent network 사이의
          learned interface로 보는 편이 정확하다. Decoder는 원문 token을 직접 보지 않고
          이 interface에 남아 있는 정보만 사용할 수 있다.
        </p>
      </div>

      <ExplainedFormula
        question="Source를 읽은 encoder state를 decoder 계산의 시작점으로 어떻게 넘길까?"
        idea={<>Encoder의 마지막 hidden·cell state를 그대로 쓰거나 learned projection을 거쳐 decoder의 initial state로 변환합니다. Encoder와 decoder dimension이 다르면 projection이 interface adapter 역할을 합니다.</>}
        formula={String.raw`\begin{aligned}(h_j^E,C_j^E)&=\operatorname{LSTM}_E(e(x_j),h_{j-1}^E,C_{j-1}^E)\\s_0^D&=W_hh_S^E+b_h\\m_0^D&=W_CC_S^E+b_C\end{aligned}`}
        terms={[
          { symbol: "h_j^E,C_j^E", name: "encoder states", description: "Source position j까지 읽은 LSTM의 공개 state와 cell state입니다." },
          { symbol: "S", name: "source length", description: "마지막 valid source position이며 padding mask와 구분합니다." },
          { symbol: "s_0^D,m_0^D", name: "decoder initial states", description: "첫 SOS step 이전 decoder의 hidden·memory state입니다." },
          { symbol: "W_h,W_C", name: "state adapters", description: "Encoder와 decoder state space를 연결하는 optional learned projection입니다." },
        ]}
        assumptions={["설명을 위해 단방향 LSTM을 사용했으며 bidirectional encoder는 방향별 state를 concatenate·project할 수 있습니다.", "Padding이 있는 batch에서는 실제 length의 마지막 state를 선택해야 합니다."]}
        interpretation="Fixed context의 정보 병목은 state dimension뿐 아니라 이 초기 handoff 이후 source를 다시 볼 수 없다는 접근 경로의 제약입니다."
      />
      <CodeViewButton
        onClick={() => onCodeRef("encoder-handoff", codeRefs["encoder-handoff"])}
      />

      <StateHandoffViz />
    </section>
  );
}
