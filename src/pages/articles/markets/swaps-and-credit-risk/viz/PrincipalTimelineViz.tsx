import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 같은 통화 금리 스왑과 통화스왑에서 원금이 움직이는 시점.
 * 표가 아니라 시간 순서가 내용이다. 외화 금액은 글에 없으므로 숫자 없이 "약정 외화"로 적는다.
 */
const PHASES = ["시작", "기간 중", "만기"] as const;

const RATE = [
  { text: "보통 원금을 주고받지 않음", moves: false },
  { text: "기준 금액으로 계산한 이자 차액", moves: false },
  { text: "보통 원금을 주고받지 않음", moves: false },
] as const;

const FX = [
  { text: "10억 원 ⇄ 약정 외화", moves: true },
  { text: "서로 다른 통화의 이자", moves: false },
  { text: "약정 외화 ⇄ 10억 원 (되돌림)", moves: true },
] as const;

const SCENES = [
  { label: "같은 통화 금리 스왑", summary: "원금은 계산 기준으로만", lane: 0, phase: -1, note: "같은 통화 금리 스왑에서는 보통 명목원금 자체를 주고받지 않습니다. 기간 중의 이자 차액만 오갑니다." },
  { label: "통화스왑의 시작", summary: "원금을 맞바꿉니다", lane: 1, phase: 0, note: "통화스왑에서는 10억 원과 약정 외화를 시작에 교환하는 구조가 있을 수 있습니다." },
  { label: "통화스왑의 기간 중", summary: "이자도 서로 다른 통화로", lane: 1, phase: 1, note: "통화스왑은 서로 다른 통화의 원금과 이자를 바꾸는 계약입니다. 금액은 약정에 따르므로 숫자를 적지 않았습니다." },
  { label: "통화스왑의 만기", summary: "원금을 되돌립니다", lane: 1, phase: 2, note: "그 구조라면 만기에 원금을 되돌립니다. 금리 스왑에서 원금이 움직이지 않는다는 설명을 통화스왑에 그대로 옮길 수 없습니다." },
] as const;

function Lane({ title, items, lit, phase }: { title: string; items: readonly { text: string; moves: boolean }[]; lit: boolean; phase: number }) {
  return (
    <div className={`transition-opacity duration-300 motion-reduce:transition-none ${lit ? "" : "opacity-40"}`}>
      <p className="mb-1 text-xs font-bold">{title}</p>
      <div className="grid grid-cols-3 gap-1">
        {items.map((item, i) => {
          const focus = lit && (phase === -1 || phase === i);
          return (
            <div
              key={PHASES[i]}
              className={`flex min-h-[3.75rem] items-center justify-center rounded-sm border px-1.5 py-2 text-center text-[11px] leading-4 sm:text-xs ${
                item.moves ? "border-[#2563eb] bg-[#2563eb]/10 font-bold" : "border-border bg-background text-muted-foreground"
              } ${focus ? "outline outline-1 outline-[#d97706]" : ""}`}
            >
              {item.text}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PrincipalTimelineViz() {
  return (
    <SceneShell
      eyebrow="원금은 언제 움직이나"
      title="금리 스왑은 원금을 보통 두고, 통화스왑은 시작과 만기에 바꿀 수 있습니다"
      description="(가정) 10억 원 사례입니다. 왼쪽에서 오른쪽으로 시간이 흐르고, 파란 칸이 원금이 오가는 시점, 주황 테두리가 지금 보는 칸입니다."
      ariaLabel="금리 스왑과 통화스왑에서 시작, 기간 중, 만기에 오가는 것 비교"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-3 gap-1 text-center text-xs font-semibold text-muted-foreground">
              {PHASES.map((phase) => (
                <span key={phase}>{phase}</span>
              ))}
            </div>
            <Lane title="같은 통화 금리 스왑" items={RATE} lit={s.lane === 0} phase={s.phase} />
            <Lane title="통화스왑 (원금을 맞바꾸는 구조일 때)" items={FX} lit={s.lane === 1} phase={s.phase} />
          </div>
        );
      }}
    />
  );
}
