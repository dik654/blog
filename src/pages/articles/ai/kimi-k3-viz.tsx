import { NodeBox, StoryShell, useStory } from "./kimi-k3-shared";

const arrow = <span aria-hidden className="text-center text-xl text-muted-foreground">→</span>;

export function KimiAxisViz() {
  const story = useStory(4);
  const labels = ["입력", "sequence", "depth", "width"] as const;
  return (
    <StoryShell title="K3는 세 축의 병목을 따로 바꾼다" subtitle="한 장면에 용어를 모두 쏟지 않고, token 흐름에 sequence·depth·width 변경을 한 축씩 붙입니다." labels={labels} {...story}>
      <div className="grid min-w-0 items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
        <NodeBox active title="Token stream" detail="입력 순서와 현재 residual state" />
        {arrow}
        <NodeBox active={story.step >= 1} tone="sequence" title="Sequence mixer" detail="KDA로 압축하고 MLA로 직접 조회" />
        {arrow}
        <NodeBox active={story.step >= 2} tone="depth" title="Depth routing" detail="이전 block 중 지금 읽을 source 선택" />
        {arrow}
        <NodeBox active={story.step >= 3} tone="width" title="Latent MoE" detail="전문가 계산만 작은 latent width에서 수행" />
      </div>
      <div className="mt-5 border-l border-primary pl-4 text-sm leading-7">
        {[
          "먼저 입력 한 줄만 둡니다. 아직 KDA·AttnRes·MoE를 섞지 않습니다.",
          "Sequence 축은 긴 token history를 어떤 상태로 보관하고 언제 원문을 다시 볼지 정합니다.",
          "Depth 축은 93층을 지날 때 직전 층만 받을지, 앞선 block을 골라 읽을지 정합니다.",
          "Width 축은 896개 expert의 계산 폭과 배정 불균형을 다룹니다. 세 축을 합친 것이 K3입니다.",
        ][story.step]}
      </div>
    </StoryShell>
  );
}

export function SequenceMixerViz() {
  const story = useStory(4);
  const labels = ["기억 유지", "오차 수정", "현재 읽기", "MLA 보강"] as const;
  return (
    <StoryShell title="고정 state가 기억을 고치고, MLA가 원문 조회를 보강한다" subtitle="KDA 한 step의 retain→correct→read를 본 뒤에만 3:1 hybrid schedule을 조합합니다." labels={labels} {...story}>
      <div className="grid min-w-0 gap-3 md:grid-cols-3">
        <NodeBox active={story.step >= 0} tone="sequence" title="① Retain" detail="이전 state Sₜ₋₁를 decay α로 남김" />
        <NodeBox active={story.step >= 1} tone="sequence" title="② Correct" detail="현재 key에서 틀린 예측만 β만큼 수정" />
        <NodeBox active={story.step >= 2} tone="sequence" title="③ Read" detail="현재 query qₜ로 고정 state를 읽음" />
      </div>
      <div className={`mt-5 grid gap-2 transition-opacity duration-500 sm:grid-cols-4 ${story.step >= 3 ? "opacity-100" : "opacity-30"}`}>
        {['KDA','KDA','KDA','Gated MLA'].map((name, index) => (
          <div key={`${name}-${index}`} className={`border p-3 text-center text-xs font-black ${name === 'Gated MLA' ? 'border-blue-500/60 bg-blue-500/10' : 'border-cyan-500/50 bg-cyan-500/10'}`}>{name}</div>
        ))}
      </div>
      <p className="mt-4 text-sm leading-7 text-muted-foreground">{[
        "α는 과거를 전부 삭제하지 않고 이번 step까지 남길 비율입니다.",
        "Delta는 새 value를 덧칠하는 대신, state가 이미 예측한 값과의 오차를 고칩니다.",
        "qₜ는 지금 필요한 방향만 state에서 꺼냅니다. 과거 token 원문이 그대로 남는 것은 아닙니다.",
        "세 KDA 뒤 MLA가 causal token memory를 직접 조회합니다. K3는 이 block을 23번 두고 마지막 MLA를 하나 더 둡니다.",
      ][story.step]}</p>
    </StoryShell>
  );
}

export function DepthRoutingViz() {
  const story = useStory(4);
  const labels = ["직전 층", "source 저장", "weight 계산", "block 제한"] as const;
  return (
    <StoryShell title="Residual depth를 한 줄에서 선택 가능한 source graph로 바꾼다" subtitle="Token attention이 아니라 layer depth 사이에서 어떤 representation을 다음 input으로 쓸지 고릅니다." labels={labels} {...story}>
      <div className="grid min-w-0 gap-4 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-2">
          {['embedding','block 1','block 2','current block'].map((name, index) => (
            <div key={name} className={`border px-4 py-3 text-sm transition-all duration-500 ${index <= story.step ? 'border-violet-500/50 bg-violet-500/10 opacity-100' : 'border-border opacity-30'}`}>
              <span className="font-black">{name}</span><span className="float-right font-mono text-xs">source {index}</span>
            </div>
          ))}
        </div>
        <div className="flex min-h-48 items-center justify-center border border-border p-5">
          <div className="w-full max-w-sm space-y-3 text-center">
            <div className="border border-primary/60 bg-primary/10 p-4 font-black">현재 layer의 pseudo-query</div>
            <div className="text-xl">↓</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[0.5,0.3,0.2].map((weight) => <div key={weight} className="border border-violet-500/50 p-3 font-mono">{weight}</div>)}
            </div>
            <p className="text-xs leading-5 text-muted-foreground">source key와 비교한 weight로 value를 섞어 다음 layer input을 만듭니다.</p>
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm leading-7 text-muted-foreground">{[
        "표준 residual은 직전 state를 기본 통로로 삼습니다.",
        "Full AttnRes는 embedding과 모든 이전 layer를 source로 저장할 수 있습니다.",
        "현재 layer가 pseudo-query를 내고 source key score를 softmax해 value를 가중합합니다.",
        "K3는 최대 12층씩 block으로 묶어 93개 layer source 대신 8개 block source와 embedding을 오래 보관합니다.",
      ][story.step]}</p>
    </StoryShell>
  );
}

export function LatentMoeViz() {
  const story = useStory(4);
  const labels = ["폭 축소", "expert 선택", "안정화", "폭 복원"] as const;
  return (
    <StoryShell title="전문가 계산 폭을 줄이고, 선택·활성값·부하를 따로 안정화한다" subtitle="LatentMoE를 한 단어로 외우지 않고 down projection부터 output 합성까지 따라갑니다." labels={labels} {...story}>
      <div className="grid min-w-0 items-center gap-3 md:grid-cols-[1fr_auto_0.7fr_auto_1.2fr_auto_0.7fr_auto_1fr]">
        <NodeBox active title="x · 7,168" detail="full-width residual" />{arrow}
        <NodeBox active={story.step >= 0} tone="width" title="3,584" detail="Wdown latent" />{arrow}
        <div className={`grid grid-cols-4 gap-1 transition-opacity ${story.step >= 1 ? 'opacity-100' : 'opacity-30'}`}>
          {Array.from({length:8},(_,i)=><div key={i} className={`border p-2 text-center text-[10px] ${i < 3 ? 'border-amber-500 bg-amber-500/15 font-black' : 'border-border'}`}>E{i+1}</div>)}
        </div>{arrow}
        <NodeBox active={story.step >= 2} tone="width" title="RMSNorm" detail="selected output scale" />{arrow}
        <NodeBox active={story.step >= 3} title="y · 7,168" detail="Wup + shared experts" />
      </div>
      <p className="mt-5 text-sm leading-7 text-muted-foreground">{[
        "Wdown은 routed expert가 처리할 feature 폭을 7,168에서 3,584로 줄입니다. shared expert는 full width에 남습니다.",
        "Router는 896개 중 16개를 선택합니다. Quantile bias는 다음 batch의 dispatch를 고르지만 mixture weight는 raw score에서 계산합니다.",
        "SiTU-GLU는 gate와 value branch를 각각 부드럽게 cap하고, RMSNorm은 선택된 expert 합의 scale을 정리합니다.",
        "Wup이 latent output을 7,168로 되돌린 뒤 full-width shared expert 결과와 합칩니다. 따라서 compute가 정확히 절반이라는 뜻은 아닙니다.",
      ][story.step]}</p>
    </StoryShell>
  );
}
