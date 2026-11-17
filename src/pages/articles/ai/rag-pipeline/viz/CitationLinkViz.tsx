import SceneShell from "./SceneShell";

/**
 * 본문 대응: #evaluation의 citation precision·recall 식.
 * 인용 5개 중 4개가 주장을 지지 → precision 4/5 = 0.8.
 * 근거가 필요한 주장 6개 중 올바른 인용이 붙은 주장 3개 → recall 3/6 = 0.5.
 * 어느 주장에 어느 인용이 붙었는지는 설명용 가정: u1에 맞는 인용 둘, u4에는 틀린 인용 하나, u5·u6에는 인용 없음.
 */
type Cite = { id: string; valid: boolean };
const CLAIMS: { id: string; cites: Cite[] }[] = [
  { id: "u1", cites: [{ id: "e1", valid: true }, { id: "e2", valid: true }] },
  { id: "u2", cites: [{ id: "e3", valid: true }] },
  { id: "u3", cites: [{ id: "e4", valid: true }] },
  { id: "u4", cites: [{ id: "e5", valid: false }] },
  { id: "u5", cites: [] },
  { id: "u6", cites: [] },
];
const ALL_CITES = CLAIMS.flatMap((claim) => claim.cites);
const VALID_CITES = ALL_CITES.filter((cite) => cite.valid).length;
const SUPPORTED = CLAIMS.filter((claim) => claim.cites.some((cite) => cite.valid)).length;

const SCENES = [
  { label: "주장 6개 · 인용 5개", summary: `주장 ${CLAIMS.length} · 인용 ${ALL_CITES.length}`, note: "답변을 더 쪼갤 수 없는 단위 주장(atomic claim)으로 나눕니다. 외부 근거가 필요한 주장 6개에 인용 5개가 붙었습니다. 어느 주장에 붙었는지는 설명용입니다(가정)." },
  { label: "precision은 인용을 셉니다", summary: `${VALID_CITES} / ${ALL_CITES.length} = ${VALID_CITES / ALL_CITES.length}`, note: "붙인 인용 5개 중 4개가 실제로 그 주장을 지지합니다. 분모가 붙인 인용이므로 인용이 하나도 없는 u5·u6은 이 값에 나타나지 않습니다." },
  { label: "recall은 주장을 셉니다", summary: `${SUPPORTED} / ${CLAIMS.length} = ${SUPPORTED / CLAIMS.length}`, note: "올바른 인용이 하나 이상 붙은 주장은 u1·u2·u3 셋입니다. u1의 맞는 인용 둘은 주장 하나로 셉니다. 인용은 대체로 맞지만 근거가 필요한 주장의 절반에 올바른 인용이 없습니다." },
] as const;

export default function CitationLinkViz() {
  return (
    <SceneShell
      eyebrow="Citation precision · recall"
      title="같은 답에서 인용을 세면 0.8, 주장을 세면 0.5입니다"
      description="행 하나가 근거가 필요한 주장이고 오른쪽 칩이 그 주장에 붙은 인용입니다. ✓는 주장을 지지하는 인용, ✕는 지지하지 않는 인용입니다. 개수는 본문의 예를 씁니다."
      ariaLabel="주장 여섯 개와 인용 다섯 개로 citation precision과 recall을 따로 세는 세 장면"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 divide-y divide-border border-y border-border">
          {CLAIMS.map((claim) => {
            const supported = claim.cites.some((cite) => cite.valid);
            const claimLit = active === 2 && supported;
            const claimMiss = active === 2 && !supported;
            return (
              <div key={claim.id} className={`grid grid-cols-[3.2rem_minmax(0,1fr)_4.5rem] items-center gap-2 py-0.5 sm:py-1.5 ${claimLit ? "bg-[#16a34a]/10" : ""}`}>
                <span className={`font-mono text-xs font-bold ${claimMiss ? "text-[#b91c1c] dark:text-[#fca5a5]" : ""}`}>주장 {claim.id}</span>
                <div className="flex min-h-6 flex-wrap items-center gap-1.5">
                  {claim.cites.length === 0 && <span className="text-[11px] text-muted-foreground">인용 없음</span>}
                  {claim.cites.map((cite) => {
                    const lit = active === 1;
                    return (
                      <span
                        key={cite.id}
                        className={`rounded-md border px-1.5 py-0.5 font-mono text-[11px] font-bold ${
                          lit
                            ? cite.valid
                              ? "border-[#16a34a] bg-[#16a34a]/15 text-[#15803d] dark:text-[#86efac]"
                              : "border-[#dc2626] bg-[#dc2626]/10 text-[#b91c1c] dark:text-[#fca5a5]"
                            : "border-border text-foreground"
                        }`}
                      >
                        {cite.id} {cite.valid ? "✓" : "✕"}
                      </span>
                    );
                  })}
                </div>
                <span className="text-right text-[11px] text-muted-foreground">
                  {active === 2 ? (supported ? "지지됨" : "근거 없음") : active === 1 ? `인용 ${claim.cites.length}` : ""}
                </span>
              </div>
            );
          })}
        </div>
      )}
    />
  );
}
