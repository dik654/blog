import SftDataViz from "./viz/SftDataViz";

export default function DataContract() {
  return (
    <section id="data-contract" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Demonstration은 prompt·response 문자열이 아니라 role·template·provenance가 있는 학습 example이다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
            한 example에는 system instruction, user request, assistant response, tool message가 함께 들어갈 수 있습니다. 이
            role을 special token과 구분자로 직렬화하는 것이 chat template입니다. 그래서 dataset을 만들 때 쓴 template과 serving
            template이 다르면 같은 문장도 다른 token sequence가 됩니다.
          </p>
        <p>
            사람이 작성했는지, 강한 model이 합성했는지, 어떤 filter와 deduplication을 거쳤는지도 provenance로 남깁니다. 좋은 response를 흉내 내는
            objective는 label의 오류까지 함께 흉내 냅니다. 그래서 style diversity·factual verification·contamination과 refusal
            balance가 단순 example 수보다 중요할 수 있습니다.
          </p>
      </div>
      <SftDataViz />
      <div id="paper-flan" className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4">
        <p className="text-xs font-bold text-primary">논문 해설 · Finetuned Language Models Are Zero-Shot Learners</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
            FLAN은 60개가 넘는 NLP task를 natural-language instruction template으로 표현해 137B pretrained model을
            instruction-tune하고 unseen task type의 zero-shot 성능을 평가했습니다. instruction mixture가 중요하다는 것은 task
            수·model scale·instruction 표현의 ablation이 보여 줍니다. 다만 그 ablation이 뒷받침하는 범위는 거기까지입니다. 모든 chat
            behavior와 안전성까지 SFT만으로 해결된다는 근거는 되지 않습니다.
          </p>
      </div>
      <div id="paper-self-instruct" className="not-prose mt-6 scroll-mt-24 border-l border-border/80 pl-4">
        <p className="text-xs font-bold text-primary">논문 해설 · Self-Instruct</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Self-Instruct가 제안한 것은 bootstrapping pipeline입니다. seed task에서 model이 instruction·input·output을 생성하고
            invalid·similar sample을 거른 뒤 그 결과를 다시 fine-tuning data로 씁니다. 공개 평가에서 나온 개선은 해당
            generator·filter·task distribution이 만든 결과이며 synthetic response의 사실성까지 자동으로 보장해 주지는 않습니다.
          </p>
      </div>
    </section>
  );
}
