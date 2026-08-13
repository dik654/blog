import { codeRefs } from "./codeRefs";
import CommitViz from "./viz/CommitViz";
import type { CodeRef } from "@/components/code/types";

export default function Commit({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="commit" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        C1은 witness를 고르고 C2는 검증 가능한 proof로 압축한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          PreCommit 이후 protocol randomness가 정해지면 C1은 challenge에
          해당하는 graph parent와 Merkle path를 모아 vanilla proof와 SNARK
          witness를 준비합니다. C2는 이 witness를 Groth16 prover에 넣어 chain이
          검증할 수 있는 작은 proof로 바꿉니다.
        </p>
        <p>
          C2에서 MSM과 polynomial 연산이 큰 비중을 차지할 수 있어 bellperson의
          GPU backend가 사용됩니다. 다만 “CPU 대비 N배” 같은 고정 수치는
          circuit, batch, GPU memory와 implementation version에 따라 달라지므로
          end-to-end C2와 개별 kernel을 함께 측정해야 합니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <CommitViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>증명 생성과 검증 비용을 분리한다</h3>
        <p>
          Prover는 큰 parameter와 witness를 처리하지만 verifier는 public input과
          proof만 확인합니다. 이 비대칭 덕분에 chain은 sealing 계산 전체를
          재실행하지 않습니다. Proof byte, verifying-key와 gas·execution cost는
          active proof type과 actor version에서 확인합니다.
        </p>
      </div>
    </section>
  );
}
