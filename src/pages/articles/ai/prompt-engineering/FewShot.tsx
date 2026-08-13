import { CitationBlock } from "@/components/ui/citation";
import FewShotViz from "./viz/FewShotViz";
import { DesignViz, ICLViz } from "./viz/FewShotDetailViz";

export default function FewShot() {
  return (
    <section id="few-shot" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Few-shot은 예시 개수보다 경계 coverage와 순서 민감도가 중요하다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>In-context learning(ICL)</strong>은 model weight를 update하지 않고
          현재 request의 instruction과 demonstration을 조건으로 completion behavior가
          달라지는 사용 방식입니다. Instruction만 주면 zero-shot, 입력·출력 example을
          함께 주면 few-shot입니다. Context가 끝나면 demonstration도 사라지므로
          영구적으로 학습한 것과 같다고 보면 안 됩니다.
        </p>
        <p>
          Few-shot은 label 의미나 output format을 설명만으로 전달하기 어려울 때
          유용하지만, example을 많이 넣는다고 단조롭게 좋아지지는 않습니다. 운영
          distribution을 대표하는 사례, 서로 헷갈리는 decision boundary, minority
          class와 abstention을 포함하고 실제 request와 같은 serialization을 사용해야
          합니다.
        </p>
      </div>

      <div className="not-prose my-8"><FewShotViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div id="paper-gpt3-few-shot" className="not-prose scroll-mt-24">
          <CitationBlock source="Language Models are Few-Shot Learners" citeKey={4} href="https://arxiv.org/abs/2005.14165">
            GPT-3 논문은 gradient update 없이 text instruction과 demonstration으로
            여러 task를 수행하는 zero·one·few-shot evaluation을 대규모로 제시했습니다.
            해당 model family와 dataset의 결과이며 ICL이 영구 학습이거나 모든 task에서
            fine-tuning보다 낫다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </div>

      <div className="not-prose my-8"><DesignViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Example order와 label prior를 흔들어 본다</h3>
        <p>
          Few-shot prediction은 마지막 example, label frequency, prompt format에 민감할
          수 있습니다. 그래서 zero-shot baseline을 먼저 저장하고, example subset과
          순서를 여러 번 바꾸며 class별 accuracy·prediction variance를 측정합니다.
          한 ordering에서만 좋아진다면 task rule을 배운 것이 아니라 recency나 label
          prior에 기대고 있을 수 있습니다.
        </p>
        <div id="paper-calibrate-before-use" className="not-prose scroll-mt-24">
          <CitationBlock source="Calibrate Before Use" citeKey={5} href="https://arxiv.org/abs/2102.09690">
            이 논문은 few-shot text classification이 prompt format·example·ordering에
            민감한 문제를 다루고 content-free input으로 output bias를 보정하는
            contextual calibration을 제안했습니다. 해당 GPT-3 시점의 classification
            설정이며 모든 generative task의 example selection 문제를 해결한 것은 아닙니다.
          </CitationBlock>
        </div>
      </div>

      <div className="not-prose my-8"><ICLViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Few-shot은 즉시 고치기 쉽지만 매 request에 example token과 prefill cost가
          반복됩니다. 같은 behavior를 높은 volume에서 오래 유지해야 하고 example이
          계속 늘어난다면 fine-tuning이나 별도 classifier를 비교합니다. 이때 prompt로
          다듬은 examples와 failure cases는 학습 데이터와 evaluation set의 출발점이
          될 수 있지만, train/eval leakage는 분리해야 합니다.
        </p>
      </div>
    </section>
  );
}
