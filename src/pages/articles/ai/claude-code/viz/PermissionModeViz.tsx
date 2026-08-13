import VizFrame from "@/components/viz/VizFrame";

const hookOutcomes = [
  ["Deny", "즉시 중단"],
  ["Modify", "arguments 갱신"],
  ["Pass", "policy로 전달"],
] as const;

const precedence = [
  ["Deny", "명시적으로 금지된 request는 중단"],
  ["Ask", "사용자 확인이 필요한 request는 승인 대기"],
  ["Permission mode", "일치하지 않은 request의 session 기본 동작"],
  ["Allow", "허용된 tool·argument·scope에서만 진행"],
] as const;

export default function PermissionModeViz() {
  return (
    <VizFrame
      eyebrow="Permission resolution"
      title="Tool request는 PreToolUse hook을 거친 뒤 deny·ask·mode·allow 우선순위로 판정됩니다"
      description="Hook과 permission policy는 같은 권한 계층이 아닙니다. Hook이 pass 또는 allow 취지의 결과를 내도 명시적 deny·ask를 우회하지 못합니다."
    >
      <ol className="divide-y divide-border/70">
        <li className="grid min-w-0 gap-3 py-4 first:pt-0 sm:grid-cols-[2rem_9rem_1fr] sm:items-baseline">
          <span className="font-mono text-[11px] text-muted-foreground">01</span>
          <h4 className="text-sm font-bold">Tool request</h4>
          <p className="min-w-0 text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]">
            tool name · arguments · target scope
          </p>
        </li>

        <li className="grid min-w-0 gap-3 py-5 sm:grid-cols-[2rem_9rem_1fr]">
          <span className="font-mono text-[11px] text-muted-foreground">02</span>
          <h4 className="text-sm font-bold">PreToolUse hook</h4>
          <div className="grid min-w-0 gap-4 sm:grid-cols-3">
            {hookOutcomes.map(([outcome, meaning]) => (
              <div key={outcome} className="min-w-0">
                <p className="text-xs font-semibold text-foreground">{outcome}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]">
                  {meaning}
                </p>
              </div>
            ))}
          </div>
        </li>

        <li className="grid min-w-0 gap-3 py-5 sm:grid-cols-[2rem_9rem_1fr]">
          <span className="font-mono text-[11px] text-muted-foreground">03</span>
          <div className="min-w-0">
            <h4 className="text-sm font-bold">Policy decision</h4>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              위에서 아래로 먼저 일치하는 제한을 적용합니다.
            </p>
          </div>
          <ol className="grid min-w-0 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {precedence.map(([decision, meaning], index) => (
              <li key={decision} className="min-w-0 border-l border-border pl-3">
                <span className="font-mono text-[11px] text-muted-foreground">P{index + 1}</span>
                <h5 className="mt-1 text-xs font-bold">{decision}</h5>
                <p className="mt-1 min-w-0 text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]">
                  {meaning}
                </p>
              </li>
            ))}
          </ol>
        </li>

        <li className="grid min-w-0 gap-3 py-4 last:pb-0 sm:grid-cols-[2rem_9rem_1fr] sm:items-baseline">
          <span className="font-mono text-[11px] text-muted-foreground">04</span>
          <h4 className="text-sm font-bold">Execute · audit</h4>
          <p className="min-w-0 text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]">
            authorized action · result · error · effect receipt
          </p>
        </li>
      </ol>
    </VizFrame>
  );
}
