import SceneShell from "./SceneShell";

/**
 * 본문 대응: #light-client-verification 1·2절 — 위원회의 출처를 trusted root에서 먼저 고정하고,
 * update는 순서·period 검사 → finalized header·next committee branch → BLS 서명 순으로 검사한다.
 * 첫 장면은 본문의 순환 신뢰 반례(공격자가 keys와 그 keys의 서명을 함께 줌)다.
 */
const W = 360;
const H = 236;
const LX = 10;
const RX = 190;
const BW = 160;
const BH = 30;

type Key = "root" | "boot" | "lstate" | "committee" | "checks" | "attested" | "rstate" | "final" | "next" | "sig" | "fake";

const SCENES: readonly { label: string; summary: string; shown: readonly Key[]; focus: readonly Key[]; note: string }[] = [
  {
    label: "순환 신뢰",
    summary: "공격자가 keys와 서명을 함께 줌",
    shown: ["fake", "sig"],
    focus: ["fake", "sig"],
    note: "공격자가 public keys와 그 keys의 aggregate signature를 함께 주면 검증은 통과합니다. 그래도 그 위원회가 신뢰한 chain state에 있었는지는 알 수 없습니다.",
  },
  {
    label: "출발점",
    summary: "HTR(bootstrap header) = trusted root",
    shown: ["root", "boot"],
    focus: ["root", "boot"],
    note: "사용자가 신뢰한 block root를 줍니다. Bootstrap header의 hash-tree-root(HTR, SSZ 구조를 32-byte root로 줄인 값)가 그 root와 같아야 합니다.",
  },
  {
    label: "위원회 출처",
    summary: "state root ← Merkle branch ← current committee",
    shown: ["root", "boot", "lstate", "committee"],
    focus: ["lstate", "committee"],
    note: "Current committee의 hash가 header의 state root에 들어 있다는 Merkle branch를 검증한 뒤에야 그 public-key ordering을 store의 current committee로 둡니다.",
  },
  {
    label: "순서·period",
    summary: "참여 ≥ 1 · 시각과 slot 순서 · period",
    shown: ["root", "boot", "lstate", "committee", "checks"],
    focus: ["checks"],
    note: "참여가 1명 이상인지, 현재 시각과 signature·attested·finalized slot의 순서, signature period가 committee 범위를 건너뛰지 않는지부터 봅니다.",
  },
  {
    label: "branch 연결",
    summary: "finalized header · next committee → attested state root",
    shown: ["root", "boot", "lstate", "committee", "checks", "attested", "rstate", "final", "next"],
    focus: ["attested", "rstate", "final", "next"],
    note: "Update에 실린 finalized header나 next committee는 각각 attested header(위원회가 서명한 header)의 state root에 연결되는 Merkle branch가 필요합니다.",
  },
  {
    label: "서명 검증",
    summary: "store의 current·next committee에서 set-bit keys",
    shown: ["root", "boot", "lstate", "committee", "checks", "attested", "rstate", "final", "next", "sig"],
    focus: ["committee", "attested", "sig"],
    note: "Set bits의 public keys만 store의 current 또는 next committee ordering에서 뽑고, signature slot의 previous slot fork version으로 domain을 만들어 attested header의 서명을 검증합니다.",
  },
];

const BOXES: Record<Key, { x: number; y: number; w: number; text: string; sub?: string }> = {
  root: { x: LX, y: 8, w: BW, text: "trusted block root", sub: "사용자가 제공" },
  boot: { x: LX, y: 54, w: BW, text: "bootstrap header", sub: "HTR = trusted root?" },
  lstate: { x: LX, y: 100, w: BW, text: "state root" },
  committee: { x: LX, y: 146, w: BW, text: "current committee", sub: "store에 저장" },
  checks: { x: RX, y: 8, w: BW, text: "update 순서·period 검사" },
  attested: { x: RX, y: 54, w: BW, text: "attested header" },
  rstate: { x: RX, y: 100, w: BW, text: "state root" },
  final: { x: RX, y: 146, w: 76, text: "finalized", sub: "header" },
  next: { x: RX + 84, y: 146, w: 76, text: "next", sub: "committee" },
  sig: { x: 70, y: 198, w: 220, text: "aggregate signature 검증" },
  fake: { x: LX, y: 146, w: BW, text: "공격자가 준 keys", sub: "출처 확인 안 됨" },
};

const EDGES: readonly { from: Key; to: Key; label?: string }[] = [
  { from: "root", to: "boot" },
  { from: "boot", to: "lstate" },
  { from: "committee", to: "lstate", label: "branch" },
  { from: "checks", to: "attested" },
  { from: "attested", to: "rstate" },
  { from: "final", to: "rstate", label: "branch" },
  { from: "next", to: "rstate" },
  { from: "committee", to: "sig", label: "set-bit keys" },
  { from: "attested", to: "sig" },
  { from: "fake", to: "sig" },
];

function center(key: Key) {
  const box = BOXES[key];
  return { cx: box.x + box.w / 2, top: box.y, bottom: box.y + BH };
}

export default function LightClientTrustViz() {
  return (
    <SceneShell
      eyebrow="Light client의 신뢰 경로"
      title="서명보다 먼저, 위원회가 신뢰한 root에서 왔는지를 고정합니다"
      description="왼쪽은 bootstrap으로 위원회 출처를 고정하는 경로, 오른쪽은 update 검사입니다. 파란 테두리가 지금 검사하는 대상입니다."
      note="검사 순서는 본문이 설명한 사양 순서를 따릅니다. 상자는 개념 단위이며 실제 SSZ 필드 배치를 그린 것은 아닙니다."
      ariaLabel="Trusted root에서 current committee를 증명하고 update의 branch와 서명을 검사하는 순서"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const shown = new Set<Key>(scene.shown);
        const focus = new Set<Key>(scene.focus);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {EDGES.filter((edge) => shown.has(edge.from) && shown.has(edge.to)).map((edge) => {
              const a = center(edge.from);
              const b = center(edge.to);
              const down = a.top < b.top;
              const x1 = a.cx;
              const y1 = down ? a.bottom : a.top;
              const x2 = edge.to === "sig" ? a.cx : b.cx;
              const y2 = down ? b.top : b.bottom;
              const hot = focus.has(edge.from) && focus.has(edge.to);
              const color = edge.from === "fake" ? "#dc2626" : hot ? "#2563eb" : "#94a3b8";
              if (edge.from === "attested" && edge.to === "sig") {
                const box = BOXES.attested;
                const sig = BOXES.sig;
                const right = box.x + box.w;
                return (
                  <polyline
                    key="attested-sig"
                    points={`${right},${box.y + BH / 2} ${right + 6},${box.y + BH / 2} ${right + 6},${sig.y + BH / 2} ${sig.x + sig.w},${sig.y + BH / 2}`}
                    fill="none"
                    stroke={color}
                    strokeWidth={hot ? 1.25 : 1}
                  />
                );
              }
              return (
                <g key={`${edge.from}-${edge.to}`}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={hot ? 1.25 : 1} />
                  {edge.label && (
                    <text x={(x1 + x2) / 2 + 4} y={(y1 + y2) / 2 + 3} fontSize={10.5} fill={color}>
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}
            {(Object.keys(BOXES) as Key[]).filter((key) => shown.has(key)).map((key) => {
              const box = BOXES[key];
              const isFake = key === "fake";
              const hot = focus.has(key);
              const stroke = isFake ? "#dc2626" : hot ? "#2563eb" : "#94a3b8";
              return (
                <g key={key}>
                  <rect x={box.x} y={box.y} width={box.w} height={BH} rx={6} fill="none" stroke={stroke} strokeWidth={hot ? 1.25 : 1} strokeDasharray={isFake ? "4 3" : undefined} />
                  <text x={box.x + box.w / 2} y={box.y + (box.sub ? 13 : 19)} textAnchor="middle" fontSize={12} fontWeight={700} fill={isFake ? "#dc2626" : hot ? "#2563eb" : undefined} className={isFake || hot ? undefined : "fill-foreground"}>
                    {box.text}
                  </text>
                  {box.sub && (
                    <text x={box.x + box.w / 2} y={box.y + 25} textAnchor="middle" fontSize={10.5} fill="#64748b">
                      {box.sub}
                    </text>
                  )}
                </g>
              );
            })}
            {active === 0 && (
              <text x={W / 2 + 10} y={120} textAnchor="middle" fontSize={12} fontWeight={700} fill="#dc2626">
                검증 통과 ≠ 위원회 출처 증명
              </text>
            )}
          </svg>
        );
      }}
    />
  );
}
