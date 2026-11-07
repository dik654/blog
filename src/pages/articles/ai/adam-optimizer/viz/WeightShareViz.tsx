import SceneShell from "./SceneShell";

/**
 * 본문 대응: #why-two-records — 초기 비중 보정.
 * 방향 장부: 0.1 → 0.09+0.1=0.19, 나머지 0.81은 처음 채운 0의 몫. −0.02÷0.19≈−0.105263.
 * 제곱 장부: 0.000999+0.001=0.001999, 나머지 0.998001. 0.007996÷0.001999=4.
 */
const FIRST = "#2563eb";
const SECOND = "#d97706";
const EMPTY = "#94a3b8";

interface Shares {
  first: number;
  second: number;
  firstText: string;
  secondText: string;
  emptyText: string;
}

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  ledger: string;
  whole: Shares;
  corrected: { first: number; second: number; firstText: string; secondText: string } | null;
}[] = [
  {
    label: "방향 장부, 한 번 갱신",
    summary: "신호 0.1 + 0의 몫 0.9 = 1",
    note: "빈 장부를 0으로 시작하면 새 신호는 0.1만 들어갑니다. 나머지 0.9는 처음 채워 둔 0의 몫입니다.",
    ledger: "방향 장부",
    whole: { first: 0.1, second: 0, firstText: "0.1", secondText: "아직 없음", emptyText: "0.9" },
    corrected: null,
  },
  {
    label: "방향 장부, 두 번 갱신",
    summary: "0.09 + 0.1 + 0.81 = 1",
    note: "첫 신호의 0.1은 0.9배가 되어 0.09로 남고 둘째 신호 0.1이 들어옵니다. 실제 신호가 차지한 비중은 합해서 0.19이고, 0의 몫은 0.81로 줄었습니다.",
    ledger: "방향 장부",
    whole: { first: 0.09, second: 0.1, firstText: "0.09", secondText: "0.1", emptyText: "0.81" },
    corrected: null,
  },
  {
    label: "0.19로 나눠 신호 부분만 1로",
    summary: "−0.02 ÷ 0.19 ≈ −0.105263",
    note: "0의 몫을 빼고 신호 부분을 전체 1로 늘립니다. 첫 신호와 둘째 신호는 0.09 대 0.1의 관계를 유지하므로 최근 신호에 더 주는 비중은 그대로입니다.",
    ledger: "방향 장부",
    whole: { first: 0.09, second: 0.1, firstText: "0.09", secondText: "0.1", emptyText: "0.81" },
    corrected: { first: 0.09 / 0.19, second: 0.1 / 0.19, firstText: "약 0.474", secondText: "약 0.526" },
  },
  {
    label: "제곱 장부는 따로 셉니다",
    summary: "0.007996 ÷ 0.001999 = 4",
    note: "남기는 비율이 0.999라 신호 비중은 0.001999뿐이고, 위 막대에서는 왼쪽 끝의 가는 선(실제 폭보다 굵게 그림)으로만 보입니다. 비율이 달라 방향 장부의 0.19를 같이 쓸 수 없습니다.",
    ledger: "제곱 장부",
    whole: { first: 0.000999, second: 0.001, firstText: "0.000999", secondText: "0.001", emptyText: "0.998001" },
    corrected: { first: 0.000999 / 0.001999, second: 0.001 / 0.001999, firstText: "약 0.4997", secondText: "약 0.5003" },
  },
];

function Bar({ first, second, showEmpty }: { first: number; second: number; showEmpty: boolean }) {
  return (
    <div className="flex h-7 min-w-0 overflow-hidden rounded-sm border border-border">
      {first > 0 && <div className="h-full border-r border-background" style={{ width: `${first * 100}%`, minWidth: 2, backgroundColor: FIRST }} />}
      {second > 0 && <div className="h-full" style={{ width: `${second * 100}%`, minWidth: 2, backgroundColor: SECOND }} />}
      {showEmpty && <div className="h-full min-w-0 flex-1 opacity-25" style={{ backgroundColor: EMPTY }} />}
    </div>
  );
}

function Key({ color, label, value, faded = false }: { color: string; label: string; value: string; faded?: boolean }) {
  return (
    <div className="min-w-0 text-xs leading-5 sm:text-sm">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        <span className="inline-block size-2.5 shrink-0 rounded-sm" style={{ backgroundColor: color, opacity: faded ? 0.25 : 1 }} />
        {label}
      </span>
      <span className="block font-mono font-semibold">{value}</span>
    </div>
  );
}

export default function WeightShareViz() {
  return (
    <SceneShell
      eyebrow="초기 비중"
      title="장부 전체 1 가운데 실제 신호가 차지한 몫만 다시 1로 늘립니다"
      description="막대 전체가 장부의 비중 1입니다. 남기는 비율 0.9와 0.999는 이 글에서 정한 가정입니다."
      ariaLabel="두 번 갱신한 장부에서 첫 신호, 둘째 신호, 초기값 0이 차지하는 비중과 보정"
      scenes={SCENES}
      render={(active) => {
        const { ledger, whole, corrected } = SCENES[active];
        return (
          <div className="min-w-0 space-y-5">
            <div className="space-y-2">
              <p className="text-sm font-semibold">{ledger}: 보정 전 비중</p>
              <Bar first={whole.first} second={whole.second} showEmpty />
              <div className="grid grid-cols-3 gap-2">
                <Key color={FIRST} label="첫 신호" value={whole.firstText} />
                <Key color={SECOND} label="둘째 신호" value={whole.secondText} />
                <Key color={EMPTY} faded label="처음 채운 0" value={whole.emptyText} />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold">{ledger}: 신호 부분만 1로 늘린 뒤</p>
              {corrected ? (
                <Bar first={corrected.first} second={corrected.second} showEmpty={false} />
              ) : (
                <div className="flex h-7 items-center justify-center rounded-sm border border-dashed border-border text-xs text-muted-foreground">아직 나누지 않았습니다</div>
              )}
              <div className="grid grid-cols-3 gap-2">
                <Key color={FIRST} label="첫 신호" value={corrected ? corrected.firstText : "−"} />
                <Key color={SECOND} label="둘째 신호" value={corrected ? corrected.secondText : "−"} />
                <Key color={EMPTY} faded label="처음 채운 0" value={corrected ? "빠짐" : "−"} />
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
