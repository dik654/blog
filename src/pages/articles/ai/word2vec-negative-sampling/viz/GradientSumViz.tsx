import SceneShell from "./SceneShell";

/**
 * 본문 대응: #gradient — p=σ(1). (p−1)[2,0,1] + p[1,0,1] + p[1,1,0] = [4p−2, p, 2p−1].
 * v_next = [0,1,1] − 0.1×합 ≈ [−0.092423, 0.926894, 0.953788]. 값은 코드에서 계산한다.
 */
const P = 1 / (1 + Math.exp(-1));
const CAT = [2, 0, 1].map((u) => (P - 1) * u);
const RED = [1, 0, 1].map((u) => P * u);
const DOG = [1, 1, 0].map((u) => P * u);
const SUM = CAT.map((_, i) => CAT[i] + RED[i] + DOG[i]);
const V = [0, 1, 1];
const NEXT = V.map((v, i) => v - 0.1 * SUM[i]);
const SCALE = 1;

const ROWS = [
  { name: "cat", formula: "(p−1)[2,0,1]", values: CAT, from: 0, color: "#2563eb" },
  { name: "red", formula: "p[1,0,1]", values: RED, from: 1, color: "#d97706" },
  { name: "dog", formula: "p[1,1,0]", values: DOG, from: 2, color: "#d97706" },
  { name: "합", formula: "기울기", values: SUM, from: 3, color: "#475569" },
  { name: "다음 saw", formula: "[0,1,1] − 0.1×합", values: NEXT, from: 4, color: "#16a34a" },
] as const;

const SCENES = [
  { label: "cat의 기여", summary: "p−1 ≈ −0.268941", note: "관찰 cat은 표시 1이라 오차 p−1이 음수입니다. 그 오차에 cat의 대상 줄을 곱한 값이 saw로 돌아옵니다." },
  { label: "red의 기여", summary: "p ≈ 0.731059", note: "추첨 red는 표시 0이라 오차가 p로 양수입니다. red의 대상 줄을 곱합니다." },
  { label: "dog의 기여", summary: "p ≈ 0.731059", note: "dog도 같은 오차 p에 자기 줄 [1,1,0]을 곱합니다. 자리마다 값이 달라지는 이유는 대상 줄이 다르기 때문입니다." },
  { label: "세 기여의 합", summary: "[4p−2, p, 2p−1]", note: "입력 saw는 세 점수를 공유하므로 세 기여를 자리별로 더합니다. 대상 쪽은 각각 자기 오차만 받습니다. 값은 모두 갱신 전 표에서 계산했습니다." },
  { label: "한 번 내리기", summary: "학습률 0.1(가정)", note: "학습률은 한 번에 움직이는 크기입니다. 내리는 갱신은 기울기의 부호를 뒤집어 더하므로 기울기가 양수인 세 자리 모두 saw의 값이 줄어듭니다." },
] as const;

function Value({ value, color, show }: { value: number; color: string; show: boolean }) {
  const width = Math.min(Math.abs(value) / SCALE, 1) * 50;
  return (
    <span className={`min-w-0 ${show ? "" : "invisible"}`}>
      <span className="block text-right font-mono text-[11px] leading-4">{value < 0 ? "−" : ""}{Math.abs(value).toFixed(3)}</span>
      <span className="relative mt-0.5 block h-2 rounded-sm bg-muted/50">
        <span className="absolute inset-y-0 left-1/2 w-px bg-border" />
        <span className="absolute inset-y-0" style={{ left: value < 0 ? `${50 - width}%` : "50%", width: `${width}%`, backgroundColor: color }} />
      </span>
    </span>
  );
}

export default function GradientSumViz() {
  return (
    <SceneShell
      eyebrow="입력 saw로 돌아오는 양"
      title="세 비교의 오차가 자리별로 더해져 입력 줄을 움직입니다"
      description="p=σ(1)≈0.731059입니다. 세 열이 줄의 세 자리이고 막대는 가운데 선 왼쪽이 음수, 오른쪽이 양수입니다. 기울기는 줄을 고칠 방향과 크기를 정하는 값입니다."
      ariaLabel="cat, red, dog의 기여를 자리별로 더해 기울기를 얻고 saw 입력 줄을 고치는 계산"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-2">
          {ROWS.map((row) => {
            const show = active >= row.from;
            return (
              <div key={row.name} className={`grid grid-cols-[5.25rem_repeat(3,minmax(0,1fr))] items-center gap-2 ${active === row.from ? "rounded bg-primary/10" : ""}`}>
                <span className={`min-w-0 text-xs leading-4 ${show ? "" : "invisible"}`}>
                  <span className="block font-bold">{row.name}</span>
                  <span className="block font-mono text-[10.5px] text-muted-foreground">{row.formula}</span>
                </span>
                {row.values.map((value, index) => <Value key={index} value={value} color={row.color} show={show} />)}
              </div>
            );
          })}
        </div>
      )}
    />
  );
}
