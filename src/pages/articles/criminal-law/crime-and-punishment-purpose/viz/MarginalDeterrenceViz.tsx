import SceneShell from "./SceneShell";

/**
 * 본문 대응: #marginal-deterrence — 물건을 든 H가 경비원을 만난 순간의 두 갈래.
 * 두 갈래의 제재가 같으면 더 무거운 행위로 넘어가도 추가 제재가 없고, 차이를 남기면 그 차이가 한계 억제의 이유가 된다.
 * 본문은 제재의 크기를 정하지 않으므로 막대·숫자 없이 "같음 / 차이"만 표시한다.
 */
const SCENES = [
  {
    label: "경비원을 만난 순간",
    summary: "갈림길 두 개",
    mode: 0,
    note: "H는 이미 재산 침해를 한 상태입니다. 여기서 물건을 든 채 떠나는 길과, 경비원에게 위해를 가하는 길이 갈립니다. 억제는 이 갈림길에서도 작동해야 합니다.",
  },
  {
    label: "두 갈래의 제재가 같다면",
    summary: "추가 제재 = 0",
    mode: 1,
    note: "재산 침해와 경비원에게 위해를 가하는 행위의 제재가 똑같으면, 위해 쪽으로 넘어가도 더 받는 제재가 없습니다. 형벌 체계가 H에게 더 큰 위해를 피할 추가 이유를 주지 못합니다.",
  },
  {
    label: "제재의 차이를 남기면",
    summary: "차이 = 한계 억제",
    mode: 2,
    note: "더 무거운 행위에 더 큰 제재가 남아 있으면 그 차이가 '여기서 멈출' 이유가 됩니다. 이를 한계 억제라고 부릅니다. 차이의 크기는 이 가상 예가 정하지 않으며, 행위의 중대성·책임·증거와 각 법제의 비례 원칙이 함께 정합니다.",
  },
] as const;

function Branch({ title, act, sanction, tone }: { title: string; act: string; sanction: string; tone: string }) {
  return (
    <div className={`min-w-0 rounded-lg border bg-background p-3`} style={{ borderColor: tone }}>
      <p className="text-sm font-bold" style={{ color: tone }}>{title}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{act}</p>
      <p className="mt-2 rounded-md border border-dashed border-border px-2 py-1 text-center font-mono text-xs font-bold">{sanction}</p>
    </div>
  );
}

export default function MarginalDeterrenceViz() {
  return (
    <SceneShell
      eyebrow="한계 억제"
      title="이미 한 행위 다음의 갈림길에서 제재의 차이가 멈출 이유가 됩니다"
      description="물건을 든 H가 경비원을 만난 가상 장면입니다. 칸 안의 '제재'는 크기를 정하지 않은 자리표시이며, 두 갈래 사이에 차이가 있는지만 봅니다."
      ariaLabel="재산 침해에서 멈추는 길과 경비원 위해로 넘어가는 길의 제재 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = (SCENES as readonly (typeof SCENES)[number][])[active];
        const harmSanction = scene.mode === 0 ? "제재 ?" : scene.mode === 1 ? "제재 A (같음)" : "제재 A + 차이";
        return (
          <div className="mx-auto min-w-0 max-w-lg">
            <div className="mx-auto max-w-sm rounded-lg border border-[#d97706] bg-background p-3 text-center">
              <p className="text-sm font-bold text-[#b45309] dark:text-[#f59e0b]">물건을 든 H가 경비원을 만남</p>
              <p className="mt-1 text-xs text-muted-foreground">재산 침해는 이미 일어남</p>
            </div>
            <svg viewBox="0 0 320 36" className="block h-9 w-full" preserveAspectRatio="none" aria-hidden="true">
              <line x1="160" y1="0" x2="160" y2="12" stroke="#64748b" strokeWidth="1" />
              <line x1="80" y1="12" x2="240" y2="12" stroke="#64748b" strokeWidth="1" />
              <line x1="80" y1="12" x2="80" y2="32" stroke="#64748b" strokeWidth="1" />
              <line x1="240" y1="12" x2="240" y2="32" stroke="#64748b" strokeWidth="1" />
              <path d="M76 28 L80 34 L84 28" fill="none" stroke="#64748b" strokeWidth="1" />
              <path d="M236 28 L240 34 L244 28" fill="none" stroke="#64748b" strokeWidth="1" />
            </svg>
            <div className="grid grid-cols-2 gap-3">
              <Branch title="여기서 멈춤" act="물건을 든 채 떠남" sanction={scene.mode === 0 ? "제재 ?" : "제재 A"} tone="#2563eb" />
              <Branch title="더 나아감" act="경비원에게 위해를 가함" sanction={harmSanction} tone="#dc2626" />
            </div>
            <div className="mt-3 min-h-[3.5rem] rounded-lg border border-border bg-background px-3 py-2 text-center text-sm">
              {scene.mode === 0 && <span className="text-muted-foreground">두 갈래의 제재를 비교해 봅니다</span>}
              {scene.mode === 1 && (
                <span>
                  더 나아가도 추가 제재 <b className="font-mono">0</b>
                  <span className="block text-xs text-muted-foreground">더 큰 위해를 피할 추가 이유가 없음</span>
                </span>
              )}
              {scene.mode === 2 && (
                <span>
                  더 나아가면 <b>차이</b>만큼 더 받음
                  <span className="block text-xs text-muted-foreground">차이의 크기는 중대성·책임·증거·비례 원칙이 정함</span>
                </span>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
