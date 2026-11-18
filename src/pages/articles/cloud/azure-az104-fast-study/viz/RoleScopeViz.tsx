import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — web 리소스 그룹 8개 + data 리소스 그룹 4개 = 12개, 개발자는 web만 변경하고 data는 읽기만 한다.
 * 구독 전체 Contributor는 요구보다 넓고, web에는 변경 역할·data에는 읽기 역할을 붙인 뒤 유효 권한으로 확인한다.
 * 역할 이름(Contributor·Reader)은 6절 용어 "유효 권한"의 예시에서 가져왔다.
 */
type Access = "change" | "read" | "none";

const SCENES = [
  {
    label: "구독 전체에 Contributor",
    summary: "12개 모두 변경 가능 · 요구보다 넓음",
    sub: "Contributor (변경)",
    web: "",
    data: "",
    webAccess: "change" as Access,
    dataAccess: "change" as Access,
    note: "Contributor는 자원을 바꿀 수 있는 역할입니다. 구독에 붙이면 아래 두 리소스 그룹의 12개가 모두 바뀔 수 있어, 읽기만 해야 할 data 4개까지 변경 대상이 됩니다.",
  },
  {
    label: "web 범위에 변경 역할",
    summary: "web 8개 변경 · data 4개 아직 권한 없음",
    sub: "",
    web: "Contributor (변경)",
    data: "",
    webAccess: "change" as Access,
    dataAccess: "none" as Access,
    note: "구독 전체 할당을 빼고 역할을 web 리소스 그룹에 붙이면 그 안의 8개에만 닿습니다. 구독 할당을 남겨 두면 data 4개도 계속 변경 대상입니다. data 그룹에는 아직 아무 역할도 닿지 않습니다.",
  },
  {
    label: "data 범위에 읽기 역할",
    summary: "8개 변경 + 4개 읽기 = 12개",
    sub: "",
    web: "Contributor (변경)",
    data: "Reader (읽기)",
    webAccess: "change" as Access,
    dataAccess: "read" as Access,
    note: "data 리소스 그룹에 읽기 역할을 붙여 나머지 4개를 덮습니다. 운영 비상 권한은 이 두 할당에 섞지 않고 별도로 둡니다.",
  },
  {
    label: "유효 권한으로 확인",
    summary: "예상: web 변경 8 · data 읽기 4",
    sub: "",
    web: "Contributor (변경)",
    data: "Reader (읽기)",
    webAccess: "change" as Access,
    dataAccess: "read" as Access,
    note: "유효 권한은 여러 범위의 역할 할당이 합쳐진 뒤 실제로 적용되는 결과입니다. 포털에 보이는 역할 이름 하나로 판단하지 않고, 실제 할당을 해석해 이 칸과 같은지 확인합니다.",
  },
] as const;

const STYLE: Record<Access, { border: string; fill: string; text: string; word: string }> = {
  change: { border: "#d97706", fill: "#d97706", text: "#ffffff", word: "변경" },
  read: { border: "#2563eb", fill: "transparent", text: "#2563eb", word: "읽기" },
  none: { border: "#94a3b8", fill: "transparent", text: "#94a3b8", word: "없음" },
};

function Cells({ count, access }: { count: number; access: Access }) {
  const style = STYLE[access];
  return (
    <div className="mt-2 grid grid-cols-4 gap-1">
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className={`flex h-6 items-center justify-center rounded-sm border text-[11px] font-semibold ${access === "none" ? "border-dashed" : ""}`}
          style={{ borderColor: style.border, backgroundColor: style.fill, color: style.text }}
        >
          {style.word}
        </span>
      ))}
    </div>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className={`mt-1 block min-h-[1.25rem] text-xs font-semibold leading-5 text-foreground ${text ? "" : "invisible"}`}>
      ↓ 역할 할당 · {text || "없음"}
    </span>
  );
}

export default function RoleScopeViz() {
  return (
    <SceneShell
      eyebrow="역할을 붙이는 범위"
      title="역할을 붙인 상자 아래 자원만 그 권한을 받습니다"
      description="칸 하나가 3절의 자원 하나이고, 칸 안 글자가 개발자가 그 자원에 할 수 있는 일입니다. 주황은 변경, 파란 테두리는 읽기, 점선은 권한 없음입니다."
      ariaLabel="구독, web 리소스 그룹 8개, data 리소스 그룹 4개에 역할을 붙였을 때 개발자의 자원별 권한"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const check = active === SCENES.length - 1;
        return (
          <div className="min-w-0">
            <div className="min-w-0 rounded-lg border border-[#94a3b8] bg-background/60 p-2.5">
              <p className="text-sm font-bold text-foreground">구독</p>
              <Badge text={scene.sub} />
              <div className="mt-2 grid min-w-0 gap-2 sm:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
                <div className="min-w-0 rounded-lg border border-[#94a3b8] p-2.5">
                  <p className="text-sm font-bold text-foreground">web 리소스 그룹 · 8개</p>
                  <p className="text-xs leading-5 text-muted-foreground">요구: 개발자 변경</p>
                  <Badge text={scene.web} />
                  <Cells count={8} access={scene.webAccess} />
                </div>
                <div className="min-w-0 rounded-lg border border-[#94a3b8] p-2.5">
                  <p className="text-sm font-bold text-foreground">data 리소스 그룹 · 4개</p>
                  <p className="text-xs leading-5 text-muted-foreground">요구: 개발자 읽기만</p>
                  <Badge text={scene.data} />
                  <Cells count={4} access={scene.dataAccess} />
                </div>
              </div>
            </div>
            <p className={`mt-3 text-sm leading-6 ${check ? "" : "invisible"}`}>
              <span className="font-bold text-foreground">유효 권한 · </span>
              web 변경 8개 + data 읽기 4개 = 12개 · 요구와 같으면 통과
            </p>
          </div>
        );
      }}
    />
  );
}
