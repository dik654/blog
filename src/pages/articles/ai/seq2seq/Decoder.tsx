import ExplainedFormula from "@/components/ui/explained-formula";
import AutoregressiveDecodeViz from "./viz/AutoregressiveDecodeViz";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function Decoder({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="decoder" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Decoder는 prefix를 state로 축약하며 다음 token을 생성한다</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Decoder는 SOS token과 encoder에서 받은 initial state로 시작한다. 각 step에서는 이전 token embedding과 recurrent state로
          새 state를 만들고 vocabulary logits를 계산해 다음 token을 선택한다. 선택한 token이 다음 step의 input이 되기 때문에 inference는
          본질적으로 순차적이며 EOS나 최대 길이에 도달할 때 끝난다.
        </p>
      </div>

      <ExplainedFormula
        question="Prefix 하나를 확장할 때 decoder state와 sequence score는 어떻게 갱신될까?"
        idea={<>Recurrent transition으로 다음 state를 만들고 output projection으로 vocabulary distribution을 얻습니다. Candidate sequence의 log probability는 선택한 token의 log probability를 이전 누적값에 더합니다.</>}
        formula={String.raw`\begin{aligned}u_t&=e(y_{t-1})\\s_t&=\operatorname{LSTM}_D(u_t,s_{t-1})\\p_t&=\operatorname{softmax}(W_os_t+b_o)\\q_t&=q_{t-1}+\log p_t[y_t]\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}u_t&=\underbrace{e(y_{t-1})}_{\text{오른쪽 항으로 결과 계산}}\\s_t&=\underbrace{\operatorname{LSTM}_D(u_t,s_{t-1})}_{\text{decoder state 계산}}\\p_t&=\underbrace{\operatorname{softmax}(W_os_t+b_o)}_{\text{선택 비율 정규화}}\\q_t&=q_{t-1}+\log p_t[y_t]\end{aligned}`}
        operations={[
          { expression: String.raw`e(y_{t-1})`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","Recurrent transition으로 다음 state를","만들고 output projection으로 vocabulary","distribution을 얻습니다."] },
          { expression: String.raw`\operatorname{LSTM}_D(u_t,s_{t-1})`, annotation: ["decoder state이(가) 식의 결과에 기여하는 방식을","계산합니다.","Recurrent transition으로 다음 state를","만들고 output projection으로 vocabulary"] },
          { expression: String.raw`\operatorname{softmax}(W_os_t+b_o)`, annotation: ["score를 합이 1인 선택 비율로 정규화합니다.","Recurrent transition으로 다음 state를","만들고 output projection으로 vocabulary","distribution을 얻습니다."] },
        ]}
        terms={[
          { symbol: "s_t", name: "decoder state", description: "Source condition과 target prefix를 recurrent하게 요약한 state입니다." },
          { symbol: "p_t", name: "next-token distribution", description: "현재 prefix에서 vocabulary token 각각의 categorical probability입니다." },
          { symbol: "p_t[y_t]", name: "selected-token probability", description: "실제로 확장한 token에 부여한 probability입니다." },
          { symbol: "W_o,b_o", name: "output projection", description: "Decoder width를 vocabulary logits로 바꾸는 parameter입니다." },
        ]}
        assumptions={["Cell state 표기는 간결성을 위해 s에 묶었습니다.", "Beam search의 실제 score에는 length normalization·coverage penalty 같은 task-specific 항이 추가될 수 있습니다."]}
        interpretation="Beam width를 늘리면 더 많은 prefix를 탐색하지만 model probability와 task quality가 같지는 않다. Search budget, length bias와 latency를 함께 검증해야 합니다."
      />
      <CodeViewButton
        onClick={() => onCodeRef("decoder-step", codeRefs["decoder-step"])}
      />

      <AutoregressiveDecodeViz />
    </section>
  );
}
