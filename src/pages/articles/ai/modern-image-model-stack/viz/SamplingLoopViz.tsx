import SceneShell from "./SceneShell";

/**
 * 본문 대응: #component-contract — prompt encoder가 c를 만들고, DiT가 (zₜ, t, c)에서 방향을 예측하며,
 * solver가 그 예측으로 z₁의 noise에서 z₀까지 이동하고, decoder는 마지막 z₀만 pixel로 복원한다.
 * 칸 수 4는 그림용 가정이다. 본문은 step·NFE 수를 정하지 않는다.
 */
const STEPS = 4;
const TIMES = ["1", "0.75", "0.5", "0.25", "0"] as const;
const TRACK_Y = 122;
const X0 = 34;
const X_END = 300;
const nodeX = (index: number) => X0 + (index * (X_END - X0)) / STEPS;

const ACCENT = "#2563eb";
const MUTED = "#94a3b8";
const TEXT = "#64748b";

const SCENES = [
  { label: "조건 c를 먼저 만듭니다", summary: "prompt → c", pos: -1, calls: 0, note: "Prompt encoder가 문자열을 condition token c로 바꿉니다. 이 c는 반복 구간 전체에서 다시 쓰이고, 반복 안에서 새로 만들지 않습니다." },
  { label: "출발점은 noise z₁", summary: "t = 1", pos: 0, calls: 0, note: "z₁은 noise에서 뽑은 latent입니다. 그 모양(shape)은 autoencoder의 압축률과 channel 수가 정합니다. 아직 DiT는 한 번도 호출되지 않았습니다." },
  { label: "DiT가 이동 방향을 예측합니다", summary: "v̂ = v_θ(z₁, 1, c)", pos: 0, calls: 1, note: "DiT는 현재 latent, time, 조건 c를 받아 velocity(또는 noise)를 예측합니다. 이것은 이동할 방향일 뿐 pixel image가 아닙니다." },
  { label: "Solver가 한 칸 움직입니다", summary: "z₁ → t = 0.75", pos: 1, calls: 1, note: "Solver는 DiT의 예측을 이용해 latent를 다음 time으로 옮깁니다. Prediction target과 solver convention이 서로 맞아야 이 이동이 의미를 갖습니다." },
  { label: "예측과 이동을 반복합니다", summary: "z₀ 도착 · DiT 4회(가정)", pos: 4, calls: 4, note: "칸마다 DiT가 전체 noisy latent를 다시 읽고 solver가 한 칸 옮깁니다. 여기서는 4칸·칸당 1회 호출로 그렸지만(가정) 실제 횟수는 sampler와 NFE(network를 실제로 부르는 횟수) 설정이 정합니다." },
  { label: "마지막 z₀만 decoder로", summary: "x̂ = D(z₀) · 1회", pos: 4, calls: 4, note: "Decoder는 반복이 끝난 z₀ 하나만 pixel image로 복원합니다. 그래서 DiT 개선과 decoder 복원 품질 개선은 서로 다른 실험으로 나눠 봐야 합니다." },
] as const;

function Box({ x, y, w, title, sub, on }: { x: number; y: number; w: number; title: string; sub: string; on: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={38} rx={8} fill="none" stroke={on ? ACCENT : MUTED} strokeWidth={on ? 1.25 : 1} />
      <text x={x + w / 2} y={y + 16} textAnchor="middle" fontSize={13} fontWeight={700} fill={on ? ACCENT : TEXT}>
        {title}
      </text>
      <text x={x + w / 2} y={y + 30} textAnchor="middle" fontSize={11} fill={TEXT}>
        {sub}
      </text>
    </g>
  );
}

export default function SamplingLoopViz() {
  return (
    <SceneShell
      eyebrow="한 sample이 만들어지는 순서"
      title="DiT는 여러 번, decoder는 마지막에 한 번만 호출됩니다"
      description="가로줄은 noise z₁(t = 1)에서 생성 latent z₀(t = 0)까지 가는 sampling path입니다. 칸 수 4와 칸당 DiT 1회는 그림을 위한 가정입니다."
      ariaLabel="조건 인코딩, DiT 반복 예측, solver 이동, decoder 복원의 순서"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const predicting = active === 2;
        const decoding = active === 5;
        return (
          <svg viewBox="0 0 360 210" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <Box x={10} y={10} w={104} title="조건 c" sub="prompt encoder 1회" on={active === 0} />
            <Box x={136} y={10} w={104} title="DiT" sub="방향 v̂ 예측" on={predicting || active === 4} />
            <text x={350} y={26} textAnchor="end" fontSize={11} fill={TEXT}>
              DiT 호출
            </text>
            <text x={350} y={44} textAnchor="end" fontSize={16} fontWeight={700} fill={scene.calls > 0 ? ACCENT : TEXT}>
              {scene.calls}회
            </text>
            {active >= 2 && (
              <line x1={114} y1={29} x2={136} y2={29} stroke={MUTED} strokeWidth={1} strokeDasharray="3 3" />
            )}
            {predicting && (
              <>
                <line x1={188} y1={48} x2={nodeX(0) + 6} y2={TRACK_Y - 12} stroke={ACCENT} strokeWidth={1.25} />
                <text x={104} y={84} textAnchor="middle" fontSize={12} fontWeight={700} fill={ACCENT}>
                  v̂
                </text>
              </>
            )}
            <line x1={X0} x2={X_END} y1={TRACK_Y} y2={TRACK_Y} stroke={MUTED} strokeWidth={1} strokeDasharray="3 3" />
            {scene.pos > 0 && (
              <line x1={X0} x2={nodeX(scene.pos)} y1={TRACK_Y} y2={TRACK_Y} stroke={ACCENT} strokeWidth={1.25} />
            )}
            {TIMES.map((time, index) => {
              const reached = scene.pos >= index;
              const current = scene.pos === index;
              return (
                <g key={time}>
                  <circle cx={nodeX(index)} cy={TRACK_Y} r={current ? 8 : 5} fill={current ? ACCENT : reached ? "#93c5fd" : "#e2e8f0"} stroke={reached ? ACCENT : MUTED} strokeWidth={1} />
                  <text x={nodeX(index)} y={TRACK_Y + 24} textAnchor="middle" fontSize={11} fill={TEXT}>
                    t={time}
                  </text>
                </g>
              );
            })}
            <text x={X0} y={TRACK_Y - 16} textAnchor="middle" fontSize={13} fontWeight={700} fill={active === 1 ? ACCENT : TEXT}>
              z₁
            </text>
            <text x={X_END} y={TRACK_Y - 16} textAnchor="middle" fontSize={13} fontWeight={700} fill={scene.pos === 4 ? ACCENT : TEXT}>
              z₀
            </text>
            <text x={X0} y={TRACK_Y + 38} textAnchor="middle" fontSize={11} fill={TEXT}>
              noise
            </text>
            <Box x={236} y={164} w={118} title="decoder D" sub="z₀ → 이미지 x̂" on={decoding} />
            {decoding && <line x1={X_END} y1={TRACK_Y + 30} x2={X_END} y2={164} stroke={ACCENT} strokeWidth={1.25} />}
          </svg>
        );
      }}
    />
  );
}
