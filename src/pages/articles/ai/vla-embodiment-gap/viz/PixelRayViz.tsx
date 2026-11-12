import SceneShell from "./SceneShell";

/**
 * 본문 대응: #pixel-to-3d 의 식 p_w = T_wc (z K⁻¹ [u,v,1]ᵀ).
 * Camera를 옆에서 본 단면이라 image의 세로 좌표 v 하나만 보입니다. 모든 위치와 오차 크기는 설명용입니다(가정).
 * 여기서 z는 camera z축(광축) 깊이로 그립니다. 글은 z가 ray 거리일 수도 있다며 convention을 고정하라고 적습니다.
 */
const W = 360;
const H = 210;
const C = { x: 34, y: 120 }; // camera 중심
const PLANE_X = 76; // image plane
const SLOPE = -0.25; // 고른 pixel을 지나는 ray의 기울기(가정)
const rayY = (x: number) => C.y + SLOPE * (x - C.x);
const PIXEL = { x: PLANE_X, y: rayY(PLANE_X) };
const Z_X = 280; // 측정한 depth가 가리키는 위치(가정)
const POINT = { x: Z_X, y: rayY(Z_X) };
const DZ = 30; // depth 오차 예(가정)
const BAD_SLOPE = -0.16; // calibration이 틀려 기울어진 ray(가정)
const badY = (x: number) => C.y + BAD_SLOPE * (x - C.x);
const WORLD = { x: 70, y: 192 }; // world·map 원점(가정)
const GHOSTS = [150, 215, 330] as const;

const INK = "#475569";
const MUTED = "#94a3b8";
const ACCENT = "#2563eb";
const OK = "#16a34a";
const WARN = "#dc2626";
const AMBER = "#d97706";

const SCENES = [
  {
    label: "VLM이 고른 pixel 하나",
    summary: "(u, v)",
    note: "VLM은 image plane 위의 한 점을 고릅니다. 옆에서 본 단면이라 세로 좌표 v만 보입니다. 이 점만으로는 물체가 얼마나 멀리 있는지 모릅니다.",
  },
  {
    label: "K⁻¹로 ray를 되살립니다",
    summary: "r_c = K⁻¹[u, v, 1]ᵀ",
    note: "Camera intrinsic K(focal length와 principal point)의 역행렬을 곱하면 camera 중심에서 그 pixel을 지나는 방향이 나옵니다. 이 선 위의 어느 점이든 같은 pixel에 찍힙니다.",
  },
  {
    label: "Depth z로 점 하나를 고릅니다",
    summary: "p_c = z · r_c",
    note: "같은 pixel에서 측정한 depth z를 곱하면 ray 위의 한 점, 즉 camera frame의 3D 위치가 정해집니다. 여기서는 z를 camera 광축 방향 깊이로 그렸습니다.",
  },
  {
    label: "World frame으로 옮깁니다",
    summary: "p_w = T_wc · p_c",
    note: "Planner는 camera가 아니라 world·map frame 좌표를 씁니다. Camera-to-world transform T_wc가 같은 점을 map 원점 기준 좌표로 다시 적습니다. 두 frame의 timestamp도 맞아야 합니다.",
  },
  {
    label: "오차는 3D 점으로 전파됩니다",
    summary: "depth 오차 · calibration 오차",
    note: "Depth가 틀리면 점이 ray를 따라 앞뒤로 밀리고, calibration이 틀리면 ray 자체가 기울어 점이 옆으로 빗나갑니다. Pixel을 정확히 골라도 waypoint가 틀릴 수 있는 이유입니다. 오차 크기는 예입니다(가정).",
  },
] as const;

export default function PixelRayViz() {
  return (
    <SceneShell
      eyebrow="Pixel → 3D point"
      title="Pixel 하나가 3D waypoint가 되기까지 세 번 바뀝니다"
      description="Camera를 옆에서 본 단면입니다. 왼쪽 점이 camera 중심, 세로선이 image plane이며 위치와 크기는 설명용입니다(가정)."
      ariaLabel="pixel을 ray, depth, world frame을 거쳐 3D 점으로 바꾸는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {/* camera 광축 */}
          <line x1={C.x} y1={C.y} x2={W - 12} y2={C.y} stroke={MUTED} strokeWidth={1} strokeDasharray="3 3" />
          <text x={W - 12} y={C.y + 14} textAnchor="end" fontSize={10.5} fill={INK}>
            camera z축
          </text>
          {/* camera */}
          <circle cx={C.x} cy={C.y} r={4} fill={INK} />
          <text x={C.x} y={C.y + 18} textAnchor="middle" fontSize={10.5} fill={INK}>
            camera
          </text>
          {/* image plane */}
          <line x1={PLANE_X} y1={C.y - 46} x2={PLANE_X} y2={C.y + 30} stroke={INK} strokeWidth={1.25} />
          <text x={PLANE_X} y={C.y - 52} textAnchor="middle" fontSize={10.5} fill={INK}>
            image plane
          </text>
          <circle cx={PIXEL.x} cy={PIXEL.y} r={3.5} fill={ACCENT} />
          <text x={PIXEL.x - 6} y={PIXEL.y - 8} textAnchor="end" fontSize={11} fontWeight={700} fill={ACCENT}>
            (u, v)
          </text>

          {active >= 1 && (
            <line x1={C.x} y1={C.y} x2={W - 12} y2={rayY(W - 12)} stroke={ACCENT} strokeWidth={1.25} />
          )}
          {active === 1 &&
            GHOSTS.map((gx) => (
              <g key={gx}>
                <circle cx={gx} cy={rayY(gx)} r={6} fill="none" stroke={ACCENT} strokeWidth={1} strokeDasharray="2 2" />
                <text x={gx} y={rayY(gx) - 10} textAnchor="middle" fontSize={10} fill={ACCENT}>
                  여기?
                </text>
              </g>
            ))}

          {active >= 2 && (
            <>
              <circle cx={POINT.x} cy={POINT.y} r={5} fill={OK} />
              <text x={POINT.x} y={POINT.y - 10} textAnchor="middle" fontSize={11} fontWeight={700} fill={OK}>
                {active === 3 ? "같은 점 p" : "p_c"}
              </text>
            </>
          )}
          {active === 2 && (
            <>
              <line x1={C.x} y1={C.y + 32} x2={POINT.x} y2={C.y + 32} stroke={OK} strokeWidth={1} />
              <line x1={C.x} y1={C.y + 27} x2={C.x} y2={C.y + 37} stroke={OK} strokeWidth={1} />
              <line x1={POINT.x} y1={C.y + 27} x2={POINT.x} y2={C.y + 37} stroke={OK} strokeWidth={1} />
              <line x1={POINT.x} y1={POINT.y} x2={POINT.x} y2={C.y + 27} stroke={OK} strokeWidth={1} strokeDasharray="2 2" />
              <text x={(C.x + POINT.x) / 2} y={C.y + 46} textAnchor="middle" fontSize={11} fontWeight={700} fill={OK}>
                depth z
              </text>
            </>
          )}
          {active === 3 && (
            <>
              <line x1={WORLD.x} y1={WORLD.y} x2={WORLD.x + 40} y2={WORLD.y} stroke={AMBER} strokeWidth={1.25} />
              <line x1={WORLD.x} y1={WORLD.y} x2={WORLD.x} y2={WORLD.y - 40} stroke={AMBER} strokeWidth={1.25} />
              <text x={WORLD.x - 6} y={WORLD.y + 4} textAnchor="end" fontSize={10.5} fontWeight={700} fill={AMBER}>
                map 원점
              </text>
              <line x1={WORLD.x} y1={WORLD.y} x2={POINT.x} y2={POINT.y} stroke={AMBER} strokeWidth={1} strokeDasharray="4 3" />
              <text x={(WORLD.x + POINT.x) / 2 + 26} y={(WORLD.y + POINT.y) / 2 + 22} fontSize={11} fontWeight={700} fill={AMBER}>
                p_w: map 기준 좌표
              </text>
              <line x1={WORLD.x} y1={WORLD.y} x2={C.x} y2={C.y} stroke={INK} strokeWidth={1} strokeDasharray="2 2" />
              <text x={C.x + 2} y={(WORLD.y + C.y) / 2 + 10} fontSize={10.5} fill={INK}>
                T_wc
              </text>
            </>
          )}
          {active === 4 && (
            <>
              {[-DZ, DZ].map((d) => (
                <circle key={d} cx={Z_X + d} cy={rayY(Z_X + d)} r={5} fill="none" stroke={WARN} strokeWidth={1.25} />
              ))}
              <text x={Z_X} y={24} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={WARN}>
                depth 오차: ray 따라 앞뒤
              </text>
              <line x1={C.x} y1={C.y} x2={W - 12} y2={badY(W - 12)} stroke={WARN} strokeWidth={1} strokeDasharray="4 3" />
              <circle cx={Z_X} cy={badY(Z_X)} r={5} fill="none" stroke={WARN} strokeWidth={1.25} strokeDasharray="2 2" />
              <text x={W - 12} y={badY(Z_X) + 30} textAnchor="end" fontSize={10.5} fontWeight={700} fill={WARN}>
                calibration 오차: 옆으로 빗나감
              </text>
            </>
          )}
        </svg>
      )}
    />
  );
}
