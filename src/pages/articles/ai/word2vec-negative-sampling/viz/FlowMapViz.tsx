import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — 두 입구(문장·추첨표), 앞단의 출현 제거, 합친 기록의 점수·표시, 줄로 돌아가는 고칠 양.
 */
const SCENES = [
  { label: "두 입구", summary: "문장 · 추첨표", note: "한쪽은 문장에서 가까이 나타난 짝을 만들고, 다른 쪽은 출현 횟수로 만든 추첨표에서 비교 대상을 고릅니다.", on: ["pair", "draw", "sentence", "count", "table"] },
  { label: "합쳐서 점검", summary: "점수 + 표시", note: "출발 단어는 그대로 두고 도착 단어만 바꿉니다. 두 줄을 같은 자리끼리 곱해 더한 점수에 관찰인지 추첨인지 표시를 붙입니다.", on: ["pair", "draw", "score"] },
  { label: "줄로 돌려줌", summary: "어긋난 만큼 고침", note: "점수가 표시와 어긋난 만큼 관련된 줄에 고칠 양을 보냅니다.", on: ["score", "fix"] },
  { label: "앞단의 제거", summary: "재료가 바뀜", note: "자주 나오는 단어의 일부 출현을 먼저 지우면 이웃 자체가 바뀝니다. 추첨은 만든 질문에 비교를 붙이고, 제거는 재료를 바꿉니다.", on: ["sentence", "drop", "pair"] },
] as const;

function Box({ text, on }: { text: string; on: boolean }) {
  return (
    <span className={`flex min-h-11 min-w-0 items-center justify-center rounded border px-1 py-1 text-center text-xs leading-4 break-keep ${on ? "border-primary bg-primary/10 font-semibold" : "border-border/60 text-muted-foreground/70"}`}>
      {text}
    </span>
  );
}
const Arrow = ({ on, text = "→" }: { on: boolean; text?: string }) => (
  <span aria-hidden="true" className={`self-center text-center text-xs ${on ? "text-primary" : "text-muted-foreground/40"}`}>{text}</span>
);
const LANE = "grid grid-cols-[minmax(0,1fr)_0.75rem_minmax(0,1fr)_0.75rem_minmax(0,1fr)] gap-1";

export default function FlowMapViz() {
  return (
    <SceneShell
      eyebrow="전체 흐름"
      title="문장과 추첨표가 만든 기록을 합쳐 줄을 고칩니다"
      description="위 줄은 문장에서, 아래 줄은 추첨표 재료에서 시작합니다. 계산은 뒤의 절에서 따라갑니다."
      ariaLabel="문장과 추첨표 두 입구에서 나온 기록이 합쳐져 점수와 표시를 얻고 줄을 고치는 전체 흐름"
      scenes={SCENES}
      render={(active) => {
        const on = new Set<string>(SCENES[active].on);
        return (
          <div className="min-w-0 space-y-2">
            <div className={LANE}>
              <Box text="문장" on={on.has("sentence")} />
              <Arrow on={on.has("drop")} />
              <Box text="일부 출현 지우기" on={on.has("drop")} />
              <Arrow on={on.has("pair")} />
              <Box text="가까운 단어 짝" on={on.has("pair")} />
            </div>
            <div className={LANE}>
              <Box text="단어별 출현 횟수" on={on.has("count")} />
              <Arrow on={on.has("table")} />
              <Box text="추첨표" on={on.has("table")} />
              <Arrow on={on.has("draw")} />
              <Box text="비교 대상" on={on.has("draw")} />
            </div>
            <div className="text-center"><Arrow on={on.has("score")} text="↓" /></div>
            <Box text="두 기록 합치기: 점수 + 관찰·추첨 표시" on={on.has("score")} />
            <div className="text-center"><Arrow on={on.has("fix")} text="↓" /></div>
            <Box text="표시와 어긋난 만큼 관련된 줄 고치기" on={on.has("fix")} />
          </div>
        );
      }}
    />
  );
}
