import BellpersonViz from "./viz/BellpersonViz";
import MSMAccelFlowViz from "./viz/MSMAccelFlowViz";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function GPUAcceleration({
  onCodeRef,
}: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="gpu-acceleration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        bellperson의 CPU/GPU 실행 경계
      </h2>
      <div className="not-prose mb-8">
        <BellpersonViz />
      </div>
      <div className="not-prose mb-8">
        <MSMAccelFlowViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton
              onClick={() =>
                onCodeRef("bp-gpu-multiexp", codeRefs["bp-gpu-multiexp"])
              }
            />
            <span className="text-xs text-muted-foreground self-center">
              gpu/multiexp.rs
            </span>
            <CodeViewButton
              onClick={() =>
                onCodeRef("bp-groth16-prover", codeRefs["bp-groth16-prover"])
              }
            />
            <span className="text-xs text-muted-foreground self-center">
              prover/native.rs
            </span>
            <CodeViewButton
              onClick={() => onCodeRef("bp-verifier", codeRefs["bp-verifier"])}
            />
            <span className="text-xs text-muted-foreground self-center">
              verifier.rs
            </span>
          </div>
        )}

        <h3 className="text-xl font-semibold mt-6 mb-3">
          가속 경로는 fallback과 함께 읽는다
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose mb-6">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Dispatch</h4>
            <p className="text-sm text-muted-foreground">
              환경과 feature로 가능한 device를 찾고 GPU kernel·CPU worker 사이에
              workload를 나눈다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">MSM/FFT</h4>
            <p className="text-sm text-muted-foreground">
              큰 독립 연산 집합은 GPU가 유리하지만 host-device copy, kernel
              준비와 batch 크기가 실제 latency를 좌우한다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Merge &amp; verify</h4>
            <p className="text-sm text-muted-foreground">
              CPU와 각 device의 부분 결과를 합치고 proof를 검증한다. GPU 성공
              자체가 valid proof를 보장하지 않는다.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          운영 capacity를 결정하는 입력
        </h3>
        <ul>
          <li>사용하는 network version, sector size와 proof parameter</li>
          <li>동시에 실행할 sealing·WindowPoSt·WinningPoSt job 수</li>
          <li>
            GPU memory뿐 아니라 pinned host memory, CPU cores, cache와 NVMe
            throughput
          </li>
          <li>driver·CUDA/OpenCL·kernel build 조합과 실제 fallback 동작</li>
          <li>평균 시간이 아니라 deadline에 대한 tail latency와 재시도 여유</li>
        </ul>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          벤치마크는 동일한 parameter·batch·software revision·power limit에서만
          비교한다. 모델명만으로 “몇 배”, “몇 분”, “몇 sector/day”를 일반화하면
          pipeline의 실제 병목을 놓친다.
        </p>
      </div>
    </section>
  );
}
