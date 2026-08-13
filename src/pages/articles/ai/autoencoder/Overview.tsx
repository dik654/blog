import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import OverviewViz from "./viz/OverviewViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Autoencoder는 입력을 복사하는 network가 아니라, 무엇을 남길지 제약하는 학습 문제입니다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          사진을 작은 파일로 압축했다가 다시 펼친다고 생각해 봅시다. 압축된 파일에
          원본의 모든 pixel을 그대로 넣을 수 없다면, 복원에 반복해서 필요한 패턴부터
          남겨야 합니다. <strong>Autoencoder</strong>도 같은 방식으로 입력
          <code>x</code>를 latent representation <code>z</code>로 바꾸고, 그
          representation만으로 reconstruction <code>x̂</code>를 만듭니다.
        </p>
        <p>
          학습에는 별도의 class label이 필요하지 않습니다. 입력 자체를 target으로
          사용하기 때문입니다. 다만 “입력과 출력이 같다”는 조건만 주면 큰 network가
          identity function을 배워 아무 정보도 추리지 않을 수 있습니다. 따라서 작은
          bottleneck, input corruption, sparse activation처럼 <strong>쉬운 복사를
          막는 제약</strong>이 autoencoder 설계의 핵심입니다.
        </p>
        <p>
          이 글은 <Link to="/ai/deep-learning-overview">신경망 학습의 기본 loop</Link>와{" "}
          <Link to="/ai/backprop-optimization">chain rule·backpropagation</Link>을
          재사용합니다. 먼저 deterministic autoencoder의 계산과 loss를 숫자로
          확인하고, linear autoencoder가 PCA와 연결되는 정확한 조건을 살펴봅니다.
          이후 denoising·anomaly detection·masked autoencoder로 범위를 넓히며,
          probability distribution을 latent에 도입하는 방법은{" "}
          <Link to="/ai/vae">VAE 글</Link>에서 이어집니다.
        </p>
      </div>

      <ContentBoundary article="autoencoder" />

      <div
        id="paper-deep-autoencoder"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">논문 읽기 · Nonlinear dimensionality reduction</p>
        <p className="mt-2 text-sm font-semibold">Reducing the Dimensionality of Data with Neural Networks</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Hinton과 Salakhutdinov는 작은 중앙 layer를 둔 deep network로 고차원
          입력을 low-dimensional code로 바꾼 뒤 복원했습니다. 이 결과는 논문에서
          사용한 pretraining·dataset·architecture 조건의 실험 근거이며, 모든
          nonlinear autoencoder가 PCA보다 우월하다는 보편 정리는 아닙니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://doi.org/10.1126/science.1127647"
          target="_blank"
          rel="noreferrer"
        >
          원 논문의 문제 설정과 실험 보기
        </a>
      </div>

      <div className="not-prose mt-8">
        <OverviewViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>이 글을 읽고 구분할 수 있어야 하는 것</h3>
        <p>
          Reconstruction loss와 representation quality는 같은 지표가 아닙니다.
          Training sample을 거의 완벽히 외운 model은 reconstruction은 잘해도 새로운
          sample이나 downstream task에는 도움이 되지 않을 수 있습니다. 따라서 이
          글의 마지막에는 reconstruction, generalization, latent usefulness를 서로
          다른 평가 축으로 나눕니다.
        </p>
      </div>
    </section>
  );
}
