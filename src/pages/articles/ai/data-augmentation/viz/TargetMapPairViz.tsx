import SceneShell from "./SceneShell";

/**
 * 본문 대응: #target-map — image와 box가 같은 sampled parameter를 공유해야 pair가 유효하다.
 * 1절의 640×480 사진·box (80,120)–(240,360)을 좌우 flip한다. x′ = 640 − x이므로
 * 새 box는 (640−240, 120)–(640−80, 360) = (400,120)–(560,360)이다. y는 그대로다.
 * 그림 좌표: 사진 1px = 0.4 단위, 사진 왼쪽 위가 (32,14).
 */
const SCALE = 0.4;
const OX = 32;
const OY = 14;
const W = 640;
const H = 480;

const SCENES = [
  {
    label: "원본 pair",
    summary: "box (80,120)–(240,360)",
    note: "640×480 상품 사진에서 상품과 box가 같은 자리 x 80–240에 있습니다. 상품 왼쪽 위의 작은 표시는 좌우가 뒤집혔는지 보려고 그린 것입니다(가정).",
    flipped: false,
    box: "orig",
  },
  {
    label: "Image만 뒤집힌 pair",
    summary: "상품 x 400–560 · box x 80–240",
    note: "Parameter를 image와 annotation에서 따로 뽑아 image에는 flip이, box에는 flip 안 함이 나온 경우입니다(가정). 사진은 그럴듯하지만 box는 빈 자리를 가리켜 정답이 어긋난 pair가 됩니다.",
    flipped: true,
    box: "stale",
  },
  {
    label: "같은 ω로 target map 적용",
    summary: "x′ = 640 − x → (400,120)–(560,360)",
    note: "ω는 이번에 뽑은 transform parameter입니다. 같은 ω(좌우 flip)를 box에도 쓰면 x₁′ = 640 − 240 = 400, x₂′ = 640 − 80 = 560이 되고 y 120–360은 그대로입니다.",
    flipped: true,
    box: "mapped",
  },
  {
    label: "Receipt에 함께 기록",
    summary: "source · T rev · ω · τ rev",
    note: "Receipt에는 source ID·transform revision·sampled parameter·target-map revision을 함께 둡니다. 어떤 ω로 image와 box를 바꿨는지 한 기록에서 확인할 수 있습니다.",
    flipped: true,
    box: "mapped",
  },
] as const;

const RECEIPT = ["source ID", "transform revision", "sampled parameter ω", "target-map revision"] as const;

const px = (x: number) => OX + x * SCALE;
const py = (y: number) => OY + y * SCALE;

function Product({ flipped }: { flipped: boolean }) {
  const x1 = flipped ? W - 240 : 80;
  const x2 = flipped ? W - 80 : 240;
  const tagX = flipped ? px(x2) - 22 : px(x1) + 10;
  return (
    <g>
      <rect x={px(x1) + 6} y={py(120) + 6} width={(x2 - x1) * SCALE - 12} height={240 * SCALE - 12} rx="6" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
      <rect x={tagX} y={py(120) + 14} width="12" height="12" fill="#475569" />
    </g>
  );
}

export default function TargetMapPairViz() {
  return (
    <SceneShell
      eyebrow="Input transform T · target map τ"
      title="뒤집은 사진과 box가 같은 parameter를 써야 정답이 맞습니다"
      description="1절의 640×480 상품 사진과 box (80,120)–(240,360)을 좌우로 뒤집습니다. 회색 사각형이 상품, 파란 테두리가 정답 box, 빨간 점선이 어긋난 box입니다."
      ariaLabel="좌우 flip 뒤 box를 갱신하지 않은 경우와 같은 parameter로 갱신한 경우 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const boxX1 = scene.box === "mapped" ? 400 : 80;
        const boxX2 = scene.box === "mapped" ? 560 : 240;
        const stale = scene.box === "stale";
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 320 240" role="img" aria-label={`${scene.label}: ${scene.summary}`} className="mx-auto block h-auto w-full max-w-[21rem]">
              <rect x={OX} y={OY} width={W * SCALE} height={H * SCALE} fill="none" stroke="#64748b" strokeWidth="1" />
              {scene.flipped ? (
                <g>
                  <line x1={px(320)} y1={OY} x2={px(320)} y2={py(H)} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 4" />
                  <text x={px(320) + 4} y={py(H) - 6} className="fill-muted-foreground" fontSize="12">
                    x = 320에서 좌우 반전
                  </text>
                </g>
              ) : null}
              <Product flipped={scene.flipped} />
              <rect
                x={px(boxX1)}
                y={py(120)}
                width={(boxX2 - boxX1) * SCALE}
                height={240 * SCALE}
                fill="none"
                stroke={stale ? "#dc2626" : "#2563eb"}
                strokeWidth="1.25"
                strokeDasharray={stale ? "5 3" : undefined}
              />
              <text x={px(boxX1)} y={py(120) - 5} fontSize="12" className={stale ? "fill-red-600 dark:fill-red-400" : "fill-blue-600 dark:fill-blue-400"}>
                {stale ? "box 그대로" : "box"}
              </text>
              {[0, 80, 240, 400, 560, 640].map((x) => (
                <g key={x}>
                  <line x1={px(x)} y1={py(H)} x2={px(x)} y2={py(H) + 4} stroke="#64748b" strokeWidth="1" />
                  <text x={px(x)} y={py(H) + 16} textAnchor="middle" fontSize="12" className="fill-muted-foreground">
                    {x}
                  </text>
                </g>
              ))}
              <text x={px(W)} y={py(H) + 30} textAnchor="end" fontSize="12" className="fill-muted-foreground">
                x (px)
              </text>
            </svg>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {RECEIPT.map((field) => (
                <div
                  key={field}
                  className={`rounded-lg border px-2 py-2 text-center text-xs leading-5 transition-opacity duration-300 motion-reduce:transition-none ${
                    active === 3 ? "border-primary/60 opacity-100" : "border-border opacity-40"
                  }`}
                >
                  {field}
                  {field === "sampled parameter ω" ? <span className="block font-mono text-muted-foreground">= 좌우 flip</span> : null}
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
