import ExplainedFormula from "@/components/ui/explained-formula";
import CorruptionViz from "./viz/CorruptionViz";
import RecipeEvidenceViz from "./viz/RecipeEvidenceViz";
export default function PreTraining() {
  return (
    <section id="pre-training" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        MLM은 양쪽 문맥을 쓸 수 있게 만든 corruption objective다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          원 BERT는 token 위치의 15%를 prediction 대상으로 고릅니다. 선택된 위치
          안에서 80%는 <code>[MASK]</code>, 10%는 random token, 10%는 원래
          token으로 입력을 구성하며 loss는 세 경우 모두 원래 token ID에 대해
          계산합니다. 따라서 “전체 token의 80%를 가린다”는 해석은 틀립니다.
          기대상 실제 <code>[MASK]</code>가 되는 위치는 전체의 12%입니다.
        </p>
        <p>
          양쪽을 모두 보는 encoder에 원래 token을 그대로 두고 그 위치의 token ID를
          맞히게 하면 model은 주변 문맥을 배울 필요 없이 입력을 복사하는 shortcut을
          사용할 수 있다. 그래서 prediction target과 model에 보여 주는 corrupted
          input을 분리한다. Corruption은 단순한 noise가 아니라 bidirectional
          visibility에서 정답 누출을 막는 학습 문제의 일부다.
        </p>
      </div>
      <CorruptionViz />
      <ExplainedFormula
        question="오염된 입력을 보고 원래 token을 복원하는 loss는 어디에서 계산할까?"
        idea={
          <>
            선택 집합 M에 포함된 위치만 categorical negative log-likelihood를
            계산합니다. Conditional context에는 오염된 전체 sequence가
            들어가지만 target은 오염 전 token입니다.
          </>
        }
        formula={String.raw`\mathcal L_{\mathrm{MLM}}=-\sum_{i\in M}\log p_\theta(x_i\mid\widetilde{\mathbf x})`}
        terms={[
          {
            symbol: "M",
            name: "selected positions",
            description:
              "원 BERT recipe에서 입력 위치의 약 15%를 sample한 집합입니다.",
          },
          {
            symbol: "x_i",
            name: "original token",
            description: "Corruption 전 i 위치의 정답 vocabulary ID입니다.",
          },
          {
            symbol: "\\widetilde{\\mathbf x}",
            name: "corrupted sequence",
            description: "80/10/10 rule이 적용된 encoder 입력 전체입니다.",
          },
        ]}
        assumptions={[
          "Padding·special token을 selection에서 제외하는 규칙을 data collator와 함께 고정합니다.",
          "Static인지 epoch마다 다시 뽑는 dynamic masking인지 training recipe에 명시합니다.",
        ]}
        interpretation="MLM은 모든 위치의 joint likelihood를 직접 계산하는 left-to-right language model이 아닙니다. 일부 조건부 복원 문제를 반복해 contextual representation을 학습하며, [MASK] mismatch를 줄이기 위해 random·unchanged branch를 섞습니다."
      />
      <RecipeEvidenceViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>NSP는 BERT의 역사적 선택이지 encoder의 정의가 아니다</h3>
        <p>
          원 BERT의 Next Sentence Prediction은 segment B가 A 다음 문장인지{" "}
          <code>[CLS]</code> representation으로 분류했습니다. RoBERTa는 더 많은
          data·긴 training·dynamic masking을 함께 바꾸면서 NSP를 제거한 recipe도
          강할 수 있음을 보였습니다. 여러 요소가 동시에 달라졌으므로 NSP 하나의
          순수한 효과를 모든 조건에 일반화할 수는 없지만, MLM+NSP가 encoder
          pretraining의 필수 정의가 아니라는 점은 확인할 수 있습니다.
        </p>
        <p>
          ALBERT는 같은 문서의 두 segment 순서가 뒤집혔는지를 맞히는
          sentence-order prediction을 사용했습니다. ELECTRA는 작은 generator가
          바꾼 token인지 각 위치에서 판별해 더 많은 위치에 training signal을
          줍니다. 이 후속 model들은 시간순 목록보다 어떤 supervision
          bottleneck을 바꿨는지로 비교해야 합니다.
        </p>
      </div>

      <div
        id="paper-roberta"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          논문 읽기 · Recipe 재검토
        </p>
        <p className="mt-2 text-sm font-semibold">
          RoBERTa: A Robustly Optimized BERT Pretraining Approach
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          BERT가 충분히 학습되지 않았다는 문제를 제기하고 data·batch·training
          length·dynamic masking·NSP 제거를 함께 재검토합니다. 변경점이 여러
          개이므로 결과 전체를 NSP 단독 ablation으로 읽으면 안 됩니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://arxiv.org/abs/1907.11692"
          target="_blank"
          rel="noreferrer"
        >
          재현 조건과 ablation 보기
        </a>
      </div>
      <div
        id="paper-albert"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          논문 읽기 · Parameter sharing과 SOP
        </p>
        <p className="mt-2 text-sm font-semibold">
          ALBERT: A Lite BERT for Self-supervised Learning of Language
          Representations
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Embedding factorization과 cross-layer parameter sharing으로 memory를
          줄이고, 문장 간 coherence를 겨냥한 SOP를 사용합니다. SOP 결과와
          parameter reduction 결과는 서로 다른 설계 축으로 읽어야 합니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://arxiv.org/abs/1909.11942"
          target="_blank"
          rel="noreferrer"
        >
          ALBERT 설계와 실험 보기
        </a>
      </div>
      <div
        id="paper-electra"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          논문 읽기 · 더 조밀한 token supervision
        </p>
        <p className="mt-2 text-sm font-semibold">
          ELECTRA: Pre-training Text Encoders as Discriminators Rather Than
          Generators
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Generator가 넣은 plausible replacement인지 각 위치에서 판별해 selected
          position만 복원하는 MLM보다 조밀한 signal을 사용합니다. 같은
          compute에서의 보고 결과를 모든 generator·scale의 보편 우열로 확대하지
          않습니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://arxiv.org/abs/2003.10555"
          target="_blank"
          rel="noreferrer"
        >
          RTD objective와 compute 비교 보기
        </a>
      </div>
    </section>
  );
}
