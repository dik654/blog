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
        PoSt는 지속 저장과 block producer 자격을 서로 다른 경로로 증명한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          PoRep가 replica를 처음 만든 과정을 증명한다면 PoSt는 이미 활성화된
          sector의 data에 이후에도 접근할 수 있는지를 challenge-response로
          확인합니다. Chain은 sector 전체를 읽는 대신 sampled Merkle path를
          압축한 proof를 검증합니다.
        </p>
        <p>
          WindowPoSt는 proving deadline에 맞춰 active sector의 storage power를
          유지하는 경로입니다. WinningPoSt는 EC election에서 당선된 provider가
          block producer 자격을 증명하는 경로이므로 실행 시점과 실패 결과가
          다릅니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <ContextViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>공통 cryptography보다 scheduling 차이가 운영을 가른다</h3>
        <p>
          두 proof 모두 replica commitment와 Merkle path, SNARK proving을
          사용하지만 WindowPoSt는 deadline·partition 운영이 중요하고
          WinningPoSt는 block production critical path에 놓입니다. Challenge
          수, partition size와 deadline은 현재 proof·actor parameter에서
          확인해야 합니다.
        </p>
      </div>
    </section>
  );
}
