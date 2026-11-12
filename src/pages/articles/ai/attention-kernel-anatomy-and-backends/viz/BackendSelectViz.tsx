import SceneShell from "./SceneShell";

/**
 * 본문 대응: #backend-source (17절) — vLLM CUDA 선택 함수의 명시 선택과 자동 선택 분기.
 * 글의 CPU 실험: A=FLASH_ATTN head_size 미지원, B=FLASHINFER 지원(가짜 판정) → 자동 B, A 명시 예외.
 * 전부 부적합하면 자동 선택도 예외.
 */
type Check = "pass" | "fail" | "skip";
type Scene = {
  label: string;
  summary: string;
  note: string;
  branch: "auto" | "explicit";
  a: Check;
  b: Check;
  result: string;
  error: boolean;
};

const SCENES: readonly Scene[] = [
  {
    label: "지정 없음 · 자동 선택",
    summary: "B 반환",
    note: "selected_backend가 없으면 후보 목록을 모두 검사합니다. A는 head_size 때문에 부적합, B는 통과입니다. 통과한 후보 중 priority가 가장 작은 B를 고릅니다.",
    branch: "auto",
    a: "fail",
    b: "pass",
    result: "B(FLASHINFER) 반환",
    error: false,
  },
  {
    label: "A를 명시",
    summary: "ValueError · B로 넘어가지 않음",
    note: "selected_backend로 A를 지정하면 A 하나만 검사합니다. 부적합 이유가 있으므로 B를 보지 않고 ValueError로 끝납니다. 자동 선택과 결과가 다릅니다.",
    branch: "explicit",
    a: "fail",
    b: "skip",
    result: "ValueError",
    error: true,
  },
  {
    label: "자동인데 전부 부적합",
    summary: "이때도 예외",
    note: "지정이 없어도 후보 목록에서 통과한 것이 하나도 없으면 고를 후보가 없어 예외입니다. 이 장면의 B 부적합 판정은 분기를 보이려는 가정입니다.",
    branch: "auto",
    a: "fail",
    b: "fail",
    result: "예외",
    error: true,
  },
];

const MARK: Record<Check, string> = { pass: "통과", fail: "부적합", skip: "검사 안 함" };

function Candidate({ name, detail, check, reason }: { name: string; detail: string; check: Check; reason?: string }) {
  const tone =
    check === "pass"
      ? "border-[#16a34a] text-[#15803d] dark:text-[#4ade80]"
      : check === "fail"
        ? "border-[#dc2626] text-[#b91c1c] dark:text-[#f87171]"
        : "border-dashed border-border text-muted-foreground/60";
  return (
    <div className={`min-w-0 rounded-lg border px-3 py-2 text-xs leading-5 ${tone}`}>
      <span className="block">
        <span className="font-mono font-bold text-foreground">{name}</span> <span className="text-muted-foreground">{detail}</span>
      </span>
      <span className="block font-semibold">
        {MARK[check]}
        {check === "fail" && reason ? ` · ${reason}` : ""}
      </span>
    </div>
  );
}

export default function BackendSelectViz() {
  return (
    <SceneShell
      eyebrow="backend 선택 분기"
      title="명시한 후보가 부적합하면 다른 후보로 바꾸지 않고 멈춥니다"
      description="설명용 후보 A=FLASH_ATTN, B=FLASHINFER이고 16절처럼 우선순위는 A가 먼저라고 가정합니다. 지원 판정은 글의 CPU 실험처럼 넣은 가짜 값이며 실제 설치된 backend의 지원 여부가 아닙니다."
      ariaLabel="vLLM backend의 명시 선택과 자동 선택 분기"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const col = (branch: Scene["branch"]) => (scene.branch === branch ? "" : "opacity-30");
        return (
          <div className="min-w-0">
            <div className="mx-auto w-fit rounded-lg border border-border px-3 py-2 text-center font-mono text-xs">selected_backend가 있는가?</div>
            <div className="mt-3 grid min-w-0 grid-cols-2 gap-3">
              <div className={`min-w-0 space-y-2 ${col("auto")}`}>
                <p className="text-xs font-semibold">없음 → 후보 목록 전부 검사</p>
                <Candidate name="A" detail="우선순위 1" reason="head_size" check={scene.branch === "auto" ? scene.a : "skip"} />
                <Candidate name="B" detail="우선순위 2" reason="가정" check={scene.branch === "auto" ? scene.b : "skip"} />
              </div>
              <div className={`min-w-0 space-y-2 ${col("explicit")}`}>
                <p className="text-xs font-semibold">A 지정 → 그 후보만 검사</p>
                <Candidate name="A" detail="지정한 후보" reason="head_size" check={scene.branch === "explicit" ? scene.a : "skip"} />
                <Candidate name="B" detail="대상 아님" check="skip" />
              </div>
            </div>
            <div
              className={`mx-auto mt-4 w-fit rounded-lg border px-4 py-2 text-center font-mono text-sm font-bold ${
                scene.error ? "border-[#dc2626] text-[#b91c1c] dark:text-[#f87171]" : "border-[#16a34a] text-[#15803d] dark:text-[#4ade80]"
              }`}
            >
              {scene.result}
            </div>
          </div>
        );
      }}
    />
  );
}
