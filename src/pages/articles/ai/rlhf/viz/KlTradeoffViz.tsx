import SceneShell from "./SceneShell";

/**
 * 본문 대응: #ppo 첫 ExplainedFormula, R_KL = r − β·ℓ_KL.
 * 가정: 응답 A는 r = 2.0, ℓ_KL = 0.5 / 응답 B는 r = 3.0, ℓ_KL = 3.0.
 * β = 0 → A 2.0, B 3.0 / β = 0.4 → 둘 다 1.8 / β = 1 → A 1.5, B 0.0.
 */
const RESPONSES = [
  { name: "응답 A", reward: 2.0, kl: 0.5, hint: "reference 근처" },
  { name: "응답 B", reward: 3.0, kl: 3.0, hint: "reference에서 멀리" },
] as const;

const SCENES = [
  { beta: 0, label: "β = 0", note: "KL 비용을 0으로 두면 reward만 비교합니다. reward가 더 높은 B가 이깁니다." },
  { beta: 0.4, label: "β = 0.4", note: "β가 0.4이면 A는 2.0 − 0.4×0.5 = 1.8, B는 3.0 − 0.4×3.0 = 1.8로 같아집니다. B가 reward로 얻은 1.0을 drift 비용 차이가 정확히 상쇄하는 지점입니다." },
  { beta: 1, label: "β = 1", note: "β가 1이면 A는 1.5, B는 0.0입니다. reward 이득이 drift 비용을 넘지 못해 reference 근처의 A가 이깁니다. KL이 B를 ‘잘못된 응답’이라고 판별한 것은 아니며, 이동 비용을 비싸게 매겼을 뿐입니다." },
].map((scene) => {
  const [a, b] = RESPONSES.map((r) => r.reward - scene.beta * r.kl);
  const verdict = Math.abs(a - b) < 1e-9 ? "동점" : a > b ? "A 선택" : "B 선택";
  return { ...scene, summary: `A ${a.toFixed(1)} · B ${b.toFixed(1)} → ${verdict}` };
});

const MAX = 3.5;

export default function KlTradeoffViz() {
  return (
    <SceneShell
      eyebrow="KL penalty"
      title="β가 커질수록 reference에서 멀어진 응답의 reward가 깎인다"
      description="막대 전체 길이(오른쪽 끝 눈금 r)가 reward model 점수 r이고, 주황 점선 칸은 그중 β×ℓ_KL만큼 깎이는 drift 비용, 남은 파란 부분이 R_KL입니다. ℓ_KL은 응답이 reference policy에서 얼마나 멀어졌는지를 잰 값입니다. 두 응답의 r과 ℓ_KL은 가정입니다."
      ariaLabel="β 값에 따라 두 응답의 KL 보정 reward 순서가 바뀌는 과정"
      scenes={SCENES}
      render={(active) => {
        const beta = SCENES[active].beta;
        return (
          <div className="space-y-4">
            {RESPONSES.map((response) => {
              const cost = beta * response.kl;
              const net = response.reward - cost;
              const pct = (v: number) => `${(Math.max(v, 0) / MAX) * 100}%`;
              return (
                <div key={response.name} className="min-w-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-xs">
                    <span className="font-bold">
                      {response.name} <span className="font-normal text-muted-foreground">· {response.hint} · r {response.reward.toFixed(1)} · ℓ_KL {response.kl.toFixed(1)}</span>
                    </span>
                    <span className="font-mono font-bold text-primary">
                      R_KL = {response.reward.toFixed(1)} − {beta}×{response.kl.toFixed(1)} = {net.toFixed(1)}
                    </span>
                  </div>
                  <svg viewBox="0 0 320 26" preserveAspectRatio="none" className="mt-1.5 block h-6 w-full" aria-hidden>
                    <rect x={0} y={3} width={320} height={20} rx={3} fill="#94a3b8" fillOpacity={0.15} />
                    <rect x={0} y={3} width={(Math.max(net, 0) / MAX) * 320} height={20} rx={3} fill="#2563eb" />
                    {cost > 0 && (
                      <rect x={(Math.max(net, 0) / MAX) * 320} y={3.5} width={(cost / MAX) * 320} height={19} fill="none" stroke="#d97706" strokeWidth={1} strokeDasharray="3 2" />
                    )}
                  </svg>
                  <div className="relative mt-1 h-4 text-[10px] text-muted-foreground">
                    <span className="absolute" style={{ left: pct(response.reward), transform: "translateX(-100%)" }}>r {response.reward.toFixed(1)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        );
      }}
    />
  );
}
