import VizFrame from "@/components/viz/VizFrame";

const flow = [
  ["발견", "name · description · path", "작은 후보 목록"],
  ["선택", "직접 지정 또는 요청 일치", "gh-fix-ci 선택"],
  ["읽기", "SKILL.md 전체", "재현→수정→검증 순서"],
  ["확장", "필요한 reference·script", "CI 정책과 재현 명령"],
  ["실행", "기존 tool·권한", "검증 결과와 변경 내역"],
] as const;

export default function LoadingViz() {
  return (
    <VizFrame
      eyebrow="필요한 만큼 펼치기"
      title="짧은 후보 정보에서 전체 지침과 필요한 자료로 확장합니다"
      description="CI 수정 요청에 필요한 자료만 차례로 읽으며, 설치된 모든 파일을 한 번에 context에 넣지 않습니다."
    >
      <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {flow.map(([name, input, output], index) => (
          <li key={name} className="min-w-0 border-l border-border/80 pl-4">
            <span className="font-mono text-[11px] font-bold text-primary">0{index + 1}</span>
            <h4 className="mt-2 text-sm font-bold text-foreground">{name}</h4>
            <p className="mt-3 break-words text-xs leading-5 text-muted-foreground">{input}</p>
            <p className="mt-2 break-words text-xs font-semibold leading-5 text-foreground/75">
              → {output}
            </p>
          </li>
        ))}
      </ol>
      <div className="mt-7 grid gap-3 border-t border-border/70 pt-5 text-xs leading-5 sm:grid-cols-3">
        <p className="text-muted-foreground"><strong className="text-foreground">선택 전</strong><br />이름·설명·경로</p>
        <p className="text-muted-foreground"><strong className="text-foreground">선택 뒤</strong><br />SKILL.md 전체</p>
        <p className="text-muted-foreground"><strong className="text-foreground">작업 중</strong><br />필요한 지원 파일만</p>
      </div>
    </VizFrame>
  );
}
