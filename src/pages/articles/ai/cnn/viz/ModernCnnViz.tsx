import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

type Scene = {
  label: string;
  title: string;
  input: string;
  operation: string;
  output: string;
  note: string;
};

function CnnSceneViz({
  id,
  eyebrow,
  title,
  description,
  scenes,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  scenes: readonly Scene[];
}) {
  const controls = useAnimatedScenes(scenes.length, 5200, { loop: false });
  const scene = scenes[controls.active];

  return (
    <VizFrame eyebrow={eyebrow} title={title} description={description} className="my-8">
      <div
        id={controls.playbackId}
        data-viz-id={id}
        data-viz
        data-viz-canvas
        tabIndex={0}
        onKeyDown={controls.onKeyDown}
        className="min-w-0 overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div className="grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-4">
          {scenes.map((item, index) => (
            <button
              type="button"
              key={item.label}
              onClick={() => controls.setActive(index)}
              aria-pressed={index === controls.active}
              className={`min-w-0 bg-background px-3 py-3 text-left ${
                index === controls.active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <span className="font-mono text-[9px]">0{index + 1}</span>
              <strong className="mt-1 block break-keep text-xs text-foreground">
                {item.label}
              </strong>
              <span className="mt-1 hidden break-keep text-[10px] leading-4 lg:block">
                {item.title}
              </span>
            </button>
          ))}
        </div>

        <div aria-live="polite" className="border-y border-border/70 py-5">
          <p className="text-[10px] font-bold text-primary">
            장면 {String(controls.active + 1).padStart(2, "0")} · {scene.label}
          </p>
          <h3 className="mt-2 break-keep text-lg font-bold leading-7">{scene.title}</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_1.5rem_minmax(0,1.15fr)_1.5rem_minmax(0,1fr)] sm:items-stretch">
            <div className="min-w-0 border border-border bg-background p-4">
              <p className="text-[10px] font-bold text-muted-foreground">입력 상태</p>
              <p className="mt-2 break-keep font-mono text-xs font-bold leading-6">
                {scene.input}
              </p>
            </div>
            <span className="hidden items-center justify-center text-muted-foreground sm:flex" aria-hidden>
              →
            </span>
            <div className="min-w-0 border-l-2 border-primary bg-primary/[0.04] p-4">
              <p className="text-[10px] font-bold text-primary">이번 계산</p>
              <p className="mt-2 break-keep text-xs font-semibold leading-6">
                {scene.operation}
              </p>
            </div>
            <span className="hidden items-center justify-center text-muted-foreground sm:flex" aria-hidden>
              →
            </span>
            <div className="min-w-0 border border-border bg-background p-4">
              <p className="text-[10px] font-bold text-muted-foreground">출력 상태</p>
              <p className="mt-2 break-keep font-mono text-xs font-bold leading-6">
                {scene.output}
              </p>
            </div>
          </div>
          <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">
            {scene.note}
          </p>
        </div>

        <noscript>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-6">
            {scenes.map((item) => (
              <li key={item.label}>
                <strong>{item.label}</strong>: {item.input} → {item.operation} → {item.output}. {item.note}
              </li>
            ))}
          </ol>
        </noscript>

        <AnimatedSceneControls
          labels={scenes.map((item) => item.label)}
          {...controls}
          playLabel="과정 재생"
        />
      </div>
    </VizFrame>
  );
}

export const CnnOperatorViz = () => (
  <CnnSceneViz
    id="cnn-operator-modern"
    eyebrow="지역 계산"
    title="한 칸의 계산을 확인한 뒤 같은 규칙을 전체 격자에 옮깁니다"
    description="2×2 숫자 예제에서 입력 좌표, 곱셈, kernel 공유, 출력 크기를 차례로 추적합니다."
    scenes={[
      {
        label: "좌표",
        title: "이미지를 채널·행·열 좌표가 있는 tensor로 읽습니다",
        input: "X[1, 1, 3, 3]",
        operation: "layout을 NCHW로 고정하고 왼쪽 위 2×2 창을 선택합니다.",
        output: "patch = [[1,2],[3,4]]",
        note: "같은 숫자 배열도 축 순서가 다르면 다른 위치와 채널을 뜻합니다.",
      },
      {
        label: "한 칸",
        title: "같은 위치끼리 곱한 네 값을 더합니다",
        input: "patch [[1,2],[3,4]] · W [[1,0],[0,−1]]",
        operation: "1×1 + 2×0 + 3×0 + 4×(−1)",
        output: "Y[0,0] = −3",
        note: "일반적인 딥러닝 라이브러리는 kernel을 뒤집지 않는 cross-correlation을 계산합니다.",
      },
      {
        label: "공유",
        title: "같은 kernel을 오른쪽과 아래로 옮겨 모든 시작점을 계산합니다",
        input: "같은 W · 네 개의 2×2 patch",
        operation: "위치마다 새 weight를 만들지 않고 W를 그대로 재사용합니다.",
        output: "feature map Y[1, 1, 2, 2]",
        note: "입력 해상도는 계산 횟수를 바꾸지만 이 kernel의 parameter 수는 바꾸지 않습니다.",
      },
      {
        label: "크기",
        title: "Padding 뒤 kernel을 놓을 수 있는 시작점 수를 셉니다",
        input: "H=7 · K=3 · P=1 · S=2 · D=1",
        operation: "span=3, room=7+2−3=6, floor(6/2)+1",
        output: "Hout = 4",
        note: "Output shape는 이름이 아니라 padding·stride·dilation 수치로 결정됩니다.",
      },
    ]}
  />
);

export const EquivarianceViz = () => (
  <CnnSceneViz
    id="cnn-equivariance-modern"
    eyebrow="이동 관계"
    title="입력의 위치 변화가 출력 좌표에 어떻게 전달되는지 비교합니다"
    description="Stride 1의 성립 조건부터 stride·경계 반례와 최종 불변성까지 같은 물체를 추적합니다."
    scenes={[
      {
        label: "기준",
        title: "원래 pattern과 detector peak의 좌표를 기록합니다",
        input: "pattern 위치 x=1",
        operation: "모든 위치에 같은 stride-1 kernel을 적용합니다.",
        output: "peak 위치 y=1",
        note: "Equivariance는 값 하나가 아니라 입력과 출력 좌표 사이의 관계입니다.",
      },
      {
        label: "이동",
        title: "입력을 한 칸 옮기면 peak도 한 칸 옮겨집니다",
        input: "T₁x · pattern 위치 x=2",
        operation: "위치별 weight를 바꾸지 않고 같은 kernel을 다시 적용합니다.",
        output: "T₁f(x) · peak 위치 y=2",
        note: "경계 밖을 제외한 stride-1 grid에서는 f(T₁x)=T₁f(x)를 기대할 수 있습니다.",
      },
      {
        label: "반례",
        title: "Stride 2에서는 한 pixel 이동이 sampling 위상을 바꿉니다",
        input: "shift=1 pixel · sample indices 0,2,4",
        operation: "이동 뒤 indices 1,3,5를 읽어 서로 다른 값을 선택합니다.",
        output: "단순한 output 1칸 이동과 다름",
        note: "Zero padding·crop·pooling도 경계와 sampling 규칙 때문에 같은 등식을 깰 수 있습니다.",
      },
      {
        label: "불변",
        title: "위치별 feature를 모은 뒤 최종 class 값이 같을 수 있습니다",
        input: "서로 다른 위치의 shifted feature maps",
        operation: "global pooling으로 공간축을 집계합니다.",
        output: "같은 class score 가능",
        note: "Feature가 함께 이동하는 equivariance와 최종 값이 변하지 않는 invariance는 다른 성질입니다.",
      },
    ]}
  />
);

export const ReceptiveFieldViz = () => (
  <CnnSceneViz
    id="cnn-receptive-modern"
    eyebrow="연결 범위"
    title="위 unit 하나에서 원본 입력까지 계산선을 거꾸로 따라갑니다"
    description="3×3 layer 세 개의 3→5→7 누적과 실제 영향, dilation의 빈 좌표를 구분합니다."
    scenes={[
      {
        label: "한 층",
        title: "3×3 layer 하나는 원본의 3×3 범위와 연결됩니다",
        input: "j₀=1 · r₀=1 · k₁=3",
        operation: "r₁ = 1 + (3−1)×1",
        output: "j₁=1 · r₁=3",
        note: "이 값은 계산 graph에서 닿을 수 있는 이론상 범위입니다.",
      },
      {
        label: "누적",
        title: "Stride 1의 3×3 layer를 쌓으면 한 축이 3→5→7로 넓어집니다",
        input: "r₁=3 · 같은 k=3 layer 두 개 추가",
        operation: "매 layer마다 (3−1)×j = 2를 더합니다.",
        output: "r₂=5 · r₃=7",
        note: "2차원에서는 마지막 unit 하나가 원본의 7×7 주소 범위와 연결됩니다.",
      },
      {
        label: "실제 영향",
        title: "연결된 7×7 전체가 같은 세기로 쓰이는지는 따로 측정합니다",
        input: "고정 checkpoint · sample · output scalar y",
        operation: "pixel별 |∂y/∂xᵢⱼ| 또는 perturbation을 계산합니다.",
        output: "sample별 influence heatmap",
        note: "Effective receptive field는 모델과 입력에 따라 달라지는 측정값입니다.",
      },
      {
        label: "Dilation",
        title: "세 tap의 간격을 벌리면 0·2·4를 읽어 span 5를 만듭니다",
        input: "k=3 · d=2 · taps=3",
        operation: "span = d(k−1)+1 = 5",
        output: "읽음 {0,2,4} · 건너뜀 {1,3}",
        note: "Parameter 수 없이 범위는 넓지만 연속 다섯 좌표를 모두 읽는 dense kernel은 아닙니다.",
      },
    ]}
  />
);

export const DepthwiseViz = () => (
  <CnnSceneViz
    id="cnn-depthwise-modern"
    eyebrow="연산 분리"
    title="공간을 읽는 계산과 채널을 섞는 계산을 따로 셉니다"
    description="k=3, Cin=32, Cout=64인 한 출력 위치의 MAC를 같은 조건에서 비교합니다."
    scenes={[
      {
        label: "Dense",
        title: "모든 spatial tap과 input·output channel 쌍을 한 번에 연결합니다",
        input: "k=3 · Cin=32 · Cout=64",
        operation: "3² × 32 × 64",
        output: "18,432 MAC / 위치",
        note: "이 값이 비교 기준이며 H·W·batch는 두 방식에 공통이라 여기서는 생략합니다.",
      },
      {
        label: "Depthwise",
        title: "각 input channel 안에서만 3×3 공간 필터를 적용합니다",
        input: "32 channels · channel마다 3×3",
        operation: "3² × 32",
        output: "288 MAC · 32-channel 중간값",
        note: "이 단계에서는 서로 다른 채널의 정보가 아직 섞이지 않습니다.",
      },
      {
        label: "Pointwise",
        title: "같은 위치의 32개 값을 1×1 projection으로 64개로 섞습니다",
        input: "32-dimensional vector / 위치",
        operation: "1² × 32 × 64",
        output: "2,048 MAC · Cout=64",
        note: "합계는 2,336 MAC이며 dense 18,432의 약 12.7%입니다.",
      },
      {
        label: "실측",
        title: "계산량이 줄어도 실제 장치 시간은 같은 비율로 줄지 않을 수 있습니다",
        input: "같은 shape·dtype·layout·batch",
        operation: "warmup 뒤 median·p95·traffic·energy·quality를 함께 측정합니다.",
        output: "장치별 채택 또는 dense 유지",
        note: "두 kernel 실행과 중간 tensor write/read가 이론상 MAC 이득을 줄일 수 있습니다.",
      },
    ]}
  />
);

export const VisionTaskViz = () => (
  <CnnSceneViz
    id="cnn-task-modern"
    eyebrow="출력 좌표"
    title="무엇 하나를 답할지 정하면 남겨야 할 공간 정보가 달라집니다"
    description="같은 image feature에서 image·object·pixel·output image 단위의 결과를 비교합니다."
    scenes={[
      {
        label: "분류",
        title: "사진 한 장에 이름 하나를 붙이면 공간축을 모을 수 있습니다",
        input: "F [B,C,H,W]",
        operation: "H·W를 global pooling하고 class head를 적용합니다.",
        output: "Ycls [B,Ccls]",
        note: "위치 세부 정보를 버리는 대신 입력 크기와 무관한 image-level vector를 만듭니다.",
      },
      {
        label: "탐지",
        title: "물체마다 class와 원본 좌표계의 상자를 함께 냅니다",
        input: "multi-scale features",
        operation: "K개 후보마다 class와 x·y·w·h를 예측합니다.",
        output: "Ydet [B,K,Ccls+4]",
        note: "작은 물체는 낮은 output stride의 높은 해상도 feature를 필요로 할 수 있습니다.",
      },
      {
        label: "분할",
        title: "출력 pixel마다 class score를 남겨 입력 좌표에 대응시킵니다",
        input: "encoder feature + 높은 해상도 skip",
        operation: "upsampling과 skip path로 공간 grid를 복원합니다.",
        output: "Yseg [B,Ccls,Ho,Wo]",
        note: "Backbone에서 지운 경계는 head의 이름만 바꾼다고 자동으로 돌아오지 않습니다.",
      },
      {
        label: "검증",
        title: "같은 backbone도 과제별 품질과 비용으로 다시 승인합니다",
        input: "고정 backbone 후보 · task별 dataset",
        operation: "AP·IoU·boundary·distortion과 latency·memory를 각각 측정합니다.",
        output: "과제별 채택 또는 보류",
        note: "분류 정확도 하나는 탐지·분할·복원의 공간 품질을 대신 증명하지 못합니다.",
      },
    ]}
  />
);
