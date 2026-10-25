import VizFrame from "@/components/viz/VizFrame";

const scopes = [
  ["LOCAL", "실행 환경의 path", "직접 관리하는 파일과 버전"],
  ["HOSTED", "skill_id + version", "업로드한 versioned bundle"],
  ["PLUGIN", "skills/ + plugin.json", "설치 가능한 배포 묶음"],
  ["MCP", "mcp.json · server", "실시간 데이터·인증·동작"],
] as const;

export default function RegistryViz() {
  return (
    <VizFrame
      eyebrow="배포 형태"
      title="작업 지식의 버전과 실제 동작의 연결을 따로 관리합니다"
      description="Skill을 파일 경로로 제공할지, versioned bundle로 올릴지, MCP와 함께 Plugin으로 묶을지에 따라 배포 책임이 달라집니다."
    >
      <div className="border-y border-border/70">
        <div className="hidden grid-cols-[5rem_minmax(0,1.5fr)_minmax(0,1fr)] gap-5 border-b border-border/70 py-3 text-[11px] font-bold text-muted-foreground md:grid">
          <span>형태</span><span>식별 방법</span><span>관리 책임</span>
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
        Plugin은 Skill과 MCP 연결을 함께 배포할 수 있지만, Skill은 작업 순서를 맡고 MCP server는 실시간 데이터·인증·허용된 동작을 맡습니다.
      </p>
    </VizFrame>
  );
}
