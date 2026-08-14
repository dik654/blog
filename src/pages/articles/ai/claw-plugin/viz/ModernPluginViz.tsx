const rows = [
  ["Builtin", "binary와 함께 제공", "compile/package boundary"],
  ["Bundled", "설치 layout에서 발견", "배포 파일 boundary"],
  ["External", "local path·git 설치", "외부 공급망 boundary"],
] as const;

export function PluginRegistryViz() {
  return (
    <figure data-viz="claw-plugin-registry" className="not-prose my-8 min-w-0 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b border-border/70 p-4 sm:p-6">
        <p className="text-sm font-semibold text-foreground">세 종류의 plugin이 하나의 registry에서 충돌을 검사한다</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">종류가 달라도 enabled tool name이 같으면 aggregation이 실패합니다.</p>
      </figcaption>
      <div className="grid gap-3 p-4 sm:hidden">
        {rows.map(([kind, source, boundary]) => <div key={kind} className="min-w-0 rounded-lg border border-border bg-background p-4"><p className="text-sm font-semibold text-foreground">{kind}</p><dl className="mt-3 grid gap-2 text-xs leading-5"><div><dt className="font-medium text-foreground">발견 위치</dt><dd className="break-words text-muted-foreground">{source}</dd></div><div><dt className="font-medium text-foreground">추가로 확인할 것</dt><dd className="break-words text-muted-foreground">{boundary}</dd></div></dl></div>)}
      </div>
      <div className="hidden p-4 sm:block sm:p-6">
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="grid grid-cols-3 bg-muted/50 text-xs font-semibold"><div className="p-3">종류</div><div className="border-l border-border p-3">발견 위치</div><div className="border-l border-border p-3">추가로 확인할 것</div></div>
          {rows.map(([kind, source, boundary]) => <div key={kind} className="grid grid-cols-3 border-t border-border text-xs leading-5"><div className="p-3 font-medium">{kind}</div><div className="border-l border-border p-3 text-muted-foreground">{source}</div><div className="border-l border-border p-3 text-muted-foreground">{boundary}</div></div>)}
        </div>
      </div>
    </figure>
  );
}

export function PluginExecutionViz() {
  const stages = [["Manifest", "schema·command·requiredPermission"], ["Registry", "enabled·unique tool name"], ["Process", "stdin JSON·env·cwd"], ["Result", "exit·stdout 또는 stderr"]] as const;
  return (
    <figure data-viz="claw-plugin-execution" className="not-prose my-8 min-w-0 rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <figcaption className="mb-5"><p className="text-sm font-semibold">Manifest의 권한 label과 실제 process 격리는 같은 것이 아니다</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Pinned execute 경로는 command를 직접 spawn하지만 별도 permission enforcer 호출은 이 함수에서 확인되지 않습니다.</p></figcaption>
      <div className="grid gap-3 md:grid-cols-4">
        {stages.map(([title, detail], index) => <div key={title} className="min-w-0 rounded-lg border border-border bg-background p-4"><span className="text-[11px] font-semibold text-primary">0{index + 1}</span><p className="mt-2 text-sm font-semibold">{title}</p><p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{detail}</p></div>)}
      </div>
    </figure>
  );
}
