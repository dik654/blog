import { Link } from "react-router-dom";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import TermBreakdown from "@/components/articles/term-breakdown";
import PrecomputeViz from "./viz/PrecomputeViz";

export default function PrecomputeOffload() {
  return (
    <section id="precompute-offload" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">바뀌지 않는 계산은 미리 해 두고 부품을 내립니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          동결 부품의 출력은 학습이 진행돼도 변하지 않습니다. 같은 이미지와 캡션이면 첫 스텝의 결과와 마지막
          스텝의 결과가 같습니다. 그렇다면 학습을 시작하기 전에 전부 계산해 저장해 두고, 학습 중에는 그 부품을
          아예 장치에서 내릴 수 있습니다.
        </p>

        <p className="leading-7">
          앞의 예시 구성에서 이 방법을 쓰면 text encoder 9.4 GB와 autoencoder 0.17 GB가 통째로 빠집니다.
          남는 것은 denoiser 5.2 GB와 어댑터 관련 항, 그리고 activation입니다. 같은 장치에서 배치를 훨씬 크게
          잡을 수 있게 됩니다.
        </p>

        <p className="leading-7">
          대가는 디스크와 유연성입니다. 잠재 표현과 문장 임베딩을 데이터셋 크기만큼 저장해야 하고, 미리 계산한
          시점의 설정에 묶입니다. 해상도를 바꾸거나 캡션을 수정하면 다시 계산해야 합니다.
        </p>
      </div>

      <AlgorithmBlock
        title="사전계산으로 부품을 내리는 절차"
        input={["학습 이미지와 캡션", "동결할 autoencoder와 text encoder", "고정할 전처리 설정"]}
        steps={[
          { code: "for batch in dataset: save(vae.encode(x), text_encoder(c))", note: "학습 전에 한 번만 전체를 훑습니다" },
          { code: "del vae, text_encoder; torch.cuda.empty_cache()", note: "두 부품을 장치에서 내립니다. 여기서 예산이 크게 줄어듭니다" },
          { code: "loader = PrecomputedDataset(latents, embeds)", note: "학습 루프는 미리 계산한 텐서를 읽기만 합니다" },
          { code: "train(denoiser + adapter, loader)", note: "남은 부품만 장치에 있습니다" },
        ]}
        output="같은 장치에서 더 큰 배치 또는 더 높은 해상도로 학습"
      />

      <PrecomputeViz />

      <TermBreakdown
        title="사전계산을 쓸 수 없는 조건"
        description="출력이 매 스텝 달라지면 미리 계산해 둘 수 없습니다."
        items={[
          {
            term: "무작위 이미지 증강",
            description: "스텝마다 자르기나 뒤집기가 달라지면 잠재 표현도 달라집니다.",
            example: "증강을 끄거나, 증강 조합마다 미리 계산해 두는 방식으로 우회합니다.",
            boundary: "미리 계산해 두면 증강 다양성이 그만큼 고정됩니다.",
          },
          {
            term: "캡션 드롭아웃",
            description: "조건 없는 생성을 함께 학습하려고 캡션을 무작위로 비우는 경우입니다.",
            example: "빈 캡션 임베딩 하나만 따로 저장해 두면 대응됩니다.",
            boundary: "드롭아웃 비율이 복잡하면 저장 경우의 수가 늘어납니다.",
          },
          {
            term: "인코더도 함께 학습",
            description: "text encoder를 함께 학습하면 출력이 스텝마다 바뀝니다.",
            example: "이 경우 사전계산이 불가능하고 오히려 예산이 더 늘어납니다.",
            boundary: "예산이 빠듯하다면 이 선택 자체를 재검토합니다.",
          },
        ]}
      />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          사전계산을 쓸 수 없을 때 남는 손잡이는 셋입니다. 부품을 필요할 때만 장치로 올리는 offload, 중간 값을
          버리고 역전파에서 다시 계산하는 gradient checkpointing, 그리고 배치·해상도·프레임 수를 줄이는 것입니다.
          앞의 둘은 메모리를 시간과 바꾸고 마지막은 학습 조건 자체를 바꿉니다.
        </p>

        <p className="leading-7">
          gradient checkpointing이 줄이는 것은 세 번째 항뿐이라는 점도 기억할 만합니다. 가중치 상주량은 그대로
          이므로, 첫 번째 항이 이미 장치를 채우고 있다면 이 기법으로는 해결되지 않습니다. 어느 항이 문제인지
          먼저 가르는 것이 순서입니다. 이 기법의 시간·메모리 교환은{" "}
          <Link to="/cs/ai/training-memory-budget#checkpointing">학습 메모리 예산</Link>에서 다룹니다.
        </p>
      </div>
    </section>
  );
}
