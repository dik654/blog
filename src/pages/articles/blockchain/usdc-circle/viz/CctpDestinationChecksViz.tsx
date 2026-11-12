import SceneShell from "./SceneShell";

/**
 * 본문 대응: #cctp-burn-mint — Base의 MessageTransmitterV2 확인 다섯 가지 → nonce 사용 처리·handler 호출
 * → handler의 body version·expiration·fee 검사 → recipient + fee recipient 합계 25 mint.
 * 같은 nonce를 다시 내면 두 번째 mint는 막힌다. 설명용 fee 0(본문 가정).
 */
type Status = "wait" | "pass" | "done" | "blocked" | "skip" | "none";

const STATUS_TEXT: Record<Status, string> = {
  wait: "대기",
  pass: "통과",
  done: "실행",
  blocked: "이미 사용 · 거절",
  skip: "실행 안 됨",
  none: "—",
};

const STATUS_CLASS: Record<Status, string> = {
  wait: "border-dashed border-border text-muted-foreground",
  pass: "border-primary/60 text-primary",
  done: "border-primary bg-primary/10 font-bold text-primary",
  blocked: "border-red-600 bg-red-600/10 font-bold text-red-700 dark:text-red-400",
  skip: "border-dashed border-border text-muted-foreground",
  none: "border-border/50 text-muted-foreground/70",
};

const ROWS = [
  { group: "transmitter", text: "Attester signature" },
  { group: "transmitter", text: "Destination domain" },
  { group: "transmitter", text: "제한된 caller" },
  { group: "transmitter", text: "Message version" },
  { group: "transmitter", text: "아직 쓰이지 않은 nonce" },
  { group: "transmitter", text: "Nonce 사용 처리 → handler 호출", action: true },
  { group: "handler", text: "Body version·expiration·fee" },
  { group: "handler", text: "Recipient + fee recipient에 합계 25 mint", action: true },
] as const;

const SCENES = [
  {
    label: "message 도착",
    summary: "Ethereum 75 · Base 0",
    base: 0,
    status: ["wait", "wait", "wait", "wait", "wait", "wait", "wait", "wait"],
    note: "Ethereum의 source TokenMessengerV2가 25를 burn하며 낸 message에는 destination domain, mint recipient, amount 25, max fee, 최소 finality가 들어 있습니다. Iris가 source confirmation을 기다린 뒤 서명한 attestation과 함께 이 message가 Base에 도착합니다.",
  },
  {
    label: "다섯 가지 확인",
    summary: "signature·domain·caller·version·nonce",
    base: 0,
    status: ["pass", "pass", "pass", "pass", "pass", "wait", "wait", "wait"],
    note: "Base의 MessageTransmitterV2는 attester signature, destination domain, 제한된 caller, message version과 아직 쓰이지 않은 nonce를 확인합니다. 이 확인을 통과해야 다음 단계로 갑니다.",
  },
  {
    label: "nonce 사용 처리",
    summary: "handler 호출 · Base 아직 0",
    base: 0,
    status: ["pass", "pass", "pass", "pass", "pass", "done", "wait", "wait"],
    note: "통과하면 이 nonce를 사용 처리하고 TokenMessenger handler를 부릅니다. 이 시점에는 Base에 아직 token이 생기지 않았습니다.",
  },
  {
    label: "handler 검사·mint",
    summary: "Base supply 0 → 25",
    base: 25,
    status: ["pass", "pass", "pass", "pass", "pass", "done", "pass", "done"],
    note: "Handler가 message body의 version·expiration·fee를 검사하고, 통과하면 recipient와 fee recipient에 합계 25를 mint합니다. 설명용 fee를 0(가정)으로 두었으므로 recipient가 25를 받습니다.",
  },
  {
    label: "같은 message 다시",
    summary: "Base는 50이 아니라 25",
    base: 25,
    status: ["none", "none", "none", "none", "blocked", "skip", "skip", "skip"],
    note: "같은 nonce를 다시 내면 그 nonce는 이미 사용 처리돼 있어 두 번째 mint가 막힙니다. Base supply는 25에 머물고, 두 chain의 native supply 합은 75 + 25 = 100입니다.",
  },
] as const satisfies readonly { label: string; summary: string; base: number; status: readonly Status[]; note: string }[];

const GROUP_LABEL = {
  transmitter: "Base · MessageTransmitterV2",
  handler: "Base · TokenMessenger handler",
} as const;

export default function CctpDestinationChecksViz() {
  return (
    <SceneShell
      eyebrow="CCTP destination"
      title="Base가 25 USDC message를 받아 mint하기까지의 확인"
      description="한 줄이 하나의 확인이나 실행입니다. Ethereum에서 25를 burn한 본문의 사례를 따라가며, fee는 본문 가정대로 0입니다."
      note="다섯 가지 확인은 본문이 나열한 항목이며, 줄 순서가 contract 안의 실제 검사 순서를 뜻하지는 않습니다."
      ariaLabel="CCTP destination에서 message 확인, nonce 사용 처리, handler 검사, mint와 재제출 거절"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const statuses = scene.status as readonly Status[];
        return (
          <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] sm:gap-6">
            {(["transmitter", "handler"] as const).map((group) => (
              <section key={group} className="min-w-0">
                <p className="text-[10px] font-black text-primary">{GROUP_LABEL[group]}</p>
                <div className="mt-1.5 space-y-1">
                  {ROWS.map((row, index) =>
                    row.group !== group ? null : (
                      <div key={row.text} className="grid grid-cols-[minmax(0,1fr)_6.25rem] items-center gap-2">
                        <span
                          className={`min-w-0 break-keep text-xs leading-5 ${
                            "action" in row ? "border-l-2 border-primary/50 pl-2 font-semibold" : "pl-2.5"
                          }`}
                        >
                          {row.text}
                        </span>
                        <span className={`whitespace-nowrap rounded-md border px-1.5 py-0.5 text-center text-[10px] leading-4 ${STATUS_CLASS[statuses[index]]}`}>
                          {STATUS_TEXT[statuses[index]]}
                        </span>
                      </div>
                    ),
                  )}
                </div>
                {group === "handler" && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-md border border-border bg-background px-2.5 py-1.5">
                      <p className="text-[10px] text-muted-foreground">Ethereum supply</p>
                      <p className="font-mono text-sm font-bold tabular-nums">75</p>
                    </div>
                    <div className="rounded-md border border-primary/60 bg-background px-2.5 py-1.5">
                      <p className="text-[10px] text-muted-foreground">Base supply</p>
                      <p className="font-mono text-sm font-bold tabular-nums text-primary">{scene.base}</p>
                    </div>
                  </div>
                )}
              </section>
            ))}
          </div>
        );
      }}
    />
  );
}
