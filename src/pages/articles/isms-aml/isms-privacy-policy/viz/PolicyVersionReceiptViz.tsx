import SceneShell from "./SceneShell";

/**
 * 본문 대응: #notice-consent-boundary 셋째 문단 — 방침 변경은 diff·effective date·영향받는 flow를 공개하고
 * 필요한 경우 새 동의·통지를 한다. 단순 typo와 새로운 광고 목적은 같은 변경이 아니며,
 * 과거 receipt를 새 purpose에 소급하지 않는다. 버전 번호와 목적 구성은 설명용 가정이다.
 */
type Purpose = "analytics" | "ads";

const SCENES = [
  {
    label: "v1 · 동의 받음",
    summary: "receipt: analytics · v1",
    version: 0,
    ads: "none",
    note: "이용자가 v1 화면에서 analytics 목적에 동의합니다. Consent receipt에는 그 선택과 함께 purpose version v1, 시각, UI version이 남습니다.",
  },
  {
    label: "v2 · 오탈자 수정",
    summary: "data flow 변화 없음",
    version: 1,
    ads: "none",
    note: "문장의 오탈자만 고친 v2는 영향받는 data flow가 없습니다. diff와 effective date는 공개하지만, 새로운 광고 목적과 같은 무게의 변경으로 다루지 않습니다.",
  },
  {
    label: "v3 · 광고 목적 추가",
    summary: "v1 receipt로 소급 ✕",
    version: 2,
    ads: "blocked",
    note: "맞춤형 광고라는 새 목적이 생겼습니다. v1 receipt는 이 목적을 본 적이 없으므로 새 목적에 소급하지 않습니다. 이 목적에 동의가 필요하다고 판단된 경우(가정) backend는 새 선택이 생기기 전까지 광고 처리를 허용하지 않습니다.",
  },
  {
    label: "v3 · 새 선택",
    summary: "receipt: ads · v3",
    version: 2,
    ads: "granted",
    note: "새 통지와 선택을 거쳐 v3 receipt가 생긴 뒤에만 광고 목적의 선택이 기록됩니다. 이용자가 나중에 철회하면 backend가 그 version의 선택을 따라 멈추는지 검사합니다.",
  },
] as const satisfies readonly {
  label: string;
  summary: string;
  version: number;
  ads: "none" | "blocked" | "granted";
  note: string;
}[];

const VERSIONS = [
  { tag: "v1", title: "처리방침 v1", purposes: ["analytics"] },
  { tag: "v2", title: "v2 · 오탈자 수정", purposes: ["analytics"] },
  { tag: "v3", title: "v3 · 광고 목적 추가", purposes: ["analytics", "ads"] },
] as const satisfies readonly { tag: string; title: string; purposes: readonly Purpose[] }[];

const PURPOSE_LABEL: Record<Purpose, string> = { analytics: "analytics", ads: "맞춤형 광고" };

export default function PolicyVersionReceiptViz() {
  return (
    <SceneShell
      eyebrow="방침 version과 동의 receipt"
      title="예전 동의는 그때 본 목적까지만 덮습니다"
      description="위 줄은 처리방침 version, 아래 줄은 한 이용자의 동의 기록(receipt)입니다. version 번호와 목적 구성은 설명을 위한 가정입니다."
      ariaLabel="처리방침 v1, v2 오탈자 수정, v3 광고 목적 추가와 이용자의 v1 receipt가 새 광고 목적을 덮지 않는 흐름"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid min-w-0 grid-cols-3 gap-2">
              {VERSIONS.map((version, index) => {
                const current = index === scene.version;
                const reached = index <= scene.version;
                return (
                  <div
                    key={version.tag}
                    className={`min-w-0 rounded-lg border p-2 transition-opacity duration-300 motion-reduce:transition-none sm:p-3 ${
                      current ? "border-primary bg-primary/5" : "border-border bg-background"
                    } ${reached ? "opacity-100" : "opacity-35"}`}
                  >
                    <p className={`text-[11px] font-bold ${current ? "text-primary" : "text-muted-foreground"}`}>
                      {version.tag}
                      {current ? " · 현재" : ""}
                    </p>
                    <p className="mt-1 break-keep text-xs font-semibold leading-4 sm:text-sm sm:leading-5">{version.title}</p>
                    <ul className="mt-1.5 space-y-0.5">
                      {version.purposes.map((purpose) => (
                        <li key={purpose} className="break-keep text-[11px] leading-4 text-muted-foreground sm:text-xs">
                          · {PURPOSE_LABEL[purpose]}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            <p className="text-center text-xs font-semibold text-muted-foreground">↓ 이 이용자의 receipt ↓</p>
            <div className="grid min-w-0 grid-cols-2 gap-2">
              <div className="min-w-0 rounded-lg border border-border bg-background p-2.5 sm:p-3">
                <p className="text-[11px] font-bold text-muted-foreground">analytics</p>
                <p className="mt-1 break-keep text-sm font-semibold">○ v1에서 동의</p>
                <p className="mt-1 break-keep text-xs leading-5 text-muted-foreground">v1에서 받은 선택을 그대로 적용</p>
              </div>
              <div
                className={`min-w-0 rounded-lg border p-2.5 sm:p-3 ${
                  scene.ads === "blocked"
                    ? "border-red-600 bg-red-50 dark:bg-red-950/40"
                    : scene.ads === "granted"
                      ? "border-primary bg-primary/5"
                      : "border-dashed border-border/60 bg-background"
                }`}
              >
                <p className="text-[11px] font-bold text-muted-foreground">맞춤형 광고</p>
                <p
                  className={`mt-1 break-keep text-sm font-semibold ${
                    scene.ads === "blocked" ? "text-red-700 dark:text-red-300" : scene.ads === "none" ? "text-muted-foreground" : ""
                  }`}
                >
                  {scene.ads === "none" ? "– 아직 없는 목적" : scene.ads === "blocked" ? "✕ v1 동의로 소급 안 함" : "○ v3에서 새로 동의(가정)"}
                </p>
                <p className="mt-1 break-keep text-xs leading-5 text-muted-foreground">
                  {scene.ads === "none" ? "방침에 이 목적이 없음" : scene.ads === "blocked" ? "새 선택 전까지 광고 처리 허용 안 함(가정)" : "v3 receipt가 따로 남음"}
                </p>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
