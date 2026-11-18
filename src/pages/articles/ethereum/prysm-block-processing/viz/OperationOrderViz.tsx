import SceneShell from "./SceneShell";

/**
 * 본문 대응: #operations — 같은 block에 validator 7의 slashing과 voluntary exit가 함께 있을 때.
 * 위 띠 = Electra operation family 순서(표의 행 순서), 아래 칸 = 같은 working state의 validator 7.
 * 글은 exit handler가 바뀐 state를 "읽는다"까지만 말하므로 exit 처리 결과 값은 적지 않습니다.
 */
const ACCENT = "#2563eb";
const DONE = "#475569";
const IDLE = "#94a3b8";
const TEXT_COLOR = "#64748b";

const FAMILIES: readonly { full: string; short: string }[] = [
  { full: "Slashings", short: "Slash" },
  { full: "Attestations", short: "Attest" },
  { full: "Deposits · Exits", short: "Dep·Exit" },
  { full: "BLS change", short: "BLS" },
  { full: "Exec. requests", short: "Req." },
];

const SCENES = [
  { label: "같은 validator", summary: "slashing + exit", cursor: -1, note: "Block에 validator 7의 slashing과 voluntary exit가 함께 있다고 가정합니다. 둘은 같은 working state를 차례로 바꿉니다." },
  { label: "Slashing handler 먼저", summary: "1번 handler", cursor: 0, note: "Slashing handler가 먼저 실행되어 validator 7의 slashed 상태와 exit 정보를 working state에 씁니다." },
  { label: "Exit가 읽는 state", summary: "3번 handler", cursor: 2, note: "Exit handler는 pre-state가 아니라 slashing이 바꾼 state를 읽습니다. 순서를 바꾸면 post-state root가 달라질 수 있습니다." },
  { label: "서명만 묶기", summary: "순서 유지", cursor: 4, note: "서명 계산은 batch로 묶을 수 있어도 mutation은 위 순서대로 적용합니다. Requests 안에서도 deposit → withdrawal → consolidation 순서입니다." },
] as const;

export default function OperationOrderViz() {
  return (
    <SceneShell
      eyebrow="Operation 순서"
      title="뒤 handler는 앞 handler가 바꾼 State를 읽습니다"
      description="위 띠는 Fulu가 재사용하는 Electra operation family의 적용 순서이고, 아래 칸은 같은 working state 안의 validator 7입니다. Validator 7과 두 operation은 설명용 가정입니다(가정)."
      note="Exit handler가 slashing된 validator를 어떻게 처리하는지의 결과 값은 이 글에서 다루지 않아 적지 않았습니다."
      ariaLabel="slashing handler가 먼저 validator 7을 바꾸고 exit handler가 그 state를 읽는 네 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const slashed = active >= 1;
        return (
          <div className="min-w-0 space-y-3">
            <ol className="grid grid-cols-5 gap-1" aria-label="operation family 적용 순서">
              {FAMILIES.map((family, index) => {
                const color = index === scene.cursor ? ACCENT : index < scene.cursor ? DONE : IDLE;
                return (
                  <li key={family.full} className="min-w-0 rounded-md border px-0.5 py-1.5 text-center" style={{ borderColor: color }} aria-label={family.full}>
                    <span className="block font-mono text-[9px] font-bold" style={{ color }}>{index + 1}</span>
                    <span className="block break-keep text-[10px] leading-3 sm:hidden" style={{ color }}>{family.short}</span>
                    <span className="hidden break-keep text-xs leading-4 sm:block" style={{ color }}>{family.full}</span>
                  </li>
                );
              })}
            </ol>

            <div className="grid grid-cols-2 gap-2">
              <div className="min-w-0 rounded-md border p-2 sm:p-3" style={{ borderColor: active === 1 ? ACCENT : IDLE }}>
                <span className="block font-mono text-[9px] font-bold leading-4 sm:text-[10px]" style={{ color: TEXT_COLOR }}>STATE · validator 7</span>
                <p className="mt-1 break-keep text-[11px] leading-4 sm:text-xs sm:leading-5">slashed 상태 · <strong style={{ color: slashed ? ACCENT : undefined }}>{slashed ? "바뀜" : "적용 전"}</strong></p>
                <p className="break-keep text-[11px] leading-4 sm:text-xs sm:leading-5">exit 정보 · <strong style={{ color: slashed ? ACCENT : undefined }}>{slashed ? "바뀜" : "적용 전"}</strong></p>
              </div>
              <div className="min-w-0 rounded-md border p-2 sm:p-3" style={{ borderColor: active === 2 ? ACCENT : IDLE }}>
                <span className="block font-mono text-[9px] font-bold leading-4 sm:text-[10px]" style={{ color: TEXT_COLOR }}>EXIT HANDLER 입력</span>
                <p className="mt-1 break-keep text-[11px] leading-4 sm:text-xs sm:leading-5">{active >= 2 ? "← 바뀐 validator 7을 읽음" : "아직 실행 전"}</p>
                <p className="break-keep text-[11px] leading-4 text-muted-foreground sm:text-xs sm:leading-5">{active >= 2 ? "순서가 바뀌면 입력이 달라짐" : "slashing 뒤에 실행"}</p>
              </div>
            </div>

            <div className="rounded-md border border-dashed px-2 py-1.5 text-[11px] leading-4 sm:p-3 sm:text-xs sm:leading-5" style={{ borderColor: active === 3 ? ACCENT : IDLE }}>
              <span className="font-mono text-[9px] font-bold sm:text-[10px]" style={{ color: active === 3 ? ACCENT : TEXT_COLOR }}>SIGNATURE BATCH</span>
              <span className="ml-2 text-muted-foreground">{active === 3 ? "서명만 따로 · 적용 순서 그대로" : "서명은 따로 묶을 수 있음"}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
