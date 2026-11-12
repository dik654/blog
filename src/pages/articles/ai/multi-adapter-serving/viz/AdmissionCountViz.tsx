import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #admission — 대기열 A, B, C, A를 두 엔진의 셈으로 차례로 들인다.
 * vLLM: max_loras=2, 이번 step에 들어간 adapter 종류를 센다.
 * TensorRT-LLM: adapter마다 3 page, 여유 8 page(가정). 같은 task id는 0 page.
 * 결과: 두 엔진 모두 A·B·A가 들어가고 C는 건너뛴다.
 */
const QUEUE = ["A", "B", "C", "A"] as const;
const COLORS: Record<string, string> = { A: "#0d9488", B: "#2563eb", C: "#d97706" };
const FREE_PAGES = 8;
const PAGES_PER_ADAPTER = 3;

type Verdict = "in" | "skip";

const SCENES = [
  {
    label: "1번째 요청 · A",
    summary: "두 엔진 모두 들어감",
    types: ["A"],
    pages: ["A", "A", "A"],
    verdicts: ["in"],
    vllm: "A는 처음 · 1/2종류",
    trt: "새 task · 3 page 차감",
    note: "vLLM은 이번 step에 들어간 adapter 종류를 세고, TensorRT-LLM은 adapter 무게를 PEFT cache page(adapter 가중치를 담는 cache의 같은 크기 칸)로 셉니다. 첫 요청은 어느 쪽 한도에도 걸리지 않습니다.",
  },
  {
    label: "2번째 요청 · B",
    summary: "종류 2/2 · page 6/8",
    types: ["A", "B"],
    pages: ["A", "A", "A", "B", "B", "B"],
    verdicts: ["in", "in"],
    vllm: "B는 처음 · 2/2종류",
    trt: "새 task · 3 page 차감",
    note: "vLLM 쪽은 종류 한도 2를 다 채웠고, TensorRT-LLM 쪽은 여유 8 page 중 2 page가 남았습니다.",
  },
  {
    label: "3번째 요청 · C",
    summary: "두 엔진 모두 건너뜀",
    types: ["A", "B"],
    pages: ["A", "A", "A", "B", "B", "B"],
    verdicts: ["in", "in", "skip"],
    vllm: "이미 2종류 · C는 그 안에 없음",
    trt: "3 page 필요 · 2 page 남음",
    note: "C는 이번 step에 들어가지 못합니다. 두 엔진 모두 멈추지 않고 다음 요청을 봅니다. TensorRT-LLM에서 반복을 멈추는 쪽은 adapter page가 아니라 KV block이 모자랄 때입니다.",
  },
  {
    label: "4번째 요청 · A",
    summary: "A·B·A 들어감, C 대기",
    types: ["A", "B"],
    pages: ["A", "A", "A", "B", "B", "B"],
    verdicts: ["in", "in", "skip", "in"],
    vllm: "A는 이미 이번 step에 있음",
    trt: "같은 task id(adapter 구분값) · 0 page",
    note: "뒤의 A는 이미 이번 batch에 있는 adapter라 종류도 page도 늘리지 않습니다. 같은 adapter 요청이 여럿이어도 한 번만 셉니다.",
  },
] as const;

function Panel({ title, rule, detail, children }: { title: string; rule: string; detail: string; children: ReactNode }) {
  return (
    <div className="min-w-0 rounded-lg border border-border p-3">
      <p className="text-sm font-bold">{title}</p>
      <p className="text-xs text-muted-foreground">{rule}</p>
      <div className="mt-3">{children}</div>
      <p className="mt-3 min-h-[2.5rem] text-xs leading-5">{detail}</p>
    </div>
  );
}

export default function AdmissionCountViz() {
  return (
    <SceneShell
      eyebrow="adapter 자리 세기"
      title="같은 대기열 A, B, C, A를 두 엔진이 다른 단위로 세고 같은 결과를 냅니다"
      description="위 줄은 도착 순서대로 놓인 요청이고 글자는 그 요청의 adapter입니다. 아래 두 칸은 이번 step에 쌓인 셈입니다. TensorRT-LLM 쪽 3 page·여유 8 page는 가정값입니다."
      ariaLabel="vLLM의 adapter 종류 한도와 TensorRT-LLM의 adapter page 한도로 대기열 A B C A를 들이는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const verdicts = scene.verdicts as readonly Verdict[];
        const types = scene.types as readonly string[];
        const pages = scene.pages as readonly string[];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-4 gap-2">
              {QUEUE.map((id, index) => {
                const verdict = verdicts[index];
                const current = index === active;
                return (
                  <div
                    key={index}
                    className={`rounded-lg border px-1 py-2 text-center ${current ? "border-foreground" : "border-border"} ${verdict === "skip" ? "border-dashed" : ""}`}
                  >
                    <span className="block text-[11px] text-muted-foreground">{index + 1}번째</span>
                    <span className="block text-lg font-bold" style={{ color: COLORS[id] }}>
                      {id}
                    </span>
                    <span
                      className={`block text-[11px] font-semibold ${
                        verdict === "in" ? "text-emerald-700 dark:text-emerald-400" : verdict === "skip" ? "text-red-700 dark:text-red-400" : "text-muted-foreground/60"
                      }`}
                    >
                      {verdict === "in" ? "들어감" : verdict === "skip" ? "건너뜀" : "대기열"}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Panel title="vLLM" rule="이번 step의 adapter 종류 · max_loras=2" detail={scene.vllm}>
                <div className="grid grid-cols-2 gap-2">
                  {[0, 1].map((slot) => {
                    const id = types[slot];
                    return (
                      <div
                        key={slot}
                        className={`flex h-9 items-center justify-center rounded-md border text-sm font-bold ${id ? "" : "border-dashed text-muted-foreground/50"}`}
                        style={id ? { borderColor: COLORS[id], color: COLORS[id] } : undefined}
                      >
                        {id ?? "빈 자리"}
                      </div>
                    );
                  })}
                </div>
              </Panel>
              <Panel title="TensorRT-LLM" rule={`adapter page · 여유 ${FREE_PAGES} · adapter당 ${PAGES_PER_ADAPTER}`} detail={scene.trt}>
                <div className="grid grid-cols-8 gap-1">
                  {Array.from({ length: FREE_PAGES }, (_, slot) => {
                    const id = pages[slot];
                    return (
                      <div
                        key={slot}
                        className={`h-9 rounded-sm border ${id ? "" : "border-dashed border-border"}`}
                        style={id ? { backgroundColor: COLORS[id], borderColor: COLORS[id] } : undefined}
                        aria-hidden
                      />
                    );
                  })}
                </div>
                <p className="mt-1 text-right font-mono text-xs text-muted-foreground">
                  {pages.length}/{FREE_PAGES} page
                </p>
              </Panel>
            </div>
          </div>
        );
      }}
    />
  );
}
