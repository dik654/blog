import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import OverviewViz from "./viz/OverviewViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Vision Transformer는 image를 바로 읽지 않습니다. 먼저 2D 공간을 token sequence 계약으로 바꿉니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          CNN은 작은 kernel을 모든 위치에 공유해 가까운 pixel과 이동에 대한 prior를
          architecture에 넣습니다. ViT는 image를 고정 크기 patch로 자르고 각
          patch를 vector token으로 바꾼 뒤, 일반 Transformer encoder가 token 사이
          관계를 학습하게 합니다. 핵심 차이는 “attention이 더 최신”이라는 데 있지
          않고 <strong>공간에 관한 가정을 어디에서 제공하는가</strong>에 있습니다.
        </p>
        <p>
          Patch가 어느 좌표에서 왔는지 알려 주는 position signal, image 전체를
          어떤 token이나 pooling으로 요약할지, resolution이 바뀌었을 때 position
          grid를 어떻게 옮길지가 모두 model contract입니다. 이 계약이 맞아야
          pretrained representation도 의미 있게 이어집니다.
        </p>
        <p>
          Image tensor와 convolution은 <Link to="/ai/cnn">CNN 정본</Link>, Q·K·V와
          self-attention은 <Link to="/ai/attention-theory">attention 정본</Link>,
          encoder block은 <Link to="/ai/transformer-architecture">Transformer 정본</Link>을
          재사용합니다. 이 글은 그 계산을 반복하지 않고 image→patch token 변환과
          DeiT·Swin·MAE가 바꾼 병목, checkpoint 호환성에 집중합니다.
        </p>
      </div>
      <ContentBoundary article="vision-transformer" />
      <div className="not-prose my-8"><OverviewViz /></div>
      <div id="paper-vit-core" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Vision Transformer</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Dosovitskiy 등은 image patch를 linear embedding sequence로 바꾸고 standard Transformer encoder를 large-scale supervised pretraining한 뒤 여러 image task로 transfer했습니다. JFT·ImageNet-21k 규모와 recipe를 제외한 채 작은 dataset scratch training의 보편적 우월성으로 읽으면 안 됩니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://openreview.net/forum?id=YicbFdNTTy" target="_blank" rel="noreferrer">Tokenization·pretraining·transfer 범위 보기</a>
      </div>
    </section>
  );
}
