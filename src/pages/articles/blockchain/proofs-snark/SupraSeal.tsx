import SupraSealViz from "./viz/SupraSealViz";
import type { CodeRef } from "@/components/code/types";

export default function SupraSeal({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="supraseal" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        SupraSeal은 proof statement를 바꾸지 않고 prover data path를 줄인다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          SupraSeal 계열 최적화의 목표는 새로운 proof를 만드는 게 아니라 동일한 Filecoin proof를 더 효율적으로 생성하는 데 있습니다. MSM scheduling,
          point representation, prefetch와 multi-GPU work distribution을 조정해 device가 기다리는 시간을 줄입니다.
        </p>
        <p>
          따라서 “50% 빨라졌다” 같은 발표 수치는 해당 hardware와 batch의
          project result로 읽어야 합니다. 다른 provider 환경에서는 storage
          I/O, PCIe·NVLink topology, parameter cache와 concurrent sealing
          workload가 결과를 바꿉니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <SupraSealViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>검증해야 할 것은 proof 호환성과 end-to-end 처리량이다</h3>
        <p>
          Optimization 전후 proof가 같은 verifier와 parameter set에서
          검증되는지 먼저 확인합니다. 그다음 sector당 wall time, GPU-hour,
          peak memory, power와 실패 재시도율을 비교해야 운영 효율을 판단할 수
          있습니다.
        </p>
      </div>
    </section>
  );
}
