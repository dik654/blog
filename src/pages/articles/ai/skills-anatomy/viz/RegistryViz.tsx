import VizFrame from "@/components/viz/VizFrame";

const scopes = [
  ["REPO", "$CWD/.agents/skills → $REPO_ROOT/.agents/skills", "module·repository workflow"],
  ["USER", "$HOME/.agents/skills", "개인의 여러 repository 공통 workflow"],
  ["ADMIN", "/etc/codex/skills", "machine·container·조직 기본 automation"],
  ["SYSTEM", "OpenAI bundled", "모든 사용자가 받는 broad capability"],
] as const;

export default function RegistryViz() {
  return (
    <VizFrame
      eyebrow="Discovery scope"
      title="파일 위치는 현재 session의 후보 범위와 owner를 함께 정합니다"
      description="Repository에서는 CWD부터 root까지 탐색하며, 같은 name이 있어도 merge되지 않으므로 path를 포함한 discovery 결과를 확인합니다."
    >
      <div className="border-y border-border/70">
        <div className="hidden grid-cols-[5rem_minmax(0,1.5fr)_minmax(0,1fr)] gap-5 border-b border-border/70 py-3 text-[11px] font-bold text-muted-foreground md:grid">
          <span>Scope</span><span>Location</span><span>Suggested owner</span>
        </div>
        {scopes.map(([scope, location, owner]) => (
          <div
            key={scope}
            className="grid min-w-0 gap-2 border-b border-border/60 py-4 last:border-b-0 md:grid-cols-[5rem_minmax(0,1.5fr)_minmax(0,1fr)] md:gap-5"
          >
            <strong className="text-xs text-primary">{scope}</strong>
            <code className="break-all text-xs leading-5 text-foreground">{location}</code>
            <span className="break-words text-xs leading-5 text-muted-foreground">{owner}</span>
          </div>
        ))}
      </div>
      <p className="mt-5 border-l border-border pl-4 text-xs leading-5 text-muted-foreground">
        다른 사용자가 설치할 package가 필요하면 local discovery 경로를 늘리는 대신 Plugin distribution으로 책임을 옮깁니다.
      </p>
    </VizFrame>
  );
}
