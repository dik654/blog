import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — (가정) 재생재료 60kg을 새 원료와 같은 품질로 모두 쓴다.
 * 수요 100 → 새 원료 40, 수요 120 → 새 원료 60.
 * 발생 100 → 회수 60, 발생 80 → 80×0.8×0.75 = 48. 나머지 100−60=40, 80−48=32.
 */
const AXIS = 120;

interface Part {
  name: string;
  value: number;
  kind: "recovered" | "new" | "rest" | "avoided";
}

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  rows: readonly { title: string; parts: readonly Part[] }[];
}[] = [
  {
    label: "수요가 늘면",
    summary: "회수 60kg 그대로 · 새 원료 40→60kg",
    note: "(가정) 재생재료 60kg을 새 원료와 같은 품질로 모두 쓸 수 있을 때, 새 제품의 필요량이 100kg이면 새 원료 40kg, 120kg이면 60kg입니다. 회수량이 같아도 전체 수요가 커지면 새 원료 사용이 늘 수 있습니다.",
    rows: [
      { title: "필요량 100kg", parts: [{ name: "재생재료", value: 60, kind: "recovered" }, { name: "새 원료", value: 40, kind: "new" }] },
      { title: "필요량 120kg", parts: [{ name: "재생재료", value: 60, kind: "recovered" }, { name: "새 원료", value: 60, kind: "new" }] },
    ],
  },
  {
    label: "덜 버리면",
    summary: "회수 60→48kg · 발생 100→80kg",
    note: "(가정) 제품을 오래 써서 발생량이 80kg이 되고 수거율 80%·처리 수율 75%를 유지하면 회수량은 80×0.8×0.75=48kg입니다. 회수량만 보면 줄었지만 폐기물 발생 자체가 20kg 줄었습니다.",
    rows: [
      { title: "발생 100kg", parts: [{ name: "회수", value: 60, kind: "recovered" }, { name: "재료가 되지 않음", value: 40, kind: "rest" }] },
      { title: "발생 80kg", parts: [{ name: "회수", value: 48, kind: "recovered" }, { name: "재료가 되지 않음", value: 32, kind: "rest" }, { name: "발생 안 함", value: 20, kind: "avoided" }] },
    ],
  },
];

const STYLE: Record<Part["kind"], string> = {
  recovered: "bg-[#2563eb] text-white",
  new: "bg-[#b45309] text-white",
  rest: "bg-[#64748b] text-white",
  avoided: "border border-dashed border-[#15803d] text-[#15803d] dark:text-[#86efac]",
};

export default function ReuseVsRecoveryViz() {
  return (
    <SceneShell
      eyebrow="회수량 하나로는"
      title="회수량 하나로는 새 원료도 발생량도 보이지 않습니다"
      description="모든 막대는 같은 0–120kg 축입니다. 두 장면 모두 글이 놓은 가정이며 실측이 아닙니다."
      ariaLabel="수요 증가와 발생량 감소에서 회수량과 새 원료, 폐기물 발생의 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const legend = Array.from(new Map(scene.rows.flatMap((row) => row.parts).map((part) => [part.kind, part])).values());
        return (
          <div className="min-w-0 text-sm">
            <div className="space-y-4">
              {scene.rows.map((row) => (
                <div key={row.title}>
                  <p className="text-xs font-bold">{row.title}</p>
                  <div className="mt-1.5 flex h-9 w-full rounded-sm bg-muted/40" role="img" aria-label={`${row.title}: ${row.parts.map((part) => `${part.name} ${part.value}킬로그램`).join(", ")}`}>
                    {row.parts.map((part) => (
                      <div key={part.name} className={`flex items-center justify-center font-mono text-xs font-bold ${STYLE[part.kind]}`} style={{ width: `${(part.value / AXIS) * 100}%` }}>
                        {part.value}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="relative mt-1.5 h-5 font-mono text-xs text-muted-foreground">
              <span className="absolute left-0">0</span>
              <span className="absolute right-0">120kg</span>
            </div>
            <ul className="mt-2 flex min-h-[1.25rem] flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {legend.map((part) => (
                <li key={part.kind} className="flex items-center gap-1.5">
                  <span className={`h-3 w-3 rounded-[2px] ${STYLE[part.kind]}`} aria-hidden />
                  {part.name}
                </li>
              ))}
            </ul>
          </div>
        );
      }}
    />
  );
}
