import SceneShell from "./SceneShell";

/**
 * 본문 대응: #system-cost "Shared 10B, expert당 2B, n=16 ... k=2" 예.
 * P_total ≈ P_shared + n·P_e, P_active ≈ P_shared + k·P_e.
 * Dense(n=k=1): 10+2=12B. n=16: 10+32=42B. k=2: 10+4=14B.
 * Expert 부분: 저장 32B, token 경로 4B(= dense 2B의 2배), 32:4 = n:k = 16:2.
 */
const SHARED = 10;
const PE = 2;
const N = 16;
const K = 2;

const X0 = 12;
const UNIT = 8;
const BAR_H = 22;

const SCENES = [
  { label: "Dense 기준 (n=k=1)", summary: `${SHARED} + ${PE} = ${SHARED + PE}B`, n: 1, k: 1, note: `Expert가 하나뿐이고 모든 token이 그 하나를 지나는 경우가 dense model입니다. 저장량과 token 경로가 똑같이 ${SHARED}B + ${PE}B = ${SHARED + PE}B입니다.` },
  { label: "expert 16개를 저장", summary: `${SHARED} + ${N}×${PE} = ${SHARED + N * PE}B`, n: N, k: 0, note: `Checkpoint는 routed expert ${N}개를 모두 저장해야 하므로 expert 부분이 ${N}×${PE}B = ${N * PE}B가 됩니다. 모든 expert weight를 동시에 올린다면 weight memory는 이 줄에 가깝습니다. Token이 몇 개를 지나는지는 다음 장면에서 봅니다.` },
  { label: "token은 2개만 지난다", summary: `${SHARED} + ${K}×${PE} = ${SHARED + K * PE}B`, n: N, k: K, note: `Token 하나는 고른 ${K}개 expert만 지나므로 경로의 expert 부분은 ${K * PE}B입니다. Dense의 expert 부분 ${PE}B의 ${(K * PE) / PE}배이고, 본문이 말한 token별 expert FLOP 2배가 이 차이입니다. 다만 active parameter가 곧 실제 FLOPs는 아닙니다.` },
  { label: "두 줄이 갈라진다", summary: `${N * PE}B : ${K * PE}B = ${N} : ${K}`, n: N, k: K, note: `저장하는 expert ${N * PE}B와 token이 지나는 expert ${K * PE}B의 비는 n:k = ${N}:${K}입니다. n을 늘리고 k를 유지하면 위 줄만 길어지고 아래 줄은 거의 그대로입니다. 대신 weight memory와 routing·communication complexity는 커집니다.` },
] as const;

function Row({ y, label, value, experts, picked, dimUnpicked, pending = false }: { y: number; label: string; value: number; experts: number; picked: number; dimUnpicked: boolean; pending?: boolean }) {
  return (
    <g opacity={pending ? 0.35 : 1}>
      <text x={X0} y={y - 8} fontSize={13} fill="#64748b">{label}</text>
      <text x={348} y={y - 8} fontSize={14} fontWeight={700} textAnchor="end" fill="#2563eb">{pending ? "?" : `${value}B`}</text>
      <rect x={X0} y={y} width={SHARED * UNIT} height={BAR_H} rx={2} fill="#e2e8f0" stroke="#64748b" strokeWidth={1} />
      <text x={X0 + (SHARED * UNIT) / 2} y={y + 15} fontSize={12} textAnchor="middle" fill="#334155">shared {SHARED}B</text>
      {Array.from({ length: experts }, (_, index) => {
        const on = index < picked;
        return (
          <rect
            key={index}
            x={X0 + SHARED * UNIT + index * PE * UNIT + 1}
            y={y}
            width={PE * UNIT - 2}
            height={BAR_H}
            rx={1.5}
            fill={on ? "#93c5fd" : dimUnpicked ? "none" : "#bfdbfe"}
            stroke={on ? "#2563eb" : "#94a3b8"}
            strokeWidth={1}
            strokeDasharray={!on && dimUnpicked ? "2 1.5" : undefined}
          />
        );
      })}
    </g>
  );
}

export default function ParamLedgerViz() {
  return (
    <SceneShell
      eyebrow="Parameter 장부"
      title="Expert를 16개로 늘려도 token 하나가 지나는 길에는 2개만 더해진다"
      description="가로 길이가 parameter 수입니다. 회색 칸은 모든 token이 쓰는 shared parameter, 작은 칸 하나는 2B짜리 expert 하나입니다. 숫자는 본문 예(shared 10B·expert당 2B·n=16·k=2)이고 모든 expert 크기가 같다는 근사를 따릅니다."
      ariaLabel="shared 10B와 expert 2B로 dense 12B, 저장 42B, token 경로 14B를 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const total = SHARED + scene.n * PE;
        const path = SHARED + scene.k * PE;
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 360 132" className="mx-auto block h-auto w-full max-w-xl" role="img" aria-label={scene.k === 0 ? `저장 ${total}B` : `저장 ${total}B, token 경로 ${path}B`}>
              <Row y={26} label="저장 (total)" value={total} experts={scene.n} picked={scene.n} dimUnpicked={false} />
              <Row y={92} label="token 하나의 경로 (active)" value={path} experts={scene.n} picked={scene.k} dimUnpicked pending={scene.k === 0} />
            </svg>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              아래 줄의 점선 칸은 저장돼 있지만 이 token이 지나지 않는 expert입니다.
            </p>
          </div>
        );
      }}
    />
  );
}
