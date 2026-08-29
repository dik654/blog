import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";

export default function SparseKernelExecution() {
  return (
    <section id="sparse-kernel-execution" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        구조적 sparsity도 kernel이 pattern을 인식해야 실제로 빨라집니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Shape를 줄이거나 N:M pattern을 맞춰도, 그 결과를 계산에서 실제로
          건너뛸 kernel이 없으면 저장만 줄고 latency는 그대로입니다. NVIDIA
          Ampere Sparse Tensor Core는 정확히 2:4 pattern만 인식해서 2배
          math throughput을 냅니다. 다른 pattern이나 다른 GPU에서는 같은
          mask라도 이 2배가 나오지 않습니다.
        </p>
        <p>
          개별 weight를 임의 위치에서 지우는 unstructured sparsity는 이
          조건을 대부분 만족하지 못합니다. 90%를 지워 sparse해도 남은 값의
          위치가 불규칙하면 표준 dense GEMM kernel은 그 0을 건너뛰지 않고
          원래 크기 그대로 곱셈을 수행합니다. 그래서 value·index로 저장
          공간은 줄어도 wall-clock speedup은 거의 나타나지 않는 경우가
          많습니다.
        </p>
        <p>
          반대로 channel 자체를 지우는 구조적 pruning은 kernel 종류와
          무관하게 이득이 생깁니다. Weight matrix의 shape 자체가 줄었으니
          아무 dense GEMM kernel에 넣어도 더 작은 행렬을 곱하기 때문입니다.
          N:M 같은 semi-structured pattern은 이 둘의 중간으로, shape는
          그대로 두는 대신 kernel이 그 local pattern을 인식해야만 이득이
          생깁니다.
        </p>
      </div>
      <TermBreakdown
        title="Sparsity pattern과 kernel 조건"
        description="같은 density라도 pattern과 kernel 지원 여부에 따라 실제 속도가 갈립니다."
        items={[
          {
            term: "Unstructured (random) sparsity",
            description: "임의 위치의 개별 weight를 지웁니다.",
            example: "90% sparse여도 위치가 불규칙해 표준 dense GEMM은 skip하지 못합니다.",
            boundary: "저장은 value+index로 줄어도 연산량·latency는 그대로인 경우가 많습니다.",
          },
          {
            term: "Structured (shape) sparsity",
            description: "연결된 dimension 전체를 지워 tensor shape 자체를 줄입니다.",
            example: "위 shape propagation처럼 input·output을 각각 .75 남기면 arithmetic이 .5625로 줍니다.",
            boundary: "Shape가 줄어드는 그 자체로 kernel 종류와 무관하게 이득이 생깁니다.",
          },
          {
            term: "Semi-structured (N:M) sparsity",
            description: "Shape는 그대로 두고 local group pattern만 제한합니다.",
            example: "Ampere Sparse Tensor Core는 2:4 pattern에서 2배 math throughput을 냅니다.",
            boundary: "GPU·kernel이 2:4를 지원하고 실제로 그 tactic을 선택해야 이 배수가 나옵니다.",
          },
        ]}
      />
      <div id="paper-ampere-sparse-tensor-core" className="not-prose mt-6 scroll-mt-24">
        <CitationBlock
          source="Accelerating Sparse Deep Neural Networks"
          citeKey={4}
          href="https://arxiv.org/abs/2104.08378"
        >
          <strong>문제:</strong> Sparse weight가 실제 GPU 연산 감소로
          이어지려면 무엇이 필요한지. <strong>기여:</strong> NVIDIA Ampere
          Tensor Core가 2:4 structured sparsity pattern을 인식해 dense
          대비 2배 math throughput을 내는 workflow와 정확도 유지 방법을
          제시. <strong>전제:</strong> 논문의 Ampere 세대 GPU·2:4 pattern
          조건. <strong>근거 범위:</strong> 해당 세대 Tensor Core의 sparse
          matmul 실험. <strong>과장 금지:</strong> 임의 pattern의
          unstructured sparsity에도 같은 2배가 적용된다는 뜻은 아닙니다.
        </CitationBlock>
      </div>
    </section>
  );
}
