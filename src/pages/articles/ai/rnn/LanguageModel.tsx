import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import M from "@/components/ui/math";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import RNNLanguageFlowViz from "./viz/RNNLanguageFlowViz";

export default function LanguageModel() {
  return (
    <section id="language-model" className="mb-20 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">RNN language model: context를 state로 접어 다음 token을 예측한다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Language modeling에서는 token ID를 embedding으로 바꾼 뒤 지금까지의 context를 반영한 hidden state를 vocabulary 크기의
          logits로 투영합니다. softmax가 만든 distribution에서 실제 다음 token에 배정한 probability가 높아지도록 모든 시점의 cross-entropy를
          학습합니다.
        </p>
        <p>
          중요한 indexing은 입력과 정답이 한 칸 어긋난다는 점입니다. 입력
          <M>{"w_t"}</M>까지 처리해 만든 <M>{"h_t"}</M>로 <M>{"w_{t+1}"}</M>를 맞힙니다.
          그림에서 cell 위의 예측과 아래의 입력을 같은 token으로 표시하면 teacher forcing의
          흐름이 잘못 보일 수 있습니다.
        </p>
      </div>

      <TermBreakdown
        title="다음-token 학습의 여섯 물체를 먼저 분리합니다"
        items={[
          { term: "Input token wₜ", description: "현재 step에서 model에 실제로 넣는 token입니다.", example: "입력이 ‘나’라면 정답은 그 다음 token ‘간다’입니다.", boundary: "같은 위치의 token을 그대로 복원하는 목표가 아닙니다." },
          { term: "Shifted target wₜ₊₁", description: "현재 prefix 다음에 실제로 나타난 한 칸 뒤 token입니다.", example: "[BOS, 나, 간다, EOS]는 BOS→나, 나→간다, 간다→EOS가 됩니다.", boundary: "Padding은 loss mask에서 제외합니다." },
          { term: "Vocabulary logit head Wᵧₕ,bᵧ", description: "H개 hidden 좌표를 vocabulary token 수 |V|만큼의 score로 펼치는 affine output layer입니다.", example: "H=2이고 vocabulary가 3개면 Wᵧₕ는 3×2이고, hₜ 하나에서 logit 3개를 만듭니다.", boundary: "State를 저장하는 memory가 아니라 현재 state를 읽어 score를 만드는 projection입니다." },
          { term: "Logit zₜ", description: "Output head가 vocabulary의 각 token에 붙인 정규화 전 점수 vector입니다.", boundary: "Probability가 아니므로 합이 1일 필요가 없습니다." },
          { term: "Probability pₜ", description: "Softmax로 logits를 합이 1인 다음-token distribution으로 바꾼 값입니다.", example: "pₜ[간다]=0.68은 현재 prefix 뒤 ‘간다’에 68% mass를 둔다는 뜻입니다." },
          { term: "NLL과 perplexity", description: "정답 token의 −log probability를 평균하고, 그 평균을 exp로 되돌린 두 평가 표현입니다.", boundary: "Corpus·tokenizer·mask가 다른 PPL은 숫자만 바로 비교하지 않습니다." },
        ]}
      />

      <RNNLanguageFlowViz />
      <ContentBoundary article="rnn-language-model" />

      <div id="paper-rnn-lm" className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4">
        <p className="text-xs font-bold text-primary">논문 해설 · Recurrent Neural Network Based Language Model</p>
        <h3 className="mt-2 text-base font-bold">고정 n-gram 대신 recurrent state로 가변 길이 문맥을 조건화했다</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Mikolov 등의 모델은 이전 word와 hidden state로 다음 word distribution을 만들고 당시 speech-recognition language-model
          평가에서 n-gram과 feed-forward baseline을 비교했습니다. 이 결과가 받쳐 주는 범위는 해당 vocabulary·corpus·model scale입니다.
          hidden state가 긴 문맥을 완전하게 복원한다거나 현대 Transformer보다 일반적으로 우수하다는 결론은 그 밖의 이야기입니다.
        </p>
      </div>

      <ExplainedFormula
        question="고정 크기 hidden state를 vocabulary 전체의 다음-token probability로 어떻게 바꿀까?"
        idea={<>output projection이 state를 token별 score인 logit으로 바꾸고, softmax가 score의 상대적 차이를 합이 1인 distribution으로 정규화합니다.</>}
        formula={String.raw`e_t=E[w_t],\quad h_t=\operatorname{RNN}(e_t,h_{t-1}),\quad z_t=W_{yh}h_t+b_y,\quad p_t=\operatorname{softmax}(z_t)`}
        annotatedFormula={String.raw`\begin{aligned}
e_t&=\underbrace{E[w_t]}_{\text{token ID를 vector로 lookup}}\\
h_t&=\underbrace{\operatorname{RNN}(e_t,h_{t-1})}_{\text{prefix를 현재 state로 압축}}\\
z_t&=\underbrace{W_{yh}h_t+b_y}_{\text{vocabulary별 score 생성}}\\
p_t&=\underbrace{\operatorname{softmax}(z_t)}_{\text{score를 합 1의 probability로 정규화}}
\end{aligned}`}
        operations={[
          { expression: String.raw`E[w_t]`, annotation: ["Discrete token ID에서", "학습된 input vector를 lookup"] },
          { expression: String.raw`\operatorname{RNN}(e_t,h_{t-1})`, annotation: ["현재 token과 이전 state를 합쳐", "prefix의 새 lossy summary 생성"] },
          { expression: String.raw`W_{yh}h_t+b_y`, annotation: ["Hidden state를 projection해", "vocabulary 각 token의 logit 생성"] },
          { expression: String.raw`\operatorname{softmax}(z_t)`, annotation: ["상대 logit을 exponentiate·normalize해", "다음-token distribution 생성"] },
        ]}
        terms={[
          { symbol: "E[w_t]", name: "token embedding", description: "discrete token ID를 D차원 연속 vector로 lookup합니다." },
          { symbol: "z_t\\in\\mathbb{R}^{|V|}", name: "logits", description: "vocabulary의 각 token에 대한 정규화 전 score입니다." },
          { symbol: "p_t", name: "다음-token distribution", description: "p_t[j]는 context w1:t 뒤에 vocabulary token j가 올 model probability입니다." },
        ]}
        interpretation="모델은 원문 context에 직접 attention하지 않습니다. vocabulary distribution은 과거가 압축된 ht만으로 만들어집니다."
      />

      <ExplainedFormula
        question="한 문장에서 어느 시점의 예측을 학습 신호로 사용할까?"
        idea={<>각 시점에서 실제 다음 token의 negative log-probability를 구해 평균냅니다. 한 문장으로 여러 shifted training pair가 생깁니다.</>}
        formula={String.raw`\mathcal{L}_{\text{NLL}}=-\frac{1}{T}\sum_{t=1}^{T}\log p_t\!\left[w_{t+1}\right]`}
        annotatedFormula={String.raw`\begin{aligned}
\ell_t&=\underbrace{-\log p_t[w_{t+1}]}_{\text{정답 probability의 surprise}}\\
\mathcal L_{\rm NLL}
 &=\underbrace{\frac{1}{T}\sum_{t=1}^{T}\ell_t}_{\text{valid shifted token들의 평균}}
\end{aligned}`}
        operations={[
          { expression: String.raw`p_t[w_{t+1}]`, annotation: ["분포에서 한 칸 뒤 정답의", "probability만 선택"] },
          { expression: String.raw`-\log p_t[w_{t+1}]`, annotation: ["작은 정답 probability에", "큰 penalty를 주는 surprise 계산"] },
          { expression: String.raw`\frac1T\sum_t\ell_t`, annotation: ["Valid target token loss를 합쳐", "token count로 평균"] },
        ]}
        terms={[
          { symbol: "p_t[w_{t+1}]", name: "정답 token probability", description: "t까지 본 뒤 실제 t+1 token에 model이 배정한 확률입니다." },
          { symbol: "T", name: "loss를 계산한 token 수", description: "padding position은 mask로 합계에서 제외합니다." },
        ]}
        assumptions={["training 입력에는 실제 이전 token을 넣는 teacher forcing을 기준으로 합니다.", "BOS/EOS 처리와 padding mask는 dataset contract에 따라 달라집니다."]}
        interpretation="한 token의 오차는 해당 시점 output뿐 아니라 BPTT를 통해 그 state를 만든 과거 transition의 공유 weight에도 기여합니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>training과 generation의 입력 분포가 달라진다</h3>
        <p>
          training에서는 직전 model prediction이 틀렸더라도 다음 입력으로 정답 token을
          넣습니다. 반면 generation에서는 방금 sample한 token을 다시 입력하므로, 한 번의
          실수가 이후 state와 입력 분포를 바꿉니다. 이를 exposure bias라고 부르며,
          teacher forcing을 사용했다는 사실과 inference 품질은 별도로 평가해야 합니다.
          이 train–inference 경계의 정본 설명과 문제는{" "}
          <Link to="/ai/supervised-fine-tuning#teacher-forcing">teacher forcing·exposure bias 글</Link>에 모았습니다.
        </p>
        <h3>Perplexity는 tokenization까지 같을 때 비교한다</h3>
        <p>
          perplexity는 평균 negative log-likelihood의 exponential입니다. 균등 분포라는
          단순한 경우에는 “동등하게 헷갈리는 후보 수”로 직관화할 수 있지만, 일반 분포에서
          실제 후보 개수를 뜻하지는 않습니다. token 하나가 담는 문자열 길이가 tokenizer마다
          다르기 때문에 서로 다른 vocabulary와 tokenization의 PPL을 숫자만으로 비교하면
          공정하지 않습니다.
          평균 negative log-likelihood가 무엇을 측정하는지는{" "}
          <Link to="/ai/cross-entropy#cross-entropy">cross-entropy 정본 글</Link>에서 probability·log부터 이어집니다.
        </p>
      </div>

      <ExplainedFormula
        question="평균 token loss를 사람이 읽기 쉬운 양의 척도로 바꾸려면?"
        idea={<>natural log 단위의 cross-entropy를 exponential로 되돌립니다. lower is better이지만 data와 tokenization이 같다는 조건이 붙습니다.</>}
        formula={String.raw`\operatorname{PPL}=\exp\!\left(\mathcal{L}_{\text{NLL}}\right)`}
        annotatedFormula={String.raw`\operatorname{PPL}=\underbrace{\exp(\mathcal L_{\rm NLL})}_{\text{평균 log surprise를 양의 scale로 되돌림}}`}
        operations={[
          { expression: String.raw`\exp(\mathcal L_{\rm NLL})`, annotation: ["Log-domain 평균을 exponentiate해", "같은 evaluation contract의 PPL로 변환"] },
        ]}
        terms={[
          { symbol: "\\mathcal{L}_{\\text{NLL}}", name: "평균 token NLL", description: "동일한 corpus와 masking convention에서 계산한 평균 loss입니다." },
        ]}
        interpretation="PPL은 같은 evaluation contract 안에서 model distribution이 정답 token에 얼마나 probability를 모았는지 비교하는 척도입니다."
      />
    </section>
  );
}
