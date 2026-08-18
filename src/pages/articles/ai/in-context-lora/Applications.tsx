import AlgorithmBlock from "@/components/ui/algorithm-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function Applications({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="applications" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        ID-LoRA — identity guidance와 two-stage 생성
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          ID-LoRA(2026)는 IC-LoRA를 audio-driven talking video에 적용해,
          reference 화자의 identity를 target 영상까지 유지하는 문제를
          풉니다. 학습은 앞 절의 IC-LoRA 절차 그대로지만, inference에는
          classifier-free guidance(CFG)와 같은 구조의 새 guidance 항을
          하나 더 추가합니다.
        </p>
      </div>

      <ExplainedFormula
        title="Identity guidance — CFG와 같은 구조, 다른 조건을 토글"
        question="Reference를 얼마나 강하게 반영할지 inference 때 조절하려면 어떻게 할까요?"
        idea={
          <>
            표준 CFG가 "text 조건 있음 vs 없음"의 예측 차이를 증폭하듯,
            identity guidance는 "reference가 context에 있음 vs 없음"의 예측
            차이를 증폭합니다. 토글하는 대상만 다를 뿐 delta를 더하는 구조는
            동일합니다.
          </>
        }
        formula={String.raw`\hat u_{\text{tgt}} = \hat u_{\text{tgt}}^{\,\text{pos}} + w_{\text{id}} \left(\hat u_{\text{tgt}}^{\,\text{ref}} - \hat u_{\text{tgt}}^{\,\text{noref}}\right)`}
        terms={[
          {
            symbol: String.raw`\hat u_{\text{tgt}}^{\,\text{pos}}`,
            name: "표준 CFG 적용 예측",
            description:
              "Text 조건까지 이미 CFG로 보정된, target 위치의 velocity 예측입니다.",
          },
          {
            symbol: String.raw`\hat u_{\text{tgt}}^{\,\text{ref}}`,
            name: "reference 있음 예측",
            description:
              "Reference audio가 context에 포함된 채로 계산한 target 예측입니다.",
          },
          {
            symbol: String.raw`\hat u_{\text{tgt}}^{\,\text{noref}}`,
            name: "reference 없음 예측",
            description:
              "같은 target에 대해 reference를 context에서 제거하고 다시 계산한 예측입니다.",
          },
          {
            symbol: String.raw`w_{\text{id}}`,
            name: "identity guidance scale",
            description:
              "Delta를 얼마나 강하게 더할지 정하는 계수이며, 0이면 identity guidance가 꺼집니다.",
          },
        ]}
        assumptions={[
          "Reference를 context에서 제거해도 model이 여전히 유효한 예측을 낼 수 있다고 가정합니다.",
          "Delta는 target 위치에만 적용하며, reference 자체 위치는 조건이므로 guidance 대상이 아닙니다.",
        ]}
        interpretation="이 식은 CFG의 '조건 있음-없음' 구조를 재사용한 것이지, 완전히 새로운 guidance 이론이 아닙니다. Scale을 올리면 identity는 강해지지만 매 step 추가 forward pass 비용이 함께 늘어납니다."
      />
      <CodeViewButton
        onClick={() =>
          onCodeRef("identity-guidance", codeRefs["identity-guidance"])
        }
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Identity guidance 비용을 two-stage로 나눠 감당한다</h3>
        <p>
          Identity guidance는 매 denoising step마다 reference-없는 예측을
          한 번 더 계산해야 해서 비용이 큽니다. ID-LoRA는 이 비용을 전체
          생성 과정에 걸쳐 부담하지 않고, identity가 자리 잡는 초반 단계에만
          집중시키는 two-stage serving으로 나눕니다.
        </p>
      </div>

      <AlgorithmBlock
        title="ID-LoRA — two-stage inference"
        input={[
          "reference audio·image, text/motion 조건",
          "ID-LoRA weight (stage 1), distilled LoRA weight (stage 2)",
        ]}
        steps={[
          {
            code: "stage1_out = denoise_loop(model=base+ID_LoRA, guidance=[CFG, identity], steps=full)",
            note: "Target 해상도로 전체 denoising을 수행하며, 매 step CFG delta와 identity guidance delta를 함께 더합니다.",
          },
          {
            code: "// identity_delta = w_id * (pred_with_ref - pred_without_ref)",
            note: "매 step 추가 forward pass가 필요한, 이 stage에서 가장 비싼 부분입니다.",
          },
          {
            code: "stage2_out = refine(model=base+distilled_LoRA, init=stage1_out, guidance=none, steps=few)",
            note: "Identity가 이미 자리 잡은 stage1_out을 입력으로, 소수 step만 distilled LoRA로 빠르게 다듬습니다.",
          },
        ]}
        output="Reference 화자의 identity를 유지한 최종 video"
        repeatUntil="단일 생성 요청 안에서 stage 1 → stage 2를 한 번씩 순서대로 실행합니다(반복 루프 아님)."
      />

      <TermBreakdown
        title="Applications이 도입하는 두 개념"
        items={[
          {
            term: "identity guidance delta",
            description:
              "Reference 유무에 따른 예측 차이를 CFG처럼 더해 identity를 강화하는 inference-time guidance입니다.",
            example:
              "id_delta = w_id * (pred_with_ref - pred_without_ref)를 target 위치의 velocity에 더합니다.",
            boundary:
              "이 delta는 target 위치에만 적용되며, reference 자체 위치는 conditioning이므로 loss나 guidance 대상이 아닙니다.",
          },
          {
            term: "two-stage distilled refinement",
            description:
              "Identity guidance가 붙는 stage 1과 distilled LoRA만 쓰는 빠른 stage 2로 나누는 serving 설계입니다.",
            example:
              "Stage 1은 ID-LoRA + identity guidance로 target 해상도를 생성하고, stage 2는 distilled LoRA만으로 빠르게 refine합니다.",
            boundary:
              "Identity guidance는 매 step마다 추가 forward pass가 필요해 비용이 크므로, 이미 identity가 자리 잡은 뒤에는 stage 2에서 생략합니다.",
          },
        ]}
      />

      <div
        id="paper-id-lora"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          논문 읽기 · Identity 보존 응용
        </p>
        <p className="mt-2 text-sm font-semibold">
          ID-LoRA: Identity-Driven Audio-Video Personalization with
          In-Context LoRA
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Negative temporal position, identity guidance delta, two-stage
          serving을 결합해 audio-driven talking video에서 화자 identity를
          유지하는 방법을 제시합니다. 논문이 사용한 LTX-2/2.3 backbone과
          CelebV-HQ·TalkVid 실험 조건을 넘어, 다른 backbone이나 domain에
          동일 하이퍼파라미터가 그대로 이식된다는 뜻은 아닙니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://arxiv.org/abs/2603.10256"
          target="_blank"
          rel="noreferrer"
        >
          원 논문의 방법·실험 보기
        </a>
      </div>
    </section>
  );
}
