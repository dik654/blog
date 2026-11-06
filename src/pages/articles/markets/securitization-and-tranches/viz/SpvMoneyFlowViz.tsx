import ArrowPath from "./ArrowPath";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — 권리 이전, 증권 판매, 대출 자산 매입은 처음에 일어나고
 * 원리금 수금과 투자자 지급은 그 뒤 오랫동안 이어진다. 금액은 그리지 않는다(화살표는 방향만 뜻함).
 */
const SCENES = [
  { label: "권리를 넘깁니다", summary: "처음: 금융회사 → 별도 기구", note: "대출을 만든 곳이 앞으로 받을 권리를 별도 기구로 넘깁니다." },
  { label: "증권을 팝니다", summary: "처음: 증권 ↔ 매수대금", note: "별도 기구는 그 권리를 바탕으로 지급할 증권을 투자자에게 팝니다. 투자자는 처음에 매수대금을 내고 미래 지급 청구권을 받습니다." },
  { label: "그 돈으로 대출 자산을 삽니다", summary: "처음: 투자자 돈 → 금융회사", note: "별도 기구는 받은 돈으로 대출 자산을 삽니다. 금융회사는 오래 기다리지 않고 지금 쓸 자금을 얻을 수 있습니다." },
  { label: "그 뒤로는 상환금이 흐릅니다", summary: "이후: 대출자 → 창구 → 기구 → 투자자", note: "돈을 빌린 사람들이 원리금을 갚습니다. 수금은 원래 금융회사 등이 계속 맡을 수 있어, 돈을 받는 창구와 그 돈의 최종 소유자가 다를 수 있습니다." },
] as const;

const BOX_X = [4, 96, 188, 280];
const BOX_W = 76;
const BOX_Y = 62;
const BOX_H = 46;
const NAMES = [["돈을", "빌린 사람들"], ["원래", "금융회사"], ["별도", "기구"], ["투자자들"]];
const cx = (i: number) => BOX_X[i] + BOX_W / 2;

const ACCENT = "#2563eb";
const MUTED = "#94a3b8";
const TEXT = "#64748b";

function over(from: number, to: number) {
  const a = cx(from) + 10;
  const b = cx(to) - 10;
  return [[a, BOX_Y], [a, 34], [b, 34], [b, BOX_Y - 1]] as const;
}

function under(from: number, to: number) {
  const a = cx(from) - 10;
  const b = cx(to) + 10;
  return [[a, BOX_Y + BOX_H], [a, 136], [b, 136], [b, BOX_Y + BOX_H + 1]] as const;
}

export default function SpvMoneyFlowViz() {
  return (
    <SceneShell
      eyebrow="돈과 권리의 방향"
      title="처음에 오가는 것과 그 뒤에 오가는 것은 방향이 다릅니다"
      description="상자 사이 선은 방향만 뜻하고 금액은 아닙니다. 별도 기구는 넘겨받은 대출 권리를 따로 보유하는 곳이고, 증권은 그 권리에서 나올 돈을 받을 청구권입니다."
      ariaLabel="대출 권리 이전과 증권 판매, 대출 자산 매입, 이후 상환금 흐름"
      scenes={SCENES}
      render={(active) => {
        const later = active === 3;
        const usedBox = later ? [0, 1, 2, 3] : [1, 2, ...(active >= 1 ? [3] : [])];
        return (
          <svg viewBox="0 0 360 160" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={4} y={12} fontSize={11} fontWeight={700} fill={ACCENT}>{later ? "이후 오랫동안" : "처음에"}</text>
            {BOX_X.map((x, i) => (
              <g key={x} opacity={usedBox.includes(i) ? 1 : 0.35}>
                <rect x={x} y={BOX_Y} width={BOX_W} height={BOX_H} rx={8} fill="#64748b" fillOpacity={0.1} stroke={TEXT} strokeWidth={1} />
                {NAMES[i].map((line, row) => (
                  <text key={line} x={x + BOX_W / 2} y={BOX_Y + BOX_H / 2 + 4 + (row - (NAMES[i].length - 1) / 2) * 14} textAnchor="middle" fontSize={11} fontWeight={700} fill={TEXT}>{line}</text>
                ))}
              </g>
            ))}
            {!later && (
              <>
                <ArrowPath points={over(1, 2)} color={active === 0 ? ACCENT : MUTED} width={active === 0 ? 1.25 : 1} />
                <text x={180} y={28} textAnchor="middle" fontSize={11} fontWeight={active === 0 ? 700 : 400} fill={active === 0 ? ACCENT : TEXT}>받을 권리</text>
              </>
            )}
            {!later && active >= 1 && (
              <>
                <ArrowPath points={over(2, 3)} color={active === 1 ? ACCENT : MUTED} width={active === 1 ? 1.25 : 1} />
                <text x={272} y={28} textAnchor="middle" fontSize={11} fontWeight={active === 1 ? 700 : 400} fill={active === 1 ? ACCENT : TEXT}>증권</text>
                <ArrowPath points={under(3, 2)} color={active === 1 ? ACCENT : MUTED} width={active === 1 ? 1.25 : 1} />
                <text x={272} y={151} textAnchor="middle" fontSize={11} fontWeight={active === 1 ? 700 : 400} fill={active === 1 ? ACCENT : TEXT}>매수대금</text>
              </>
            )}
            {active === 2 && (
              <>
                <ArrowPath points={under(2, 1)} color={ACCENT} width={1.25} />
                <text x={180} y={151} textAnchor="middle" fontSize={11} fontWeight={700} fill={ACCENT}>대출 자산 매입대금</text>
              </>
            )}
            {later && (
              <>
                <ArrowPath points={over(0, 1)} color={ACCENT} width={1.25} />
                <text x={88} y={28} textAnchor="middle" fontSize={11} fontWeight={700} fill={ACCENT}>원리금</text>
                <ArrowPath points={over(1, 2)} color={ACCENT} width={1.25} />
                <text x={180} y={28} textAnchor="middle" fontSize={11} fontWeight={700} fill={ACCENT}>수금한 돈</text>
                <ArrowPath points={over(2, 3)} color={ACCENT} width={1.25} />
                <text x={272} y={28} textAnchor="middle" fontSize={11} fontWeight={700} fill={ACCENT}>순서대로 지급</text>
                <text x={134} y={126} textAnchor="middle" fontSize={11} fill={TEXT}>돈을 받는 창구</text>
                <text x={272} y={126} textAnchor="middle" fontSize={11} fill={TEXT}>최종 소유자는 다를 수 있음</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
