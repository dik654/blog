import { ArrowDown, ArrowRight, CircleCheck, CircleX, ShieldCheck, TriangleAlert } from 'lucide-react';

export default function EnforcerViz() {
  return (
    <figure
      aria-label="PermissionPolicy와 runtime enforcer 그리고 실제 containment의 책임 분리"
      className="not-prose my-7 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="border-b border-border px-4 py-3">
        <p className="text-sm font-semibold">authorization decision과 side-effect containment는 다른 층이다</p>
      </figcaption>
      <div className="grid gap-3 p-4 md:grid-cols-[1fr_32px_1.15fr_32px_1fr] md:items-stretch">
        <div className="rounded-md border border-border p-4">
          <p className="text-xs font-bold text-muted-foreground">입력</p>
          <p className="mt-2 text-sm font-semibold">tool name + JSON input</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            active mode, required mode, deny·ask·allow rules, hook context를 함께 본다.
          </p>
        </div>
        <div className="flex items-center justify-center text-muted-foreground">
          <ArrowDown className="h-4 w-4 md:hidden" aria-hidden="true" />
          <ArrowRight className="hidden h-4 w-4 md:block" aria-hidden="true" />
        </div>
        <div className="rounded-md border border-sky-600/30 bg-sky-500/[0.04] p-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-sky-700 dark:text-sky-300" aria-hidden="true" />
            <p className="text-sm font-semibold">PermissionPolicy / Enforcer</p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-md border border-border bg-background p-2.5">
              <CircleCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
              <p className="mt-2 text-xs font-semibold">Allowed</p>
            </div>
            <div className="rounded-md border border-border bg-background p-2.5">
              <CircleX className="h-3.5 w-3.5 text-rose-600" aria-hidden="true" />
              <p className="mt-2 text-xs font-semibold">Denied(reason)</p>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            이 결과는 “요청할 권한”의 결론이다. 경로와 process를 물리적으로 가두지는 않는다.
          </p>
        </div>
        <div className="flex items-center justify-center text-muted-foreground">
          <ArrowDown className="h-4 w-4 md:hidden" aria-hidden="true" />
          <ArrowRight className="hidden h-4 w-4 md:block" aria-hidden="true" />
        </div>
        <div className="rounded-md border border-border p-4">
          <p className="text-xs font-bold text-muted-foreground">다음 강제점</p>
          <p className="mt-2 text-sm font-semibold">File boundary / OS sandbox</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            허용된 호출도 실제 open 시점 경계, network·process 격리, timeout과 audit를 통과해야 한다.
          </p>
        </div>
      </div>
      <div className="border-t border-border bg-muted/15 px-4 py-3">
        <p className="text-xs font-semibold">별도 direct helper 경로</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          <code className="text-xs">check_file_write()</code>와 <code className="text-xs">check_bash()</code>는
          prefix·첫 token heuristic과 mode 비교를 직접 수행한다. 위 policy rule·context pipeline을
          거치지 않으며 file/shell containment도 아니다.
        </p>
      </div>
      <div className="flex gap-2 border-t border-border bg-amber-500/[0.04] px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden="true" />
        <p className="m-0 min-w-0">
          Prompt mode에서 얇은 <code className="text-xs">check()</code>가 반환하는 Allowed는
          “interactive caller가 이어서 묻는다”는 제어 신호다. 최종 사용자 승인의 증거가 아니다.
        </p>
      </div>
    </figure>
  );
}
