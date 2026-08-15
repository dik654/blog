import VizFrame from "@/components/viz/VizFrame";
import { RecurrentSceneControls, useRecurrentScenes } from "./RecurrentVizControls";

const SCENES = ["shift pair", "state→분포", "loss→PPL"] as const;
const SCENE_COPY = [
  "한 token 줄을 입력 rail과 한 칸 앞선 정답 rail로 나누면 세 개의 학습 pair가 생깁니다.",
  "Prefix를 접은 hₜ가 vocabulary 전체의 logit과 probability를 만듭니다.",
  "정답 probability만 골라 surprise를 계산하고, valid token 평균을 exp해 PPL로 읽습니다.",
] as const;

export default function RNNLanguageFlowViz() {
  const scenes = useRecurrentScenes(SCENES.length);

  return (
    <VizFrame
      eyebrow="Animated RNN language objective"
      title="Token rail에서 probability와 loss가 만들어지는 경로"
      description="원은 token, 육각형은 recurrent state, 막대 길이는 vocabulary probability입니다. 세 장면을 넘기며 같은 데이터가 objective가 되는 순서를 봅니다."
    >
      <div data-viz-canvas tabIndex={0} role="group" aria-label="RNN language model objective animation" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
        <p aria-live="polite" className="mb-7 border-l border-primary pl-4 text-sm leading-6"><span className="block text-xs font-bold text-primary">장면 {String(scenes.active + 1).padStart(2, "0")}</span>{SCENE_COPY[scenes.active]}</p>

        <div className={`transition-opacity ${scenes.active === 0 ? "opacity-100" : "opacity-45"}`}>
          <p className="mb-4 text-xs font-bold text-muted-foreground">같은 sequence를 한 칸 어긋난 두 rail로 본다</p>
          <TokenRail label="입력" tokens={["BOS", "나", "간다"]} tone="sky" active={scenes.active === 0} />
          <div className="my-2 ml-[4.8rem] grid grid-cols-3 text-center text-primary"><span>↓</span><span>↓</span><span>↓</span></div>
          <TokenRail label="정답" tokens={["나", "간다", "EOS"]} tone="emerald" active={scenes.active === 0} />
        </div>

        <div className={`mt-10 border-t border-border pt-7 transition-opacity ${scenes.active === 1 ? "opacity-100" : "opacity-45"}`}>
          <p className="mb-5 text-xs font-bold text-muted-foreground">Prefix가 state를 지나 vocabulary 분포가 된다</p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-5">
            <div className="flex -space-x-2">{["B", "나", "간"].map((token) => <span key={token} className="flex h-10 w-10 items-center justify-center rounded-full border border-sky-500 bg-background text-xs font-bold">{token}</span>)}</div>
            <Arrow active={scenes.active === 1} />
            <div className="flex h-24 w-24 items-center justify-center border border-primary bg-primary/10 [clip-path:polygon(25%_0,75%_0,100%_50%,75%_100%,25%_100%,0_50%)]"><span className="font-mono text-lg font-black">hₜ</span></div>
            <Arrow active={scenes.active === 1} />
            <div className="w-full max-w-56 space-y-3"><ProbabilityBar label="간다" value="68%" width="68%" /><ProbabilityBar label="본다" value="21%" width="21%" /><ProbabilityBar label="기타" value="11%" width="11%" /></div>
          </div>
        </div>

        <div className={`mt-10 border-t border-border pt-7 transition-opacity ${scenes.active === 2 ? "opacity-100" : "opacity-45"}`}>
          <p className="mb-5 text-xs font-bold text-muted-foreground">정답 하나를 고른 뒤 corpus 척도로 집계한다</p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <MetricNode label="정답 확률" value="pₜ[wₜ₊₁]" active={scenes.active === 2} />
            <Arrow active={scenes.active === 2} />
            <MetricNode label="surprise" value="−log p" active={scenes.active === 2} />
            <Arrow active={scenes.active === 2} />
            <MetricNode label="valid 평균" value="mean NLL" active={scenes.active === 2} />
            <Arrow active={scenes.active === 2} />
            <MetricNode label="같은 계약의 PPL" value="exp(NLL)" active={scenes.active === 2} />
          </div>
        </div>

        <RecurrentSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}

function TokenRail({ label, tokens, tone, active }: { label: string; tokens: string[]; tone: "sky" | "emerald"; active: boolean }) {
  const color = tone === "sky" ? "border-sky-500 bg-sky-500/10" : "border-emerald-500 bg-emerald-500/10";
  return <div className="grid grid-cols-[4rem_repeat(3,minmax(0,1fr))] items-center gap-2"><span className="text-xs font-bold">{label}</span>{tokens.map((token, index) => <div key={token + index} className="flex min-w-0 items-center"><span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${color}`}>{token}</span>{index < 2 ? <span className="h-px min-w-2 flex-1 bg-border">{active ? <span className="block h-2 w-2 -translate-y-[3px] animate-pulse rounded-full bg-primary" /> : null}</span> : null}</div>)}</div>;
}

function ProbabilityBar({ label, value, width }: { label: string; value: string; width: string }) {
  return <div className="grid grid-cols-[2.5rem_1fr_2.5rem] items-center gap-2 text-[11px]"><span>{label}</span><span className="h-2 bg-muted"><span className="block h-full bg-primary transition-[width] duration-500" style={{ width }} /></span><span className="text-right font-mono">{value}</span></div>;
}

function MetricNode({ label, value, active }: { label: string; value: string; active: boolean }) {
  return <div className={`flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full border text-center ${active ? "border-primary bg-primary/10" : "border-border"}`}><span className="text-[10px] text-muted-foreground">{label}</span><span className="mt-2 font-mono text-xs font-black">{value}</span></div>;
}

function Arrow({ active }: { active: boolean }) {
  return <div aria-hidden="true" className="flex rotate-90 items-center text-primary sm:rotate-0"><span className="h-px w-7 bg-primary" />{active ? <span className="h-2 w-2 animate-pulse rounded-full bg-primary" /> : null}<span className="text-lg">→</span></div>;
}
