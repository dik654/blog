import SimplexSceneShell from "./SimplexSceneShell";

/**
 * 본문 대응: #quorum — n=4, f=1, q=3. 크기 3인 두 signer 집합은 최소 2명이 겹치고(2q−n=2),
 * Byzantine은 최대 1명이라 교집합에 honest가 최소 1명 남는다(2−f=1).
 * Honest validator는 같은 phase의 충돌하는 표를 보내지 않는다는 글의 전제를 따른다.
 * X = 이미 notarization을 받은 digest, Y = 같은 round의 충돌 digest, B = Byzantine은 모두 설명용 가정이다.
 */
type Mark = "sign" | "refuse" | "none";

const VOTERS = [
  { name: "A", byzantine: false },
  { name: "B", byzantine: true },
  { name: "C", byzantine: false },
  { name: "D", byzantine: false },
] as const;

const SCENES = [
  {
    label: "X에 세 표",
    summary: "X: 3/3 → notarization",
    x: ["sign", "sign", "sign", "none"],
    y: ["none", "none", "none", "none"],
    note: "A·B·C가 같은 round의 digest X에 notarize해 notarization이 생겼다고 둡니다. 여기서 B는 Byzantine이라고 가정합니다. 어느 validator를 Byzantine으로 둘지도 설명용 선택입니다.",
  },
  {
    label: "Y도 세 명이 필요합니다",
    summary: "어떤 3명이든 A·B·C 중 2명 이상",
    x: ["sign", "sign", "sign", "none"],
    y: ["none", "none", "none", "none"],
    note: "충돌하는 digest Y도 서로 다른 signer 3명이 있어야 certificate가 됩니다. 네 명 중 누구를 골라도 X에 이미 서명한 A·B·C 가운데 최소 2명이 들어갑니다. 2q − n = 6 − 4 = 2입니다.",
  },
  {
    label: "B와 D는 Y에 서명",
    summary: "Y: 2/3",
    x: ["sign", "sign", "sign", "none"],
    y: ["none", "sign", "none", "sign"],
    note: "Byzantine B는 X와 Y 양쪽에 서명할 수 있습니다. 이 phase에 아직 표를 내지 않은 D가 Y에 서명해도 두 표뿐입니다.",
  },
  {
    label: "A·C는 거절합니다",
    summary: "Y: 2/3 · 증서 없음",
    x: ["sign", "sign", "sign", "none"],
    y: ["refuse", "sign", "refuse", "sign"],
    note: "세 번째 표는 A나 C에서 와야 하지만 둘은 honest라 같은 phase에 충돌하는 표를 보내지 않는다는 전제를 따릅니다. 교집합 2명에서 Byzantine 1명을 빼도 honest 1명이 남는다는 식이 바로 이 자리입니다. 이 겹침은 payload 원문 보관이나 Application 실행까지 증명하지는 않습니다.",
  },
] as const;

const MARK_TEXT: Record<Mark, string> = { sign: "서명", refuse: "거절", none: "—" };

function Cell({ mark }: { mark: Mark }) {
  const color = mark === "sign" ? "#2563eb" : mark === "refuse" ? "#dc2626" : "#94a3b8";
  return (
    <div
      className={`rounded-lg border px-1 py-2 text-center text-xs font-bold ${mark === "none" ? "border-dashed" : ""}`}
      style={{ borderColor: color, color }}
    >
      {MARK_TEXT[mark]}
    </div>
  );
}

export default function ConflictingQuorumViz() {
  return (
    <SimplexSceneShell
      eyebrow="겹침이 막는 것 · n=4, f=1"
      title="충돌하는 두 번째 증서는 세 번째 표를 얻지 못합니다"
      description="같은 round에서 digest X와 다른 digest Y가 각각 notarization을 노리는 장면입니다. X·Y와 B가 Byzantine이라는 배치는 설명용 가정입니다."
      ariaLabel="Byzantine 한 명이 있어도 충돌하는 두 번째 notarization이 세 표를 모으지 못하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const yCount = scene.y.filter((mark) => mark === "sign").length;
        const xCount = scene.x.filter((mark) => mark === "sign").length;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[3rem_repeat(4,minmax(0,1fr))_2.25rem] sm:grid-cols-[3.25rem_repeat(4,minmax(0,1fr))_3rem] items-center gap-1.5 sm:gap-2">
              <span />
              {VOTERS.map((voter) => (
                <div key={voter.name} className="text-center">
                  <strong className="font-mono text-sm">{voter.name}</strong>
                  <span className="block whitespace-nowrap text-[9px] leading-4 sm:text-[10px]" style={{ color: voter.byzantine ? "#d97706" : "#64748b" }}>
                    {voter.byzantine ? "Byzantine" : "honest"}
                  </span>
                </div>
              ))}
              <span className="text-center text-[10px] text-muted-foreground">표 수</span>

              <span className="text-xs font-bold">digest X</span>
              {scene.x.map((mark, index) => <Cell key={`x-${index}`} mark={mark} />)}
              <span className="text-center font-mono text-sm font-bold" style={{ color: "#2563eb" }}>{xCount}/3</span>

              <span className="text-xs font-bold">digest Y</span>
              {scene.y.map((mark, index) => <Cell key={`y-${index}`} mark={mark} />)}
              <span className="text-center font-mono text-sm font-bold" style={{ color: yCount >= 3 ? "#2563eb" : "#64748b" }}>{yCount}/3</span>
            </div>
            <div className={`mt-3 grid grid-cols-[3rem_repeat(4,minmax(0,1fr))_2.25rem] sm:grid-cols-[3.25rem_repeat(4,minmax(0,1fr))_3rem] gap-1.5 sm:gap-2 ${active === 1 ? "" : "invisible"}`} aria-hidden={active !== 1}>
              <span />
              <div className="col-span-3 rounded-lg border px-2 py-1.5 text-center text-[11px] leading-4" style={{ borderColor: "#d97706" }}>
                X에 이미 서명한 3명 · Y의 3명과 최소 2명 겹침
              </div>
              <div className="rounded-lg border border-dashed px-1 py-1.5 text-center text-[11px] leading-4" style={{ borderColor: "#94a3b8" }}>
                남은 1명
              </div>
              <span />
            </div>
          </div>
        );
      }}
    />
  );
}
