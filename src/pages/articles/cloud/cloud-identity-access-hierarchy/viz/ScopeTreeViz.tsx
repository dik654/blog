import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 조직 > 계정·구독 > 프로젝트 묶음 > 자원. 위에 붙인 정책은 아래로 넓게 닿을 수 있다.
 * 계정 2개 × 묶음 2개 × 자원 2개 = 자원 8개는 설명용 가정이다.
 * 조직에 붙이면 8개, 운영 계정에 붙이면 4개, 자원 하나에 붙이면 1개에 닿는다.
 */
const ACCOUNTS = ["개발", "운영"] as const;
const GROUPS = [1, 2] as const;
const ITEMS = [1, 2] as const;

type Attach = "none" | "org" | "account" | "resource" | "shared";

const SCENES = [
  {
    label: "상자 구조",
    summary: "조직 › 계정 › 묶음 › 자원",
    note: "큰 조직 상자 아래에 팀이나 환경별 계정·구독을 두고, 그 아래 프로젝트 묶음과 개별 자원이 있습니다. 개발과 운영을 별도 계정으로 나누면 비용과 권한 경계가 선명해집니다.",
    attach: "none",
  },
  {
    label: "조직에 붙인 정책",
    summary: "자원 8개 전부에 닿음",
    note: "맨 위에 붙인 정책은 아래 모든 상자로 넓게 영향을 줄 수 있습니다. 한 번에 적용돼 편하지만 정책이 틀렸을 때 실수의 범위도 가장 큽니다.",
    attach: "org",
  },
  {
    label: "운영 계정에 붙인 정책",
    summary: "자원 4개에 닿음",
    note: "운영 계정에 붙이면 그 아래 묶음과 자원에만 닿고 개발 계정에는 닿지 않습니다. 이 예에서는 계정 경계가 영향 범위를 8개에서 4개로 줄입니다.",
    attach: "account",
  },
  {
    label: "자원 하나에 붙인 정책",
    summary: "자원 1개에 닿음",
    note: "가장 아래에 붙이면 영향은 자원 하나에 머뭅니다. 대신 같은 허용이 여러 자원에 필요하면 붙일 곳도 그만큼 늘어납니다.",
    attach: "resource",
  },
  {
    label: "이름표만 나눈 경우",
    summary: "다시 8개 전부",
    note: "개발과 운영을 이름표로만 나누고 같은 광범위 관리자 권한을 공유하면, 그 권한이 두 계정 모두에 닿아 경계의 효과가 사라집니다.",
    attach: "shared",
  },
] as const satisfies readonly { label: string; summary: string; note: string; attach: Attach }[];

function reaches(attach: Attach, account: number, group: number, item: number) {
  if (attach === "org" || attach === "shared") return true;
  if (attach === "account") return account === 1;
  if (attach === "resource") return account === 1 && group === 0 && item === 0;
  return false;
}

const PIN = "rounded bg-amber-500/15 px-1.5 py-0.5 text-[11px] font-bold text-amber-800 dark:text-amber-300";

export default function ScopeTreeViz() {
  return (
    <SceneShell
      eyebrow="정책 범위"
      title="정책을 어느 상자에 붙이느냐가 닿는 자원 수를 정합니다"
      description="바깥 상자가 안쪽 상자를 품습니다. 노란 표시는 정책을 붙인 곳, 파란 칸은 그 정책이 닿는 자원입니다. 계정 2개, 묶음 2개씩, 자원 2개씩은 설명용 가정입니다."
      ariaLabel="조직, 계정, 프로젝트 묶음, 자원 계층에서 정책을 붙인 위치별로 닿는 자원 수"
      scenes={SCENES}
      render={(active) => {
        const attach: Attach = SCENES[active].attach;
        const count = ACCOUNTS.reduce<number>(
          (sum, _account, a) =>
            sum + GROUPS.reduce<number>((gs, _g, g) => gs + ITEMS.filter((_i, i) => reaches(attach, a, g, i)).length, 0),
          0,
        );
        return (
          <div className="min-w-0">
            <div className={`rounded-xl border p-2.5 sm:p-3 ${attach === "org" ? "border-amber-600" : "border-border"}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-bold">조직</span>
                <span className="min-h-[1.375rem]">{attach === "org" && <span className={PIN}>정책 붙인 곳</span>}</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {ACCOUNTS.map((account, a) => {
                  const pinned = attach === "account" && a === 1;
                  return (
                    <div key={account} className={`min-w-0 rounded-lg border p-2 ${pinned || attach === "shared" ? "border-amber-600" : "border-border"}`}>
                      <div className="flex min-h-[2.75rem] flex-col gap-1">
                        <span className="text-xs font-bold">{account} 계정·구독</span>
                        <span>
                          {pinned && <span className={PIN}>정책 붙인 곳</span>}
                          {attach === "shared" && <span className={PIN}>같은 관리자 권한</span>}
                        </span>
                      </div>
                      <div className="mt-1.5 space-y-1.5">
                        {GROUPS.map((group, g) => (
                          <div key={group} className="rounded-md border border-dashed border-border px-1.5 py-1.5">
                            <span className="block text-[11px] text-muted-foreground">묶음 {group}</span>
                            <div className="mt-1 grid grid-cols-2 gap-1">
                              {ITEMS.map((item, i) => {
                                const on = reaches(attach, a, g, i);
                                const pinHere = attach === "resource" && on;
                                return (
                                  <span
                                    key={item}
                                    className={`rounded border px-1 py-1 text-center text-[11px] leading-4 ${
                                      pinHere ? "border-amber-600 bg-blue-600/15 font-bold text-blue-700 dark:text-blue-300" : on ? "border-blue-600 bg-blue-600/15 font-bold text-blue-700 dark:text-blue-300" : "border-border text-muted-foreground"
                                    }`}
                                  >
                                    {pinHere ? "붙인 곳" : `자원${on ? " ✓" : ""}`}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="mt-3 text-center font-mono text-sm">
              정책이 닿는 자원 <span className="font-bold text-blue-700 dark:text-blue-300">{count}</span> / 8
            </p>
          </div>
        );
      }}
    />
  );
}
