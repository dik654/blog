import SceneShell from "./SceneShell";

/**
 * 본문 대응: #precompile — EIP-196 G1 덧셈: 32바이트 칸 4개(x₁,y₁,x₂,y₂), 짧으면 오른쪽 0 채움, 남는 바이트 무시, (0,0)=O.
 * 64바이트 (1,2) → 둘째 점 O → 결과 (1,2). 빈 입력 → O+O.
 * EIP-197 페어링: 192바이트(G1 64 + G2 128) 단위, 배수가 아니면 실패 → 같은 64바이트는 실패.
 */
type SlotKind = "given" | "zero" | "extra" | "none" | "g1" | "missing";
type Slot = { kind: SlotKind; name: string; value: string };

type Scene = { label: string; summary: string; note: string; fn: string; slots: readonly Slot[]; reads: string; result: string; fail: boolean };

const blank: Slot = { kind: "none", name: "", value: "" };
const extraSlot: Slot = { kind: "extra", name: "초과", value: "무시" };

const SCENES: readonly Scene[] = [
  {
    label: "기본 128바이트",
    summary: "x₁·y₁·x₂·y₂ 네 칸",
    note: "덧셈은 두 점의 x·y를 각각 32바이트 큰 자리 우선으로 읽습니다. 어느 칸이든 좌표가 p 이상이거나 곡선에 맞지 않으면 거부합니다.",
    fn: "EIP-196 덧셈",
    slots: [
      { kind: "given", name: "x₁", value: "입력" },
      { kind: "given", name: "y₁", value: "입력" },
      { kind: "given", name: "x₂", value: "입력" },
      { kind: "given", name: "y₂", value: "입력" },
      blank,
      blank,
    ],
    reads: "P₁=(x₁,y₁), P₂=(x₂,y₂)",
    result: "P₁ + P₂",
    fail: false,
  },
  {
    label: "64바이트 (1,2)",
    summary: "오른쪽 64바이트를 0으로 채움",
    note: "(1,2)만 담은 64바이트는 뒤 두 칸이 0으로 채워집니다. 이 함수는 (0,0)을 O로 쓰므로 둘째 점은 O이고, 결과는 같은 (1,2)입니다.",
    fn: "EIP-196 덧셈",
    slots: [
      { kind: "given", name: "x₁", value: "1" },
      { kind: "given", name: "y₁", value: "2" },
      { kind: "zero", name: "x₂", value: "0 채움" },
      { kind: "zero", name: "y₂", value: "0 채움" },
      blank,
      blank,
    ],
    reads: "P₁=(1,2), P₂=(0,0)=O",
    result: "(1,2)",
    fail: false,
  },
  {
    label: "빈 입력",
    summary: "네 칸 모두 0 채움",
    note: "아무 바이트도 없으면 네 칸이 전부 0이 됩니다. 실패가 아니라 O와 O의 덧셈입니다.",
    fn: "EIP-196 덧셈",
    slots: [
      { kind: "zero", name: "x₁", value: "0 채움" },
      { kind: "zero", name: "y₁", value: "0 채움" },
      { kind: "zero", name: "x₂", value: "0 채움" },
      { kind: "zero", name: "y₂", value: "0 채움" },
      blank,
      blank,
    ],
    reads: "P₁=O, P₂=O",
    result: "O",
    fail: false,
  },
  {
    label: "128바이트 초과",
    summary: "넷째 칸 뒤는 읽지 않음",
    note: "128바이트를 넘는 부분은 무시합니다. 회색 칸의 길이는 정해진 값이 아니며 그림에서는 자리만 표시했습니다.",
    fn: "EIP-196 덧셈",
    slots: [
      { kind: "given", name: "x₁", value: "입력" },
      { kind: "given", name: "y₁", value: "입력" },
      { kind: "given", name: "x₂", value: "입력" },
      { kind: "given", name: "y₂", value: "입력" },
      extraSlot,
      extraSlot,
    ],
    reads: "앞 128바이트만 두 점으로 읽음",
    result: "P₁ + P₂",
    fail: false,
  },
  {
    label: "같은 64바이트를 페어링에",
    summary: "192바이트 단위 아님 → 실패",
    note: "EIP-197 페어링은 G1 점 64바이트와 G2 점 128바이트를 한 쌍 192바이트로 읽습니다. 길이가 192의 배수가 아니면 실패하므로 같은 64바이트가 여기서는 오류입니다. 빈 입력은 빈 곱이라 1을 돌려줍니다.",
    fn: "EIP-197 페어링",
    slots: [
      { kind: "g1", name: "G1 x", value: "1" },
      { kind: "g1", name: "G1 y", value: "2" },
      { kind: "missing", name: "G2", value: "없음" },
      { kind: "missing", name: "G2", value: "없음" },
      { kind: "missing", name: "G2", value: "없음" },
      { kind: "missing", name: "G2", value: "없음" },
    ],
    reads: "64 ÷ 192는 나누어떨어지지 않음",
    result: "실패",
    fail: true,
  },
];

const SLOT_CLASS: Record<SlotKind, string> = {
  given: "border-blue-600 bg-background",
  g1: "border-blue-600 bg-background",
  zero: "border-dashed border-amber-600",
  extra: "border-dashed border-slate-400 bg-muted/40",
  none: "border-dashed border-border/30",
  missing: "border-dashed border-red-600",
};

export default function PrecompileInputViz() {
  return (
    <SceneShell
      eyebrow="짧은 입력의 처리"
      title="같은 64바이트가 덧셈에서는 (1,2), 페어링에서는 실패입니다"
      description="칸 하나가 32바이트입니다. 파란 칸은 실제로 보낸 바이트, 주황 점선은 0으로 채운 자리, 빨간 점선은 길이가 모자란 자리입니다. (1,2)는 BN254 G1의 생성점입니다."
      ariaLabel="EIP-196 덧셈의 오른쪽 0 채움과 초과 바이트 무시, EIP-197 페어링의 192바이트 단위 규칙 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="text-xs font-semibold text-muted-foreground">{scene.fn}</div>
            <div className="grid grid-cols-6 gap-1">
              {scene.slots.map((slot, index) => (
                <div key={index} className={`min-w-0 rounded-md border px-0.5 py-2 text-center ${SLOT_CLASS[slot.kind]}`}>
                  <div className="truncate font-mono text-[11px] text-muted-foreground">{slot.name || " "}</div>
                  <div
                    className={`truncate font-mono text-xs font-bold ${
                      slot.kind === "zero" ? "text-amber-800 dark:text-amber-300" : slot.kind === "missing" ? "text-red-700 dark:text-red-400" : slot.kind === "extra" ? "text-muted-foreground" : ""
                    }`}
                  >
                    {slot.value || " "}
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-6 gap-1 font-mono text-[10px] text-muted-foreground">
              {[32, 64, 96, 128, 160, 192].map((tick, index) => (
                <span key={index} className="text-right">{active === 3 && index >= 4 ? "" : tick}</span>
              ))}
            </div>
            <div className="grid gap-2 text-xs sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:text-sm">
              <div className="min-w-0 text-muted-foreground">{scene.reads}</div>
              <div className={`rounded-lg border px-3 py-1.5 text-center font-mono font-bold ${scene.fail ? "border-red-600 text-red-700 dark:text-red-400" : "border-blue-600 text-blue-700 dark:text-blue-400"}`}>
                결과 {scene.result}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
