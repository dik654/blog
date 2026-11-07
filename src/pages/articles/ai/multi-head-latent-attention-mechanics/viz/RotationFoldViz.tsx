import SceneShell from "./SceneShell";

/**
 * 본문 대응: #decoupled-rope — R(t)W^UK는 t마다 달라 미리 접을 수 없다.
 * 위치 1, 2, 3과 다이얼 각도 30°·60°·90°는 "위치에 비례한 각도"를 보이려는 가정이다.
 */
const SCENES = [
  { label: "회전이 없으면", summary: "W^UK 하나 → 한 번만 접음", note: "W^UK는 학습 뒤 고정된 행렬이라 어느 위치에서나 같습니다. 그래서 미리 한 번 옮겨 곱해 두고 재사용할 수 있습니다. 이 재사용이 뒤에서 볼 weight absorption입니다." },
  { label: "회전을 끼우면", summary: "R(1)W^UK ≠ R(2)W^UK ≠ …", note: "k_t^C에 회전 R(t)를 곱하면 곱해진 행렬이 위치마다 다릅니다. 하나로 접어 재사용할 수 없고 위치마다 다시 곱해야 해서 absorption의 이득이 사라집니다." },
  { label: "회전을 따로 빼면", summary: "W^UK 하나 + 작은 벡터에만 R(t)", note: "위치 항을 latent를 거치지 않는 작은 벡터로 분리해 회전을 거기에만 적용합니다. content 쪽 W^UK는 다시 위치와 무관한 하나의 행렬로 남습니다." },
] as const;

const ROWS = [
  { t: 1, y: 30, deg: 30 },
  { t: 2, y: 84, deg: 60 },
  { t: 3, y: 138, deg: 90 },
] as const;
const ROW_H = 40;

function Dial({ cx, cy, deg, r = 15 }: { cx: number; cy: number; deg: number; r?: number }) {
  const rad = (deg * Math.PI) / 180;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#d97706" strokeWidth={1} />
      <line x1={cx} y1={cy} x2={cx + r * Math.cos(rad)} y2={cy - r * Math.sin(rad)} stroke="#d97706" strokeWidth={1.25} />
    </g>
  );
}

export default function RotationFoldViz() {
  return (
    <SceneShell
      eyebrow="왜 경로를 나누나"
      title="회전 R(t)이 끼면 W^UK를 한 번에 접어 둘 수 없습니다"
      description="R(t)는 위치 t에 비례한 각도의 회전이고, 다이얼 하나가 그 위치의 회전입니다. 위치 1·2·3과 다이얼 각도는 그림을 위한 값입니다(가정). 접기는 고정 행렬을 미리 곱해 두고 재사용하는 것을 뜻합니다."
      ariaLabel="회전이 있을 때와 없을 때 up-projection을 접을 수 있는지 비교"
      scenes={SCENES}
      render={(active) => {
        const shared = active !== 1;
        return (
          <svg viewBox="0 0 360 190" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={10} y={18} fontSize={12} fill="#64748b">위치</text>
            <text x={120} y={18} textAnchor="middle" fontSize={12} fill="#64748b">곱하는 행렬</text>
            <text x={232} y={18} textAnchor="middle" fontSize={12} fill="#64748b">latent</text>
            {active === 2 && <text x={310} y={18} textAnchor="middle" fontSize={12} fill="#64748b">위치 벡터</text>}
            {ROWS.map((row) => (
              <g key={row.t}>
                <text x={18} y={row.y + 25} textAnchor="middle" fontSize={13} fontWeight={700} fill="#475569">{row.t}</text>
                <rect x={205} y={row.y} width={54} height={ROW_H} rx={4} fill="#2563eb" opacity={0.14} stroke="#2563eb" strokeWidth={1} />
                <text x={232} y={row.y + 25} textAnchor="middle" fontSize={12} fill="#2563eb">c_{row.t}^KV</text>
                {!shared && (
                  <>
                    <rect x={40} y={row.y} width={155} height={ROW_H} rx={4} fill="none" stroke="#dc2626" strokeWidth={1} />
                    <Dial cx={62} cy={row.y + 20} deg={row.deg} />
                    <text x={84} y={row.y + 25} fontSize={13} fontWeight={700} fill="#dc2626">R({row.t}) W^UK</text>
                  </>
                )}
                {active === 2 && (
                  <>
                    <Dial cx={288} cy={row.y + 20} deg={row.deg} />
                    <text x={310} y={row.y + 25} fontSize={12} fill="#d97706">k_{row.t}^R</text>
                  </>
                )}
              </g>
            ))}
            {shared && (
              <>
                <rect x={40} y={30} width={155} height={148} rx={4} fill="#2563eb" opacity={0.08} stroke="#2563eb" strokeWidth={1} />
                <text x={118} y={100} textAnchor="middle" fontSize={15} fontWeight={700} fill="#2563eb">W^UK</text>
                <text x={118} y={120} textAnchor="middle" fontSize={12} fill="#2563eb">세 줄이 같은 행렬</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
