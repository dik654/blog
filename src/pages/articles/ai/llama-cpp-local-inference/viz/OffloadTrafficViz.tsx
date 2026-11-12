import SceneShell from "./SceneShell";

/**
 * 본문 대응: #layer-offload — -ngl 25에서 층 0~7과 embedding은 CPU, 층 8~31과 출력층은 GPU.
 * decode(slot 4개 → 4행): CPU 층은 CPU가 계산하고 경계에서는 token마다 4,096개짜리 활성값만 넘어간다.
 * prefill(prompt 2,000 token, 연산당 행 ≥ 32 — 정확한 행 수는 batch 분할에 달려 단정하지 않음): 행이 32개 이상인 연산은 CPU 버퍼의 가중치라도 GPU로 옮겨 계산한다.
 * 층당 Q4_K 가중치 122,688,000 byte ≈ 122.7MB (13절 장부).
 */
const THRESHOLD = 32;

const SCENES = [
  { label: "decode · slot 4개", summary: `4행 < ${THRESHOLD} → CPU 층은 CPU가 계산`, rows: 4, note: "slot 네 개가 한 token씩 decode하면 한 번에 처리하는 행은 4개입니다. 층 0~7은 RAM에 있는 가중치로 CPU가 계산하고, 층 7과 층 8 사이에서는 token마다 4,096개짜리 활성값만 GPU로 넘어갑니다. 가중치는 옮기지 않습니다." },
  { label: "prefill · prompt 2,000 token", summary: `행 ≥ ${THRESHOLD} → 가중치를 GPU로 옮겨 계산`, rows: 2000, note: "prompt 2,000 token을 처리하는 prefill은 한 연산이 처리하는 행이 기준 32보다 많습니다. CUDA backend는 CPU 버퍼에 있는 층 0~7의 가중치라도 GPU로 옮겨 그 연산을 GPU에서 계산합니다. 기준 32는 환경 변수로 바꿀 수 있습니다." },
] as const;

const W = 360;
const H = 206;
const CPU_X = 8;
const GPU_X = 214;
const BOX_W = 138;
const BOX_Y = 30;
const BOX_H = 120;

function Block({ x, y, label, sub, active }: { x: number; y: number; label: string; sub: string; active: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={BOX_W - 16} height={40} rx={6} fill={active ? "#dbeafe" : "#f8fafc"} stroke={active ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
      <text x={x + 7} y={y + 17} fontSize={13} fontWeight={700} fill="#0f172a">{label}</text>
      <text x={x + 7} y={y + 33} fontSize={12} fill="#475569">{sub}</text>
    </g>
  );
}

export default function OffloadTrafficViz() {
  return (
    <SceneShell
      eyebrow="CPU 층의 계산 위치"
      title="decode는 활성값만 넘기고, 큰 batch는 가중치를 GPU로 옮깁니다"
      description="-ngl 25의 배치(층 0~7은 CPU, 층 8~31과 출력층은 GPU)에서 한 번에 처리하는 행 수에 따라 무엇이 PCIe를 건너는지 봅니다. 파란 칸이 그 장면에서 층 계산을 맡는 쪽입니다."
      ariaLabel="decode와 prefill에서 CPU 층의 계산 위치와 PCIe를 건너는 데이터 비교"
      scenes={SCENES}
      render={(active) => {
        const prefill = SCENES[active].rows >= THRESHOLD;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={CPU_X} y={BOX_Y - 10} fontSize={13} fontWeight={700} fill="#334155">CPU · RAM</text>
            <text x={GPU_X} y={BOX_Y - 10} fontSize={13} fontWeight={700} fill="#334155">GPU · VRAM</text>
            <rect x={CPU_X} y={BOX_Y} width={BOX_W} height={BOX_H} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} />
            <rect x={GPU_X} y={BOX_Y} width={BOX_W} height={BOX_H} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} />
            <Block x={CPU_X + 8} y={BOX_Y + 10} label="embedding" sub="늘 CPU에 남음" active={false} />
            <Block x={CPU_X + 8} y={BOX_Y + 70} label="층 0~7 가중치" sub={prefill ? "RAM에 있음" : "CPU가 계산"} active={!prefill} />
            <Block x={GPU_X + 8} y={BOX_Y + 10} label="층 8~31 · 출력층" sub="GPU가 계산" active />
            {prefill && <Block x={GPU_X + 8} y={BOX_Y + 70} label="층 0~7 연산" sub="옮긴 가중치로 계산" active />}
            {prefill ? (
              <g>
                <line x1={CPU_X + BOX_W - 8} y1={BOX_Y + 90} x2={GPU_X + 2} y2={BOX_Y + 90} stroke="#b45309" strokeWidth={1.25} />
                <path d={`M ${GPU_X + 2} ${BOX_Y + 90} l -7 -4 v 8 z`} fill="#b45309" />
                <text x={(CPU_X + BOX_W + GPU_X) / 2} y={BOX_Y + 83} textAnchor="middle" fontSize={12} fontWeight={700} fill="#b45309">가중치</text>
              </g>
            ) : (
              <g>
                <line x1={CPU_X + BOX_W - 8} y1={BOX_Y + 90} x2={GPU_X + 2} y2={BOX_Y + 30} stroke="#2563eb" strokeWidth={1.25} />
                <path d={`M ${GPU_X + 2} ${BOX_Y + 30} l -8.8 1.7 l 4.9 6.3 z`} fill="#2563eb" />
                <text x={192} y={BOX_Y + 80} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">활성값</text>
              </g>
            )}
            <text x={W / 2} y={BOX_Y + BOX_H + 22} textAnchor="middle" fontSize={13} fontWeight={700} fill={prefill ? "#b45309" : "#2563eb"}>
              {prefill ? "PCIe: 층 0~7 가중치 (층마다 약 122.7MB)" : "PCIe: token마다 활성값 4,096개"}
            </text>
            <text x={W / 2} y={BOX_Y + BOX_H + 40} textAnchor="middle" fontSize={12} fill="#64748b">
              {prefill ? `prompt 2,000 token · 행 ≥ 기준 ${THRESHOLD}행` : `한 번에 ${SCENES[active].rows}행 < 기준 ${THRESHOLD}행`}
            </text>
          </svg>
        );
      }}
    />
  );
}
