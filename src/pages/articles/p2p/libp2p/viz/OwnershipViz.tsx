import StepSceneShell from "./StepSceneShell";

/**
 * 본문 대응: #behaviour-trait, #handler-trait 첫 문단.
 * Behaviour 하나가 peer 전체의 요청 상태(Bob nonce 7 pending)를 갖고, connection마다 Handler가 하나씩 생긴다.
 * 연결이 없으면 ToSwarm::Dial, connection 42가 있으면 ToSwarm::NotifyHandler.
 * 같은 peer와 두 번째 연결이 생기면 Handler도 둘이 된다(두 번째 연결의 ID는 글에 없어 표시하지 않는다).
 */
const SCENES = [
  {
    label: "아직 연결 없음",
    summary: "Behaviour → ToSwarm::Dial",
    command: "ToSwarm::Dial(Bob)",
    conns: [] as string[],
    target: -1,
    note: "Behaviour는 'Bob에게 nonce 7 Ping이 pending'이라는 요청 상태를 갖습니다. Bob과 연결이 없으므로 Swarm에 Dial을 요청합니다. 연결 전 callback은 후보 주소를 더하거나 policy상 연결을 거부할 수 있습니다.",
  },
  {
    label: "connection 42 성립",
    summary: "established callback → Handler 생성",
    command: "connection established",
    conns: ["connection 42"],
    target: -1,
    note: "연결이 성립하면 established callback이 그 connection 전용 Handler를 만듭니다. socket과 substream negotiation은 이 Handler 쪽 일이고, Behaviour가 직접 poll하지 않습니다.",
  },
  {
    label: "연결이 있으면",
    summary: "ToSwarm::NotifyHandler → 42",
    command: "NotifyHandler(42, SendPing 7)",
    conns: ["connection 42"],
    target: 0,
    note: "connection 42가 있으니 Behaviour는 Dial 대신 NotifyHandler를 냅니다. connection 42의 Handler가 nonce 7과 Ping upgrade를 함께 보관합니다.",
  },
  {
    label: "같은 peer, 연결 둘",
    summary: "Behaviour 1개 · Handler 2개",
    command: "Behaviour는 그대로 하나",
    conns: ["connection 42", "두 번째 연결"],
    target: 0,
    note: "같은 peer와 연결이 두 개라면 Handler도 두 개입니다. 반면 Kademlia routing table이나 GossipSub mesh처럼 여러 peer를 함께 봐야 하는 상태는 위의 Behaviour 하나에 남습니다.",
  },
] as const;

export default function OwnershipViz() {
  return (
    <StepSceneShell
      eyebrow="상태의 주인"
      title="Behaviour는 하나, Handler는 연결마다 하나"
      description="바깥 칸이 Swarm입니다. 위는 peer 전체를 보는 Behaviour, 아래는 connection pool이며 연결 칸 안에 그 연결 전용 Handler가 있습니다."
      ariaLabel="Swarm 안에서 Behaviour와 connection별 Handler가 상태를 나눠 갖는 구조"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 rounded-lg border border-border bg-background p-3 sm:p-4">
            <p className="text-xs font-bold text-muted-foreground">Swarm</p>
            <div className="mt-2 rounded-lg border border-[#2563eb] bg-[#2563eb]/10 px-3 py-2 text-xs leading-5 sm:text-sm">
              <span className="block font-bold text-[#2563eb]">NetworkBehaviour · peer 전체</span>
              <span className="block break-keep text-muted-foreground">요청 상태: Bob · nonce 7 · pending</span>
              <span className="block break-keep text-muted-foreground">여러 peer 상태: routing table · mesh</span>
            </div>
            <div className="flex items-center gap-2 py-2">
              <div className="ml-4 h-6 w-px bg-[#2563eb]" aria-hidden />
              <span className="break-keep font-mono text-[11px] font-semibold text-[#2563eb] sm:text-xs">{scene.command}</span>
            </div>
            <div className="rounded-lg border border-dashed border-border px-3 py-2">
              <p className="text-xs font-bold text-muted-foreground">connection pool</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {[0, 1].map((slot) => {
                  const name = scene.conns[slot];
                  if (!name) {
                    return (
                      <div key={slot} className="flex min-h-[4.5rem] items-center justify-center rounded-md border border-dashed border-border/60 text-[11px] text-muted-foreground/60 sm:text-xs">
                        연결 없음
                      </div>
                    );
                  }
                  const hit = slot === scene.target;
                  return (
                    <div key={slot} className="min-h-[4.5rem] rounded-md border border-border bg-muted/30 px-2 py-2 text-[11px] leading-4 sm:text-xs sm:leading-5">
                      <span className="block font-bold">{name}</span>
                      <span className={`mt-1 block rounded border px-1 py-1 text-center font-semibold ${hit ? "border-[#059669] bg-[#059669]/10 text-[#059669]" : "border-border text-muted-foreground"}`}>
                        Handler{hit ? " · nonce 7" : ""}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
