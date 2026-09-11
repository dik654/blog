import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import TermBreakdown from "@/components/articles/term-breakdown";
import { codeRefs } from "./codeRefs";
import FreezeViz from "./viz/FreezeViz";

export default function ResidencySet({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="residency-set" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">동결은 배우지 않는다는 뜻이지 없어도 된다는 뜻이 아닙니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          공식 학습 스크립트를 열어 보면 세 부품을 모두 동결한 다음 셋 다 장치로 옮깁니다. 이 두 줄이 이 글의
          전체 논지를 담고 있습니다. 동결은 gradient를 만들지 않겠다는 선언이고, 장치로 옮기는 것은 계산에
          참여시키겠다는 선언입니다. 둘은 독립입니다.
        </p>

        <p className="leading-7">
          동결된 부품에서 줄어드는 것은 두 가지뿐입니다. 그 파라미터의 gradient와 optimizer state입니다.
          가중치 자체는 forward를 돌려야 하니 그대로 있어야 하고, forward 중에 만들어진 중간 값도 뒤에서
          역전파가 지나갈 경로에 있으면 남아 있어야 합니다.
        </p>

        <p className="leading-7">
          그래서 학습 중 장치에 있는 것을 네 갈래로 나누면 계산이 쉬워집니다. 학습 대상 파라미터, 그 파라미터의
          gradient와 optimizer state, 동결 부품의 가중치, 그리고 모든 부품이 남기는 activation입니다. 앞의
          둘만 어댑터 크기에 비례하고 나머지는 그렇지 않습니다.
        </p>
      </div>

      <FreezeViz />

      <div className="not-prose mt-6 flex flex-wrap items-center gap-2">
        <CodeViewButton onClick={() => onCodeRef("freeze-and-move", codeRefs["freeze-and-move"])} />
        <span className="text-xs text-muted-foreground">세 부품을 동결한 뒤 셋 다 장치로 옮기는 부분</span>
      </div>

      <TermBreakdown
        title="학습 중 장치에 있는 네 갈래"
        description="무엇이 어댑터 크기에 비례하고 무엇이 그렇지 않은지가 판단의 핵심입니다."
        items={[
          {
            term: "학습 대상 파라미터",
            description: "어댑터처럼 gradient를 받는 텐서입니다. LoRA에서는 전체의 1% 미만인 경우가 흔합니다.",
            example: "rank 16 어댑터 수백만 개는 bf16으로 수 MB 수준입니다.",
            boundary: "이 항목만 보고 전체 메모리를 추정하면 실제와 크게 어긋납니다.",
          },
          {
            term: "gradient와 optimizer state",
            description: "학습 대상에만 붙습니다. Adam 계열이면 파라미터당 여러 벌의 상태가 추가됩니다.",
            example: "어댑터만 학습하면 이 항목도 어댑터 크기에 비례해 작아집니다.",
            boundary: "전체 미세조정으로 바꾸는 순간 이 항목이 지배적이 됩니다.",
          },
          {
            term: "동결 부품 가중치",
            description: "학습하지 않아도 forward를 돌려야 하므로 전부 상주합니다.",
            example: "denoiser·autoencoder·text encoder의 가중치 합이 그대로 들어갑니다.",
            boundary: "dtype을 낮추면 줄지만 품질과 수치 안정성을 함께 봐야 합니다.",
          },
          {
            term: "activation",
            description: "역전파가 지나갈 경로의 중간 값입니다. 배치 크기와 해상도, 영상이면 프레임 수에 비례합니다.",
            example: "해상도를 두 배로 올리면 픽셀 수가 네 배가 되어 이 항목이 가장 빠르게 커집니다.",
            boundary: "gradient checkpointing으로 줄일 수 있지만 재계산 시간이 늘어납니다.",
          },
        ]}
      />

      <h3 id="frozen-forward" className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold">
        매 스텝 호출되기 때문에 내릴 수 없습니다
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          학습 루프를 보면 이유가 분명해집니다. 스텝마다 이미지를 autoencoder로 잠재 표현으로 바꾸고, 캡션을
          text encoder로 임베딩으로 바꾼 뒤, denoiser가 그 둘을 받습니다. 세 호출이 한 스텝 안에 모두 들어
          있으므로 어느 하나도 내려 둘 수 없습니다.
        </p>

        <p className="leading-7">
          여기서 중요한 관찰이 하나 나옵니다. 이 두 호출의 입력은 학습이 진행돼도 변하지 않습니다. 같은 이미지와
          같은 캡션이면 언제 돌려도 같은 결과가 나옵니다. 학습 대상이 아니기 때문입니다. 그렇다면 매 스텝 다시
          계산할 이유도 없습니다.
        </p>

        <p className="leading-7">
          이 관찰이 뒤에서 볼 사전계산의 근거입니다. 결과를 미리 구해 두면 두 부품을 학습 중에 아예 장치에서
          내릴 수 있고, 그만큼이 통째로 예산에서 빠집니다. 다만 데이터 증강이 이 전제를 깨뜨리는 경우가 있어
          조건을 확인해야 합니다.
        </p>
      </div>

      <div className="not-prose mt-6 flex flex-wrap items-center gap-2">
        <CodeViewButton onClick={() => onCodeRef("per-step-forward", codeRefs["per-step-forward"])} />
        <span className="text-xs text-muted-foreground">매 스텝 autoencoder와 text encoder를 호출하는 루프</span>
      </div>
    </section>
  );
}
