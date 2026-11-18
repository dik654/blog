import G16SceneShell from "./G16SceneShell";

/**
 * 본문 대응: #setup — τ=5, α=2, β=3, γ=7, δ=11 (검산용으로 드러낸 가정), 모든 수는 mod 101.
 * 공개 (1,x,y): d=(0,92,4) ×29(7의 역원) → (0,42,15), 3×42+43×15=771≡64.
 * 비공개 (w,v): d=(95,17), 4×95+12×17=584≡79. 몫 기여 hT=72×12=864≡56. (79+56)×46(11의 역원)=6210≡49.
 */
const PUBLIC = [
  { name: "1", value: "1", d: 0, ic: 0 },
  { name: "x", value: "3", d: 92, ic: 42 },
  { name: "y", value: "43", d: 4, ic: 15 },
] as const;

const PRIVATE = [
  { name: "w", value: "4", d: 95 },
  { name: "v", value: "12", d: 17 },
] as const;

const SCENES = [
  { label: "다섯 자리 나누기", summary: "z = (1, x, y, w, v)", note: "변수마다 준비 값 dᵢ가 하나씩 있습니다. 앞의 세 자리 1·x·y는 공개 쪽으로, 뒤의 w·v는 비공개 쪽으로 갑니다. dᵢ에는 아직 실제 값 3·43·4·12가 곱해지지 않았습니다." },
  { label: "공개 쪽은 γ로 나눔", summary: "3×42 + 43×15 = 64", note: "7로 나누는 대신 7의 역원 29를 곱해 (0,92,4)가 (0,42,15)가 됩니다. 확인자가 공개값 3·43을 곱해 더하면 결합 지수 64가 나옵니다." },
  { label: "비공개 쪽 합", summary: "4×95 + 12×17 = 79", note: "비공개 값 4·12에 각자의 dᵢ를 곱해 더합니다. 비공개 값을 쓰므로 계산자 쪽에서 계산하며, 확인자는 4·12를 받지 않습니다." },
  { label: "몫 더하고 δ로 나눔", summary: "(79 + 56) × 46 = 49", note: "비공개 합 79에 몫의 기여 hT=72×12=56을 더하고, 11의 역원 46을 곱합니다. 이 49가 난수를 더하기 전 C의 지수입니다." },
] as const;

function Cell({ name, value, d, dim }: { name: string; value: string; d: number; dim: boolean }) {
  return (
    <div className={`rounded-md border border-border bg-background px-1 py-2 text-center ${dim ? "opacity-50" : ""}`}>
      <span className="block font-mono text-sm font-bold">{name}</span>
      <span className="block text-xs text-muted-foreground">값 {value}</span>
      <span className="block font-mono text-xs">d={d}</span>
    </div>
  );
}

function Line({ show, active, side, children }: { show: boolean; active: boolean; side: string; children: string }) {
  return (
    <div className={`grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-2 rounded-md border px-2 py-1.5 text-xs leading-5 sm:text-sm ${show ? (active ? "border-[#2563eb] bg-[#dbeafe]/60 font-bold text-[#1e3a8a]" : "border-border") : "border-dashed border-border text-transparent"}`}>
      <span className="text-[11px] font-normal sm:text-xs">{side}</span>
      <span className="font-mono">{children}</span>
    </div>
  );
}

function Picture({ scene }: { scene: number }) {
  return (
    <div className="min-w-0 space-y-3">
      <div className="grid min-w-0 grid-cols-[3fr_2fr] gap-3 sm:gap-4">
        <div className="min-w-0 space-y-2">
          <div className="text-xs font-bold text-[#1d4ed8]">공개 · 확인자도 계산</div>
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {PUBLIC.map((p) => (
              <Cell key={p.name} name={p.name} value={p.value} d={p.d} dim={scene === 2 || scene === 3} />
            ))}
          </div>
        </div>
        <div className="min-w-0 space-y-2">
          <div className="text-xs font-bold text-[#b45309]">비공개 · 계산자 쪽</div>
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            {PRIVATE.map((p) => (
              <Cell key={p.name} name={p.name} value={p.value} d={p.d} dim={scene === 1} />
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-1.5">
        <Line show={scene >= 1} active={scene === 1} side="공개 ÷γ">×29 → (0, 42, 15)</Line>
        <Line show={scene >= 1} active={scene === 1} side="공개 결합">3×42 + 43×15 = 64</Line>
        <Line show={scene >= 2} active={scene === 2} side="비공개 합">4×95 + 12×17 = 79</Line>
        <Line show={scene >= 3} active={scene === 3} side="+몫, ÷δ">(79 + 56) × 46 = 49</Line>
      </div>
    </div>
  );
}

export default function SetupSplitViz() {
  return (
    <G16SceneShell
      eyebrow="공개 항과 비공개 항"
      title="같은 다섯 자리를 γ 쪽과 δ 쪽으로 나눠 계산합니다"
      description="칸 하나가 변수 하나입니다. dᵢ는 그 변수의 열 다항식을 비밀 평가점 τ=5에 넣어 βuᵢ+αvᵢ+wᵢ로 묶은 준비 값이고, 모든 수는 101의 나머지입니다. τ·α·β·γ=7·δ=11은 검산용으로 드러낸 가정이며 실제 설정에서는 공개하면 안 됩니다."
      ariaLabel="변수 다섯 자리를 공개 쪽과 비공개 쪽으로 나누어 64와 49를 얻는 계산"
      scenes={SCENES}
      render={(index) => <Picture scene={index} />}
    />
  );
}
