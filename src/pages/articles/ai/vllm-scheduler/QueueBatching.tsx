import ExplainedFormula from "@/components/ui/explained-formula";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import SchedulerContractViz from "./viz/SchedulerContractViz";

export default function QueueBatching({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <div className="space-y-16">
      <section
        id="queue-batching"
        data-teach-level="3"
        className="scroll-mt-20"
      >
        <span id="scheduler-boundary" className="scroll-mt-20" />
        <span id="batching-generations" className="scroll-mt-20" />
        <span id="request-queue" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          6. 언제 묶음을 바꾸는지와 누구를 먼저 보는지는 다릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            지금 본 선택 담당자를 scheduler라고 부릅니다. 처리 단위와 진행 중·대기 중 상태의 이름을 먼저 붙이고 다음 절에서 숫자 5를 어떻게 나누는지 원문 필드와 연결합니다.
          </p>
        </div>
        <TermBreakdown
          title="역할을 이해한 뒤 이름을 붙입니다"
          items={[
            {
              term: "Token / progress gap",
              description:
                "처리 단위와 목표 위치에서 계산한 위치를 뺀 남은 양입니다.",
              boundary: "생성한 출력 수와 계산한 입력 위치는 다릅니다.",
            },
            {
              term: "RUNNING / WAITING",
              description:
                "진행 대상으로 관리하는 요청과 수용을 기다리는 요청의 집합입니다.",
              boundary:
                "RUNNING이어도 모든 실행 차례에 계산되는 것은 아닙니다.",
            },
            {
              term: "Prefill / decode",
              description:
                "입력을 읽는 계산과 이미 만든 기록으로 다음 출력을 이어 가는 계산입니다.",
              boundary:
                "후보 검증을 켜면 한 번의 출력 확정 수가 달라질 수 있습니다.",
            },
            {
              term: "Chunked prefill",
              description: "긴 입력을 여러 실행으로 나눠 읽습니다.",
              boundary: "설정한 상한보다 실제 배정량이 작을 수 있습니다.",
            },
            {
              term: "Static / dynamic / continuous batching",
              description:
                "묶음 고정·도착을 모아 묶음 생성·실행 경계마다 묶음 변경입니다.",
              boundary:
                "Dynamic이라는 이름의 세부 동작은 구현에 따라 확인합니다.",
            },
            {
              term: "FCFS / priority / queue discipline",
              description:
                "도착 순서나 우선순위 등 검토 순서를 정하는 규칙입니다.",
              boundary: "순서가 앞서도 예산·공간 조건을 통과해야 합니다.",
            },
            {
              term: "Fairness / starvation",
              description:
                "사용자별 서비스 몫과 처리 가능한 요청이 오래 선택되지 못하는 현상입니다.",
              boundary: "공정성의 분모와 시간 구간을 먼저 정합니다.",
            },
            {
              term: "Head-of-line blocking",
              description:
                "앞 요청이 진행하지 못해 가능한 뒤 요청도 기다리는 현상입니다.",
              boundary:
                "실행 묶음 안의 긴 계산이 주는 간섭과 구분해서 측정합니다.",
            },
            {
              term: "KV cache / preemption",
              description:
                "과거 위치의 계산 기록과 자원 확보를 위해 요청을 잠시 빼는 동작입니다.",
              boundary:
                "기록을 해제하면 나중에 다시 계산하는 비용이 생길 수 있습니다.",
            },
            {
              term: "Scheduler overhead",
              description: "선택·조회·할당·전달에 드는 시간입니다.",
              boundary:
                "GPU 계산과 겹쳐도 CPU 자원 사용 자체가 없어지지는 않습니다.",
            },
          ]}
        />
        <SchedulerContractViz />
      </section>
    </div>
  );
}
