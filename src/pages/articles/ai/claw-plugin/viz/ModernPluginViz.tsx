const registryStages = [
  ["01 · DISCOVER", "외부 package 고정", "acme/auth-lint@1.2.0의 root·archive digest·publisher provenance를 같은 설치 후보에 묶습니다."],
  ["02 · VALIDATE", "Manifest와 path 검사", "plugin.json의 version·workspace-write·hook·init/shutdown·auth_lint schema가 형식 조건을 통과합니다."],
  ["03 · ENABLE", "Registry에 유일하게 합류", "settings가 켜져 있고 enabled 집합 안에서 auth_lint라는 tool name이 충돌하지 않아야 합니다."],
  ["04 · READY", "Init 뒤 generation 고정", "Initialize가 성공하고 model schema·permission decision·executor가 같은 plugin generation을 가리켜야 합니다."],
] as const;

export function PluginRegistryViz() {
  return (
    <figure data-viz="claw-plugin-registry" data-viz-canvas className="not-prose my-8 min-w-0 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b border-border/70 p-4 sm:p-6">
        <p className="text-sm font-semibold text-foreground">auth-lint는 발견됐다는 이유만으로 실행 가능한 plugin이 되지 않습니다</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">같은 package identity를 discover → validate → enable → ready까지 유지해야 로그인 수정 뒤의 auth_lint 호출을 해석할 수 있습니다.</p>
      </figcaption>
      <div className="grid grid-cols-2 gap-3 p-4 sm:p-6 lg:grid-cols-4">
        {registryStages.map(([label, title, body]) => <section key={label} className="min-w-0 rounded-lg border border-border bg-background p-3 sm:p-4"><p className="break-words text-[10px] font-bold tracking-wide text-primary">{label}</p><h3 className="mt-2 break-words text-sm font-semibold text-foreground">{title}</h3><p className="mt-2 break-words text-xs leading-5 text-muted-foreground">{body}</p></section>)}
      </div>
      <p className="border-t border-border/70 bg-muted/30 px-4 py-3 text-xs leading-5 text-muted-foreground sm:px-6">Manifest validation은 publisher 신뢰를 증명하지 않고, enabled는 init 성공을 뜻하지 않으며, permission label은 executor 앞 enforcement를 대신하지 않습니다.</p>
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
