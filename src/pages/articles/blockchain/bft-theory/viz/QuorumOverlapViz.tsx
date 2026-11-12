import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — A·B·C·D 중 D만 임의 행동. 주문 7의 후보 X(승인)·Y(취소).
 * 동의 2개 규칙: X={A,D}, Y={B,D} → 겹침 {D}뿐 → 둘 다 통과.
 * 동의 3개 규칙: X={A,B,D}, Y에 B·C·D가 필요 → 겹침 {B,D}. B가 규칙을 지키면 Y는 C·D 2표에서 멈춤.
 */
const PEOPLE = ["A", "B", "C", "D"] as const;
type Person = (typeof PEOPLE)[number];

interface Row {
  signed: readonly Person[];
  /** B처럼 서명해야 하지만 규칙 때문에 서명하지 않는 자리 */
  refused?: readonly Person[];
}

const SCENES = [
  {
    label: "동의 2개면 확정: X",
    summary: "X = A·D → 2/2 통과",
    q: 2,
    x: { signed: ["A", "D"] } as Row,
    y: { signed: [] } as Row,
    note: "필요한 동의가 두 개라고 정합니다. A와 D가 X(주문 승인)에 동의하면 X는 조건을 통과합니다.",
  },
  {
    label: "동의 2개면 확정: Y도",
    summary: "Y = B·D → 2/2 통과 · 겹침 D뿐",
    q: 2,
    x: { signed: ["A", "D"] } as Row,
    y: { signed: ["B", "D"] } as Row,
    note: "D가 Y(같은 주문 취소)에도 동의합니다. 두 묶음이 겹치는 사람은 D 한 명뿐이라 정직한 A·B는 말을 바꾸지 않았는데도 X와 Y가 모두 통과합니다.",
  },
  {
    label: "동의 3개면 확정: X",
    summary: "X = A·B·D → 3/3 통과",
    q: 3,
    x: { signed: ["A", "B", "D"] } as Row,
    y: { signed: [] } as Row,
    note: "필요한 동의를 세 개로 올립니다. A·B·D가 X에 동의해 X는 조건을 통과합니다.",
  },
  {
    label: "동의 3개면 확정: Y는 막힘",
    summary: "Y = C·D → 2/3 미달 · 겹침 B·D",
    q: 3,
    x: { signed: ["A", "B", "D"] } as Row,
    y: { signed: ["C", "D"], refused: ["B"] } as Row,
    note: "Y가 세 표를 모으려면 B·C·D가 필요해 B와 D가 겹칩니다. B가 같은 주문·단계에서 양쪽에 동의하지 않는 규칙을 지키면 Y는 C·D 두 표에서 멈추고 두 묶음은 동시에 만들어지지 않습니다.",
  },
] as const;

const ROW_COLOR = { X: "#2563eb", Y: "#d97706" } as const;

function SetRow({ name, row, q, other }: { name: "X" | "Y"; row: Row; q: number; other: Row }) {
  const count = row.signed.length;
  const pass = count >= q;
  return (
    <div className="grid grid-cols-[3.5rem_repeat(4,minmax(0,1fr))_4.5rem] items-center gap-1.5 sm:gap-2">
      <span className="text-sm font-bold" style={{ color: ROW_COLOR[name] }}>
        {name === "X" ? "X 승인" : "Y 취소"}
      </span>
      {PEOPLE.map((p) => {
        const signed = row.signed.includes(p);
        const refused = row.refused?.includes(p) ?? false;
        // 겹침은 각 후보가 조건을 채우는 데 필요한 묶음(서명 + 규칙 때문에 비어 있는 자리) 사이에서 셉니다.
        const needs = (r: Row, who: Person) => r.signed.includes(who) || (r.refused?.includes(who) ?? false);
        const overlap = (signed || refused) && needs(other, p);
        return (
          <div
            key={p}
            className={`flex h-11 flex-col items-center justify-center rounded-md border text-[11px] leading-4 sm:text-xs ${
              signed ? "border-current font-semibold" : refused ? "border-dashed border-[#64748b]" : "border-border/60 text-muted-foreground/60"
            }`}
            style={
              signed
                ? { color: ROW_COLOR[name], backgroundColor: overlap ? "#a855f71f" : undefined }
                : overlap
                  ? { backgroundColor: "#a855f71f" }
                  : undefined
            }
          >
            <span>{signed ? "동의" : refused ? "거부" : "−"}</span>
            {overlap && <span className="text-[10px] text-[#9333ea] dark:text-[#c084fc]">겹침</span>}
          </div>
        );
      })}
      <span className={`text-right font-mono text-xs font-bold sm:text-sm ${pass ? "text-[#15803d] dark:text-[#4ade80]" : "text-muted-foreground"}`}>
        {count}/{q} {count === 0 ? "" : pass ? "통과" : "미달"}
      </span>
    </div>
  );
}

export default function QuorumOverlapViz() {
  return (
    <SceneShell
      eyebrow="동의 수와 겹침"
      title="동의 두 개는 D 혼자 두 후보를 통과시키고, 세 개는 B를 끌어들입니다"
      description="참여자 A·B·C·D 중 D(빨간 테두리)만 임의로 행동할 수 있습니다. 한 줄이 한 후보에 동의한 묶음이고, 보라색 칸이 두 묶음에 모두 필요한 사람(겹침)입니다. 점선 거부 칸은 규칙 때문에 서명하지 않은 자리입니다."
      ariaLabel="동의 2개와 3개 규칙에서 X와 Y 묶음의 겹침 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-2">
            <div className="grid grid-cols-[3.5rem_repeat(4,minmax(0,1fr))_4.5rem] items-center gap-1.5 text-center text-sm font-bold sm:gap-2">
              <span />
              {PEOPLE.map((p) => (
                <span
                  key={p}
                  className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full border ${p === "D" ? "border-[#dc2626] text-[#dc2626]" : "border-[#64748b]"}`}
                >
                  {p}
                </span>
              ))}
              <span className="text-right text-xs font-semibold text-muted-foreground">필요 {scene.q}</span>
            </div>
            <SetRow name="X" row={scene.x} q={scene.q} other={scene.y} />
            <SetRow name="Y" row={scene.y} q={scene.q} other={scene.x} />
          </div>
        );
      }}
    />
  );
}
