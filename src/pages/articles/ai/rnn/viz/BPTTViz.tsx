import VizFrame from "@/components/viz/VizFrame";

const times = ["t=1", "t=2", "t=3", "t=4"] as const;

export default function BPTTViz() {
  return (
    <VizFrame
      eyebrow="Reverse-mode over time"
      title="Forward dependency는 오른쪽으로, loss의 책임은 왼쪽으로 되돌아간다"
      description="같은 Wₕₕ가 네 transition에 사용되었으므로 backward는 각 사용 지점의 contribution을 더해 parameter 한 벌의 gradient를 만듭니다."
      note="이 그림은 실행 순서를 나타냅니다. Gradient가 시간을 실제로 거꾸로 흐르거나 별도의 물리적 cell이 생성된다는 뜻은 아닙니다."
    >
      <div className="grid min-w-0 gap-8">
        <div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">FORWARD · state dependency</p>
            <p className="text-xs text-muted-foreground">왼쪽 → 오른쪽</p>
          </div>
          <div className="mt-4 grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-4">
            {times.map((time, index) => (
              <div key={time} className="min-w-0 rounded-lg border border-border/70 bg-background p-4">
                <p className="text-xs text-muted-foreground">{time}</p>
                <p className="mt-2 font-mono text-sm font-semibold">h<sub>{index + 1}</sub></p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">x{index + 1} + h{index}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border/60 pt-7">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold text-rose-700 dark:text-rose-300">BACKWARD · credit assignment</p>
            <p className="text-xs text-muted-foreground">오른쪽 → 왼쪽</p>
          </div>
          <div className="mt-4 grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-4">
            {[...times].reverse().map((time, index) => (
              <div key={time} className="min-w-0 border-l border-rose-500/35 pl-4">
                <p className="text-xs text-muted-foreground">{time}에서</p>
                <p className="mt-2 break-words text-sm font-semibold">∂L/∂Wₕₕ contribution</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">누적 순서 {index + 1}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border/60 pt-5">
          <p className="text-xs font-bold text-muted-foreground">공유 parameter의 최종 gradient</p>
          <p className="mt-2 text-sm font-semibold">시점별 contribution의 합 → optimizer update 한 번</p>
        </div>
      </div>
    </VizFrame>
  );
}
