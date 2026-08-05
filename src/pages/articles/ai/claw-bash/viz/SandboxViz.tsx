import { ArrowDown, ArrowRight, Box, Terminal, TriangleAlert } from 'lucide-react';

export default function SandboxViz() {
  return (
    <figure
      aria-label="sandbox request가 unshare 실행 또는 일반 shell fallback으로 나뉘는 흐름"
      className="not-prose my-7 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="border-b border-border px-4 py-3">
        <p className="text-sm font-semibold">현재 launcher는 bubblewrap이 아니라 Linux unshare다</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          requested, supported, active를 분리하고 fallback을 실제 보안 상태로 읽어야 한다.
        </p>
      </figcaption>
      <div className="grid gap-3 p-4 md:grid-cols-[1fr_30px_1fr_30px_1fr] md:items-stretch">
        <div className="rounded-md border border-border p-4">
          <p className="text-xs font-bold text-muted-foreground">Request</p>
          <p className="mt-2 text-sm font-semibold">namespace · network · filesystem mode</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            기본은 enabled, namespace 요청, network off, workspace-only mode다.
          </p>
        </div>
        <div className="flex items-center justify-center text-muted-foreground">
          <ArrowDown className="h-4 w-4 md:hidden" aria-hidden="true" />
          <ArrowRight className="hidden h-4 w-4 md:block" aria-hidden="true" />
        </div>
        <div className="rounded-md border border-border p-4">
          <p className="text-xs font-bold text-muted-foreground">Status</p>
          <p className="mt-2 text-sm font-semibold">supported · active · fallback_reason</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Linux user namespace 실행 가능 여부와 container marker를 계산한다.
          </p>
        </div>
        <div className="flex items-center justify-center text-muted-foreground">
          <ArrowDown className="h-4 w-4 md:hidden" aria-hidden="true" />
          <ArrowRight className="hidden h-4 w-4 md:block" aria-hidden="true" />
        </div>
        <div className="grid gap-2">
          <div className="rounded-md border border-emerald-600/30 bg-emerald-500/[0.035] p-3">
            <Box className="h-4 w-4 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
            <p className="mt-2 text-xs font-semibold">active → unshare ... sh -lc</p>
          </div>
          <div className="rounded-md border border-rose-600/30 bg-rose-500/[0.035] p-3">
            <Terminal className="h-4 w-4 text-rose-700 dark:text-rose-300" aria-hidden="true" />
            <p className="mt-2 text-xs font-semibold">inactive → 일반 sh -lc</p>
          </div>
        </div>
      </div>
      <div className="flex gap-2 border-t border-border bg-amber-500/[0.04] px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden="true" />
        <p className="m-0 min-w-0">
          현재 <code className="text-xs">filesystemMode</code>와 allowed mounts는 launcher 환경변수로
          전달되지만, 이 함수 안에서 bind mount allow-list를 강제하지 않는다. “filesystem_active”를
          실제 차단 증거로 과대 해석하지 않는다.
        </p>
      </div>
    </figure>
  );
}
