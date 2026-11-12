import SceneShell from "./SceneShell";

/**
 * 본문 대응: #audit-remediation "결함이 나오면 증상만 수정하지 않습니다" 두 문단.
 * 퇴직자 한 명의 활성 계정 → HR event 누락 원인 → 전체 퇴직자 모집단·API key·VPN certificate 재대조
 * → 원래 표본과 확장 표본 재검증 → 종결 기록. 퇴직자 수·표본 수는 칸을 그리기 위한 가정.
 */
const PEOPLE = ["퇴직자 1", "퇴직자 2", "퇴직자 3", "퇴직자 4", "퇴직자 5", "퇴직자 6"] as const;
const CREDS = ["계정", "API key", "VPN cert"] as const;
const SAMPLE = [0, 2, 4] as const;
const FOUND = 2;

const SCENES = [
  {
    label: "표본에서 결함",
    summary: "표본 3명 중 1명 계정 활성",
    note: "심사원은 모집단에서 표본을 뽑아 회수 기록과 실제 상태를 대조합니다. 표본 중 퇴직자 한 명의 계정이 아직 살아 있다는 결함이 나왔습니다(인원 수는 가정).",
  },
  {
    label: "증상만 고치면",
    summary: "한 칸만 끔",
    note: "그 계정 하나를 끄는 것은 증상 수정입니다. 같은 원인이 다른 퇴직자나 다른 인증수단에도 남았는지는 아직 아무도 확인하지 않았습니다.",
  },
  {
    label: "원인과 영향 범위",
    summary: "HR event 누락 → 전체 대조",
    note: "원인이 HR event 누락이라면 그 원인을 고치고, 같은 원인이 영향을 줄 수 있는 전체 퇴직자 모집단과 API key, VPN certificate까지 다시 대조합니다. 점선 칸은 결과가 정해지지 않은 조사 대상입니다.",
  },
  {
    label: "재검증과 종결",
    summary: "원래 표본 + 확장 표본",
    note: "수정, 보상통제, 재발방지를 정한 뒤 원래 표본과 확장 표본으로 다시 검증합니다. 종결 기록에는 owner, 완료일, 검증자, 잔여위험을 남깁니다.",
  },
] as const;

function cellState(active: number, person: number, cred: number) {
  const inSample = (SAMPLE as readonly number[]).includes(person) && cred === 0;
  const isFound = person === FOUND && cred === 0;
  if (active === 0) return isFound ? "found" : inSample ? "checked" : "idle";
  if (active === 1) return isFound ? "fixed" : inSample ? "checked" : "idle";
  if (active === 2) return isFound ? "fixed" : "probe";
  return isFound || inSample ? "recheck" : "recheck-ext";
}

const CELL = {
  idle: { cls: "border border-border/60 text-muted-foreground/60", text: "미확인" },
  checked: { cls: "border border-border bg-muted/40", text: "표본 확인" },
  found: { cls: "border-2 border-red-600 bg-red-500/[0.1] font-bold text-red-700 dark:text-red-400", text: "활성" },
  fixed: { cls: "border-2 border-amber-600 bg-amber-500/[0.1] font-semibold", text: "비활성화" },
  probe: { cls: "border border-dashed border-primary text-primary", text: "조사 대상" },
  recheck: { cls: "border-2 border-primary bg-primary/[0.08] font-semibold", text: "원래 표본" },
  "recheck-ext": { cls: "border border-primary/70 bg-primary/[0.04]", text: "확장 표본" },
} as const;

export default function RemediationReachViz() {
  return (
    <SceneShell
      eyebrow="결함 보완"
      title="결함 하나를 고치는 데서 멈추지 않고 같은 원인이 닿은 범위를 다시 대조합니다"
      description="행은 퇴직자, 열은 그 사람에게 발급됐던 접근 수단입니다. 퇴직자 6명과 표본 3명은 칸을 그리기 위한 가정입니다."
      ariaLabel="퇴직자 계정 결함을 표본에서 찾고 영향 범위로 넓혀 재검증하는 네 장면"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className="grid min-w-0 grid-cols-[4.25rem_repeat(3,minmax(0,1fr))] gap-1 text-xs">
            <span />
            {CREDS.map((c) => (
              <span key={c} className="pb-1 text-center font-semibold text-muted-foreground">
                {c}
              </span>
            ))}
            {PEOPLE.map((person, p) => (
              <div key={person} className="contents">
                <span className="flex items-center text-muted-foreground">{person}</span>
                {CREDS.map((c, ci) => {
                  const state = CELL[cellState(active, p, ci)];
                  return (
                    <span key={c} className={`flex min-h-[2rem] items-center justify-center rounded px-1 text-center leading-4 ${state.cls}`}>
                      {state.text}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="mt-3 grid min-h-[2.75rem] min-w-0 gap-1 text-xs leading-5 sm:grid-cols-2">
            <p className={active >= 2 ? "" : "invisible"}>
              <span className="font-semibold">원인:</span> HR event 누락 → 같은 원인이 닿을 수 있는 전체 모집단
            </p>
            <p className={active >= 3 ? "" : "invisible"}>
              <span className="font-semibold">종결 기록:</span> owner · 완료일 · 검증자 · 잔여위험
            </p>
          </div>
        </div>
      )}
    />
  );
}
