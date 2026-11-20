import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — Entra 테넌트(신원 디렉터리)와 Azure 자원 범위(관리 그룹 › 구독 › 리소스 그룹 › 자원)는
 * 서로 다른 경계다. 구독은 한 테넌트와 연결되고, 관리 그룹은 여러 구독에 정책·접근 범위를 적용한다.
 * RBAC 역할은 네 범위 중 어디에나 붙일 수 있고, 관리 ID로 자원이 Entra 신원을 갖는다.
 * 구독 2개, 자원 2개는 설명용 가정이다.
 */
const SCENES = [
  {
    label: "서로 다른 두 경계",
    summary: "테넌트 = 누구 · 구독 = 어디·청구",
    note: "Microsoft Entra 테넌트는 사용자·그룹·애플리케이션 신원의 디렉터리 경계입니다. Azure 구독은 자원·청구·할당량의 경계이고, 한 테넌트와 연결됩니다. 둘은 같은 말이 아닙니다.",
    link: "구독 A와 구독 B는 각각 테넌트 하나와 연결됩니다.",
  },
  {
    label: "관리 그룹",
    summary: "여러 구독에 한 번에 적용",
    note: "관리 그룹은 여러 구독을 묶어 정책과 접근 범위를 함께 적용합니다. 그 아래 구독 전체에 닿는 자리입니다.",
    link: "관리 그룹에 붙인 정책 → 구독 A·B 모두",
  },
  {
    label: "역할을 붙이는 자리",
    summary: "주체 + 역할 + 범위",
    note: "Azure RBAC 역할 할당은 왼쪽의 주체 하나와 역할 정의 하나를 오른쪽의 범위 하나에 묶습니다. 범위는 관리 그룹, 구독, 리소스 그룹, 개별 자원 중에서 고릅니다.",
    link: "그룹 + 역할 정의 + 범위(네 곳 중 하나)",
  },
  {
    label: "관리 ID",
    summary: "자원도 테넌트 안의 신원",
    note: "관리 ID를 쓰면 Azure 자원이 Entra ID의 신원으로 다른 자원에 접근합니다. 그만큼 비밀 키 파일을 줄일 수 있습니다.",
    link: "앱 자원의 관리 ID → 저장소 (비밀 키 파일을 줄임)",
  },
] as const;

const BOX = "rounded-lg border p-2";
const ON = "border-blue-600 bg-blue-600/10";
const OFF = "border-border";

function Chip({ on, children }: { on: boolean; children: string }) {
  return (
    <span className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[11px] leading-4 ${on ? "border-blue-600 bg-blue-600/15 font-bold text-blue-700 dark:text-blue-300" : "border-border text-muted-foreground"}`}>
      {children}
    </span>
  );
}

export default function AzureOverlayViz() {
  return (
    <SceneShell
      eyebrow="Azure의 두 체계"
      title="신원 디렉터리와 자원 범위를 겹쳐서 읽습니다"
      description="왼쪽은 ‘누구인가’를 담는 테넌트, 오른쪽은 ‘어디에 무엇이 있고 누가 비용을 내는가’를 담는 자원 범위입니다. 파란 칸이 각 장면의 주인공입니다. 구독 2개와 자원 2개는 설명용 가정입니다."
      ariaLabel="Entra 테넌트와 Azure 관리 그룹, 구독, 리소스 그룹, 자원 범위의 관계"
      scenes={SCENES}
      render={(active) => {
        const scope = active === 2;
        const mi = active === 3;
        return (
          <div className="min-w-0">
            <div className="grid gap-3 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
              <div className={`${BOX} ${active === 0 ? ON : OFF}`}>
                <p className="text-xs font-bold">Entra 테넌트</p>
                <p className="text-[11px] text-muted-foreground">신원 디렉터리 경계</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <Chip on={false}>사용자</Chip>
                  <Chip on={scope}>그룹</Chip>
                  <Chip on={false}>애플리케이션</Chip>
                  <span className={mi ? undefined : "invisible"} aria-hidden={!mi}>
                    <Chip on={mi}>앱 자원의 관리 ID</Chip>
                  </span>
                </div>
              </div>
              <div className={`${BOX} ${active === 1 || scope ? ON : OFF}`}>
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <p className="text-xs font-bold">관리 그룹</p>
                  {scope && <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300">범위 ①</span>}
                </div>
                <div className="mt-1.5 grid grid-cols-2 items-start gap-1.5">
                  <div className={`${BOX} ${active === 0 || active === 1 || scope ? ON : OFF}`}>
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <p className="text-xs font-bold">구독 A</p>
                      {scope && <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300">②</span>}
                    </div>
                    <p className="text-[11px] text-muted-foreground">자원·청구·할당량</p>
                    <div className={`mt-1.5 rounded-md border border-dashed p-1.5 ${scope ? "border-blue-600" : "border-border"}`}>
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <p className="text-[11px] font-semibold">리소스 그룹</p>
                        {scope && <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300">③</span>}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        <Chip on={scope || mi}>{scope ? "앱 자원 ④" : "앱 자원"}</Chip>
                        <Chip on={scope || mi}>{scope ? "저장소 ④" : "저장소"}</Chip>
                      </div>
                    </div>
                  </div>
                  <div className={`${BOX} ${active === 0 || active === 1 ? ON : OFF}`}>
                    <p className="text-xs font-bold">구독 B</p>
                    <p className="text-[11px] text-muted-foreground">자원·청구·할당량</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 flex min-h-[3.25rem] flex-wrap content-center items-center justify-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
              {active === 0 && (
                <>
                  <span className="inline-flex items-center gap-1"><Chip on>구독 A</Chip>→<Chip on>Entra 테넌트</Chip></span>
                  <span className="inline-flex items-center gap-1"><Chip on>구독 B</Chip>→<Chip on>Entra 테넌트</Chip></span>
                </>
              )}
              {scope && (
                <span className="inline-flex flex-wrap items-center justify-center gap-1">
                  <Chip on>그룹</Chip>+<Chip on>역할 정의</Chip>+<Chip on>범위 ①–④ 중 하나</Chip>
                </span>
              )}
            </div>
            <p className="mt-2 flex min-h-[2.75rem] items-center justify-center rounded-md border border-border px-3 text-center text-sm font-semibold">
              {SCENES[active].link}
            </p>
          </div>
        );
      }}
    />
  );
}
