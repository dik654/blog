import { NodeBox, StoryShell } from "./kimi-k3-shared";
import { useStory } from "./useKimiStory";

const Arrow = () => (
  <span
    aria-hidden
    className="rotate-90 text-center text-xl text-muted-foreground md:rotate-0"
  >
    →
  </span>
);

export function BoostingFunctionViz() {
  const story = useStory(4);
  const labels = [
    "55㎡가 잎 하나 선택",
    "7−4=3",
    "새 트리 h=2.4",
    "4+0.2×2.4=4.48",
  ] as const;
  const notes = [
    "55㎡는 ‘60㎡ 이하’ 잎 하나에만 들어가므로 다른 잎의 값은 더하지 않습니다.",
    "제곱 손실에서 목표 7과 현재 점수 4의 차이 3이 이번 단계의 수정 방향입니다.",
    "새 약한 트리는 잔차 3을 완전히 맞히지 못하고 55㎡ 잎에서 2.4를 냅니다.",
    "2.4에 학습률 0.2를 곱한 0.48만 더해 새 점수 4.48을 만듭니다.",
  ] as const;
  return (
    <StoryShell
      title="55㎡ 집의 4억 예측을 4.48억으로 한 걸음 고칩니다"
      subtitle="목표 7·현재 4·트리 2.4·학습률 0.2를 같은 집에서 추적합니다."
      labels={labels}
      sceneId="gradient-boosting-update"
      staticNotes={notes}
      {...story}
    >
      <div className="grid min-w-0 items-center gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <div className="grid grid-cols-2 gap-1 border border-border bg-muted/15 p-4">
          <div className="h-16 border border-border bg-background" />
          <div className="h-16 border border-primary/45 bg-primary/10" />
          <p className="col-span-2 mt-2 text-center text-xs font-black">
            구간 선택 → 잎의 상수값
          </p>
        </div>
        <Arrow />
        <NodeBox
          active={story.step >= 1}
          title="잔차 목표"
          detail="y−F = 7−4 = 3"
        />
        <Arrow />
        <div className="space-y-2">
          {["F₀ = 4", "+ 0.2×2.4", "F₁ = 4.48"].map((x, i) => (
            <div
              key={x}
              className={`border px-4 py-3 text-center text-sm font-black transition-opacity ${story.step >= Math.min(3, i + 1) ? "border-primary bg-primary/10 opacity-100" : "border-border opacity-25"}`}
            >
              {x}
            </div>
          ))}
        </div>
      </div>
      <p
        data-scene-note
        className="mt-5 text-sm leading-7 text-muted-foreground"
      >
        {notes[story.step]}
      </p>
    </StoryShell>
  );
}

export function XGBoostGainViz() {
  const story = useStory(4);
  const labels = [
    "G·H 합치기",
    "구간 만들기",
    "분할 비교",
    "비용 판정",
  ] as const;
  const notes = [
    "각 행에서 현재 예측의 1차 기울기 g와 2차 곡률 h를 계산합니다.",
    "가까운 특성값을 같은 구간에 넣고 구간별 G·H 합을 만듭니다.",
    "후보 경계마다 왼쪽·오른쪽 자식의 점수 합을 부모 점수와 비교합니다.",
    "분할 이득에서 구조 비용 γ를 빼고도 양수일 때만 후보를 남깁니다.",
  ] as const;
  return (
    <StoryShell
      title="행별 기울기를 G·H 히스토그램으로 접어 분할 이득을 계산합니다"
      subtitle="임계값 후보를 시험하는 통계 장부와 규제된 이득을 같은 흐름에서 봅니다."
      labels={labels}
      sceneId="xgboost-objective-path"
      staticNotes={notes}
      {...story}
    >
      <div className="grid min-w-0 gap-4 lg:grid-cols-[1fr_1.2fr]">
        <div className="grid grid-cols-4 gap-2">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className={`border p-3 text-center text-xs transition-all ${story.step >= 1 ? "border-primary/45 bg-primary/10" : "border-border"}`}
            >
              행 {i + 1}
              <br />
              <span className="font-mono">gᵢ,hᵢ</span>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <div
            className={`grid grid-cols-4 gap-1 transition-opacity ${story.step >= 1 ? "opacity-100" : "opacity-25"}`}
          >
            {["구간 0", "구간 1", "구간 2", "구간 3"].map((x) => (
              <div
                key={x}
                className="border border-primary/45 bg-primary/10 p-3 text-center text-xs font-black"
              >
                {x}
              </div>
            ))}
          </div>
          <div
            className={`grid grid-cols-[1fr_auto_1fr] items-center gap-2 transition-opacity ${story.step >= 2 ? "opacity-100" : "opacity-25"}`}
          >
            <NodeBox active title="왼쪽 자식" detail="Gᴸ,Hᴸ" />
            <Arrow />
            <NodeBox active title="오른쪽 자식" detail="Gᴿ,Hᴿ" />
          </div>
          <div
            className={`border p-4 text-center text-sm font-black transition-colors ${story.step >= 3 ? "border-primary bg-primary/10" : "border-border text-muted-foreground"}`}
          >
            자식 점수 − 부모 점수 − γ &gt; 0 ?
          </div>
        </div>
      </div>
      <p
        data-scene-note
        className="mt-5 text-sm leading-7 text-muted-foreground"
      >
        {notes[story.step]}
      </p>
    </StoryShell>
  );
}

export function LightGBMEfficiencyViz() {
  const story = useStory(4);
  const labels = [
    "행 10,000개",
    "GOSS 3,000개",
    "EFB 6→2개",
    "이득 7인 잎",
  ] as const;
  const notes = [
    "100칸으로 줄여 그린 원본 행 10,000개와 희소 열 여섯 개가 분할 탐색 비용을 만듭니다.",
    "GOSS는 큰 기울기 행 2,000개와 작은 기울기 표본 1,000개를 씁니다. 작은 표본의 통계 가중치는 8입니다.",
    "EFB는 동시에 켜지지 않는 희소 열 여섯 개를 오프셋 구간으로 구분한 두 유효 열에 묶습니다.",
    "말단 잎의 이득이 [3, 7, 5]이면 잎 중심 성장은 이득 7인 잎 B에만 다음 분할 예산을 씁니다.",
  ] as const;
  return (
    <StoryShell
      title="행 10,000개 → 3,000개 · 열 6개 → 2개 · 이득 [3, 7, 5] → 잎 하나"
      subtitle="한 사례에서 GOSS·EFB·잎 중심 성장이 각각 줄이는 탐색 축을 추적합니다."
      labels={labels}
      sceneId="lightgbm-efficiency-path"
      staticNotes={notes}
      {...story}
    >
      <div className="grid min-w-0 gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="min-w-0 space-y-4">
          <div
            className="grid grid-cols-10 gap-0.5"
            aria-label="10,000개 row를 100칸으로 축약한 표본 지도"
          >
            {Array.from({ length: 100 }, (_, i) => {
              const isLargeGradient = i < 20;
              const isSampledSmallGradient = i >= 20 && i < 30;
              return (
                <div
                  key={i}
                  className={`aspect-square min-w-0 border transition-all ${
                    story.step >= 1
                      ? isLargeGradient
                        ? "border-primary/60 bg-primary/25 opacity-100"
                        : isSampledSmallGradient
                          ? "border-primary/40 bg-primary/10 opacity-100"
                          : "border-border bg-muted/10 opacity-15"
                      : "border-border bg-muted/20 opacity-100"
                  }`}
                />
              );
            })}
          </div>
          <p className="text-xs leading-5 text-muted-foreground">
            100칸이 행 10,000개를 나타냅니다. 진한 20칸은 큰 기울기 2,000개,
            옅은 10칸은 나머지에서 뽑은 1,000개이며, 옅은 행의 통계 가중치는
            8입니다.
          </p>
          <div
            className={`space-y-2 transition-opacity ${story.step >= 2 ? "opacity-100" : "opacity-25"}`}
            aria-label="여섯 sparse feature를 두 bundle로 묶는 과정"
          >
            <div className="grid grid-cols-6 gap-1">
              {["A", "B", "C", "D", "E", "F"].map((feature) => (
                <div
                  key={feature}
                  className="border border-border bg-background py-2 text-center text-xs font-black"
                >
                  {feature}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="border border-primary/45 bg-primary/10 py-2 text-center text-xs font-black">
                묶음 1 · A/B/C
              </div>
              <div className="border border-primary/45 bg-primary/10 py-2 text-center text-xs font-black">
                묶음 2 · D/E/F
              </div>
            </div>
          </div>
        </div>
        <div className="flex min-w-0 items-start justify-center pt-2">
          <div className="w-full max-w-sm space-y-2">
            <div className="border border-primary bg-primary/10 px-5 py-3 text-center text-sm font-black">
              루트
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="border border-border p-3 text-center text-xs">
                잎 A<br />
                이득 3
              </div>
              <div
                className={`border p-3 text-center text-xs ${story.step >= 3 ? "border-primary bg-primary/10 font-black" : "border-border"}`}
              >
                잎 B<br />
                이득 7
              </div>
              <div className="border border-border p-3 text-center text-xs">
                잎 C<br />
                이득 5
              </div>
            </div>
            <p
              className={`text-center text-xs font-semibold transition-opacity ${story.step >= 3 ? "opacity-100" : "opacity-25"}`}
            >
              다음 분할은 잎 B 하나에만 사용
            </p>
          </div>
        </div>
      </div>
      <p
        data-scene-note
        className="mt-4 text-sm leading-7 text-muted-foreground"
      >
        {notes[story.step]}
      </p>
    </StoryShell>
  );
}

export function CatBoostOrderingViz() {
  const story = useStory(4);
  const labels = [
    "순서 고정",
    "앞부분 모델",
    "기울기 계산",
    "대칭 트리",
  ] as const;
  const notes = [
    "학습 행의 순서를 A, C, B, D로 한 번 고정합니다.",
    "B의 예측에는 B와 D를 보지 않고 앞선 A와 C만 학습한 모델을 씁니다.",
    "B의 정답은 앞부분 모델을 학습하는 데 쓰지 않고, 그 예측에서 손실 기울기를 계산할 때만 씁니다.",
    "같은 깊이의 모든 노드가 같은 분할 규칙을 공유하는 대칭 트리로 함수 모양을 제한합니다.",
  ] as const;
  return (
    <StoryShell
      title="현재 행을 보지 않은 앞부분 예측으로 기울기를 만듭니다"
      subtitle="순서형 범주 통계와 순서형 부스팅을 섞지 않고 예측 경로부터 확인합니다."
      labels={labels}
      sceneId="catboost-ordering-path"
      staticNotes={notes}
      {...story}
    >
      <div className="grid min-w-0 gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="grid grid-cols-4 gap-2">
            {["A", "C", "B", "D"].map((x, i) => (
              <div
                key={x}
                className={`border p-4 text-center font-black ${i < 2 && story.step >= 1 ? "border-primary/45 bg-primary/10" : i === 2 ? "border-primary bg-primary/10" : "border-border"}`}
              >
                {x}
              </div>
            ))}
          </div>
          <div
            className={`mt-4 border-l border-primary pl-4 text-sm leading-7 transition-opacity ${story.step >= 1 ? "opacity-100" : "opacity-25"}`}
          >
            B의 예측 모델은 B·D를 보지 않고 A·C만 학습합니다.
          </div>
          <div
            className={`mt-3 border p-4 text-center text-sm font-black transition-opacity ${story.step >= 2 ? "border-primary opacity-100" : "border-border opacity-25"}`}
          >
            gradient(B) = −∂ℓ(yᴮ,Fᴬᶜ(xᴮ))/∂F
          </div>
        </div>
        <div
          className={`transition-opacity ${story.step >= 3 ? "opacity-100" : "opacity-25"}`}
        >
          <div className="mx-auto w-32 border border-primary/45 bg-primary/10 p-3 text-center text-xs font-black">
            깊이 0의 공통 분할
          </div>
          <div className="mx-auto h-6 w-px bg-border" />
          <div className="grid grid-cols-2 gap-2">
            <div className="border border-primary/35 p-3 text-center text-xs">
              깊이 1의 공통 규칙
            </div>
            <div className="border border-primary/35 p-3 text-center text-xs">
              깊이 1의 공통 규칙
            </div>
          </div>
        </div>
      </div>
      <p
        data-scene-note
        className="mt-5 text-sm leading-7 text-muted-foreground"
      >
        {notes[story.step]}
      </p>
    </StoryShell>
  );
}
