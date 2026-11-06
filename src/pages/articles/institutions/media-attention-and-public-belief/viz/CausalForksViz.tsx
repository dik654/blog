import SceneShell from "./SceneShell";

/** 본문 대응: #limits, #mechanism — 함께 오른 조회수와 주가를 설명하는 세 경로. 어느 쪽이 맞는지 정하지 않는다. */
const SCENES = [
  { label: "관측된 순서", summary: "조회수 뒤에 주가 상승", note: "여기까지가 기록된 것입니다. 두 상자 사이에 어떤 연결이 있는지는 이 순서만으로 나오지 않습니다." },
  { label: "경로 하나: 영상이 원인", summary: "노출 → 믿음 → 주문·자금", note: "이 경로라면 노출, 믿음의 변화, 실제 주문과 자금 유입을 각각 관측해야 합니다." },
  { label: "경로 둘: 공통 원인", summary: "발표·정책이 둘 다 움직임", note: "기업 발표나 정책 변화가 둘 다 움직였을 수도 있습니다. 시점의 순서만으로 영상이 원인이라고 단정할 수 없어, 원문과 발표일을 나눠 기록합니다." },
  { label: "순서가 반대로 기록됐다면", summary: "주가 상승 → 글을 더 찾음", note: "앞 장면들과 기록된 순서가 다른 경우입니다. 주가가 오른 뒤 사람들이 글을 더 찾는 반대 방향도 가능합니다. 이때는 먼저 움직인 쪽이 주가입니다." },
] as const;

const Y = 104;
const LEFT = { x: 8, w: 118 };
const RIGHT = { x: 234, w: 118 };
const TOP = { x: 105, y: 12, w: 150 };

function Node({ x, y, w, label, strong }: { x: number; y: number; w: number; label: string; strong?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={36} rx={8} fill="none" stroke={strong ? "#2563eb" : "#64748b"} strokeWidth={1} />
      <text x={x + w / 2} y={y + 23} textAnchor="middle" fontSize={13} fontWeight={700} fill={strong ? "#2563eb" : "#64748b"}>{label}</text>
    </g>
  );
}

export default function CausalForksViz() {
  return (
    <SceneShell
      eyebrow="인과 경로"
      title="조회수와 주가가 함께 올라도 경로는 여러 개입니다"
      description="어느 경로가 맞는지 정하는 그림이 아닙니다. 함께 올랐다는 기록만으로는 경로를 고를 수 없음을 보입니다."
      ariaLabel="조회수와 주가 상승을 설명하는 세 가지 인과 경로"
      scenes={SCENES}
      render={(active) => {
        const flipped = active === 3;
        return (
          <svg viewBox="0 0 360 176" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {active === 2 && (
              <>
                <Node {...TOP} label="기업 발표·정책 변화" strong />
                <line x1={140} x2={74} y1={48} y2={99} stroke="#2563eb" strokeWidth={1} />
                <path d="M68 104 l3 -8 l5 6 z" fill="#2563eb" />
                <line x1={220} x2={286} y1={48} y2={99} stroke="#2563eb" strokeWidth={1} />
                <path d="M292 104 l-3 -8 l-5 6 z" fill="#2563eb" />
              </>
            )}
            <Node x={LEFT.x} y={Y} w={LEFT.w} label={flipped ? "글을 더 찾음" : "영상 조회수 상승"} />
            <Node x={RIGHT.x} y={Y} w={RIGHT.w} label="주가 상승" />
            {active === 0 && <text x={180} y={Y + 24} textAnchor="middle" fontSize={18} fontWeight={700} fill="#64748b">?</text>}
            {active === 1 && (
              <>
                <line x1={126} x2={228} y1={Y + 18} y2={Y + 18} stroke="#2563eb" strokeWidth={1} />
                <path d={`M234 ${Y + 18} l-7 -4 v8 z`} fill="#2563eb" />
                <text x={180} y={Y - 22} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2563eb">노출 → 믿음의 변화</text>
                <text x={180} y={Y - 6} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2563eb">→ 주문·자금 유입</text>
              </>
            )}
            {flipped && (
              <>
                <line x1={132} x2={234} y1={Y + 18} y2={Y + 18} stroke="#d97706" strokeWidth={1} />
                <path d={`M126 ${Y + 18} l7 -4 v8 z`} fill="#d97706" />
              </>
            )}
            <text x={LEFT.x + LEFT.w / 2} y={Y + 58} textAnchor="middle" fontSize={13} fill="#64748b">{flipped ? "나중" : "먼저"}</text>
            <text x={RIGHT.x + RIGHT.w / 2} y={Y + 58} textAnchor="middle" fontSize={13} fill="#64748b">{flipped ? "먼저" : "나중"}</text>
          </svg>
        );
      }}
    />
  );
}
