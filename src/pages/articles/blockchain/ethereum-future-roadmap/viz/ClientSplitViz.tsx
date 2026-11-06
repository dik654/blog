import ArrowPath from "./ArrowPath";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 구현 간 불일치는 네트워크를 가를 수 있고, 규칙이 합의돼도 도구가
 * 새 형식을 지원하지 않으면 사용자가 결과를 읽지 못한다. 블록 수와 A·B라는 이름은 설명용이다.
 */
const SCENES = [
  { label: "두 클라이언트가 다른 결과를 낼 때", summary: "한쪽만 통과 → 갈라질 수 있음", note: "한 구현에서 거래가 통과해도 다른 클라이언트가 같은 결과를 내지 못하면 네트워크가 갈라질 수 있습니다. 시험 성공 하나로는 이 위험을 지울 수 없습니다." },
  { label: "같은 결과인데 도구가 못 읽을 때", summary: "체인은 하나 · 사용자는 못 읽음", note: "블록 자료를 새 형식으로 만들었어도 지갑·탐색기·인덱서가 그 형식을 지원하지 않으면 사용자는 결과를 읽지 못합니다." },
  { label: "둘 다 갖췄을 때", summary: "규칙의 합의 + 도구 준비", note: "기능 출시에는 규칙의 합의와 도구 준비가 함께 필요합니다. 두 질문 중 하나만 답해서는 서비스의 지원 가능성을 말할 수 없습니다." },
] as const;

const BLOCK_W = 34;
const BLOCK_H = 24;
const ACCENT = "#2563eb";
const RED = "#dc2626";
const MUTED = "#94a3b8";
const TEXT = "#64748b";

function Block({ x, y, color = TEXT, dashed = false }: { x: number; y: number; color?: string; dashed?: boolean }) {
  return <rect x={x} y={y} width={BLOCK_W} height={BLOCK_H} rx={4} fill={color} fillOpacity={0.14} stroke={color} strokeWidth={1} strokeDasharray={dashed ? "3 3" : undefined} />;
}

export default function ClientSplitViz() {
  return (
    <SceneShell
      eyebrow="서로 다른 두 질문"
      title="체인이 하나로 남는지와 사용자가 결과를 읽는지는 따로 확인합니다"
      description="사각형 하나가 블록입니다. 클라이언트는 같은 규칙을 따로 구현한 프로그램이고, A·B와 블록 수는 설명용 가정입니다."
      ariaLabel="클라이언트 불일치와 도구 미지원, 둘 다 갖춘 경우 비교"
      scenes={SCENES}
      render={(active) => {
        const split = active === 0;
        const toolOk = active === 2;
        const toolColor = split ? MUTED : toolOk ? ACCENT : RED;
        return (
          <svg viewBox="0 0 360 150" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Block x={6} y={63} />
            <ArrowPath points={[[40, 75], [49, 75]]} color={MUTED} />
            <Block x={50} y={63} />
            {split ? (
              <>
                <ArrowPath points={[[84, 75], [94, 75], [94, 36], [107, 36]]} color={ACCENT} />
                <Block x={108} y={24} color={ACCENT} />
                <ArrowPath points={[[142, 36], [151, 36]]} color={ACCENT} />
                <Block x={152} y={24} color={ACCENT} />
                <text x={108} y={15} fontSize={11} fontWeight={700} fill={ACCENT}>A: 거래 통과</text>
                <ArrowPath points={[[84, 75], [94, 75], [94, 114], [107, 114]]} color={RED} dashed />
                <Block x={108} y={102} color={RED} dashed />
                <ArrowPath points={[[142, 114], [151, 114]]} color={RED} dashed />
                <Block x={152} y={102} color={RED} dashed />
                <text x={108} y={142} fontSize={11} fontWeight={700} fill={RED}>B: 다른 결과</text>
              </>
            ) : (
              <>
                <ArrowPath points={[[84, 75], [107, 75]]} color={ACCENT} />
                <Block x={108} y={63} color={ACCENT} />
                <ArrowPath points={[[142, 75], [151, 75]]} color={ACCENT} />
                <Block x={152} y={63} color={ACCENT} />
                <text x={108} y={54} fontSize={11} fontWeight={700} fill={ACCENT}>새 형식 블록</text>
                <text x={108} y={106} fontSize={11} fill={TEXT}>A·B 같은 결과</text>
              </>
            )}
            <g opacity={split ? 0.4 : 1}>
              {!split && <ArrowPath points={[[186, 75], [213, 75]]} color={toolColor} dashed={!toolOk} />}
              <rect x={214} y={52} width={68} height={46} rx={8} fill={toolColor} fillOpacity={0.1} stroke={toolColor} strokeWidth={1} strokeDasharray={!split && !toolOk ? "3 3" : undefined} />
              <text x={248} y={72} textAnchor="middle" fontSize={11} fontWeight={700} fill={TEXT}>지갑·탐색기</text>
              <text x={248} y={87} textAnchor="middle" fontSize={11} fontWeight={700} fill={TEXT}>인덱서</text>
              <ArrowPath points={[[282, 75], [299, 75]]} color={toolColor} dashed={!toolOk} />
              <rect x={300} y={52} width={54} height={46} rx={8} fill="#64748b" fillOpacity={0.1} stroke={TEXT} strokeWidth={1} />
              <text x={327} y={79} textAnchor="middle" fontSize={11} fontWeight={700} fill={TEXT}>사용자</text>
            </g>
            {!split && (
              <>
                <text x={248} y={116} textAnchor="middle" fontSize={11} fontWeight={700} fill={toolColor}>{toolOk ? "새 형식 지원" : "새 형식 미지원"}</text>
                <text x={327} y={116} textAnchor="middle" fontSize={11} fontWeight={700} fill={toolColor}>{toolOk ? "읽음" : "못 읽음"}</text>
              </>
            )}
            {split && <text x={268} y={116} textAnchor="middle" fontSize={11} fontWeight={700} fill={RED}>네트워크가 갈라질 수 있음</text>}
          </svg>
        );
      }}
    />
  );
}
