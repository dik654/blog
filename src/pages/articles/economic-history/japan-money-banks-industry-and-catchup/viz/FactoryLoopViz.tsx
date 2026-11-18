import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 설비 80·기반시설 20 → 생산·판매 → 임금·재료·세금·이자를 내고 남은 이익
 * → 다음 설비(내부자금 커짐). 수출은 외화로 새 기계·원료를 들여올 여지를 만들고,
 * 해외 수요 감소·환율 변화·유가 상승은 대출 상환과 산업 구성을 흔든다.
 * 칸 크기는 금액이 아니다. 판매대금이 얼마로 갈라지는지는 글에 없다.
 */
const ACCENT = "#2563eb";
const GOOD = "#16a34a";
const SHOCK = "#dc2626";
const MUTED = "#94a3b8";

const SCENES = [
  { label: "설비와 기반시설로 생산합니다", summary: "설비 80 + 기반시설 20", note: "3절의 공장입니다. 설비 80은 자기자금 20과 은행대출 60으로 샀고, 기반시설 20은 정부가 깐 전력·항만 가운데 이 공장이 쓰는 몫입니다(설명용 가정)." },
  { label: "판매대금에서 먼저 나가는 돈", summary: "임금·재료·세금·이자", note: "판매대금에서 임금·재료·세금을 내고, 대출 60에 대한 이자도 냅니다. 각각 얼마인지는 글에 없어 칸 크기를 금액으로 그리지 않았습니다." },
  { label: "남은 이익이 다음 설비로", summary: "내부자금이 커집니다", note: "내고 남은 이익을 다음 설비에 넣으면 빌리지 않고 쓰는 내부자금이 커집니다. 화살표가 처음 칸으로 돌아오는 것이 이 되먹임입니다." },
  { label: "수출이 외화를 법니다", summary: "외화 → 새 기계·원료", note: "해외에 판 몫은 외화로 들어옵니다. 그 외화가 새 기계와 원료를 들여올 여지를 만듭니다." },
  { label: "바깥 충격이 고리를 흔듭니다", summary: "1970년대 이후 조정", note: "해외 수요 감소·환율 변화·유가 상승은 대출 상환과 산업 구성을 흔들어 1970년대 이후 조정을 요구했습니다. 고리가 늘 커지기만 하지는 않습니다." },
] as const;

function Box({ x, y, w, title, sub, color, on }: { x: number; y: number; w: number; title: string; sub: string; color: string; on: boolean }) {
  return (
    <g opacity={on ? 1 : 0.4}>
      <rect x={x} y={y} width={w} height={46} rx={8} fill={color} fillOpacity={on ? 0.1 : 0.03} stroke={on ? color : MUTED} strokeWidth={on ? 1.25 : 1} />
      <text x={x + w / 2} y={y + 20} textAnchor="middle" fontSize={13.5} fontWeight={700} fill={on ? color : "currentColor"}>{title}</text>
      <text x={x + w / 2} y={y + 37} textAnchor="middle" fontSize={11.5} fill="currentColor">{sub}</text>
    </g>
  );
}

function Line({ d, color, on, dashed }: { d: string; color: string; on: boolean; dashed?: boolean }) {
  return <path d={d} fill="none" stroke={on ? color : MUTED} strokeOpacity={on ? 1 : 0.5} strokeWidth={on ? 1.25 : 1} strokeDasharray={dashed ? "4 3" : undefined} markerEnd={on ? `url(#fl-head-${color.slice(1)})` : "url(#fl-head-muted)"} />;
}

export default function FactoryLoopViz() {
  return (
    <SceneShell
      eyebrow="공장 100의 한 바퀴"
      title="판매대금이 다음 설비와 수입으로 돌아오는 길"
      description="3절의 공장 100을 이어 씁니다(설명용 가정). 칸과 화살표의 크기는 금액이 아닙니다."
      ariaLabel="설비와 기반시설로 생산한 판매대금이 비용, 이익, 다음 설비, 수출과 외화로 이어지는 고리"
      scenes={SCENES}
      render={(active) => {
        const s = (index: number) => active === index;
        const shock = s(4);
        return (
          <svg viewBox="0 0 360 362" className="mx-auto h-auto w-full max-w-[520px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <defs>
              {[ACCENT, GOOD, SHOCK].map((color) => (
                <marker key={color} id={`fl-head-${color.slice(1)}`} viewBox="0 0 8 8" refX={7} refY={4} markerWidth={7} markerHeight={7} orient="auto">
                  <path d="M0,0 L8,4 L0,8 z" fill={color} />
                </marker>
              ))}
              <marker id="fl-head-muted" viewBox="0 0 8 8" refX={7} refY={4} markerWidth={7} markerHeight={7} orient="auto">
                <path d="M0,0 L8,4 L0,8 z" fill={MUTED} />
              </marker>
            </defs>

            <Box x={16} y={8} w={150} title="기반시설 20" sub="전력·항만, 함께 씀" color={ACCENT} on={s(0)} />
            <Box x={186} y={8} w={150} title="설비 80" sub="자기자금 20 + 대출 60" color={ACCENT} on={s(0) || s(2) || s(3)} />
            <Line d="M91,54 L150,84" color={ACCENT} on={s(0)} />
            <Line d="M261,54 L210,84" color={ACCENT} on={s(0)} />

            <Box x={70} y={86} w={220} title="생산·판매" sub="국내와 해외에 팝니다" color={ACCENT} on={s(0) || s(1) || s(3)} />
            <Line d="M130,132 L96,158" color={ACCENT} on={s(1)} />
            <Line d="M230,132 L266,158" color={GOOD} on={s(1) || s(2)} />

            <Box x={16} y={160} w={160} title="임금·재료·세금·이자" sub="먼저 나감 · 이자는 대출 60" color={ACCENT} on={s(1) || shock} />
            <Box x={196} y={160} w={140} title="남은 이익" sub="내고 남은 몫" color={GOOD} on={s(1) || s(2)} />
            <Line d="M266,206 L266,236" color={GOOD} on={s(2)} />

            <Box x={196} y={238} w={140} title="다음 설비" sub="내부자금이 커짐" color={GOOD} on={s(2) || s(3)} />
            <Line d="M336,261 L348,261 L348,31 L339,31" color={GOOD} on={s(2)} />

            <Line d="M70,109 L8,109 L8,261 L14,261" color={GOOD} on={s(3)} dashed />
            <Box x={16} y={238} w={160} title="수출 → 외화" sub="새 기계·원료를 들여올 여지" color={GOOD} on={s(3) || shock} />
            <Line d="M176,261 L193,261" color={GOOD} on={s(3)} />

            <g opacity={shock ? 1 : 0.4}>
              <rect x={16} y={310} width={320} height={46} rx={8} fill={SHOCK} fillOpacity={shock ? 0.08 : 0.02} stroke={shock ? SHOCK : MUTED} strokeWidth={1} strokeDasharray="4 3" />
              <text x={176} y={330} textAnchor="middle" fontSize={13} fontWeight={700} fill={shock ? SHOCK : "currentColor"}>해외 수요 감소·환율 변화·유가 상승</text>
              <text x={176} y={347} textAnchor="middle" fontSize={11.5} fill="currentColor">대출 상환과 산업 구성이 흔들림</text>
            </g>
            <Line d="M96,310 L96,286" color={SHOCK} on={shock} dashed />
            <Line d="M60,310 L60,296 L4,296 L4,183 L14,183" color={SHOCK} on={shock} dashed />
          </svg>
        );
      }}
    />
  );
}
