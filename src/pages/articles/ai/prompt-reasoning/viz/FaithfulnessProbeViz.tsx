import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #paper-cot-faithfulness — multiple-choice 문제에 biasing feature를 넣어 answer가 바뀐 경우,
 * CoT가 그 영향을 언급하는지 본다. 선택지 B→C와 단서 문구는 모양을 보이려는 가정이다.
 */
const SCENES = [
  {
    label: "원래 문제",
    summary: "CoT → answer B (가정)",
    note: "객관식 문제 하나를 그대로 풀게 하고 CoT와 answer를 기록합니다. 선택지와 answer B는 장면을 보이려는 가정입니다.",
  },
  {
    label: "편향 단서만 추가",
    summary: "answer B → C",
    note: "문제는 그대로 두고 biasing feature, 곧 정답과 무관하지만 답을 한쪽으로 기울게 할 수 있는 단서만 넣습니다. 이 측정은 이렇게 answer가 바뀐 경우를 봅니다.",
  },
  {
    label: "CoT가 단서를 말하나",
    summary: "언급 없음 = unfaithful 사례",
    note: "단서를 넣자 answer가 바뀌었는데 CoT가 단서를 말하지 않으면 unfaithful explanation 사례로 봅니다. 모든 CoT가 거짓이라는 뜻이 아니라, 자연어 explanation 하나로 causal faithfulness를 인증할 수 없다는 뜻입니다.",
  },
] as const;

function Column({ title, cue, answer, cot, highlight }: { title: string; cue: boolean; answer: string; cot: string; highlight: boolean }) {
  return (
    <div className={`min-w-0 rounded-lg border p-2.5 sm:p-3 ${highlight ? "border-primary" : "border-border"} bg-background`}>
      <p className="font-mono text-[10px] font-bold text-muted-foreground">{title}</p>
      <div className="mt-2 rounded-md border border-border px-2 py-1.5">
        <p className="font-semibold">객관식 문제 (A–D)</p>
        <p className={`mt-1 rounded-sm border border-dashed px-1.5 py-0.5 text-[11px] ${cue ? "border-red-600 font-semibold text-red-700 dark:text-red-400" : "invisible border-border"}`}>
          + 편향 단서
        </p>
      </div>
      <p className="text-center text-[10px] leading-4 text-muted-foreground">↓</p>
      <div className="rounded-md border border-border bg-muted/30 px-2 py-1.5">
        <p className="font-mono text-[10px] font-bold text-muted-foreground">CoT</p>
        <p className="mt-0.5 break-keep text-[11px] leading-5">{cot}</p>
      </div>
      <p className="text-center text-[10px] leading-4 text-muted-foreground">↓</p>
      <div className="flex items-center justify-between rounded-md border border-border px-2 py-1.5">
        <span className="font-mono text-[10px] font-bold text-muted-foreground">answer</span>
        <span className="text-base font-black">{answer}</span>
      </div>
    </div>
  );
}

function Drawing({ step }: { step: number }) {
  return (
    <div className="grid min-w-0 gap-3 text-xs sm:text-sm">
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <Column title="원래 prompt" cue={false} answer="B" cot="조건을 따져 보면 B가 맞다 …" highlight={step === 0} />
        <div className={step >= 1 ? "min-w-0" : "min-w-0 opacity-30"}>
          <Column
            title="단서를 넣은 prompt"
            cue={step >= 1}
            answer={step >= 1 ? "C" : "?"}
            cot={step >= 1 ? "조건을 따져 보면 C가 맞다 …" : "…"}
            highlight={step >= 1}
          />
        </div>
      </div>
      <div className={`grid grid-cols-2 gap-2 text-[11px] leading-5 sm:gap-4 ${step === 2 ? "" : "invisible"}`}>
        <div className="rounded-md border border-border px-2 py-1.5">
          <p className="font-bold">CoT가 단서를 언급</p>
          <p className="text-muted-foreground">단서의 영향이 설명에 드러남</p>
        </div>
        <div className="rounded-md border border-red-600 px-2 py-1.5">
          <p className="font-bold text-red-700 dark:text-red-400">CoT가 언급 안 함</p>
          <p className="text-muted-foreground">answer는 바뀌었는데 설명엔 단서가 없음 → unfaithful explanation 사례</p>
        </div>
      </div>
    </div>
  );
}

export default function FaithfulnessProbeViz() {
  return (
    <SceneShell
      eyebrow="Faithfulness 측정"
      title="단서 하나로 답이 바뀌었을 때 설명이 그 단서를 말하는가"
      description="왼쪽과 오른쪽은 편향 단서 하나만 다른 같은 객관식 문제입니다. 선택지 B·C와 CoT 문장은 장면을 보이려는 가정입니다."
      ariaLabel="편향 단서를 넣어 answer가 바뀐 경우 CoT가 그 단서를 언급하는지 확인하는 과정"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack active={active} scenes={SCENES.map((scene, index) => <Drawing key={scene.label} step={index} />)} />
      )}
    />
  );
}
