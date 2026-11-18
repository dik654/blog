import SceneShell from "./SceneShell";

/**
 * 본문 대응: GRU 식 assumptions — "PyTorch nn.GRUCell은 r_t⊙(U_h h_{t-1}+b_h)처럼 행렬곱 결과 전체에 곱합니다 …
 * 행렬곱이 elementwise 곱에 분배되지 않으므로 대수적으로 다른 함수입니다."
 * hprev=(2,−1), r=(0,.5)는 본문 fixture. U_h=[[1,1],[0,1]], b_h=0은 가정.
 * 이 글: r⊙h=(0,−.5) → U·(0,−.5)=(−.5,−.5).   PyTorch: U·h=(1,−1) → r⊙(1,−1)=(0,−.5).
 */
const SCENES = [
  {
    label: "같은 재료",
    summary: "hₜ₋₁=(2, −1) · r=(0, .5)",
    note: "이전 state와 reset gate는 이 절 첫 그림의 값과 같습니다. 행렬 U_h와 b_h=0은 계산을 보이려는 가정이고, W_hx_t 항은 두 식에 똑같이 더해지므로 여기서는 뺐습니다.",
  },
  {
    label: "이 글의 식: 거른 뒤 곱하기",
    summary: "U_h(r⊙h) = (−.5, −.5)",
    note: "먼저 r⊙h로 과거 state의 좌표를 거릅니다. r₁=0이 h의 첫 좌표 2를 막지만, 남은 −.5가 U_h의 첫 행을 거쳐 출력 첫 좌표에도 −.5로 들어갑니다.",
  },
  {
    label: "PyTorch 식: 곱한 뒤 거르기",
    summary: "r⊙(U_h h) = (0, −.5)",
    note: "먼저 U_h h=(2−1, −1)=(1, −1)을 만든 뒤 r을 곱합니다. 이번에는 r₁=0이 행렬곱 결과의 첫 좌표를 통째로 0으로 만듭니다.",
  },
  {
    label: "두 결과 비교",
    summary: "(−.5, −.5) ≠ (0, −.5)",
    note: "같은 r, h, U_h인데 tanh 안에 들어갈 history 항의 첫 좌표가 다릅니다. 같은 r이 막는 대상이 이 글의 식에서는 과거 state 좌표, PyTorch 식에서는 행렬곱 결과 좌표이기 때문이고, 그래서 checkpoint를 옮길 때 실제 식을 확인해야 합니다.",
  },
] as const;

function Vec({ name, value, show, mark }: { name: string; value: string; show: boolean; mark?: boolean }) {
  return (
    <div className={`min-w-0 rounded-lg border px-2 py-2 text-center ${mark ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
      <p className="break-keep text-[11px] text-muted-foreground">{name}</p>
      <p className={`mt-1 font-mono text-sm font-bold ${show ? "" : "text-muted-foreground/40"}`}>{show ? value : "( ?, ? )"}</p>
    </div>
  );
}

function Lane({ title, steps, show, mark }: { title: string; steps: readonly { name: string; value: string }[]; show: boolean; mark: boolean }) {
  return (
    <div className={`rounded-lg border px-3 py-3 ${show ? "border-border" : "border-dashed border-border/50"}`}>
      <p className="text-xs font-bold">{title}</p>
      <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
        <Vec name={steps[0].name} value={steps[0].value} show={show} />
        <span aria-hidden className="text-primary">→</span>
        <Vec name={steps[1].name} value={steps[1].value} show={show} mark={mark} />
      </div>
    </div>
  );
}

export default function ResetPlacementViz() {
  return (
    <SceneShell
      eyebrow="Reset gate를 곱하는 위치"
      title="같은 r도 행렬곱 앞에서 곱하느냐 뒤에서 곱하느냐에 따라 결과가 달라집니다"
      description="⊙는 같은 좌표끼리의 곱입니다. 위 줄은 이 글의 표기 U_h(r⊙h), 아래 줄은 PyTorch nn.GRUCell의 r⊙(U_h h+b_h)입니다. U_h=[[1, 1], [0, 1]]과 b_h=0은 가정입니다."
      ariaLabel="reset gate를 행렬곱 전과 후에 곱했을 때 candidate history 항이 달라지는 계산"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <Vec name="이전 state hₜ₋₁" value="(2, −1)" show />
            <Vec name="reset gate r" value="(0, .5)" show />
            <Vec name="U_h (가정)" value="[[1,1],[0,1]]" show />
          </div>
          <Lane
            title="이 글: 먼저 r⊙h, 다음 U_h"
            steps={[
              { name: "r⊙h", value: "(0, −.5)" },
              { name: "U_h(r⊙h)", value: "(−.5, −.5)" },
            ]}
            show={active === 1 || active === 3}
            mark={active === 3}
          />
          <Lane
            title="PyTorch: 먼저 U_h h, 다음 r⊙"
            steps={[
              { name: "U_h h", value: "(1, −1)" },
              { name: "r⊙(U_h h)", value: "(0, −.5)" },
            ]}
            show={active === 2 || active === 3}
            mark={active === 3}
          />
        </div>
      )}
    />
  );
}
