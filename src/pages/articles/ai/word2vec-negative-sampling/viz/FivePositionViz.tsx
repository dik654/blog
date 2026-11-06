import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-filter — 시작 상태 0의 다섯 위치. 비교값 R과 난수 U=하위비트/65536. R<U이면 버린다.
 * 0.56>0.000 남김, 0.11<0.901 버림, 0.56>0.349 남김, 0.11<0.801 버림, 0.56<0.886 버림.
 */
const ROWS = [
  { pos: 0, word: "red", r: 0.56, bits: 11 },
  { pos: 1, word: "saw", r: 0.11, bits: 59066 },
  { pos: 2, word: "cat", r: 0.56, bits: 22845 },
  { pos: 3, word: "saw", r: 0.11, bits: 52484 },
  { pos: 4, word: "dog", r: 0.56, bits: 58047 },
] as const;

const SCENES = [
  { label: "비교값 먼저", summary: "saw 0.11 · 나머지 0.56", note: "세로선이 단어별 비교값입니다. 선이 오른쪽에 있을수록 남기 쉽습니다. saw의 선은 0.11로 왼쪽에 있습니다.", upto: 0 },
  { label: "난수 놓기", summary: "점이 선을 넘으면 버림", note: "다섯 위치마다 난수 하나를 씁니다. 점이 세로선보다 오른쪽이면 버립니다. 두 saw는 이번 난수가 0.11을 넘어 버려졌습니다.", upto: 5 },
  { label: "dog도 버려짐", summary: "0.886 > 0.56", note: "dog는 흔한 saw가 아니어도 이번 난수가 0.56보다 커서 제거되었습니다. 남길 가능성이 더 크다는 것과 이번 출현이 반드시 남는다는 것은 다릅니다.", upto: 5 },
  { label: "남은 문장", summary: "red cat", note: "고정한 번호열에 원본 제거 블록을 적용한 범위의 결과입니다. 파일 읽기 전체를 다시 실행한 것은 아닙니다.", upto: 5 },
] as const;

export default function FivePositionViz() {
  return (
    <SceneShell
      eyebrow="다섯 위치의 판정"
      title="난수 점이 비교선을 넘은 위치만 지워집니다"
      description="각 줄의 폭이 0부터 1까지입니다. 세로선은 비교값 R, 점은 그 위치에서 나온 난수(하위 16비트/65536)입니다. 시작 상태 0으로 관찰한 값입니다."
      ariaLabel="다섯 단어 위치마다 비교값과 난수를 비교해 red와 cat만 남는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const shown = scene.upto > 0;
        return (
          <div className="min-w-0 space-y-2">
            {ROWS.map((row) => {
              const u = row.bits / 65536;
              const drop = row.r < u;
              const emphasize = active === 2 ? row.word === "dog" : true;
              return (
                <div key={row.pos} className={`grid grid-cols-[3.5rem_minmax(0,1fr)_2.75rem] items-center gap-2 text-xs ${emphasize ? "" : "opacity-40"}`}>
                  <span><span className="font-mono text-muted-foreground">{row.pos}</span> <b>{row.word}</b></span>
                  <span className="relative block h-7 rounded-sm bg-muted/50">
                    <span className="absolute inset-y-0 left-0 rounded-l-sm bg-[#2563eb]/15" style={{ width: `${row.r * 100}%` }} />
                    <span className="absolute inset-y-0 w-px bg-[#2563eb]" style={{ left: `${row.r * 100}%` }} />
                    {shown && <span className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ left: `${u * 100}%`, backgroundColor: drop ? "#dc2626" : "#16a34a" }} />}
                  </span>
                  <span className={`text-right font-semibold ${shown ? "" : "invisible"} ${drop ? "text-red-700 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"}`}>{drop ? "버림" : "남김"}</span>
                </div>
              );
            })}
            <div className="grid grid-cols-[3.5rem_minmax(0,1fr)_2.75rem] gap-2 font-mono text-[11px] text-muted-foreground">
              <span />
              <span className="flex justify-between"><span>0</span><span>0.5</span><span>1</span></span>
              <span />
            </div>
            <div className={`flex justify-center gap-2 pt-1 ${active === 3 ? "" : "invisible"}`}>
              {ROWS.filter((row) => row.r >= row.bits / 65536).map((row) => (
                <span key={row.pos} className="rounded border border-primary bg-primary/10 px-3 py-1 text-sm font-bold">{row.word}</span>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
