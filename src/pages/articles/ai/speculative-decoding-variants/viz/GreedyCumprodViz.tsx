import SceneShell from "./SceneShell";

/**
 * 본문 대응: #greedy — temperature 0 분기. 후보 행 순서는 generate_medusa_buffers가 만드는 원문 순서이고
 * RAY가 행 2다. RAY [1,1] → 2, RAX [1,0] → 1. RBY [0,1]은 곱하면 [0,0]이 된다(본문의 [0,1] 예).
 * B 자리의 선택은 하나뿐이므로 Y를 고른다고 두면 같은 부모의 RBX 둘째 칸은 0이다.
 */
const SCENES = [
  { label: "칸마다 비교", summary: "같으면 1 · 다르면 0", note: "둘째 칸부터 부모 위치에서 큰 모델이 고른 글자와 비교합니다. RAY는 [1, 1], RAX는 [1, 0]입니다. B 아래에서 큰 모델이 Y를 고른다고 두면 RBY는 [0, 1]입니다." },
  { label: "앞에서부터 곱합니다", summary: "첫 0 뒤는 전부 0", note: "cumprod는 비교값을 앞에서부터 곱합니다. RBY의 [0, 1]은 [0, 0]이 됩니다. 둘째 칸이 1이어도 첫 칸이 0이면 0이 되어 첫 실패 뒤를 확정하지 못합니다." },
  { label: "합이 연속 일치 길이", summary: "최대 2 → 행 2", note: "합이 연속 일치 길이입니다. RAY의 2가 최대이므로 원문 순서의 행 번호 2를 고릅니다. 길이 2와 행 번호 2는 다른 값입니다." },
] as const;

const ROWS = [
  { index: 0, path: "R B Y", compare: ["0", "1"], product: [0, 0] },
  { index: 1, path: "R B X", compare: ["0", "0"], product: [0, 0] },
  { index: 2, path: "R A Y", compare: ["1", "1"], product: [1, 1] },
  { index: 3, path: "R A X", compare: ["1", "0"], product: [1, 0] },
] as const;

function Bit({ value, show, on }: { value: string | number; show: boolean; on?: boolean }) {
  const one = on ?? (value === 1 || value === "1");
  return (
    <span className={`flex h-6 items-center justify-center rounded-[3px] border font-mono text-sm font-bold ${show ? (one ? "border-[#16a34a] bg-[#16a34a]/20" : "border-border") : "border-dashed border-border/50 text-transparent"}`}>
      {value}
    </span>
  );
}

export default function GreedyCumprodViz() {
  return (
    <SceneShell
      eyebrow="연속 일치 길이"
      title="비교값을 앞에서부터 곱하면 첫 실패 뒤가 지워집니다"
      description="행은 후보 경로, 칸은 시작 토큰 R(root) 뒤의 두 자리입니다. 가정한 점수에서 큰 모델의 선택이 R→A→Y인 사례입니다."
      note="가장 점수가 높은 글자를 고르는 greedy 분기를 가정한 점수로 확인한 사례이고 모델 forward나 GPU를 실행하지 않았습니다."
      ariaLabel="후보 행별 비교값, 누적 곱, 연속 일치 길이"
      scenes={SCENES}
      render={(active) => (
        <div className="mx-auto grid max-w-md grid-cols-[1.25rem_3rem_repeat(2,1.6rem)_0.25rem_repeat(2,1.6rem)_0.25rem_1.6rem] items-center justify-center gap-x-1 gap-y-1.5 text-xs">
          <span className="font-bold text-muted-foreground">행</span>
          <span className="font-bold text-muted-foreground">후보</span>
          <span className="col-span-2 text-center font-bold text-muted-foreground">비교</span>
          <span />
          <span className="col-span-2 text-center font-bold text-muted-foreground">곱</span>
          <span />
          <span className="text-center font-bold text-muted-foreground">합</span>
          {ROWS.map((row) => {
            const best = active === 2 && row.index === 2;
            const sum = row.product.reduce<number>((total, value) => total + value, 0);
            return (
              <div key={row.index} className="contents">
                <span className={`font-mono font-bold ${best ? "text-[#16a34a]" : "text-muted-foreground"}`}>{row.index}</span>
                <span className={`whitespace-nowrap font-mono font-bold ${best ? "text-[#16a34a]" : ""}`}>{row.path}</span>
                {row.compare.map((value, cell) => <Bit key={cell} value={value} show />)}
                <span />
                {row.product.map((value, cell) => <Bit key={cell} value={value} show={active >= 1} />)}
                <span />
                <Bit value={sum} show={active >= 2} on={best} />
              </div>
            );
          })}
        </div>
      )}
    />
  );
}
