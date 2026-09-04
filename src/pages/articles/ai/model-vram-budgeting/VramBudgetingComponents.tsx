import { Link } from "react-router-dom";
import TermBreakdown from "@/components/articles/term-breakdown";

export default function VramBudgetingComponents() {
  return (
    <section id="vram-budgeting-components" className="scroll-mt-20 space-y-7">
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h2>Known floor는 residency·full context·cache 결정으로 나뉩니다</h2>
        <p className="leading-8">
          Known floor를 실제로 채우는 결정은 세 가지입니다. Weight 전체가 GPU에 동시에 상주해야 한다는 model residency, 공식 최대 길이를 그대로 예산에 넣는 full context 가정, 그리고 KV cache의 dtype을 낮춰 그 값을 줄이는 cache optimization입니다.
        </p>

        <h3 id="model-residency" className="scroll-mt-20">
          Model residency는 weight 전체가 함께 있어야 한다는 제약입니다
        </h3>
        <p className="leading-8">
          Model residency가 요구하는 것은 request path가 실행되는 동안 그 경로가 참조하는 weight 전체가 GPU 메모리에 함께 있는 상태입니다. Mixed FP8
          Qwen의 28.75GiB는 48GiB 카드 하나에 상주할 수 있지만 BF16 51.75GiB는 그대로는 상주 자체가 불가능합니다.
        </p>
        <p className="leading-8">
          이 실패가 다음 절의 여러 전략, 곧 GPU 두 장에 나누거나 일부를 host로 내리거나 더 큰 unified memory로 옮기는 선택으로 이어집니다.
        </p>

        <h3 id="full-context" className="scroll-mt-20">
          Full context는 최대 길이를 그대로 예산에 넣는 가정입니다
        </h3>
        <p className="leading-8">
          Full context는 모델이 공식적으로 지원한다고 밝힌 최대 길이를 실제 budgeting에 그대로 넣는 일입니다. &ldquo;지원한다&rdquo;는 문구와 &ldquo;그 길이에서 known floor가 GPU에 들어간다&rdquo;는 서로 다른 주장입니다.
        </p>
        <p className="leading-8">
          262K에서 이미 계산한 attention KV 16GiB에 동시 request 4개를 가정하면 KV만 64GiB가 되어 weight 28.75GiB를 더하기도 전에 48GiB
          카드 용량을 넘습니다.
        </p>

        <h3 id="cache-optimization" className="scroll-mt-20">
          Cache optimization은 KV dtype을 낮춰 그 항을 줄입니다
        </h3>
        <p className="leading-8">
          Cache optimization은 이 KV 항 자체를 줄이는 선택을 부르는 이름입니다. 가장 직접적인 방법은 KV cache의 dtype을 낮추는 것입니다. BF16
          64KiB/token을 FP8로 저장하면 32KiB/token이 되어 262K KV가 16GiB에서 8GiB로 절반이 됩니다.
        </p>
        <p className="leading-8">
          Block 단위로 physical allocation을 조각내 fragmentation을 줄이는 방법은 이 dtype 절감과 다른 layer의 최적화이며, 그 allocator 설계는{" "}
          <Link to="/ai/vllm-paged-attention#kv-cache-manager">vLLM Hybrid KV Cache Manager 글</Link>에서 다룹니다.
        </p>
      </div>

      <TermBreakdown
        title="Known floor를 채우는 세 결정을 나눠 봅니다"
        items={[
          {
            term: "Model residency",
            description: "Request path의 weight 전체가 GPU에 동시에 있어야 한다는 제약입니다.",
            example: "Mixed FP8 28.75GiB는 48GiB 카드에 들어가지만 BF16 51.75GiB는 못 들어갑니다.",
            boundary: "MoE도 어느 expert가 선택될지 몰라 결국 전체 expert weight가 resident해야 합니다.",
          },
          {
            term: "Full context",
            description: "공식 최대 길이를 그대로 KV budgeting에 넣는 가정입니다.",
            example: "262K·동시 request 4개면 KV만 64GiB로 48GiB 카드 용량을 넘습니다.",
            boundary: "\"지원한다\"는 문구가 그 길이에서 GPU에 들어간다는 증거는 아닙니다.",
          },
          {
            term: "Cache optimization",
            description: "KV dtype을 낮춰 그 항을 줄이는 선택입니다.",
            example: "BF16 64KiB/token이 FP8 32KiB/token이 되어 262K KV가 16GiB에서 8GiB로 줄어듭니다.",
            boundary: "품질 영향은 별도 검증이 필요하고 block allocator 최적화와는 다른 layer입니다.",
          },
        ]}
      />
    </section>
  );
}
