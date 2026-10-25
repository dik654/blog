import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import VisionTransformerLocator from "./VisionTransformerLocator";
import VisionTransformerTraceViz from "./viz/VisionTransformerTraceViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <VisionTransformerLocator />
      <h2 className="mb-6 text-2xl font-bold">전체 경로</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          224×224×3 이미지를 16×16 조각으로 나누면 196개가 됩니다. 각 조각을 같은
          projection으로 바꾸고 맨 앞에 <code>[CLS]</code>를 붙이면 Transformer가 읽는
          길이 197의 sequence가 됩니다. Vision Transformer(ViT)의 출발점은 바로 이
          <strong> image에서 token sequence로 넘어가는 입력 계약</strong>입니다.
        </p>
      </div>
      <ContentBoundary article="vision-transformer" />
      <VisionTransformerTraceViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          그림은 왼쪽 image부터 읽습니다. 크기를 나누어 patch 수를 정하고, patch마다
          같은 projection을 적용한 뒤, <code>[CLS]</code>와 위치를 더합니다. Encoder는
          이 sequence의 길이를 유지한 채 token 사이 관계를 갱신하고 마지막
          <code>[CLS]</code> 출력을 class logit으로 바꿉니다.
        </p>
        <p>
          CNN은 작은 kernel을 모든 위치에 공유해 가까운 pixel과 이동에 관한 가정을
          구조에 넣습니다. 반면 ViT는 고정 크기 patch, position signal, pretraining
          objective로 공간 정보를 넣습니다. 그래서 어느 쪽이 더 새롭다는 비교보다
          <strong> 공간 가정이 어느 단계에 들어가는지</strong>를 봐야 합니다.
        </p>
        <p>
          Image tensor와 convolution은 <Link to="/cs/ai/cnn">CNN 글</Link>, Q·K·V와
          self-attention은 <Link to="/cs/ai/attention-theory">attention 글</Link>,
          encoder block은 <Link to="/cs/ai/transformer-architecture">Transformer 글</Link>에서
          설명합니다. 여기서는 같은 image의 shape가 어떻게 바뀌는지만 끝까지 추적합니다.
        </p>
      </div>
      <div id="paper-vit-core" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">원 논문 · Vision Transformer</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Dosovitskiy 등은 image patch를 linear embedding sequence로 바꾸고 Transformer encoder에 넣었습니다.
          논문이 보고한 결과는 대규모 supervised pretraining 뒤 여러 image benchmark로 transfer한 범위입니다.
          이를 작은 dataset에서 처음부터 학습할 때도 항상 우월하다는 뜻으로 넓히면 안 됩니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://arxiv.org/abs/2010.11929"
          target="_blank"
          rel="noreferrer"
        >
          Patch sequence와 pretraining 범위 보기
        </a>
      </div>
    </section>
  );
}
