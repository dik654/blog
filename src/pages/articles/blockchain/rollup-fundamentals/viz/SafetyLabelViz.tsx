import SceneShell from "./SceneShell";

/**
 * 본문 대응: #derivation 셋째·넷째 문단 — OP Stack의 unsafe → safe → finalized 표시와 출금 정산의 구분.
 * 같은 R95 결과가 L1 데이터의 상태에 따라 표시만 바뀐다. 정산 조건은 별도 줄로 둔다.
 */
const LABELS = ["unsafe", "safe", "finalized"] as const;

const SCENES = [
  {
    label: "unsafe",
    summary: "sequencer가 직접 알린 R95",
    level: 0,
    l1: "T1·T2 묶음이 아직 L1 입력으로 확인되지 않음",
    settle: false,
    note: "Sequencer에게 직접 받은 결과는 아직 L1 입력으로 확인되지 않았을 수 있습니다. 이 상태가 unsafe이며, L1 데이터에서 같은 결과를 복원했다는 근거가 아직 없다는 표시입니다.",
  },
  {
    label: "safe",
    summary: "현재 L1 데이터에서 복원",
    level: 1,
    l1: "Batcher가 게시한 묶음이 현재 L1 체인에 있음",
    settle: false,
    note: "검증 노드가 현재 L1 체인의 데이터에서 같은 R95를 복원하면 safe로 표시합니다. 근거가 L1 데이터로 옮겨 왔지만 그 L1 데이터 자체는 아직 확정 전일 수 있습니다.",
  },
  {
    label: "finalized",
    summary: "복원에 필요한 L1 데이터가 확정",
    level: 2,
    l1: "R95를 다시 만드는 데 필요한 L1 데이터가 확정",
    settle: false,
    note: "R95를 다시 만드는 데 필요한 L1 데이터가 확정되면 finalized로 표시할 수 있습니다. 관련 L1 블록 하나가 확정됐다는 뜻으로 줄이지 않습니다.",
  },
  {
    label: "출금 정산은 별도",
    summary: "finalized ≠ 출금 완료",
    level: 2,
    l1: "R95를 다시 만드는 데 필요한 L1 데이터가 확정",
    settle: true,
    note: "L2 데이터가 finalized여도 결과 주장에 대한 이의 제기와 출금 조건이 남을 수 있습니다. 실제 대기 시간과 조건은 해당 체인의 계약과 배포 버전에서 확인합니다.",
  },
] as const;

export default function SafetyLabelViz() {
  return (
    <SceneShell
      eyebrow="OP Stack 결과 표시"
      title="같은 R95가 L1 데이터에 따라 unsafe·safe·finalized로 바뀝니다"
      description="R95는 A=95, B=5를 포함한 상태 루트에 붙인 설명용 이름입니다. 위 줄은 L1에 있는 근거, 가운데는 L2 결과의 표시, 아래는 출금 정산입니다."
      ariaLabel="R95 결과의 unsafe, safe, finalized 표시와 별도의 출금 정산"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="space-y-3 text-xs sm:text-sm">
            <div className="rounded-lg border border-border p-3">
              <p className="text-[11px] font-bold text-muted-foreground">L1에 있는 근거</p>
              <p className="mt-1 break-keep font-semibold">{scene.l1}</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-[11px] font-bold text-muted-foreground">L2 결과 R95의 표시</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {LABELS.map((label, index) => (
                  <div
                    key={label}
                    className={`rounded-md border px-1 py-2 text-center font-mono ${
                      index === scene.level
                        ? "border-primary font-bold text-primary"
                        : index < scene.level
                          ? "border-border text-muted-foreground"
                          : "border-dashed border-border/60 text-muted-foreground/60"
                    }`}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
            <div className={`rounded-lg border p-3 ${scene.settle ? "border-amber-600" : "border-dashed border-border/60"}`}>
              <p className="text-[11px] font-bold text-muted-foreground">출금 정산</p>
              <p className={`mt-1 break-keep ${scene.settle ? "font-semibold text-amber-700 dark:text-amber-400" : "text-muted-foreground/70"}`}>
                {scene.settle ? "이의 제기·출금 조건이 남을 수 있음" : "이 표시와 따로 판정"}
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
