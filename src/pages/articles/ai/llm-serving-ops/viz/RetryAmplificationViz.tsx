import SceneShell from "./SceneShell";

/**
 * 본문 대응: #litellm-gateway "Retry 횟수보다 먼저 전체 deadline을 한곳에서 소유한다".
 * Client·gateway·provider SDK가 각각 세 번씩 재시도하면 backend 부하가 곱으로 커진다.
 * "세 번 재시도"를 첫 시도 1번 + 재시도 3번 = 계층당 최대 4번 시도로 읽는다(가정).
 * 모든 시도가 실패하는 장애 중 최악의 경우: 4, 4×4=16, 4×4×4=64. 한 계층만 재시도하면 4.
 */
const PER_LAYER = 4;

const SCENES = [
  {
    label: "SDK만 재시도",
    summary: "1 × 1 × 4 = 4번",
    client: 1,
    gateway: 1,
    note: "provider SDK 한 계층만 재시도하면 사용자 요청 하나가 backend를 최대 4번 부릅니다. 첫 시도 1번에 재시도 3번을 더한 수입니다.",
  },
  {
    label: "gateway도 재시도",
    summary: "1 × 4 × 4 = 16번",
    client: 1,
    gateway: 4,
    note: "gateway가 SDK 호출을 4번까지 다시 보내고, 그 하나하나 안에서 SDK가 또 4번까지 시도합니다. 더하는 것이 아니라 곱해집니다.",
  },
  {
    label: "client까지 재시도",
    summary: "4 × 4 × 4 = 64번",
    client: 4,
    gateway: 4,
    note: "세 계층이 모두 재시도하면 장애 중 사용자 요청 하나가 backend 호출 최대 64번이 됩니다. 이미 아픈 backend에 부하가 몰리는 이유입니다.",
  },
  {
    label: "한 계층만 소유",
    summary: "최대 4번 · 남은 시간 안에서만",
    client: 1,
    gateway: 1,
    note: "전체 deadline은 최상위 계층이 소유해 아래로 남은 시간과 허용 시도 수를 넘기고, 재시도는 gateway와 SDK 중 한 계층(여기서는 SDK)만 맡습니다. 다음 시도가 남은 deadline 안에 들어오지 않으면 4번을 채우기 전에도 멈춥니다.",
  },
] as const;

const ATTEMPT = "#2563eb";
const IDLE = "#cbd5e1";

export default function RetryAmplificationViz() {
  return (
    <SceneShell
      eyebrow="Retry amplification"
      title="계층마다 재시도하면 backend 호출은 곱으로 늘어납니다"
      description="점 하나가 backend 호출 한 번입니다. 큰 칸은 client의 시도, 그 안의 세로줄은 gateway의 시도, 줄 안의 점은 provider SDK의 시도입니다. '세 번 재시도'를 첫 시도 1번 + 재시도 3번으로 세고, 장애 중이라 모든 시도가 실패하는 최악의 경우를 그렸습니다(가정)."
      ariaLabel="client, gateway, SDK가 각각 재시도할 때 backend 호출 수가 4, 16, 64로 곱해지는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const owner = active === SCENES.length - 1;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: PER_LAYER }, (_, c) => {
                const clientOn = c < scene.client;
                return (
                  <div
                    key={c}
                    className={`min-w-0 rounded-lg border px-2 py-2 ${clientOn ? "border-primary/60" : "border-dashed border-border/50"}`}
                  >
                    <p className={`text-center text-xs font-semibold ${clientOn ? "" : "text-muted-foreground/50"}`}>client 시도 {c + 1}</p>
                    <div className="mt-2 grid grid-cols-4 gap-1">
                      {Array.from({ length: PER_LAYER }, (_, g) => {
                        const gatewayOn = clientOn && g < scene.gateway;
                        return (
                          <div key={g} className="flex flex-col items-center gap-1">
                            <span className={`font-mono text-[10px] ${gatewayOn ? "text-foreground" : "text-muted-foreground/40"}`}>g{g + 1}</span>
                            {Array.from({ length: PER_LAYER }, (_, s) => {
                              const on = gatewayOn;
                              return (
                                <svg key={s} width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                                  <circle
                                    cx="6"
                                    cy="6"
                                    r="4.5"
                                    fill={on ? ATTEMPT : "none"}
                                    stroke={on ? ATTEMPT : IDLE}
                                    strokeWidth="1"
                                    strokeDasharray={on && owner && s > 0 ? "2 1.5" : undefined}
                                    fillOpacity={on && owner && s > 0 ? 0.25 : 1}
                                  />
                                </svg>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                  <circle cx="6" cy="6" r="4.5" fill={ATTEMPT} stroke={ATTEMPT} strokeWidth="1" />
                </svg>
                backend 호출
              </span>
              <span className="inline-flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                  <circle cx="6" cy="6" r="4.5" fill={ATTEMPT} fillOpacity={0.25} stroke={ATTEMPT} strokeWidth="1" strokeDasharray="2 1.5" />
                </svg>
                남은 시간이 있을 때만 하는 재시도
              </span>
              <span className="inline-flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                  <circle cx="6" cy="6" r="4.5" fill="none" stroke={IDLE} strokeWidth="1" />
                </svg>
                일어나지 않는 호출
              </span>
            </div>
          </div>
        );
      }}
    />
  );
}
