import VizFrame from "@/components/viz/VizFrame";

const trace = [
  ["Bug report", "빈 email로 login 요청 시 500", "goal · reproduction"],
  ["Inspect", "route·validation·관련 test를 읽음", "source · test · error log"],
  ["Propose", "DB 호출 전에 input validation 추가", "planned diff"],
  ["Authorize", "workspace file write만 승인 범위", "network·deploy는 별도 effect"],
  ["Execute", "patch 적용 후 target test 실행", "file diff · test output"],
  ["Verify", "재현 test 통과와 변경 범위 확인", "evidence · unresolved effects"],
] as const;

export default function AgentLoopSequenceViz() {
  return (
    <VizFrame
      eyebrow="Concrete tool trace"
      title="Login bug를 고칠 때 각 판단은 source·diff·test 같은 다음 artifact를 남깁니다"
      description="자연어로 ‘고쳤다’고 끝내지 않고 재현 입력과 결정적 test로 완료 조건을 확인합니다."
      note="파일 수정과 local test는 승인된 범위에서 실행할 수 있지만 deploy·외부 메시지·production 변경은 별도 authorization 없이는 수행하지 않습니다."
    >
      <ol className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {trace.map(([stage, action, artifact], index) => (
          <li key={stage} className="min-w-0 border-t border-border/80 pt-4">
            <div className="flex min-w-0 items-baseline justify-between gap-4">
              <h4 className="text-sm font-bold">{stage}</h4>
              <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <p className="mt-3 min-w-0 text-xs leading-5 text-foreground [overflow-wrap:anywhere]">
              {action}
            </p>
            <p className="mt-3 min-w-0 text-xs font-semibold leading-5 text-primary [overflow-wrap:anywhere]">
              Artifact · {artifact}
            </p>
          </li>
        ))}
      </ol>
    </VizFrame>
  );
}
