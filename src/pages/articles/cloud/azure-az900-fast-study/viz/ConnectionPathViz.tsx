import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison 둘째 문단 — Public Endpoint · Private Endpoint · VPN Gateway · ExpressRoute.
 * 각 장면의 출발점(인터넷의 사용자, VNet 안 VM, 회사 망)은 설명을 위한 가정이다.
 * "공용 인터넷 위 터널"(VPN Gateway)과 "공용 인터넷을 거치지 않음"(ExpressRoute)은 본문 둘째 문단의 정의와 같다.
 */
type Lane = "public" | "private";

const SCENES = [
  {
    label: "Public Endpoint",
    summary: "인터넷 주소로 서비스에 닿음",
    from: "인터넷의 사용자 (가정)",
    lane: "public" as Lane,
    path: "인터넷 주소로 접속",
    to: "서비스의 공개 주소",
    note: "Public Endpoint는 인터넷 주소에서 서비스에 닿게 합니다. 길은 누구나 쓰는 공용 인터넷입니다.",
  },
  {
    label: "Private Endpoint",
    summary: "VNet 안에 서비스의 사설 주소",
    from: "VNet 안의 VM (가정)",
    lane: "private" as Lane,
    path: "VNet 안 사설 주소",
    to: "서비스 (사설 주소로 연결)",
    note: "VNet은 Azure 안에 만든 사설 네트워크입니다. Private Endpoint는 이 VNet 안에 서비스용 사설 주소를 만들어, VNet 안의 자원이 그 주소로 서비스에 닿게 합니다.",
  },
  {
    label: "VPN Gateway",
    summary: "공용 인터넷 위의 암호화된 터널",
    from: "회사 망 (가정)",
    lane: "public" as Lane,
    path: "암호화된 터널",
    to: "VNet의 VPN Gateway",
    note: "VPN Gateway는 다른 망과 VNet 사이에 암호화된 터널을 만듭니다. 터널은 공용 인터넷 위를 지나지만 내용은 암호화됩니다.",
  },
  {
    label: "ExpressRoute",
    summary: "통신사 기반 사설 연결",
    from: "회사 망 (가정)",
    lane: "private" as Lane,
    path: "통신사 사설 연결",
    to: "Azure의 VNet",
    note: "ExpressRoute는 통신사를 통한 사설 연결이라 공용 인터넷을 거치지 않습니다. VPN Gateway와 둘 다 다른 망을 Azure에 잇지만 지나는 길이 다릅니다.",
  },
] as const;

const ACCENT = "#2563eb";
const MUTED = "#94a3b8";

function End({ caption, text }: { caption: string; text: string }) {
  return (
    <div className="min-w-0 rounded-lg border border-[#94a3b8] bg-background/60 p-3">
      <p className="text-xs text-muted-foreground">{caption}</p>
      <p className="mt-1 break-words text-sm font-bold leading-5 text-foreground">{text}</p>
    </div>
  );
}

function LaneRow({ name, on, path }: { name: string; on: boolean; path: string }) {
  return (
    <div
      className={`min-w-0 rounded-md border px-3 py-2 ${on ? "" : "border-dashed"}`}
      style={{ borderColor: on ? ACCENT : MUTED }}
    >
      <p className="text-xs text-muted-foreground">{name}</p>
      <p className="mt-1 flex min-w-0 items-center gap-2 text-sm leading-5">
        <span aria-hidden="true" className="block h-px min-w-[1.5rem] flex-1" style={{ backgroundColor: on ? ACCENT : MUTED, opacity: on ? 1 : 0.4 }} />
        <span className={`shrink-0 font-semibold ${on ? "" : "invisible"}`} style={{ color: ACCENT }}>
          {path}
        </span>
        <span aria-hidden="true" className={on ? "" : "invisible"} style={{ color: ACCENT }}>
          →
        </span>
      </p>
    </div>
  );
}

export default function ConnectionPathViz() {
  return (
    <SceneShell
      eyebrow="연결 경로"
      title="네 연결은 지나는 길이 다릅니다"
      description="가운데 두 줄 중 파란 줄이 요청이 지나는 길입니다. 위는 누구나 쓰는 공용 인터넷, 아래는 공용 인터넷을 거치지 않는 사설 구간입니다. 출발점은 설명을 위한 가정입니다."
      ariaLabel="Public Endpoint, Private Endpoint, VPN Gateway, ExpressRoute의 출발점, 경로, 도착점"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid min-w-0 items-center gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_minmax(0,1fr)] sm:gap-3">
            <End caption="출발" text={scene.from} />
            <div className="grid min-w-0 gap-2">
              <LaneRow name="공용 인터넷" on={scene.lane === "public"} path={scene.path} />
              <LaneRow name="사설 구간" on={scene.lane === "private"} path={scene.path} />
            </div>
            <End caption="도착" text={scene.to} />
          </div>
        );
      }}
    />
  );
}
