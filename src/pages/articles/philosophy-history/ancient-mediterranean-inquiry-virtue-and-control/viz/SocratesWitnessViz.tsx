import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 소크라테스는 글을 남기지 않았으므로 플라톤·크세노폰·아리스토파네스의 서로 다른 증언으로 읽는다.
 * '소크라테스가 정확히 무엇을 말했다'와 '플라톤의 대화편이 소크라테스를 통해 무엇을 논증한다'를 분리한다.
 */
const WITNESSES: readonly string[] = ["플라톤", "크세노폰", "아리스토파네스"];

const SCENES = [
  { label: "직접 남긴 글이 없습니다", summary: "본인 저술 0", note: "소크라테스는 글을 남기지 않았습니다. 그래서 그가 한 말로 곧장 가는 길이 없고, 다른 사람이 남긴 기록을 거쳐야 합니다." },
  { label: "세 갈래의 서로 다른 증언", summary: "대표 증언 3 → 한 인물", note: "플라톤·크세노폰·아리스토파네스 같은 사람들이 각자 소크라테스를 기록했고, 그 증언은 서로 다릅니다. 그림의 세 칸은 그 가운데 글이 든 예이며, 독자는 이런 증언을 거쳐 소크라테스를 읽습니다." },
  { label: "두 질문을 따로 둡니다", summary: "역사 속 발언 ≠ 대화편의 논증", note: "‘소크라테스가 정확히 무엇을 말했다’는 역사 속 인물에 대한 질문입니다. ‘플라톤의 대화편이 소크라테스를 통해 무엇을 논증한다’는 플라톤의 글 안에서 답하는 질문입니다." },
] as const;

function Node({ children, tone = "plain" }: { children: ReactNode; tone?: "plain" | "muted" | "accent" }) {
  const border = tone === "muted" ? "border-dashed border-border text-muted-foreground" : tone === "accent" ? "border-primary bg-primary/10" : "border-border";
  return <div className={`min-w-0 rounded-lg border px-1 py-2 text-center text-xs font-semibold leading-5 [word-break:keep-all] sm:text-sm sm:leading-6 ${border}`}>{children}</div>;
}

function Diagram({ index }: { index: number }) {
  const showWitness = index >= 1;
  const split = index === 2;
  return (
    <div className="min-w-0 space-y-2">
      <Node tone={split ? "accent" : "plain"}>
        역사 속 소크라테스
        <span className="block text-xs font-normal text-muted-foreground">직접 쓴 글 없음</span>
      </Node>
      <div className="grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground" aria-hidden>
        {WITNESSES.map((name) => (
          <span key={name}>{showWitness ? "↑" : "·"}</span>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {WITNESSES.map((name, position) => (
          <Node key={name} tone={!showWitness ? "muted" : split && position === 0 ? "accent" : "plain"}>
            {name}
            <span className="block text-xs font-normal text-muted-foreground">{showWitness ? "의 증언" : "기록"}</span>
          </Node>
        ))}
      </div>
      <div className="grid gap-2 pt-2 sm:grid-cols-2">
        <div className={`min-w-0 rounded-lg border px-3 py-2 text-sm leading-6 ${split ? "border-primary" : "border-dashed border-border text-muted-foreground"}`}>
          <span className="block text-xs text-muted-foreground">질문 1 · 위쪽 칸</span>
          소크라테스가 정확히 무엇을 말했나
          <span className="block text-xs text-muted-foreground">서로 다른 증언을 거쳐서만 다가갑니다</span>
        </div>
        <div className={`min-w-0 rounded-lg border px-3 py-2 text-sm leading-6 ${split ? "border-primary" : "border-dashed border-border text-muted-foreground"}`}>
          <span className="block text-xs text-muted-foreground">질문 2 · 플라톤 칸</span>
          대화편이 소크라테스를 통해 무엇을 논증하나
          <span className="block text-xs text-muted-foreground">플라톤의 글 안에서 읽습니다</span>
        </div>
      </div>
    </div>
  );
}

export default function SocratesWitnessViz() {
  return (
    <SceneShell
      eyebrow="증언을 거쳐 읽기"
      title="소크라테스에게는 남의 증언을 거쳐서만 닿습니다"
      description="위 칸은 역사 속 인물, 가운데 세 칸은 그를 기록한 사람의 대표 예입니다. 화살표는 독자가 거슬러 올라가는 방향입니다."
      ariaLabel="글을 남기지 않은 소크라테스를 플라톤, 크세노폰, 아리스토파네스 같은 증언으로 읽고 두 질문을 구분하는 세 장면"
      scenes={SCENES}
      render={(active) => <Diagram index={active} />}
    />
  );
}
