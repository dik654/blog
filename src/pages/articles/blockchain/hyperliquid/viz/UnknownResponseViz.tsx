import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture, #need — 응답을 못 받았을 때 바로 재주문하면 원래 주문과 새 주문이 모두 체결될 수 있다.
 * 0.1+0.1=0.2개, 같은 50,000달러 가정이면 0.2×50,000=10,000달러(의도 5,000달러의 두 배).
 */
const SCENES = [
  { label: "응답이 오지 않음", summary: "원래 0.1개의 상태를 모름", path: 0, note: "연결이 끊겨도 원래 주문은 처리됐을 수 있습니다. 화면에 응답이 없다는 사실만으로는 체결·대기·거절 중 어느 쪽인지 구별하지 못합니다." },
  { label: "새 식별자로 다시 주문", summary: "0.1 + 0.1 = 0.2개 가능", path: 1, note: "원래 주문과 새 주문이 모두 체결될 수 있습니다. 같은 가격이라면 의도한 5,000달러가 아니라 10,000달러(가정)입니다. 중복 서명을 막는 장치만으로는 이런 중복 의도까지 알아내지 못합니다." },
  { label: "기존 번호로 먼저 조회", summary: "체결량·잔량을 맞춘 뒤 판단", path: 2, note: "주문 번호나 직접 붙인 식별자로 원래 주문을 찾습니다. 취소 요청을 보내는 동안에도 0.06개 일부가 먼저 체결될 수 있으므로 최종 체결량과 남은 양을 다시 맞춥니다." },
] as const;

function Lane({ title, steps, on, dim }: { title: string; steps: readonly string[]; on: boolean; dim: boolean }) {
  return (
    <div className={`rounded-lg border p-2 sm:p-3 ${on ? "border-primary bg-primary/5" : "border-border"} ${dim ? "opacity-45" : ""}`}>
      <p className="text-sm font-bold">{title}</p>
      <ol className="mt-2 space-y-1 text-xs leading-5 text-muted-foreground">
        {steps.map((step) => <li key={step}>↓ {step}</li>)}
      </ol>
    </div>
  );
}

export default function UnknownResponseViz() {
  return (
    <SceneShell
      eyebrow="응답을 못 받은 뒤의 갈림길"
      title="새 식별자로 다시 보내면 0.1개가 0.2개가 될 수 있습니다"
      description="칸 하나가 0.1개 주문입니다. 가격과 수량은 앞 절의 가정을 그대로 씁니다."
      ariaLabel="응답을 받지 못했을 때 재주문과 조회의 두 경로 비교"
      scenes={SCENES}
      render={(active) => {
        const { path } = SCENES[active];
        const blocks = path === 1 ? 2 : 1;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-background p-3">
              <span className="text-sm font-semibold">0.1개 주문 전송 → 응답 없음</span>
              <span className="text-xs text-muted-foreground">상태 미확인</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:gap-3">
              <Lane title="새 식별자로 다시 주문" steps={["원래 주문이 살아 있을 수 있음", "새 주문도 접수", "둘 다 체결될 수 있음"]} on={path === 1} dim={path === 2} />
              <Lane title="기존 번호·식별자로 먼저 조회" steps={["원래 주문을 찾음", "체결량과 잔량 확인", "남은 양만 다시 판단"]} on={path === 2} dim={path === 1} />
            </div>
            <div className="mt-3 grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-2 text-xs">
              <span className="font-semibold">최대 체결</span>
              <div className="grid grid-cols-2 gap-1" role="img" aria-label={path === 0 ? "아직 판단 전" : `최대 ${blocks * 0.1}개`}>
                {[0, 1].map((slot) => (
                  <div
                    key={slot}
                    className="flex h-8 items-center justify-center rounded-sm border text-xs font-semibold"
                    style={{
                      borderColor: path !== 0 && slot < blocks ? (slot === 1 ? "#dc2626" : "#2563eb") : "#94a3b8",
                      borderStyle: path !== 0 && slot < blocks ? "solid" : "dashed",
                      color: path !== 0 && slot < blocks ? (slot === 1 ? "#dc2626" : "#2563eb") : "#94a3b8",
                    }}
                  >
                    {path === 0 ? "?" : slot < blocks ? (slot === 1 ? "새 주문 0.1" : "원래 0.1") : "없음"}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
