import SceneShell from "./SceneShell";

/**
 * 본문 대응: #sft-process "YAML 숫자를 복사하기 전에 token budget을 다시 계산한다".
 * global batch = GPU 수 × per-device batch × gradient accumulation (update 한 번에 들어가는 sample 수).
 * 가정: 8 GPU × 4 × 2 = 64 → 4 GPU × 4 × 4 = 64.
 * 가정: sample 64개의 평균 길이 2,000 token이면 128,000, 8,000 token이면 512,000 (4배).
 */
const PER_DEVICE = 4;
const SETUPS = [
  { gpus: 8, accum: 2 },
  { gpus: 4, accum: 4 },
] as const;
const GLOBAL = SETUPS[0].gpus * PER_DEVICE * SETUPS[0].accum;
const LENGTHS = [2000, 8000] as const;
const TOKENS = LENGTHS.map((len) => len * GLOBAL);

const SCENES = [
  {
    label: "GPU 8장",
    summary: `8 × ${PER_DEVICE} × 2 = ${GLOBAL}`,
    note: `GPU마다 한 번에 ${PER_DEVICE}개(per-device batch)를 처리하고, gradient를 2번 모은 뒤(gradient accumulation) update합니다. Update 한 번에 들어가는 sample(global batch)은 ${GLOBAL}개입니다. 숫자는 가정입니다.`,
  },
  {
    label: "GPU 4장으로 바꾸면",
    summary: `4 × ${PER_DEVICE} × 4 = ${GLOBAL}`,
    note: `GPU가 절반이면 accumulation을 2에서 4로 늘려 global batch ${GLOBAL}을 유지합니다. YAML 숫자를 그대로 복사하면 global batch가 32로 바뀝니다.`,
  },
  {
    label: "Sample 수가 같아도",
    summary: `${TOKENS[0].toLocaleString("en-US")} vs ${TOKENS[1].toLocaleString("en-US")} token`,
    note: `Global batch가 ${GLOBAL}으로 같아도 trace가 평균 2,000 token이면 update당 ${TOKENS[0].toLocaleString("en-US")} token, 8,000 token이면 ${TOKENS[1].toLocaleString("en-US")} token입니다(가정). 그래서 truncation·packing 뒤 실제 supervised token 수를 따로 기록합니다.`,
  },
] as const;

const W = 360;
const H = 190;

function Setup({ gpus, accum }: { gpus: number; accum: number }) {
  const boxW = 34;
  const gap = 4;
  const rowW = gpus * boxW + (gpus - 1) * gap;
  const x0 = (W - rowW) / 2 + 20;
  return (
    <g>
      {Array.from({ length: accum }, (_, step) => (
        <g key={step}>
          <text x={x0 - 8} y={30 + step * 36 + 18} textAnchor="end" fontSize={12} fill="#64748b">모음 {step + 1}</text>
          {Array.from({ length: gpus }, (__, g) => (
            <g key={g}>
              <rect x={x0 + g * (boxW + gap)} y={30 + step * 36} width={boxW} height={28} rx={2} fill="#ffffff" fillOpacity={0} stroke="#94a3b8" strokeWidth={1} />
              {Array.from({ length: PER_DEVICE }, (___, s) => (
                <rect key={s} x={x0 + g * (boxW + gap) + 4 + s * 7.5} y={30 + step * 36 + 8} width={6} height={12} fill="#2563eb" />
              ))}
            </g>
          ))}
        </g>
      ))}
      <text x={x0} y={18} fontSize={12} fill="#64748b">칸 = GPU 1장 · 막대 = sample 1개</text>
    </g>
  );
}

export default function GlobalBatchViz() {
  return (
    <SceneShell
      eyebrow="Global batch와 token budget"
      title="GPU 수를 바꾸면 accumulation으로 global batch를 맞춥니다"
      description="Global batch = GPU 수 × per-device batch × gradient accumulation입니다. 막대 하나가 sample 하나이고, 모든 숫자는 계산을 보이기 위한 가정입니다."
      ariaLabel="GPU 수가 바뀔 때 gradient accumulation으로 global batch를 유지하고, 같은 sample 수에서 token budget이 달라지는 예"
      scenes={SCENES}
      render={(active) => (
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="mx-auto h-auto w-full max-w-[560px]"
          role="img"
          aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}
        >
          {active < 2 && <Setup gpus={SETUPS[active].gpus} accum={SETUPS[active].accum} />}
          {active < 2 && (
            <text x={W / 2} y={182} textAnchor="middle" fontSize={13} fontWeight={700} fill="#334155">
              막대 {GLOBAL}개 = update 한 번
            </text>
          )}
          {active === 2 && (
            <g>
              {TOKENS.map((tokens, i) => (
                <g key={tokens}>
                  <text x={20} y={44 + i * 70} fontSize={13} fontWeight={700} fill="#334155">
                    sample {GLOBAL}개 · 평균 {LENGTHS[i].toLocaleString("en-US")} token
                  </text>
                  <rect x={20} y={52 + i * 70} width={(320 * tokens) / TOKENS[1]} height={20} fill={i === 0 ? "#2563eb" : "#d97706"} />
                  <text x={20} y={88 + i * 70} fontSize={12} fill="#64748b">update당 {tokens.toLocaleString("en-US")} token</text>
                </g>
              ))}
            </g>
          )}
        </svg>
      )}
    />
  );
}
