import SceneShell, { type ShellScene } from "./SceneShell";
import { Cell, type Tone } from "./TextCells";

/**
 * 본문 대응: #utf-8 — U+AC00 = 44032 = 1010 110000 000000.
 * 1110+1010 = EA, 10+110000 = B0, 10+000000 = 80. 되돌리면 10·4096 + 48·64 + 0 = 44032.
 */
const SCENES: readonly ShellScene[] = [
  { label: "번호", summary: "U+AC00 = 44032", note: "가의 번호를 2진수 열여섯 자리로 적었습니다. 한 byte에는 여덟 자리뿐이고 표시 자리도 필요하므로 여러 byte에 나눕니다." },
  { label: "4·6·6으로 나누기", summary: "1010 · 110000 · 000000", note: "앞에서부터 4 bit, 6 bit, 6 bit로 자릅니다. 세 묶음을 색과 위치로 따라가 보세요." },
  { label: "표시 붙이기", summary: "EA · B0 · 80", note: "맨 앞 1110은 세 byte 형식의 시작 표시, 10은 이어지는 byte라는 표시입니다. 표시를 붙이면 세 묶음이 각각 8 bit가 됩니다." },
  { label: "되돌리기", summary: "10·4096 + 48·64 + 0 = 44032", note: "표시를 떼면 10, 48, 0이 남고 원래 자리로 옮겨 합치면 같은 번호입니다. 다만 표시 모양만 떼어 숫자를 얻는 것으로는 과잉 길이·surrogate·범위 초과를 걸러내지 못하므로 유효 형식 검사가 먼저입니다." },
];

const PAYLOADS: readonly { bits: string; tone: Tone; prefix: string; hex: string; value: number; weight: string }[] = [
  { bits: "1010", tone: "accent", prefix: "1110", hex: "EA", value: 10, weight: "× 4096" },
  { bits: "110000", tone: "warn", prefix: "10", hex: "B0", value: 48, weight: "× 64" },
  { bits: "000000", tone: "ok", prefix: "10", hex: "80", value: 0, weight: "× 1" },
];

export default function Utf8SplitViz() {
  return (
    <SceneShell
      eyebrow="세 byte로 나누기"
      title="가의 번호 비트를 세 묶음으로 나누고 표시를 붙이면 EA B0 80입니다"
      description="칸 하나가 bit 하나입니다. 색칠한 칸은 번호에서 온 자리이고 색이 없는 칸은 형식을 알리는 표시입니다."
      ariaLabel="가의 번호를 4, 6, 6 비트로 나눠 UTF-8 세 byte를 만드는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-4">
          <div className="grid gap-px" style={{ gridTemplateColumns: "repeat(16, minmax(0, 1fr))" }}>
            {PAYLOADS.flatMap((part) => part.bits.split("").map((bit) => ({ bit, tone: part.tone }))).map((cell, index) => (
              <Cell key={index} top={cell.bit} tone={active >= 1 ? cell.tone : "faint"} className="px-0" />
            ))}
          </div>
          <div className="space-y-2">
            {PAYLOADS.map((part) => (
              <div key={part.hex} className="grid grid-cols-[minmax(0,1fr)_4.75rem] items-center gap-2 sm:grid-cols-[minmax(0,1fr)_9rem]">
                <div className="grid gap-px" style={{ gridTemplateColumns: "repeat(8, minmax(0, 1fr))" }}>
                  {part.prefix.split("").map((bit, index) => (
                    <span key={`p${index}`} className={active >= 2 ? "" : "opacity-0"}>
                      <Cell top={bit} />
                    </span>
                  ))}
                  {part.bits.split("").map((bit, index) => (
                    <span key={`b${index}`} className={active >= 1 ? "" : "opacity-0"}>
                      <Cell top={bit} tone={part.tone} />
                    </span>
                  ))}
                </div>
                <p className={`min-w-0 text-right font-mono text-sm font-bold ${active >= 2 ? "" : "opacity-0"}`}>
                  <span>{part.hex}</span>
                  <span className={`block text-[11px] font-normal text-muted-foreground sm:ml-2 sm:inline ${active >= 3 ? "" : "opacity-0"}`}>
                    {part.value} {part.weight}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    />
  );
}
