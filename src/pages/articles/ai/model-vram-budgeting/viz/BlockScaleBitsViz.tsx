import VramSceneShell from "./VramSceneShell";

/**
 * 본문 대응: #quantization-vram-tradeoff — b_avg = b_payload + b_scale / g.
 * Q8: 32칸 × 8bit + scale 16bit = 272bit ÷ 32 = 8.5bit. NVFP4: 16칸 × 4bit + scale 8bit = 72bit ÷ 16 = 4.5bit.
 */
type Scene = { label: string; summary: string; note: string; group: number; payload: number; scale: number };

const SCENES: readonly Scene[] = [
  { label: "Q8 · block 하나", summary: "32 × 8 + 16 = 272 bit", group: 32, payload: 8, scale: 16, note: "원소 32개가 각자 8bit payload를 갖고, 그 block 전체가 16bit scale 하나를 함께 씁니다. Scale은 원소마다 붙지 않고 block마다 한 번만 저장됩니다." },
  { label: "Q8 · 원소당 평균", summary: "272 ÷ 32 = 8.5 bit", group: 32, payload: 8, scale: 16, note: "Block의 bit를 원소 32개로 나누면 8 + 16/32 = 8.5bit입니다. Scale 16bit가 32개에 나눠져 원소마다 0.5bit씩 더해진 셈입니다." },
  { label: "NVFP4 · block 하나", summary: "16 × 4 + 8 = 72 bit", group: 16, payload: 4, scale: 8, note: "NVFP4는 원소 16개가 4bit payload를 갖고 8bit scale 하나를 함께 씁니다. 원소 폭은 Q8의 절반이고 block도 절반 크기입니다." },
  { label: "NVFP4 · 원소당 평균", summary: "72 ÷ 16 = 4.5 bit", group: 16, payload: 4, scale: 8, note: "4 + 8/16 = 4.5bit입니다. 두 format 모두 scale overhead가 원소당 0.5bit로 같아서, 평균 차이는 payload 차이 4bit가 그대로 남습니다." },
];

const W = 360;
const CELL = 6;
const GAP = 1.5;

export default function BlockScaleBitsViz() {
  return (
    <VramSceneShell
      eyebrow="Block scale"
      title="Scale 하나를 block의 원소 수로 나누면 원소당 평균 bit가 나옵니다"
      description="Payload는 원소 값 자체를 담는 bit이고, scale은 그 값을 원래 크기로 되돌리는 숫자입니다. 칸 하나가 원소 하나이고 칸의 세로 길이가 bit 수입니다. 본문 식의 1차 근사이며 tensor 단위 추가 scale과 packing은 뺐습니다."
      ariaLabel="Q8과 NVFP4 block의 payload bit와 scale bit, 원소당 평균 bit"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const averaged = active === 1 || active === 3;
        const unit = 7;
        const baseY = 150;
        const startX = 14;
        const scaleShare = scene.scale / scene.group;
        const cells = Array.from({ length: scene.group }, (_, i) => i);
        const scaleX = startX + scene.group * (CELL + GAP) + 6;
        return (
          <svg viewBox={`0 0 ${W} 180`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {cells.map((i) => {
              const x = startX + i * (CELL + GAP);
              const ph = scene.payload * unit;
              return (
                <g key={i}>
                  <rect x={x} y={baseY - ph} width={CELL} height={ph} fill="#2563eb" opacity={0.75} />
                  {averaged && <rect x={x} y={baseY - ph - scaleShare * unit} width={CELL} height={scaleShare * unit} fill="#d97706" />}
                </g>
              );
            })}
            {!averaged && (
              <g>
                <rect x={scaleX} y={baseY - scene.scale * unit} width={CELL} height={scene.scale * unit} fill="#d97706" />
                <text x={scaleX + CELL + 4} y={baseY - scene.scale * unit + 10} fontSize={13} fill="#d97706" fontWeight={700}>scale {scene.scale}bit</text>
              </g>
            )}
            <line x1={startX - 4} x2={W - 8} y1={baseY} y2={baseY} stroke="#94a3b8" strokeWidth={1} />
            <text x={startX} y={baseY + 16} fontSize={13} fill="#64748b">
              원소 {scene.group}개 · 각 {scene.payload}bit payload
            </text>
            {averaged && (
              <text x={startX} y={baseY - scene.payload * unit - scaleShare * unit - 8} fontSize={13} fontWeight={700} fill="#d97706">
                칸마다 scale {scene.scale}/{scene.group} = {scaleShare}bit 추가 → {scene.payload + scaleShare}bit
              </text>
            )}
          </svg>
        );
      }}
    />
  );
}
