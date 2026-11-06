import SceneShell from "./SceneShell";

/**
 * 본문 대응: #trace — G=(2/3,−2/3)를 입력과 짝지어 dW·db·dX를 만든다.
 * dW 행 i = 입력 i × G. db = G. dX₁ = (2/3)ln2 + (−2/3)×0 ≈ 0.462098, dX₂ = 0.
 */
const DW: readonly (readonly string[])[] = [["2/3", "−2/3"], ["4/3", "−4/3"]];

const SCENES = [
  { label: "점수에서 온 신호", summary: "G = p − y = (2/3, −2/3)", note: "(2/3, 1/3)에서 정답 (0, 1)을 뺀 값입니다. 양수는 그 점수를 늘리면 오차가 커진다는 뜻이고, 음수는 늘리면 오차가 줄어든다는 뜻입니다." },
  { label: "dW 첫 행", summary: "1 × G = (2/3, −2/3)", note: "입력 1에 연결된 행입니다. 신호를 네 칸에 똑같이 복사하지 않고, 이 행에는 입력 1을 곱합니다." },
  { label: "dW 둘째 행", summary: "2 × G = (4/3, −4/3)", note: "입력 2에 연결된 행입니다. 곱하는 입력이 2라서 첫 행의 두 배입니다. 3절의 차분이 가리키던 −4/3이 이 행의 둘째 칸입니다." },
  { label: "bias", summary: "db = (2/3, −2/3)", note: "bias는 각 점수에 1배로 더해지므로 점수의 신호가 그대로 기여가 됩니다." },
  { label: "입력의 첫 칸", summary: "dX₁ ≈ 0.462098", note: "이번에는 입력 1이 쓰인 두 선택지의 가중치를 신호에 곱해 합합니다. (2/3)×ln2 + (−2/3)×0입니다." },
  { label: "입력의 둘째 칸", summary: "dX₂ = 0 · dW 둘째 행 ≠ 0", note: "둘째 입력에 붙은 가중치가 모두 0이라 (2/3)×0 + (−2/3)×0 = 0입니다. dW의 둘째 행은 입력 2를 곱해 만든 다른 양이므로 0이 아닙니다. parameter는 아직 고치지 않았습니다." },
];

function Cell({ value, on }: { value: string | null; on: boolean }) {
  return (
    <div className={`flex h-8 min-w-0 sm:h-10 items-center justify-center rounded-sm border font-mono text-sm ${on ? "font-bold" : ""} ${value === null ? "border-dashed border-border text-muted-foreground/60" : ""}`} style={value !== null ? { borderColor: on ? "#dc2626" : "#94a3b8", backgroundColor: on ? "#dc262618" : "transparent" } : undefined}>
      {value ?? "?"}
    </div>
  );
}

export default function GradientGridViz() {
  return (
    <SceneShell
      eyebrow="신호와 입력의 짝"
      title="두 점수의 신호에 입력을 곱해 네 가중치의 gradient를 채웁니다"
      description="표의 행은 입력, 열은 선택지입니다. 맨 위 신호에 행 왼쪽의 입력을 곱해 칸을 채웁니다. X=(1,2), W=[[ln2,0],[0,0]], target=(0,1)은 앞 절의 가정입니다."
      ariaLabel="점수 신호와 입력의 곱으로 채워지는 dW, db, dX"
      scenes={SCENES}
      render={(active) => {
        const grid = (row: number, col: number) => (active >= row + 1 ? DW[row][col] : null);
        return (
          <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <div className="min-w-0">
              <div className="grid grid-cols-[3.75rem_minmax(0,1fr)_minmax(0,1fr)] gap-1.5 text-xs">
                <div />
                <p className="text-center text-muted-foreground">첫 선택지</p>
                <p className="text-center text-muted-foreground">둘째 선택지</p>
                <p className="self-center font-bold">G</p>
                <Cell value="2/3" on={active === 0} />
                <Cell value="−2/3" on={active === 0} />
                <p className="self-center leading-4 text-muted-foreground">dW<br />입력 1 ×1</p>
                <Cell value={grid(0, 0)} on={active === 1} />
                <Cell value={grid(0, 1)} on={active === 1} />
                <p className="self-center leading-4 text-muted-foreground">dW<br />입력 2 ×2</p>
                <Cell value={grid(1, 0)} on={active === 2} />
                <Cell value={grid(1, 1)} on={active === 2} />
                <p className="self-center font-bold">db</p>
                <Cell value={active >= 3 ? "2/3" : null} on={active === 3} />
                <Cell value={active >= 3 ? "−2/3" : null} on={active === 3} />
              </div>
            </div>
            <div className="min-w-0 text-xs">
              <p className="font-bold">dX · 입력 쪽 기여</p>
              <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                <div>
                  <p className="mb-1 text-center text-muted-foreground">입력 1</p>
                  <Cell value={active >= 4 ? "0.462098" : null} on={active === 4} />
                </div>
                <div>
                  <p className="mb-1 text-center text-muted-foreground">입력 2</p>
                  <Cell value={active >= 5 ? "0" : null} on={active === 5} />
                </div>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
