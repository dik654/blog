import SceneShell from "./SceneShell";

/**
 * 본문 대응: #release 첫 두 문단 — k-common-prefix와 partition.
 * 두 정직한 노드의 chain에서 최근 k개를 잘라낸 뒤 남은 앞부분이 같은지 비교한다.
 * k=2, chain 길이 8, 갈라진 위치는 설명용 가정.
 */
const K = 2;
const LEN = 8;
const W = 360;
const H = 170;
const X0 = 62;
const BW = 30;
const GAP = 4;
const bx = (i: number) => X0 + i * (BW + GAP);
const CUT_X = bx(LEN - K) - GAP / 2;

const SCENES = [
  {
    label: "마지막 block만 다름",
    summary: "k=2를 잘라내면 앞부분 일치",
    split: LEN - 1,
    note: "자연 분기로 두 노드의 마지막 block만 다릅니다. 최근 k=2개를 잘라낸 앞부분은 같으므로 이 순간에는 2-common-prefix를 만족합니다. 이것은 정해진 실행 구간에서 실패 확률이 작다는 명제이지, 앞으로 절대 갈라지지 않는다는 보장이 아닙니다.",
  },
  {
    label: "장기 partition",
    summary: "잘라낸 뒤에도 앞부분이 다름",
    split: LEN - 5,
    note: "두 정직한 집단이 서로의 block을 받지 못한 채 각자 분기를 키우면, 이 예처럼 갈라진 지점이 잘라낸 k개보다 앞에 놓입니다. 남은 앞부분이 달라 성질이 깨집니다. 이 경우 확인 숫자만 늘리는 것은 깨진 전제를 복구하지 못합니다.",
  },
] as const;

function Row({ y, name, split, variant }: { y: number; name: string; split: number; variant: "a" | "b" }) {
  return (
    <g>
      <text x={8} y={y + 19} fontSize={11} fontWeight={700} fill="#475569">{name}</text>
      {Array.from({ length: LEN }, (_, i) => {
        const diverged = i >= split;
        const cut = i >= LEN - K;
        const color = diverged ? (variant === "a" ? "#2563eb" : "#d97706") : "#64748b";
        return (
          <g key={i} opacity={cut ? 0.35 : 1}>
            <rect x={bx(i)} y={y} width={BW} height={28} rx={3} fill={color} fillOpacity={diverged ? 0.85 : 0.3} />
            <text x={bx(i) + BW / 2} y={y + 18} textAnchor="middle" fontSize={10} fontWeight={700} fill={diverged ? "#ffffff" : "#334155"}>
              {diverged ? `${variant.toUpperCase()}${i - split + 1}` : i + 1}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export default function CommonPrefixViz() {
  return (
    <SceneShell
      eyebrow="k-common-prefix · k=2 (가정)"
      title="최근 k개를 잘라낸 뒤 남은 과거가 같은지 비교합니다"
      description="두 줄은 두 정직한 노드가 각자 가진 chain입니다. 회색은 공통 block, 색칸은 각자만 가진 block이고, 점선 오른쪽 흐린 칸이 잘라낸 최근 k개입니다."
      ariaLabel="두 정직한 노드 chain에서 최근 2개를 잘라낸 앞부분 비교, 자연 분기와 장기 partition"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const ok = scene.split >= LEN - K;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <Row y={18} name="노드 1" split={scene.split} variant="a" />
            <Row y={60} name="노드 2" split={scene.split} variant="b" />
            <line x1={CUT_X} x2={CUT_X} y1={8} y2={100} stroke="#475569" strokeWidth={1} strokeDasharray="4 3" />
            <text x={CUT_X + 4} y={112} fontSize={10} fill="#64748b">잘라낸 k=2</text>
            <rect x={X0} y={124} width={CUT_X - X0 - 2} height={30} rx={4} fill="none" stroke={ok ? "#16a34a" : "#dc2626"} strokeWidth={1.25} />
            <text x={X0 + (CUT_X - X0) / 2} y={144} textAnchor="middle" fontSize={11} fontWeight={700} fill={ok ? "#15803d" : "#b91c1c"}>
              {ok ? "앞 6칸이 두 노드에서 같음 ✓" : "앞 6칸 안에서 이미 갈라짐 ✗"}
            </text>
          </svg>
        );
      }}
    />
  );
}
