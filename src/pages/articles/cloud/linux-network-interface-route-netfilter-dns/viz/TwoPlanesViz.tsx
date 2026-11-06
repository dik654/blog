import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #black-box — 요청 하나는 이름 평면을 먼저, 데이터 평면을 그다음에 지난다.
 * 마지막 장면은 1절의 세 증상이 어느 자리의 문제인지 번호로 짚는다(자세한 설명은 3·5·8절).
 */
const NAME = ["프로세스", "/etc/\u200bresolv.conf", "nameserver", "IP 주소"] as const;
const DATA = ["Pod eth0", "호스트 veth 짝", "bridge 또는 호스트 라우팅", "노드 밖"] as const;

interface Scene extends ShellScene {
  plane: "name" | "out" | "back" | "all";
}

const SCENES: readonly Scene[] = [
  { label: "먼저 이름 평면", summary: "이름 → IP 주소", plane: "name", note: "프로세스가 /etc/resolv.conf를 읽어 nameserver에 묻고 IP 주소를 얻습니다. 데이터 평면의 앞 단계입니다." },
  { label: "그다음 데이터 평면", summary: "주소 → 경로 → 노드 밖", plane: "out", note: "veth는 한 쌍으로 묶인 가상 장치입니다. 패킷은 Pod의 eth0(veth 한쪽)을 나와 호스트의 짝에서 수신되고, bridge(소프트웨어 스위치) 또는 호스트 라우팅을 거쳐 노드 밖으로 나갑니다." },
  { label: "돌아오는 패킷", summary: "반대 순서로 소켓까지", plane: "back", note: "응답은 같은 칸을 반대 순서로 지나 Pod 안의 소켓에 닿습니다. 라우팅 결정 앞뒤의 정해진 자리에서는 netfilter가 규칙을 적용합니다." },
  { label: "1절의 세 증상이 있는 자리", summary: "① 이름 ② ③ 데이터", plane: "all", note: "① 여덟 질의는 이름 평면의 일입니다. ② table full은 netfilter 자리에 붙어 연결을 기록하는 conntrack의 일이고, ③ 자기 Service 응답 없음은 bridge의 일입니다. 3·8·5절에서 차례로 봅니다." },
];

function Lane({ title, items, on, dir, marks }: { title: string; items: readonly string[]; on: boolean; dir: "→" | "←"; marks: Record<number, string> }) {
  return (
    <div className={on ? "" : "opacity-40"}>
      <p className="mb-1.5 text-xs font-bold">{title}</p>
      <div className="grid grid-cols-[repeat(4,minmax(0,1fr))] gap-x-2">
        {items.map((item, index) => (
          <div key={item} className="relative flex min-h-[4.25rem] items-center justify-center rounded-lg border px-0.5 py-1 text-center text-[11px] font-semibold leading-4 sm:text-xs" style={{ borderColor: on ? "#2563eb" : "#94a3b8" }}>
            {item}
            {index < items.length - 1 && <span aria-hidden className="absolute -right-2 top-1/2 w-2 -translate-y-1/2 text-center text-[11px] font-bold text-[#2563eb]">{on ? dir : ""}</span>}
            {marks[index] && <span className="absolute -right-1 -top-2 rounded bg-[#b45309] px-1 text-[11px] font-bold leading-4 text-white">{marks[index]}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TwoPlanesViz() {
  return (
    <SceneShell
      eyebrow="이름 평면 · 데이터 평면"
      title="요청 하나는 이름을 먼저 풀고, 그 주소로 패킷을 보냅니다"
      description="위 줄이 이름 평면, 아래 줄이 데이터 평면입니다. 진한 줄이 지금 지나는 평면입니다."
      ariaLabel="이름 평면과 데이터 평면을 지나는 순서와 세 증상의 위치"
      scenes={SCENES}
      render={(active) => {
        const { plane } = SCENES[active];
        const all = plane === "all";
        return (
          <div className="min-w-0 space-y-4">
            <Lane title="이름 평면" items={NAME} on={plane === "name" || all} dir="→" marks={all ? { 2: "①" } : {}} />
            <Lane title="데이터 평면" items={DATA} on={plane !== "name"} dir={plane === "back" ? "←" : "→"} marks={all ? { 2: "②③" } : {}} />
          </div>
        );
      }}
    />
  );
}
