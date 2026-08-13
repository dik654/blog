import GPUPipelineViz from "./viz/GPUPipelineViz";
import ContextViz from "./viz/ContextViz";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function Overview({
  onCodeRef,
}: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Filecoin proving을 workload graph로 본다
      </h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>
      <div className="not-prose mb-8">
        <GPUPipelineViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Filecoin provider는 데이터를 unique replica로 encode했다는 PoRep과,
          이후에도 sector를 계속 보유한다는 PoSt를 생성한다. “GPU가 증명 전체를
          빠르게 한다”보다 각 단계의 dependency, memory layout, device
          transfer와 deadline을 나눠 보는 것이 중요하다.
        </p>

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton
              onClick={() =>
                onCodeRef("bp-groth16-prover", codeRefs["bp-groth16-prover"])
              }
            />
            <span className="text-xs text-muted-foreground self-center">
              Groth16 prover snapshot
            </span>
            <CodeViewButton
              onClick={() =>
                onCodeRef("bp-gpu-multiexp", codeRefs["bp-gpu-multiexp"])
              }
            />
            <span className="text-xs text-muted-foreground self-center">
              CPU/GPU MSM split
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose my-6">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">Replica preparation</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>
                <strong>PC1</strong> — Stacked-DRG dependency에 따라 labels와
                encoded data 생성
              </li>
              <li>
                <strong>PC2</strong> — column·replica commitment tree 구성
              </li>
              <li>
                <strong>병목</strong> — CPU hashing, RAM, cache/NVMe I/O, GPU
                tree builder가 함께 영향
              </li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">Proof generation</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>
                <strong>C1</strong> — chain randomness에 맞는 challenge와
                witness 준비
              </li>
              <li>
                <strong>C2</strong> — circuit proof를 생성하며 MSM/FFT 같은
                연산을 accelerator에 위임 가능
              </li>
              <li>
                <strong>PoSt</strong> — deadline과 partition별 challenge를
                대상으로 반복 수행
              </li>
            </ul>
          </div>
        </div>

        <p className="leading-7">
          GPU 사용 여부와 최소 VRAM은 sector size, proof parameter, batch 크기,
          CUDA/OpenCL backend, worker topology에 따라 달라진다. 특정 GPU
          모델·가격·처리량·투자 회수 기간을 protocol 특성으로 고정하지 않고 실제
          worker benchmark와 deadline 여유로 capacity를 계산한다.
        </p>
      </div>
    </section>
  );
}
