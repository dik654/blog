import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — 국제연맹 규약 10·11조의 평화 규칙과 22조의 위임통치를 한 문서 안에서 읽기.
 * 어느 쪽만 읽으면 무엇이 빠지는지를 장면으로 나눕니다. 보고·청원의 주체와 방향은 본문에 없어 정하지 않았습니다.
 */
const SCENES = [
  { label: "평화 규칙", summary: "10조·11조", peace: true, mandate: false, channel: false, missing: "", note: "회원국의 영토 보전과 전쟁 위험에 대한 공동 대응을 약속한 조항입니다." },
  { label: "위계 규칙", summary: "22조", peace: false, mandate: true, channel: false, missing: "", note: "주민을 아직 스스로 설 수 없는 사람들로 표현하고 승전국의 위임통치를 정당화했습니다." },
  { label: "성과만 읽으면", summary: "빠짐: 식민지의 주권", peace: true, mandate: false, channel: false, missing: "식민지의 주권이 보이지 않습니다", note: "최초의 세계 평화 기구라는 성과만으로 읽으면 22조가 흐리게 남습니다." },
  { label: "위임통치만 읽으면", summary: "빠짐: 새 통로", peace: false, mandate: true, channel: false, missing: "국제적 보고와 청원이라는 새 통로를 놓칩니다", note: "22조의 위계만 보면 규약이 함께 연 통로가 빠집니다." },
  { label: "함께 읽기", summary: "한 문서의 두 규칙", peace: true, mandate: true, channel: true, missing: "", note: "평화 규칙과 위계 규칙이 같은 문서 안에 있으니 함께 읽어야 합니다." },
] as const;

function Panel({ on, title, children }: { on: boolean; title: string; children: ReactNode }) {
  return (
    <div className={`min-w-0 rounded-lg border p-2.5 transition-opacity duration-300 motion-reduce:transition-none ${on ? "border-border bg-background" : "border-dashed border-border/60 opacity-35"}`}>
      <p className="text-xs font-bold text-primary">{title}</p>
      <div className="mt-1.5 space-y-1 text-xs leading-5 sm:text-sm">{children}</div>
    </div>
  );
}

export default function CovenantTwoRulesViz() {
  return (
    <SceneShell
      eyebrow="한 문서, 두 규칙"
      title="같은 규약 안에서 평화 규칙과 위계 규칙이 함께 작동합니다"
      description="큰 틀 하나가 국제연맹 규약이고 그 안의 두 칸이 조항입니다. 흐린 칸은 그 읽기에서 빠진 부분입니다."
      ariaLabel="국제연맹 규약 10·11조와 22조를 각각 또는 함께 읽을 때 보이는 것"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 rounded-lg border border-border/70 p-2 sm:p-3">
            <p className="mb-1.5 text-xs font-semibold text-muted-foreground">국제연맹 규약</p>
            <div className="grid min-w-0 grid-cols-2 gap-2">
              <Panel on={scene.peace} title="10조·11조">
                <p>회원국의 영토 보전</p>
                <p>전쟁 위험에 공동 대응</p>
              </Panel>
              <Panel on={scene.mandate} title="22조">
                <p>승전국의 위임통치 → 옛 독일·오스만 영토의 주민</p>
                <p className="text-xs text-muted-foreground">국제연맹의 감독 아래</p>
              </Panel>
            </div>
            <div className={`mt-2 rounded-lg border px-3 py-1.5 text-xs leading-5 sm:text-sm ${scene.channel ? "border-border bg-background font-semibold" : scene.missing ? "border-dashed" : "invisible"}`} style={scene.missing ? { borderColor: "#dc2626", color: "#dc2626" } : undefined}>
              {scene.channel ? "국제적 보고와 청원이라는 새 통로" : scene.missing || "\u00a0"}
            </div>
          </div>
        );
      }}
    />
  );
}
