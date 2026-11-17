import EvmosSceneShell from "./EvmosSceneShell";

/**
 * 본문 대응: #ibc-boundary — v20 ERC-20 middleware가 underlying ICS-20 callback을 먼저 부르고,
 * 결과에 따라 conversion을 잇거나 멈추는 순서. 발신 측 error ack·timeout은 ICS-20 refund 뒤 representation 복원.
 */
type NodeId = "send" | "relayOut" | "recv" | "errAck" | "okAck" | "convert" | "relayBack" | "ackSrc" | "timeout" | "refund" | "restore";
type Tone = "on" | "stop" | "off";

const SOURCE: readonly { id: NodeId; text: string }[] = [
  { id: "send", text: "Send transaction · packet 생성" },
  { id: "ackSrc", text: "Error ack 도착" },
  { id: "timeout", text: "또는 timeout" },
  { id: "refund", text: "① ICS-20 refund" },
  { id: "restore", text: "② representation 복원" },
];

const DEST: readonly { id: NodeId; text: string }[] = [
  { id: "recv", text: "① ICS-20 OnRecvPacket 먼저" },
  { id: "errAck", text: "Error ack → 그대로 반환" },
  { id: "okAck", text: "Success ack이면" },
  { id: "convert", text: "② ERC-20 keeper conversion" },
];

const SCENES: readonly { label: string; summary: string; note: string; tones: Partial<Record<NodeId, Tone>> }[] = [
  {
    label: "두 chain 사이를 packet이 오갑니다",
    summary: "send → relay → receive → ack",
    note: "Source chain의 send transaction이 packet을 만들고, relayer(두 chain 사이에서 packet과 증명을 옮기는 프로세스)가 proof와 함께 destination에 전달합니다. 결과를 적은 응답인 acknowledgement(ack)가 다시 source로 돌아오거나, 정해진 기한까지 받지 못하면 timeout이 됩니다. 각 단계를 따로 확인해야 합니다.",
    tones: { send: "on", relayOut: "on", recv: "on", relayBack: "on" },
  },
  {
    label: "수신 측은 ICS-20을 먼저 실행합니다",
    summary: "underlying OnRecvPacket",
    note: "v20 middleware는 ERC-20 처리보다 먼저 underlying ICS-20 OnRecvPacket을 실행하고, 그 acknowledgement를 보고 다음을 정합니다.",
    tones: { recv: "on" },
  },
  {
    label: "Error ack이면 여기서 멈춥니다",
    summary: "conversion 없음",
    note: "ICS-20이 error acknowledgement를 만들면 middleware는 그대로 반환합니다. ERC-20 keeper conversion은 실행하지 않습니다.",
    tones: { recv: "on", errAck: "stop", okAck: "off", convert: "off" },
  },
  {
    label: "Success ack일 때만 conversion",
    summary: "ICS-20 성공 → ERC-20 keeper",
    note: "Success acknowledgement일 때만 ERC-20 keeper conversion을 이어갑니다. Local block receipt와 remote chain의 credit는 같은 영수증이 아니므로 destination 쪽 결과는 따로 확인합니다.",
    tones: { recv: "on", errAck: "off", okAck: "on", convert: "on" },
  },
  {
    label: "발신 측 실패: refund 다음에 복원",
    summary: "error ack 또는 timeout → refund → 복원",
    note: "발신 측에 error acknowledgement가 오거나 timeout이 나면 ICS-20 refund가 먼저 끝나고, 그 뒤에 representation을 복원합니다. Symbol과 amount가 같아 보여도 bank balance, EVM contract storage, packet receipt 중 어느 것이 정본인지 구분해야 합니다.",
    tones: { ackSrc: "on", timeout: "on", relayBack: "on", refund: "on", restore: "on" },
  },
];

function toneClass(tone: Tone | undefined) {
  if (tone === "on") return "border-[#2563eb] bg-[#2563eb]/5 font-bold";
  if (tone === "stop") return "border-[#dc2626] bg-[#dc2626]/5 font-bold text-[#b91c1c] dark:text-[#f87171]";
  if (tone === "off") return "border-dashed border-border text-muted-foreground line-through";
  return "border-border text-muted-foreground";
}

function Column({ title, nodes, tones }: { title: string; nodes: readonly { id: NodeId; text: string }[]; tones: Partial<Record<NodeId, Tone>> }) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-[11px] font-black uppercase tracking-wide text-muted-foreground">{title}</p>
      <div className="space-y-1.5">
        {nodes.map((node) => (
          <div key={node.id} className={`break-keep rounded-md border px-2 py-1.5 text-[11px] leading-4 sm:text-xs sm:leading-5 ${toneClass(tones[node.id])}`}>
            {node.text}
          </div>
        ))}
      </div>
    </div>
  );
}

function Relay({ tones }: { tones: Partial<Record<NodeId, Tone>> }) {
  const out = tones.relayOut === "on";
  const back = tones.relayBack === "on";
  return (
    <div className="flex min-w-0 flex-col items-center justify-start gap-6 pt-7 text-center text-[10px] leading-4 sm:text-[11px]">
      <span className="text-muted-foreground">relayer</span>
      <span className={out ? "font-bold text-[#2563eb]" : "text-muted-foreground/60"}>
        packet
        <br />
        + proof →
      </span>
      <span className={back ? "font-bold text-[#2563eb]" : "text-muted-foreground/60"}>
        ← ack
        <br />
        또는 timeout
      </span>
    </div>
  );
}

export default function IbcCallbackBranchViz() {
  return (
    <EvmosSceneShell
      eyebrow="Evmos v20 · ERC-20 IBC middleware"
      title="ICS-20 결과가 먼저 나오고, ERC-20 처리는 그 결과를 따라갑니다"
      description="왼쪽은 보내는 chain, 오른쪽은 받는 chain입니다. 파란 칸은 그 장면에서 실행되는 단계, 빨간 칸은 멈추는 지점, 취소선은 실행하지 않는 단계입니다."
      ariaLabel="IBC packet의 수신 성공, 수신 실패, 발신 측 실패에서 ERC-20 middleware가 실행하는 순서"
      scenes={SCENES}
      render={(index) => {
        const tones = SCENES[index].tones;
        return (
          <div className="grid grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1fr)] gap-2 sm:grid-cols-[minmax(0,1fr)_5rem_minmax(0,1fr)] sm:gap-3">
            <Column title="Source chain" nodes={SOURCE} tones={tones} />
            <Relay tones={tones} />
            <Column title="Destination chain" nodes={DEST} tones={tones} />
          </div>
        );
      }}
    />
  );
}
