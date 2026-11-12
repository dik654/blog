import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview "인증범위(scope)는 회사 이름과 같은 말이 아닙니다" 두 문단.
 * 회사 전체 안에서 대상 서비스를 중심으로 경계를 긋고, 위치·외부 위탁자를 범위 판단에 넣고,
 * 범위 밖 시스템이 로그인·배포·결제·백업으로 이어지면 관계와 제외 근거를 설명해야 한다.
 */
const SCENES = [
  {
    label: "회사 ≠ 인증범위",
    summary: "대상 서비스 중심의 경계",
    note: "인증범위는 회사 이름이 아니라 대상 서비스와 그 서비스를 운영하는 조직·사람, 애플리케이션·서버·네트워크·데이터를 하나의 경계로 고정한 것입니다. 회사의 다른 업무는 경계 밖에 남을 수 있습니다.",
  },
  {
    label: "위치와 외부자",
    summary: "사무실·IDC·클라우드·위탁자도 판단",
    note: "같은 서비스가 사무실, IDC, 클라우드에 나뉘어 있거나 외부 위탁자가 운영에 관여하면, 그 위치와 위탁자도 범위에 포함할지 함께 판단합니다.",
  },
  {
    label: "경계를 넘는 연결",
    summary: "범위 밖이어도 연결은 설명 대상",
    note: "범위 밖 시스템이 인증 서비스의 로그인, 배포, 결제, 백업에 연결돼 있다면 그 시스템을 경계 밖에 둔다고 끝나지 않습니다. 어떤 관계인지와 왜 제외했는지를 설명해야 합니다.",
  },
] as const;

const CORE = ["대상 서비스", "조직·사람", "애플리케이션", "서버", "네트워크", "데이터"] as const;
const PLACES = ["사무실", "IDC", "클라우드", "외부 위탁자"] as const;
const LINKS = ["로그인", "배포", "결제", "백업"] as const;
const OTHER = ["다른 업무 A (가정)", "다른 업무 B (가정)"] as const;

function Chip({ text, tone }: { text: string; tone: "core" | "place" | "muted" }) {
  const cls =
    tone === "core"
      ? "border-primary/60 bg-primary/[0.07] font-semibold"
      : tone === "place"
        ? "border-amber-600/60 bg-amber-500/[0.08] font-semibold"
        : "border-dashed border-border text-muted-foreground";
  return <span className={`rounded-md border px-2 py-1 text-xs leading-5 ${cls}`}>{text}</span>;
}

export default function ScopeBoundaryViz() {
  return (
    <SceneShell
      eyebrow="인증범위"
      title="인증범위는 회사 전체가 아니라 서비스를 중심으로 그은 경계입니다"
      description="바깥 점선은 회사 전체, 안쪽 실선이 인증범위입니다. 회사 안의 다른 업무 이름은 설명을 위한 가정입니다."
      ariaLabel="회사 전체와 인증범위 경계, 범위 밖 시스템과의 연결 세 장면"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 rounded-lg border border-dashed border-border p-3 sm:p-4">
          <p className="text-xs font-bold text-muted-foreground">회사 전체</p>
          <div className="mt-3 grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_12rem]">
            <div className="min-w-0 rounded-lg border-2 border-primary/70 p-3">
              <p className="text-xs font-bold text-primary">인증범위 경계</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {CORE.map((item) => (
                  <Chip key={item} text={item} tone="core" />
                ))}
              </div>
              <div className={`mt-3 border-t border-border/70 pt-3 ${active >= 1 ? "" : "invisible"}`}>
                <p className="text-xs text-muted-foreground">위치·외부자도 범위 판단에 포함</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {PLACES.map((item) => (
                    <Chip key={item} text={item} tone="place" />
                  ))}
                </div>
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-muted-foreground">범위 밖</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {OTHER.map((item) => (
                  <Chip key={item} text={item} tone="muted" />
                ))}
              </div>
              <div className={`mt-3 rounded-md border border-red-600/60 p-2 ${active >= 2 ? "" : "invisible"}`}>
                <p className="text-xs font-semibold text-red-700 dark:text-red-400">범위 밖 시스템 ↔ 인증 서비스</p>
                <ul className="mt-1 space-y-1">
                  {LINKS.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs">
                      <span aria-hidden className="font-mono text-red-700 dark:text-red-400">↔</span>
                      <span>{item} 연결</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs font-semibold leading-5">관계와 제외 근거를 설명</p>
              </div>
            </div>
          </div>
        </div>
      )}
    />
  );
}
