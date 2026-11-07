import SceneShell from "./SceneShell";

/**
 * 본문 대응: #other-rules 첫 펼침 — 다섯 명, 1위 2점·2위 1점·3위 0점.
 * 전: 가 3×2=6, 나 3×1+2×2=7, 다 2×1=2. 후(두 명이 나>가>다): 가 6+2=8, 나 7, 다 0.
 * 가와 나의 일대일 표는 전후 모두 3대 2.
 */
const OPTIONS = ["가", "나", "다"] as const;
const THREE = { count: 3, order: ["가", "나", "다"] };
const TWO_BEFORE = { count: 2, order: ["나", "다", "가"] };
const TWO_AFTER = { count: 2, order: ["나", "가", "다"] };
const THREE_COLOR = "#2563eb";
const TWO_COLOR = "#d97706";
const MAX_POINTS = 8;

const points = (group: { count: number; order: string[] }, option: string) =>
  group.count * (2 - group.order.indexOf(option));

const SCENES = [
  { label: "세 명의 표부터", summary: "가 6 · 나 3 · 다 0", note: "칸 하나가 1점입니다. 세 명만 세면 가는 3×2점, 나는 3×1점, 다는 0점입니다." },
  { label: "두 명의 표를 더합니다", summary: "가 6 · 나 7 · 다 2", note: "두 명은 나에 2×2점, 다에 2×1점, 가에 0점을 줍니다. 나 7점이 가 6점을 앞섭니다." },
  { label: "두 명이 다만 맨 아래로", summary: "가 8 · 나 7 · 다 0", note: "2위 자리가 다에서 가로 넘어가 가가 2×1점을 더 얻습니다. 나는 7점 그대로라 승자가 바뀝니다." },
  { label: "가와 나만 따로 보면", summary: "전후 모두 가 3 : 나 2", note: "둘을 비교한 사람 수는 그대로인데 점수 승자만 뒤집혔습니다. 두 안의 우열은 그 둘의 비교만으로 정해져야 한다는 무관한 대안으로부터의 독립이 깨진 예입니다." },
] as const;

function Ballot({ title, color, order, changed }: { title: string; color: string; order: string[]; changed: boolean }) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-2 text-xs font-bold">
        <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: color }} />
        {title}
      </p>
      <div className="mt-1 grid grid-cols-3 gap-1">
        {order.map((option, rank) => (
          <span
            key={option}
            className={`rounded border px-1 py-1 text-center text-xs ${changed && rank > 0 ? "border-amber-600 font-bold" : "border-border"}`}
          >
            {option} <span className="text-muted-foreground">{2 - rank}점</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function PointRow({ option, first, second, lead }: { option: string; first: number; second: number; lead: boolean }) {
  const total = first + second;
  return (
    <div className="grid grid-cols-[1.5rem_minmax(0,1fr)_5.5rem] items-center gap-2 text-sm">
      <span className={lead ? "font-bold" : ""}>{option}</span>
      <div className="grid grid-cols-8 gap-0.5">
        {Array.from({ length: MAX_POINTS }, (_, cell) => (
          <span
            key={cell}
            className={`h-4 rounded-sm ${cell < total ? "" : "bg-muted/50"}`}
            style={cell < first ? { backgroundColor: THREE_COLOR } : cell < total ? { backgroundColor: TWO_COLOR } : undefined}
          />
        ))}
      </div>
      <span className={`text-right font-mono text-xs ${lead ? "font-bold" : ""}`}>
        {second > 0 ? `${first}+${second}=` : ""}
        {total}점{lead ? " 승" : ""}
      </span>
    </div>
  );
}

function PairTally({ title, scoreA, scoreB }: { title: string; scoreA: number; scoreB: number }) {
  return (
    <div className="rounded-lg border border-border p-2.5 text-sm">
      <p className="text-xs font-bold text-muted-foreground">{title}</p>
      <p className="mt-1 text-xs leading-5">가를 위에 <strong>3명</strong> · 나를 위에 <strong>2명</strong></p>
      <p className="mt-1 font-mono text-xs">점수 가 {scoreA} : 나 {scoreB} → {scoreA > scoreB ? "가" : "나"} 승</p>
    </div>
  );
}

export default function BordaShiftViz() {
  return (
    <SceneShell
      eyebrow="점수제의 대가"
      title="셋째 안만 옮겼는데 가와 나의 승패가 뒤집힐 수 있습니다"
      description="유권자 다섯 명의 예이며, 1위 2점·2위 1점·3위 0점으로 합칩니다(가정). 같은 계산을 글로 따라가는 설명은 바로 아래 펼침에 있습니다."
      ariaLabel="다섯 명의 순위를 점수로 합칠 때 다의 위치만 바뀌어 승자가 나에서 가로 바뀌는 과정"
      scenes={SCENES}
      render={(active) => {
        const shifted = active >= 2;
        const second = shifted ? TWO_AFTER : TWO_BEFORE;
        const showSecond = active >= 1;
        const scores = OPTIONS.map((option) => points(THREE, option) + (showSecond ? points(second, option) : 0));
        const top = Math.max(...scores);
        return (
          <div className="min-w-0 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Ballot title="세 명" color={THREE_COLOR} order={THREE.order} changed={false} />
              <div className={showSecond ? "" : "opacity-40"}>
                <Ballot title={shifted ? "두 명 (순서 고침)" : "두 명"} color={TWO_COLOR} order={second.order} changed={shifted} />
              </div>
            </div>
            {active < 3 ? (
              <div className="space-y-2">
                {OPTIONS.map((option, index) => (
                  <PointRow
                    key={option}
                    option={option}
                    first={points(THREE, option)}
                    second={showSecond ? points(second, option) : 0}
                    lead={showSecond && scores[index] === top}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <PairTally title="바꾸기 전" scoreA={6} scoreB={7} />
                <PairTally title="바꾼 뒤" scoreA={8} scoreB={7} />
              </div>
            )}
          </div>
        );
      }}
    />
  );
}
