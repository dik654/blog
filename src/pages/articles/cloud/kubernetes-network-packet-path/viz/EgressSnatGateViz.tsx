import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mtu-egress — natOutgoing이 켜져 있고 목적지가 모든 Calico pool 밖일 때만 source를 node IP로 바꾼다.
 * 203.0.113.80:443과 192.0.2.11:51842는 이 글 첫 Viz의 "Pod → 외부" 예시입니다.
 */
const POD = "10.244.1.12:43120";
const NODE = "192.0.2.11:51842";
const EXTERNAL = "203.0.113.80:443";

const SCENES = [
  {
    label: "두 조건 모두 충족",
    summary: "source → node IP",
    gate1: "켜짐",
    gate2: "밖",
    gateOn: true,
    before: `${POD} → ${EXTERNAL}`,
    after: `${NODE} → ${EXTERNAL}`,
    afterLabel: "밖으로 나가는 packet",
    changed: true,
    note: "Calico pool의 natOutgoing이 켜져 있고 목적지가 모든 Calico pool 밖이면 Pod source를 node IP로 바꿉니다. 이 변환을 masquerade라고 합니다.",
  },
  {
    label: "응답이 돌아올 때",
    summary: "conntrack이 되돌림",
    gate1: "켜짐",
    gate2: "밖",
    gateOn: true,
    before: `${EXTERNAL} → ${NODE}`,
    after: `${EXTERNAL} → ${POD}`,
    afterLabel: "Pod가 받는 응답",
    changed: true,
    note: "응답은 conntrack에 기록된 변환 관계를 따라 원래 Pod socket으로 돌아옵니다. 그림은 첫 장면과 같은 연결의 응답입니다.",
  },
  {
    label: "사내망을 pool로 등록",
    summary: "source 그대로",
    gate1: "켜짐",
    gate2: "pool에 있음",
    gateOn: false,
    before: `${POD} → 사내망 주소(가정)`,
    after: `${POD} → 사내망 주소(가정)`,
    afterLabel: "밖으로 나가는 packet",
    changed: false,
    note: "내부 사내망을 별도 비활성 pool로 등록해 NAT 대상에서 뺄 수도 있습니다. 그러면 목적지가 pool 밖이라는 조건이 깨져 source가 바뀌지 않습니다.",
  },
  {
    label: "natOutgoing 꺼짐",
    summary: "source 그대로",
    gate1: "꺼짐",
    gate2: "밖",
    gateOn: false,
    before: `${POD} → ${EXTERNAL}`,
    after: `${POD} → ${EXTERNAL}`,
    afterLabel: "밖으로 나가는 packet",
    changed: false,
    note: "목적지가 pool 밖이어도 natOutgoing이 켜져 있지 않으면 이 조건으로는 변환하지 않습니다. “Pod에서 외부로 나가면 무조건 SNAT(source 주소 변환)”라고 외우지 않습니다.",
  },
] as const;

function PacketRow({ title, value, tone }: { title: string; value: string; tone: "plain" | "changed" }) {
  return (
    <div className={`rounded-lg border p-2.5 ${tone === "changed" ? "border-blue-600" : "border-border"}`}>
      <p className="text-xs font-bold leading-5">{title}</p>
      <p className={`mt-1 [overflow-wrap:anywhere] font-mono text-xs leading-5 ${tone === "changed" ? "font-semibold text-blue-700 dark:text-blue-300" : ""}`}>{value}</p>
    </div>
  );
}

function Gate({ question, answer, pass }: { question: string; answer: string; pass: boolean }) {
  return (
    <div className={`min-w-0 rounded-lg border p-2 text-xs leading-5 ${pass ? "border-border" : "border-dashed border-amber-600"}`}>
      <p className="text-muted-foreground">{question}</p>
      <p className={`font-bold ${pass ? "" : "text-amber-700 dark:text-amber-300"}`}>{answer}</p>
    </div>
  );
}

export default function EgressSnatGateViz() {
  return (
    <SceneShell
      eyebrow="외부 송신"
      title="source 주소는 두 조건을 모두 지날 때만 바뀝니다"
      description="Calico의 pool(IPPool, Pod 주소 대역 설정) 기준입니다. packet이 위에서 아래로 지나갑니다. 가운데 두 칸이 조건이고, 조건을 못 지나면 주황 점선으로 표시합니다. 주소는 이 글의 예시(가정)입니다."
      ariaLabel="natOutgoing과 목적지 조건에 따라 Pod source 주소가 바뀌거나 유지되는 네 경우"
      scenes={SCENES}
      render={(scene) => {
        const item = SCENES[scene];
        const reply = scene === 1;
        return (
          <div className="space-y-2">
            <PacketRow title={reply ? "외부에서 온 응답" : "Pod가 보낸 packet"} value={item.before} tone="plain" />
            <div className="grid grid-cols-2 gap-2">
              {reply ? (
                <div className="col-span-2 rounded-lg border border-blue-600 p-2 text-xs leading-5">
                  <p className="text-muted-foreground">conntrack 기록</p>
                  <p className="[overflow-wrap:anywhere] font-mono font-semibold">{POD} ⇔ {NODE}</p>
                </div>
              ) : (
                <>
                  <Gate question="natOutgoing이 켜져 있는가?" answer={item.gate1} pass={item.gate1 === "켜짐"} />
                  <Gate question="목적지가 모든 pool 밖인가?" answer={item.gate2} pass={item.gate2 === "밖"} />
                </>
              )}
            </div>
            <PacketRow title={item.afterLabel} value={item.after} tone={item.changed ? "changed" : "plain"} />
          </div>
        );
      }}
    />
  );
}
