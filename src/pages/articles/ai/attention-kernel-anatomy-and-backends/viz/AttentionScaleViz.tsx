import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import VizFrame from "@/components/viz/VizFrame";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";

const labels = ["큰 prefill", "한 행 decode", "GQA 공유", "16 GiB 전송"] as const;

function TensorBlock({ name, shape, size, tall = false }: { name: string; shape: string; size: string; tall?: boolean }) {
  return (
    <div className={`flex min-w-0 flex-col justify-between border border-border bg-background p-3 ${tall ? "min-h-36" : "min-h-24"}`}>
      <p className="font-mono text-sm font-bold text-foreground">{name}</p>
      <div className="my-3 grid grid-cols-4 gap-1" aria-hidden="true">
        {Array.from({ length: tall ? 16 : 8 }, (_, index) => <span key={index} className="h-2 border border-primary/40 bg-primary/15" />)}
      </div>
      <p className="break-words text-xs tabular-nums text-muted-foreground">{shape}</p>
      <p className="mt-1 text-sm font-bold tabular-nums text-primary">{size}</p>
    </div>
  );
}

function PrefillScene() {
  return (
    <div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-4">
        <TensorBlock name="Q" shape="4,096 × 128" size="1 MiB" />
        <span className="text-lg text-muted-foreground" aria-hidden="true">×</span>
        <TensorBlock name="Kᵀ" shape="128 × 4,096" size="K는 1 MiB" />
      </div>
      <div className="mx-auto mt-3 max-w-sm border-l-2 border-primary pl-4">
        <p className="text-xs font-bold text-muted-foreground">모든 query-key 짝의 점수</p>
        <div className="mt-2 grid grid-cols-8 gap-0.5" aria-label="4096 곱하기 4096 점수 행렬을 줄여 그린 격자">
          {Array.from({ length: 64 }, (_, index) => <span key={index} className="h-2 border border-border bg-muted/70" />)}
        </div>
        <p className="mt-2 font-mono text-xs text-foreground">4,096 × 4,096칸</p>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <p className="border-l-2 border-border pl-3 font-mono text-sm leading-6 text-foreground">QK 4,294,967,296<br />+ PV 4,294,967,296 FLOP</p>
        <p className="border-l-2 border-primary pl-3 font-mono text-sm leading-6 text-foreground">Q·K·V·O 각 1 MiB<br />8,589,934,592 ÷ 4 MiB = 2,048 FLOP/B</p>
      </div>
    </div>
  );
}

function DecodeScene() {
  return (
    <div className="grid gap-4 sm:grid-cols-[minmax(0,0.65fr)_minmax(0,1.35fr)] sm:items-center">
      <div className="grid grid-cols-2 gap-2">
        <TensorBlock name="Q" shape="1 × 128" size="256 B" />
        <TensorBlock name="O" shape="1 × 128" size="256 B" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <TensorBlock name="K" shape="4,096 × 128" size="1 MiB" tall />
        <TensorBlock name="V" shape="4,096 × 128" size="1 MiB" tall />
      </div>
      <p className="sm:col-span-2 border-l-2 border-primary pl-4 font-mono text-sm leading-6 text-foreground">
        새 행 1개가 과거 4,096행을 두 번 훑음<br />2,097,152 FLOP ÷ (2,097,152 + 512) B ≈ 0.9998 FLOP/B
      </p>
    </div>
  );
}

function GqaScene() {
  return (
    <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] sm:items-center">
      <div>
        <p className="text-xs font-bold text-muted-foreground">서로 다른 query head 8개</p>
        <div className="mt-3 grid grid-cols-4 gap-2" aria-label="query head 여덟 개">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="flex aspect-square items-center justify-center border border-primary/50 bg-primary/15 text-xs font-bold text-foreground">Q{index}</div>
          ))}
        </div>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">각 head가 자기 QK·PV 계산을 하므로 계산량은 여덟 배입니다.</p>
      </div>
      <div className="border-l-2 border-primary pl-4">
        <p className="text-xs font-bold text-muted-foreground">함께 읽는 K·V 한 벌</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <TensorBlock name="K" shape="4,096 × 128" size="1 MiB" tall />
          <TensorBlock name="V" shape="4,096 × 128" size="1 MiB" tall />
        </div>
        <p className="mt-3 text-sm leading-6 text-foreground">K·V를 한 번 읽어 여덟 head가 실제로 공유할 때만 약 8 FLOP/B가 됩니다.</p>
      </div>
    </div>
  );
}

function BandwidthScene() {
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          ["요청", "32"],
          ["층", "32"],
          ["KV head", "8"],
          ["head마다 K·V", "2 MiB"],
        ].map(([label, value]) => (
          <div key={label} className="border border-border bg-background p-3 text-center">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-2 text-lg font-bold tabular-nums text-foreground">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 border-y border-border py-4">
        <div className="h-8 w-full border border-primary/50 bg-primary/15" aria-label="한 step에서 읽는 16 GiB" />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="font-bold text-foreground">한 step의 이동량 16 GiB</span>
          <span className="text-muted-foreground">통로 3.35 TB/s</span>
          <span className="font-bold text-primary">최소 5.128 ms</span>
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="border-l-2 border-border pl-3">
          <p className="text-xs text-muted-foreground">장치 계산 처리율</p>
          <p className="mt-1 font-mono text-sm text-foreground">989 TFLOP/s</p>
        </div>
        <div className="border-l-2 border-primary pl-3">
          <p className="text-xs text-muted-foreground">계산 ÷ 메모리 균형점</p>
          <p className="mt-1 font-mono text-sm text-foreground">989 ÷ 3.35 ≈ 295 FLOP/B</p>
        </div>
      </div>
    </div>
  );
}

const scenes = [<PrefillScene key="prefill" />, <DecodeScene key="decode" />, <GqaScene key="gqa" />, <BandwidthScene key="bandwidth" />] as const;

export default function AttentionScaleViz() {
  const scene = useAnimatedScenes(scenes.length, 7000);
  return (
    <VizFrame
      eyebrow="작은 장부를 큰 입력으로"
      title="같은 네 배열에서 prefill은 큰 정사각형을 만들고 decode는 긴 K·V를 읽습니다"
      description="길이 4,096, head 폭 128, 값마다 2바이트인 한 attention head부터 시작합니다."
      note="사각형의 면적과 칸 수는 관계를 보여 주기 위해 축소했습니다. 화면의 픽셀 면적을 실제 byte 비율로 읽지 않습니다."
    >
      <div role="group" tabIndex={0} onKeyDown={scene.onKeyDown} aria-label="큰 attention 계산의 prefill decode GQA 대역폭 장면" className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {["정사각형 계산", "긴 K·V 읽기", "여덟 Q가 공유", "이동 시간 하한"].map((item, index) => (
            <div key={item} className={`border-t-2 px-2 py-2 text-center text-xs font-bold leading-5 ${scene.active === index ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground"}`}>{item}</div>
          ))}
        </div>
        <div className="mt-5 min-w-0 border-t border-border pt-5 sm:min-h-[29rem]">{scenes[scene.active]}</div>
        <AnimatedSceneControls {...scene} labels={labels} />
      </div>
    </VizFrame>
  );
}
