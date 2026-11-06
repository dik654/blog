import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #conntrack — 항목 하나가 original·reply 두 방향 tuple로 표에 두 번 들어가 응답도 같은 항목을 찾는다.
 * 주소는 기호로 적고, 포트 p는 MASQUERADE 뒤에도 같다고 가정한다(서버 포트 443은 https 요청).
 * 상한을 넘으면 early_drop을 시도하고, 안 되면 그 패킷을 버린다.
 */
interface Scene extends ShellScene {
  packet: string;
  action: string;
  original: string;
  reply: string;
  state: string;
  hit: "none" | "original" | "reply" | "full";
}

const SCENES: readonly Scene[] = [
  { label: "첫 패킷", summary: "항목 없음 → 새로 만듦", packet: "Pod:p → 서버:443", action: "5-tuple을 뽑아 해시로 버킷을 찾음", original: "비어 있음", reply: "비어 있음", state: "없음", hit: "none", note: "5-tuple은 출발·목적지 주소와 포트, 프로토콜입니다. 이 값을 해시해 표의 칸(버킷)을 찾고, 항목이 없으면 새로 만듭니다." },
  { label: "항목 하나, 자리 두 개", summary: "original · reply", packet: "Pod:p → 서버:443", action: "두 방향 tuple을 함께 넣음", original: "Pod:p → 서버:443", reply: "서버:443 → Pod:p", state: "NEW", hit: "original", note: "항목은 하나지만 표에는 두 번 들어갑니다. 한쪽은 지금 방향, 다른 쪽은 응답이 올 방향입니다. 그래서 응답 패킷도 같은 항목을 찾습니다." },
  { label: "MASQUERADE", summary: "출발지 Pod → 노드", packet: "노드:p → 서버:443", action: "변환을 항목에 기록하고 출발 주소를 고침", original: "Pod:p → 서버:443", reply: "서버:443 → 노드:p", state: "NEW", hit: "reply", note: "NAT는 항목에 변환 정보를 적어 두고 패킷을 고쳐 쓰는 일입니다. 출발 주소가 노드 IP로 바뀌고, 응답이 올 방향도 노드 IP 기준이 됩니다." },
  { label: "응답", summary: "reply로 찾아 Pod로 되돌림", packet: "서버:443 → 노드:p", action: "같은 항목을 찾아 목적지를 Pod IP로 고침", original: "Pod:p → 서버:443", reply: "서버:443 → 노드:p", state: "ESTABLISHED", hit: "reply", note: "이 응답이 어느 변환의 응답인지 기억하는 것이 conntrack 표입니다. reply 방향 tuple로 항목을 찾아 목적지를 Pod IP로 되돌립니다." },
  { label: "표가 가득 찼을 때", summary: "새 연결의 첫 패킷만 버림", packet: "새 연결의 첫 SYN", action: "같은 버킷의 오래된 항목 지우기 시도(early_drop) → 안 되면 버림", original: "기존 항목은 그대로", reply: "기존 항목은 그대로", state: "table full", hit: "full", note: "지우지 못하면 dmesg에 경고를 남기고 그 패킷을 버립니다. 기존 연결은 멀쩡해서 증상은 '가끔 연결이 안 됨'입니다." },
];

function Tuple({ name, value, on }: { name: string; value: string; on: boolean }) {
  return (
    <div className={`grid grid-cols-[3.75rem_minmax(0,1fr)] items-center gap-2 rounded border px-2 py-1 text-xs ${on ? "border-[#2563eb]" : "border-border/70"}`}>
      <span className="text-muted-foreground">{name}</span>
      <code className={on ? "font-bold" : ""}>{value}</code>
    </div>
  );
}

export default function ConntrackEntryViz() {
  return (
    <SceneShell
      eyebrow="conntrack 항목"
      title="항목 하나가 두 방향으로 적혀 있어 응답도 찾아옵니다"
      description="서버:443은 curl이 접속하는 https 서버, p는 Pod 쪽 포트입니다. p가 변환 뒤에도 같다는 것은 가정입니다."
      ariaLabel="conntrack 항목이 만들어지고 NAT 응답을 되돌리는 순서"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const full = scene.hit === "full";
        return (
          <div className="min-w-0">
            <div className="rounded-lg border border-border px-3 py-2 text-xs leading-5">
              <span className="block text-muted-foreground">지금 패킷</span>
              <code className="block font-bold">{scene.packet}</code>
              <span className="mt-1 block min-h-10 sm:min-h-5">{scene.action}</span>
            </div>
            <p aria-hidden className="py-1 text-center text-sm font-bold text-[#2563eb]">↓</p>
            <div className={`rounded-lg border p-2 ${full ? "border-[#dc2626]" : "border-[#b45309]"}`}>
              <div className="mb-1.5 flex items-baseline justify-between gap-2 text-xs">
                <span className="font-bold">conntrack 표</span>
                <span className={`font-mono font-bold ${full ? "text-[#dc2626]" : ""}`}>{scene.state}</span>
              </div>
              <div className="space-y-1">
                <Tuple name="original" value={scene.original} on={scene.hit === "original"} />
                <Tuple name="reply" value={scene.reply} on={scene.hit === "reply"} />
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
