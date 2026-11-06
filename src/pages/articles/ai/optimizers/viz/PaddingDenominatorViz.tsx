import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #parts — 빈칸을 분모에 세면 같은 변화율 합 32의 평균과 이동량이 바뀐다.
 * 빈칸 0: 32/8=4 → −0.4 → 2.6. 빈칸 4(가정): 32/12≈2.667 → 약 −0.267 → 약 2.733. 빈칸 8(가정): 32/16=2 → −0.2 → 2.8.
 */
interface PaddingScene extends ShellScene {
  blanks: number;
  avg: string;
  move: number;
  moveText: string;
  next: string;
}

const SCENES: readonly PaddingScene[] = [
  { label: "실제 자료만 셉니다", summary: "32 ÷ 8 = 4", blanks: 0, avg: "4", move: 0.4, moveText: "0.4", next: "2.6", note: "분모 8은 파일 수가 아니라 같은 비중으로 점수를 매기기로 한 자료의 수입니다." },
  { label: "빈칸 4개까지 세면", summary: "32 ÷ 12 ≈ 2.667", blanks: 4, avg: "약 2.667", move: 0.8 / 3, moveText: "약 0.267", next: "약 2.733", note: "빈칸은 숫자를 담을 자리를 맞추려고 덧붙인 칸입니다. 오차를 만들지 않아 변화율 합 32는 그대로인데 분모만 커집니다." },
  { label: "빈칸 8개까지 세면", summary: "32 ÷ 16 = 2", blanks: 8, avg: "2", move: 0.2, moveText: "0.2", next: "2.8", note: "실제 자료는 같은데 빈칸을 얼마나 붙였는지에 따라 이동량이 바뀝니다. 빈칸 수 4와 8은 설명을 위해 고른 값입니다 (가정)." },
];

const SLOTS = Array.from({ length: 16 }, (_, index) => index);

export default function PaddingDenominatorViz() {
  return (
    <SceneShell
      eyebrow="분모의 정의"
      title="빈칸을 세면 분모만 커지고 이동량이 줄어듭니다"
      description="파란 칸이 실제 자료 8개, 점선 칸이 덧붙인 빈칸입니다. 변화율 합 32와 이동 크기 0.1, 현재 값 3은 그대로 둡니다 (가정)."
      ariaLabel="덧붙인 빈칸의 수에 따른 평균과 이동량 변화"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-8 gap-1">
              {SLOTS.map((slot) => {
                const real = slot < 8;
                const blank = !real && slot < 8 + scene.blanks;
                return (
                  <div
                    key={slot}
                    className={`flex h-7 items-center justify-center rounded-sm border text-[11px] ${real ? "border-transparent" : blank ? "border-dashed border-slate-500 text-muted-foreground" : "border-transparent"}`}
                    style={real ? { backgroundColor: "#2563eb" } : undefined}
                  >
                    {blank ? "빈" : ""}
                  </div>
                );
              })}
            </div>
            <p className="mt-3 font-mono text-sm font-bold">분모 {8 + scene.blanks} · 평균 {scene.avg}</p>
            <div className="mt-3 grid grid-cols-[3.5rem_minmax(0,1fr)_4.5rem] items-center gap-2 text-xs sm:text-sm">
              <span className="text-muted-foreground">이동량</span>
              <div className="h-4 rounded-sm bg-muted/40">
                <div className="h-full rounded-sm" style={{ width: `${(scene.move / 0.4) * 100}%`, backgroundColor: "#d97706" }} />
              </div>
              <span className="text-right font-mono font-bold">{scene.moveText}</span>
            </div>
            <p className="mt-2 text-sm">
              다음 값 <span className="font-mono font-bold">{scene.next}</span>
            </p>
          </div>
        );
      }}
    />
  );
}
