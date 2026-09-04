import { codeRefs } from "./codeRefs";
import GPUViz from "./viz/GPUViz";
import type { CodeRef } from "@/components/code/types";

export default function GPU({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="gpu" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        GPU 가속은 MSM·FFT와 memory movement를 함께 최적화한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Groth16 prover의 큰 polynomial 연산과 multi-scalar multiplication은
          병렬성이 높아 bellperson 계열 backend가 GPU를 활용합니다. 하지만
          point와 scalar를 device memory에 배치하고 batch를 구성하는 비용도
          크기 때문에 kernel FLOPS만으로 end-to-end 성능을 설명할 수 없습니다.
        </p>
        <p>
          VRAM이 부족하면 chunking과 host-device transfer가 늘고 너무 작은 batch는 GPU utilization을 떨어뜨립니다. CPU fallback과 여러
          GPU의 work split도 circuit shape와 runtime 설정에 따라 달라집니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <GPUViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>속도 향상은 같은 proof fixture에서 재현한다</h3>
        <p>
          CPU 대비 배수나 특정 GPU의 분 단위 결과를 일반화하지 않고 parameter checksum, circuit, batch, backend commit과 power
          limit을 고정합니다. 이후 MSM·FFT·transfer·I/O 시간과 peak VRAM을 나눠야 어떤 최적화가 실제 proving time을 줄였는지 확인할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
