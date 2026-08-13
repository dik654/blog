import { codeRefs } from "./codeRefs";
import Groth16Viz from "./viz/Groth16Viz";
import type { CodeRef } from "@/components/code/types";

export default function Groth16({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="groth16" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Groth16은 circuit witness를 세 group element의 proof로 압축한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Circuit은 “이 replica와 Merkle path가 public commitment에
          일치한다”는 statement를 constraint로 표현합니다. Prover는 witness와
          proving key로 proof를 만들고, verifier는 public input과 verifying
          key를 pairing equation에 넣어 확인합니다.
        </p>
        <p>
          Groth16의 setup은 circuit에 결합되므로 parameter file의 출처와
          checksum이 보안 경계가 됩니다. 과거 ceremony가 있었다는 사실만
          적기보다 현재 proof type이 어떤 parameter와 verifying key를
          참조하는지 추적해야 합니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <Groth16Viz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Verification latency는 환경과 batch 조건을 붙인다</h3>
        <p>
          Proof size는 scheme 구조로 설명할 수 있지만 실제 verification
          latency와 gas·FVM cost는 curve library, CPU, batch와 actor
          implementation에 따라 달라집니다. 같은 public input fixture에서
          cold·warm path와 batch size를 함께 기록합니다.
        </p>
      </div>
    </section>
  );
}
