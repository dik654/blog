import G16SceneShell from "./G16SceneShell";

/**
 * 본문 대응: #source-verify — prepare_inputs는 gamma_abc_g1[0](IC₀)에서 시작해 공개 입력과 나머지 계수점(ICₓ, ICᵧ)을 zip으로 짝짓는다.
 * 고정 0.6.0 원문의 실제 호출: [3,144] true, [3,144,999] true(999 무시), [3] false, [144,3] false.
 * 별도 호출 예제는 입력 수+1 = 공개 계수점 수(3)를 먼저 확인해 긴·짧은 배열을 public-input-count 오류로 거른다.
 */
const POINTS = ["ICₓ", "ICᵧ"] as const;

const SCENES = [
  { label: "[3, 144]", summary: "결과 true", inputs: ["3", "144"], result: "true", guard: false, note: "IC₀에서 시작해 첫 입력 3은 ICₓ, 둘째 입력 144는 ICᵧ와 짝을 지어 더합니다. 키가 정한 두 공개 자리를 모두 채웠습니다." },
  { label: "[3, 144, 999]", summary: "999는 짝이 없어 무시 · true", inputs: ["3", "144", "999"], result: "true", guard: false, note: "zip은 짧은 쪽 길이에서 멈춥니다. 999와 짝지을 계수점이 없어 읽히지 않고, 결과는 true입니다. 세 값을 모두 확인했다는 뜻이 아닙니다." },
  { label: "[3]", summary: "ICᵧ가 짝 없음 · false", inputs: ["3"], result: "false", guard: false, note: "입력이 하나뿐이면 ICᵧ와 짝지을 값이 없어 더해지지 않습니다. 실제 호출 결과는 false였습니다. 빈 배열도 false였습니다." },
  { label: "[144, 3]", summary: "순서가 바뀜 · false", inputs: ["144", "3"], result: "false", guard: false, note: "두 값이 다 있어도 144가 ICₓ, 3이 ICᵧ와 짝지어집니다. 같은 숫자라도 자리가 바뀐 다른 주장이 되어 false였습니다. [3, 145]도 false였습니다." },
  { label: "길이 검사를 넣은 예제", summary: "입력 수 + 1 = 3 먼저 확인", inputs: ["3", "144", "999"], result: "public-input-count 오류", guard: true, note: "별도 호출 예제는 짝짓기 전에 입력 수+1이 공개 계수점 수 3(IC₀ 포함)과 같은지 확인합니다. [3, 144, 999] 같은 긴 배열과 짧은 배열은 이 단계에서 오류가 납니다." },
] as const;

function Picture({ scene }: { scene: number }) {
  const s = SCENES[scene];
  const columns = [0, 1, 2] as const;
  const ok = s.result === "true";
  return (
    <div className="min-w-0 space-y-3">
      <div className="grid grid-cols-[4.5rem_repeat(3,minmax(0,1fr))] items-center gap-2 text-center text-sm">
        <span className="text-left text-xs text-muted-foreground">계수점</span>
        {columns.map((i) => {
          const point = (POINTS as readonly string[])[i];
          return (
            <span key={i} className={`rounded-md border px-1 py-2 font-mono ${point ? "border-border bg-background" : "border-dashed border-border text-muted-foreground"}`}>
              {point ?? "없음"}
            </span>
          );
        })}
        <span className="text-left text-xs text-muted-foreground">짝</span>
        {columns.map((i) => {
          const point = (POINTS as readonly string[])[i];
          const input = (s.inputs as readonly string[])[i];
          const paired = !s.guard && point !== undefined && input !== undefined;
          return (
            <span key={i} className={`font-mono text-xs ${paired ? "text-[#1d4ed8]" : "text-muted-foreground"}`}>
              {s.guard ? "—" : paired ? "× 짝" : "짝 없음"}
            </span>
          );
        })}
        <span className="text-left text-xs text-muted-foreground">공개 입력</span>
        {columns.map((i) => {
          const input = (s.inputs as readonly string[])[i];
          const ignored = !s.guard && input !== undefined && i >= POINTS.length;
          return (
            <span
              key={i}
              className={`rounded-md border px-1 py-2 font-mono ${input === undefined ? "border-dashed border-border text-muted-foreground" : ignored ? "border-[#d97706] bg-[#fef3c7]/60 text-[#b45309] line-through" : "border-border bg-background"}`}
            >
              {input ?? "없음"}
            </span>
          );
        })}
      </div>
      <div className="text-xs leading-5 text-muted-foreground">
        {s.guard ? `입력 ${s.inputs.length}개 + 1 = ${s.inputs.length + 1} ≠ 계수점 3개(IC₀·ICₓ·ICᵧ) → 짝짓기 전에 멈춤` : "vkₓ = IC₀ + (짝지은 값 × 계수점)의 합 · IC₀은 입력 없이 더함"}
      </div>
      <div className={`rounded-md border px-3 py-2 font-mono text-sm font-bold ${ok ? "border-[#16a34a] text-[#15803d]" : "border-[#dc2626] text-[#b91c1c]"}`}>
        검증 결과: {s.result}
      </div>
    </div>
  );
}

export default function ZipInputsViz() {
  return (
    <G16SceneShell
      eyebrow="공개 입력의 짝짓기"
      title="zip은 계수점 수만큼만 짝짓고 남는 입력은 읽지 않습니다"
      description="IC₀은 공개 입력 없이 시작점으로 더하는 계수점이고, ICₓ·ICᵧ는 공개값 x·y 자리의 계수점입니다(원문의 gamma_abc_g1). zip은 두 목록을 앞에서부터 하나씩 짝짓고 짧은 쪽이 끝나면 멈춥니다. 결과는 고정한 0.6.0 원문을 실제로 호출한 값입니다."
      ariaLabel="공개 입력 배열 길이와 순서에 따라 zip이 계수점과 짝짓는 방식과 검증 결과"
      scenes={SCENES}
      render={(index) => <Picture scene={index} />}
    />
  );
}
