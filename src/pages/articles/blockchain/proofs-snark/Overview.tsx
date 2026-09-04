import ContextViz from "./viz/ContextViz";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        SNARK는 큰 storage-proof 계산을 작은 검증 입력으로 바꾼다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Filecoin chain이 PoRep와 PoSt 계산 전체를 다시 실행하면 block validation 비용을 감당하기 어렵습니다. Prover는 graph·Merkle
          constraint를 만족하는 witness를 만들고 Groth16 proof로 압축해 제출합니다. Verifier는 proof와 public input만으로 같은
          statement를 확인합니다.
        </p>
        <p>
          PoRep C2, WindowPoSt와 WinningPoSt는 모두 proof system을 사용하지만
          circuit, parameter와 scheduling이 다릅니다. “Filecoin proof 하나”로
          뭉뚱그리지 말고 어느 proof type과 network version을 측정했는지
          구분해야 합니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <ContextViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>작은 proof와 싼 proving은 같은 말이 아니다</h3>
        <p>
          Groth16은 proof가 compact하고 verification path가 짧은 대신 circuit-specific setup과 무거운 proving이 따릅니다.
          Network 전체 proof 수나 GPU 소비량은 계속 변하므로 “가장 GPU를 많이 쓰는 chain” 같은 순위 대신 proof type별 throughput과 energy를
          측정합니다.
        </p>
      </div>
    </section>
  );
}
