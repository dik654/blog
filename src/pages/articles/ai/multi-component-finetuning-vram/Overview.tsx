import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ResidencyViz from "./viz/ResidencyViz";

export default function Overview() {
  return (
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">추론과 학습은 올려 두는 집합이 다릅니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          "어댑터만 학습하니까 메모리는 얼마 안 들겠지"라고 생각했다가 시작하자마자 메모리 부족을 만나는 일이
          흔합니다. 학습하는 파라미터 수와 장치에 올려 둬야 하는 양은 다른 이야기이고, 특히 부품이 여러 개인
          생성 파이프라인에서는 그 차이가 몇 배로 벌어집니다.
        </p>

        <p className="leading-7">
          텍스트로 이미지를 만드는 파이프라인에는 최소 세 부품이 있습니다. 이미지를 잠재 표현으로 바꾸는
          autoencoder, 문장을 임베딩으로 바꾸는 text encoder, 그리고 잡음을 걷어 내는 denoiser입니다. 영상
          모델이면 시간축을 다루는 모듈이 더해지고, text encoder가 둘 이상인 구성도 있습니다.
        </p>

        <p className="leading-7">
          추론할 때는 이 부품들을 순서대로 한 번씩 쓰고 지나갑니다. 그래서 필요하면 하나씩 올렸다 내릴 수
          있습니다. 학습은 다릅니다. 매 스텝마다 같은 순서를 반복하므로 부품을 내렸다 올리면 그 비용이 스텝
          수만큼 곱해집니다. 결국 전부 올려 둔 채로 도는 것이 기본 구성이 됩니다.
        </p>

        <ContentBoundary article="multi-component-finetuning-vram" />

        <p className="leading-7">
          이 글은 그래서 세 가지를 계산합니다. 학습 중 장치에 상주해야 하는 집합이 무엇인지, 부품마다 어떤
          항목이 몇 바이트인지, 그리고 그 합을 줄이는 방법이 무엇을 대가로 하는지입니다. 계산 방식만 잡아 두면
          모델이 바뀌어도 같은 표로 다시 셀 수 있습니다.
        </p>

        <p className="leading-7">
          단일 모델을 학습할 때의 가중치·gradient·optimizer state 회계는{" "}
          <Link to="/ai/training-memory-budget#memory-math">학습 메모리 예산</Link>이, 어댑터가 무엇을 학습
          대상으로 삼는지는{" "}
          <Link to="/ai/lora-finetuning">LoRA 미세조정</Link>이 소유합니다. 이 글은 그 둘을 부품이 여러 개인
          파이프라인에 적용할 때 새로 생기는 항목만 다룹니다.
        </p>
      </div>

      <ResidencyViz />
    </section>
  );
}
