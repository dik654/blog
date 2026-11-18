import SceneShell from "./SceneShell";

/**
 * 본문 대응: #finality — justification_finalization.go(사이드바)의 bit shift·mask 검사.
 * epoch 10을 끝내는 처리. 기존 bits 0011, old current justified = 9, old previous justified = 8 (가정).
 * Shift(1) → 0110, 이전 epoch 9 통과(가정)·현재 epoch 10 3×64 ≥ 2×96 → 0111.
 * 1110 ✗ · 0110 ✓(8+2=10) → 8 · 0111 ✓ but 9+2=11≠10 · 0011 ✓(9+1=10) → 9. 뒤 검사가 덮어 finalized = 9.
 * 대조: 기존 0000, 이전 epoch 미달(가정) → 0001, 어떤 mask도 못 채움.
 */
type Check = { mask: string; source: string; distance: string; pass: boolean | null; result: string };

const IDLE: readonly Check[] = [
  { mask: "1110", source: "old previous", distance: "+3", pass: null, result: "" },
  { mask: "0110", source: "old previous", distance: "+2", pass: null, result: "" },
  { mask: "0111", source: "old current", distance: "+2", pass: null, result: "" },
  { mask: "0011", source: "old current", distance: "+1", pass: null, result: "" },
];

const MAIN: readonly Check[] = [
  { mask: "1110", source: "old previous", distance: "+3", pass: false, result: "bit 3이 0" },
  { mask: "0110", source: "old previous", distance: "+2", pass: true, result: "8+2=10 → epoch 8" },
  { mask: "0111", source: "old current", distance: "+2", pass: false, result: "9+2=11 ≠ 10" },
  { mask: "0011", source: "old current", distance: "+1", pass: true, result: "9+1=10 → epoch 9" },
];

const EMPTY: readonly Check[] = IDLE.map((check) => ({ ...check, pass: false, result: "bit 부족" }));

const SCENES = [
  {
    label: "기존 history",
    summary: "bits 0011 (가정)",
    bits: ["0", "0", "1", "1"],
    epochs: ["6", "7", "8", "9"],
    dropped: "",
    checks: IDLE,
    finalized: "이전 값",
    note: "Epoch 10을 끝내기 직전 bits를 0011로 둡니다(가정). 오른쪽 bit 0이 가장 최근 epoch 9입니다. 이전 current justified checkpoint는 epoch 9, previous justified는 epoch 8로 둡니다(가정).",
  },
  {
    label: "한 칸 이동",
    summary: "0011 → 0110",
    bits: ["0", "1", "1", "·"],
    epochs: ["7", "8", "9", "10"],
    dropped: "epoch 6의 bit는 밀려나 버려짐",
    checks: IDLE,
    finalized: "이전 값",
    note: "Shift(1)로 모든 bit가 한 칸 오래된 쪽으로 갑니다. 이제 bit 1이 이전 epoch 9, 비어 있는 bit 0이 현재 epoch 10 자리입니다.",
  },
  {
    label: "2/3 기록",
    summary: "0110 → 0111",
    bits: ["0", "1", "1", "1"],
    epochs: ["7", "8", "9", "10"],
    dropped: "",
    checks: IDLE,
    finalized: "이전 값",
    note: "Epoch 9도 2/3을 넘었다고 두면(가정) bit 1은 1입니다. Epoch 10은 3×64 = 192 ≥ 2×96 = 192라 bit 0이 섭니다. 여기까지는 justified 후보만 바뀝니다.",
  },
  {
    label: "mask와 거리 검사",
    summary: "finalized = epoch 9",
    bits: ["0", "1", "1", "1"],
    epochs: ["7", "8", "9", "10"],
    dropped: "",
    checks: MAIN,
    finalized: "epoch 9",
    note: "Bit 모양이 맞아도 기존 checkpoint epoch + 거리가 현재 epoch 10이어야 통과합니다. 0110(→ 8)과 0011(→ 9)이 통과하고, 뒤 검사가 앞 결과를 덮어 epoch 9가 finalized됩니다.",
  },
  {
    label: "history가 비어 있었다면",
    summary: "0000 → 0001 · finalized 그대로",
    bits: ["0", "0", "0", "1"],
    epochs: ["7", "8", "9", "10"],
    dropped: "",
    checks: EMPTY,
    finalized: "바뀌지 않음",
    note: "기존 bits가 0000이고 이전 epoch가 미달이었다면(가정) 같은 3×64 = 2×96 통과로도 0001만 됩니다. 네 mask는 모두 bit 두 개 이상을 요구하므로 finalization은 일어나지 않습니다.",
  },
] as const;

export default function FinalityBitsViz() {
  return (
    <SceneShell
      eyebrow="Justification bits · Prysm v7.3.1"
      title="2/3 통과는 bit 하나를 세우고, finality는 bit 모양과 거리로 정합니다"
      description="칸 넷이 최근 네 epoch의 justified 여부(4-bit history)입니다. Justified는 target 참여가 2/3 이상인 checkpoint, finalized는 되돌릴 수 없게 확정된 checkpoint입니다. 0011처럼 왼쪽이 bit 3, 오른쪽이 bit 0입니다. 기존 bits와 checkpoint는 설명용 가정입니다."
      ariaLabel="4-bit justification history를 이동하고 기록한 뒤 mask와 epoch 거리로 finalized checkpoint를 정하는 다섯 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-4 gap-1.5">
              {scene.bits.map((bit, index) => (
                <div key={index} className={`rounded-lg border bg-background py-2 text-center ${bit === "1" ? "border-primary" : "border-border"}`}>
                  <span className="block font-mono text-[10px] text-muted-foreground">bit {3 - index}</span>
                  <strong className={`block font-mono text-xl ${bit === "1" ? "text-primary" : "text-muted-foreground"}`}>{bit}</strong>
                  <span className="block text-[11px] text-muted-foreground">epoch {scene.epochs[index]}</span>
                </div>
              ))}
            </div>
            <p className="mt-1 min-h-5 text-right text-[11px] text-amber-700 dark:text-amber-400">{scene.dropped}</p>
            <ol className="mt-2 grid gap-1">
              {scene.checks.map((check) => (
                <li
                  key={check.mask}
                  className={`grid grid-cols-[2.75rem_minmax(0,1fr)_minmax(0,1fr)] items-center gap-2 rounded border bg-background px-2 py-1.5 text-[11px] ${
                    check.pass === true ? "border-primary" : "border-border"
                  } ${check.pass === null ? "text-muted-foreground" : ""}`}
                >
                  <strong className="font-mono">{check.mask}</strong>
                  <span className="break-keep">{check.source} {check.distance} = 10?</span>
                  <span className={`break-keep text-right ${check.pass === true ? "font-bold text-primary" : check.pass === false ? "text-muted-foreground" : ""}`}>
                    {check.pass === null ? "검사 전" : `${check.pass ? "✓" : "✗"} ${check.result}`}
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-2 flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-xs">
              <span className="text-muted-foreground">finalized checkpoint</span>
              <strong className="text-primary">{scene.finalized}</strong>
            </div>
          </div>
        );
      }}
    />
  );
}
