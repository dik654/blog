import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #weight-absorption — q·(W^UK c_j) = ((W^UK)^T q)·c_j, (W^O W^UV) Σ p_j c_j.
 * 그림은 head 하나, 과거 token 세 개. 숫자 예시(2×3 행렬)는 가정이다:
 * W=[[1,0,2],[0,1,1]], q=(1,2), c=(1,1,1) → Wc=(3,2), q·Wc=7; Wᵀq=(1,2,4), (1,2,4)·c=7.
 */
const SCENES = [
  { label: "펼쳐서 내적", summary: "W^UK 곱셈이 과거 token마다", note: "과거 token마다 c_j^KV를 W^UK로 펼쳐 k_j^C를 만든 뒤 query와 내적합니다. 과거 token 수만큼 W^UK를 곱합니다. prefill의 naive 경로가 이 모양입니다." },
  { label: "값이 같은 이유", summary: "7 = 7", note: "128×512 대신 2×3으로 줄인 예입니다(가정). 행렬을 곱하는 순서만 묶음을 바꾼 것이므로 내적 값은 어떤 입력에서도 같습니다. W 사이에 비선형이 없어야 합니다." },
  { label: "접어서 내적", summary: "새 token마다 head당 한 번", note: "query를 (W^UK)ᵀ로 접어 512차원 q'를 새 token마다 head당 한 번 만듭니다. q'는 캐시된 c_j^KV와 곧바로 내적하므로 과거 token이 늘어도 이 곱셈은 늘지 않습니다." },
  { label: "출력 쪽도 같은 방법", summary: "W^O W^UV 한 덩어리", note: "가중합을 W^UV로 펼친 뒤 W^O를 곱하는 대신, 미리 곱해 둔 W^O W^UV 하나로 latent 가중합을 model 차원으로 바로 보냅니다. v_j^C는 끝까지 만들어지지 않습니다." },
] as const;

const ROWS = [
  { j: 1, y: 22 },
  { j: 2, y: 66 },
  { j: 3, y: 110 },
] as const;

function Box({ x, y, w, h = 30, text, color, fill = false, dashed = false, size = 12 }: { x: number; y: number; w: number; h?: number; text: string; color: string; fill?: boolean; dashed?: boolean; size?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={4} fill={fill ? color : "none"} fillOpacity={0.14} stroke={color} strokeWidth={1} strokeDasharray={dashed ? "4 3" : undefined} />
      <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize={size} fontWeight={700} fill={color}>{text}</text>
    </g>
  );
}

function Heads() {
  return (
    <>
      <text x={42} y={14} textAnchor="middle" fontSize={11} fill="#64748b">캐시</text>
    </>
  );
}

function Naive() {
  return (
    <svg viewBox="0 0 360 150" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label="과거 token마다 W^UK를 곱해 펼친 뒤 내적">
      <Heads />
      {ROWS.map((row) => (
        <g key={row.j}>
          <Box x={10} y={row.y} w={64} text={`c_${row.j}^KV`} color="#2563eb" fill />
          <line x1={74} x2={92} y1={row.y + 15} y2={row.y + 15} stroke="#94a3b8" strokeWidth={1} />
          <Box x={92} y={row.y} w={58} text="W^UK" color="#dc2626" />
          <line x1={150} x2={168} y1={row.y + 15} y2={row.y + 15} stroke="#94a3b8" strokeWidth={1} />
          <Box x={168} y={row.y} w={64} text={`k_${row.j}^C 128`} color="#d97706" size={11} />
          <text x={244} y={row.y + 19} textAnchor="middle" fontSize={13} fill="#64748b">·</text>
          <Box x={256} y={row.y} w={64} text="q_t^C 128" color="#475569" size={11} />
        </g>
      ))}
    </svg>
  );
}

function Folded() {
  return (
    <svg viewBox="0 0 360 150" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label="query를 한 번 접어 캐시된 latent와 바로 내적">
      <Heads />
      <Box x={268} y={22} w={84} text="q_t^C 128" color="#475569" size={11} />
      <Box x={268} y={66} w={84} text="(W^UK)ᵀ" color="#16a34a" />
      <Box x={268} y={110} w={84} text="q' 512" color="#16a34a" fill />
      <line x1={310} x2={310} y1={52} y2={66} stroke="#94a3b8" strokeWidth={1} />
      <line x1={310} x2={310} y1={96} y2={110} stroke="#94a3b8" strokeWidth={1} />
      {ROWS.map((row) => (
        <g key={row.j}>
          <Box x={10} y={row.y} w={64} text={`c_${row.j}^KV`} color="#2563eb" fill />
          <text x={92} y={row.y + 20} textAnchor="middle" fontSize={13} fill="#64748b">·</text>
          <Box x={106} y={row.y} w={44} text="q' 512" color="#16a34a" size={11} />
        </g>
      ))}
      <path d={`M 268 125 H 240 V 37 H 150`} fill="none" stroke="#94a3b8" strokeWidth={1} />
      <path d={`M 240 81 H 150`} fill="none" stroke="#94a3b8" strokeWidth={1} />
      <path d={`M 240 125 H 150`} fill="none" stroke="#94a3b8" strokeWidth={1} />
    </svg>
  );
}

function ToyCheck() {
  return (
    <div className="grid min-w-0 gap-2 text-sm sm:grid-cols-2 sm:gap-3">
      <div className="min-w-0 border-t border-border pt-2 sm:pt-3">
        <p className="font-bold">먼저 펼치기</p>
        <p className="mt-1 break-words font-mono text-xs leading-5 sm:mt-2 sm:leading-6">W c = (1+0+2, 0+1+1) = (3, 2)</p>
        <p className="break-words font-mono text-xs leading-5 sm:leading-6">q · (3, 2) = 3 + 4 = 7</p>
      </div>
      <div className="min-w-0 border-t border-primary pt-2 sm:pt-3">
        <p className="font-bold text-primary">먼저 접기</p>
        <p className="mt-1 break-words font-mono text-xs leading-5 sm:mt-2 sm:leading-6">Wᵀq = (1, 2, 2+2) = (1, 2, 4)</p>
        <p className="break-words font-mono text-xs leading-5 sm:leading-6">(1, 2, 4) · c = 1 + 2 + 4 = 7</p>
      </div>
      <p className="min-w-0 font-mono text-xs leading-5 text-muted-foreground sm:col-span-2 sm:leading-6">W=[1 0 2 / 0 1 1], q=(1,2), c=(1,1,1) (가정)</p>
    </div>
  );
}

function Output() {
  return (
    <svg viewBox="0 0 360 150" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label="출력 쪽에서 W^UV와 W^O를 미리 곱해 한 번에 보내는 경로">
      <text x={10} y={16} fontSize={11} fill="#64748b">펼치는 경로 (decode에서는 쓰지 않음)</text>
      <Box x={10} y={24} w={70} text="Σ p_j c_j" color="#2563eb" fill size={11} />
      <line x1={80} x2={98} y1={39} y2={39} stroke="#94a3b8" strokeWidth={1} />
      <Box x={98} y={24} w={52} text="W^UV" color="#94a3b8" dashed />
      <line x1={150} x2={168} y1={39} y2={39} stroke="#94a3b8" strokeWidth={1} />
      <Box x={168} y={24} w={60} text="v 만들기" color="#94a3b8" dashed size={11} />
      <line x1={228} x2={246} y1={39} y2={39} stroke="#94a3b8" strokeWidth={1} />
      <Box x={246} y={24} w={44} text="W^O" color="#94a3b8" dashed />
      <text x={10} y={88} fontSize={11} fill="#16a34a">흡수한 경로</text>
      <Box x={10} y={96} w={70} text="Σ p_j c_j" color="#2563eb" fill size={11} />
      <line x1={80} x2={98} y1={111} y2={111} stroke="#94a3b8" strokeWidth={1} />
      <Box x={98} y={96} w={100} text="W^O W^UV" color="#16a34a" fill />
      <line x1={198} x2={216} y1={111} y2={111} stroke="#94a3b8" strokeWidth={1} />
      <Box x={216} y={96} w={136} text="model 차원 5120" color="#475569" />
    </svg>
  );
}

export default function AbsorptionRegroupViz() {
  return (
    <SceneShell
      eyebrow="곱하는 순서 바꾸기"
      title="같은 값을 W^UK 곱셈 한 번으로 얻습니다"
      description="그림은 head 하나와 과거 token 세 개로 줄였습니다. 빨간 칸은 과거 token 수만큼 반복되는 곱셈, 초록 칸은 과거 token 수와 상관없는 곱셈입니다. 칸의 차원은 DeepSeek-V2(236B) 값입니다."
      ariaLabel="펼쳐서 내적하는 계산과 접어서 내적하는 계산 비교"
      scenes={SCENES}
      render={(active) => <StableSceneStack active={active} scenes={[<Naive key="naive" />, <ToyCheck key="toy" />, <Folded key="folded" />, <Output key="output" />]} />}
    />
  );
}
