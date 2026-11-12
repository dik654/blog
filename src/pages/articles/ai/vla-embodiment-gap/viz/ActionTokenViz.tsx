import SceneShell from "./SceneShell";

/**
 * 본문 대응: #action-interface — RT-2는 각 action 차원을 256개 bin으로 이산화하고
 * 8개 차원(6-DoF pose delta·gripper·episode 종료)을 언어 vocabulary의 token ID로 재사용한다.
 * 값의 범위, 예시 값, 각 차원의 칸 번호는 설명용으로 고른 것입니다(가정).
 */
const BINS = 256;
const SAMPLE = 0.62; // 범위 안에서 예시 값의 위치(가정)
const SAMPLE_BIN = Math.floor(SAMPLE * BINS);

const DIMS = [
  { name: "Δx", group: "위치" },
  { name: "Δy", group: "위치" },
  { name: "Δz", group: "위치" },
  { name: "Δroll", group: "회전" },
  { name: "Δpitch", group: "회전" },
  { name: "Δyaw", group: "회전" },
  { name: "gripper", group: "gripper" },
  { name: "종료", group: "episode" },
] as const;
/** 각 차원의 칸 번호 예시(가정). 첫 칸은 위 예시 값과 같습니다. */
const EXAMPLE_BINS: readonly number[] = [SAMPLE_BIN, 97, 201, 128, 131, 64, 240, 12];

const W = 360;
const H = 150;
const L0 = 24;
const L1 = 336;
const LINE_Y = 52;
const lx = (f: number) => L0 + f * (L1 - L0);
const INK = "#475569";
const MUTED = "#94a3b8";
const ACCENT = "#2563eb";
const ZOOM = [SAMPLE_BIN - 2, SAMPLE_BIN - 1, SAMPLE_BIN, SAMPLE_BIN + 1, SAMPLE_BIN + 2] as const;

const SCENES = [
  {
    label: "한 차원은 연속값입니다",
    summary: "예: Δx 하나 (가정)",
    note: "Robot 손끝을 x 방향으로 얼마나 옮길지(Δx)는 범위 안의 어떤 실수든 될 수 있습니다. 범위와 점 위치는 예입니다(가정).",
  },
  {
    label: "256칸으로 자릅니다",
    summary: `0~255 중 ${SAMPLE_BIN}번 칸`,
    note: `범위를 256개 칸(bin)으로 나누고 값이 떨어진 칸의 번호만 남깁니다. 이것이 이산화입니다. 같은 칸에 든 값은 모두 ${SAMPLE_BIN}번이 됩니다.`,
  },
  {
    label: "8개 차원이면 번호 8개",
    summary: "action 한 번 = 칸 번호 8개",
    note: "6-DoF pose delta(위치 3·회전 3), gripper, episode 종료까지 8개 차원을 같은 방식으로 자르면 action 하나가 0~255 번호 8개가 됩니다.",
  },
  {
    label: "번호를 text token 자리에 둡니다",
    summary: "VLM이 문장처럼 예측",
    note: `RT-2는 이 번호들을 언어 vocabulary의 token ID로 재사용해 VLM이 text token처럼 action을 냅니다. 주황 칸은 각 번호에 대응하는 token입니다.`,
  },
] as const;

function Line({ cut }: { cut: boolean }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={cut ? "범위를 256칸으로 나눈 수직선" : "연속 범위의 수직선"}>
      <text x={L0} y={LINE_Y - 22} fontSize={11} fill={INK}>
        하한 (가정)
      </text>
      <text x={L1} y={LINE_Y - 22} textAnchor="end" fontSize={11} fill={INK}>
        상한 (가정)
      </text>
      {cut ? (
        Array.from({ length: BINS + 1 }, (_, i) => (
          <line key={i} x1={lx(i / BINS)} y1={LINE_Y - 7} x2={lx(i / BINS)} y2={LINE_Y + 7} stroke={MUTED} strokeWidth={0.4} />
        ))
      ) : (
        <line x1={L0} y1={LINE_Y} x2={L1} y2={LINE_Y} stroke={MUTED} strokeWidth={1.25} />
      )}
      {cut && <line x1={L0} y1={LINE_Y} x2={L1} y2={LINE_Y} stroke={MUTED} strokeWidth={0.6} />}
      <circle cx={lx(SAMPLE)} cy={LINE_Y} r={4} fill={ACCENT} />
      <text x={lx(SAMPLE)} y={LINE_Y - 11} textAnchor="middle" fontSize={11} fontWeight={700} fill={ACCENT}>
        Δx 값
      </text>
      {cut ? (
        <g>
          <line x1={lx(SAMPLE)} y1={LINE_Y + 8} x2={W / 2} y2={LINE_Y + 34} stroke={MUTED} strokeWidth={1} />
          {ZOOM.map((bin, k) => {
            const x = W / 2 - 100 + k * 40;
            const hit = bin === SAMPLE_BIN;
            return (
              <g key={bin}>
                <rect x={x} y={LINE_Y + 36} width={40} height={30} fill={hit ? "#dbeafe" : "none"} stroke={hit ? ACCENT : MUTED} strokeWidth={1} />
                <text x={x + 20} y={LINE_Y + 55} textAnchor="middle" fontSize={11.5} fontWeight={hit ? 700 : 400} fill={hit ? ACCENT : INK}>
                  {bin}
                </text>
              </g>
            );
          })}
          <text x={W / 2} y={LINE_Y + 84} textAnchor="middle" fontSize={10.5} fill={INK}>
            확대: 이웃한 다섯 칸 · 값은 {SAMPLE_BIN}번 칸 안
          </text>
        </g>
      ) : (
        <text x={W / 2} y={LINE_Y + 40} textAnchor="middle" fontSize={11} fill={INK}>
          점은 선 위 어디에나 올 수 있습니다
        </text>
      )}
    </svg>
  );
}

function Slots({ token }: { token: boolean }) {
  return (
    <div className="min-w-0">
      <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-8 sm:gap-2">
        {DIMS.map((d, i) => (
          <div key={d.name} className={`rounded-md border px-1 py-1.5 text-center ${token ? "border-[#d97706]" : "border-border/70"}`}>
            <span className={`block text-[11px] ${token ? "font-semibold text-[#b45309]" : "text-muted-foreground"}`}>{token ? "token" : d.group}</span>
            <span className="block font-mono text-xs font-semibold">{d.name}</span>
            <span className={`mt-0.5 block font-mono text-sm font-bold ${token ? "text-[#b45309]" : "text-[#2563eb]"}`}>
              {EXAMPLE_BINS[i]}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-xs leading-5">
        {token ? "VLM 출력 token 8개 = action 한 번 (기존 vocabulary 자리 재사용)" : "action 한 번 = 차원 8개 × 각 0~255 번호 (번호는 예, 가정)"}
        {token && (
          <span className="block text-[11px] text-[#b45309]">유효한 token ≠ 유효한 kinematics·collision·contact</span>
        )}
      </p>
    </div>
  );
}

export default function ActionTokenViz() {
  return (
    <SceneShell
      eyebrow="Action tokenization"
      title="연속 action을 256칸 번호로 바꿔 text token 자리에 넣습니다"
      description="RT-2가 action-space 정렬을 text token 공간 안에서 푼 방식을 한 차원부터 봅니다."
      ariaLabel="연속 action 값을 256개 bin 번호로 바꾸고 8개 차원을 token으로 표현하는 과정"
      scenes={SCENES}
      render={(active) => (active <= 1 ? <Line cut={active === 1} /> : <Slots token={active === 3} />)}
    />
  );
}
