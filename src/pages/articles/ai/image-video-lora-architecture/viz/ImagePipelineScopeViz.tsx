import SceneShell from "./SceneShell";

/**
 * 본문 대응: #image-scope — text-to-image pipeline의 세 component와 adapter 범위.
 * 학습 시 prediction loss가 직접 통과하는 denoiser가 기본 출발점이고,
 * text encoder는 선택, VAE·scheduler는 동결되어도 결과에 영향을 줍니다.
 */
const SCENES = [
  { label: "세 component", summary: "image·prompt → denoiser", note: "autoencoder는 image를 latent(압축한 표현)로, text encoder는 prompt를 embedding(수치 표현)으로 바꿉니다. denoiser는 잡음 섞인 latent를 복원합니다." },
  { label: "기본 출발점은 denoiser", summary: "loss가 직접 통과", note: "style이나 subject adaptation은 보통 denoiser에서 시작합니다. 학습 시 매 step의 prediction loss가 직접 통과하는 component이기 때문입니다." },
  { label: "text encoder는 선택", summary: "필요할 때만 함께 학습", note: "새 token·이름과 prompt 표현 자체를 바꿔야 할 때 선택적으로 엽니다. 항상 켜는 기본값이 아니며 추가 memory와 language drift를 따로 평가합니다." },
  { label: "동결돼도 영향은 남습니다", summary: "VAE·scheduler", note: "VAE(그림의 autoencoder)와 scheduler는 gradient update 대상이 아닐 뿐 input scale과 output ceiling을 정합니다. 다른 VAE revision으로 decode하면 artifact가 달라질 수 있어 revision을 기록합니다." },
] as const;

const BLUE = "#2563eb";
const AMBER = "#d97706";
const SLATE = "#64748b";
const LINE = "#94a3b8";

function Box({ x, y, w, h, name, state, on = false, dashed = false, amber = false }: { x: number; y: number; w: number; h: number; name: string; state?: string; on?: boolean; dashed?: boolean; amber?: boolean }) {
  const color = on ? BLUE : amber ? AMBER : LINE;
  const text = on ? BLUE : amber ? AMBER : SLATE;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={on ? BLUE : amber ? AMBER : "none"} fillOpacity={on || amber ? 0.12 : 0} stroke={color} strokeWidth={on || amber ? 1.25 : 1} strokeDasharray={dashed ? "3 3" : undefined} />
      <text x={x + w / 2} y={y + h / 2 - (state ? 3 : -4)} textAnchor="middle" fontSize={12} fontWeight={700} fill={text}>{name}</text>
      {state && <text x={x + w / 2} y={y + h / 2 + 13} textAnchor="middle" fontSize={11} fill={text}>{state}</text>}
    </g>
  );
}

export default function ImagePipelineScopeViz() {
  return (
    <SceneShell
      eyebrow="Image pipeline"
      title="LoRA를 어느 component에 붙일지는 loss가 지나는 길에서 출발합니다"
      description="파란 상자가 LoRA로 학습하는 component입니다. 동결(frozen)은 학습으로 weight를 바꾸지 않는다는 뜻입니다."
      ariaLabel="autoencoder, text encoder, denoiser 중 LoRA를 붙이는 범위"
      scenes={SCENES}
      render={(active) => {
        const trainText = active === 2;
        const showState = active > 0;
        const frozenFocus = active === 3;
        return (
          <svg viewBox="0 0 360 176" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Box x={6} y={14} w={52} h={44} name="이미지" />
            <Box x={6} y={118} w={52} h={44} name="prompt" />
            <Box x={76} y={14} w={100} h={44} name="autoencoder" state={showState ? "동결" : undefined} amber={frozenFocus} />
            <Box x={76} y={118} w={100} h={44} name="text encoder" state={showState ? (trainText ? "LoRA 학습" : "동결") : undefined} on={trainText} />
            <Box x={212} y={14} w={72} h={148} name="denoiser" state={showState ? "LoRA 학습" : undefined} on={active >= 1} />
            <Box x={302} y={50} w={52} h={40} name="loss" />
            {frozenFocus && <Box x={290} y={118} w={68} h={44} name="scheduler" state="동결" amber />}
            <path d="M58 36h14m-4 -3 4 3 -4 3" fill="none" stroke={LINE} strokeWidth={1} />
            <path d="M58 140h14m-4 -3 4 3 -4 3" fill="none" stroke={LINE} strokeWidth={1} />
            <path d="M176 36h32m-4 -3 4 3 -4 3" fill="none" stroke={LINE} strokeWidth={1} />
            <path d="M176 140h32m-4 -3 4 3 -4 3" fill="none" stroke={LINE} strokeWidth={1} />
            <text x={204} y={78} textAnchor="end" fontSize={12} fill={SLATE}>잡음 섞인 latent →</text>
            <text x={204} y={104} textAnchor="end" fontSize={12} fill={SLATE}>embedding →</text>
            <path d="M284 62h14m-4 -3 4 3 -4 3" fill="none" stroke={LINE} strokeWidth={1} />
            {active === 1 || active === 2 ? <path d="M302 80h-14m4 -3 -4 3 4 3" fill="none" stroke={BLUE} strokeWidth={1.25} /> : null}
            {active === 1 || active === 2 ? <text x={328} y={106} textAnchor="middle" fontSize={11} fontWeight={700} fill={BLUE}>역전파</text> : null}
            {active === 2 && <path d="M212 152h-32m4 -3 -4 3 4 3" fill="none" stroke={BLUE} strokeWidth={1.25} strokeDasharray="3 3" />}
          </svg>
        );
      }}
    />
  );
}
