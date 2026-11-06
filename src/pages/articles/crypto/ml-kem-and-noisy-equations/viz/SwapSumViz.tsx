import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 공개 표를 뒤집어 곱해도 공통의 큰 곱이 같아 빼면 사라진다.
 * 칸 = r의 값 × A의 값 × s의 값. A=[[2,3],[4,1]], s=[1,2], r=[1,1](7절의 가정).
 * 칸은 2·6·4·2. 가로 합 8·6, 세로 합 6·8, 어느 쪽이든 총합 14.
 * 세로 합 6과 8은 s의 값 1·2에 A를 전치해 r에 곱한 [6,4]를 곱한 값입니다.
 */
const SCENES = [
  { label: "네 칸", summary: "칸 = r × A × s", note: "표의 네 칸마다 왼쪽 r의 값, 표 A의 값, 위쪽 s의 값을 곱했습니다. 보내는 쪽의 임시 비밀은 7절에서 쓸 r=[1,1]입니다(가정)." },
  { label: "가로로 더하기", summary: "8 + 6 = 14", note: "A·s=[8,6]이 가로 합입니다. 공개값 t에 임시 비밀을 곱한 둘째 값 안에 이 14가 들어 있습니다." },
  { label: "세로로 더하기", summary: "6 + 8 = 14", note: "표를 뒤집어 r에 곱하면 [6,4]이고, 여기에 s=[1,2]를 곱하면 6과 8입니다. 수신자가 첫 값에 자기 비밀을 곱할 때 나오는 세로 합입니다." },
  { label: "같은 칸들", summary: "빼면 14가 사라짐", note: "같은 네 칸을 묶는 순서만 다르므로 총합은 언제나 같습니다. 그래서 둘째 값에서 빼면 큰 곱이 사라지고 작은 오류와 비트만 남습니다. 남은 계산은 7절에서 칸으로 셉니다." },
] as const;

const A = [[2, 3], [4, 1]] as const;
const S = [1, 2] as const;
const R = [1, 1] as const;

function Label({ text, strong = false }: { text: string; strong?: boolean }) {
  return <span className={`flex h-9 items-center justify-center font-mono text-sm ${strong ? "font-bold text-primary" : "font-semibold text-muted-foreground"}`}>{text}</span>;
}

function Table({ active }: { active: number }) {
  const rowMode = active === 1;
  const colMode = active === 2;
  const both = active === 3;
  const rowTone = (r: number) => (r === 0 ? "border-primary bg-primary/15" : "border-primary bg-primary/30");
  const colTone = (c: number) => (c === 0 ? "border-amber-600 bg-amber-600/15" : "border-amber-600 bg-amber-600/30");
  return (
    <div className="mx-auto grid max-w-[420px] grid-cols-[3rem_minmax(0,1fr)_minmax(0,1fr)_3.25rem] gap-2">
      <span />
      <Label text="s₁=1" />
      <Label text="s₂=2" />
      <Label text={rowMode ? "가로 합" : ""} strong={rowMode} />
      {A.map((line, r) => (
        <div key={r} className="contents">
          <Label text={`r${r === 0 ? "₁" : "₂"}=1`} />
          {line.map((value, c) => (
            <span
              key={c}
              className={`flex h-16 flex-col items-center justify-center rounded-lg border ${
                rowMode ? rowTone(r) : colMode ? colTone(c) : both ? "border-primary bg-primary/10" : "border-border bg-background"
              }`}
            >
              <span className="font-mono text-lg font-bold">{R[r] * value * S[c]}</span>
              <span className="font-mono text-xs text-muted-foreground">{R[r]}×{value}×{S[c]}</span>
            </span>
          ))}
          <Label text={rowMode || both ? String(R[r] * (line[0] * S[0] + line[1] * S[1])) : ""} strong={rowMode} />
        </div>
      ))}
      <Label text={colMode ? "세로 합" : ""} strong={colMode} />
      {[0, 1].map((c) => (
        <Label key={c} text={colMode || both ? String(R[0] * A[0][c] * S[c] + R[1] * A[1][c] * S[c]) : ""} strong={colMode} />
      ))}
      <Label text={active === 0 ? "" : "14"} strong />
    </div>
  );
}

export default function SwapSumViz() {
  return (
    <SceneShell
      eyebrow="뒤집어도 같은 곱"
      title="표를 뒤집어 곱해도 같은 네 칸을 더하는 일입니다"
      description="양쪽이 서로 다른 순서로 곱해도 큰 부분이 같아지는 이유입니다. 값은 3절의 표와 비밀에 7절의 임시 비밀을 놓은 것입니다."
      ariaLabel="같은 네 칸을 가로로 더한 값과 세로로 더한 값이 모두 14가 되는 과정"
      scenes={SCENES}
      render={(active) => <Table active={active} />}
    />
  );
}
