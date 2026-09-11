import { Link } from "react-router-dom";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import ScopeViz from "./viz/ScopeViz";

export default function AdapterScope() {
  return (
    <section id="adapter-scope" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">어댑터가 줄이는 항목은 하나뿐입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          LoRA를 쓰면 optimizer가 받는 파라미터 목록이 어댑터로 한정됩니다. 학습 스크립트에서 gradient를 받는
          텐서만 골라 optimizer에 넘기는 한 줄이 그 경계입니다. 그래서 gradient와 optimizer state가 함께
          작아지고, 체크포인트 크기도 어댑터 크기로 줄어듭니다.
        </p>

        <p className="leading-7">
          줄지 않는 것이 둘 있습니다. base 가중치는 forward에 필요하므로 그대로 상주하고, activation은 역전파
          경로가 base 블록을 지나가므로 여전히 저장돼야 합니다. 어댑터가 중간에 끼어 있다는 것은 그 앞뒤 계산이
          모두 역전파 경로에 있다는 뜻입니다.
        </p>

        <p className="leading-7">
          base 가중치를 줄이려면 다른 손잡이가 필요합니다. 양자화가 그 방법이고, 양자화된 base 위에 어댑터를
          학습하는 조합이 널리 쓰입니다. 이때 줄어드는 것은 첫 번째 항이고 activation은 여전히 남습니다.
        </p>
      </div>

      <ScopeViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          어댑터를 어디에 붙일지도 메모리에 영향을 줍니다. denoiser의 attention에만 붙이면 그 블록의 역전파
          경로만 살아 있으면 되지만, 여러 부품에 걸쳐 붙이면 그 부품들의 activation이 모두 필요해집니다. 어느
          모듈을 target으로 삼을지의 기준은{" "}
          <Link to="/ai/image-video-lora-architecture#image-scope">이미지·영상 LoRA 구조</Link>에서 다룹니다.
        </p>

        <p className="leading-7">
          text encoder까지 함께 학습하는 구성도 있습니다. 이 경우 두 번째 항이 그 부품에도 붙고, 동결일 때는
          없던 activation 저장까지 생깁니다. 예산이 빠듯하면 이 선택부터 재검토하는 편이 낫습니다.
        </p>
      </div>

      <div className="mt-6">
        <ProgressiveDetail
          title="양자화된 base 위에 어댑터를 얹을 때 주의할 점"
          preview="가중치 항은 줄지만 계산 중에 원래 정밀도로 되돌리는 구간이 생기고, 어댑터는 보통 더 높은 정밀도로 둡니다."
        >
          <p className="leading-7">
            저장은 낮은 정밀도로 하고 계산은 필요한 순간에 되돌리는 방식이라, 순간적으로는 더 높은 정밀도의
            버퍼가 존재합니다. 가중치 항이 네 배 줄어도 실제 절감이 그만큼은 아닌 이유입니다.
          </p>
          <p className="leading-7">
            어댑터 자체는 보통 양자화하지 않습니다. 학습 대상이라 기울기가 흘러야 하고 크기도 작아 절감 효과가
            없기 때문입니다. 정밀도 경로를 구분해 적는 습관이 혼동을 줄입니다.
          </p>
          <p className="leading-7">
            저장·계산·학습 정밀도를 각각 어떻게 두는지의 정리는{" "}
            <Link to="/ai/lora-finetuning">LoRA 미세조정</Link>에 있고, 이 절은 그 선택이 부품이 여러 개인
            파이프라인에서 첫 번째 항에만 작용한다는 점을 더했습니다.
          </p>
        </ProgressiveDetail>
      </div>
    </section>
  );
}
