import SceneShell from "./SceneShell";

/**
 * 본문 대응: measure 절의 지수 증가+이분 탐색. 판정 순서는 AlgorithmBlock note의 가정 예 그대로:
 * 1,2,4,8,16 통과, 32 실패 → lo 16, hi 32 → 24 실패 → 20 실패 → 18 통과 → 19 통과 → lo 19, hi 20.
 * 측정 횟수: 5, 6, 7, 8, 9, 10회.
 */
type Result = { c: number; pass: boolean };

const SEQUENCE: readonly Result[] = [
  { c: 1, pass: true },
  { c: 2, pass: true },
  { c: 4, pass: true },
  { c: 8, pass: true },
  { c: 16, pass: true },
  { c: 32, pass: false },
  { c: 24, pass: false },
  { c: 20, pass: false },
  { c: 18, pass: true },
  { c: 19, pass: true },
];

const STATES = [
  { upto: 5, lo: 16, hi: null },
  { upto: 6, lo: 16, hi: 32 },
  { upto: 7, lo: 16, hi: 24 },
  { upto: 8, lo: 16, hi: 20 },
  { upto: 9, lo: 18, hi: 20 },
  { upto: 10, lo: 19, hi: 20 },
] as const;

const SCENES = [
  { label: "두 배씩 늘리기", summary: "1 → 2 → 4 → 8 → 16 통과", note: "동시 수가 몇 배 범위인지 모르므로 두 배씩 늘려 가며 약속을 지키는지 잽니다. 여기까지 다섯 번 쟀습니다." },
  { label: "처음 실패", summary: "32 실패 → 답은 16과 32 사이", note: "처음 실패한 32와 마지막 통과 16이 범위의 양 끝이 됩니다. 이제 두 배씩 늘리기를 멈추고 가운데를 잽니다." },
  { label: "가운데 24", summary: "24 실패 → 16과 24 사이", note: "16과 32의 가운데 24가 실패했으니 위쪽 절반은 후보에서 뺍니다." },
  { label: "가운데 20", summary: "20 실패 → 16과 20 사이", note: "16과 24의 가운데 20도 실패했습니다. 범위가 또 절반으로 줄어듭니다." },
  { label: "가운데 18", summary: "18 통과 → 18과 20 사이", note: "이번에는 통과했으니 아래쪽 끝이 18로 올라갑니다." },
  { label: "끝", summary: "19 통과 → 답 19, 측정 10번", note: "19는 통과, 20은 실패로 두 끝이 맞닿아 멈춥니다. 20까지 하나씩 늘렸다면 20번을 쟀을 텐데 10번으로 같은 답에 닿았습니다(계산)." },
] as const;

const CELLS = Array.from({ length: 32 }, (_, i) => i + 1);

export default function RampBisectViz() {
  return (
    <SceneShell
      eyebrow="최대 동시 수 찾기"
      title="두 배씩 늘려 범위를 잡고 가운데를 재서 좁힙니다"
      description="칸 하나가 동시 에이전트 수 하나입니다. 숫자가 적힌 칸만 실제로 쟀고, 테두리가 진한 빈 칸은 아직 답이 있을 수 있는 범위입니다."
      note="판정 순서는 설명을 위한 예입니다(가정). 실제 통과 지점은 서버와 약속에 따라 달라집니다."
      ariaLabel="동시 수 1부터 32까지에서 지수 증가와 이분 탐색으로 최대 통과 지점을 찾는 과정"
      scenes={SCENES}
      render={(active) => {
        const state = STATES[active];
        const measured = new Map(SEQUENCE.slice(0, state.upto).map((item) => [item.c, item.pass]));
        const latest = SEQUENCE[state.upto - 1].c;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-8 gap-1 sm:grid-cols-16" aria-hidden="true">
              {CELLS.map((c) => {
                const result = measured.get(c);
                const inRange = c >= state.lo && (state.hi === null ? true : c <= state.hi);
                const base = "flex h-8 items-center justify-center rounded-sm border font-mono text-[11px] font-bold tabular-nums";
                const look =
                  result === true
                    ? "border-primary bg-primary/30 text-foreground"
                    : result === false
                      ? "border-dashed border-[#b45309] bg-[#b45309]/15 text-[#b45309]"
                      : inRange
                        ? "border-foreground/50 bg-background"
                        : "border-border/40 bg-transparent";
                return (
                  <span key={c} className={`${base} ${look} ${c === latest ? "outline outline-1 outline-offset-1 outline-foreground" : ""}`}>
                    {result === undefined ? "" : c}
                  </span>
                );
              })}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <div className="border-l border-primary pl-2"><p className="text-muted-foreground">마지막 통과</p><p className="font-mono text-sm font-bold">{state.lo}</p></div>
              <div className="border-l border-[#b45309] pl-2"><p className="text-muted-foreground">가장 낮은 실패</p><p className="font-mono text-sm font-bold">{state.hi ?? "아직 없음"}</p></div>
              <div className="border-l border-border pl-2"><p className="text-muted-foreground">측정 횟수</p><p className="font-mono text-sm font-bold">{state.upto}번</p></div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">진한 칸 = 통과, 점선 칸 = 실패</p>
          </div>
        );
      }}
    />
  );
}
