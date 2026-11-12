import SceneShell from "./SceneShell";

/**
 * 본문 대응: #security-reply "Telegram처럼 전송 뒤 응답이 사라지면…".
 * 왼쪽 = OpenClaw가 관찰한 것, 오른쪽 두 칸 = 실제로 가능한 두 경우의 Telegram 대화.
 */
type Bubble = "none" | "one" | "two";

const SCENES = [
  {
    label: "답장 전송",
    summary: "send 요청을 보냄",
    seen: "전송 요청 보냄 · 응답 대기",
    arrived: "none",
    lost: "none",
    note: "실행이 끝나 OpenClaw가 원래 Telegram 대화로 최종 답장을 보냅니다. 아직 전송 결과 응답은 오지 않았습니다.",
  },
  {
    label: "응답 유실",
    summary: "두 경우가 똑같이 보임",
    seen: "응답 없음 · 결과 모호",
    arrived: "one",
    lost: "none",
    note: "전송 뒤 응답이 사라지면 OpenClaw 쪽에서는 '응답 없음'만 보입니다. 실제 메시지는 도착했을 수도(가), 도착하지 않았을 수도(나) 있습니다.",
  },
  {
    label: "무조건 다시 보내면",
    summary: "(가)에서는 같은 답장이 두 번",
    seen: "replay 1회",
    arrived: "two",
    lost: "one",
    note: "결과를 모르는 채로 다시 보내면 (나)는 메워지지만 (가)에서는 같은 답장을 한 번 더 보내게 됩니다. 현재 retry 정책은 이런 모호한 전송을 무조건 replay하지 않습니다.",
  },
  {
    label: "먼저 확인",
    summary: "대화 · receipt 조회 후 제한 재시도",
    seen: "대화와 delivery receipt 조회",
    arrived: "one",
    lost: "none",
    note: "대화와 delivery receipt를 먼저 확인해 (가)인지 (나)인지 가립니다. 안전하게 반복할 수 있는 동작만 제한적으로 재시도합니다.",
  },
] as const satisfies readonly { label: string; summary: string; seen: string; arrived: Bubble; lost: Bubble; note: string }[];

const COUNT: Record<Bubble, number> = { none: 0, one: 1, two: 2 };
const SLOTS = [0, 1] as const;

function Chat({ title, bubbles, hint }: { title: string; bubbles: Bubble; hint: string }) {
  const count = COUNT[bubbles];
  return (
    <div className="min-w-0 rounded-lg border border-border bg-background p-3">
      <p className="text-[11px] font-bold">{title}</p>
      <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">{hint}</p>
      <div className="mt-2 space-y-1.5">
        {SLOTS.map((slot) => (
          <div
            key={slot}
            className={`ml-auto w-[85%] rounded-md border px-2 py-1 text-[10px] leading-4 ${
              slot < count ? (slot === 1 ? "border-[#dc2626] text-[#b91c1c] dark:text-[#f87171]" : "border-[#2563eb] text-[#1d4ed8] dark:text-[#60a5fa]") : "border-dashed border-border/50 text-muted-foreground/50"
            }`}
          >
            {slot < count ? (slot === 1 ? "같은 답장 (중복)" : "보고서 초안 답장") : "빈 자리"}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AmbiguousSendViz() {
  return (
    <SceneShell
      eyebrow="모호한 전송"
      title="응답이 사라지면 도착했는지 알 수 없으므로 먼저 확인합니다"
      description="왼쪽은 OpenClaw가 관찰한 것, 오른쪽 두 칸은 실제로 가능한 두 경우의 Telegram 대화입니다. 말풍선 한 칸이 답장 한 번입니다."
      ariaLabel="Telegram 전송 응답이 유실됐을 때 replay와 확인 후 재시도 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const split = active > 0;
        return (
          <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,.9fr)_minmax(0,2fr)]">
            <div className="min-w-0 rounded-lg border border-[#2563eb] p-3">
              <p className="text-[11px] font-bold text-muted-foreground">OpenClaw가 본 것</p>
              <p className="mt-1 break-keep text-sm font-semibold">{scene.seen}</p>
            </div>
            <div className="grid min-w-0 grid-cols-2 gap-2">
              <Chat title="(가) 도착함" hint={!split ? "아직 모름" : active === 3 ? "확인됨 · 다시 보내지 않음" : "응답만 사라짐"} bubbles={scene.arrived} />
              <Chat title="(나) 도착 안 함" hint={!split ? "아직 모름" : active === 3 ? "확인됨 · 안전한 동작만 재시도" : "메시지도 사라짐"} bubbles={scene.lost} />
            </div>
          </div>
        );
      }}
    />
  );
}
