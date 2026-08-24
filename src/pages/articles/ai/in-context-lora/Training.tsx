import { Link } from "react-router-dom";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function Training({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="training" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Target만 노이즈를 섞고, reference는 clean한 채로 이어붙인다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          IC-LoRA는 새 objective를 만들지 않습니다. 학습 목적함수는{" "}
          <Link to="/ai/diffusion-continuous-time#flow-matching">
            flow matching
          </Link>{" "}
          그대로이고, IC-LoRA가 바꾸는 것은 그 objective를 <em>어느 latent에</em>{" "}
          적용하는가입니다. Reference는 이미 완성된 데이터로 취급해 forward
          noise를 전혀 섞지 않고, target에만 flow matching의 직선 보간
          <code>x_t=(1-t)x_0+tx_1</code>을 적용합니다.
        </p>
      </div>

      <ExplainedFormula
        title="Reference는 clean, target만 noised — 한 sequence 안 두 처리"
        question="Reference와 target을 하나의 attention sequence에 이어붙일 때, 학습 objective는 둘을 어떻게 다르게 처리할까요?"
        idea={
          <>
            Flow matching의 직선 보간은 <code>target</code>에만 적용합니다.
            <code>reference</code>는 <code>t=0</code>에 고정된 것처럼 노이즈
            없이 그대로 두어, model이 "이미 주어진 조건"과 "지금 생성해야 할
            대상"을 구분할 수 있게 합니다.
          </>
        }
        formula={String.raw`\begin{aligned}
          z_\text{ref} &= x_0^{\text{ref}} \\
          z_t^{\text{tgt}} &= (1-t)\,x_0^{\text{tgt}} + t\,x_1^{\text{tgt}} \\
          u_t^{\text{tgt}} &= x_1^{\text{tgt}} - x_0^{\text{tgt}} \\
          z &= \mathrm{concat}(z_\text{ref},\, z_t^{\text{tgt}})
        \end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
          z_\text{ref} &= \underbrace{x_0^{\text{ref}}}_{\text{concatenated context 계산}} \\
          z_t^{\text{tgt}} &= \underbrace{(1-t)\,x_0^{\text{tgt}} + t\,x_1^{\text{tgt}}}_{\text{표준 Gaussian noise 계산}} \\
          u_t^{\text{tgt}} &= \underbrace{x_1^{\text{tgt}} - x_0^{\text{tgt}}}_{\text{velocity target 계산}} \\
          z &= \mathrm{concat}(z_\text{ref},\, z_t^{\text{tgt}})
        \end{aligned}`}
        operations={[
          { expression: String.raw`x_0^{\text{ref}}`, annotation: ["concatenated context이(가) 식의 결과에","기여하는 방식을 계산합니다.","Flow matching의 직선 보간은 target 에만","적용합니다."] },
          { expression: String.raw`(1-t)\,x_0^{\text{tgt}} + t\,x_1^{\text{tgt}}`, annotation: ["표준 Gaussian noise이(가) 식의 결과에 기여하는","방식을 계산합니다.","Flow matching의 직선 보간은 target 에만","적용합니다."] },
          { expression: String.raw`x_1^{\text{tgt}} - x_0^{\text{tgt}}`, annotation: ["velocity target이(가) 식의 결과에 기여하는","방식을 계산합니다.","Flow matching의 직선 보간은 target 에만","적용합니다."] },
        ]}
        terms={[
          {
            symbol: String.raw`x_0^{\text{ref}}, x_0^{\text{tgt}}`,
            name: "clean latent",
            description:
              "Reference와 target의 노이즈 없는 원본 latent입니다.",
          },
          {
            symbol: "x_1",
            name: "표준 Gaussian noise",
            description:
              "diffusion-continuous-time의 flow matching과 동일한 noise 항입니다.",
          },
          {
            symbol: String.raw`u_t^{\text{tgt}}`,
            name: "velocity target",
            description: "Model이 예측해야 할 대상이며, target 위치에만 존재합니다.",
          },
          {
            symbol: "z",
            name: "concatenated context",
            description:
              "Clean reference와 noised target을 이어붙인, self-attention이 실제로 보는 sequence입니다.",
          },
        ]}
        assumptions={[
          "Base model이 flow-matching objective로 사전학습된 DiT라고 가정합니다.",
          "Reference와 target이 같은 latent space(같은 VAE encoder)에서 나온다고 가정합니다.",
        ]}
        interpretation="이 식은 '어떤 latent에 노이즈를 섞는가'만 규정합니다. Loss가 실제로 어느 위치에 걸리는지, position이 어떻게 부여되는지는 별도로 확인해야 합니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Reference를 '과거'로 명시하는 negative position</h3>
        <p>
          Context를 이어붙이기만 하면{" "}
          <Link to="/ai/yarn-rope-extension#rope-foundation">RoPE</Link>
          는 reference와 target을 같은 시간축 위의 서로 다른 위치로
          해석합니다. 이 위치 순서가 뒤섞이지 않도록, ID-LoRA는 reference
          block 전체를 target(<code>t=0</code>에서 시작)보다 확실히 이전
          시점으로 밀어 넣는 negative position을 부여합니다.
        </p>
      </div>

      <ExplainedFormula
        title="Reference block을 통째로 과거 시점으로 미는 offset"
        question="Reference가 target보다 항상 이전 시점으로 읽히도록 position을 어떻게 정할까요?"
        idea={
          <>
            Reference에 target과 같은 방식으로 우선 '보통' 위치를 계산한 뒤,
            그 구간의 전체 길이(<code>duration</code>)와 한 latent frame의
            시간 간격(<code>Δt</code>)만큼을 빼서 block 전체를 과거로 밀어
            넣습니다.
          </>
        }
        formula={String.raw`p'_{\text{ref}} = p_{\text{ref}} - \text{duration}_{\text{ref}} - \Delta t`}
        annotatedFormula={String.raw`p'_{\text{ref}} = \underbrace{p_{\text{ref}} - \text{duration}_{\text{ref}} - \Delta t}_{\text{변화량 계산}}`}
        operations={[
          { expression: String.raw`p_{\text{ref}} - \text{duration}_{\text{ref}} - \Delta t`, annotation: ["인접한 level의 차이를 남겨 변화량을 계산합니다.","Reference에 target과 같은 방식으로 우선 '보통'","위치를 계산한 뒤, 그 구간의 전체 길이( duration",")와 한 latent frame의 시간 간격( Δt )만큼을"] },
        ]}
        terms={[
          {
            symbol: "p_{\\text{ref}}",
            name: "표준 position",
            description:
              "Target과 동일한 함수로 계산한, reference 구간 안에서의 상대 위치입니다.",
          },
          {
            symbol: String.raw`\text{duration}_{\text{ref}}`,
            name: "reference 구간 길이",
            description: "Reference 구간의 마지막 위치(끝나는 시각)입니다.",
          },
          {
            symbol: String.raw`\Delta t`,
            name: "한 latent frame의 시간 간격",
            description:
              "Reference와 target 사이에 최소 한 칸의 간격을 남겨 경계가 겹치지 않게 합니다.",
          },
        ]}
        assumptions={[
          "Position embedding이 RoPE처럼 상대 회전으로 encode되어, 음수 위치도 유효한 상대 관계를 표현할 수 있다고 가정합니다.",
        ]}
        interpretation="이 offset은 reference를 위한 별도 position 공식을 새로 만들지 않고, target과 같은 함수의 결과를 통째로 이동시키는 방식입니다. RoPE가 아닌 절대 position embedding에는 그대로 옮기기 어렵습니다."
      />

      <AlgorithmBlock
        title="IC-LoRA — reference·target 한 쌍의 학습 step"
        input={[
          "x0_ref ~ clean reference latent",
          "x0_tgt ~ clean target latent",
          "Base DiT weight (frozen), LoRA A·B (학습 대상)",
        ]}
        steps={[
          {
            code: "t ~ timestep_sampler, x1_tgt ~ N(0, I)",
            note: "Target에만 적용할 flow-matching timestep과 noise를 샘플링합니다.",
          },
          {
            code: "z_tgt = (1 - t) * x0_tgt + t * x1_tgt",
            note: "diffusion-continuous-time의 직선 보간 — target만 noised.",
          },
          {
            code: "u_tgt = x1_tgt - x0_tgt",
            note: "Model이 target 위치에서 예측해야 할 velocity target입니다.",
          },
          {
            code: "z_ref = x0_ref",
            note: "Reference는 노이즈를 섞지 않고 clean 상태 그대로 둡니다.",
          },
          {
            code: "z = concat([z_ref, z_tgt], dim=sequence)",
            note: "별도 cross-attention 없이 하나의 attention sequence로 이어붙입니다.",
          },
          {
            code: "p_ref = get_positions(ref) - duration_ref - Δt; p_tgt = get_positions(tgt)",
            note: "Reference는 negative position, target은 t=0에서 시작하는 표준 position입니다.",
          },
          {
            code: "u_hat = DiT_theta(z, positions=concat([p_ref, p_tgt]))",
            note: "Base weight는 frozen, LoRA A·B만 gradient를 받습니다.",
          },
          {
            code: "loss = mean(((u_hat - u_tgt) ** 2)[loss_mask])",
            note: "loss_mask는 reference 위치 0, target 위치만 1 — reference는 조건일 뿐 예측 대상이 아닙니다.",
          },
        ]}
        output="학습된 LoRA A·B (base DiT weight는 변경 없음)"
        repeatUntil="Validation에서 reference를 따르는 target 생성 품질이 더 개선되지 않을 때까지 반복합니다."
      />
      <CodeViewButton
        onClick={() =>
          onCodeRef("reference-conditioning", codeRefs["reference-conditioning"])
        }
      />

      <TermBreakdown
        title="학습이 도입하는 두 개념"
        items={[
          {
            term: "flow-matching reference conditioning",
            description:
              "Target에만 forward noise를 적용하고 reference는 clean 상태로 유지하는 학습 절차입니다.",
            example:
              "noisy_target_audio = (1-t)*target_audio_latents + t*audio_noise로 target에만 보간을 적용하고, reference audio latent는 그대로 사용합니다.",
            boundary:
              "Reference도 noise를 섞으면 model이 무엇을 조건으로 삼아야 할지 모호해져 in-context 신호가 약해집니다.",
          },
          {
            term: "negative temporal position conditioning",
            description:
              "Reference block에 target보다 이전 시점의 negative position을 부여해 시간축 순서를 명시하는 방법입니다.",
            example:
              "positions = positions - audio_duration - time_per_latent로 reference 전체를 target(t=0에서 시작)보다 확실히 이전 시점으로 밀어 넣습니다.",
            boundary:
              "RoPE처럼 상대 위치가 회전으로 encode되는 position embedding에서만 의미가 있으며, 절대 위치를 그대로 학습하는 방식에는 적용하기 어렵습니다.",
          },
        ]}
      />
    </section>
  );
}
