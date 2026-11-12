import SceneShell from "./SceneShell";

/**
 * 본문 대응: #compression — 768차원 embedding의 앞 m개 차원(prefix)과 MRL loss.
 * 막대 하나 = 768차원 벡터 한 개. 아래 선 = 앞에서부터 남긴 prefix 길이 128·256·512·768.
 * 일반 학습은 L768만, MRL은 네 길이의 loss를 c_m과 곱해 합친다.
 * 배포 순서: 128차원(예) 품질 확인(128×4 B = 512 B) → 같은 차원에서 int8 손실(128×1 B = 128 B).
 */
const LENGTHS = [128, 256, 512, 768] as const;

const W = 300;
const H = 222;
const LEFT = 12;
const BAR_W = 180;
const BAR_Y = 20;
const BAR_H = 16;
const ROW_Y = [66, 94, 122, 150] as const;
const COL_X = 204;
const COL_W = 88;

const ACCENT = "#2563eb";
const MUTED = "#94a3b8";
const TEXT = "#64748b";

const xOf = (dims: number) => LEFT + (dims / 768) * BAR_W;

const SCENES = [
  {
    label: "prefix란",
    summary: "앞 128 ⊂ 256 ⊂ 512 ⊂ 768",
    note: "Prefix는 768차원 embedding의 앞에서부터 m개 차원만 남긴 부분입니다. 짧은 prefix는 긴 prefix 안에 그대로 들어 있어 네 길이가 한 벡터 안에 겹쳐 있습니다. 차원은 임의로 고르지 않고 항상 앞에서부터 자릅니다.",
  },
  {
    label: "나중에 자르기",
    summary: "loss는 768에서만",
    note: "일반 학습은 768차원 전체로만 loss를 계산합니다. 나중에 앞 128차원만 잘라 쓴다고 해서 그 부분에 중요한 정보가 먼저 모여 있지는 않습니다. 128 길이만으로 계산한 검색 loss는 학습에 한 번도 없었습니다.",
  },
  {
    label: "MRL",
    summary: "네 길이의 loss를 합산",
    note: "MRL은 네 prefix를 각각 다시 정규화해 같은 pair 관계로 InfoNCE loss를 계산하고, 길이별 가중치 c_m을 곱해 더한 값을 같은 backward에 반영합니다. 그래서 짧은 prefix도 독립적으로 쓸 수 있게 학습됩니다. 자르기 연산 자체가 정보를 압축하는 것은 아닙니다.",
  },
  {
    label: "배포 순서",
    summary: "차원 확인 → 그다음 int8",
    note: "배포에 128차원(예)을 쓰기로 했다면 먼저 그 길이의 검색 품질을 확인하고, 같은 128차원에서 int8 손실을 다시 잽니다. Int8은 성분 하나를 4바이트 float32 대신 1바이트로 저장하며 좌표를 256단계로 근사합니다. 다른 데이터셋에서 따로 잰 두 손실을 더하거나 곱하지 않습니다.",
  },
] as const;

function LossLabel({ weighted = false, dims, suffix = "" }: { weighted?: boolean; dims: number; suffix?: string }) {
  return (
    <>
      {weighted && (
        <>
          c
          <tspan dy={3} fontSize={8}>{dims}</tspan>
          <tspan dy={-3}>·</tspan>
        </>
      )}
      L
      <tspan dy={3} fontSize={8}>{dims}</tspan>
      <tspan dy={-3}>{suffix}</tspan>
    </>
  );
}

function rowState(scene: number, index: number) {
  const dims = LENGTHS[index];
  if (scene === 0) return { text: <>z[1..{dims}]</>, on: true };
  if (scene === 1) return index === 3 ? { text: <LossLabel dims={dims} suffix=" 계산" />, on: true } : { text: <>loss 없음</>, on: false };
  if (scene === 2) return { text: <LossLabel weighted dims={dims} />, on: true };
  return index === 0 ? { text: <>배포 길이(예)</>, on: true } : { text: <>—</>, on: false };
}

const FOOTER: readonly (readonly string[])[] = [
  ["항상 앞에서부터 자릅니다.", "중간 차원을 골라 남기지 않습니다."],
  ["앞 128차원은 잘라 낼 수 있어도", "그 길이로 따로 배운 적은 없습니다."],
  ["L_MRL = 네 길이의 c_m × L_m 합", "c_m 값은 학습 설계가 정합니다."],
  ["① 128차원 품질 확인 · 512 B", "② 같은 차원 int8 손실 · 128 B"],
];

export default function MatryoshkaPrefixViz() {
  return (
    <SceneShell
      eyebrow="Matryoshka prefix"
      title="한 벡터 안에 겹쳐 있는 네 길이의 prefix"
      description="가로 막대 하나가 768차원 embedding 한 개이고, 아래 선은 앞에서부터 남긴 prefix 길이입니다. 768·512·256·128은 본문의 예시 길이입니다."
      note="길이별 가중치 c_m과 각 길이의 검색 품질은 데이터와 모델에 따라 달라서 그림에 값을 적지 않았습니다."
      ariaLabel="768차원 embedding의 prefix 길이와 길이별 loss, 배포 시 차원과 int8 측정 순서"
      scenes={SCENES}
      render={(active) => {
        const highlight = active === 1 || active === 2 ? 768 : 128;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <rect x={LEFT} y={BAR_Y} width={BAR_W} height={BAR_H} rx={2} fill="none" stroke={MUTED} strokeWidth={1} />
            <rect x={LEFT} y={BAR_Y} width={xOf(highlight) - LEFT} height={BAR_H} rx={2} fill={ACCENT} opacity={active === 1 ? 0.25 : 0.35} />
            {LENGTHS.slice(0, 3).map((dims) => (
              <line key={dims} x1={xOf(dims)} x2={xOf(dims)} y1={BAR_Y} y2={BAR_Y + BAR_H} stroke={MUTED} strokeWidth={1} strokeDasharray="2 2" />
            ))}
            <text x={LEFT} y={BAR_Y - 6} fontSize={10} fill={TEXT}>1번 차원</text>
            <text x={LEFT + BAR_W} y={BAR_Y - 6} fontSize={10} fill={TEXT} textAnchor="end">768번 차원</text>
            <text x={COL_X} y={BAR_Y + 12} fontSize={10} fill={TEXT}>{active === 0 ? "남긴 부분" : "길이별 loss"}</text>

            {LENGTHS.map((dims, index) => {
              const y = ROW_Y[index];
              const state = rowState(active, index);
              const lineOn = active === 0 || active === 2 || (active === 1 && index === 3) || (active === 3 && index === 0);
              const color = lineOn ? ACCENT : MUTED;
              return (
                <g key={dims}>
                  <text x={LEFT} y={y - 6} fontSize={11.5} fill={lineOn ? ACCENT : TEXT} fontWeight={lineOn ? 700 : 400}>
                    앞 {dims}차원
                  </text>
                  <line x1={LEFT} x2={xOf(dims)} y1={y} y2={y} stroke={color} strokeWidth={lineOn ? 1.25 : 1} />
                  <line x1={LEFT} x2={LEFT} y1={y - 3} y2={y + 3} stroke={color} strokeWidth={1} />
                  <line x1={xOf(dims)} x2={xOf(dims)} y1={y - 3} y2={y + 3} stroke={color} strokeWidth={1} />
                  <rect x={COL_X} y={y - 11} width={COL_W} height={18} rx={4} fill="none" stroke={state.on ? ACCENT : MUTED} strokeWidth={1} strokeDasharray={state.on ? undefined : "3 2"} />
                  <text x={COL_X + COL_W / 2} y={y + 2} fontSize={11} textAnchor="middle" fill={state.on ? ACCENT : TEXT} fontWeight={state.on ? 700 : 400}>
                    {state.text}
                  </text>
                </g>
              );
            })}

            <line x1={LEFT} x2={W - 8} y1={170} y2={170} stroke={MUTED} strokeWidth={1} />
            {FOOTER[active].map((line, index) => (
              <text key={line} x={LEFT} y={190 + index * 17} fontSize={12} fill={index === 0 ? ACCENT : TEXT} fontWeight={index === 0 ? 700 : 400}>
                {line}
              </text>
            ))}
          </svg>
        );
      }}
    />
  );
}
