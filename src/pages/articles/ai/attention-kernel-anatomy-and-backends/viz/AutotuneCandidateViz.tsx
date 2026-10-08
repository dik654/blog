import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import VizFrame from "@/components/viz/VizFrame";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";

const labels = [
  "후보 한 장",
  "36개 만들기",
  "15개 제거",
  "9개 남기기",
  "시간 재기",
] as const;

const overview = [
  { count: "36", label: "조합 생성", detail: "네 선택축을 모두 조합" },
  { count: "21", label: "장치 조건 통과", detail: "작은 조각의 8 warp 제외" },
  { count: "9", label: "입력 길이 통과", detail: "길이 64에 맞는 행 크기" },
  { count: "1", label: "실측 승자", detail: "남은 후보의 시간을 비교" },
] as const;

function CandidateCard() {
  const rows = [
    ["한 번에 맡는 query 행", "64", "BLOCK_M"],
    ["한 번에 훑는 key 열", "32", "BLOCK_N"],
    ["미리 준비할 작업 단계", "2", "num_stages"],
    ["함께 일할 warp 묶음", "4", "num_warps"],
  ] as const;
  return (
    <div className="grid gap-3 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      <div className="border-l-2 border-primary pl-4">
        <p className="font-bold text-foreground">후보 하나는 같은 계산을 실행하는 작업 지시서 한 장입니다.</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          출력은 같아야 하지만, 한 번에 가져올 자료의 크기와 참여하는 작업자 수가 달라집니다. 그래서 어떤 지시서가 빠른지는 입력과 GPU에 따라 달라집니다.
        </p>
      </div>
      <dl className="divide-y divide-border border-y border-border">
        {rows.map(([meaning, value, name]) => (
          <div key={name} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 py-2.5">
            <div>
              <dt className="text-sm leading-5 text-foreground">{meaning}</dt>
              <dd className="mt-0.5 break-words font-mono text-xs text-muted-foreground">{name}</dd>
            </div>
            <dd className="self-center text-lg font-bold tabular-nums text-primary">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function CombinationCard() {
  const axes = [
    ["query 행", "BLOCK_M", "64 · 128", "2가지"],
    ["key 열", "BLOCK_N", "32 · 64 · 128", "3가지"],
    ["준비 단계", "num_stages", "2 · 3 · 4", "3가지"],
    ["warp 묶음", "num_warps", "4 · 8", "2가지"],
  ] as const;
  return (
    <div>
      <p className="text-sm leading-6 text-muted-foreground">
        각 줄에서 하나씩 고릅니다. 어느 줄의 선택도 아직 다른 줄의 선택을 제한하지 않으므로 경우의 수를 곱합니다.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {axes.map(([meaning, name, values, count]) => (
          <div key={name} className="min-w-0 border border-border bg-background p-3">
            <p className="text-sm font-bold text-foreground">{meaning} · {count}</p>
            <p className="mt-1 break-words font-mono text-xs text-muted-foreground">{name}</p>
            <p className="mt-2 text-sm tabular-nums text-primary">{values}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 border-l-2 border-primary pl-4 font-mono text-sm leading-6 text-foreground">
        2가지 × 3가지 × 3가지 × 2가지 = 36개 후보
      </p>
    </div>
  );
}

function DeviceFilterCard() {
  return (
    <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
      <div>
        <p className="font-bold text-foreground">CUDA 장치 능력의 첫 숫자가 9일 때만 적용하는 조건</p>
        <div className="mt-3 border-l-2 border-primary pl-4 font-mono text-sm leading-6 text-foreground">
          조각 면적이 128×128보다 작고<br />warp가 8이면 제거
        </div>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          작은 조각에 작업자 8묶음을 붙이는 다섯 모양이 대상입니다. 면적이 정확히 128×128인 모양은 부등호가 &lt;라서 남습니다.
        </p>
      </div>
      <div className="border-y border-border py-3">
        <p className="text-xs font-bold text-muted-foreground">제거되는 조각 모양 5개</p>
        <p className="mt-2 font-mono text-sm leading-7 text-foreground">
          64×32 · 64×64 · 64×128<br />128×32 · 128×64
        </p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">각 모양에는 stage 2·3·4가 있으므로 모양마다 세 후보가 사라집니다.</p>
        <p className="mt-3 font-mono text-sm font-bold text-primary">5모양 × 3 stage = 15개 제거<br />36 − 15 = 21개</p>
      </div>
    </div>
  );
}

function LengthFilterCard() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="border-l-2 border-primary pl-4">
        <p className="font-bold text-foreground">입력 길이 N_CTX = 64</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          한 번에 맡겠다는 query 행 수가 전체 길이보다 크면 버립니다. 따라서 BLOCK_M=128 후보가 모두 사라집니다.
        </p>
        <p className="mt-3 font-mono text-sm font-bold text-primary">
          BLOCK_M 64 한 값<br />× BLOCK_N 세 값<br />× stage 세 값<br />× warp 4 한 값 = 9개
        </p>
      </div>
      <div className="border-l-2 border-border pl-4">
        <p className="font-bold text-foreground">성분 수 HEAD_DIM = 128</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          남은 BLOCK_N은 32·64·128이라 모두 BLOCK_N≤HEAD_DIM 조건을 만족합니다. 여기서는 후보 수가 더 줄지 않습니다.
        </p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          N_CTX=8이라면 가장 작은 BLOCK_M=64도 길이보다 큽니다. 이 가지치기 함수는 후보를 0개 돌려주므로, 여덟 위치 사례를 이 튜토리얼 설정의 GPU 실행 사례라고 부를 수 없습니다.
        </p>
      </div>
    </div>
  );
}

function MeasurementCard() {
  const keys = ["N_CTX", "HEAD_DIM", "FP8_OUTPUT", "warp_specialize"];
  return (
    <div>
      <p className="font-bold text-foreground">필터는 빠른 후보를 고르지 않습니다.</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        필터는 시도하지 않을 후보만 지웁니다. 그 뒤 autotune이 남은 설정을 실행해 시간을 비교하고, 해당 입력 조건에서 가장 빠른 설정을 고릅니다.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="border border-border bg-background p-3">
          <p className="text-xs font-bold text-muted-foreground">다시 시간을 잴지 구분하는 값</p>
          <ul className="mt-2 space-y-1 font-mono text-sm text-foreground">
            {keys.map((key) => <li key={key}>{key}</li>)}
          </ul>
        </div>
        <div className="border border-border bg-background p-3">
          <p className="text-xs font-bold text-muted-foreground">이번 글에서 확인한 범위</p>
          <p className="mt-2 text-sm leading-6 text-foreground">후보 생성과 두 필터의 Python 몸체</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">GPU 컴파일·실행 시간·최종 승자는 측정하지 않았습니다.</p>
        </div>
      </div>
    </div>
  );
}

const scenes = [
  <CandidateCard key="candidate" />,
  <CombinationCard key="combinations" />,
  <DeviceFilterCard key="device" />,
  <LengthFilterCard key="length" />,
  <MeasurementCard key="measure" />,
] as const;

export default function AutotuneCandidateViz() {
  const scene = useAnimatedScenes(scenes.length, 6500);
  return (
    <VizFrame
      eyebrow="후보가 줄어드는 경로"
      title="한 실행 설정을 36개로 늘리고, 21개와 9개로 거른 뒤 시간을 잽니다"
      description="고정 Triton 3.6.0 튜토리얼의 CUDA 일반 경로와 capability (9,0), N_CTX=64, HEAD_DIM=128을 사용합니다."
      note="36→21→9는 속도 순위가 아닙니다. 앞의 두 감소는 실행 전에 적용한 조건이고, 실제 속도 비교는 마지막 단계입니다."
    >
      <div
        role="group"
        tabIndex={0}
        aria-label="Triton autotune 후보 생성과 필터 과정"
        onKeyDown={scene.onKeyDown}
        className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <ol className="grid grid-cols-1 gap-2 sm:grid-cols-4" aria-label="전체 후보 흐름">
          {overview.map((item, index) => {
            const stageIndex = Math.min(index + 1, labels.length - 1);
            const active = scene.active === stageIndex || (index === 0 && scene.active === 0);
            return (
              <li key={item.label} className={`min-w-0 border-l-2 px-3 py-2 ${active ? "border-primary bg-primary/5" : "border-border"}`}>
                <p className="text-xl font-bold tabular-nums text-foreground">{item.count}</p>
                <p className="mt-0.5 text-xs font-bold text-foreground">{item.label}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.detail}</p>
              </li>
            );
          })}
        </ol>
        <div className="mt-5 min-w-0 border-t border-border pt-5 sm:min-h-[21rem]">
          <p className="mb-4 text-sm font-bold text-primary">
            {String(scene.active + 1).padStart(2, "0")} · {labels[scene.active]}
          </p>
          {scenes[scene.active]}
        </div>
        <AnimatedSceneControls {...scene} labels={labels} />
      </div>
    </VizFrame>
  );
}
