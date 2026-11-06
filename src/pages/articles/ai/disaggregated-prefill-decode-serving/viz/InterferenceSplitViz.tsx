import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview — 한 장치에 긴 문서가 끼면 기존 답변 조각이 늦어질 수 있고,
 * 나누면 간섭은 줄지만 기록 복사와 빈자리가 생긴다. 길이는 순서만 나타낸 모식도다.
 */
const SCENES = [
  { label: "한 장치가 둘 다 맡을 때", summary: "답변 사이에 문서 읽기가 끼어듦", note: "같은 장치가 긴 새 문서를 읽는 동안 기존 답변의 다음 조각이 늦어질 수 있습니다." },
  { label: "두 장치로 나눌 때", summary: "읽기와 이어 쓰기가 따로", note: "입력을 읽는 장치와 답을 이어 쓰는 장치를 나누면 같은 실행에 일을 끼워 넣는 간섭을 줄일 수 있습니다." },
  { label: "대신 생기는 비용", summary: "기록 전달 대기 · 남는 빈자리", note: "다음 장치는 앞 장치가 읽어 둔 기록을 받아야 합니다. 전달을 기다리는 시간과 한쪽에 남는 빈자리도 비용이므로 나누었다고 언제나 빠르거나 싸지는 것은 아닙니다." },
] as const;

const Y = { a: 34, b: 86, out: 134 };

function Piece({ x, y }: { x: number; y: number }) {
  return <rect x={x} y={y} width={22} height={24} rx={3} fill="#2563eb" />;
}

function Block({ x, y, w, text, color, dashed = false }: { x: number; y: number; w: number; text: string; color: string; dashed?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={24} rx={3} fill={dashed ? "none" : color} stroke={dashed ? color : "none"} strokeWidth={1} strokeDasharray={dashed ? "4 3" : undefined} />
      <text x={x + w / 2} y={y + 16} textAnchor="middle" fontSize={12} fontWeight={600} fill={dashed ? color : "#ffffff"}>{text}</text>
    </g>
  );
}

function Ticks({ xs }: { xs: readonly number[] }) {
  return (
    <>
      {xs.map((x) => <rect key={x} x={x + 8} y={Y.out} width={6} height={14} rx={1} fill="#16a34a" />)}
    </>
  );
}

export default function InterferenceSplitViz() {
  return (
    <SceneShell
      eyebrow="왜 나누는가"
      title="긴 문서가 들어오면 답변 조각이 늦어질 수 있습니다"
      description="파란 칸은 기존 답변의 조각 계산, 맨 아랫줄은 사용자에게 나오는 조각입니다. 길이는 순서만 나타내며 측정값이 아닙니다."
      ariaLabel="한 장치와 두 장치에서 답변 조각과 문서 읽기의 순서 비교"
      scenes={SCENES}
      render={(active) => (
        <svg key={active} viewBox="0 0 360 160" className="mx-auto h-auto w-full max-w-[600px] text-foreground" role="img" aria-label={SCENES[active].label}>
          <text x={4} y={Y.a + 16} fontSize={12} fill="currentColor">{active === 0 ? "장치" : "앞 장치"}</text>
          <text x={4} y={Y.b + 16} fontSize={12} fill={active === 0 ? "#94a3b8" : "currentColor"}>{active === 0 ? "(없음)" : "뒤 장치"}</text>
          <text x={4} y={Y.out + 11} fontSize={12} fill="currentColor">사용자</text>
          <line x1={52} x2={352} y1={Y.a + 28} y2={Y.a + 28} stroke="#94a3b8" strokeOpacity={0.4} strokeWidth={1} />
          <line x1={52} x2={352} y1={Y.b + 28} y2={Y.b + 28} stroke="#94a3b8" strokeOpacity={0.4} strokeWidth={1} />
          <line x1={52} x2={352} y1={Y.out + 16} y2={Y.out + 16} stroke="#94a3b8" strokeOpacity={0.4} strokeWidth={1} />
          {active === 0 && (
            <>
              <Piece x={56} y={Y.a} />
              <Piece x={84} y={Y.a} />
              <Block x={112} y={Y.a} w={200} text="긴 새 문서 읽기" color="#64748b" />
              <Piece x={318} y={Y.a} />
              <Ticks xs={[56, 84, 318]} />
              <path d="M112 141 H312" stroke="#dc2626" strokeWidth={1} strokeDasharray="3 3" fill="none" />
              <text x={212} y={131} textAnchor="middle" fontSize={12} fontWeight={700} fill="#dc2626">다음 조각이 늦어질 수 있음</text>
            </>
          )}
          {active === 1 && (
            <>
              <Block x={112} y={Y.a} w={200} text="긴 새 문서 읽기" color="#64748b" />
              {[56, 112, 168, 224, 280].map((x) => <Piece key={x} x={x} y={Y.b} />)}
              <Ticks xs={[56, 112, 168, 224, 280]} />
            </>
          )}
          {active === 2 && (
            <>
              <Block x={56} y={Y.a} w={170} text="긴 새 문서 읽기" color="#64748b" />
              <Block x={232} y={Y.a} w={116} text="빈자리" color="#64748b" dashed />
              {[56, 112, 168].map((x) => <Piece key={x} x={x} y={Y.b} />)}
              <path d="M226 62 L232 84 m-5 -3 l5 3 l1 -6" fill="none" stroke="#d97706" strokeWidth={1.25} />
              <text x={242} y={78} fontSize={12} fontWeight={700} fill="#d97706">기록 복사</text>
              <Block x={232} y={Y.b} w={70} text="복사 대기" color="#d97706" dashed />
              <Block x={308} y={Y.b} w={40} text="새 답" color="#2563eb" />
              <Ticks xs={[56, 112, 168, 318]} />
            </>
          )}
        </svg>
      )}
    />
  );
}
