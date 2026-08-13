import VizFrame from "@/components/viz/VizFrame";

const tree = [
  ["SKILL.md", "필수", "name · description · workflow instructions", "항상, 선택된 뒤 전체"],
  ["scripts/", "선택", "결정적 검사·외부 tooling", "필요할 때 실행"],
  ["references/", "선택", "긴 규약·API·domain 지식", "본문이 지시한 경우 읽기"],
  ["assets/", "선택", "template·fixture·resource", "산출물 생성 시 사용"],
  ["agents/openai.yaml", "선택", "OpenAI UI·policy·tool dependency", "제품 integration 시 읽기"],
] as const;

export default function FormatViz() {
  return (
    <VizFrame
      eyebrow="Directory contract"
      title="필수 entry point와 선택 resource를 역할과 수명으로 나눕니다"
      description="파일을 많이 만드는 것이 목적이 아니라 instruction·code·근거·template이 서로 독립적으로 검토되고 필요한 때만 로드되게 하는 구조입니다."
    >
      <div className="divide-y divide-border/70 border-y border-border/70">
        {tree.map(([path, requirement, role, load], index) => (
          <div
            key={path}
            className="grid min-w-0 gap-2 py-4 sm:grid-cols-[2rem_9.5rem_4rem_1fr] sm:items-start sm:gap-4"
          >
            <span className="font-mono text-[11px] text-muted-foreground">0{index + 1}</span>
            <code className="break-all text-xs font-bold text-foreground">{path}</code>
            <span className="text-xs font-semibold text-primary">{requirement}</span>
            <div className="min-w-0 text-xs leading-5 text-muted-foreground">
              <p className="break-words">{role}</p>
              <p className="mt-1 break-words text-foreground/65">로딩: {load}</p>
            </div>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
