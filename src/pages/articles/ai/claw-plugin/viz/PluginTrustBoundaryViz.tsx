import { ArrowDown, Ban, Cpu, FileKey2, HardDrive, Network, ShieldCheck } from 'lucide-react';

export default function PluginTrustBoundaryViz() {
  return (
    <figure className="not-prose my-7 overflow-hidden rounded-md border border-border" aria-label="플러그인 권한 판정과 운영체제 격리의 차이">
      <div className="border-b border-border bg-muted/30 px-4 py-4 sm:px-5">
        <p className="text-xs font-semibold text-muted-foreground">THE CRITICAL QUESTION</p>
        <p className="mt-1 text-base font-bold">requiredPermission=&quot;read-only&quot;면 spawned process도 쓰지 못할까?</p>
      </div>

      <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_48px_minmax(0,1fr)]">
        <section className="min-w-0 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-sky-700 dark:text-sky-300" aria-hidden="true" />
            <h3 className="text-sm font-bold">Authorization plane</h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            label은 이 tool 요청을 현재 mode와 rule에서 시작해도 되는지 결정한다.
          </p>
          <div className="mt-4 space-y-2 text-sm">
            <p className="flex gap-2"><FileKey2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> tool 이름별 required mode 등록</p>
            <p className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> pre-hook과 policy authorize</p>
          </div>
        </section>

        <div className="flex items-center justify-center border-y border-border bg-muted/15 py-3 md:border-x md:border-y-0">
          <ArrowDown className="h-5 w-5 text-muted-foreground md:-rotate-90" aria-hidden="true" />
        </div>

        <section className="min-w-0 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-rose-700 dark:text-rose-300" aria-hidden="true" />
            <h3 className="text-sm font-bold">OS process plane</h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            승인 뒤 command는 Claw와 같은 사용자 권한으로 시작된다. 별도 sandbox나 resource limit이 없다.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <p className="flex items-center gap-2"><HardDrive className="h-4 w-4" aria-hidden="true" /> filesystem</p>
            <p className="flex items-center gap-2"><Network className="h-4 w-4" aria-hidden="true" /> network</p>
            <p className="flex items-center gap-2"><Cpu className="h-4 w-4" aria-hidden="true" /> CPU/RAM</p>
            <p className="flex items-center gap-2"><Ban className="h-4 w-4" aria-hidden="true" /> timeout 없음</p>
          </div>
        </section>
      </div>

      <div className="border-t border-rose-500/30 bg-rose-500/[0.05] px-4 py-4 text-sm leading-relaxed sm:px-5">
        <strong>결론: 증명하지 않는다.</strong> read-only는 authorization label이다. command 자체가
        <code className="mx-1">rm</code>, shell redirect, network client를 실행하면 OS가 허용하는 side effect를 만들 수 있다.
      </div>
    </figure>
  );
}
