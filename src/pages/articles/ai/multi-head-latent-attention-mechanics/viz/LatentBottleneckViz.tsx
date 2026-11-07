import SceneShell from "./SceneShell";

/**
 * 본문 대응: #kv-projection — 5120 → 512 → 16384(K), 16384(V). 16384/512=32.
 * 막대 폭은 차원 수에 비례한다(16384 = 320 단위).
 */
const SCENES = [
  { label: "내리기", summary: "h_t 5120 → W^DKV → 512", note: "W^DKV는 차원을 줄이는 행렬입니다. 이 행렬 하나로 hidden state를 512차원 latent로 내립니다. K용과 V용을 따로 내리지 않습니다." },
  { label: "캐시에 남는 것", summary: "c_t^KV 512차원 하나", note: "이 경로에서 캐시에 남는 것은 이 latent 하나뿐입니다. head별 key와 value는 이 시점에 만들어 두지 않으므로 흐리게 그렸습니다. 위치 전용 64개는 다음 절에서 더합니다." },
  { label: "넓히기", summary: "W^UK, W^UV → 16384씩", note: "up-projection W^UK와 W^UV는 같은 latent를 head별 key와 value로 되돌립니다. prefill처럼 모든 token을 병렬로 처리할 때 이 복원을 실제로 수행합니다." },
  { label: "통로의 폭", summary: "16384 ÷ 512 = 32배 좁음", note: "128 head × 128차원을 이어 붙인 16384차원이 512차원을 거쳐야 합니다. 32는 latent 폭의 비율입니다. 실제 캐시 비율은 K·V 공유와 위치 항까지 더한 뒤 정해집니다." },
] as const;

const CX = 180;
const widthOf = (dim: number) => (dim / 16384) * 320;

function Bar({ y, dim, color, opacity = 1 }: { y: number; dim: number; color: string; opacity?: number }) {
  const width = widthOf(dim);
  return <rect x={CX - width / 2} y={y} width={width} height={16} rx={2} fill={color} opacity={opacity} />;
}

function Funnel({ y1, dim1, y2, dim2, opacity }: { y1: number; dim1: number; y2: number; dim2: number; opacity: number }) {
  const a = widthOf(dim1) / 2;
  const b = widthOf(dim2) / 2;
  return <polygon points={`${CX - a},${y1} ${CX + a},${y1} ${CX + b},${y2} ${CX - b},${y2}`} fill="#94a3b8" opacity={opacity} />;
}

export default function LatentBottleneckViz() {
  return (
    <SceneShell
      eyebrow="좁은 통로"
      title="이 압축 경로의 캐시에는 가장 좁은 칸 하나만 남습니다"
      description="막대 폭이 차원 수에 비례합니다. h_t는 token의 hidden state, latent는 압축한 짧은 벡터입니다. 숫자는 DeepSeek-V2(236B) 설정입니다."
      ariaLabel="hidden state가 latent로 좁아졌다가 head별 key와 value로 넓어지는 모양"
      scenes={SCENES}
      render={(active) => {
        const down = active === 0 ? 0.4 : 0.2;
        const up = active >= 2 ? 0.4 : 0.1;
        const kv = active >= 2 ? 1 : 0.2;
        return (
          <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={CX} y={14} textAnchor="middle" fontSize={12} fill="#64748b">h_t · 5120차원</text>
            <Bar y={20} dim={5120} color="#64748b" />
            <Funnel y1={36} dim1={5120} y2={84} dim2={512} opacity={down} />
            <text x={CX + 60} y={64} fontSize={12} fill="#64748b">W^DKV</text>
            <Bar y={84} dim={512} color="#2563eb" />
            <text x={CX + 12} y={97} fontSize={12} fontWeight={700} fill="#2563eb">latent · 512차원{active === 1 ? " · 캐시" : ""}</text>
            <Funnel y1={100} dim1={512} y2={146} dim2={16384} opacity={up} />
            <text x={CX + 86} y={134} fontSize={12} fill="#64748b" opacity={active >= 2 ? 1 : 0.4}>W^UK · W^UV</text>
            <Bar y={146} dim={16384} color="#d97706" opacity={kv} />
            <Bar y={166} dim={16384} color="#16a34a" opacity={kv} />
            <text x={CX} y={158} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff" opacity={active >= 2 ? 1 : 0}>head별 key · 16384</text>
            <text x={CX} y={178} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff" opacity={active >= 2 ? 1 : 0}>head별 value · 16384</text>
            <text x={CX} y={204} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb" opacity={active === 3 ? 1 : 0}>맨 아래 막대 폭 ÷ latent 폭 = 32</text>
          </svg>
        );
      }}
    />
  );
}
