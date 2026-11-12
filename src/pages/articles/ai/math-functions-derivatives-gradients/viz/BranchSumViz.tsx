import SceneShell from "./SceneShell";

/**
 * 본문 대응: #chain-rule 끝 — 같은 입력이 u=3x+1과 v=x²로 갈라졌다가 y=u+v로 합쳐진다.
 * x=2에서 u=7, v=4, y=11. 경로 배율 3과 4(=2×2).
 * Δx=0.01(가정): Δu=0.03(정확), Δv≈0.04(실제 0.0401), Δy≈0.07(실제 0.0701).
 */
const SCENES = [
  { label: "같은 Δx가 두 갈래로", summary: "Δx = 0.01 (가정)", step: 0, note: "x=2에서 u=3x+1=7, v=x²=4, y=u+v=11입니다. 입력을 0.01 늘리면(가정) 그 같은 0.01이 u 쪽과 v 쪽에 동시에 들어갑니다." },
  { label: "갈래 안에서는 곱한다", summary: "0.01×3 = 0.03 · 0.01×4 = 0.04", step: 1, note: "u 갈래의 배율은 3이라 Δu는 정확히 0.03입니다. v=x²의 x=2 배율은 2×2=4라 Δv는 약 0.04이고, 실제 변화는 2.01²−4=0.0401입니다." },
  { label: "합류점에서는 더한다", summary: "Δy ≈ 0.03 + 0.04 = 0.07 = 7Δx", step: 2, note: "y=u+v는 두 변화를 그대로 더합니다. 그래서 Δy≈3Δx+4Δx=7Δx=0.07이고, 실제 변화는 0.03+0.0401=0.0701입니다. 한 경로 안에서는 배율을 곱하고, 경로가 합쳐질 때는 기여를 더합니다." },
] as const;

const ACCENT = "#2563eb";
const DIM = "#94a3b8";

function Node({ x, y, name, value, on }: { x: number; y: number; name: string; value: string; on: boolean }) {
  return (
    <g>
      <rect x={x - 38} y={y - 20} width="76" height="40" rx="8" fill="none" stroke={on ? ACCENT : DIM} strokeWidth="1.25" />
      <text x={x} y={y - 3} textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor">{name}</text>
      <text x={x} y={y + 13} textAnchor="middle" fontSize="10" fill="currentColor">{value}</text>
    </g>
  );
}

function Edge({ d, on }: { d: string; on: boolean }) {
  return <path d={d} fill="none" stroke={on ? ACCENT : DIM} strokeWidth={on ? 1.25 : 1} markerEnd={on ? "url(#branch-sum-arrow-on)" : "url(#branch-sum-arrow)"} />;
}

export default function BranchSumViz() {
  return (
    <SceneShell
      eyebrow="갈라졌다 합쳐지는 변화"
      title="한 경로 안에서는 곱하고, 경로가 합쳐지면 더합니다"
      description="같은 입력 x를 u=3x+1과 v=x²에 보낸 뒤 y=u+v로 합칩니다. 기준점은 본문의 x=2이고, 작은 변화 0.01은 숫자를 보이려고 고른 값입니다(가정)."
      note="화살표 위 숫자는 x=2에서의 배율(미분계수)입니다. u=3x+1은 직선이라 Δu=3Δx가 정확하지만, v=x²은 휘어 있어 배율 4로 만든 Δv 예측이 실제 0.0401보다 0.0001 작습니다. 그래서 Δv와 Δy에 ≈를 붙였습니다."
      ariaLabel="같은 입력 변화가 두 경로로 갈라져 각각 배율이 곱해진 뒤 합류점에서 더해지는 과정"
      scenes={SCENES}
      render={(active) => {
        const step = SCENES[active].step;
        return (
          <svg viewBox="0 0 330 200" className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label="x에서 u와 v로 갈라져 y로 합쳐지는 계산 그래프">
            <defs>
              <marker id="branch-sum-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L8 4L0 8Z" fill={DIM} /></marker>
              <marker id="branch-sum-arrow-on" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L8 4L0 8Z" fill={ACCENT} /></marker>
            </defs>
            <Edge d="M80 92L124 54" on />
            <Edge d="M80 108L124 146" on />
            <Edge d="M203 54L247 92" on={step >= 2} />
            <Edge d="M203 146L247 108" on={step >= 2} />
            <text x="96" y="62" textAnchor="middle" fontSize="11" fontWeight="700" fill={step >= 1 ? ACCENT : DIM}>×3</text>
            <text x="96" y="146" textAnchor="middle" fontSize="11" fontWeight="700" fill={step >= 1 ? ACCENT : DIM}>×4</text>
            <text x="234" y="62" textAnchor="middle" fontSize="11" fontWeight="700" fill={step >= 2 ? ACCENT : DIM}>+</text>
            <text x="234" y="146" textAnchor="middle" fontSize="11" fontWeight="700" fill={step >= 2 ? ACCENT : DIM}>+</text>
            <Node x={42} y={100} name="x = 2" value="Δx = 0.01" on />
            <Node x={164} y={40} name="u = 7" value={step >= 1 ? "Δu = 0.03" : "Δu = ?"} on={step >= 1} />
            <Node x={164} y={160} name="v = 4" value={step >= 1 ? "Δv ≈ 0.04" : "Δv = ?"} on={step >= 1} />
            <Node x={286} y={100} name="y = 11" value={step >= 2 ? "Δy ≈ 0.07" : "Δy = ?"} on={step >= 2} />
          </svg>
        );
      }}
    />
  );
}
