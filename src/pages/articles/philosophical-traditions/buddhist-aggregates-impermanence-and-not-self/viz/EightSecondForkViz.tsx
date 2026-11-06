import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 8초의 두 갈래. 곧바로 반격하면 다음 감각·느낌이 다시 커질 수 있고,
 * 한 호흡 관찰하면 반격하지 않거나 다른 말을 고를 수 있다. 초 단위는 글의 설명용 가정이다.
 */
const TRACK = ["몸", "느낌", "지각", "형성", "의식"] as const;

const SCENES = [
  { label: "8초까지", summary: "몸 → 느낌 → 지각 → 형성", note: "2초씩 나눈 구간은 설명을 위한 가정입니다. 실제 경험은 겹칩니다. 8초에 반격하려는 충동이 있고 아직 어느 쪽으로도 가지 않았습니다.", mode: "start" },
  { label: "곧바로 반격", summary: "감각·느낌이 다시 커질 수 있음", note: "8초에 곧바로 반격하면 다음 감각과 느낌이 다시 커질 수 있습니다. 그래서 이 갈래에는 앞쪽 과정으로 돌아갈 수 있다는 표시를 달았습니다.", mode: "react" },
  { label: "한 호흡 관찰", summary: "반격하지 않거나 다른 말을 고름", note: "한 호흡 동안 변화를 관찰하면 반격하지 않거나 다른 말을 고를 수 있습니다. 그렇게 될 수 있다는 것이며 반드시 그렇게 된다는 뜻은 아닙니다.", mode: "observe" },
  { label: "확인한 것", summary: "조건이 달라지면 다음도 달라짐", note: "두 갈래가 보여 주는 것은 조건에 따른 차이입니다. 관찰하는 영원한 자아가 따로 있다는 결론은 여기서 끌어내지 않습니다.", mode: "result" },
] as const;

function Path({ on, title, result, loop }: { on: boolean; title: string; result: string; loop?: string }) {
  return (
    <div className={`min-w-0 rounded-lg border px-2 py-2 text-center text-xs leading-5 sm:text-sm ${on ? "border-primary" : "border-border/50 text-muted-foreground/60"}`}>
      <span className="block font-bold">{on ? "▶ " : ""}{title}</span>
      <span className="mt-1 block" aria-hidden>↓</span>
      <span className="block font-semibold">{result}</span>
      <span className={`mt-1 block text-[11px] leading-4 sm:text-xs ${loop ? "" : "invisible"}`}>{loop ?? "빈칸"}</span>
    </div>
  );
}

export default function EightSecondForkViz() {
  return (
    <SceneShell
      eyebrow="8초의 갈림길"
      title="같은 충동에서 다음 과정이 두 갈래로 나뉩니다"
      description="위 띠는 10초를 2초씩 나눈 가정이고 표시한 칸이 8초 직전까지입니다. 아래는 그 다음에 달라질 수 있는 두 갈래입니다."
      ariaLabel="8초에 곧바로 반격하는 갈래와 한 호흡 관찰하는 갈래의 비교"
      scenes={SCENES}
      render={(active) => {
        const { mode } = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-5 gap-1 text-center text-[11px] leading-4 sm:text-xs">
              {TRACK.map((name, index) => (
                <div key={name} className={`rounded-sm border px-1 py-1 ${index < 4 ? "border-primary font-bold" : "border-dashed border-border text-muted-foreground"}`}>
                  <span className="block">{name}</span>
                  <span className="block font-mono">{index * 2}~{index * 2 + 2}초</span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-center text-xs font-semibold leading-5 sm:text-sm">8초 · 반격하려는 충동</p>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <Path on={mode === "react"} title="곧바로 반격" result="다음 감각·느낌이 다시 커질 수 있음" loop="↺ 앞쪽 몸·느낌으로 돌아갈 수 있음" />
              <Path on={mode === "observe"} title="한 호흡 관찰" result="반격하지 않거나 다른 말을 고를 수 있음" />
            </div>
            <div className={`mt-3 rounded-lg border px-3 py-2 text-center text-sm leading-6 ${mode === "result" ? "border-primary font-bold" : "border-border/50 text-muted-foreground/60"}`}>
              조건이 달라지면 다음 과정도 달라진다
            </div>
          </div>
        );
      }}
    />
  );
}
