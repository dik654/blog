import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — IPCC 틀을 글의 설명대로 간추린 지도(원 그림을 옮긴 것이 아님).
 * 세 요소의 상호작용 → 위험. 대응이 세 요소를 조정한다. 대응에서도 위험이 생길 수 있다.
 */
const SCENES = [
  { label: "세 요소의 상호작용", summary: "사례: 홍수 같음, 손실 10과 60", respond: false, backfire: false, note: "사례의 A와 B는 홍수를 같게 놓고도 노출과 손상 비율 때문에 10과 60이 달라졌습니다. 이 해석이 세 요소가 상호작용한다는 틀에 해당합니다. 사례의 곱셈은 이해를 위한 조건부 회계 예시이고 IPCC가 제시한 보편 피해 함수가 아닙니다." },
  { label: "대응이 세 요소를 조정합니다", summary: "방재 20→10%, 보험 40 지급", respond: true, backfire: false, note: "그림 1.4의 캡션은 세 요소가 대응(responses)에 의해 형성된다고 덧붙이고, 그림 1.5는 대응이 위해·취약성·노출 각각을 조정하는 역할을 새 강조점으로 둡니다. 4절의 방재와 보험 지급이 그런 대응의 예입니다." },
  { label: "대응에서도 위험이 생길 수 있습니다", summary: "줄이기만 하는 장치가 아님", respond: true, backfire: true, note: "IPCC 용어집은 기후 변화에 대한 사람의 대응에서도 위험이 생길 수 있다고 적습니다. 그래서 대응을 위험을 줄이기만 하는 장치로 볼 수 없습니다." },
] as const;

const INK = "#475569";
const MUTED = "#64748b";
const ACCENT = "#2563eb";
const WARN = "#dc2626";

const NODES = [
  { x: 10, name: "위해", ex: "같은 홍수" },
  { x: 124, name: "노출", ex: "자산 100 · 300" },
  { x: 238, name: "취약성", ex: "손상 10% · 20%" },
] as const;
const NODE_W = 100;

export default function RiskFrameViz() {
  return (
    <SceneShell
      eyebrow="IPCC의 틀과 사례"
      title="위험은 세 요소의 곱셈표가 아니라 상호작용입니다"
      description="글의 설명을 간추린 도식이며 IPCC 그림을 그대로 옮긴 것이 아닙니다. 상자 안의 값은 이 글 사례가 단순화한 가정값입니다."
      ariaLabel="위해, 노출, 취약성과 대응, 위험의 관계"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        return (
          <svg viewBox="0 0 348 222" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${s.label}: ${s.summary}`}>
            <rect x={70} y={8} width={208} height={32} rx={8} fill="none" stroke={s.respond ? ACCENT : "#94a3b8"} strokeWidth={s.respond ? 1.25 : 1} strokeDasharray={s.respond ? undefined : "4 3"} />
            <text x={174} y={29} textAnchor="middle" fontSize={12} fontWeight={700} fill={s.respond ? ACCENT : MUTED}>대응 (방재, 보험 등)</text>
            {NODES.map((n) => (
              <g key={n.name}>
                {s.respond && (
                  <g>
                    <line x1={n.x + NODE_W / 2} x2={n.x + NODE_W / 2} y1={40} y2={70} stroke={ACCENT} strokeWidth={1} />
                    <path d={`M${n.x + NODE_W / 2 - 4} 64 L${n.x + NODE_W / 2} 70 L${n.x + NODE_W / 2 + 4} 64`} fill="none" stroke={ACCENT} strokeWidth={1} />
                  </g>
                )}
                <rect x={n.x} y={70} width={NODE_W} height={52} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} />
                <text x={n.x + NODE_W / 2} y={91} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK}>{n.name}</text>
                <text x={n.x + NODE_W / 2} y={110} textAnchor="middle" fontSize={11} fill={MUTED}>{n.ex}</text>
                <line x1={n.x + NODE_W / 2} x2={n.x + NODE_W / 2} y1={122} y2={162} stroke="#94a3b8" strokeWidth={1} />
                <path d={`M${n.x + NODE_W / 2 - 4} 156 L${n.x + NODE_W / 2} 162 L${n.x + NODE_W / 2 + 4} 156`} fill="none" stroke="#94a3b8" strokeWidth={1} />
              </g>
            ))}
            {[110, 224].map((x) => (
              <path key={x} d={`M${x + 1} 96 h12 M${x + 6} 92 l-5 4 5 4 M${x + 8} 92 l5 4 -5 4`} fill="none" stroke={MUTED} strokeWidth={1} />
            ))}
            <rect x={10} y={162} width={328} height={36} rx={8} fill="none" stroke={INK} strokeWidth={1.25} />
            <text x={174} y={185} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK}>위험</text>
            {s.backfire ? (
              <g>
                <path d="M278 24 H344 V180 H338" fill="none" stroke={WARN} strokeWidth={1.25} strokeDasharray="4 3" />
                <path d="M344 176 L338 180 L344 184" fill="none" stroke={WARN} strokeWidth={1.25} />
                <text x={338} y={214} textAnchor="end" fontSize={11} fontWeight={700} fill={WARN}>대응 자체에서 생기는 위험</text>
              </g>
            ) : (
              <text x={174} y={214} textAnchor="middle" fontSize={11} fill={MUTED}>{s.respond ? "방재는 손상 비율을 낮춘 예, 보험은 지급의 예" : "가운데 화살표: 세 요소가 서로 작용"}</text>
            )}
          </svg>
        );
      }}
    />
  );
}
