import SceneShell, { type ShellScene } from "./SceneShell";
import { Cell } from "./TextCells";
import { RAW_ITEMS } from "./textCellData";

/**
 * 본문 대응: #source-decode — utf8proc_iterate가 돌려준 소비 길이 1, 1, 2, 3, 4를 더해
 * byte 시작 위치 0, 1, 2, 4, 7을 얻습니다. 오류 값 −3은 위치에 더하지 않습니다.
 */
const BYTES = RAW_ITEMS.flatMap((item) => item.bytes);
const NUMBERS = ["U+0041", "U+0065", "U+0301", "U+AC00", "U+1F600"];
const STARTS = [0, 1, 2, 4, 7];

const SCENES: readonly ShellScene[] = [
  { label: "첫 호출", summary: "U+0041 · 소비 1", note: "남은 입력 길이와 현재 주소를 넘기면 41에서 U+0041과 소비 길이 1이 나옵니다." },
  { label: "둘째 호출", summary: "U+0065 · 소비 1", note: "호출자가 1만큼 옮긴 주소에서 65를 읽습니다." },
  { label: "셋째 호출", summary: "U+0301 · 소비 2", note: "CC 81을 읽어 소비 길이 2를 돌려받습니다. 다음 주소는 2+2=4입니다." },
  { label: "넷째 호출", summary: "U+AC00 · 소비 3", note: "가의 시작 4는 앞서 돌려받은 길이를 더한 값이며 코드 포인트 번호 3을 그대로 복사한 값이 아닙니다." },
  { label: "다섯째 호출", summary: "U+1F600 · 소비 4", note: "마지막 네 byte를 읽으면 위치가 7+4=11이 되어 입력 끝에 닿습니다. 시작 위치는 0, 1, 2, 4, 7입니다." },
  { label: "불량 입력", summary: "ED A0 80 → −3", note: "별도 불량 입력은 오류 값 −3으로 거부됩니다. 음수 반환값은 위치에 더하지 않고 중단합니다." },
];

export default function IterateWalkViz() {
  return (
    <SceneShell
      eyebrow="해독 순회"
      title="돌려받은 소비 길이를 더해 다음 byte 위치로 옮깁니다"
      description="파란 칸이 이번 호출이 읽은 byte입니다. 아래 다섯 칸에는 호출마다 얻은 byte 시작 위치와 코드 포인트가 쌓입니다."
      ariaLabel="utf8proc_iterate 호출마다 byte 위치가 이동하는 과정과 오류 시 중단"
      scenes={SCENES}
      render={(active) => {
        const failed = active === 5;
        const start = failed ? 0 : STARTS[active];
        const end = failed ? 3 : (STARTS[active + 1] ?? BYTES.length);
        const cells = failed ? ["ED", "A0", "80"] : BYTES;
        return (
          <div className="min-w-0 space-y-3">
            <p className="text-xs text-muted-foreground">{failed ? "불량 입력의 byte" : "원문의 byte"}</p>
            <div className="grid gap-px" style={{ gridTemplateColumns: "repeat(11, minmax(0, 1fr))" }}>
              {Array.from({ length: 11 }, (_, index) =>
                index < cells.length ? (
                  <Cell key={index} top={cells[index]} bottom={index} tone={index >= start && index < end ? (failed ? "bad" : "accent") : "none"} />
                ) : (
                  <span key={index} className="min-h-9" />
                ),
              )}
            </div>
            <div className="grid grid-cols-5 gap-1">
              {STARTS.map((value, index) => {
                const shown = failed ? false : index <= active;
                return (
                  <Cell
                    key={value}
                    top={shown ? NUMBERS[index] : "·"}
                    bottom={shown ? `시작 ${value}` : " "}
                    tone={!failed && index === active ? "accent" : "none"}
                  />
                );
              })}
            </div>
            <p className="min-h-5 font-mono text-xs font-bold">
              {failed ? "반환 −3 → 위치 더하지 않음 · 중단" : `다음 위치 = ${start} + ${end - start} = ${end}`}
            </p>
          </div>
        );
      }}
    />
  );
}
