import SceneShell from "./SceneShell";

/**
 * 본문 대응: #applications Identity guidance 식.
 * û = û_pos + w_id (û_ref − û_noref). 고차원 velocity를 평면 화살표로 줄인 가정 그림.
 * 화살표 좌표와 w_id = 1, 2는 모양을 보이려는 가정이며 논문 값이 아닙니다.
 */
type Vec = readonly [number, number];

const ORIGIN: Vec = [70, 196];
const U_REF: Vec = [150, -100];
const U_NOREF: Vec = [176, -40];
const DELTA: Vec = [U_REF[0] - U_NOREF[0], U_REF[1] - U_NOREF[1]];
const U_POS: Vec = [210, -36];

const SCENES = [
  {
    label: "reference를 넣고 빼서 두 번 예측",
    summary: "Δ = û_ref − û_noref",
    w: -1,
    note: "같은 target에 대해 reference를 context에 넣은 예측과 뺀 예측을 따로 냅니다. 두 화살표 끝을 잇는 차이 Δ가 reference가 예측을 어느 쪽으로 미는지, 곧 identity 방향입니다.",
  },
  {
    label: "w_id = 0",
    summary: "û = û_pos",
    w: 0,
    note: "출발점은 text 조건까지 CFG로 보정된 예측 û_pos입니다. w_id가 0이면 Δ를 더하지 않으므로 identity guidance가 꺼진 상태입니다.",
  },
  {
    label: "w_id = 1 (가정)",
    summary: "û = û_pos + 1·Δ",
    w: 1,
    note: "û_pos 끝에 Δ를 한 번 이어 붙인 곳이 최종 예측입니다. CFG가 text 조건 유무의 차이를 더하듯, 여기서는 reference 유무의 차이를 더합니다.",
  },
  {
    label: "w_id = 2 (가정)",
    summary: "û = û_pos + 2·Δ",
    w: 2,
    note: "같은 방향으로 두 배 밀어 identity를 더 강하게 반영합니다. 어느 w_id든 Δ를 쓰려면 매 step reference 없는 예측을 한 번 더 계산해야 합니다.",
  },
] as const;

const REF = "#059669";
const NOREF = "#94a3b8";
const POS = "#2563eb";
const DELTA_C = "#d97706";
const OUT = "#7c3aed";

function Arrow({ from, d, color, dashed = false, label, dx = 6, dy = -6 }: { from: Vec; d: Vec; color: string; dashed?: boolean; label: string; dx?: number; dy?: number }) {
  const [x1, y1] = from;
  const x2 = x1 + d[0];
  const y2 = y1 + d[1];
  const len = Math.hypot(d[0], d[1]) || 1;
  const ux = d[0] / len;
  const uy = d[1] / len;
  const head = `${x2},${y2} ${x2 - 8 * ux - 4 * uy},${y2 - 8 * uy + 4 * ux} ${x2 - 8 * ux + 4 * uy},${y2 - 8 * uy - 4 * ux}`;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2 - 6 * ux} y2={y2 - 6 * uy} stroke={color} strokeWidth={1.25} strokeDasharray={dashed ? "4 3" : undefined} />
      <polygon points={head} fill={color} />
      <text x={x2 + dx} y={y2 + dy} fontSize={14} fontWeight={700} fill={color}>
        {label}
      </text>
    </g>
  );
}

export default function IdentityGuidanceViz() {
  return (
    <SceneShell
      eyebrow="identity guidance"
      title="Reference 유무의 차이를 화살표로 이어 붙입니다"
      description="velocity 예측은 model이 이번 step에 latent를 어느 쪽으로 옮길지 내는 값입니다. 고차원 값을 평면 화살표로 줄였고, 길이·각도와 w_id = 1, 2는 가정입니다."
      ariaLabel="reference 있음과 없음 예측의 차이를 CFG 예측에 w_id배 더하는 네 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const pairOnly = scene.w < 0;
        const tip: Vec = [ORIGIN[0] + U_POS[0], ORIGIN[1] + U_POS[1]];
        const scaled: Vec = [DELTA[0] * Math.max(scene.w, 0), DELTA[1] * Math.max(scene.w, 0)];
        const noTip: Vec = [ORIGIN[0] + U_NOREF[0], ORIGIN[1] + U_NOREF[1]];
        return (
          <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_11rem]">
            <div className="w-full min-w-0">
              <svg viewBox="0 0 400 210" role="img" aria-label={scene.label} className="h-auto w-full max-w-xl">
                <circle cx={ORIGIN[0]} cy={ORIGIN[1]} r={3} fill="#334155" />
                {pairOnly ? (
                  <g>
                    <Arrow from={ORIGIN} d={U_REF} color={REF} label="û_ref" dx={-52} dy={-6} />
                    <Arrow from={ORIGIN} d={U_NOREF} color={NOREF} label="û_noref" dx={4} dy={16} />
                    <Arrow from={noTip} d={DELTA} color={DELTA_C} dashed label="Δ" dx={8} dy={4} />
                  </g>
                ) : (
                  <g>
                    <Arrow from={ORIGIN} d={U_POS} color={POS} label="û_pos" dx={-30} dy={24} />
                    {scene.w > 0 && (
                      <g>
                        <Arrow from={tip} d={scaled} color={DELTA_C} dashed label={`${scene.w}·Δ`} dx={10} dy={16} />
                        <Arrow from={ORIGIN} d={[U_POS[0] + scaled[0], U_POS[1] + scaled[1]]} color={OUT} label="û" dx={-20} dy={-4} />
                      </g>
                    )}
                  </g>
                )}
              </svg>
            </div>
            <dl className="hidden content-start sm:grid gap-2 text-xs leading-5">
              <div className="border-l-2 pl-2" style={{ borderColor: pairOnly ? REF : POS }}>
                <dt className="font-bold">{pairOnly ? "û_ref · û_noref" : "û_pos"}</dt>
                <dd className="text-muted-foreground">{pairOnly ? "reference 있음 · 없음으로 같은 target을 예측" : "text 조건까지 CFG로 보정된 예측"}</dd>
              </div>
              <div className="border-l-2 pl-2" style={{ borderColor: DELTA_C }}>
                <dt className="font-bold">Δ</dt>
                <dd className="text-muted-foreground">reference가 예측을 미는 방향</dd>
              </div>
              <div className="border-l-2 pl-2" style={{ borderColor: NOREF }}>
                <dt className="font-bold">reference 없는 예측</dt>
                <dd className="text-muted-foreground">{scene.w === 0 ? "w_id = 0이면 Δ를 쓰지 않음" : "Δ를 쓰려면 매 step 한 번 더 계산"}</dd>
              </div>
            </dl>
          </div>
        );
      }}
    />
  );
}
