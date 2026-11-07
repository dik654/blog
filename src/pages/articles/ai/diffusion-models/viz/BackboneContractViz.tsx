import SceneShell from "./SceneShell";

/**
 * 본문 대응: #target — backbone contract: B×4×64×64 latent, timestep B, text B×L×D → B×4×64×64 ε̂.
 * B·L·D 뜻은 축 이름 풀이. 구조는 본문의 "tensor interface"와 "U-Net·DiT는 구현 중 하나".
 */
const SCENES = [
  { label: "받는 것 세 가지", summary: "noisy tensor · time · 조건", note: "B는 한 번에 처리하는 sample 수입니다. latent는 image를 압축한 tensor로 4개 채널에 64×64 칸, timestep은 sample마다 하나, text는 길이 L에 칸마다 D개 숫자입니다." },
  { label: "내는 것 한 가지", summary: "입력 latent와 같은 모양", note: "ε̂는 noisy latent와 축 크기까지 같습니다. 바뀌는 것은 칸 안의 값입니다." },
  { label: "가운데는 바꿀 수 있음", summary: "U-Net · DiT · …", note: "Architecture는 이 계약의 구현 중 하나입니다. 모든 diffusion이 U-Net이나 cross-attention을 쓰지는 않습니다." },
];

function Tile({ name, shape, on, dashed = false }: { name: string; shape: string; on: boolean; dashed?: boolean }) {
  return (
    <div className={`flex flex-wrap items-baseline justify-between gap-x-2 rounded-lg px-3 py-1.5 ${dashed ? "border border-dashed" : "border"} ${on ? "border-primary" : "border-border opacity-50"}`}>
      <p className="text-xs font-bold">{name}</p>
      <p className="font-mono text-sm">{shape}</p>
    </div>
  );
}

function Flow() {
  return (
    <p className="text-center text-sm text-muted-foreground" aria-hidden>
      <span className="md:hidden">↓</span>
      <span className="hidden md:inline">→</span>
    </p>
  );
}

export default function BackboneContractViz() {
  return (
    <SceneShell
      eyebrow="입력과 출력의 약속"
      title="backbone이 무엇이든 받는 모양과 내는 모양을 먼저 정합니다"
      description="B×4×64×64는 네 축의 크기를 이어 쓴 표기이며 아래 예시의 값입니다."
      ariaLabel="noisy latent, timestep, text 입력이 backbone을 지나 같은 모양의 예측으로 나오는 계약"
      scenes={SCENES}
      render={(active) => (
        <div className="grid min-w-0 gap-2 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,0.8fr)_auto_minmax(0,1fr)] md:items-center">
          <div className="space-y-2">
            <Tile name="noisy latent" shape="B×4×64×64" on={active !== 2} />
            <Tile name="timestep" shape="B" on={active === 0} />
            <Tile name="text (선택)" shape="B×L×D" on={active === 0} dashed />
          </div>
          <Flow />
          <div className={`rounded-lg border px-3 py-2 text-center ${active === 2 ? "border-primary" : "border-border"}`}>
            <p className="text-sm font-bold">backbone</p>
            <p className="mt-1 text-xs text-muted-foreground">{active === 2 ? "U-Net · DiT 등 구현 중 하나" : "안쪽 구조는 계약 밖"}</p>
          </div>
          <Flow />
          <Tile name="예측 ε̂" shape="B×4×64×64" on={active === 1} />
        </div>
      )}
    />
  );
}
