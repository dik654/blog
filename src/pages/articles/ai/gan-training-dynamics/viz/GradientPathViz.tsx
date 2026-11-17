import SceneShell from "./SceneShell";

/**
 * 본문 대응: #gradient-path — D step은 G(z).detach(), G step은 D 가중치를 고정한 채 D 입력 기울기를 통과,
 * D output 전체를 detach하면 G가 받을 ∂loss/∂x̃도 끊긴다.
 * 모양은 00절 Term의 작은 예(batch 64: z 64×128, G(z) 64×3×64×64, D logit 64×1)를 그대로 쓴다.
 */
const ROW_Y: readonly number[] = [30, 86, 142, 198, 254];
const ROWS = [
  { label: "z", shape: "64×128" },
  { label: "G · 매개변수 θ", shape: "" },
  { label: "x̃ = G(z)", shape: "64×3×64×64" },
  { label: "D · 매개변수 φ", shape: "" },
  { label: "D logit → loss", shape: "64×1" },
] as const;

type Status = { text: string; sub: string; tone: "update" | "frozen" | "none" };

const SCENES = [
  {
    label: "D step",
    summary: "G(z).detach() → D만 갱신",
    note: "detach는 값은 그대로 쓰되 그 지점에서 뒤로 가는 기울기를 끊는 연산입니다. 생성된 x̃의 값만 D에 넣고 G 쪽 계산 그래프는 끊었으므로, 역전파는 φ까지만 가고 θ에는 닿지 않습니다.",
    cutBetween: 1,
    stopRow: 2,
    g: { text: "변화 없음", sub: "기울기 안 옴", tone: "none" },
    d: { text: "갱신", sub: "D optimizer", tone: "update" },
  },
  {
    label: "G step",
    summary: "D 통과 → G만 갱신",
    note: "이번에는 φ를 고정합니다. 고정은 D의 가중치를 바꾸지 않는다는 뜻일 뿐이라 ∂loss/∂x̃는 D를 거쳐 x̃까지 흐르고, Generator Jacobian의 전치 Jᵀ가 그 방향을 θ로 당겨옵니다(Jacobian: θ 변화가 G(z)를 얼마나 바꾸는지 나타내는 local linear map).",
    cutBetween: -1,
    stopRow: 1,
    g: { text: "갱신", sub: "G optimizer", tone: "update" },
    d: { text: "고정", sub: "입력 기울기는 통과", tone: "frozen" },
  },
  {
    label: "잘못 끊은 경우",
    summary: "D output detach → G update 사라짐",
    note: "G step에서 D output 전체를 detach하면 역전파가 logit에서 멈춥니다. ∂loss/∂x̃가 만들어지지 않으니 Jᵀ로 당겨올 것도 없어 θ의 update가 사라집니다. 가중치 고정(freeze)과 activation 끊기(detach)는 같은 연산이 아닙니다.",
    cutBetween: 3,
    stopRow: 4,
    g: { text: "update 없음", sub: "∂loss/∂x̃ 끊김", tone: "none" },
    d: { text: "고정", sub: "", tone: "frozen" },
  },
] as const satisfies readonly {
  label: string;
  summary: string;
  note: string;
  cutBetween: number;
  stopRow: number;
  g: Status;
  d: Status;
}[];

const TONE = {
  update: { stroke: "#0891b2", text: "#0e7490" },
  frozen: { stroke: "#64748b", text: "#475569" },
  none: { stroke: "#94a3b8", text: "#64748b" },
} as const;

const BOX_X = 44;
const BOX_W = 196;
const BOX_H = 34;
const LINE_X = 24;
const ORANGE = "#ea580c";

function StatusChip({ y, status }: { y: number; status: Status }) {
  const tone = TONE[status.tone];
  return (
    <g>
      <rect x={252} y={y - 17} width={100} height={34} rx={6} fill="none" stroke={tone.stroke} strokeWidth={1} strokeDasharray={status.tone === "none" ? "3 3" : undefined} />
      <text x={302} y={status.sub ? y - 2 : y + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={tone.text}>
        {status.text}
      </text>
      {status.sub && (
        <text x={302} y={y + 11} textAnchor="middle" fontSize={9} fill={tone.text}>
          {status.sub}
        </text>
      )}
    </g>
  );
}

export default function GradientPathViz() {
  return (
    <SceneShell
      eyebrow="기울기 경로"
      title="D step과 G step에서 역전파가 어디까지 가는가"
      description="위에서 아래로 forward 계산, 왼쪽 주황 선이 loss에서 거꾸로 올라가는 기울기입니다. 오른쪽 칸은 그 step에서 각 매개변수가 어떻게 되는지입니다. 모양은 00절의 batch 64 예입니다."
      ariaLabel="GAN D step, G step, 잘못된 detach에서 기울기가 도달하는 범위"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const cutY = scene.cutBetween >= 0 ? ((ROW_Y[scene.cutBetween] ?? 0) + (ROW_Y[scene.cutBetween + 1] ?? 0)) / 2 : null;
        const stopY = cutY === null ? ROW_Y[scene.stopRow] : cutY + 6;
        return (
          <svg viewBox="0 0 360 285" className="mx-auto h-auto w-full max-w-[400px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {ROWS.map((row, index) => {
              const y = ROW_Y[index];
              const reached = index >= scene.stopRow;
              return (
                <g key={row.label}>
                  <rect x={BOX_X} y={y - BOX_H / 2} width={BOX_W} height={BOX_H} rx={8} fill="none" stroke={reached ? ORANGE : "#94a3b8"} strokeWidth={1} />
                  <text x={BOX_X + 12} y={y + 4} fontSize={12} fontWeight={700} fill="currentColor">
                    {row.label}
                  </text>
                  {row.shape && (
                    <text x={BOX_X + BOX_W - 10} y={y + 4} textAnchor="end" fontSize={10} fontFamily="ui-monospace, monospace" fill="#64748b">
                      {row.shape}
                    </text>
                  )}
                  {index < ROWS.length - 1 && (
                    <line x1={BOX_X + BOX_W / 2} x2={BOX_X + BOX_W / 2} y1={y + BOX_H / 2} y2={ROW_Y[index + 1] - BOX_H / 2} stroke="#94a3b8" strokeWidth={1} />
                  )}
                </g>
              );
            })}
            <text x={BOX_X + BOX_W / 2 + 6} y={ROW_Y[0] + 31} fontSize={9} fill="#64748b">
              forward ↓
            </text>
            <line x1={LINE_X} x2={LINE_X} y1={ROW_Y[4]} y2={stopY} stroke={ORANGE} strokeWidth={1.25} />
            <path d={`M${LINE_X - 4} ${stopY + 7} L${LINE_X} ${stopY} L${LINE_X + 4} ${stopY + 7}`} fill="none" stroke={ORANGE} strokeWidth={1.25} />
            <line x1={LINE_X} x2={BOX_X} y1={ROW_Y[4]} y2={ROW_Y[4]} stroke={ORANGE} strokeWidth={1} />
            {cutY === null && <line x1={LINE_X} x2={BOX_X} y1={stopY} y2={stopY} stroke={ORANGE} strokeWidth={1} />}
            {active === 1 && (
              <>
                <text x={LINE_X + 4} y={ROW_Y[2] + 30} fontSize={9} fill={ORANGE}>
                  ∂loss/∂x̃
                </text>
                <text x={LINE_X + 4} y={ROW_Y[1] + 31} fontSize={10} fontWeight={700} fill={ORANGE}>
                  Jᵀ
                </text>
              </>
            )}
            {cutY !== null && (
              <g>
                <line x1={6} x2={BOX_X + BOX_W + 4} y1={cutY - 2} y2={cutY - 2} stroke="#dc2626" strokeWidth={1.25} />
                <line x1={6} x2={BOX_X + BOX_W + 4} y1={cutY + 2} y2={cutY + 2} stroke="#dc2626" strokeWidth={1.25} />
                <rect x={BOX_X + BOX_W / 2 + 2} y={cutY - 8} width={44} height={16} rx={3} fill="var(--background)" stroke="#dc2626" strokeWidth={1} />
                <text x={BOX_X + BOX_W / 2 + 24} y={cutY + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill="#dc2626">
                  detach
                </text>
              </g>
            )}
            <StatusChip y={ROW_Y[1]} status={scene.g} />
            <StatusChip y={ROW_Y[3]} status={scene.d} />
          </svg>
        );
      }}
    />
  );
}
