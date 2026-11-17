import PluginSceneShell from "./PluginSceneShell";

/**
 * 본문 대응: #manifest-registry 둘째 문단 — registry는 plugin ID로 정렬하고 enabled plugin의 hook·tool만 모으며,
 * tool은 namespace 없이 definition name으로 합치므로 두 enabled plugin이 auth_lint를 정의하면 aggregation이 오류로 끝난다.
 * acme/auth-lint(External, auth_lint, PreToolUse hook)는 글의 예시이고 plugin-b·plugin-c와 그 tool은 가정이다.
 */
type Kind = "Builtin" | "Bundled" | "External";
interface PluginRow {
  id: string;
  kind: Kind;
  tools: readonly string[];
  hooks: readonly string[];
  assumed: boolean;
}

const PLUGINS: readonly PluginRow[] = [
  { id: "acme/auth-lint", kind: "External", tools: ["auth_lint"], hooks: ["PreToolUse"], assumed: false },
  { id: "plugin-b", kind: "Builtin", tools: ["fmt_check"], hooks: [], assumed: true },
  { id: "plugin-c", kind: "Bundled", tools: ["auth_lint"], hooks: [], assumed: true },
];

/** 장면별 plugin-c의 enabled 여부. 나머지 둘은 계속 enabled다. */
const C_ENABLED: readonly boolean[] = [false, false, true];

const SCENES = [
  { label: "출처는 셋, registry는 하나", summary: "plugin ID 순으로 정렬", note: "Builtin·Bundled·External은 어디서 왔는지가 다를 뿐 같은 registry에 들어가 plugin ID 순으로 놓입니다. plugin-b·plugin-c와 그 tool 이름은 설명을 위한 가정입니다." },
  { label: "enabled plugin만 모읍니다", summary: "tool 2개 · hook 1개", note: "Registry는 enabled인 plugin의 hook과 tool만 모읍니다. plugin-c는 settings에서 꺼져 있어 auth_lint를 정의해도 목록에 들어오지 않습니다." },
  { label: "같은 tool 이름이 두 번", summary: "aggregation 오류", note: "plugin-c를 켜면 enabled plugin 두 개가 auth_lint를 정의합니다. Plugin별 namespace 없이 definition name으로 합치므로 둘 중 하나를 조용히 덮어쓰는 last-wins 대신 aggregation이 오류로 끝납니다. Duplicate plugin ID와 설치 source 우선순위까지 하나의 generation으로 고정되는지는 별도 확인이 필요합니다." },
] as const;

export default function RegistryAggregationViz() {
  return (
    <PluginSceneShell
      eyebrow="Registry aggregation"
      title="Registry는 enabled plugin의 tool을 이름 하나로 합칩니다"
      description="왼쪽 줄 하나가 plugin 하나이고, 오른쪽은 registry가 모은 tool과 hook입니다. Namespace는 tool 이름 앞에 plugin 이름을 붙여 구분하는 방식인데, 이 registry는 그것을 쓰지 않습니다."
      ariaLabel="세 plugin의 enabled 여부에 따라 registry가 모으는 tool 목록과 이름 충돌"
      scenes={SCENES}
      render={(active) => {
        const enabled = (row: PluginRow) => (row.id === "plugin-c" ? C_ENABLED[active] : true);
        const collected = PLUGINS.filter((row) => active > 0 && enabled(row));
        const toolNames = collected.flatMap((row) => row.tools);
        const clash = toolNames.filter((name, index) => toolNames.indexOf(name) !== index);
        const hooks = collected.flatMap((row) => row.hooks);
        return (
          <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div className="min-w-0 space-y-2">
              {PLUGINS.map((row, index) => {
                const on = enabled(row);
                const hit = clash.length > 0 && row.tools.some((tool) => clash.includes(tool));
                return (
                  <div
                    key={row.id}
                    className={`min-w-0 rounded-lg border px-3 py-2 ${on ? "border-border bg-background" : "border-dashed border-border/60 bg-transparent"}`}
                    style={hit ? { borderColor: "#dc2626" } : undefined}
                  >
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="font-mono text-[11px] text-muted-foreground">{index + 1}</span>
                      <span className={`font-mono text-sm font-semibold ${on ? "" : "text-muted-foreground"}`}>{row.id}</span>
                      {row.assumed && <span className="text-[11px] text-muted-foreground">(가정)</span>}
                      <span className="rounded border border-border px-1.5 text-[11px] leading-5 text-muted-foreground">{row.kind}</span>
                      <span className="ml-auto text-[11px] font-semibold" style={{ color: on ? "#16a34a" : "#64748b" }}>
                        {on ? "enabled" : "disabled"}
                      </span>
                    </div>
                    <p className={`mt-1 font-mono text-xs ${on ? "" : "text-muted-foreground/60"}`}>
                      tool: {row.tools.join(", ")}
                      {row.hooks.length > 0 && ` · hook: ${row.hooks.join(", ")}`}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="min-w-0 rounded-lg border p-3" style={{ borderColor: clash.length ? "#dc2626" : undefined }}>
              <p className="text-xs font-semibold">registry가 모은 것</p>
              <div className="mt-2 min-h-[5.5rem] space-y-1.5">
                {active === 0 && <p className="text-xs text-muted-foreground">아직 모으기 전</p>}
                {active > 0 && clash.length === 0 && (
                  <>
                    {toolNames.map((name) => (
                      <p key={name} className="rounded border border-border bg-background px-2 py-1 font-mono text-xs">tool {name}</p>
                    ))}
                    {hooks.map((name) => (
                      <p key={name} className="rounded border border-border bg-background px-2 py-1 font-mono text-xs">hook {name}</p>
                    ))}
                  </>
                )}
                {clash.length > 0 && (
                  <div className="rounded border border-dashed px-2 py-2 text-xs" style={{ borderColor: "#dc2626", color: "#dc2626" }}>
                    <p className="font-mono font-semibold">auth_lint × 2</p>
                    <p className="mt-1">aggregation이 오류로 끝남</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
