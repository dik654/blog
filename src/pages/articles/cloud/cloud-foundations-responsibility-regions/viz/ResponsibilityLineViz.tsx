import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need (+ #source·#comparison) — 서비스 층이 올라가면 책임선이 위로 이동한다.
 * 층 목록은 7절 책임표 절차의 [데이터, 계정, 앱, 운영체제, 가상화, 물리]를 따른다.
 * 가상 서버: 고객이 운영체제·애플리케이션. 실행 플랫폼: 공급자가 운영체제·런타임의 많은 부분.
 * 완성 소프트웨어: 애플리케이션 운영도 넘기지만 데이터·계정·공유 설정은 고객에게 남는다.
 */
const LAYERS = ["데이터", "계정·접근 정책", "애플리케이션·코드", "운영체제·런타임", "가상화", "물리 시설"] as const;

type Owner = "customer" | "provider" | "mostly";

const SCENES = [
  {
    label: "가상 서버 (IaaS)",
    summary: "고객: 위 4층",
    note: "가상 서버를 쓰면 고객이 운영체제 패치와 애플리케이션을 맡습니다. 공급자는 데이터센터·물리 망·하드웨어와 그 위의 기반 소프트웨어를 맡습니다.",
    owners: ["customer", "customer", "customer", "customer", "provider", "provider"],
  },
  {
    label: "실행 플랫폼 (PaaS)",
    summary: "책임선이 한 층 올라감",
    note: "실행 플랫폼에서는 공급자가 운영체제와 런타임의 많은 부분을 관리합니다. 고객은 코드, 데이터, 계정과 접근 정책을 여전히 맡습니다.",
    owners: ["customer", "customer", "customer", "mostly", "provider", "provider"],
  },
  {
    label: "완성 소프트웨어 (SaaS)",
    summary: "책임선이 한 층 더 올라감",
    note: "완성된 소프트웨어는 애플리케이션 운영까지 넘깁니다. 그래도 데이터의 공유 설정과 사용자 계정은 고객이 관리합니다.",
    owners: ["customer", "customer", "provider", "provider", "provider", "provider"],
  },
  {
    label: "끝까지 남는 두 층",
    summary: "데이터 · 계정은 항상 고객",
    note: "퇴사자 계정을 남겨 두거나 민감한 자료를 잘못 공유하면 어느 서비스 층에서도 사고가 납니다. 관리형은 책임이 사라졌다는 뜻이 아니라 책임선이 이동했다는 뜻입니다.",
    owners: ["customer", "customer", "provider", "provider", "provider", "provider"],
  },
] as const satisfies readonly { label: string; summary: string; note: string; owners: readonly Owner[] }[];

const OWNER_LABEL: Record<Owner, string> = {
  customer: "고객",
  provider: "공급자",
  mostly: "공급자가 많은 부분",
};

export default function ResponsibilityLineViz() {
  return (
    <SceneShell
      eyebrow="책임선"
      title="서비스 층이 올라가면 책임선도 올라갑니다"
      description="한 줄이 관리할 층 하나입니다. 파란 줄은 고객이, 회색 줄은 공급자가 맡습니다. 점선 줄은 공급자가 ‘많은 부분’을 맡는 층이라 전부를 넘겼다고 읽지 않습니다. 굵은 선이 둘 사이의 책임선입니다. 계약이나 법적 책임까지 이 그림으로 판단하지는 않습니다."
      ariaLabel="가상 서버, 실행 플랫폼, 완성 소프트웨어에서 고객과 공급자의 책임선 위치"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const owners: readonly Owner[] = scene.owners;
        const lineIndex = owners.findIndex((owner) => owner !== "customer");
        const focusLast = active === 3;
        return (
          <ol className="mx-auto max-w-xl space-y-0">
            {LAYERS.map((layer, index) => {
              const owner = owners[index];
              const isCustomer = owner === "customer";
              const dimmed = focusLast && !isCustomer;
              return (
                <li key={layer} className={dimmed ? "opacity-40" : undefined}>
                  {index === lineIndex && (
                    <div className="my-1 flex items-center gap-2" aria-hidden>
                      <div className="h-0 flex-1 border-t-2 border-foreground" />
                      <span className="shrink-0 text-[11px] font-bold">책임선</span>
                    </div>
                  )}
                  <div
                    className={`mb-1 flex min-w-0 items-center justify-between gap-3 rounded-md border px-3 py-1.5 text-sm ${
                      isCustomer ? "border-blue-600/60 bg-blue-600/10" : owner === "mostly" ? "border-dashed border-blue-600/60 bg-muted/30" : "border-border bg-muted/30"
                    } ${focusLast && isCustomer ? "border-blue-600" : ""}`}
                  >
                    <span className={isCustomer ? "font-semibold" : "text-muted-foreground"}>{layer}</span>
                    <span className={`shrink-0 text-xs font-bold ${isCustomer ? "text-blue-700 dark:text-blue-300" : "text-muted-foreground"}`}>
                      {OWNER_LABEL[owner]}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        );
      }}
    />
  );
}
