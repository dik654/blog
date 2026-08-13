import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";
import CreateBlockViz from "./viz/CreateBlockViz";

const ASSEMBLY = [
  {
    title: "부모 문맥 고정",
    description:
      "base tipset과 protocol이 요구하는 lookback state에서 producer 정보를 읽습니다.",
  },
  {
    title: "message 선택",
    description:
      "부모 state에서 실행 가능한 message를 block limit과 유효성 규칙 안에서 고릅니다.",
  },
  {
    title: "header 약속 구성",
    description:
      "parent, state·message commitment, ticket, election proof, WinningPoSt 같은 필드를 조립합니다.",
  },
  {
    title: "서명과 전파",
    description:
      "worker key로 header를 서명하고 full block을 node의 sync 경로와 peer에 제출합니다.",
  },
] as const;

export default function BlockCreation({
  onCodeRef,
}: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  const openCode = onCodeRef
    ? (key: string) => onCodeRef(key, codeRefs[key])
    : undefined;

  return (
    <section id="block-creation" className="mb-16 scroll-mt-20">
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h2>블록 생성은 sealing 파이프라인과 다른 경로다</h2>
        <p>
          Storage provider가 sector를 준비하는 작업은 장시간 비동기로 진행될 수
          있습니다. 반면 block producer의 critical path는 현재 부모 문맥에서
          election 결과와 WinningPoSt를 확인하고, message와 header를 조립해
          전파하는 과정입니다. 둘을 한 타임라인에 넣으면 병목과 책임을 잘못
          해석하게 됩니다.
        </p>
      </div>

      <div className="not-prose my-8 grid gap-3 md:grid-cols-2">
        {ASSEMBLY.map((step, index) => (
          <article
            key={step.title}
            className="min-w-0 rounded-2xl border bg-card p-5"
          >
            <span className="font-mono text-xs font-semibold text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {step.description}
            </p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>CreateBlock 코드에서 확인할 것</h3>
        <p>
          아래 Viz는 현재 글에 포함된 Lotus 코드 snapshot의{" "}
          <code>CreateBlock</code>
          경로를 따라갑니다. 함수명과 field는 버전에 따라 이동할 수 있으므로,
          “몇 초가 걸린다”는 수치보다{" "}
          <strong>어떤 문맥을 읽고 어떤 commitment를 반환하는지</strong>를
          기준으로 읽습니다.
        </p>
      </div>
      <CreateBlockViz onOpenCode={openCode} />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>header는 결과가 아니라 검증 약속의 묶음이다</h3>
        <p>
          header의 parent·message root·state root 계열 필드는 다른 node가 같은
          입력을 검증하고 실행 결과를 대조할 수 있게 합니다. ticket과 election
          proof는 producer 선정 근거를, WinningPoSt는 해당 block 생산에 필요한
          저장 근거를 제공합니다. 서명은 이 약속을 producer key와 결합합니다.
        </p>

        <h3>sealing은 어디에서 이어지나</h3>
        <p>
          Piece 배치, sector sealing, PoRep 생성·제출은 이 섹션의 block assembly
          앞단과 독립적으로 스케줄됩니다. 자세한 proof 의미는 앞의
          <strong> 합의·finality·저장 증명</strong> 섹션에서 한 번만 설명합니다.
          실제 처리 시간과 hardware 요구량은 proof parameter, sector 유형,
          parallelism과 구현 버전에 따라 달라지므로 고정값으로 두지 않습니다.
        </p>
      </div>
    </section>
  );
}
