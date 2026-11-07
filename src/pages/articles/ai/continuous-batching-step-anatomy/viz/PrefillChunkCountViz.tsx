import SceneShell from "./SceneShell";

/**
 * 본문 대응: #boundary — 입력 3000토큰.
 * 상한 없음: 2008 + 992 (decode 40개와 한도 2048에서, 배정 합 2048→1032→41).
 * 상한 512: 512×5 + 440 = 3000, 여섯 번.
 */
const INPUT = 3000;

const NONE: readonly number[] = [2008, 992];
const CAPPED: readonly number[] = [512, 512, 512, 512, 512, 440];

const SCENES = [
  { label: "별도 상한 없음", summary: "두 번 · 한 번에 최대 2,008", chunks: NONE, note: "한도 2048에서 decode 40개가 40을 쓰면 첫 조각은 2008, 남은 입력은 992입니다. 배정 합은 2048→1032→41이고 새 요청은 없다고 둡니다(가정)." },
  { label: "조각 상한 512", summary: "여섯 번 · 한 번에 최대 512", chunks: CAPPED, note: "매번 잔액이 충분하면 512씩 다섯 번과 440으로 읽습니다(가정). 한 실행의 입력은 줄고 횟수는 늘며, 지연이 조각 크기에 항상 비례하지는 않습니다." },
];

export default function PrefillChunkCountViz() {
  return (
    <SceneShell
      eyebrow="입력을 나누는 횟수"
      title="같은 3000토큰도 조각 상한에 따라 읽는 횟수가 달라집니다"
      description="가로축은 입력 3000토큰의 위치이고 한 줄이 한 번의 실행입니다. 막대는 그 실행에서 읽는 입력 구간입니다."
      note="입력 조각만 그렸고 같은 실행의 decode 토큰은 넣지 않았습니다."
      ariaLabel="입력 3000토큰을 조각 상한에 따라 나눠 읽는 횟수 비교"
      scenes={SCENES}
      render={(active) => {
        const { chunks } = SCENES[active];
        return (
          <div className="min-w-0 space-y-1.5">
            {Array.from({ length: CAPPED.length }, (_, row) => {
              const size = chunks[row];
              const start = chunks.slice(0, row).reduce<number>((sum, value) => sum + value, 0);
              return (
                <div key={row} className="grid grid-cols-[3rem_minmax(0,1fr)_2.75rem] items-center gap-2 text-xs">
                  <span className={size === undefined ? "text-muted-foreground/50" : "font-bold"}>{row + 1}회</span>
                  <div className="relative h-5 min-w-0 rounded-sm bg-muted/40">
                    {size !== undefined && (
                      <div
                        className="absolute inset-y-0 rounded-sm border border-[#b45309] bg-[#f59e0b]"
                        style={{ left: `${(start / INPUT) * 100}%`, width: `${(size / INPUT) * 100}%` }}
                      />
                    )}
                  </div>
                  <span className="text-right font-mono text-muted-foreground">{size === undefined ? "−" : size.toLocaleString("en-US")}</span>
                </div>
              );
            })}
            <div className="grid grid-cols-[3rem_minmax(0,1fr)_2.75rem] gap-2 pt-1 font-mono text-[11px] text-muted-foreground">
              <span />
              <div className="flex justify-between"><span>0</span><span>3,000</span></div>
              <span />
            </div>
          </div>
        );
      }}
    />
  );
}
