import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #finality — FedNow OC8(2026-04-01 시행) §7.1·§9.6, 운영절차 v3.6 §15.2.
 * 최종성 기준은 기록과 입금 통지 중 이른 때. 반환 요청과 반환 지급은 원이체와 별개의 기록이다.
 */
const SCENES: readonly ShellScene[] = [
  { label: "기록이 먼저인 경우", summary: "최종성 기준 = 기록 시점", note: "차변·대변은 보내는 쪽에서 빼고 받는 쪽에 더하는 기록입니다. 입금 통지보다 이르면 이 시점이 이 서비스의 최종성 기준입니다." },
  { label: "통지가 먼저인 경우", summary: "최종성 기준 = 통지 시점", note: "수취 기관에 보낸 입금 통지가 더 이르면 그때가 기준입니다. 어느 쪽이든 다른 시스템의 조회 화면에 잔액이 보였는지는 별개입니다." },
  { label: "반환을 요청하면", summary: "camt.056 ≠ 반환 완료", note: "A가 잘못 보낸 10의 반환을 요청해도 그 요청 자체로 10이 돌아오지는 않습니다. camt.056은 반환 요청 메시지입니다." },
  { label: "반환 지급을 시작하면", summary: "pacs.004 · 새 자금이체", note: "pacs.004는 실제 반환 지급 메시지입니다. 반환은 새 자금이체로 시작하므로 원이체의 완료 기록과 새 반환 기록을 나누어 추적합니다." },
];

function EventBox({ title, detail, state }: { title: string; detail: string; state: "flag" | "on" | "off" }) {
  const box = state === "flag" ? "border-primary bg-primary/5" : state === "on" ? "border-border bg-background" : "border-dashed border-border/60";
  return (
    <div className={`min-w-0 rounded-lg border px-2 py-2 ${box}`}>
      <p className={`text-sm font-semibold ${state === "off" ? "text-muted-foreground/60" : ""}`}>{title}</p>
      <p className={`text-xs leading-5 ${state === "off" ? "text-muted-foreground/50" : "text-muted-foreground"}`}>{detail}</p>
    </div>
  );
}

export default function FinalityReturnViz() {
  return (
    <SceneShell
      eyebrow="FedNow의 기준"
      title="FedNow에서 최종성은 이른 쪽에 정해지고 반환은 새 이체로 이어집니다"
      description="미국 FedNow의 2026년 4월 1일 시행 규정을 A의 10에 적용합니다. 앞 두 장면의 원이체 줄은 왼쪽이 먼저 일어난 일이며 칸 너비는 시간을 재지 않습니다."
      ariaLabel="원이체의 최종성 기준과 별도의 반환 요청, 반환 지급"
      scenes={SCENES}
      render={(active) => {
        const recordFirst = active !== 1;
        const record = { title: "차변·대변 기록", detail: active === 0 ? "먼저 일어남 → 최종성 기준" : active === 1 ? "나중에 일어남" : "원이체 쪽 기록" };
        const notice = { title: "입금 통지", detail: active === 1 ? "먼저 일어남 → 최종성 기준" : active === 0 ? "나중에 일어남" : "원이체 쪽 기록" };
        const pair = recordFirst ? [record, notice] : [notice, record];
        return (
          <div className="min-w-0 space-y-4">
            <div>
              <p className="mb-1 text-xs font-semibold text-muted-foreground">원이체: A → 수취 기관 10</p>
              <div className="grid grid-cols-2 gap-2">
                {pair.map((item, index) => (
                  <EventBox key={item.title} title={item.title} detail={item.detail} state={active < 2 && index === 0 ? "flag" : active < 2 ? "on" : "off"} />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold text-muted-foreground">반환: 수취 쪽 → A 10</p>
              <div className="grid grid-cols-2 gap-2">
                <EventBox title="반환 요청" detail="camt.056 · 이것만으로 돌아오지 않음" state={active === 2 ? "flag" : active === 3 ? "on" : "off"} />
                <EventBox title="반환 지급" detail="pacs.004 · 별도 처리 과정" state={active === 3 ? "flag" : "off"} />
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
