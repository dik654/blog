import SceneShell from "./SceneShell";

/**
 * 본문 대응: #verification — 다른 validator의 proposal에는 digest만 있다.
 * verify는 GetBlock(digest)로 원문을 되찾고, 없으면 false, Random이면 true,
 * Bridge 블록이면 안에 든 다른 network의 finalization certificate를 그 network의 scheme으로 검증한 결과를 반환한다.
 */
const SCENES = [
  { label: "digest만 도착", summary: "GetBlock(digest) → indexer", branch: -1, note: "다른 validator가 받은 proposal에는 블록 원문이 없고 digest만 있습니다. Application의 verify 경로는 먼저 이 digest로 indexer에 원문을 요청합니다." },
  { label: "원문 없음", summary: "verify = false", branch: 0, note: "Indexer가 digest에 해당하는 블록을 돌려주지 못하면 verify는 false를 반환합니다." },
  { label: "Random 블록", summary: "verify = true", branch: 1, note: "되찾은 원문이 Random 블록이면 verify는 true를 반환합니다." },
  { label: "Bridge 블록", summary: "certificate 검증 결과를 반환", branch: 2, note: "Bridge 블록 안에는 다른 network의 finalization certificate가 들어 있습니다. 블록이 있다는 사실만으로 true가 되지 않고, 그 network의 scheme으로 certificate를 검증한 결과가 verify의 답입니다. 조회와 유효성 판정이 한 단계가 아닌 이유입니다." },
] as const;

const BRANCHES = [
  { when: "원문 없음", step: null, result: "false" },
  { when: "Random 블록", step: null, result: "true" },
  { when: "Bridge 블록", step: "다른 network scheme으로 certificate 검증", result: "검증 결과" },
] as const;

export default function VerifyBranchViz() {
  return (
    <SceneShell
      eyebrow="Verify 분기"
      title="블록을 찾았다는 것과 블록이 유효하다는 것은 다른 단계입니다"
      description="한 validator가 다른 validator의 proposal을 검증하는 경로입니다. 위에서 아래로 읽고, 장면마다 한 갈래만 따라갑니다."
      ariaLabel="digest로 블록 원문을 조회한 뒤 원문 없음, Random, Bridge 세 갈래로 나뉘는 verify 경로"
      scenes={SCENES}
      render={(active) => {
        const branch = SCENES[active].branch;
        return (
          <div className="min-w-0">
            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1.5 sm:gap-3">
              <div className="min-w-0 rounded-lg border border-primary bg-background px-2 py-2 text-center">
                <span className="block text-[10px] font-bold text-muted-foreground">받은 proposal</span>
                <strong className="block break-keep font-mono text-xs sm:text-sm">digest만</strong>
              </div>
              <span className="text-primary" aria-hidden="true">→</span>
              <div className="min-w-0 rounded-lg border border-primary bg-background px-2 py-2 text-center">
                <span className="block text-[10px] font-bold text-muted-foreground">Indexer에 요청</span>
                <strong className="block break-keep font-mono text-[11px] sm:text-sm">GetBlock(<wbr />digest)</strong>
              </div>
            </div>
            <svg viewBox="0 0 300 26" preserveAspectRatio="none" className="block h-6 w-full" aria-hidden="true">
              {[50, 150, 250].map((x, i) => (
                <line key={x} x1={225} y1={0} x2={x} y2={26} stroke={branch === i ? "#2563eb" : "#94a3b8"} strokeWidth={branch === i ? 1.25 : 1} vectorEffect="non-scaling-stroke" opacity={branch === -1 || branch === i ? 1 : 0.35} />
              ))}
            </svg>
            <div className="grid min-w-0 grid-cols-3 gap-1.5 sm:gap-3">
              {BRANCHES.map((b, i) => {
                const on = branch === i;
                const dim = branch !== -1 && !on;
                return (
                  <div key={b.when} className={`flex min-w-0 flex-col gap-1.5 transition-opacity duration-300 motion-reduce:transition-none ${dim ? "opacity-35" : ""}`}>
                    <div className={`rounded-lg border px-1.5 py-2 text-center ${on ? "border-primary" : "border-border"} bg-background`}>
                      <span className="block text-[10px] font-bold text-muted-foreground">조회 결과</span>
                      <strong className="block break-keep text-xs sm:text-sm">{b.when}</strong>
                    </div>
                    <div className={`min-h-[4.5rem] rounded-lg border px-1.5 py-2 text-center ${b.step ? (on ? "border-amber-600" : "border-border") : "border-dashed border-border/50"} bg-background`}>
                      {b.step ? (
                        <span className="block break-keep text-[11px] leading-4 sm:text-xs sm:leading-5">{b.step}</span>
                      ) : (
                        <span className="block text-[11px] text-muted-foreground">바로 반환</span>
                      )}
                    </div>
                    <div className={`rounded-lg border px-1.5 py-2 text-center ${on ? "border-primary bg-primary/5" : "border-border bg-background"}`}>
                      <span className="block text-[10px] font-bold text-muted-foreground">verify</span>
                      <strong className={`block break-keep font-mono text-xs sm:text-sm ${b.result === "false" ? "text-red-700 dark:text-red-400" : ""}`}>{b.result}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
