import TcpSceneShell from "./TcpSceneShell";

/**
 * 본문 대응: #socket-creation, #dial-listen — listen은 bind 뒤 실제 address를 NewAddress로 알린다.
 * backlog 1024는 아직 accept되지 않은 연결의 OS queue 요청값(실제 길이는 OS가 제한할 수 있음)이며 established limit가 아니다.
 * accept된 stream은 remote PeerId를 모르는 inbound candidate이고, admission limit와 handshake timeout을 거친 뒤에만 established peer로 센다.
 */
const STAGES = [
  { id: "bind", title: "bind", sub: "port 0이면 OS가 고름 → NewAddress" },
  { id: "backlog", title: "OS backlog queue", sub: "아직 accept 안 됨 · 요청값 1024" },
  { id: "candidate", title: "inbound candidate", sub: "accept됨 · remote PeerId 모름" },
  { id: "established", title: "established peer", sub: "handshake 통과 · PeerId 확인" },
] as const;

const SCENES = [
  {
    label: "bind 뒤에 주소가 정해짐",
    summary: "/tcp/0 요청 → NewAddress",
    note: "port 0을 요청하면 OS가 실제 port를 고르므로, 알릴 수 있는 port는 bind가 끝난 뒤에야 압니다. Listener는 그 실제 address를 NewAddress로 알립니다.",
    at: 0,
    counted: false,
  },
  {
    label: "accept를 기다리는 줄",
    summary: "backlog 1024는 요청값",
    note: "backlog는 연결은 들어왔지만 application이 아직 accept하지 않은 연결이 서는 OS 줄입니다. 1024는 요청값이고 실제 길이는 OS가 제한할 수 있습니다. application의 established connection limit가 아닙니다.",
    at: 1,
    counted: false,
  },
  {
    label: "accept는 peer가 아님",
    summary: "PeerId 모르는 candidate",
    note: "accept된 stream은 아직 상대 PeerId를 모르는 inbound candidate입니다. 이 단계에서 admission limit와 handshake timeout이 적용되며, 큰 backlog가 이 slot과 memory 관리를 대신하지 못합니다.",
    at: 2,
    counted: false,
  },
  {
    label: "handshake를 통과해야 셈",
    summary: "established peer 수에 포함",
    note: "admission limit와 handshake timeout을 거쳐 handshake가 끝난 뒤에야 established peer로 셉니다. 과부하 때는 pending inbound와 established connection 수를 각각 따로 관측합니다.",
    at: 3,
    counted: true,
  },
] as const;

export default function InboundAdmissionViz() {
  return (
    <TcpSceneShell
      eyebrow="inbound 연결의 단계"
      title="accept된 연결과 established peer는 다른 칸에서 셉니다"
      description="1칸은 listener가 연결을 받기 전에 한 번 하는 준비이고, 2~4칸은 inbound 연결 하나가 왼쪽에서 오른쪽으로 지나는 칸입니다. 굵은 테두리가 지금 보는 칸이며, 칸마다 적용되는 한도가 다릅니다."
      ariaLabel="bind, OS backlog, inbound candidate, established peer 네 단계를 지나는 inbound 연결"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <ol className="grid grid-cols-1 gap-2 sm:grid-cols-4">
              {STAGES.map((stage, index) => {
                const here = index === scene.at;
                const passed = index < scene.at;
                return (
                  <li
                    key={stage.id}
                    className="rounded-lg bg-background px-3 py-2 text-xs"
                    style={{
                      border: here ? "1.25px solid #2563eb" : passed ? "1px solid #94a3b8" : "1px dashed #cbd5e1",
                    }}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className={`font-semibold ${here ? "text-[#1d4ed8] dark:text-[#93c5fd]" : ""}`}>{index + 1}. {stage.title}</span>
                      <span className="font-mono text-[11px] text-muted-foreground">{here ? "● 여기" : passed ? "지남" : ""}</span>
                    </span>
                    <span className="mt-0.5 block text-muted-foreground">{stage.sub}</span>
                  </li>
                );
              })}
            </ol>
            <div className="rounded-md border border-border bg-muted/30 px-3 py-1.5 text-xs">
              <span className="text-muted-foreground">established peer 수에 포함: </span>
              <span className="font-mono font-bold">{scene.counted ? "예" : "아니오"}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
