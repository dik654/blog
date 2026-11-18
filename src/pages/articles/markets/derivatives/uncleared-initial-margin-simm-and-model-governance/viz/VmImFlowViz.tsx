import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — VM 2.5는 그날 시장가치에 따라 한쪽이 다른 쪽에 보내고 다음 날 방향이 바뀔 수 있다.
 * IM 8은 A와 B가 각각 내고, 제공자 재산을 보호할 수 있는 분리 보관 구조에 둔다. 8과 8을 상계하지 않는다.
 * 오늘 손실을 본 쪽을 A로 둔 것은 가정이다. 다음 날 되돌아가는 금액은 본문에 없어 적지 않는다.
 */
const SCENES = [
  { label: "오늘의 변동증거금", summary: "A → B 2.5", note: "오늘 A 쪽에 평가손실 2.5가 났다고 두면(가정) A가 B에게 변동증거금 2.5를 보냅니다. 그날의 시장가치 차이를 메우는 돈입니다." },
  { label: "다음 날 되돌아가면", summary: "방향이 바뀔 수 있음", note: "다음 날 시장가치가 되돌아가면 이번에는 B가 A에게 보낼 수 있습니다. 금액은 그날의 시장가치가 정하므로 여기에는 적지 않았습니다." },
  { label: "개시증거금은 양쪽이 각각", summary: "A 8 · B 8 → 각각 분리 보관", note: "개시증거금 8은 A와 B가 각각 냅니다. 받는 쪽 장부로 넘어가지 않고, 상대방이 부도나도 낸 쪽의 재산을 보호할 수 있는 분리 보관 구조에 둡니다." },
  { label: "8과 8을 상계하지 않습니다", summary: "8 − 8 = 0 이 아님", note: "A가 8을 냈다고 B가 낼 8과 맞바꿔 0으로 만들지 않습니다. 서로에게 낸 담보가 각자 따로 남아 있어야 상대방 부도 때 쓸 수 있습니다." },
] as const;

function Party({ name }: { name: string }) {
  return <div className="rounded-lg border border-border bg-background px-2 py-2 text-center text-sm font-bold">{name}</div>;
}

function Arrow({ text, dir, tone, on }: { text: string; dir: "right" | "left"; tone: string; on: boolean }) {
  return (
    <div className={`flex min-w-0 items-center gap-1 text-xs ${on ? "" : "opacity-25"}`}>
      {dir === "left" && <span style={{ color: tone }}>◀</span>}
      <div className="h-px flex-1" style={{ backgroundColor: tone }} />
      <span className="shrink-0 font-mono font-bold" style={{ color: tone }}>{text}</span>
      <div className="h-px flex-1" style={{ backgroundColor: tone }} />
      {dir === "right" && <span style={{ color: tone }}>▶</span>}
    </div>
  );
}

function Custody({ title, detail, on }: { title: string; detail: string; on: boolean }) {
  return (
    <div className={`min-w-0 rounded-lg border px-2 py-2 text-xs leading-5 ${on ? "border-amber-600" : "border-dashed border-border/50 opacity-40"}`}>
      <span className="block font-bold text-amber-800 dark:text-amber-300">{title}</span>
      <span className="block text-muted-foreground">{detail}</span>
    </div>
  );
}

export default function VmImFlowViz() {
  return (
    <SceneShell
      eyebrow="VM과 IM의 통로"
      title="변동증거금은 상대에게 건너가고, 개시증거금은 양쪽에서 따로 맡겨집니다"
      description="A와 B는 비청산 스왑의 두 당사자입니다. 위 줄은 변동증거금(VM, 그날 시장가치 차이를 메우는 돈), 아래 칸은 개시증거금(IM, 부도 뒤 더 생길 수 있는 손실에 대비한 담보)입니다. 2.5와 8은 1·3절의 교육용 숫자입니다."
      ariaLabel="변동증거금 2.5가 A에서 B로 가고 다음 날 방향이 바뀔 수 있으며, 개시증거금 8은 A와 B가 각각 분리 보관하고 상계하지 않는 그림"
      scenes={SCENES}
      render={(active) => {
        const imOn = active >= 2;
        return (
          <div className="min-w-0 space-y-4">
            <div className="grid grid-cols-[3.5rem_minmax(0,1fr)_3.5rem] items-center gap-2">
              <Party name="A" />
              <div className="relative min-w-0 space-y-2">
                <Arrow text="VM 2.5" dir="right" tone="#2563eb" on={active === 0} />
                <Arrow text="VM (금액 미정)" dir="left" tone="#2563eb" on={active === 1} />
              </div>
              <Party name="B" />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div className="min-w-0 space-y-1">
                <p className={`text-center font-mono text-xs font-bold ${imOn ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground/40"}`}>A가 낸 IM 8 ▼</p>
                <Custody title="분리 보관 ①" detail="B를 위한 담보 · B가 부도나도 A 재산 보호 가능" on={imOn} />
              </div>
              <div className="min-w-0 space-y-1">
                <p className={`text-center font-mono text-xs font-bold ${imOn ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground/40"}`}>B가 낸 IM 8 ▼</p>
                <Custody title="분리 보관 ②" detail="A를 위한 담보 · A가 부도나도 B 재산 보호 가능" on={imOn} />
              </div>
            </div>
            <div className={`rounded-lg border px-3 py-2 text-center text-xs leading-5 ${active === 3 ? "border-red-600" : "border-transparent opacity-0"}`} aria-hidden={active !== 3}>
              <span className="font-mono font-bold text-red-700 line-through decoration-1 dark:text-red-400">8 − 8 = 0</span>
              <span className="text-muted-foreground"> → 두 담보가 각각 8로 남습니다</span>
            </div>
          </div>
        );
      }}
    />
  );
}
