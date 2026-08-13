import { Link } from "react-router-dom";
import PriorCostViz from "./viz/PriorCostViz";

export default function CNNvsTransformer() {
  return (
    <section id="cnn-vs-transformer" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        CNN과 Vision Transformer는 prior와 비용의 위치가 다르다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          CNN은 local neighborhood와 weight sharing을 architecture에 강하게 넣습니다.
          Vision Transformer는 image를 patch token으로 바꾸고 attention으로 patch
          관계를 학습하므로 더 유연하지만, dense attention은 token 수의 제곱에
          비례하는 score matrix를 만듭니다. ViT 원 논문의 강한 결과도 large-scale
          pretraining과 transfer라는 실험 조건 안에서 읽어야 합니다.
        </p>
      </div>
      <PriorCostViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          실제 system은 두 계열을 이분법으로 나누지 않습니다. Convolutional stem,
          window attention, hierarchical feature pyramid, large-kernel ConvNeXt block을
          섞을 수 있습니다. Resolution·data scale·latency·activation memory·target
          accelerator와 task의 local/global relation을 같은 benchmark에서 비교해야
          합니다.
        </p>
        <p>
          Patch embedding과 attention cost는 <Link to="/ai/vision-transformer">Vision
          Transformer 글</Link>에서 이어집니다. CNN이 항상 small data에 우월하거나
          ViT가 언제나 global structure를 더 잘 본다는 고정 규칙 대신 pretrained
          checkpoint와 augmentation·compute budget을 포함한 실제 evidence를 사용합니다.
        </p>
      </div>

      <div id="paper-vit" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Architecture prior 비교</p>
        <p className="mt-2 text-sm font-semibold">An Image is Worth 16×16 Words: Transformers for Image Recognition at Scale</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Image patch를 token sequence로 바꾸고 pure Transformer encoder를 대규모
          data에서 pretraining한 뒤 image classification에 transfer했습니다. 제한된
          data·동일하지 않은 augmentation·compute 조건까지 무시한 채 ViT가 CNN보다
          본질적으로 우월하다고 일반화할 수는 없습니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/2010.11929" target="_blank" rel="noreferrer">원 논문의 pretraining scale·transfer 결과 보기</a>
      </div>
    </section>
  );
}
