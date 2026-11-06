import SceneShell, { type ShellScene } from "./SceneShell";
import { Cell } from "./TextCells";

/**
 * 본문 대응: #bits-bytes — 여덟 자리의 자릿값으로 A의 01000001을 65와 41로 읽습니다.
 * 64 + 1 = 65, 0100 → 4, 0001 → 1. 같은 방식으로 11101010 → E, A.
 */
const SCENES: readonly (ShellScene & { bits: string })[] = [
  { label: "여덟 자리", summary: "2⁸ = 256가지", note: "자리마다 0 또는 1의 두 선택이 있고 자리 수만큼 곱해 256가지가 됩니다. 256가지 값을 표현한다는 말이 256개의 모든 문자를 한 byte씩 표현한다는 뜻은 아닙니다.", bits: "01000001" },
  { label: "A의 값", summary: "64 + 1 = 65", note: "1인 자리의 자릿값만 더합니다. A의 저장 비트에서는 2⁶과 2⁰, 곧 64와 1입니다.", bits: "01000001" },
  { label: "16진수로 적기", summary: "0100 0001 → 41", note: "16진수 한 자리는 네 bit를 나타내므로 byte를 네 자리씩 나눠 두 자리로 적습니다. 41은 글자 두 개가 아니라 byte 하나입니다.", bits: "01000001" },
  { label: "EA도 한 byte", summary: "1110 1010 → EA", note: "표에 나오는 EA도 같은 방식입니다. 1110은 16진수 E, 1010은 A이고 합쳐서 byte 하나입니다.", bits: "11101010" },
];

const WEIGHTS = [128, 64, 32, 16, 8, 4, 2, 1];
const HEX_DIGIT = (bits: string) => parseInt(bits, 2).toString(16).toUpperCase();

export default function ByteBitsViz() {
  return (
    <SceneShell
      eyebrow="한 byte 읽기"
      title="여덟 칸의 자릿값을 더하면 값이 되고 네 칸씩 묶으면 16진수가 됩니다"
      description="칸 위 숫자는 그 자리의 값이고, 가장 오른쪽 자리가 0번입니다."
      ariaLabel="여덟 비트의 자릿값과 16진수 표기"
      scenes={SCENES}
      render={(active) => {
        const { bits } = SCENES[active];
        const showHex = active >= 2;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-8 gap-1">
              {WEIGHTS.map((weight, index) => {
                const on = bits[index] === "1";
                return (
                  <div key={weight} className={`min-w-0 ${index === 4 ? "ml-1 sm:ml-2" : ""}`}>
                    <p className="mb-1 text-center font-mono text-[11px] text-muted-foreground">{weight}</p>
                    <Cell top={bits[index]} tone={active >= 1 && on ? "accent" : "none"} />
                  </div>
                );
              })}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:gap-3">
              {[bits.slice(0, 4), bits.slice(4)].map((part, index) => (
                <p key={index} className={`rounded-sm border border-border p-2 text-center font-mono text-sm transition-opacity motion-reduce:transition-none ${showHex ? "opacity-100" : "opacity-0"}`}>
                  {part} → <strong>{HEX_DIGIT(part)}</strong>
                </p>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
