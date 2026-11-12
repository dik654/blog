import SceneShell from "./SceneShell";

/**
 * 본문 대응: #evidence — SigCgt 0000000000010002를 비트로 펼쳐 SIGTERM 자리(0x4000)가 비었는지 읽는다.
 * 앞 11자리는 0이므로 끝 5자리(비트 19~0)만 펼친다.
 * 0x10002 = 비트 16 + 비트 1 → 신호 17, 신호 2. SIGTERM 15 → 비트 14 = 0x4000 → 0.
 */
const HEX = "0000000000010002";
const TAIL = HEX.slice(-5); // "10002"
const GROUPS = TAIL.split("").map((digit, k) => {
  const value = parseInt(digit, 16);
  const groupIndex = TAIL.length - 1 - k; // 4 … 0, 왼쪽이 높은 자리
  const bits = [3, 2, 1, 0].map((b) => ({ bit: groupIndex * 4 + b, on: ((value >> b) & 1) === 1 }));
  return { digit, groupIndex, bits };
});
const SIGTERM_BIT = 15 - 1;

const SCENES = [
  {
    label: "16진 한 자리 = 비트 4개",
    summary: "…0001 0002 → 끝 5자리만 펼침",
    note: "SigCgt는 처리기를 둔 신호를 64비트로 표시한 값을 16진수 16자리로 적은 것입니다. 앞 11자리는 0이라 끝 5자리, 곧 비트 19부터 비트 0까지만 펼쳤습니다. 각 칸 아래 숫자는 그 비트가 뜻하는 신호 번호(비트 + 1)입니다.",
  },
  {
    label: "켜진 비트",
    summary: "비트 1 → 신호 2 · 비트 16 → 신호 17",
    note: "맨 끝 자리 2는 0010이라 비트 1이 켜져 있고, 끝에서 다섯째 자리 1은 비트 16입니다. 신호 N은 비트 N − 1이므로 처리기가 있는 신호는 2(SIGINT)와 17, 두 개뿐입니다.",
  },
  {
    label: "SIGTERM 자리",
    summary: "비트 14 = 0x4000 → 0, 처리기 없음",
    note: "SIGTERM 15는 비트 14이고, 비트 12~15를 맡는 끝에서 넷째 자리에서 0100 = 4에 해당해 0x4000으로 적습니다. 그 자리가 0이므로 PID 1에 SIGTERM 처리기가 없다는 7절의 조건이 출력으로 확인됩니다.",
  },
] as const;

export default function SigMaskDecodeViz() {
  return (
    <SceneShell
      eyebrow="/proc/1/status · SigCgt"
      title="SigCgt 끝자리 10002를 비트로 펼치면 SIGTERM 자리가 비어 있습니다"
      description="본문의 예시 출력 SigCgt 0000000000010002를 펼칩니다. 위 글자는 16진 한 자리, 그 아래 네 칸은 그 자리가 맡는 비트(왼쪽이 높은 비트), 칸 아래 숫자는 신호 번호입니다. 파란 칸은 켜진 비트, 빨간 테두리는 SIGTERM 자리입니다."
      ariaLabel="SigCgt 16진 값을 비트로 펼쳐 SIGTERM 비트가 0인지 확인"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <p className="break-all font-mono text-xs text-muted-foreground sm:text-sm">
            SigCgt: <span className="text-muted-foreground/60">{HEX.slice(0, -5)}</span>
            <span className="font-bold text-foreground">{TAIL}</span>
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-1.5 sm:gap-2">
            {GROUPS.map((g) => {
              const hasTerm = g.bits.some((b) => b.bit === SIGTERM_BIT);
              const groupMark = active === 2 && hasTerm;
              return (
                <div key={g.groupIndex} className={`rounded-lg border px-0.5 py-1.5 sm:px-1 ${groupMark ? "border-[#dc2626]" : "border-border"}`}>
                  <p className="text-center font-mono text-sm font-bold">{g.digit}</p>
                  <div className="mt-1 flex gap-0.5">
                    {g.bits.map((b) => {
                      const lit = active >= 1 && b.on;
                      const term = active === 2 && b.bit === SIGTERM_BIT;
                      return (
                        <div key={b.bit} className="flex w-[0.95rem] flex-col items-center sm:w-5">
                          <span className="font-mono text-[9px] text-muted-foreground">{b.bit}</span>
                          <span
                            className={`flex h-6 w-full items-center justify-center rounded-sm border font-mono text-xs ${
                              term ? "border-[#dc2626] text-[#b91c1c] dark:text-[#fca5a5]" : lit ? "border-[#2563eb] bg-[#2563eb]/15 font-bold" : "border-border"
                            }`}
                          >
                            {b.on ? 1 : 0}
                          </span>
                          <span className={`mt-0.5 font-mono text-[9px] ${lit || term ? "font-bold text-foreground" : "text-muted-foreground/70"}`}>{b.bit + 1}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-2 gap-y-1 text-xs sm:text-sm">
            <span className="text-muted-foreground">비트 번호</span>
            <span>칸 위 작은 숫자</span>
            <span className="text-muted-foreground">신호 번호</span>
            <span>칸 아래 숫자 = 비트 + 1</span>
          </div>
        </div>
      )}
    />
  );
}
