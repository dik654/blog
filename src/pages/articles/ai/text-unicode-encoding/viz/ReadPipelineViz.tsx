import type { ReactNode } from "react";
import SceneShell, { type ShellScene } from "./SceneShell";
import { Cell } from "./TextCells";
import { NFC_ITEMS, RAW_ITEMS } from "./textCellData";

/**
 * 본문 대응: #black-box — 입구의 저장 값이 네 상자를 지나 원문 위 색칠이 되는 흐름.
 * 원문 열은 덮어쓰지 않고, 비교용 글에서 찾은 2~3 앞을 원문 3~4 앞에 연결합니다.
 */
const SCENES: readonly ShellScene[] = [
  { label: "번호로 읽기", summary: "저장 값 11칸 → 번호 5개", note: "첫 상자는 정해진 규칙으로 저장 값의 열을 문자 번호의 열로 읽습니다." },
  { label: "비교용 글 만들기", summary: "번호 5개 → 새 열 4개", note: "둘째 상자는 비교할 때 같게 취급할 표현을 정해 새 열을 만들고, 원문 열은 덮어쓰지 않습니다." },
  { label: "범위 연결", summary: "새 글 2~3 앞 ↔ 원문 3~4 앞", note: "셋째 상자는 새 열의 범위를 원래 열에 연결합니다. 어느 글의 어떤 칸인지, 끝 칸을 포함하는지도 함께 넘깁니다." },
  { label: "원문에 색칠", summary: "입력한 표현 그대로 표시", note: "마지막 상자는 원문에 색을 칠합니다. 같은 가인지는 실제로 잘라 읽어 보는 검사가 더 직접적입니다." },
];

function Stage({ title, on, children }: { title: string; on: boolean; children: ReactNode }) {
  return (
    <div className={`grid min-w-0 grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-1.5 transition-opacity duration-300 motion-reduce:transition-none sm:grid-cols-[6rem_minmax(0,1fr)] ${on ? "opacity-100" : "opacity-25"}`}>
      <p className="text-[11px] font-semibold leading-4 text-muted-foreground sm:text-xs">{title}</p>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

const BYTES = RAW_ITEMS.flatMap((item) => item.bytes);

export default function ReadPipelineViz() {
  return (
    <SceneShell
      eyebrow="입구에서 색칠까지"
      title="원문과 비교용 글을 둘 다 들고 가의 범위를 연결합니다"
      description="위에서 아래로 진행합니다. 41, CC 같은 두 글자는 저장 칸 하나의 값이고, 칸 아래 숫자는 0부터 센 위치입니다."
      note="‘2~3 앞’은 2번에서 시작해 3번 바로 앞에서 끝난다는 뜻입니다. 점선 ◌는 악센트의 보조 그림입니다."
      ariaLabel="저장 값을 번호로 읽고 비교용 글을 만들어 범위를 연결한 뒤 원문에 색칠하는 네 단계"
      scenes={SCENES}
      render={(active) => (
        <div className="space-y-2">
          <Stage title="입구 저장 값" on>
            <div className="grid gap-px" style={{ gridTemplateColumns: "repeat(11, minmax(0, 1fr))" }}>
              {BYTES.map((hex, index) => (
                <Cell key={index} top={<span className="text-[9px] sm:text-xs">{hex}</span>} />
              ))}
            </div>
          </Stage>
          <Stage title="상자 1 원문 번호" on>
            <div className="grid grid-cols-5 gap-1">
              {RAW_ITEMS.map((item, index) => (
                <Cell key={index} top={item.glyph} bottom={index} dashed={index === 2} tone={active >= 2 && index === 3 ? "accent" : "none"} />
              ))}
            </div>
          </Stage>
          <Stage title="상자 2 비교용 글" on={active >= 1}>
            <div className="grid grid-cols-5 gap-1">
              {NFC_ITEMS.map((item, index) => (
                <Cell key={index} top={item.glyph} bottom={index} tone={active >= 2 && index === 2 ? "accent" : "none"} />
              ))}
            </div>
          </Stage>
          <Stage title="상자 3 범위" on={active >= 2}>
            <div className="grid grid-cols-2 gap-1 text-[11px] leading-4 sm:text-xs">
              <p className="min-w-0 rounded-sm border border-border px-1.5 py-1">
                비교용 글 번호
                <strong className="block font-mono">2~3 앞</strong>
              </p>
              <p className="min-w-0 rounded-sm border border-border px-1.5 py-1">
                원문 번호
                <strong className="block font-mono">3~4 앞</strong>
              </p>
            </div>
          </Stage>
          <Stage title="상자 4 화면" on={active >= 3}>
            <div className="grid grid-cols-5 gap-1">
              {["A", "é", "가", "😀"].map((glyph, index) => (
                <Cell key={index} top={glyph} tone={active >= 3 && index === 2 ? "accent" : "none"} />
              ))}
            </div>
          </Stage>
        </div>
      )}
    />
  );
}
