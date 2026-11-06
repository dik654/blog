import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-noise, #source-update — 칸 수 8333335, 8333333, 8333334, 66666666, 8333332를 번호 순서로 이어 붙인 표.
 * 조회 위치 16,544,202는 번호 1, 92,103,759는 번호 4 구간에 든다. 누적 경계는 칸 수의 합이다.
 */
const TOTAL = 100000000;
const BINS = [
  { id: 0, word: "문장 끝", count: 8333335 },
  { id: 1, word: "red", count: 8333333 },
  { id: 2, word: "cat", count: 8333334 },
  { id: 3, word: "saw", count: 66666666 },
  { id: 4, word: "dog", count: 8333332 },
];
const STARTS = BINS.map((_, index) => BINS.slice(0, index).reduce((sum, bin) => sum + bin.count, 0));
const fmt = (value: number) => value.toLocaleString("en-US");

const SCENES = [
  { label: "칸을 이어 붙인 표", summary: "1억 칸 중 saw 66,666,666칸", note: "번호를 누적확률에 비례하는 길이로 반복해 넣은 정수 표입니다. 위치 하나를 고르면 그 칸에 저장된 번호가 뽑힙니다. 칸이 많은 번호일수록 자주 걸립니다.", pointer: null, hit: null },
  { label: "첫 번째 조회", summary: "16,544,202 → 번호 1 red", note: "시작 상태 43에서 얻은 첫 조회 위치입니다. 8,333,335 이상 16,666,668 미만이라 번호 1 구간에 듭니다.", pointer: 16544202, hit: 1 },
  { label: "두 번째 조회", summary: "92,103,759 → 번호 4 dog", note: "다음 상태의 조회 위치는 91,666,668 이상이라 마지막 구간에 듭니다. 3절에서 정한 비교 두 건이 원본에서도 실제로 발생하도록 이 시작 상태를 고른 것입니다.", pointer: 92103759, hit: 4 },
] as const;
const COLORS = ["#94a3b8", "#d97706", "#64748b", "#2563eb", "#16a34a"];

export default function TableLookupViz() {
  return (
    <SceneShell
      eyebrow="1억 칸의 추첨표"
      title="위치 하나를 고르면 그 칸의 번호가 뽑힙니다"
      description="띠 전체가 100,000,000칸이고 구간 폭은 14절 표의 칸 수에 비례합니다. 위치는 0부터 셉니다."
      ariaLabel="1억 칸 추첨표의 번호별 구간과 두 조회 위치"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="relative h-6">
              {scene.pointer !== null && (
                <span className="absolute bottom-0 -translate-x-1/2 text-xs font-bold text-[#dc2626]" style={{ left: `${(scene.pointer / TOTAL) * 100}%` }}>▼</span>
              )}
            </div>
            <div className="flex h-10 min-w-0 overflow-hidden rounded-sm border border-border">
              {BINS.map((bin) => (
                <span
                  key={bin.id}
                  className="flex min-w-0 items-center justify-center border-r border-background font-mono text-xs font-bold text-white"
                  style={{ width: `${(bin.count / TOTAL) * 100}%`, backgroundColor: COLORS[bin.id], opacity: scene.hit === null || scene.hit === bin.id ? 1 : 0.35 }}
                >
                  {bin.id}
                </span>
              ))}
            </div>
            <ul className="mt-3 space-y-1 text-xs">
              {BINS.map((bin, index) => (
                <li key={bin.id} className={`grid grid-cols-[1.25rem_3.5rem_minmax(0,1fr)] gap-2 ${scene.hit === bin.id ? "font-bold" : "text-muted-foreground"}`}>
                  <span className="font-mono">{bin.id}</span>
                  <span>{bin.word}</span>
                  <span className="text-right font-mono">{fmt(STARTS[index])} ~ {fmt(STARTS[index] + bin.count - 1)}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      }}
    />
  );
}
