import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — A=[[2,3],[4,1]], s=[1,2], e=[1,0]. 첫 성분 2×1+3×2+1=9, 둘째 4×1+1×2+0=6.
 * 표의 한 행이 비밀과 곱해져 공개값의 한 칸이 됩니다.
 */
const SCENES = [
  { label: "재료", summary: "A · s · e → t", note: "모든 수는 17로 나눈 나머지입니다(가정). 공개 표 A의 두 행, 비밀 s, 작은 오류 e를 놓았습니다. 두 차원 예는 안전한 암호가 아닙니다." },
  { label: "첫째 행", summary: "2×1 + 3×2 + 1 = 9", note: "A의 첫 행 [2,3]을 s의 [1,2]와 차례로 곱해 더한 8에, e의 첫 값 1을 더합니다. t의 첫 칸은 9입니다." },
  { label: "둘째 행", summary: "4×1 + 1×2 + 0 = 6", note: "둘째 행 [4,1]도 같은 s와 곱하면 6이고, e의 둘째 값은 0입니다. t의 둘째 칸은 6입니다." },
  { label: "공개되는 것", summary: "A와 t = [9,6]만", note: "남에게는 A와 t만 줍니다. s와 e는 가립니다. 받은 사람은 9와 6이 곱과 오류의 합이라는 것만 압니다." },
] as const;

function Cell({ value, tone = "base" }: { value: string; tone?: "base" | "live" | "error" | "hidden" | "result" }) {
  const tones = {
    base: "border-border bg-background",
    live: "border-primary bg-primary/15 font-bold",
    error: "border-amber-600 bg-amber-600/15 font-bold",
    hidden: "border-dashed border-border text-muted-foreground",
    result: "border-primary bg-primary text-primary-foreground font-bold",
  } as const;
  return <span className={`flex h-10 w-9 items-center justify-center rounded-md border font-mono text-sm sm:h-11 sm:w-11 sm:text-base ${tones[tone]}`}>{value}</span>;
}

function Col({ head, children }: { head: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs font-bold text-muted-foreground">{head}</span>
      {children}
    </div>
  );
}

const Op = ({ text }: { text: string }) => <span className="pt-5 font-mono text-base font-bold text-muted-foreground">{text}</span>;

const A = [[2, 3], [4, 1]] as const;
const S = [1, 2] as const;
const E = [1, 0] as const;
const T = [9, 6] as const;

function Calc({ active }: { active: number }) {
  const row = active === 1 ? 0 : active === 2 ? 1 : -1;
  const hide = active === 3;
  const shown = (index: number) => active === 3 || (active >= 1 && index <= row);
  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-3">
      <Col head="A">
        {A.map((line, r) => (
          <div key={r} className="flex gap-1">
            {line.map((value, c) => <Cell key={c} value={String(value)} tone={r === row ? "live" : "base"} />)}
          </div>
        ))}
      </Col>
      <Op text="×" />
      <Col head="s">
        {S.map((value, r) => <Cell key={r} value={hide ? "?" : String(value)} tone={hide ? "hidden" : row >= 0 ? "live" : "base"} />)}
      </Col>
      <Op text="+" />
      <Col head="e">
        {E.map((value, r) => <Cell key={r} value={hide ? "?" : String(value)} tone={hide ? "hidden" : r === row ? "error" : "base"} />)}
      </Col>
      <Op text="=" />
      <Col head="t">
        {T.map((value, r) => <Cell key={r} value={shown(r) ? String(value) : ""} tone={shown(r) ? "result" : "hidden"} />)}
      </Col>
    </div>
  );
}

export default function PublicValueCalcViz() {
  return (
    <SceneShell
      eyebrow="표와 벡터의 곱"
      title="표의 한 행이 공개값의 한 칸을 만듭니다"
      description="색이 든 칸이 지금 계산에 쓰이는 숫자입니다. 값은 모두 3절의 축소 사례입니다."
      ariaLabel="공개 표 A의 각 행을 비밀 s와 곱하고 오류 e를 더해 공개값 t=[9,6]을 만드는 과정"
      scenes={SCENES}
      render={(active) => <Calc active={active} />}
    />
  );
}
