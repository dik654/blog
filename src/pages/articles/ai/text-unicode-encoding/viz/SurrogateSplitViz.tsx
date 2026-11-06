import SceneShell, { type ShellScene } from "./SceneShell";
import { Cell } from "./TextCells";

/**
 * 본문 대응: #source-units — c = 1F600, x = F600(62976), 몫 61, 나머지 512,
 * D800+61 = D83D, DC00+512 = DE00. slice(4,6) = 😀, slice(4,5) → EF BF BD.
 */
const SCENES: readonly ShellScene[] = [
  { label: "기준 빼기", summary: "1F600 − 10000 = F600", note: "16진수 10000 이상인 번호에서 기준값을 뺍니다. 남은 x는 10진수로 62976이고 20 bit에 들어갑니다." },
  { label: "10 bit씩 나누기", summary: "몫 61 · 나머지 512", note: "1024로 나누는 것이 위 10 bit와 아래 10 bit를 가르는 일입니다. 몫이 61, 나머지가 512입니다." },
  { label: "시작값 더하기", summary: "D83D · DE00", note: "두 값은 두 문자가 아니라 하나의 번호를 저장하는 두 단위입니다. 61과 512는 10진수, D800은 16진수입니다." },
  { label: "둘 다 잘라내기", summary: "slice(4,6) → 😀", note: "원문에서 😀는 UTF-16 [4,6)에 있습니다. 두 칸을 함께 자르면 그대로 😀입니다." },
  { label: "한 칸만 잘라내기", summary: "slice(4,5) → EF BF BD", note: "[4,5)만 자르면 D83D 하나가 남습니다. 이번 Node의 UTF-8 변환에서는 대체 문자의 EF BF BD가 나왔습니다." },
];

const HIGH = "0000111101";
const LOW = "1000000000";
const UNITS = ["0041", "0065", "0301", "AC00", "D83D", "DE00"];

function Bits({ bits, on, tone }: { bits: string; on: boolean; tone: "accent" | "warn" }) {
  return (
    <div className="grid gap-px" style={{ gridTemplateColumns: "repeat(10, minmax(0, 1fr))" }}>
      {bits.split("").map((bit, index) => (
        <Cell key={index} top={bit} tone={on ? tone : "faint"} />
      ))}
    </div>
  );
}

export default function SurrogateSplitViz() {
  return (
    <SceneShell
      eyebrow="UTF-16 두 단위"
      title="😀의 번호를 10 bit씩 나눠 두 칸에 담습니다"
      description="위 두 줄이 기준을 뺀 x의 20 bit이고, 그 아래가 두 단위의 값과 원문의 UTF-16 칸입니다."
      ariaLabel="U+1F600을 UTF-16 두 단위로 나누는 계산과 한 칸만 잘랐을 때의 결과"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-2">
          <div>
            <p className="mb-1 flex justify-between gap-2 text-xs text-muted-foreground">
              <span>위 10 bit</span>
              <span className={`font-mono ${active >= 1 ? "" : "opacity-0"}`}>= 61</span>
            </p>
            <Bits bits={HIGH} on={active >= 1} tone="accent" />
          </div>
          <div>
            <p className="mb-1 flex justify-between gap-2 text-xs text-muted-foreground">
              <span>아래 10 bit</span>
              <span className={`font-mono ${active >= 1 ? "" : "opacity-0"}`}>= 512</span>
            </p>
            <Bits bits={LOW} on={active >= 1} tone="warn" />
          </div>
          <div className={`grid grid-cols-2 gap-2 font-mono text-xs ${active >= 2 ? "" : "opacity-0"}`}>
            <p className="rounded-sm border border-border p-2">D800 + 61 = <strong>D83D</strong></p>
            <p className="rounded-sm border border-border p-2">DC00 + 512 = <strong>DE00</strong></p>
          </div>
          <div className={active >= 3 ? "" : "opacity-0"}>
            <p className="mb-1 text-xs text-muted-foreground">원문의 UTF-16 칸</p>
            <div className="grid grid-cols-6 gap-px">
              {UNITS.map((unit, index) => (
                <Cell key={unit} top={unit} bottom={index} tone={active === 3 && index >= 4 ? "accent" : active === 4 && index === 4 ? "bad" : "none"} />
              ))}
            </div>
          </div>
        </div>
      )}
    />
  );
}
