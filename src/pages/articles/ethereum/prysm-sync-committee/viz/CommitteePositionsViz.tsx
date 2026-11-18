import SceneShell from "./SceneShell";

/**
 * 본문 대응: #participation — 512 positions는 자리이고 validator identity가 아니다.
 * V37이 position 5와 261에 들어간 본문 예. 5 < 128 → subnet 0, 261 = 2 × 128 + 5 → subnet 2.
 * 같은 subnet 안 두 자리(261·300)는 전파 규칙을 보이려는 가정이다. 300 = 2 × 128 + 44.
 */
const W = 360;
const H = 176;
const LEFT = 14;
const RIGHT = 346;
const STRIP_Y = 62;
const STRIP_H = 26;
const SEG = (RIGHT - LEFT) / 4;
const px = (position: number) => LEFT + ((position + 0.5) / 512) * (RIGHT - LEFT);

type Scene = {
  label: string;
  summary: string;
  marks: readonly number[];
  showSig: boolean;
  sendTo: readonly number[];
  note: string;
};

const SCENES: readonly Scene[] = [
  {
    label: "512칸 = 자리",
    summary: "512 positions = 4 subnets × 128",
    marks: [],
    showSig: false,
    sendTo: [],
    note: "Mainnet 위원회는 512개의 자리(position)이고, 128개씩 네 subnet(gossip 전파 구간)으로 나뉩니다. 칸 수는 서로 다른 validator 수가 아닙니다.",
  },
  {
    label: "한 명, 두 자리",
    summary: "position 5 · 261 → 둘 다 V37",
    marks: [5, 261],
    showSig: false,
    sendTo: [],
    note: "뽑힌 validator를 후보에서 빼지 않으므로 같은 validator가 다시 뽑힐 수 있습니다. 본문 예에서 V37의 public key는 position 5와 261 두 자리에 나타납니다.",
  },
  {
    label: "서명 하나",
    summary: "σ37 1개 → position 5와 261",
    marks: [5, 261],
    showSig: true,
    sendTo: [],
    note: "V37의 signature는 하나지만 committee ordering의 두 position에 대응할 수 있습니다. 512 positions를 서로 다른 validator 512명으로 읽으면 안 됩니다.",
  },
  {
    label: "subnet별 전파",
    summary: "5 → subnet 0 · 261 → subnet 2 → 2번 전송",
    marks: [5, 261],
    showSig: true,
    sendTo: [0, 2],
    note: "5는 0–127 구간인 subnet 0, 261은 256–383 구간인 subnet 2입니다. Subnet이 다르므로 같은 message를 두 subnet에 한 번씩 보냅니다.",
  },
  {
    label: "같은 subnet",
    summary: "261 · 300 (가정) → subnet 2에 1번",
    marks: [261, 300],
    showSig: true,
    sendTo: [2],
    note: "두 자리가 261과 300(가정)이면 둘 다 subnet 2입니다. 같은 subnet 안의 여러 position은 중복 전파할 필요가 없어 한 번만 보냅니다.",
  },
];

export default function CommitteePositionsViz() {
  return (
    <SceneShell
      eyebrow="Position과 validator identity"
      title="512칸은 512명이 아니라 512자리이고, 한 명이 두 자리를 가질 수 있습니다"
      description="띠 하나가 mainnet 위원회의 512 positions, 네 구간이 128 positions씩인 subnet입니다."
      note="V37과 position 5·261은 본문의 설명용 예입니다. 261·300 조합은 같은 subnet 안 전파를 보이려는 가정입니다."
      ariaLabel="512 positions와 네 subnet 위에서 같은 validator가 두 자리를 차지하는 경우와 전파 횟수"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {scene.showSig && (
              <g>
                <rect x={W / 2 - 34} y={6} width={68} height={22} rx={6} fill="none" stroke="#2563eb" strokeWidth={1.25} />
                <text x={W / 2} y={21} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">
                  σ37 하나
                </text>
                {scene.marks.map((position) => (
                  <line key={position} x1={W / 2} y1={28} x2={px(position)} y2={STRIP_Y - 3} stroke="#2563eb" strokeWidth={1} />
                ))}
              </g>
            )}
            {[0, 1, 2, 3].map((subnet) => {
              const sent = scene.sendTo.includes(subnet);
              return (
                <g key={subnet}>
                  <rect
                    x={LEFT + subnet * SEG}
                    y={STRIP_Y}
                    width={SEG}
                    height={STRIP_H}
                    fill={sent ? "#2563eb" : "none"}
                    fillOpacity={sent ? 0.12 : 0}
                    stroke="#94a3b8"
                    strokeWidth={1}
                  />
                  <text x={LEFT + subnet * SEG + SEG / 2} y={STRIP_Y + STRIP_H + 16} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-foreground">
                    subnet {subnet}
                  </text>
                  <text x={LEFT + subnet * SEG + SEG / 2} y={STRIP_Y + STRIP_H + 30} textAnchor="middle" fontSize={10.5} fill="#64748b">
                    {subnet * 128}–{subnet * 128 + 127}
                  </text>
                  {sent && (
                    <text x={LEFT + subnet * SEG + SEG / 2} y={STRIP_Y + STRIP_H + 48} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">
                      전송 1회
                    </text>
                  )}
                </g>
              );
            })}
            {scene.marks.map((position) => (
              <g key={position}>
                <rect x={px(position) - 2.5} y={STRIP_Y + 2} width={5} height={STRIP_H - 4} fill="#d97706" />
                <text x={px(position)} y={STRIP_Y - 8} textAnchor={position < 40 ? "start" : "middle"} fontSize={11} fontWeight={700} fill="#d97706">
                  {scene.showSig ? `${position}` : `${position}: V37`}
                </text>
              </g>
            ))}
            {active === 0 && (
              <text x={W / 2} y={STRIP_Y - 12} textAnchor="middle" fontSize={12} fill="#64748b">
                position 0 ─────────── 511
              </text>
            )}
            {scene.sendTo.length > 0 && (
              <text x={W / 2} y={H - 4} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-foreground">
                같은 message · 전송 {scene.sendTo.length}회
              </text>
            )}
          </svg>
        );
      }}
    />
  );
}
