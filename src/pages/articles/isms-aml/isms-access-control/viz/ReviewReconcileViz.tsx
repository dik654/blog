import SceneShell from "./SceneShell";

/**
 * 본문 대응: #db-access-control "권한 review는 모집단 대조로 수행합니다".
 * IAM export·DB catalog·HR roster·privileged access tool 을 같은 cutoff 로 맞춰 대조한다.
 * 계정 여섯 개와 그 값은 모두 설명용 가정이다.
 */
type Row = {
  account: string;
  hr: string;
  grant: string;
  use: string;
  pam: string;
  finding: string;
  group: number;
  bad: "hr" | "grant" | "use" | "pam" | "none";
};

const ROWS: readonly Row[] = [
  { account: "kim", hr: "재직·CS", grant: "CS-readonly 역할", use: "최근 사용", pam: "−", finding: "정상", group: 0, bad: "none" },
  { account: "lee", hr: "퇴직", grant: "CS-readonly 역할", use: "−", pam: "−", finding: "orphan", group: 1, bad: "hr" },
  { account: "ops01", hr: "대응 인원 없음", grant: "DB-operator 역할", use: "여러 명 사용", pam: "−", finding: "shared", group: 1, bad: "use" },
  { account: "park", hr: "재직", grant: "CS-readonly 역할", use: "오래 미사용", pam: "−", finding: "dormant", group: 2, bad: "use" },
  { account: "choi", hr: "재직·CS", grant: "역할 + 직접 grant", use: "최근 사용", pam: "−", finding: "direct grant", group: 3, bad: "grant" },
  { account: "jung", hr: "재직", grant: "신청자 + 승인자 역할", use: "최근 사용", pam: "−", finding: "role conflict", group: 3, bad: "grant" },
  { account: "han", hr: "재직·DBA", grant: "DB-operator 역할", use: "최근 사용", pam: "만료일 지남", finding: "만료 초과", group: 4, bad: "pam" },
];

const SCENES = [
  { label: "같은 cutoff로 맞추기", summary: "원장 넷 · 기준 시각 하나", note: "IAM export와 DB catalog에서 계정·권한을, HR roster에서 사람과 재직 상태를, privileged access tool에서 특권 권한과 만료를 같은 기준 시각으로 뽑아 최근 사용과 함께 한 줄에 놓습니다. 계정과 값은 모두 가정입니다." },
  { label: "사람과 안 맞는 계정", summary: "orphan · shared", note: "orphan은 인사 원장에 대응하는 재직자가 없는데 남은 계정, shared는 한 계정을 여러 사람이 함께 쓰는 경우입니다. HR roster와 맞대야 드러납니다." },
  { label: "쓰지 않는 계정", summary: "dormant", note: "dormant는 계정과 권한은 살아 있지만 오래 쓰지 않은 경우입니다." },
  { label: "권한의 모양", summary: "direct grant · role conflict", note: "direct grant는 역할을 거치지 않고 개인에게 직접 붙은 권한이라 role 이름만 보면 놓칩니다. role conflict는 권한 신청자와 승인자처럼 직무분리상 한 사람이 함께 가지면 안 되는 조합입니다." },
  { label: "기한이 지난 권한", summary: "만료 초과", note: "privileged access tool의 만료일이 지났는데 권한이 남은 경우입니다. 찾은 항목의 변경·말소와 검토 결정은 record로 남깁니다." },
] as const;

const CELLS = [
  { key: "hr", head: "HR roster" },
  { key: "grant", head: "IAM·DB 권한" },
  { key: "use", head: "최근 사용" },
  { key: "pam", head: "특권 만료" },
] as const;

export default function ReviewReconcileViz() {
  return (
    <SceneShell
      eyebrow="권한 review"
      title="원장 넷을 한 줄에 놓아야 보이는 계정"
      description="계정 한 줄에 네 원장의 값을 나란히 놓았습니다. 빨간 칸이 그 장면에서 문제를 드러내는 값입니다. 계정과 값은 모두 설명용 가정입니다."
      ariaLabel="IAM, DB catalog, HR roster, privileged access tool을 같은 cutoff로 대조해 orphan, shared, dormant, direct grant, role conflict, 만료 초과를 찾는 과정"
      scenes={SCENES}
      render={(active) => {
        const visibleFirst = active === 0
          ? ROWS
          : [
              ...ROWS.filter((row) => row.group === active),
              ...ROWS.filter((row) => row.group !== active),
            ];
        return (
          <div className="min-w-0 space-y-2">
            {visibleFirst.map((row) => {
              const lit = active === 0 || row.group === active;
              const flagged = active !== 0 && row.group === active;
              return (
                <div
                  key={row.account}
                  className={`grid min-w-0 grid-cols-[4.5rem_minmax(0,1fr)] items-start gap-2 rounded-lg border px-2 py-2 text-xs transition-opacity duration-300 motion-reduce:transition-none sm:grid-cols-[4.5rem_minmax(0,1fr)_6.5rem] sm:items-center ${
                    flagged ? "border-red-600" : "border-border"
                  } ${lit ? "opacity-100" : "opacity-40"}`}
                >
                  <span className="font-mono font-bold">{row.account}</span>
                  <div className="grid min-w-0 grid-cols-2 gap-1 sm:grid-cols-4">
                    {CELLS.map((cell) => {
                      const bad = flagged && row.bad === cell.key;
                      return (
                        <div key={cell.key} className={`min-w-0 rounded-md border px-1.5 py-1 leading-4 ${bad ? "border-red-600 bg-red-600/10" : "border-border/60"}`}>
                          <span className="block text-[10px] text-muted-foreground">{cell.head}</span>
                          <span className={`block break-keep ${bad ? "font-semibold text-red-700 dark:text-red-400" : ""}`}>{row[cell.key]}</span>
                        </div>
                      );
                    })}
                  </div>
                  <span className={`col-span-2 text-right font-semibold sm:col-span-1 ${flagged ? "text-red-700 dark:text-red-400" : "text-muted-foreground"}`}>
                    {active === 0 || row.group > active ? "−" : row.finding}
                  </span>
                </div>
              );
            })}
          </div>
        );
      }}
    />
  );
}
