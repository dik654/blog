import ExplainedFormula from "@/components/ui/explained-formula";
import UnigramViz from "./viz/UnigramViz";

export default function SentencePiece() {
  return (
    <section id="sentencepiece" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        SentencePiece는 toolkit이고 Unigram은 segmentation model이다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          SentencePiece는 공백으로 먼저 단어를 나누지 않은 raw sentence에서
          subword model을 학습하고 실행하는 toolkit입니다. 그 안에서 BPE와
          Unigram을 모두 선택할 수 있으므로 “SentencePiece와 BPE 중 무엇을
          썼다”는 표현만으로는 model을 특정할 수 없습니다. <code>▁</code> meta
          symbol은 공백 경계를 vocabulary 안에 드러내 detokenization을 돕지만,
          normalization·unknown 처리·byte fallback 설정까지 자동으로 한 값이 되는
          것은 아닙니다.
        </p>
        <p>
          Unigram trainer는 넓은 seed vocabulary에서 각 piece의 probability를
          추정한 뒤, 제거했을 때 corpus likelihood를 덜 해치는 후보를 반복해서
          pruning합니다. BPE가 병합 순서를 규칙으로 쌓는 반면 Unigram encoding은
          현재 vocabulary로 입력을 완전히 덮는 여러 경로를 비교합니다.
        </p>
      </div>

      <UnigramViz />

      <ExplainedFormula
        question="같은 문자열의 여러 subword 분할 가운데 Unigram은 어느 경로를 고를까?"
        idea={
          <>
            한 경로에 들어 있는 piece가 독립적으로 생성된다는 단순한 model을 두고
            piece probability를 곱합니다. 아주 작은 수의 연속 곱은 계산하기
            불안정하므로, logarithm의 곱→합 규칙을 사용해 log-probability 합이
            가장 큰 경로를 찾습니다.
          </>
        }
        formula={String.raw`\begin{aligned}P(\mathbf s)&=\prod_{i=1}^{m}p(s_i)\\\mathbf s^*&=\arg\max_{\mathbf s\in S(X)}\sum_{i=1}^{m}\log p(s_i)\end{aligned}`}
        terms={[
          {
            symbol: "S(X)",
            name: "valid segmentations",
            description: "문자열 X를 현재 vocabulary piece로 빈틈없이 덮는 모든 경로입니다.",
          },
          {
            symbol: "p(s_i)",
            name: "piece probability",
            description: "Training corpus와 현재 vocabulary 아래에서 추정한 각 piece의 확률입니다.",
          },
          {
            symbol: String.raw`\mathbf s^*`,
            name: "best path",
            description: "보통 Viterbi dynamic programming으로 찾는 최대 score segmentation입니다.",
          },
        ]}
        assumptions={[
          "Piece 독립 가정은 segmentation score를 계산하기 위한 model이며 실제 언어의 독립성을 뜻하지 않습니다.",
          "Normalizer와 unknown·byte-fallback 처리 뒤의 문자열을 vocabulary 경로가 완전히 덮을 수 있어야 합니다.",
        ]}
        interpretation="Unigram은 최고 score 경로 하나를 고를 수도 있고, 확률에 따라 다른 경로를 sampling할 수도 있습니다. 후자를 training augmentation으로 쓰는 subword regularization과 production의 deterministic encoding 계약은 분리해서 관리합니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          SentencePiece 구현은 NFKC 기반 normalization rule을 포함할 수 있습니다.
          Compatibility normalization은 일부 문자 차이를 합치므로 exact source
          reconstruction, code와 identifier가 중요한 경우 model file의
          normalization rule과 원문 offset alignment를 반드시 검사해야 합니다.
        </p>
      </div>

      <div
        id="paper-sentencepiece"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">논문 읽기 · Toolkit boundary</p>
        <p className="mt-2 text-sm font-semibold">
          SentencePiece: A simple and language independent subword tokenizer and detokenizer
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          핵심 기여는 language-specific pre-tokenizer에 의존하지 않고 raw sentence에서
          고정 vocabulary size의 model을 학습하며, 공백까지 일반 symbol처럼 다루는
          end-to-end toolkit입니다. 모든 언어에서 같은 품질을 보장한다는 주장은
          아닙니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
          href="https://aclanthology.org/D18-2012/"
          target="_blank"
          rel="noreferrer"
        >
          원 논문과 raw-sentence 설계 보기
        </a>
      </div>

      <div
        id="paper-subword-regularization"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">논문 읽기 · Stochastic segmentation</p>
        <p className="mt-2 text-sm font-semibold">
          Subword Regularization: Improving Neural Network Translation Models with Multiple Subword Candidates
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          하나의 정답 segmentation만 고정하는 대신 Unigram model의 여러 후보를
          sampling해 translation model을 학습한 연구입니다. 보고된 개선은 실험한
          번역 corpus와 model 조건의 결과이며, sampling을 켜면 모든 downstream
          task가 자동으로 좋아진다는 뜻은 아닙니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
          href="https://aclanthology.org/P18-1007/"
          target="_blank"
          rel="noreferrer"
        >
          원 논문과 실험 조건 보기
        </a>
      </div>
    </section>
  );
}
