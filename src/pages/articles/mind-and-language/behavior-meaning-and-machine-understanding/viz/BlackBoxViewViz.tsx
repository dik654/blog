import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — 입력·처리·출력·내부 상태·환경의 위치와, 시험이 보는 범위.
 */
const SCENES = [
  { label: "다섯 자리", summary: "입력 · 처리 · 출력 · 내부 · 환경", focus: "all", note: "입력은 중국어 질문 문자열, 처리는 모양을 찾아 규칙표의 다음 쪽으로 이동하는 일, 출력은 중국어 답 문자열입니다. 바깥에는 질문자와 실제 중국어 사용 환경이 있습니다." },
  { label: "시험이 잘 재는 곳", summary: "입력과 출력의 관계", focus: "io", note: "시험은 어떤 질문에 어떤 답이 나왔는지의 관계를 잘 잴 수 있습니다. 진하게 표시한 두 화살표가 그 자리입니다." },
  { label: "시험에 안 보일 수 있는 곳", summary: "시험 설계에 따라 다름", focus: "inner", note: "내부 표현이 무엇을 가리키는지, 새 상황에서 스스로 고칠 수 있는지, 답에 대한 경험이 있는지는 시험 설계에 따라 보이지 않을 수 있습니다." },
] as const;

const INK = "#64748b";
const ACCENT = "#2563eb";
const WARN = "#d97706";

export default function BlackBoxViewViz() {
  return (
    <SceneShell
      eyebrow="규칙실의 배치"
      title="시험은 상자 바깥을 지나는 문자열부터 봅니다"
      description="가운데 상자가 규칙실입니다. 위치는 개념의 구분이며 실제 방의 크기나 거리를 뜻하지 않습니다."
      ariaLabel="입력, 처리, 출력, 내부 상태, 환경의 위치와 시험이 보는 범위"
      scenes={SCENES}
      render={(active) => {
        const f = SCENES[active].focus;
        const io = f === "io" ? ACCENT : INK;
        const innerStroke = f === "inner" ? WARN : INK;
        return (
          <svg viewBox="0 0 360 236" className="mx-auto h-auto w-full max-w-[580px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <defs>
              <marker id={`bb-arrow-${active}`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 8 4 0 8z" fill={io} /></marker>
            </defs>
            <rect x={1} y={1} width={358} height={234} rx={10} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
            <text x={12} y={21} fontSize={13} fontWeight={700} fill={INK}>환경: 질문자와 실제 중국어 사용</text>

            <text x={12} y={92} fontSize={13} fontWeight={700} fill={INK}>질문자</text>
            <line x1={58} y1={112} x2={112} y2={112} stroke={io} strokeWidth={f === "io" ? 1.25 : 1} markerEnd={`url(#bb-arrow-${active})`} />
            <text x={12} y={116} fontSize={13} fontWeight={f === "io" ? 700 : 400} fill={io}>입력</text>

            <rect x={114} y={36} width={132} height={186} rx={8} fill={innerStroke} fillOpacity={f === "inner" ? 0.1 : 0.05} stroke={innerStroke} strokeWidth={1} />
            <text x={180} y={56} textAnchor="middle" fontSize={13} fontWeight={700} fill={innerStroke}>처리와 내부 상태</text>
            {["규칙표", "메모", "작업자의 상태"].map((name, index) => (
              <g key={name}>
                <rect x={126} y={66 + index * 34} width={108} height={27} rx={5} fill="none" stroke={innerStroke} strokeWidth={1} />
                <text x={180} y={84 + index * 34} textAnchor="middle" fontSize={13} fill={innerStroke}>{name}</text>
              </g>
            ))}
            <text x={180} y={186} textAnchor="middle" fontSize={12} fontWeight={f === "inner" ? 700 : 400} fill={innerStroke}>{f === "inner" ? "가리키는 대상? 자기 수정?" : "모양을 찾아 다음 쪽으로"}</text>
            <text x={180} y={206} textAnchor="middle" fontSize={12} fontWeight={f === "inner" ? 700 : 400} fill={innerStroke}>{f === "inner" ? "답에 대한 경험?" : "이동합니다"}</text>

            <line x1={246} y1={112} x2={300} y2={112} stroke={io} strokeWidth={f === "io" ? 1.25 : 1} markerEnd={`url(#bb-arrow-${active})`} />
            <text x={304} y={116} fontSize={13} fontWeight={f === "io" ? 700 : 400} fill={io}>출력</text>
            <text x={252} y={92} fontSize={13} fontWeight={700} fill={INK}>질문자·판정자</text>
          </svg>
        );
      }}
    />
  );
}
