import SceneShell from "./SceneShell";

/**
 * 본문 대응: #artifact — verifyProof가 받는 공개 신호 배열과 hashBoundParams의 결속.
 * 사례: nullifier 1개(N₂₃), commitment 2개(C₆·C₄) → inputs 길이 2 + 1 + 2 = 5.
 * inputs[0]=root, inputs[1]=H(boundParams), inputs[2+i]=nullifier, inputs[2+1+i]=commitment.
 */
const SCENES = [
  {
    label: "공개 신호 배열",
    summary: "2 + 1 + 2 = 5칸",
    note: "0번은 Merkle root, 1번은 boundParams hash, 2번부터 nullifier, 그 뒤에 새 commitment가 옵니다. nullifier가 N₂₃ 하나이므로 C₆은 2 + 1 + 0 = 3번, C₄는 4번 칸입니다.",
  },
  {
    label: "boundParams는 한 칸으로 접힙니다",
    summary: "여섯 묶음 → H → inputs[1]",
    note: "아래 여섯 묶음을 hashBoundParams가 값 하나로 묶어 1번 칸에 넣습니다. 칸은 하나지만 안의 어느 자료가 바뀌어도 그 칸의 값이 달라집니다.",
  },
  {
    label: "묶지 않았다면 (가정)",
    summary: "proof 통과 · 암호문은 바뀐 채",
    note: "암호문이 hash 밖의 별도 payload라고 가정합니다. 유효한 proof는 두고 암호문만 다른 수신 자료로 바꿔 붙여도 다섯 칸이 같아 검증이 통과합니다. 본문이 말하는 ‘바꿔 붙이는 경계’가 이 틈입니다.",
  },
  {
    label: "이 소스처럼 묶으면",
    summary: "H 값이 달라져 검증 실패",
    note: "선택한 소스에서는 암호문이 boundParams 안에 있습니다. 암호문을 바꾸면 1번 칸이 proof를 만들 때의 값과 어긋나 verifyProof가 실패해야 합니다. chain ID를 바꿔 붙여도 같은 칸이 어긋납니다.",
  },
] as const;

const PARAMS = ["tree number", "최소 gas price", "unshield 종류", "chain ID", "adapt contract·params", "output 암호문 배열"] as const;

function Slot({ index, name, short, value, state }: { index: string; name: string; short: string; value: string; state: "plain" | "focus" | "bad" | "dim" }) {
  const tone =
    state === "focus"
      ? "border-primary bg-primary/[0.06]"
      : state === "bad"
        ? "border-red-600 bg-red-600/[0.06]"
        : state === "dim"
          ? "border-border text-muted-foreground"
          : "border-foreground/30 bg-background";
  return (
    <div className={`min-w-0 rounded-md border px-1 py-2 text-center ${tone}`}>
      <span className="block font-mono text-[10px] text-muted-foreground">[{index}]</span>
      <strong className="mt-1 block whitespace-nowrap font-mono text-xs sm:text-sm">{value}</strong>
      <span className="mt-1 block break-keep text-[10px] leading-4 text-muted-foreground sm:hidden">{short}</span>
      <span className="mt-1 hidden break-keep text-[10px] leading-4 text-muted-foreground sm:block">{name}</span>
    </div>
  );
}

export default function BoundParamsBindingViz() {
  return (
    <SceneShell
      eyebrow="공개 신호의 결속"
      title="암호문을 바꿔 붙이면 어느 칸이 어긋나는지 따라갑니다"
      description="위 줄은 proof 검증 때 맞춰 보는 공개 신호 배열, 아래는 그 1번 칸으로 접히는 boundParams입니다. 사례는 nullifier 1개·commitment 2개입니다."
      note="공개 신호는 proof가 검증 때 맞춰 보는 공개 값입니다. N₂₃·C₆·C₄·R100은 설명용 값입니다. ‘묶지 않았다면’ 장면은 비교를 위한 가정이며 선택한 소스의 동작이 아닙니다."
      ariaLabel="Railgun 공개 신호 배열과 boundParams hash가 암호문 치환을 막는 과정"
      scenes={SCENES}
      render={(active) => {
        const unbound = active === 2;
        const swapped = active >= 2;
        const hashBroken = active === 3;
        const slots = [
          { index: "0", name: "Merkle root", short: "root", value: "R100" },
          { index: "1", name: "boundParams hash", short: "hash", value: hashBroken ? "H′ ≠ H" : "H" },
          { index: "2", name: "nullifier", short: "null.", value: "N₂₃" },
          { index: "3", name: "commitment", short: "출력", value: "C₆" },
          { index: "4", name: "commitment", short: "출력", value: "C₄" },
        ];
        const verdict = active < 2 ? "proof가 만들어질 때와 같은 다섯 칸" : unbound ? "다섯 칸이 그대로 → 검증 통과" : "1번 칸 불일치 → 검증 실패";
        const verdictTone = active < 2 ? "text-muted-foreground" : unbound ? "text-amber-700 dark:text-amber-400" : "text-red-700 dark:text-red-400";
        return (
          <div className="min-w-0 space-y-4">
            <div>
              <p className="mb-2 font-mono text-[10px] font-bold text-muted-foreground">inputs · verifyProof(verifyingKey, proof, inputs)</p>
              <div className="grid grid-cols-5 gap-1 sm:gap-2">
                {slots.map((slot) => (
                  <Slot
                    key={slot.index}
                    {...slot}
                    state={slot.index === "1" ? (hashBroken ? "bad" : active === 1 ? "focus" : "plain") : active === 0 && slot.index !== "1" ? "focus" : "plain"}
                  />
                ))}
              </div>
              <p className={`mt-2 text-xs font-semibold ${verdictTone}`}>{verdict}</p>
            </div>

            <div className={`rounded-lg border p-3 ${active === 0 ? "border-border/60" : "border-border bg-background"}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <span className="font-mono text-[10px] font-bold text-muted-foreground">BoundParams → hashBoundParams</span>
                <span className="text-[11px] text-muted-foreground">{unbound ? "가정: 암호문을 묶음 밖에 둠" : "→ inputs[1]"}</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-1 sm:grid-cols-3">
                {PARAMS.map((param) => {
                  const isCipher = param === "output 암호문 배열";
                  const outside = isCipher && unbound;
                  const changed = isCipher && swapped;
                  return (
                    <div
                      key={param}
                      className={`min-w-0 rounded-md border px-2 py-1 text-[11px] leading-4 ${
                        outside ? "border-dashed border-amber-600" : changed ? "border-red-600" : active >= 1 ? "border-primary/50" : "border-border text-muted-foreground"
                      }`}
                    >
                      <span className="break-keep">{param}</span>
                      {changed ? <span className="font-semibold text-red-700 dark:text-red-400"> · 교체됨</span> : null}
                      {outside ? <span className="font-semibold text-amber-700 dark:text-amber-400"> · hash 밖</span> : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
