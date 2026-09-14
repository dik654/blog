import { Link } from "react-router-dom";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import GateViz from "./viz/GateViz";

export default function BudgetGate() {
  return (
    <section id="budget-gate" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">어느 항이 넘치는지부터 가릅니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          메모리 부족을 만나면 바로 배치를 줄이는 경우가 많은데, 그 전에 어느 항이 문제인지 확인하는 편이
          빠릅니다. 가중치 항이 이미 장치를 채우고 있으면 배치를 1로 줄여도 해결되지 않고, activation 항이
          문제면 부품을 내려도 소용이 없습니다.
        </p>

        <p className="leading-7">
          가르는 방법은 단순합니다. 모델만 올린 직후의 사용량을 한 번 재면 그것이 첫 번째 항입니다. 거기서
          한 스텝을 돌렸을 때의 증가분이 나머지입니다. 이 두 숫자만 있으면 어느 손잡이를 잡아야 할지가 정해집니다.
        </p>

        <p className="leading-7">
          첫 번째 항이 문제라면 사전계산으로 부품을 내리거나 양자화로 dtype을 낮춥니다. 세 번째 항이 문제라면
          gradient checkpointing이나 배치·해상도 조정입니다. 두 번째 항이 문제인 경우는 전체 미세조정을 하고
          있을 때뿐이고, 그때는 어댑터 방식으로 바꾸는 것이 답입니다.
        </p>
      </div>

      <GateViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          마지막으로 이 글이 세운 계산의 한계를 적어 둡니다. 여기서 센 것은 텐서 크기의 합이고, 실제 사용량은
          메모리 할당기의 단편화와 통신 버퍼, 커널 작업 공간 때문에 더 큽니다. 그래서 계산값은 "여기에는 절대
          안 들어간다"를 판정하는 하한으로 쓰고, 들어갈지 여부는 실제로 한 스텝 돌려 확인해야 합니다.
        </p>
      </div>

      <div className="mt-6">
        <ProgressiveDetail
          title="영상 모델에서 달라지는 부분"
          preview="프레임 수가 activation 항에 그대로 곱해지고, 시간축 모듈과 추가 인코더가 첫 번째 항을 키웁니다."
        >
          <p className="leading-7">
            영상 파이프라인에서는 한 샘플이 프레임 여러 장입니다. activation 항이 프레임 수에 비례해 커지므로
            이미지에서 쓰던 배치 크기를 그대로 옮기면 거의 항상 넘칩니다. 클립 길이를 줄이거나 프레임을 나눠
            처리하는 구성이 필요합니다.
          </p>
          <p className="leading-7">
            부품도 늘어납니다. 시간축을 다루는 모듈이 denoiser에 더해지고, 구성에 따라 별도의 영상 인코더가
            붙습니다. 첫 번째 항을 셀 때 이 부품들을 빠뜨리지 않아야 합니다.
          </p>
          <p className="leading-7">
            사전계산의 이득은 영상에서 더 큽니다. 프레임마다 인코딩이 필요하므로 매 스텝 비용이 크고, 미리
            계산해 두면 그 비용과 상주 메모리가 함께 사라집니다. 대신 저장량은 프레임 수만큼 늘어납니다.
            영상 LoRA의 학습 대상 범위는{" "}
            <Link to="/cs/ai/image-video-lora-architecture#video-scope">이미지·영상 LoRA 구조</Link>에서 다룹니다.
          </p>
        </ProgressiveDetail>
      </div>
    </section>
  );
}
