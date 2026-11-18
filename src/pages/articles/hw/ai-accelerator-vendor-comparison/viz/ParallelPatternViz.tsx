import SceneShell from "./SceneShell";

/**
 * 본문 대응: #collective-path — tensor parallel은 layer마다 짧고 잦은 collective,
 * pipeline parallel은 layer 묶음 경계에서 activation을 넘기고 stage가 서로 기다림,
 * MoE expert parallel은 token이 expert로 흩어졌다 돌아오는 all-to-all과 쏠림.
 * 두 장·40/40 분할·token 8개·expert 4개와 5/1/1/1 배정은 모두 그림을 위한 가정이다.
 */
const C = { a: "#2563eb", b: "#7c3aed", sync: "#d97706", muted: "#64748b", line: "#cbd5e1", text: "#334155", warn: "#dc2626" };
const EXPERT_LOAD = [5, 1, 1, 1] as const;
const TOKENS = EXPERT_LOAD.reduce<number>((sum, value) => sum + value, 0);
const AVERAGE = TOKENS / EXPERT_LOAD.length;
const PEAK = Math.max(...EXPERT_LOAD);

const SCENES = [
  {
    label: "Tensor parallel",
    summary: "layer마다 합침 · 짧고 잦음",
    note: "한 layer를 두 장이 함께 계산하므로 layer마다 결과를 합칩니다. 경계가 layer 수만큼 생기므로 짧고 잦은 collective의 지연에 민감합니다.",
  },
  {
    label: "Pipeline parallel",
    summary: "묶음 경계 1곳 · stage가 기다림",
    note: "Layer를 앞뒤 묶음(stage)으로 나눠 장마다 맡기면 경계에서만 activation을 넘기므로 통신 횟수는 줄어듭니다. 대신 뒤 stage는 앞 stage의 결과가 올 때까지 기다릴 수 있습니다. 40/40 분할은 가정입니다.",
  },
  {
    label: "MoE expert parallel",
    summary: `평균 ${AVERAGE} · 가장 많은 곳 ${PEAK}`,
    note: `70B dense 사례가 아니라 MoE 모델일 때의 그림입니다. Token이 고른 expert가 있는 장으로 흩어졌다 돌아오는 all-to-all이 생깁니다. Token ${TOKENS}개가 ${EXPERT_LOAD.join("·")}개로 쏠리면(가정) 평균은 ${AVERAGE}개지만 돌아오는 시점은 가장 많이 받은 쪽이 정합니다.`,
  },
] as const;

function Tensor() {
  const rows = [0, 1, 2, 3];
  return (
    <g>
      <text x={110} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.a}>가속기 A</text>
      <text x={250} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.b}>가속기 B</text>
      {rows.map((row) => {
        const y = 32 + row * 40;
        return (
          <g key={row}>
            <text x={20} y={y + 17} fontSize={10} fill={C.muted}>layer {row + 1}</text>
            <rect x={60} y={y} width={100} height={24} rx={5} fill="none" stroke={C.a} strokeWidth={1} />
            <text x={110} y={y + 16} textAnchor="middle" fontSize={9.5} fill={C.text}>절반</text>
            <rect x={200} y={y} width={100} height={24} rx={5} fill="none" stroke={C.b} strokeWidth={1} />
            <text x={250} y={y + 16} textAnchor="middle" fontSize={9.5} fill={C.text}>절반</text>
            <line x1={160} y1={y + 12} x2={200} y2={y + 12} stroke={C.sync} strokeWidth={1.25} />
            <text x={322} y={y + 16} fontSize={9.5} fill={C.sync}>합침</text>
          </g>
        );
      })}
      <text x={180} y={200} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={C.sync}>경계가 layer마다 · 80 layer면 80곳 이상</text>
    </g>
  );
}

function Pipeline() {
  return (
    <g>
      <rect x={30} y={22} width={130} height={60} rx={8} fill="none" stroke={C.a} strokeWidth={1.2} />
      <text x={95} y={46} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.a}>가속기 A · stage 1</text>
      <text x={95} y={66} textAnchor="middle" fontSize={10} fill={C.text}>layer 1–40 (가정)</text>
      <rect x={200} y={22} width={130} height={60} rx={8} fill="none" stroke={C.b} strokeWidth={1.2} />
      <text x={265} y={46} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.b}>가속기 B · stage 2</text>
      <text x={265} y={66} textAnchor="middle" fontSize={10} fill={C.text}>layer 41–80 (가정)</text>
      <line x1={160} y1={52} x2={196} y2={52} stroke={C.sync} strokeWidth={1.25} />
      <circle cx={196} cy={52} r={2.4} fill={C.sync} />
      <text x={180} y={100} textAnchor="middle" fontSize={10} fill={C.sync}>activation 넘김 · 경계 1곳</text>

      <text x={20} y={134} fontSize={10} fill={C.muted}>A</text>
      <rect x={40} y={122} width={140} height={18} rx={3} fill={C.a} fillOpacity={0.75} />
      <text x={110} y={135} textAnchor="middle" fontSize={9.5} fill="#ffffff">계산</text>
      <rect x={180} y={122} width={140} height={18} rx={3} fill="none" stroke={C.line} strokeWidth={1} strokeDasharray="3 3" />
      <text x={250} y={135} textAnchor="middle" fontSize={9.5} fill={C.muted}>다음 일을 기다림</text>
      <text x={20} y={162} fontSize={10} fill={C.muted}>B</text>
      <rect x={40} y={150} width={140} height={18} rx={3} fill="none" stroke={C.warn} strokeWidth={1} strokeDasharray="3 3" />
      <text x={110} y={163} textAnchor="middle" fontSize={9.5} fill={C.warn}>A의 결과를 기다림</text>
      <rect x={180} y={150} width={140} height={18} rx={3} fill={C.b} fillOpacity={0.75} />
      <text x={250} y={163} textAnchor="middle" fontSize={9.5} fill="#ffffff">계산</text>
      <text x={180} y={194} textAnchor="middle" fontSize={10} fill={C.muted}>시간 → (요청 하나의 흐름, 길이는 비례 아님)</text>
    </g>
  );
}

function Expert() {
  return (
    <g>
      <rect x={130} y={14} width={100} height={26} rx={6} fill="none" stroke={C.text} strokeWidth={1} />
      <text x={180} y={31} textAnchor="middle" fontSize={10.5} fill={C.text}>token {TOKENS}개 (가정)</text>
      {EXPERT_LOAD.map((load, index) => {
        const x = 22 + index * 84;
        const isPeak = load === PEAK;
        const color = isPeak ? C.warn : C.a;
        return (
          <g key={index}>
            <line x1={180} y1={40} x2={x + 36} y2={70} stroke={C.sync} strokeWidth={1} />
            <rect x={x} y={72} width={72} height={34} rx={6} fill="none" stroke={color} strokeWidth={isPeak ? 1.25 : 1} />
            <text x={x + 36} y={86} textAnchor="middle" fontSize={9.5} fill={C.muted}>expert {index + 1}</text>
            <text x={x + 36} y={100} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={color}>{load}개</text>
            {Array.from({ length: load }, (_, cell) => (
              <rect key={cell} x={x + 8 + cell * 12} y={116} width={9} height={14} rx={2} fill={color} fillOpacity={0.7} />
            ))}
          </g>
        );
      })}
      <line x1={22} y1={142} x2={338} y2={142} stroke={C.line} strokeWidth={1} />
      <text x={180} y={164} textAnchor="middle" fontSize={10.5} fill={C.text}>평균 {TOKENS}÷{EXPERT_LOAD.length} = {AVERAGE}개 · 가장 많은 곳 {PEAK}개</text>
      <text x={180} y={188} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={C.warn}>모두 돌아오려면 {PEAK}개를 받은 expert가 끝나야 함</text>
    </g>
  );
}

export default function ParallelPatternViz() {
  return (
    <SceneShell
      eyebrow="병렬화 방식별 통신"
      title="나누는 방식이 다르면 통신이 생기는 자리와 횟수가 다릅니다"
      description="같은 모델을 여러 장에 나누는 세 방식을 차례로 봅니다. 장 수, layer 분할, token과 expert 수는 모양을 보이기 위한 가정입니다."
      ariaLabel="tensor parallel, pipeline parallel, MoE expert parallel의 통신 위치 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 210" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 && <Tensor />}
          {active === 1 && <Pipeline />}
          {active === 2 && <Expert />}
        </svg>
      )}
    />
  );
}
